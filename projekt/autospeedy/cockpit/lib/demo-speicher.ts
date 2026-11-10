// Gemeinsamer Speicher des Demo-Modus im Prozess (globalThis, damit Aktionen und API dieselben Daten sehen).
// Nur Demo: nichts davon verlässt den Rechner. Es gibt keine Kundendaten, nur die Pflege und Teamfotos.
import { randomBytes } from "node:crypto";
import { pflegeSchema, type Pflege } from "./pflege";
import siteStart from "../../astro/src/daten/site.json";

/** Die Demo zeigt das Cockpit, wie es eine angemeldete Person der Werkstatt sieht. */
export const DEMO_MITGLIED = { email: "werkstatt@autospeedy.example" };

type Speicher = {
  pflege: { daten: Pflege; sha: string; geaendert: string | null }; fotos: Map<string, { typ: string; bytes: Uint8Array }>;
  /** Frühere Stände (spielt die Commits an site.json), neuester zuerst. */
  verlauf: { id: string; zeit: string; daten: Pflege }[] };

const g = globalThis as unknown as { __asDemo?: Speicher };
export function speicher(): Speicher {
  if (!g.__asDemo) {
    const daten = startPflege(), sha = randomBytes(20).toString("hex");
    g.__asDemo = { pflege: { daten, sha, geaendert: null }, fotos: new Map(), verlauf: [{ id: sha, zeit: new Date().toISOString(), daten: structuredClone(daten) }] };
  }
  return g.__asDemo;
}

/** Startstand der Demo: dieselbe site.json, aus der die Website gebaut wird. */
function startPflege(): Pflege {
  return pflegeSchema.parse(structuredClone(siteStart));
}
