import { holeBackend } from "@/lib/backend.server";
import { Kopf } from "../_teile/Kopf";
import { PasskeyKnopf } from "../mfa/PasskeyKnopf";
import { geraetEntfernen } from "./aktionen";

export default async function GeraeteSeite() {
  const b = holeBackend();
  const [s, f] = await Promise.all([b.sitzung(), b.zweitfaktoren()]);
  return (
    <>
      <Kopf email={s?.email ?? ""} aktiv="geraete" />
      <main className="seite schmal">
        <h1>Meine Geräte</h1>
        <p className="unterzeile">Mit diesen Geräten bestätigen Sie die Anmeldung. Richten Sie Handy und Computer ein, dann bleibt immer ein Weg offen.</p>
        <ul className="karte geraete">
          {f.geraete.map((g) => (
            <li key={g.id}><span>{g.name}</span>
              {f.geraete.length > 1 ? <form action={geraetEntfernen}><input type="hidden" name="id" value={g.id} /><button className="knopf leise" type="submit">Entfernen</button></form> : <span className="unterzeile">letztes Gerät</span>}
            </li>
          ))}
        </ul>
        <div className="karte formular">
          <PasskeyKnopf zweck="einrichten" weiter="/geraete" text="Dieses Gerät hinzufügen" />
          <p className="unterzeile">Handy verloren? Vom anderen Gerät aus hier entfernen. Alle Geräte weg: Das Studio setzt den Zugang nach einem Anruf zurück.</p>
        </div>
      </main>
    </>
  );
}
