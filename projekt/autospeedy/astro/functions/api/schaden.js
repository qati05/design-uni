// Formular-Backend für die Schadenmeldung (Cloudflare Pages Function, Route POST /api/schaden).
// Stand: gebaut und lokal getestet (test/schaden.test.mjs), NICHT deployt. Erst aktiv, wenn
//   1. bau.json formularEndpunkt = "/api/schaden",
//   2. am Hoster MAIL_ENDPUNKT (HTTPS-Adresse des Mail-Dienstes), MAIL_SCHLUESSEL und MAIL_AN gesetzt sind,
//   3. die Datenschutzerklärung den Mail-Dienst nennt (text-uni CL3).
// Speichert nichts. Prüft Pflichtfelder, Längen, Herkunft und Spamschutz (Honigtopf «website»).
// Der Mail-Dienst ist bewusst nicht festgelegt (Anbieter mit Sitz in der Schweiz oder EU bevorzugt, Entscheid offen).

const GRENZEN = { fahrzeug: 40, beschreibung: 3000, name: 120, telefon: 40, stelle: 40, stellen: 12 };
const FAHRZEUGE = ["Tesla", "Andere Marke"];

function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}

export function pruefe(e) {
  const fehler = [];
  const text = (v) => (typeof v === "string" ? v.trim() : "");
  const d = {
    fahrzeug: text(e.fahrzeug), beschreibung: text(e.beschreibung), name: text(e.name), telefon: text(e.telefon),
    stellen: Array.isArray(e.stellen) ? e.stellen.map(text).filter(Boolean) : [], website: text(e.website),
  };
  if (!FAHRZEUGE.includes(d.fahrzeug)) fehler.push("fahrzeug");
  if (!d.beschreibung || d.beschreibung.length > GRENZEN.beschreibung) fehler.push("beschreibung");
  if (!d.name || d.name.length > GRENZEN.name) fehler.push("name");
  if (!/^[+0-9 ()./-]{6,40}$/.test(d.telefon)) fehler.push("telefon");
  if (d.stellen.length > GRENZEN.stellen || d.stellen.some((s) => s.length > GRENZEN.stelle)) fehler.push("stellen");
  return { daten: d, fehler };
}

export function mailText(d) {
  return [
    "Schadenmeldung über die Website",
    "",
    `Fahrzeug: ${d.fahrzeug}`,
    `Stellen: ${d.stellen.join(", ") || "nicht angegeben"}`,
    `Was ist passiert: ${d.beschreibung}`,
    `Name: ${d.name}`,
    `Telefon: ${d.telefon}`,
  ].join("\n");
}

export async function onRequestPost({ request, env }) {
  const herkunft = request.headers.get("Origin");
  if (env.ERLAUBTE_HERKUNFT && herkunft && herkunft !== env.ERLAUBTE_HERKUNFT) return antwort(403, { ok: false, fehler: ["herkunft"] });
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) return antwort(415, { ok: false, fehler: ["format"] });
  const roh = await request.text();
  if (roh.length > 10000) return antwort(413, { ok: false, fehler: ["groesse"] });
  let eingabe;
  try { eingabe = JSON.parse(roh); } catch { return antwort(400, { ok: false, fehler: ["format"] }); }
  const { daten, fehler } = pruefe(eingabe || {});
  if (daten.website) return antwort(200, { ok: true }); // Honigtopf: still annehmen, nichts senden
  if (fehler.length) return antwort(422, { ok: false, fehler });
  if (!env.MAIL_ENDPUNKT || !env.MAIL_SCHLUESSEL || !env.MAIL_AN) return antwort(503, { ok: false, fehler: ["nicht-eingerichtet"] });
  const r = await fetch(env.MAIL_ENDPUNKT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.MAIL_SCHLUESSEL}` },
    body: JSON.stringify({ an: env.MAIL_AN, betreff: `Schadenmeldung: ${daten.stellen[0] || daten.fahrzeug}`, text: mailText(daten), antwortAn: null }),
  });
  if (!r.ok) return antwort(502, { ok: false, fehler: ["mail"] });
  return antwort(200, { ok: true });
}
