// Zählendpunkt ohne Cookies (Cloudflare Pages Function, POST /api/zaehl). Speichert nur Tag, Punkt, Ort, Anzahl
// in Supabase (Funktion public.zaehlen, je Betrieb BETRIEB_ID). Keine IP, keine Kennung. NICHT deployt.
const MUSTER = /^[a-z0-9-]{2,40}$/;
export async function onRequestPost({ request, env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY || !env.BETRIEB_ID) return new Response(null, { status: 503 });
  const herkunft = request.headers.get("Origin");
  if (env.ERLAUBTE_HERKUNFT && herkunft && herkunft !== env.ERLAUBTE_HERKUNFT) return new Response(null, { status: 403 });
  const roh = await request.text();
  if (roh.length > 200) return new Response(null, { status: 413 });
  let d; try { d = JSON.parse(roh); } catch { return new Response(null, { status: 400 }); }
  if (!MUSTER.test(d?.punkt || "") || !MUSTER.test(d?.ort || "")) return new Response(null, { status: 422 });
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/zaehlen`, { method: "POST", headers: { "Content-Type": "application/json", apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}` }, body: JSON.stringify({ p_betrieb: env.BETRIEB_ID, p_punkt: d.punkt, p_ort: d.ort }) });
  return new Response(null, { status: r.ok ? 204 : 502 });
}
