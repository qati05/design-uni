"use client";

import { useActionState, useState } from "react";
import { HINWEIS_LINKS, type Pflege } from "@/lib/pflege";
import { pflegeSpeichern, type PflegeZustand } from "./aktionen";
import { FotoFeld } from "./FotoFeld";

const ZEIT = { inputMode: "decimal" as const, pattern: "([01]?[0-9]|2[0-3])\\.[0-5][0-9]", placeholder: "7.30", maxLength: 5, size: 5 };

export function PflegeFormular({ daten }: { daten: Pflege }) {
  const [z, aktion, laeuft] = useActionState(pflegeSpeichern, {} as PflegeZustand);
  const [neueAusnahmen, setNeueAusnahmen] = useState(1);
  const [neueLeute, setNeueLeute] = useState<number[]>(daten.team.map(() => 0));
  const aus = daten.ausnahmen.length;
  return (
    <form action={aktion} className="pflege" noValidate>
      <fieldset className="karte">
        <legend>Hinweis oben auf der Website</legend>
        <p className="unterzeile">Zum Beispiel nach einem Hagelsturm. Aus = nichts zu sehen.</p>
        <label className="schalter"><input type="checkbox" name="hinweis.aktiv" defaultChecked={daten.hinweis.aktiv} /> Hinweis zeigen</label>
        <label htmlFor="h-text">Text (höchstens 120 Zeichen)</label>
        <input id="h-text" name="hinweis.text" defaultValue={daten.hinweis.text} maxLength={120} />
        <label htmlFor="h-link">Führt zu</label>
        <select id="h-link" name="hinweis.link" defaultValue={daten.hinweis.link}>{HINWEIS_LINKS.map((l) => <option key={l.wert} value={l.wert}>{l.text}</option>)}</select>
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
        <p className="unterzeile">Namen nur mit Einverständnis der Person.</p>
        {daten.team.map((g, gi) => (
          <div className="team-gruppe" key={g.name}>
            <h3>{g.name}</h3>
            {[...g.leute, ...Array.from({ length: neueLeute[gi] ?? 0 }, () => null)].map((p, pi) => (
              <div className="zeile-person" key={pi}>
                <FotoFeld name={`team.${gi}.p.${pi}`} foto={p?.foto} person={p?.name ?? "neue Person"} />
                <input aria-label={`${g.name}: Name`} name={`team.${gi}.p.${pi}.name`} defaultValue={p?.name ?? ""} placeholder="Vorname Name" maxLength={80} />
                <input aria-label={`${g.name}: Aufgabe`} name={`team.${gi}.p.${pi}.rolle`} defaultValue={p?.rolle ?? ""} placeholder="Aufgabe" maxLength={80} />
                <input aria-label={`${g.name}: Mail (freiwillig)`} type="email" name={`team.${gi}.p.${pi}.email`} defaultValue={p?.email ?? ""} placeholder="Mail (freiwillig)" maxLength={120} />
                {pi < g.leute.length ? <label className="schalter"><input type="checkbox" name={`team.${gi}.p.${pi}.weg`} /> Person entfernen</label> : null}
              </div>
            ))}
            <button type="button" className="knopf leise" onClick={() => setNeueLeute((l) => l.map((n, k) => (k === gi ? n + 1 : n)))}>Person hinzufügen</button>
          </div>
        ))}
      </details>

      <div className="speichern-leiste">
        {z.meldung ? <p className={z.ok ? "ok-text" : "meldung-text"} role={z.ok ? "status" : "alert"}>{z.meldung}</p> : null}
        <button type="submit" className="knopf" disabled={laeuft}>{laeuft ? "Wird gespeichert …" : "Speichern und veröffentlichen"}</button>
      </div>
    </form>
  );
}
