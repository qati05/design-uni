// Schadenmeldung (Cloudflare Pages Function, POST /api/schaden). Ohne Datenbank, ohne Cockpit (Entscheid Reshat 03.11.):
// prüfen, Fotos von Metadaten befreien und genau EINE Mail mit den Fotos im Anhang an SCHADEN_AN schicken.
// Nichts wird gespeichert, kein Log mit Personendaten, kein Schlüssel in einem Log oder einer Fehlermeldung.
// Prüfreihenfolge (BAUPLAN 4.3): Origin, multipart, 16e6, Honigtopf, Zeitfalle, Drossel, pruefe, Fotos, Mail.
// Mailweg: Betrieb über Cloudflare Email (send_email-Binding), Kundschaft über Brevo — Einstellung in gemeinsam/mail.js.
import { pruefe, GRENZEN, mailVoll, mailVollHtml, bestaetigungText, betreff } from "../../../gemeinsam/meldung.ts";
import { sende, base64 } from "../../../gemeinsam/mail.js";
import { istJpeg, ohneMetadaten } from "../../../gemeinsam/jpeg.js";
import { antwort, herkunftOk, tokenAntwort, zeitfalle, gedrosselt } from "../../../gemeinsam/schutz.js";
import betriebDaten from "../../src/content/betrieb.json" with { type: "json" };

const TEL = betriebDaten.tel.anzeige;
const fehlerAntwort = (status, fehler) => antwort(status, { ok: false, fehler, telefon: TEL });

/** GET /api/schaden?t=1 → Zeitfalle-Token (HMAC über den Zeitstempel). Ohne FORMULAR_HMAC ist die Falle aus. */
export const onRequestGet = ({ request, env }) => tokenAntwort(request, env);

export async function onRequestPost({ request, env }) {
  // 1. Origin
  if (!herkunftOk(request, env)) return fehlerAntwort(403, ["herkunft"]);
  // 2. multipart
  if (!(request.headers.get("Content-Type") || "").includes("multipart/form-data")) return fehlerAntwort(415, ["format"]);
  // 3. Grösse laut Kopf
  if (Number(request.headers.get("Content-Length") || 0) > GRENZEN.gesamt) return fehlerAntwort(413, ["groesse"]);
  let form;
  try { form = await request.formData(); } catch { return fehlerAntwort(400, ["format"]); }

  // 4. Honigtopf: still annehmen, nichts tun
  if (String(form.get("website") || "").trim()) return antwort(200, { ok: true });

  // 5. Zeitfalle
  const falle = await zeitfalle(env, form.get("t"), "schaden");
  // Zu schnell: nie still verwerfen (sonst zeigt die Seite «Angekommen», obwohl nichts gesendet wurde). Die Seite wartet
  // «warte» ms und sendet dieselben Daten nochmals; für Menschen unsichtbar, für Agenten und Autofill korrekt.
  if (falle.stand === "zu-schnell") return antwort(422, { ok: false, fehler: ["zeit-schnell"], warte: falle.warte, telefon: TEL });
  if (falle.stand === "alt" || falle.stand === "kaputt") return fehlerAntwort(422, ["zeit"]); // Seite holt ein neues Token und sendet einmal nochmals

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
