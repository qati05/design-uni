import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { ABSCHNITTE, zeitenZeile } from "@/lib/pflege";
import { heuteZuerich } from "../../gemeinsam/site";
import { Kopf } from "./_teile/Kopf";
import { PflegeFormular } from "./pflege/PflegeFormular";

// Startseite des Cockpits: «Website pflegen». Der Proxy lässt nur Mitglieder herein; hier wird es nochmals geprüft.
export default async function PflegeSeite() {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || !s.mitglied) redirect("/login");
  const p = await b.pflegeLesen();
  if (!p) return (
    <>
      <Kopf email={s.email} />
      <main className="seite">
        <h1>Website pflegen</h1>
        <p className="meldung-text" role="alert">Die Website ist gerade nicht erreichbar. Bitte später nochmals versuchen oder das Studio informieren.</p>
      </main>
    </>
  );
  return (
    <>
      <Kopf email={s.email} />
      <main className="seite">
        <h1>Website pflegen</h1>
        <p className="unterzeile">Was hier steht, steht etwa 2 Minuten nach dem Speichern auf Ihrer Website. Heute: <b>{zeitenZeile(p.daten)}</b>.
          {p.geaendert ? <> Zuletzt geändert {new Date(p.geaendert).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Zurich" })}{p.von ? ` von ${p.von}` : ""}.</> : null}</p>
        <nav className="sprung" aria-label="Abschnitte">
          {ABSCHNITTE.map((a) => <a key={a.id} href={`#${a.id}`}>{a.name}</a>)}
        </nav>
        <PflegeFormular daten={p.daten} sha={p.sha} heute={heuteZuerich()} />
      </main>
    </>
  );
}
