// Tests von POST /api/rueckruf ohne Netz: Rückruf-Bitte geht direkt als EINE Mail an den Betrieb (kein Cockpit,
// keine Datenbank). Mailweg ist eine Attrappe: Betrieb über env.EMAIL.send (Cloudflare), Kundschaft über fetch (Brevo).
// Jeder andere Netzaufruf lässt den Test scheitern. Läuft in `npm test` über den Import in schaden.test.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost, onRequestGet } from "../functions/api/rueckruf.js";
import { pruefeRueckruf, ZEITEN } from "../../gemeinsam/rueckruf.js";

const HERKUNFT = "https://vorschau.example";
const BASIS = { SCHADEN_AN: "info@autospeedy.ch", MAIL_ABSENDER: "formular@autospeedy.ch", ERLAUBTE_HERKUNFT: HERKUNFT, BREVO_SCHLUESSEL: "BREVO" };

function formular(felder = {}, zeiten = []) {
  const f = new FormData();
  const basis = { anliegen: "Allgemein", name: "Test Person", telefon: "071 555 00 00", bemerkung: "", website: "", ...felder };
  for (const [k, v] of Object.entries(basis)) if (v !== undefined) f.append(k, v);
  for (const z of zeiten) f.append("zeit", z);
  return f;
}
const anfrage = (body, kopf = {}) => new Request(`${HERKUNFT}/api/rueckruf`, { method: "POST", headers: { Origin: HERKUNFT, ...kopf }, body });

/** Attrappe: zählt Mails an den Betrieb (Cloudflare-Binding) und an die Kundschaft (Brevo über fetch). */
function mitMail(fn, { env: extra = {}, betriebFehler = false, brevoFehler = false } = {}) {
  const betrieb = [], brevo = [], fremd = [];
  const env = { ...BASIS, ...extra, EMAIL: { send: async (m) => { if (betriebFehler) throw new Error("x"); betrieb.push(m); } } };
  const alt = globalThis.fetch;
  globalThis.fetch = async (url, opt = {}) => {
    const u = String(url);
    if (u.includes("api.brevo.com")) { if (brevoFehler) return new Response("x", { status: 500 }); brevo.push(JSON.parse(opt.body)); return new Response("{}", { status: 201 }); }
    // Turnstile-Prüfung (nur mit TURNSTILE_SECRET): Das Token «gut» besteht, alles andere fällt durch.
    if (env.TURNSTILE_SECRET && u.includes("challenges.cloudflare.com/turnstile/v0/siteverify")) return new Response(JSON.stringify({ success: new URLSearchParams(String(opt.body)).get("response") === "gut" }), { status: 200 });
    fremd.push(u); return new Response("{}", { status: 599 });
  };
  return fn({ env, betrieb, brevo }).finally(() => { globalThis.fetch = alt; assert.deepEqual(fremd, [], "kein anderer Netzaufruf"); });
}
// Betrieb-Mail im Klartext lesen: MIME aus dem Cloudflare-Weg (base64-Teile) dekodieren
const klartext = (m) => (m.raw.match(/\r\n\r\n([A-Za-z0-9+/=]+)\r\n/g) || []).map((s) => new TextDecoder().decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0)))).join("\n");

// ---- Gültig: genau eine Mail
test("Rückruf gültig: 200 ok und genau 1 Mail an SCHADEN_AN, mit Anliegen, Zeiten und Nachricht, ohne Namen im Betreff", () => mitMail(async ({ env, betrieb, brevo }) => {
  const r = await onRequestPost({ request: anfrage(formular({ anliegen: "Mein Auto verkaufen", bemerkung: "Verkauf eines Tesla", ort: "occasionen" }, ["Dienstag Nachmittag", "Montag Vormittag"])), env });
  assert.equal(r.status, 200); assert.deepEqual(await r.json(), { ok: true });
  assert.equal(betrieb.length, 1); assert.equal(brevo.length, 0, "ohne Mail-Adresse keine Bestätigung");
  assert.equal(betrieb[0].to, "info@autospeedy.ch");
  assert.match(betrieb[0].raw, /^Subject: =\?UTF-8\?B\?/m);
  const betreff = new TextDecoder().decode(Uint8Array.from(atob(betrieb[0].raw.match(/^Subject: =\?UTF-8\?B\?(.*)\?=/m)[1]), (c) => c.charCodeAt(0)));
  assert.equal(betreff, "Neue Rückruf-Bitte: Mein Auto verkaufen");
  const t = klartext(betrieb[0]);
  assert.match(t, /Name: Test Person/); assert.match(t, /Telefon: 071 555 00 00/);
  assert.match(t, /Wann anrufen: Montag Vormittag, Dienstag Nachmittag/, "Zeiten in Raster-Reihenfolge");
  assert.match(t, /Nachricht: Verkauf eines Tesla/); assert.match(t, /Formular: occasionen/);
  assert.doesNotMatch(betrieb[0].raw, /^Reply-To:/m);
}));
test("Empfänger: RUECKRUF_AN geht SCHADEN_AN vor", () => mitMail(async ({ env, betrieb }) => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env })).status, 200);
  assert.equal(betrieb.length, 1); assert.equal(betrieb[0].to, "rueckruf@autospeedy.ch");
}, { env: { RUECKRUF_AN: "rueckruf@autospeedy.ch" } }));
test("Mail-Adresse angegeben und Turnstile bestanden: Betrieb-Mail mit Reply-To, Bestätigung ohne Nachricht und ohne Namen aus dem Formular", () => mitMail(async ({ env, betrieb, brevo }) => {
  const r = await onRequestPost({ request: anfrage(formular({ email: "Kunde@Beispiel.ch", bemerkung: "geheim", name: "https://boese.example Kaufen", "cf-turnstile-response": "gut" })), env });
  assert.equal(r.status, 200);
  assert.equal(betrieb.length, 1); assert.match(betrieb[0].raw, /^Reply-To: kunde@beispiel\.ch/m);
  assert.equal(brevo.length, 1); assert.equal(brevo[0].to[0].email, "kunde@beispiel.ch");
  assert.match(brevo[0].textContent, /Rückruf-Bitte \(Allgemein\) ist bei .* angekommen/); assert.doesNotMatch(brevo[0].textContent, /geheim/);
  assert.match(brevo[0].textContent, /^Guten Tag\n/); assert.doesNotMatch(brevo[0].textContent, /boese|Kaufen|https?:/, "kein Text aus dem Formular");
}, { env: { TURNSTILE_SECRET: "GEHEIM" } }));
test("Ohne Turnstile-Schlüssel: Betrieb bekommt die Bitte mit Reply-To, aber KEINE Mail geht an die eingegebene Adresse", () => mitMail(async ({ env, betrieb, brevo }) => {
  const r = await onRequestPost({ request: anfrage(formular({ email: "opfer@beispiel.ch" })), env });
  assert.equal(r.status, 200); assert.equal(betrieb.length, 1); assert.match(betrieb[0].raw, /^Reply-To: opfer@beispiel\.ch/m);
  assert.equal(brevo.length, 0);
}));
test("Turnstile nicht bestanden: 403 turnstile mit Telefonnummer, nichts gesendet", () => mitMail(async ({ env, betrieb, brevo }) => {
  for (const token of [undefined, "falsch"]) {
    const r = await onRequestPost({ request: anfrage(formular({ email: "opfer@beispiel.ch", "cf-turnstile-response": token })), env });
    assert.equal(r.status, 403); const b = await r.json(); assert.deepEqual(b.fehler, ["turnstile"]); assert.ok(b.telefon);
  }
  assert.equal(betrieb.length + brevo.length, 0);
}, { env: { TURNSTILE_SECRET: "GEHEIM" } }));
test("Bestätigung scheitert: trotzdem 200, Betrieb hat die Mail", () => mitMail(async ({ env, betrieb }) => {
  assert.equal((await onRequestPost({ request: anfrage(formular({ email: "kunde@beispiel.ch", "cf-turnstile-response": "gut" })), env })).status, 200);
  assert.equal(betrieb.length, 1);
}, { brevoFehler: true, env: { TURNSTILE_SECRET: "GEHEIM" } }));
test("Versand an den Betrieb scheitert: 502 mit Telefonnummer, nie ok", () => mitMail(async ({ env }) => {
  const r = await onRequestPost({ request: anfrage(formular()), env });
  assert.equal(r.status, 502); const j = await r.json(); assert.equal(j.ok, false); assert.deepEqual(j.fehler, ["senden"]); assert.ok(j.telefon);
}, { betriebFehler: true }));
test("kein Empfänger eingerichtet: 502, nichts gesendet", () => mitMail(async ({ env, betrieb }) => {
  delete env.SCHADEN_AN;
  assert.equal((await onRequestPost({ request: anfrage(formular()), env })).status, 502); assert.equal(betrieb.length, 0);
}));

// ---- Prüfung
test("Telefon zu kurz (unter 9 Ziffern): 422 telefon, nichts gesendet", () => mitMail(async ({ env, betrieb, brevo }) => {
  for (const tel of ["079 12", "079 123 4", "abc", ""]) {
    const r = await onRequestPost({ request: anfrage(formular({ telefon: tel })), env });
    assert.equal(r.status, 422, tel); assert.deepEqual((await r.json()).fehler, ["telefon"]);
  }
  assert.equal(betrieb.length + brevo.length, 0);
}));
test("Pflicht fehlt oder falsch: Name, Anliegen ausserhalb der Liste, Zeit ausserhalb des Rasters, Links, Mail", () => mitMail(async ({ env, betrieb }) => {
  const fehler = async (f, z) => (await (await onRequestPost({ request: anfrage(formular(f, z)), env })).json()).fehler;
  assert.deepEqual(await fehler({ name: "" }), ["name"]);
  assert.deepEqual(await fehler({ anliegen: "Bombe" }), ["anliegen"]);
  assert.deepEqual(await fehler({ anliegen: "" }), ["anliegen"]);
  assert.deepEqual(await fehler({}, ["Samstag Vormittag"]), ["zeit"]);
  assert.deepEqual(await fehler({ bemerkung: "a.ch b.com c.net" }), ["bemerkung"]);
  assert.deepEqual(await fehler({ bemerkung: "x".repeat(1001) }), ["bemerkung"]);
  assert.deepEqual(await fehler({ email: "keine-mail" }), ["email"]);
  assert.equal(betrieb.length, 0);
}));
test("Regeln: Raster hat 10 Felder, Steuerzeichen raus, doppelte Zeiten einmal", () => {
  assert.equal(ZEITEN.length, 10);
  const { daten, fehler } = pruefeRueckruf({ anliegen: "Allgemein", name: "A\r\nBcc: x@y.ch", telefon: "+41 79 123 45 67", zeiten: ["Freitag Nachmittag", "Freitag Nachmittag"] });
  assert.deepEqual(fehler, []); assert.equal(daten.name, "A Bcc: x@y.ch"); assert.deepEqual(daten.zeiten, ["Freitag Nachmittag"]);
});

// ---- Schutz
test("Honigtopf gefüllt: 200, aber nichts gesendet", () => mitMail(async ({ env, betrieb, brevo }) => {
  const r = await onRequestPost({ request: anfrage(formular({ website: "spam" })), env });
  assert.equal(r.status, 200); assert.equal(betrieb.length + brevo.length, 0);
}));
test("fremde oder fehlende Herkunft: 403, nichts gesendet", () => mitMail(async ({ env, betrieb }) => {
  assert.equal((await onRequestPost({ request: anfrage(formular(), { Origin: "https://fremd.example" }), env })).status, 403);
  const ohne = new Request(`${HERKUNFT}/api/rueckruf`, { method: "POST", body: formular() });
  assert.equal((await onRequestPost({ request: ohne, env })).status, 403);
  assert.equal(betrieb.length, 0);
}));
test("falsches Format: JSON 415, zu gross laut Kopf 413, Datei im Formular 422", () => mitMail(async ({ env, betrieb }) => {
  assert.equal((await onRequestPost({ request: anfrage(JSON.stringify({ name: "x" }), { "Content-Type": "application/json" }), env })).status, 415);
  const gross = new Request(`${HERKUNFT}/api/rueckruf`, { method: "POST", headers: { Origin: HERKUNFT, "Content-Type": "multipart/form-data; boundary=x", "Content-Length": "40000" }, body: "x" });
  assert.equal((await onRequestPost({ request: gross, env })).status, 413);
  const f = formular(); f.append("foto", new File([new Uint8Array([1])], "a.jpg", { type: "image/jpeg" }));
  assert.equal((await onRequestPost({ request: anfrage(f), env })).status, 422);
  assert.equal(betrieb.length, 0);
}));
test("klassisches Formular (urlencoded) geht auch", () => mitMail(async ({ env, betrieb }) => {
  const body = new URLSearchParams({ anliegen: "Allgemein", name: "A", telefon: "0715550000" });
  assert.equal((await onRequestPost({ request: anfrage(body), env })).status, 200); assert.equal(betrieb.length, 1);
}));
test("Drossel sagt Nein: 429 mit Telefonnummer, nichts gesendet", () => mitMail(async ({ env, betrieb }) => {
  const r = await onRequestPost({ request: anfrage(formular()), env });
  assert.equal(r.status, 429); assert.ok((await r.json()).telefon); assert.equal(betrieb.length, 0);
}, { env: { DROSSEL: { limit: async () => ({ success: false }) } } }));

// ---- Zeitfalle (HMAC, gleicher Schlüssel wie /api/schaden)
async function signiere(schluessel, ts) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(schluessel), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(ts)));
  return `${ts}.${[...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}
test("GET /api/rueckruf?t=1: ohne FORMULAR_HMAC leeres Token, mit Schlüssel ts.hmac; ohne ?t=1 404", async () => {
  assert.equal((await (await onRequestGet({ request: new Request("https://x/api/rueckruf?t=1"), env: {} })).json()).t, "");
  assert.match((await (await onRequestGet({ request: new Request("https://x/api/rueckruf?t=1"), env: { FORMULAR_HMAC: "K" } })).json()).t, /^\d+\.[0-9a-f]{64}$/);
  assert.equal((await onRequestGet({ request: new Request("https://x/api/rueckruf"), env: {} })).status, 404);
});
test("Zeitfalle: zu schnell 422 zeit-schnell mit Wartezeit (nichts gesendet, nie ok); ohne Token, kaputt oder >2 h 422 zeit; 10 min alt 200", () => mitMail(async ({ env, betrieb }) => {
  const jung = (await (await onRequestGet({ request: new Request("https://x/api/rueckruf?t=1"), env })).json()).t;
  const r1 = await onRequestPost({ request: anfrage(formular({ t: jung })), env });
  assert.equal(r1.status, 422); const j1 = await r1.json();
  assert.equal(j1.ok, false); assert.deepEqual(j1.fehler, ["zeit-schnell"]); assert.ok(j1.warte > 0 && j1.warte <= 4000);
  assert.equal(betrieb.length, 0);
  for (const t of [undefined, "123.deadbeef", await signiere("K", Date.now() - 3 * 60 * 60 * 1000)]) {
    const r = await onRequestPost({ request: anfrage(formular({ t })), env });
    assert.equal(r.status, 422); assert.deepEqual((await r.json()).fehler, ["zeit"]);
  }
  assert.equal(betrieb.length, 0);
  assert.equal((await onRequestPost({ request: anfrage(formular({ t: await signiere("K", Date.now() - 10 * 60 * 1000) })), env })).status, 200);
  assert.equal(betrieb.length, 1);
}, { env: { FORMULAR_HMAC: "K" } }));
test("Token von /api/schaden gilt auch für /api/rueckruf (ein Schlüssel)", async () => {
  const { onRequestGet: schadenGet } = await import("../functions/api/schaden.js");
  const env = { FORMULAR_HMAC: "K" };
  const t = (await (await schadenGet({ request: new Request("https://x/api/schaden?t=1"), env })).json()).t;
  await mitMail(async ({ env: e }) => {
    const r = await onRequestPost({ request: anfrage(formular({ t })), env: e });
    assert.equal(r.status, 422); assert.deepEqual((await r.json()).fehler, ["zeit-schnell"]); // gültig signiert, nur zu jung
  }, { env });
});
