import "server-only";
import { postfachSchreiben } from "./demo-speicher";
import { log } from "./log";

/** Mail verschicken: im Betrieb über Brevo (REST), in der Demo ins Demo-Postfach. Ungeprüft gegen Brevo selbst. */
export async function mailSenden(m: { an: string; betreff: string; text: string }): Promise<boolean> {
  if (process.env.COCKPIT_DEMO === "1") { postfachSchreiben(m.an, m.betreff, m.text); return true; }
  const schluessel = process.env.BREVO_SCHLUESSEL, absender = process.env.MAIL_ABSENDER;
  if (!schluessel || !absender) { log({ aktion: "mail", status: "nicht_eingerichtet" }); return false; }
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(10000),
    headers: { "api-key": schluessel, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ sender: { email: absender, name: "Auto Speedy AG" }, to: [{ email: m.an }], subject: m.betreff, textContent: m.text }),
  }).catch(() => null);
  log({ aktion: "mail", status: r?.ok ? "ok" : "fehler" });
  return !!r?.ok;
}

/** Wohin Hinweise an den Betrieb gehen, und unter welcher Adresse Cockpit und Website laufen. */
export function adressen() {
  const demo = process.env.COCKPIT_DEMO === "1";
  return {
    betrieb: process.env.MAIL_BETRIEB || (demo ? "werkstatt@autospeedy.example" : ""),
    cockpit: (process.env.COCKPIT_ORIGIN || (demo ? "http://localhost:4400" : "")).replace(/\/$/, ""),
    website: process.env.WEBSITE_URL || "https://www.autospeedy.ch",
  };
}
