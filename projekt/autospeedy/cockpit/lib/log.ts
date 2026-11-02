// Einziger Ort, an dem geloggt wird. Nur Felder aus der Allowlist verlassen den Prozess,
// damit keine Personendaten (Mail, IP, Namen, Telefon, Eingaben) in Logs landen. Kein externes Error-Tracking.

export const LOG_FELDER = ["id", "aktion", "status", "dauer_ms"] as const;
type Feld = (typeof LOG_FELDER)[number];
export type LogEintrag = Partial<Record<Feld, string | number>>;

const MUSTER: Record<Feld, RegExp> = {
  id: /^[A-Za-z0-9_-]{1,64}$/,
  aktion: /^[a-z][a-z0-9_]{1,59}$/,
  status: /^[a-z0-9_]{1,40}$/,
  dauer_ms: /^\d{1,9}$/,
};

/** Behält nur erlaubte Felder mit unverdächtigem Wert. Alles andere fällt weg, ohne Fehler. */
export function bereinige(eintrag: Record<string, unknown>): LogEintrag {
  const sauber: LogEintrag = {};
  for (const feld of LOG_FELDER) {
    const wert = eintrag[feld];
    if (typeof wert !== "string" && typeof wert !== "number") continue;
    const text = String(wert);
    if (MUSTER[feld].test(text)) sauber[feld] = feld === "dauer_ms" ? Number(text) : text;
  }
  return sauber;
}

export function log(eintrag: Record<string, unknown>): void {
  const sauber = bereinige(eintrag);
  if (Object.keys(sauber).length === 0) return;
  console.info(JSON.stringify({ zeit: new Date().toISOString(), ...sauber }));
}
