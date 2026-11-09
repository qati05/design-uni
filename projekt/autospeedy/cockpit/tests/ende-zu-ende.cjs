// Ende-zu-Ende gegen das Demo-Cockpit auf 4400 (frisch gestartet, siehe LIESMICH). Aufruf: node tests/ende-zu-ende.cjs <ordner>
// <ordner>/testfotos/a.jpg, b.jpg, quer.jpg und logo.png müssen existieren; Bildschirmfotos landen in <ordner>/e2e/.
const { chromium } = require('playwright');
const fs = require('node:fs');
const S = process.argv[2], C = 'http://localhost:4400';
fs.mkdirSync(S + '/e2e', { recursive: true });
const ok = (b, t) => { if (!b) throw new Error('FEHLER: ' + t); console.log('ok  ' + t); };
const konsole = [];

async function mailCode(b, an) {
  const p = await (await b.newContext()).newPage(); await p.goto(C + '/demo/postfach');
  const t = await p.textContent('.postfach'); await p.close();
  return (t.match(new RegExp('An ' + an.replace(/[.@]/g, '\\$&') + '[\\s\\S]*?Ihr Code: (\\d{6})')) || [])[1];
}
async function anmelden(b, p, an) {
  await p.goto(C + '/login'); await p.fill('#email', an); await p.click('button[type=submit]'); await p.waitForSelector('#code');
  await p.fill('#code', await mailCode(b, an)); await p.click('button[type=submit]'); await p.waitForURL((u) => u.pathname !== '/login');
}
const hin = async (p, bereich) => { await p.goto(C + '/#' + bereich); await p.waitForSelector(bereich ? '.app--bereich h1' : '.app:not(.app--bereich) h1'); };
const blatt = 'dialog.blatt[open]';
/** Wählt im Auswahl-Menü (eigenes Menü, kein Auswahlfeld des Browsers) einen Eintrag. */
const waehle = async (p, name, text) => { await p.getByRole('button', { name: new RegExp('^' + name + ' ') }).click(); await p.getByRole('option', { name: text, exact: true }).click(); await p.waitForSelector('.menue', { state: 'detached' }); };
const fertig = async (p) => { await p.click(blatt + ' .blatt__fertig'); await p.waitForSelector(blatt, { state: 'detached' }); };
/** Öffnet «Prüfen und veröffentlichen», prüft die Liste der Änderungen und veröffentlicht. */
async function veroeffentlichen(p, erwartet, was) {
  await p.click('.speichern .knopf:not(.knopf--leise)'); await p.waitForSelector(blatt + ' .knopf--gross');
  const t = await p.textContent(blatt);
  for (const e of erwartet) ok(t.includes(e), was + ': Prüfliste nennt «' + e + '»');
  await p.click(blatt + ' .knopf--gross'); await p.waitForSelector('.balken--ok');
  ok(/Veröffentlicht/.test(await p.textContent('.balken--ok')) && !(await p.$('.speichern')), was + ': veröffentlicht, nichts mehr offen');
  await p.click('.balken--ok .balken__tat');
}

(async () => {
  const b = await chromium.launch();
  // Ohne Anmeldung: zum Login
  const a = await (await b.newContext()).newPage(); await a.goto(C + '/'); ok(new URL(a.url()).pathname === '/login', 'ohne Anmeldung: Login');

  // ---------- Handy der Werkstatt
  const hc = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'de-CH' }); const h = await hc.newPage();
  // 404 gehört zum Test (entfernte Pfade, gelöschte Fotos); alles andere in der Konsole ist ein Fehler.
  h.on('console', (m) => { if (m.type() === 'error' && !/status of 404/.test(m.text())) konsole.push(m.text()); }); h.on('pageerror', (e) => konsole.push(String(e)));
  await anmelden(b, h, 'werkstatt@autospeedy.example'); await h.waitForURL(C + '/');
  ok(/Website pflegen/.test(await h.textContent('h1')), 'mit Mail-Code direkt auf «Website pflegen»');
  const ck = (await hc.cookies()).find((c) => c.name === 'as_demo_sitzung'); ok(ck && ck.httpOnly && ck.expires - Date.now() / 1000 > 29 * 86400, 'Sitzung httpOnly, 30 Tage auf diesem Gerät');
  const schmal = () => h.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  ok(await schmal(), 'Handy: kein seitliches Scrollen');
  ok((await h.$$('nav a.nav:visible')).length === 11, 'Handy: Liste mit 11 Bereichen');
  ok(/Mo bis Fr 7.30 bis 12.00 und 13.15 bis 17.30 Uhr/.test(await h.textContent('main')), 'Übersicht zeigt die heutigen Zeiten');
  await h.waitForTimeout(450); await h.screenshot({ path: S + '/e2e/1-start-handy.png' });
  const kopf = (await h.request.get(C + '/')).headers(); ok(/nonce-/.test(kopf['content-security-policy'] || '') && !/unsafe-inline/.test(kopf['content-security-policy']) && kopf['x-frame-options'] === 'DENY' && kopf['cache-control'] === 'no-store', 'Sicherheits-Header: Nonce-CSP ohne unsafe-inline, DENY, no-store');
  for (const p of ['/zahlen', '/meldung/beispiel01', '/studio', '/auftrag/' + 'a'.repeat(64), '/mfa']) { const r = await h.goto(C + p); ok(r.status() === 404, 'gibt es nicht: ' + p + ' → 404'); }
  ok(/gibt es nicht/.test(await h.textContent('h1')) && await h.evaluate(() => getComputedStyle(document.querySelector('.knopf')).borderRadius !== '0px'), '404-Seite im Stil des Cockpits (ohne eingebettete Styles, die die CSP blockiert)');
  const api = await h.request.post(C + '/api/meldung', { multipart: { art: 'Hagel' } }); ok([400, 404].includes(api.status()) && !/"ok":true/.test(await api.text()), 'POST /api/meldung nimmt nichts an (' + api.status() + '): keine Kundendaten im Cockpit');
  const alt = await h.goto(C + '/pflege'); ok(new URL(h.url()).pathname === '/' && alt.status() === 200, 'alter Link /pflege führt auf die Startseite');
  const g = await (await b.newContext()).newPage(); await anmelden(b, g, 'fremd@beispiel.example');
  const r403 = await g.goto(C + '/'); ok(r403.status() === 403 && /Kein Zugang/.test(await g.textContent('h1')), 'Konto ohne Mitgliedschaft: 403');

  // ---------- Öffnungszeiten, Hinweis, Feiertag
  await hin(h, ''); await h.click('a.nav[href="#zeiten"]'); await h.waitForSelector('.app--bereich');
  ok(/Öffnungszeiten/.test(await h.textContent('h1')) && await h.isVisible('.kopf__zurueck') && !(await h.isVisible('nav')), 'Handy: Antippen führt auf die Unterseite, oben «Übersicht» zum Zurückgehen');
  await h.fill('[aria-label="Montag bis Freitag, 2. Zeit bis"]', '12:30'); await h.click('.speichern .knopf:not(.knopf--leise)'); await h.waitForSelector('.balken--fehler');
  ok(/Öffnungszeiten, Montag bis Freitag/.test(await h.textContent('.balken--fehler')) && !(await h.$(blatt)), 'unsinnige Zeit: verständliche Meldung mit Ort, nichts veröffentlicht');
  await h.fill('[aria-label="Montag bis Freitag, 2. Zeit bis"]', '16:00');
  ok(/So steht es auf der Website: Mo bis Fr 7.30 bis 12.00 und 13.15 bis 16.00 Uhr/.test(await h.textContent('main')), 'Zeiten: Vorschau der Zeile, wie sie auf der Website steht');
  ok(/1 Änderung/.test(await h.textContent('.speichern')), 'unten steht, wie viele Änderungen offen sind');
  await h.click('.kopf__zurueck'); await h.waitForSelector('.app:not(.app--bereich)');
  ok(await h.isVisible('a.nav[href="#zeiten"] .punkt'), 'in der Liste zeigt ein Punkt, wo etwas geändert ist');
  await h.click('a.nav[href="#hinweise"]'); await h.click('button:has-text("Hinweis hinzufügen")');
  ok(await h.isDisabled('.kachel:has-text("Fenster") input'), 'Darstellung «Fenster» ist bei «Information» gesperrt (nur Hagel und Aktion)');
  await h.getByRole('button', { name: /^Art / }).click(); await h.waitForSelector('.menue[role=listbox]');
  ok((await h.locator('.menue [role=option]').count()) === 5 && (await h.getAttribute('.menue [aria-selected=true]', 'id')) === (await h.getAttribute('.menue', 'aria-activedescendant')), 'Auswahl «Art»: eigenes Menü mit 5 Einträgen, der gewählte ist markiert');
  await h.waitForTimeout(300); await h.screenshot({ path: S + '/e2e/2a-menue-handy.png' });
  await h.getByRole('option', { name: 'Hagel', exact: true }).click(); await h.waitForSelector('.menue', { state: 'detached' });
  ok(/Hagel/.test(await h.textContent('.zeile--wahl:has-text("Art") .wahl')) && !(await h.isDisabled('.kachel:has-text("Fenster") input')), 'Art «Hagel» gewählt, «Fenster» ist jetzt wählbar');
  await h.locator('textarea').fill('Hagel? Jetzt melden.'); await h.getByLabel('Zeigen bis').fill('2099-12-31');
  ok(/Hagel\? Jetzt melden\./.test(await h.textContent('.vorschau .vs-leiste')) && /Leiste oben/.test(await h.textContent('.vorschau figcaption')), 'Vorschau zeigt den Hinweis sofort als Leiste oben auf der Seite');
  await h.click('.kachel:has-text("Fenster")');
  ok(/Hagel\? Jetzt melden\./.test(await h.textContent('.vorschau .vs-fenster')) && !(await h.$('.vorschau .vs-leiste')), 'Darstellung «Fenster»: Vorschau zeigt ihn in der Mitte');
  await h.click('.kachel:has-text("Karte in der Ecke")');
  ok(/Hagel\? Jetzt melden\./.test(await h.textContent('.vorschau .vs-ecke')) && /unten rechts/.test(await h.textContent('.vorschau figcaption')), 'Darstellung «Karte in der Ecke»: Vorschau zeigt ihn unten rechts');
  ok(await h.isVisible('.vorschau--handy'), 'am Handy zeigt die Vorschau zuerst das Handy');
  await h.click('.umschalter__feld:has-text("Computer")'); ok(await h.isVisible('.vorschau--computer .vs-ecke'), 'Umschalter: Vorschau am Computer');
  await h.waitForTimeout(350); await h.screenshot({ path: S + '/e2e/2b-vorschau-handy.png' });
  await hin(h, 'ausnahmen'); await h.click('button:has-text("Feiertag oder Ferien hinzufügen")'); await h.waitForSelector(blatt);
  await h.getByLabel('Anlass').fill('Betriebsferien'); await h.getByLabel('Von', { exact: true }).fill('2026-12-28'); await h.getByLabel('Bis', { exact: true }).fill('2027-01-02');
  ok(/6 Tage am Stück/.test(await h.textContent(blatt)), 'Ferien von bis: das Blatt zählt die Tage'); await fertig(h);
  ok(/28\. Dezember 2026 bis .*2\. Januar 2027/.test(await h.textContent('main')), 'Ferien stehen als ein Eintrag «von bis» in der Liste');
  await h.click('button:has-text("Feiertag oder Ferien hinzufügen")'); await h.waitForSelector(blatt);
  await h.getByLabel('Anlass').fill('Heiligabend'); await h.getByLabel('Von', { exact: true }).fill('2026-12-24'); await h.locator(blatt + ' .schalter').uncheck();
  await h.fill('[aria-label="Offen von"]', '07:30'); await h.fill('[aria-label="Offen bis"]', '12:00'); await fertig(h);
  ok(/Heiligabend/.test(await h.textContent('main')) && /7.30 bis 12.00 Uhr/.test(await h.textContent('main')), 'Feiertag steht in der Liste');
  await h.waitForTimeout(450); await h.screenshot({ path: S + '/e2e/2-aenderungen-handy.png' });
  await h.click('.speichern .knopf:not(.knopf--leise)'); await h.waitForSelector(blatt + ' .knopf--gross'); await h.waitForTimeout(450); await h.screenshot({ path: S + '/e2e/3-pruefen-handy.png' }); await h.click(blatt + ' .blatt__fertig'); await h.waitForSelector(blatt, { state: 'detached' });
  await veroeffentlichen(h, ['Öffnungszeiten neu: Mo bis Fr 7.30 bis 12.00 und 13.15 bis 16.00 Uhr', 'Neuer Hinweis: «Hagel? Jetzt melden.»', 'Neuer Tag: Heiligabend (24.12.2026)', 'Neue Ferien: Betriebsferien (28.12.2026 bis 02.01.2027)'], 'Zeiten, Hinweis, Feiertag, Ferien');
  await h.reload(); await hin(h, '');
  ok(/13.15 bis 16.00 Uhr/.test(await h.textContent('main')) && /werkstatt@autospeedy.example/.test(await h.textContent('main .gruppe')), 'nach Neuladen: neue Zeit, und wer zuletzt veröffentlicht hat');
  ok(/1 aktiv/.test(await h.textContent('a.nav[href="#hinweise"]')), 'Liste zeigt: 1 Hinweis aktiv');
  await hin(h, 'hinweise'); ok((await h.inputValue('.kachel input:checked')) === 'ecke', 'nach dem Veröffentlichen ist die Darstellung «Karte in der Ecke» gespeichert');
  await h.getByRole('button', { name: /^Art / }).focus(); await h.keyboard.press('ArrowDown'); await h.waitForSelector('.menue'); await h.keyboard.press('ArrowDown'); await h.keyboard.press('Enter');
  ok(/Ferien/.test(await h.textContent('.zeile--wahl:has-text("Art") .wahl')) && !(await h.$('.menue')), 'Menü mit der Tastatur: Pfeil öffnet, Pfeil und Eingabe wählen');
  await h.click('.speichern .knopf--leise'); ok(/Hagel/.test(await h.textContent('.zeile--wahl:has-text("Art") .wahl')), '«Verwerfen» setzt die Art zurück');

  // ---------- Team: Foto, neue Person, entfernen mit «Rückgängig», Reihenfolge, Gruppe wechseln
  await hin(h, 'team');
  ok(await h.getAttribute('.eintrag:has-text("Lea Schlegel") img', 'src') === '/bilder/team/lea-schlegel.webp', 'Team: Porträts von der bisherigen Website');
  await h.click('.eintrag:has-text("Lea Schlegel")'); await h.waitForSelector(blatt);
  await h.setInputFiles(blatt + ' input[type=file]', S + '/testfotos/a.jpg'); await h.waitForFunction(() => document.querySelector('dialog[open] .portraet--gross')?.getAttribute('src')?.startsWith('blob:'));
  ok(true, 'neues Foto: Vorschau sofort, im Browser verkleinert');
  await h.setInputFiles(blatt + ' input[type=file]', { name: 'kein-bild.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('<svg onload=alert(1)>') }); await h.waitForFunction(() => /lässt sich nicht lesen/.test(document.querySelector('dialog[open] .bildknopf__fehler')?.textContent || ''));
  ok(true, 'kein Bild (getarnt als .jpg): abgewiesen');
  await h.waitForTimeout(450); await h.screenshot({ path: S + '/e2e/4-person-handy.png' }); await fertig(h);
  await h.click('.gruppe:has(.gruppe__titel:text-is("Carrosserie")) button:has-text("Person hinzufügen")'); await h.waitForSelector(blatt);
  await h.getByLabel('Name', { exact: true }).fill('Neue Person (Test)'); await h.getByLabel('Aufgabe').fill('Lernende');
  await h.setInputFiles(blatt + ' input[type=file]', S + '/testfotos/b.jpg'); await h.waitForFunction(() => document.querySelector('dialog[open] .portraet--gross')?.getAttribute('src')?.startsWith('blob:')); await fertig(h);
  ok(/nicht sichtbar/.test(await h.textContent('.zeile--eintrag:has-text("Neue Person (Test)")')), 'neue Person ist zuerst «nicht sichtbar» (Einverständnis fehlt)');
  await veroeffentlichen(h, ['Lea Schlegel: neues Foto', 'Neue Person: Neue Person (Test) (Carrosserie)'], 'Team');
  const lea = await h.getAttribute('.eintrag:has-text("Lea Schlegel") img', 'src'), neu = await h.getAttribute('.eintrag:has-text("Neue Person (Test)") img', 'src');
  ok(/^\/api\/demo-foto\/[0-9a-f-]{36}\.(webp|jpg)$/.test(lea) && /^\/api\/demo-foto\/[0-9a-f-]{36}\.(webp|jpg)$/.test(neu), 'nach dem Veröffentlichen: beide Fotos im Bild-Speicher (nicht im Git), nur der Verweis in site.json');
  const groesse = await h.evaluate(async (u) => (await (await fetch(u)).arrayBuffer()).byteLength, lea); ok(groesse > 0 && groesse < 200000, 'Foto klein (' + Math.round(groesse / 1024) + ' KB) und abrufbar');
  await h.click('.eintrag:has-text("Lea Schlegel")'); await h.click(blatt + ' button:has-text("Foto entfernen")'); await fertig(h);
  await veroeffentlichen(h, ['Lea Schlegel: Foto entfernt'], 'Foto entfernen');
  ok((await h.evaluate(async (u) => (await fetch(u)).status, lea)) === 404, 'Foto entfernen löscht das Bild wirklich aus dem Speicher');
  // Entfernen: «Bearbeiten», rotes Minus, unten «Rückgängig»
  await h.click('.kopf__tat'); await h.click('[aria-label="Neue Person (Test) entfernen"]');
  ok(!(await h.$('.eintrag:has-text("Neue Person (Test)")')) && /Neue Person \(Test\) entfernt/.test(await h.textContent('.toast')), 'Person entfernen: ein Tipp, unten steht «entfernt» mit «Rückgängig»');
  await h.waitForTimeout(450); await h.screenshot({ path: S + '/e2e/5-entfernen-handy.png' });
  await h.click('.toast__tat'); ok(!!(await h.$('.eintrag:has-text("Neue Person (Test)")')) && !(await h.$('.speichern')), '«Rückgängig» holt die Person zurück, nichts ist geändert');
  await h.click('[aria-label="Neue Person (Test) entfernen"]');
  await h.click('[aria-label="Dragan Tejic nach oben"]'); await h.click('.kopf__tat');
  await h.click('.eintrag:has-text("Martyna Skweres")'); await h.getByRole('button', { name: /^Gruppe / }).click(); await h.waitForSelector('.menue'); await h.keyboard.press('Escape');
  ok(!(await h.$('.menue')) && !!(await h.$(blatt)), 'Esc schliesst nur das Menü, das Blatt bleibt offen');
  await waehle(h, 'Gruppe', 'Lackiererei');
  ok(/Martyna Skweres/.test(await h.textContent(blatt + ' h2')), 'Gruppe wechseln: das Blatt bleibt bei der Person'); await fertig(h);
  ok(/Martyna Skweres/.test(await h.textContent('.gruppe:has(.gruppe__titel:text-is("Lackiererei"))')), 'Person steht in der neuen Gruppe');
  await veroeffentlichen(h, ['Person entfernt: Neue Person (Test)', 'Martyna Skweres: neu in der Gruppe «Lackiererei»', 'Team: Reihenfolge geändert'], 'Entfernen, Reihenfolge, Gruppe');
  ok((await h.evaluate(async (u) => (await fetch(u)).status, neu)) === 404, 'entfernte Person: ihr Foto ist aus dem Speicher gelöscht');
  ok(await schmal(), 'Handy: Team ohne seitliches Scrollen');

  // ---------- Häufige Fragen, Fotos, Partner, Kontakt, Inhaber
  await hin(h, 'fragen'); await h.click('.eintrag:has-text("Wer zahlt die Reparatur?")'); await h.locator(blatt + ' textarea').nth(1).fill('Bei einem Versicherungsfall rechnen wir direkt mit Ihrer Versicherung ab.'); await fertig(h);
  await h.click('button:has-text("Frage hinzufügen")'); await h.locator(blatt + ' textarea').nth(0).fill('Wann haben Sie geöffnet?'); await h.locator(blatt + ' textarea').nth(1).fill('Wir sind für Sie da:'); await h.click(blatt + ' .chip:has-text("Öffnungszeiten")');
  ok((await h.locator(blatt + ' textarea').nth(1).inputValue()) === 'Wir sind für Sie da: {zeiten}', 'Frage: «Öffnungszeiten» setzt den Platzhalter ein'); await fertig(h);
  await hin(h, 'fotos'); const KARTE = '.fotokarte:has-text("Grosses Foto oben")';
  ok(await h.getAttribute(KARTE + ' img', 'src') === '/bilder/defender-kabine-480.webp' && await h.evaluate(() => document.querySelector('.fotokarte img').naturalWidth > 0), 'Fotos: zeigt das heutige Foto der Website');
  await h.setInputFiles(KARTE + ' input[type=file]', S + '/testfotos/quer.jpg'); await h.waitForSelector(KARTE + ' textarea');
  await h.click('.speichern .knopf:not(.knopf--leise)'); await h.waitForSelector('.balken--fehler');
  ok(/Fotos, Grosses Foto oben: Beschreibung fehlt/.test(await h.textContent('.balken--fehler')), 'Foto ohne Beschreibung: Meldung sagt, was fehlt');
  await h.fill(KARTE + ' textarea', 'Grauer Geländewagen in der Lackierkabine'); await h.waitForTimeout(450); await h.screenshot({ path: S + '/e2e/6-fotos-handy.png' });
  await hin(h, 'partner'); await h.click('button:has-text("Partner hinzufügen")'); await h.getByLabel('Name', { exact: true }).fill('Testpartner');
  await h.setInputFiles(blatt + ' input[type=file]', S + '/testfotos/logo.png'); await h.waitForSelector(blatt + ' img.logo--gross'); await fertig(h);
  await h.click('.kopf__tat'); await h.click('[aria-label="Ayvens entfernen"]'); await h.click('.kopf__tat');
  await hin(h, 'kontakt'); await h.getByLabel('Nummer').fill('12345'); ok(/Bitte wie 071 755 88 61/.test(await h.textContent('main')), 'Kontakt: falsche Nummer wird gleich am Feld gemeldet');
  await h.getByLabel('Nummer').fill('076 123 45 67');
  await hin(h, 'inhaber'); await h.locator('textarea').fill('Wir stehen für saubere Arbeit ein.'); await h.getByLabel('Name', { exact: true }).fill('Shpejtim Pirku'); await h.getByLabel('Rolle').fill('Geschäftsführer');
  await veroeffentlichen(h, ['Antwort geändert: «Wer zahlt die Reparatur?»', 'Neue Frage: «Wann haben Sie geöffnet?»', 'Foto ersetzt: Startseite, Grosses Foto oben', 'Neuer Partner: Testpartner', 'Partner entfernt: Ayvens', 'WhatsApp-Nummer neu: 076 123 45 67', 'Satz vom Inhaber geändert'], 'Fragen, Fotos, Partner, Kontakt, Inhaber');
  await hin(h, 'fotos'); const start = await h.getAttribute(KARTE + ' img', 'src');
  ok(/^\/api\/demo-foto\/[0-9a-f-]{36}\.(webp|jpg)$/.test(start) && /Ihr eigenes Foto/.test(await h.textContent(KARTE)), 'ersetztes Foto liegt im Bild-Speicher');
  const mass = await h.evaluate(async (u) => { const i = new Image(); i.src = u; await i.decode(); return [i.naturalWidth, i.naturalHeight]; }, start); ok(mass[0] === 1600 && mass[1] === 1067, 'grosses Foto wurde auf 1600 Punkte verkleinert');

  // ---------- Besucher (nur lesen) und Verlauf (zurücknehmen)
  await hin(h, 'besucher');
  ok(/Beispielzahlen/.test(await h.textContent('main')) && /^\d/.test(await h.textContent('.zahl__gross')) && (await h.$$('.saeulen__s')).length > 20 && (await h.$$('.tabelle tbody tr')).length === 28, 'Besucher: grosse Zahl, Säulen pro Tag, Tabelle; in der Demo als Beispiel gekennzeichnet');
  ok(!(await h.$('main input, main textarea, main select')), 'Besucher: nur zum Lesen, keine Eingabe');
  await h.waitForTimeout(450); await h.screenshot({ path: S + '/e2e/7-besucher-handy.png' });
  await hin(h, 'verlauf'); ok((await h.$$('main button:has-text("Laden")')).length >= 4, 'Verlauf: frühere Stände stehen zum Laden bereit');
  await h.click('button:has-text("Letzte Änderung zurücknehmen")'); await h.waitForSelector('.toast');
  ok(/geladen/.test(await h.textContent('.toast')) && /Noch nicht veröffentlicht/.test(await h.textContent('.toast')) && !!(await h.$('.speichern')), 'Zurücknehmen lädt den Stand davor, veröffentlicht aber noch nichts');
  await h.waitForTimeout(450); await h.screenshot({ path: S + '/e2e/8-verlauf-handy.png' });
  await veroeffentlichen(h, ['Wieder das ursprüngliche Foto: Startseite, Grosses Foto oben', 'Partner entfernt: Testpartner', 'Neuer Partner: Ayvens', 'WhatsApp-Nummer entfernt', 'Frage entfernt: «Wann haben Sie geöffnet?»'], 'Letzte Änderung zurücknehmen');
  ok((await h.evaluate(async (u) => (await fetch(u)).status, start)) === 404, 'zurückgenommen: das ersetzte Foto ist aus dem Speicher gelöscht');
  await hin(h, 'fotos'); ok(await h.getAttribute(KARTE + ' img', 'src') === '/bilder/defender-kabine-480.webp', 'Website zeigt wieder ihr ursprüngliches Foto');
  // Ein Stand, dessen Foto es nicht mehr gibt: laden geht, das Foto fällt weg und es wird gesagt.
  await hin(h, 'verlauf'); await h.locator('main button:has-text("Laden")').first().click(); await h.waitForSelector('.toast');
  ok(/gibt es nicht mehr/.test(await h.textContent('.toast')), 'Stand mit gelöschten Fotos: lädt den Rest und sagt, was fehlt');
  await h.click('.speichern .knopf--leise'); ok(/verworfen/.test(await h.textContent('.toast')) && !(await h.$('.speichern')), '«Verwerfen» setzt alles auf den Stand der Website zurück');

  // ---------- Konfliktschutz: zwei Fenster, beide veröffentlichen
  const h2 = await hc.newPage(); await hin(h2, 'inhaber'); await hin(h, 'inhaber');
  await h.locator('.gruppe:has-text("Google-Bewertungen") .schalter').uncheck(); await veroeffentlichen(h, ['Google-Bewertungen werden nicht mehr gezeigt'], 'Fenster 1');
  await h2.locator('textarea').fill('Zweites Fenster.'); await h2.click('.speichern .knopf:not(.knopf--leise)'); await h2.click(blatt + ' .knopf--gross'); await h2.waitForSelector('.balken--fehler');
  ok(/jemand anderes veröffentlicht/.test(await h2.textContent('.balken--fehler')), 'zwei Fenster: das zweite überschreibt nicht, sondern meldet den Konflikt'); await h2.close();

  // ---------- App, Computer, Abmelden
  const m = await (await b.newContext()).newPage(); const mj = await (await m.goto(C + '/manifest.webmanifest')).json(); ok(mj.display === 'standalone' && mj.icons.length === 3, 'Manifest: installierbar als App');
  ok((await m.goto(C + '/sw.js')).status() === 200 && (await m.goto(C + '/offline.html')).status() === 200, 'Service Worker und Offline-Seite ohne Login');
  await hin(h, ''); await h.waitForTimeout(800); ok(await h.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())), 'Service Worker angemeldet');
  const dc = await b.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-CH' }); const d = await dc.newPage();
  d.on('console', (x) => { if (x.type() === 'error' && !/status of 404/.test(x.text())) konsole.push(x.text()); }); d.on('pageerror', (e) => konsole.push(String(e)));
  await anmelden(b, d, 'werkstatt@autospeedy.example'); await d.waitForURL(C + '/');
  ok(await d.isVisible('.leiste nav') && /Website pflegen/.test(await d.textContent('h1')), 'Computer: Seitenleiste links, Übersicht rechts');
  await d.click('a.nav[href="#team"]'); await d.waitForSelector('.nav--aktiv[href="#team"]'); ok(await d.isVisible('.leiste nav') && /Team/.test(await d.textContent('h1')), 'Computer: Bereich wechselt rechts, die Leiste bleibt');
  await d.keyboard.press('Tab'); ok(await d.evaluate(() => !!document.activeElement && document.activeElement !== document.body), 'Computer: mit der Tastatur bedienbar');
  await d.waitForTimeout(450); await d.screenshot({ path: S + '/e2e/9-team-computer.png' });
  ok(konsole.length === 0, 'keine Fehler in der Konsole (auch keine CSP-Verstösse)' + (konsole.length ? ': ' + konsole.join(' | ') : ''));
  await hin(h, ''); await h.click('button:has-text("Abmelden")'); await h.waitForURL(C + '/login'); await h.goto(C + '/'); ok(new URL(h.url()).pathname === '/login', 'Abmelden: danach wieder Login');
  await b.close(); console.log('ALLES GRÜN');
})().catch((e) => { console.error(e.message); if (konsole.length) console.error('Konsole: ' + konsole.join(' | ')); process.exit(1); });
