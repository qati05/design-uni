// Texte der Mails, die das System verschickt. Rein, damit testbar. Nur Text, kein HTML.

export function bewertungMail(a: { name: string; website: string; betrieb: string }): { betreff: string; text: string } {
  const vorname = a.name.trim().split(/\s+/)[0] || "";
  return {
    betreff: `Danke für Ihren Auftrag bei ${a.betrieb}`,
    text: [
      `Guten Tag${vorname ? " " + vorname : ""}`,
      "",
      "Ihr Auto ist fertig. Danke für Ihr Vertrauen.",
      "Hat alles gepasst? Über eine kurze Bewertung freuen wir uns sehr:",
      `${a.website.replace(/\/$/, "")}/bewerten/`,
      "",
      "Freundliche Grüsse",
      a.betrieb,
      "",
      "Sie erhalten diese Mail einmal, weil Sie bei Ihrer Schadenmeldung Ihre Mail-Adresse angegeben haben.",
    ].join("\n"),
  };
}
