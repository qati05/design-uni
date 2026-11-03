import { NextResponse } from "next/server";
import { neueId, postfachSchreiben, speicher } from "@/lib/demo-speicher";
import { log } from "@/lib/log";
import { meldungEingangSchema } from "@/lib/validierung";

// Nur Demo: nimmt Meldungen der Website-Vorschau an (gleiche Felder wie functions/api/schaden.js der Website).
// Im echten Betrieb schreibt die Serverfunktion der Website direkt in Supabase; diese Route antwortet dann 404.
const MAX_FOTOS = 6, MAX_BYTES = 2.5e6;

function cors(origin: string | null): Record<string, string> {
  const erlaubt = process.env.DEMO_WEBSITE_ORIGIN || "http://localhost:4331";
  return origin === erlaubt || origin === "null" ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST", Vary: "Origin" } : {};
}

export async function OPTIONS(req: Request) {
  if (process.env.COCKPIT_DEMO !== "1") return new NextResponse(null, { status: 404 });
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get("origin")) });
}

export async function POST(req: Request) {
  if (process.env.COCKPIT_DEMO !== "1") return new NextResponse(null, { status: 404 });
  const h = cors(req.headers.get("origin"));
  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json({ ok: false, fehler: ["format"] }, { status: 400, headers: h }); }
  if (String(form.get("website") ?? "")) return NextResponse.json({ ok: true }, { headers: h });
  const r = meldungEingangSchema.safeParse({
    art: form.get("art"), name: form.get("name"), telefon: form.get("telefon"), email: String(form.get("email") ?? "") || undefined, bemerkung: String(form.get("bemerkung") ?? ""),
    tesla: form.get("tesla") === "ja", teslaModell: form.get("tesla") === "ja" && form.get("tesla_modell") ? String(form.get("tesla_modell")) : undefined, stellen: form.getAll("stelle").map(String),
  });
  const fotos = form.getAll("foto").filter((f): f is File => typeof f === "object");
  if (!r.success || fotos.length > MAX_FOTOS || fotos.some((f) => f.type !== "image/jpeg" || f.size > MAX_BYTES)) {
    return NextResponse.json({ ok: false, fehler: ["eingabe"] }, { status: 422, headers: h });
  }
  const id = neueId();
  const bilder = await Promise.all(fotos.map(async (f) => ({ id: neueId(), url: "data:image/jpeg;base64," + Buffer.from(await f.arrayBuffer()).toString("base64") })));
  speicher().meldungen.unshift({ id, erstellt: new Date().toISOString(), ...r.data, email: r.data.email ?? null, teslaModell: r.data.teslaModell ?? null, quelle: "website", status: "neu", notiz: "", fotos: bilder });
  // Hinweis-Mail an den Betrieb ohne Personendaten: Daten bleiben im Cockpit.
  postfachSchreiben("werkstatt@autospeedy.example", `Neue Schadenmeldung: ${r.data.art}${r.data.tesla ? " (Tesla)" : ""}`,
    `Eine neue Meldung ist eingegangen: ${r.data.art}, ${bilder.length} Foto${bilder.length === 1 ? "" : "s"}.\nAnsehen und zurückrufen im Cockpit: http://localhost:4400/meldung/${id}\n\nAus Datenschutzgründen stehen Name und Telefon nur im Cockpit.`);
  log({ aktion: "meldung_eingang", status: "ok" });
  return NextResponse.json({ ok: true }, { headers: h });
}
