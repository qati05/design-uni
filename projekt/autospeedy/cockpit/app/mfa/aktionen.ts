"use server";

import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { log } from "@/lib/log";
import { rp } from "@/lib/rp.server";
import { sichererPfad, totpSchema } from "@/lib/validierung";

export type TotpZustand = { meldung?: string };

async function loginFertig(weiter: unknown): Promise<never> {
  const b = holeBackend();
  try { await b.audit({ aktion: "login", ergebnis: "ok" }); } catch { log({ aktion: "login", status: "audit_fehler" }); }
  redirect(sichererPfad(weiter));
}

/** Ersatzweg für Konten, die schon eine Authenticator-App haben (nur echter Betrieb). */
export async function totpBestaetigen(_v: TotpZustand, form: FormData): Promise<TotpZustand> {
  const r = totpSchema.safeParse({ code: String(form.get("code") ?? "").replace(/\s/g, "") });
  if (!r.success) return { meldung: "Der Code hat 6 Ziffern." };
  const a = await holeBackend().totpPruefen(r.data.code);
  log({ aktion: "mfa_bestaetigt", status: a.status });
  if (a.status !== "ok") return { meldung: "Der Code stimmt nicht. Bitte den aktuellen Code eingeben." };
  return loginFertig(form.get("weiter"));
}

export type PasskeyStartAntwort = { ok: true; vorgang: string; art: "create" | "request"; optionen: Record<string, unknown> } | { ok: false; meldung: string };

export async function passkeyStarten(zweck: "anmelden" | "einrichten", geraetename: string): Promise<PasskeyStartAntwort> {
  if (zweck !== "anmelden" && zweck !== "einrichten") return { ok: false, meldung: "Unbekannter Schritt." };
  const name = String(geraetename ?? "").replace(/[^\p{L}\p{N} .'-]/gu, "").trim().slice(0, 30) || "Gerät";
  const s = await holeBackend().passkeyStart(zweck, await rp(), name);
  log({ aktion: `passkey_start_${zweck}`, status: s.status });
  if (s.status === "bereit") return { ok: true, vorgang: s.vorgang, art: s.art, optionen: s.optionen };
  return { ok: false, meldung: s.status === "kein_faktor" ? "Auf diesem Konto ist noch kein Gerät eingerichtet." : s.status === "nicht_erlaubt" ? "Bitte zuerst ganz anmelden, dann ein weiteres Gerät hinzufügen." : "Das hat nicht geklappt. Bitte nochmals versuchen." };
}

export async function passkeyAbschliessen(vorgang: string, antwort: unknown, weiter: string): Promise<{ meldung: string }> {
  if (typeof vorgang !== "string" || vorgang.length > 200 || JSON.stringify(antwort ?? null).length > 20_000) return { meldung: "Ungültige Antwort." };
  const a = await holeBackend().passkeyBestaetigen(vorgang, antwort, await rp());
  log({ aktion: "passkey_bestaetigt", status: a.status });
  if (a.status !== "ok") return { meldung: "Das Gerät wurde nicht erkannt. Bitte nochmals versuchen." };
  return loginFertig(weiter);
}
