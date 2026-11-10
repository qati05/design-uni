// Ein Satz Regeln für die Rückruf-Bitte (POST /api/rueckruf, astro/functions/api/rueckruf.js).
// Entscheid Roni 08./09.11.2026: geht direkt als Mail an den Betrieb, kein Cockpit, keine Datenbank, nichts gespeichert.
// Pflicht: Anliegen, Name, Telefon (mind. 9 Ziffern). Freiwillig: Wunschzeiten aus dem Zeitwahl-Raster, Nachricht, Mail.
// Plain JS ohne Abhängigkeit (läuft bei Cloudflare und im Node-Test).

/** Alle Anliegen, die ein Rückruf-Formular der Website anbietet (Seiten kontakt, occasionen). Roni 09.11.2026: keine Firmen/Flotten, kein Leasing. */
export const ANLIEGEN = ["Allgemein", "Occasion kaufen", "Mein Auto verkaufen"];
/** Zeitwahl-Raster aus Rueckruf.astro (Linie Klar): Wochentag × Vormittag/Nachmittag. */
export const TAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
export const TEILE = ["Vormittag", "Nachmittag"];
export const ZEITEN = TAGE.flatMap((t) => TEILE.map((p) => `${t} ${p}`));
export const GRENZEN_RUECKRUF = { name: 120, telefon: 40, email: 254, bemerkung: 1000, links: 2, ort: 30, gesamt: 32 * 1024 };

const text = (v) => (typeof v === "string" ? v.trim() : "");
/** Steuerzeichen raus (bei der Nachricht bleiben Zeilenumbrüche), damit kein Feld die Mail-Struktur verfälscht. */
const sauber = (v, mehrzeilig = false) =>
  (mehrzeilig ? v.replace(/\r\n?/g, "\n").replace(/[^\S\n]*[\x00-\x08\x0b\x0c\x0e-\x1f]+/g, " ") : v.replace(/[\x00-\x1f]+/g, " ")).trim();
const zaehleLinks = (s) => (s.match(/\bhttps?:\/\/\S+|\bwww\.\S+|\b[a-z0-9-]+\.(?:ch|com|net|org|de|li|io|info|shop|eu|at)\b/gi) || []).length;

/** Prüft eine Rückruf-Bitte. «fehler» nennt die Feldnamen (anliegen, name, telefon, zeit, bemerkung, email). */
export function pruefeRueckruf(e) {
  const fehler = [];
  const zeitenRoh = (Array.isArray(e.zeiten) ? e.zeiten : []).map(text).filter(Boolean);
  const d = {
    anliegen: text(e.anliegen), name: sauber(text(e.name)), telefon: text(e.telefon), email: text(e.email).toLowerCase(),
    bemerkung: sauber(text(e.bemerkung), true), zeiten: [...new Set(zeitenRoh)], ort: text(e.ort),
  };
  if (!ANLIEGEN.includes(d.anliegen)) fehler.push("anliegen");
  if (!d.name || d.name.length > GRENZEN_RUECKRUF.name) fehler.push("name");
  const ziffern = (d.telefon.match(/[0-9]/g) || []).length; // Leerzeichen zählen nicht
  if (!/^[+0-9 ()./-]{6,40}$/.test(d.telefon) || ziffern < 9 || ziffern > 15) fehler.push("telefon");
  if (zeitenRoh.length > ZEITEN.length || d.zeiten.some((z) => !ZEITEN.includes(z))) fehler.push("zeit");
  if (d.bemerkung.length > GRENZEN_RUECKRUF.bemerkung || zaehleLinks(d.bemerkung) > GRENZEN_RUECKRUF.links) fehler.push("bemerkung");
  if (d.email && (d.email.length > GRENZEN_RUECKRUF.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email))) fehler.push("email");
  if (!/^[a-z-]{0,30}$/.test(d.ort)) d.ort = ""; // nur Hinweis für den Betrieb, nie ein Fehler
  // Wunschzeiten in Raster-Reihenfolge, damit die Mail immer gleich liest
  d.zeiten.sort((a, b) => ZEITEN.indexOf(a) - ZEITEN.indexOf(b));
  return { daten: d, fehler };
}

/** Betreff ohne Namen und ohne Telefon (landet oft in Vorschauen und Benachrichtigungen). */
export const betreffRueckruf = (d) => `Neue Rückruf-Bitte: ${d.anliegen}`;

function felder(d) {
  return [
    ["Anliegen", d.anliegen],
    ["Name", d.name],
    ["Telefon", d.telefon],
    ["Wann anrufen", d.zeiten.length ? d.zeiten.join(", ") : "keine Angabe (in den Öffnungszeiten)"],
    ["Nachricht", d.bemerkung || "keine"],
    ["Mail", d.email || "nicht angegeben"],
    ...(d.ort ? [["Formular", d.ort]] : []),
  ];
}
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Mail an den Betrieb als Text. */
export function mailRueckruf(d) {
  return ["Rückruf-Bitte über die Website", "", ...felder(d).map(([k, v]) => `${k}: ${v}`)].join("\n");
}
/** Dieselbe Mail als HTML, alle Werte escaped. */
export function mailRueckrufHtml(d) {
  const zeilen = felder(d).map(([k, v]) => `<tr><th align="left" style="padding:2px 12px 2px 0;color:#5b5f66">${escapeHtml(k)}</th><td style="padding:2px 0">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`);
  return `<p>Rückruf-Bitte über die Website</p>\n<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${zeilen.join("")}</table>`;
}
/** Bestätigung an die Kundschaft, nur mit freiwillig angegebener Mail. Ohne Nachricht und ohne Telefonnummer. */
export function bestaetigungRueckruf(d, betrieb) {
  // Ohne Namen aus dem Formular: Die Mail geht an eine frei eingegebene Adresse und darf keinen fremden Text tragen.
  return ["Guten Tag", "",
    `Ihre Rückruf-Bitte (${d.anliegen}) ist bei ${betrieb.name} angekommen. Wir rufen Sie zurück${d.zeiten.length ? ", wenn möglich zur gewünschten Zeit" : ""}.`,
    "", `Dringend? Rufen Sie uns an: ${betrieb.tel}.`, "", "Freundliche Grüsse", betrieb.name, "",
    "Sie erhalten diese Mail, weil Sie Ihre Mail-Adresse angegeben haben."].join("\n");
}
