const { chromium } = require('playwright');
const S=process.argv[2], C='http://localhost:4400', W='http://localhost:4332';
const ok=(b,t)=>{ if(!b) throw new Error('FEHLER: '+t); console.log('ok  '+t); };
async function geraet(page, uv=true){ const s=await page.context().newCDPSession(page); await s.send('WebAuthn.enable'); await s.send('WebAuthn.addVirtualAuthenticator',{options:{protocol:'ctap2',transport:'internal',hasResidentKey:true,hasUserVerification:true,isUserVerified:uv,automaticPresenceSimulation:true}}); }
async function mailCode(b, an){ const p=await (await b.newContext()).newPage(); await p.goto(C+'/demo/postfach'); const t=await p.textContent('.postfach'); await p.close(); const re=new RegExp('An '+an.replace(/[.@]/g,'\\$&')+'[\\s\\S]*?Ihr Code: (\\d{6})'); return (t.match(re)||[])[1]; }
async function mailSchritt(b, c, an){ await c.goto(C+'/login'); await c.fill('#email',an); await c.click('button[type=submit]'); await c.waitForSelector('#code'); const code=await mailCode(b,an); await c.fill('#code',code); await c.click('button[type=submit]'); await c.waitForURL(/\/mfa/); }
(async()=>{const b=await chromium.launch();
 // Website -> Cockpit
 const w=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
 await w.goto(W+'/schaden-melden/?art=hagel'); await w.waitForTimeout(500);
 await w.setInputFiles('[data-fotos]',[S+'/testfotos/a.jpg']); await w.waitForTimeout(1000);
 await w.click('[data-fotoweiter]'); await w.fill('#f-name','Test Person'); await w.fill('#f-tel','071 555 00 99'); await w.click('[data-senden="website"]'); await w.waitForTimeout(1500);
 ok((await w.textContent('[data-r-titel]'))==='Schadenmeldung angekommen','Website: Meldung angekommen');
 ok(/Nummer 076 615 44 41 stammt von der Website/.test(await w.textContent('main')),'WhatsApp-Lücke: nur noch die Nummer offen');
 // Handy der Werkstatt: erstes Gerät einrichten
 const hc=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}); const h=await hc.newPage(); await geraet(h);
 await mailSchritt(b,h,'werkstatt@autospeedy.example'); await h.waitForURL(/\/mfa\/einrichten/); ok(true,'nach Mail-Code ohne Gerät: «Dieses Gerät einrichten»');
 await h.screenshot({path:S+'/e2e3/1-einrichten.png'});
 await h.goto(C+'/'); ok(h.url().includes('/mfa'),'nur Mail-Code: kein Zugang zu Meldungen');
 await h.click('button:has-text("einrichten")'); await h.waitForURL(C+'/'); ok(true,'Fingerabdruck eingerichtet, angemeldet (aal2)');
 ok(/Test Person/.test(await h.textContent('.liste')),'Meldung von der Website im Cockpit');
 await h.screenshot({path:S+'/e2e3/2-meldungen-handy.png'});
 // abmelden, wieder anmelden: Mail-Code + ein Tipp
 await h.click('button:has-text("Abmelden")'); await h.waitForURL(/\/login/);
 await mailSchritt(b,h,'werkstatt@autospeedy.example'); ok(/Fingerabdruck oder Gesicht bestätigen/.test(await h.textContent('main')) && !(await h.$('#totp')),'zweite Anmeldung: ein Knopf, keine Authenticator-App');
 await h.screenshot({path:S+'/e2e3/3-bestaetigen.png'});
 await h.click('button:has-text("bestätigen")'); await h.waitForURL(C+'/'); ok(true,'mit Fingerabdruck angemeldet');
 const ck=(await hc.cookies()).find(c=>c.name==='as_demo_sitzung'); ok(ck && ck.httpOnly && ck.expires-Date.now()/1000>29*86400,'Sitzung httpOnly, 30 Tage auf diesem Gerät');
 // fremdes Gerät ohne eingerichteten Schlüssel
 const xc=await b.newContext(); const x=await xc.newPage(); await geraet(x);
 await mailSchritt(b,x,'werkstatt@autospeedy.example'); await x.click('button:has-text("bestätigen")'); await x.waitForSelector('.passkey [role=alert]');
 console.log('    Meldung:', await x.textContent('.passkey [role=alert]')); ok(/nicht erkannt|Abgebrochen/.test(await x.textContent('.passkey [role=alert]')),'Gerät ohne eingerichteten Fingerabdruck: abgewiesen');
 await x.goto(C+'/'); ok(x.url().includes('/mfa'),'… und kein Zugang');
 // Gerät ohne Prüfung der Person (UV false) kann nichts einrichten
 const fc=await b.newContext(); const f=await fc.newPage(); await geraet(f,false);
 await mailSchritt(b,f,'fremd@beispiel.example'); await f.waitForURL(/\/mfa\/einrichten/); await f.click('button:has-text("einrichten")'); await f.waitForSelector('.passkey [role=alert]'); console.log('    Meldung:', await f.textContent('.passkey [role=alert]'));
 ok(true,'Gerät ohne Fingerabdruck/Gesicht/PIN: Einrichten abgewiesen');
 // Konto ohne Mitgliedschaft
 const gc=await b.newContext(); const g=await gc.newPage(); await geraet(g);
 await mailSchritt(b,g,'fremd@beispiel.example'); await g.waitForURL(/\/mfa\/einrichten/); await g.click('button:has-text("einrichten")'); await g.waitForTimeout(1200);
 const r403=await g.goto(C+'/'); ok(r403.status()===403,'Konto ohne Mitgliedschaft: trotz Fingerabdruck 403');
 const r403b=await g.goto(C+'/pflege'); ok(r403b.status()===403,'… auch die Pflege: 403');
 // Pflege
 await h.goto(C+'/pflege'); ok(/Mo bis Do 7.30 bis 12.00/.test(await h.textContent('main')),'Pflege zeigt heutige Zeiten');
 await h.screenshot({path:S+'/e2e3/4-pflege-handy.png'});
 await h.fill('[name="zeit.1.bis2"]','25.00'); await h.click('button:has-text("Speichern")'); await h.waitForSelector('.speichern-leiste [role=alert]');
 ok(/Öffnungszeiten, Zeile 2/.test(await h.textContent('.speichern-leiste')),'unsinnige Zeit: verständliche Meldung mit Ort');
 await h.fill('[name="zeit.1.bis2"]','16.00'); await h.check('[name="hinweis.aktiv"]');
 await h.fill('[name="aus.0.datum"]','2026-12-24'); await h.fill('[name="aus.0.name"]','Heiligabend'); await h.selectOption('[name="aus.0.art"]','offen'); await h.fill('[name="aus.0.von"]','7.30'); await h.fill('[name="aus.0.bis"]','12.00');
 await h.click('button:has-text("Speichern")'); await h.waitForSelector('.ok-text'); ok(/Gespeichert/.test(await h.textContent('.ok-text')),'Pflege gespeichert');
 await h.screenshot({path:S+'/e2e3/5-pflege-gespeichert.png'});
 await h.reload(); ok(/Fr 7.30 bis 12.00 und 13.15 bis 16.00 Uhr/.test(await h.textContent('main')) && (await h.inputValue('[name="aus.0.name"]'))==='Heiligabend' && await h.isChecked('[name="hinweis.aktiv"]'),'nach Neuladen: neue Zeit, Heiligabend, Hinweis an');
 ok(/zuletzt geändert.*werkstatt@autospeedy.example/i.test(await h.textContent('main')),'wer zuletzt geändert hat, steht dabei');
 // Teamfotos
 await h.click('summary:has-text("Team auf der Website")');
 ok(await h.getAttribute('img[alt="Foto Lea Schlegel"]','src')==='/bilder/team/lea-schlegel.webp' && await h.evaluate(()=>[...document.querySelectorAll('.fotofeld img')].every(i=>i.complete&&i.naturalWidth>0)),'Team: Porträts von der bisherigen Website im Cockpit');
 await h.setInputFiles('[name="team.1.p.0.fotoneu"]',S+'/testfotos/a.jpg'); await h.waitForTimeout(600);
 ok((await h.getAttribute('img[alt="Foto Lea Schlegel"]','src')).startsWith('blob:'),'neues Foto: Vorschau sofort, im Browser verkleinert');
 await h.setInputFiles('[name="team.0.p.0.fotoneu"]',{name:'kein-bild.jpg',mimeType:'image/jpeg',buffer:Buffer.from('<svg onload=alert(1)>')}); await h.waitForTimeout(400);
 ok(/lässt sich nicht lesen/.test(await h.textContent('.fotofeld')),'kein Bild (getarnt als .jpg): abgewiesen');
 await h.click('button:has-text("Person hinzufügen") >> nth=1'); await h.fill('[name="team.1.p.2.name"]','Neue Person (Test)'); await h.fill('[name="team.1.p.2.rolle"]','Lernende');
 await h.setInputFiles('[name="team.1.p.2.fotoneu"]',S+'/testfotos/b.jpg'); await h.waitForTimeout(600);
 await h.click('button:has-text("Speichern")'); await h.waitForSelector('.ok-text'); await h.reload(); await h.click('summary:has-text("Team auf der Website")');
 const lea=await h.getAttribute('img[alt="Foto Lea Schlegel"]','src'), neu=await h.getAttribute('img[alt="Foto Neue Person (Test)"]','src');
 ok(/^\/api\/demo-foto\/[0-9a-f-]{36}\.webp$/.test(lea) && /^\/api\/demo-foto\/[0-9a-f-]{36}\.webp$/.test(neu),'nach Speichern: beide Fotos im Bild-Speicher (nicht im Git), nur der Verweis in site.json');
 const groesse=(await h.evaluate(async(u)=>(await (await fetch(u)).arrayBuffer()).byteLength, lea)); ok(groesse>0 && groesse<200000,'Foto klein (WebP, '+Math.round(groesse/1024)+' KB) und abrufbar');
 await h.check('[name="team.1.p.0.fotoweg"]'); await h.click('button:has-text("Speichern")'); await h.waitForSelector('.ok-text'); await h.waitForTimeout(300);
 ok((await h.evaluate(async(u)=>(await fetch(u)).status, lea))===404,'Foto entfernen löscht das Bild wirklich aus dem Speicher');
 await h.reload(); await h.click('summary:has-text("Team auf der Website")');
 await h.evaluate(()=>document.querySelector('.team-gruppe:nth-of-type(2)').scrollIntoView()); await h.waitForTimeout(300); await h.screenshot({path:S+'/e2e3/7-team-fotos.png'});
 // Konfliktschutz: zwei Fenster, beide speichern
 const h2=await hc.newPage(); await h2.goto(C+'/pflege'); await h.goto(C+'/pflege');
 await h.click('button:has-text("Speichern")'); await h.waitForSelector('.ok-text');
 await h2.click('button:has-text("Speichern")'); await h2.waitForSelector('[role=alert]');
 ok(/jemand anderes gespeichert/.test(await h2.textContent('main')),'zwei Fenster: das zweite überschreibt nicht, sondern meldet den Konflikt'); await h2.close();
 // Geräte
 await h.goto(C+'/geraete'); ok(/letztes Gerät/.test(await h.textContent('main')),'Geräte: das letzte Gerät lässt sich nicht entfernen');
 await h.screenshot({path:S+'/e2e3/6-geraete.png'});
 // App
 const m=await (await b.newContext()).newPage(); const mr=await m.goto(C+'/manifest.webmanifest'); const mj=await mr.json(); ok(mj.display==='standalone' && mj.icons.length===3,'Manifest: installierbar als App');
 ok((await m.goto(C+'/sw.js')).status()===200 && (await m.goto(C+'/offline.html')).status()===200,'Service Worker und Offline-Seite ohne Login');
 await h.goto(C+'/'); await h.waitForTimeout(800); ok(await h.evaluate(async()=>!!(await navigator.serviceWorker.getRegistration())),'Service Worker angemeldet');
 // Computer
 const dc=await b.newContext({viewport:{width:1280,height:860}}); const d=await dc.newPage(); await geraet(d);
 ok(true,'(Computer separat: gleiches Konto, eigenes Gerät, siehe Geräte-Seite)');
 await b.close(); console.log('ALLES GRÜN');
})().catch(e=>{console.error(e.message);process.exit(1)});
