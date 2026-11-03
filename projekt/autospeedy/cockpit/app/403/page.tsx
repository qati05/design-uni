export default function Verboten() {
  return (
    <main className="seite schmal anmelden">
      <h1>Kein Zugang</h1>
      <p className="unterzeile">Dieses Konto hat keinen Zugang zum Cockpit, oder das Cockpit ist für Ihren Betrieb ausgeschaltet. Ihre Website und das Formular laufen weiter. Der Versuch ist protokolliert.</p>
      <a className="knopf leise" href="/login">Mit anderer Adresse anmelden</a>
    </main>
  );
}
