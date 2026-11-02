// Entscheidet im Proxy, wohin eine Anfrage geht. Rein und mit eingespeisten Abfragen, damit testbar.
// Muster aus qati05/medaur cockpit-app/lib/zugang.ts: ohne Sitzung -> /login, ohne aal2 -> /mfa (oder Einrichtung),
// nicht Mitglied des Betriebs -> 403.

export type Zugang = { art: "weiter" } | { art: "login" } | { art: "mfa" } | { art: "mfa_einrichten" } | { art: "verboten" };

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
};

export async function entscheideZugang(pfad: string, q: ZugangsAbfragen): Promise<Zugang> {
  if (istOeffentlich(pfad)) return { art: "weiter" };
  if (!q.hatSitzung) return { art: "login" };
  if (!(await q.nutzerId())) return { art: "login" };
  const { aktuell, naechste } = await q.stufe();
  if (aktuell !== "aal2") {
    if (MFA_PFADE.includes(pfad)) return { art: "weiter" };
    return naechste === "aal2" ? { art: "mfa" } : { art: "mfa_einrichten" };
  }
  if (MFA_PFADE.includes(pfad)) return { art: "weiter" };
  return (await q.istMitglied()) ? { art: "weiter" } : { art: "verboten" };
}
