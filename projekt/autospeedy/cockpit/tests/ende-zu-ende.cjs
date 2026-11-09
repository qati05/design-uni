// Ende-zu-Ende gegen das Demo-Cockpit auf 4400 (frisch gestartet, siehe LIESMICH). Aufruf: node tests/ende-zu-ende.cjs <ordner>
// <ordner>/testfotos/a.jpg und b.jpg müssen existieren; Bildschirmfotos landen in <ordner>/e2e/.
const { chromium } = require('playwright');
const fs = require('node:fs');
const S=process.argv[2], C='http://localhost:4400';
fs.mkdirSync(S+'/e2e',{recursive:true});
const ok=(b,t)=>{ if(!b) throw new Error('FEHLER: '+t); console.log('ok  '+t); };
async function mailCode(b, an){ const p=await (await b.newContext()).newPage(); await p.goto(C+'/demo/postfach'); const t=await p.textContent('.postfach'); await p.close(); const re=new RegExp('An '+an.replace(/[.@]/g,'\\$&')+'[\\s\\S]*?Ihr Code: (\\d{6})'); return (t.match(re)||[])[1]; }
async function mailSchritt(b, c, an){ await c.goto(C+'/login'); await c.fill('#email',an); await c.click('button[type=submit]'); await c.waitForSelector('#code'); const code=await mailCode(b,an); await c.fill('#code',code); await c.click('button[type=submit]'); await c.waitForURL((u)=>u.pathname!=='/login'); }
(async()=>{const b=await chromium.launch();
 // Ohne Anmeldung: zum Login
 const a=await (await b.newContext()).newPage(); await a.goto(C+'/'); ok(new URL(a.url()).pathname==='/login','ohne Anmeldung: Login');
 // Handy der Werkstatt: Mail-Code genügt, Startseite ist «Website pflegen»
 const hc=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}); const h=await hc.newPage();
 await mailSchritt(b,h,'werkstatt@autospeedy.example'); await h.waitForURL(C+'/'); ok(/Website pflegen/.test(await h.textContent('h1')),'mit Mail-Code direkt auf «Website pflegen»');
 const ck=(await hc.cookies()).find(c=>c.name==='as_demo_sitzung'); ok(ck && ck.httpOnly && ck.expires-Date.now()/1000>29*86400,'Sitzung httpOnly, 30 Tage auf diesem Gerät');
 ok(await h.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Handy: kein seitliches Scrollen');
 ok((await h.$$('.sprung a')).length===6 && !(await h.$('.kopf-nav')),'Sprungmarken zu den Abschnitten, keine Bereichs-Leiste mehr');
 await h.screenshot({path:S+'/e2e/1-start-handy.png'});
 const kopf=await (await h.request.get(C+'/')).headers(); ok(/nonce-/.test(kopf['content-security-policy']||'') && kopf['x-frame-options']==='DENY' && kopf['cache-control']==='no-store','Sicherheits-Header: Nonce-CSP, DENY, no-store');
 // Entfernte Teile gibt es nicht mehr
 for (const p of ['/zahlen','/meldung/beispiel01','/studio','/auftrag/'+'a'.repeat(64),'/mfa']) { const r=await h.goto(C+p); ok(r.status()===404,'entfernt: '+p+' → 404'); }
 const apiGet=await h.request.get(C+'/api/meldung'); ok(apiGet.status()===404,'entfernt: /api/meldung → 404');
 // Ein Formular-POST auf einen Pfad ohne Route hält Next für eine Server Action: 400, nichts gespeichert.
 const api=await h.request.post(C+'/api/meldung',{multipart:{art:'Hagel'}}); ok([400,404].includes(api.status()) && !/"ok":true/.test(await api.text()),'entfernt: POST /api/meldung nimmt nichts an ('+api.status()+')');
 const alt=await h.goto(C+'/pflege'); ok(new URL(h.url()).pathname==='/' && alt.status()===200,'alter Link /pflege führt auf die Startseite');
 // Konto ohne Mitgliedschaft: 403 gleich nach dem Mail-Code, kein Fingerabdruck
 const g=await (await b.newContext()).newPage(); await mailSchritt(b,g,'fremd@beispiel.example');
 const r403=await g.goto(C+'/'); ok(r403.status()===403 && /Kein Zugang/.test(await g.textContent('h1')),'Konto ohne Mitgliedschaft: 403');
 // Pflege
 await h.goto(C+'/'); ok(/Mo bis Fr 7.30 bis 12.00/.test(await h.textContent('main')),'Pflege zeigt heutige Zeiten');
 await h.fill('[name="zeit.0.bis2"]','25.00'); await h.click('button:has-text("Speichern")'); await h.waitForSelector('.speichern-leiste [role=alert]');
 ok(/Öffnungszeiten, Zeile 1/.test(await h.textContent('.speichern-leiste')),'unsinnige Zeit: verständliche Meldung mit Ort');
 await h.fill('[name="zeit.0.bis2"]','16.00'); await h.click('button:has-text("Hinweis hinzufügen")'); await h.fill('[name="hin.0.text"]','Hagel? Jetzt melden.'); await h.fill('[name="hin.0.bis"]','2099-12-31');
 await h.fill('[name="aus.0.datum"]','2026-12-24'); await h.fill('[name="aus.0.name"]','Heiligabend'); await h.selectOption('[name="aus.0.art"]','offen'); await h.fill('[name="aus.0.von"]','7.30'); await h.fill('[name="aus.0.bis"]','12.00');
 await h.click('button:has-text("Speichern")'); await h.waitForSelector('.ok-text'); ok(/Gespeichert/.test(await h.textContent('.ok-text')),'Pflege gespeichert');
 await h.reload(); ok(/Mo bis Fr 7.30 bis 12.00 und 13.15 bis 16.00 Uhr/.test(await h.textContent('main')) && (await h.inputValue('[name="aus.0.name"]'))==='Heiligabend' && (await h.inputValue('[name="hin.0.text"]'))==='Hagel? Jetzt melden.','nach Neuladen: neue Zeit, Heiligabend, Hinweis an');
 ok(/zuletzt geändert.*werkstatt@autospeedy.example/i.test(await h.textContent('main')),'wer zuletzt geändert hat, steht dabei');
 await h.click('.sprung a[href="#ausnahmen"]'); await h.waitForTimeout(300); ok(new URL(h.url()).hash==='#ausnahmen' && await h.evaluate(()=>{const r=document.getElementById('ausnahmen').getBoundingClientRect(); return r.top>=0 && r.top<window.innerHeight;}),'Sprungmarke führt zum Abschnitt');
 // Teamfotos
 await h.click('summary:has-text("Team auf der Website")');
 ok(await h.getAttribute('img[alt="Foto Lea Schlegel"]','src')==='/bilder/team/lea-schlegel.webp','Team: Porträts von der bisherigen Website');
 // Felder über die Person, nicht über die Position: die Reihenfolge im Team ändert sich mit site.json.
 const LEA='.zeile-person:has(img[alt="Foto Lea Schlegel"])';
 await h.setInputFiles(LEA+' input[type=file]',S+'/testfotos/a.jpg'); await h.waitForTimeout(600);
 ok((await h.getAttribute('img[alt="Foto Lea Schlegel"]','src')).startsWith('blob:'),'neues Foto: Vorschau sofort, im Browser verkleinert');
 await h.setInputFiles('[name="team.0.p.0.fotoneu"]',{name:'kein-bild.jpg',mimeType:'image/jpeg',buffer:Buffer.from('<svg onload=alert(1)>')}); await h.waitForTimeout(400);
 ok(/lässt sich nicht lesen/.test(await h.textContent('.fotofeld')),'kein Bild (getarnt als .jpg): abgewiesen');
 await h.click('button:has-text("Person hinzufügen") >> nth=1'); const NEU=h.locator('.team-gruppe').nth(1).locator('.zeile-person').last();
 await NEU.locator('input[name$=".name"]').fill('Neue Person (Test)'); await NEU.locator('input[name$=".rolle"]').fill('Lernende');
 await NEU.locator('input[type=file]').setInputFiles(S+'/testfotos/b.jpg'); await h.waitForTimeout(600);
 await h.click('button:has-text("Speichern")'); await h.waitForSelector('.ok-text'); await h.reload(); await h.click('summary:has-text("Team auf der Website")');
 const lea=await h.getAttribute('img[alt="Foto Lea Schlegel"]','src'), neu=await h.getAttribute('img[alt="Foto Neue Person (Test)"]','src');
 ok(/^\/api\/demo-foto\/[0-9a-f-]{36}\.webp$/.test(lea) && /^\/api\/demo-foto\/[0-9a-f-]{36}\.webp$/.test(neu),'nach Speichern: beide Fotos im Bild-Speicher (nicht im Git), nur der Verweis in site.json');
 const groesse=(await h.evaluate(async(u)=>(await (await fetch(u)).arrayBuffer()).byteLength, lea)); ok(groesse>0 && groesse<200000,'Foto klein (WebP, '+Math.round(groesse/1024)+' KB) und abrufbar');
 await h.check(LEA+' input[name$=".fotoweg"]'); await h.click('button:has-text("Speichern")'); await h.waitForSelector('.ok-text'); await h.waitForTimeout(300);
 ok((await h.evaluate(async(u)=>(await fetch(u)).status, lea))===404,'Foto entfernen löscht das Bild wirklich aus dem Speicher');
 await h.screenshot({path:S+'/e2e/2-team-handy.png',fullPage:false});
 // Konfliktschutz: zwei Fenster, beide speichern
 const h2=await hc.newPage(); await h2.goto(C+'/'); await h.goto(C+'/');
 await h.click('button:has-text("Speichern")'); await h.waitForSelector('.ok-text');
 await h2.click('button:has-text("Speichern")'); await h2.waitForSelector('[role=alert]');
 ok(/jemand anderes gespeichert/.test(await h2.textContent('main')),'zwei Fenster: das zweite überschreibt nicht, sondern meldet den Konflikt'); await h2.close();
 // App
 const m=await (await b.newContext()).newPage(); const mr=await m.goto(C+'/manifest.webmanifest'); const mj=await mr.json(); ok(mj.display==='standalone' && mj.icons.length===3 && /Website pflegen/.test(mj.description),'Manifest: installierbar als App');
 ok((await m.goto(C+'/sw.js')).status()===200 && (await m.goto(C+'/offline.html')).status()===200,'Service Worker und Offline-Seite ohne Login');
 await h.goto(C+'/'); await h.waitForTimeout(800); ok(await h.evaluate(async()=>!!(await navigator.serviceWorker.getRegistration())),'Service Worker angemeldet');
 // Computer
 const d=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); await mailSchritt(b,d,'werkstatt@autospeedy.example'); await d.waitForURL(C+'/');
 await d.screenshot({path:S+'/e2e/3-start-computer.png'}); ok(/Website pflegen/.test(await d.textContent('h1')),'Computer: gleiches Konto, eigene Anmeldung mit Mail-Code');
 // Abmelden
 await h.click('button:has-text("Abmelden")'); await h.waitForURL(C+'/login'); await h.goto(C+'/'); ok(new URL(h.url()).pathname==='/login','Abmelden: danach wieder Login');
 await b.close(); console.log('ALLES GRÜN');
})().catch(e=>{console.error(e.message);process.exit(1)});
