import { NextResponse } from "next/server";
import { demoZaehlen } from "@/lib/demo-speicher";

// Nur Demo: nimmt Zählungen der Website-Vorschau an (gleiche Regeln wie functions/api/zaehl.js der Website).
const MUSTER = /^[a-z0-9-]{2,40}$/;
export async function POST(req: Request) {
  if (process.env.COCKPIT_DEMO !== "1") return new NextResponse(null, { status: 404 });
  const roh = await req.text();
  if (roh.length > 200) return new NextResponse(null, { status: 413 });
  let d: { punkt?: string; ort?: string };
  try { d = JSON.parse(roh); } catch { return new NextResponse(null, { status: 400 }); }
  if (!MUSTER.test(d.punkt ?? "") || !MUSTER.test(d.ort ?? "")) return new NextResponse(null, { status: 422 });
  demoZaehlen(d.punkt!, d.ort!);
  return new NextResponse(null, { status: 204, headers: { "Access-Control-Allow-Origin": process.env.DEMO_WEBSITE_ORIGIN || "http://localhost:4331" } });
}
