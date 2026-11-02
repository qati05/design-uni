import { holeBackend } from "@/lib/backend.server";
import { zeitenZeile } from "@/lib/pflege";
import { Kopf } from "../_teile/Kopf";
import { PflegeFormular } from "./PflegeFormular";

export default async function PflegeSeite() {
  const b = holeBackend();
  const [s, p] = await Promise.all([b.sitzung(), b.pflegeLesen()]);
  return (
    <>
      <Kopf email={s?.email ?? ""} aktiv="pflege" />
      <main className="seite">
        <h1>Website pflegen</h1>
        <p className="unterzeile">Was hier steht, steht nach dem Speichern auf autospeedy.ch. Heute: <b>{zeitenZeile(p.daten)}</b>.
          {p.geaendert ? <> Zuletzt geändert {new Date(p.geaendert).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short" })}{p.von ? ` von ${p.von}` : ""}.</> : null}</p>
        <PflegeFormular daten={p.daten} />
      </main>
    </>
  );
}
