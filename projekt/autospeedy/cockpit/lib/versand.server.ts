import "server-only";
import { holeBackend } from "./backend.server";
import { adressen, mailSenden } from "./mail.server";
import { bewertungMail } from "./mailtexte";

/** Fällige Bewertungs-Mails verschicken (Zeitplan ruft /api/versand). Fehlschläge gehen zurück in die Warteschlange. */
export async function versandLaufen(geheimnis: string): Promise<{ gesendet: number; fehler: number } | null> {
  const b = holeBackend();
  const faellig = await b.bewertungenAbholen(geheimnis);
  if (faellig === null) return null;
  let gesendet = 0, fehler = 0;
  for (const f of faellig) {
    const m = bewertungMail({ name: f.name, website: adressen().website });
    if (await mailSenden({ an: f.email, ...m })) gesendet++;
    else { fehler++; await b.bewertungZuruecklegen(geheimnis, f.id); }
  }
  return { gesendet, fehler };
}
