// Eine Schreibweise für Öffnungszeiten auf der ganzen Linie «Klar» (QA K19): «7.30 bis 12.00 Uhr und 13.15 bis 17.30 Uhr»,
// aus dem Wortlaut in texte.json (mikrotexte.zeiten), wie Fuss und Kontakt-Tabelle. Quelle der Zeiten: betrieb.zeiten.
import { betrieb as b, texte as t } from "../../../astro/bau/daten.mjs";
const w = t.mikrotexte.zeiten;
/** Fenster eines Tages oder einer Ausnahme, z. B. «7.30 bis 12.00 Uhr und 13.15 bis 17.30 Uhr», sonst «geschlossen». */
export const zeitZeile = (z: any): string => z.zu ? w.geschlossen : z.fenster.map(([von, bis]: string[]) => w.fenster.replace("{von}", von).replace("{bis}", bis)).join(w.trenner);
/** Offene Tage je Gruppe, z. B. ["Mo bis Fr 7.30 bis 12.00 Uhr und 13.15 bis 17.30 Uhr"]. */
export const zeitenOffen: string[] = b.zeiten.filter((z: any) => z.fenster).map((z: any) => `${z.kurz || z.tage} ${zeitZeile(z)}`);
/** Ein Satz für Antworten und Textstellen. */
export const zeitenSatz = zeitenOffen.join(", ");
/** Ein einzelnes Fenster in derselben Schreibweise, z. B. «7.30 bis 12.00 Uhr». */
export const fensterText = (von: string, bis: string): string => w.fenster.replace("{von}", von).replace("{bis}", bis);
