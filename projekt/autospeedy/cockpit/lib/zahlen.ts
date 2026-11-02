import type { Zaehlzeile } from "./backend";

// Lesbare Namen für die Zählpunkte der Website (data-zaehl). Unbekannte Punkte erscheinen unter ihrem Kürzel.
export const PUNKT_NAME: Record<string, string> = {
  anruf: "Telefonnummer angetippt", "anruf-mobil": "Mobilnummer angetippt", anfrage: "«Schaden melden» angetippt", schnellstart: "Schadenart auf der Startseite gewählt",
  "meldung-gesendet": "Meldung über die Website gesendet", "schaden-whatsapp": "Meldung per WhatsApp geöffnet", "schaden-website": "Senden auf der Website angetippt",
  tesla: "Tesla-Einstieg angetippt", "anfrage-tesla": "Tesla-Schaden melden angetippt", saison: "Saison-Hinweis angetippt", autoscout: "AutoScout24-Liste geöffnet",
  route: "Route geöffnet", mail: "E-Mail-Adresse angetippt", "bewertung-google": "Google-Bewertung geöffnet", "bewertung-facebook": "Facebook geöffnet",
  "trichter-1": "Schadenmeldung: Schritt 1 geöffnet", "trichter-2": "Schadenmeldung: bis Fotos", "trichter-3": "Schadenmeldung: bis Kontakt",
  "rueckruf-occasionen": "Rückruf Occasionen angefordert", "rueckruf-flotten": "Rückruf Firmenkunden angefordert", "rueckruf-kontakt": "Rückruf angefordert",
};
export function zusammenfassen(zeilen: Zaehlzeile[]): { punkt: string; name: string; summe: number }[] {
  const m = new Map<string, number>();
  for (const z of zeilen) m.set(z.punkt, (m.get(z.punkt) ?? 0) + z.anzahl);
  return [...m.entries()].map(([punkt, summe]) => ({ punkt, name: PUNKT_NAME[punkt] ?? punkt, summe })).sort((a, b) => b.summe - a.summe);
}

/** Trichter der Schadenmeldung: wie viele kommen von Schritt zu Schritt weiter, und wie viele senden ab (Website oder WhatsApp). */
export function trichter(zeilen: Zaehlzeile[]): { name: string; anzahl: number; anteil: number | null }[] {
  const summe = (p: string) => zeilen.filter((z) => z.punkt === p).reduce((a, z) => a + z.anzahl, 0);
  const stufen: [string, number][] = [
    ["Schadenmeldung geöffnet", summe("trichter-1")],
    ["Art gewählt, bei den Fotos", summe("trichter-2")],
    ["Bei Name und Telefon", summe("trichter-3")],
    ["Abgeschickt (Website oder WhatsApp)", summe("meldung-gesendet") + summe("schaden-whatsapp")],
  ];
  const start = stufen[0]![1];
  return stufen.map(([name, anzahl]) => ({ name, anzahl, anteil: start ? Math.round((anzahl / start) * 100) : null }));
}
