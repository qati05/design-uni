// Schutz für die Formular-Funktionen der Website (POST /api/schaden, POST /api/rueckruf): eine Regel, zwei Formulare.
// Reihenfolge in jeder Funktion: Origin, Format/Grösse, Honigtopf, Zeitfalle, Drossel, Turnstile, Prüfung, Mail.
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

/** Gibt es eine Bremse gegen Massenversand? Das Rate-Limiting-Binding DROSSEL (nur Workers) oder ein KV-Namespace
 *  DROSSEL_KV (Cloudflare Pages kennt das Rate-Limiting-Binding nicht, KV schon). */
export const drosselAktiv = (env) =>
  !!(env.DROSSEL && typeof env.DROSSEL.limit === "function") || !!(env.DROSSEL_KV && typeof env.DROSSEL_KV.get === "function" && typeof env.DROSSEL_KV.put === "function");

/** Livegang: Ohne Herkunftsprüfung und Zeitfalle läuft das Formular nicht offen weiter, sondern meldet «nicht bereit».
 *  Seit 10.11.2026 zusätzlich: mindestens eine Bremse gegen Massenversand (Turnstile mit Server-Prüfung oder Drossel),
 *  und nie ein sichtbares Turnstile ohne Server-Prüfung (TURNSTILE_SITEKEY gesetzt, TURNSTILE_SECRET fehlt).
 *  In der Vorschau (live = false) bleibt es ohne Schlüssel bedienbar, damit man es vorführen kann. */
export const schutzBereit = (env, live) => !live || (
  !!env.ERLAUBTE_HERKUNFT && !!env.FORMULAR_HMAC
  && (!!env.TURNSTILE_SECRET || drosselAktiv(env))
  && !(env.TURNSTILE_SITEKEY && !env.TURNSTILE_SECRET));

/** Turnstile auf dem Server prüfen (siteverify). Rückgabe: "aus" (kein TURNSTILE_SECRET, nichts geprüft), "ok" oder "nein".
 *  Im Zweifel «nein»: fehlendes Token, Netzfehler oder eine unklare Antwort lassen nichts durch. Das Token gilt bei
 *  Cloudflare genau einmal. Der geheime Schlüssel steht nie in einem Log oder einer Fehlermeldung. */
export async function turnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return "aus";
  if (typeof token !== "string" || !token || token.length > 2048) return "nein";
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
    if (ip) body.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return "nein";
    const j = await r.json();
    if (!j || j.success !== true) return "nein";
    // Das Token muss für diese Website gelöst worden sein (sofern die Herkunft eingerichtet ist).
    if (env.ERLAUBTE_HERKUNFT && j.hostname && j.hostname !== new URL(env.ERLAUBTE_HERKUNFT).hostname) return "nein";
    return "ok";
  } catch { return "nein"; }
}

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

export const DROSSEL_MAX = 6; // so viele Sendungen je Fenster und Absender-Adresse (beide Formulare zusammen)
export const DROSSEL_FENSTER = 600; // Sekunden

/** Drossel je Absender. Zwei Wege:
 *  DROSSEL    Workers Rate Limiting Binding (gibt es bei Cloudflare Pages nicht).
 *  DROSSEL_KV KV-Namespace (geht bei Pages): Zähler je Fenster, verfällt nach zwei Fenstern von selbst. KV zählt nicht
 *             streng (gleichzeitige Anfragen können sich überholen); als Bremse gegen Massenversand genügt das.
 *  Schlüssel ist nie die IP selbst, sondern ein Prüfwert: HMAC mit FORMULAR_HMAC, ohne Schlüssel SHA-256.
 *  Fehlt beides, wird nicht gedrosselt; das steht dann im Log (ohne Personendaten), und live sperrt schutzBereit. */
export async function gedrosselt(env, ip, wer = "formular") {
  const wert = ip || "unbekannt";
  const key = env.FORMULAR_HMAC ? await hmacHex(env.FORMULAR_HMAC, `drossel:${wert}`) : await sha256hex(wert);
  if (env.DROSSEL && typeof env.DROSSEL.limit === "function") {
    try { const { success } = await env.DROSSEL.limit({ key }); return !success; } catch { return false; }
  }
  if (env.DROSSEL_KV && typeof env.DROSSEL_KV.get === "function" && typeof env.DROSSEL_KV.put === "function") {
    const k = `d:${key}:${Math.floor(Date.now() / 1000 / DROSSEL_FENSTER)}`;
    try {
      const n = Number(await env.DROSSEL_KV.get(k)) || 0;
      if (n >= DROSSEL_MAX) return true;
      await env.DROSSEL_KV.put(k, String(n + 1), { expirationTtl: DROSSEL_FENSTER * 2 });
      return false;
    } catch { return false; }
  }
  console.log(`${wer}: Drossel aus (weder DROSSEL noch DROSSEL_KV eingerichtet)`);
  return false;
}
