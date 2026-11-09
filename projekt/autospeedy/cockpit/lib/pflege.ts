// Pflege der Website im Cockpit. Regeln und Form kommen aus gemeinsam/site.ts (dieselben wie beim Website-Bau).
// Hier: der Entwurf, den das Cockpit im Browser bearbeitet, sein Weg zurück in site.json und die Liste der Änderungen in Alltagssprache.
import type { z } from "zod";
import { BILD_PLAETZE, HINWEIS_POPUP_ARTEN, siteSchema, speicherFotos, zeitenZeile, type BildPlatz, type Site } from "../../gemeinsam/site";
export { BILD_PLAETZE, FAQ_PLATZHALTER, HINWEIS_ARTEN, HINWEIS_LINKS, HINWEIS_POPUP_ARTEN, TEAMFOTO, minuten, speicherFotos, telefonCH, zeitenZeile } from "../../gemeinsam/site";
export type { BildPlatz } from "../../gemeinsam/site";

export const pflegeSchema = siteSchema;
export type Pflege = Site;

/** Bereiche des Cockpits (Seitenleiste am Computer, Liste auf dem Handy). Die id steht in der Adresse hinter «#». */
export const BEREICHE = [
  { id: "hinweise", name: "Hinweise", gruppe: "Aktuell" },
  { id: "zeiten", name: "Öffnungszeiten", gruppe: "Aktuell" },
  { id: "ausnahmen", name: "Feiertage und Ferien", gruppe: "Aktuell" },
  { id: "team", name: "Team", gruppe: "Inhalte" },
  { id: "fragen", name: "Häufige Fragen", gruppe: "Inhalte" },
  { id: "fotos", name: "Fotos", gruppe: "Inhalte" },
  { id: "partner", name: "Partner", gruppe: "Inhalte" },
  { id: "inhaber", name: "Inhaber und Bewertungen", gruppe: "Inhalte" },
  { id: "kontakt", name: "Kontakt", gruppe: "Betrieb" },
  { id: "besucher", name: "Besucher", gruppe: "Betrieb" },
  { id: "verlauf", name: "Verlauf", gruppe: "Betrieb" },
] as const;
export type BereichId = (typeof BEREICHE)[number]["id"];

/** Demo: Der Bild-Speicher wird vom Cockpit gespielt; Fotos liegen im Speicher und kommen über /api/demo-foto. */
export const DEMO_FOTO_BASIS = "https://demo-fotos.invalid";
export function fotoAnzeige(url: string): string {
  const m = url.startsWith(DEMO_FOTO_BASIS + "/") ? /^\/(team|bild)\/([^/]+)$/.exec(url.slice(DEMO_FOTO_BASIS.length)) : null;
  return m ? `/api/demo-foto/${m[2]}` : url;
}

// ---------- Entwurf: was im Browser bearbeitet wird. Leere Zeilen und leere Felder sind erlaubt, bis veröffentlicht wird.
export type EntwurfHinweis = { art: Pflege["hinweise"][number]["art"]; form: "banner" | "popup"; titel: string; text: string; link: string; von: string; bis: string };
export type EntwurfPerson = { name: string; rolle: string; foto?: string; email: string; einverstaendnis: boolean };
export type EntwurfBild = { foto: string; alt: string; b: number; h: number };
export type EntwurfPartner = { name: string; logo?: string; b?: number; h?: number };
type Fenster = { von: string; bis: string };
export type Entwurf = {
  hinweise: EntwurfHinweis[];
  zeiten: (Omit<Pflege["zeiten"][number], "fenster"> & { fenster: [Fenster, Fenster] })[];
  ausnahmen: { name: string; datum: string; geschlossen: boolean; von: string; bis: string }[];
  team: { name: string; leute: EntwurfPerson[] }[];
  stimme: { text: string; name: string; rolle: string; freigegeben: boolean };
  bewertungen: { zeigen: boolean };
  /** null: Die Website zeigt ihre eigenen Standardfragen (site.json hat noch keine Liste). */
  faq: { frage: string; antwort: string }[] | null;
  kontakt: { telefon: string; mail: string; whatsapp: string };
  partner: EntwurfPartner[] | null;
  bilder: Partial<Record<BildPlatz, EntwurfBild>>;
};

export function entwurfAus(p: Pflege): Entwurf {
  return structuredClone({
    hinweise: p.hinweise.map((h) => ({ ...h })),
    zeiten: p.zeiten.map((t) => ({ ...t, fenster: [t.fenster[0] ?? { von: "", bis: "" }, t.fenster[1] ?? { von: "", bis: "" }] as [Fenster, Fenster] })),
    ausnahmen: p.ausnahmen.map((a) => ({ name: a.name, datum: a.datum, geschlossen: a.geschlossen, von: a.von ?? "", bis: a.bis ?? "" })),
    team: p.team.map((g) => ({ name: g.name, leute: g.leute.map((l) => ({ name: l.name, rolle: l.rolle, ...(l.foto ? { foto: l.foto } : {}), email: l.email ?? "", einverstaendnis: l.einverstaendnis })) })),
    stimme: { text: p.stimme?.text ?? "", name: p.stimme?.name ?? "", rolle: p.stimme?.rolle ?? "", freigegeben: p.stimme?.freigegeben ?? false },
    bewertungen: { zeigen: p.bewertungen.zeigen },
    faq: p.faq ? p.faq.map((f) => ({ ...f })) : null,
    kontakt: { telefon: p.kontakt?.telefon ?? "", mail: p.kontakt?.mail ?? "", whatsapp: p.kontakt?.whatsapp ?? "" },
    partner: p.partner ? p.partner.map((x) => ({ ...x })) : null,
    bilder: { ...(p.bilder ?? {}) },
  });
}

/** Räumt den Entwurf auf (leere Zeilen weg, Leerzeichen weg, Feiertage nach Datum) und gibt die Form von site.json zurück.
 *  Noch ungeprüft: Das Schema prüft danach. Neue Fotos stehen als Platzhalter «neu:…» darin. */
export function entwurfZuDaten(e: Entwurf, hinweis?: string) {
  const t = (s: string | undefined) => (s ?? "").trim();
  const kontakt = { ...(t(e.kontakt.telefon) ? { telefon: t(e.kontakt.telefon) } : {}), ...(t(e.kontakt.mail) ? { mail: t(e.kontakt.mail) } : {}), ...(t(e.kontakt.whatsapp) ? { whatsapp: t(e.kontakt.whatsapp) } : {}) };
  const bilder = Object.fromEntries(BILD_PLAETZE.flatMap((p) => { const b = e.bilder[p.name]; return b ? [[p.name, { foto: b.foto, alt: t(b.alt), b: b.b, h: b.h }]] : []; })) as Partial<Record<BildPlatz, EntwurfBild>>;
  return {
    ...(hinweis ? { _hinweis: hinweis } : {}),
    hinweise: e.hinweise.filter((h) => t(h.titel) || t(h.text)).map((h) => ({ art: h.art, form: (HINWEIS_POPUP_ARTEN as readonly string[]).includes(h.art) ? h.form : ("banner" as const), titel: t(h.titel), text: t(h.text), link: h.link, von: h.von, bis: h.bis })),
    zeiten: e.zeiten.map((z) => ({ tage: z.tage, kurz: z.kurz, wochentage: z.wochentage, geschlossen: z.geschlossen, fenster: z.geschlossen ? [] : z.fenster.filter((f) => t(f.von) || t(f.bis)).map((f) => ({ von: t(f.von), bis: t(f.bis) })) })),
    ausnahmen: e.ausnahmen.filter((a) => t(a.name) || a.datum).map((a) => (a.geschlossen ? { name: t(a.name), datum: a.datum, geschlossen: true } : { name: t(a.name), datum: a.datum, geschlossen: false, von: t(a.von), bis: t(a.bis) }))
      .sort((a, b) => a.datum.localeCompare(b.datum)),
    team: e.team.map((g) => ({ name: g.name, leute: g.leute.filter((p) => t(p.name) || t(p.rolle)).map((p) => ({ name: t(p.name), rolle: t(p.rolle), ...(p.foto ? { foto: p.foto } : {}), ...(t(p.email) ? { email: t(p.email) } : {}), einverstaendnis: p.einverstaendnis })) })),
    stimme: { text: t(e.stimme.text), name: t(e.stimme.name), rolle: t(e.stimme.rolle), freigegeben: e.stimme.freigegeben },
    bewertungen: { zeigen: e.bewertungen.zeigen },
    ...(e.faq ? { faq: e.faq.filter((f) => t(f.frage) || t(f.antwort)).map((f) => ({ frage: t(f.frage), antwort: t(f.antwort) })) } : {}),
    ...(Object.keys(kontakt).length ? { kontakt } : {}),
    ...(e.partner ? { partner: e.partner.filter((x) => t(x.name) || x.logo).map((x) => ({ name: t(x.name), ...(x.logo ? { logo: x.logo, ...(x.b && x.h ? { b: x.b, h: x.h } : {}) } : {}) })) } : {}),
    ...(Object.keys(bilder).length ? { bilder } : {}),
  };
}
export type Daten = ReturnType<typeof entwurfZuDaten>;

// ---------- Neue Fotos: Im Entwurf steht ein Platzhalter «neu:<kennung>», die Datei reist als «foto:<kennung>» mit.
export const NEU = "neu:";
const KENNUNG = /^neu:[a-z0-9]{6,24}$/;
export type FotoOrdner = "team" | "bild";

/** Alle Stellen in den Daten, an denen ein Foto steht (Team, ersetzte Fotos, Partner-Logos). Verträgt beliebige Eingaben. */
function fotoStellen(d: unknown, fn: (ordner: FotoOrdner, o: Record<string, unknown>, feld: "foto" | "logo") => void): void {
  const obj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);
  const liste = (x: unknown): unknown[] => (Array.isArray(x) ? x : []);
  if (!obj(d)) return;
  for (const g of liste(d.team)) if (obj(g)) for (const p of liste(g.leute)) if (obj(p) && typeof p.foto === "string") fn("team", p, "foto");
  if (obj(d.bilder)) for (const b of Object.values(d.bilder)) if (obj(b) && typeof b.foto === "string") fn("bild", b, "foto");
  for (const x of liste(d.partner)) if (obj(x) && typeof x.logo === "string") fn("bild", x, "logo");
}
/** Platzhalter neuer Fotos in den Daten, mit dem Ordner im Bild-Speicher, in den sie gehören. */
export function neueFotos(d: unknown): { platzhalter: string; ordner: FotoOrdner }[] {
  const r = new Map<string, FotoOrdner>();
  fotoStellen(d, (ordner, o, feld) => { const w = o[feld] as string; if (KENNUNG.test(w)) r.set(w, ordner); });
  return [...r].map(([platzhalter, ordner]) => ({ platzhalter, ordner }));
}
/** Setzt die Adressen der eben hochgeladenen Fotos ein (verändert die Daten). */
export function fotosEinsetzen(d: unknown, adressen: Map<string, string>): void {
  fotoStellen(d, (_o, o, feld) => { const neu = adressen.get(o[feld] as string); if (neu) o[feld] = neu; });
}

/** Bilder im Bild-Speicher müssen aus dem alten Stand stammen oder eben hochgeladen sein: sonst könnte jemand eine fremde
 *  Adresse eintragen und beim späteren Entfernen ein fremdes Bild löschen lassen. Startbilder der Website (Pfade) sind frei. */
export function fotosErlaubt(neu: Pflege, alt: Pflege, hochgeladen: string[]): boolean {
  const ok = new Set([...speicherFotos(alt), ...hochgeladen]);
  return speicherFotos(neu).every((u) => ok.has(u));
}

/** Für «alten Stand laden»: Bilder im Bild-Speicher, die es heute nicht mehr gibt, fallen weg. Gibt die Anzahl zurück. */
export function fehlendeFotosEntfernen(alt: Pflege, heute: Pflege): { daten: Pflege; fehlen: number } {
  const da = new Set(speicherFotos(heute));
  const daten = structuredClone(alt);
  let fehlen = 0;
  const weg = (u: string | undefined) => !!u && u.startsWith("https://") && !da.has(u);
  for (const g of daten.team) for (const l of g.leute) if (weg(l.foto)) { delete l.foto; fehlen++; }
  for (const x of daten.partner ?? []) if (weg(x.logo)) { delete x.logo; delete x.b; delete x.h; fehlen++; }
  for (const [k, b] of Object.entries(daten.bilder ?? {})) if (weg(b?.foto)) { delete daten.bilder![k as BildPlatz]; fehlen++; }
  return { daten, fehlen };
}

// ---------- Änderungen in Alltagssprache (für «Prüfen und veröffentlichen» und die Punkte in der Seitenleiste)
export type Aenderung = { bereich: BereichId; text: string };

/** «aehnlich»: Steht an derselben Stelle ein anderer Name, gilt das nur dann als «umbenannt», wenn der Rest erkennbar derselbe Eintrag ist. */
function vergleich<T>(alt: T[], neu: T[], name: (x: T) => string, aehnlich: (x: T, y: T) => boolean = () => true) {
  const an = alt.map(name), nn = neu.map(name);
  let weg = alt.filter((x) => !nn.includes(name(x))), dazu = neu.filter((x) => !an.includes(name(x)));
  const umbenannt: [T, T][] = [];
  // Gleiche Stelle, anderer Name: «geändert» statt «entfernt und neu».
  for (const w of [...weg]) {
    const d = neu[alt.indexOf(w)];
    if (d && dazu.includes(d) && aehnlich(w, d)) { umbenannt.push([w, d]); weg = weg.filter((x) => x !== w); dazu = dazu.filter((x) => x !== d); }
  }
  const beide = alt.filter((x) => nn.includes(name(x))).map((x) => [x, neu[nn.indexOf(name(x))]!] as [T, T]);
  const reihenfolge = beide.map(([x]) => name(x)).join("\n") !== neu.filter((x) => an.includes(name(x))).map(name).join("\n");
  return { weg, dazu, umbenannt, beide, reihenfolge };
}
const kurz = (s: string, n = 60) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const gleich = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function aenderungen(a: Daten, b: Daten): Aenderung[] {
  const r: Aenderung[] = [];
  const sag = (bereich: BereichId, text: string) => r.push({ bereich, text });

  const h = vergleich(a.hinweise, b.hinweise, (x) => x.text);
  for (const x of h.dazu) sag("hinweise", `Neuer Hinweis: «${kurz(x.text)}»`);
  for (const x of h.weg) sag("hinweise", `Hinweis entfernt: «${kurz(x.text)}»`);
  for (const [x, y] of [...h.umbenannt, ...h.beide]) if (!gleich(x, y)) sag("hinweise", `Hinweis geändert: «${kurz(y.text)}»`);

  if (!gleich(a.zeiten, b.zeiten)) sag("zeiten", `Öffnungszeiten neu: ${zeitenZeile(b as Pick<Pflege, "zeiten">) || "geschlossen"}`);

  const tag = (d: string) => (/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d.slice(8)}.${d.slice(5, 7)}.${d.slice(0, 4)}` : "ohne Datum");
  const au = vergleich(a.ausnahmen, b.ausnahmen, (x) => `${x.datum} ${x.name}`);
  for (const x of au.dazu) sag("ausnahmen", `Neuer Tag: ${x.name || "ohne Namen"} (${tag(x.datum)})`);
  for (const x of au.weg) sag("ausnahmen", `Tag entfernt: ${x.name} (${tag(x.datum)})`);
  for (const [x, y] of [...au.umbenannt, ...au.beide]) if (!gleich(x, y)) sag("ausnahmen", `Tag geändert: ${y.name || "ohne Namen"} (${tag(y.datum)})`);

  const leute = (d: Daten) => d.team.flatMap((g) => g.leute.map((p) => ({ ...p, gruppe: g.name })));
  const tm = vergleich(leute(a), leute(b), (x) => x.name, (x, y) => x.rolle === y.rolle || (!!x.foto && x.foto === y.foto) || (!!x.email && x.email === y.email));
  for (const x of tm.dazu) sag("team", `Neue Person: ${x.name} (${x.gruppe})`);
  for (const x of tm.weg) sag("team", `Person entfernt: ${x.name}`);
  for (const [x, y] of [...tm.umbenannt, ...tm.beide]) {
    if (x.name !== y.name) sag("team", `Name geändert: ${x.name} heisst neu ${y.name}`);
    if (x.gruppe !== y.gruppe) sag("team", `${y.name}: neu in der Gruppe «${y.gruppe}»`);
    if (x.rolle !== y.rolle) sag("team", `${y.name}: Aufgabe geändert`);
    if (x.foto !== y.foto) sag("team", `${y.name}: ${y.foto ? "neues Foto" : "Foto entfernt"}`);
    if (x.email !== y.email) sag("team", `${y.name}: Mail-Adresse geändert`);
    if (x.einverstaendnis !== y.einverstaendnis) sag("team", y.einverstaendnis ? `${y.name} wird auf der Website gezeigt` : `${y.name} wird nicht mehr auf der Website gezeigt`);
  }
  // Reihenfolge zählt nur unter Personen, die in ihrer Gruppe geblieben sind (ein Gruppenwechsel ist schon gemeldet).
  const geblieben = new Set(tm.beide.filter(([x, y]) => x.gruppe === y.gruppe).map(([x]) => x.name));
  const folge = (d: Daten) => leute(d).filter((p) => geblieben.has(p.name)).map((p) => p.name).join("\n");
  if (folge(a) !== folge(b)) sag("team", "Team: Reihenfolge geändert");

  if (!a.faq !== !b.faq) sag("fragen", b.faq ? "Häufige Fragen werden neu im Cockpit gepflegt" : "Häufige Fragen: wieder die Standardfragen der Website");
  const fq = vergleich(a.faq ?? [], b.faq ?? [], (x) => x.frage, (x, y) => x.antwort === y.antwort);
  for (const x of fq.dazu) sag("fragen", `Neue Frage: «${kurz(x.frage)}»`);
  for (const x of fq.weg) sag("fragen", `Frage entfernt: «${kurz(x.frage)}»`);
  for (const [, y] of fq.umbenannt) sag("fragen", `Frage geändert: «${kurz(y.frage)}»`);
  for (const [x, y] of fq.beide) if (x.antwort !== y.antwort) sag("fragen", `Antwort geändert: «${kurz(y.frage)}»`);
  if (fq.reihenfolge) sag("fragen", "Häufige Fragen: Reihenfolge geändert");

  for (const p of BILD_PLAETZE) {
    const x = a.bilder?.[p.name], y = b.bilder?.[p.name], wo = `${p.gruppe}, ${p.titel}`;
    if (x?.foto !== y?.foto) sag("fotos", y ? `Foto ersetzt: ${wo}` : `Wieder das ursprüngliche Foto: ${wo}`);
    else if (x && y && x.alt !== y.alt) sag("fotos", `Beschreibung geändert: ${wo}`);
  }

  const pa = vergleich(a.partner ?? [], b.partner ?? [], (x) => x.name, (x, y) => x.logo === y.logo);
  for (const x of pa.dazu) sag("partner", `Neuer Partner: ${x.name}`);
  for (const x of pa.weg) sag("partner", `Partner entfernt: ${x.name}`);
  for (const [x, y] of [...pa.umbenannt, ...pa.beide]) {
    if (x.name !== y.name) sag("partner", `Partner umbenannt: ${x.name} heisst neu ${y.name}`);
    if (x.logo !== y.logo) sag("partner", `${y.name}: ${y.logo ? "neues Logo" : "Logo entfernt"}`);
  }
  if (pa.reihenfolge) sag("partner", "Partner: Reihenfolge geändert");

  if (a.stimme.text !== b.stimme.text || a.stimme.name !== b.stimme.name || a.stimme.rolle !== b.stimme.rolle) sag("inhaber", "Satz vom Inhaber geändert");
  if (a.stimme.freigegeben !== b.stimme.freigegeben) sag("inhaber", b.stimme.freigegeben ? "Satz vom Inhaber wird gezeigt" : "Satz vom Inhaber wird nicht mehr gezeigt");
  if (a.bewertungen.zeigen !== b.bewertungen.zeigen) sag("inhaber", b.bewertungen.zeigen ? "Google-Bewertungen werden gezeigt" : "Google-Bewertungen werden nicht mehr gezeigt");

  const k = (d: Daten, f: "telefon" | "mail" | "whatsapp") => d.kontakt?.[f] ?? "";
  for (const [f, n] of [["telefon", "Telefon"], ["mail", "Mail-Adresse"], ["whatsapp", "WhatsApp-Nummer"]] as const)
    if (k(a, f) !== k(b, f)) sag("kontakt", k(b, f) ? `${n} neu: ${k(b, f)}` : `${n} entfernt`);
  return r;
}

// ---------- Prüfen
const FELD: Record<string, string> = { name: "Name", rolle: "Aufgabe", email: "Mail-Adresse", frage: "Frage", antwort: "Antwort", text: "Text", titel: "Titel", alt: "Beschreibung", datum: "Datum", von: "Zeit von", bis: "Zeit bis", telefon: "Telefon", mail: "Mail-Adresse", whatsapp: "WhatsApp-Nummer", foto: "Foto", logo: "Logo", fenster: "Zeiten" };

/** Erste Fehlermeldung in Alltagssprache, mit dem Bereich, in dem sie steht. */
export function pflegeFehler(e: z.ZodError, d?: Daten): { bereich: BereichId; meldung: string } {
  const i = e.issues[0];
  if (!i) return { bereich: "hinweise", meldung: "Bitte Eingaben prüfen." };
  const p = i.path as (string | number)[];
  const [b, nr] = p;
  const feld = [...p].reverse().find((x): x is string => typeof x === "string" && x in FELD);
  const grenze = i.code === "too_small" || i.code === "too_big";
  const was = i.code === "too_small" ? "fehlt oder ist zu kurz" : i.code === "too_big" ? "ist zu lang" : i.message;
  const mit = (wo: string) => `${wo}: ${feld && grenze ? `${FELD[feld]} ${was}` : was}`;
  const n = Number(nr) + 1;
  switch (b) {
    case "zeiten": return { bereich: "zeiten", meldung: mit(`Öffnungszeiten, ${d?.zeiten[Number(nr)]?.tage ?? `Zeile ${n}`}`) };
    case "ausnahmen": return { bereich: "ausnahmen", meldung: mit(`Feiertage und Ferien, ${d?.ausnahmen[Number(nr)]?.name || `Zeile ${n}`}`) };
    case "team": { const g = d?.team[Number(nr)], l = g?.leute[Number(p[3])]; return { bereich: "team", meldung: mit(`Team, ${l?.name || g?.name || `Gruppe ${n}`}`) }; }
    case "faq": return { bereich: "fragen", meldung: mit(`Häufige Fragen, Frage ${n}`) };
    case "kontakt": return { bereich: "kontakt", meldung: mit("Kontakt") };
    case "partner": return { bereich: "partner", meldung: nr === undefined ? "Partner: Es braucht mindestens einen und höchstens 12 Partner." : mit(`Partner, ${d?.partner?.[Number(nr)]?.name || `Zeile ${n}`}`) };
    case "bilder": return { bereich: "fotos", meldung: mit(`Fotos, ${BILD_PLAETZE.find((x) => x.name === nr)?.titel ?? "Foto"}`) };
    case "stimme": return { bereich: "inhaber", meldung: mit("Satz vom Inhaber") };
    case "bewertungen": return { bereich: "inhaber", meldung: mit("Bewertungen") };
    default: return { bereich: "hinweise", meldung: mit(nr === undefined ? "Hinweise" : `Hinweis ${n}`) };
  }
}

const SCHEIN = { team: "https://x.invalid/team/00000000-0000-0000-0000-000000000000.webp", bild: "https://x.invalid/bild/00000000-0000-0000-0000-000000000000.webp" };
/** Prüft den Entwurf schon im Browser (neue Fotos zählen als gültig). null: alles in Ordnung. */
export function entwurfPruefen(e: Entwurf): { bereich: BereichId; meldung: string } | null {
  const d = entwurfZuDaten(e);
  const probe = structuredClone(d);
  fotosEinsetzen(probe, new Map(neueFotos(probe).map((n) => [n.platzhalter, SCHEIN[n.ordner]])));
  const r = pflegeSchema.safeParse(probe);
  return r.success ? null : pflegeFehler(r.error, d);
}
