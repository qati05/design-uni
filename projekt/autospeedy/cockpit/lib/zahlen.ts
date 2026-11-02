import type { Zaehlzeile } from "./backend";

// Lesbare Namen für die Zählpunkte der Website (data-zaehl). Unbekannte Punkte erscheinen unter ihrem Kürzel.
export const PUNKT_NAME: Record<string, string> = {
  anruf: "Telefonnummer angetippt", "anruf-mobil": "Mobilnummer angetippt", anfrage: "«Schaden melden» angetippt", schnellstart: "Schadenart auf der Startseite gewählt",
  "meldung-gesendet": "Meldung über die Website gesendet", "schaden-whatsapp": "Meldung per WhatsApp geöffnet", "schaden-website": "Senden auf der Website angetippt",
  tesla: "Tesla-Einstieg angetippt", "anfrage-tesla": "Tesla-Schaden melden angetippt", saison: "Saison-Hinweis angetippt", autoscout: "AutoScout24-Liste geöffnet",
  route: "Route geöffnet", mail: "E-Mail-Adresse angetippt", "bewertung-google": "Google-Bewertung geöffnet", "bewertung-facebook": "Facebook geöffnet",
  "rueckruf-occasionen": "Rückruf Occasionen angefordert", "rueckruf-flotten": "Rückruf Firmenkunden angefordert", "rueckruf-kontakt": "Rückruf angefordert",
};
export function zusammenfassen(zeilen: Zaehlzeile[]): { punkt: string; name: string; summe: number }[] {
  const m = new Map<string, number>();
  for (const z of zeilen) m.set(z.punkt, (m.get(z.punkt) ?? 0) + z.anzahl);
  return [...m.entries()].map(([punkt, summe]) => ({ punkt, name: PUNKT_NAME[punkt] ?? punkt, summe })).sort((a, b) => b.summe - a.summe);
}
