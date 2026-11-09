// Eigene 404-Seite: Die eingebaute von Next bringt eingebettete Styles mit, die die strenge CSP des Cockpits blockiert.
export default function NichtGefunden() {
  return (
    <main className="seite schmal anmelden">
      <h1>Diese Seite gibt es nicht</h1>
      <p className="unterzeile">Vielleicht ist der Link veraltet. Im Cockpit finden Sie alles über die Übersicht.</p>
      <a className="knopf" href="/">Zur Übersicht</a>
    </main>
  );
}
