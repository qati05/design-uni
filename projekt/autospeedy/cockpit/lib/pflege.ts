// Pflege der Website im Cockpit: Öffnungszeiten, Ausnahmen (Feiertage, Ferien), Hinweis-Leiste, Team.
// Dieselbe Form wie astro/src/content/pflege.json und team.json; der Website-Bau liest sie (astro/bau/pflege-holen.mjs).
import { z } from "zod";

const ohneSteuerzeichen = /^[^\p{Cc}\p{Cf}<>]*$/u;
const text = (max: number) => z.string().trim().max(max).regex(ohneSteuerzeichen, "Unerlaubte Zeichen");
export const uhrzeit = z.string().trim().regex(/^([01]?\d|2[0-3])\.[0-5]\d$/, "Zeit als 7.30 oder 17.15");
const LINKS = ["/schaden-melden/", "/schaden-melden/?art=hagel", "/tesla/", "/kontakt/", "/occasionen/", "/team/"] as const;
export const HINWEIS_LINKS: readonly { wert: string; text: string }[] = [
  { wert: "/schaden-melden/", text: "Schaden melden" },
  { wert: "/schaden-melden/?art=hagel", text: "Schaden melden (Hagel)" },
  { wert: "/tesla/", text: "Tesla" },
  { wert: "/kontakt/", text: "Kontakt" },
  { wert: "/occasionen/", text: "Occasionen" },
  { wert: "/team/", text: "Team" },
];

/** Teamfoto: Startbilder der Website, Demo-Upload (data:), oder öffentlicher Supabase-Bucket «teamfotos». */
export const fotoSchema = z.string().max(2_800_000).regex(/^(\/bilder\/team\/[a-z0-9-]{2,80}\.webp|data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+|https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/teamfotos\/[A-Za-z0-9._-]{8,120})$/, "Foto ungültig");
const fenster = z.object({ von: uhrzeit, bis: uhrzeit }).strict().refine((f) => minuten(f.von) < minuten(f.bis), "«bis» muss nach «von» liegen");
export const pflegeSchema = z.object({
  hinweis: z.object({ aktiv: z.boolean(), text: text(120), link: z.enum(LINKS) }).strict()
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
    leute: z.array(z.object({ name: text(80).min(2), rolle: text(80), foto: fotoSchema.optional(), email: z.email("Mail-Adresse ungültig").max(120).optional() }).strict()).max(30),
  }).strict()).max(12),
}).strict();
export type Pflege = z.infer<typeof pflegeSchema>;

export function minuten(t: string): number {
  const [h, m] = t.split(".").map(Number) as [number, number];
  return h * 60 + m;
}

/** Wie die Website die Zeiten im ersten Bildschirm schreibt (astro/bau/daten.mjs zeitenKurz). */
export function zeitenZeile(p: Pflege): string {
  return p.zeiten.filter((z) => !z.geschlossen && z.fenster.length).map((z) => `${z.kurz} ${z.fenster.map((f) => `${f.von} bis ${f.bis}`).join(" und ")} Uhr`).join(", ");
}

/** Liest das Pflege-Formular (Feldnamen wie «zeit.0.von1», «aus.2.name», «team.1.person.3.rolle»). */
export function pflegeAusFormular(form: FormData, alt: Pflege): z.ZodSafeParseResult<Pflege> {
  const w = (k: string) => String(form.get(k) ?? "").trim();
  const an = (k: string) => form.get(k) === "on";
  const zeiten = alt.zeiten.map((t, i) => {
    const geschlossen = an(`zeit.${i}.zu`);
    const f: { von: string; bis: string }[] = [];
    for (const n of [1, 2]) { const von = w(`zeit.${i}.von${n}`), bis = w(`zeit.${i}.bis${n}`); if (von || bis) f.push({ von, bis }); }
    return { ...t, geschlossen, fenster: geschlossen ? [] : f };
  });
  const ausnahmen: Pflege["ausnahmen"] = [];
  for (let i = 0; i < 41; i++) {
    if (!form.has(`aus.${i}.datum`) || an(`aus.${i}.weg`)) continue;
    const datum = w(`aus.${i}.datum`), name = w(`aus.${i}.name`);
    if (!datum && !name) continue; // leere neue Zeile
    const geschlossen = w(`aus.${i}.art`) !== "offen";
    ausnahmen.push(geschlossen ? { name, datum, geschlossen } : { name, datum, geschlossen, von: w(`aus.${i}.von`), bis: w(`aus.${i}.bis`) });
  }
  ausnahmen.sort((a, b) => a.datum.localeCompare(b.datum));
  const team = alt.team.map((g, gi) => {
    const leute: { name: string; rolle: string; foto?: string; email?: string }[] = [];
    for (let pi = 0; pi < 31; pi++) {
      if (!form.has(`team.${gi}.p.${pi}.name`) || an(`team.${gi}.p.${pi}.weg`)) continue;
      const name = w(`team.${gi}.p.${pi}.name`), rolle = w(`team.${gi}.p.${pi}.rolle`);
      if (!name && !rolle) continue;
      const foto = an(`team.${gi}.p.${pi}.fotoweg`) ? "" : w(`team.${gi}.p.${pi}.foto`), email = w(`team.${gi}.p.${pi}.email`);
      leute.push({ name, rolle, ...(foto ? { foto } : {}), ...(email ? { email } : {}) });
    }
    return { name: g.name, leute };
  });
  return pflegeSchema.safeParse({
    hinweis: { aktiv: an("hinweis.aktiv"), text: w("hinweis.text"), link: w("hinweis.link") || alt.hinweis.link },
    zeiten, ausnahmen, team,
  });
}

/** Erste Fehlermeldung in Alltagssprache, mit Ort. */
export function pflegeFehler(e: z.ZodError): string {
  const i = e.issues[0];
  if (!i) return "Bitte Eingaben prüfen.";
  const [bereich, nr] = i.path as (string | number)[];
  const wo = bereich === "zeiten" ? `Öffnungszeiten, Zeile ${Number(nr) + 1}` : bereich === "ausnahmen" ? `Ausnahmen, Zeile ${Number(nr) + 1}` : bereich === "team" ? `Team, Gruppe ${Number(nr) + 1}` : "Hinweis-Leiste";
  return `${wo}: ${i.message}`;
}
