"use client";

// Die Bereiche des Cockpits. Jeder ändert nur den Entwurf im Browser; auf die Website kommt es erst mit «Veröffentlichen».
import { useEffect, useRef, useState } from "react";
import { AUSNAHME_TAGE_MAX, BILD_PLAETZE, FAQ_PLATZHALTER, HINWEIS_ARTEN, HINWEIS_FORMEN, HINWEIS_LINKS, HINWEIS_POPUP_ARTEN, telefonCH, zeitenZeile, type Entwurf, type EntwurfPerson, type Pflege } from "@/lib/pflege";
import { AUSNAHMEN_MAX, HINWEISE_MAX, HINWEIS_VORLAGEN, ausnahmeAendern, ausnahmeEntfernen, ausnahmeSchliessen, ferienBindung, ferienHinweisGrund, ferienHinweisIndex, ferienHinweisSchalten, hinweisAusVorlage, hinweisForm, type FerienBindung, type VorlageId } from "@/lib/alltag";
import type { Besucher as BesucherZahlen, VerlaufEintrag } from "@/lib/backend";
import { Auswahl, BildKnopf, Blatt, Eintrag, Feld, Gruppe, Kacheln, Langtext, Schalter, Symbol, Tat, Umschalter, Wert, usePflege } from "./teile";

const ART_NAME: Record<(typeof HINWEIS_ARTEN)[number], string> = { hagel: "Hagel", ferien: "Ferien", geschlossen: "Geschlossen", aktion: "Aktion", info: "Information" };
/** «7.30» (so steht es in site.json) ↔ «07:30» (so will es das Zeitfeld des Browsers). */
const alsUhr = (s: string) => (/^\d{1,2}\.\d{2}$/.test(s) ? s.padStart(5, "0").replace(".", ":") : "");
const alsPunkt = (s: string) => (/^\d{2}:\d{2}/.test(s) ? `${Number(s.slice(0, 2))}.${s.slice(3, 5)}` : "");
export const tagText = (d: string, lang = false) => (/^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + "T12:00:00Z").toLocaleDateString("de-CH", lang ? { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" } : { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }) : "");
export const zeitText = (z: string) => new Date(z).toLocaleString("de-CH", { weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });

// ---------- Aktuell
type Form = Entwurf["hinweise"][number]["form"];
const FORM_TEXT: Record<Form, { name: string; wo: string }> = {
  banner: { name: "Leiste oben", wo: "Steht ganz oben auf jeder Seite, über dem Menü. Besucher können sie schliessen." },
  popup: { name: "Fenster", wo: "Erscheint nach 2 Sekunden in der Mitte, einmal pro Besuch. Nicht auf der Seite «Schaden melden»." },
  ecke: { name: "Karte in der Ecke", wo: "Steht unten rechts über der Seite, bis man sie schliesst. Nicht auf der Seite «Schaden melden»." },
};
// Dieselben Zeichen wie auf der Website (astro-klar/src/components/Hinweis.astro).
const ART_ZEICHEN: Record<(typeof HINWEIS_ARTEN)[number], React.ReactNode> = {
  hagel: <><path d="M12 2.5c3.2 3.4 5.2 6.1 5.2 8.8a5.2 5.2 0 1 1-10.4 0C6.8 8.6 8.8 5.9 12 2.5Z" /><circle cx="12" cy="19.5" r="1.3" fill="currentColor" stroke="none" /><circle cx="8" cy="21" r="1.1" fill="currentColor" stroke="none" /><circle cx="16" cy="21" r="1.1" fill="currentColor" stroke="none" /></>,
  ferien: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" /></>,
  geschlossen: <><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  aktion: <path d="M12 3.2 14.5 8.6l5.9.7-4.4 4 1.2 5.8L12 16.3 6.8 19.1 8 13.3l-4.4-4 5.9-.7Z" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.8h.01" /></>,
};
const Zeichen = ({ art }: { art: (typeof HINWEIS_ARTEN)[number] }) => <svg className="vs-zeichen" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ART_ZEICHEN[art]}</svg>;
const Zu = () => <svg className="vs-zu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>;
const popupErlaubt = (art: string) => (HINWEIS_POPUP_ARTEN as readonly string[]).includes(art);
const formVon = hinweisForm;
/** Zeichen einer Vorlage im Blatt «Was möchten Sie mitteilen?»: das Zeichen der Art, wie es auf der Website steht. */
const VORLAGE_ZEICHEN: Record<VorlageId, React.ReactNode> = { hagel: ART_ZEICHEN.hagel, ferien: ART_ZEICHEN.ferien, geschlossen: ART_ZEICHEN.geschlossen, aktion: ART_ZEICHEN.aktion, stelle: <Symbol name="team" klein />, leer: <Symbol name="plus" klein /> };
/** Kleines Schema für die Wahl der Darstellung: eine Seite, der Hinweis ist blau hervorgehoben. */
const skizze = (form: Form) => <span className={`skizze skizze--${form}`}><i className="skizze__kopf" /><i className="skizze__text" /><i className="skizze__bild" /><b /></span>;

type Geraet = "handy" | "computer";
/** Vorschau: die Startseite in klein, der Hinweis steht dort, wo ihn Besucher sehen. Vereinfacht, aber mit dem echten Text. */
function HinweisVorschau({ h, geraet }: { h: Entwurf["hinweise"][number]; geraet: Geraet }) {
  const form = formVon(h), text = h.text || "Ihr Text erscheint hier.";
  const link = HINWEIS_LINKS.find((l) => l.wert === h.link)?.text;
  return (
    <figure className={`vorschau vorschau--${geraet}`}>
      <div className="vs">
        <div className="vs__rahmen" aria-hidden="true"><i /><i /><i /><span>autospeedy.ch</span></div>
        <div className="vs__seite">
          {form === "banner" ? (
            <p className={`vs-leiste vs-art--${h.art}`}><Zeichen art={h.art} /><span className="vs-leiste__text">{h.titel ? <b>{h.titel} </b> : null}{text}{link ? <u>{link} →</u> : null}</span><Zu /></p>
          ) : null}
          <div className="vs__kopf" aria-hidden="true"><img src="/bilder/logo-96.webp" alt="" /><span className="vs__nav"><i /><i /><i /><i /></span><span className="vs__knopf" /></div>
          <div className="vs__hero" aria-hidden="true">
            <div className="vs__herotext"><p className="vs__titel">Qualität, die man sieht und fährt.</p><i className="vs__strich" /><i className="vs__strich vs__strich--kurz" /><span className="vs__knoepfe"><i /><i /></span></div>
            <img src="/bilder/defender-kabine-480.webp" alt="" />
          </div>
          <div className="vs__band" aria-hidden="true"><span>Was ist passiert?</span><i /><i /><i /></div>
          {form === "popup" ? (
            <div className="vs__schleier"><div className="vs-fenster"><span className="vs-fenster__kopf"><Zeichen art={h.art} /><Zu /></span>{h.titel ? <b className="vs-fenster__titel">{h.titel}</b> : null}<p>{text}</p>{link ? <span className="vs-fenster__knopf">{link}</span> : null}</div></div>
          ) : null}
          {form === "ecke" ? (
            <div className={`vs-ecke vs-art--${h.art}`}><Zeichen art={h.art} /><span className="vs-ecke__text">{h.titel ? <b>{h.titel}</b> : null}<span>{text}</span>{link ? <u>{link} →</u> : null}</span><Zu /></div>
          ) : null}
          <div className="vs__handyleiste" aria-hidden="true"><i /><i /></div>
        </div>
      </div>
      <figcaption><b>{FORM_TEXT[form].name}.</b> {FORM_TEXT[form].wo}</figcaption>
    </figure>
  );
}

export function Hinweise() {
  const { e, aendern, heute, nimmAuftrag } = usePflege();
  const [geraet, setGeraet] = useState<Geraet>("handy");
  const [wahl, setWahl] = useState(false);
  // Zu diesem Hinweis springen: nach der Wahl einer Vorlage oder nach «Hinweis nach Hagel» auf der Übersicht.
  const [ziel, setZiel] = useState<number | null>(null);
  // Am Computer zeigt die Vorschau zuerst die Website am Computer, am Handy die am Handy.
  useEffect(() => {
    if (window.matchMedia("(min-width: 860px)").matches) setGeraet("computer");
    const auf = nimmAuftrag("hinweise");
    if (auf) setZiel(auf.index);
  }, []);
  useEffect(() => {
    if (ziel === null) return;
    const g = document.getElementById(`hinweis-${ziel}`);
    g?.focus({ preventScroll: true });
    // Der erste Hinweis steht ohnehin oben. Erst ab dem zweiten rollt die Seite hin.
    if (ziel > 0) g?.scrollIntoView({ block: "start" });
    setZiel(null);
  }, [ziel]);
  const nimm = (id: VorlageId) => {
    const h = hinweisAusVorlage(id, e, heute);
    setWahl(false);
    if (!h) return;
    aendern((d) => { d.hinweise.push(h); });
    setZiel(e.hinweise.length);
  };
  return (
    <>
      <p className="einleitung">Zum Beispiel nach einem Hagelsturm oder vor den Ferien. Die Website zeigt einen Hinweis nur im gewählten Zeitraum. Die Vorschau zeigt, wo er steht. Höchstens 3 Hinweise, davon 1 Fenster und 1 Karte.</p>
      {e.hinweise.length ? <Umschalter name="Vorschau für" wert={geraet} setze={(w) => setGeraet(w as Geraet)} wahl={[{ wert: "handy", text: "Handy" }, { wert: "computer", text: "Computer" }]} /> : null}
      {e.hinweise.map((h, i) => {
        const stand = heute < h.von ? `Geplant: Die Website zeigt ihn ab ${tagText(h.von)}.` : heute > h.bis ? "Abgelaufen: Die Website zeigt ihn nicht mehr." : `Läuft: Die Website zeigt ihn bis ${tagText(h.bis)}.`;
        const setze = (fn: (x: Entwurf["hinweise"][number]) => void) => aendern((d) => fn(d.hinweise[i]!));
        return (
          <Gruppe key={i} id={`hinweis-${i}`} titel={`Hinweis ${i + 1}`} fuss={stand}>
            <HinweisVorschau h={h} geraet={geraet} />
            <Kacheln name="Darstellung" wert={formVon(h)} setze={(w) => setze((x) => { x.form = w as Form; })} wahl={HINWEIS_FORMEN.map((f) => ({ wert: f, text: FORM_TEXT[f].name, bild: skizze(f), ...(f === "popup" && !popupErlaubt(h.art) ? { aus: "nur bei Hagel und Aktion" } : {}) }))} />
            <Auswahl name="Art" wert={h.art} setze={(w) => setze((x) => { x.art = w as typeof x.art; })} wahl={HINWEIS_ARTEN.map((a) => ({ wert: a, text: ART_NAME[a] }))} />
            <Feld name="Titel" wert={h.titel} setze={(w) => setze((x) => { x.titel = w; })} max={50} platz="freiwillig" />
            <Langtext name="Text" wert={h.text} setze={(w) => setze((x) => { x.text = w; })} max={160} zeilen={2} />
            <Auswahl name="Führt zu" wert={h.link} setze={(w) => setze((x) => { x.link = w; })} wahl={[{ wert: "", text: "Kein Link" }, ...HINWEIS_LINKS.map((l) => ({ wert: l.wert, text: l.text }))]} />
            <Feld name="Zeigen ab" art="date" wert={h.von} setze={(w) => setze((x) => { x.von = w; })} />
            <Feld name="Zeigen bis" art="date" wert={h.bis} setze={(w) => setze((x) => { x.bis = w; })} />
            <Tat rot tu={() => aendern((d) => { d.hinweise.splice(i, 1); }, "Hinweis entfernt")}>Hinweis entfernen</Tat>
          </Gruppe>
        );
      })}
      {e.hinweise.length < HINWEISE_MAX ? <Gruppe><Tat symbol="plus" tu={() => setWahl(true)}>Hinweis hinzufügen</Tat></Gruppe> : null}
      {wahl ? (
        <Blatt titel="Was möchten Sie mitteilen?" fertig="Abbrechen" zu={() => setWahl(false)}>
          <Gruppe fuss="Die Texte sind Vorschläge. Sie können danach alles ändern. Auf die Website kommt der Hinweis erst mit «Prüfen und veröffentlichen».">
            {HINWEIS_VORLAGEN.map((v) => (
              <div className="zeile zeile--eintrag" key={v.id}>
                <button type="button" className="eintrag" onClick={() => nimm(v.id)}>
                  <span className="feld feld--hinweise"><svg className="sym sym--klein" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{VORLAGE_ZEICHEN[v.id]}</svg></span>
                  <span className="eintrag__text"><span className="eintrag__titel">{v.name}</span><span className="eintrag__unter">{v.unter}</span></span>
                  <Symbol name="pfeil" klein />
                </button>
              </div>
            ))}
          </Gruppe>
        </Blatt>
      ) : null}
    </>
  );
}

export function Zeiten() {
  const { e, aendern } = usePflege();
  const zeile = zeitenZeile({ zeiten: e.zeiten.map((z) => ({ ...z, fenster: z.geschlossen ? [] : z.fenster.filter((f) => f.von && f.bis) })) } as Pick<Pflege, "zeiten">);
  return (
    <>
      {e.zeiten.map((t, i) => (
        <Gruppe key={t.tage} titel={t.tage} fuss={i === e.zeiten.length - 1 ? <>So steht es auf der Website: <b>{zeile || "geschlossen"}</b></> : undefined}>
          <Schalter name="Geöffnet" an={!t.geschlossen} setze={(an) => aendern((d) => { d.zeiten[i]!.geschlossen = !an; })} />
          {t.geschlossen ? null : ([0, 1] as const).map((n) => (
            <div className="zeile zeile--zeit" key={n}>
              <span className="zeile__name">{n === 0 ? "Erste Zeit" : "Zweite Zeit"}{n === 1 ? <small>Leer lassen, wenn durchgehend offen</small> : null}</span>
              <span className="vonbis">
                <input type="time" aria-label={`${t.tage}, ${n + 1}. Zeit von`} value={alsUhr(t.fenster[n].von)} onChange={(x) => aendern((d) => { d.zeiten[i]!.fenster[n].von = alsPunkt(x.target.value); })} />
                <span aria-hidden="true">bis</span>
                <input type="time" aria-label={`${t.tage}, ${n + 1}. Zeit bis`} value={alsUhr(t.fenster[n].bis)} onChange={(x) => aendern((d) => { d.zeiten[i]!.fenster[n].bis = alsPunkt(x.target.value); })} />
              </span>
            </div>
          ))}
        </Gruppe>
      ))}
    </>
  );
}

/** Anzahl Tage von «von» bis und mit «bis» (beide JJJJ-MM-TT). */
const tageZahl = (von: string, bis: string) => Math.round((Date.parse(bis) - Date.parse(von)) / 864e5) + 1;
type Ausnahme = Entwurf["ausnahmen"][number];
export function Ausnahmen() {
  const { e, aendern, heute, nimmAuftrag, zurueckgenommen } = usePflege();
  const [offen, setOffen] = useState<number | null>(null);
  // Der Hinweis, der zum offenen Eintrag gehört (Regeln in lib/alltag.ts). Das Blatt hält die Verbindung, solange es offen ist.
  const [bindung, setBindung] = useState<FerienBindung | null>(null);
  // Eben angelegt: Wer das Blatt schliesst, ohne etwas einzutragen, lässt keinen leeren Eintrag zurück.
  const frisch = useRef<{ i: number; bild: string } | null>(null);
  const a = offen === null ? undefined : e.ausnahmen[offen];
  const oeffne = (i: number, x: Ausnahme | undefined, neu = false) => { frisch.current = neu && x ? { i, bild: JSON.stringify(x) } : null; setBindung(ferienBindung(e.hinweise, x)); setOffen(i); };
  // Von der Übersicht («Heute geschlossen», «Ferien eintragen»): gleich das Blatt dieses Eintrags zeigen.
  useEffect(() => { const auf = nimmAuftrag("ausnahmen"); if (auf) oeffne(auf.index, e.ausnahmen[auf.index], true); }, []);
  // «Rückgängig» im offenen Blatt (nach «Hinweis dazu entfernt»): Der Hinweis ist wieder im Entwurf, das Blatt nimmt die Verbindung wieder auf.
  useEffect(() => { if (zurueckgenommen && offen !== null) setBindung(ferienBindung(e.hinweise, e.ausnahmen[offen])); }, [zurueckgenommen]);
  const setze = (fn: (x: Ausnahme) => void) => { const i = offen; if (i !== null) aendern((d) => ausnahmeAendern(d, i, fn, heute, bindung)); };
  const schliesse = () => {
    const i = offen, f = frisch.current;
    frisch.current = null; setOffen(null); setBindung(null);
    if (i === null || !a) return;
    if (f && f.i === i && !a.datum && JSON.stringify(a) === f.bild) aendern((d) => { d.ausnahmen.splice(i, 1); });
    else if (bindung && ferienHinweisIndex(e.hinweise, a) < 0) aendern((d) => ausnahmeSchliessen(d, i, bindung), "Hinweis dazu entfernt");
  };
  const entferne = (i: number, x: Ausnahme, nr = ferienHinweisIndex(e.hinweise, x)) => aendern((d) => ausnahmeEntfernen(d, i, nr), `${x.name || "Eintrag"} entfernt${e.hinweise[nr] ? ", auch der Hinweis dazu" : ""}`);
  const h = bindung ? e.hinweise[bindung.nr] : undefined;
  const grund = a && !h ? ferienHinweisGrund(e, a, heute) : "";
  const schalte = (an: boolean) => {
    const i = offen, neu = { b: null as FerienBindung | null };
    if (i === null) return;
    aendern((d) => { neu.b = ferienHinweisSchalten(d, i, an, heute, bindung); }, an ? undefined : "Hinweis dazu entfernt");
    setBindung(neu.b);
  };
  const wann = (x: Entwurf["ausnahmen"][number]) => (!x.datum ? "Datum fehlt" : x.bisDatum && x.bisDatum !== x.datum ? `${tagText(x.datum, true)} bis ${tagText(x.bisDatum, true)}` : tagText(x.datum, true));
  const mehrere = !!a && !!a.datum && !!a.bisDatum && a.bisDatum > a.datum;
  return (
    <>
      <p className="einleitung">Ein einzelner Feiertag oder Ferien von einem Tag bis zu einem anderen. Die Website zeigt kommende Einträge bei den Öffnungszeiten und rechnet sie bei «Jetzt geöffnet» mit.</p>
      <Gruppe>
        {e.ausnahmen.map((x, i) => (
          <Eintrag key={i} titel={x.name || "Neuer Eintrag"} unter={`${wann(x)} · ${x.geschlossen ? "geschlossen" : `${x.von || "?"} bis ${x.bis || "?"} Uhr`}`} auf={() => oeffne(i, x)} weg={() => entferne(i, x)} />
        ))}
        {e.ausnahmen.length < AUSNAHMEN_MAX ? <Tat symbol="plus" tu={() => { const neu: Ausnahme = { name: "", datum: "", bisDatum: "", geschlossen: true, von: "", bis: "" }; aendern((d) => { d.ausnahmen.push(neu); }); oeffne(e.ausnahmen.length, neu, true); }}>Feiertag oder Ferien hinzufügen</Tat> : null}
      </Gruppe>
      {a && offen !== null ? (
        <Blatt titel={a.name || "Neuer Eintrag"} zu={schliesse}>
          <Gruppe>
            <Feld name="Anlass" wert={a.name} setze={(w) => setze((x) => { x.name = w; })} max={60} platz="z. B. Betriebsferien" />
          </Gruppe>
          <Gruppe titel="Wann" fuss={mehrere ? `${tageZahl(a.datum, a.bisDatum)} Tage am Stück, höchstens ${AUSNAHME_TAGE_MAX}.` : "Nur ein Tag? Dann «Bis» leer lassen."}>
            <Feld name="Von" art="date" wert={a.datum} setze={(w) => setze((x) => { x.datum = w; })} />
            <Feld name="Bis" art="date" wert={a.bisDatum} min={a.datum || undefined} setze={(w) => setze((x) => { x.bisDatum = w; })} />
          </Gruppe>
          <Gruppe>
            <Schalter name={mehrere ? "Ganz geschlossen" : "Ganzer Tag geschlossen"} an={a.geschlossen} setze={(an) => setze((x) => { x.geschlossen = an; })} />
            {a.geschlossen ? null : (
              <div className="zeile zeile--zeit">
                <span className="zeile__name">Offen{mehrere ? <small>an jedem dieser Tage</small> : null}</span>
                <span className="vonbis">
                  <input type="time" aria-label="Offen von" value={alsUhr(a.von)} onChange={(x) => setze((y) => { y.von = alsPunkt(x.target.value); })} />
                  <span aria-hidden="true">bis</span>
                  <input type="time" aria-label="Offen bis" value={alsUhr(a.bis)} onChange={(x) => setze((y) => { y.bis = alsPunkt(x.target.value); })} />
                </span>
              </div>
            )}
          </Gruppe>
          <Gruppe fuss={h
            ? h.bis < heute ? "Dieser Hinweis ist abgelaufen. Die Website zeigt ihn nicht mehr."
              : ferienHinweisIndex(e.hinweise, a) < 0 ? "Das Datum fehlt oder ist vorbei. Bleibt es so, fällt der Hinweis weg, wenn Sie dieses Blatt schliessen."
              : <>Die Website zeigt bis zum {tagText(h.bis)} diesen Hinweis: <b>{h.text || "noch ohne Text"}</b> Ändern können Sie ihn im Bereich «Hinweise».</>
            : grund ? undefined : "Die Website zeigt dann ab heute bis zum letzten Tag oben eine Leiste mit Anlass und Datum."}>
            <Schalter name="Auch als Hinweis auf der Website zeigen" an={!!h} aus={!h && !!grund} hinweis={grund || undefined} setze={schalte} />
          </Gruppe>
          <Gruppe><Tat rot tu={() => { const i = offen, nr = bindung?.nr ?? -1; frisch.current = null; setOffen(null); setBindung(null); entferne(i, a, nr); }}>Eintrag entfernen</Tat></Gruppe>
        </Blatt>
      ) : null}
    </>
  );
}

// ---------- Inhalte
function Portraet({ p, gross }: { p: EntwurfPerson; gross?: boolean }) {
  const { zeige } = usePflege();
  const n = gross ? 96 : 44;
  if (p.foto) return <img className={gross ? "portraet portraet--gross" : "portraet"} src={zeige(p.foto)} width={n} height={n} alt={gross ? `Foto ${p.name}` : ""} />;
  const zeichen = p.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
  return <span className={gross ? "portraet portraet--gross portraet--leer" : "portraet portraet--leer"} aria-hidden="true">{zeichen || "?"}</span>;
}

/** Verschiebt eine Person um einen Platz; am Rand der Gruppe wandert sie in die Nachbargruppe. */
function schiebePerson(d: Entwurf, g: number, p: number, r: -1 | 1): void {
  const l = d.team[g]!.leute, z = p + r;
  if (z >= 0 && z < l.length) { [l[p], l[z]] = [l[z]!, l[p]!]; return; }
  const nachbar = d.team[g + r];
  if (!nachbar) return;
  const [x] = l.splice(p, 1);
  if (r < 0) nachbar.leute.push(x!); else nachbar.leute.unshift(x!);
}

export function Team() {
  const { e, aendern, nimmAuftrag } = usePflege();
  const [offen, setOffen] = useState<{ g: number; p: number } | null>(null);
  // Eben angelegt: Wer das Blatt schliesst, ohne etwas einzutragen, lässt keine leere Zeile zurück.
  const frisch = useRef<{ g: number; p: number } | null>(null);
  const oeffne = (g: number, p: number, neu = false) => { frisch.current = neu ? { g, p } : null; setOffen({ g, p }); };
  // Von der Übersicht («Neue Person im Team»): gleich das Blatt der neuen Person zeigen.
  useEffect(() => { const auf = nimmAuftrag("team"); if (auf) oeffne(auf.g, auf.p, true); }, []);
  const person = offen ? e.team[offen.g]?.leute[offen.p] : undefined;
  const schliesse = () => {
    const o = offen, f = frisch.current;
    frisch.current = null; setOffen(null);
    if (o && f && f.g === o.g && f.p === o.p && person && !person.name.trim() && !person.rolle.trim() && !person.email.trim() && !person.foto) aendern((d) => { d.team[o.g]?.leute.splice(o.p, 1); });
  };
  const setze = (fn: (x: EntwurfPerson) => void) => aendern((d) => { const x = offen ? d.team[offen.g]?.leute[offen.p] : undefined; if (x) fn(x); });
  const entferne = (g: number, p: number, name: string) => aendern((d) => { d.team[g]!.leute.splice(p, 1); }, `${name || "Person"} entfernt`);
  return (
    <>
      <p className="einleitung">Tippen Sie eine Person an, um sie zu ändern. Mit «Bearbeiten» oben rechts ändern Sie die Reihenfolge oder entfernen jemanden.</p>
      {e.team.map((g, gi) => (
        <Gruppe key={g.name} titel={g.name}>
          {g.leute.map((p, pi) => (
            <Eintrag key={pi} bild={<Portraet p={p} />} titel={p.name} unter={p.rolle} marke={p.einverstaendnis ? undefined : "nicht sichtbar"} auf={() => oeffne(gi, pi)}
              weg={() => entferne(gi, pi, p.name)}
              hoch={gi === 0 && pi === 0 ? undefined : () => aendern((d) => schiebePerson(d, gi, pi, -1))}
              runter={gi === e.team.length - 1 && pi === g.leute.length - 1 ? undefined : () => aendern((d) => schiebePerson(d, gi, pi, 1))} />
          ))}
          {g.leute.length < 30 ? <Tat symbol="plus" tu={() => { aendern((d) => { d.team[gi]!.leute.push({ name: "", rolle: "", email: "", einverstaendnis: false }); }); oeffne(gi, g.leute.length, true); }}>Person hinzufügen</Tat> : null}
        </Gruppe>
      ))}
      {person && offen ? (
        <Blatt titel={person.name || "Neue Person"} zu={schliesse}>
          <div className="portraetwahl">
            <Portraet p={person} gross />
            <span className="portraetwahl__knoepfe">
              <BildKnopf text={person.foto ? "Foto ändern" : "Foto hinzufügen"} art="portraet" gewaehlt={(r) => setze((x) => { x.foto = r.wert; })} />
              {person.foto ? <button type="button" className="knopf knopf--leise knopf--klein" onClick={() => setze((x) => { delete x.foto; })}>Foto entfernen</button> : null}
            </span>
          </div>
          <Gruppe>
            <Feld name="Name" eigenname wert={person.name} setze={(w) => setze((x) => { x.name = w; })} max={80} platz="Vorname Name" />
            <Feld name="Aufgabe" wert={person.rolle} setze={(w) => setze((x) => { x.rolle = w; })} max={80} platz="z. B. Carrosserie-Spengler" />
            <Feld name="Mail" art="email" wert={person.email} setze={(w) => setze((x) => { x.email = w; })} max={120} platz="freiwillig" />
          </Gruppe>
          <Gruppe fuss="Nur einschalten, wenn die Person einverstanden ist.">
            <Schalter name="Auf der Website zeigen" an={person.einverstaendnis} setze={(an) => setze((x) => { x.einverstaendnis = an; })} />
          </Gruppe>
          <Gruppe>
            <Auswahl name="Gruppe" wert={String(offen.g)} wahl={e.team.map((g, i) => ({ wert: String(i), text: g.name }))} setze={(w) => {
              const ziel = Number(w), von = offen;
              if (ziel === von.g || !e.team[ziel]) return;
              aendern((d) => { const [x] = d.team[von.g]!.leute.splice(von.p, 1); d.team[ziel]!.leute.push(x!); });
              if (frisch.current) frisch.current = { g: ziel, p: e.team[ziel]!.leute.length };
              setOffen({ g: ziel, p: e.team[ziel]!.leute.length });
            }} />
          </Gruppe>
          <Gruppe><Tat rot tu={() => { const { g, p } = offen; frisch.current = null; setOffen(null); entferne(g, p, person.name); }}>Person entfernen</Tat></Gruppe>
        </Blatt>
      ) : null}
    </>
  );
}

const PLATZ_NAME: Record<(typeof FAQ_PLATZHALTER)[number], string> = { "{zeiten}": "Öffnungszeiten", "{adresse}": "Adresse", "{telefon}": "Telefon" };

export function Fragen() {
  const { e, aendern } = usePflege();
  const [offen, setOffen] = useState<number | null>(null);
  const f = offen === null ? undefined : e.faq?.[offen];
  const setze = (fn: (x: { frage: string; antwort: string }) => void) => aendern((d) => { const x = d.faq?.[offen!]; if (x) fn(x); });
  const liste = e.faq ?? [];
  const tausche = (i: number, r: -1 | 1) => aendern((d) => { const l = d.faq!; [l[i], l[i + r]] = [l[i + r]!, l[i]!]; });
  return (
    <>
      <p className="einleitung">Diese Fragen stehen auf der Startseite. Kurze, ehrliche Antworten helfen Kundinnen und Kunden am meisten.</p>
      {e.faq ? null : <p className="notiz">Die Website zeigt im Moment ihre Standardfragen. Sobald Sie hier eine Frage eintragen, gilt Ihre Liste.</p>}
      <Gruppe>
        {liste.map((x, i) => (
          <Eintrag key={i} titel={x.frage || "Neue Frage"} unter={x.antwort} auf={() => setOffen(i)} weg={() => aendern((d) => { d.faq!.splice(i, 1); }, "Frage entfernt")}
            hoch={i > 0 ? () => tausche(i, -1) : undefined} runter={i < liste.length - 1 ? () => tausche(i, 1) : undefined} />
        ))}
        {liste.length < 14 ? <Tat symbol="plus" tu={() => { aendern((d) => { (d.faq ??= []).push({ frage: "", antwort: "" }); }); setOffen(liste.length); }}>Frage hinzufügen</Tat> : null}
      </Gruppe>
      {f && offen !== null ? (
        <Blatt titel="Frage" zu={() => setOffen(null)}>
          <Gruppe>
            <Langtext name="Frage" wert={f.frage} setze={(w) => setze((x) => { x.frage = w; })} max={140} zeilen={2} />
            <Langtext name="Antwort" wert={f.antwort} setze={(w) => setze((x) => { x.antwort = w; })} max={700} zeilen={6} />
          </Gruppe>
          <Gruppe titel="Immer aktuell einsetzen" fuss="An dieser Stelle setzt die Website die aktuellen Angaben ein. Ändern sich die Öffnungszeiten, stimmt die Antwort weiterhin.">
            <div className="zeile zeile--chips">
              {FAQ_PLATZHALTER.map((p) => <button type="button" key={p} className="chip" onClick={() => setze((x) => { x.antwort = `${x.antwort}${x.antwort && !x.antwort.endsWith(" ") ? " " : ""}${p}`; })}><Symbol name="plus" klein />{PLATZ_NAME[p]}</button>)}
            </div>
          </Gruppe>
          <Gruppe><Tat rot tu={() => { const i = offen; setOffen(null); aendern((d) => { d.faq!.splice(i, 1); }, "Frage entfernt"); }}>Frage entfernen</Tat></Gruppe>
        </Blatt>
      ) : null}
    </>
  );
}

export function Fotos() {
  const { e, aendern, zeige } = usePflege();
  const gruppen = [...new Set(BILD_PLAETZE.map((p) => p.gruppe))];
  return (
    <>
      <p className="einleitung">Hier ersetzen Sie Fotos der Website durch eigene. Querformat passt am besten. Das Cockpit verkleinert das Foto selbst.</p>
      {gruppen.map((gruppe) => (
        <section className="gruppe" key={gruppe}>
          <h2 className="gruppe__titel">{gruppe}</h2>
          {BILD_PLAETZE.filter((p) => p.gruppe === gruppe).map((p) => {
            const b = e.bilder[p.name];
            return (
              <div className="gruppe__karte fotokarte" key={p.name}>
                <div className="zeile zeile--foto">
                  <img className="fotokarte__bild" src={b ? zeige(b.foto) : p.vorgabe} width={120} height={90} alt={b?.alt || `Heutiges Foto: ${p.titel}`} />
                  <span className="eintrag__text"><span className="eintrag__titel">{p.titel}</span><span className="eintrag__unter">{b ? "Ihr eigenes Foto" : "Foto der Website"}</span></span>
                  <BildKnopf text="Ersetzen" art="foto" leise gewaehlt={(r) => aendern((d) => { d.bilder[p.name] = { foto: r.wert, alt: d.bilder[p.name]?.alt ?? "", b: r.b, h: r.h }; })} />
                </div>
                {b ? (
                  <>
                    <Langtext name="Was ist auf dem Foto zu sehen?" wert={b.alt} setze={(w) => aendern((d) => { const x = d.bilder[p.name]; if (x) x.alt = w; })} max={160} zeilen={2} platz="z. B. Lackierer poliert die Motorhaube eines blauen Autos" />
                    <Tat tu={() => aendern((d) => { delete d.bilder[p.name]; }, `${p.titel}: wieder das Foto der Website`)}>Wieder das Foto der Website zeigen</Tat>
                  </>
                ) : null}
              </div>
            );
          })}
        </section>
      ))}
      <p className="gruppe__fuss">Die Beschreibung hören Menschen, die das Foto nicht sehen können, und Suchmaschinen lesen sie. Ein Foto einer Leistung gilt für die Karte auf der Startseite und für die Seite der Leistung.</p>
    </>
  );
}

export function Partner() {
  const { e, aendern, zeige } = usePflege();
  const [offen, setOffen] = useState<number | null>(null);
  const liste = e.partner ?? [];
  const x = offen === null ? undefined : liste[offen];
  const setze = (fn: (p: NonNullable<Entwurf["partner"]>[number]) => void) => aendern((d) => { const p = d.partner?.[offen!]; if (p) fn(p); });
  const tausche = (i: number, r: -1 | 1) => aendern((d) => { const l = d.partner!; [l[i], l[i + r]] = [l[i + r]!, l[i]!]; });
  const logo = (p: { name: string; logo?: string }, gross?: boolean) => (p.logo ? <img className={gross ? "logo logo--gross" : "logo"} src={zeige(p.logo)} alt={gross ? `Logo ${p.name}` : ""} width={gross ? 200 : 64} height={gross ? 100 : 40} /> : <span className={gross ? "logo logo--gross logo--leer" : "logo logo--leer"} aria-hidden="true">Aa</span>);
  return (
    <>
      <p className="einleitung">Diese Partner laufen auf der Startseite im Band durch. Ohne Logo erscheint der Name als Schrift.</p>
      {e.partner ? null : <p className="notiz">Die Website zeigt im Moment ihre Standard-Partner. Sobald Sie hier einen Partner eintragen, gilt nur noch Ihre Liste.</p>}
      <Gruppe>
        {liste.map((p, i) => (
          <Eintrag key={i} bild={logo(p)} titel={p.name || "Neuer Partner"} unter={p.logo ? undefined : "ohne Logo"} auf={() => setOffen(i)} weg={() => aendern((d) => { d.partner!.splice(i, 1); }, `${p.name || "Partner"} entfernt`)}
            hoch={i > 0 ? () => tausche(i, -1) : undefined} runter={i < liste.length - 1 ? () => tausche(i, 1) : undefined} />
        ))}
        {liste.length < 12 ? <Tat symbol="plus" tu={() => { aendern((d) => { (d.partner ??= []).push({ name: "" }); }); setOffen(liste.length); }}>Partner hinzufügen</Tat> : null}
      </Gruppe>
      {x && offen !== null ? (
        <Blatt titel={x.name || "Neuer Partner"} zu={() => setOffen(null)}>
          <div className="portraetwahl">
            {logo(x, true)}
            <span className="portraetwahl__knoepfe">
              <BildKnopf text={x.logo ? "Logo ändern" : "Logo hinzufügen"} art="logo" gewaehlt={(r) => setze((p) => { p.logo = r.wert; p.b = r.b; p.h = r.h; })} />
              {x.logo ? <button type="button" className="knopf knopf--leise knopf--klein" onClick={() => setze((p) => { delete p.logo; delete p.b; delete p.h; })}>Logo entfernen</button> : null}
            </span>
          </div>
          <Gruppe fuss="Am besten ein PNG mit durchsichtigem Hintergrund. Bitte nur Logos von Partnern, die damit einverstanden sind.">
            <Feld name="Name" eigenname wert={x.name} setze={(w) => setze((p) => { p.name = w; })} max={40} platz="z. B. AMAG" />
          </Gruppe>
          <Gruppe><Tat rot tu={() => { const i = offen; setOffen(null); aendern((d) => { d.partner!.splice(i, 1); }, `${x.name || "Partner"} entfernt`); }}>Partner entfernen</Tat></Gruppe>
        </Blatt>
      ) : null}
    </>
  );
}

export function Inhaber() {
  const { e, aendern } = usePflege();
  return (
    <>
      <Gruppe titel="Satz vom Inhaber" fuss="Ein persönlicher Satz auf der Startseite. Er erscheint erst, wenn der Schalter an ist.">
        <Langtext name="Satz" wert={e.stimme.text} setze={(w) => aendern((d) => { d.stimme.text = w; })} max={240} />
        <Feld name="Name" eigenname wert={e.stimme.name} setze={(w) => aendern((d) => { d.stimme.name = w; })} max={60} />
        <Feld name="Rolle" wert={e.stimme.rolle} setze={(w) => aendern((d) => { d.stimme.rolle = w; })} max={40} platz="z. B. Geschäftsführer" />
        <Schalter name="Auf der Website zeigen" an={e.stimme.freigegeben} setze={(an) => aendern((d) => { d.stimme.freigegeben = an; })} />
      </Gruppe>
      <Gruppe titel="Google-Bewertungen" fuss="Zeigt den Abschnitt mit den Bewertungen von Google auf der Startseite.">
        <Schalter name="Bewertungen zeigen" an={e.bewertungen.zeigen} setze={(an) => aendern((d) => { d.bewertungen.zeigen = an; })} />
      </Gruppe>
    </>
  );
}

// ---------- Betrieb
export function Kontakt() {
  const { e, aendern } = usePflege();
  const pruef = (w: string) => (!w.trim() || telefonCH(w) ? undefined : "Bitte wie 071 755 88 61 schreiben.");
  return (
    <>
      <Gruppe titel="So erreicht man Sie" fuss="Diese Angaben stehen überall auf der Website: oben, im Fuss, auf der Kontaktseite und bei Google.">
        <Feld name="Telefon" art="tel" auto="tel" wert={e.kontakt.telefon} setze={(w) => aendern((d) => { d.kontakt.telefon = w; })} max={20} platz="071 755 88 61" hinweis={pruef(e.kontakt.telefon)} />
        <Feld name="Mail" art="email" auto="email" wert={e.kontakt.mail} setze={(w) => aendern((d) => { d.kontakt.mail = w; })} max={120} platz="info@autospeedy.ch" />
      </Gruppe>
      <Gruppe titel="WhatsApp" fuss="Erst wenn hier eine Nummer steht, zeigt die Website den WhatsApp-Knopf. Leer lassen heisst: kein WhatsApp.">
        <Feld name="Nummer" art="tel" auto="tel" wert={e.kontakt.whatsapp} setze={(w) => aendern((d) => { d.kontakt.whatsapp = w; })} max={20} platz="keine Nummer" hinweis={pruef(e.kontakt.whatsapp)} />
      </Gruppe>
      <p className="gruppe__fuss">Wohin die Formulare der Website geschickt werden, ändert das Studio. Diese Mail-Adresse hier ist die, die Besucher sehen.</p>
    </>
  );
}

const SEITEN_NAME: Record<string, string> = { "/": "Startseite", "/schaden-melden/": "Schaden melden", "/kontakt/": "Kontakt", "/tesla/": "Tesla", "/team/": "Team", "/occasionen/": "Occasionen", "/leistungen/": "Leistungen" };
function seitenName(pfad: string): string {
  const m = /^\/leistungen\/([a-z-]+)\/$/.exec(pfad);
  return SEITEN_NAME[pfad] ?? (m ? `Leistung: ${m[1]![0]!.toUpperCase()}${m[1]!.slice(1)}` : pfad);
}

export function Besucher({ zahlen }: { zahlen: BesucherZahlen | null }) {
  const [aktiv, setAktiv] = useState<number | null>(null);
  if (!zahlen) return <p className="notiz">Die Zählung ist noch nicht mit dem Cockpit verbunden. Das richtet das Studio ein. Ihre Website läuft ganz normal.</p>;
  const { tage, seiten } = zahlen;
  const summe = tage.reduce((n, t) => n + t.besuche, 0);
  const woche = tage.slice(-7).reduce((n, t) => n + t.besuche, 0), davor = tage.slice(-14, -7).reduce((n, t) => n + t.besuche, 0);
  const max = Math.max(1, ...tage.map((t) => t.besuche));
  const B = 10, H = 96, BREIT = tage.length * B;
  const wahl = aktiv === null ? null : tage[aktiv];
  const taste = (x: React.KeyboardEvent) => {
    if (x.key !== "ArrowLeft" && x.key !== "ArrowRight") return;
    x.preventDefault();
    setAktiv((a) => Math.max(0, Math.min(tage.length - 1, (a ?? tage.length - 1) + (x.key === "ArrowLeft" ? -1 : 1))));
  };
  return (
    <>
      {zahlen.beispiel ? <p className="notiz">Demo: Das sind Beispielzahlen. Im Betrieb stehen hier die echten Zahlen Ihrer Website.</p> : null}
      <Gruppe titel="Letzte 28 Tage" fuss="Ein Besuch ist eine Person, die von aussen auf Ihre Website kommt. Gezählt wird ohne Cookies und ohne Angaben zu einzelnen Personen.">
        <div className="zahl">
          <p className="zahl__gross">{summe.toLocaleString("de-CH")}</p>
          <p className="zahl__name">Besuche in 28 Tagen</p>
          <p className="zahl__neben">Letzte 7 Tage: <b>{woche.toLocaleString("de-CH")}</b> · die 7 Tage davor: <b>{davor.toLocaleString("de-CH")}</b></p>
        </div>
        <div className="saeulen" tabIndex={0} role="group" aria-label="Besuche pro Tag. Mit den Pfeiltasten durch die Tage gehen." onKeyDown={taste} onMouseLeave={() => setAktiv(null)} onBlur={() => setAktiv(null)}>
          <p className="saeulen__wahl" aria-live="polite">{wahl ? <><b>{wahl.besuche.toLocaleString("de-CH")}</b> {wahl.besuche === 1 ? "Besuch" : "Besuche"} am {tagText(wahl.datum, true)}</> : <>Besuche pro Tag · höchster Tag: <b>{max.toLocaleString("de-CH")}</b></>}</p>
          <svg viewBox={`0 0 ${BREIT} ${H}`} role="img" aria-label={`Säulen: Besuche pro Tag vom ${tagText(tage[0]!.datum)} bis ${tagText(tage.at(-1)!.datum)}`}>
            <path className="saeulen__linie" d={`M0 ${H - 0.5}H${BREIT}`} />
            {tage.map((t, i) => {
              const h = t.besuche ? Math.max(3, (t.besuche / max) * (H - 8)) : 0, x = i * B + 1, y = H - 1 - h, r = Math.min(2, h / 2);
              return (
                <g key={t.datum} onMouseEnter={() => setAktiv(i)} onClick={() => setAktiv(i)}>
                  <rect className="saeulen__treffer" x={i * B} y={0} width={B} height={H} />
                  {h ? <path className={aktiv === i ? "saeulen__s saeulen__s--aktiv" : "saeulen__s"} d={`M${x} ${H - 1}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + 8 - r}Q${x + 8} ${y} ${x + 8} ${y + r}V${H - 1}Z`} /> : null}
                </g>
              );
            })}
          </svg>
          <p className="saeulen__achse" aria-hidden="true"><span>{tagText(tage[0]!.datum)}</span><span>heute</span></p>
        </div>
        <details className="tabelle">
          <summary>Als Tabelle zeigen</summary>
          <table><thead><tr><th scope="col">Tag</th><th scope="col">Besuche</th></tr></thead><tbody>{[...tage].reverse().map((t) => <tr key={t.datum}><td>{tagText(t.datum, true)}</td><td>{t.besuche.toLocaleString("de-CH")}</td></tr>)}</tbody></table>
        </details>
      </Gruppe>
      <Gruppe titel="Meistbesuchte Seiten">
        {seiten.length ? seiten.map((s) => <Wert key={s.pfad} name={seitenName(s.pfad)}>{s.besuche.toLocaleString("de-CH")}</Wert>) : <p className="zeile zeile--leer">Noch keine Besuche gezählt.</p>}
      </Gruppe>
    </>
  );
}

export function Verlauf({ verlauf, lade, laeuft }: { verlauf: VerlaufEintrag[]; lade: (v: VerlaufEintrag) => void; laeuft: boolean }) {
  if (!verlauf.length) return <p className="notiz">Der Verlauf ist gerade nicht erreichbar. Bitte später nochmals versuchen.</p>;
  const [jetzt, ...frueher] = verlauf;
  return (
    <>
      <p className="einleitung">Hier sehen Sie, wann die Website zuletzt geändert wurde. Sie können einen früheren Stand laden, ansehen und wieder veröffentlichen.</p>
      {frueher[0] ? (
        <Gruppe fuss="Lädt den Stand vor der letzten Änderung. Sie sehen zuerst, was sich ändert, und veröffentlichen erst danach.">
          <Tat symbol="verlauf" tu={() => lade(frueher[0]!)} aus={laeuft}>Letzte Änderung zurücknehmen</Tat>
        </Gruppe>
      ) : null}
      <Gruppe titel="Veröffentlichte Stände">
        <div className="zeile zeile--wert zeile--stand"><span className="zeile__name">{zeitText(jetzt!.zeit)}</span><span className="marke marke--gruen">auf der Website</span></div>
        {frueher.map((v) => (
          <div className="zeile zeile--wert zeile--stand" key={v.id}>
            <span className="zeile__name">{zeitText(v.zeit)}</span>
            <button type="button" className="knopf knopf--leise knopf--klein" onClick={() => lade(v)} disabled={laeuft}>Laden</button>
          </div>
        ))}
      </Gruppe>
      {frueher.length ? null : <p className="gruppe__fuss">Noch keine früheren Stände. Nach Ihrer ersten Änderung erscheint hier der Stand davor.</p>}
    </>
  );
}
