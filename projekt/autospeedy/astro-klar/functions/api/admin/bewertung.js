// POST /api/admin/bewertung (BAUPLAN 4.5): hinter Cloudflare Access. Body { mail, vorname? }. Prüft die Adresse
// (Länge, Format), drosselt (Rate-Limiting-Binding DROSSEL, Schlüssel «bewertung», max 30 pro Tag im Konto gesetzt;
// ohne Binding überspringen) und sendet GENAU EINE neutrale Mail über gemeinsam/mail.js (Weg MAIL_WEG_KUNDE, Vorgabe brevo).
// Es wird NICHTS gespeichert (keine Liste, keine Erinnerung) und die Adresse wird nie geloggt.
import { access } from "../../../../gemeinsam/access.js";
import { sende } from "../../../../gemeinsam/mail.js";
import { bewertungsAnfrage, domainAus } from "../../../../gemeinsam/mailtexte.js";
import betrieb from "../../../../astro/src/content/betrieb.json" with { type: "json" };
import bau from "../../../../astro/src/content/bau.json" with { type: "json" };

const MAIL_MAX = 254; // RFC-Grenze, wie in gemeinsam/meldung.ts
const MAIL_FORMAT = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}

/** Drossel ohne Datenbank: ein fester Schlüssel «bewertung», höchstens 30 pro Tag (Konfiguration im Konto). */
async function gedrosselt(env) {
  if (!env.DROSSEL || typeof env.DROSSEL.limit !== "function") return false; // kein Binding: überspringen
  try {
    const { success } = await env.DROSSEL.limit({ key: "bewertung" });
    return !success;
  } catch { return false; }
}

export async function onRequestPost({ request, env }) {
  // 1. Origin wie in den anderen Admin-Functions (Schritt 13)
  if (env.ERLAUBTE_HERKUNFT && request.headers.get("Origin") !== env.ERLAUBTE_HERKUNFT) return antwort(403, { ok: false, fehler: "herkunft" });
  // 2. Access (401 ohne gültiges JWT). Die Mailadresse aus dem Token wird nicht verwendet und nicht geloggt.
  const mailer = await access(request, env);
  if (!mailer) return antwort(401, { ok: false, fehler: "zugriff" });

  // 3. Body
  let body;
  try { body = await request.json(); } catch { return antwort(400, { ok: false, fehler: "format" }); }
  const mail = typeof body.mail === "string" ? body.mail.trim() : "";
  const vorname = typeof body.vorname === "string" ? body.vorname : "";
  if (mail.length < 3 || mail.length > MAIL_MAX || !MAIL_FORMAT.test(mail)) return antwort(422, { ok: false, fehler: "adresse" });

  // 4. Drossel
  if (await gedrosselt(env)) return antwort(429, { ok: false, fehler: "drossel" });

  // 5. Genau eine Mail, neutral, über den Kundenweg (Vorgabe brevo). Nichts speichern, Adresse nicht loggen.
  const domain = domainAus(betrieb, bau);
  const { betreff, text, html } = bewertungsAnfrage({ vorname, domain, betrieb: { name: betrieb.name, tel: betrieb.tel.anzeige } });
  try {
    await sende({ an: mail, betreff, text, html }, env, env.MAIL_WEG_KUNDE || "brevo");
  } catch {
    return antwort(502, { ok: false, fehler: "senden" });
  }
  return antwort(200, { ok: true });
}
