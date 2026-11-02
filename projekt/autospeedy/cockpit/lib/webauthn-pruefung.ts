// Prüfung von Fingerabdruck/Gesicht (WebAuthn) für den Demo-Modus, ohne Bibliothek, mit node:crypto.
// Im echten Betrieb prüft Supabase Auth (MFA-Faktor «webauthn»); diese Datei ersetzt das nur in der Demo,
// damit die Demo dieselbe Zeremonie im Browser zeigt (Handy: Fingerabdruck oder Gesicht, Laptop: Touch ID / Windows Hello).
import { createHash, createPublicKey, verify as cryptoVerify, timingSafeEqual } from "node:crypto";

export type PasskeyGespeichert = { id: string; spki: string; alg: number; zaehler: number; name: string };
export type Pruefung<T> = { ok: true; wert: T } | { ok: false; grund: string };

const b64u = (s: unknown): Buffer | null => (typeof s === "string" && /^[A-Za-z0-9_-]*$/.test(s) ? Buffer.from(s, "base64url") : null);
const sha256 = (b: Buffer | string) => createHash("sha256").update(b).digest();

type ClientData = { type: string; challenge: string; origin: string; crossOrigin?: boolean };

function clientDataPruefen(roh: Buffer, typ: "webauthn.create" | "webauthn.get", challenge: string, origin: string): string | null {
  let c: ClientData;
  try { c = JSON.parse(roh.toString("utf8")); } catch { return "clientData unlesbar"; }
  if (c.type !== typ) return "falscher Typ";
  const a = Buffer.from(String(c.challenge)), b = Buffer.from(challenge);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return "falsche Challenge";
  if (c.origin !== origin) return "falscher Ursprung";
  if (c.crossOrigin) return "fremder Rahmen";
  return null;
}

/** authenticatorData: rpIdHash (32) | flags (1) | signCount (4) | … */
function authDataPruefen(ad: Buffer, rpId: string): Pruefung<{ zaehler: number }> {
  if (ad.length < 37) return { ok: false, grund: "authenticatorData zu kurz" };
  if (!ad.subarray(0, 32).equals(sha256(rpId))) return { ok: false, grund: "falsche rpId" };
  const flags = ad[32]!;
  if (!(flags & 0x01)) return { ok: false, grund: "Person nicht anwesend" };
  if (!(flags & 0x04)) return { ok: false, grund: "ohne Fingerabdruck, Gesicht oder PIN" }; // UV: das Gerät hat die Person geprüft
  return { ok: true, wert: { zaehler: ad.readUInt32BE(33) } };
}

type RegistrierungJson = { id?: unknown; type?: unknown; response?: { clientDataJSON?: unknown; authenticatorData?: unknown; publicKey?: unknown; publicKeyAlgorithm?: unknown } };
type AnmeldungJson = { id?: unknown; type?: unknown; response?: { clientDataJSON?: unknown; authenticatorData?: unknown; signature?: unknown } };

export const ERLAUBTE_ALGORITHMEN = [-7, -257, -8]; // ES256, RS256, Ed25519

export function registrierungPruefen(j: RegistrierungJson, erwartet: { challenge: string; origin: string; rpId: string; name: string }): Pruefung<PasskeyGespeichert> {
  const r = j?.response;
  const cd = b64u(r?.clientDataJSON), ad = b64u(r?.authenticatorData), spki = b64u(r?.publicKey);
  if (j?.type !== "public-key" || typeof j.id !== "string" || !/^[A-Za-z0-9_-]{16,1024}$/.test(j.id) || !cd || !ad || !spki) return { ok: false, grund: "Antwort unvollständig" };
  const alg = Number(r?.publicKeyAlgorithm);
  if (!ERLAUBTE_ALGORITHMEN.includes(alg)) return { ok: false, grund: "Verfahren nicht erlaubt" };
  const f = clientDataPruefen(cd, "webauthn.create", erwartet.challenge, erwartet.origin);
  if (f) return { ok: false, grund: f };
  const a = authDataPruefen(ad, erwartet.rpId);
  if (!a.ok) return a;
  try { createPublicKey({ key: spki, format: "der", type: "spki" }); } catch { return { ok: false, grund: "Schlüssel unlesbar" }; }
  return { ok: true, wert: { id: j.id, spki: spki.toString("base64url"), alg, zaehler: a.wert.zaehler, name: erwartet.name } };
}

export function anmeldungPruefen(j: AnmeldungJson, schluessel: PasskeyGespeichert[], erwartet: { challenge: string; origin: string; rpId: string }): Pruefung<{ id: string; zaehler: number }> {
  const r = j?.response;
  const cd = b64u(r?.clientDataJSON), ad = b64u(r?.authenticatorData), sig = b64u(r?.signature);
  if (j?.type !== "public-key" || typeof j.id !== "string" || !cd || !ad || !sig) return { ok: false, grund: "Antwort unvollständig" };
  const k = schluessel.find((s) => s.id === j.id);
  if (!k) return { ok: false, grund: "Gerät nicht eingerichtet" };
  const f = clientDataPruefen(cd, "webauthn.get", erwartet.challenge, erwartet.origin);
  if (f) return { ok: false, grund: f };
  const a = authDataPruefen(ad, erwartet.rpId);
  if (!a.ok) return a;
  const daten = Buffer.concat([ad, sha256(cd)]);
  const key = createPublicKey({ key: Buffer.from(k.spki, "base64url"), format: "der", type: "spki" });
  let gut = false;
  try { gut = cryptoVerify(k.alg === -8 ? null : "sha256", daten, key, sig); } catch { gut = false; }
  if (!gut) return { ok: false, grund: "Unterschrift falsch" };
  // Zähler: wenn das Gerät zählt, muss er steigen (Hinweis auf kopierten Schlüssel). Viele Passkeys senden 0.
  if (a.wert.zaehler !== 0 && a.wert.zaehler <= k.zaehler) return { ok: false, grund: "Zähler nicht gestiegen" };
  return { ok: true, wert: { id: k.id, zaehler: a.wert.zaehler } };
}
