import { holeBackend } from "@/lib/backend.server";
import { zeitenZeile } from "@/lib/pflege";
import { heuteZuerich } from "../../../gemeinsam/site";
import { Kopf } from "../_teile/Kopf";
import { PflegeFormular } from "./PflegeFormular";

export default async function PflegeSeite() {
  const b = holeBackend();
  const [s, p] = await Promise.all([b.sitzung(), b.pflegeLesen()]);
  if (!p) return (
    <>
      <Kopf email={s?.email ?? ""} aktiv="pflege" />
      <main className="seite">
        <h1>Website pflegen</h1>
        <p className="meldung-text" role="alert">Die Website ist gerade nicht erreichbar. Bitte später nochmals versuchen oder das Studio informieren.</p>
      </main>
    </>
  );
  return (
    <>
      <Kopf email={s?.email ?? ""} aktiv="pflege" />
      <main className="seite">
        <h1>Website pflegen</h1>
        <p className="unterzeile">Was hier steht, steht etwa 2 Minuten nach dem Speichern auf Ihrer Website. Heute: <b>{zeitenZeile(p.daten)}</b>.
          {p.geaendert ? <> Zuletzt geändert {new Date(p.geaendert).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short" })}{p.von ? ` von ${p.von}` : ""}.</> : null}</p>
        <PflegeFormular daten={p.daten} sha={p.sha} heute={heuteZuerich()} />
      </main>
    </>
  );
}
