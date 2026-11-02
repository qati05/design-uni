import Link from "next/link";
import { abmelden } from "../aktionen";

export function Kopf({ email, aktiv = "meldungen" }: { email: string; aktiv?: "meldungen" | "zahlen" }) {
  return (
    <header className="kopf">
      <img src="/bilder/logo-48.webp" width={95} height={34} alt="Auto Speedy AG" />
      <span className="titel">Cockpit</span>
      <nav className="kopf-nav" aria-label="Bereiche"><Link href="/" aria-current={aktiv === "meldungen" ? "page" : undefined}>Meldungen</Link><Link href="/zahlen" aria-current={aktiv === "zahlen" ? "page" : undefined}>Zahlen</Link></nav>
      <span className="unterzeile">{email}</span>
      <form action={abmelden}><button type="submit" className="knopf leise">Abmelden</button></form>
    </header>
  );
}
