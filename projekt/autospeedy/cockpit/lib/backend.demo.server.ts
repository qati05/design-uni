import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import type { Backend, CodeAntwort, SitzungsStand, AuditEintrag } from "./backend";
import { DEMO_COOKIE, DEMO_FREMD, DEMO_MITGLIED, DEMO_SITZUNG_SEKUNDEN, postfachSchreiben, sechsZiffern, sitzungLesen, sitzungSignieren, speicher } from "./demo-speicher";
import { DEMO_FOTO_BASIS } from "./pflege";
import { besucherBeispiel } from "./besucher.server";
import { COOKIE_GRUNDLAGE, haerte } from "./cookies";

const KONTEN = [DEMO_MITGLIED, DEMO_FREMD];

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
    if (KONTEN.some((k) => k.email === email)) {
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
    const konto = KONTEN.find((k) => k.email === email);
    if (!konto) return false;
    await setzen(sitzungSignieren({ uid: konto.userId, email }));
    return true;
  },
  async sitzung(): Promise<SitzungsStand> {
    const d = await lesen();
    if (!d) return null;
    return { userId: d.uid, email: d.email, mitglied: d.email === DEMO_MITGLIED.email };
  },
  async abmelden() { await setzen(null); },
  // Demo: spielt GitHub (site.json mit Version «sha», Verlauf der Stände) und den Bild-Speicher. Nichts verlässt den Rechner.
  async pflegeLesen() { return structuredClone(speicher().pflege); },
  async pflegeSpeichern(p, sha) {
    const s = speicher();
    if (sha !== s.pflege.sha) return "konflikt";
    const d = await lesen();
    const zeit = new Date().toISOString();
    s.pflege = { daten: structuredClone(p), sha: randomBytes(20).toString("hex"), geaendert: zeit, von: d?.email ?? null };
    s.verlauf = [{ id: s.pflege.sha, zeit, daten: structuredClone(p) }, ...s.verlauf].slice(0, 10);
    return "ok";
  },
  async verlauf() { return speicher().verlauf.map(({ id, zeit }) => ({ id, zeit })); },
  async pflegeVersion(id) {
    const v = speicher().verlauf.find((x) => x.id === id);
    return v ? structuredClone(v.daten) : null;
  },
  async bildSpeichern(bytes, typ, ordner) {
    const name = `${crypto.randomUUID()}.${typ === "image/jpeg" ? "jpg" : typ.slice(6)}`;
    speicher().fotos.set(name, { typ, bytes });
    return `${DEMO_FOTO_BASIS}/${ordner}/${name}`;
  },
  async bildLoeschen(url) {
    const m = url.startsWith(DEMO_FOTO_BASIS + "/") ? /^\/(team|bild)\/([^/]+)$/.exec(url.slice(DEMO_FOTO_BASIS.length)) : null;
    if (!m) return false;
    speicher().fotos.delete(m[2]!);
    return true;
  },
  async besucher() { return besucherBeispiel(); },
  async audit(e: AuditEintrag) { speicher().audit.unshift({ zeit: new Date().toISOString(), ...e }); },
};
