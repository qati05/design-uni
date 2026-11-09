// Überschriften zum Team zählen mit: Der Betrieb fügt im Cockpit Personen hinzu oder entfernt sie, die Zahl im Titel stimmt dann weiter.
// Gezählt wird, wer auf der Website gezeigt wird (Einverständnis). Bis zwölf als Wort, darüber als Ziffer.
import { site } from "../../../astro/bau/daten.mjs";

const WORT = ["null", "eine", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];
const wort = (n: number) => WORT[n] ?? String(n);
const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const gruppen = (site as any).team
  .map((g: any) => g.leute.filter((p: any) => p.einverstaendnis).length)
  .filter((n: number) => n > 0);
export const teamLeute: number = gruppen.reduce((a: number, b: number) => a + b, 0);
export const teamBereiche: number = gruppen.length;

/** Startseite: «Zehn Leute, eine Werkstatt.» */
export const teamTitelStart = teamLeute >= 2 ? `${gross(wort(teamLeute))} Leute, eine Werkstatt.` : "Ein Team, eine Werkstatt.";
/** Teamseite: «Zehn Leute, vier Bereiche.» */
export const teamTitelSeite = teamLeute < 2 ? "Unser Team." : teamBereiche >= 2 ? `${gross(wort(teamLeute))} Leute, ${wort(teamBereiche)} Bereiche.` : `${gross(wort(teamLeute))} Leute, ein Team.`;
