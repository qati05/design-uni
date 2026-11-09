import { abmelden } from "../aktionen";

// Das Cockpit hat nur noch einen Bereich («Website pflegen»); die Sprungmarken zu den Abschnitten stehen auf der Seite selbst.
export function Kopf({ email }: { email: string }) {
  return (
    <header className="kopf">
      <img src="/bilder/logo-48.webp" width={95} height={34} alt="Auto Speedy AG" />
      <span className="titel">Cockpit</span>
      <span className="unterzeile">{email}</span>
      <form action={abmelden}><button type="submit" className="knopf leise">Abmelden</button></form>
    </header>
  );
}
