// Nur für Tests: spielt Cloudflare Access. Erzeugt ein Schlüsselpaar, stellt Ausweise (JWT, RS256) aus und liefert die
// öffentlichen Schlüssel so, wie Access sie unter <team>.cloudflareaccess.com/cdn-cgi/access/certs anbietet.
import { generateKeyPairSync, createSign, type KeyObject } from "node:crypto";

export const TEAM = "auto-speedy-test";
export const AUD = "a".repeat(64);
export const BASIS = `https://${TEAM}.cloudflareaccess.com`;

export type Paar = { kid: string; privat: KeyObject; jwk: Record<string, unknown> };
export function paar(kid = "k1"): Paar {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  return { kid, privat: privateKey, jwk: { ...publicKey.export({ format: "jwk" }), kid, alg: "RS256", use: "sig" } };
}
const b64 = (x: unknown) => Buffer.from(JSON.stringify(x)).toString("base64url");
export function ausweis(p: Paar, nutz: Record<string, unknown> = {}, kopf: Record<string, unknown> = {}): string {
  const jetzt = Math.floor(Date.now() / 1000);
  const teil = `${b64({ alg: "RS256", kid: p.kid, typ: "JWT", ...kopf })}.${b64({ iss: BASIS, aud: [AUD], email: "werkstatt@beispiel.example", iat: jetzt, nbf: jetzt, exp: jetzt + 3600, ...nutz })}`;
  return `${teil}.${createSign("RSA-SHA256").update(teil).sign(p.privat).toString("base64url")}`;
}
/** fetch-Attrappe: beantwortet nur die Schlüssel-Adresse von Access; zählt die Aufrufe. */
export function accessFetch(paare: Paar[]) {
  const stand = { aufrufe: 0, adressen: [] as string[] };
  const f = async (adresse: string | URL) => {
    stand.aufrufe++; stand.adressen.push(String(adresse));
    if (String(adresse) !== `${BASIS}/cdn-cgi/access/certs`) return new Response("nein", { status: 404 });
    return Response.json({ keys: paare.map((p) => p.jwk) });
  };
  return { f, stand };
}
