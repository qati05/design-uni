import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pruefe, schreibe } from "../bau/pflege-holen.mjs";

const gut = { hinweis: { aktiv: true, text: "Hagel? Jetzt melden.", link: "/schaden-melden/?art=hagel" }, zeiten: [{ tage: "Freitag", kurz: "Fr", wochentage: ["Friday"], geschlossen: false, fenster: [{ von: "7.30", bis: "12.00" }] }], ausnahmen: [], team: [{ name: "Annahme", leute: [{ name: "A B", rolle: "C" }] }] };

test("Pflege aus dem Cockpit: erwartete Form wird angenommen", () => { assert.equal(pruefe(gut), true); });
test("Pflege aus dem Cockpit: kaputte Antwort bricht den Bau ab", () => {
  assert.equal(pruefe(null), false);
  assert.equal(pruefe({ ...gut, zeiten: [] }), false);
  assert.equal(pruefe({ ...gut, team: "x" }), false);
});
test("Pflege aus dem Cockpit: schreibt pflege.json und team.json in der Form der Website", () => {
  const o = fs.mkdtempSync(path.join(os.tmpdir(), "pflege-"));
  schreibe(gut, o);
  const p = JSON.parse(fs.readFileSync(path.join(o, "pflege.json"), "utf8"));
  const t = JSON.parse(fs.readFileSync(path.join(o, "team.json"), "utf8"));
  assert.equal(p.hinweis.aktiv, true); assert.equal(p.zeiten[0].fenster[0].von, "7.30"); assert.equal(t.gruppen[0].leute[0].name, "A B");
  fs.rmSync(o, { recursive: true });
});

test("Teamfotos aus dem Cockpit: werden heruntergeladen, fremde Adressen fallen weg", async () => {
  const o = fs.mkdtempSync(path.join(os.tmpdir(), "fotos-"));
  const { fotosHolen } = await import("../bau/pflege-holen.mjs");
  const d = { team: [{ name: "A", leute: [
    { name: "Eins", rolle: "", foto: "https://abcd.supabase.co/storage/v1/object/public/teamfotos/1234abcd-1111.webp" },
    { name: "Zwei", rolle: "", foto: "https://boese.example/x.webp" },
    { name: "Drei", rolle: "", foto: "/bilder/team/anna-meier.webp" },
  ] }] };
  const holen = async () => new Response(new Uint8Array([82, 73, 70, 70]), { headers: { "content-type": "image/webp" } });
  await fotosHolen(d, o, holen);
  assert.equal(d.team[0].leute[0].foto, "/bilder/team/cockpit-1234abcd-1111.webp");
  assert.ok(fs.existsSync(path.join(o, "cockpit-1234abcd-1111.webp")));
  assert.equal(d.team[0].leute[1].foto, undefined);
  assert.equal(d.team[0].leute[2].foto, "/bilder/team/anna-meier.webp");
  fs.rmSync(o, { recursive: true });
});
