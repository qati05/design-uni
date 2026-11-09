import { browser, ctx, B, OUT, sleep, ueberlauf } from './gemein.mjs';
const b = await browser(); const R = [];
const akt = p => p.evaluate(() => { const a = document.activeElement; return a.tagName + (a.id ? '#' + a.id : '') + ' "' + (a.textContent || a.value || '').trim().slice(0, 40) + '"'; });
for (const [seite, pfad] of [['kontakt', '/kontakt/'], ['flotten', '/flotten/'], ['occasionen', '/occasionen/']]) {
  for (const m of ['ok', 'okfalse', 'leer', '500', 'netz']) {
    for (const w of (seite === 'kontakt' ? [390, 1440] : [390])) {
      if (w === 1440 && !['ok', '500'].includes(m)) continue;
      const c = await ctx(b, w, { endpunkte: true, mock: { rueckruf: m }, verzoegerung: 500 }); const p = await c.newPage();
      await p.goto(B + pfad, { waitUntil: 'networkidle' });
      const f = p.locator('form[data-rueckruf]').first();
      const ep = await f.getAttribute('data-endpunkt');
      const gets = c.log.posts.length;
      await f.scrollIntoViewIfNeeded();
      const z = { seite, m, w, ep };
      if (m === 'ok') {
        // Validierung
        await f.locator('button[type=submit]').click(); await sleep(200);
        z.leer = { text: await f.locator('[data-rueckmeldung]').textContent(), role: await f.locator('[data-rueckmeldung]').getAttribute('role'), aktiv: await akt(p), ariaInvalid: await f.locator('[aria-invalid=true]').count() };
        if (w === 390 && seite === 'kontakt') await f.screenshot({ path: OUT + 'rueckruf-kontakt-390-leer-fehler.png' });
        await f.locator('[name=name]').fill('Testperson QA'); await f.locator('[name=telefon]').fill('12ab'); await f.locator('button[type=submit]').click(); await sleep(200);
        z.telFalsch = await f.locator('[data-rueckmeldung]').textContent();
      }
      await f.locator('[name=name]').fill('Testperson QA'); await f.locator('[name=telefon]').fill('079 000 00 00');
      // Zeitwahl: Mo Vormittag, Mi Nachmittag antippen; Mi Nachmittag zweimal = ab
      const feld = (tag, teil) => f.locator(`label.zeitwahl__feld:has(input[value="${tag} ${teil}"])`);
      const box = await feld('Montag', 'Vormittag').boundingBox();
      z.feldGroesse = box && [Math.round(box.width), Math.round(box.height)];
      if (w === 390) { await feld('Montag', 'Vormittag').tap(); await feld('Mittwoch', 'Nachmittag').tap(); await feld('Freitag', 'Nachmittag').tap(); await feld('Freitag', 'Nachmittag').tap(); }
      else { await feld('Montag', 'Vormittag').click(); await feld('Mittwoch', 'Nachmittag').click(); await feld('Freitag', 'Nachmittag').click(); await feld('Freitag', 'Nachmittag').click(); }
      z.gewaehlt = await f.locator('input[name=zeit]:checked').evaluateAll(es => es.map(e => e.value));
      if (m === 'ok' && seite === 'kontakt' && w === 390) await f.screenshot({ path: OUT + 'rueckruf-kontakt-390-zeitwahl.png' });
      await f.locator('button[type=submit]').click(); await sleep(60);
      z.laden = await f.locator('[data-rueckmeldung]').textContent();
      z.ladenKnopfDisabled = await f.locator('button[type=submit]').isDisabled();
      await f.locator('button[type=submit]').click({ timeout: 500 }).catch(() => {});
      await sleep(1500);
      z.ergebnis = await f.locator('[data-rueckmeldung]').textContent();
      z.role = await f.locator('[data-rueckmeldung]').getAttribute('role');
      z.knopfDisabled = await f.locator('button[type=submit]').isDisabled();
      z.aktiv = await akt(p);
      const posts = c.log.posts.filter(x => x.art === 'rueckruf');
      z.posts = posts.length; z.postUrl = posts[0] && posts[0].url;
      z.body = posts[0] && [...posts[0].body.matchAll(/name="([^"]+)"\r\n\r\n([^\r]*)/g)].map(x => x[1] + '=' + x[2]).join('; ');
      z.ueberlauf = await ueberlauf(p);
      R.push(z);
      await f.screenshot({ path: OUT + `rueckruf-${seite}-${w}-mock-${m}.png` });
      await c.close();
    }
  }
}
// Zeitwahl 320 Masse
{ const c = await ctx(b, 320, {}); const p = await c.newPage(); await p.goto(B + '/kontakt/', { waitUntil: 'networkidle' });
  const f = p.locator('form[data-rueckruf]'); await f.locator('.zeitwahl').scrollIntoViewIfNeeded();
  R.push({ zeit320: await f.locator('label.zeitwahl__feld').evaluateAll(es => es.map(e => { const r = e.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); }).join(' ')), ueberlauf: await ueberlauf(p) });
  await f.locator('.zeitwahl').screenshot({ path: OUT + 'rueckruf-kontakt-320-zeitwahl.png' });
  // Tastatur in Zeitwahl
  await f.locator('input[value="Montag Vormittag"]').focus(); await p.keyboard.press('Space'); await p.keyboard.press('Tab'); await p.keyboard.press('Space');
  R.push({ tastaturZeit: await f.locator('input[name=zeit]:checked').evaluateAll(es => es.map(e => e.value)), fokusSichtbar: await p.evaluate(() => { const l = document.activeElement.closest('label'); const s = getComputedStyle(l.querySelector('.zeitwahl__marke')); return { outline: s.outlineStyle + ' ' + s.outlineWidth, box: s.boxShadow.slice(0, 60) }; }) });
  await f.locator('.zeitwahl').screenshot({ path: OUT + 'rueckruf-kontakt-320-zeitwahl-tastatur.png' });
  await c.close(); }
console.log(JSON.stringify(R, null, 1)); await b.close();
