// Pflege der Website im Cockpit: Öffnungszeiten, Ausnahmen (Feiertage, Ferien), Hinweis-Leiste, Team.
// Regeln und Form kommen aus gemeinsam/site.ts (dieselben wie beim Website-Bau); hier nur das Formular des Cockpits.
import type { z } from "zod";
import { siteSchema, type Site } from "../../gemeinsam/site";
export { HINWEIS_ARTEN, HINWEIS_LINKS, HINWEIS_POPUP_ARTEN, TEAMFOTO, minuten, speicherFotos, zeitenZeile } from "../../gemeinsam/site";

export const pflegeSchema = siteSchema;
export type Pflege = Site;

/** Abschnitte der Pflege-Seite (Sprungmarken oben auf der Seite; die id steht am jeweiligen Abschnitt im Formular). */
export const ABSCHNITTE = [
  { id: "hinweise", name: "Hinweise" },
  { id: "zeiten", name: "Öffnungszeiten" },
  { id: "ausnahmen", name: "Feiertage und Ferien" },
  { id: "team", name: "Team" },
  { id: "inhaber", name: "Inhaber" },
  { id: "bewertungen", name: "Bewertungen" },
] as const;

/** Demo: Der Bild-Speicher wird vom Cockpit gespielt; Fotos liegen im Speicher und kommen über /api/demo-foto. */
export const DEMO_FOTO_BASIS = "https://demo-fotos.invalid";
export function fotoAnzeige(url: string): string {
  return url.startsWith(DEMO_FOTO_BASIS + "/team/") ? `/api/demo-foto/${url.slice(DEMO_FOTO_BASIS.length + 6)}` : url;
}

/** Fotos im neuen Stand müssen aus dem alten Stand stammen oder eben hochgeladen sein: sonst könnte jemand eine fremde
 *  Adresse eintragen und beim späteren Entfernen ein fremdes Bild löschen lassen. */
export function fotosErlaubt(neu: Pflege, alt: Pflege, hochgeladen: string[]): boolean {
  const ok = new Set([...alt.team.flatMap((g) => g.leute.map((l) => l.foto)), ...hochgeladen]);
  return neu.team.every((g) => g.leute.every((l) => !l.foto || ok.has(l.foto)));
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
    const leute: { name: string; rolle: string; foto?: string; email?: string; einverstaendnis: boolean }[] = [];
    for (let pi = 0; pi < 31; pi++) {
      if (!form.has(`team.${gi}.p.${pi}.name`) || an(`team.${gi}.p.${pi}.weg`)) continue;
      const name = w(`team.${gi}.p.${pi}.name`), rolle = w(`team.${gi}.p.${pi}.rolle`);
      if (!name && !rolle) continue;
      const foto = an(`team.${gi}.p.${pi}.fotoweg`) ? "" : w(`team.${gi}.p.${pi}.foto`), email = w(`team.${gi}.p.${pi}.email`);
      leute.push({ name, rolle, ...(foto ? { foto } : {}), ...(email ? { email } : {}), einverstaendnis: an(`team.${gi}.p.${pi}.einverstaendnis`) });
    }
    return { name: g.name, leute };
  });
  const hinweise: unknown[] = [];
  for (let i = 0; i < 4; i++) {
    if (!form.has(`hin.${i}.art`) || an(`hin.${i}.weg`)) continue;
    const titel = w(`hin.${i}.titel`), text = w(`hin.${i}.text`);
    if (!titel && !text) continue; // leere neue Zeile
    hinweise.push({ art: w(`hin.${i}.art`), form: w(`hin.${i}.form`) || "banner", titel, text, link: w(`hin.${i}.link`), von: w(`hin.${i}.von`), bis: w(`hin.${i}.bis`) });
  }
  const stimme = { text: w("stimme.text"), name: w("stimme.name"), rolle: w("stimme.rolle"), freigegeben: an("stimme.freigegeben") };
  return pflegeSchema.safeParse({
    ...(alt._hinweis ? { _hinweis: alt._hinweis } : {}),
    hinweise, zeiten, ausnahmen, team,
    ...(alt.stimme || stimme.text || stimme.name || stimme.rolle ? { stimme } : {}),
    bewertungen: { zeigen: an("bewertungen.zeigen") },
  });
}

/** Erste Fehlermeldung in Alltagssprache, mit Ort. */
export function pflegeFehler(e: z.ZodError): string {
  const i = e.issues[0];
  if (!i) return "Bitte Eingaben prüfen.";
  const [bereich, nr] = i.path as (string | number)[];
  const wo = bereich === "zeiten" ? `Öffnungszeiten, Zeile ${Number(nr) + 1}` : bereich === "ausnahmen" ? `Ausnahmen, Zeile ${Number(nr) + 1}` : bereich === "team" ? `Team, Gruppe ${Number(nr) + 1}` : bereich === "stimme" ? "Satz vom Inhaber" : nr === undefined ? "Hinweise" : `Hinweis ${Number(nr) + 1}`;
  return `${wo}: ${i.message}`;
}
