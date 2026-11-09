import { browser, ctx, B, OUT, sleep } from './gemein.mjs';
const b = await browser(); const R = [];
for (const [n, pfad] of [['start','/'],['bewerten','/bewerten/'],['kontakt','/kontakt/'],['tesla','/tesla/']]) {
  const c = await ctx(b, 390, {}); const p = await c.newPage();
  await p.goto(B + pfad, { waitUntil: 'networkidle' }); await sleep(1200);
  const a = await p.evaluate(() => ({ y: scrollY, sb: getComputedStyle(document.documentElement).scrollBehavior, h1: Math.round(document.querySelector('h1').getBoundingClientRect().top) }));
  await p.screenshot({ path: OUT + `oben-${n}-390-frisch.png` });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } window.scrollTo(0, 0); });
  const b1 = await p.evaluate(() => scrollY); await sleep(1500); const b2 = await p.evaluate(() => scrollY);
  R.push({ n, frisch: a, direktNachScrollTo0: b1, nach1500: b2 }); await c.close();
}
console.log(JSON.stringify(R)); await b.close();
