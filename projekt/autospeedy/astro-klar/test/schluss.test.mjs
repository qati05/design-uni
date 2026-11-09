// Fuss (Korrektur Footer): der eine letzte Block (Abschluss ist darin aufgegangen). Prueft den fertigen Bau (dist/,
// nach npm run build) und baut fuer die Ausnahme-Pruefung einmal mit einer Fixture-site.json ueber SITE_JSON (nur im Test).
// Die Status-Berechnung im Browser prueft browser.test.mjs; die Handyleiste am Fuss ebenfalls.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const wurzel = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(wurzel, "dist");
const lies = (p) => fs.readFileSync(p, "utf8");
const sitePfad = path.join(wurzel, "../astro/src/daten/site.json");
const pad = (z) => z.replace(".", ":").padStart(5, "0");
const fussVon = (html) => html.match(/<footer class="fuss"[\s\S]*?<\/footer>/)[0];
// JSON aus dem data-fuss-Attribut (HTML-entschärfte Anführungszeichen zurück). Kein Skript-Tag (CSP).
const fussDaten = (html) => JSON.parse(html.match(/<footer class="fuss" data-fuss="([\s\S]*?)">/)[1].replace(/&#34;|&quot;/g, '"').replace(/&amp;/g, "&"));

test("Startseite JSON-LD: openingHoursSpecification entspricht site.zeiten", () => {
  const html = lies(path.join(dist, "index.html"));
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  // Nachtrag: JSON-LD ist jetzt ein @graph; die Öffnungszeiten stehen am Betriebs-Knoten (AutoBodyShop/AutoRepair).
  const betrieb = ld["@graph"].find((x) => /AutoBody|AutoRepair/.test(x["@type"]));
  const site = JSON.parse(lies(sitePfad));
  const erwartet = site.zeiten.filter((z) => !z.geschlossen).flatMap((z) =>
    z.fenster.map((f) => ({ dayOfWeek: z.wochentage.length === 1 ? z.wochentage[0] : z.wochentage, opens: pad(f.von), closes: pad(f.bis) })));
  const ist = (betrieb.openingHoursSpecification || []).map((o) => ({ dayOfWeek: o.dayOfWeek, opens: o.opens, closes: o.closes }));
  assert.deepEqual(ist, erwartet, "JSON-LD-Zeiten weichen von site.zeiten ab");
});

test("Fuss: letzter Aufruf, Status, Wochen-Tabelle, Adresse, Slogan, Rechtszeile", () => {
  const f = fussVon(lies(path.join(dist, "index.html")));
  // 1. Letzter Aufruf: Schaden melden gefuellt (Haupt), Anrufen daneben – ein Aufruf, keine zwei.
  assert.match(f, /Schaden\? Melden Sie ihn online oder rufen Sie an\./, "Aufruf-Titel");
  assert.match(f, /knopf knopf--akzent[^>]*href="\/schaden-melden\/"/, "Schaden melden als gefuellter Haupt-CTA");
  assert.match(f, /knopf knopf--kontur[^>]*href="tel:\+41717558861"/, "Anrufen daneben");
  // 2. Status als Text; ohne Skript neutrale Zeile, kein falscher Zustand (kein data-zustand im HTML).
  assert.match(f, /<p class="fuss-status" data-status>Öffnungszeiten siehe Kontakt\.<\/p>/, "neutrale Status-Zeile ohne Skript");
  assert.ok(!/data-zustand/.test(f), "kein voreingestellter Zustand im HTML");
  // Daten fuer das Skript als data-fuss am <footer> (kein Skript-Tag) mit den vier Status-Texten.
  const daten = fussDaten(lies(path.join(dist, "index.html")));
  assert.ok(daten.zeiten["1"] && daten.status.offen && daten.status.zuTag, "Zeiten und Status-Texte in data-fuss");
  // 6. Ganze Woche als Tabelle mit data-ld (fuer die «heute»-Markierung im Browser).
  assert.match(f, /<table class="fuss-woche">/, "Wochen-Tabelle");
  assert.match(f, /<tr data-ld="1,2,3,4,5">/, "Mo–Fr mit Wochentag-Nummern");
  // 3. + 7. Adresse, Route (neuer Tab, noopener), Kopieren-Knopf (ohne Skript versteckt).
  assert.match(f, /Alte Landstrasse 63/, "Adresse");
  assert.match(f, /target="_blank" rel="noopener"/, "Route im neuen Tab mit noopener");
  assert.match(f, /<button type="button" class="fuss-kopf" hidden data-kopieren="071 755 88 61"/, "Telefon-Kopieren (versteckt ohne Skript)");
  assert.match(f, /data-kopiert-ziel role="status" aria-live="polite"/, "aria-live fuer «Kopiert»");
  // 8. Keine Flotten-Zeile mehr (Roni 09.11.2026: Firmen und Flotten gibt es nicht); WhatsApp fehlt, weil die Nummer nicht bestaetigt ist (Luecke, nichts erfunden).
  assert.ok(!/flotten|Firmenkunden/i.test(f), "keine Flotten-Zeile");
  assert.ok(!/wa\.me/.test(f), "kein WhatsApp-Link ohne bestaetigte Nummer");
  // 4. Slogan als echter Text.
  assert.match(f, /<p class="fuss-slogan">Qualität, die man sieht und fährt\.<\/p>/, "Slogan");
  // 5. Rechtszeile: © Jahr, Links, «Nach oben» (ohne Skript per #top).
  assert.match(f, /© \d{4} Auto Speedy AG/, "Copyright mit Jahr");
  for (const l of ["/impressum/", "/datenschutz/", "/bildnachweise/"]) assert.ok(f.includes(`href="${l}"`), l);
  assert.match(f, /href="#top" data-nach-oben>Nach oben/, "Nach oben (Sprung ohne Skript)");
});

test("Fuss ist auf jeder Seite vorhanden (auch ohne frueheren Abschluss)", () => {
  for (const p of ["kontakt", "schaden-melden", "occasionen", "impressum"]) {
    const f = fussVon(lies(path.join(dist, p, "index.html")));
    assert.match(f, /class="fuss-aufruf__ruf"/, `${p}: letzter Aufruf`);
    assert.match(f, /fuss-slogan/, `${p}: Slogan`);
  }
});

test("Fuss: eine Ausnahme in 10 Tagen erscheint in der Wochen-Tabelle (Fixture site.json über SITE_JSON)", () => {
  const d = new Date();
  d.setDate(d.getDate() + 10);
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const site = JSON.parse(lies(sitePfad));
  site.ausnahmen = [{ name: "Betriebsferien", datum: iso, geschlossen: true }];
  const fixture = path.join(os.tmpdir(), `site-ausnahme-${process.pid}.json`);
  const outDir = path.join(os.tmpdir(), `dist-fuss-${process.pid}`);
  fs.writeFileSync(fixture, JSON.stringify(site));
  try {
    execSync(`npx astro build --outDir ${outDir}`, {
      cwd: wurzel,
      env: { ...process.env, DATEN: "../astro/src/content", SITE_JSON: fixture },
      stdio: "pipe",
    });
    const f = fussVon(lies(path.join(outDir, "index.html")));
    assert.match(f, /class="fuss-woche__aus"/, "Ausnahme-Zeile in der Wochen-Tabelle");
    assert.ok(f.includes("Betriebsferien"), "Name der Ausnahme");
    assert.ok(f.includes(`<time datetime="${iso}">`), "Datum als <time>");
    assert.ok(f.includes("geschlossen"), "als geschlossen gekennzeichnet");
    // Die Ausnahme steht auch in data-fuss fuer die Status-Berechnung.
    const daten = fussDaten(lies(path.join(outDir, "index.html")));
    assert.deepEqual(daten.ausnahmen[iso], [], "geschlossene Ausnahme = leeres Fenster in data-fuss");
  } finally {
    fs.rmSync(fixture, { force: true });
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});
