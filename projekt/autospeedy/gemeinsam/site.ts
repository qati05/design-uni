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
export const TEAMFOTO = /^(\/bilder\/team\/[a-z0-9-]{2,80}\.(webp|jpg)|https:\/\/[a-z0-9.-]+\/team\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|jpg|png))$/;

export function minuten(t: string): number {
  const [h, m] = t.split(".").map(Number) as [number, number];
  return h * 60 + m;
}

// Hinweis-Vorlagen (BAUPLAN 4.2): feste Designs im Stil C. Der Betrieb wählt Art, Form und Zeitraum und schreibt den Text.
export const HINWEIS_ARTEN = ["hagel", "ferien", "geschlossen", "aktion", "info"] as const;
// Pop-up ist nur für diese Arten erlaubt (4.2: hagel und aktion dürfen Banner oder Pop-up sein; die übrigen nur Banner).
export const HINWEIS_POPUP_ARTEN = ["hagel", "aktion"] as const;
const datum = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum als JJJJ-MM-TT");
const hinweisLink = z.enum(["", ...HINWEIS_LINKS.map((l) => l.wert)] as [string, ...string[]]);
const hinweisEintrag = z.object({
  art: z.enum(HINWEIS_ARTEN),
  form: z.enum(["banner", "popup"]).default("banner"),
  titel: text(50),
  text: text(160).refine((t) => t.trim().length >= 3, "Hinweis braucht einen Text"),
  link: hinweisLink.default(""),
  von: datum,
  bis: datum,
}).strict()
  .refine((h) => h.von <= h.bis, "«bis» darf nicht vor «von» liegen")
  .refine((h) => h.form !== "popup" || (HINWEIS_POPUP_ARTEN as readonly string[]).includes(h.art), "Pop-up nur für Hagel und Aktion (4.2)");
export type Hinweis = z.infer<typeof hinweisEintrag>;

const fenster = z.object({ von: uhrzeit, bis: uhrzeit }).strict().refine((f) => minuten(f.von) < minuten(f.bis), "«bis» muss nach «von» liegen");
// Das Objekt-Schema (Felder) getrennt vom fertigen siteSchema, das zusätzlich migriert und prüft (Transform unten).
// So bleiben die Felder über .shape erreichbar (Editor-Abgleich), obwohl siteSchema ein Transform ist.
export const siteFelder = z.object({
  _hinweis: z.string().optional(),
  // Altfeld (eine einzelne Leiste). Bleibt gültig; wird per Transform zu einem info-Banner in «hinweise» (4.2).
  hinweis: z.object({ aktiv: z.boolean(), text: text(120), link: z.enum(HINWEIS_LINKS.map((l) => l.wert) as [string, ...string[]]) }).strict()
    .refine((h) => !h.aktiv || h.text.length >= 3, "Hinweis braucht einen Text").optional(),
  // Neue Liste der Hinweis-Vorlagen: höchstens 3, höchstens ein Pop-up (Prüfung nach der Migration, s. unten).
  hinweise: z.array(hinweisEintrag).max(3).optional(),
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
      // Zustimmung der Person, auf der Website gezeigt zu werden. Vorgabe false; alte site.json ohne Feld wird so migriert.
      einverstaendnis: z.boolean().default(false),
    }).strict()).max(30),
  }).strict()).max(12),
  // Satz vom Inhaber (BAUPLAN 4.2). Nur mit freigegeben: true sichtbar, sonst Platzhalter. Kein < und >.
  // Optional, damit die bestehende site.json ohne dieses Feld gültig bleibt.
  stimme: z.object({
    text: text(240), name: text(60), rolle: text(40),
    freigegeben: z.boolean().default(false),
  }).strict().optional(),
  // Schalter, ob der Google-Bewertungsabschnitt erscheint (BAUPLAN 4.2/4.3). Vorgabe true; fehlt das Feld, gilt {zeigen:true}.
  bewertungen: z.object({ zeigen: z.boolean().default(true) }).strict().default({ zeigen: true }),
}).strict();

// Migration (BAUPLAN 4.2): das alte Einzelfeld «hinweis» wird zu einem info-Banner in «hinweise» (ganz vorn, immer sichtbar).
// Danach gelten höchstens 3 Hinweise und höchstens ein Pop-up — gemessen an der migrierten Liste.
const ALT_VON = "1970-01-01", ALT_BIS = "9999-12-31";
export const siteSchema = siteFelder.transform((s) => {
  const liste: Hinweis[] = [...(s.hinweise ?? [])];
  if (s.hinweis && s.hinweis.aktiv && s.hinweis.text.trim().length >= 3) {
    liste.unshift({ art: "info", form: "banner", titel: "", text: s.hinweis.text, link: s.hinweis.link, von: ALT_VON, bis: ALT_BIS });
  }
  const { hinweis: _alt, ...rest } = s;
  return { ...rest, hinweise: liste };
}).superRefine((s, ctx) => {
  if (s.hinweise.length > 3) ctx.addIssue({ code: "custom", path: ["hinweise"], message: "höchstens 3 Hinweise (inkl. migriertem Altfeld)" });
  if (s.hinweise.filter((h) => h.form === "popup").length > 1) ctx.addIssue({ code: "custom", path: ["hinweise"], message: "höchstens ein Pop-up gleichzeitig" });
});
export type Site = z.infer<typeof siteSchema>;

/** Datum JJJJ-MM-TT in der Zeitzone Europe/Zurich (Build zeigt nur Hinweise mit von ≤ heute ≤ bis). */
export function heuteZuerich(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** Hinweise, die am Stichtag (JJJJ-MM-TT) im Zeitraum liegen. */
export function sichtbareHinweise(hinweise: Hinweis[] | undefined, heute: string): Hinweis[] {
  return (hinweise ?? []).filter((h) => h.von <= heute && heute <= h.bis);
}

/** Wie die Website die Zeiten im ersten Bildschirm schreibt. */
export function zeitenZeile(p: Pick<Site, "zeiten">): string {
  return p.zeiten.filter((z) => !z.geschlossen && z.fenster.length).map((z) => `${z.kurz} ${z.fenster.map((f) => `${f.von} bis ${f.bis}`).join(" und ")} Uhr`).join(", ");
}

/** Alle Teamfotos im Bild-Speicher (für das Aufräumen nach dem Speichern). */
export function speicherFotos(p: Pick<Site, "team">): string[] {
  return p.team.flatMap((g) => g.leute.map((l) => l.foto).filter((f): f is string => !!f && f.startsWith("https://")));
}
