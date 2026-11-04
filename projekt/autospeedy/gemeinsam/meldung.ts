// Ein Satz Regeln für die Schadenmeldung: die Website-Funktion (astro/functions/api/schaden.js) nutzt ihn.
// Plain TypeScript ohne Abhängigkeit, damit er überall läuft (Cloudflare, Node).
// Pflicht sind nur Art, Name und Telefon (Entscheid Reshat 03.11., Formular-Psychologie). Alles andere ist freiwillig.

export const ARTEN = ["Parkschaden", "Unfall", "Hagel", "Kratzer oder Lack", "Scheibe", "Felge", "Etwas anderes", "Rückruf"];
export const TESLA_MODELLE = ["Model 3", "Model Y", "Model S", "Model X", "Anderes Modell"];
export const GRENZEN = {
  email: 254, bemerkung: 3000, name: 120, telefon: 40, stelle: 40, stellen: 12,
  fotos: 6, fotoBytes: 2.5e6, gesamt: 16e6,
  kontrollschild: 15, versicherung: 80, schadennummer: 40, links: 2,
};

export type Foto = { type: string; size: number; arrayBuffer(): Promise<ArrayBuffer> };
export type Meldung = {
  art: string; name: string; telefon: string; email: string; bemerkung: string;
  tesla: boolean; teslaModell: string; stellen: string[]; website: string; fotos: Foto[];
  ersatzwagen: boolean; ersatzwagenTesla: boolean;
  kontrollschild: string; versicherung: string; schadennummer: string; ausweis: Foto | null;
};
type Eingabe = Partial<Record<
  "art" | "name" | "telefon" | "email" | "bemerkung" | "tesla" | "teslaModell" | "website" |
  "ersatzwagen" | "ersatzwagenTesla" | "kontrollschild" | "versicherung" | "schadennummer", unknown
>> & { stellen?: unknown[]; fotos?: Foto[]; ausweis?: Foto | null };

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const ja = (v: unknown) => v === "ja" || v === "1" || v === "true" || v === true;
/** Steuerzeichen (ausser Zeilenumbruch bei der Bemerkung) raus, damit kein Feld die Mail-Struktur verfälscht. */
const sauber = (v: string, mehrzeilig = false) =>
  (mehrzeilig ? v.replace(/[^\S\n]*[\x00-\x08\x0b\x0c\x0e-\x1f]+/g, " ") : v.replace(/[\x00-\x1f]+/g, " ")).trim();

/** Zählt linkartige Zeichenfolgen in einem Text. */
function zaehleLinks(s: string): number {
  return (s.match(/\bhttps?:\/\/\S+|\bwww\.\S+|\b[a-z0-9-]+\.(?:ch|com|net|org|de|li|io|info|shop|eu|at)\b/gi) || []).length;
}

/** Prüft eine Meldung. «fehler» nennt die Feldnamen; «website» ist der Honigtopf (gefüllt = Roboter). */
export function pruefe(e: Eingabe): { daten: Meldung; fehler: string[] } {
  const fehler: string[] = [];
  const tesla = ja(e.tesla);
  const ersatzwagen = ja(e.ersatzwagen);
  const d: Meldung = {
    art: text(e.art), name: text(e.name), telefon: text(e.telefon), email: text(e.email).toLowerCase(), bemerkung: text(e.bemerkung),
    tesla, teslaModell: tesla ? text(e.teslaModell) : "", stellen: (e.stellen || []).map(text).filter(Boolean), website: text(e.website), fotos: e.fotos || [],
    ersatzwagen, ersatzwagenTesla: ersatzwagen && ja(e.ersatzwagenTesla),
    kontrollschild: text(e.kontrollschild), versicherung: text(e.versicherung), schadennummer: text(e.schadennummer), ausweis: e.ausweis || null,
  };
  // Pflicht: Art, Name, Telefon
  if (!ARTEN.includes(d.art)) fehler.push("art");
  if (!d.name || d.name.length > GRENZEN.name) fehler.push("name");
  if (!/^[+0-9 ()./-]{6,40}$/.test(d.telefon)) fehler.push("telefon");
  // Freiwillig: nur Länge und Format, nie Pflicht
  if (d.email && (d.email.length > GRENZEN.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email))) fehler.push("email");
  if (d.teslaModell && !TESLA_MODELLE.includes(d.teslaModell)) fehler.push("tesla_modell");
  if (d.bemerkung.length > GRENZEN.bemerkung || zaehleLinks(d.bemerkung) > GRENZEN.links) fehler.push("bemerkung");
  if (d.stellen.length > GRENZEN.stellen || d.stellen.some((s) => s.length > GRENZEN.stelle)) fehler.push("stellen");
  if (d.kontrollschild && (d.kontrollschild.length > GRENZEN.kontrollschild || !/^[A-Za-zÄÖÜ]{1,2}[\s.-]?\d{1,6}$/.test(d.kontrollschild))) fehler.push("kontrollschild");
  if (d.versicherung.length > GRENZEN.versicherung) fehler.push("versicherung");
  if (d.schadennummer && (d.schadennummer.length > GRENZEN.schadennummer || !/^[A-Za-z0-9 .\/-]+$/.test(d.schadennummer))) fehler.push("schadennummer");
  if (d.fotos.length > GRENZEN.fotos || d.fotos.some((f) => f.type !== "image/jpeg" || f.size > GRENZEN.fotoBytes || f.size === 0)) fehler.push("fotos");
  if (d.ausweis && (d.ausweis.type !== "image/jpeg" || d.ausweis.size > GRENZEN.fotoBytes || d.ausweis.size === 0)) fehler.push("ausweis");
  return { daten: d, fehler };
}

const teslaTeil = (d: Meldung) => (d.tesla ? ` (Tesla${d.teslaModell && d.teslaModell !== "Anderes Modell" ? " " + d.teslaModell : ""})` : "");
export const ersatzwagenZeile = (d: Meldung) => (d.ersatzwagen ? "Ersatzwagen gewünscht" + (d.ersatzwagenTesla ? ", Tesla wenn möglich" : "") : "");

/** Betreff ohne Namen: «Neue Schadenmeldung» plus Art, Tesla und Ersatzwagen-Vermerk. */
export function betreff(d: Meldung): string {
  const kopf = d.art === "Rückruf" ? "Neue Rückruf-Bitte" : "Neue Schadenmeldung: " + d.art;
  return `${kopf}${teslaTeil(d)}${d.ersatzwagen ? " · Ersatzwagen" + (d.ersatzwagenTesla ? " (Tesla)" : "") : ""}`;
}

/** Felder «zur Hand»: was liegt vor, was fehlt (für die Mail an den Betrieb). */
function zurHand(d: Meldung): { vorhanden: string[]; fehlend: string[] } {
  const felder: [string, boolean][] = [
    ["Kontrollschild", !!d.kontrollschild],
    ["Versicherung", !!d.versicherung],
    ["Schadennummer", !!d.schadennummer],
    ["Foto Fahrzeugausweis", !!d.ausweis],
  ];
  return { vorhanden: felder.filter(([, v]) => v).map(([n]) => n), fehlend: felder.filter(([, v]) => !v).map(([n]) => n) };
}

/** Die Felder der Meldung als geordnete Paare (Wert schon gesäubert). */
function felder(d: Meldung): [string, string][] {
  const h = zurHand(d);
  const paare: [string, string][] = [];
  if (d.ersatzwagen) paare.push(["Ersatzwagen", ersatzwagenZeile(d)]);
  paare.push(["Liegt vor", h.vorhanden.join(", ") || "nichts davon"]);
  paare.push(["Fehlt", h.fehlend.join(", ") || "nichts"]);
  paare.push(["Was ist passiert", sauber(d.art)]);
  paare.push(["Tesla", d.tesla ? "ja" + (d.teslaModell ? ", " + sauber(d.teslaModell) : "") : "nein"]);
  paare.push(["Stellen", d.stellen.map((s) => sauber(s)).join(", ") || "nicht angegeben"]);
  paare.push(["Fotos", `${d.fotos.length}${d.fotos.length ? " (im Anhang)" : ""}`]);
  if (d.kontrollschild) paare.push(["Kontrollschild", sauber(d.kontrollschild)]);
  if (d.versicherung) paare.push(["Versicherung", sauber(d.versicherung)]);
  if (d.schadennummer) paare.push(["Schadennummer", sauber(d.schadennummer)]);
  paare.push(["Bemerkung", sauber(d.bemerkung, true) || "keine"]);
  paare.push(["Name", sauber(d.name)]);
  paare.push(["Telefon", sauber(d.telefon)]);
  paare.push(["Mail", d.email ? sauber(d.email) : "nicht angegeben"]);
  return paare;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

/** Ganze Meldung für den Betrieb als Text. Fotos liegen im Anhang. */
export function mailVoll(d: Meldung): string {
  const zeilen = ["Meldung über die Website"];
  if (d.ersatzwagen) zeilen.push("", "➜ " + ersatzwagenZeile(d));
  zeilen.push("");
  for (const [k, v] of felder(d)) zeilen.push(`${k}: ${v}`);
  return zeilen.join("\n");
}

/** Dieselbe Meldung als HTML, alle Werte escaped. */
export function mailVollHtml(d: Meldung): string {
  const zeilen = felder(d).map(([k, v]) => `<tr><th align="left" style="padding:2px 12px 2px 0;color:#5b5f66">${escapeHtml(k)}</th><td style="padding:2px 0">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`);
  return [
    "<p>Meldung über die Website</p>",
    d.ersatzwagen ? `<p style="font-weight:600;color:#1566b8">${escapeHtml(ersatzwagenZeile(d))}</p>` : "",
    `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${zeilen.join("")}</table>`,
  ].filter(Boolean).join("\n");
}

/** Nur noch für die eingefrorene Cockpit-Demo (nicht mehr auf der Website verwendet, siehe BAUPLAN 4.0). */
export function hinweisText(d: Meldung, cockpitLink: string, fertigLink?: string): string {
  return [
    `Eine neue Meldung ist eingegangen: ${sauber(d.art)}${teslaTeil(d)}, ${d.fotos.length} Foto${d.fotos.length === 1 ? "" : "s"}.`,
    `Ansehen und zurückrufen: ${cockpitLink}`,
    ...(fertigLink ? ["", "Auto fertig? Hier bestätigen:", fertigLink] : []),
  ].join("\n");
}

/** Bestätigung an die Kundin oder den Kunden, nur mit freiwillig angegebener Mail. Ohne Inhalt der Meldung, ohne Fotos. */
export function bestaetigungText(d: Meldung, betrieb: { name: string; tel: string }): string {
  const vorname = sauber(d.name).split(/\s+/)[0] || "";
  return [`Guten Tag ${vorname}`.trim(), "", `Ihre Meldung (${sauber(d.art)}) ist bei ${betrieb.name} angekommen. Wir melden uns bei Ihnen, in der Regel telefonisch.`,
    "", `Dringend? Rufen Sie uns an: ${betrieb.tel}.`, "", "Freundliche Grüsse", betrieb.name, "",
    "Sie erhalten diese Mail, weil Sie Ihre Mail-Adresse angegeben haben."].join("\n");
}
