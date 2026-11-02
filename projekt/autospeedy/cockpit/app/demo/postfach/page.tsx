import { notFound } from "next/navigation";
import { speicher } from "@/lib/demo-speicher";

// Nur Demo: zeigt die Mails, die im echten Betrieb versendet würden (Anmelde-Codes, Hinweis auf neue Meldungen).
export default function Postfach() {
  if (process.env.COCKPIT_DEMO !== "1") notFound();
  const mails = speicher().postfach;
  return (
    <main className="seite schmal">
      <meta httpEquiv="refresh" content="4" />
      <h1>Demo-Postfach</h1>
      <p className="unterzeile">So kämen die Mails im echten Betrieb an. Aktualisiert sich alle 4 Sekunden.</p>
      <div className="postfach">
        {mails.length === 0 ? <p className="hinweis">Noch keine Mail. Fordern Sie im Cockpit einen Code an oder senden Sie eine Meldung über die Website.</p> : null}
        {mails.map((m) => (
          <article className="mail" key={m.id}>
            <div className="kopfzeile">An {m.an} · {new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Zurich" }).format(new Date(m.zeit))}</div>
            <h2>{m.betreff}</h2>
            <pre>{m.text}</pre>
          </article>
        ))}
      </div>
    </main>
  );
}
