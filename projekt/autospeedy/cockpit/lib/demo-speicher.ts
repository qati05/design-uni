// Gemeinsamer Speicher des Demo-Modus im Prozess (globalThis, damit Proxy, Aktionen und API dieselben Daten sehen).
// Nur Demo: nichts davon verlässt den Rechner. Es gibt keine Kundendaten, nur Anmelde-Codes, die Pflege und Teamfotos.
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { pflegeSchema, type Pflege } from "./pflege";
import siteStart from "../../astro/src/daten/site.json";

export const DEMO_MITGLIED = { userId: "demo-werkstatt", email: "werkstatt@autospeedy.example", name: "Werkstatt (Demo)" };
/** Demo: Konto ohne Mitgliedschaft (zeigt den 403-Fall). */
export const DEMO_FREMD = { userId: "demo-fremd", email: "fremd@beispiel.example" };
export const DEMO_COOKIE = "as_demo_sitzung";
export const DEMO_SITZUNG_SEKUNDEN = 60 * 60 * 24 * 30;

export type PostfachMail = { id: string; zeit: string; an: string; betreff: string; text: string };
type Speicher = { codes: Map<string, { code: string; bis: number; versuche: number }>; postfach: PostfachMail[]; audit: { zeit: string; aktion: string; ergebnis: string; ziel?: string }[]; anfragen: number[];
  pflege: { daten: Pflege; sha: string; geaendert: string | null; von: string | null }; fotos: Map<string, { typ: string; bytes: Uint8Array }>;
  /** Frühere Stände (spielt die Commits an site.json), neuester zuerst. */
  verlauf: { id: string; zeit: string; daten: Pflege }[] };

const g = globalThis as unknown as { __asDemo?: Speicher };
export function speicher(): Speicher {
  if (!g.__asDemo) {
    const daten = startPflege(), sha = randomBytes(20).toString("hex");
    g.__asDemo = { codes: new Map(), postfach: [], audit: [], anfragen: [], pflege: { daten, sha, geaendert: null, von: null }, fotos: new Map(), verlauf: [{ id: sha, zeit: new Date().toISOString(), daten: structuredClone(daten) }] };
  }
  return g.__asDemo;
}

/** Startstand der Demo: dieselbe site.json, aus der die Website gebaut wird. */
function startPflege(): Pflege {
  return pflegeSchema.parse(structuredClone(siteStart));
}

export function neueId(): string {
  return randomBytes(9).toString("base64url");
}
export function sechsZiffern(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

// ---------- signierte Sitzung (Cookie), statt Datenbank: Inhalt {uid, email, t}
function schluessel(): string {
  return process.env.DEMO_GEHEIMNIS || "demo-nur-lokal-nicht-fuer-den-betrieb";
}
export function sitzungSignieren(daten: { uid: string; email: string }): string {
  const roh = Buffer.from(JSON.stringify({ ...daten, t: Date.now() })).toString("base64url");
  const sig = createHmac("sha256", schluessel()).update(roh).digest("base64url");
  return `${roh}.${sig}`;
}
export function sitzungLesen(wert: string | undefined): { uid: string; email: string; t: number } | null {
  if (!wert || !wert.includes(".")) return null;
  const [roh, sig] = wert.split(".") as [string, string];
  const soll = createHmac("sha256", schluessel()).update(roh).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(soll);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const d = JSON.parse(Buffer.from(roh, "base64url").toString("utf8"));
    if (Date.now() - d.t > DEMO_SITZUNG_SEKUNDEN * 1000) return null; // wie im Betrieb: 30 Tage angemeldet
    return d;
  } catch { return null; }
}

export function postfachSchreiben(an: string, betreff: string, text: string) {
  speicher().postfach.unshift({ id: neueId(), zeit: new Date().toISOString(), an, betreff, text });
}
