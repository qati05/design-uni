// Prüft gemeinsam/mail.js: zwei Adapter (cloudflare send_email, brevo) als Attrappe, Wegwahl, 25-MiB-Grenze,
// und dass bei fehlender Konfiguration kein Schlüssel in der Fehlermeldung steht.
import { test } from "node:test";
import assert from "node:assert/strict";
import { sende, base64 } from "../../gemeinsam/mail.js";

// MIME wird base64-kodiert; zum Prüfen die base64-Teile dekodieren.
function dekodiereMime(raw) {
  // Kopf vom Körper trennen (erste Leerzeile), Betreff aus dem encoded-word lesen
  const betreff = (raw.match(/Subject: =\?UTF-8\?B\?([^?]+)\?=/) || raw.match(/Subject: (.*)/))?.[1] || "";
  const betreffKlar = betreff.includes("=") || /[A-Za-z0-9+/]=*$/.test(betreff) ? safeB64(betreff) : betreff;
  return { raw, betreff: betreffKlar };
}
function safeB64(s) { try { return new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0))); } catch { return s; } }

test("cloudflare-Adapter: ruft env.EMAIL.send mit einer MIME-Nachricht an SCHADEN_AN", async () => {
  const gesendet = [];
  const env = { EMAIL: { send: async (m) => gesendet.push(m) }, MAIL_ABSENDER: "formular@autospeedy.ch", MAIL_ABSENDER_NAME: "Auto Speedy" };
  await sende({ an: "info@autospeedy.ch", betreff: "Neue Schadenmeldung: Hagel", text: "Name: Max Müller\nTelefon: 071", anhaenge: [{ name: "foto-1.jpg", inhalt: base64(new Uint8Array([0xff, 0xd8, 0xff])) }] }, env, "cloudflare");
  assert.equal(gesendet.length, 1);
  const { raw } = dekodiereMime(gesendet[0].raw);
  assert.match(raw, /To: info@autospeedy\.ch/);
  assert.match(raw, /From: .*formular@autospeedy\.ch/);
  assert.match(raw, /multipart\/mixed/);
  assert.match(raw, /filename="foto-1\.jpg"/);
  assert.equal(gesendet[0].to, "info@autospeedy.ch");
});

test("cloudflare-Adapter: Reply-To nur, wenn gesetzt", async () => {
  const gesendet = [];
  const env = { EMAIL: { send: async (m) => gesendet.push(m) }, MAIL_ABSENDER: "f@a.ch" };
  await sende({ an: "info@a.ch", betreff: "x", text: "y", antwortAn: "kunde@beispiel.ch" }, env, "cloudflare");
  assert.match(gesendet[0].raw, /Reply-To: kunde@beispiel\.ch/);
  gesendet.length = 0;
  await sende({ an: "info@a.ch", betreff: "x", text: "y" }, env, "cloudflare");
  assert.doesNotMatch(gesendet[0].raw, /Reply-To:/);
});

test("brevo-Adapter: POST an die API mit Schlüssel, Empfänger, Anhang", async () => {
  const alt = globalThis.fetch; const rufe = [];
  globalThis.fetch = async (url, opt) => { rufe.push({ url: String(url), opt }); return new Response("{}", { status: 201 }); };
  try {
    const env = { BREVO_SCHLUESSEL: "GEHEIM", MAIL_ABSENDER: "f@a.ch" };
    await sende({ an: "kunde@beispiel.ch", betreff: "Ihre Meldung", text: "Danke", antwortAn: "info@a.ch" }, env, "brevo");
    const r = rufe.find((x) => x.url.includes("brevo"));
    assert.equal(r.opt.headers["api-key"], "GEHEIM");
    const b = JSON.parse(r.opt.body);
    assert.equal(b.to[0].email, "kunde@beispiel.ch");
    assert.equal(b.replyTo.email, "info@a.ch");
    assert.match(b.subject, /Ihre Meldung/);
  } finally { globalThis.fetch = alt; }
});

test("Wegwahl über MAIL_WEG, wenn kein Weg übergeben", async () => {
  const gesendet = [];
  const env = { MAIL_WEG: "cloudflare", EMAIL: { send: async (m) => gesendet.push(m) }, MAIL_ABSENDER: "f@a.ch" };
  await sende({ an: "x@a.ch", betreff: "x", text: "y" }, env);
  assert.equal(gesendet.length, 1);
});

test("fehlende Konfiguration wirft, ohne Schlüssel im Text", async () => {
  await assert.rejects(() => sende({ an: "x@a.ch", betreff: "x", text: "y" }, { BREVO_SCHLUESSEL: "SUPERSECRET123" }, "cloudflare"),
    (e) => !/SUPERSECRET123/.test(e.message));
  await assert.rejects(() => sende({ an: "x@a.ch", betreff: "x", text: "y" }, {}, "brevo"),
    (e) => e instanceof Error && !/undefined/.test(e.message.replace(/nicht eingerichtet/, "")));
});

test("brevo-Fehler (kein 2xx) wirft ohne Schlüssel im Text", async () => {
  const alt = globalThis.fetch;
  globalThis.fetch = async () => new Response("nope", { status: 500 });
  try {
    await assert.rejects(() => sende({ an: "x@a.ch", betreff: "x", text: "y" }, { BREVO_SCHLUESSEL: "SECRETKEY", MAIL_ABSENDER: "f@a.ch" }, "brevo"),
      (e) => !/SECRETKEY/.test(e.message));
  } finally { globalThis.fetch = alt; }
});

test("25-MiB-Grenze wirft", async () => {
  const gross = "A".repeat(36 * 1024 * 1024); // base64-Anhang, dekodiert > 25 MiB
  await assert.rejects(() => sende({ an: "x@a.ch", betreff: "x", text: "y", anhaenge: [{ name: "f.jpg", inhalt: gross }] }, { MAIL_ABSENDER: "f@a.ch", EMAIL: { send: async () => {} } }, "cloudflare"),
    /zu gross/);
});
