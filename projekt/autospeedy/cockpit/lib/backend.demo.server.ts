import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import type { Backend, CodeAntwort, SitzungsStand, AuditEintrag, PasskeyStart, PasskeyAntwort } from "./backend";
import { DEMO_COOKIE, DEMO_MITGLIED, DEMO_STUDIO, DEMO_SITZUNG_SEKUNDEN, demoJetzt, neueId, postfachSchreiben, sechsZiffern, sitzungLesen, sitzungSignieren, speicher } from "./demo-speicher";
import type { Meldung, Status } from "./status";
import { createHash } from "node:crypto";
import { DEMO_FOTO_BASIS } from "./pflege";
import { betriebDemo } from "./demo-speicher";
import { anmeldungPruefen, registrierungPruefen, ERLAUBTE_ALGORITHMEN } from "./webauthn-pruefung";
import { COOKIE_GRUNDLAGE, haerte } from "./cookies";

const MITGLIEDER = [DEMO_MITGLIED.email];
export const DEMO_VERSAND_GEHEIMNIS = () => process.env.VERSAND_GEHEIMNIS || "demo-versand-nur-lokal";
const hash = (t: string) => createHash("sha256").update(t).digest("hex");

/** Wie der Datenbank-Trigger: Bewertung 24 h nach «erledigt» planen; «erledigt» oder «verloren» macht den Link «Auto fertig» ungültig. */
function statusAendern(m: Meldung, status: Status) {
  const vorher = m.status;
  m.status = status;
  if (status === "erledigt" && vorher !== "erledigt" && m.email && !m.bewertungGesendet) m.bewertungFaellig = new Date(demoJetzt() + 24 * 3600e3).toISOString();
  else if (status !== "erledigt" && !m.bewertungGesendet) m.bewertungFaellig = null;
  if (status === "erledigt" || status === "verloren") for (const [k, v] of speicher().auftragTokens) if (v.id === m.id) speicher().auftragTokens.delete(k);
}
function hatGeraet(uid: string) { return (speicher().passkeys.get(uid) ?? []).length > 0; }
const OFFEN: Status[] = ["neu", "zurueckgerufen", "offerte", "auftrag"];
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
    if (MITGLIEDER.includes(email) || email === ZWEITES_KONTO || email === DEMO_STUDIO.email) {
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
    await setzen(sitzungSignieren({ uid: email === DEMO_MITGLIED.email ? DEMO_MITGLIED.userId : email === DEMO_STUDIO.email ? DEMO_STUDIO.userId : "demo-fremd", email, aal: "aal1" }));
    return true;
  },
  async sitzung(): Promise<SitzungsStand> {
    const d = await lesen();
    if (!d) return null;
    return { userId: d.uid, email: d.email, aal: d.aal, naechste: hatGeraet(d.uid) ? "aal2" : "aal1", mitglied: MITGLIEDER.includes(d.email) };
  },
  async zweitfaktoren() {
    const d = await lesen();
    return { geraete: (d ? speicher().passkeys.get(d.uid) ?? [] : []).map((k) => ({ id: k.id, name: k.name })) };
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
  async abmelden() { await setzen(null); },
  async meldungen() { return [...speicher().meldungen].sort((a, b) => b.erstellt.localeCompare(a.erstellt)); },
  async meldung(id) { return speicher().meldungen.find((m) => m.id === id) ?? null; },
  async statusSetzen(id, status: Status) {
    const m = speicher().meldungen.find((x) => x.id === id); if (!m) return false; statusAendern(m, status); return true;
  },
  async auftragAnsehen(token) {
    if (!/^[0-9a-f]{64}$/.test(token)) return null;
    const t = speicher().auftragTokens.get(hash(token));
    const m = t && t.bis > demoJetzt() ? speicher().meldungen.find((x) => x.id === t.id && OFFEN.includes(x.status)) : undefined;
    return m ? { art: m.art, tesla: m.tesla, erstellt: m.erstellt, mitMail: !!m.email } : null;
  },
  async auftragErledigt(token) {
    if (!/^[0-9a-f]{64}$/.test(token)) return false;
    const t = speicher().auftragTokens.get(hash(token));
    const m = t && t.bis > demoJetzt() ? speicher().meldungen.find((x) => x.id === t.id && OFFEN.includes(x.status)) : undefined;
    if (!m) return false;
    statusAendern(m, "erledigt");
    speicher().audit.unshift({ zeit: new Date().toISOString(), aktion: "auftrag_erledigt_link", ergebnis: "ok", ziel: m.id });
    return true;
  },
  async bewertungenAbholen(geheimnis) {
    if (geheimnis !== DEMO_VERSAND_GEHEIMNIS()) return null;
    const jetzt = demoJetzt();
    const faellig = speicher().meldungen.filter((m) => m.status === "erledigt" && m.email && m.bewertungFaellig && !m.bewertungGesendet && Date.parse(m.bewertungFaellig) <= jetzt);
    for (const m of faellig) m.bewertungGesendet = new Date(jetzt).toISOString();
    return faellig.map((m) => ({ id: m.id, email: m.email!, name: m.name, website: betriebDemo.website, betrieb: betriebDemo.name }));
  },
  async bewertungZuruecklegen(geheimnis, id) {
    if (geheimnis !== DEMO_VERSAND_GEHEIMNIS()) return;
    const m = speicher().meldungen.find((x) => x.id === id && x.status === "erledigt");
    if (m) { m.bewertungGesendet = null; m.bewertungFaellig = new Date(demoJetzt() + 3600e3).toISOString(); }
  },
  async aufraeumen(geheimnis) {
    if (geheimnis !== DEMO_VERSAND_GEHEIMNIS()) return null;
    const s = speicher(), frist = demoJetzt() - 365 * 864e5, vorher = s.meldungen.length;
    s.meldungen = s.meldungen.filter((m) => Date.parse(m.erstellt) >= frist); // Demo: Fotos liegen in der Meldung selbst
    return { fotos: 0, meldungen: vorher - s.meldungen.length };
  },
  async istStudioAdmin() { const d = await lesen(); return d?.email === DEMO_STUDIO.email && d.aal === "aal2"; },
  async betriebe() { return [{ id: "auto-speedy", name: betriebDemo.name, aktiv: true }]; },
  async exportMeldungen(betrieb) {
    if (!(await this.istStudioAdmin()) || betrieb !== "auto-speedy") return null;
    speicher().audit.unshift({ zeit: new Date().toISOString(), aktion: "export", ergebnis: "ok", ziel: betrieb });
    return [...speicher().meldungen].sort((a, b) => a.erstellt.localeCompare(b.erstellt)).map((m) => ({ erstellt: m.erstellt, art: m.art, tesla: m.tesla, tesla_modell: m.teslaModell ?? null, stellen: m.stellen.join(", "), bemerkung: m.bemerkung, name: m.name, telefon: m.telefon, email: m.email ?? null, quelle: m.quelle, status: m.status, notiz: m.notiz }));
  },
  async notizSetzen(id, notiz) {
    const m = speicher().meldungen.find((x) => x.id === id); if (!m) return false; m.notiz = notiz; return true;
  },
  async zahlen(tage) {
    const ab = new Date(Date.now() - tage * 864e5).toISOString().slice(0, 10);
    return [...speicher().zaehlung.entries()].map(([k, anzahl]) => { const [tag, punkt, ort] = k.split("|") as [string, string, string]; return { tag, punkt, ort, anzahl }; }).filter((z) => z.tag >= ab);
  },
  // Demo: spielt GitHub (site.json mit Version «sha») und den Bild-Speicher (Fotos im Speicher). Nichts verlässt den Rechner.
  async pflegeLesen() { return structuredClone(speicher().pflege); },
  async pflegeSpeichern(p, sha) {
    const s = speicher();
    if (sha !== s.pflege.sha) return "konflikt";
    const d = await lesen();
    s.pflege = { daten: structuredClone(p), sha: randomBytes(20).toString("hex"), geaendert: new Date().toISOString(), von: d?.email ?? null };
    return "ok";
  },
  async teamFotoSpeichern(bytes, typ) {
    const name = `${crypto.randomUUID()}.${typ === "image/jpeg" ? "jpg" : typ.slice(6)}`;
    speicher().fotos.set(name, { typ, bytes });
    return `${DEMO_FOTO_BASIS}/team/${name}`;
  },
  async teamFotoLoeschen(url) {
    if (!url.startsWith(DEMO_FOTO_BASIS + "/team/")) return false;
    speicher().fotos.delete(url.slice(DEMO_FOTO_BASIS.length + 6));
    return true;
  },
  async audit(e: AuditEintrag) { speicher().audit.unshift({ zeit: new Date().toISOString(), ...e }); },
};
