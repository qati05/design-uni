// Entscheidet im Proxy, ob eine Anfrage weitergeht. Rein und mit eingespeister Abfrage, damit testbar.
// Die Anmeldung selbst macht Cloudflare Access vor dem Cockpit (Code per Mail, Liste der erlaubten Adressen).
// Hier zählt nur: Trägt die Anfrage einen gültigen Ausweis von Access? Sonst 403. Eine eigene Login-Seite gibt es nicht.

export type Zugang = { art: "weiter" } | { art: "verboten" };

export const OEFFENTLICHE_PFADE = ["/403", "/favicon.ico", "/robots.txt", "/manifest.webmanifest", "/sw.js", "/offline.html", "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png"];
export const OEFFENTLICHE_PRAEFIXE = ["/bilder/", "/fonts/"];

export function istOeffentlich(pfad: string): boolean {
  return OEFFENTLICHE_PFADE.includes(pfad) || OEFFENTLICHE_PRAEFIXE.some((p) => pfad.startsWith(p));
}

export async function entscheideZugang(pfad: string, angemeldet: () => Promise<boolean>): Promise<Zugang> {
  if (istOeffentlich(pfad)) return { art: "weiter" };
  return (await angemeldet()) ? { art: "weiter" } : { art: "verboten" };
}
