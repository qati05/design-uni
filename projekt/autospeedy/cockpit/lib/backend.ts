// Eine Schnittstelle für Anmeldung und Daten, zwei Umsetzungen:
//   supabase (echter Betrieb, Muster aus qati05/medaur) und demo (lokal, ohne fremde Dienste, alles als Demo gekennzeichnet).
import type { Meldung, Status } from "./status";
import type { Pflege } from "./pflege";

/** Stand der Website-Pflege: Inhalt von site.json und ihre Version (sha) für den Konfliktschutz beim Speichern. */
export type PflegeStand = { daten: Pflege; sha: string; geaendert: string | null; von: string | null };
export type PflegeSpeichern = "ok" | "konflikt" | "fehler" | "unklar" | "nicht_eingerichtet";

export type SitzungsStand = { userId: string; email: string; aal: "aal1" | "aal2"; naechste: "aal1" | "aal2"; mitglied: boolean } | null;
export type CodeAntwort = { status: "gesendet" | "zu_viele" | "fehler" };
export type Zaehlzeile = { tag: string; punkt: string; ort: string; anzahl: number };
export type Rp = { rpId: string; origin: string };
/** Fingerabdruck/Gesicht (WebAuthn): Optionen für navigator.credentials, als JSON (base64url). */
export type PasskeyStart = { status: "bereit"; vorgang: string; art: "create" | "request"; optionen: Record<string, unknown> } | { status: "kein_faktor" | "nicht_erlaubt" | "fehler" };
export type PasskeyAntwort = { status: "ok" | "falsch" | "fehler" };
export type Geraet = { id: string; name: string };
export type AuftragAnsicht = { art: string; tesla: boolean; erstellt: string; mitMail: boolean };
export type BewertungFaellig = { id: string; email: string; name: string; website: string; betrieb: string };
export type BetriebZeile = { id: string; name: string; aktiv: boolean };
export type ExportZeile = { erstellt: string; art: string; tesla: boolean; tesla_modell: string | null; stellen: string; bemerkung: string; name: string; telefon: string; email: string | null; quelle: string; status: string; notiz: string };
export type AuditEintrag = { aktion: string; ergebnis: "ok" | "abgelehnt" | "fehler"; ziel?: string };

export interface Backend {
  readonly art: "supabase" | "demo";
  codeAnfordern(email: string): Promise<CodeAntwort>;
  codePruefen(email: string, code: string): Promise<boolean>;
  sitzung(): Promise<SitzungsStand>;
  /** Eingerichtete Geräte mit Fingerabdruck/Gesicht (zweiter Schritt). */
  zweitfaktoren(): Promise<{ geraete: Geraet[] }>;
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
  /** «Auto fertig» per Mail-Link (der Link steht schon in der ersten Mail): ansehen und einlösen, ohne Login, nur mit Token. */
  auftragAnsehen(token: string): Promise<AuftragAnsicht | null>;
  auftragErledigt(token: string): Promise<boolean>;
  /** Versand der Bewertungs-Mails (Zeitplan, mit Geheimnis): fällige holen, Fehlschläge zurücklegen. */
  bewertungenAbholen(geheimnis: string): Promise<BewertungFaellig[] | null>;
  bewertungZuruecklegen(geheimnis: string, id: string): Promise<void>;
  /** Löschfrist (Zeitplan, mit Geheimnis): erst abgelaufene Fotos aus dem Speicher, dann die Meldungen. */
  aufraeumen(geheimnis: string): Promise<{ fotos: number; meldungen: number } | null>;
  /** Studio (Medaur): Betriebe auflisten und pro Betrieb die Meldungen als CSV exportieren (z. B. bei Kündigung). */
  istStudioAdmin(): Promise<boolean>;
  betriebe(): Promise<BetriebZeile[]>;
  exportMeldungen(betrieb: string): Promise<ExportZeile[] | null>;
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
