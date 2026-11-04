// Mailtexte für Mails an Kundinnen und Kunden (BAUPLAN 4.5). Neutral, für alle gleich: kein Gating
// («Wie zufrieden waren Sie?»), keine Gegenleistung, keine Anreize. Plain JS ohne Abhängigkeit (läuft bei
// Cloudflare und im Node-Test). Der Link zeigt auf /bewerten/?q=mail; die Seite entscheidet, was damit geschieht.

/** Ermittelt die Domain aus bau.adresse (falls gesetzt) bzw. aus betrieb.mail. Fallback: autospeedy.ch. */
export function domainAus(betrieb, bau) {
  const adr = bau && typeof bau.adresse === "string" ? bau.adresse.trim() : "";
  if (adr) return adr.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const mail = betrieb && typeof betrieb.mail === "string" ? betrieb.mail : "";
  const host = mail.split("@")[1];
  return host ? host.trim() : "autospeedy.ch";
}

/** Vorname säubern: Steuerzeichen raus, höchstens 60 Zeichen. Leer ist erlaubt (dann ohne Namen). */
function vornameSauber(v) {
  return (typeof v === "string" ? v : "").replace(/[\x00-\x1f]+/g, " ").trim().slice(0, 60);
}

/**
 * Baut die Bewertungsanfrage (eine Mail, für alle gleich).
 * @param {{ vorname?: string, domain: string, betrieb: { name: string, tel: string } }} opt
 * @returns {{ betreff: string, text: string, html: string, link: string }}
 */
export function bewertungsAnfrage({ vorname, domain, betrieb }) {
  const v = vornameSauber(vorname);
  const anrede = v ? `Guten Tag ${v}` : "Guten Tag";
  const link = `https://${domain}/bewerten/?q=mail`;
  const name = betrieb.name;
  const tel = betrieb.tel;
  const betreff = `Ihre Meinung zu ${name}`;
  const text = [
    anrede,
    "",
    `vielen Dank, dass Sie Ihr Auto zu ${name} gebracht haben.`,
    "Wenn Sie einen Moment Zeit haben, freuen wir uns über eine kurze Bewertung:",
    link,
    "",
    "Wir haben Ihre Adresse nur für diese eine Nachricht verwendet und nicht gespeichert.",
    "",
    "Freundliche Grüsse",
    name,
    `Telefon ${tel}`,
  ].join("\n");
  const e = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = [
    "<!doctype html><html lang=\"de-CH\"><body style=\"font-family:system-ui,sans-serif;color:#1d1e20;line-height:1.5\">",
    `<p>${e(anrede)}</p>`,
    `<p>vielen Dank, dass Sie Ihr Auto zu ${e(name)} gebracht haben. Wenn Sie einen Moment Zeit haben, freuen wir uns über eine kurze Bewertung:</p>`,
    `<p><a href="${e(link)}">${e(link)}</a></p>`,
    "<p>Wir haben Ihre Adresse nur für diese eine Nachricht verwendet und nicht gespeichert.</p>",
    `<p>Freundliche Grüsse<br>${e(name)}<br>Telefon ${e(tel)}</p>`,
    "</body></html>",
  ].join("");
  return { betreff, text, html, link };
}
