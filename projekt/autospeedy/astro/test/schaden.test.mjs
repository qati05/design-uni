// Tests des Formular-Endpunkts ohne Netz. Kein Supabase mehr (Entscheid 03.11.): nur Prüfen und EINE Mail.
// Der Mail-Adapter ist eine Attrappe: Betrieb über Cloudflare (env.EMAIL.send), Kundschaft über Brevo (fetch).
import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost, onRequestGet } from "../functions/api/schaden.js";
import { pruefe } from "../../gemeinsam/meldung.ts";
import { schreibeFixture, machExifJpeg } from "./fixtures/exif.mjs";
// Rückruf (POST /api/rueckruf) läuft mit, solange package.json die Datei nicht selbst nennt (Schreibbereich B1).

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

/** Attrappe: Cloudflare-Binding für den Betrieb, fetch für Brevo (Kundschaft) und für die Turnstile-Prüfung.
 *  Turnstile: Das Token «gut» besteht, alles andere fällt durch; «turnstile» sammelt die Prüf-Anfragen. */
function mitMail(fn, { betriebFehler = false, brevoFehler = false, env: extra = {}, turnstileKaputt = false } = {}) {
  const betrieb = [];
  const brevo = [];
  const turnstile = [];
  const env = {
    ...BASIS,
    EMAIL: { send: async (m) => { if (betriebFehler) throw new Error("x"); betrieb.push(m); } },
    BREVO_SCHLUESSEL: "BREVO",
    ...extra,
  };
  const alt = globalThis.fetch;
  globalThis.fetch = async (url, opt = {}) => {
    const u = String(url);
    if (u.includes("challenges.cloudflare.com/turnstile/v0/siteverify")) {
      const p = new URLSearchParams(String(opt.body)); turnstile.push(Object.fromEntries(p));
      if (turnstileKaputt) throw new Error("netz");
      return new Response(JSON.stringify({ success: p.get("response") === "gut", hostname: "vorschau.example" }), { status: 200 });
    }
    if (u.includes("api.brevo.com")) { if (brevoFehler) return new Response("x", { status: 500 }); brevo.push(JSON.parse(opt.body)); return new Response("{}", { status: 201 }); }
    return new Response("{}", { status: 200 });
  };
  return fn({ env, betrieb, brevo, turnstile }).finally(() => { globalThis.fetch = alt; });
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
  // Telefon: mindestens 9 Ziffern, Leerzeichen zählen nicht («079 12» hatte die Regel vorher angenommen)
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "079 12" }).fehler, ["telefon"]);
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "079 12 3" }).fehler, ["telefon"]);
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "+41 79 123 45 67" }).fehler, []);
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "071 755 88 61" }).fehler, []);
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
// Prüfung 10.11.2026 (Hinweis von aussen, im Code bestätigt): Die Bestätigung ging an jede eingegebene Adresse und trug den
// Vornamen aus dem Formular; Turnstile wurde nie auf dem Server geprüft. Entscheid Roni 03.11.2026: Bestätigung nur mit Turnstile.
const MIT_TURNSTILE = { TURNSTILE_SECRET: "GEHEIM" };
test("Bestätigung an die Kundschaft: nur nach bestandener Turnstile-Prüfung, ohne Inhalt der Meldung und ohne Namen aus dem Formular", () => mitMail(async ({ env, betrieb, brevo, turnstile }) => {
  const r = await onRequestPost({ request: anfrage(formular({ email: "Kunde@Beispiel.ch", bemerkung: "geheim", name: "https://boese.example Jetzt-kaufen", "cf-turnstile-response": "gut" }), { "CF-Connecting-IP": "203.0.113.7" }), env });
  assert.equal(r.status, 200);
  assert.equal(betrieb.length, 1); // Betrieb über Cloudflare
  assert.equal(turnstile.length, 1, "genau eine Prüfung bei Cloudflare");
  assert.deepEqual(turnstile[0], { secret: "GEHEIM", response: "gut", remoteip: "203.0.113.7" });
  const best = brevo.find((m) => m.to[0].email === "kunde@beispiel.ch");
  assert.ok(best, "Bestätigung an die Kundschaft"); assert.match(best.textContent, /angekommen/); assert.doesNotMatch(best.textContent, /geheim/);
  assert.match(best.textContent, /^Guten Tag\n/, "Anrede ohne Namen");
  assert.doesNotMatch(best.textContent, /boese|Jetzt-kaufen|https?:/, "kein Text aus dem Formular in der Mail an eine frei eingegebene Adresse");
}, { env: MIT_TURNSTILE }));
test("Ohne Turnstile-Schlüssel: Meldung kommt an, aber KEINE Mail an die eingegebene Adresse", () => mitMail(async ({ env, betrieb, brevo, turnstile }) => {
  const r = await onRequestPost({ request: anfrage(formular({ email: "opfer@beispiel.ch" })), env });
  assert.equal(r.status, 200); assert.equal(betrieb.length, 1);
  assert.equal(brevo.length, 0, "keine Bestätigung ohne Server-Prüfung"); assert.equal(turnstile.length, 0, "ohne Schlüssel keine Anfrage an Cloudflare");
}));
test("Turnstile: fehlendes, falsches oder nicht prüfbares Token: 403 turnstile mit Telefonnummer, nichts gesendet", async () => {
  for (const [token, opt] of [[undefined, {}], ["falsch", {}], ["x".repeat(3000), {}], ["gut", { turnstileKaputt: true }]]) {
    await mitMail(async ({ env, betrieb, brevo }) => {
      const r = await onRequestPost({ request: anfrage(formular({ email: "opfer@beispiel.ch", "cf-turnstile-response": token })), env });
      assert.equal(r.status, 403); const b = await r.json(); assert.deepEqual(b.fehler, ["turnstile"]); assert.ok(b.telefon);
      assert.equal(betrieb.length + brevo.length, 0, "nichts gesendet");
    }, { env: MIT_TURNSTILE, ...opt });
  }
});
test("Turnstile: Token von einer fremden Website zählt nicht", () => mitMail(async ({ env, betrieb }) => {
  const r = await onRequestPost({ request: anfrage(formular({ "cf-turnstile-response": "gut" }), { Origin: "https://andere.example" }), env: { ...env, ERLAUBTE_HERKUNFT: "https://andere.example" } });
  assert.equal(r.status, 403); assert.equal(betrieb.length, 0);
}, { env: MIT_TURNSTILE }));
test("Bestätigung scheitert: Meldung trotzdem 200", () => mitMail(async ({ env, betrieb }) => {
  assert.equal((await onRequestPost({ request: anfrage(formular({ email: "kunde@beispiel.ch", "cf-turnstile-response": "gut" })), env })).status, 200);
  assert.equal(betrieb.length, 1);
}, { brevoFehler: true, env: MIT_TURNSTILE }));

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
test("Zeitfalle: <4s → 422 zeit-schnell mit Wartezeit (nichts gesendet), >2h → 422, kaputtes Token → 422; ohne Schlüssel egal", () => mitBrevo(async (mails) => {
  const env = { ...envBrevoBetrieb, FORMULAR_HMAC: "K" };
  const token = async (ms) => (await (await onRequestGet({ request: new Request("https://x/api/schaden?t=1"), env })).json()).t.replace(/^\d+/, String(Date.now() - ms));
  // frisch (zu schnell): 422 mit Wartezeit, nichts gesendet, nie ein falsches ok
  const jung = (await (await onRequestGet({ request: new Request("https://x/api/schaden?t=1"), env })).json()).t;
  const r1 = await onRequestPost({ request: anfrage(formular({ t: jung })), env });
  assert.equal(r1.status, 422); assert.equal(mails.length, 0);
  const j1 = await r1.json();
  assert.deepEqual(j1.fehler, ["zeit-schnell"]); assert.ok(j1.warte > 0 && j1.warte <= 4000);
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
// Prüfung 10.11.2026: Cloudflare Pages kennt das Rate-Limiting-Binding nicht, die Drossel fiel dort still weg. Darum ein Weg über KV.
function kvAttrappe() { const m = new Map(); const ttl = []; return { m, ttl, get: async (k) => m.get(k) ?? null, put: async (k, v, o) => { m.set(k, v); ttl.push(o && o.expirationTtl); } }; }
test("Drossel über KV (Cloudflare Pages): nach 6 Sendungen je Adresse 429, andere Adresse geht weiter, Zähler verfällt", () => mitBrevo(async (mails) => {
  const { DROSSEL_MAX, DROSSEL_FENSTER } = await import("../../gemeinsam/schutz.js");
  const kv = kvAttrappe();
  const env = { ...envBrevoBetrieb, DROSSEL_KV: kv };
  const sende = (ip) => onRequestPost({ request: anfrage(formular(), { "CF-Connecting-IP": ip }), env });
  for (let i = 0; i < DROSSEL_MAX; i++) assert.equal((await sende("203.0.113.7")).status, 200, `Sendung ${i + 1} geht`);
  const r = await sende("203.0.113.7");
  assert.equal(r.status, 429); assert.deepEqual((await r.json()).fehler, ["drossel"]);
  assert.equal(mails.length, DROSSEL_MAX, "die gedrosselte Sendung löst keine Mail aus");
  assert.equal((await sende("203.0.113.8")).status, 200, "andere Adresse ist nicht betroffen");
  assert.ok([...kv.m.keys()].every((k) => !k.includes("203.0.113")), "im Speicher steht nie die IP selbst");
  assert.ok(kv.ttl.every((t) => t === DROSSEL_FENSTER * 2), "Zähler verfällt von selbst");
}));
test("Drossel: KV fällt aus → Meldung geht trotzdem durch (lieber eine Meldung zu viel als eine verlorene)", () => mitBrevo(async () => {
  const env = { ...envBrevoBetrieb, DROSSEL_KV: { get: async () => { throw new Error("kv"); }, put: async () => {} } };
  assert.equal((await onRequestPost({ request: anfrage(formular()), env })).status, 200);
}));

test("Livegang: Ohne Herkunftsprüfung oder Zeitfalle ist der Schutz nicht bereit; in der Vorschau läuft das Formular auch ohne", async () => {
  const { schutzBereit } = await import("../../gemeinsam/schutz.js");
  assert.equal(schutzBereit({}, false), true, "Vorschau: ohne Schlüssel bedienbar");
  assert.equal(schutzBereit({}, true), false, "live ohne beide: gesperrt");
  assert.equal(schutzBereit({ ERLAUBTE_HERKUNFT: "https://www.autospeedy.ch" }, true), false, "live ohne Zeitfalle: gesperrt");
  assert.equal(schutzBereit({ FORMULAR_HMAC: "x" }, true), false, "live ohne Herkunft: gesperrt");
  const beide = { ERLAUBTE_HERKUNFT: "https://www.autospeedy.ch", FORMULAR_HMAC: "x" };
  // Seit 10.11.2026: live braucht zusätzlich eine Bremse gegen Massenversand (Turnstile mit Server-Prüfung oder Drossel).
  assert.equal(schutzBereit(beide, true), false, "live ohne Turnstile und ohne Drossel: gesperrt");
  assert.equal(schutzBereit({ ...beide, TURNSTILE_SECRET: "s" }, true), true, "live mit Turnstile-Prüfung: bereit");
  assert.equal(schutzBereit({ ...beide, DROSSEL_KV: { get: async () => null, put: async () => {} } }, true), true, "live mit Drossel über KV: bereit");
  assert.equal(schutzBereit({ ...beide, DROSSEL: { limit: async () => ({ success: true }) } }, true), true, "live mit Drossel-Binding: bereit");
  assert.equal(schutzBereit({ ...beide, DROSSEL_KV: { get: async () => null, put: async () => {} }, TURNSTILE_SITEKEY: "k" }, true), false, "live: sichtbares Turnstile ohne Server-Prüfung ist gesperrt");
  assert.equal(schutzBereit({ ...beide, TURNSTILE_SITEKEY: "k", TURNSTILE_SECRET: "s" }, true), true);
});
