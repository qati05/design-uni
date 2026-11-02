import { PasskeyKnopf } from "../PasskeyKnopf";

// Erstes Gerät einrichten: einmal pro Person, am besten zusammen mit dem Studio beim Start.
export default function Einrichten() {
  return (
    <main className="seite schmal anmelden">
      <img src="/bilder/logo-96.webp" width={135} height={48} alt="Auto Speedy AG" />
      <h1>Dieses Gerät einrichten</h1>
      <p className="unterzeile">Einmal tippen und Finger auflegen oder ins Handy schauen. Ab dann reicht bei jeder Anmeldung derselbe Tipp. Es braucht keine weitere App.</p>
      <div className="karte formular">
        <PasskeyKnopf zweck="einrichten" weiter="/" text="Fingerabdruck oder Gesicht einrichten" />
        <p className="unterzeile">Der Fingerabdruck bleibt im Gerät. Das Cockpit bekommt nur eine Unterschrift, die nur dieses Gerät erzeugen kann.</p>
      </div>
    </main>
  );
}
