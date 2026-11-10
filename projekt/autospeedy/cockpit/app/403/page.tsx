// Ohne gültigen Ausweis von Cloudflare Access. Im Alltag sieht das niemand: Access zeigt vorher seine eigene Anmeldung.
// Die Seite erscheint, wenn die Anmeldung abgelaufen ist oder das Cockpit noch nicht fertig eingerichtet ist.
export default function Verboten() {
  return (
    <main className="seite schmal anmelden">
      <h1>Kein Zugang</h1>
      <p className="unterzeile">Ihre Anmeldung liess sich nicht prüfen. Bitte melden Sie sich neu an. Klappt es wieder nicht, informieren Sie bitte Ihren Betreuer. Ihre Website und das Formular laufen weiter.</p>
      <a className="knopf knopf--leise" href="/cdn-cgi/access/logout">Neu anmelden</a>
    </main>
  );
}
