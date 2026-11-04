// Ein Mail-Weg für Website-Funktion (astro/functions/api/schaden.js): zwei Adapter, eine Einstellung.
// Entscheid Reshat 03.11.: keine laufenden Kosten. Schadenmeldung an den Betrieb über Cloudflare Email
// (send_email-Binding, gratis), Mails an Kundinnen und Kunden über Brevo (Gratiskontingent).
//   MAIL_WEG_BETRIEB (Vorgabe cloudflare) und MAIL_WEG_KUNDE (Vorgabe brevo), je cloudflare|brevo.
// sende({ an, betreff, text, html, antwortAn, anhaenge, weg }, env): wirft bei fehlender Konfiguration
// oder Versandfehler. Der Schlüssel steht nie in einer Fehlermeldung oder in einem Log.
// Plain JS ohne Abhängigkeit (läuft bei Cloudflare und im Node-Test). Anhänge: { name, inhalt } mit inhalt = base64.

const GESAMT_MAX = 25 * 1024 * 1024; // 25 MiB, Grenze von Cloudflare Email und üblichen Postfächern

/** base64 aus einem ArrayBuffer oder Uint8Array, ohne Node-Buffer (läuft auch bei Cloudflare). */
export function base64(puffer) {
  const b = puffer instanceof Uint8Array ? puffer : new Uint8Array(puffer);
  let s = "";
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, Array.from(b.subarray(i, i + 0x8000)));
  return btoa(s);
}
const b64text = (str) => base64(new TextEncoder().encode(str));
// Kopfzeilen mit Umlauten als MIME-«encoded-word» (RFC 2047), damit Betreff und Name sauber ankommen.
const kopfWort = (str) => (/[^\x20-\x7e]/.test(str) ? `=?UTF-8?B?${b64text(str)}?=` : str);
// Grösse eines base64-Strings in Bytes (jede 4 Zeichen = 3 Bytes, Padding abgezogen).
const base64Bytes = (s) => Math.floor((s.length * 3) / 4) - (s.endsWith("==") ? 2 : s.endsWith("=") ? 1 : 0);

function gesamtGroesse(text, html, anhaenge) {
  let n = new TextEncoder().encode((text || "") + (html || "")).length;
  for (const a of anhaenge || []) n += base64Bytes(a.inhalt);
  return n;
}

/** Baut eine RFC-5322-MIME-Nachricht (CRLF) mit Text, optionalem HTML und base64-Anhängen. */
function mime({ von, vonName, an, betreff, text, html, antwortAn, anhaenge }) {
  const g = "=_autospeedy_grenze_=";
  const z = [];
  z.push(`From: ${vonName ? `${kopfWort(vonName)} <${von}>` : von}`);
  z.push(`To: ${an}`);
  if (antwortAn) z.push(`Reply-To: ${antwortAn}`);
  z.push(`Subject: ${kopfWort(betreff)}`);
  z.push(`Date: ${new Date().toUTCString()}`);
  z.push("MIME-Version: 1.0");

  const textTeil = () => [
    'Content-Type: text/plain; charset="UTF-8"', "Content-Transfer-Encoding: base64", "", b64text(text || ""),
  ];
  const htmlTeil = () => [
    'Content-Type: text/html; charset="UTF-8"', "Content-Transfer-Encoding: base64", "", b64text(html),
  ];
  const koerper = () => {
    if (!html) return textTeil();
    const ag = "=_autospeedy_alt_=";
    return [
      `Content-Type: multipart/alternative; boundary="${ag}"`, "",
      `--${ag}`, ...textTeil(), "", `--${ag}`, ...htmlTeil(), "", `--${ag}--`,
    ];
  };

  if (!(anhaenge && anhaenge.length)) {
    return [...z, ...koerper(), ""].join("\r\n");
  }
  z.push(`Content-Type: multipart/mixed; boundary="${g}"`, "");
  const teile = [`--${g}`, ...koerper()];
  for (const a of anhaenge) {
    teile.push("", `--${g}`,
      `Content-Type: application/octet-stream; name="${a.name}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${a.name}"`, "",
      a.inhalt);
  }
  teile.push("", `--${g}--`);
  return [...z, ...teile, ""].join("\r\n");
}

/** Cloudflare Email: send_email-Binding env.EMAIL.send(EmailMessage). EmailMessage nur zur Laufzeit laden. */
async function sendeCloudflare(m, env) {
  if (!env.EMAIL || typeof env.EMAIL.send !== "function" || !env.MAIL_ABSENDER) {
    throw new Error("Cloudflare Email nicht eingerichtet (EMAIL-Binding und MAIL_ABSENDER nötig)");
  }
  const roh = mime({ von: env.MAIL_ABSENDER, vonName: env.MAIL_ABSENDER_NAME, an: m.an, betreff: m.betreff, text: m.text, html: m.html, antwortAn: m.antwortAn, anhaenge: m.anhaenge });
  let EmailMessage = null;
  try { ({ EmailMessage } = await import("cloudflare:email")); } catch { /* im Node-Test nicht vorhanden */ }
  const nachricht = EmailMessage ? new EmailMessage(env.MAIL_ABSENDER, m.an, roh) : { from: env.MAIL_ABSENDER, to: m.an, raw: roh };
  await env.EMAIL.send(nachricht);
}

/** Brevo: Transaktions-Mail über die HTTPS-API. */
async function sendeBrevo(m, env) {
  if (!env.BREVO_SCHLUESSEL || !env.MAIL_ABSENDER) {
    throw new Error("Brevo nicht eingerichtet (BREVO_SCHLUESSEL und MAIL_ABSENDER nötig)");
  }
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": env.BREVO_SCHLUESSEL, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { email: env.MAIL_ABSENDER, name: env.MAIL_ABSENDER_NAME || "Website" },
      to: [{ email: m.an }],
      ...(m.antwortAn ? { replyTo: { email: m.antwortAn } } : {}),
      subject: m.betreff,
      textContent: m.text || "",
      ...(m.html ? { htmlContent: m.html } : {}),
      ...(m.anhaenge && m.anhaenge.length ? { attachment: m.anhaenge.map((a) => ({ name: a.name, content: a.inhalt })) } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => null);
  if (!r || !r.ok) throw new Error(`Brevo antwortete nicht mit 2xx (Status ${r ? r.status : "kein"})`);
}

/**
 * Sendet eine Mail. «weg» wählt den Adapter (cloudflare|brevo); fehlt er, gilt env.MAIL_WEG, sonst cloudflare.
 * Wirft bei fehlender Konfiguration oder Versandfehler (ohne Schlüssel im Text).
 */
export async function sende({ an, betreff, text, html, antwortAn, anhaenge }, env, weg) {
  if (!an || !betreff) throw new Error("Mail ohne Empfänger oder Betreff");
  if (gesamtGroesse(text, html, anhaenge) > GESAMT_MAX) throw new Error("Mail zu gross (über 25 MiB)");
  const w = weg || env.MAIL_WEG || "cloudflare";
  const m = { an, betreff, text, html, antwortAn, anhaenge };
  if (w === "brevo") return sendeBrevo(m, env);
  if (w === "cloudflare") return sendeCloudflare(m, env);
  throw new Error(`Unbekannter Mail-Weg: ${w}`);
}
