"use client";

import { useActionState } from "react";
import { anmelden, type LoginZustand } from "./aktionen";

const START: LoginZustand = { schritt: "mail" };

export function LoginFormular() {
  const [zustand, aktion, laeuft] = useActionState(anmelden, START);
  if (zustand.schritt === "mail") {
    return (
      <form action={aktion} className="karte formular" noValidate>
        <input type="hidden" name="schritt" value="mail" />
        <label htmlFor="email">Mail-Adresse</label>
        <input id="email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" required />
        {zustand.meldung ? <p className="meldung-text" role="alert">{zustand.meldung}</p> : null}
        <button type="submit" className="knopf" disabled={laeuft}>{laeuft ? "Wird gesendet …" : "Code senden"}</button>
      </form>
    );
  }
  return (
    <form action={aktion} className="karte formular" noValidate>
      <input type="hidden" name="schritt" value="code" />
      {zustand.hinweis ? <p className="hinweis">{zustand.hinweis}</p> : null}
      <label htmlFor="code">6-stelliger Code aus der Mail</label>
      <input id="code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required className="code" />
      {zustand.meldung ? <p className="meldung-text" role="alert">{zustand.meldung}</p> : null}
      <button type="submit" className="knopf" disabled={laeuft}>{laeuft ? "Wird geprüft …" : "Weiter"}</button>
    </form>
  );
}
