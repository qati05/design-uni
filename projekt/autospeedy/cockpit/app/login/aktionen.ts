"use server";

import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { log } from "@/lib/log";
import { emailSchema, mailCodeSchema } from "@/lib/validierung";

// Ablauf aus qati05/medaur cockpit-app/app/login/aktionen.ts: Code per Mail, dann Code prüfen.
export type LoginZustand = { schritt: "mail"; meldung?: string } | { schritt: "code"; email: string; hinweis?: string; meldung?: string };

export async function anmelden(vorher: LoginZustand, form: FormData): Promise<LoginZustand> {
  return form.get("schritt") === "code" && vorher.schritt === "code" ? codePruefen(vorher.email, form) : codeAnfordern(form);
}

async function codeAnfordern(form: FormData): Promise<LoginZustand> {
  const r = emailSchema.safeParse({ email: String(form.get("email") ?? "").trim().toLowerCase() });
  if (!r.success) return { schritt: "mail", meldung: "Bitte eine gültige Mail-Adresse eingeben." };
  const a = await holeBackend().codeAnfordern(r.data.email);
  log({ aktion: "login_code", status: a.status });
  if (a.status === "zu_viele") return { schritt: "mail", meldung: "Zu viele Versuche. Bitte in einigen Minuten erneut." };
  // Gleiche Antwort für bekannte und unbekannte Adressen: verrät nicht, wer ein Konto hat.
  return { schritt: "code", email: r.data.email, hinweis: "Falls die Adresse berechtigt ist, ist ein 6-stelliger Code unterwegs." };
}

async function codePruefen(email: string, form: FormData): Promise<LoginZustand> {
  const r = mailCodeSchema.safeParse({ email, code: String(form.get("code") ?? "").replace(/\s/g, "") });
  if (!r.success) return { schritt: "code", email, meldung: "Der Code hat 6 Ziffern." };
  const ok = await holeBackend().codePruefen(r.data.email, r.data.code);
  log({ aktion: "login", status: ok ? "ok" : "fehler" });
  if (!ok) return { schritt: "code", email, meldung: "Der Code stimmt nicht oder ist abgelaufen." };
  try { await holeBackend().audit({ aktion: "login", ergebnis: "ok" }); } catch { log({ aktion: "login", status: "audit_fehler" }); }
  redirect("/"); // Der Mail-Code genügt (kein Fingerabdruck, Entscheid Roni 08.11.2026). Kein Mitglied: der Proxy zeigt 403.
}
