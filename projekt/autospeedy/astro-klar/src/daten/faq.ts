// Fragen und Antworten (AEO). Nur belegte Aussagen aus fakten.md und den Betriebsdaten. Keine Dauer (nicht belegt).
// Genutzt als sichtbarer Text (Faq.astro) und als FAQPage-JSON-LD (Klar.astro, Prop `faq`).
// Nachtrag 08.11.2026 (AEO): Antworten nennen die Fakten selbst (Zeiten aus den Betriebsdaten statt «im Fuss der Seite»),
// damit Suchmaschinen und KI-Assistenten sie direkt zitieren können. Neue Fragen nur hinten anfügen: leistungen.ts zählt per Index.
// Preise: keine Fixpreise, Offerte nur im Gespräch (Roni, 07.11.2026). Dauer und Selbstbehalt bei Hagel: offen, darum keine Frage.
import { betrieb as b, site } from "../../../astro/bau/daten.mjs";
import { faqEinsetzen } from "../../../gemeinsam/site.ts";
import { zeitenSatz } from "./zeiten"; // QA K19: dieselbe Schreibweise wie im Fuss
// faqBasis: fester Stand im Code. Die Leistungsseiten wählen daraus per Index (leistungen.ts, Feld «fragen»).
// faqStart: was Startseite und Leistungsübersicht zeigen. Der Betrieb pflegt es im Cockpit (site.json, Feld «faq»);
// fehlt das Feld, gilt faqBasis. Platzhalter {zeiten}, {adresse} und {telefon} setzt der Bau ein.
export const faqBasis = [
  { frage: "Wer zahlt die Reparatur?", antwort: "Bei einem Versicherungsfall wickeln wir die Reparatur direkt mit Ihrer Versicherung ab. Um die Abrechnung müssen Sie sich nicht kümmern." },
  { frage: "Muss ich zuerst zur Versicherung?", antwort: "Nein. Melden Sie den Schaden direkt bei uns. Wir nehmen danach mit Ihrer Versicherung Kontakt auf und klären das Weitere." },
  { frage: "Bekomme ich einen Ersatzwagen?", antwort: "Auf Anfrage. Wir haben sechs Ersatzautos, darunter einen Tesla. Eine Verfügbarkeit können wir aber nicht garantieren." },
  { frage: "Reparieren Sie auch Tesla?", antwort: "Ja. Auto Speedy ist Tesla Approved Body Shop und repariert Ihren Tesla nach den Vorgaben von Tesla mit Original-Ersatzteilen." },
  { frage: "Für welche Marken arbeiten Sie?", antwort: "Für alle Marken. Unfall, Lack, Hagel, Felgen, Folierung und Scheiben erledigen wir markenübergreifend." },
  { frage: "Wo finde ich Auto Speedy?", antwort: `An der ${b.strasse} in ${b.plz} ${b.ort} ${b.kanton}, im Rheintal. Telefon ${b.tel.anzeige}.` },
  { frage: "Wann hat Auto Speedy geöffnet?", antwort: `${zeitenSatz}.` },
  { frage: "Was kostet eine Reparatur bei Auto Speedy?", antwort: "Das hängt vom Schaden ab, darum nennen wir keine festen Preise. Die Offerte besprechen wir persönlich mit Ihnen. Bei einem Versicherungsfall rechnen wir direkt mit der Versicherung ab." },
  { frage: "Wie melde ich einen Schaden?", antwort: `Online unter «Schaden melden» in zwei Schritten: zuerst, was passiert ist, dann Ihr Name und Ihre Telefonnummer. Fotos und weitere Angaben sind freiwillig. Oder telefonisch unter ${b.tel.anzeige}. Nach einer Meldung online rufen wir Sie zurück; Offerte und Termin besprechen wir persönlich mit Ihnen.` },
];
const werte = { zeiten: zeitenSatz, adresse: `${b.strasse} in ${b.plz} ${b.ort} ${b.kanton}`, telefon: b.tel.anzeige };
export const faqStart: { frage: string; antwort: string }[] = site.faq?.length
  ? site.faq.map((f: { frage: string; antwort: string }) => ({ frage: f.frage, antwort: faqEinsetzen(f.antwort, werte) }))
  : faqBasis;
export const faqTesla = [
  { frage: "Ist Auto Speedy von Tesla zugelassen?", antwort: "Ja. «Tesla Approved Body Shop» steht auf der Website des Betriebs bei den zertifizierten Partnern." },
  { frage: "Welche Teile verwenden Sie am Tesla?", antwort: "Original-Ersatzteile. Unfall- und Lackschäden setzen wir nach den Reparaturvorgaben von Tesla instand." },
  { frage: "Gibt es einen Ersatzwagen für Tesla-Fahrer?", antwort: "Auf Anfrage. Unter den sechs Ersatzautos ist auch ein Tesla; eine Verfügbarkeit können wir nicht garantieren." },
  { frage: "Übernehmen Sie die Versicherung beim Tesla?", antwort: "Ja. Die Abwicklung mit Ihrer Versicherung übernehmen wir, wie bei allen anderen Marken auch." },
];
