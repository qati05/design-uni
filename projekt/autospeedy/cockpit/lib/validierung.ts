import { z } from "zod";
import { STATUS } from "./status";

const ohneSteuerzeichen = /^(?:[^\p{Cc}\p{Cf}]|[\n\t])*$/u;

export const emailSchema = z.object({ email: z.email("Mail-Adresse ungültig").max(254) }).strict();
export const mailCodeSchema = z.object({ email: z.email().max(254), code: z.string().regex(/^\d{6}$/, "Code hat 6 Ziffern") }).strict();
export const idSchema = z.string().regex(/^[A-Za-z0-9_-]{6,64}$/, "Meldung unbekannt");
export const statusSchema = z.object({ id: idSchema, status: z.enum(STATUS) }).strict();
export const notizSchema = z.object({ id: idSchema, notiz: z.string().max(2000, "Notiz höchstens 2000 Zeichen").regex(ohneSteuerzeichen, "Notiz enthält Steuerzeichen") }).strict();

/** Nur relative Pfade innerhalb des Cockpits (offene Weiterleitungen verhindern). Aus medaur übernommen. */
export function sichererPfad(weiter: unknown, standard = "/"): string {
  if (typeof weiter !== "string") return standard;
  if (!/^\/[A-Za-z0-9/_-]*$/.test(weiter) || weiter.startsWith("//")) return standard;
  return weiter;
}
