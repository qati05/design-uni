"use client";

import { useActionState } from "react";
import { erledigtMelden, type ErledigtZustand } from "./aktionen";

export function ErledigtFormular({ token, mitMail }: { token: string; mitMail: boolean }) {
  const [z, aktion, laeuft] = useActionState(erledigtMelden, {} as ErledigtZustand);
  if (z.ok) return <p className="ok-text" role="status">Erledigt gemeldet. {mitMail ? "Der Kunde bekommt in 24 Stunden einmal die Bitte um eine Bewertung." : "Der Kunde hat keine Mail angegeben: Bewertung im Cockpit per WhatsApp erbitten."}</p>;
  return (
    <form action={aktion} className="formular">
      <input type="hidden" name="token" value={token} />
      <p>{mitMail ? "Nach dem Bestätigen bekommt der Kunde 24 Stunden später einmal die Bitte um eine Bewertung." : "Der Kunde hat keine Mail angegeben."}</p>
      {z.meldung ? <p className="meldung-text" role="alert">{z.meldung}</p> : null}
      <button type="submit" className="knopf gross" disabled={laeuft}>{laeuft ? "Wird gemeldet …" : "Ja, Auftrag ist erledigt"}</button>
    </form>
  );
}
