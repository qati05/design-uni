import "server-only";
import { mailSenden as brevo } from "../../gemeinsam/brevo";
import { postfachSchreiben } from "./demo-speicher";
import { log } from "./log";

/** Mail verschicken: im Betrieb über Brevo (derselbe Weg wie die Website, gemeinsam/brevo.ts), in der Demo ins Demo-Postfach. */
export async function mailSenden(m: { an: string; betreff: string; text: string; absenderName?: string }): Promise<boolean> {
  if (process.env.COCKPIT_DEMO === "1") { postfachSchreiben(m.an, m.betreff, m.text); return true; }
  const ok = await brevo({ ...process.env, MAIL_ABSENDER_NAME: m.absenderName || process.env.MAIL_ABSENDER_NAME }, { an: m.an, betreff: m.betreff, text: m.text });
  log({ aktion: "mail", status: ok ? "ok" : "fehler" });
  return ok;
}
