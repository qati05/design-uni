// Was der Betrieb selbst ändert: Öffnungszeiten, Feiertage, Hinweis-Leiste, Team. Liegt in astro/src/daten/site.json.
// Ein Schema für alle: der Website-Bau prüft die Datei damit, das Cockpit und der Editor schreiben nur, was es erlaubt.
import { z } from "zod";

const ohneSteuerzeichen = /^[^\p{Cc}\p{Cf}<>]*$/u;
const text = (max: number) => z.string().trim().max(max).regex(ohneSteuerzeichen, "Unerlaubte Zeichen");
export const uhrzeit = z.string().trim().regex(/^([01]?\d|2[0-3])\.[0-5]\d$/, "Zeit als 7.30 oder 17.15");

export const HINWEIS_LINKS = [
  { wert: "/schaden-melden/", text: "Schaden melden" },
  { wert: "/schaden-melden/?art=hagel", text: "Schaden melden (Hagel)" },
  { wert: "/tesla/", text: "Tesla" },
  { wert: "/kontakt/", text: "Kontakt" },
  { wert: "/occasionen/", text: "Occasionen" },
  { wert: "/team/", text: "Team" },
] as const;

/** Teamfoto: Startbild der bisherigen Website (im Repo) oder ein Bild im Bild-Speicher (R2), Name ist eine UUID.
 *  Neue Fotos kommen nie ins Git: Löschen soll das Bild wirklich entfernen. */
export const TEAMFOTO = /^(\/bilder\/team\/[a-z0-9-]{2,80}\.webp|https:\/\/[a-z0-9.-]+\/team\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|jpg|png))$/;

export function minuten(t: string): number {
  const [h, m] = t.split(".").map(Number) as [number, number];
  return h * 60 + m;
}

const fenster = z.object({ von: uhrzeit, bis: uhrzeit }).strict().refine((f) => minuten(f.von) < minuten(f.bis), "«bis» muss nach «von» liegen");
export const siteSchema = z.object({
  _hinweis: z.string().optional(),
  hinweis: z.object({ aktiv: z.boolean(), text: text(120), link: z.enum(HINWEIS_LINKS.map((l) => l.wert) as [string, ...string[]]) }).strict()
    .refine((h) => !h.aktiv || h.text.length >= 3, "Hinweis braucht einen Text"),
  zeiten: z.array(z.object({
    tage: text(40).min(2), kurz: text(20).min(2),
    wochentage: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])).min(1).max(7),
    geschlossen: z.boolean(), fenster: z.array(fenster).max(2),
  }).strict().refine((t) => t.geschlossen || t.fenster.length > 0, "Offen braucht mindestens ein Zeitfenster")).min(1).max(7),
  ausnahmen: z.array(z.object({
    name: text(60).min(2), datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum fehlt"), geschlossen: z.boolean(),
    von: uhrzeit.optional(), bis: uhrzeit.optional(),
  }).strict().refine((a) => a.geschlossen || (a.von && a.bis && minuten(a.von) < minuten(a.bis)), "Offen braucht «von» und «bis»")).max(40),
  team: z.array(z.object({
    name: text(40).min(2),
    leute: z.array(z.object({
      name: text(80).min(2), rolle: text(80),
      foto: z.string().max(200).regex(TEAMFOTO, "Foto ungültig").optional(),
      email: z.email("Mail-Adresse ungültig").max(120).optional(),
    }).strict()).max(30),
  }).strict()).max(12),
}).strict();
export type Site = z.infer<typeof siteSchema>;

/** Wie die Website die Zeiten im ersten Bildschirm schreibt. */
export function zeitenZeile(p: Pick<Site, "zeiten">): string {
  return p.zeiten.filter((z) => !z.geschlossen && z.fenster.length).map((z) => `${z.kurz} ${z.fenster.map((f) => `${f.von} bis ${f.bis}`).join(" und ")} Uhr`).join(", ");
}

/** Alle Teamfotos im Bild-Speicher (für das Aufräumen nach dem Speichern). */
export function speicherFotos(p: Pick<Site, "team">): string[] {
  return p.team.flatMap((g) => g.leute.map((l) => l.foto).filter((f): f is string => !!f && f.startsWith("https://")));
}
