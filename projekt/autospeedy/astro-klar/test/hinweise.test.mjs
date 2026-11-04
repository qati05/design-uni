// Hinweis-Vorlagen (BAUPLAN 4.2, Schritt 13): Schema, Migration aus dem Altfeld «hinweis», Zeitraum-Filter
// (im Zeitraum, davor, danach), Pop-up-Regeln (höchstens eins, nur hagel/aktion), höchstens 3 Hinweise.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { siteSchema, sichtbareHinweise, heuteZuerich } from "../../gemeinsam/site.ts";

const echt = () => JSON.parse(fs.readFileSync(new URL("../../astro/src/daten/site.json", import.meta.url), "utf8"));
const b = (art, extra = {}) => ({ art, form: "banner", titel: "T", text: "Ein gültiger Hinweistext.", von: "2026-01-01", bis: "2026-12-31", ...extra });

test("hinweise: gültige Liste wird übernommen", () => {
  const r = siteSchema.safeParse({ ...echt(), hinweise: [b("info"), b("ferien")] });
  assert.ok(r.success, r.success ? "" : JSON.stringify(r.error.issues));
  assert.equal(r.data.hinweise.length, 2);
  assert.equal(r.data.hinweise[0].form, "banner");
});

test("Migration: aktives Altfeld «hinweis» wird zu einem info-Banner in «hinweise»", () => {
  const s = { ...echt(), hinweis: { aktiv: true, text: "Hagel? Jetzt melden.", link: "/schaden-melden/?art=hagel" } };
  delete s.hinweise;
  const r = siteSchema.safeParse(s);
  assert.ok(r.success, r.success ? "" : JSON.stringify(r.error.issues));
  assert.equal(r.data.hinweise.length, 1);
  assert.equal(r.data.hinweise[0].art, "info");
  assert.equal(r.data.hinweise[0].text, "Hagel? Jetzt melden.");
  assert.ok(!("hinweis" in r.data), "Altfeld ist nach der Migration weg");
});

test("Migration: inaktives Altfeld ergibt keinen Hinweis (bestehende site.json bleibt leer)", () => {
  const r = siteSchema.safeParse(echt());
  assert.ok(r.success);
  assert.deepEqual(r.data.hinweise, []);
});

test("Zeitraum: sichtbar nur mit von ≤ heute ≤ bis (im Zeitraum, davor, danach)", () => {
  const liste = [b("info", { von: "2026-06-01", bis: "2026-06-30" })];
  assert.equal(sichtbareHinweise(liste, "2026-06-15").length, 1, "im Zeitraum");
  assert.equal(sichtbareHinweise(liste, "2026-05-31").length, 0, "davor");
  assert.equal(sichtbareHinweise(liste, "2026-07-01").length, 0, "danach");
});

test("heuteZuerich liefert ein ISO-Datum", () => {
  assert.match(heuteZuerich(new Date("2026-07-10T10:00:00Z")), /^2026-07-10$/);
});

test("Pop-up nur für hagel und aktion", () => {
  assert.ok(siteSchema.safeParse({ ...echt(), hinweise: [b("hagel", { form: "popup" })] }).success, "hagel-Popup erlaubt");
  assert.ok(siteSchema.safeParse({ ...echt(), hinweise: [b("aktion", { form: "popup" })] }).success, "aktion-Popup erlaubt");
  assert.ok(!siteSchema.safeParse({ ...echt(), hinweise: [b("info", { form: "popup" })] }).success, "info-Popup verboten");
  assert.ok(!siteSchema.safeParse({ ...echt(), hinweise: [b("ferien", { form: "popup" })] }).success, "ferien-Popup verboten");
});

test("höchstens ein Pop-up gleichzeitig", () => {
  const r = siteSchema.safeParse({ ...echt(), hinweise: [b("hagel", { form: "popup" }), b("aktion", { form: "popup" })] });
  assert.ok(!r.success, "zwei Pop-ups müssen scheitern");
});

test("höchstens 3 Hinweise (inkl. migriertem Altfeld)", () => {
  assert.ok(!siteSchema.safeParse({ ...echt(), hinweise: [b("info"), b("info"), b("info"), b("info")] }).success, "4 Hinweise scheitern");
  const mitAlt = { ...echt(), hinweis: { aktiv: true, text: "Altfeld.", link: "/kontakt/" }, hinweise: [b("info"), b("info"), b("info")] };
  assert.ok(!siteSchema.safeParse(mitAlt).success, "3 + migriertes Altfeld = 4 scheitert");
});

test("Text ohne < und >, Längen begrenzt (Titel ≤50, Text ≤160)", () => {
  assert.ok(!siteSchema.safeParse({ ...echt(), hinweise: [b("info", { text: "a < b" })] }).success, "< verboten");
  assert.ok(!siteSchema.safeParse({ ...echt(), hinweise: [b("info", { titel: "x".repeat(51) })] }).success, "Titel > 50");
  assert.ok(!siteSchema.safeParse({ ...echt(), hinweise: [b("info", { text: "x".repeat(161) })] }).success, "Text > 160");
});

test("«bis» darf nicht vor «von» liegen", () => {
  assert.ok(!siteSchema.safeParse({ ...echt(), hinweise: [b("info", { von: "2026-12-31", bis: "2026-01-01" })] }).success);
});
