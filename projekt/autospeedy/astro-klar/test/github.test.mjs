// GitHub Contents-API (gemeinsam/github.js, BAUPLAN 4.0). fetch-Attrappe statt echter Aufrufe:
// Allowlist (nur site.json und Teamfotos), lesen liefert den SHA, schreiben meldet Konflikt (409) als code "konflikt".
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { lesen, schreiben, erlaubt, sitePfad } from "../../gemeinsam/github.js";

const env = { GITHUB_TOKEN: "geheim-nie-loggen", GITHUB_REPO: "autospeedy/website", GITHUB_ZWEIG: "main" };
let aufrufe, echterFetch;

function antworte(status, daten) { return { ok: status >= 200 && status < 300, status, json: async () => daten }; }

beforeEach(() => {
  aufrufe = [];
  echterFetch = globalThis.fetch;
  globalThis.fetch = async (url, opt) => { aufrufe.push({ url: String(url), opt }); return globalThis.__antwort(String(url), opt); };
});
afterEach(() => { globalThis.fetch = echterFetch; delete globalThis.__antwort; });

test("Allowlist: site.json und Teamfotos erlaubt, alles andere nicht", () => {
  assert.ok(erlaubt(env, sitePfad(env)));
  assert.ok(erlaubt(env, "public/bilder/team/anna-meier.jpg"));
  assert.ok(!erlaubt(env, "src/pages/index.astro"));
  assert.ok(!erlaubt(env, "public/bilder/team/../../../etc/passwd"));
  assert.ok(!erlaubt(env, "public/bilder/team/anna.png"), "nur .jpg");
});

test("schreiben an einen nicht erlaubten Pfad wirft, ohne fetch", async () => {
  globalThis.__antwort = () => antworte(200, {});
  await assert.rejects(() => schreiben(env, "src/pages/index.astro", "x", undefined, "boese"), /nicht erlaubt/);
  assert.equal(aufrufe.length, 0, "kein Aufruf bei verbotenem Pfad");
});

test("lesen liefert Inhalt und SHA", async () => {
  const inhalt = JSON.stringify({ bewertungen: { zeigen: true } });
  globalThis.__antwort = () => antworte(200, { content: Buffer.from(inhalt).toString("base64"), sha: "abc123" });
  const r = await lesen(env, sitePfad(env));
  assert.equal(r.sha, "abc123");
  assert.deepEqual(JSON.parse(r.inhalt), { bewertungen: { zeigen: true } });
  assert.match(aufrufe[0].url, /\/repos\/autospeedy\/website\/contents\/src\/daten\/site\.json\?ref=main/);
  assert.match(aufrufe[0].opt.headers.Authorization, /^Bearer /);
});

test("lesen einer fehlenden Datei gibt null (404)", async () => {
  globalThis.__antwort = () => antworte(404, {});
  assert.equal(await lesen(env, sitePfad(env)), null);
});

test("schreiben sendet SHA und content mit; Erfolg liefert neuen SHA", async () => {
  globalThis.__antwort = (url, opt) => { const b = JSON.parse(opt.body); assert.equal(b.sha, "alt-sha"); assert.ok(b.content); assert.equal(b.branch, "main"); return antworte(200, { content: { sha: "neu-sha" } }); };
  const r = await schreiben(env, sitePfad(env), "{}", "alt-sha", "Editor: Test");
  assert.equal(r.sha, "neu-sha");
  assert.equal(aufrufe[0].opt.method, "PUT");
});

test("Konflikt (409) wird als code «konflikt» geworfen", async () => {
  globalThis.__antwort = () => antworte(409, {});
  await assert.rejects(() => schreiben(env, sitePfad(env), "{}", "veralteter-sha", "Editor: Test"), (e) => e.code === "konflikt");
});

test("ohne Token/Repo wirft github.js (keine Anfrage)", async () => {
  globalThis.__antwort = () => antworte(200, {});
  await assert.rejects(() => lesen({}, "src/daten/site.json"), /nicht eingerichtet/);
});
