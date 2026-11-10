"use client";

// Das Cockpit: links (Handy: als Liste) die Bereiche, rechts der gewählte Bereich. Alles, was man ändert, ist zuerst ein Entwurf
// im Browser. Unten erscheint dann «Prüfen und veröffentlichen»: erst nach dem Blick auf die Liste der Änderungen geht es auf die Website.
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import type { Besucher as BesucherZahlen, PflegeStand, VerlaufEintrag } from "@/lib/backend";
import { BEREICHE, NEU, aenderungen, entwurfAus, entwurfPruefen, entwurfZuDaten, fotoAnzeige, neueFotos, type BereichId, type Entwurf } from "@/lib/pflege";
import { abmelden } from "../aktionen";
import { standLaden, veroeffentlichen } from "./aktionen";
import { bildVorbereiten, neueKennung, type BildArt } from "./bild";
import { Ausnahmen, Besucher, Fotos, Fragen, Hinweise, Inhaber, Kontakt, Partner, Team, Verlauf, Zeiten, zeitText } from "./bereiche";
import { Blatt, Gruppe, KontextGeber, Symbol, type Auftrag, type Kontext } from "./teile";
import { Hilfe, Uebersicht } from "./uebersicht";

type Props = {
  stand: PflegeStand; verlauf: VerlaufEintrag[]; besucher: BesucherZahlen | null; email: string; heute: string;
  /** Adresse der Website (WEBSITE_URL) und Mail des Betreuers (HILFE_MAIL). Beides freiwillig: Fehlt es, fehlt die Zeile. */
  website: { adresse: string; name: string } | null; hilfeMail: string | null;
};
type Meldung = { ok: boolean; text: string; bereich?: BereichId };
const ORDNEN: readonly BereichId[] = ["ausnahmen", "team", "fragen", "partner"];
const NAME = Object.fromEntries(BEREICHE.map((b) => [b.id, b.name])) as Record<BereichId, string>;
const GRUPPEN = [...new Set(BEREICHE.map((b) => b.gruppe))];

function useBereich(): BereichId | "" {
  const [b, setB] = useState<BereichId | "">("");
  useEffect(() => {
    const lies = () => { const h = location.hash.slice(1); setB(BEREICHE.some((x) => x.id === h) ? (h as BereichId) : ""); window.scrollTo(0, 0); };
    lies();
    addEventListener("hashchange", lies);
    return () => removeEventListener("hashchange", lies);
  }, []);
  return b;
}

export function Cockpit({ stand, verlauf: verlaufStart, besucher, email, heute, website, hilfeMail }: Props) {
  const [basis, setBasis] = useState(stand);
  const [e, setE] = useState<Entwurf>(() => entwurfAus(stand.daten));
  const eJetzt = useRef(e);
  const rueck = useRef<Entwurf[]>([]);
  const fotos = useRef(new Map<string, { blob: Blob; url: string }>());
  const [verlauf, setVerlauf] = useState(verlaufStart);
  // Meldung unten. «ort» merkt, in welchem Blatt sie entstand (null: auf der Seite).
  const [hinweis, setHinweis] = useState<{ text: string; rueck: boolean; nr: number; ort: HTMLElement | null } | null>(null);
  // Solange ein Blatt offen ist, steht die Meldung darin (Ort vom Blatt gemeldet): Dahinter liesse sie sich nicht antippen.
  const [blattOrt, setzeBlattOrt] = useState<HTMLElement | null>(null);
  const blattJetzt = useRef<HTMLElement | null>(null);
  blattJetzt.current = blattOrt;
  const [zurueckgenommen, setZurueckgenommen] = useState(0);
  const [meldung, setMeldung] = useState<Meldung | null>(null);
  const [ordnen, setOrdnen] = useState(false);
  const [pruefen, setPruefen] = useState(false);
  const [laeuft, start] = useTransition();
  const bereich = useBereich();
  const nr = useRef(0);
  // «Öffne diesen Eintrag»: Die Übersicht legt den Auftrag hier ab und wechselt den Bereich. Der Bereich holt ihn beim
  // Anzeigen einmal ab (nimmAuftrag), danach ist er weg. So öffnet nichts ein zweites Mal von selbst.
  const auftrag = useRef<Auftrag | null>(null);

  const setze = useCallback((neu: Entwurf, merken?: string) => {
    if (merken) { rueck.current.push(eJetzt.current); if (rueck.current.length > 40) rueck.current.shift(); setHinweis({ text: merken, rueck: true, nr: ++nr.current, ort: blattJetzt.current }); }
    eJetzt.current = neu; setE(neu);
  }, []);
  const aendern = useCallback<Kontext["aendern"]>((fn, merken) => { const neu = structuredClone(eJetzt.current); fn(neu); setze(neu, merken); }, [setze]);
  const nimmAuftrag = useCallback<Kontext["nimmAuftrag"]>(<B extends Auftrag["bereich"]>(b: B) => {
    const a = auftrag.current;
    auftrag.current = null;
    return a && a.bereich === b ? (a as Extract<Auftrag, { bereich: B }>) : null;
  }, []);
  const gehe = useCallback((ziel: BereichId | Auftrag) => {
    auftrag.current = typeof ziel === "string" ? null : ziel;
    location.hash = typeof ziel === "string" ? ziel : ziel.bereich;
  }, []);
  const sage = useCallback((text: string) => setHinweis({ text, rueck: false, nr: ++nr.current, ort: blattJetzt.current }), []);
  const zurueck = () => { const alt = rueck.current.pop(); if (!alt) return; eJetzt.current = alt; setE(alt); setZurueckgenommen((n) => n + 1); sage("Zurückgenommen."); };
  const zeige = useCallback((wert: string) => (wert.startsWith(NEU) ? fotos.current.get(wert.slice(NEU.length))?.url ?? "" : fotoAnzeige(wert)), []);
  const waehle = useCallback(async (datei: File, art: BildArt) => {
    const r = await bildVorbereiten(datei, art);
    if ("fehler" in r) return r;
    const k = neueKennung();
    fotos.current.set(k, { blob: r.blob, url: URL.createObjectURL(r.blob) });
    return { wert: NEU + k, b: r.b, h: r.h };
  }, []);

  const datenAlt = useMemo(() => entwurfZuDaten(entwurfAus(basis.daten)), [basis]);
  const datenNeu = useMemo(() => entwurfZuDaten(e), [e]);
  const liste = useMemo(() => aenderungen(datenAlt, datenNeu), [datenAlt, datenNeu]);
  const offen = liste.length > 0;

  // Meldung unten verschwindet von selbst; ungespeicherte Änderungen warnen beim Verlassen der Seite.
  useEffect(() => { if (!hinweis) return; const t = setTimeout(() => setHinweis(null), 9000); return () => clearTimeout(t); }, [hinweis]);
  useEffect(() => { if (!offen) return; const w = (x: BeforeUnloadEvent) => { x.preventDefault(); }; addEventListener("beforeunload", w); return () => removeEventListener("beforeunload", w); }, [offen]);
  useEffect(() => { setOrdnen(false); }, [bereich]);

  function oeffnePruefen() {
    const f = entwurfPruefen(e);
    if (f) { setMeldung({ ok: false, text: f.meldung, bereich: f.bereich }); return; }
    setMeldung(null); setPruefen(true);
  }
  function sende() {
    const fd = new FormData();
    fd.set("sha", basis.sha);
    fd.set("daten", JSON.stringify(datenNeu));
    let gross = 0;
    for (const { platzhalter } of neueFotos(datenNeu)) {
      const k = platzhalter.slice(NEU.length), f = fotos.current.get(k);
      if (!f) continue;
      gross += f.blob.size;
      fd.set(`foto:${k}`, new File([f.blob], "bild", { type: f.blob.type }));
    }
    if (gross > 6_500_000) { setMeldung({ ok: false, text: "Das sind zu viele neue Fotos auf einmal. Bitte ein paar Fotos wieder entfernen, veröffentlichen und danach die übrigen hinzufügen." }); setPruefen(false); return; }
    start(async () => {
      const r = await veroeffentlichen(fd).catch(() => ({ ok: false, meldung: "Keine Verbindung. Nichts veröffentlicht. Bitte nochmals versuchen." }) as Awaited<ReturnType<typeof veroeffentlichen>>);
      setPruefen(false);
      setMeldung({ ok: r.ok, text: r.meldung, bereich: r.bereich });
      if (!r.ok) return;
      if (!r.stand) { location.reload(); return; }
      for (const f of fotos.current.values()) URL.revokeObjectURL(f.url);
      fotos.current.clear(); rueck.current = [];
      const neu = entwurfAus(r.stand.daten);
      setBasis(r.stand); eJetzt.current = neu; setE(neu); setHinweis(null);
      if (r.verlauf) setVerlauf(r.verlauf);
    });
  }
  function lade(v: VerlaufEintrag) {
    start(async () => {
      const r = await standLaden(v.id).catch(() => ({ ok: false, meldung: "Keine Verbindung. Bitte nochmals versuchen." }) as Awaited<ReturnType<typeof standLaden>>);
      if (!r.ok || !r.daten) { setMeldung({ ok: false, text: r.meldung }); return; }
      setMeldung(null);
      setze(entwurfAus(r.daten), `Stand vom ${zeitText(v.zeit)} geladen. ${r.meldung === "Stand geladen." ? "" : r.meldung + " "}Noch nicht veröffentlicht.`);
    });
  }

  const kontext: Kontext = { e, aendern, zeige, waehle, heute, ordnen, nimmAuftrag, zurueckgenommen, setzeBlattOrt };
  // «Rückgängig» gibt es im offenen Blatt nur für das, was in diesem Blatt geschah. Eine ältere Meldung der Seite zeigt dort
  // nur ihren Text: Sie nähme sonst etwas zurück, während das Blatt einen anderen Eintrag zeigt. Nach dem Schliessen ist der Knopf wieder da.
  const meldungUnten = hinweis ? (
    <div className="toast" key={hinweis.nr} role="status">
      <span>{hinweis.text}</span>
      {hinweis.rueck && (!blattOrt || hinweis.ort === blattOrt) ? <button type="button" className="toast__tat" onClick={zurueck}>Rückgängig</button> : null}
    </div>
  ) : null;
  const punkte = new Set(liste.map((a) => a.bereich));
  const aktiveHinweise = e.hinweise.filter((h) => h.text.trim() && h.von <= heute && heute <= h.bis).length;
  const wert: Partial<Record<BereichId, string>> = {
    hinweise: aktiveHinweise ? `${aktiveHinweise} aktiv` : "keiner", team: String(e.team.reduce((n, g) => n + g.leute.length, 0)), fragen: e.faq ? String(e.faq.length) : "", partner: e.partner ? String(e.partner.length) : "",
    ausnahmen: e.ausnahmen.length ? String(e.ausnahmen.length) : "", fotos: Object.keys(e.bilder).length ? `${Object.keys(e.bilder).length} ersetzt` : "",
  };

  return (
    <KontextGeber value={kontext}>
      <div className={bereich ? "app app--bereich" : "app"}>
        <aside className="leiste">
          <div className="leiste__kopf"><img src="/bilder/logo-96.webp" width={90} height={32} alt="Auto Speedy AG" /><span>Cockpit</span></div>
          <nav aria-label="Bereiche">
            <div className="gruppe nur-computer">
              <div className="gruppe__karte"><a className={bereich ? "nav" : "nav nav--aktiv"} href="#" aria-current={bereich ? undefined : "page"}><span className="feld feld--uebersicht"><Symbol name="uebersicht" klein /></span><span className="nav__name">Übersicht</span></a></div>
            </div>
            {GRUPPEN.map((g) => (
              <div className="gruppe" key={g}>
                <h2 className="gruppe__titel">{g}</h2>
                <div className="gruppe__karte">
                  {BEREICHE.filter((b) => b.gruppe === g).map((b) => (
                    <a key={b.id} className={bereich === b.id ? "nav nav--aktiv" : "nav"} href={`#${b.id}`} aria-current={bereich === b.id ? "page" : undefined}>
                      <span className={`feld feld--${b.id}`}><Symbol name={b.id} klein /></span>
                      <span className="nav__name">{b.name}</span>
                      {punkte.has(b.id) ? <span className="punkt" role="img" aria-label="geändert, noch nicht veröffentlicht" /> : wert[b.id] ? <span className="nav__wert">{wert[b.id]}</span> : null}
                      <Symbol name="pfeil" klein />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="nur-handy"><Hilfe handy mail={hilfeMail} /></div>
          <div className="gruppe konto">
            <div className="gruppe__karte">
              <p className="konto__mail">Angemeldet als {email}</p>
              <form action={abmelden}><button type="submit" className="zeile zeile--tat">Abmelden</button></form>
            </div>
          </div>
        </aside>

        <main className="inhalt">
          <header className="kopf">
            {bereich ? <a className="kopf__zurueck" href="#"><Symbol name="zurueck" klein />Übersicht</a> : <img className="kopf__logo" src="/bilder/logo-96.webp" width={90} height={32} alt="Auto Speedy AG" />}
            <h1>{bereich ? NAME[bereich] : "Website pflegen"}</h1>
            {bereich && ORDNEN.includes(bereich) ? <button type="button" className="kopf__tat" onClick={() => setOrdnen((o) => !o)} aria-pressed={ordnen}>{ordnen ? "Fertig" : "Bearbeiten"}</button> : null}
          </header>
          <div className="bereich">
            {bereich === "" ? (
              <>
                <Uebersicht basis={basis} besucher={besucher} geaendert={punkte} website={website} gehe={gehe}
                  sage={sage} warne={(text, b) => setMeldung({ ok: false, text, bereich: b })} />
                <div className="nur-computer"><Hilfe mail={hilfeMail} /></div>
              </>
            ) : null}
            {bereich === "hinweise" ? <Hinweise /> : null}
            {bereich === "zeiten" ? <Zeiten /> : null}
            {bereich === "ausnahmen" ? <Ausnahmen /> : null}
            {bereich === "team" ? <Team /> : null}
            {bereich === "fragen" ? <Fragen /> : null}
            {bereich === "fotos" ? <Fotos /> : null}
            {bereich === "partner" ? <Partner /> : null}
            {bereich === "inhaber" ? <Inhaber /> : null}
            {bereich === "kontakt" ? <Kontakt /> : null}
            {bereich === "besucher" ? <Besucher zahlen={besucher} /> : null}
            {bereich === "verlauf" ? <Verlauf verlauf={verlauf} lade={lade} laeuft={laeuft} /> : null}
          </div>
        </main>

        <div className="unten">
          {blattOrt ? null : meldungUnten}
          {meldung ? (
            <div className={meldung.ok ? "balken balken--ok" : "balken balken--fehler"} role={meldung.ok ? "status" : "alert"}>
              <span>{meldung.text}</span>
              {meldung.bereich && meldung.bereich !== bereich ? <a className="balken__tat" href={`#${meldung.bereich}`}>Dorthin</a> : null}
              <button type="button" className="balken__tat" onClick={() => setMeldung(null)}>OK</button>
            </div>
          ) : null}
          {offen ? (
            <div className="speichern">
              <span className="speichern__text"><b>{liste.length === 1 ? "1 Änderung" : `${liste.length} Änderungen`}</b> noch nicht veröffentlicht</span>
              <button type="button" className="knopf knopf--leise" onClick={() => setze(entwurfAus(basis.daten), "Alle Änderungen verworfen.")} disabled={laeuft}>Verwerfen</button>
              <button type="button" className="knopf" onClick={oeffnePruefen} disabled={laeuft}>Prüfen und veröffentlichen</button>
            </div>
          ) : null}
        </div>

        {blattOrt && meldungUnten ? createPortal(meldungUnten, blattOrt) : null}
        {pruefen ? (
          <Blatt titel="Prüfen und veröffentlichen" fertig="Abbrechen" zu={() => setPruefen(false)}>
            <p className="einleitung">Das ändert sich auf Ihrer Website:</p>
            {BEREICHE.filter((b) => punkte.has(b.id)).map((b) => (
              <Gruppe key={b.id} titel={b.name}>
                {liste.filter((a) => a.bereich === b.id).map((a, i) => <p className="zeile zeile--aenderung" key={i}><Symbol name="haken" klein /><span>{a.text}</span></p>)}
              </Gruppe>
            ))}
            <p className="gruppe__fuss">Die Website ist etwa 2 Minuten nach dem Veröffentlichen aktuell. Im Bereich «Verlauf» können Sie es danach wieder zurücknehmen.</p>
            <button type="button" className="knopf knopf--gross" onClick={sende} disabled={laeuft}>{laeuft ? "Wird veröffentlicht …" : "Jetzt veröffentlichen"}</button>
          </Blatt>
        ) : null}
      </div>
    </KontextGeber>
  );
}
