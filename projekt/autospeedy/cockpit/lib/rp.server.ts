import "server-only";
import { headers } from "next/headers";
import type { Rp } from "./backend";

/** Für wen der Fingerabdruck gilt: die Adresse des Cockpits. Im Betrieb fest aus COCKPIT_ORIGIN (nie aus dem Host-Header),
 *  in Demo und Entwicklung aus der Anfrage (localhost). */
export async function rp(): Promise<Rp> {
  const fest = process.env.COCKPIT_ORIGIN;
  if (fest) { const u = new URL(fest); return { rpId: u.hostname, origin: u.origin }; }
  if (process.env.COCKPIT_DEMO !== "1" && process.env.NODE_ENV === "production") throw new Error("COCKPIT_ORIGIN fehlt");
  const h = await headers();
  const host = h.get("host") ?? "localhost";
  if (!/^[a-z0-9.-]+(:\d{1,5})?$/i.test(host)) throw new Error("Host ungültig");
  const proto = h.get("x-forwarded-proto") === "https" ? "https" : "http";
  return { rpId: host.replace(/:\d+$/, ""), origin: `${proto}://${host}` };
}
