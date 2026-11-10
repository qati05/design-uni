// Eine Schnittstelle für die Website-Pflege, zwei Umsetzungen:
//   cloudflare (echter Betrieb) und demo (lokal, ohne fremde Dienste, alles als Demo gekennzeichnet).
// Das Cockpit hat keine eigene Anmeldung und keine Datenbank: Cloudflare Access steht davor (Code per Mail) und lässt nur
// die Adressen herein, die dort eingetragen sind. Das Cockpit prüft bei jeder Anfrage den Ausweis von Access (lib/zugriff.server.ts).
// Es speichert keine Kundendaten: Formulare der Website gehen direkt per Mail an den Betrieb.
import type { FotoOrdner, Pflege } from "./pflege";

/** Stand der Website-Pflege: Inhalt von site.json und ihre Version (sha) für den Konfliktschutz beim Speichern. */
export type PflegeStand = { daten: Pflege; sha: string; geaendert: string | null };
export type PflegeSpeichern = "ok" | "konflikt" | "fehler" | "unklar" | "nicht_eingerichtet";
/** Ein veröffentlichter Stand der Website (ein Commit an site.json). Ohne Namen: Git vergisst nicht. */
export type VerlaufEintrag = { id: string; zeit: string };
/** Besucherzahlen der Website, nur zum Lesen. Summen pro Tag und pro Seite, keine einzelnen Besucher. */
export type Besucher = { beispiel: boolean; tage: { datum: string; besuche: number }[]; seiten: { pfad: string; besuche: number }[] };
export type FotoTyp = "image/jpeg" | "image/png" | "image/webp";

/** Wer angemeldet ist. null: kein gültiger Ausweis von Cloudflare Access (dann geht nichts). */
export type SitzungsStand = { email: string } | null;

export interface Backend {
  readonly art: "cloudflare" | "demo";
  sitzung(): Promise<SitzungsStand>;
  /** Pflege der Website: site.json im Repo des Betriebs. null: nicht erreichbar oder nicht eingerichtet. */
  pflegeLesen(): Promise<PflegeStand | null>;
  /** Speichert nur, wenn site.json noch die Version «sha» hat (sonst «konflikt»). */
  pflegeSpeichern(p: Pflege, sha: string): Promise<PflegeSpeichern>;
  /** Die letzten veröffentlichten Stände, neuester zuerst. Leer, wenn nicht erreichbar. */
  verlauf(): Promise<VerlaufEintrag[]>;
  /** Ein früherer Stand aus dem Verlauf. null: nicht gefunden oder nach heutigen Regeln nicht mehr gültig. */
  pflegeVersion(id: string): Promise<Pflege | null>;
  /** Bild in den Bild-Speicher (nie ins Git); gibt die Adresse zurück, die in site.json steht.
   *  Ordner «team» für Porträts, «bild» für ersetzte Fotos der Website und Partner-Logos. */
  bildSpeichern(bytes: Uint8Array, typ: FotoTyp, ordner: FotoOrdner): Promise<string | null>;
  /** Entfernt ein Bild wirklich aus dem Bild-Speicher. */
  bildLoeschen(url: string): Promise<boolean>;
  /** Besucherzahlen der letzten 28 Tage. null: Zählung nicht verbunden oder nicht erreichbar. */
  besucher(): Promise<Besucher | null>;
}

export function istDemo(): boolean {
  return process.env.COCKPIT_DEMO === "1";
}
