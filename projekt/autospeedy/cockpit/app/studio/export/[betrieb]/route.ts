import { NextResponse } from "next/server";
import { holeBackend } from "@/lib/backend.server";
import { csv } from "@/lib/csv";
import { log } from "@/lib/log";

const SPALTEN = ["erstellt", "art", "tesla", "tesla_modell", "stellen", "bemerkung", "name", "telefon", "email", "quelle", "status", "notiz"];

// CSV-Export eines Betriebs. Prüft selbst (nicht nur der Proxy): Sitzung mit zweitem Faktor und Studio-Admin.
export async function GET(_req: Request, { params }: { params: Promise<{ betrieb: string }> }) {
  const { betrieb } = await params;
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || s.aal !== "aal2" || !/^[a-z0-9-]{2,40}$/.test(betrieb) || !(await b.istStudioAdmin())) { log({ aktion: "export", status: "abgelehnt" }); return new NextResponse(null, { status: 403 }); }
  const zeilen = await b.exportMeldungen(betrieb);
  if (!zeilen) return new NextResponse(null, { status: 404 });
  log({ aktion: "export", status: "ok" });
  return new NextResponse(csv(SPALTEN, zeilen), { headers: {
    "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="meldungen-${betrieb}-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store",
  } });
}
