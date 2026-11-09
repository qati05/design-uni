// Eine Schnittstelle für Anmeldung und Website-Pflege, zwei Umsetzungen:
//   supabase (echter Betrieb, Muster aus qati05/medaur) und demo (lokal, ohne fremde Dienste, alles als Demo gekennzeichnet).
// Das Cockpit speichert keine Kundendaten: Formulare der Website gehen direkt per Mail an den Betrieb.
import type { FotoOrdner, Pflege } from "./pflege";

/** Stand der Website-Pflege: Inhalt von site.json und ihre Version (sha) für den Konfliktschutz beim Speichern. */
export type PflegeStand = { daten: Pflege; sha: string; geaendert: string | null; von: string | null };
export type PflegeSpeichern = "ok" | "konflikt" | "fehler" | "unklar" | "nicht_eingerichtet";
/** Ein veröffentlichter Stand der Website (ein Commit an site.json). Ohne Namen: Wer es war, steht im Audit-Log. */
export type VerlaufEintrag = { id: string; zeit: string };
/** Besucherzahlen der Website, nur zum Lesen. Summen pro Tag und pro Seite, keine einzelnen Besucher. */
export type Besucher = { beispiel: boolean; tage: { datum: string; besuche: number }[]; seiten: { pfad: string; besuche: number }[] };
export type FotoTyp = "image/jpeg" | "image/png" | "image/webp";

export type SitzungsStand = { userId: string; email: string; mitglied: boolean } | null;
export type CodeAntwort = { status: "gesendet" | "zu_viele" | "fehler" };
export type AuditEintrag = { aktion: string; ergebnis: "ok" | "abgelehnt" | "fehler"; ziel?: string };

export interface Backend {
  readonly art: "supabase" | "demo";
  codeAnfordern(email: string): Promise<CodeAntwort>;
  codePruefen(email: string, code: string): Promise<boolean>;
  sitzung(): Promise<SitzungsStand>;
  abmelden(): Promise<void>;
  audit(e: AuditEintrag): Promise<void>;
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
