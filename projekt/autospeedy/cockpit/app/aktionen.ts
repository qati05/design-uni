"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { holeBackend } from "@/lib/backend.server";
import { log } from "@/lib/log";
import { naechsteSchritte, type Status } from "@/lib/status";
import { notizSchema, statusSchema } from "@/lib/validierung";

/** Jede Änderung prüft Sitzung (Mitglied) selbst, nicht nur der Proxy. */
async function mitglied() {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || !s.mitglied) return null;
  return b;
}

export async function abmelden() {
  await holeBackend().abmelden();
  redirect("/login");
}

export async function statusSetzen(form: FormData) {
  const r = statusSchema.safeParse({ id: form.get("id"), status: form.get("status") });
  const b = await mitglied();
  if (!r.success || !b) { log({ aktion: "status", status: "abgelehnt" }); return; }
  const m = await b.meldung(r.data.id);
  if (!m || !naechsteSchritte(m.status).includes(r.data.status as Status)) { log({ aktion: "status", status: "ungueltig" }); return; }
  const ok = await b.statusSetzen(r.data.id, r.data.status);
  if (b.art === "demo") await b.audit({ aktion: `status_${r.data.status}`, ergebnis: ok ? "ok" : "fehler", ziel: r.data.id });
  log({ aktion: "status", status: ok ? "ok" : "fehler" });
  revalidatePath(`/meldung/${r.data.id}`);
}

export async function notizSetzen(form: FormData) {
  const r = notizSchema.safeParse({ id: form.get("id"), notiz: String(form.get("notiz") ?? "") });
  const b = await mitglied();
  if (!r.success || !b) { log({ aktion: "notiz", status: "abgelehnt" }); return; }
  const ok = await b.notizSetzen(r.data.id, r.data.notiz);
  if (b.art === "demo") await b.audit({ aktion: "notiz", ergebnis: ok ? "ok" : "fehler", ziel: r.data.id });
  revalidatePath(`/meldung/${r.data.id}`);
}
