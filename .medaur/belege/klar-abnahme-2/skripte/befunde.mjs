import { browser, ctx, B, OUT, sleep, ueberlauf, SEITEN } from './gemein.mjs';
const b = await browser(); const R = {};
async function seite(w, pfad, opt = {}) { const c = await ctx(b, w, opt); const p = await c.newPage(); await p.goto(B + pfad, { waitUntil: 'networkidle' }); await sleep(opt.rm ? 200 : 900); return { c, p }; }
// K04
R.K04 = [];
for (const w of [390, 1440]) { const { c, p } = await seite(w, '/kontakt/');
  R.K04.push({ w, ...(await p.evaluate(() => {
    const k = [...document.querySelectorAll('.kontakt__karte')].map(x => { const h = x.querySelector('h2'), v = x.querySelector('.kontakt__wert'); const r = v.getBoundingClientRect(); return { label: h.textContent, labelPx: getComputedStyle(h).fontSize, wertPx: getComputedStyle(v).fontSize, wertTop: Math.round(r.top), wertBottom: Math.round(r.bottom) }; });
    const leiste = document.querySelector('.handyleiste'); const lt = leiste && getComputedStyle(leiste).display !== 'none' ? Math.round(leiste.getBoundingClientRect().top) : null;
    const main = document.querySelector('main').innerText; const adr = (main.match(/Alte Landstrasse 63/g) || []).length;
    return { h1: document.querySelector('h1').textContent.trim(), k, handyleisteTop: lt, vh: innerHeight, adresseImMain: adr, tel: (main.match(/071 755 88 61/g) || []).length };
  })) });
  await p.locator('.kontakt').screenshot({ path: OUT + `kontakt-${w}-karten.png` }); await c.close(); }
// K07
R.K07 = [];
for (const w of [1440, 1024]) { const { c, p } = await seite(w, '/team/', { rm: true });
  R.K07.push({ w, ...(await p.evaluate(() => {
    const raster = [...document.querySelectorAll('main ul, main .personen, main [class*=raster], main [data-anzahl]')].filter(e => getComputedStyle(e).display === 'grid');
    return { raster: raster.map(r => { const rr = r.getBoundingClientRect(), par = r.parentElement.getBoundingClientRect(); const kids = [...r.children].map(k => k.getBoundingClientRect()); const maxR = Math.max(...kids.map(k => k.right)); const cs = getComputedStyle(r); return { cls: r.className, anzahl: r.dataset.anzahl, cols: cs.gridTemplateColumns, gap: cs.columnGap, rasterL: Math.round(rr.left), rasterR: Math.round(rr.right), elternR: Math.round(par.right), kinderR: Math.round(maxR), rest: Math.round(rr.right - maxR), kinder: kids.length }; }) };
  })) }); await p.screenshot({ path: OUT + `team-${w}-ganz-rm.png`, fullPage: true }); await c.close(); }
// K09 Tippziele
R.K09 = [];
for (const w of [320, 390]) for (const pf of ['/kontakt/', '/team/', '/flotten/', '/occasionen/']) { const { c, p } = await seite(w, pf, { rm: true });
  R.K09.push({ w, pf, klein: await p.evaluate(() => [...document.querySelectorAll('a, button, label.zeitwahl__feld, label.art, .chips label, summary, input[type=checkbox]:not(.zeitwahl__feld input), input[type=radio]')].filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !e.closest('dialog, .menue-ohne-js, .honig') && !e.classList.contains('sprung'); }).map(e => { const r = e.getBoundingClientRect(); const imText = e.tagName === 'A' && e.parentElement && /^(P|LI|DD|TD|SMALL|SPAN)$/.test(e.parentElement.tagName) && e.parentElement.textContent.trim().length > e.textContent.trim().length + 3; return { t: e.tagName + '.' + (e.className || '') + ' "' + e.textContent.trim().slice(0, 30) + '"', w: Math.round(r.width), h: Math.round(r.height), imText, eltern: e.parentElement.tagName + '.' + e.parentElement.className }; }).filter(x => x.w < 44 || x.h < 44)) });
  await c.close(); }
// K13 Linkfarbe auf nicht klickbaren Elementen
R.K13 = [];
for (const pf of ['/', '/leistungen/', '/flotten/', '/tesla/', '/leistungen/unfall-carrosserie/']) for (const w of [390, 1440]) { const { c, p } = await seite(w, pf, { rm: true });
  R.K13.push({ pf, w, blau: await p.evaluate(() => [...document.querySelectorAll('main *, footer *')].filter(e => { const s = getComputedStyle(e); const blau = s.color === 'rgb(21, 102, 184)' || s.backgroundColor === 'rgb(21, 102, 184)'; if (!blau) return false; if (e.closest('a, button, label, summary, input, select, textarea')) return false; const r = e.getBoundingClientRect(); return r.width > 0 && e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); }).map(e => e.tagName + '.' + e.className + ' "' + e.textContent.trim().slice(0, 40) + '"')) });
  await c.close(); }
// K14
{ const { c, p } = await seite(390, '/schaden-melden/', { rm: true }); R.K14 = await p.evaluate(() => [...document.querySelectorAll('.art')].map(a => { const r = a.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); })); await p.locator('.arten').screenshot({ path: OUT + 'schaden-390-arten.png' }); await c.close(); }
// K15
R.K15 = [];
for (const [name, pf] of SEITEN) for (const w of [390, 1440]) { const { c, p } = await seite(w, pf, { rm: true });
  R.K15.push({ name, w, ...(await p.evaluate(async () => {
    const e = document.querySelector('[data-vorschau]'); if (!e) return { fehlt: true };
    const s = getComputedStyle(e); const res = { pos: s.position, nachFuss: e.previousElementSibling && e.previousElementSibling.tagName };
    // Überdeckung prüfen über die Seite scrollend: interaktive Elemente unter der Plakette
    const hits = new Set();
    for (let y = 0; y <= document.body.scrollHeight; y += Math.round(innerHeight / 2)) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 20)); const pr = e.getBoundingClientRect(); for (const i of document.querySelectorAll('a, button, input, label, summary, select, textarea')) { if (e.contains(i)) continue; const r = i.getBoundingClientRect(); if (r.width && r.height && r.left < pr.right && r.right > pr.left && r.top < pr.bottom && r.bottom > pr.top) { const st = getComputedStyle(i); if (st.visibility !== 'hidden' && !i.closest('dialog,.menue-ohne-js,.honig') && i.type !== 'radio' && i.type !== 'checkbox' && i.type !== 'file') hits.add(i.tagName + ' "' + i.textContent.trim().slice(0, 30) + '"'); } } }
    return { ...res, ueberdeckt: [...hits].slice(0, 8) };
  })) }); await c.close(); }
// K16
R.K16 = [];
for (const [name, pf] of SEITEN) for (const w of [390, 1440]) { const { c, p } = await seite(w, pf, { rm: true });
  R.K16.push({ name, w, ...(await p.evaluate(() => { const f = document.querySelector('footer'); const h1 = document.querySelector('h1'); const big = [...f.querySelectorAll('*')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => ({ t: e.textContent.trim().slice(0, 40), px: parseFloat(getComputedStyle(e).fontSize) })).sort((a, b) => b.px - a.px)[0]; return { fussH: Math.round(f.getBoundingClientRect().height), h1px: parseFloat(getComputedStyle(h1).fontSize), groessterFussText: big }; })) });
  if (w === 1440 && name === 'team') await p.locator('footer').screenshot({ path: OUT + 'fuss-1440.png' });
  if (w === 390 && name === 'start') await p.locator('footer').screenshot({ path: OUT + 'fuss-390.png' });
  await c.close(); }
// K17, K18 Zeilenumbrüche
function umbruchFn() { return (el) => { const tn = []; const wk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = wk.nextNode())) tn.push(n); let txt = '', prevTop = null, brueche = []; for (const t of tn) for (let i = 0; i < t.length; i++) { const r = document.createRange(); r.setStart(t, i); r.setEnd(t, i + 1); const rc = r.getClientRects()[0]; const ch = t.data[i]; if (rc && rc.width > 0) { if (prevTop !== null && rc.top > prevTop + 3) brueche.push(txt.slice(-12) + '|' + ch); prevTop = rc.top; } txt += ch; } return { txt: txt.trim(), brueche }; }; }
R.K17 = []; R.K18 = [];
for (const w of [320, 390]) {
  { const { c, p } = await seite(w, '/team/', { rm: true }); R.K17.push({ w, mails: await p.$$eval('main a[href^="mailto:"]', (els, fs) => { const f = eval(fs); return els.map(f); }, umbruchFn().toString()) }); if (w === 390) await p.locator('main a[href^="mailto:"]').first().locator('xpath=ancestor::li[1]').screenshot({ path: OUT + 'team-390-mail-ausschnitt.png' }).catch(() => {}); await c.close(); }
  { const { c, p } = await seite(w, '/flotten/', { rm: true }); const h = p.locator('main :is(h1,h2,h3,p)', { hasText: /K\s*\+\s*L/ }); R.K18.push({ w, n: await h.count(), r: await h.evaluateAll((els, fs) => { const f = eval(fs); return els.map(f); }, umbruchFn().toString()) }); if (await h.count()) await h.first().screenshot({ path: OUT + `flotten-${w}-kl-ueberschrift.png` }); await c.close(); }
}
// K22 + Menü, auch reduced motion
R.K22 = [];
for (const w of [390, 320]) for (const rm of [false, true]) { const { c, p } = await seite(w, '/', { rm });
  const z = { w, rm };
  await p.click('.kopf__menu'); await sleep(rm ? 200 : 900);
  z.offen = await p.evaluate(() => { const d = document.querySelector('dialog.blatt'); const inn = d.querySelector('.blatt__innen').getBoundingClientRect(); const a = d.querySelector('.blatt__aktion'), t = d.querySelector('.blatt__tel'); const ra = a.getBoundingClientRect(), rt = t.getBoundingClientRect(); const zu = d.querySelector('.blatt__zu'); const sp = [...zu.querySelectorAll('.kopf__menu-icon span')].map(s => getComputedStyle(s).transform + ' op' + getComputedStyle(s).opacity); return { open: d.open, blatt: [Math.round(inn.left), Math.round(inn.right)], aktion: [Math.round(ra.width), Math.round(ra.height), getComputedStyle(a).backgroundColor, getComputedStyle(a).color], tel: [Math.round(rt.width), Math.round(rt.height), getComputedStyle(t).backgroundColor], aktiv: document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim(), zuIcon: sp, zuGroesse: [Math.round(zu.getBoundingClientRect().width), Math.round(zu.getBoundingClientRect().height)] }; });
  await p.screenshot({ path: OUT + `nav-${w}-offen${rm ? '-rm' : ''}.png` });
  await p.locator('.blatt__zu').screenshot({ path: OUT + `nav-${w}-schliessen-symbol${rm ? '-rm' : ''}.png` });
  // Tab-Falle: 12x Tab, bleibt im Dialog?
  const imDialog = []; for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); imDialog.push(await p.evaluate(() => !!document.activeElement.closest('dialog'))); }
  z.tabImDialog = imDialog.every(Boolean);
  await p.keyboard.press('Escape'); await sleep(rm ? 200 : 700);
  z.nachEsc = await p.evaluate(() => ({ open: document.querySelector('dialog.blatt').open, aktiv: document.activeElement.className }));
  // erneut öffnen, mit Knopf schliessen
  await p.click('.kopf__menu'); await sleep(rm ? 200 : 900); await p.click('.blatt__zu'); await sleep(rm ? 200 : 900);
  z.nachKnopf = await p.evaluate(() => ({ open: document.querySelector('dialog.blatt').open, aktiv: document.activeElement.className, sichtbar: getComputedStyle(document.querySelector('dialog.blatt')).display }));
  // Tastatur öffnen
  await p.focus('.kopf__menu'); await p.keyboard.press('Enter'); await sleep(rm ? 200 : 900);
  z.tastaturAuf = await p.evaluate(() => ({ open: document.querySelector('dialog.blatt').open, aktiv: document.activeElement.getAttribute('aria-label') }));
  await p.keyboard.press('Escape'); await sleep(500);
  z.ueberlauf = await ueberlauf(p);
  R.K22.push(z); await c.close(); }
console.log(JSON.stringify(R, null, 1)); await b.close();
