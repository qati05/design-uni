// Tests des Formulars ohne Netz: npm test. Ein Schein-«fetch» spielt Brevo, Supabase und Turnstile.
import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost } from "../functions/api/schaden.js";
import { pruefe } from "../../gemeinsam/meldung.ts";

const MAIL = { BREVO_SCHLUESSEL: "BREVO", MAIL_ABSENDER: "website@beispiel.example", MAIL_BETRIEB: "betrieb@beispiel.example", ERLAUBTE_HERKUNFT: "https://vorschau.example" };
const COCKPIT = { ...MAIL, SUPABASE_URL: "https://sb.example", SUPABASE_SERVICE_KEY: "SERVICE", BETRIEB_ID: "as", COCKPIT_URL: "https://cockpit.example" };
const jpg = (n = 1000) => new File([new Uint8Array(n).fill(7)], "a.jpg", { type: "image/jpeg" });
function formular(felder = {}, fotos = []) {
  const f = new FormData();
  const basis = { art: "Hagel", name: "Test Person", telefon: "071 555 00 00", bemerkung: "", website: "", ...felder };
  for (const [k, v] of Object.entries(basis)) if (v !== undefined && k !== "_stellen") f.append(k, v);
  for (const s of felder._stellen || []) f.append("stelle", s);
  for (const x of fotos) f.append("foto", x);
  return f;
}
const anfrage = (body, kopf = {}) => new Request("https://vorschau.example/api/schaden", { method: "POST", headers: { Origin: "https://vorschau.example", ...kopf }, body });

/** Schein-Netz: antwortet je nach Adresse; «aus» lässt Adressen mit diesem Teil scheitern. */
function netz(fn, { aus = [], betrieb = { aktiv: true, automation_bewertung: false }, frueher = 0, turnstile = true } = {}) {
  const alt = globalThis.fetch; const a = [];
  globalThis.fetch = async (url, opt = {}) => {
    const u = String(url); a.push({ url: u, opt, body: typeof opt.body === "string" && opt.body.startsWith("{") ? JSON.parse(opt.body) : null });
    if (aus.some((x) => u.includes(x))) return new Response("{}", { status: 500 });
    if (u.includes("turnstile")) return Response.json({ success: turnstile });
    if (u.includes("/rest/v1/betrieb?")) return Response.json([betrieb]);
    if (u.endsWith("/rest/v1/meldungen") && opt.method === "POST") return Response.json([{ id: "abc123" }], { status: 201 });
    if (u.includes("/rest/v1/meldungen?") && u.includes("email=eq.")) return Response.json(Array.from({ length: frueher + 1 }, (_, i) => ({ id: "m" + i })));
    return Response.json({});
  };
  return fn(a).finally(() => { globalThis.fetch = alt; });
}
const mails = (a) => a.filter((x) => x.url.includes("api.brevo.com")).map((x) => x.body);

// ---- Prüfung der Eingaben (ein Regelsatz, gemeinsam/meldung.ts)
test("Pflichtfelder fehlen: 422 mit Feldnamen, nichts gesendet", () => netz(async (a) => {
  const r = await onRequestPost({ request: anfrage(formular({ art: "Bombe", name: "", telefon: "x" })), env: MAIL });
  assert.equal(r.status, 422); assert.deepEqual((await r.json()).fehler, ["art", "name", "telefon"]); assert.equal(a.length, 0);
}));
test("falscher Bildtyp, zu viele oder zu grosse Fotos: 422", () => netz(async () => {
  const png = new File([new Uint8Array(10)], "a.png", { type: "image/png" });
  for (const f of [[png], Array.from({ length: 7 }, () => jpg()), [jpg(2.6e6)]]) assert.equal((await onRequestPost({ request: anfrage(formular({}, f)), env: MAIL })).status, 422);
}));
test("Honigtopf gefüllt: 200, aber nichts gesendet", () => netz(async (a) => {
  assert.equal((await onRequestPost({ request: anfrage(formular({ website: "spam" })), env: MAIL })).status, 200); assert.equal(a.length, 0);
}));
test("fremde oder fehlende Herkunft: 403", () => netz(async (a) => {
  assert.equal((await onRequestPost({ request: anfrage(formular(), { Origin: "https://fremd.example" }), env: MAIL })).status, 403);
  const ohne = new Request("https://vorschau.example/api/schaden", { method: "POST", body: formular() });
  assert.equal((await onRequestPost({ request: ohne, env: MAIL })).status, 403); assert.equal(a.length, 0);
}));
test("kein multipart: 415; zu gross laut Kopf: 413", () => netz(async () => {
  assert.equal((await onRequestPost({ request: anfrage(JSON.stringify({ art: "Hagel" }), { "Content-Type": "application/json" }), env: MAIL })).status, 415);
  const r = new Request("https://vorschau.example/api/schaden", { method: "POST", headers: { Origin: "https://vorschau.example", "Content-Type": "multipart/form-data; boundary=x", "Content-Length": "20000000" }, body: "x" });
  assert.equal((await onRequestPost({ request: r, env: MAIL })).status, 413);
}));
test("Stellen begrenzt, Tesla-Modell nur aus der Liste und nur bei Tesla", () => {
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "0715550000", stellen: Array(13).fill("Dach") }).fehler, ["stellen"]);
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "0715550000", tesla: "ja", teslaModell: "Roadster" }).fehler, ["tesla_modell"]);
  assert.equal(pruefe({ art: "Hagel", name: "A", telefon: "0715550000", teslaModell: "Model 3" }).daten.teslaModell, "");
});

// ---- Mail-Weg (ohne Cockpit)
test("Mail-Weg: ganze Meldung mit 2 Fotos als Anhang an den Betrieb, im Brevo-Format", () => netz(async (a) => {
  const r = await onRequestPost({ request: anfrage(formular({ tesla: "ja", tesla_modell: "Model Y", _stellen: ["Dach"] }, [jpg(), jpg(2000)])), env: MAIL });
  assert.equal(r.status, 200);
  const [m] = mails(a), kopf = a.find((x) => x.url.includes("brevo")).opt.headers;
  assert.equal(kopf["api-key"], "BREVO"); assert.equal(m.to[0].email, "betrieb@beispiel.example"); assert.equal(m.attachment.length, 2);
  assert.match(m.subject, /Hagel \(Tesla Model Y\)/); assert.match(m.textContent, /Tesla: ja, Model Y/); assert.match(m.textContent, /Test Person/); assert.match(m.textContent, /Dach/);
}));
test("nichts eingerichtet: 503, nie «angekommen»", () => netz(async (a) => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env: {} })).status, 503); assert.equal(a.length, 0);
}));
test("Mail-Dienst fällt aus: 502", () => netz(async () => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env: MAIL })).status, 502);
}, { aus: ["brevo"] }));

// ---- Cockpit-Weg
test("Cockpit, Betrieb aktiv: Meldung und Fotos gespeichert, Hinweis ohne Name und Telefon", () => netz(async (a) => {
  const r = await onRequestPost({ request: anfrage(formular({ tesla: "ja" }, [jpg(), jpg()])), env: COCKPIT });
  assert.equal(r.status, 200);
  const urls = a.map((x) => x.url);
  assert.ok(urls.includes("https://sb.example/storage/v1/object/schadenfotos/as/abc123/foto-2.jpg"));
  assert.equal(a.find((x) => x.url.endsWith("/rest/v1/meldungen")).body.betrieb_id, "as");
  const [m] = mails(a);
  assert.match(m.textContent, /cockpit\.example\/meldung\/abc123/); assert.doesNotMatch(m.textContent + m.subject, /Test Person|071 555 00 00/); assert.equal(m.attachment, undefined);
}));
test("Cockpit, Betrieb gesperrt: gespeichert UND ganze Meldung per Mail (Team kommt nicht ins Cockpit)", () => netz(async (a) => {
  assert.equal((await onRequestPost({ request: anfrage(formular({}, [jpg()])), env: COCKPIT })).status, 200);
  assert.ok(a.some((x) => x.url.endsWith("/rest/v1/meldungen")));
  const [m] = mails(a); assert.match(m.textContent, /Test Person/); assert.equal(m.attachment.length, 1);
}, { betrieb: { aktiv: false, automation_bewertung: false } }));
test("Rückfall: Foto-Upload scheitert -> halbe Meldung gelöscht, ganze Meldung per Mail, Kunde sieht 200", () => netz(async (a) => {
  const r = await onRequestPost({ request: anfrage(formular({}, [jpg()])), env: COCKPIT });
  assert.equal(r.status, 200);
  assert.ok(a.some((x) => x.url.includes("/rest/v1/meldungen?id=eq.abc123") && x.opt.method === "DELETE"), "halbe Meldung gelöscht");
  const [m] = mails(a); assert.match(m.textContent, /Test Person/); assert.equal(m.attachment.length, 1);
}, { aus: ["/storage/v1/object/schadenfotos/as/"] }));
test("Rückfall: Supabase ganz weg -> Mail; und wenn auch die Mail scheitert: 502", () => netz(async (a) => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env: COCKPIT })).status, 200); assert.equal(mails(a).length, 1);
}, { aus: ["sb.example"] }).then(() => netz(async () => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env: COCKPIT })).status, 502);
}, { aus: ["sb.example", "brevo"] })));
test("Cockpit gespeichert, Hinweis-Mail scheitert: trotzdem 200", () => netz(async () => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env: COCKPIT })).status, 200);
}, { aus: ["brevo"] }));
test("Automation gekauft: Link «Auto fertig» in der Mail, in der Datenbank nur der Hash", () => netz(async (a) => {
  await onRequestPost({ request: anfrage(formular({ email: "kunde@beispiel.ch" })), env: COCKPIT });
  const zeile = a.find((x) => x.url.endsWith("/rest/v1/meldungen")).body;
  const link = mails(a)[0].textContent.match(/cockpit\.example\/auftrag\/([0-9a-f]{64})/);
  assert.ok(link, "Link in der Mail"); assert.match(zeile.erledigt_token_hash, /^[0-9a-f]{64}$/); assert.notEqual(zeile.erledigt_token_hash, link[1]);
}, { betrieb: { aktiv: true, automation_bewertung: true } }));

// ---- Bestätigung an den Kunden, Turnstile
test("Bestätigung an den Kunden: ohne Inhalt der Meldung", () => netz(async (a) => {
  await onRequestPost({ request: anfrage(formular({ email: "Kunde@Beispiel.ch", bemerkung: "geheim" })), env: MAIL });
  const b = mails(a).find((m) => m.to[0].email === "kunde@beispiel.ch");
  assert.match(b.textContent, /angekommen/); assert.doesNotMatch(b.textContent, /geheim/);
}));
test("Grenze: an dieselbe Adresse höchstens 2 Bestätigungen in 24 h", () => netz(async (a) => {
  await onRequestPost({ request: anfrage(formular({ email: "kunde@beispiel.ch" })), env: COCKPIT });
  assert.equal(mails(a).filter((m) => m.to[0].email === "kunde@beispiel.ch").length, 0);
}, { frueher: 2 }));
test("Turnstile: mit Geheimnis Pflicht, falscher oder fehlender Nachweis gibt 403", () => netz(async (a) => {
  const env = { ...MAIL, TURNSTILE_SECRET: "T" };
  assert.equal((await onRequestPost({ request: anfrage(formular()), env })).status, 403);
  assert.equal((await onRequestPost({ request: anfrage(formular({ "cf-turnstile-response": "falsch" })), env })).status, 403);
  assert.equal(mails(a).length, 0);
}, { turnstile: false }).then(() => netz(async () => {
  assert.equal((await onRequestPost({ request: anfrage(formular({ "cf-turnstile-response": "gut" })), env: { ...MAIL, TURNSTILE_SECRET: "T" } })).status, 200);
})));
