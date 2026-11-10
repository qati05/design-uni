// llms.txt (Nachtrag 08.11.2026, AEO): Kurzfassung für KI-Assistenten, beim Bau aus denselben Daten erzeugt wie die Website
// (Betrieb, Zeiten, Leistungen, Fragen). So bleibt sie aktuell, wenn der Betrieb Zeiten im Cockpit ändert.
// Ersetzt die frühere feste Datei public/llms.txt. Kein Eszett (Schweizer Schreibweise, Test in statisch.test.mjs).
import { betrieb as b, bau, site } from "../../../astro/bau/daten.mjs";
import { zeitenSatz as zeitenKurz } from "../daten/zeiten"; // QA K19: eine Schreibweise
import { leistungen } from "../daten/leistungen";
import { faqStart, faqTesla } from "../daten/faq";

export function GET() {
  const basis = (bau.adresse || "https://www.autospeedy.ch").replace(/\/$/, "");
  const ew = b.ersatzwagen;
  // Dieselbe Liste wie das Laufband «Zertifizierte Partner» der Startseite (site.json, Feld «partner»), ohne Quellenvermerk.
  const partner: string[] = ((site as any).partner ?? []).map((p: any) => p.name);
  // Kommende Feiertage und Ferien aus dem Cockpit (Vergangenes fällt weg).
  const heute = new Date().toISOString().slice(0, 10);
  const tag = (d: string) => `${d.slice(8)}.${d.slice(5, 7)}.${d.slice(0, 4)}`;
  const sonder = (b.ausnahmen || []).filter((a: any) => (a.ende || a.datum) >= heute)
    .map((a: any) => `${a.name}, ${tag(a.datum)}${a.ende ? ` bis ${tag(a.ende)}` : ""}: ${a.zu ? "geschlossen" : `offen ${a.fenster.map(([v, x]: string[]) => `${v} bis ${x} Uhr`).join(" und ")}`}`);
  // Form nach llmstxt.org: Titel, Kurzbeschreibung, dann Fakten ohne Überschrift; nach der ersten «##» stehen nur noch Linklisten.
  const zeilen = [
    `# ${b.name}`,
    "",
    `> Carrosserie, Lackiererei und Autohandel in ${b.ort} ${b.kanton} (Rheintal). Unfall- und Blechschäden, Hagel und Dellen, Lack, Felgen, Folierung und Scheiben für alle Marken. Tesla Approved Body Shop. Die Abwicklung mit der Versicherung übernimmt der Betrieb${ew ? `; einen Ersatzwagen (${ew.anzahl} Fahrzeuge${ew.tesla ? ", auch ein Tesla" : ""}) gibt es auf Anfrage` : ""}.`,
    "",
    "Fakten:",
    "",
    `- Adresse: ${b.strasse}, ${b.plz} ${b.ort} ${b.kanton}, Schweiz`,
    `- Telefon: ${b.tel.anzeige}`,
    `- E-Mail: ${b.mail}`,
    `- Öffnungszeiten: ${zeitenKurz}`,
    ...sonder.map((x: string) => `- Feiertage und Ferien: ${x}`),
    `- Einzugsgebiet: ${b.ort} und Rheintal`,
    "- Marken: alle Marken; Tesla Approved Body Shop (Reparatur nach Tesla-Vorgaben mit Original-Ersatzteilen)",
    ...(partner.length ? [`- Zertifizierte Partner: ${partner.join(", ")}`] : []),
    "- Versicherung: Die Schadenabwicklung mit der Versicherung übernimmt der Betrieb.",
    "- Preise: keine festen Preise. Der Preis hängt vom Schaden ab; die Offerte gibt es im persönlichen Gespräch mit dem Betrieb.",
    `- Schaden melden: online unter ${basis}/schaden-melden/ (zwei Schritte, mit Fotos) oder telefonisch`,
    "- Reparaturdauer und Selbstbehalt werden nicht pauschal angegeben.",
    "",
    "Häufige Fragen:",
    "",
    ...[...faqStart, ...faqTesla].map((f) => `- ${f.frage} ${f.antwort}`),
    "",
    "## Leistungen",
    ...leistungen.map((l) => `- [${l.titel}](${basis}${l.pfad}): ${l.kurz}`),
    `- [Tesla](${basis}/tesla/): Tesla Approved Body Shop, Reparatur nach Tesla-Vorgaben mit Original-Ersatzteilen.`,
    `- [Occasionen](${basis}/occasionen/): Occasionen auf dem Areal und Autoankauf.`,
    "",
    "## Weitere Seiten",
    `- [Startseite](${basis}/)`,
    `- [Alle Leistungen](${basis}/leistungen/)`,
    `- [Schaden melden](${basis}/schaden-melden/): Schaden online melden, in zwei Schritten, mit Fotos`,
    `- [Team](${basis}/team/)`,
    `- [Kontakt und Anfahrt](${basis}/kontakt/)`,
    "",
    "## Optional",
    `- [Impressum](${basis}/impressum/)`,
    `- [Datenschutz](${basis}/datenschutz/)`,
  ];
  return new Response(zeilen.join("\n").replace(/ß/g, "ss") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
