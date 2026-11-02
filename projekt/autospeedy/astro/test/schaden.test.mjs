// Test des Formular-Backends ohne Netz: node --test test/
import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost, pruefe } from "../functions/api/schaden.js";

const env = { MAIL_ENDPUNKT: "https://mail.example/senden", MAIL_SCHLUESSEL: "TEST", MAIL_AN: "test@example.invalid", ERLAUBTE_HERKUNFT: "https://vorschau.example" };
const gut = { fahrzeug: "Tesla", stellen: ["Motorhaube"], beschreibung: "Delle nach Hagel", name: "Test Person", telefon: "071 555 00 00", website: "" };
const anfrage = (body, kopf = {}) => new Request("https://vorschau.example/api/schaden", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://vorschau.example", ...kopf }, body: typeof body === "string" ? body : JSON.stringify(body) });

function mitMail(status, fn) {
  const alt = globalThis.fetch; const aufrufe = [];
  globalThis.fetch = async (url, opt) => { aufrufe.push({ url, opt }); return new Response("{}", { status }); };
  return fn(aufrufe).finally(() => { globalThis.fetch = alt; });
}

test("gültige Meldung geht an den Mail-Dienst, Antwort 200", () => mitMail(200, async (a) => {
  const r = await onRequestPost({ request: anfrage(gut), env });
  assert.equal(r.status, 200); assert.equal(a.length, 1);
  const body = JSON.parse(a[0].opt.body); assert.match(body.text, /Motorhaube/); assert.equal(body.an, env.MAIL_AN);
}));
test("Pflichtfelder fehlen: 422 mit Feldnamen, keine Mail", () => mitMail(200, async (a) => {
  const r = await onRequestPost({ request: anfrage({ fahrzeug: "Auto" }), env });
  assert.equal(r.status, 422); assert.deepEqual((await r.json()).fehler, ["fahrzeug", "beschreibung", "name", "telefon"]); assert.equal(a.length, 0);
}));
test("Honigtopf gefüllt: 200, aber keine Mail", () => mitMail(200, async (a) => {
  const r = await onRequestPost({ request: anfrage({ ...gut, website: "spam" }), env }); assert.equal(r.status, 200); assert.equal(a.length, 0);
}));
test("fremde Herkunft: 403", () => mitMail(200, async (a) => {
  const r = await onRequestPost({ request: anfrage(gut, { Origin: "https://fremd.example" }), env }); assert.equal(r.status, 403); assert.equal(a.length, 0);
}));
test("kein JSON: 415 und 400", () => mitMail(200, async () => {
  assert.equal((await onRequestPost({ request: anfrage(gut, { "Content-Type": "text/plain" }), env })).status, 415);
  assert.equal((await onRequestPost({ request: anfrage("{kaputt"), env })).status, 400);
}));
test("zu gross: 413", () => mitMail(200, async () => {
  assert.equal((await onRequestPost({ request: anfrage({ ...gut, beschreibung: "x".repeat(12000) }), env })).status, 413);
}));
test("nicht eingerichtet: 503, nie «angekommen»", () => mitMail(200, async (a) => {
  const r = await onRequestPost({ request: anfrage(gut), env: {} }); assert.equal(r.status, 503); assert.equal(a.length, 0);
}));
test("Mail-Dienst fällt aus: 502", () => mitMail(500, async () => {
  assert.equal((await onRequestPost({ request: anfrage(gut), env })).status, 502);
}));
test("Telefon und Stellen werden geprüft", () => {
  assert.deepEqual(pruefe({ ...gut, telefon: "abc" }).fehler, ["telefon"]);
  assert.deepEqual(pruefe({ ...gut, stellen: Array(13).fill("Dach") }).fehler, ["stellen"]);
});
