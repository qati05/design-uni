// Was Auto Speedy für die Umwelt tut. Die Fakten liefert der Betrieb (über Roni); bis dahin bleibt die Liste leer
// und Umwelt.astro zeigt in der Vorschau eine sichtbare Lücke. Keine Beispielfakten eintragen, nichts erfinden.
// `bestaetigt` setzt erst, wer die Angaben vom Betrieb schriftlich hat. Ohne Bestätigung erscheinen die Punkte nur
// in der Vorschau (mit Hinweis «Entwurf»), nie live. Kein JSON-LD zu diesen Angaben.
export type UmweltPunkt = { titel: string; text: string };

export const umwelt: { punkte: UmweltPunkt[]; bestaetigt: boolean } = {
  punkte: [],
  bestaetigt: false,
};
