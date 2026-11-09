import { chromium } from '/tmp/claude-0/qa-abnahme/projekt/autospeedy/astro-klar/node_modules/playwright/index.mjs';
export const B = 'http://localhost:4402';
export const OUT = '/home/claude/design-uni/.medaur/belege/klar-abnahme-1/';
export const SEITEN = [['start','/'],['leistungen','/leistungen/'],['l-unfall','/leistungen/unfall-carrosserie/'],['l-hagel','/leistungen/hagel-dellen/'],['l-lack','/leistungen/lack/'],['l-scheiben','/leistungen/scheiben/'],['l-felgen','/leistungen/felgen/'],['l-folierung','/leistungen/folierung/'],['tesla','/tesla/'],['flotten','/flotten/'],['occasionen','/occasionen/'],['team','/team/'],['kontakt','/kontakt/'],['schaden','/schaden-melden/'],['impressum','/impressum/'],['datenschutz','/datenschutz/'],['bildnachweise','/bildnachweise/'],['404','/404.html']];
export const VP = { 320: { viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, 390: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, 430: { viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, 1024: { viewport: { width: 1024, height: 768 } }, 1440: { viewport: { width: 1440, height: 900 } } };
export async function browser() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell' }); }
// mock: {schaden: 'ok'|'500'|'netz'|'okfalse', rueckruf: ...}; endpunkte: HTML injizieren
export async function ctx(b, w, opt = {}) {
  const c = await b.newContext({ ...VP[w], reducedMotion: opt.rm ? 'reduce' : 'no-preference', locale: 'de-CH', timezoneId: 'Europe/Zurich' });
  const log = { konsole: [], fehler: [], requests: [], fremd: [], posts: [], status400: [] };
  c.log = log;
  c.mock = opt.mock || {};
  await c.route(u => !u.href.startsWith(B), r => { log.fremd.push(r.request().url()); r.abort(); });
  await c.route(B + '/api/**', async r => {
    const req = r.request(), url = req.url(), art = url.includes('rueckruf') ? 'rueckruf' : 'schaden';
    if (req.method() === 'GET') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ t: 'test-token' }) });
    log.posts.push({ url, art, len: (req.postDataBuffer() || Buffer.alloc(0)).length, body: (req.postData() || '').slice(0, 4000) });
    const m = c.mock[art] || 'ok';
    if (opt.verzoegerung) await new Promise(x => setTimeout(x, opt.verzoegerung));
    if (m === 'netz') return r.abort('connectionreset');
    if (m === '500') return r.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false}' });
    if (m === 'okfalse') return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":false}' });
    if (m === 'leer') return r.fulfill({ status: 200, contentType: 'text/plain', body: '' });
    return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  if (opt.endpunkte) {
    await c.route(u => u.href.startsWith(B) && !u.pathname.startsWith('/api/') && (u.pathname.endsWith('/') || u.pathname.endsWith('.html')), async r => {
      const resp = await r.fetch(); let t = await resp.text();
      t = t.replace(/(<form id="schaden-form"[^>]*?)data-endpunkt(?=[\s>])/, '$1data-endpunkt="/api/schaden"').replace(/(<form class="karte rueckruf"[^>]*?)data-endpunkt(?=[\s>])/g, '$1data-endpunkt="/api/rueckruf"');
      r.fulfill({ response: resp, body: t, headers: { ...resp.headers(), 'content-type': 'text/html; charset=utf-8' } });
    });
  }
  c.on('page', p => hook(p, log));
  return c;
}
function hook(p, log) {
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') log.konsole.push(p.url() + ' ' + m.type() + ': ' + m.text()); });
  p.on('pageerror', e => log.fehler.push(p.url() + ' ' + e.message));
  p.on('requestfailed', r => { if (r.url().startsWith(B)) log.requests.push(r.url() + ' ' + (r.failure() || {}).errorText); });
  p.on('response', r => { if (r.status() >= 400 && r.url().startsWith(B) && !r.url().includes('/api/')) log.status400.push(r.status() + ' ' + r.url()); });
}
export const sleep = ms => new Promise(x => setTimeout(x, ms));
export async function ueberlauf(p) { return p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })); }
