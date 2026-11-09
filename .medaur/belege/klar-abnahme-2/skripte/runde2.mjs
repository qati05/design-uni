// QA Runde 2: gezielte Nachprüfung C02, C04, C05, C06, C08, C09, C10, N01, N02, N04–N07
import { browser, ctx, B, OUT, sleep, ueberlauf } from './gemein.mjs';
const FOTO = '/tmp/claude-0/-home-claude-design-uni/74937679-c533-5ae7-8450-0374beafdd1e/scratchpad/qa1/test-foto.jpg';
const b = await browser(); const R = {};
const akt = p => p.evaluate(() => { const a = document.activeElement; return a.tagName + (a.id ? '#' + a.id : '') + (a.className ? '.' + String(a.className).split(' ')[0] : '') + ' "' + (a.textContent || a.value || '').trim().slice(0, 50) + '"'; });

// ---- C02: Sendefehler Schadenmeldung, 390/320/1440, 500 und Netz
R.C02 = [];
for (const w of [320, 390, 1440]) for (const m of ['500', 'netz']) {
  const c = await ctx(b, w, { endpunkte: true, mock: { schaden: m }, verzoegerung: 400 }); const p = await c.newPage();
  await p.goto(B + '/schaden-melden/', { waitUntil: 'networkidle' });
  await p.click('label.art:has(input[data-art=unfall])'); await sleep(700);
  await p.fill('[name=name]', 'Testperson QA'); await p.fill('[name=telefon]', '079 000 00 00'); await p.fill('[name=bemerkung]', 'Synthetischer QA-Test');
  await p.setInputFiles('[data-fotos]', FOTO); await sleep(600);
  await p.click('[data-senden=website]'); await sleep(80);
  const lade = await p.evaluate(() => { const s = document.querySelector('[data-sende-rueckmeldung]'); const r = s.getBoundingClientRect(); return { text: s.hidden ? '(hidden)' : s.textContent.trim(), top: r.top, bottom: r.bottom, vh: innerHeight }; });
  await sleep(1500);
  const z = await p.evaluate(() => {
    const s = document.querySelector('[data-sende-rueckmeldung]'), k = document.querySelector('[data-senden=website]'), allg = document.querySelector('#schaden-form [data-rueckmeldung]');
    const kopf = document.querySelector('[data-kopf], header'); const kb = kopf ? kopf.getBoundingClientRect().bottom : 0;
    const rs = s.getBoundingClientRect(), rk = k.getBoundingClientRect();
    const a = s.querySelector('a[href^="tel:"]'); let treffer = null, ar = null;
    if (a) { ar = a.getBoundingClientRect(); const el = document.elementFromPoint(ar.left + ar.width / 2, ar.top + ar.height / 2); treffer = el === a || a.contains(el); }
    const leiste = document.querySelector('.handyleiste'); const lb = leiste && getComputedStyle(leiste).display !== 'none' ? leiste.getBoundingClientRect().top : innerHeight;
    return { sichtbar: !s.hidden, text: s.textContent.trim(), role: s.getAttribute('role'), kopfUnten: Math.round(kb), meldTop: Math.round(rs.top), meldBottom: Math.round(rs.bottom), knopfTop: Math.round(rk.top), knopfBottom: Math.round(rk.bottom), vh: innerHeight, leisteTop: Math.round(lb),
      direktVorKnopf: s.nextElementSibling === k || (s.compareDocumentPosition(k) & 4) > 0, telHref: a && a.getAttribute('href'), telRect: ar && [Math.round(ar.left), Math.round(ar.top), Math.round(ar.width), Math.round(ar.height)], telKlickbar: treffer,
      allgemeinVerborgen: allg ? allg.hidden || !allg.textContent.trim() : 'fehlt', name: document.querySelector('[name=name]').value, bemerkung: document.querySelector('[name=bemerkung]').value };
  });
  z.aktiv = await akt(p); z.lade = lade; z.posts = c.log.posts.length;
  // Klick auf Tel-Link per echtem Mausklick (Navigation abfangen)
  if (z.telHref) { let ziel = null; p.on('request', r => { if (r.url().startsWith('tel:')) ziel = r.url(); }); await p.click('[data-sende-rueckmeldung] a[href^="tel:"]', { trial: true }).then(() => z.telTrial = 'ok').catch(e => z.telTrial = e.message.slice(0, 80)); }
  R.C02.push({ w, m, ...z });
  await p.screenshot({ path: OUT + `c02-schaden-${w}-mock-${m}-viewport.png` });
  await c.close();
}

// ---- C04: Kontakt 1440x900, Telefon + Adresse ganz sichtbar; Team erster Viewport
{
  const c = await ctx(b, 1440, {}); const p = await c.newPage();
  await p.goto(B + '/kontakt/', { waitUntil: 'networkidle' }); await sleep(1200);
  R.C04 = await p.evaluate(() => {
    const kb = document.querySelector('[data-kopf], header').getBoundingClientRect().bottom;
    const karten = [...document.querySelectorAll('.kontakt__karte')].map(k => { const r = k.getBoundingClientRect(); return { text: k.textContent.replace(/\s+/g, ' ').trim().slice(0, 70), top: Math.round(r.top), bottom: Math.round(r.bottom) }; });
    const finde = t => { const w = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (n.textContent.includes(t)) { const r = n.parentElement.getBoundingClientRect(); return { el: n.parentElement.tagName, top: Math.round(r.top), bottom: Math.round(r.bottom) }; } return null; };
    return { kopfUnten: Math.round(kb), vh: innerHeight, karten, tel: finde('071 755 88 61'), adresse: finde('Alte Landstrasse 63'), ort: finde('9445') };
  });
  await p.screenshot({ path: OUT + 'c04-kontakt-1440-viewport.png' });
  await p.goto(B + '/team/', { waitUntil: 'networkidle' }); await sleep(1200);
  R.C04team = await p.evaluate(() => { const i = document.querySelector('.leute--seite figure img'); const r = i.getBoundingClientRect(); return { erstesPortraitTop: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight }; });
  await p.screenshot({ path: OUT + 'c04-team-1440-viewport.png' });
  // andere Desktop-Höhe 1280x720
  await p.setViewportSize({ width: 1280, height: 720 }); await p.goto(B + '/kontakt/', { waitUntil: 'networkidle' }); await sleep(800);
  R.C04_1280x720 = await p.evaluate(() => [...document.querySelectorAll('.kontakt__karte')].slice(0, 3).map(k => Math.round(k.getBoundingClientRect().bottom)));
  await p.screenshot({ path: OUT + 'c04-kontakt-1280x720-viewport.png' });
  await c.close();
}

// ---- C05: Tesla 390
{
  const c = await ctx(b, 390, {}); const p = await c.newPage();
  await p.goto(B + '/tesla/', { waitUntil: 'networkidle' }); await sleep(1000);
  const zustand = () => p.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0 || r.width === 0) return false; return r.bottom > 0 && r.top < innerHeight; };
    const knoepfe = [...document.querySelectorAll('a, button')].filter(e => /schaden melden/i.test(e.textContent) && vis(e) && !e.closest('dialog')).map(e => { const r = e.getBoundingClientRect(); return { text: e.textContent.replace(/\s+/g, ' ').trim(), href: e.getAttribute('href'), ort: e.dataset.ort || '', top: Math.round(r.top), h: Math.round(r.height), bg: getComputedStyle(e).backgroundColor }; });
    const l = document.querySelector('.handyleiste'); const ls = getComputedStyle(l); const lr = l.getBoundingClientRect();
    return { body: document.body.className, leiste: { top: Math.round(lr.top), transform: ls.transform, vis: ls.visibility, opacity: ls.opacity, aria: l.getAttribute('aria-hidden'), inert: l.inert }, knoepfe, scrollY };
  });
  R.C05 = { oben: await zustand() };
  await p.screenshot({ path: OUT + 'c05-tesla-390-oben.png' });
  const heroUnten = await p.evaluate(() => { const k = [...document.querySelectorAll('main a')].find(a => /Tesla-Schaden melden/.test(a.textContent)); return k ? k.getBoundingClientRect().bottom + scrollY : null; });
  R.C05.heroKnopfUnten = heroUnten;
  // knapp: Hero-Knopf noch halb sichtbar
  await p.evaluate(y => window.scrollTo(0, y - 820), heroUnten); await sleep(700); R.C05.halb = await zustand();
  await p.evaluate(y => window.scrollTo(0, y + 50), heroUnten); await sleep(900); R.C05.nachHero = await zustand();
  await p.screenshot({ path: OUT + 'c05-tesla-390-nach-hero.png' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await sleep(900); R.C05.ende = await zustand();
  // Leisten-Knopf antippen
  await p.evaluate(y => window.scrollTo(0, y + 400), heroUnten); await sleep(900);
  await p.tap('.handyleiste a[data-ort="leiste"].knopf--akzent'); await p.waitForLoadState('networkidle'); await sleep(900);
  R.C05.ziel = { url: p.url(), art: await p.evaluate(() => (document.querySelector('input[name=art]:checked') || {}).value || null), tesla: await p.evaluate(() => { const t = document.querySelector('[name=fahrzeug], [data-tesla], #f-modell, [name=modell]'); return t ? { tag: t.tagName, name: t.name, wert: t.value, sichtbar: !!t.offsetParent } : null; }), hinweis: await p.evaluate(() => document.body.innerText.match(/[^\n]*Tesla[^\n]*/g)?.slice(0, 5)) };
  await p.screenshot({ path: OUT + 'c05-ziel-schaden-tesla-390.png' });
  // Schritt 1 wählen → Tesla-Feld in Schritt 2?
  await p.click('label.art:has(input[data-art=unfall])'); await sleep(800);
  R.C05.schritt2 = await p.evaluate(() => { const f = [...document.querySelectorAll('#schaden-form [data-schritt="2"] select, #schaden-form [data-schritt="2"] input')].filter(e => /tesla|modell|fahrzeug/i.test(e.name + e.id)).map(e => ({ name: e.name, id: e.id, typ: e.type, wert: e.type === 'radio' || e.type === 'checkbox' ? e.checked : e.value, sichtbar: !!e.offsetParent || !!e.closest('label')?.offsetParent })); return f; });
  await p.screenshot({ path: OUT + 'c05-ziel-schritt2-390.png', fullPage: false });
  await c.close();
}

// ---- C06: Start-Chips
R.C06 = {};
for (const w of [390, 1440]) {
  const c = await ctx(b, w, {}); const p = await c.newPage();
  await p.goto(B + '/schaden-melden/', { waitUntil: 'networkidle' });
  const arten = await p.$$eval('input[name="art"]', l => l.map(i => i.value));
  await p.goto(B + '/', { waitUntil: 'networkidle' }); await sleep(1200);
  const chips = await p.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const schnell = document.querySelector('.schnell, .schnell__liste')?.closest('section, div') || document;
    return { liste: [...document.querySelectorAll('.schnell__liste a')].map(a => ({ t: a.textContent.trim(), href: a.getAttribute('href'), vis: vis(a), wh: [Math.round(a.getBoundingClientRect().width), Math.round(a.getBoundingClientRect().height)] })), tesla: [...document.querySelectorAll('.schnell__tesla a')].map(a => ({ t: a.textContent.trim(), href: a.getAttribute('href'), inListe: !!a.closest('.schnell__liste') })), teslaInListe: [...document.querySelectorAll('.schnell__liste a')].some(a => /tesla/i.test(a.textContent + a.href)), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, listeSW: (() => { const l = document.querySelector('.schnell__liste'); return l ? [l.scrollWidth, l.clientWidth] : null; })() };
  });
  R.C06[w] = { arten, ...chips, gleich: JSON.stringify(arten) === JSON.stringify(chips.liste.map(x => x.t)) };
  await p.screenshot({ path: OUT + `c06-start-${w}-viewport.png` });
  const s = p.locator('.schnell__liste').first(); await s.scrollIntoViewIfNeeded();
  const box = await p.evaluate(() => { const l = document.querySelector('.schnell__liste'); const t = document.querySelector('.schnell__tesla'); const a = l.getBoundingClientRect(), z = (t || l).getBoundingClientRect(); return { x: 0, y: Math.max(0, a.top - 60), width: innerWidth, height: Math.min(innerHeight - Math.max(0, a.top - 60), z.bottom - a.top + 100) }; });
  await p.screenshot({ path: OUT + `c06-start-${w}-chips-ausschnitt.png`, clip: box });
  // Chip-Ziel prüfen: Felge
  await p.click('.schnell__liste a:has-text("Felge")'); await p.waitForLoadState('networkidle'); await sleep(700);
  R.C06[w].felgeZiel = { url: p.url(), art: await p.evaluate(() => (document.querySelector('input[name=art]:checked') || {}).value || null), schritt: await p.evaluate(() => [...document.querySelectorAll('#schaden-form [data-schritt]')].findIndex(s => !s.hidden) + 1) };
  await c.close();
}

// ---- C08 / N01 / N02: Rückruf Kontakt 390 und 1440
R.C08 = [];
for (const w of [390, 1440]) {
  const c = await ctx(b, w, { endpunkte: true, mock: { rueckruf: 'ok' }, verzoegerung: 600 }); const p = await c.newPage();
  await p.goto(B + '/kontakt/', { waitUntil: 'networkidle' });
  const f = p.locator('form[data-rueckruf]').first(); await f.scrollIntoViewIfNeeded();
  const zust = () => f.evaluate(form => {
    const rm = form.querySelector('[data-rueckmeldung]'); const s = getComputedStyle(rm);
    const felder = [...form.querySelectorAll('input[name=name], input[name=telefon]')].map(i => { const d = i.getAttribute('aria-describedby'); const ft = d ? d.split(' ').map(id => document.getElementById(id)).filter(Boolean).filter(e => !e.hidden && e.offsetParent).map(e => e.textContent.trim()).join(' | ') : ''; return { n: i.name, inv: i.getAttribute('aria-invalid'), fehler: ft, rand: getComputedStyle(i).borderColor }; });
    return { rm: rm.hidden ? '(hidden)' : rm.textContent.trim(), role: rm.getAttribute('role'), klasse: rm.className, bg: s.backgroundColor, farbe: s.color, felder, sichtbareFehler: [...form.querySelectorAll('.feld-fehler')].filter(e => !e.hidden && e.offsetParent).map(e => e.textContent.trim()) };
  });
  const z = { w };
  await f.locator('button[type=submit]').click(); await sleep(250);
  z.leer = await zust(); z.leerAktiv = await akt(p);
  if (w === 390) await f.screenshot({ path: OUT + 'c08-rueckruf-390-leer.png' });
  await f.locator('[name=name]').pressSequentially('Testperson QA', { delay: 20 }); await sleep(150);
  z.nachName = await zust();
  await f.locator('[name=telefon]').pressSequentially('079 12', { delay: 20 }); await sleep(150);
  z.telKurz = await zust();
  await f.locator('[name=telefon]').pressSequentially('3 45 67', { delay: 20 }); await sleep(150);
  z.telGut = await zust();
  if (w === 390) await f.screenshot({ path: OUT + 'c08-rueckruf-390-nach-korrektur.png' });
  await f.locator('button[type=submit]').click(); await sleep(100);
  z.laden = { ...(await zust()), busy: await f.locator('button[type=submit]').getAttribute('aria-busy'), disabled: await f.locator('button[type=submit]').isDisabled() };
  await f.locator('button[type=submit]').click({ timeout: 400 }).catch(() => {});
  await sleep(1400);
  z.ok = await zust(); z.okAktiv = await akt(p); z.posts = c.log.posts.filter(x => x.art === 'rueckruf').length;
  z.okKnopfDisabled = await f.locator('button[type=submit]').isDisabled();
  await f.screenshot({ path: OUT + `c08-rueckruf-${w}-erfolg.png` });
  await c.close();
  // Fehlerfall 500
  const c2 = await ctx(b, w, { endpunkte: true, mock: { rueckruf: '500' }, verzoegerung: 300 }); const p2 = await c2.newPage();
  await p2.goto(B + '/kontakt/', { waitUntil: 'networkidle' });
  const f2 = p2.locator('form[data-rueckruf]').first(); await f2.scrollIntoViewIfNeeded();
  await f2.locator('[name=name]').fill('Testperson QA'); await f2.locator('[name=telefon]').fill('079 000 00 00');
  await f2.locator('button[type=submit]').click(); await sleep(1200);
  z.fehler = await f2.evaluate(form => { const rm = form.querySelector('[data-rueckmeldung]'); const s = getComputedStyle(rm); const a = rm.querySelector('a[href^="tel:"]'); return { rm: rm.textContent.trim(), role: rm.getAttribute('role'), klasse: rm.className, bg: s.backgroundColor, farbe: s.color, tel: a && a.getAttribute('href') }; });
  z.fehlerAktiv = await p2.evaluate(() => { const a = document.activeElement; return a.tagName + ' ' + a.textContent.trim().slice(0, 30); });
  await f2.screenshot({ path: OUT + `c08-rueckruf-${w}-fehler-500.png` });
  await c2.close();
  R.C08.push(z);
}
// N01 auf Flotten und Occasionen (390)
R.N01 = [];
for (const pfad of ['/flotten/', '/occasionen/']) {
  const c = await ctx(b, 390, { endpunkte: true, mock: { rueckruf: 'ok' }, verzoegerung: 300 }); const p = await c.newPage();
  await p.goto(B + pfad, { waitUntil: 'networkidle' }); const f = p.locator('form[data-rueckruf]').first(); await f.scrollIntoViewIfNeeded();
  await f.locator('[name=name]').fill('Testperson QA'); await f.locator('[name=telefon]').fill('079 000 00 00');
  await f.locator('button[type=submit]').focus(); await p.keyboard.press('Enter'); await sleep(1200);
  R.N01.push({ pfad, aktiv: await akt(p), rm: await f.locator('[data-rueckmeldung]').textContent() });
  await c.close();
}

// ---- C09: Tesla Modelle
R.C09 = {};
for (const w of [390, 1440]) {
  const c = await ctx(b, w, {}); const p = await c.newPage();
  await p.goto(B + '/tesla/', { waitUntil: 'networkidle' }); await sleep(800);
  R.C09[w] = await p.evaluate(() => {
    const li = [...document.querySelectorAll('.tesla__liste--modelle li')]; const s = li[0] ? getComputedStyle(li[0]) : null;
    const spalten = [...document.querySelectorAll('.tesla-infos__zwei > div')].map(d => { const r = d.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)]; });
    const sek = document.querySelector('.tesla-infos'); const sr = sek.getBoundingClientRect();
    const letzte = [...sek.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim()).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);
    const faq = document.querySelector('.faq h2'); const fr = faq.getBoundingClientRect();
    const chipsArtig = [...document.querySelectorAll('.tesla-infos span, .tesla-infos li')].filter(e => { const st = getComputedStyle(e); return st.borderStyle !== 'none' && parseFloat(st.borderWidth) > 0 && parseFloat(st.borderRadius) > 8; }).length;
    return { modelle: li.map(l => l.textContent.trim()), liStil: s && { bg: s.backgroundColor, border: s.border, radius: s.borderRadius, cursor: s.cursor, display: s.display }, interaktivInModellen: document.querySelectorAll('.tesla__liste--modelle a, .tesla__liste--modelle button').length, chipsArtig, spalten, sekBottom: Math.round(sr.bottom + scrollY), letzterText: Math.round(letzte + scrollY), faqTop: Math.round(fr.top + scrollY), luecke: Math.round(fr.top - letzte) };
  });
  const y = R.C09[w].spalten[0] ? R.C09[w].spalten[0][1] - 200 : 0;
  await p.evaluate(y => window.scrollTo(0, y), y); await sleep(700);
  await p.screenshot({ path: OUT + `c09-tesla-${w}-modelle.png` });
  await c.close();
}

// ---- C10: H1 Leistungsseiten 1440 (Zeilen via Range-Rects)
R.C10 = [];
{
  const c = await ctx(b, 1440, {}); const p = await c.newPage();
  for (const s of ['unfall-carrosserie', 'hagel-dellen', 'lack', 'felgen', 'folierung', 'scheiben']) {
    await p.goto(B + `/leistungen/${s}/`, { waitUntil: 'networkidle' }); await sleep(600);
    R.C10.push({ s, ...(await p.evaluate(() => { const h = document.querySelector('h1'); const rg = document.createRange(); rg.selectNodeContents(h); const tops = [...new Set([...rg.getClientRects()].map(r => Math.round(r.top)))]; const zeilen = tops.filter((t, i) => i === 0 || t - tops[i - 1] > 10).length; return { text: h.textContent.trim(), zeilen, hoehe: Math.round(h.getBoundingClientRect().height), lh: getComputedStyle(h).lineHeight, fs: getComputedStyle(h).fontSize }; })) });
    if (s === 'unfall-carrosserie') await p.screenshot({ path: OUT + 'c10-unfall-1440-viewport.png' });
  }
  await c.close();
}

// ---- N04, N05, N06, N07
R.N = {};
{
  const c = await ctx(b, 1440, {}); const p = await c.newPage();
  await p.goto(B + '/kontakt/', { waitUntil: 'networkidle' });
  R.N.N04 = await p.$$eval('.fuss-woche__heute', l => l.map(e => getComputedStyle(e).color));
  R.N.N06 = [];
  for (const pfad of ['/', '/schaden-melden/', '/leistungen/', '/tesla/', '/kontakt/', '/team/']) {
    await p.goto(B + pfad, { waitUntil: 'networkidle' }); await sleep(400);
    R.N.N06.push({ pfad, ...(await p.evaluate(() => { const v = document.querySelector('[data-vorschau]'); if (!v) return { fehlt: true }; const s = getComputedStyle(v); return { pos: s.position, vor: v.previousElementSibling && v.previousElementSibling.tagName, text: v.textContent.trim().slice(0, 60) }; })) });
  }
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await sleep(500);
  await p.screenshot({ path: OUT + 'n06-team-1440-seitenende.png' });
  await p.goto(B + '/schaden-melden/', { waitUntil: 'networkidle' }); await sleep(800);
  await p.screenshot({ path: OUT + 'n06-schaden-1440-viewport.png' });
  await p.goto(B + '/team/', { waitUntil: 'networkidle' }); await sleep(800);
  R.N.N07 = await p.$$eval('.leute--seite[data-anzahl="1"] figure', l => l.map(f => { const bi = f.querySelector('img, .leute__leer').getBoundingClientRect(), t = f.querySelector('figcaption').getBoundingClientRect(); return { neben: t.left >= bi.right, mitte: Math.round(Math.abs((t.top + t.bottom) / 2 - (bi.top + bi.bottom) / 2)), bild: [Math.round(bi.width), Math.round(bi.height)] }; }));
  const g = p.locator('.leute--seite[data-anzahl="1"]').first(); if (await g.count()) { await g.scrollIntoViewIfNeeded(); await sleep(1500); const box = await g.boundingBox(); await p.screenshot({ path: OUT + 'n07-team-1440-einzelperson.png', clip: { x: 0, y: Math.max(0, box.y - 300), width: 1440, height: Math.min(900, box.height + 360) } }); }
  await c.close();
}
for (const w of [390]) {
  const c = await ctx(b, w, {}); const p = await c.newPage();
  for (const [pfad, sel] of [['/kontakt/', 'form[data-rueckruf] .hilfe a'], ['/flotten/', 'form[data-rueckruf] .hilfe a'], ['/occasionen/', 'form[data-rueckruf] .hilfe a'], ['/schaden-melden/?art=hagel', '.senden .hilfe a']]) {
    await p.goto(B + pfad, { waitUntil: 'networkidle' }); await sleep(600);
    const r = await p.evaluate(sel => { const a = document.querySelector(sel); if (!a) return null; const h = a.closest('.hilfe'); const rg = document.createRange(); rg.selectNodeContents(h); const tops = [...new Set([...rg.getClientRects()].map(x => Math.round(x.top)))].sort((x, y) => x - y); const abst = tops.slice(1).map((t, i) => t - tops[i]); return { display: getComputedStyle(a).display, h: Math.round(a.getBoundingClientRect().height), zeilenAbstaende: abst, deko: getComputedStyle(a).textDecorationLine }; }, sel);
    (R.N.N05 ||= []).push({ pfad, ...r });
    if (pfad === '/kontakt/') { const h = p.locator(sel).first(); await h.scrollIntoViewIfNeeded(); await p.locator('form[data-rueckruf] .hilfe').first().screenshot({ path: OUT + 'n05-kontakt-390-hilfe.png' }); }
  }
  await c.close();
}
console.log(JSON.stringify(R, null, 1)); await b.close();
