// Eine Schnittstelle für Anmeldung und Website-Pflege, zwei Umsetzungen:
//   supabase (echter Betrieb, Muster aus qati05/medaur) und demo (lokal, ohne fremde Dienste, alles als Demo gekennzeichnet).
// Das Cockpit speichert keine Kundendaten: Formulare der Website gehen direkt per Mail an den Betrieb.
import type { Pflege } from "./pflege";

/** Stand der Website-Pflege: Inhalt von site.json und ihre Version (sha) für den Konfliktschutz beim Speichern. */
export type PflegeStand = { daten: Pflege; sha: string; geaendert: string | null; von: string | null };
export type PflegeSpeichern = "ok" | "konflikt" | "fehler" | "unklar" | "nicht_eingerichtet";

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
  /** Pflege der Website (Zeiten, Ausnahmen, Hinweis, Team): site.json im Repo des Betriebs. null: nicht erreichbar oder nicht eingerichtet. */
  pflegeLesen(): Promise<PflegeStand | null>;
  /** Speichert nur, wenn site.json noch die Version «sha» hat (sonst «konflikt»). */
  pflegeSpeichern(p: Pflege, sha: string): Promise<PflegeSpeichern>;
  /** Teamfoto in den Bild-Speicher (nie ins Git); gibt die Adresse zurück, die in site.json steht. */
  teamFotoSpeichern(bytes: Uint8Array, typ: "image/jpeg" | "image/png" | "image/webp"): Promise<string | null>;
  /** Entfernt ein Teamfoto wirklich aus dem Bild-Speicher. */
  teamFotoLoeschen(url: string): Promise<boolean>;
}

export function istDemo(): boolean {
  return process.env.COCKPIT_DEMO === "1";
}
