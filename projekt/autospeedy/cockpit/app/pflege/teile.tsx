"use client";

// Bausteine der Oberfläche, wie man sie von den Einstellungen auf dem iPhone oder Mac kennt: Gruppen mit Zeilen,
// Schalter, Blätter, die von unten kommen. Ohne style-Attribute (die strenge CSP des Cockpits erlaubt sie nicht).
import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { BildArt } from "./bild";
import type { BereichId, Entwurf } from "@/lib/pflege";

// ---------- Was jeder Bereich braucht
export type Kontext = {
  e: Entwurf;
  /** Ändert den Entwurf. Mit «merken» lässt sich der Schritt zurücknehmen (Meldung unten mit «Rückgängig»). */
  aendern: (fn: (d: Entwurf) => void, merken?: string) => void;
  /** Adresse zum Anzeigen eines Fotos aus dem Entwurf (neu gewählt, im Bild-Speicher oder von der Website). */
  zeige: (wert: string) => string;
  /** Bereitet ein gewähltes Bild vor und merkt es für das Veröffentlichen. */
  waehle: (datei: File, art: BildArt) => Promise<{ wert: string; b: number; h: number } | { fehler: string }>;
  heute: string;
  /** «Bearbeiten» ist an: Zeilen zeigen Entfernen und Verschieben. */
  ordnen: boolean;
  /** Holt den Auftrag der Übersicht für diesen Bereich ab («öffne diesen Eintrag»). Einmal: Danach ist er weg. */
  nimmAuftrag: <B extends Auftrag["bereich"]>(bereich: B) => Extract<Auftrag, { bereich: B }> | null;
  /** Zählt die Tipps auf «Rückgängig». Ein offenes Blatt gleicht sich danach neu mit dem Entwurf ab. */
  zurueckgenommen: number;
  /** Das offene Blatt meldet hier den Ort für Meldungen an (und beim Schliessen wieder ab). Meldungen der Seite lägen
   *  sonst hinter dem Blatt und liessen sich nicht antippen. */
  setzeBlattOrt: Dispatch<SetStateAction<HTMLElement | null>>;
};
/** Auftrag der Übersicht an einen Bereich, z. B. nach «Heute geschlossen»: Der Bereich zeigt gleich den neuen Eintrag. */
export type Auftrag = { bereich: "ausnahmen"; index: number } | { bereich: "hinweise"; index: number } | { bereich: "team"; g: number; p: number };
const K = createContext<Kontext | null>(null);
export const KontextGeber = K.Provider;
export function usePflege(): Kontext {
  const k = useContext(K);
  if (!k) throw new Error("Kontext fehlt");
  return k;
}

// ---------- Symbole (24 × 24, Strich)
const PFADE: Record<string, ReactNode> = {
  uebersicht: <><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /></>,
  hinweise: <><path d="M4 10v4h3l7 4V6L7 10H4z" /><path d="M17.5 9.5a4 4 0 0 1 0 5" /></>,
  zeiten: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  ausnahmen: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></>,
  team: <><circle cx="9" cy="9" r="3" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5" /><circle cx="17" cy="8" r="2.5" /><path d="M16.5 14c2.8 0 4.5 1.8 4.5 4.5" /></>,
  fragen: <><circle cx="12" cy="12" r="8" /><path d="M9.6 9.6a2.5 2.5 0 1 1 3.6 2.2c-.8.5-1.2 1-1.2 1.9M12 16.6v.4" /></>,
  fotos: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="M21 16l-5-5-8 8" /></>,
  partner: <><circle cx="12" cy="10" r="6" /><path d="M9 15l-1.5 6 4.5-2.5 4.5 2.5L15 15" /></>,
  inhaber: <path d="M4 5h16v11H9l-5 4z" />,
  kontakt: <path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />,
  besucher: <path d="M5 20V10M12 20V4M19 20v-7" />,
  verlauf: <><path d="M4 12a8 8 0 1 0 2.6-5.9" /><path d="M4 4v4h4M12 8v4l3 2" /></>,
  pfeil: <path d="M9 6l6 6-6 6" />,
  zurueck: <path d="M15 6l-6 6 6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M6 12h12" />,
  hoch: <path d="M6 14l6-6 6 6" />,
  runter: <path d="M6 10l6 6 6-6" />,
  haken: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  wechsel: <path d="M8 10l4-4 4 4M8 14l4 4 4-4" />,
  kreuz: <path d="M6 6l12 12M18 6L6 18" />,
  kamera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  schloss: <><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  aussen: <><path d="M10 6H6v12h12v-4" /><path d="M13 5h6v6M19 5l-8 8" /></>,
  mail: <><rect x="3.5" y="6" width="17" height="12" rx="2" /><path d="M4 7.5l8 6 8-6" /></>,
};
export function Symbol({ name, klein }: { name: keyof typeof PFADE | BereichId; klein?: boolean }) {
  return <svg className={klein ? "sym sym--klein" : "sym"} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{PFADE[name]}</svg>;
}

// ---------- Gruppen und Zeilen
export function Gruppe({ titel, fuss, children, id }: { titel?: string; fuss?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section className="gruppe" id={id} tabIndex={id ? -1 : undefined}>
      {titel ? <h2 className="gruppe__titel">{titel}</h2> : null}
      <div className="gruppe__karte">{children}</div>
      {fuss ? <p className="gruppe__fuss">{fuss}</p> : null}
    </section>
  );
}

type FeldProps = {
  name: string; wert: string; setze: (w: string) => void; art?: "text" | "email" | "tel" | "date" | "time"; platz?: string; max?: number; hinweis?: string; min?: string | undefined;
  /** Was das Handy vorschlagen darf (autocomplete). Ohne Angabe nichts: Die meisten Felder gehören nicht zur Person am Handy. */
  auto?: "tel" | "email";
  /** Name einer Person oder Firma: Wörter gross beginnen, keine Autokorrektur (sie verändert Nachnamen). */
  eigenname?: boolean;
};
/** Eine Zeile mit Namen links und Eingabe rechts. Am Handy zeigt die Tastatur «Fertig»; die Taste schliesst sie. */
export function Feld({ name, wert, setze, art = "text", platz, max, hinweis, min, auto, eigenname }: FeldProps) {
  const id = useId();
  const tippen = art === "text" || art === "email" || art === "tel";
  return (
    <div className="zeile zeile--feld">
      <label className="zeile__name" htmlFor={id}>{name}</label>
      <input id={id} className="zeile__eingabe" type={art} value={wert} onChange={(x) => setze(x.target.value)} placeholder={platz} maxLength={max} min={min}
        inputMode={art === "tel" ? "tel" : art === "email" ? "email" : undefined} autoCapitalize={art === "email" ? "none" : eigenname ? "words" : undefined}
        autoComplete={tippen ? auto ?? "off" : undefined} autoCorrect={eigenname || art === "email" ? "off" : undefined} spellCheck={eigenname || art === "email" ? false : undefined}
        enterKeyHint={tippen ? "done" : undefined} onKeyDown={tippen ? (x) => { if (x.key === "Enter") x.currentTarget.blur(); } : undefined} aria-describedby={hinweis ? id + "h" : undefined} />
      {hinweis ? <span className="zeile__hinweis" id={id + "h"}>{hinweis}</span> : null}
    </div>
  );
}
/** Mehrzeiliger Text: Name oben, Feld darunter, Zähler rechts. */
export function Langtext({ name, wert, setze, max, zeilen = 3, platz }: { name: string; wert: string; setze: (w: string) => void; max: number; zeilen?: number; platz?: string }) {
  const id = useId();
  return (
    <div className="zeile zeile--lang">
      <label className="zeile__name" htmlFor={id}>{name}<span className="zaehler">{wert.length} von {max}</span></label>
      <textarea id={id} className="zeile__text" value={wert} onChange={(x) => setze(x.target.value)} maxLength={max} rows={zeilen} placeholder={platz} />
    </div>
  );
}
/** Auswahl aus einer Liste: ein Menü wie am Mac oder iPhone (Haken beim gewählten Eintrag), kein Auswahlfeld des Browsers.
 *  Bedienung: antippen oder Pfeiltasten, Eingabe wählt, Esc schliesst, ein Buchstabe springt zum Eintrag. */
export function Auswahl({ name, wert, setze, wahl }: { name: string; wert: string; setze: (w: string) => void; wahl: { wert: string; text: string }[] }) {
  const id = useId();
  const [auf, setAuf] = useState(false);
  const [aktiv, setAktiv] = useState(0);
  const knopf = useRef<HTMLButtonElement>(null), liste = useRef<HTMLDivElement>(null);
  const gewaehlt = Math.max(0, wahl.findIndex((w) => w.wert === wert));
  const oeffne = () => { setAktiv(gewaehlt); setAuf(true); };
  const schliesse = () => { setAuf(false); knopf.current?.focus(); };
  const nimm = (i: number) => { const w = wahl[i]; if (w && w.wert !== wert) setze(w.wert); schliesse(); };

  useLayoutEffect(() => {
    const k = knopf.current, l = liste.current;
    if (!auf || !k || !l) return;
    // Oberste Ebene des Browsers: So schneidet weder die Gruppe noch das Blatt das Menü ab. Der Ort kommt per Skript
    // (kein style-Attribut im Markup, die CSP erlaubt das Setzen über das Element).
    try { l.showPopover?.(); } catch { /* ältere Browser: bleibt als festes Element stehen */ }
    // Beim Rollen wandert das Menü mit seiner Zeile mit; ist die Zeile aus dem Bild, schliesst es.
    const ort = () => {
      const r = k.getBoundingClientRect(), h = l.offsetHeight, b = l.offsetWidth, rand = 8;
      if (r.bottom < 0 || r.top > window.innerHeight) { setAuf(false); return; }
      const unten = r.bottom + 6 + h <= window.innerHeight - rand;
      l.style.top = `${Math.round(unten ? r.bottom + 6 : Math.max(rand, r.top - 6 - h))}px`;
      l.style.left = `${Math.round(Math.min(Math.max(rand, r.right - b), window.innerWidth - b - rand))}px`;
      l.dataset.von = unten ? "oben" : "unten";
    };
    ort();
    l.focus({ preventScroll: true });
    const weg = (x: Event) => { if (!(x.target instanceof Node && (l.contains(x.target) || k.contains(x.target)))) setAuf(false); };
    const rollen = (x: Event) => { if (!(x.target instanceof Node && l.contains(x.target))) ort(); };
    document.addEventListener("pointerdown", weg, true);
    window.addEventListener("scroll", rollen, true);
    window.addEventListener("resize", ort);
    return () => { document.removeEventListener("pointerdown", weg, true); window.removeEventListener("scroll", rollen, true); window.removeEventListener("resize", ort); };
  }, [auf]);

  function taste(x: React.KeyboardEvent) {
    const n = wahl.length;
    if (x.key === "Escape") { x.preventDefault(); x.stopPropagation(); schliesse(); }
    else if (x.key === "ArrowDown") { x.preventDefault(); setAktiv((i) => Math.min(n - 1, i + 1)); }
    else if (x.key === "ArrowUp") { x.preventDefault(); setAktiv((i) => Math.max(0, i - 1)); }
    else if (x.key === "Home") { x.preventDefault(); setAktiv(0); }
    else if (x.key === "End") { x.preventDefault(); setAktiv(n - 1); }
    else if (x.key === "Enter" || x.key === " ") { x.preventDefault(); nimm(aktiv); }
    else if (x.key === "Tab") setAuf(false);
    else if (x.key.length === 1) { const i = wahl.findIndex((w) => w.text.toLowerCase().startsWith(x.key.toLowerCase())); if (i >= 0) setAktiv(i); }
  }
  return (
    <div className="zeile zeile--feld zeile--wahl">
      <span className="zeile__name" id={id + "n"}>{name}</span>
      <button ref={knopf} type="button" id={id} className="wahl" aria-haspopup="listbox" aria-expanded={auf} aria-labelledby={`${id}n ${id}`}
        onClick={() => (auf ? setAuf(false) : oeffne())} onKeyDown={(x) => { if (!auf && (x.key === "ArrowDown" || x.key === "ArrowUp")) { x.preventDefault(); oeffne(); } }}>
        <span className="wahl__wert">{wahl[gewaehlt]?.text}</span><Symbol name="wechsel" klein />
      </button>
      {auf ? (
        <div ref={liste} id={id + "l"} className="menue" role="listbox" tabIndex={-1} popover="manual" aria-labelledby={id + "n"} aria-activedescendant={`${id}o${aktiv}`} onKeyDown={taste}>
          {wahl.map((w, i) => (
            <div key={w.wert} id={`${id}o${i}`} role="option" aria-selected={w.wert === wert} className={i === aktiv ? "menue__punkt menue__punkt--aktiv" : "menue__punkt"} onPointerMove={() => setAktiv(i)} onClick={() => nimm(i)}>
              <Symbol name="haken" klein /><span>{w.text}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Auswahl mit kleinen Bildern, wie «Hell / Dunkel» in den Einstellungen: Bild, Name, runder Punkt mit Haken. */
export function Kacheln({ name, wert, setze, wahl }: { name: string; wert: string; setze: (w: string) => void; wahl: { wert: string; text: string; bild: ReactNode; aus?: string }[] }) {
  const id = useId();
  return (
    <fieldset className="kacheln">
      <legend className="kacheln__name">{name}</legend>
      <div className="kacheln__reihe">
        {wahl.map((w) => (
          <label key={w.wert} className={w.aus ? "kachel kachel--aus" : "kachel"}>
            <input type="radio" className="unsichtbar" name={id} value={w.wert} checked={w.wert === wert} disabled={!!w.aus} onChange={() => setze(w.wert)} />
            <span className="kachel__bild" aria-hidden="true">{w.bild}</span>
            <span className="kachel__text">{w.text}</span>
            {w.aus ? <small className="kachel__aus">{w.aus}</small> : <span className="kachel__punkt" aria-hidden="true"><Symbol name="haken" klein /></span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Umschalter mit zwei oder drei Feldern (wie die Reiter oben in vielen Apple-Apps). */
export function Umschalter({ name, wert, setze, wahl }: { name: string; wert: string; setze: (w: string) => void; wahl: { wert: string; text: string }[] }) {
  const id = useId();
  return (
    <fieldset className="umschalter">
      <legend className="unsichtbar">{name}</legend>
      {wahl.map((w) => (
        <label key={w.wert} className="umschalter__feld"><input type="radio" className="unsichtbar" name={id} value={w.wert} checked={w.wert === wert} onChange={() => setze(w.wert)} /><span>{w.text}</span></label>
      ))}
    </fieldset>
  );
}
export function Schalter({ name, an, setze, hinweis, aus }: { name: string; an: boolean; setze: (an: boolean) => void; hinweis?: string; aus?: boolean }) {
  return (
    <label className={aus ? "zeile zeile--schalter zeile--aus" : "zeile zeile--schalter"}>
      <span className="zeile__name">{name}{hinweis ? <small>{hinweis}</small> : null}</span>
      <input type="checkbox" role="switch" className="schalter" checked={an} disabled={aus} onChange={(x) => setze(x.target.checked)} />
    </label>
  );
}
/** Zeile, die etwas tut: blau für «hinzufügen», rot für «entfernen». */
export function Tat({ children, tu, rot, symbol, aus }: { children: ReactNode; tu: () => void; rot?: boolean; symbol?: "plus" | "verlauf" | "kamera" | "schloss" | "ausnahmen" | "hinweise" | "team"; aus?: boolean }) {
  return <button type="button" className={rot ? "zeile zeile--tat zeile--rot" : "zeile zeile--tat"} onClick={tu} disabled={aus}>{symbol ? <Symbol name={symbol} klein /> : null}<span>{children}</span></button>;
}
export function Wert({ name, children }: { name: string; children: ReactNode }) {
  return <div className="zeile zeile--wert"><span className="zeile__name">{name}</span><span className="zeile__wert">{children}</span></div>;
}

/** Zeile einer Liste: antippen öffnet das Blatt. Im Modus «Bearbeiten» stehen links Entfernen und rechts Verschieben. */
export function Eintrag({ bild, titel, unter, marke, auf, weg, hoch, runter }: { bild?: ReactNode; titel: string; unter?: string; marke?: string; auf: () => void; weg: () => void; hoch?: () => void; runter?: () => void }) {
  const { ordnen } = usePflege();
  const name = titel || "Ohne Namen";
  return (
    <div className={ordnen ? "zeile zeile--eintrag zeile--ordnen" : "zeile zeile--eintrag"}>
      {ordnen ? <button type="button" className="rund rund--rot" onClick={weg} aria-label={`${name} entfernen`}><Symbol name="minus" klein /></button> : null}
      <button type="button" className="eintrag" onClick={auf} aria-label={`${name} bearbeiten`}>
        {bild}
        <span className="eintrag__text"><span className="eintrag__titel">{name}</span>{unter ? <span className="eintrag__unter">{unter}</span> : null}{ordnen && marke ? <span className="marke marke--unten">{marke}</span> : null}</span>
        {marke && !ordnen ? <span className="marke">{marke}</span> : null}
        {ordnen ? null : <Symbol name="pfeil" klein />}
      </button>
      {ordnen ? (
        <span className="schieber">
          <button type="button" className="rund" onClick={hoch} disabled={!hoch} aria-label={`${name} nach oben`}><Symbol name="hoch" klein /></button>
          <button type="button" className="rund" onClick={runter} disabled={!runter} aria-label={`${name} nach unten`}><Symbol name="runter" klein /></button>
        </span>
      ) : null}
    </div>
  );
}

/** Blatt: kommt auf dem Handy von unten, steht am Computer in der Mitte. Schliessen mit «Fertig», Esc oder Tippen daneben.
 *  Unten im Blatt ist Platz für die Meldung der Seite («Rückgängig»), solange das Blatt offen ist. */
export function Blatt({ titel, zu, children, fertig = "Fertig" }: { titel: string; zu: () => void; children: ReactNode; fertig?: string }) {
  const ref = useRef<HTMLDialogElement>(null), unten = useRef<HTMLDivElement>(null);
  const { setzeBlattOrt } = usePflege();
  useEffect(() => {
    // Kein close() beim Abbau: Das Element verschwindet ohnehin, und ein close() würde «zu» ein zweites Mal auslösen.
    const d = ref.current, u = unten.current;
    if (d && !d.open) d.showModal();
    setzeBlattOrt(u);
    return () => setzeBlattOrt((jetzt) => (jetzt === u ? null : jetzt));
  }, [setzeBlattOrt]);
  return (
    <dialog ref={ref} className="blatt" aria-label={titel} onClose={zu} onClick={(x) => { if (x.target === ref.current) ref.current?.close(); }}>
      <div className="blatt__innen">
        <header className="blatt__kopf"><h2>{titel}</h2><button type="button" className="blatt__fertig" onClick={() => ref.current?.close()}>{fertig}</button></header>
        <div className="blatt__inhalt">{children}</div>
        <div className="blatt__unten" ref={unten} />
      </div>
    </dialog>
  );
}

/** Bild wählen: ein Knopf, dahinter das Dateifeld (Handy: Kamera oder Fotos). */
export function BildKnopf({ text, art, gewaehlt, leise }: { text: string; art: BildArt; gewaehlt: (r: { wert: string; b: number; h: number }) => void; leise?: boolean }) {
  const { waehle } = usePflege();
  const fehler = useRef<HTMLSpanElement>(null);
  async function wahl(x: React.ChangeEvent<HTMLInputElement>) {
    const feld = x.currentTarget, datei = feld.files?.[0];
    if (fehler.current) fehler.current.textContent = "";
    if (!datei) return;
    const r = await waehle(datei, art);
    feld.value = "";
    if ("fehler" in r) { if (fehler.current) fehler.current.textContent = r.fehler; return; }
    gewaehlt(r);
  }
  return (
    <span className="bildknopf">
      <label className={leise ? "knopf knopf--leise knopf--klein" : "knopf knopf--klein"}>{text}<input type="file" className="unsichtbar" accept={art === "logo" ? "image/png,image/webp,image/jpeg" : "image/jpeg,image/png,image/webp,image/heic"} onChange={wahl} /></label>
      <span className="bildknopf__fehler" role="alert" ref={fehler} />
    </span>
  );
}
