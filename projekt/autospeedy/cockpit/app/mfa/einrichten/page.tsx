import { holeBackend } from "@/lib/backend.server";

// Ersteinrichtung der Authenticator-App (echter Betrieb). Im Demo-Modus ist der Faktor schon eingerichtet.
export default async function Einrichten() {
  const e = await holeBackend().totpEinrichten();
  return (
    <main className="seite schmal anmelden">
      <h1>Authenticator einrichten</h1>
      {e.status === "bereit" ? (
        <div className="karte formular">
          <p>Scannen Sie den QR-Code mit Ihrer Authenticator-App oder geben Sie den Schlüssel ein, dann den angezeigten Code auf der nächsten Seite.</p>
          {e.qr ? <img src={e.qr} alt="QR-Code für die Authenticator-App" width={200} height={200} /> : null}
          <code>{e.geheimnis}</code>
          <a className="knopf" href="/mfa">Weiter zum Code</a>
        </div>
      ) : (
        <p className="hinweis">{e.status === "vorhanden" ? "Die Authenticator-App ist schon eingerichtet." : "Das Einrichten hat nicht geklappt. Bitte erneut versuchen."} <a href="/mfa">Weiter</a></p>
      )}
    </main>
  );
}
