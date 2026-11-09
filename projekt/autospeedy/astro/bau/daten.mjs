// Eine Quelle für alle Angaben der Website, mit Prüfung beim Bau.
// Liest betrieb.json (Fakten), texte.json (Wortlaut aus text-uni) und bau.json (Technik, Schalter «vorschau» und «stufe»)
// aus dem Ordner DATEN (Vorgabe: src/content). Regel für jedes Feld:
//   ""    Pflichtfeld, noch nicht gefüllt: FEHLER, der Bau bricht ab und nennt das Feld.
//   null  freiwillig und bewusst weggelassen: die Seite zeigt nichts dafür.
//   []    leere Liste in einem Pflichtfeld: FEHLER.
// Zwei Stufen (zusammenspiel Teil 7, «Gerüst und Vorschau»):
//   stufe «geruest»: Gerüst und Vorschau während des Baus. Texte, die erst später entstehen (Beschreibung je Seite,
//                    Rechtsseiten Impressum und Datenschutz) sind HINWEIS; der Bau läuft weiter.
//   stufe «abgabe»:  Prüflauf vor der Abgabe (Abfolge Schritt 13: DP6, TP7, WP4, WP5) und Livegang. Fehlen sie, ist das FEHLER.
// In beiden Stufen HINWEIS (text-uni S1, S3, S12; Entscheid 13): Länge von Titel und Beschreibung, doppelter Titel.
//   Livegang (vorschau false) prüft immer wie «abgabe». Die Umgebungsvariable STUFE geht bau.json vor.
// Immer FEHLER, in jeder Stufe: leere Fakten in betrieb.json (Name, Telefon, Anschrift …), falsche Formate,
// leerer Wortlaut ausserhalb der Seiten, und je Seite (ausser Rechtsseiten) Titel und h1: Sie kommen als Entwurf aus text-uni TP2.
import fs from "node:fs";
import path from "node:path";

const ORDNER = path.resolve(process.cwd(), process.env.DATEN || "src/content");
export const RECHTSSEITEN = ["impressum", "datenschutz"];

function lies(name) {
  const datei = path.join(ORDNER, name);
  if (!fs.existsSync(datei)) throw new Error(`Datei fehlt: ${datei}`);
  return JSON.parse(fs.readFileSync(datei, "utf8"));
}

// Sammelt leere Pflichtfelder ("" und []) in einem Objekt; Schlüssel mit «_» sind Hinweise für Menschen.
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

// Was der Betrieb selbst ändert (Zeiten, Feiertage, Hinweis, Team) steht in src/daten/site.json. Der Bau prüft die Datei
// mit dem gemeinsamen Schema und bricht bei Fehlern ab: lieber kein neuer Stand als eine kaputte Seite.
import { siteSchema, telefonCH } from "../../gemeinsam/site.ts";
import siteStandard from "../src/daten/site.json" with { type: "json" };
// Normalfall: die eingebundene astro/src/daten/site.json. Im Test ueber SITE_JSON eine Fixture (nur test/fixtures),
// nie in Produktion; so laesst sich z. B. eine Ausnahme mit einem Datum relativ zum Build-Tag pruefen.
const siteRoh = process.env.SITE_JSON
  ? JSON.parse(fs.readFileSync(path.resolve(process.cwd(), process.env.SITE_JSON), "utf8"))
  : siteStandard;
const siteGeprueft = siteSchema.safeParse(siteRoh);
if (!siteGeprueft.success) throw new Error(`src/daten/site.json ungültig: ${siteGeprueft.error.issues.map((i) => i.path.join(".") + ": " + i.message).join("; ")}`);
export const site = siteGeprueft.data;
export const pflege = site; // Name, den Layouts und Seiten schon nutzen
function mitPflege(b, p) {
  const zeiten = p.zeiten.map((z) => z.geschlossen ? { tage: z.tage, kurz: z.kurz, zu: true } : { tage: z.tage, kurz: z.kurz, ld: z.wochentage, fenster: z.fenster.map((f) => [f.von, f.bis]) });
  const ausnahmen = p.ausnahmen.map((a) => a.geschlossen ? { name: a.name, datum: a.datum, zu: true } : { name: a.name, datum: a.datum, fenster: [[a.von, a.bis]] });
  // Kontakt (Cockpit, 09.11.2026): Telefon und Mail aus site.json gehen betrieb.json vor. Eine WhatsApp-Nummer, die der Betrieb
  // dort selbst einträgt, gilt als bestätigt; ohne Eintrag bleibt der Stand aus betrieb.json (Nummer noch unbestätigt).
  const k = p.kontakt ?? {};
  const tel = k.telefon ? telefonCH(k.telefon) : null, wa = k.whatsapp ? telefonCH(k.whatsapp) : null;
  const kontakt = {
    ...(tel ? { tel } : {}), ...(k.mail ? { mail: k.mail } : {}),
    ...(wa ? { whatsapp: { ...(b.whatsapp ?? {}), nummer: wa.e164.slice(1), anzeige: wa.anzeige, nutzung_bestaetigt: true, nummer_bestaetigt: true } } : {}),
  };
  return { ...b, ...kontakt, zeiten, ausnahmen: ausnahmen.length ? ausnahmen : null }; // keine Ausnahmen: bewusst nichts zeigen
}
export const betrieb = mitPflege(lies("betrieb.json"), pflege);
/** Eine Zeile für den ersten Bildschirm, z. B. «Mo bis Do 7.30 bis 12.00 und 13.15 bis 17.30 Uhr, Fr 7.30 bis …». */
export const zeitenKurz = betrieb.zeiten.filter((z) => z.fenster).map((z) => `${z.kurz || z.tage} ${z.fenster.map(([v, b]) => `${v} bis ${b}`).join(" und ")} Uhr`).join(", ");
export const texte = lies("texte.json");
export const bau = lies("bau.json");
export const vorschau = bau.vorschau !== false;
export const stufe = vorschau ? (process.env.STUFE || bau.stufe || "geruest") : "abgabe";
export const streng = stufe === "abgabe";

const fehler = [];
const hinweis = [];
const melde = (datei, liste) => { if (liste.length) fehler.push(`${datei}: ${liste.join(", ")}`); };
// Spätere Texte: im Gerüst HINWEIS, in der Abgabe und im Livegang FEHLER.
const spaeter = (text) => (streng ? fehler : hinweis).push(text);

if (!["geruest", "abgabe"].includes(stufe)) fehler.push(`bau.json oder STUFE: stufe «${stufe}» ist «geruest» oder «abgabe»`);

melde("betrieb.json", leere(betrieb, "", []));
const { seiten: _seiten, ...texteOhneSeiten } = texte;
melde("texte.json", leere(texteOhneSeiten, "", []));
if (!vorschau) melde("bau.json (nötig für den Livegang)", leere({ adresse: bau.adresse, kiTraining: bau.kiTraining, crawlerListeGeprueft: bau.crawlerListeGeprueft }, "", []));

// Formate, die ein Werkzeug prüfen kann.
const tel = betrieb.tel || {};
if (tel.e164 && !/^\+\d{8,15}$/.test(tel.e164)) fehler.push(`betrieb.json: tel.e164 «${tel.e164}» ist nicht im Format +41…`);
if (betrieb.mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(betrieb.mail)) fehler.push(`betrieb.json: mail «${betrieb.mail}» ist keine Adresse`);
for (const [i, a] of (betrieb.ausnahmen || []).entries()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.datum || "")) fehler.push(`betrieb.json: ausnahmen[${i}].datum «${a.datum}» ist JJJJ-MM-TT`);
  if (!a.zu && !Array.isArray(a.fenster)) fehler.push(`betrieb.json: ausnahmen[${i}] braucht "zu": true oder "fenster"`);
  if (!a.name) fehler.push(`betrieb.json: ausnahmen[${i}].name fehlt (Bezeichnung aus fakten.md)`);
}
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

// Seiten: Titel und h1 als Entwurf aus text-uni TP2 (immer Pflicht); Beschreibung und Rechtsseiten entstehen später
// (text-uni Schritt 7 und 10, Abfolge Schritt 13). Schwellen von text-uni (S1, S3, S12).
const titel = new Map();
for (const [name, s] of Object.entries(texte.seiten || {})) {
  if (name.startsWith("_")) continue;
  if (!s) { fehler.push(`texte.json: seiten.${name} ist leer`); continue; }
  const recht = RECHTSSEITEN.includes(name);
  const t = s.titel || "", d = s.beschreibung || "";
  for (const feld of ["titel", "h1"]) {
    if (s[feld] !== "") continue;
    if (recht) spaeter(`Seite ${name}: ${feld} fehlt (Rechtsseite, text-uni Schritt 10)`);
    else fehler.push(`Seite ${name}: ${feld} fehlt (Entwurf aus text-uni TP2)`);
  }
  if (s.beschreibung === "") spaeter(`Seite ${name}: Beschreibung fehlt (text-uni S12, kommt beim Bau aller Seiten)`);
  if (t) {
    if (t.length > 65) hinweis.push(`Seite ${name}: Titel ${t.length} Zeichen, über 65 (S3): ${t}`);
    else if (t.length < 40 || t.length > 60) hinweis.push(`Seite ${name}: Titel ${t.length} Zeichen, Ziel 40 bis 60 (S3)`);
    if (titel.has(t)) hinweis.push(`Seite ${name}: gleicher Titel wie ${titel.get(t)} (S1)`);
    titel.set(t, name);
  }
  if (d && (d.length < 110 || d.length > 155)) hinweis.push(`Seite ${name}: Beschreibung ${d.length} Zeichen, verlangt 110 bis 155 (S12)`);
}

// Meldet einen Befund, der erst nach dem Bau feststeht (bau/dateien.mjs), nach derselben Stufe.
export function meldeSpaeter(text) {
  if (streng) throw new Error(`Bau abgebrochen (Stufe abgabe). FEHLER:\n  ${text}`);
  console.warn(`[vorlage] HINWEIS: ${text}`);
}

// Astro lädt diese Datei mehrmals (Konfiguration, Seiten); gemeldet wird einmal je Bau.
const erstesMal = !globalThis.__vorlageGemeldet;
globalThis.__vorlageGemeldet = true;
if (erstesMal) for (const h of hinweis) console.warn(`[vorlage] HINWEIS: ${h}`);
if (fehler.length) {
  throw new Error(
    `Bau abgebrochen (Stufe ${stufe}). FEHLER:\n  ` + fehler.join("\n  ") +
    `\nOrdner: ${ORDNER}\nFakten kommen aus fakten.md, Wortlaut aus text-uni. "" heisst Pflicht, null heisst bewusst weggelassen.`
  );
}
if (erstesMal) console.warn(`[vorlage] Stufe ${stufe}: 0 FEHLER, ${hinweis.length} HINWEIS${streng ? "" : " (spätere Texte sind im Gerüst nur HINWEIS; vor der Abgabe mit STUFE=abgabe bauen)"}`);

// Seite nach Schlüssel in texte.json; fehlt sie, bricht der Bau ab.
export function seite(name) {
  const s = texte.seiten && texte.seiten[name];
  if (!s) throw new Error(`texte.json: seiten.${name} fehlt`);
  return s;
}
