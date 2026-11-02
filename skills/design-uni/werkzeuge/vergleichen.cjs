// Vergleicht eine vermessene Website mit dem Band der Vorbilder (referenzen/vorbilder-gemessen.md).
// Aufruf:
//   node vergleichen.cjs <messung.json> [--band vorbilder-band.json] [--streng]
//   node vergleichen.cjs --band-neu <ordner-mit-messungen> [--ohne name,name] > vorbilder-band.json
// Die Messung kommt von vermessen.cjs. Das Band beschreibt, was die Vorbilder tun; es ist kein Ziel.
// «Vorlagen-Signale» sind Muster, die bei den Vorbildern selten sind und in den blinden Tests als
// Vorlage gelesen wurden. Sie sind Hinweise, keine Verbote (Entscheid 13). Die Faktenzeile aus Entscheid 3
// (Leistung, Ort, Telefon, Hauptaktion) ist kein Signal; Textlinks darin zählen nicht als knopfartig. Mit --streng endet das Skript mit Code 1, wenn ein Signal anschlägt.
"use strict";
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };

const hell = (hex) => { const h = hex.replace("#", ""); const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

// Eine Zahl je Mass, aus einer Messung von vermessen.cjs
function metriken(j) {
  const m = (art) => {
    const d = j[art]; const s = d.schrift, e = d.erster, star = d.star || {}, wm = d.wortmarke;
    const rad = d.bauteile.radien; const radienArten = Object.keys(rad).filter((k) => k !== "pille").length + (rad.pille ? 1 : 0);
    return {
      familien: s.familienAb5Prozent, starZuFliess: d.starZuFliess, starBreite: Math.max(star.anteilBreite || 0, (wm || {}).anteilBreite || 0),
      wortmarke: wm && wm.anteilBreite >= 0.5 ? 1 : 0, stufen: s.stufenAb1Prozent, versal: s.versalAnteil, mono: s.monoAnteil, fliess: s.fliesstextPx,
      woerter: e.woerter, medien: e.medienAnteil, textAufMedien: e.textAufMedien, leer: e.leerAnteil, knoepfe: e.knoepfe, handlungen: e.handlungen,
      radienArten, schatten: d.bauteile.schattenElemente, karten: d.bauteile.karten, icons: d.bauteile.kleineIcons,
      disziplin: d.raster.disziplinTop4, hoehe: d.seitenhoeheBildschirme, bibliotheken: d.bewegung.bibliotheken.length,
      dunkel: hell(d.farbe.grundSeite) < 0.3 ? 1 : 0,
    };
  };
  const d = m("desktop"), h = m("handy");
  return { ...d, handyWoerter: h.woerter, handyStarZuFliess: h.starZuFliess, handyKnoepfe: h.knoepfe, handyMedien: h.medien };
}

const NAMEN = {
  familien: "Schriftfamilien (≥ 5 % der Zeichen)", starZuFliess: "Star ÷ Fliesstext (Desktop)", starBreite: "Breite des Stars (Anteil Bildschirm)",
  wortmarke: "Wortmarke ≥ 50 % breit", stufen: "Schriftgrössen (≥ 1 % der Zeichen)", versal: "Anteil Versalien", mono: "Anteil Mono-Schrift", fliess: "Fliesstext px",
  woerter: "Wörter im ersten Bildschirm (Desktop)", medien: "Bild/Video im ersten Bildschirm (Anteil)", textAufMedien: "Text auf Bild (Anteil)", leer: "Leerfläche im ersten Bildschirm",
  knoepfe: "Knopfartige Elemente im ersten Bildschirm (Desktop)", handlungen: "Links und Knöpfe im ersten Bildschirm", radienArten: "Arten von Eckenradien", schatten: "Elemente mit Schatten",
  karten: "Karten (Fläche + Radius + Text)", icons: "Kleine Icons (≤ 48 px)", disziplin: "Text auf den 4 häufigsten linken Kanten", hoehe: "Seitenhöhe in Bildschirmen",
  bibliotheken: "Bewegungs-Bibliotheken", dunkel: "Dunkler Grund", handyWoerter: "Wörter im ersten Bildschirm (Handy)", handyStarZuFliess: "Star ÷ Fliesstext (Handy)",
  handyKnoepfe: "Knopfartige Elemente im ersten Bildschirm (Handy)", handyMedien: "Bild/Video im ersten Bildschirm (Handy)",
};

// Vorlagen-Signale: Schwellen [Annahme], abgeleitet aus dem oberen Quartil der Vorbilder (vorbilder-gemessen.md, Teil 3)
const SIGNALE = [
  ["knoepfe", (v) => v > 2, "mehr als 2 knopfartige Elemente im ersten Bildschirm (Vorbilder: Median 0, 21 von 25 höchstens 2)"],
  ["handyKnoepfe", (v) => v > 2, "mehr als 2 knopfartige Elemente im ersten Handy-Bildschirm (Vorbilder: Median 0, 24 von 25 höchstens 2)"],
  ["karten", (v) => v > 3, "mehr als 3 Karten mit Fläche und Radius (19 von 25 Vorbildern: 0)"],
  ["schatten", (v) => v > 2, "mehr als 2 Elemente mit Schatten (16 von 25 Vorbildern: 0)"],
  ["radienArten", (v) => v > 3, "mehr als 3 Arten von Eckenradien (Vorbilder: Median 1)"],
  ["icons", (v) => v > 14, "mehr als 14 kleine Icons (Vorbilder: Median 5)"],
  ["familien", (v) => v > 2, "mehr als 2 Schriftfamilien (20 von 25 Vorbildern: 1 oder 2)"],
  // Wörter: Grenze aus Entscheid 3 (zusammenspiel.md): eine grosse Sache plus Faktenzeile, höchstens etwa 60 Wörter [Annahme]
  ["woerter", (v) => v > 60, "mehr als etwa 60 Wörter im ersten Bildschirm (Entscheid 3; Vorbilder: Median 39)"],
  ["handyWoerter", (v) => v > 60, "mehr als etwa 60 Wörter im ersten Handy-Bildschirm (Entscheid 3; Vorbilder: Median 30)"],
];

function band(ordner, ohne) {
  const dateien = fs.readdirSync(ordner).filter((f) => f.endsWith(".json"));
  const zeilen = [];
  for (const f of dateien) {
    let j; try { j = JSON.parse(fs.readFileSync(path.join(ordner, f), "utf8")); } catch (_) { continue; }
    if (!j.desktop || !j.handy || ohne.includes(j.name)) continue;
    zeilen.push({ name: j.name, url: j.url, m: metriken(j) });
  }
  const q = (arr, p) => { const a = arr.slice().sort((x, y) => x - y); const i = (a.length - 1) * p; const lo = Math.floor(i), hi = Math.ceil(i); return +(a[lo] + (a[hi] - a[lo]) * (i - lo)).toFixed(2); };
  const out = { stand: new Date().toISOString().slice(0, 10), n: zeilen.length, quellen: zeilen.map((z) => z.url), masse: {} };
  for (const k of Object.keys(NAMEN)) {
    const v = zeilen.map((z) => z.m[k]).filter((x) => x != null);
    if (!v.length) continue;
    out.masse[k] = { name: NAMEN[k], n: v.length, p25: q(v, 0.25), median: q(v, 0.5), p75: q(v, 0.75), min: Math.min(...v), max: Math.max(...v) };
  }
  return out;
}

if (args[0] === "--band-neu") {
  const ohne = (opt("--ohne", "") || "").split(",").filter(Boolean);
  console.log(JSON.stringify(band(args[1], ohne), null, 1));
  process.exit(0);
}

const datei = args[0];
if (!datei) { console.error("Aufruf: node vergleichen.cjs <messung.json> [--band vorbilder-band.json] [--streng]"); process.exit(2); }
const j = JSON.parse(fs.readFileSync(datei, "utf8"));
const B = JSON.parse(fs.readFileSync(opt("--band", path.join(__dirname, "vorbilder-band.json")), "utf8"));
const m = metriken(j);

console.log(`Vergleich: ${j.name} (${j.url}), gemessen ${j.gemessenAm}`);
console.log(`Band: ${B.n} Vorbilder, Stand ${B.stand}. Das Band beschreibt, es verlangt nichts.\n`);
console.log("1 · Vorlagen-Signale [Annahme]");
let signale = 0;
for (const [k, test, text] of SIGNALE) { if (m[k] != null && test(m[k])) { signale++; console.log(`   SIGNAL  ${NAMEN[k]}: ${m[k]} · ${text}`); } }
if (!signale) console.log("   keine");
console.log("\n2 · Lage im Band (unter p25 · im Band · über p75)");
for (const [k, b] of Object.entries(B.masse)) {
  const v = m[k]; if (v == null) continue;
  const lage = v < b.p25 ? "UNTER " : v > b.p75 ? "ÜBER  " : "im Band";
  console.log(`   ${lage.padEnd(7)} ${b.name.padEnd(52)} ${String(v).padStart(6)}   (p25 ${b.p25} · Median ${b.median} · p75 ${b.p75})`);
}
console.log("\nJede Lage ausserhalb des Bands braucht einen «weil»-Satz in der Ableitungskette (SKILL.md Schritt 4), sonst ist sie eine Voreinstellung.");
if (args.includes("--streng") && signale) process.exit(1);
