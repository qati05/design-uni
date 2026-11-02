"use server";

import { revalidatePath } from "next/cache";
import { holeBackend } from "@/lib/backend.server";
import { log } from "@/lib/log";
import { pflegeAusFormular, pflegeFehler, zeitenZeile } from "@/lib/pflege";

export type PflegeZustand = { ok?: boolean; meldung?: string };

/** Website neu bauen lassen (Cloudflare Pages: «Deploy Hook», eine geheime URL). Fester Host, keine Daten im Aufruf. */
async function websiteNeuBauen(): Promise<"angestossen" | "kein_hook" | "fehler"> {
  const hook = process.env.WEBSITE_DEPLOY_HOOK;
  if (!hook) return "kein_hook";
  const u = new URL(hook);
  if (u.protocol !== "https:" || u.hostname !== "api.cloudflare.com") return "fehler";
  const r = await fetch(u, { method: "POST", cache: "no-store", signal: AbortSignal.timeout(8000) }).catch(() => null);
  return r?.ok ? "angestossen" : "fehler";
}

export async function pflegeSpeichern(_v: PflegeZustand, form: FormData): Promise<PflegeZustand> {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || s.aal !== "aal2" || !s.mitglied) { log({ aktion: "pflege", status: "abgelehnt" }); return { meldung: "Bitte neu anmelden." }; }
  const alt = await b.pflegeLesen();
  const r = pflegeAusFormular(form, alt.daten);
  if (!r.success) return { meldung: pflegeFehler(r.error) };
  const ok = await b.pflegeSpeichern(r.data);
  if (b.art === "demo") await b.audit({ aktion: "pflege", ergebnis: ok ? "ok" : "fehler" });
  log({ aktion: "pflege", status: ok ? "ok" : "fehler" });
  if (!ok) return { meldung: "Speichern hat nicht geklappt. Bitte nochmals versuchen." };
  const bau = b.art === "demo" ? "kein_hook" : await websiteNeuBauen();
  revalidatePath("/pflege");
  return {
    ok: true,
    meldung: bau === "angestossen" ? `Gespeichert. Die Website ist in etwa 2 Minuten aktuell: «${zeitenZeile(r.data)}».`
      : bau === "fehler" ? "Gespeichert. Die Website hat den Neubau nicht bestätigt; das Studio ist informiert."
      : `Gespeichert. ${b.art === "demo" ? "Demo: Im Betrieb baut sich die Website jetzt neu (etwa 2 Minuten)." : "Neubau der Website ist noch nicht verbunden."}`,
  };
}
