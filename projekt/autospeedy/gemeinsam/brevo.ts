// Ein Mail-Weg für Website-Funktion und Cockpit: Brevo, Transaktions-Mail (REST). Ungeprüft gegen Brevo selbst (kein Konto).
export type Umgebung = { BREVO_SCHLUESSEL?: string; MAIL_ABSENDER?: string; MAIL_ABSENDER_NAME?: string };
export type Anhang = { name: string; inhalt: string }; // inhalt: base64

export function mailBereit(env: Umgebung): boolean {
  return !!(env.BREVO_SCHLUESSEL && env.MAIL_ABSENDER);
}

/** Sendet eine Text-Mail. true nur bei Antwort 2xx von Brevo; Fehler werden nicht verschluckt, sondern als false gemeldet. */
export async function mailSenden(env: Umgebung, m: { an: string; betreff: string; text: string; anhaenge?: Anhang[] }): Promise<boolean> {
  if (!mailBereit(env)) return false;
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": env.BREVO_SCHLUESSEL!, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { email: env.MAIL_ABSENDER, name: env.MAIL_ABSENDER_NAME || "Website" },
      to: [{ email: m.an }], subject: m.betreff, textContent: m.text,
      ...(m.anhaenge?.length ? { attachment: m.anhaenge.map((a) => ({ name: a.name, content: a.inhalt })) } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => null);
  return !!r?.ok;
}

/** base64 für Anhänge, ohne Node-Buffer (läuft auch bei Cloudflare). */
export function base64(puffer: ArrayBuffer): string {
  let s = ""; const b = new Uint8Array(puffer);
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, Array.from(b.subarray(i, i + 0x8000)));
  return btoa(s);
}
