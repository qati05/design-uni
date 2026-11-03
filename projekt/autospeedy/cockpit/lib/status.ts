// Status einer Schadenmeldung im Cockpit. Die Reihenfolge ist der Weg vom Eingang zum Auftrag;
// daraus zählt die Übersicht, wie viele Meldungen zu Aufträgen werden (Umsatz-Hebel, messbar).
export const STATUS = ["neu", "zurueckgerufen", "offerte", "auftrag", "erledigt", "verloren"] as const;
export type Status = (typeof STATUS)[number];

export const STATUS_NAME: Record<Status, string> = {
  neu: "Neu",
  zurueckgerufen: "Zurückgerufen",
  offerte: "Offerte",
  auftrag: "Auftrag",
  erledigt: "Erledigt",
  verloren: "Verloren",
};

/** Erlaubte nächste Schritte. «Verloren» geht aus jedem offenen Status; zurück geht nur ein Schritt. */
export function naechsteSchritte(s: Status): Status[] {
  switch (s) {
    case "neu": return ["zurueckgerufen", "verloren"];
    case "zurueckgerufen": return ["offerte", "auftrag", "verloren", "neu"];
    case "offerte": return ["auftrag", "verloren", "zurueckgerufen"];
    case "auftrag": return ["erledigt", "offerte"];
    case "erledigt": return ["auftrag"];
    case "verloren": return ["neu"];
  }
}

export type Meldung = {
  id: string;
  erstellt: string; // ISO
  art: string;
  tesla: boolean;
  /** Freiwillig gewählt, nur bei Tesla: Model 3, Model Y, Model S, Model X, Anderes Modell. */
  teslaModell?: string | null;
  stellen: string[];
  bemerkung: string;
  name: string;
  telefon: string;
  quelle: "website" | "whatsapp" | "telefon";
  status: Status;
  notiz: string;
  fotos: { id: string; url: string }[];
  beispiel?: boolean;
  /** Freiwillig vom Kunden angegeben: für Bestätigung und einmal die Bitte um Bewertung. */
  email?: string | null;
  bewertungFaellig?: string | null;
  bewertungGesendet?: string | null;
};

export type Kennzahlen = { gesamt: number; neu: number; offen: number; auftraege: number; quote: number | null; aelterAls2hNeu: number };

/** Kennzahlen für die Übersicht. Quote = Aufträge (inkl. erledigt) / abgeschlossene Entscheide (Auftrag, erledigt, verloren). */
export function kennzahlen(liste: Meldung[], jetzt = Date.now()): Kennzahlen {
  const zaehl = (f: (m: Meldung) => boolean) => liste.filter(f).length;
  const auftraege = zaehl((m) => m.status === "auftrag" || m.status === "erledigt");
  const entschieden = auftraege + zaehl((m) => m.status === "verloren");
  return {
    gesamt: liste.length,
    neu: zaehl((m) => m.status === "neu"),
    offen: zaehl((m) => m.status === "zurueckgerufen" || m.status === "offerte"),
    auftraege,
    quote: entschieden ? Math.round((auftraege / entschieden) * 100) : null,
    aelterAls2hNeu: zaehl((m) => m.status === "neu" && jetzt - Date.parse(m.erstellt) > 2 * 3600e3),
  };
}

/** Was die Website gebracht hat: Anfragen über die Website (Formular und Rückruf) und wie viele davon Aufträge wurden. */
export function websiteZahlen(m: Meldung[]): { anfragen: number; auftraege: number; quote: number | null; rueckrufe: number } {
  const web = m.filter((x) => x.quelle === "website");
  const k = kennzahlen(web);
  return { anfragen: web.length, auftraege: k.auftraege, quote: k.quote, rueckrufe: web.filter((x) => x.art === "Rückruf").length };
}
