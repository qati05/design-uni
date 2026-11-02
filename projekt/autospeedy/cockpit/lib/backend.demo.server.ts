import "server-only";
import { cookies } from "next/headers";
import type { Backend, CodeAntwort, Einrichten, SitzungsStand, TotpAntwort, AuditEintrag } from "./backend";
import { DEMO_COOKIE, DEMO_MITGLIED, DEMO_TOTP_GEHEIMNIS, postfachSchreiben, sechsZiffern, sitzungLesen, sitzungSignieren, speicher } from "./demo-speicher";
import type { Status } from "./status";
import { totpPruefen } from "./totp";
import { COOKIE_GRUNDLAGE, haerte } from "./cookies";

const MITGLIEDER = [DEMO_MITGLIED.email];
const ZWEITES_KONTO = "fremd@beispiel.example"; // Demo: Konto ohne Mitgliedschaft -> 403

async function setzen(wert: string | null) {
  const c = await cookies();
  if (wert === null) c.set(DEMO_COOKIE, "", haerte({ ...COOKIE_GRUNDLAGE, maxAge: 0 }));
  else c.set(DEMO_COOKIE, wert, haerte({ ...COOKIE_GRUNDLAGE, maxAge: 12 * 3600 }));
}
async function lesen() {
  return sitzungLesen((await cookies()).get(DEMO_COOKIE)?.value);
}

export const demoBackend: Backend = {
  art: "demo",
  async codeAnfordern(email): Promise<CodeAntwort> {
    const s = speicher();
    const jetzt = Date.now();
    s.anfragen = s.anfragen.filter((t) => jetzt - t < 60_000);
    if (s.anfragen.length >= 5) return { status: "zu_viele" };
    s.anfragen.push(jetzt);
    // Wie Supabase mit shouldCreateUser:false: nur bekannte Konten bekommen einen Code; die Antwort ist immer gleich.
    if (MITGLIEDER.includes(email) || email === ZWEITES_KONTO) {
      const code = sechsZiffern();
      s.codes.set(email, { code, bis: jetzt + 10 * 60e3, versuche: 0 });
      postfachSchreiben(email, "Ihr Anmelde-Code für das Auto Speedy Cockpit", `Ihr Code: ${code}\nGültig 10 Minuten. Haben Sie keinen Code angefordert, ignorieren Sie diese Mail.`);
    }
    return { status: "gesendet" };
  },
  async codePruefen(email, code) {
    const e = speicher().codes.get(email);
    if (!e || Date.now() > e.bis || e.versuche >= 5) return false;
    e.versuche++;
    if (e.code !== code) return false;
    speicher().codes.delete(email);
    await setzen(sitzungSignieren({ uid: email === DEMO_MITGLIED.email ? DEMO_MITGLIED.userId : "demo-fremd", email, aal: "aal1" }));
    return true;
  },
  async sitzung(): Promise<SitzungsStand> {
    const d = await lesen();
    if (!d) return null;
    return { userId: d.uid, email: d.email, aal: d.aal, naechste: "aal2", mitglied: MITGLIEDER.includes(d.email) };
  },
  async totpPruefen(code): Promise<TotpAntwort> {
    const d = await lesen();
    if (!d) return { status: "ungueltig" };
    if (!/^\d{6}$/.test(code)) return { status: "ungueltig" };
    if (!totpPruefen(DEMO_TOTP_GEHEIMNIS, code)) return { status: "falsch" };
    await setzen(sitzungSignieren({ uid: d.uid, email: d.email, aal: "aal2" }));
    return { status: "ok" };
  },
  async totpEinrichten(): Promise<Einrichten> { return { status: "vorhanden" }; },
  async totpEinrichtenBestaetigen(): Promise<TotpAntwort> { return { status: "kein_faktor" }; },
  async abmelden() { await setzen(null); },
  async meldungen() { return [...speicher().meldungen].sort((a, b) => b.erstellt.localeCompare(a.erstellt)); },
  async meldung(id) { return speicher().meldungen.find((m) => m.id === id) ?? null; },
  async statusSetzen(id, status: Status) {
    const m = speicher().meldungen.find((x) => x.id === id); if (!m) return false; m.status = status; return true;
  },
  async notizSetzen(id, notiz) {
    const m = speicher().meldungen.find((x) => x.id === id); if (!m) return false; m.notiz = notiz; return true;
  },
  async zahlen(tage) {
    const ab = new Date(Date.now() - tage * 864e5).toISOString().slice(0, 10);
    return [...speicher().zaehlung.entries()].map(([k, anzahl]) => { const [tag, punkt, ort] = k.split("|") as [string, string, string]; return { tag, punkt, ort, anzahl }; }).filter((z) => z.tag >= ab);
  },
  async audit(e: AuditEintrag) { speicher().audit.unshift({ zeit: new Date().toISOString(), ...e }); },
};
