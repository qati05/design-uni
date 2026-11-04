// Admin-Functions (BAUPLAN 4.1): laden, speichern, foto. Keine echten Aufrufe — Access-Zertifikate und GitHub-API
// als fetch-Attrappe, JWT mit selbst erzeugtem RSA-Schlüssel. Prüft 401 ohne Access, Herkunft, zod (422), Konflikt (409),
// Magic Bytes und Slug beim Foto. Der Token steht nie in einer Antwort.
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { _speicherLeeren } from "../../gemeinsam/access.js";
import { onRequestGet as laden } from "../functions/api/admin/laden.js";
import { onRequestPost as speichern } from "../functions/api/admin/speichern.js";
import { onRequestPost as foto, slugVonName } from "../functions/api/admin/foto.js";

const TEAM = "auto-speedy", AUD = "aud-123", KID = "k1", ISS = `https://${TEAM}.cloudflareaccess.com`;
const env = { ACCESS_TEAM: TEAM, ACCESS_AUD: AUD, GITHUB_TOKEN: "geheim", GITHUB_REPO: "autospeedy/website", GITHUB_ZWEIG: "main" };
const site = JSON.parse(fs.readFileSync(new URL("../../astro/src/daten/site.json", import.meta.url), "utf8"));

const b64url = (b) => Buffer.from(b).toString("base64url");
let privat, jwk, echterFetch, githubFn;

async function jwt(payload) {
  const kopf = b64url(JSON.stringify({ alg: "RS256", kid: KID }));
  const nutz = b64url(JSON.stringify({ iss: ISS, aud: AUD, exp: Math.floor(Date.now() / 1000) + 600, email: "chef@autospeedy.ch", ...payload }));
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privat, new TextEncoder().encode(`${kopf}.${nutz}`));
  return `${kopf}.${nutz}.${b64url(new Uint8Array(sig))}`;
}
async function mitJwt(extra) { return { "Cf-Access-Jwt-Assertion": await jwt(extra || {}) }; }
const jreq = (headers, body) => new Request("https://autospeedy.ch/api/admin/x", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

before(async () => {
  const paar = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
  privat = paar.privateKey;
  jwk = await crypto.subtle.exportKey("jwk", paar.publicKey); jwk.kid = KID; jwk.alg = "RS256"; jwk.use = "sig";
  echterFetch = globalThis.fetch;
  globalThis.fetch = async (url, opt) => {
    url = String(url);
    if (url.includes("/cdn-cgi/access/certs")) return { ok: true, status: 200, json: async () => ({ keys: [jwk] }) };
    if (url.includes("api.github.com")) return githubFn(url, opt);
    throw new Error("unerwartet: " + url);
  };
});
after(() => { globalThis.fetch = echterFetch; });
beforeEach(() => { _speicherLeeren(); githubFn = () => ({ ok: true, status: 200, json: async () => ({}) }); });

test("laden ohne Access → 401", async () => {
  const r = await laden({ request: new Request("https://autospeedy.ch/api/admin/laden"), env });
  assert.equal(r.status, 401);
});

test("speichern ohne Access → 401", async () => {
  const r = await speichern({ request: jreq({}, { site, sha: "x" }), env });
  assert.equal(r.status, 401);
});

test("foto ohne Access → 401", async () => {
  const r = await foto({ request: new Request("https://autospeedy.ch/api/admin/foto", { method: "POST", headers: { "Content-Type": "multipart/form-data; boundary=x" } }), env });
  assert.equal(r.status, 401);
});

test("falsches aud → 401 (speichern)", async () => {
  const r = await speichern({ request: jreq(await mitJwt({ aud: "falsch" }), { site, sha: "x" }), env });
  assert.equal(r.status, 401);
});

test("laden mit Access liefert site und sha", async () => {
  githubFn = () => ({ ok: true, status: 200, json: async () => ({ content: Buffer.from(JSON.stringify(site)).toString("base64"), sha: "sha-1" }) });
  const r = await laden({ request: new Request("https://autospeedy.ch/api/admin/laden", { headers: await mitJwt() }), env });
  assert.equal(r.status, 200);
  const j = await r.json();
  assert.equal(j.sha, "sha-1");
  assert.ok(j.site.zeiten);
});

test("speichern: gültige Daten → 200, Commit-Nachricht nennt Bereich und Mail", async () => {
  let body;
  githubFn = (url, opt) => { body = JSON.parse(opt.body); return { ok: true, status: 200, json: async () => ({ content: { sha: "neu" } }) }; };
  const r = await speichern({ request: jreq(await mitJwt(), { site, sha: "alt", bereich: "Hinweise" }), env });
  assert.equal(r.status, 200);
  assert.match(body.message, /Editor: Hinweise geändert durch chef@autospeedy\.ch/);
  assert.ok(!JSON.stringify(await r.json()).includes("geheim"), "kein Token in der Antwort");
});

test("speichern: ungültige Daten → 422", async () => {
  const kaputt = { ...site, bewertungen: { zeigen: "ja" } };
  const r = await speichern({ request: jreq(await mitJwt(), { site: kaputt, sha: "alt" }), env });
  assert.equal(r.status, 422);
});

test("speichern: SHA-Konflikt → 409", async () => {
  githubFn = () => ({ ok: false, status: 409, json: async () => ({}) });
  const r = await speichern({ request: jreq(await mitJwt(), { site, sha: "veraltet", bereich: "Zeiten" }), env });
  assert.equal(r.status, 409);
});

test("speichern: fremde Herkunft → 403", async () => {
  const r = await speichern({ request: jreq({ ...(await mitJwt()), Origin: "https://boese.example" }, { site, sha: "x" }), env: { ...env, ERLAUBTE_HERKUNFT: "https://autospeedy.ch" } });
  assert.equal(r.status, 403);
});

test("slugVonName: Umlaute aufgelöst, nur a–z/0–9/-", () => {
  assert.equal(slugVonName("Anna Meier"), "anna-meier");
  assert.equal(slugVonName("Müller Schärli"), "mueller-schaerli");
  assert.equal(slugVonName("  "), "");
});

async function fotoAnfrage(bytes, name) {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("foto", new Blob([bytes], { type: "image/jpeg" }), "original-geheim.jpg");
  return new Request("https://autospeedy.ch/api/admin/foto", { method: "POST", headers: await mitJwt(), body: fd });
}

test("foto: kein JPEG (falsche Magic Bytes) → 422", async () => {
  const r = await foto({ request: await fotoAnfrage(new Uint8Array([0x00, 0x01, 0x02, 0x03]), "Anna Meier"), env });
  assert.equal(r.status, 422);
});

test("foto: gültiges JPEG wird unter <slug>.jpg abgelegt, nicht unter dem Originalnamen", async () => {
  let pfadGesehen;
  githubFn = (url, opt) => {
    pfadGesehen = decodeURIComponent(url.split("/contents/")[1].split("?")[0]);
    if (opt.method === "PUT") return { ok: true, status: 200, json: async () => ({ content: { sha: "neu" } }) };
    return { ok: false, status: 404, json: async () => ({}) };
  };
  // Minimales JPEG: SOI + APP0-Marke + EOI
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xd9]);
  const r = await foto({ request: await fotoAnfrage(jpeg, "Anna Meier"), env });
  assert.equal(r.status, 200);
  const j = await r.json();
  assert.equal(j.foto, "/bilder/team/anna-meier.jpg");
  assert.equal(pfadGesehen, "public/bilder/team/anna-meier.jpg");
  assert.ok(!pfadGesehen.includes("original-geheim"), "Originalname nie übernommen");
});

test("foto: zu gross (> 400 KB) → 413", async () => {
  const gross = new Uint8Array(400 * 1024 + 10); gross[0] = 0xff; gross[1] = 0xd8; gross[2] = 0xff;
  const r = await foto({ request: await fotoAnfrage(gross, "Anna Meier"), env });
  assert.equal(r.status, 413);
});
