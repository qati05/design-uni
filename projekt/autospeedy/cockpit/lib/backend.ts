// Eine Schnittstelle für Anmeldung und Daten, zwei Umsetzungen:
//   supabase (echter Betrieb, Muster aus qati05/medaur) und demo (lokal, ohne fremde Dienste, alles als Demo gekennzeichnet).
import type { Meldung, Status } from "./status";
import type { Pflege } from "./pflege";

export type PflegeStand = { daten: Pflege; geaendert: string | null; von: string | null };

export type SitzungsStand = { userId: string; email: string; aal: "aal1" | "aal2"; naechste: "aal1" | "aal2"; mitglied: boolean } | null;
export type CodeAntwort = { status: "gesendet" | "zu_viele" | "fehler" };
export type TotpAntwort = { status: "ok" | "falsch" | "kein_faktor" | "ungueltig" };
export type Einrichten = { status: "bereit"; faktorId: string; geheimnis: string; qr: string | null } | { status: "vorhanden" | "fehler" };
export type Zaehlzeile = { tag: string; punkt: string; ort: string; anzahl: number };
export type Rp = { rpId: string; origin: string };
/** Fingerabdruck/Gesicht (WebAuthn): Optionen für navigator.credentials, als JSON (base64url). */
export type PasskeyStart = { status: "bereit"; vorgang: string; art: "create" | "request"; optionen: Record<string, unknown> } | { status: "kein_faktor" | "nicht_erlaubt" | "fehler" };
export type PasskeyAntwort = { status: "ok" | "falsch" | "fehler" };
export type Geraet = { id: string; name: string };
export type AuditEintrag = { aktion: string; ergebnis: "ok" | "abgelehnt" | "fehler"; ziel?: string };

export interface Backend {
  readonly art: "supabase" | "demo";
  codeAnfordern(email: string): Promise<CodeAntwort>;
  codePruefen(email: string, code: string): Promise<boolean>;
  sitzung(): Promise<SitzungsStand>;
  totpPruefen(code: string): Promise<TotpAntwort>;
  totpEinrichten(): Promise<Einrichten>;
  totpEinrichtenBestaetigen(faktorId: string, code: string): Promise<TotpAntwort>;
  /** Eingerichtete zweite Schritte: Geräte mit Fingerabdruck/Gesicht und ob eine Authenticator-App da ist (Ersatzweg). */
  zweitfaktoren(): Promise<{ geraete: Geraet[]; totp: boolean }>;
  passkeyStart(zweck: "anmelden" | "einrichten", rp: Rp, geraetename?: string): Promise<PasskeyStart>;
  passkeyBestaetigen(vorgang: string, antwort: unknown, rp: Rp): Promise<PasskeyAntwort>;
  geraetEntfernen(id: string): Promise<boolean>;
  abmelden(): Promise<void>;
  meldungen(): Promise<Meldung[]>;
  meldung(id: string): Promise<Meldung | null>;
  statusSetzen(id: string, status: Status): Promise<boolean>;
  notizSetzen(id: string, notiz: string): Promise<boolean>;
  audit(e: AuditEintrag): Promise<void>;
  /** Zählung der letzten Tage: je Tag, Punkt und Ort die Anzahl. */
  zahlen(tage: number): Promise<Zaehlzeile[]>;
  /** Pflege der Website (Zeiten, Ausnahmen, Hinweis, Team). */
  pflegeLesen(): Promise<PflegeStand>;
  pflegeSpeichern(p: Pflege): Promise<boolean>;
  /** Speichert ein geprüftes Teamfoto und gibt die Adresse zurück, die in der Pflege steht. */
  teamFotoSpeichern(bytes: Uint8Array, typ: "image/jpeg" | "image/png" | "image/webp"): Promise<string | null>;
}

export function istDemo(): boolean {
  return process.env.COCKPIT_DEMO === "1";
}
