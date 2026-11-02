export function wann(iso: string, jetzt = Date.now()): string {
  const min = Math.round((jetzt - Date.parse(iso)) / 60e3);
  if (min < 1) return "gerade eben";
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.round(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  return new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" }).format(new Date(iso));
}
/** Schweizer Nummer für tel: und WhatsApp (+41…); null, wenn nicht eindeutig. */
export function e164(telefon: string): string | null {
  const z = telefon.replace(/[^\d+]/g, "");
  if (/^\+41\d{9}$/.test(z)) return z;
  if (/^0041\d{9}$/.test(z)) return "+" + z.slice(2);
  if (/^0\d{9}$/.test(z)) return "+41" + z.slice(1);
  return null;
}
