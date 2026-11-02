import { notFound } from "next/navigation";
import { DEMO_TOTP_GEHEIMNIS } from "@/lib/demo-speicher";
import { totp } from "@/lib/totp";

// Nur Demo: ersetzt die Authenticator-App auf dem Handy (z. B. Google Authenticator), mit echtem TOTP-Verfahren.
export default function Authenticator() {
  if (process.env.COCKPIT_DEMO !== "1") notFound();
  const jetzt = Date.now();
  const rest = 30 - Math.floor(jetzt / 1000) % 30;
  return (
    <main className="seite schmal">
      <meta httpEquiv="refresh" content={String(Math.min(rest, 5))} />
      <h1>Demo-Authenticator</h1>
      <div className="karte lack authenticator">
        <p className="unterzeile">Auto Speedy Cockpit · werkstatt@autospeedy.example</p>
        <p className="code" aria-live="polite">{totp(DEMO_TOTP_GEHEIMNIS, jetzt).replace(/(\d{3})(\d{3})/, "$1 $2")}</p>
        <p className="unterzeile">Neuer Code in {rest} Sekunden</p>
      </div>
    </main>
  );
}
