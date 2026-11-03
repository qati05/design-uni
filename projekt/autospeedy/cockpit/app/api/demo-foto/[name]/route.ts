import { NextResponse } from "next/server";
import { speicher } from "@/lib/demo-speicher";

// Nur Demo: spielt den öffentlichen Bild-Speicher (R2) für Teamfotos. Im Betrieb 404.
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  if (process.env.COCKPIT_DEMO !== "1") return new NextResponse(null, { status: 404 });
  const { name } = await params;
  const f = /^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(name) ? speicher().fotos.get(name) : undefined;
  if (!f) return new NextResponse(null, { status: 404 });
  return new NextResponse(Buffer.from(f.bytes), { headers: { "Content-Type": f.typ, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
