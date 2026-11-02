"use client";

import { useState } from "react";
import { passkeyAbschliessen, passkeyStarten } from "./aktionen";

// Fingerabdruck oder Gesicht (WebAuthn). Der Browser fragt das Gerät; das Cockpit sieht nie einen Fingerabdruck,
// nur eine Unterschrift, die nur dieses Gerät erzeugen kann.
const b64uZuBuffer = (s: string) => { const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)); return Uint8Array.from(b, (c) => c.charCodeAt(0)).buffer; };
const bufferZuB64u = (b: ArrayBuffer | null | undefined) => (b ? btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : undefined);
type Liste = { id: string; type: string; transports?: string[] }[] | undefined;
const ids = (l: Liste) => l?.map((c) => ({ ...c, id: b64uZuBuffer(c.id) }));

type PKC = typeof PublicKeyCredential & { parseCreationOptionsFromJSON?: (o: unknown) => PublicKeyCredentialCreationOptions; parseRequestOptionsFromJSON?: (o: unknown) => PublicKeyCredentialRequestOptions };

function erstellOptionen(o: Record<string, unknown>): PublicKeyCredentialCreationOptions {
  const P = PublicKeyCredential as PKC;
  if (P.parseCreationOptionsFromJSON) return P.parseCreationOptionsFromJSON(o);
  const user = o.user as { id: string; name: string; displayName: string };
  return { ...(o as object), challenge: b64uZuBuffer(o.challenge as string), user: { ...user, id: b64uZuBuffer(user.id) }, excludeCredentials: ids(o.excludeCredentials as Liste) } as unknown as PublicKeyCredentialCreationOptions;
}
function anfrageOptionen(o: Record<string, unknown>): PublicKeyCredentialRequestOptions {
  const P = PublicKeyCredential as PKC;
  if (P.parseRequestOptionsFromJSON) return P.parseRequestOptionsFromJSON(o);
  return { ...(o as object), challenge: b64uZuBuffer(o.challenge as string), allowCredentials: ids(o.allowCredentials as Liste) } as unknown as PublicKeyCredentialRequestOptions;
}
function alsJson(c: PublicKeyCredential): unknown {
  const j = (c as PublicKeyCredential & { toJSON?: () => unknown }).toJSON;
  if (typeof j === "function") return j.call(c);
  const basis = { id: c.id, rawId: c.id, type: c.type, clientExtensionResults: c.getClientExtensionResults() };
  if ("attestationObject" in c.response) { const r = c.response as AuthenticatorAttestationResponse; return { ...basis, response: { clientDataJSON: bufferZuB64u(r.clientDataJSON), attestationObject: bufferZuB64u(r.attestationObject), authenticatorData: bufferZuB64u(r.getAuthenticatorData?.()), publicKey: bufferZuB64u(r.getPublicKey?.()), publicKeyAlgorithm: r.getPublicKeyAlgorithm?.() } }; }
  const r = c.response as AuthenticatorAssertionResponse;
  return { ...basis, response: { clientDataJSON: bufferZuB64u(r.clientDataJSON), authenticatorData: bufferZuB64u(r.authenticatorData), signature: bufferZuB64u(r.signature), userHandle: bufferZuB64u(r.userHandle) } };
}

function vermuteGeraet(): string {
  const u = navigator.userAgent;
  if (/iPhone/.test(u)) return "iPhone"; if (/iPad/.test(u)) return "iPad"; if (/Android/.test(u)) return "Android-Handy";
  if (/Macintosh/.test(u)) return "Mac"; if (/Windows/.test(u)) return "Windows-PC"; return "Gerät";
}

export function PasskeyKnopf({ zweck, weiter, text }: { zweck: "anmelden" | "einrichten"; weiter: string; text: string }) {
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState("");
  async function los() {
    setMeldung("");
    if (!("PublicKeyCredential" in window) || !navigator.credentials) { setMeldung("Dieser Browser kann keinen Fingerabdruck. Bitte Safari, Chrome oder Edge in aktueller Version nutzen."); return; }
    setLaeuft(true);
    try {
      const s = await passkeyStarten(zweck, vermuteGeraet());
      if (!s.ok) { setMeldung(s.meldung); return; }
      const c = (s.art === "create"
        ? await navigator.credentials.create({ publicKey: erstellOptionen(s.optionen) })
        : await navigator.credentials.get({ publicKey: anfrageOptionen(s.optionen) })) as PublicKeyCredential | null;
      if (!c) { setMeldung("Abgebrochen. Bitte nochmals tippen."); return; }
      const a = await passkeyAbschliessen(s.vorgang, alsJson(c), weiter);
      if (a?.meldung) setMeldung(a.meldung);
    } catch (e) {
      const n = (e as { name?: string })?.name;
      if (n === "NEXT_REDIRECT" || String((e as { digest?: string })?.digest ?? "").startsWith("NEXT_REDIRECT")) throw e;
      setMeldung(n === "NotAllowedError" ? "Abgebrochen oder nicht erkannt. Bitte nochmals tippen." : n === "InvalidStateError" ? "Dieses Gerät ist schon eingerichtet." : "Das hat nicht geklappt. Bitte nochmals versuchen.");
    } finally { setLaeuft(false); }
  }
  return (
    <div className="passkey">
      <button type="button" className="knopf gross" onClick={los} disabled={laeuft}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 11v3m-4-3a4 4 0 1 1 8 0v2a8 8 0 0 1-1 4M6.5 8.5A6.5 6.5 0 0 1 18.5 11v1M5 13.5c.3 2 1 3.6 2 5M9 21c-.6-1-1-2.4-1-4v-6"/></svg>
        {laeuft ? "Bitte am Gerät bestätigen …" : text}
      </button>
      {meldung ? <p className="meldung-text" role="alert">{meldung}</p> : null}
    </div>
  );
}
