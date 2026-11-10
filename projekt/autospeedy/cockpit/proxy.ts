import { type NextRequest, NextResponse } from "next/server";
import { log } from "./lib/log";
import { baueCsp, sicherheitsHeader } from "./lib/sicherheit";
import { entscheideZugang, type Zugang } from "./lib/zugang";
import { access } from "../gemeinsam/access.js";

// Läuft vor jeder Seite: Nonce-CSP und no-store, dann der Zugang. Im Betrieb steht Cloudflare Access vor dem Cockpit;
// hier wird sein Ausweis geprüft (gleiche Prüfung wie lib/zugriff.server.ts). Ohne gültigen Ausweis: 403.
// Demo (COCKPIT_DEMO=1, nur lokal): ohne Anmeldung.

function nonceErzeugen(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Buffer.from(b).toString("base64");
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const nonce = nonceErzeugen();
  const demo = process.env.COCKPIT_DEMO === "1";
  const csp = baueCsp(nonce, { entwicklung: process.env.NODE_ENV === "development", bildSpeicher: demo ? undefined : process.env.TEAMFOTO_BASIS });
  const kopf = new Headers(request.headers);
  kopf.set("x-nonce", nonce);
  kopf.set("Content-Security-Policy", csp);
  let antwort = NextResponse.next({ request: { headers: kopf } });
  const pfad = request.nextUrl.pathname;

  let zugang: Zugang;
  try { zugang = await entscheideZugang(pfad, async () => demo || !!(await access(request, { ACCESS_TEAM: process.env.ACCESS_TEAM, ACCESS_AUD: process.env.ACCESS_AUD }))); }
  catch { log({ aktion: "proxy", status: "fehler" }); zugang = { art: "verboten" }; }

  if (zugang.art === "verboten") {
    log({ aktion: "zugang_abgelehnt", status: "abgelehnt" });
    const url = request.nextUrl.clone(); url.pathname = "/403"; url.search = "";
    antwort = NextResponse.rewrite(url, { status: 403, request: { headers: kopf } });
  }
  for (const h of sicherheitsHeader()) antwort.headers.set(h.key, h.value);
  if (!pfad.startsWith("/api/")) antwort.headers.set("Content-Security-Policy", csp);
  return antwort;
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
