// Ein Satz Regeln für die Schadenmeldung: Website-Funktion (astro/functions/api/schaden.js) und Cockpit-Demo nutzen ihn.
// Plain TypeScript ohne Abhängigkeit, damit er überall läuft (Cloudflare, Node, Next).

export const ARTEN = ["Parkschaden", "Unfall", "Hagel", "Kratzer oder Lack", "Scheibe", "Felge", "Etwas anderes", "Rückruf"];
export const TESLA_MODELLE = ["Model 3", "Model Y", "Model S", "Model X", "Anderes Modell"];
export const GRENZEN = { email: 254, bemerkung: 3000, name: 120, telefon: 40, stelle: 40, stellen: 12, fotos: 6, fotoBytes: 2.5e6, gesamt: 16e6 };

export type Foto = { type: string; size: number; arrayBuffer(): Promise<ArrayBuffer> };
export type Meldung = {
  art: string; name: string; telefon: string; email: string; bemerkung: string;
  tesla: boolean; teslaModell: string; stellen: string[]; website: string; fotos: Foto[];
};
type Eingabe = Partial<Record<"art" | "name" | "telefon" | "email" | "bemerkung" | "tesla" | "teslaModell" | "website", unknown>> & { stellen?: unknown[]; fotos?: Foto[] };

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Prüft eine Meldung. «fehler» nennt die Feldnamen; «website» ist der Honigtopf (gefüllt = Roboter). */
export function pruefe(e: Eingabe): { daten: Meldung; fehler: string[] } {
  const fehler: string[] = [];
  const tesla = e.tesla === "ja" || e.tesla === true;
  const d: Meldung = {
    art: text(e.art), name: text(e.name), telefon: text(e.telefon), email: text(e.email).toLowerCase(), bemerkung: text(e.bemerkung),
    tesla, teslaModell: tesla ? text(e.teslaModell) : "", stellen: (e.stellen || []).map(text).filter(Boolean), website: text(e.website), fotos: e.fotos || [],
  };
  if (!ARTEN.includes(d.art)) fehler.push("art");
  if (!d.name || d.name.length > GRENZEN.name) fehler.push("name");
  if (!/^[+0-9 ()./-]{6,40}$/.test(d.telefon)) fehler.push("telefon");
  if (d.email && (d.email.length > GRENZEN.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email))) fehler.push("email");
  if (d.teslaModell && !TESLA_MODELLE.includes(d.teslaModell)) fehler.push("tesla_modell");
  if (d.bemerkung.length > GRENZEN.bemerkung) fehler.push("bemerkung");
  if (d.stellen.length > GRENZEN.stellen || d.stellen.some((s) => s.length > GRENZEN.stelle)) fehler.push("stellen");
  if (d.fotos.length > GRENZEN.fotos || d.fotos.some((f) => f.type !== "image/jpeg" || f.size > GRENZEN.fotoBytes || f.size === 0)) fehler.push("fotos");
  return { daten: d, fehler };
}

const tesla = (d: Meldung) => (d.tesla ? ` (Tesla${d.teslaModell && d.teslaModell !== "Anderes Modell" ? " " + d.teslaModell : ""})` : "");
export const betreff = (d: Meldung) => `${d.art === "Rückruf" ? "Rückruf-Bitte" : "Schadenmeldung: " + d.art}${tesla(d)}`;

/** Ganze Meldung für den Betrieb (Mail-Weg: ohne Cockpit, Cockpit aus oder Cockpit nicht erreichbar). Fotos im Anhang. */
export function mailVoll(d: Meldung, fertigLink?: string): string {
  return [
    "Meldung über die Website",
    "",
    `Was ist passiert: ${d.art}`,
    `Tesla: ${d.tesla ? "ja" + (d.teslaModell ? ", " + d.teslaModell : "") : "nein"}`,
    `Stellen: ${d.stellen.join(", ") || "nicht angegeben"}`,
    `Fotos: ${d.fotos.length}${d.fotos.length ? " (im Anhang)" : ""}`,
    `Bemerkung: ${d.bemerkung || "keine"}`,
    `Name: ${d.name}`,
    `Telefon: ${d.telefon}`,
    `Mail: ${d.email || "nicht angegeben"}`,
    ...(fertigLink ? ["", "Auto fertig? Hier tippen und bestätigen, dann geht 24 Stunden später einmal die Bitte um eine Bewertung an den Kunden:", fertigLink] : []),
  ].join("\n");
}

/** Hinweis an den Betrieb, wenn die Meldung im Cockpit liegt: ohne Name und Telefon. */
export function hinweisText(d: Meldung, cockpitLink: string, fertigLink?: string): string {
  return [
    `Eine neue Meldung ist eingegangen: ${d.art}${tesla(d)}, ${d.fotos.length} Foto${d.fotos.length === 1 ? "" : "s"}.`,
    `Stellen am Auto: ${d.stellen.join(", ") || "nicht angegeben"}. Mail vom Kunden: ${d.email ? "angegeben" : "keine"}.`,
    `Ansehen und zurückrufen im Cockpit: ${cockpitLink}`,
    ...(fertigLink ? ["", "Auto fertig? Hier tippen und bestätigen, dann geht 24 Stunden später einmal die Bitte um eine Bewertung an den Kunden:", fertigLink] : []),
    "", "Name und Telefon stehen aus Datenschutzgründen nur im Cockpit.",
  ].join("\n");
}

/** Bestätigung an den Kunden, nur mit freiwillig angegebener Mail. Ohne Inhalt der Meldung. */
export function bestaetigungText(d: Meldung, betrieb: { name: string; tel: string }): string {
  const vorname = d.name.split(/\s+/)[0] || "";
  return [`Guten Tag ${vorname}`.trim(), "", `Ihre Meldung (${d.art}) ist bei ${betrieb.name} angekommen. Wir melden uns bei Ihnen, in der Regel telefonisch.`,
    "", `Dringend? Rufen Sie uns an: ${betrieb.tel}.`, "", "Freundliche Grüsse", betrieb.name, "",
    "Sie erhalten diese Mail, weil Sie Ihre Mail-Adresse angegeben haben. Wenn Ihr Auto fertig ist, bitten wir Sie einmal um eine Bewertung."].join("\n");
}
