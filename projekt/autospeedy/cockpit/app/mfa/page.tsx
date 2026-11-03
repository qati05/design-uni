import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { sichererPfad } from "@/lib/validierung";
import { PasskeyKnopf } from "./PasskeyKnopf";

export default async function MfaSeite({ searchParams }: { searchParams: Promise<{ weiter?: string }> }) {
  const { weiter } = await searchParams;
  const ziel = sichererPfad(weiter);
  const f = await holeBackend().zweitfaktoren();
  if (!f.geraete.length) redirect("/mfa/einrichten");
  return (
    <main className="seite schmal anmelden">
      <img src="/bilder/logo-96.webp" width={135} height={48} alt="Auto Speedy AG" />
      <h1>Noch ein Tipp</h1>
      <p className="unterzeile">Der Mail-Code stimmt. Bestätigen Sie jetzt mit Fingerabdruck oder Gesicht, wie beim Entsperren des Handys.</p>
      <div className="karte formular">
        <PasskeyKnopf zweck="anmelden" weiter={ziel} text="Mit Fingerabdruck oder Gesicht bestätigen" />
        <p className="unterzeile">Am Computer ohne Fingerabdruck zeigt der Browser einen QR-Code: mit dem Handy scannen und dort bestätigen.</p>
      </div>
    </main>
  );
}
