import { browser, ctx, B, OUT, sleep, ueberlauf } from './gemein.mjs';
const FOTO = '/tmp/claude-0/-home-claude-design-uni/74937679-c533-5ae7-8450-0374beafdd1e/scratchpad/qa1/test-foto.jpg';
const b = await browser(); const R = {};
const schritt = p => p.evaluate(() => [...document.querySelectorAll('#schaden-form [data-schritt]')].findIndex(s => !s.hidden) + 1);
const akt = p => p.evaluate(() => { const a = document.activeElement; return a.tagName + (a.id ? '#' + a.id : '') + (a.dataset && a.dataset.art ? '[' + a.dataset.art + ']' : '') + ' "' + (a.textContent || a.value || '').trim().slice(0, 50) + '"'; });
const menu = p => p.evaluate(() => { const r = document.querySelector('.kopf__menu').getBoundingClientRect(); return { l: r.left, r: r.right, vw: document.documentElement.clientWidth }; });
// K01
R.K01 = [];
for (const w of [320, 390, 430]) {
  const c = await ctx(b, w, { endpunkte: true }); const p = await c.newPage();
  await p.goto(B + '/schaden-melden/', { waitUntil: 'networkidle' });
  const z = [];
  z.push(['laden', await ueberlauf(p)]);
  await p.click('label.art:has(input[data-art=parkschaden])'); await sleep(700);
  z.push(['schritt2 (Klick) Schritt=' + await schritt(p), await ueberlauf(p), await menu(p)]);
  if (w === 390) await p.screenshot({ path: OUT + 'schaden-390-schritt2-viewport.png' });
  await p.click('[data-senden=website]'); await sleep(700);
  z.push(['leer gesendet: aktiv=' + await akt(p) + ' fehler=' + await p.locator('.feld-fehler').count(), await ueberlauf(p), await menu(p)]);
  if (w === 390) { await p.screenshot({ path: OUT + 'schaden-390-feldfehler-viewport.png' }); }
  await p.fill('[name=telefon]', 'abc'); await p.fill('[name=email]', 'x@'); await p.click('[data-senden=website]'); await sleep(600);
  z.push(['tel abc / mail x@: ' + (await p.locator('.feld-fehler').allTextContents()).join(' / '), await ueberlauf(p), await menu(p)]);
  await p.setInputFiles('[data-fotos]', [FOTO, FOTO]); await p.setInputFiles('[data-ausweis]', FOTO); await sleep(1200);
  z.push(['2 Fotos + Ausweis: ' + await p.locator('[data-fotoliste] li').count() + ' / ' + await p.locator('[data-ausweisliste] li').count(), await ueberlauf(p), await menu(p)]);
  if (w === 390) await p.screenshot({ path: OUT + 'schaden-390-fotos-ganz.png', fullPage: true });
  if (w === 320) await p.screenshot({ path: OUT + 'schaden-320-fehler-fotos-viewport.png' });
  R.K01.push({ w, z }); await c.close();
}
// K02 Tastatur
R.K02 = [];
for (const w of [1440, 390]) {
  const c = await ctx(b, w, {}); const p = await c.newPage();
  await p.goto(B + '/schaden-melden/', { waitUntil: 'networkidle' });
  // echt per Tab zur Gruppe
  let n = 0; while (n < 40) { await p.keyboard.press('Tab'); n++; if (await p.evaluate(() => document.activeElement.name === 'art')) break; }
  const z = ['Tabs bis Gruppe: ' + n + ', aktiv ' + await akt(p) + ', checked=' + await p.evaluate(() => (document.querySelector('input[name=art]:checked') || {}).value)];
  if (w === 1440) await p.screenshot({ path: OUT + 'schaden-1440-tastatur-radio-fokus.png' });
  for (let i = 0; i < 7; i++) { await p.keyboard.press(i < 6 ? 'ArrowRight' : 'ArrowLeft'); await sleep(250); z.push((i < 6 ? '→' : '←') + ' checked=' + await p.evaluate(() => (document.querySelector('input[name=art]:checked') || {}).value) + ' Schritt=' + await schritt(p)); }
  await p.keyboard.press('ArrowRight'); await sleep(250); z.push('→ checked=' + await p.evaluate(() => (document.querySelector('input[name=art]:checked') || {}).value) + ' Schritt=' + await schritt(p));
  z.push('Weiter sichtbar: ' + await p.locator('[data-weiter="2"]').isVisible());
  if (w === 1440) await p.screenshot({ path: OUT + 'schaden-1440-tastatur-pfeil-bleibt.png' });
  await p.keyboard.press('Enter'); await sleep(800);
  z.push('Enter → Schritt=' + await schritt(p) + ' aktiv=' + await akt(p) + ' zusammen=' + await p.locator('[data-zusammen]').textContent());
  if (w === 1440) await p.screenshot({ path: OUT + 'schaden-1440-tastatur-enter-schritt2.png' });
  // Zurück, dann Weiter per Tastatur
  await p.focus('[data-zurueck="1"]').catch(() => {}); const hatZ = await p.locator('[data-zurueck="1"]').count();
  if (hatZ) { await p.keyboard.press('Enter'); await sleep(800); z.push('Zurück(Enter) → Schritt=' + await schritt(p) + ' aktiv=' + await akt(p));
    // Tab zu Weiter
    let m = 0; while (m < 15) { await p.keyboard.press('Tab'); m++; if (await p.evaluate(() => document.activeElement.matches('[data-weiter]'))) break; }
    z.push('Tabs zu Weiter: ' + m + ' aktiv=' + await akt(p)); await p.keyboard.press('Enter'); await sleep(800); z.push('Weiter(Enter) → Schritt=' + await schritt(p) + ' art=' + await p.evaluate(() => document.querySelector('input[name=art]:checked').value));
    await p.focus('[data-zurueck="1"]'); await p.keyboard.press('Space'); await sleep(800);
    await p.focus('input[data-art=hagel]'); await p.keyboard.press('Space'); await sleep(800); z.push('Leertaste auf Hagel → Schritt=' + await schritt(p) + ' art=' + await p.evaluate(() => document.querySelector('input[name=art]:checked').value));
  } else z.push('kein [data-zurueck=1]');
  // Tastatur in Schritt 2: ausfüllen und Senden per Tastatur (Vorschau ohne Endpunkt)
  R.K02.push({ w, z }); await c.close();
}
// Tippen (Touch) auf Karte
{ const c = await ctx(b, 390, {}); const p = await c.newPage(); await p.goto(B + '/schaden-melden/', { waitUntil: 'networkidle' });
  await p.tap('label.art:has(input[data-art=scheibe])'); await sleep(800); R.tap = 'Tap Scheibe → Schritt=' + await schritt(p) + ' zusammen=' + await p.locator('[data-zusammen]').textContent(); await c.close(); }
// Erfolg, Fehler, Netz (Mock), 390 und 1440
R.senden = [];
for (const w of [390, 1440]) for (const m of ['ok', '500', 'netz', 'okfalse']) {
  const c = await ctx(b, w, { endpunkte: true, mock: { schaden: m }, verzoegerung: 600 }); const p = await c.newPage();
  await p.goto(B + '/schaden-melden/', { waitUntil: 'networkidle' });
  await p.click('label.art:has(input[data-art=unfall])'); await sleep(700);
  await p.fill('[name=name]', 'Testperson QA'); await p.fill('[name=telefon]', '079 000 00 00'); await p.fill('[name=bemerkung]', 'Synthetischer QA-Test, bitte ignorieren');
  await p.setInputFiles('[data-fotos]', FOTO); await sleep(800);
  await p.click('[data-senden=website]'); await sleep(80);
  const lade = await p.evaluate(() => { const k = document.querySelector('[data-senden=website]'); return { disabled: k.disabled, busy: k.getAttribute('aria-busy'), text: k.textContent.trim() }; });
  if (w === 390 && m === 'ok') await p.screenshot({ path: OUT + 'schaden-390-laedt-viewport.png' });
  await p.click('[data-senden=website]', { force: true, timeout: 1000 }).catch(() => {});
  await sleep(1800);
  const st = await p.evaluate(() => { const r = document.querySelector('[data-rapport]'), rm = document.querySelector('#schaden-form [data-rueckmeldung]'); return { rapportSichtbar: !r.hidden, rapportTitel: r.querySelector('[data-r-titel]').textContent, stand: r.querySelector('[data-r-stand]').textContent, meldung: rm.hidden ? '' : rm.textContent, role: rm.getAttribute('role'), name: document.querySelector('[name=name]').value, knopf: document.querySelector('[data-senden=website]').textContent.trim() }; });
  const a = await akt(p);
  R.senden.push({ w, m, lade, posts: c.log.posts.length, postUrl: (c.log.posts[0] || {}).url, hatFoto: (c.log.posts[0] || {}).body?.includes('schaden-1.jpg'), hatToken: (c.log.posts[0] || {}).body?.includes('test-token'), st, aktiv: a, ...(await ueberlauf(p)) });
  if (w === 390) await p.screenshot({ path: OUT + `schaden-390-mock-${m}-viewport.png` });
  if (w === 1440 && m !== 'okfalse') await p.screenshot({ path: OUT + `schaden-1440-mock-${m}-viewport.png` });
  await c.close();
}
// Vorschau ohne Endpunkt (wie ausgeliefert)
{ const c = await ctx(b, 390, {}); const p = await c.newPage(); await p.goto(B + '/schaden-melden/', { waitUntil: 'networkidle' });
  await p.click('label.art:has(input[data-art=hagel])'); await sleep(600); await p.fill('[name=name]', 'Testperson QA'); await p.fill('[name=telefon]', '079 000 00 00');
  await p.click('[data-senden=website]'); await sleep(1200); R.vorschau = { posts: c.log.posts.length, titel: await p.locator('[data-r-titel]').textContent(), aktiv: await akt(p) };
  await p.screenshot({ path: OUT + 'schaden-390-vorschau-ohne-endpunkt-viewport.png' }); await c.close(); }
console.log(JSON.stringify(R, null, 1)); await b.close();
