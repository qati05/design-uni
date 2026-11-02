import { sichererPfad } from "@/lib/validierung";
import { TotpFormular } from "./TotpFormular";

export default async function MfaSeite({ searchParams }: { searchParams: Promise<{ weiter?: string }> }) {
  const { weiter } = await searchParams;
  const demo = process.env.COCKPIT_DEMO === "1";
  return (
    <main className="seite schmal anmelden">
      <img src="/bilder/logo-96.webp" width={135} height={48} alt="Auto Speedy AG" />
      <h1>Zweiter Schritt</h1>
      <p className="unterzeile">Der Mail-Code ist bestätigt. Geben Sie jetzt den 6-stelligen Code aus Ihrer Authenticator-App ein.</p>
      <TotpFormular weiter={sichererPfad(weiter)} />
      {demo ? <p className="hinweis">Demo: Den aktuellen Code zeigt der <a href="/demo/authenticator" target="_blank">Demo-Authenticator</a>.</p> : null}
    </main>
  );
}
