// Baut die Seite einmal mit der Beispiel-Fixture (BEWERTUNGEN_DATEI, nur Test) in ein eigenes Verzeichnis und prueft:
// Note und Anzahl erscheinen, aber KEINE Bewertungskarten und kein Feld «reviews». Der normale dist/ bleibt unberuehrt.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const wurzel = fileURLToPath(new URL("../", import.meta.url)); // astro-klar/
const astroBin = path.join(wurzel, "node_modules", ".bin", process.platform === "win32" ? "astro.cmd" : "astro");
const ausgabe = path.join(wurzel, "dist-bew");

test("Fixture: Note und Anzahl erscheinen, keine Bewertungskarten, kein reviews-Feld", () => {
  // Die Fixture selbst ist als Beispiel markiert und hat keine Texte/Namen.
  const fix = JSON.parse(fs.readFileSync(path.join(wurzel, "test/fixtures/bewertungen-beispiel.json"), "utf8"));
  assert.ok(!("reviews" in fix), "Fixture ohne reviews");
  assert.ok(!("autor" in fix) && !("text" in fix), "Fixture ohne Autor/Text");

  fs.rmSync(ausgabe, { recursive: true, force: true });
  execFileSync(astroBin, ["build"], { shell: process.platform === "win32",
    cwd: wurzel,
    stdio: "pipe",
    env: { ...process.env, DATEN: "../astro/src/content", BEWERTUNGEN_DATEI: "test/fixtures/bewertungen-beispiel.json", AUSGABE: "dist-bew" },
  });
  const s = fs.readFileSync(path.join(ausgabe, "index.html"), "utf8");
  assert.match(s, /4,7 von 5 · 128 Bewertungen/, "Note und Anzahl aus der Fixture");
  assert.match(s, /bew-kopf--echt/, "Sterne-Bewegung nur mit echten Daten");
  assert.match(s, /Bewertungen von Google/, "Attribution");
  assert.match(s, /Alle Bewertungen auf Google/, "Link auf Google");
  assert.doesNotMatch(s, /class="bew-reihe"|class="bew"[\s>]|Bewertungskarte/, "keine Bewertungskarten");
  assert.ok(!s.includes("X-Goog-Api-Key"), "kein Header-Name in dist");
  fs.rmSync(ausgabe, { recursive: true, force: true });
});
