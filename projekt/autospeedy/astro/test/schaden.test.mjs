// Tests des Formular-Endpunkts ohne Netz. Kein Supabase mehr (Entscheid 03.11.): nur Prüfen und EINE Mail.
// Der Mail-Adapter ist eine Attrappe: Betrieb über Cloudflare (env.EMAIL.send), Kundschaft über Brevo (fetch).
import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost, onRequestGet } from "../functions/api/schaden.js";
import { pruefe } from "../../gemeinsam/meldung.ts";
import { schreibeFixture, machExifJpeg } from "./fixtures/exif.mjs";

schreibeFixture();

const BASIS = { SCHADEN_AN: "info@autospeedy.ch", MAIL_ABSENDER: "formular@autospeedy.ch", ERLAUBTE_HERKUNFT: "https://vorschau.example" };
const jpg = (n = 1000) => new File([machExifJpeg()], "a.jpg", { type: "image/jpeg", lastModified: 0 });
// echtes JPEG mit der gewünschten Grösse (Magic Bytes bleiben vorne)
function jpgGroesse(n) { const b = new Uint8Array(n); b.set(machExifJpeg().slice(0, Math.min(n, 20))); b[0] = 0xff; b[1] = 0xd8; b[2] = 0xff; return new File([b], "a.jpg", { type: "image/jpeg" }); }

function formular(felder = {}, fotos = [], ausweis = null) {
  const f = new FormData();
  const basis = { art: "Hagel", name: "Test Person", telefon: "071 555 00 00", bemerkung: "", website: "", ...felder };
  for (const [k, v] of Object.entries(basis)) if (v !== undefined && k !== "_stellen") f.append(k, v);
  for (const s of felder._stellen || []) f.append("stelle", s);
  for (const x of fotos) f.append("foto", x);
  if (ausweis) f.append("ausweis", ausweis);
  return f;
}
const anfrage = (body, kopf = {}) => new Request("https://vorschau.example/api/schaden", { method: "POST", headers: { Origin: "https://vorschau.example", ...kopf }, body });

/** Attrappe: Cloudflare-Binding für den Betrieb, fetch für Brevo (Kundschaft). */
function mitMail(fn, { betriebFehler = false, brevoFehler = false } = {}) {
  const betrieb = [];
  const brevo = [];
  const env = {
    ...BASIS,
    EMAIL: { send: async (m) => { if (betriebFehler) throw new Error("x"); betrieb.push(m); } },
    BREVO_SCHLUESSEL: "BREVO",
  };
  const alt = globalThis.fetch;
  globalThis.fetch = async (url, opt = {}) => {
    const u = String(url);
    if (u.includes("api.brevo.com")) { if (brevoFehler) return new Response("x", { status: 500 }); brevo.push(JSON.parse(opt.body)); return new Response("{}", { status: 201 }); }
    return new Response("{}", { status: 200 });
  };
  return fn({ env, betrieb, brevo }).finally(() => { globalThis.fetch = alt; });
}
// Betrieb-Mail über Cloudflare lesbar machen: MIME dekodieren ist mühsam, darum Betrieb-Weg im Test auf Brevo stellen.
const envBrevoBetrieb = { ...BASIS, BREVO_SCHLUESSEL: "BREVO", MAIL_WEG_BETRIEB: "brevo", MAIL_WEG_KUNDE: "brevo" };
function mitBrevo(fn, { fehler = false } = {}) {
  const mails = []; const alt = globalThis.fetch;
  globalThis.fetch = async (url, opt = {}) => {
    const u = String(url);
    if (u.includes("api.brevo.com")) { if (fehler) return new Response("x", { status: 500 }); mails.push(JSON.parse(opt.body)); return new Response("{}", { status: 201 }); }
    return new Response("{}", { status: 200 });
  };
  return fn(mails).finally(() => { globalThis.fetch = alt; });
}

// ---- Prüfung der Eingaben
test("Pflichtfelder (nur Art, Name, Telefon) fehlen: 422 mit Feldnamen, nichts gesendet", () => mitMail(async ({ env, betrieb, brevo }) => {
  const r = await onRequestPost({ request: anfrage(formular({ art: "Bombe", name: "", telefon: "x" })), env });
  assert.equal(r.status, 422); assert.deepEqual((await r.json()).fehler, ["art", "name", "telefon"]);
  assert.equal(betrieb.length + brevo.length, 0);
}));
test("falscher Bildtyp, zu viele oder zu grosse Fotos: 422", () => mitMail(async ({ env }) => {
  const png = new File([new Uint8Array([0x89, 0x50])], "a.png", { type: "image/png" });
  for (const f of [[png], Array.from({ length: 7 }, () => jpg()), [jpgGroesse(2.6e6)]]) assert.equal((await onRequestPost({ request: anfrage(formular({}, f)), env })).status, 422);
}));
test("Honigtopf gefüllt: 200, aber nichts gesendet", () => mitMail(async ({ env, betrieb, brevo }) => {
  assert.equal((await onRequestPost({ request: anfrage(formular({ website: "spam" })), env })).status, 200);
  assert.equal(betrieb.length + brevo.length, 0);
}));
test("fremde oder fehlende Herkunft: 403", () => mitMail(async ({ env, betrieb }) => {
  assert.equal((await onRequestPost({ request: anfrage(formular(), { Origin: "https://fremd.example" }), env })).status, 403);
  const ohne = new Request("https://vorschau.example/api/schaden", { method: "POST", body: formular() });
  assert.equal((await onRequestPost({ request: ohne, env })).status, 403); assert.equal(betrieb.length, 0);
}));
test("kein multipart: 415; zu gross laut Kopf: 413", () => mitMail(async ({ env }) => {
  assert.equal((await onRequestPost({ request: anfrage(JSON.stringify({ art: "Hagel" }), { "Content-Type": "application/json" }), env })).status, 415);
  const r = new Request("https://vorschau.example/api/schaden", { method: "POST", headers: { Origin: "https://vorschau.example", "Content-Type": "multipart/form-data; boundary=x", "Content-Length": "20000000" }, body: "x" });
  assert.equal((await onRequestPost({ request: r, env })).status, 413);
}));
test("Stellen begrenzt, Tesla-Modell nur aus der Liste und nur bei Tesla, >2 Links in Bemerkung: 422", () => {
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "0715550000", stellen: Array(13).fill("Dach") }).fehler, ["stellen"]);
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "0715550000", tesla: "ja", teslaModell: "Roadster" }).fehler, ["tesla_modell"]);
  assert.equal(pruefe({ art: "Hagel", name: "A", telefon: "0715550000", teslaModell: "Model 3" }).daten.teslaModell, "");
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "0715550000", bemerkung: "a.ch b.com c.net" }).fehler, ["bemerkung"]);
});

// ---- Mail an den Betrieb
test("eine Mail mit 2 Fotos als Anhang (foto-1.jpg …) an SCHADEN_AN, Reply-To = Kundenmail", () => mitBrevo(async (mails) => {
  const r = await onRequestPost({ request: anfrage(formular({ tesla: "ja", tesla_modell: "Model Y", email: "kunde@beispiel.ch", _stellen: ["Dach"] }, [jpg(), jpg()])), env: envBrevoBetrieb });
  assert.equal(r.status, 200);
  const betrieb = mails.find((m) => m.to[0].email === "info@autospeedy.ch");
  assert.equal(betrieb.attachment.length, 2);
  assert.deepEqual(betrieb.attachment.map((a) => a.name), ["foto-1.jpg", "foto-2.jpg"]);
  assert.match(betrieb.subject, /Neue Schadenmeldung: Hagel \(Tesla Model Y\)/);
  assert.match(betrieb.textContent, /Test Person/); assert.match(betrieb.textContent, /Dach/);
  assert.equal(betrieb.replyTo.email, "kunde@beispiel.ch");
}));
test("keine Fotos: Reply-To nur bei gültiger Mail (hier keine Mail → kein Reply-To)", () => mitBrevo(async (mails) => {
  await onRequestPost({ request: anfrage(formular()), env: envBrevoBetrieb });
  const betrieb = mails.find((m) => m.to[0].email === "info@autospeedy.ch");
  assert.equal(betrieb.replyTo, undefined); assert.equal(betrieb.attachment, undefined);
}));
test("EXIF/GPS wird aus den Anhängen entfernt", () => mitBrevo(async (mails) => {
  await onRequestPost({ request: anfrage(formular({}, [jpg()])), env: envBrevoBetrieb });
  const betrieb = mails.find((m) => m.to[0].email === "info@autospeedy.ch");
  const bytes = Uint8Array.from(atob(betrieb.attachment[0].content), (c) => c.charCodeAt(0));
  assert.ok(!new TextDecoder("latin1").decode(bytes).includes("GPSLatitude"), "GPS entfernt");
}));
test("Mailversand scheitert: 502 mit Telefonnummer", () => mitBrevo(async (mails) => {
  const r = await onRequestPost({ request: anfrage(formular()), env: envBrevoBetrieb });
  assert.equal(r.status, 502); const b = await r.json(); assert.ok(b.telefon); assert.deepEqual(b.fehler, ["senden"]);
}, { fehler: true }));
test("Bestätigung an die Kundschaft über Brevo, ohne Inhalt der Meldung", () => mitMail(async ({ env, betrieb, brevo }) => {
  const r = await onRequestPost({ request: anfrage(formular({ email: "Kunde@Beispiel.ch", bemerkung: "geheim" })), env });
  assert.equal(r.status, 200);
  assert.equal(betrieb.length, 1); // Betrieb über Cloudflare
  const best = brevo.find((m) => m.to[0].email === "kunde@beispiel.ch");
  assert.ok(best, "Bestätigung an die Kundschaft"); assert.match(best.textContent, /angekommen/); assert.doesNotMatch(best.textContent, /geheim/);
}));
test("Bestätigung scheitert: Meldung trotzdem 200", () => mitMail(async ({ env, betrieb }) => {
  assert.equal((await onRequestPost({ request: anfrage(formular({ email: "kunde@beispiel.ch" })), env })).status, 200);
  assert.equal(betrieb.length, 1);
}, { brevoFehler: true }));

// ---- Ersatzwagen
test("Ersatzwagen gewünscht (mit Tesla) steht im Betreff und in der Mail", () => mitBrevo(async (mails) => {
  await onRequestPost({ request: anfrage(formular({ ersatzwagen: "ja", ersatzwagen_tesla: "ja" })), env: envBrevoBetrieb });
  const betrieb = mails.find((m) => m.to[0].email === "info@autospeedy.ch");
  assert.match(betrieb.subject, /Ersatzwagen/);
  assert.match(betrieb.textContent, /Ersatzwagen gewünscht, Tesla wenn möglich/);
}));
test("Ersatzwagen und Tesla-Wunsch sind optional (ohne sie: 200)", () => mitBrevo(async () => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env: envBrevoBetrieb })).status, 200);
}));

// ---- Felder «zur Hand»
test("Liegt vor / Fehlt in der Mail, Fahrzeugausweis als eigener Anhang", () => mitBrevo(async (mails) => {
  await onRequestPost({ request: anfrage(formular({ kontrollschild: "SG 12345" }, [jpg()], jpg())), env: envBrevoBetrieb });
  const betrieb = mails.find((m) => m.to[0].email === "info@autospeedy.ch");
  assert.match(betrieb.textContent, /Liegt vor: Kontrollschild/);
  assert.match(betrieb.textContent, /Fehlt: Versicherung/);
  assert.ok(betrieb.attachment.some((a) => a.name === "fahrzeugausweis.jpg"));
}));

// ---- Zeitfalle (HMAC)
test("GET ?t=1 liefert ohne FORMULAR_HMAC ein leeres Token, mit Schlüssel ts.hmac", async () => {
  const leer = await (await onRequestGet({ request: new Request("https://x/api/schaden?t=1"), env: {} })).json();
  assert.equal(leer.t, "");
  const mit = await (await onRequestGet({ request: new Request("https://x/api/schaden?t=1"), env: { FORMULAR_HMAC: "K" } })).json();
  assert.match(mit.t, /^\d+\.[0-9a-f]{64}$/);
});
test("Zeitfalle: <4s still 200, >2h → 422, kaputtes Token → 422; ohne Schlüssel egal", () => mitBrevo(async (mails) => {
  const env = { ...envBrevoBetrieb, FORMULAR_HMAC: "K" };
  const token = async (ms) => (await (await onRequestGet({ request: new Request("https://x/api/schaden?t=1"), env })).json()).t.replace(/^\d+/, String(Date.now() - ms));
  // frisch (zu schnell): still 200, nichts gesendet
  const jung = (await (await onRequestGet({ request: new Request("https://x/api/schaden?t=1"), env })).json()).t;
  const r1 = await onRequestPost({ request: anfrage(formular({ t: jung })), env });
  assert.equal(r1.status, 200); assert.equal(mails.length, 0);
  // gültiges Alter (10 min): gesendet
  const gut = await signiere(env.FORMULAR_HMAC, Date.now() - 10 * 60 * 1000);
  assert.equal((await onRequestPost({ request: anfrage(formular({ t: gut })), env })).status, 200);
  assert.equal(mails.length, 1);
  // zu alt (>2h): 422
  const alt = await signiere(env.FORMULAR_HMAC, Date.now() - 3 * 60 * 60 * 1000);
  assert.equal((await onRequestPost({ request: anfrage(formular({ t: alt })), env })).status, 422);
  // kaputtes Token: 422
  assert.equal((await onRequestPost({ request: anfrage(formular({ t: "123.deadbeef" })), env })).status, 422);
}));

// HMAC wie in der Function, zum Bauen alter Tokens im Test
async function signiere(schluessel, ts) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(schluessel), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(ts)));
  return `${ts}.${[...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

// ---- Drossel
test("Drossel-Binding sagt Nein: 429 mit Telefonnummer", () => mitBrevo(async () => {
  const env = { ...envBrevoBetrieb, DROSSEL: { limit: async () => ({ success: false }) } };
  const r = await onRequestPost({ request: anfrage(formular()), env });
  assert.equal(r.status, 429); assert.ok((await r.json()).telefon);
}));
test("Drossel-Binding sagt Ja: 200; kein Binding: übersprungen", () => mitBrevo(async () => {
  const env = { ...envBrevoBetrieb, DROSSEL: { limit: async () => ({ success: true }) } };
  assert.equal((await onRequestPost({ request: anfrage(formular()), env })).status, 200);
}));
