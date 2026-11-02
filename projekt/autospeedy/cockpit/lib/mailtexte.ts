// Texte der Mails, die das System verschickt. Rein, damit testbar. Nur Text, kein HTML.

export function auftragMail(a: { art: string; tesla: boolean; link: string; mitMail: boolean }): { betreff: string; text: string } {
  return {
    betreff: `Auftrag: ${a.art}${a.tesla ? " (Tesla)" : ""}. Wenn fertig, hier melden`,
    text: [
      `Ein neuer Auftrag läuft: ${a.art}${a.tesla ? " (Tesla)" : ""}.`,
      "",
      "Wenn das Auto fertig ist, tippen Sie hier und bestätigen:",
      a.link,
      "",
      a.mitMail
        ? "Der Kunde hat seine Mail angegeben: 24 Stunden nach «erledigt» bekommt er einmal die Bitte um eine Bewertung."
        : "Der Kunde hat keine Mail angegeben: Bitte um Bewertung im Cockpit per WhatsApp («Bewertung erbitten»).",
      "",
      "Name und Telefon stehen aus Datenschutzgründen nur im Cockpit.",
    ].join("\n"),
  };
}

export function bewertungMail(a: { name: string; website: string }): { betreff: string; text: string } {
  const vorname = a.name.trim().split(/\s+/)[0] || "";
  return {
    betreff: "Danke für Ihren Auftrag bei Auto Speedy",
    text: [
      `Guten Tag${vorname ? " " + vorname : ""}`,
      "",
      "Ihr Auto ist fertig. Danke für Ihr Vertrauen.",
      "Hat alles gepasst? Über eine kurze Bewertung freuen wir uns sehr:",
      `${a.website.replace(/\/$/, "")}/bewerten/`,
      "",
      "Freundliche Grüsse",
      "Auto Speedy AG",
      "",
      "Sie erhalten diese Mail einmal, weil Sie bei Ihrer Schadenmeldung Ihre Mail-Adresse angegeben haben.",
    ].join("\n"),
  };
}
