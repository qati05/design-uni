// llms.txt (Nachtrag 08.11.2026, AEO): Kurzfassung für KI-Assistenten, beim Bau aus denselben Daten erzeugt wie die Website
// (Betrieb, Zeiten, Leistungen, Fragen). So bleibt sie aktuell, wenn der Betrieb Zeiten im Cockpit ändert.
// Ersetzt die frühere feste Datei public/llms.txt. Kein Eszett (Schweizer Schreibweise, Test in statisch.test.mjs).
import { betrieb as b, bau } from "../../../astro/bau/daten.mjs";
import { zeitenSatz as zeitenKurz } from "../daten/zeiten"; // QA K19: eine Schreibweise
import { leistungen } from "../daten/leistungen";
import { faqStart, faqTesla } from "../daten/faq";

export function GET() {
  const basis = (bau.adresse || "https://www.autospeedy.ch").replace(/\/$/, "");
  const ew = b.ersatzwagen;
  const zeilen = [
    `# ${b.name}`,
    "",
    `> Carrosserie, Lackiererei und Autohandel in ${b.ort} ${b.kanton} (Rheintal). Unfall- und Blechschäden, Hagel und Dellen, Lack, Felgen, Folierung und Scheiben für alle Marken. Tesla Approved Body Shop. Die Abwicklung mit der Versicherung übernimmt der Betrieb${ew ? `; einen Ersatzwagen (${ew.anzahl} Fahrzeuge${ew.tesla ? ", auch ein Tesla" : ""}) gibt es auf Anfrage` : ""}.`,
    "",
    "## Fakten",
    `- Adresse: ${b.strasse}, ${b.plz} ${b.ort} ${b.kanton}, Schweiz`,
    `- Telefon: ${b.tel.anzeige}`,
    `- E-Mail: ${b.mail}`,
    `- Öffnungszeiten: ${zeitenKurz}`,
    `- Einzugsgebiet: ${b.ort} und Rheintal`,
    "- Marken: alle Marken; Tesla Approved Body Shop (Reparatur nach Tesla-Vorgaben mit Original-Ersatzteilen)",
    "- Zertifizierte Partner laut Website: Tesla Approved Body Shop, AMAG, Land Rover, Ayvens",
    "- Versicherung: Die Schadenabwicklung mit der Versicherung übernimmt der Betrieb.",
    "- Preise: keine festen Preise. Der Preis hängt vom Schaden ab; die Offerte gibt es im persönlichen Gespräch mit dem Betrieb.",
    `- Schaden melden: online unter ${basis}/schaden-melden/ (zwei Schritte, mit Fotos) oder telefonisch`,
    "",
    "## Leistungen",
    ...leistungen.map((l) => `- [${l.titel}](${basis}${l.pfad}): ${l.kurz}`),
    `- [Tesla](${basis}/tesla/): Tesla Approved Body Shop, Reparatur nach Tesla-Vorgaben mit Original-Ersatzteilen.`,
    `- [Occasionen](${basis}/occasionen/): Occasionen auf dem Areal und Autoankauf.`,
    "",
    "## Weitere Seiten",
    `- [Startseite](${basis}/)`,
    `- [Alle Leistungen](${basis}/leistungen/)`,
    `- [Schaden melden](${basis}/schaden-melden/)`,
    `- [Team](${basis}/team/)`,
    `- [Kontakt und Anfahrt](${basis}/kontakt/)`,
    "",
    "## Häufige Fragen",
    ...[...faqStart, ...faqTesla].flatMap((f) => [`### ${f.frage}`, f.antwort, ""]),
    "## Hinweise",
    "- Es werden nur belegte Angaben gemacht; offene Punkte sind auf der Website als Lücke markiert.",
    "- Reparaturdauer und Selbstbehalt werden nicht pauschal angegeben.",
  ];
  return new Response(zeilen.join("\n").replace(/ß/g, "ss") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
