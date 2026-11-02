"use server";

import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { log } from "@/lib/log";
import { sichererPfad, totpSchema } from "@/lib/validierung";

export type TotpZustand = { meldung?: string };

export async function totpBestaetigen(_v: TotpZustand, form: FormData): Promise<TotpZustand> {
  const r = totpSchema.safeParse({ code: String(form.get("code") ?? "").replace(/\s/g, "") });
  if (!r.success) return { meldung: "Der Code hat 6 Ziffern." };
  const b = holeBackend();
  const a = await b.totpPruefen(r.data.code);
  log({ aktion: "mfa_bestaetigt", status: a.status });
  if (a.status !== "ok") return { meldung: a.status === "kein_faktor" ? "Bitte zuerst die Authenticator-App einrichten." : "Der Code stimmt nicht. Bitte den aktuellen Code eingeben." };
  if (b.art === "demo") await b.audit({ aktion: "login", ergebnis: "ok" });
  else try { await b.audit({ aktion: "login", ergebnis: "ok" }); } catch { log({ aktion: "login", status: "audit_fehler" }); }
  redirect(sichererPfad(form.get("weiter")));
}
