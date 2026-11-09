// Schutz für die Formular-Funktionen der Website (POST /api/schaden, POST /api/rueckruf): eine Regel, zwei Formulare.
// Reihenfolge in jeder Funktion: Origin, Format/Grösse, Honigtopf, Zeitfalle, Drossel, Prüfung, Mail.
// Plain JS ohne Abhängigkeit (läuft bei Cloudflare und im Node-Test). Nichts wird gespeichert, kein Log mit Personendaten.

export const ZEIT_MIN = 4000; // Zeitfalle: frühestens so viele ms nach dem Laden des Formulars
const ZEIT_MAX = 2 * 60 * 60 * 1000; // Token älter als 2 h: neu holen

export function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}

const hex = (puffer) => [...new Uint8Array(puffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
export async function hmacHex(schluessel, text) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(schluessel), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text)));
}
export async function sha256hex(text) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}
// zeitkonstanter Vergleich zweier Hex-Strings gleicher Länge
function gleich(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Livegang: Ohne Herkunftsprüfung und Zeitfalle läuft das Formular nicht offen weiter, sondern meldet «nicht bereit».
 *  In der Vorschau (live = false) bleibt es ohne Schlüssel bedienbar, damit man es vorführen kann. */
export const schutzBereit = (env, live) => !live || (!!env.ERLAUBTE_HERKUNFT && !!env.FORMULAR_HMAC);

/** Herkunft: nur prüfen, wenn ERLAUBTE_HERKUNFT gesetzt ist (dann muss Origin genau gleich sein, fehlend = fremd). */
export const herkunftOk = (request, env) => !env.ERLAUBTE_HERKUNFT || request.headers.get("Origin") === env.ERLAUBTE_HERKUNFT;

/** GET ?t=1 → Zeitfalle-Token (HMAC über den Zeitstempel). Ohne FORMULAR_HMAC ist die Falle aus (leeres Token). */
export async function tokenAntwort(request, env) {
  const url = new URL(request.url);
  if (url.searchParams.get("t") !== "1") return antwort(404, { ok: false });
  if (!env.FORMULAR_HMAC) return antwort(200, { t: "" });
  const ts = String(Date.now());
  return antwort(200, { t: `${ts}.${await hmacHex(env.FORMULAR_HMAC, ts)}` });
}

/** Prüft das Zeitfalle-Token. Rückgabe: { stand: "ok" | "zu-schnell" | "alt" | "kaputt", warte?: ms bis zur Freigabe }. */
export async function zeitfalle(env, token, wer = "formular") {
  if (!env.FORMULAR_HMAC) { console.log(`${wer}: Zeitfalle aus (FORMULAR_HMAC fehlt)`); return { stand: "ok" }; }
  if (typeof token !== "string" || !token.includes(".")) return { stand: "kaputt" };
  const [ts, sig] = token.split(".");
  if (!/^\d+$/.test(ts) || !sig) return { stand: "kaputt" };
  if (!gleich(await hmacHex(env.FORMULAR_HMAC, ts), sig)) return { stand: "kaputt" };
  const alter = Date.now() - Number(ts);
  if (alter < ZEIT_MIN) return { stand: "zu-schnell", warte: ZEIT_MIN - alter };
  if (alter > ZEIT_MAX) return { stand: "alt" };
  return { stand: "ok" };
}

/** Drossel ohne Datenbank: Workers Rate Limiting Binding; Schlüssel = SHA-256 der IP, nicht gespeichert. */
export async function gedrosselt(env, ip) {
  if (!env.DROSSEL || typeof env.DROSSEL.limit !== "function") return false; // kein Binding: überspringen
  try {
    const { success } = await env.DROSSEL.limit({ key: await sha256hex(ip || "unbekannt") });
    return !success;
  } catch { return false; }
}
