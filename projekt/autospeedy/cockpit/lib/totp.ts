// TOTP nach RFC 6238 (SHA-1, 30 s, 6 Ziffern), nur für den Demo-Modus: im echten Betrieb prüft Supabase Auth.
import { createHmac } from "node:crypto";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function base32Lesen(s: string): Buffer {
  let bits = "";
  for (const z of s.replace(/=+$/, "").toUpperCase()) {
    const i = B32.indexOf(z);
    if (i < 0) throw new Error("base32");
    bits += i.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

export function totp(geheimnis: string, zeitMs = Date.now(), schritt = 30): string {
  const zaehler = Math.floor(zeitMs / 1000 / schritt);
  const puffer = Buffer.alloc(8);
  puffer.writeBigUInt64BE(BigInt(zaehler));
  const h = createHmac("sha1", base32Lesen(geheimnis)).update(puffer).digest();
  const o = h[h.length - 1]! & 0xf;
  const zahl = ((h[o]! & 0x7f) << 24) | (h[o + 1]! << 16) | (h[o + 2]! << 8) | h[o + 3]!;
  return String(zahl % 1_000_000).padStart(6, "0");
}

/** Akzeptiert den aktuellen und den vorherigen Zeitschritt (Uhrabweichung). */
export function totpPruefen(geheimnis: string, code: string, zeitMs = Date.now()): boolean {
  return [0, -30_000].some((d) => totp(geheimnis, zeitMs + d) === code);
}
