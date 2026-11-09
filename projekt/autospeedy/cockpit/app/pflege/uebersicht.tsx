"use client";

// Die Übersicht: was auf der Website gerade gilt, die häufigsten Fälle mit einem Tipp («Schnell erledigt») und die Hilfe.
// Auch hier gilt: Ein Tipp ändert nur den Entwurf. Auf die Website kommt es erst mit «Prüfen und veröffentlichen».
import { AUSNAHMEN_MAX, HINWEISE_MAX, ausnahmeAm, ferienStand, hagelHinweisIndex, hinweisAusVorlage, hinweiseStand } from "@/lib/alltag";
import type { Besucher as BesucherZahlen, PflegeStand } from "@/lib/backend";
import { zeitenZeile, type BereichId } from "@/lib/pflege";
import { zeitText } from "./bereiche";
import { Gruppe, Symbol, Tat, Wert, usePflege, type Auftrag } from "./teile";

type Props = {
  basis: PflegeStand; besucher: BesucherZahlen | null;
  /** Bereiche mit Änderungen, die noch nicht veröffentlicht sind. */
  geaendert: ReadonlySet<BereichId>;
  website: { adresse: string; name: string } | null;
  /** Wechselt in einen Bereich; mit Auftrag zeigt der Bereich gleich diesen Eintrag. */
  gehe: (ziel: BereichId | Auftrag) => void;
  /** Kurze Meldung unten. */
  sage: (text: string) => void;
  /** Meldung, dass etwas nicht geht, mit dem Weg in den Bereich. */
  warne: (text: string, bereich: BereichId) => void;
};

export function Uebersicht({ basis, besucher, geaendert, website, gehe, sage, warne }: Props) {
  const { e, aendern, heute } = usePflege();
  const offen = (b: BereichId) => (geaendert.has(b) ? <span className="punkt" role="img" aria-label="geändert, noch nicht veröffentlicht" /> : null);

  /** Neuer Eintrag bei «Feiertage und Ferien»; der Bereich öffnet gleich sein Blatt. */
  function eintrag(name: string, datum: string) {
    if (e.ausnahmen.length >= AUSNAHMEN_MAX) { warne(`Es gibt schon ${AUSNAHMEN_MAX} Einträge. Bitte zuerst alte Einträge entfernen.`, "ausnahmen"); return; }
    aendern((d) => { d.ausnahmen.push({ name, datum, bisDatum: "", geschlossen: true, von: "", bis: "" }); });
    gehe({ bereich: "ausnahmen", index: e.ausnahmen.length });
  }
  function heuteGeschlossen() {
    const da = ausnahmeAm(e.ausnahmen, heute);
    if (da < 0) { eintrag("Geschlossen", heute); return; }
    sage("Für heute gibt es schon einen Eintrag. Sie sehen ihn hier.");
    gehe({ bereich: "ausnahmen", index: da });
  }
  function hagel() {
    const da = hagelHinweisIndex(e.hinweise, heute);
    if (da >= 0) { sage("Es gibt schon einen Hinweis zu Hagel. Sie sehen ihn hier."); gehe({ bereich: "hinweise", index: da }); return; }
    const h = hinweisAusVorlage("hagel", e, heute);
    if (!h) { warne(`Es gibt schon ${HINWEISE_MAX} Hinweise. Mehr zeigt die Website nicht. Bitte zuerst einen Hinweis entfernen.`, "hinweise"); return; }
    aendern((d) => { d.hinweise.push(h); });
    gehe({ bereich: "hinweise", index: e.hinweise.length });
  }
  function neuePerson() {
    const g = e.team.findIndex((x) => x.leute.length < 30);
    if (g < 0) { gehe("team"); return; }
    aendern((d) => { d.team[g]!.leute.push({ name: "", rolle: "", email: "", einverstaendnis: false }); });
    gehe({ bereich: "team", g, p: e.team[g]!.leute.length });
  }

  return (
    <>
      <Gruppe titel="Ihre Website" fuss="Was Sie hier ändern, steht etwa 2 Minuten nach dem Veröffentlichen auf Ihrer Website.">
        <Wert name="Geöffnet">{zeitenZeile(basis.daten) || "geschlossen"}</Wert>
        <a className="zeile zeile--link" href="#hinweise"><span className="zeile__name">Hinweise</span><span className="zeile__wert">{hinweiseStand(basis.daten.hinweise, heute)}</span>{offen("hinweise")}<Symbol name="pfeil" klein /></a>
        <a className="zeile zeile--link" href="#ausnahmen"><span className="zeile__name">Nächste Ferien</span><span className="zeile__wert">{ferienStand(basis.daten.ausnahmen, heute)}</span>{offen("ausnahmen")}<Symbol name="pfeil" klein /></a>
        <Wert name="Zuletzt veröffentlicht">{basis.geaendert ? `${zeitText(basis.geaendert)}${basis.von ? `, ${basis.von}` : ""}` : "noch nie über das Cockpit"}</Wert>
        {besucher ? <a className="zeile zeile--link" href="#besucher"><span className="zeile__name">Besuche in 28 Tagen</span><span className="zeile__wert">{besucher.tage.reduce((n, t) => n + t.besuche, 0).toLocaleString("de-CH")}{besucher.beispiel ? " (Beispiel)" : ""}</span><Symbol name="pfeil" klein /></a> : null}
        {website ? <a className="zeile zeile--link" href={website.adresse} target="_blank" rel="noopener noreferrer"><span className="zeile__name">Website ansehen<span className="unsichtbar"> (öffnet in einem neuen Tab)</span></span><span className="zeile__wert">{website.name}</span><Symbol name="aussen" klein /></a> : null}
      </Gruppe>
      <Gruppe titel="Schnell erledigt" fuss="Ein Tipp ändert die Website noch nicht. Sie prüfen und veröffentlichen wie immer.">
        <Tat symbol="schloss" tu={heuteGeschlossen}>Heute geschlossen</Tat>
        <Tat symbol="ausnahmen" tu={() => eintrag("Betriebsferien", "")}>Ferien eintragen</Tat>
        <Tat symbol="hinweise" tu={hagel}>Hinweis nach Hagel</Tat>
        <Tat symbol="team" tu={neuePerson}>Neue Person im Team</Tat>
        <Tat symbol="kamera" tu={() => gehe("fotos")}>Foto tauschen</Tat>
      </Gruppe>
    </>
  );
}

/** Hilfe: die drei Schritte und, wenn eingerichtet, der Weg zum Betreuer. Am Handy steht sie unter der Liste der Bereiche
 *  und ist eingeklappt, am Computer auf der Übersicht und offen. */
export function Hilfe({ handy, mail }: { handy?: boolean; mail: string | null }) {
  return (
    <Gruppe titel="Hilfe">
      <details className="klappe" open={!handy}>
        <summary className="zeile">So geht es<Symbol name="pfeil" klein /></summary>
        <p className="zeile zeile--schritt"><span className="schritt">1</span>{handy ? "Einen Bereich antippen und ändern, was Sie möchten." : "Links einen Bereich wählen und ändern, was Sie möchten."}</p>
        <p className="zeile zeile--schritt"><span className="schritt">2</span>Unten auf «Prüfen und veröffentlichen» tippen. Sie sehen alle Änderungen in einer Liste.</p>
        <p className="zeile zeile--schritt"><span className="schritt">3</span>«Jetzt veröffentlichen». Etwas falsch? Im Verlauf nehmen Sie es zurück.</p>
      </details>
      {mail ? (
        <a className="zeile zeile--link" href={`mailto:${mail}?subject=${encodeURIComponent("Frage zum Cockpit")}`}>
          <span className="eintrag__text"><span className="eintrag__titel">Ihrem Betreuer schreiben</span><span className="eintrag__unter">{mail}</span></span>
          <Symbol name="mail" klein />
        </a>
      ) : null}
    </Gruppe>
  );
}
