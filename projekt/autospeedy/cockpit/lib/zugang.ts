// Entscheidet im Proxy, wohin eine Anfrage geht. Rein und mit eingespeisten Abfragen, damit testbar.
// Muster aus qati05/medaur cockpit-app/lib/zugang.ts, verkleinert: ohne Sitzung -> /login. Mitglieder eines Betriebs
// kommen mit dem Mail-Code hinein (kein zweiter Faktor, Entscheid Roni 08.11.2026). Sonst (kein Mitglied, Cockpit des Betriebs aus) -> 403.

export type Zugang = { art: "weiter" } | { art: "login" } | { art: "verboten" };

export const OEFFENTLICHE_PFADE = ["/login", "/403", "/favicon.ico", "/robots.txt", "/demo/postfach", "/manifest.webmanifest", "/sw.js", "/offline.html", "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png"];
export const OEFFENTLICHE_PRAEFIXE = ["/bilder/", "/fonts/"];

export function istOeffentlich(pfad: string): boolean {
  return OEFFENTLICHE_PFADE.includes(pfad) || OEFFENTLICHE_PRAEFIXE.some((p) => pfad.startsWith(p));
}

export type ZugangsAbfragen = {
  hatSitzung: boolean;
  nutzerId: () => Promise<string | null>;
  istMitglied: () => Promise<boolean>;
};

export async function entscheideZugang(pfad: string, q: ZugangsAbfragen): Promise<Zugang> {
  if (istOeffentlich(pfad)) return { art: "weiter" };
  if (!q.hatSitzung) return { art: "login" };
  if (!(await q.nutzerId())) return { art: "login" };
  return (await q.istMitglied()) ? { art: "weiter" } : { art: "verboten" };
}
