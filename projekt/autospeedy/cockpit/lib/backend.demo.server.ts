import "server-only";
import { randomBytes } from "node:crypto";
import type { Backend, SitzungsStand } from "./backend";
import { DEMO_MITGLIED, speicher } from "./demo-speicher";
import { DEMO_FOTO_BASIS } from "./pflege";
import { besucherBeispiel } from "./besucher.server";

// Demo: spielt GitHub (site.json mit Version «sha», Verlauf der Stände) und den Bild-Speicher. Nichts verlässt den Rechner.
// Ohne Anmeldung: Im Betrieb steht Cloudflare Access davor, hier ist man gleich als «Werkstatt (Demo)» drin.
export const demoBackend: Backend = {
  art: "demo",
  async sitzung(): Promise<SitzungsStand> { return { email: DEMO_MITGLIED.email }; },
  async pflegeLesen() { return structuredClone(speicher().pflege); },
  async pflegeSpeichern(p, sha) {
    const s = speicher();
    if (sha !== s.pflege.sha) return "konflikt";
    const zeit = new Date().toISOString();
    s.pflege = { daten: structuredClone(p), sha: randomBytes(20).toString("hex"), geaendert: zeit };
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
};
