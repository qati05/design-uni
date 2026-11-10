import "server-only";
import { headers } from "next/headers";
import type { Backend, SitzungsStand } from "./backend";
import { siteLesen, siteSchreiben, siteVerlauf, fotoHochladen, fotoLoeschen, type Repo, type BildSpeicher } from "./website.server";
import { besucherLesen } from "./besucher.server";
import { angemeldet } from "./zugriff.server";

// Echter Betrieb, ohne Datenbank. Anmeldung: Cloudflare Access (lib/zugriff.server.ts). Inhalte: site.json im Repository der
// Website (GitHub). Fotos: Bild-Speicher (R2). Alle Angaben stehen als Einstellungen beim Worker, nie im Code (EINRICHTEN.md).

/** Wo die Website liegt: GITHUB_REPO («konto/name»), GITHUB_PFAD (Pfad zu site.json), GITHUB_ZWEIG (ohne Angabe «main»),
 *  GITHUB_TOKEN (fein abgestuft, nur dieses Repository, nur «Contents: Read and write»). */
function ziel(): Repo | null {
  const e = process.env;
  return e.GITHUB_REPO && e.GITHUB_PFAD && e.GITHUB_TOKEN ? { repo: e.GITHUB_REPO, pfad: e.GITHUB_PFAD, zweig: e.GITHUB_ZWEIG || "main", token: e.GITHUB_TOKEN } : null;
}
/** Bild-Speicher (R2-Bucket); Fotos heissen zufällig (UUID). */
function bildSpeicher(): BildSpeicher | null {
  const e = process.env;
  return e.R2_KONTO && e.R2_SCHLUESSEL_ID && e.R2_GEHEIMNIS && e.R2_BUCKET && e.TEAMFOTO_BASIS
    ? { konto: e.R2_KONTO, schluesselId: e.R2_SCHLUESSEL_ID, geheimnis: e.R2_GEHEIMNIS, bucket: e.R2_BUCKET, basis: e.TEAMFOTO_BASIS } : null;
}

export const cloudflareBackend: Backend = {
  art: "cloudflare",
  async sitzung(): Promise<SitzungsStand> {
    const email = await angemeldet(await headers());
    return email ? { email } : null;
  },
  async pflegeLesen() {
    const z = ziel();
    if (!z) return null;
    // «Zuletzt veröffentlicht» ist der jüngste Stand von site.json im Repository.
    const [stand, verlauf] = await Promise.all([siteLesen(z), siteVerlauf(z).catch(() => [])]);
    return stand ? { ...stand, geaendert: verlauf[0]?.zeit ?? null } : null;
  },
  async pflegeSpeichern(p, sha) {
    const z = ziel();
    return z ? siteSchreiben(z, p, sha) : "nicht_eingerichtet";
  },
  async verlauf() {
    const z = ziel();
    return z ? siteVerlauf(z) : [];
  },
  async pflegeVersion(id) {
    const z = ziel();
    return z ? (await siteLesen(z, id))?.daten ?? null : null;
  },
  async bildSpeichern(bytes, typ, ordner) {
    const s = bildSpeicher();
    return s ? fotoHochladen(s, bytes, typ, ordner) : null;
  },
  async bildLoeschen(url) {
    const s = bildSpeicher();
    return s ? fotoLoeschen(s, url) : false;
  },
  // Zählung der Website (Cloudflare Web Analytics). Ohne diese drei Angaben zeigt das Cockpit «noch nicht verbunden».
  async besucher() {
    const e = process.env;
    return e.CF_KONTO && e.CF_SEITE && e.CF_ANALYSE_TOKEN ? besucherLesen({ konto: e.CF_KONTO, seite: e.CF_SEITE, token: e.CF_ANALYSE_TOKEN }) : null;
  },
};
