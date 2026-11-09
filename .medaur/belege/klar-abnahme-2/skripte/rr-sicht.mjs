import { browser, ctx, B, OUT, sleep } from './gemein.mjs';
const b = await browser(); const R = [];
for (const [pfad, w] of [['/kontakt/', 390], ['/flotten/', 390], ['/occasionen/', 390], ['/kontakt/', 320]]) {
  const c = await ctx(b, w, { endpunkte: true, mock: { rueckruf: '500' }, verzoegerung: 300 }); const p = await c.newPage();
  await p.goto(B + pfad, { waitUntil: 'networkidle' }); const f = p.locator('form[data-rueckruf]').first();
  await f.locator('[name=name]').fill('Testperson QA'); await f.locator('[name=telefon]').fill('079 000 00 00');
  await f.locator('button[type=submit]').tap(); await sleep(1300);
  R.push({ pfad, w, ...(await f.evaluate(form => { const rm = form.querySelector('[data-rueckmeldung]').getBoundingClientRect(); const k = form.querySelector('button[type=submit]').getBoundingClientRect(); const l = document.querySelector('.handyleiste'); const lt = l && document.body.classList.contains('leiste-an') ? l.getBoundingClientRect().top : innerHeight; return { knopf: [Math.round(k.top), Math.round(k.bottom)], meldung: [Math.round(rm.top), Math.round(rm.bottom)], vh: innerHeight, leisteTop: Math.round(lt), body: document.body.className }; })) });
  await p.screenshot({ path: OUT + `rueckruf-${pfad.replace(/\//g, '')}-${w}-fehler-viewport.png` });
  await c.close();
}
console.log(JSON.stringify(R)); await b.close();
