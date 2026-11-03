// CSV für Excel in der Schweiz: Semikolon, UTF-8 mit BOM, Zeilenende CRLF. Rein, damit testbar.
// Schutz vor Formel-Einschleusung (OWASP «CSV Injection»): Zellen, die mit = + - @ Tab oder CR beginnen, bekommen ein ' davor.
export function zelle(w: unknown): string {
  let t = w === null || w === undefined ? "" : String(w);
  if (/^[=+\-@\t\r]/.test(t) && !/^\+[0-9 ()./-]+$/.test(t)) t = "'" + t; // reine Telefonnummer wie +41 71 … ist keine Formel
  return /[";\r\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
export function csv(spalten: string[], zeilen: Record<string, unknown>[]): string {
  return "﻿" + [spalten.map(zelle).join(";"), ...zeilen.map((z) => spalten.map((s) => zelle(z[s])).join(";"))].join("\r\n") + "\r\n";
}
