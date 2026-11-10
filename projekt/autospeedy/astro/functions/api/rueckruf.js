// Rückruf-Bitte (Cloudflare Pages Function, POST /api/rueckruf). Entscheid Roni 08./09.11.2026: direkt per Mail an den
// Betrieb, kein Cockpit, keine Datenbank, nichts gespeichert, kein Log mit Personendaten.
// Prüfreihenfolge wie /api/schaden: Origin, Format, Grösse, Honigtopf, Zeitfalle, Drossel, Prüfung, genau EINE Mail.
// Empfänger: RUECKRUF_AN, sonst SCHADEN_AN. Bestätigung an die Kundschaft nur mit angegebener Mail-Adresse UND
// bestandener Turnstile-Prüfung (sonst wäre das Formular eine Mailschleuder an fremde Adressen).
import { pruefeRueckruf, GRENZEN_RUECKRUF, betreffRueckruf, mailRueckruf, mailRueckrufHtml, bestaetigungRueckruf } from "../../../gemeinsam/rueckruf.js";
import { antwort, herkunftOk, schutzBereit, tokenAntwort, zeitfalle, gedrosselt, turnstile } from "../../../gemeinsam/schutz.js";
import { sende } from "../../../gemeinsam/mail.js";
import betriebDaten from "../../src/content/betrieb.json" with { type: "json" };
import bauDaten from "../../src/content/bau.json" with { type: "json" };

const TEL = betriebDaten.tel.anzeige;
const LIVE = bauDaten.vorschau === false;
const fehlerAntwort = (status, fehler) => antwort(status, { ok: false, fehler, telefon: TEL });

/** GET /api/rueckruf?t=1 → Zeitfalle-Token (gleicher Schlüssel FORMULAR_HMAC wie die Schadenmeldung). */
export const onRequestGet = ({ request, env }) => tokenAntwort(request, env);

export async function onRequestPost({ request, env }) {
  // 0. Livegang ohne eingerichteten Schutz: nicht offen laufen, sondern klar ablehnen (die Seite zeigt dann das Telefon)
  if (!schutzBereit(env, LIVE)) { console.log("formular: gesperrt, Schutz nicht eingerichtet (Herkunft, Zeitfalle, Turnstile oder Drossel)"); return fehlerAntwort(503, ["einrichtung"]); }
  // 1. Origin
  if (!herkunftOk(request, env)) return fehlerAntwort(403, ["herkunft"]);
  // 2. Format: FormData aus rueckruf.js (multipart) oder ein klassisches Formular (urlencoded)
  const typ = request.headers.get("Content-Type") || "";
  if (!typ.includes("multipart/form-data") && !typ.includes("application/x-www-form-urlencoded")) return fehlerAntwort(415, ["format"]);
  // 3. Grösse laut Kopf (ein Rückruf hat keine Anhänge)
  if (Number(request.headers.get("Content-Length") || 0) > GRENZEN_RUECKRUF.gesamt) return fehlerAntwort(413, ["groesse"]);
  let form;
  try { form = await request.formData(); } catch { return fehlerAntwort(400, ["format"]); }
  if ([...form.values()].some((v) => typeof v !== "string")) return fehlerAntwort(422, ["format"]); // keine Dateien

  // 4. Honigtopf: still annehmen, nichts tun
  if (String(form.get("website") || "").trim()) return antwort(200, { ok: true });

  // 5. Zeitfalle: zu schnell nie still verwerfen; die Seite wartet «warte» ms und sendet nochmals
  const falle = await zeitfalle(env, form.get("t"), "rueckruf");
  if (falle.stand === "zu-schnell") return antwort(422, { ok: false, fehler: ["zeit-schnell"], warte: falle.warte, telefon: TEL });
  if (falle.stand === "alt" || falle.stand === "kaputt") return fehlerAntwort(422, ["zeit"]); // Seite holt ein neues Token

  // 6. Drossel
  const ip = request.headers.get("CF-Connecting-IP");
  if (await gedrosselt(env, ip, "rueckruf")) return fehlerAntwort(429, ["drossel"]);

  // 6b. Turnstile: Mit TURNSTILE_SECRET prüft der Server das Token bei Cloudflare. Ohne Schlüssel gibt es keine Prüfung
  // («aus»), dann aber auch keine Bestätigungsmail an die Kundschaft (Entscheid Roni 03.11.2026).
  const mensch = await turnstile(env, form.get("cf-turnstile-response"), ip);
  if (mensch === "nein") return fehlerAntwort(403, ["turnstile"]);

  // 7. Prüfung
  const { daten: d, fehler } = pruefeRueckruf({
    anliegen: form.get("anliegen"), name: form.get("name"), telefon: form.get("telefon"), email: form.get("email") || "",
    bemerkung: form.get("bemerkung") || "", zeiten: form.getAll("zeit"), ort: form.get("ort") || "",
  });
  if (fehler.length) return fehlerAntwort(422, fehler);

  // 8. Genau eine Mail an den Betrieb (Reply-To nur bei gültiger Kundenmail)
  try {
    await sende({
      an: env.RUECKRUF_AN || env.SCHADEN_AN, betreff: betreffRueckruf(d), text: mailRueckruf(d), html: mailRueckrufHtml(d),
      antwortAn: d.email || undefined,
    }, env, env.MAIL_WEG_BETRIEB || "cloudflare");
  } catch {
    return fehlerAntwort(502, ["senden"]);
  }

  // 9. Bestätigung an die Kundschaft, nur nach bestandener Turnstile-Prüfung. Scheitert sie, ist die Rückruf-Bitte trotzdem beim Betrieb.
  if (d.email && mensch === "ok") {
    try {
      await sende({
        an: d.email, betreff: `Ihre Rückruf-Bitte bei ${betriebDaten.name}`,
        text: bestaetigungRueckruf(d, { name: betriebDaten.name, tel: TEL }),
      }, env, env.MAIL_WEG_KUNDE || "brevo");
    } catch { /* Bestätigung ist nicht kritisch */ }
  }
  return antwort(200, { ok: true });
}
