import Link from "next/link";
import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { wann } from "@/lib/anzeige";
import { kennzahlen, STATUS, STATUS_NAME, type Status } from "@/lib/status";
import { Kopf } from "./_teile/Kopf";

export default async function Uebersicht({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || s.aal !== "aal2" || !s.mitglied) redirect("/login");
  const { status } = await searchParams;
  const filter = (STATUS as readonly string[]).includes(status ?? "") ? (status as Status) : null;
  const alle = await b.meldungen();
  const k = kennzahlen(alle);
  const liste = filter ? alle.filter((m) => m.status === filter) : alle;
  return (
    <>
      <Kopf email={s.email} />
      <main className="seite">
        <h1>Schadenmeldungen</h1>
        <div className="kennzahlen">
          <div className="kennzahl"><b>{k.neu}</b><span>neu, noch nicht zurückgerufen</span></div>
          {k.aelterAls2hNeu ? <div className="kennzahl warn"><b>{k.aelterAls2hNeu}</b><span>warten länger als 2 Std.</span></div> : null}
          <div className="kennzahl"><b>{k.offen}</b><span>in Arbeit (zurückgerufen, Offerte)</span></div>
          <div className="kennzahl"><b>{k.auftraege}</b><span>wurden zum Auftrag</span></div>
          <div className="kennzahl"><b>{k.quote === null ? "–" : `${k.quote} %`}</b><span>Abschlussquote (Aufträge von allen entschiedenen)</span></div>
        </div>
        <nav className="reiter" aria-label="Nach Status filtern">
          <Link href="/" aria-current={filter ? undefined : "page"}>Alle ({alle.length})</Link>
          {STATUS.map((st) => <Link key={st} href={`/?status=${st}`} aria-current={filter === st ? "page" : undefined}>{STATUS_NAME[st]} ({alle.filter((m) => m.status === st).length})</Link>)}
        </nav>
        {liste.length === 0 ? <p className="hinweis">Keine Meldungen in dieser Ansicht.</p> : null}
        <ul className="liste">
          {liste.map((m) => (
            <li key={m.id}>
              <Link className={`zeile st-${m.status}`} href={`/meldung/${m.id}`}>
                <span>
                  <span className="art">{m.art}</span>{" "}
                  {m.tesla ? <span className="pille tesla">{m.teslaModell && m.teslaModell !== "Anderes Modell" ? `Tesla ${m.teslaModell}` : "Tesla"}</span> : null}{" "}
                  {m.beispiel ? <span className="pille beispiel">Beispiel</span> : null}
                  <br />
                  <span className="meta">{wann(m.erstellt)} · {m.name} · {m.art === "Rückruf" ? m.bemerkung : m.stellen.join(", ") || "Stelle nicht angegeben"} · {m.fotos.length} Foto{m.fotos.length === 1 ? "" : "s"} · über {m.quelle === "website" ? "Website" : m.quelle === "whatsapp" ? "WhatsApp" : "Telefon"}</span>
                  {m.status === "neu" && Date.now() - Date.parse(m.erstellt) > 2 * 3600e3 ? <><br /><span className="alt">Wartet seit mehr als 2 Stunden auf einen Rückruf</span></> : null}
                </span>
                <span className={`pille st-${m.status}`}>{STATUS_NAME[m.status]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
