"use server";

import { revalidatePath } from "next/cache";
import { holeBackend } from "@/lib/backend.server";
import { log } from "@/lib/log";

export async function geraetEntfernen(form: FormData) {
  const id = String(form.get("id") ?? "");
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || s.aal !== "aal2" || !s.mitglied || !/^[A-Za-z0-9_-]{8,1024}$/.test(id)) { log({ aktion: "geraet_entfernen", status: "abgelehnt" }); return; }
  const ok = await b.geraetEntfernen(id);
  await b.audit({ aktion: "geraet_entfernen", ergebnis: ok ? "ok" : "abgelehnt" }).catch(() => undefined);
  revalidatePath("/geraete");
}
