// Alltagsfälle mit einem Tipp: Vorlagen für Hinweise, Ferien mit passendem Hinweis, «Heute geschlossen»
// und die kurzen Angaben der Übersicht. Reine Funktionen ohne Browser und ohne Next, damit die Tests sie direkt prüfen.
import { HINWEIS_LINKS, HINWEIS_POPUP_ARTEN, type Entwurf, type EntwurfHinweis } from "./pflege";

/** So viele Hinweise erlaubt die Website (gemeinsam/site.ts). */
export const HINWEISE_MAX = 3;
/** So viele Einträge erlaubt die Website bei «Feiertage und Ferien» (gemeinsam/site.ts). */
export const AUSNAHMEN_MAX = 40;

type Art = EntwurfHinweis["art"];
type Form = EntwurfHinweis["form"];
type Ausnahme = Entwurf["ausnahmen"][number];
/** Eintrag bei «Feiertage und Ferien», im Entwurf («bisDatum» leer) oder veröffentlicht («bisDatum» fehlt). */
type Tage = { datum: string; bisDatum?: string | undefined };

const ISO = /^\d{4}-\d{2}-\d{2}$/;
/** «2026-12-24» als «24.12.2026». Leer, wenn es kein Datum ist. */
export const tagKurz = (d: string) => (ISO.test(d) ? `${d.slice(8)}.${d.slice(5, 7)}.${d.slice(0, 4)}` : "");
export function plusTage(d: string, n: number): string {
  const t = new Date(d + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}

/** Welche Darstellung wirklich gilt: «Fenster» gibt es nur bei Hagel und Aktion, sonst wird es zur Leiste. */
export const hinweisForm = (h: { art: string; form: Form }): Form => (h.form === "popup" && !(HINWEIS_POPUP_ARTEN as readonly string[]).includes(h.art) ? "banner" : h.form);

// ---------- Feiertage und Ferien
const mehrereTage = (a: Tage) => ISO.test(a.datum) && !!a.bisDatum && ISO.test(a.bisDatum) && a.bisDatum > a.datum;
/** Letzter Tag eines Eintrags («Bis» zählt nur, wenn es nach «Von» liegt). Leer, solange das Datum fehlt. */
export const letzterTag = (a: Tage): string => (!ISO.test(a.datum) ? "" : mehrereTage(a) ? a.bisDatum! : a.datum);
/** Der Eintrag, der an diesem Tag gilt. -1: keiner. */
export const ausnahmeAm = (liste: readonly Tage[], tag: string): number => liste.findIndex((a) => ISO.test(a.datum) && a.datum <= tag && tag <= letzterTag(a));
/** Der nächste Eintrag, der heute läuft oder noch kommt. */
export function naechsteAusnahme<T extends Tage>(liste: readonly T[], heute: string): T | undefined {
  return liste.filter((a) => letzterTag(a) >= heute && ISO.test(a.datum)).sort((a, b) => a.datum.localeCompare(b.datum))[0];
}

// ---------- Ferien und Hinweis zusammen
// Im Blatt eines Eintrags gibt es den Schalter «Auch als Hinweis auf der Website zeigen».
//
// Erkennung ohne neues Feld in site.json: Ein Hinweis gehört zu einem Eintrag, wenn die Art passt (ein einzelner, ganz
// geschlossener Tag: «geschlossen», alles andere: «ferien») und sein «Zeigen bis» der letzte Tag des Eintrags ist.
// Titel, Text, Link und Darstellung zählen nicht: Die darf der Betrieb im Bereich «Hinweise» frei ändern.
// Grenzen: Enden zwei Einträge am selben Tag mit derselben Art, teilen sie sich einen Hinweis. Stellt jemand im Bereich
// «Hinweise» die Art oder «Zeigen bis» um, ist die Verbindung gelöst und der Schalter steht ehrlich auf «aus».
//
// Entscheid «mitziehen»: Ändert jemand im Blatt Anlass, Datum oder Zeiten, zieht der Hinweis im selben Schritt mit (Art,
// «Zeigen bis», und der Text, solange er noch der vorgeschlagene ist). Ein Schalter, der nur auf «aus» springt, liesse den
// alten Hinweis mit dem falschen Datum stehen; genau das soll nicht passieren. Einen selbst geschriebenen Text überschreibt
// das Cockpit nicht: Das Blatt zeigt ihn unter dem Schalter, damit ein altes Datum darin auffällt.
// Wird der Eintrag entfernt, geht sein Hinweis mit. Bleibt beim Schliessen des Blatts kein brauchbares Datum (leer oder
// vorbei), fällt der Hinweis weg: Es gibt dann nichts anzukündigen.
const ferienArt = (a: Ausnahme): Art => (a.geschlossen && !mehrereTage(a) ? "geschlossen" : "ferien");
/** Der vorgeschlagene Text aus Anlass und Datum, z. B. «Betriebsferien vom 24.12.2026 bis 02.01.2027.» */
export function ferienText(a: Ausnahme): string {
  if (!ISO.test(a.datum)) return "";
  const wann = mehrereTage(a) ? `vom ${tagKurz(a.datum)} bis ${tagKurz(a.bisDatum)}` : `am ${tagKurz(a.datum)}`;
  const name = a.name.trim();
  if (!a.geschlossen) {
    const zeit = a.von && a.bis ? `: geöffnet von ${a.von} bis ${a.bis} Uhr` : "";
    return `${name ? `${name} ${wann}` : wann[0]!.toUpperCase() + wann.slice(1)}${zeit}.`;
  }
  if (!name) return `Wir haben ${wann} geschlossen.`;
  // «Betriebsferien» und «Geschlossen» sagen es schon. Bei «Auffahrt» braucht es den zweiten Satz.
  return /ferien|geschlossen/i.test(name) ? `${name} ${wann}.` : `${name} ${wann}. Wir haben geschlossen.`;
}
/** Der Hinweis zu einem Eintrag: Leiste oben, ab heute bis zum letzten Tag. null: Datum fehlt oder der Tag ist vorbei. */
export function ferienHinweis(a: Ausnahme, heute: string): EntwurfHinweis | null {
  const bis = letzterTag(a);
  if (!bis || bis < heute) return null;
  return { art: ferienArt(a), form: "banner", titel: "", text: ferienText(a), link: "", von: heute, bis };
}
/** Stelle des Hinweises, der zu diesem Eintrag gehört (Regel siehe oben). -1: keiner. */
export function ferienHinweisIndex(hinweise: readonly EntwurfHinweis[], a: Ausnahme | undefined): number {
  const bis = a ? letzterTag(a) : "";
  return a && bis ? hinweise.findIndex((h) => h.art === ferienArt(a) && h.bis === bis) : -1;
}
/** Verbindung zwischen dem offenen Eintrag und seinem Hinweis. Das Blatt hält sie, solange es offen ist: So geht sie nicht
 *  verloren, wenn das Datumsfeld beim Tippen kurz leer ist. */
export type FerienBindung = { nr: number; eigenerText: boolean };
export function ferienBindung(hinweise: readonly EntwurfHinweis[], a: Ausnahme | undefined): FerienBindung | null {
  const nr = ferienHinweisIndex(hinweise, a);
  return a && nr >= 0 ? { nr, eigenerText: hinweise[nr]!.text !== ferienText(a) } : null;
}
/** Warum sich der Schalter nicht einschalten lässt. Leer: Es geht. */
export function ferienHinweisGrund(d: Pick<Entwurf, "hinweise">, a: Ausnahme, heute: string): string {
  const bis = letzterTag(a);
  if (!bis) return "Bitte zuerst das Datum wählen.";
  if (bis < heute) return "Dieser Tag ist schon vorbei.";
  return d.hinweise.length >= HINWEISE_MAX ? `Es gibt schon ${HINWEISE_MAX} Hinweise. Mehr zeigt die Website nicht.` : "";
}
/** Schalter an: legt den Hinweis an. Schalter aus: entfernt genau diesen Hinweis. Gibt die neue Verbindung zurück. */
export function ferienHinweisSchalten(d: Entwurf, i: number, an: boolean, heute: string, bindung: FerienBindung | null): FerienBindung | null {
  const a = d.ausnahmen[i];
  if (!a) return null;
  if (!an) { if (bindung && d.hinweise[bindung.nr]) d.hinweise.splice(bindung.nr, 1); return null; }
  if (bindung && d.hinweise[bindung.nr]) return bindung;
  const neu = ferienHinweisGrund(d, a, heute) ? null : ferienHinweis(a, heute);
  if (!neu) return null;
  d.hinweise.push(neu);
  return { nr: d.hinweise.length - 1, eigenerText: false };
}
/** Ändert einen Eintrag und zieht seinen Hinweis mit (Entscheid siehe oben). */
export function ausnahmeAendern(d: Entwurf, i: number, fn: (a: Ausnahme) => void, heute: string, bindung: FerienBindung | null): void {
  const a = d.ausnahmen[i];
  if (!a) return;
  fn(a);
  const h = bindung ? d.hinweise[bindung.nr] : undefined, neu = ferienHinweis(a, heute);
  // Ohne brauchbares Datum bleibt der Hinweis vorerst, wie er ist (das Feld ist beim Tippen kurz leer).
  if (!h || !neu) return;
  h.art = neu.art; h.bis = neu.bis;
  if (h.von > h.bis) h.von = neu.von;
  if (!bindung!.eigenerText) h.text = neu.text;
}
/** Beim Schliessen des Blatts: Passt der Hinweis nicht mehr zum Eintrag (Datum leer oder vorbei), fällt er weg. */
export function ausnahmeSchliessen(d: Entwurf, i: number, bindung: FerienBindung | null): void {
  if (bindung && d.hinweise[bindung.nr] && ferienHinweisIndex(d.hinweise, d.ausnahmen[i]) < 0) d.hinweise.splice(bindung.nr, 1);
}
/** Entfernt einen Eintrag und den Hinweis, der zu ihm gehört. */
export function ausnahmeEntfernen(d: Entwurf, i: number, nr: number = ferienHinweisIndex(d.hinweise, d.ausnahmen[i])): void {
  if (!d.ausnahmen[i]) return;
  d.ausnahmen.splice(i, 1);
  if (d.hinweise[nr]) d.hinweise.splice(nr, 1);
}

// ---------- Vorlagen für Hinweise
// Die Texte sind Vorschläge, die der Betrieb danach frei ändert. Keine Preise, keine Rabatte, keine Versprechen:
// Wo das Cockpit nichts Wahres vorschlagen kann (Aktion, Ferien ohne Datum), bleibt der Text leer. Ein Hinweis ohne Text
// lässt sich nicht veröffentlichen, die Prüfung sagt es.
type Link = "" | (typeof HINWEIS_LINKS)[number]["wert"];
export type VorlageId = "hagel" | "ferien" | "geschlossen" | "aktion" | "stelle" | "leer";
type Vorlage = { id: VorlageId; name: string; unter: string; art: Art; form: Form; titel: string; text: string; link: Link; tage: number };
/** «tage»: so viele Tage nach heute endet der Zeitraum (0: nur heute). */
export const HINWEIS_VORLAGEN: readonly Vorlage[] = [
  { id: "hagel", name: "Hagel", unter: "Nach einem Hagelsturm", art: "hagel", form: "popup", titel: "Hagelschaden?", text: "Melden Sie Ihren Schaden gleich online. Die Abwicklung mit Ihrer Versicherung übernehmen wir.", link: "/schaden-melden/?art=hagel", tage: 28 },
  { id: "ferien", name: "Betriebsferien", unter: "Wann Sie Ferien machen", art: "ferien", form: "banner", titel: "Betriebsferien", text: "", link: "", tage: 14 },
  { id: "geschlossen", name: "Kurzfristig geschlossen", unter: "Zum Beispiel heute", art: "geschlossen", form: "banner", titel: "Heute geschlossen", text: "Unser Betrieb bleibt heute geschlossen. Vielen Dank für Ihr Verständnis.", link: "", tage: 0 },
  { id: "aktion", name: "Aktion", unter: "Titel und Text schreiben Sie selbst", art: "aktion", form: "ecke", titel: "", text: "", link: "", tage: 14 },
  { id: "stelle", name: "Stelle frei", unter: "Sie suchen jemanden für Ihr Team", art: "info", form: "ecke", titel: "Wir suchen Verstärkung", text: "Möchten Sie bei uns arbeiten? Dann melden Sie sich. Wir freuen uns auf Sie.", link: "/kontakt/", tage: 30 },
  { id: "leer", name: "Leerer Hinweis", unter: "Alles selbst schreiben", art: "info", form: "banner", titel: "", text: "", link: "", tage: 14 },
];
/** Ein neuer Hinweis aus einer Vorlage, ab heute. Ist der Platz für das Fenster oder die Karte schon belegt (je höchstens
 *  eines), wird es die Leiste oben. «Betriebsferien» nimmt Anlass und Datum der nächsten eingetragenen Ferien, wenn es
 *  welche gibt. null: Es bestehen schon 3 Hinweise. */
export function hinweisAusVorlage(id: VorlageId, d: Pick<Entwurf, "hinweise" | "ausnahmen">, heute: string): EntwurfHinweis | null {
  const v = HINWEIS_VORLAGEN.find((x) => x.id === id);
  if (!v || d.hinweise.length >= HINWEISE_MAX) return null;
  if (id === "ferien") {
    const ferien = naechsteAusnahme(d.ausnahmen.filter((a) => a.geschlossen && mehrereTage(a)), heute);
    const h = ferien && ferienHinweisIndex(d.hinweise, ferien) < 0 ? ferienHinweis(ferien, heute) : null;
    if (h) return h;
  }
  const form: Form = v.form !== "banner" && d.hinweise.some((h) => hinweisForm(h) === v.form) ? "banner" : v.form;
  return { art: v.art, form, titel: v.titel, text: v.text, link: v.link, von: heute, bis: plusTage(heute, v.tage) };
}
/** Für «Hinweis nach Hagel» auf der Übersicht: ein Hinweis zu Hagel, der noch läuft oder kommt. -1: keiner. */
export const hagelHinweisIndex = (hinweise: readonly EntwurfHinweis[], heute: string): number => hinweise.findIndex((h) => h.art === "hagel" && h.bis >= heute);

// ---------- Übersicht: was gerade gilt
type Zeitraum = { text: string; von: string; bis: string };
/** «1 aktiv bis 20.11.2026», «2 aktiv», «1 geplant ab 01.12.2026» oder «keiner». */
export function hinweiseStand(hinweise: readonly Zeitraum[], heute: string): string {
  const mit = hinweise.filter((h) => h.text.trim());
  const aktiv = mit.filter((h) => h.von <= heute && heute <= h.bis), geplant = mit.filter((h) => h.von > heute).sort((a, b) => a.von.localeCompare(b.von));
  // Ein Ende weit in der Zukunft (Hinweis ohne festes Ende) sagt niemandem etwas.
  const fern = (d: string) => d.slice(0, 4) > String(Number(heute.slice(0, 4)) + 1);
  if (aktiv.length === 1) return fern(aktiv[0]!.bis) ? "1 aktiv" : `1 aktiv bis ${tagKurz(aktiv[0]!.bis)}`;
  if (aktiv.length) return `${aktiv.length} aktiv`;
  if (geplant.length) return geplant.length === 1 ? `1 geplant ab ${tagKurz(geplant[0]!.von)}` : `${geplant.length} geplant`;
  return "keiner";
}
/** Der nächste Eintrag bei «Feiertage und Ferien» mit Datum, sonst «keine eingetragen». */
export function ferienStand(liste: readonly (Tage & { name: string })[], heute: string): string {
  const a = naechsteAusnahme(liste, heute);
  if (!a) return "keine eingetragen";
  const bis = letzterTag(a), mehrere = bis !== a.datum;
  const wann = a.datum <= heute ? (mehrere ? `bis ${tagKurz(bis)}` : "heute") : mehrere ? `${tagKurz(a.datum)} bis ${tagKurz(bis)}` : tagKurz(a.datum);
  return a.name.trim() ? `${a.name.trim()}, ${wann}` : wann;
}

// ---------- Adressen aus der Umgebung (WEBSITE_URL, HILFE_MAIL). Nichts davon ist fest eingebaut.
/** Adresse der Website für «Website ansehen». Nur https, ohne Zugangsdaten. null: nicht gesetzt oder unbrauchbar. */
export function websiteAdresse(roh: string | undefined): { adresse: string; name: string } | null {
  try {
    const u = new URL((roh ?? "").trim());
    return u.protocol === "https:" && !u.username && !u.password ? { adresse: u.href, name: u.host.replace(/^www\./, "") } : null;
  } catch { return null; }
}
/** Mail-Adresse für «Ihrem Betreuer schreiben». null: nicht gesetzt oder keine Mail-Adresse. */
export function hilfeAdresse(roh: string | undefined): string | null {
  const m = (roh ?? "").trim();
  return m.length <= 120 && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(m) ? m : null;
}
