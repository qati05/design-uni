// Formular-Backend für die Schadenmeldung, Weg A (Cloudflare Pages Function, Route POST /api/schaden).
// Stand: gebaut und lokal getestet (test/schaden.test.mjs), NICHT deployt. Erst aktiv, wenn
//   1. bau.json formularEndpunkt = "/api/schaden",
//   2. am Hoster MAIL_ENDPUNKT (HTTPS-Adresse des Mail-Dienstes), MAIL_SCHLUESSEL, MAIL_AN gesetzt sind,
//   3. die Datenschutzerklärung den Mail-Dienst nennt (text-uni CL3).
// Nimmt multipart/form-data an. Fotos gehen als Anhang mit der Mail; die Funktion speichert nichts.
// Prüft Pflichtfelder, Längen, Herkunft, Grösse, Bildtyp und Spamschutz (Honigtopf «website»).

const ARTEN = ["Parkschaden", "Unfall", "Hagel", "Kratzer oder Lack", "Scheibe", "Felge", "Etwas anderes"];
const GRENZEN = { bemerkung: 3000, name: 120, telefon: 40, stelle: 40, stellen: 12, fotos: 6, fotoBytes: 2.5e6, gesamt: 16e6 };

function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
const text = (v) => (typeof v === "string" ? v.trim() : "");

export function pruefe(e) {
  const fehler = [];
  const d = {
    art: text(e.art), name: text(e.name), telefon: text(e.telefon), bemerkung: text(e.bemerkung),
    tesla: e.tesla === "ja", stellen: (e.stellen || []).map(text).filter(Boolean), website: text(e.website), fotos: e.fotos || [],
  };
  if (!ARTEN.includes(d.art)) fehler.push("art");
  if (!d.name || d.name.length > GRENZEN.name) fehler.push("name");
  if (!/^[+0-9 ()./-]{6,40}$/.test(d.telefon)) fehler.push("telefon");
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
  ].join("\n");
}

function base64(puffer) {
  let s = ""; const b = new Uint8Array(puffer);
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return btoa(s);
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
    art: form.get("art"), name: form.get("name"), telefon: form.get("telefon"), bemerkung: form.get("bemerkung") || "",
    tesla: form.get("tesla"), stellen: form.getAll("stelle"), website: form.get("website") || "", fotos,
  });
  if (daten.website) return antwort(200, { ok: true }); // Honigtopf: still annehmen, nichts senden
  if (fehler.length) return antwort(422, { ok: false, fehler });
  if (!env.MAIL_ENDPUNKT || !env.MAIL_SCHLUESSEL || !env.MAIL_AN) return antwort(503, { ok: false, fehler: ["nicht-eingerichtet"] });
  const anhaenge = [];
  for (const [i, f] of fotos.entries()) anhaenge.push({ name: `schaden-${i + 1}.jpg`, typ: "image/jpeg", inhalt: base64(await f.arrayBuffer()) });
  const r = await fetch(env.MAIL_ENDPUNKT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.MAIL_SCHLUESSEL}` },
    body: JSON.stringify({ an: env.MAIL_AN, betreff: `Schadenmeldung: ${daten.art}${daten.tesla ? " (Tesla)" : ""}`, text: mailText(daten), anhaenge }),
  });
  if (!r.ok) return antwort(502, { ok: false, fehler: ["mail"] });
  return antwort(200, { ok: true });
}
