import { z } from "zod";

export const emailSchema = z.object({ email: z.email("Mail-Adresse ungültig").max(254) }).strict();
export const mailCodeSchema = z.object({ email: z.email().max(254), code: z.string().regex(/^\d{6}$/, "Code hat 6 Ziffern") }).strict();
