// Prueft das zod-Schema aus gemeinsam/site.ts, mit dem der Bau src/daten/site.json validiert (BAUPLAN 4.2, Schritt 08).
// Node (>=24) streift Typen beim Import der .ts direkt; zod liegt in gemeinsam/node_modules.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { siteSchema } from "../../gemeinsam/site.ts";

const lies = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), "utf8"));
const echt = () => lies("../../astro/src/daten/site.json");

test("die echte site.json besteht die Pruefung", () => {
  const r = siteSchema.safeParse(echt());
  assert.ok(r.success, r.success ? "" : JSON.stringify(r.error.issues));
});

test("Migration: team-Eintraege ohne Feld bekommen einverstaendnis = false", () => {
  const r = siteSchema.safeParse(echt());
  assert.ok(r.success);
  const leute = r.data.team.flatMap((g) => g.leute);
  assert.ok(leute.length > 0, "Team nicht leer");
  for (const p of leute) assert.equal(p.einverstaendnis, false);
});

test("stimme ist optional und setzt freigegeben auf false als Vorgabe", () => {
  const ohne = echt();
  delete ohne.stimme;
  assert.ok(siteSchema.safeParse(ohne).success, "ohne stimme weiterhin gueltig");

  const mit = { ...echt(), stimme: { text: "Ein ruhiger Satz.", name: "A. Muster", rolle: "Inhaber" } };
  const r = siteSchema.safeParse(mit);
  assert.ok(r.success, r.success ? "" : JSON.stringify(r.error.issues));
  assert.equal(r.data.stimme.freigegeben, false);
});

test("stimme: < und > sind verboten, Laengen werden begrenzt", () => {
  const spitz = { ...echt(), stimme: { text: "a < b > c", name: "", rolle: "", freigegeben: true } };
  assert.ok(!siteSchema.safeParse(spitz).success, "< und > muessen scheitern");

  const zuLang = { ...echt(), stimme: { text: "x".repeat(241), name: "", rolle: "", freigegeben: false } };
  assert.ok(!siteSchema.safeParse(zuLang).success, "Text > 240 muss scheitern");
});

test("bewertungen.zeigen ist optional und Vorgabe true", () => {
  const ohne = echt();
  delete ohne.bewertungen;
  const r1 = siteSchema.safeParse(ohne);
  assert.ok(r1.success, "ohne bewertungen weiterhin gueltig");
  assert.equal(r1.data.bewertungen.zeigen, true, "Vorgabe true");

  const aus = { ...echt(), bewertungen: { zeigen: false } };
  const r2 = siteSchema.safeParse(aus);
  assert.ok(r2.success, r2.success ? "" : JSON.stringify(r2.error.issues));
  assert.equal(r2.data.bewertungen.zeigen, false);

  const fremd = { ...echt(), bewertungen: { zeigen: true, note: 5 } };
  assert.ok(!siteSchema.safeParse(fremd).success, "fremde Felder (z. B. note) muessen scheitern");
});

test("eine ungueltige Test-site.json (test/fixtures) laesst den Bau scheitern", () => {
  const r = siteSchema.safeParse(lies("./fixtures/site-ungueltig.json"));
  assert.ok(!r.success, "muss fehlschlagen");
  assert.ok(r.error.issues.length > 0, "nennt mindestens einen Fehler");
});
