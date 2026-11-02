import { NextResponse } from "next/server";
import { log } from "@/lib/log";
import { versandLaufen } from "@/lib/versand.server";

// Vom Zeitplan aufgerufen (pg_cron + pg_net oder Cloudflare Cron), alle 15 Minuten. Nur mit dem Versand-Geheimnis.
export async function POST(req: Request) {
  const kopf = req.headers.get("authorization") ?? "";
  const geheimnis = kopf.startsWith("Bearer ") ? kopf.slice(7).trim() : "";
  if (geheimnis.length < 16 || geheimnis.length > 200) return new NextResponse(null, { status: 401 });
  const r = await versandLaufen(geheimnis);
  if (!r) { log({ aktion: "versand", status: "abgelehnt" }); return new NextResponse(null, { status: 401 }); }
  log({ aktion: "versand", status: `${r.gesendet}_${r.fehler}` });
  return NextResponse.json(r);
}
