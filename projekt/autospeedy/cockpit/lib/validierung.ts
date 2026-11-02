import { z } from "zod";
import { STATUS } from "./status";

const ohneSteuerzeichen = /^(?:[^\p{Cc}\p{Cf}]|[\n\t])*$/u;

export const totpSchema = z.object({ code: z.string().regex(/^\d{6}$/, "Code hat 6 Ziffern") }).strict();
export const emailSchema = z.object({ email: z.email("Mail-Adresse ungültig").max(254) }).strict();
export const mailCodeSchema = z.object({ email: z.email().max(254), code: z.string().regex(/^\d{6}$/, "Code hat 6 Ziffern") }).strict();
export const idSchema = z.string().regex(/^[A-Za-z0-9_-]{6,64}$/, "Meldung unbekannt");
export const statusSchema = z.object({ id: idSchema, status: z.enum(STATUS) }).strict();
export const notizSchema = z.object({ id: idSchema, notiz: z.string().max(2000, "Notiz höchstens 2000 Zeichen").regex(ohneSteuerzeichen, "Notiz enthält Steuerzeichen") }).strict();

// Meldung von der Website (gleiche Regeln wie functions/api/schaden.js der Website)
export const ARTEN = ["Parkschaden", "Unfall", "Hagel", "Kratzer oder Lack", "Scheibe", "Felge", "Etwas anderes"] as const;
export const meldungEingangSchema = z.object({
  art: z.enum(ARTEN),
  name: z.string().trim().min(1).max(120),
  telefon: z.string().trim().regex(/^[+0-9 ()./-]{6,40}$/),
  bemerkung: z.string().trim().max(3000).default(""),
  tesla: z.boolean().default(false),
  stellen: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
}).strict();

/** Nur relative Pfade innerhalb des Cockpits (offene Weiterleitungen verhindern). Aus medaur übernommen. */
export function sichererPfad(weiter: unknown, standard = "/"): string {
  if (typeof weiter !== "string") return standard;
  if (!/^\/[A-Za-z0-9/_-]*$/.test(weiter) || weiter.startsWith("//")) return standard;
  return weiter;
}
