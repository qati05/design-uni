// Formular der Website (Cloudflare Pages Function, POST /api/schaden): Schadenmeldung und Rückruf-Bitte.
// Die Website gehört dem Kunden und funktioniert ohne Cockpit. Welcher Weg gilt, ergibt sich aus der Einrichtung:
//   Cockpit eingerichtet (SUPABASE_URL, SUPABASE_SERVICE_KEY, BETRIEB_ID):
//     Meldung und Fotos in die Datenbank. Ist der Betrieb aktiv, geht nur ein Hinweis ohne Name und Telefon per Mail;
//     ist das Cockpit für ihn aus, die ganze Meldung mit Fotos (das Team kann sich dann nicht anmelden).
//     Scheitert das Speichern, wird die halbe Meldung entfernt und die ganze Meldung geht per Mail (Rückfall).
//   Cockpit nicht eingerichtet: die ganze Meldung mit Fotos per Mail an MAIL_BETRIEB.
// Mail: Brevo (BREVO_SCHLUESSEL, MAIL_ABSENDER), gemeinsam/brevo.ts. Schutz: Herkunft, Grösse, Bildtyp, Honigtopf «website»,
// Cloudflare Turnstile (TURNSTILE_SECRET gesetzt = Pflicht), Bestätigung an dieselbe Kundenadresse höchstens 2-mal in 24 h.
import { pruefe, GRENZEN, mailVoll, hinweisText, bestaetigungText, betreff } from "../../../gemeinsam/meldung.ts";
import { mailSenden, mailBereit, base64 } from "../../../gemeinsam/brevo.ts";
import betriebDaten from "../../src/content/betrieb.json" with { type: "json" };

function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
const cockpitBereit = (env) => !!(env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY && env.BETRIEB_ID);

async function supabase(env, pfad, opt = {}) {
  const r = await fetch(`${env.SUPABASE_URL}${pfad}`, { ...opt, headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, ...(opt.headers || {}) } });
  if (!r.ok) throw new Error(`supabase ${r.status}`);
  return r;
}

async function sha256hex(t) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Turnstile: nur Pflicht, wenn TURNSTILE_SECRET gesetzt ist (Vorschau und Tests ohne). */
export async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, ...(ip ? { remoteip: ip } : {}) });
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(8000) }).catch(() => null);
  const j = r?.ok ? await r.json().catch(() => null) : null;
  return j?.success === true;
}

/** Betrieb lesen (aktiv, gekaufte Automation). Wirft bei Fehler: dann gilt der Mail-Rückfall. */
async function betriebLesen(env) {
  const r = await supabase(env, `/rest/v1/betrieb?id=eq.${encodeURIComponent(env.BETRIEB_ID)}&select=aktiv,automation_bewertung`);
  const [b] = await r.json();
  if (!b) throw new Error("betrieb fehlt");
  return b;
}

/** Meldung und Fotos speichern. Scheitert ein Foto, wird die Meldung wieder gelöscht (keine halben Meldungen, keine Doppel). */
export async function insCockpit(env, d, tokenHash) {
  const r = await supabase(env, "/rest/v1/meldungen", {
    method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ betrieb_id: env.BETRIEB_ID, art: d.art, tesla: d.tesla, tesla_modell: d.teslaModell || null, stellen: d.stellen, bemerkung: d.bemerkung, name: d.name, telefon: d.telefon, email: d.email || null, quelle: "website",
      ...(tokenHash ? { erledigt_token_hash: tokenHash, erledigt_token_bis: new Date(Date.now() + 120 * 864e5).toISOString() } : {}) }),
  });
  const [{ id }] = await r.json();
  try {
    const zeilen = [];
    for (const [i, f] of d.fotos.entries()) {
      const pfad = `${env.BETRIEB_ID}/${id}/foto-${i + 1}.jpg`;
      await supabase(env, `/storage/v1/object/schadenfotos/${pfad}`, { method: "POST", headers: { "Content-Type": "image/jpeg", "x-upsert": "false" }, body: await f.arrayBuffer() });
      zeilen.push({ meldung_id: id, pfad });
    }
    if (zeilen.length) await supabase(env, "/rest/v1/meldung_fotos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(zeilen) });
  } catch (e) {
    await supabase(env, `/rest/v1/meldungen?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
    await supabase(env, `/storage/v1/object/schadenfotos`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: d.fotos.map((_, i) => `${env.BETRIEB_ID}/${id}/foto-${i + 1}.jpg`) }) }).catch(() => {});
    throw e;
  }
  return id;
}

/** Wie oft ging in 24 h schon eine Bestätigung an diese Adresse? (nur mit Cockpit zählbar; ohne gilt nur Turnstile) */
async function bestaetigungErlaubt(env, email, gespeichert) {
  if (!gespeichert) return true;
  const seit = new Date(Date.now() - 864e5).toISOString();
  const r = await supabase(env, `/rest/v1/meldungen?betrieb_id=eq.${encodeURIComponent(env.BETRIEB_ID)}&email=eq.${encodeURIComponent(email)}&erstellt=gte.${seit}&select=id&limit=3`).catch(() => null);
  if (!r) return false;
  return (await r.json()).length <= 2; // die eben gespeicherte zählt mit
}

export async function onRequestPost({ request, env }) {
  const herkunft = request.headers.get("Origin");
  if (env.ERLAUBTE_HERKUNFT && herkunft !== env.ERLAUBTE_HERKUNFT) return antwort(403, { ok: false, fehler: ["herkunft"] });
  if (!(request.headers.get("Content-Type") || "").includes("multipart/form-data")) return antwort(415, { ok: false, fehler: ["format"] });
  if (Number(request.headers.get("Content-Length") || 0) > GRENZEN.gesamt) return antwort(413, { ok: false, fehler: ["groesse"] });
  let form;
  try { form = await request.formData(); } catch { return antwort(400, { ok: false, fehler: ["format"] }); }
  const fotos = form.getAll("foto").filter((f) => typeof f === "object" && f !== null);
  const { daten: d, fehler } = pruefe({
    art: form.get("art"), name: form.get("name"), telefon: form.get("telefon"), email: form.get("email") || "", bemerkung: form.get("bemerkung") || "",
    tesla: form.get("tesla"), teslaModell: form.get("tesla_modell") || "", stellen: form.getAll("stelle"), website: form.get("website") || "", fotos,
  });
  if (d.website) return antwort(200, { ok: true }); // Honigtopf: still annehmen, nichts tun
  if (fehler.length) return antwort(422, { ok: false, fehler });
  if (!(await turnstileOk(env, form.get("cf-turnstile-response"), request.headers.get("CF-Connecting-IP")))) return antwort(403, { ok: false, fehler: ["robot"] });

  const cockpit = env.COCKPIT_URL ? env.COCKPIT_URL.replace(/\/$/, "") : "";
  let id = null, b = null, fertigLink = "";
  if (cockpitBereit(env)) {
    try {
      b = await betriebLesen(env);
      let hash = null;
      if (b.automation_bewertung && d.email && cockpit) { const token = [...crypto.getRandomValues(new Uint8Array(32))].map((x) => x.toString(16).padStart(2, "0")).join(""); hash = await sha256hex(token); fertigLink = `${cockpit}/auftrag/${token}`; }
      id = await insCockpit(env, d, hash);
    } catch { id = null; fertigLink = ""; }
  }

  let angekommen = !!id;
  if (id && b?.aktiv && cockpit) {
    // Hinweis ohne Personendaten; fällt er aus, liegt die Meldung trotzdem im Cockpit.
    await mailSenden(env, { an: env.MAIL_BETRIEB, betreff: "Neue " + betreff(d), text: hinweisText(d, `${cockpit}/meldung/${id}`, fertigLink || undefined) });
  } else if (mailBereit(env) && env.MAIL_BETRIEB) {
    const anhaenge = [];
    for (const [i, f] of d.fotos.entries()) anhaenge.push({ name: `schaden-${i + 1}.jpg`, inhalt: base64(await f.arrayBuffer()) });
    const ok = await mailSenden(env, { an: env.MAIL_BETRIEB, betreff: betreff(d), text: mailVoll(d, fertigLink || undefined), anhaenge });
    angekommen = angekommen || ok;
  }
  if (!angekommen) return antwort(mailBereit(env) || cockpitBereit(env) ? 502 : 503, { ok: false, fehler: [mailBereit(env) || cockpitBereit(env) ? "senden" : "nicht-eingerichtet"] });

  if (d.email && mailBereit(env) && (await bestaetigungErlaubt(env, d.email, !!id))) {
    await mailSenden(env, { an: d.email, betreff: `Ihre Meldung bei ${betriebDaten.name}`, text: bestaetigungText(d, { name: betriebDaten.name, tel: betriebDaten.tel.anzeige }) });
  }
  return antwort(200, { ok: true });
}
