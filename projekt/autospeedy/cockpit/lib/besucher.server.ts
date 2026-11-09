// Besucherzahlen aus Cloudflare Web Analytics (dieselbe Zählung, die auf der Website läuft: ohne Cookies, ohne Personendaten).
// Nur Summen pro Tag und pro Seite. Ohne Abhängigkeit von Next, damit die Tests es mit einem Schein-fetch prüfen können.
import type { Besucher } from "./backend";

/** konto: Account-ID bei Cloudflare. seite: «Site Tag» der Website in Web Analytics. token: nur «Account Analytics: Read». */
export type Zaehlung = { konto: string; seite: string; token: string };
export const TAGE = 28;

const ABFRAGE = `query Besucher($konto: String!, $filter: AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject!) {
  viewer { accounts(filter: { accountTag: $konto }) {
    tage: rumPageloadEventsAdaptiveGroups(filter: $filter, limit: 60, orderBy: [date_ASC]) { sum { visits } dimensions { date } }
    seiten: rumPageloadEventsAdaptiveGroups(filter: $filter, limit: 8, orderBy: [sum_visits_DESC]) { sum { visits } dimensions { requestPath } }
  } }
}`;

const tagText = (d: Date) => d.toISOString().slice(0, 10);
/** Die letzten 28 Tage bis und mit «heute» als Datum JJJJ-MM-TT, ältester zuerst. */
export function letzteTage(heute: Date, n = TAGE): string[] {
  return Array.from({ length: n }, (_, i) => tagText(new Date(Date.UTC(heute.getUTCFullYear(), heute.getUTCMonth(), heute.getUTCDate() - (n - 1 - i)))));
}

export async function besucherLesen(z: Zaehlung, heute: Date = new Date()): Promise<Besucher | null> {
  if (!/^[0-9a-f]{32}$/.test(z.konto) || !/^[0-9a-f]{32}$/.test(z.seite) || !z.token) return null;
  const tage = letzteTage(heute);
  const filter = { AND: [{ siteTag: z.seite }, { datetime_geq: `${tage[0]}T00:00:00Z`, datetime_leq: heute.toISOString().slice(0, 19) + "Z" }, { bot: 0 }] };
  const a = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(10000),
    headers: { authorization: `Bearer ${z.token}`, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ query: ABFRAGE, variables: { konto: z.konto, filter } }),
  }).catch(() => null);
  if (!a?.ok) return null;
  type Gruppe = { sum?: { visits?: unknown }; dimensions?: { date?: unknown; requestPath?: unknown } };
  const j = (await a.json().catch(() => null)) as { errors?: unknown; data?: { viewer?: { accounts?: { tage?: Gruppe[]; seiten?: Gruppe[] }[] } } } | null;
  const k = j?.data?.viewer?.accounts?.[0];
  if (!k || (Array.isArray(j?.errors) && j.errors.length) || !Array.isArray(k.tage) || !Array.isArray(k.seiten)) return null;
  const zahl = (g: Gruppe) => (typeof g.sum?.visits === "number" && g.sum.visits >= 0 ? Math.round(g.sum.visits) : 0);
  const proTag = new Map(k.tage.flatMap((g) => (typeof g.dimensions?.date === "string" ? [[g.dimensions.date, zahl(g)] as const] : [])));
  return {
    beispiel: false,
    tage: tage.map((datum) => ({ datum, besuche: proTag.get(datum) ?? 0 })),
    // Nur der Pfad, höchstens 120 Zeichen, nichts hinter «?»: In Adressen können Angaben stehen, die niemanden etwas angehen.
    seiten: k.seiten.flatMap((g) => (typeof g.dimensions?.requestPath === "string" && g.dimensions.requestPath.startsWith("/") ? [{ pfad: g.dimensions.requestPath.split("?")[0]!.slice(0, 120), besuche: zahl(g) }] : [])),
  };
}

/** Demo: feste Beispielzahlen (als Beispiel gekennzeichnet), damit die Seite etwas zeigt. */
export function besucherBeispiel(heute: Date = new Date()): Besucher {
  const tage = letzteTage(heute).map((datum, i) => {
    const wt = new Date(datum + "T12:00:00Z").getUTCDay();
    return { datum, besuche: Math.round((wt === 0 ? 9 : wt === 6 ? 14 : 31) + ((i * 7) % 11) + (i > 20 ? 6 : 0)) };
  });
  const summe = tage.reduce((n, t) => n + t.besuche, 0);
  const anteil = [["/", 0.41], ["/schaden-melden/", 0.17], ["/leistungen/hagel/", 0.11], ["/kontakt/", 0.09], ["/tesla/", 0.08], ["/team/", 0.06], ["/occasionen/", 0.05]] as const;
  return { beispiel: true, tage, seiten: anteil.map(([pfad, a]) => ({ pfad, besuche: Math.round(summe * a) })) };
}
