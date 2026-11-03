import { holeBackend } from "@/lib/backend.server";

// Nur Studio (Medaur): pro Betrieb die Meldungen als CSV herunterladen, z. B. wenn ein Kunde das Cockpit kündigt.
export default async function StudioSeite() {
  const b = holeBackend();
  const betriebe = (await b.istStudioAdmin()) ? await b.betriebe() : [];
  return (
    <main className="seite schmal">
      <h1>Studio</h1>
      <p className="unterzeile">Datenexport pro Betrieb (CSV für Excel). Jeder Export wird protokolliert.</p>
      <ul className="karte liste">
        {betriebe.map((x) => (
          <li key={x.id}><b>{x.name}</b> {x.aktiv ? "" : "(Cockpit aus) "}<a className="knopf leise klein" href={`/studio/export/${x.id}`} download>CSV herunterladen</a></li>
        ))}
      </ul>
    </main>
  );
}
