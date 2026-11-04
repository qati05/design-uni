// Cloudflare Access (BAUPLAN 4.1/4.0): prüft das Zugriffs-JWT, das Access vor /admin/* und /api/admin/* setzt.
// Header «Cf-Access-Jwt-Assertion», signiert mit RS256. Die öffentlichen Schlüssel kommen von der Team-Domain
// (…/cdn-cgi/access/certs) als JWKS und werden im Speicher der Function zwischengespeichert (kein Datenspeicher).
// Geprüft werden Signatur, iss (Team-Domain), aud (= ACCESS_AUD) und exp. Fehlt oder stimmt etwas nicht → null.
// Rückgabe bei Erfolg: die Mailadresse aus dem Token — nur für die Commit-Nachricht («durch <mail>»), nie geloggt.
// Nur Web Crypto und fetch; läuft bei Cloudflare und im Node-Test (fetch wird dort als Attrappe gesetzt).

const SPEICHER = new Map(); // team-URL -> { kid: CryptoKey, geholt: zeit }
const FRISCH_MS = 60 * 60 * 1000; // Schlüssel höchstens eine Stunde halten

function teamBasis(env) {
  const t = env && env.ACCESS_TEAM;
  if (!t) return null;
  // Entweder der Teamname («auto-speedy») oder die ganze Domain – beides zulassen.
  return /^https?:\/\//.test(t) ? t.replace(/\/+$/, "") : `https://${t}.cloudflareaccess.com`;
}

function b64urlZuBytes(s) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const roh = atob(b64);
  const aus = new Uint8Array(roh.length);
  for (let i = 0; i < roh.length; i++) aus[i] = roh.charCodeAt(i);
  return aus;
}
function b64urlZuText(s) { return new TextDecoder().decode(b64urlZuBytes(s)); }

async function schluessel(env, kid) {
  const basis = teamBasis(env);
  if (!basis) return null;
  const eintrag = SPEICHER.get(basis);
  const frisch = eintrag && (Date.now() - eintrag.geholt) < FRISCH_MS;
  if (frisch && eintrag.keys.has(kid)) return eintrag.keys.get(kid);
  // (Neu) holen: JWKS von der Team-Domain. Nur der öffentliche Teil, kein Geheimnis.
  let keys;
  try {
    const r = await fetch(`${basis}/cdn-cgi/access/certs`, { signal: AbortSignal.timeout(10000) });
    if (!r || !r.ok) return null;
    const daten = await r.json();
    keys = new Map();
    for (const jwk of daten.keys || []) {
      if (!jwk.kid) continue;
      const k = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
      keys.set(jwk.kid, k);
    }
  } catch { return null; }
  SPEICHER.set(basis, { keys, geholt: Date.now() });
  return keys.get(kid) || null;
}

/**
 * Prüft das Access-JWT aus dem Request. Gibt die Mailadresse zurück oder null (dann antwortet die Function mit 401).
 * @returns {Promise<string|null>}
 */
export async function access(request, env) {
  if (!env || !env.ACCESS_AUD || !teamBasis(env)) return null;
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || token.split(".").length !== 3) return null;
  const [kopf, nutz, sig] = token.split(".");
  let header, payload;
  try { header = JSON.parse(b64urlZuText(kopf)); payload = JSON.parse(b64urlZuText(nutz)); } catch { return null; }
  if (header.alg !== "RS256" || !header.kid) return null;

  const key = await schluessel(env, header.kid);
  if (!key) return null;
  let gueltig = false;
  try {
    gueltig = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlZuBytes(sig), new TextEncoder().encode(`${kopf}.${nutz}`));
  } catch { return null; }
  if (!gueltig) return null;

  // iss = Team-Domain, aud enthält ACCESS_AUD, exp in der Zukunft (mit kleiner Toleranz).
  if (payload.iss !== teamBasis(env)) return null;
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(env.ACCESS_AUD)) return null;
  const jetzt = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || payload.exp + 60 < jetzt) return null;
  if (typeof payload.nbf === "number" && payload.nbf - 60 > jetzt) return null;

  const mail = payload.email || (payload.identity && payload.identity.email);
  return typeof mail === "string" && mail ? mail : null;
}

/** Nur für Tests: den Schlüssel-Zwischenspeicher leeren. */
export function _speicherLeeren() { SPEICHER.clear(); }
