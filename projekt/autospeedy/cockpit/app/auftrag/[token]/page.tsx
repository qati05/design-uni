import { holeBackend } from "@/lib/backend.server";
import { wann } from "@/lib/anzeige";
import { ErledigtFormular } from "./ErledigtFormular";

// Ziel des Links in der Auftrags-Mail. Ohne Login, nur mit dem Token aus der Mail; zeigt keine Personendaten.
// Bewusst mit Knopf (POST): Mailprogramme öffnen Links manchmal selbst zur Prüfung, das darf nichts auslösen.
export default async function AuftragSeite({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const a = /^[0-9a-f]{64}$/.test(token) ? await holeBackend().auftragAnsehen(token) : null;
  return (
    <main className="seite schmal anmelden">
      <img src="/bilder/logo-96.webp" width={135} height={48} alt="Auto Speedy AG" />
      {a ? (
        <>
          <h1>Auftrag erledigt?</h1>
          <div className="karte formular">
            <p><b>{a.art}{a.tesla ? " (Tesla)" : ""}</b><br /><span className="unterzeile">Eingegangen {wann(a.erstellt)}</span></p>
            <ErledigtFormular token={token} mitMail={a.mitMail} />
          </div>
        </>
      ) : (
        <>
          <h1>Link nicht mehr gültig</h1>
          <p className="unterzeile">Der Auftrag ist schon als erledigt gemeldet, oder der Link ist abgelaufen. Im Cockpit sehen Sie den Stand.</p>
          <a className="knopf" href="/">Zum Cockpit</a>
        </>
      )}
    </main>
  );
}
