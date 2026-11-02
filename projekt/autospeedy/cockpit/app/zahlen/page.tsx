import Link from "next/link";
import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { kennzahlen } from "@/lib/status";
import { zusammenfassen } from "@/lib/zahlen";
import { Kopf } from "../_teile/Kopf";

// Zahlen statt Gefühl: was auf der Website angetippt wird, neben Meldungen und Aufträgen (letzte 30 Tage).
export default async function Zahlen() {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || s.aal !== "aal2" || !s.mitglied) redirect("/login");
  const tage = 30;
  const [zeilen, meldungen] = await Promise.all([b.zahlen(tage), b.meldungen()]);
  const ab = Date.now() - tage * 864e5;
  const k = kennzahlen(meldungen.filter((m) => Date.parse(m.erstellt) >= ab));
  const liste = zusammenfassen(zeilen);
  const max = Math.max(1, ...liste.map((l) => l.summe));
  return (
    <>
      <Kopf email={s.email} aktiv="zahlen" />
      <main className="seite">
        <h1>Zahlen der letzten {tage} Tage</h1>
        {b.art === "demo" ? <p className="hinweis">Demo: Die Zählung enthält Beispielwerte und Ihre eigenen Tipps in der Website-Vorschau.</p> : null}
        <div className="kennzahlen">
          <div className="kennzahl"><b>{k.gesamt}</b><span>Meldungen und Rückrufe</span></div>
          <div className="kennzahl"><b>{k.auftraege}</b><span>davon zum Auftrag geworden</span></div>
          <div className="kennzahl"><b>{k.quote === null ? "–" : `${k.quote} %`}</b><span>Abschlussquote</span></div>
        </div>
        <h2>Was Besucher auf der Website antippen</h2>
        <p className="unterzeile">Gezählt ohne Cookies und ohne Kennung: nur Tag, Knopf und Ort auf der Seite.</p>
        <table className="zahlen">
          <tbody>
            {liste.map((l) => (
              <tr key={l.punkt}><th scope="row">{l.name}</th><td className="balken"><svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><rect width={Math.max(1, Math.round((l.summe / max) * 100))} height="12" /></svg></td><td className="zahl">{l.summe}</td></tr>
            ))}
          </tbody>
        </table>
        <p><Link href="/">← Zu den Meldungen</Link></p>
      </main>
    </>
  );
}
