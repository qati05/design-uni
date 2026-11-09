import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";
import { hilfeAdresse, websiteAdresse } from "@/lib/alltag";
import { heuteZuerich } from "../../gemeinsam/site";
import { abmelden } from "./aktionen";
import { Cockpit } from "./pflege/Cockpit";

// Startseite des Cockpits: «Website pflegen». Der Proxy lässt nur Mitglieder herein; hier wird es nochmals geprüft.
export default async function PflegeSeite() {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || !s.mitglied) redirect("/login");
  const [stand, verlauf, besucher] = await Promise.all([b.pflegeLesen(), b.verlauf().catch(() => []), b.besucher().catch(() => null)]);
  if (!stand) return (
    <main className="seite schmal anmelden">
      <img src="/bilder/logo-96.webp" width={135} height={48} alt="Auto Speedy AG" />
      <h1>Website pflegen</h1>
      <p className="meldung-text" role="alert">Die Website ist gerade nicht erreichbar. Bitte später nochmals versuchen oder das Studio informieren.</p>
      <form action={abmelden}><button type="submit" className="knopf knopf--leise">Abmelden</button></form>
    </main>
  );
  // Beides freiwillig und nie fest eingebaut: WEBSITE_URL für «Website ansehen», HILFE_MAIL für «Ihrem Betreuer schreiben».
  return <Cockpit stand={stand} verlauf={verlauf} besucher={besucher} email={s.email} heute={heuteZuerich()} website={websiteAdresse(process.env.WEBSITE_URL)} hilfeMail={hilfeAdresse(process.env.HILFE_MAIL)} />;
}
