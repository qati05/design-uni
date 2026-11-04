// site.json: dieselbe Prüfung für Bau, Cockpit und Editor (gemeinsam/site.ts). Und die Einstellungen des Editors.
import { test } from "node:test";
import assert from "node:assert/strict";
import { siteSchema, siteFelder, TEAMFOTO } from "../../gemeinsam/site.ts";
import { editorKonfiguration } from "../bau/editor.mjs";
import site from "../src/daten/site.json" with { type: "json" };

const kopie = () => structuredClone(site);
test("die site.json im Repo ist gültig", () => { assert.equal(siteSchema.safeParse(site).success, true); });
test("unsinnige Zeiten, HTML, fremde Links und data:-Fotos brechen den Bau ab", () => {
  const f = [
    (s) => { s.zeiten[0].fenster[0] = { von: "12.00", bis: "7.30" }; },
    (s) => { s.zeiten[0].fenster[0].von = "25.00"; },
    (s) => { s.hinweis.text = "<script>alert(1)</script>"; },
    (s) => { s.hinweis.link = "https://boese.example"; },
    (s) => { s.team[0].leute[0].foto = "data:image/png;base64,AAAA"; },
    (s) => { s.zeiten = []; },
    (s) => { s.unbekannt = 1; },
  ];
  for (const aendern of f) { const s = kopie(); aendern(s); assert.equal(siteSchema.safeParse(s).success, false, aendern.toString()); }
});
test("Teamfoto: nur Startbild oder Bild-Speicher mit zufälligem Namen", () => {
  assert.ok(TEAMFOTO.test("https://fotos.beispiel.ch/team/0b5f6c1e-1a2b-4c3d-8e9f-001122334455.webp"));
  assert.ok(!TEAMFOTO.test("https://fotos.beispiel.ch/team/anna.webp"));
});
test("Editor: nur gültiges Repo und ein Pfad ohne «..»; Felder wie im Schema", () => {
  assert.throws(() => editorKonfiguration({ repo: "" }));
  assert.throws(() => editorKonfiguration({ repo: "a/b", pfad: "../geheim.json" }));
  const k = editorKonfiguration({ repo: "medaur/auto-speedy" });
  const felder = k.collections[0].files[0].fields.map((f) => f.name);
  assert.deepEqual(felder.filter((n) => n !== "_hinweis").sort(), Object.keys(siteFelder.shape).filter((n) => n !== "_hinweis").sort());
  assert.equal(k.backend.branch, "main");
});
