// Cloudflare Access JWT-Prüfung (gemeinsam/access.js, BAUPLAN 4.1). Selbst erzeugter RSA-Schlüssel (keine echten Aufrufe):
// gültig, falsches aud, abgelaufen. Das Zertifikat-Endpunkt wird als fetch-Attrappe geliefert; kein Netz, kein Schlüssel im Log.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { access, _speicherLeeren } from "../../gemeinsam/access.js";

const TEAM = "auto-speedy";
const AUD = "test-aud-123";
const KID = "test-key-1";
const ISS = `https://${TEAM}.cloudflareaccess.com`;
const env = { ACCESS_TEAM: TEAM, ACCESS_AUD: AUD };

const b64url = (buf) => Buffer.from(buf).toString("base64url");
const teilB64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");

let privat, jwk, echterFetch;

async function jwt(payload, { alg = "RS256", kid = KID } = {}) {
  const kopf = teilB64url({ alg, kid });
  const nutz = teilB64url(payload);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privat, new TextEncoder().encode(`${kopf}.${nutz}`));
  return `${kopf}.${nutz}.${b64url(new Uint8Array(sig))}`;
}
const anfrage = (token) => ({ headers: { get: (k) => (k === "Cf-Access-Jwt-Assertion" ? token : null) } });
const jetzt = () => Math.floor(Date.now() / 1000);

before(async () => {
  const paar = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
  privat = paar.privateKey;
  jwk = await crypto.subtle.exportKey("jwk", paar.publicKey);
  jwk.kid = KID; jwk.alg = "RS256"; jwk.use = "sig";
  echterFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).includes("/cdn-cgi/access/certs")) return { ok: true, status: 200, json: async () => ({ keys: [jwk] }) };
    throw new Error("unerwarteter fetch im Test: " + url);
  };
  _speicherLeeren();
});
after(() => { globalThis.fetch = echterFetch; });

test("gültiges JWT: Mailadresse wird zurückgegeben", async () => {
  const token = await jwt({ iss: ISS, aud: AUD, exp: jetzt() + 600, email: "chef@autospeedy.ch" });
  assert.equal(await access(anfrage(token), env), "chef@autospeedy.ch");
});

test("falsches aud: null", async () => {
  const token = await jwt({ iss: ISS, aud: "anderes-aud", exp: jetzt() + 600, email: "chef@autospeedy.ch" });
  assert.equal(await access(anfrage(token), env), null);
});

test("abgelaufen: null", async () => {
  const token = await jwt({ iss: ISS, aud: AUD, exp: jetzt() - 3600, email: "chef@autospeedy.ch" });
  assert.equal(await access(anfrage(token), env), null);
});

test("falscher iss: null", async () => {
  const token = await jwt({ iss: "https://boese.cloudflareaccess.com", aud: AUD, exp: jetzt() + 600, email: "chef@autospeedy.ch" });
  assert.equal(await access(anfrage(token), env), null);
});

test("kein Header: null", async () => {
  assert.equal(await access(anfrage(null), env), null);
});

test("manipulierte Signatur: null", async () => {
  const token = await jwt({ iss: ISS, aud: AUD, exp: jetzt() + 600, email: "chef@autospeedy.ch" });
  const kaputt = token.slice(0, -4) + "AAAA";
  assert.equal(await access(anfrage(kaputt), env), null);
});
