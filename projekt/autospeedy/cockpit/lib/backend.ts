// Eine Schnittstelle für Anmeldung und Daten, zwei Umsetzungen:
//   supabase (echter Betrieb, Muster aus qati05/medaur) und demo (lokal, ohne fremde Dienste, alles als Demo gekennzeichnet).
import type { Meldung, Status } from "./status";

export type SitzungsStand = { userId: string; email: string; aal: "aal1" | "aal2"; naechste: "aal1" | "aal2"; mitglied: boolean } | null;
export type CodeAntwort = { status: "gesendet" | "zu_viele" | "fehler" };
export type TotpAntwort = { status: "ok" | "falsch" | "kein_faktor" | "ungueltig" };
export type Einrichten = { status: "bereit"; faktorId: string; geheimnis: string; qr: string | null } | { status: "vorhanden" | "fehler" };
export type AuditEintrag = { aktion: string; ergebnis: "ok" | "abgelehnt" | "fehler"; ziel?: string };

export interface Backend {
  readonly art: "supabase" | "demo";
  codeAnfordern(email: string): Promise<CodeAntwort>;
  codePruefen(email: string, code: string): Promise<boolean>;
  sitzung(): Promise<SitzungsStand>;
  totpPruefen(code: string): Promise<TotpAntwort>;
  totpEinrichten(): Promise<Einrichten>;
  totpEinrichtenBestaetigen(faktorId: string, code: string): Promise<TotpAntwort>;
  abmelden(): Promise<void>;
  meldungen(): Promise<Meldung[]>;
  meldung(id: string): Promise<Meldung | null>;
  statusSetzen(id: string, status: Status): Promise<boolean>;
  notizSetzen(id: string, notiz: string): Promise<boolean>;
  audit(e: AuditEintrag): Promise<void>;
}

export function istDemo(): boolean {
  return process.env.COCKPIT_DEMO === "1";
}
