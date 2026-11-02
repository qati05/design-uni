import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import type { Backend, CodeAntwort, Einrichten, SitzungsStand, TotpAntwort, AuditEintrag, PasskeyStart, PasskeyAntwort } from "./backend";
import { DEMO_COOKIE, DEMO_MITGLIED, DEMO_SITZUNG_SEKUNDEN, neueId, postfachSchreiben, sechsZiffern, sitzungLesen, sitzungSignieren, speicher } from "./demo-speicher";
import type { Status } from "./status";
import { anmeldungPruefen, registrierungPruefen, ERLAUBTE_ALGORITHMEN } from "./webauthn-pruefung";
import { COOKIE_GRUNDLAGE, haerte } from "./cookies";

const MITGLIEDER = [DEMO_MITGLIED.email];
function hatGeraet(uid: string) { return (speicher().passkeys.get(uid) ?? []).length > 0; }
const ZWEITES_KONTO = "fremd@beispiel.example"; // Demo: Konto ohne Mitgliedschaft -> 403

async function setzen(wert: string | null) {
  const c = await cookies();
  if (wert === null) c.set(DEMO_COOKIE, "", haerte({ ...COOKIE_GRUNDLAGE, maxAge: 0 }));
  else c.set(DEMO_COOKIE, wert, haerte({ ...COOKIE_GRUNDLAGE, maxAge: DEMO_SITZUNG_SEKUNDEN }));
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
    return { userId: d.uid, email: d.email, aal: d.aal, naechste: hatGeraet(d.uid) ? "aal2" : "aal1", mitglied: MITGLIEDER.includes(d.email) };
  },
  // Demo ohne Authenticator-App: der zweite Schritt ist Fingerabdruck oder Gesicht (siehe passkey*).
  async totpPruefen(): Promise<TotpAntwort> { return { status: "kein_faktor" }; },
  async zweitfaktoren() {
    const d = await lesen();
    return { geraete: (d ? speicher().passkeys.get(d.uid) ?? [] : []).map((k) => ({ id: k.id, name: k.name })), totp: false };
  },
  async passkeyStart(zweck, rp, geraetename = "Gerät"): Promise<PasskeyStart> {
    const d = await lesen();
    if (!d) return { status: "nicht_erlaubt" };
    const vorhanden = speicher().passkeys.get(d.uid) ?? [];
    if (zweck === "anmelden" && !vorhanden.length) return { status: "kein_faktor" };
    // Wie Supabase: ein weiteres Gerät nur nach vollem Login (aal2); das erste auch nach dem Mail-Code.
    if (zweck === "einrichten" && vorhanden.length && d.aal !== "aal2") return { status: "nicht_erlaubt" };
    const s = speicher();
    const jetzt = Date.now();
    for (const [k, v] of s.vorgaenge) if (v.bis < jetzt) s.vorgaenge.delete(k);
    const challenge = randomBytes(32).toString("base64url");
    const vorgang = neueId();
    s.vorgaenge.set(vorgang, { uid: d.uid, zweck, challenge, bis: jetzt + 5 * 60e3, name: geraetename.slice(0, 40) });
    if (zweck === "anmelden") {
      return { status: "bereit", vorgang, art: "request", optionen: { challenge, rpId: rp.rpId, timeout: 120000, userVerification: "required", allowCredentials: vorhanden.map((k) => ({ type: "public-key", id: k.id })) } };
    }
    return { status: "bereit", vorgang, art: "create", optionen: {
      challenge, rp: { id: rp.rpId, name: "Auto Speedy Cockpit" },
      user: { id: Buffer.from(d.uid).toString("base64url"), name: d.email, displayName: d.email },
      pubKeyCredParams: ERLAUBTE_ALGORITHMEN.map((alg) => ({ type: "public-key", alg })),
      timeout: 120000, attestation: "none",
      authenticatorSelection: { residentKey: "preferred", userVerification: "required" },
      excludeCredentials: vorhanden.map((k) => ({ type: "public-key", id: k.id })),
    } };
  },
  async passkeyBestaetigen(vorgang, antwort, rp): Promise<PasskeyAntwort> {
    const d = await lesen();
    const s = speicher();
    const v = s.vorgaenge.get(vorgang);
    s.vorgaenge.delete(vorgang); // jede Challenge nur einmal
    if (!d || !v || v.uid !== d.uid || v.bis < Date.now()) return { status: "fehler" };
    const liste = s.passkeys.get(d.uid) ?? [];
    if (v.zweck === "einrichten") {
      const r = registrierungPruefen(antwort as never, { challenge: v.challenge, origin: rp.origin, rpId: rp.rpId, name: v.name });
      if (!r.ok || liste.some((k) => k.id === r.wert.id)) return { status: "falsch" };
      s.passkeys.set(d.uid, [...liste, r.wert]);
    } else {
      const r = anmeldungPruefen(antwort as never, liste, { challenge: v.challenge, origin: rp.origin, rpId: rp.rpId });
      if (!r.ok) return { status: "falsch" };
      const k = liste.find((x) => x.id === r.wert.id)!; k.zaehler = r.wert.zaehler;
    }
    await setzen(sitzungSignieren({ uid: d.uid, email: d.email, aal: "aal2" }));
    return { status: "ok" };
  },
  async geraetEntfernen(id) {
    const d = await lesen();
    if (!d || d.aal !== "aal2") return false;
    const liste = speicher().passkeys.get(d.uid) ?? [];
    if (liste.length <= 1) return false; // das letzte Gerät bleibt, sonst sperrt man sich aus
    speicher().passkeys.set(d.uid, liste.filter((k) => k.id !== id));
    return true;
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
  async pflegeLesen() { return structuredClone(speicher().pflege); },
  async pflegeSpeichern(p) {
    const d = await lesen();
    speicher().pflege = { daten: structuredClone(p), geaendert: new Date().toISOString(), von: d?.email ?? null };
    return true;
  },
  // Demo: Foto bleibt im Speicher (als data:-Adresse in der Pflege), nichts verlässt den Rechner.
  async teamFotoSpeichern(bytes, typ) { return `data:${typ};base64,${Buffer.from(bytes).toString("base64")}`; },
  async audit(e: AuditEintrag) { speicher().audit.unshift({ zeit: new Date().toISOString(), ...e }); },
};
