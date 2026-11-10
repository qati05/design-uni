"use server";

import { redirect } from "next/navigation";

// Abmelden macht Cloudflare Access: Diese Adresse gehört Access und beendet die Anmeldung auf diesem Gerät.
// Danach zeigt Access beim nächsten Aufruf wieder seine Anmeldung. (In der Demo gibt es kein Abmelden.)
export async function abmelden() {
  redirect("/cdn-cgi/access/logout");
}
