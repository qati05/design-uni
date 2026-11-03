import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { pruefe, hinweisText, betreff } from "../../../../gemeinsam/meldung";
import { demoJetzt, neueId, postfachSchreiben, speicher } from "@/lib/demo-speicher";
import { log } from "@/lib/log";

// Nur Demo: spielt die Serverfunktion der Website (astro/functions/api/schaden.js) mit denselben Regeln (gemeinsam/meldung.ts).
// Im echten Betrieb schreibt die Website-Funktion direkt in Supabase; diese Route antwortet dann 404.
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
  const { daten: d, fehler } = pruefe({
    art: form.get("art"), name: form.get("name"), telefon: form.get("telefon"), email: form.get("email") || "", bemerkung: form.get("bemerkung") || "",
    tesla: form.get("tesla"), teslaModell: form.get("tesla_modell") || "", stellen: form.getAll("stelle"), website: form.get("website") || "",
    fotos: form.getAll("foto").filter((f): f is File => typeof f === "object"),
  });
  if (d.website) return NextResponse.json({ ok: true }, { headers: h });
  if (fehler.length) return NextResponse.json({ ok: false, fehler }, { status: 422, headers: h });
  const id = neueId();
  const bilder = await Promise.all(d.fotos.map(async (f) => ({ id: neueId(), url: "data:image/jpeg;base64," + Buffer.from(await f.arrayBuffer()).toString("base64") })));
  speicher().meldungen.unshift({ id, erstellt: new Date().toISOString(), art: d.art, name: d.name, telefon: d.telefon, email: d.email || null, bemerkung: d.bemerkung, tesla: d.tesla, teslaModell: d.teslaModell || null, stellen: d.stellen, quelle: "website", status: "neu", notiz: "", fotos: bilder });
  // Automation «Bewertung» (in der Demo gekauft): Link «Auto fertig» gleich in der ersten Mail, in der Datenbank nur der Hash.
  let fertigLink: string | undefined;
  if (d.email) {
    const token = randomBytes(32).toString("hex");
    speicher().auftragTokens.set(createHash("sha256").update(token).digest("hex"), { id, bis: demoJetzt() + 120 * 864e5 });
    fertigLink = `http://localhost:4400/auftrag/${token}`;
  }
  postfachSchreiben("werkstatt@autospeedy.example", "Neue " + betreff(d), hinweisText(d, `http://localhost:4400/meldung/${id}`, fertigLink));
  log({ aktion: "meldung_eingang", status: "ok" });
  return NextResponse.json({ ok: true }, { headers: h });
}
