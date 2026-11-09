import { browser, ctx, B, OUT, sleep, SEITEN } from './gemein.mjs';
const b = await browser(); const R = {};
// K15 390: unten angekommen, wer liegt oben?
R.K15 = [];
for (const [name, pf] of SEITEN) { const c = await ctx(b, 390, { rm: true }); const p = await c.newPage(); await p.goto(B + pf, { waitUntil: 'networkidle' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await sleep(300);
  R.K15.push({ name, ...(await p.evaluate(() => { const e = document.querySelector('[data-vorschau]'); const pr = e.getBoundingClientRect(); const l = document.querySelector('.handyleiste'); const lr = l ? l.getBoundingClientRect() : null; const oben = [...(l ? l.querySelectorAll('a') : [])].map(a => { const r = a.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return a.textContent.trim() + ':' + (a.contains(t) ? 'frei' : (t ? 'VERDECKT von ' + t.tagName : 'ausserhalb ' + Math.round(r.top))); }); return { plakette: [Math.round(pr.top), Math.round(pr.bottom)], leiste: lr && [Math.round(lr.top), Math.round(lr.bottom)], vh: innerHeight, oben, plaketteLesbar: lr ? pr.bottom <= lr.top + 1 : true, padBottom: getComputedStyle(document.body).paddingBottom }; })) });
  if (name === 'start' || name === 'schaden') await p.screenshot({ path: OUT + `${name}-390-seitenende-plakette.png` });
  await c.close(); }
// K16 Claim
R.K16 = [];
for (const [name, pf] of SEITEN) for (const w of [390, 1440]) { const c = await ctx(b, w, { rm: true }); const p = await c.newPage(); await p.goto(B + pf, { waitUntil: 'networkidle' });
  R.K16.push({ name, w, ...(await p.evaluate(() => { const f = document.querySelector('footer'); const el = [...f.querySelectorAll('*')].find(e => /Qualität, die man sieht/.test(e.textContent) && ![...e.children].some(k => /Qualität, die man sieht/.test(k.textContent))); return { claim: el && el.tagName + '.' + el.className, claimPx: el && parseFloat(getComputedStyle(el).fontSize), h1px: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize) }; })) }); await c.close(); }
// Menü-Tab: wohin geht der Fokus?
{ const c = await ctx(b, 390, {}); const p = await c.newPage(); await p.goto(B + '/', { waitUntil: 'networkidle' }); await p.click('.kopf__menu'); await sleep(900);
  R.dialogModal = await p.evaluate(() => document.querySelector('dialog.blatt').matches(':modal'));
  const seq = []; for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => (document.activeElement.closest('dialog') ? 'D:' : 'X:') + document.activeElement.tagName + ' ' + document.activeElement.textContent.trim().slice(0, 20))); } R.tabSeq = seq; await c.close(); }
// K13 heute
{ const c = await ctx(b, 1440, { rm: true }); const p = await c.newPage(); await p.goto(B + '/', { waitUntil: 'networkidle' }); const h = p.locator('.fuss-woche__heute').first(); R.heute = await h.evaluate(e => ({ farbe: getComputedStyle(e).color, bg: getComputedStyle(e).backgroundColor, px: getComputedStyle(e).fontSize, eltern: e.parentElement.outerHTML.slice(0, 200) })); await h.locator('xpath=ancestor::*[3]').screenshot({ path: OUT + 'fuss-1440-heute-ausschnitt.png' }); 
  // K12 Ablauf & Tesla Ausschnitte
  const ab = p.locator('main section', { hasText: 'Nach Ihrer Meldung' }).first(); if (await ab.count()) await ab.screenshot({ path: OUT + 'start-1440-ablauf-ausschnitt.png' });
  const te = p.locator('main section', { hasText: 'Tesla' }).first(); if (await te.count()) await te.screenshot({ path: OUT + 'start-1440-tesla-ausschnitt.png' });
  await c.close(); }
// K21 + K13 Ausschnitte
{ const c = await ctx(b, 390, { rm: true }); const p = await c.newPage(); await p.goto(B + '/leistungen/unfall-carrosserie/', { waitUntil: 'networkidle' }); const s = p.locator('main section', { hasText: 'Was wir machen' }).first(); if (await s.count()) await s.screenshot({ path: OUT + 'l-unfall-390-was-wir-machen.png' }); R.K21 = await s.locator('img').evaluateAll(es => es.map(e => e.currentSrc + ' | ' + e.alt));
  await p.goto(B + '/flotten/', { waitUntil: 'networkidle' }); const fl = p.locator('main section', { hasText: /K\s*\+\s*L/ }).first(); if (await fl.count()) await fl.screenshot({ path: OUT + 'flotten-390-liste-ausschnitt.png' });
  await p.goto(B + '/tesla/', { waitUntil: 'networkidle' }); const tl = p.locator('main ul').filter({ hasNot: p.locator('a') }).first(); if (await tl.count()) await tl.locator('xpath=ancestor::section[1]').screenshot({ path: OUT + 'tesla-390-liste-ausschnitt.png' });
  await c.close(); }
{ const c = await ctx(b, 1440, { rm: true }); const p = await c.newPage(); await p.goto(B + '/leistungen/unfall-carrosserie/', { waitUntil: 'networkidle' }); const s = p.locator('main section', { hasText: 'Was wir machen' }).first(); if (await s.count()) await s.screenshot({ path: OUT + 'l-unfall-1440-was-wir-machen.png' }); R.K21b = await s.locator('img').evaluateAll(es => es.map(e => e.currentSrc + ' ' + e.naturalWidth + 'w, angezeigt ' + Math.round(e.getBoundingClientRect().width))); await c.close(); }
console.log(JSON.stringify(R, null, 1)); await b.close();
