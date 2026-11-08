import Link from "next/link";
import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { websiteZahlen } from "@/lib/status";
import { trichter, zusammenfassen } from "@/lib/zahlen";
import { Kopf } from "../_teile/Kopf";

// Zahlen statt Gefühl: was auf der Website angetippt wird, neben Meldungen und Aufträgen (letzte 30 Tage).
export default async function Zahlen() {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || !s.mitglied) redirect("/login");
  const tage = 30;
  const [zeilen, meldungen] = await Promise.all([b.zahlen(tage), b.meldungen()]);
  const ab = Date.now() - tage * 864e5;
  const k = websiteZahlen(meldungen.filter((m) => Date.parse(m.erstellt) >= ab));
  const liste = zusammenfassen(zeilen);
  const max = Math.max(1, ...liste.map((l) => l.summe));
  return (
    <>
      <Kopf email={s.email} aktiv="zahlen" />
      <main className="seite">
        <h1>Zahlen der letzten {tage} Tage</h1>
        {b.art === "demo" ? <p className="hinweis">Demo: Die Zählung enthält Beispielwerte und Ihre eigenen Tipps in der Website-Vorschau.</p> : null}
        <div className="kennzahlen">
          <div className="kennzahl"><b>{k.anfragen}</b><span>Anfragen über die Website ({k.rueckrufe} davon Rückrufe)</span></div>
          <div className="kennzahl"><b>{k.auftraege}</b><span>davon Aufträge</span></div>
          <div className="kennzahl"><b>{k.quote === null ? "–" : `${k.quote} %`}</b><span>Abschlussquote (Aufträge von allen entschiedenen)</span></div>
        </div>
        <p className="unterzeile">WhatsApp-Meldungen laufen über das Geschäftshandy und sind hier nicht dabei. Anrufe zählt die Website nicht, nur Tipps auf die Nummer (unten).</p>
        <h2>Schadenmeldung Schritt für Schritt</h2>
        <p className="unterzeile">Wo Leute aufgeben. Fällt ein Schritt stark ab, ist er zu schwer.</p>
        <table className="zahlen">
          <tbody>
            {trichter(zeilen).map((t) => (
              <tr key={t.name}><th scope="row">{t.name}</th><td className="balken"><svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><rect width={Math.max(1, t.anteil ?? 0)} height="12" /></svg></td><td className="zahl">{t.anzahl}{t.anteil !== null ? ` · ${t.anteil} %` : ""}</td></tr>
            ))}
          </tbody>
        </table>
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
