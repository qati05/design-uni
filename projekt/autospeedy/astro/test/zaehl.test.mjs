import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost } from "../functions/api/zaehl.js";
const env = { SUPABASE_URL: "https://sb.example", SUPABASE_SERVICE_KEY: "S", BETRIEB_ID: "auto-speedy" };
const anfrage = (body) => new Request("https://x.example/api/zaehl", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) });
function mit(fn) { const alt = globalThis.fetch; const a = []; globalThis.fetch = async (u, o) => { a.push({ u: String(u), o }); return new Response(null, { status: 204 }); }; return fn(a).finally(() => { globalThis.fetch = alt; }); }
test("zählt Punkt und Ort, sonst nichts", () => mit(async (a) => {
  assert.equal((await onRequestPost({ request: anfrage({ punkt: "anruf", ort: "kopf", ip: "1.2.3.4" }), env })).status, 204);
  assert.equal(a[0].u, "https://sb.example/rpc/zaehlen".replace("/rpc", "/rest/v1/rpc")); assert.deepEqual(JSON.parse(a[0].o.body), { p_betrieb: "auto-speedy", p_punkt: "anruf", p_ort: "kopf" });
}));
test("ungültige Werte, zu gross, kein JSON, nicht eingerichtet", () => mit(async (a) => {
  assert.equal((await onRequestPost({ request: anfrage({ punkt: "<script>", ort: "kopf" }), env })).status, 422);
  assert.equal((await onRequestPost({ request: anfrage("x".repeat(300)), env })).status, 413);
  assert.equal((await onRequestPost({ request: anfrage("{kaputt"), env })).status, 400);
  assert.equal((await onRequestPost({ request: anfrage({ punkt: "anruf", ort: "kopf" }), env: {} })).status, 503);
  assert.equal(a.length, 0);
}));
