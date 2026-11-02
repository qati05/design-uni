"use server";

import { holeBackend } from "@/lib/backend.server";
import { log } from "@/lib/log";

export type ErledigtZustand = { ok?: boolean; meldung?: string };

export async function erledigtMelden(_v: ErledigtZustand, form: FormData): Promise<ErledigtZustand> {
  const token = String(form.get("token") ?? "");
  if (!/^[0-9a-f]{64}$/.test(token)) return { meldung: "Link ungültig." };
  const ok = await holeBackend().auftragErledigt(token);
  log({ aktion: "auftrag_erledigt_link", status: ok ? "ok" : "abgelehnt" });
  return ok ? { ok: true } : { meldung: "Das ging nicht: Der Auftrag ist schon erledigt oder der Link ist abgelaufen." };
}
