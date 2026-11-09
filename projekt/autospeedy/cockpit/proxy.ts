import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_GRUNDLAGE, haerte } from "./lib/cookies";
import { DEMO_COOKIE, DEMO_MITGLIED, sitzungLesen } from "./lib/demo-speicher";
import { log } from "./lib/log";
import { baueCsp, sicherheitsHeader } from "./lib/sicherheit";
import { entscheideZugang, type Zugang, type ZugangsAbfragen } from "./lib/zugang";

// Läuft vor jeder Seite (Muster aus qati05/medaur cockpit-app/proxy.ts): Nonce-CSP und no-store,
// Sitzung erneuern, Zugang entscheiden. Ohne Sitzung -> /login, Mitglied mit Mail-Code -> weiter, sonst 403.

function nonceErzeugen(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Buffer.from(b).toString("base64");
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const nonce = nonceErzeugen();
  const demo = process.env.COCKPIT_DEMO === "1";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const csp = baueCsp(nonce, { supabaseUrl: demo ? undefined : supabaseUrl, entwicklung: process.env.NODE_ENV === "development" });
  const kopf = new Headers(request.headers);
  kopf.set("x-nonce", nonce);
  kopf.set("Content-Security-Policy", csp);
  let antwort = NextResponse.next({ request: { headers: kopf } });
  const neueCookies: { name: string; value: string; options: ReturnType<typeof haerte> }[] = [];
  const pfad = request.nextUrl.pathname;

  let abfragen: ZugangsAbfragen;
  if (demo) {
    const s = sitzungLesen(request.cookies.get(DEMO_COOKIE)?.value);
    abfragen = {
      hatSitzung: !!s,
      nutzerId: async () => s?.uid ?? null,
      istMitglied: async () => s?.email === DEMO_MITGLIED.email,
    };
  } else {
    let supabase: ReturnType<typeof createServerClient> | null = null;
    const hole = () => {
      if (supabase) return supabase;
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anon) throw new Error("Supabase nicht konfiguriert");
      supabase = createServerClient(supabaseUrl, anon, {
        cookieOptions: COOKIE_GRUNDLAGE,
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (liste) => {
            for (const { name, value } of liste) request.cookies.set(name, value);
            antwort = NextResponse.next({ request: { headers: kopf } });
            for (const { name, value, options } of liste) { const o = haerte(options); neueCookies.push({ name, value, options: o }); antwort.cookies.set(name, value, o); }
          },
        },
      });
      return supabase;
    };
    abfragen = {
      hatSitzung: request.cookies.getAll().some((c) => c.name.startsWith("sb-")),
      nutzerId: async () => (await hole().auth.getUser()).data.user?.id ?? null,
      istMitglied: async () => (await hole().rpc("ist_mitglied")).data === true,
    };
  }

  let zugang: Zugang;
  try { zugang = await entscheideZugang(pfad, abfragen); }
  catch { log({ aktion: "proxy", status: "fehler" }); zugang = { art: "login" }; }

  if (zugang.art === "login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login"; url.search = "";
    antwort = NextResponse.redirect(url, 303);
    for (const c of neueCookies) antwort.cookies.set(c.name, c.value, c.options);
  } else if (zugang.art === "verboten") {
    log({ aktion: "zugang_abgelehnt", status: "abgelehnt" });
    const url = request.nextUrl.clone(); url.pathname = "/403"; url.search = "";
    antwort = NextResponse.rewrite(url, { status: 403, request: { headers: kopf } });
  }
  for (const h of sicherheitsHeader()) antwort.headers.set(h.key, h.value);
  if (!pfad.startsWith("/api/")) antwort.headers.set("Content-Security-Policy", csp);
  return antwort;
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
