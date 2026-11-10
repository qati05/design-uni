import "server-only";
import { access } from "../../gemeinsam/access.js";

// Anmeldung im echten Betrieb: Cloudflare Access steht vor dem ganzen Cockpit. Wer hereinkommt, hat dort seinen Code aus der
// Mail eingegeben und steht in der Liste der erlaubten Adressen. Access gibt jeder Anfrage einen signierten Ausweis mit
// (Kopf «Cf-Access-Jwt-Assertion»). Hier wird er geprüft: Unterschrift, Team, Anwendung (ACCESS_AUD), Ablauf.
// Fehlt ACCESS_TEAM oder ACCESS_AUD, kommt niemand herein (lieber zu als offen).
// ACCESS_TEAM: Name des Teams bei Cloudflare (der Teil vor .cloudflareaccess.com). ACCESS_AUD: Kennung der Anwendung.

/** Mail-Adresse der angemeldeten Person, oder null. */
export async function angemeldet(kopf: { get(name: string): string | null }): Promise<string | null> {
  const e = process.env;
  return access({ headers: kopf }, { ACCESS_TEAM: e.ACCESS_TEAM, ACCESS_AUD: e.ACCESS_AUD });
}
