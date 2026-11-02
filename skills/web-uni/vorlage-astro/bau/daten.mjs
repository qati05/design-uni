// Eine Quelle für alle Angaben der Website, mit Prüfung beim Bau.
// Liest betrieb.json (Fakten), texte.json (Wortlaut aus text-uni) und bau.json (Technik, Schalter «vorschau»)
// aus dem Ordner DATEN (Vorgabe: src/content). Regel für jedes Feld:
//   ""    Pflichtfeld, noch nicht gefüllt: der Bau bricht ab und nennt das Feld.
//   null  freiwillig und bewusst weggelassen: die Seite zeigt nichts dafür.
//   []    leere Liste in einem Pflichtfeld: der Bau bricht ab.
import fs from "node:fs";
import path from "node:path";

const ORDNER = path.resolve(process.cwd(), process.env.DATEN || "src/content");

function lies(name) {
  const datei = path.join(ORDNER, name);
  if (!fs.existsSync(datei)) throw new Error(`Datei fehlt: ${datei}`);
  return JSON.parse(fs.readFileSync(datei, "utf8"));
}

// Sammelt leere Pflichtfelder ("" und []) in einem Objekt; Schlüssel mit «_» sind Hinweise.
function leere(wert, pfad, aus) {
  if (wert === "") aus.push(pfad);
  else if (Array.isArray(wert)) {
    if (wert.length === 0) aus.push(`${pfad} (Liste leer)`);
    wert.forEach((w, i) => leere(w, `${pfad}[${i}]`, aus));
  } else if (wert && typeof wert === "object") {
    for (const [k, w] of Object.entries(wert)) if (!k.startsWith("_")) leere(w, pfad ? `${pfad}.${k}` : k, aus);
  }
  return aus;
}

export const betrieb = lies("betrieb.json");
export const texte = lies("texte.json");
export const bau = lies("bau.json");
export const vorschau = bau.vorschau !== false;

const fehler = [];
const warnung = [];
const melde = (datei, liste) => { if (liste.length) fehler.push(`${datei}: ${liste.join(", ")}`); };

melde("betrieb.json", leere(betrieb, "", []));
melde("texte.json", leere(texte, "", []));
if (!vorschau) melde("bau.json (nötig für den Livegang)", leere({ adresse: bau.adresse, kiTraining: bau.kiTraining, crawlerListeGeprueft: bau.crawlerListeGeprueft }, "", []));

// Formate, die ein Werkzeug prüfen kann.
const tel = betrieb.tel || {};
if (tel.e164 && !/^\+\d{8,15}$/.test(tel.e164)) fehler.push(`betrieb.json: tel.e164 «${tel.e164}» ist nicht im Format +41…`);
if (betrieb.mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(betrieb.mail)) fehler.push(`betrieb.json: mail «${betrieb.mail}» ist keine Adresse`);
const ziel = texte.hauptaktion && texte.hauptaktion.ziel;
if (ziel && !/^(\/([a-z0-9-]+\/)*|tel:\+\d+|mailto:\S+)$/.test(ziel)) fehler.push(`texte.json: hauptaktion.ziel «${ziel}» muss /pfad/ (mit Schrägstrich am Ende), tel: oder mailto: sein`);
const st = (texte.mikrotexte && texte.mikrotexte.status) || {};
for (const [k, platz] of [["offen", "{bis}"], ["zuHeute", "{ab}"], ["zuTag", "{tag}"], ["zuTag", "{ab}"]]) {
  if (st[k] && !st[k].includes(platz)) fehler.push(`texte.json: mikrotexte.status.${k} braucht den Platzhalter ${platz}`);
}
const zf = texte.mikrotexte && texte.mikrotexte.zeiten && texte.mikrotexte.zeiten.fenster;
if (zf && !(zf.includes("{von}") && zf.includes("{bis}"))) fehler.push("texte.json: mikrotexte.zeiten.fenster braucht {von} und {bis}");
if (!vorschau && bau.adresse && !/^https:\/\/[^/]+$/.test(bau.adresse)) fehler.push(`bau.json: adresse «${bau.adresse}» muss https://host sein, ohne Pfad und ohne Schrägstrich am Ende`);
if (!vorschau && bau.kiTraining && !["erlaubt", "gesperrt"].includes(bau.kiTraining.entscheid)) fehler.push("bau.json: kiTraining.entscheid ist «erlaubt» oder «gesperrt» (text-uni TI5)");
if (!vorschau && /^\d{4}-\d{2}-\d{2}$/.test(bau.crawlerListeGeprueft || "")) {
  const alter = (Date.now() - Date.parse(bau.crawlerListeGeprueft)) / 864e5;
  if (alter > 183) fehler.push(`bau.json: crawlerListeGeprueft ist ${Math.round(alter)} Tage alt, höchstens 183 (text-uni TI6)`);
}

// Titel und Beschreibung je Seite: Schwellen von text-uni (S1, S3, S12).
const titel = new Map();
for (const [seite, s] of Object.entries(texte.seiten || {})) {
  if (seite.startsWith("_") || !s) continue;
  const t = s.titel || "", d = s.beschreibung || "";
  if (t) {
    if (t.length > 65) fehler.push(`Seite ${seite}: Titel ${t.length} Zeichen, über 65 ist ein Fehler (S3): ${t}`);
    else if (t.length < 30) warnung.push(`Seite ${seite}: Titel ${t.length} Zeichen, unter 30 (S3)`);
    else if (t.length < 40 || t.length > 60) warnung.push(`Seite ${seite}: Titel ${t.length} Zeichen, Ziel 40 bis 60 (S3)`);
    if (titel.has(t)) fehler.push(`Seite ${seite}: gleicher Titel wie ${titel.get(t)} (S1)`);
    titel.set(t, seite);
  }
  if (d && (d.length < 110 || d.length > 155)) fehler.push(`Seite ${seite}: Beschreibung ${d.length} Zeichen, verlangt 110 bis 155 (S12)`);
}

for (const w of warnung) console.warn(`[vorlage] Warnung: ${w}`);
if (fehler.length) {
  throw new Error(
    "Bau abgebrochen. Leere Pflichtfelder oder falsche Formate:\n  " + fehler.join("\n  ") +
    `\nOrdner: ${ORDNER}\nFakten kommen aus fakten.md, Wortlaut aus text-uni. "" heisst Pflicht, null heisst bewusst weggelassen.`
  );
}

// Seite nach Schlüssel in texte.json; fehlt sie, bricht der Bau ab.
export function seite(name) {
  const s = texte.seiten && texte.seiten[name];
  if (!s) throw new Error(`texte.json: seiten.${name} fehlt`);
  return s;
}
