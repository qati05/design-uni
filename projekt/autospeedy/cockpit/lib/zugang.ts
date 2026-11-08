// Entscheidet im Proxy, wohin eine Anfrage geht. Rein und mit eingespeisten Abfragen, damit testbar.
// Muster aus qati05/medaur cockpit-app/lib/zugang.ts: ohne Sitzung -> /login. Mitglieder eines Betriebs kommen mit dem Mail-Code hinein.
// Nur Studio-Konten brauchen aal2 (-> /mfa oder Einrichtung). Nicht Mitglied des Betriebs (oder Cockpit des Betriebs aus) -> 403. Studio-Admins nur unter /studio.

export type Zugang = { art: "weiter" } | { art: "login" } | { art: "mfa" } | { art: "mfa_einrichten" } | { art: "verboten" } | { art: "studio" };

export const OEFFENTLICHE_PFADE = ["/login", "/403", "/favicon.ico", "/robots.txt", "/demo/postfach", "/manifest.webmanifest", "/sw.js", "/offline.html", "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png"];
export const OEFFENTLICHE_PRAEFIXE = ["/api/meldung", "/api/zaehl", "/api/versand", "/auftrag/", "/bilder/", "/fonts/"];
export const MFA_PFADE = ["/mfa", "/mfa/einrichten"];

export function istOeffentlich(pfad: string): boolean {
  return OEFFENTLICHE_PFADE.includes(pfad) || OEFFENTLICHE_PRAEFIXE.some((p) => pfad.startsWith(p));
}

export type ZugangsAbfragen = {
  hatSitzung: boolean;
  nutzerId: () => Promise<string | null>;
  stufe: () => Promise<{ aktuell: string | null; naechste: string | null }>;
  istMitglied: () => Promise<boolean>;
  istStudioAdmin?: () => Promise<boolean>;
};

export async function entscheideZugang(pfad: string, q: ZugangsAbfragen): Promise<Zugang> {
  if (istOeffentlich(pfad)) return { art: "weiter" };
  if (!q.hatSitzung) return { art: "login" };
  if (!(await q.nutzerId())) return { art: "login" };
  if (MFA_PFADE.includes(pfad)) return { art: "weiter" };
  const { aktuell, naechste } = await q.stufe();
  const zweiterFaktor: Zugang = naechste === "aal2" ? { art: "mfa" } : { art: "mfa_einrichten" };
  if (pfad === "/studio" || pfad.startsWith("/studio/")) {
    if (aktuell !== "aal2") return zweiterFaktor;
    return (await q.istStudioAdmin?.()) ? { art: "weiter" } : { art: "verboten" };
  }
  if (await q.istMitglied()) return { art: "weiter" };
  if (aktuell !== "aal2") return zweiterFaktor;
  return (await q.istStudioAdmin?.()) ? { art: "studio" } : { art: "verboten" };
}
