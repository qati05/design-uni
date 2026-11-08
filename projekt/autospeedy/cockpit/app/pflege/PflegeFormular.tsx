"use client";

import { useActionState, useState } from "react";
import { HINWEIS_ARTEN, HINWEIS_LINKS, HINWEIS_POPUP_ARTEN, type Pflege } from "@/lib/pflege";
import { pflegeSpeichern, type PflegeZustand } from "./aktionen";
import { FotoFeld } from "./FotoFeld";

const ZEIT = { inputMode: "decimal" as const, pattern: "([01]?[0-9]|2[0-3])\\.[0-5][0-9]", placeholder: "7.30", maxLength: 5, size: 5 };
const ART_NAME: Record<(typeof HINWEIS_ARTEN)[number], string> = { hagel: "Hagel", ferien: "Ferien", geschlossen: "Geschlossen", aktion: "Aktion", info: "Information" };

function HinweisZeile({ i, h, vorhanden, heute }: { i: number; h?: Pflege["hinweise"][number]; vorhanden: boolean; heute: string }) {
  const [art, setArt] = useState<string>(h?.art ?? "info");
  const popupErlaubt = (HINWEIS_POPUP_ARTEN as readonly string[]).includes(art);
  return (
    <div className="zeile-hinweis">
      <h3>Hinweis {i + 1}</h3>
      <div className="zeile-felder">
        <label>Art<select name={`hin.${i}.art`} value={art} onChange={(e) => setArt(e.target.value)}>{HINWEIS_ARTEN.map((a) => <option key={a} value={a}>{ART_NAME[a]}</option>)}</select></label>
        <label>Form<select name={`hin.${i}.form`} key={String(popupErlaubt)} defaultValue={popupErlaubt ? h?.form ?? "banner" : "banner"}><option value="banner">Leiste oben</option>{popupErlaubt ? <option value="popup">Pop-up</option> : null}</select></label>
        <label>Zeigen ab<input type="date" name={`hin.${i}.von`} defaultValue={h?.von ?? heute} /></label>
        <label>Zeigen bis<input type="date" name={`hin.${i}.bis`} defaultValue={h?.bis ?? ""} /></label>
      </div>
      <label>Titel (freiwillig, höchstens 50 Zeichen)<input name={`hin.${i}.titel`} defaultValue={h?.titel ?? ""} maxLength={50} /></label>
      <label>Text (höchstens 160 Zeichen)<input name={`hin.${i}.text`} defaultValue={h?.text ?? ""} maxLength={160} /></label>
      <label>Führt zu<select name={`hin.${i}.link`} defaultValue={h?.link ?? ""}><option value="">Kein Link</option>{HINWEIS_LINKS.map((l) => <option key={l.wert} value={l.wert}>{l.text}</option>)}</select></label>
      {vorhanden ? <label className="schalter"><input type="checkbox" name={`hin.${i}.weg`} /> Hinweis entfernen</label> : null}
    </div>
  );
}

export function PflegeFormular({ daten, sha, heute }: { daten: Pflege; sha: string; heute: string }) {
  const [z, aktion, laeuft] = useActionState(pflegeSpeichern, {} as PflegeZustand);
  const [neueAusnahmen, setNeueAusnahmen] = useState(1);
  const [neueHinweise, setNeueHinweise] = useState(0);
  const [neueLeute, setNeueLeute] = useState<number[]>(daten.team.map(() => 0));
  const aus = daten.ausnahmen.length;
  const hin = daten.hinweise.length;
  return (
    <form action={aktion} className="pflege" noValidate>
      <input type="hidden" name="sha" value={sha} />
      <fieldset className="karte">
        <legend>Hinweise auf der Website</legend>
        <p className="unterzeile">Zum Beispiel nach einem Hagelsturm oder vor den Ferien. Die Website zeigt sie nur im gewählten Zeitraum. Höchstens 3, davon 1 Pop-up.</p>
        {[...daten.hinweise, ...Array.from({ length: neueHinweise }, () => undefined)].map((h, i) => <HinweisZeile key={i} i={i} h={h} vorhanden={i < hin} heute={heute} />)}
        {hin + neueHinweise < 3 ? <button type="button" className="knopf leise" onClick={() => setNeueHinweise((n) => n + 1)}>Hinweis hinzufügen</button> : null}
      </fieldset>

      <fieldset className="karte">
        <legend>Öffnungszeiten</legend>
        {daten.zeiten.map((t, i) => (
          <div className="zeile-zeit" key={t.tage}>
            <span className="tage">{t.tage}</span>
            {[0, 1].map((n) => (
              <span className="fenster" key={n}>
                <input aria-label={`${t.tage}, ${n + 1}. Zeit von`} name={`zeit.${i}.von${n + 1}`} defaultValue={t.fenster[n]?.von ?? ""} {...ZEIT} />
                <span aria-hidden="true">bis</span>
                <input aria-label={`${t.tage}, ${n + 1}. Zeit bis`} name={`zeit.${i}.bis${n + 1}`} defaultValue={t.fenster[n]?.bis ?? ""} {...ZEIT} />
              </span>
            ))}
            <label className="schalter"><input type="checkbox" name={`zeit.${i}.zu`} defaultChecked={t.geschlossen} /> geschlossen</label>
          </div>
        ))}
      </fieldset>

      <fieldset className="karte">
        <legend>Feiertage und Ferien</legend>
        <p className="unterzeile">Gilt nur an diesem Tag. Die Website zeigt es in der Woche davor.</p>
        {[...daten.ausnahmen, ...Array.from({ length: neueAusnahmen }, () => null)].map((a, i) => (
          <div className="zeile-aus" key={i}>
            <input aria-label="Datum" type="date" name={`aus.${i}.datum`} defaultValue={a?.datum ?? ""} />
            <input aria-label="Anlass" name={`aus.${i}.name`} defaultValue={a?.name ?? ""} placeholder="z. B. Weihnachten" maxLength={60} />
            <select aria-label="Geschlossen oder andere Zeit" name={`aus.${i}.art`} defaultValue={a && !a.geschlossen ? "offen" : "zu"}>
              <option value="zu">geschlossen</option><option value="offen">andere Zeit</option>
            </select>
            <input aria-label="von" name={`aus.${i}.von`} defaultValue={a?.von ?? ""} {...ZEIT} />
            <input aria-label="bis" name={`aus.${i}.bis`} defaultValue={a?.bis ?? ""} {...ZEIT} />
            {i < aus ? <label className="schalter"><input type="checkbox" name={`aus.${i}.weg`} /> entfernen</label> : null}
          </div>
        ))}
        {aus + neueAusnahmen < 40 ? <button type="button" className="knopf leise" onClick={() => setNeueAusnahmen((n) => n + 1)}>Weiteren Tag hinzufügen</button> : null}
      </fieldset>

      <details className="karte team">
        <summary>Team auf der Website ({daten.team.reduce((n, g) => n + g.leute.length, 0)} Personen)</summary>
        <p className="unterzeile">Nur Personen mit Häkchen erscheinen auf der Website. Setzen Sie es nur mit deren Einverständnis.</p>
        {daten.team.map((g, gi) => (
          <div className="team-gruppe" key={g.name}>
            <h3>{g.name}</h3>
            {[...g.leute, ...Array.from({ length: neueLeute[gi] ?? 0 }, () => null)].map((p, pi) => (
              <div className="zeile-person" key={pi}>
                <FotoFeld name={`team.${gi}.p.${pi}`} foto={p?.foto} person={p?.name ?? "neue Person"} />
                <input aria-label={`${g.name}: Name`} name={`team.${gi}.p.${pi}.name`} defaultValue={p?.name ?? ""} placeholder="Vorname Name" maxLength={80} />
                <input aria-label={`${g.name}: Aufgabe`} name={`team.${gi}.p.${pi}.rolle`} defaultValue={p?.rolle ?? ""} placeholder="Aufgabe" maxLength={80} />
                <input aria-label={`${g.name}: Mail (freiwillig)`} type="email" name={`team.${gi}.p.${pi}.email`} defaultValue={p?.email ?? ""} placeholder="Mail (freiwillig)" maxLength={120} />
                <label className="schalter"><input type="checkbox" name={`team.${gi}.p.${pi}.einverstaendnis`} defaultChecked={p?.einverstaendnis ?? false} /> Auf der Website zeigen</label>
                {pi < g.leute.length ? <label className="schalter"><input type="checkbox" name={`team.${gi}.p.${pi}.weg`} /> Person entfernen</label> : null}
              </div>
            ))}
            <button type="button" className="knopf leise" onClick={() => setNeueLeute((l) => l.map((n, k) => (k === gi ? n + 1 : n)))}>Person hinzufügen</button>
          </div>
        ))}
      </details>

      <fieldset className="karte">
        <legend>Satz vom Inhaber</legend>
        <label>Satz (höchstens 240 Zeichen)<textarea name="stimme.text" defaultValue={daten.stimme?.text ?? ""} maxLength={240} rows={3} /></label>
        <label>Name<input name="stimme.name" defaultValue={daten.stimme?.name ?? ""} maxLength={60} /></label>
        <label>Rolle<input name="stimme.rolle" defaultValue={daten.stimme?.rolle ?? ""} maxLength={40} /></label>
        <label className="schalter"><input type="checkbox" name="stimme.freigegeben" defaultChecked={daten.stimme?.freigegeben ?? false} /> Auf der Website zeigen</label>
      </fieldset>

      <fieldset className="karte">
        <legend>Google-Bewertungen</legend>
        <label className="schalter"><input type="checkbox" name="bewertungen.zeigen" defaultChecked={daten.bewertungen.zeigen} /> Bewertungen auf der Website zeigen</label>
      </fieldset>

      <div className="speichern-leiste">
        {z.meldung ? <p className={z.ok ? "ok-text" : "meldung-text"} role={z.ok ? "status" : "alert"}>{z.meldung}</p> : null}
        <button type="submit" className="knopf" disabled={laeuft}>{laeuft ? "Wird gespeichert …" : "Speichern und veröffentlichen"}</button>
      </div>
    </form>
  );
}
