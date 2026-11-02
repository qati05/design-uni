import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { e164, wann } from "@/lib/anzeige";
import { naechsteSchritte, STATUS_NAME } from "@/lib/status";
import { idSchema } from "@/lib/validierung";
import { notizSetzen, statusSetzen } from "../../aktionen";
import { Kopf } from "../../_teile/Kopf";

export default async function MeldungSeite({ params }: { params: Promise<{ id: string }> }) {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || s.aal !== "aal2" || !s.mitglied) redirect("/login");
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();
  const m = await b.meldung(id);
  if (!m) notFound();
  const nummer = e164(m.telefon);
  const wa = nummer ? `https://wa.me/${nummer.slice(1)}?text=${encodeURIComponent(`Guten Tag ${m.name}, hier ist Auto Speedy wegen Ihrer Schadenmeldung (${m.art}).`)}` : null;
  return (
    <>
      <Kopf email={s.email} />
      <main className="seite">
        <p><Link href="/">← Alle Meldungen</Link></p>
        <h1>{m.art} {m.tesla ? <span className="pille tesla">Tesla</span> : null} {m.beispiel ? <span className="pille beispiel">Beispiel</span> : null}</h1>
        <p className="unterzeile">Eingegangen {wann(m.erstellt)} über {m.quelle === "website" ? "die Website" : m.quelle === "whatsapp" ? "WhatsApp" : "Telefon"} · Status: <span className={`pille st-${m.status}`}>{STATUS_NAME[m.status]}</span></p>
        <div className="detail">
          <section className="karte">
            <h2>Kunde und Schaden</h2>
            <dl>
              <dt>Name</dt><dd>{m.name}</dd>
              <dt>Telefon</dt><dd>{m.telefon}</dd>
              <dt>Stellen am Auto</dt><dd>{m.stellen.join(", ") || "nicht angegeben"}</dd>
              <dt>Bemerkung</dt><dd>{m.bemerkung || "keine"}</dd>
            </dl>
            <div className="aktionen">
              {nummer ? <a className="knopf" href={`tel:${nummer}`}>Anrufen</a> : null}
              {wa ? <a className="knopf gruen" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
            </div>
            <h2 style={{ marginTop: 18 }}>Fotos ({m.fotos.length})</h2>
            {m.fotos.length ? <div className="fotos">{m.fotos.map((f, i) => <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer"><img src={f.url} alt={`Foto ${i + 1} vom Schaden`} /></a>)}</div> : <p className="unterzeile">Keine Fotos geschickt.</p>}
          </section>
          <section className="karte lack">
            <h2>Nächster Schritt</h2>
            <div className="aktionen">
              {naechsteSchritte(m.status).map((n) => (
                <form key={n} action={statusSetzen}>
                  <input type="hidden" name="id" value={m.id} /><input type="hidden" name="status" value={n} />
                  <button type="submit" className={n === "verloren" || n === "neu" ? "knopf leise" : "knopf"}>{n === "neu" ? "Zurück auf Neu" : `→ ${STATUS_NAME[n]}`}</button>
                </form>
              ))}
            </div>
            <form action={notizSetzen} className="formular" style={{ marginTop: 18 }}>
              <input type="hidden" name="id" value={m.id} />
              <label htmlFor="notiz">Notiz (nur intern)</label>
              <textarea id="notiz" name="notiz" rows={4} defaultValue={m.notiz} maxLength={2000} />
              <button type="submit" className="knopf leise">Notiz speichern</button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
