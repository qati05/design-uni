// Test des Formular-Backends (Weg A) ohne Netz: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost, pruefe } from "../functions/api/schaden.js";

const env = { MAIL_ENDPUNKT: "https://mail.example/senden", MAIL_SCHLUESSEL: "TEST", MAIL_AN: "test@example.invalid", ERLAUBTE_HERKUNFT: "https://vorschau.example" };
const jpg = (n = 1000) => new File([new Uint8Array(n).fill(7)], "a.jpg", { type: "image/jpeg" });
function formular(felder = {}, fotos = []) {
  const f = new FormData();
  const basis = { art: "Hagel", name: "Test Person", telefon: "071 555 00 00", bemerkung: "", website: "", ...felder };
  for (const [k, v] of Object.entries(basis)) if (v !== undefined) f.append(k, v);
  for (const s of felder._stellen || []) f.append("stelle", s);
  for (const x of fotos) f.append("foto", x);
  f.delete("_stellen");
  return f;
}
const anfrage = (body, kopf = {}) => new Request("https://vorschau.example/api/schaden", { method: "POST", headers: { Origin: "https://vorschau.example", ...kopf }, body });
function mitMail(status, fn) {
  const alt = globalThis.fetch; const aufrufe = [];
  globalThis.fetch = async (url, opt) => { aufrufe.push({ url, opt }); return new Response("{}", { status }); };
  return fn(aufrufe).finally(() => { globalThis.fetch = alt; });
}

test("gültige Meldung mit 2 Fotos: Mail mit 2 Anhängen, Antwort 200", () => mitMail(200, async (a) => {
  const r = await onRequestPost({ request: anfrage(formular({ tesla: "ja", _stellen: ["Dach"] }, [jpg(), jpg(2000)])), env });
  assert.equal(r.status, 200); assert.equal(a.length, 1);
  const b = JSON.parse(a[0].opt.body);
  assert.equal(b.anhaenge.length, 2); assert.match(b.text, /Hagel/); assert.match(b.text, /Tesla: ja/); assert.match(b.text, /Dach/); assert.match(b.betreff, /Tesla/);
}));
test("ohne Fotos geht es auch", () => mitMail(200, async (a) => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env })).status, 200); assert.equal(JSON.parse(a[0].opt.body).anhaenge.length, 0);
}));
test("Pflichtfelder fehlen: 422 mit Feldnamen, keine Mail", () => mitMail(200, async (a) => {
  const r = await onRequestPost({ request: anfrage(formular({ art: "Bombe", name: "", telefon: "x" })), env });
  assert.equal(r.status, 422); assert.deepEqual((await r.json()).fehler, ["art", "name", "telefon"]); assert.equal(a.length, 0);
}));
test("falscher Bildtyp, zu viele oder zu grosse Fotos: 422", () => mitMail(200, async () => {
  const png = new File([new Uint8Array(10)], "a.png", { type: "image/png" });
  assert.equal((await onRequestPost({ request: anfrage(formular({}, [png])), env })).status, 422);
  assert.equal((await onRequestPost({ request: anfrage(formular({}, Array.from({ length: 7 }, () => jpg()))), env })).status, 422);
  assert.equal((await onRequestPost({ request: anfrage(formular({}, [jpg(2.6e6)])), env })).status, 422);
}));
test("Honigtopf gefüllt: 200, aber keine Mail", () => mitMail(200, async (a) => {
  assert.equal((await onRequestPost({ request: anfrage(formular({ website: "spam" })), env })).status, 200); assert.equal(a.length, 0);
}));
test("fremde Herkunft: 403", () => mitMail(200, async (a) => {
  assert.equal((await onRequestPost({ request: anfrage(formular(), { Origin: "https://fremd.example" }), env })).status, 403); assert.equal(a.length, 0);
}));
test("kein multipart: 415; zu gross laut Kopf: 413", () => mitMail(200, async () => {
  assert.equal((await onRequestPost({ request: anfrage(JSON.stringify({ art: "Hagel" }), { "Content-Type": "application/json" }), env })).status, 415);
  const r = new Request("https://vorschau.example/api/schaden", { method: "POST", headers: { Origin: "https://vorschau.example", "Content-Type": "multipart/form-data; boundary=x", "Content-Length": "20000000" }, body: "x" });
  assert.equal((await onRequestPost({ request: r, env })).status, 413);
}));
test("nicht eingerichtet: 503, nie «angekommen»", () => mitMail(200, async (a) => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env: {} })).status, 503); assert.equal(a.length, 0);
}));
test("Mail-Dienst fällt aus: 502", () => mitMail(500, async () => {
  assert.equal((await onRequestPost({ request: anfrage(formular()), env })).status, 502);
}));
test("Stellen werden begrenzt", () => {
  assert.deepEqual(pruefe({ art: "Hagel", name: "A", telefon: "0715550000", stellen: Array(13).fill("Dach") }).fehler, ["stellen"]);
});
