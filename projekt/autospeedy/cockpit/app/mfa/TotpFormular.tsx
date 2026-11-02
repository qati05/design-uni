"use client";

import { useActionState } from "react";
import { totpBestaetigen, type TotpZustand } from "./aktionen";

export function TotpFormular({ weiter }: { weiter: string }) {
  const [z, aktion, laeuft] = useActionState(totpBestaetigen, {} as TotpZustand);
  return (
    <form action={aktion} className="karte formular" noValidate>
      <input type="hidden" name="weiter" value={weiter} />
      <label htmlFor="totp">Code aus der Authenticator-App</label>
      <input id="totp" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required className="code" />
      {z.meldung ? <p className="meldung-text" role="alert">{z.meldung}</p> : null}
      <button type="submit" className="knopf" disabled={laeuft}>{laeuft ? "Wird geprüft …" : "Anmelden"}</button>
    </form>
  );
}
