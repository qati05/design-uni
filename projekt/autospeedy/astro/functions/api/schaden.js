// Schadenmeldung (Cloudflare Pages Function, POST /api/schaden). Ohne Datenbank, ohne Cockpit (Entscheid Reshat 03.11.):
// prüfen, Fotos von Metadaten befreien und genau EINE Mail mit den Fotos im Anhang an SCHADEN_AN schicken.
// Nichts wird gespeichert, kein Log mit Personendaten, kein Schlüssel in einem Log oder einer Fehlermeldung.
// Prüfreihenfolge (BAUPLAN 4.3): Origin, multipart, 16e6, Honigtopf, Zeitfalle, Drossel, pruefe, Fotos, Mail.
// Mailweg: Betrieb über Cloudflare Email (send_email-Binding), Kundschaft über Brevo — Einstellung in gemeinsam/mail.js.
import { pruefe, GRENZEN, mailVoll, mailVollHtml, bestaetigungText, betreff } from "../../../gemeinsam/meldung.ts";
import { sende, base64 } from "../../../gemeinsam/mail.js";
import { istJpeg, ohneMetadaten } from "../../../gemeinsam/jpeg.js";
import betriebDaten from "../../src/content/betrieb.json" with { type: "json" };

const TEL = betriebDaten.tel.anzeige;

function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
const fehlerAntwort = (status, fehler) => antwort(status, { ok: false, fehler, telefon: TEL });

async function hmacHex(schluessel, text) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(schluessel), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha256hex(text) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
// zeitkonstanter Vergleich zweier Hex-Strings gleicher Länge
function gleich(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** GET /api/schaden?t=1 → Zeitfalle-Token (HMAC über den Zeitstempel). Ohne FORMULAR_HMAC ist die Falle aus. */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (url.searchParams.get("t") !== "1") return antwort(404, { ok: false });
  if (!env.FORMULAR_HMAC) return antwort(200, { t: "" });
  const ts = String(Date.now());
  return antwort(200, { t: `${ts}.${await hmacHex(env.FORMULAR_HMAC, ts)}` });
}

/** Prüft das Zeitfalle-Token. Rückgabe: "ok" | "zu-schnell" (still verwerfen) | "alt" (neu laden) | "kaputt". */
async function zeitfalle(env, token) {
  if (!env.FORMULAR_HMAC) { console.log("schaden: Zeitfalle aus (FORMULAR_HMAC fehlt)"); return "ok"; }
  if (typeof token !== "string" || !token.includes(".")) return "kaputt";
  const [ts, sig] = token.split(".");
  if (!/^\d+$/.test(ts) || !sig) return "kaputt";
  if (!gleich(await hmacHex(env.FORMULAR_HMAC, ts), sig)) return "kaputt";
  const alter = Date.now() - Number(ts);
  if (alter < 4000) return "zu-schnell";
  if (alter > 2 * 60 * 60 * 1000) return "alt";
  return "ok";
}

/** Drossel ohne Datenbank: Workers Rate Limiting Binding; Schlüssel = SHA-256 der IP, nicht gespeichert. */
async function gedrosselt(env, ip) {
  if (!env.DROSSEL || typeof env.DROSSEL.limit !== "function") return false; // kein Binding: überspringen
  try {
    const { success } = await env.DROSSEL.limit({ key: await sha256hex(ip || "unbekannt") });
    return !success;
  } catch { return false; }
}

export async function onRequestPost({ request, env }) {
  // 1. Origin
  const herkunft = request.headers.get("Origin");
  if (env.ERLAUBTE_HERKUNFT && herkunft !== env.ERLAUBTE_HERKUNFT) return fehlerAntwort(403, ["herkunft"]);
  // 2. multipart
  if (!(request.headers.get("Content-Type") || "").includes("multipart/form-data")) return fehlerAntwort(415, ["format"]);
  // 3. Grösse laut Kopf
  if (Number(request.headers.get("Content-Length") || 0) > GRENZEN.gesamt) return fehlerAntwort(413, ["groesse"]);
  let form;
  try { form = await request.formData(); } catch { return fehlerAntwort(400, ["format"]); }

  // 4. Honigtopf: still annehmen, nichts tun
  if (String(form.get("website") || "").trim()) return antwort(200, { ok: true });

  // 5. Zeitfalle
  const falle = await zeitfalle(env, form.get("t"));
  if (falle === "zu-schnell") return antwort(200, { ok: true }); // still verwerfen
  if (falle === "alt" || falle === "kaputt") return fehlerAntwort(422, ["zeit"]);

  // 6. Drossel
  if (await gedrosselt(env, request.headers.get("CF-Connecting-IP"))) return fehlerAntwort(429, ["drossel"]);

  // 7. pruefe
  const fotos = form.getAll("foto").filter((f) => typeof f === "object" && f !== null && typeof f.arrayBuffer === "function");
  const ausweisRoh = form.get("ausweis");
  const ausweis = ausweisRoh && typeof ausweisRoh === "object" && typeof ausweisRoh.arrayBuffer === "function" ? ausweisRoh : null;
  const { daten: d, fehler } = pruefe({
    art: form.get("art"), name: form.get("name"), telefon: form.get("telefon"), email: form.get("email") || "", bemerkung: form.get("bemerkung") || "",
    tesla: form.get("tesla"), teslaModell: form.get("tesla_modell") || "", stellen: form.getAll("stelle"), website: form.get("website") || "", fotos,
    ersatzwagen: form.get("ersatzwagen"), ersatzwagenTesla: form.get("ersatzwagen_tesla"),
    kontrollschild: form.get("kontrollschild") || "", versicherung: form.get("versicherung") || "", schadennummer: form.get("schadennummer") || "", ausweis,
  });
  if (fehler.length) return fehlerAntwort(422, fehler);

  // 8. Fotos: Magic Bytes prüfen und APP1/APP13 (EXIF/IPTC, auch GPS) entfernen; neue Namen foto-1.jpg …
  const anhaenge = [];
  try {
    for (const [i, f] of d.fotos.entries()) {
      const roh = new Uint8Array(await f.arrayBuffer());
      if (!istJpeg(roh)) return fehlerAntwort(422, ["fotos"]);
      anhaenge.push({ name: `foto-${i + 1}.jpg`, inhalt: base64(ohneMetadaten(roh)) });
    }
    if (d.ausweis) {
      const roh = new Uint8Array(await d.ausweis.arrayBuffer());
      if (!istJpeg(roh)) return fehlerAntwort(422, ["ausweis"]);
      anhaenge.push({ name: "fahrzeugausweis.jpg", inhalt: base64(ohneMetadaten(roh)) });
    }
  } catch { return fehlerAntwort(422, ["fotos"]); }

  // 9. Genau eine Mail an den Betrieb (Fotos im Anhang, Reply-To nur bei gültiger Kundenmail)
  try {
    await sende({
      an: env.SCHADEN_AN, betreff: betreff(d), text: mailVoll(d), html: mailVollHtml(d),
      antwortAn: d.email || undefined, anhaenge,
    }, env, env.MAIL_WEG_BETRIEB || "cloudflare");
  } catch {
    return fehlerAntwort(502, ["senden"]);
  }

  // 10. Optionale Bestätigung an die Kundin oder den Kunden (neutral, ohne Fotos). Scheitert sie, ist die Meldung trotzdem da.
  if (d.email) {
    try {
      await sende({
        an: d.email, betreff: `Ihre Meldung bei ${betriebDaten.name}`,
        text: bestaetigungText(d, { name: betriebDaten.name, tel: TEL }),
      }, env, env.MAIL_WEG_KUNDE || "brevo");
    } catch { /* Bestätigung ist nicht kritisch */ }
  }
  return antwort(200, { ok: true });
}
