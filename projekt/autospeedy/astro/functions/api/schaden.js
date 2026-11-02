// Formular-Backend für die Schadenmeldung, Weg A (Cloudflare Pages Function, Route POST /api/schaden).
// Zwei Betriebsarten:
//   Cockpit (empfohlen): SUPABASE_URL und SUPABASE_SERVICE_KEY gesetzt -> Meldung und Fotos in Supabase
//     (Tabellen und privater Bucket aus cockpit/supabase/migrations), dann nur ein Hinweis per Mail an den Betrieb,
//     OHNE Name und Telefon (Link ins Cockpit, COCKPIT_URL). Die Daten bleiben in der Datenbank.
//   Nur Mail: ohne Supabase gehen Angaben und Fotos als Mail mit Anhängen (wie bisher).
// Stand: gebaut und lokal getestet (test/schaden.test.mjs), NICHT deployt. Erst aktiv, wenn
//   1. bau.json formularEndpunkt = "/api/schaden",
//   2. am Hoster MAIL_ENDPUNKT (HTTPS-Adresse des Mail-Dienstes), MAIL_SCHLUESSEL, MAIL_AN gesetzt sind,
//   3. die Datenschutzerklärung den Mail-Dienst nennt (text-uni CL3).
// Nimmt multipart/form-data an. Fotos gehen als Anhang mit der Mail; die Funktion speichert nichts.
// Prüft Pflichtfelder, Längen, Herkunft, Grösse, Bildtyp und Spamschutz (Honigtopf «website»).

const ARTEN = ["Parkschaden", "Unfall", "Hagel", "Kratzer oder Lack", "Scheibe", "Felge", "Etwas anderes", "Rückruf"];
const GRENZEN = { email: 254, bemerkung: 3000, name: 120, telefon: 40, stelle: 40, stellen: 12, fotos: 6, fotoBytes: 2.5e6, gesamt: 16e6 };

function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
const text = (v) => (typeof v === "string" ? v.trim() : "");

export function pruefe(e) {
  const fehler = [];
  const d = {
    art: text(e.art), name: text(e.name), telefon: text(e.telefon), email: text(e.email).toLowerCase(), bemerkung: text(e.bemerkung),
    tesla: e.tesla === "ja", stellen: (e.stellen || []).map(text).filter(Boolean), website: text(e.website), fotos: e.fotos || [],
  };
  if (!ARTEN.includes(d.art)) fehler.push("art");
  if (!d.name || d.name.length > GRENZEN.name) fehler.push("name");
  if (!/^[+0-9 ()./-]{6,40}$/.test(d.telefon)) fehler.push("telefon");
  if (d.email && (d.email.length > GRENZEN.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email))) fehler.push("email");
  if (d.bemerkung.length > GRENZEN.bemerkung) fehler.push("bemerkung");
  if (d.stellen.length > GRENZEN.stellen || d.stellen.some((s) => s.length > GRENZEN.stelle)) fehler.push("stellen");
  if (d.fotos.length > GRENZEN.fotos || d.fotos.some((f) => f.type !== "image/jpeg" || f.size > GRENZEN.fotoBytes || f.size === 0)) fehler.push("fotos");
  return { daten: d, fehler };
}

export function mailText(d) {
  return [
    "Schadenmeldung über die Website",
    "",
    `Was ist passiert: ${d.art}`,
    `Tesla: ${d.tesla ? "ja" : "nein"}`,
    `Stellen: ${d.stellen.join(", ") || "nicht angegeben"}`,
    `Fotos: ${d.fotos.length} (im Anhang)`,
    `Bemerkung: ${d.bemerkung || "keine"}`,
    `Name: ${d.name}`,
    `Telefon: ${d.telefon}`,
    `Mail: ${d.email || "nicht angegeben"}`,
  ].join("\n");
}

function base64(puffer) {
  let s = ""; const b = new Uint8Array(puffer);
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return btoa(s);
}


async function supabase(env, pfad, opt) {
  const r = await fetch(`${env.SUPABASE_URL}${pfad}`, { ...opt, headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`, ...(opt.headers || {}) } });
  if (!r.ok) throw new Error(`supabase ${r.status}`);
  return r;
}

/** Meldung und Fotos ins Cockpit (Supabase); gibt die ID zurück. */
export async function insCockpit(env, d) {
  const r = await supabase(env, "/rest/v1/meldungen", {
    method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ art: d.art, tesla: d.tesla, stellen: d.stellen, bemerkung: d.bemerkung, name: d.name, telefon: d.telefon, email: d.email || null, quelle: "website" }),
  });
  const [{ id }] = await r.json();
  const zeilen = [];
  for (const [i, f] of d.fotos.entries()) {
    const pfad = `${id}/foto-${i + 1}.jpg`;
    await supabase(env, `/storage/v1/object/schadenfotos/${pfad}`, { method: "POST", headers: { "Content-Type": "image/jpeg", "x-upsert": "false" }, body: await f.arrayBuffer() });
    zeilen.push({ meldung_id: id, pfad });
  }
  if (zeilen.length) await supabase(env, "/rest/v1/meldung_fotos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(zeilen) });
  return id;
}

/** Bestätigung an den Kunden, nur wenn er freiwillig seine Mail angegeben hat. Ohne Inhalt der Meldung. */
export function bestaetigungText(d) {
  const vorname = d.name.split(/\s+/)[0] || "";
  return [`Guten Tag ${vorname}`.trim(), "", `Ihre Schadenmeldung (${d.art}) ist bei Auto Speedy angekommen. Wir melden uns bei Ihnen, in der Regel telefonisch.`,
    "", "Dringend? Rufen Sie uns an: 071 755 88 61.", "", "Freundliche Grüsse", "Auto Speedy AG", "",
    "Sie erhalten diese Mail, weil Sie Ihre Mail-Adresse angegeben haben. Wenn Ihr Auto fertig ist, bitten wir Sie einmal um eine Bewertung."].join("\n");
}
async function bestaetigen(env, d) {
  if (!d.email) return;
  try { await fetch(env.MAIL_ENDPUNKT, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.MAIL_SCHLUESSEL}` }, body: JSON.stringify({ an: d.email, betreff: "Ihre Schadenmeldung bei Auto Speedy", text: bestaetigungText(d), anhaenge: [] }) }); } catch { /* still */ }
}

/** Hinweis an den Betrieb ohne Personendaten. */
export function hinweisText(d, id, cockpit) {
  return [`Eine neue Schadenmeldung ist eingegangen: ${d.art}${d.tesla ? " (Tesla)" : ""}, ${d.fotos.length} Foto${d.fotos.length === 1 ? "" : "s"}.`,
    `Stellen am Auto: ${d.stellen.join(", ") || "nicht angegeben"}. Mail vom Kunden: ${d.email ? "angegeben" : "keine"}.`,
    `Ansehen und zurückrufen im Cockpit: ${cockpit || "(Cockpit-Adresse fehlt)"}/meldung/${id}`, "", "Name und Telefon stehen aus Datenschutzgründen nur im Cockpit."].join("\n");
}

export async function onRequestPost({ request, env }) {
  const herkunft = request.headers.get("Origin");
  if (env.ERLAUBTE_HERKUNFT && herkunft && herkunft !== env.ERLAUBTE_HERKUNFT) return antwort(403, { ok: false, fehler: ["herkunft"] });
  if (!(request.headers.get("Content-Type") || "").includes("multipart/form-data")) return antwort(415, { ok: false, fehler: ["format"] });
  const laenge = Number(request.headers.get("Content-Length") || 0);
  if (laenge > GRENZEN.gesamt) return antwort(413, { ok: false, fehler: ["groesse"] });
  let form;
  try { form = await request.formData(); } catch { return antwort(400, { ok: false, fehler: ["format"] }); }
  const fotos = form.getAll("foto").filter((f) => typeof f === "object" && f !== null);
  const { daten, fehler } = pruefe({
    art: form.get("art"), name: form.get("name"), telefon: form.get("telefon"), email: form.get("email") || "", bemerkung: form.get("bemerkung") || "",
    tesla: form.get("tesla"), stellen: form.getAll("stelle"), website: form.get("website") || "", fotos,
  });
  if (daten.website) return antwort(200, { ok: true }); // Honigtopf: still annehmen, nichts senden
  if (fehler.length) return antwort(422, { ok: false, fehler });
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    let id;
    try { id = await insCockpit(env, daten); } catch { return antwort(502, { ok: false, fehler: ["speichern"] }); }
    if (env.MAIL_ENDPUNKT && env.MAIL_SCHLUESSEL && env.MAIL_AN) {
      // Die Meldung ist gespeichert; fällt nur der Hinweis aus, gilt sie trotzdem als angekommen (das Cockpit zeigt sie).
      try { await fetch(env.MAIL_ENDPUNKT, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.MAIL_SCHLUESSEL}` }, body: JSON.stringify({ an: env.MAIL_AN, betreff: `Neue Schadenmeldung: ${daten.art}${daten.tesla ? " (Tesla)" : ""}`, text: hinweisText(daten, id, env.COCKPIT_URL), anhaenge: [] }) }); } catch { /* still */ }
      await bestaetigen(env, daten);
    }
    return antwort(200, { ok: true });
  }
  if (!env.MAIL_ENDPUNKT || !env.MAIL_SCHLUESSEL || !env.MAIL_AN) return antwort(503, { ok: false, fehler: ["nicht-eingerichtet"] });
  const anhaenge = [];
  for (const [i, f] of fotos.entries()) anhaenge.push({ name: `schaden-${i + 1}.jpg`, typ: "image/jpeg", inhalt: base64(await f.arrayBuffer()) });
  const r = await fetch(env.MAIL_ENDPUNKT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.MAIL_SCHLUESSEL}` },
    body: JSON.stringify({ an: env.MAIL_AN, betreff: `Schadenmeldung: ${daten.art}${daten.tesla ? " (Tesla)" : ""}`, text: mailText(daten), anhaenge }),
  });
  if (!r.ok) return antwort(502, { ok: false, fehler: ["mail"] });
  await bestaetigen(env, daten);
  return antwort(200, { ok: true });
}
