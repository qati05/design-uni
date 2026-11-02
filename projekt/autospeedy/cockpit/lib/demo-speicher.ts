// Gemeinsamer Speicher des Demo-Modus im Prozess (globalThis, damit Proxy, Aktionen und API dieselben Daten sehen).
// Nur Demo: nichts davon verlässt den Rechner. Alle Beispiel-Meldungen sind als Beispiel markiert.
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import type { Meldung } from "./status";

export const DEMO_MITGLIED = { userId: "demo-werkstatt", email: "werkstatt@autospeedy.example", name: "Werkstatt (Demo)" };
export const DEMO_TOTP_GEHEIMNIS = "JBSWY3DPEHPK3PXPAUTOSPEED"; // nur Demo, öffentlich bekannt
export const DEMO_COOKIE = "as_demo_sitzung";

export type PostfachMail = { id: string; zeit: string; an: string; betreff: string; text: string };
type Speicher = { codes: Map<string, { code: string; bis: number; versuche: number }>; meldungen: Meldung[]; postfach: PostfachMail[]; audit: { zeit: string; aktion: string; ergebnis: string; ziel?: string }[]; anfragen: number[] };

const g = globalThis as unknown as { __asDemo?: Speicher };
export function speicher(): Speicher {
  if (!g.__asDemo) g.__asDemo = { codes: new Map(), meldungen: beispielMeldungen(), postfach: [], audit: [], anfragen: [] };
  return g.__asDemo;
}

export function neueId(): string {
  return randomBytes(9).toString("base64url");
}
export function sechsZiffern(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

// ---------- signierte Sitzung (Cookie), statt Datenbank: Inhalt {uid, email, aal, t}
function schluessel(): string {
  return process.env.DEMO_GEHEIMNIS || "demo-nur-lokal-nicht-fuer-den-betrieb";
}
export function sitzungSignieren(daten: { uid: string; email: string; aal: "aal1" | "aal2" }): string {
  const roh = Buffer.from(JSON.stringify({ ...daten, t: Date.now() })).toString("base64url");
  const sig = createHmac("sha256", schluessel()).update(roh).digest("base64url");
  return `${roh}.${sig}`;
}
export function sitzungLesen(wert: string | undefined): { uid: string; email: string; aal: "aal1" | "aal2"; t: number } | null {
  if (!wert || !wert.includes(".")) return null;
  const [roh, sig] = wert.split(".") as [string, string];
  const soll = createHmac("sha256", schluessel()).update(roh).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(soll);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const d = JSON.parse(Buffer.from(roh, "base64url").toString("utf8"));
    if (Date.now() - d.t > 12 * 3600e3) return null; // Demo-Sitzung 12 h
    return d;
  } catch { return null; }
}

function beispielMeldungen(): Meldung[] {
  const vor = (min: number) => new Date(Date.now() - min * 60e3).toISOString();
  const b = (m: Omit<Meldung, "beispiel" | "fotos" | "notiz" | "quelle"> & Partial<Meldung>): Meldung => ({ fotos: [], notiz: "", quelle: "website", beispiel: true, ...m });
  return [
    b({ id: "beispiel01", erstellt: vor(25), art: "Hagel", tesla: true, stellen: ["Dach", "Motorhaube"], bemerkung: "BEISPIEL: Hagel gestern Abend.", name: "Beispiel Kundin A", telefon: "071 555 00 01", status: "neu" }),
    b({ id: "beispiel02", erstellt: vor(190), art: "Parkschaden", tesla: false, stellen: ["Heck-Stossstange"], bemerkung: "BEISPIEL", name: "Beispiel Kunde B", telefon: "071 555 00 02", status: "neu" }),
    b({ id: "beispiel03", erstellt: vor(60 * 26), art: "Unfall", tesla: false, stellen: ["Seite links vorne"], bemerkung: "BEISPIEL", name: "Beispiel Kunde C", telefon: "071 555 00 03", status: "offerte", notiz: "Offerte an Versicherung (Beispiel)" }),
    b({ id: "beispiel04", erstellt: vor(60 * 50), art: "Kratzer oder Lack", tesla: false, stellen: [], bemerkung: "BEISPIEL", name: "Beispiel Kundin D", telefon: "071 555 00 04", status: "auftrag" }),
    b({ id: "beispiel05", erstellt: vor(60 * 98), art: "Felge", tesla: false, stellen: ["Felgen"], bemerkung: "BEISPIEL", name: "Beispiel Kunde E", telefon: "071 555 00 05", status: "verloren" }),
    b({ id: "beispiel06", erstellt: vor(60 * 120), art: "Scheibe", tesla: true, stellen: ["Frontscheibe"], bemerkung: "BEISPIEL", name: "Beispiel Kunde F", telefon: "071 555 00 06", status: "erledigt", quelle: "whatsapp" }),
  ];
}

export function postfachSchreiben(an: string, betreff: string, text: string) {
  speicher().postfach.unshift({ id: neueId(), zeit: new Date().toISOString(), an, betreff, text });
}
