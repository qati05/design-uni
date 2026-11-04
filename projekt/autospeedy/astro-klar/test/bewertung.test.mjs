// Bewertungsanfrage (BAUPLAN 4.5): Function /api/admin/bewertung und die Mailtexte. Keine echten Mails,
// kein GitHub: Access-Zertifikate als fetch-Attrappe (selbst erzeugter RSA-Schlüssel), Mailweg «cloudflare» mit
// EMAIL.send-Attrappe. Prüft: genau EINE Mail, 401 ohne Access, 422 bei falscher Adresse, kein Speicher, kein
// Gating-Wort im Text, und dass die Adresse nicht geloggt wird.
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { _speicherLeeren } from "../../gemeinsam/access.js";
import { onRequestPost as bewertung } from "../functions/api/admin/bewertung.js";
import { bewertungsAnfrage, domainAus } from "../../gemeinsam/mailtexte.js";

const TEAM = "auto-speedy", AUD = "aud-123", KID = "k1", ISS = `https://${TEAM}.cloudflareaccess.com`;
const b64url = (b) => Buffer.from(b).toString("base64url");
let privat, jwk, echterFetch, fetchUrls;

function baseEnv(sendSpy) {
  return { ACCESS_TEAM: TEAM, ACCESS_AUD: AUD, MAIL_WEG_KUNDE: "cloudflare", MAIL_ABSENDER: "formular@autospeedy.ch", MAIL_ABSENDER_NAME: "Auto Speedy", EMAIL: { send: sendSpy } };
}
async function jwt(payload) {
  const kopf = b64url(JSON.stringify({ alg: "RS256", kid: KID }));
  const nutz = b64url(JSON.stringify({ iss: ISS, aud: AUD, exp: Math.floor(Date.now() / 1000) + 600, email: "chef@autospeedy.ch", ...payload }));
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privat, new TextEncoder().encode(`${kopf}.${nutz}`));
  return `${kopf}.${nutz}.${b64url(new Uint8Array(sig))}`;
}
async function mitJwt(extra) { return { "Cf-Access-Jwt-Assertion": await jwt(extra || {}) }; }
const req = (headers, body) => new Request("https://autospeedy.ch/api/admin/bewertung", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

before(async () => {
  const paar = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
  privat = paar.privateKey;
  jwk = await crypto.subtle.exportKey("jwk", paar.publicKey); jwk.kid = KID; jwk.alg = "RS256"; jwk.use = "sig";
  echterFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    url = String(url); fetchUrls.push(url);
    if (url.includes("/cdn-cgi/access/certs")) return { ok: true, status: 200, json: async () => ({ keys: [jwk] }) };
    throw new Error("unerwartet (kein GitHub/Fremdaufruf erlaubt): " + url);
  };
});
after(() => { globalThis.fetch = echterFetch; });
beforeEach(() => { _speicherLeeren(); fetchUrls = []; });

test("ohne Access → 401, keine Mail", async () => {
  let n = 0;
  const r = await bewertung({ request: req({}, { mail: "kunde@beispiel.ch" }), env: baseEnv(async () => { n++; }) });
  assert.equal(r.status, 401);
  assert.equal(n, 0);
});

test("gültige Adresse → 200 und genau EINE Mail (kein GitHub-Aufruf = kein Speicher)", async () => {
  const gesendet = [];
  const r = await bewertung({ request: req(await mitJwt(), { mail: "kunde@beispiel.ch", vorname: "Max" }), env: baseEnv(async (m) => gesendet.push(m)) });
  assert.equal(r.status, 200);
  assert.equal(gesendet.length, 1, "genau eine Mail");
  assert.equal(gesendet[0].to, "kunde@beispiel.ch");
  assert.ok(!fetchUrls.some((u) => u.includes("api.github.com")), "kein GitHub-Aufruf (nichts gespeichert)");
});

test("falsche Adresse → 422, keine Mail", async () => {
  for (const mail of ["keine-adresse", "a@b", "", "x@ x.ch"]) {
    const gesendet = [];
    const r = await bewertung({ request: req(await mitJwt(), { mail }), env: baseEnv(async (m) => gesendet.push(m)) });
    assert.equal(r.status, 422, `«${mail}» sollte 422 geben`);
    assert.equal(gesendet.length, 0);
  }
});

test("Drossel (Binding meldet kein Kontingent) → 429, keine Mail", async () => {
  const gesendet = [];
  const env = { ...baseEnv(async (m) => gesendet.push(m)), DROSSEL: { limit: async ({ key }) => { assert.equal(key, "bewertung"); return { success: false }; } } };
  const r = await bewertung({ request: req(await mitJwt(), { mail: "kunde@beispiel.ch" }), env });
  assert.equal(r.status, 429);
  assert.equal(gesendet.length, 0);
});

test("ohne Drossel-Binding wird übersprungen (→ 200)", async () => {
  const gesendet = [];
  const r = await bewertung({ request: req(await mitJwt(), { mail: "kunde@beispiel.ch" }), env: baseEnv(async (m) => gesendet.push(m)) });
  assert.equal(r.status, 200);
  assert.equal(gesendet.length, 1);
});

test("fremde Herkunft → 403", async () => {
  const r = await bewertung({ request: req({ ...(await mitJwt()), Origin: "https://boese.example" }, { mail: "kunde@beispiel.ch" }), env: { ...baseEnv(async () => {}), ERLAUBTE_HERKUNFT: "https://autospeedy.ch" } });
  assert.equal(r.status, 403);
});

test("die Adresse wird nicht geloggt", async () => {
  const log = [];
  const spione = ["log", "warn", "error", "info"].map((m) => { const alt = console[m]; console[m] = (...a) => log.push(a.join(" ")); return () => { console[m] = alt; }; });
  try {
    await bewertung({ request: req(await mitJwt(), { mail: "geheim@beispiel.ch", vorname: "Max" }), env: baseEnv(async () => {}) });
  } finally { spione.forEach((f) => f()); }
  assert.ok(!log.join("\n").includes("geheim@beispiel.ch"), "keine Adresse im Log");
});

// ---- Mailtexte ----
const GATING = [/wie zufrieden/i, /zufrieden waren/i, /gutschein/i, /rabatt/i, /gewinn/i, /verlos/i, /gegenleistung/i, /prämie/i, /praemie/i, /5 sterne/i, /fünf sterne/i, /belohn/i];

test("Mailtext: neutral, mit Link und DSG-Satz, ohne Gating-Wort", () => {
  const { betreff, text, html, link } = bewertungsAnfrage({ vorname: "Max", domain: "autospeedy.ch", betrieb: { name: "Auto Speedy AG", tel: "071 755 88 61" } });
  assert.equal(link, "https://autospeedy.ch/bewerten/?q=mail");
  assert.match(text, /Guten Tag Max/);
  assert.match(text, /nur für diese eine Nachricht verwendet und nicht gespeichert/);
  assert.match(text, /071 755 88 61/);
  assert.match(text, /Auto Speedy AG/);
  for (const g of GATING) { assert.doesNotMatch(text, g, `Gating-Wort im Text: ${g}`); assert.doesNotMatch(html, g, `Gating-Wort im HTML: ${g}`); assert.doesNotMatch(betreff, g); }
});

test("Mailtext: ohne Vorname nur «Guten Tag»", () => {
  const { text } = bewertungsAnfrage({ domain: "autospeedy.ch", betrieb: { name: "Auto Speedy AG", tel: "071 755 88 61" } });
  assert.match(text, /^Guten Tag\n/);
});

test("domainAus: bau.adresse vor betrieb.mail, Fallback autospeedy.ch", () => {
  assert.equal(domainAus({ mail: "info@autospeedy.ch" }, { adresse: "https://beispiel.ch" }), "beispiel.ch");
  assert.equal(domainAus({ mail: "info@autospeedy.ch" }, { adresse: "" }), "autospeedy.ch");
  assert.equal(domainAus({}, {}), "autospeedy.ch");
});
