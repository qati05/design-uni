// Ende-zu-Ende gegen das Demo-Cockpit auf 4400 (frisch gestartet, siehe LIESMICH). Aufruf: node tests/ende-zu-ende.cjs <ordner>
// <ordner>/testfotos/a.jpg, b.jpg, quer.jpg und logo.png müssen existieren; Bildschirmfotos landen in <ordner>/e2e/.
// Läuft das Cockpit mit WEBSITE_URL oder HILFE_MAIL, braucht der Test dieselben Werte in seiner Umgebung: Er prüft dann, dass
// die Zeilen «Website ansehen» und «Ihrem Betreuer schreiben» da sind, sonst, dass sie fehlen. COCKPIT_URL: anderer Port.
const { chromium } = require('playwright');
const fs = require('node:fs');
const S = process.argv[2], C = process.env.COCKPIT_URL || 'http://localhost:4400';
const WEB = (process.env.WEBSITE_URL || '').replace(/\/$/, ''), MAIL = process.env.HILFE_MAIL || '';
// Heute in der Schweiz (so rechnet das Cockpit), Tage danach, und ein Datum, wie es das Cockpit schreibt (24.12.2026).
const HEUTE = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Zurich', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const plus = (n) => { const t = new Date(HEUTE + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
const ch = (d) => d.slice(8) + '.' + d.slice(5, 7) + '.' + d.slice(0, 4);
fs.mkdirSync(S + '/e2e', { recursive: true });
const ok = (b, t) => { if (!b) throw new Error('FEHLER: ' + t); console.log('ok  ' + t); };
const konsole = [];

async function mailCode(b, an) {
  const p = await (await b.newContext()).newPage(); await p.goto(C + '/demo/postfach');
  const t = await p.textContent('.postfach'); await p.close();
  return (t.match(new RegExp('An ' + an.replace(/[.@]/g, '\\$&') + '[\\s\\S]*?Ihr Code: (\\d{6})')) || [])[1];
}
/** Meldet an. «pruef» (freiwillig) schaut sich die beiden Schritte der Anmeldung an: pruef('mail') und pruef('code'). */
async function anmelden(b, p, an, pruef) {
  await p.goto(C + '/login'); if (pruef) await pruef('mail'); await p.fill('#email', an); await p.click('button[type=submit]'); await p.waitForSelector('#code'); if (pruef) await pruef('code');
  await p.fill('#code', await mailCode(b, an)); await p.click('button[type=submit]'); await p.waitForURL((u) => u.pathname !== '/login');
}
/** Misst die Ansicht am Handy (bei offenem Blatt nur das Blatt): Rollt die Seite waagrecht? Steht etwas über den Rand?
 *  Ist eine Tippfläche kleiner als 44 × 44 Punkte? Hat ein Feld weniger als 16 Punkte Schrift (dann zoomt das iPhone beim Antippen)? */
const handyMass = () => {
  const iw = innerWidth, wurzel = document.querySelector('dialog[open]') || document.body, m = [];
  const da = (x) => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(x).visibility !== 'hidden'; };
  const wer = (x) => x.tagName.toLowerCase() + (typeof x.className === 'string' && x.className ? '.' + x.className.trim().split(/\s+/).join('.') : '') + ' «' + (x.getAttribute('aria-label') || x.textContent || '').trim().slice(0, 30) + '»';
  if (document.documentElement.scrollWidth > iw) m.push('Seite rollt waagrecht: ' + document.documentElement.scrollWidth + ' > ' + iw);
  // Was ein Vorfahr abschneidet (Vorschau, Gruppe mit runden Ecken), ragt nicht wirklich über den Rand.
  const beschnitten = (x) => { for (let a = x.parentElement; a && a !== document.documentElement; a = a.parentElement) { if (getComputedStyle(a).overflowX !== 'visible') { const r = a.getBoundingClientRect(); if (r.left >= -1 && r.right <= iw + 1) return true; } } return false; };
  for (const x of wurzel.querySelectorAll('*')) { if (!da(x) || x.closest('.unsichtbar')) continue; const r = x.getBoundingClientRect(); if ((r.right > iw + 1 || r.left < -1) && !beschnitten(x)) m.push('über den Rand: ' + wer(x)); }
  // Tippflächen: Bei Schalter, Kachel, Umschalter und Dateifeld zählt das Etikett; eine vergrösserte Trefferfläche (::after) zählt mit.
  const ziele = new Set();
  for (const x of wurzel.querySelectorAll('a[href], button, input:not([type=hidden]), textarea, summary, [role=option]')) { if (x.disabled) continue; const z = x.matches('input.unsichtbar, input[type=checkbox], input[type=radio], input[type=file]') ? x.closest('label') || x : x; if (da(z)) ziele.add(z); }
  for (const z of ziele) { const r = z.getBoundingClientRect(), n = getComputedStyle(z, '::after'), mehr = (v) => Math.max(0, -(parseFloat(v) || 0)); let b = r.width, h = r.height; if (n.content !== 'none' && n.position === 'absolute') { b += mehr(n.left) + mehr(n.right); h += mehr(n.top) + mehr(n.bottom); } if (b < 43.5 || h < 43.5) m.push('Tippfläche ' + Math.round(b) + ' × ' + Math.round(h) + ': ' + wer(z)); }
  for (const x of wurzel.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]), textarea')) if (da(x) && parseFloat(getComputedStyle(x).fontSize) < 16) m.push('Schrift unter 16 Punkten: ' + wer(x));
  return m;
};
const handyOk = async (p, was) => { const m = await p.evaluate(handyMass); ok(m.length === 0, was + ': kein waagrechtes Rollen, nichts über dem Rand, Tippflächen mindestens 44 × 44, Felder mindestens 16 Punkte Schrift' + (m.length ? ' → ' + m.slice(0, 6).join(' | ') : '')); };
/** Grösse einer PNG-Datei aus ihrem Kopf (IHDR). */
const pngMass = (puffer) => (puffer.subarray(1, 4).toString('latin1') === 'PNG' ? puffer.readUInt32BE(16) + 'x' + puffer.readUInt32BE(20) : 'kein PNG');
const hin = async (p, bereich) => { await p.goto(C + '/#' + bereich); await p.waitForSelector(bereich ? '.app--bereich h1' : '.app:not(.app--bereich) h1'); };
const blatt = 'dialog.blatt[open]';
/** Wählt im Auswahl-Menü (eigenes Menü, kein Auswahlfeld des Browsers) einen Eintrag. */
const waehle = async (p, name, text) => { await p.getByRole('button', { name: new RegExp('^' + name + ' ') }).click(); await p.getByRole('option', { name: text, exact: true }).click(); await p.waitForSelector('.menue', { state: 'detached' }); };
/** Handy: oben links zurück auf die Übersicht (ohne die Seite neu zu laden, der Entwurf bleibt). */
const zurueck = async (p) => { await p.click('.kopf__zurueck'); await p.waitForSelector('.app:not(.app--bereich)'); };
const SCHNELL = '.gruppe:has(.gruppe__titel:text-is("Schnell erledigt"))';
/** Schalter «Auch als Hinweis auf der Website zeigen» im Blatt eines Eintrags bei «Feiertage und Ferien». */
const SCH = blatt + ' .zeile--schalter:has-text("Auch als Hinweis") .schalter';
const H = (i) => '#hinweis-' + i;
// Wartet, bis das Blatt wirklich weg ist: «open» fällt sofort weg, aufgeräumt wird erst danach (Ereignis «close»).
const fertig = async (p) => { await p.click(blatt + ' .blatt__fertig'); await p.waitForSelector('dialog.blatt', { state: 'detached' }); };
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
  await anmelden(b, h, 'werkstatt@autospeedy.example', async (schritt) => {
    const f = await h.evaluate((id) => { const x = document.getElementById(id); return { type: x.type, inputmode: x.getAttribute('inputmode'), autocomplete: x.getAttribute('autocomplete'), px: parseFloat(getComputedStyle(x).fontSize), hoehe: x.getBoundingClientRect().height, schmal: document.documentElement.scrollWidth <= innerWidth }; }, schritt === 'mail' ? 'email' : 'code');
    if (schritt === 'mail') ok(f.type === 'email' && f.inputmode === 'email' && f.autocomplete === 'email' && f.px >= 16 && f.hoehe >= 44 && f.schmal, 'Handy, Anmeldung: Mail-Feld mit Mail-Tastatur, Schrift mindestens 16 Punkte (kein Zoom am iPhone), kein seitliches Scrollen');
    else {
      ok(f.inputmode === 'numeric' && f.autocomplete === 'one-time-code' && f.px >= 16 && f.schmal, 'Handy, Anmeldung: Code-Feld mit Zifferntastatur (inputmode numeric) und autocomplete one-time-code');
      ok(await h.evaluate(() => { const a = document.querySelector('.formular a[href="/login"]'); return !!a && /Andere Mail-Adresse verwenden/.test(a.textContent) && a.getBoundingClientRect().height >= 44; }), 'Handy, Anmeldung: vom Code-Schritt führt ein eigener Weg zurück (als App gibt es keinen Zurück-Knopf des Browsers)');
    }
  }); await h.waitForURL(C + '/');
  ok(/Website pflegen/.test(await h.textContent('h1')), 'mit Mail-Code direkt auf «Website pflegen»');
  const ck = (await hc.cookies()).find((c) => c.name === 'as_demo_sitzung'); ok(ck && ck.httpOnly && ck.expires - Date.now() / 1000 > 29 * 86400, 'Sitzung httpOnly, 30 Tage auf diesem Gerät');
  const schmal = () => h.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  ok(await schmal(), 'Handy: kein seitliches Scrollen');
  await handyOk(h, 'Handy 390, Übersicht');
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

  // ---------- Übersicht: was gerade gilt, «Schnell erledigt», Hilfe. Alles bleibt Entwurf und wird am Ende verworfen.
  await hin(h, '');
  ok((await h.locator(SCHNELL + ' .zeile--tat').allTextContents()).join('|') === 'Heute geschlossen|Ferien eintragen|Hinweis nach Hagel|Neue Person im Team|Foto tauschen', 'Übersicht: Gruppe «Schnell erledigt» mit fünf Zeilen, direkt unter «Ihre Website»');
  ok(await h.locator(SCHNELL + ' .zeile--tat').evaluateAll((z) => z.every((x) => x.getBoundingClientRect().height >= 44)), '«Schnell erledigt»: jede Zeile mindestens 44 Punkte hoch');
  ok(/keiner/.test(await h.textContent('main a.zeile--link[href="#hinweise"]')) && /keine eingetragen/.test(await h.textContent('main a.zeile--link[href="#ausnahmen"]')), 'Übersicht zeigt, was gilt: Hinweise «keiner», Nächste Ferien «keine eingetragen»');
  const web = await h.$('main a:has-text("Website ansehen")');
  ok(WEB ? !!web && (await web.getAttribute('href')).startsWith(WEB) && (await web.getAttribute('target')) === '_blank' && /noopener/.test(await web.getAttribute('rel')) : !web, WEB ? '«Website ansehen» öffnet die eingerichtete Adresse in einem neuen Tab' : 'ohne WEBSITE_URL gibt es keine Zeile «Website ansehen» (keine Adresse fest eingebaut)');
  ok(await h.isVisible('.nur-handy .klappe summary') && !(await h.isVisible('.nur-handy .zeile--schritt')) && !(await h.isVisible('main .klappe')), 'Handy: Hilfe steht unter der Liste, «So geht es» ist eingeklappt');
  await h.click('.nur-handy .klappe summary'); ok((await h.locator('.nur-handy .zeile--schritt:visible').count()) === 3, 'Handy: Antippen klappt die 3 Schritte auf');
  const mail = await h.$('.nur-handy a[href^="mailto:"]');
  ok(MAIL ? !!mail && (await mail.getAttribute('href')).startsWith('mailto:' + MAIL) && /Ihrem Betreuer schreiben/.test(await mail.textContent()) : !(await h.$('a[href^="mailto:"]')), MAIL ? '«Ihrem Betreuer schreiben» schreibt an die eingerichtete Adresse' : 'ohne HILFE_MAIL gibt es keine Zeile «Ihrem Betreuer schreiben» (keine Adresse fest eingebaut)');
  await h.waitForTimeout(300); await h.screenshot({ path: S + '/e2e/1b-hilfe-handy.png' });
  // «Heute geschlossen»: ein Tipp, der Eintrag steht im Entwurf, sein Blatt ist offen
  await h.click(SCHNELL + ' button:has-text("Heute geschlossen")'); await h.waitForSelector(blatt);
  ok(new URL(h.url()).hash === '#ausnahmen' && (await h.getByLabel('Anlass').inputValue()) === 'Geschlossen' && (await h.getByLabel('Von', { exact: true }).inputValue()) === HEUTE, '«Heute geschlossen»: neuer Eintrag «Geschlossen» mit dem heutigen Datum, das Blatt ist gleich offen');
  ok(!(await h.isChecked(SCH)) && await h.isEnabled(SCH), 'Blatt: Schalter «Auch als Hinweis auf der Website zeigen» ist aus und lässt sich einschalten');
  await fertig(h);
  ok((await h.$$('main .zeile--eintrag')).length === 1 && /1 Änderung/.test(await h.textContent('.speichern')), '«Heute geschlossen» ist ein Entwurf: 1 Änderung, noch nicht veröffentlicht');
  await zurueck(h);
  ok(await h.isVisible('main a.zeile--link[href="#ausnahmen"] .punkt') && /keine eingetragen/.test(await h.textContent('main a.zeile--link[href="#ausnahmen"]')), 'Übersicht: «Nächste Ferien» zeigt weiter den Stand der Website, ein Punkt sagt «geändert, noch nicht veröffentlicht»');
  await h.click(SCHNELL + ' button:has-text("Heute geschlossen")'); await h.waitForSelector(blatt); await fertig(h);
  ok((await h.$$('main .zeile--eintrag')).length === 1, '«Heute geschlossen» ein zweites Mal: öffnet den Eintrag von heute, legt keinen zweiten an');
  // «Ferien eintragen»: leeres Datum; ohne Eingabe bleibt nichts zurück
  await zurueck(h); await h.click(SCHNELL + ' button:has-text("Ferien eintragen")'); await h.waitForSelector(blatt);
  ok(new URL(h.url()).hash === '#ausnahmen' && (await h.getByLabel('Anlass').inputValue()) === 'Betriebsferien' && (await h.getByLabel('Von', { exact: true }).inputValue()) === '', '«Ferien eintragen»: Blatt offen, Anlass «Betriebsferien», Datum noch leer');
  ok(await h.isDisabled(SCH) && /Bitte zuerst das Datum wählen\./.test(await h.textContent(blatt)), 'ohne Datum ist der Schalter für den Hinweis gesperrt und sagt warum');
  await fertig(h);
  ok((await h.$$('main .zeile--eintrag')).length === 1 && /1 Änderung/.test(await h.textContent('.speichern')), 'Blatt ohne Eingabe geschlossen: kein leerer Eintrag bleibt zurück');
  // Ferien und Hinweis zusammen: an, Datum ändern (der Hinweis zieht mit), aus
  const F1 = plus(30), F2 = plus(39), F3 = plus(42);
  await zurueck(h); await h.click(SCHNELL + ' button:has-text("Ferien eintragen")'); await h.waitForSelector(blatt);
  await h.getByLabel('Von', { exact: true }).fill(F1); await h.getByLabel('Bis', { exact: true }).fill(F2); await h.check(SCH);
  ok((await h.textContent(blatt)).includes('Betriebsferien vom ' + ch(F1) + ' bis ' + ch(F2) + '.'), 'Schalter an: Das Blatt zeigt den Hinweis im Wortlaut (Anlass und Datum)');
  await h.locator(SCH).scrollIntoViewIfNeeded(); await h.waitForTimeout(300); await h.screenshot({ path: S + '/e2e/2c-ferien-hinweis-handy.png' }); await fertig(h);
  await hin(h, 'hinweise');
  ok((await h.$$('[id^="hinweis-"]')).length === 1 && /Ferien/.test(await h.textContent(H(0) + ' .zeile--wahl:has-text("Art") .wahl')) && (await h.inputValue(H(0) + ' .kachel input:checked')) === 'banner' && (await h.inputValue(H(0) + ' textarea')) === 'Betriebsferien vom ' + ch(F1) + ' bis ' + ch(F2) + '.', 'Bereich «Hinweise»: der passende Hinweis steht da (Art Ferien, Leiste oben, Text aus Anlass und Datum)');
  ok((await h.locator(H(0)).getByLabel('Zeigen ab').inputValue()) === HEUTE && (await h.locator(H(0)).getByLabel('Zeigen bis').inputValue()) === F2, 'Zeitraum des Hinweises: ab heute bis zum letzten Ferientag');
  await hin(h, 'ausnahmen'); await h.click('.eintrag:has-text("Betriebsferien")'); await h.waitForSelector(blatt);
  ok(await h.isChecked(SCH), 'Blatt wieder geöffnet: Der Schalter zeigt den wahren Zustand (an)');
  await h.getByLabel('Bis', { exact: true }).fill(F3);
  ok((await h.textContent(blatt)).includes('Betriebsferien vom ' + ch(F1) + ' bis ' + ch(F3) + '.') && await h.isChecked(SCH), 'Datum der Ferien geändert: Schalter bleibt an, der Text zieht mit'); await fertig(h);
  await hin(h, 'hinweise');
  ok((await h.inputValue(H(0) + ' textarea')) === 'Betriebsferien vom ' + ch(F1) + ' bis ' + ch(F3) + '.' && (await h.locator(H(0)).getByLabel('Zeigen bis').inputValue()) === F3, 'der verbundene Hinweis ist nicht still falsch geworden: Text und «Zeigen bis» stimmen');
  await hin(h, 'ausnahmen'); await h.click('.eintrag:has-text("Betriebsferien")'); await h.waitForSelector(blatt); await h.uncheck(SCH);
  ok(!(await h.isChecked(SCH)) && /Hinweis dazu entfernt/.test(await h.textContent('.toast')), 'Schalter aus: Hinweis entfernt, unten steht es mit «Rückgängig»'); await fertig(h);
  await hin(h, 'hinweise'); ok((await h.$$('[id^="hinweis-"]')).length === 0, 'Schalter aus: Im Bereich «Hinweise» ist genau dieser Hinweis wieder weg');
  // «Hinweis nach Hagel» und die Vorlagen
  await zurueck(h); await h.click(SCHNELL + ' button:has-text("Hinweis nach Hagel")'); await h.waitForSelector(H(0));
  ok(new URL(h.url()).hash === '#hinweise' && (await h.locator(H(0)).getByLabel('Titel').inputValue()) === 'Hagelschaden?' && (await h.inputValue(H(0) + ' textarea')) === 'Melden Sie Ihren Schaden gleich online. Die Abwicklung mit Ihrer Versicherung übernehmen wir.', '«Hinweis nach Hagel»: Hinweis aus der Vorlage mit Titel und Text, der Bereich «Hinweise» zeigt ihn');
  ok((await h.inputValue(H(0) + ' .kachel input:checked')) === 'popup' && /Schaden melden \(Hagel\)/.test(await h.textContent(H(0) + ' .zeile--wahl:has-text("Führt zu") .wahl')) && /Hagelschaden\?/.test(await h.textContent(H(0) + ' .vorschau .vs-fenster')), 'Vorlage Hagel: Fenster, Link «Schaden melden (Hagel)», die Vorschau zeigt es');
  await h.waitForTimeout(350); await h.screenshot({ path: S + '/e2e/2d-hagel-vorlage-handy.png' });
  await zurueck(h); await h.click(SCHNELL + ' button:has-text("Hinweis nach Hagel")'); await h.waitForSelector(H(0));
  ok((await h.$$('[id^="hinweis-"]')).length === 1 && /Es gibt schon einen Hinweis zu Hagel/.test(await h.textContent('.toast')), '«Hinweis nach Hagel» ein zweites Mal: zeigt den bestehenden, legt keinen zweiten an');
  await h.click('button:has-text("Hinweis hinzufügen")'); await h.waitForSelector(blatt);
  ok(/Was möchten Sie mitteilen\?/.test(await h.textContent(blatt + ' h2')) && (await h.locator(blatt + ' .eintrag__titel').allTextContents()).join('|') === 'Hagel|Betriebsferien|Kurzfristig geschlossen|Aktion|Stelle frei|Leerer Hinweis', '«Hinweis hinzufügen» öffnet das Blatt «Was möchten Sie mitteilen?» mit 6 Vorlagen');
  ok(await h.locator(blatt + ' .eintrag').evaluateAll((z) => z.every((x) => x.getBoundingClientRect().height >= 44)) && await h.evaluate(() => { const t = document.querySelector('dialog[open] h2'); return t.scrollWidth <= t.clientWidth; }), 'Vorlagen: Zeilen mindestens 44 Punkte hoch, der Titel des Blatts ist am Handy nicht abgeschnitten');
  await h.waitForTimeout(300); await h.screenshot({ path: S + '/e2e/2e-vorlagen-handy.png' });
  await h.click(blatt + ' .eintrag:has-text("Stelle frei")'); await h.waitForSelector(blatt, { state: 'detached' }); await h.waitForSelector(H(1));
  ok((await h.locator(H(1)).getByLabel('Titel').inputValue()) === 'Wir suchen Verstärkung' && (await h.inputValue(H(1) + ' .kachel input:checked')) === 'ecke' && /Kontakt/.test(await h.textContent(H(1) + ' .zeile--wahl:has-text("Führt zu") .wahl')), 'Vorlage «Stelle frei»: Titel, Karte in der Ecke, Link «Kontakt»');
  ok(await h.evaluate(() => { const r = document.querySelector('#hinweis-1').getBoundingClientRect(); return r.top >= 0 && r.top < window.innerHeight / 2; }), 'nach der Wahl der Vorlage steht der neue Hinweis im Bild');
  await h.click('button:has-text("Hinweis hinzufügen")'); await h.click(blatt + ' .eintrag:has-text("Aktion")'); await h.waitForSelector(H(2));
  ok((await h.inputValue(H(2) + ' .kachel input:checked')) === 'banner' && (await h.locator(H(2)).getByLabel('Titel').inputValue()) === '' && (await h.inputValue(H(2) + ' textarea')) === '', 'Vorlage «Aktion»: nichts erfunden (Titel und Text leer); die Karte ist belegt, darum Leiste oben');
  ok(!(await h.$('button:has-text("Hinweis hinzufügen")')), 'bei 3 Hinweisen gibt es keinen vierten');
  await h.locator(H(0)).getByRole('button', { name: /^Art / }).click(); await h.getByRole('option', { name: 'Information', exact: true }).click(); await h.waitForSelector('.menue', { state: 'detached' });
  await zurueck(h); await h.click(SCHNELL + ' button:has-text("Hinweis nach Hagel")'); await h.waitForSelector('.balken--fehler');
  ok(/Es gibt schon 3 Hinweise/.test(await h.textContent('.balken--fehler')) && new URL(h.url()).hash === '' && await h.isVisible('.balken--fehler a[href="#hinweise"]'), '«Hinweis nach Hagel» bei 3 Hinweisen: verständliche Meldung mit dem Weg dorthin');
  await h.click('.balken--fehler button.balken__tat'); await hin(h, 'hinweise'); ok((await h.$$('[id^="hinweis-"]')).length === 3, 'bei 3 Hinweisen wurde nichts angelegt');
  await hin(h, 'ausnahmen'); await h.click('.eintrag:has-text("Betriebsferien")'); await h.waitForSelector(blatt);
  ok(await h.isDisabled(SCH) && !(await h.isChecked(SCH)) && /Es gibt schon 3 Hinweise\. Mehr zeigt die Website nicht\./.test(await h.textContent(blatt)), 'Ferien bei 3 Hinweisen: Schalter ist aus und sagt warum'); await fertig(h);
  // «Neue Person im Team» und «Foto tauschen»
  await zurueck(h); await h.click(SCHNELL + ' button:has-text("Neue Person im Team")'); await h.waitForSelector(blatt);
  ok(new URL(h.url()).hash === '#team' && /Neue Person/.test(await h.textContent(blatt + ' h2')) && (await h.getByLabel('Name', { exact: true }).inputValue()) === '', '«Neue Person im Team»: Blatt für eine neue Person ist offen');
  await fertig(h); ok((await h.$$('main .zeile--eintrag')).length === 10 && !(await h.$('.eintrag:has-text("Ohne Namen")')), 'Blatt ohne Eingabe geschlossen: keine leere Person bleibt zurück');
  await zurueck(h); await h.click(SCHNELL + ' button:has-text("Foto tauschen")'); await h.waitForSelector('.app--bereich');
  ok(/Fotos/.test(await h.textContent('h1')) && new URL(h.url()).hash === '#fotos', '«Foto tauschen» führt in den Bereich «Fotos»');
  await h.click('.speichern .knopf--leise'); ok(!(await h.$('.speichern')), 'alle Entwürfe aus «Schnell erledigt» lassen sich verwerfen, nichts ist veröffentlicht');

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
  await h.click('a.nav[href="#hinweise"]'); await h.click('button:has-text("Hinweis hinzufügen")'); await h.click(blatt + ' .eintrag:has-text("Leerer Hinweis")'); await h.waitForSelector(blatt, { state: 'detached' });
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
  await handyOk(h, 'Handy 390, Hinweis mit Vorschau');
  await h.waitForTimeout(350); await h.screenshot({ path: S + '/e2e/2b-vorschau-handy.png' });
  await hin(h, 'ausnahmen'); await h.click('button:has-text("Feiertag oder Ferien hinzufügen")'); await h.waitForSelector(blatt);
  await h.getByLabel('Anlass').fill('Betriebsferien'); await h.getByLabel('Von', { exact: true }).fill('2026-12-28'); await h.getByLabel('Bis', { exact: true }).fill('2027-01-02');
  ok(/6 Tage am Stück/.test(await h.textContent(blatt)), 'Ferien von bis: das Blatt zählt die Tage'); await fertig(h);
  ok(/28\. Dezember 2026 bis .*2\. Januar 2027/.test(await h.textContent('main')), 'Ferien stehen als ein Eintrag «von bis» in der Liste');
  await h.click('button:has-text("Feiertag oder Ferien hinzufügen")'); await h.waitForSelector(blatt);
  await h.getByLabel('Anlass').fill('Heiligabend'); await h.getByLabel('Von', { exact: true }).fill('2026-12-24'); await h.locator(blatt + ' .schalter').first().uncheck();
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
  await h.waitForTimeout(450); await h.screenshot({ path: S + '/e2e/4-person-handy.png' });
  ok(await h.evaluate(() => [...document.querySelectorAll('dialog[open] input[type=file]')].every((x) => /image\/jpeg/.test(x.accept) && /image\/heic/.test(x.accept) && !x.hasAttribute('capture'))), 'Foto wählen: Das Dateifeld nimmt Bilder an (auch HEIC vom iPhone) und erzwingt keine Kamera, das Handy bietet Mediathek oder Kamera an');
  await handyOk(h, 'Handy 390, Blatt einer Person'); await fertig(h);
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
  // Das Bild wird bei jedem Anzeigen neu geholt (no-store). Erst prüfen, wenn der Browser damit fertig ist (geladen oder gescheitert).
  await h.waitForFunction(() => document.querySelector('.fotokarte img')?.complete);
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

  // ---------- «Schnell erledigt» bis auf die Website: Eintrag von heute mit Hinweis und ein Hinweis aus einer Vorlage, dann wieder entfernen
  await hin(h, '');
  ok(/1 aktiv/.test(await h.textContent('main a.zeile--link[href="#hinweise"]')), 'Übersicht «Ihre Website»: zeigt den veröffentlichten Hinweis («1 aktiv»)');
  await h.click(SCHNELL + ' button:has-text("Heute geschlossen")'); await h.waitForSelector(blatt); await h.check(SCH);
  ok((await h.textContent(blatt)).includes('Geschlossen am ' + ch(HEUTE) + '.'), '«Heute geschlossen» mit Hinweis: Text «Geschlossen am ' + ch(HEUTE) + '.»'); await fertig(h);
  await hin(h, 'hinweise'); await h.click('button:has-text("Hinweis hinzufügen")'); await h.click(blatt + ' .eintrag:has-text("Stelle frei")'); await h.waitForSelector(H(2));
  await veroeffentlichen(h, ['Neuer Tag: Geschlossen (' + ch(HEUTE) + ')', 'Neuer Hinweis: «Geschlossen am ' + ch(HEUTE) + '.»', 'Neuer Hinweis: «Möchten Sie bei uns arbeiten?'], 'Schnell erledigt und Vorlage');
  await h.reload(); await hin(h, '');
  ok(/3 aktiv/.test(await h.textContent('main a.zeile--link[href="#hinweise"]')) && /Geschlossen, heute/.test(await h.textContent('main a.zeile--link[href="#ausnahmen"]')) && !(await h.$('main .punkt')), 'nach dem Veröffentlichen zeigt die Übersicht: «3 aktiv» und «Geschlossen, heute»');
  await h.waitForTimeout(300); await h.screenshot({ path: S + '/e2e/8b-uebersicht-handy.png' });
  await hin(h, 'ausnahmen'); await h.click('.eintrag:has(.eintrag__titel:text-is("Geschlossen"))'); await h.waitForSelector(blatt);
  ok(await h.isChecked(SCH), 'nach Veröffentlichen und Neuladen erkennt der Schalter seinen Hinweis (ohne neues Feld in site.json)');
  await h.click(blatt + ' button:has-text("Eintrag entfernen")');
  ok(/Geschlossen entfernt, auch der Hinweis dazu/.test(await h.textContent('.toast')), 'Eintrag entfernen: Der Hinweis dazu geht mit, unten steht es mit «Rückgängig»');
  await hin(h, 'hinweise'); ok((await h.$$('[id^="hinweis-"]')).length === 2 && (await h.locator(H(1)).getByLabel('Titel').inputValue()) === 'Wir suchen Verstärkung', 'der Hinweis zum entfernten Eintrag ist weg, die anderen bleiben');
  await h.click(H(1) + ' button:has-text("Hinweis entfernen")');
  await veroeffentlichen(h, ['Tag entfernt: Geschlossen (' + ch(HEUTE) + ')', 'Hinweis entfernt: «Geschlossen am ' + ch(HEUTE) + '.»', 'Hinweis entfernt: «Möchten Sie bei uns arbeiten?'], 'Eintrag und Hinweise wieder entfernen');

  // ---------- Kleines Handy (320 × 568, die Untergrenze) und Querformat: jede Ansicht, Blatt, Menü, Meldungen. Alles bleibt Entwurf.
  const kc = await b.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true, locale: 'de-CH' }); const k = await kc.newPage();
  k.on('console', (x) => { if (x.type() === 'error' && !/status of 404/.test(x.text())) konsole.push(x.text()); }); k.on('pageerror', (e) => konsole.push(String(e)));
  await anmelden(b, k, 'werkstatt@autospeedy.example'); await k.waitForURL(C + '/');
  await handyOk(k, 'kleines Handy 320, Übersicht');
  const APP = '.nur-handy .klappe:has(summary:has-text("Als App aufs Handy"))';
  await k.click(APP + ' summary'); const appText = await k.textContent(APP);
  ok(/iPhone: Öffnen Sie das Cockpit in Safari\. Tippen Sie unten auf «Teilen» und dann auf «Zum Home-Bildschirm»\./.test(appText) && /Android: Öffnen Sie das Cockpit in Chrome\..*«App installieren» oder «Zum Startbildschirm hinzufügen»\./.test(appText) && await k.isVisible(APP + ' p'), 'Hilfe: «Als App aufs Handy» klappt auf und erklärt den Weg für iPhone und Android');
  await handyOk(k, 'kleines Handy 320, Hilfe «Als App aufs Handy» offen');
  await k.locator(APP).scrollIntoViewIfNeeded(); await k.waitForTimeout(300); await k.screenshot({ path: S + '/e2e/10-app-hilfe-kleines-handy.png' });
  // Chromium ohne Fenster kann «als App geöffnet» nicht nachstellen. Geprüft wird darum die Regel selbst: Das Stylesheet blendet
  // genau diese Zeile bei display-mode standalone aus (und nur sie: «So geht es» trägt die Klasse nicht).
  ok(await k.evaluate((sel) => { const z = document.querySelector(sel); for (const blatt of document.styleSheets) for (const r of blatt.cssRules) if (r instanceof CSSMediaRule && /display-mode:\s*standalone/.test(r.media.mediaText)) for (const i of r.cssRules) if (z.matches(i.selectorText) && i.style.display === 'none') return !document.querySelector('.nur-handy .klappe:not(.nur-browser)').matches(i.selectorText); return false; }, '.nur-handy .klappe.nur-browser'), 'läuft das Cockpit schon als App (display-mode standalone), blendet das Stylesheet die Zeile «Als App aufs Handy» aus, «So geht es» bleibt');
  for (const [id, name] of [['zeiten', 'Öffnungszeiten'], ['ausnahmen', 'Feiertage und Ferien'], ['team', 'Team'], ['fragen', 'Häufige Fragen'], ['fotos', 'Fotos'], ['partner', 'Partner'], ['inhaber', 'Inhaber und Bewertungen'], ['kontakt', 'Kontakt'], ['besucher', 'Besucher'], ['verlauf', 'Verlauf']]) { await hin(k, id); await handyOk(k, 'kleines Handy 320, ' + name); }
  ok(await k.evaluate(() => [...document.querySelectorAll('.zeile--stand .zeile__name')].every((x) => x.getBoundingClientRect().height < 50) && [...document.querySelectorAll('.zeile--stand .knopf')].every((x) => innerWidth - x.getBoundingClientRect().right < 40)), 'kleines Handy, Verlauf: Datum höchstens zwei Zeilen hoch, «Laden» steht rechts');
  await hin(k, 'fotos');
  ok(await k.evaluate(() => [...document.querySelectorAll('.zeile--foto .eintrag__titel')].every((x) => x.getBoundingClientRect().width >= 100)), 'kleines Handy, Fotos: Der Titel behält Platz (mindestens 100 Punkte), «Ersetzen» steht darunter');
  // Hinweis mit Vorschau (der veröffentlichte Hinweis), Auswahl-Menü
  await hin(k, 'hinweise'); await handyOk(k, 'kleines Handy 320, Hinweis mit Vorschau Handy');
  await k.click('.umschalter__feld:has-text("Computer")'); await handyOk(k, 'kleines Handy 320, Hinweis mit Vorschau Computer');
  ok(await k.evaluate(() => [...document.querySelectorAll('.vorschau .vs, .kacheln, .umschalter')].every((x) => { const r = x.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; })), 'kleines Handy: Vorschau, Darstellung und Umschalter passen in die Breite');
  await k.getByRole('button', { name: /^Führt zu / }).click(); await k.waitForSelector('.menue'); await k.waitForTimeout(350);
  ok(await k.evaluate(() => { const r = document.querySelector('.menue').getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight && [...document.querySelectorAll('.menue__punkt')].every((x) => x.getBoundingClientRect().height >= 44); }), 'kleines Handy: Das Auswahl-Menü steht ganz im Bild, jeder Eintrag ist mindestens 44 Punkte hoch');
  await k.keyboard.press('Escape'); await k.waitForSelector('.menue', { state: 'detached' });
  // Blatt am kleinen Handy: rollt innen, «Fertig» bleibt, die Seite dahinter steht. Meldung mit «Rückgängig» im Blatt.
  await hin(k, 'ausnahmen'); await k.click('button:has-text("Feiertag oder Ferien hinzufügen")'); await k.waitForSelector(blatt);
  await k.getByLabel('Anlass').fill('Betriebsferien'); await k.getByLabel('Von', { exact: true }).fill(F1); await k.getByLabel('Bis', { exact: true }).fill(F2); await k.check(SCH); await k.waitForTimeout(350);
  ok(await k.evaluate(() => { const d = document.querySelector('dialog[open]'), i = d.querySelector('.blatt__inhalt'), f = d.querySelector('.blatt__fertig').getBoundingClientRect(); return i.scrollHeight > i.clientHeight && getComputedStyle(i).overflowY === 'auto' && f.top >= 0 && f.bottom <= innerHeight && d.getBoundingClientRect().bottom <= innerHeight + 1 && getComputedStyle(document.documentElement).overflowY === 'hidden'; }), 'kleines Handy: Das Blatt rollt innen, «Fertig» bleibt im Bild, die Seite dahinter rollt nicht mit');
  await handyOk(k, 'kleines Handy 320, Blatt «Ferien»');
  await k.uncheck(SCH); await k.waitForSelector(blatt + ' .toast');
  ok(await k.evaluate(() => { const t = document.querySelector('dialog[open] .toast__tat'), r = t.getBoundingClientRect(); return r.height >= 44 && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === t; }), 'Meldung «Hinweis dazu entfernt» steht im offenen Blatt (nicht dahinter), «Rückgängig» lässt sich antippen');
  await k.click(blatt + ' .toast__tat'); await k.waitForSelector(blatt + ' .toast:has-text("Zurückgenommen.")');
  // Die Meldung erscheint einen Bildaufbau vor dem Schalter: Das Blatt nimmt die Verbindung zum Hinweis erst danach wieder auf
  // (useEffect in bereiche.tsx). Darum auf den Zustand warten, nicht auf Zeit. Kommt er nicht, schlägt die Prüfung darunter fehl.
  await k.waitForSelector(SCH + ':checked', { timeout: 5000 }).catch(() => {});
  ok(await k.isChecked(SCH) && (await k.textContent(blatt)).includes('Betriebsferien vom ' + ch(F1) + ' bis ' + ch(F2) + '.'), '«Rückgängig» im Blatt: Der Schalter ist wieder an, der Hinweis ist wieder da'); await fertig(k);
  await hin(k, 'hinweise'); ok((await k.$$('[id^="hinweis-"]')).length === 2, 'nach «Rückgängig» im Blatt gibt es den Hinweis zu den Ferien genau einmal');
  // Meldung mit einem langen Wort: bricht um, die Knöpfe bleiben im Bild
  await hin(k, 'ausnahmen'); await k.click('button:has-text("Feiertag oder Ferien hinzufügen")'); await k.waitForSelector(blatt);
  await k.getByLabel('Anlass').fill('Donaudampfschifffahrtsgesellschaftskapitänsmützenabzeichen'); await fertig(k);
  await k.click('.speichern .knopf:not(.knopf--leise)'); await k.waitForSelector('.balken--fehler');
  ok(/Donaudampfschifffahrtsgesellschaftskapitänsmützenabzeichen/.test(await k.textContent('.balken--fehler')) && await k.evaluate(() => [...document.querySelectorAll('.balken--fehler .balken__tat, .speichern .knopf')].every((x) => { const r = x.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; })), 'kleines Handy: Eine Meldung mit einem langen Wort bricht um, «OK» und die Knöpfe der Leiste bleiben im Bild');
  await handyOk(k, 'kleines Handy 320, Meldung mit langem Wort und Leiste unten'); await k.click('.balken--fehler button.balken__tat');
  // Team «Bearbeiten» mit einer Person, die «nicht sichtbar» ist und einen langen Namen hat
  await hin(k, 'team'); await k.click('.gruppe:has(.gruppe__titel:text-is("Carrosserie")) button:has-text("Person hinzufügen")'); await k.waitForSelector(blatt);
  await k.getByLabel('Name', { exact: true }).fill('Maximilian-Alexander von Hohenzollern'); await k.getByLabel('Aufgabe').fill('Carrosserie-Spengler'); await handyOk(k, 'kleines Handy 320, Blatt einer Person'); await fertig(k); await k.click('.kopf__tat');
  ok(await k.evaluate(() => { const z = [...document.querySelectorAll('.zeile--ordnen')].find((x) => /Hohenzollern/.test(x.textContent)); return z.querySelector('.eintrag__titel').getBoundingClientRect().width >= 100 && /nicht sichtbar/.test(z.querySelector('.eintrag__text .marke')?.textContent || ''); }), 'kleines Handy, Team «Bearbeiten»: Der Name behält Platz (mindestens 100 Punkte), «nicht sichtbar» steht darunter');
  await handyOk(k, 'kleines Handy 320, Team «Bearbeiten»'); await k.click('.kopf__tat');
  // Querformat: die Leiste unten ist eine Zeile hoch, ein fokussiertes Feld liegt nicht darunter
  await k.setViewportSize({ width: 844, height: 390 }); await hin(k, 'zeiten');
  ok(await k.evaluate(async () => { const f = [...document.querySelectorAll('main input[type=time]')].at(-1); f.focus(); await new Promise((r) => setTimeout(r, 250)); const r = f.getBoundingClientRect(), l = document.querySelector('.speichern').getBoundingClientRect(); return l.height <= 70 && r.bottom <= l.top && r.top >= 0; }), 'Querformat 844 × 390: Die Leiste unten ist eine Zeile hoch, das fokussierte Zeitfeld liegt nicht darunter');
  await handyOk(k, 'Querformat 844 × 390, Öffnungszeiten');
  ok(await k.evaluate(() => { const kf = document.querySelector('.kopf').getBoundingClientRect(); return kf.left <= 0 && kf.right >= innerWidth; }), 'Querformat: Der Kopf mit «Übersicht» geht über die ganze Breite');
  await k.click('.speichern .knopf--leise'); ok(!(await k.$('.speichern')), 'kleines Handy: alle Entwürfe verworfen, nichts davon ist veröffentlicht'); await kc.close();

  // ---------- App, Computer, Abmelden
  const m = await (await b.newContext()).newPage(); const mj = await (await m.goto(C + '/manifest.webmanifest')).json(); ok(mj.display === 'standalone' && mj.icons.length === 3, 'Manifest: installierbar als App');
  const symbole = [];
  for (const [pfad, mass] of [['/icon-192.png', '192x192'], ['/icon-512.png', '512x512'], ['/icon-maskable-512.png', '512x512'], ['/apple-touch-icon.png', '180x180']]) { const r = await m.request.get(C + pfad, { maxRedirects: 0 }); symbole.push(r.status() === 200 && /image\/png/.test(r.headers()['content-type'] || '') && pngMass(await r.body()) === mass ? '' : pfad + ' ' + r.status()); }
  const mr = await m.request.get(C + '/manifest.webmanifest', { maxRedirects: 0 });
  ok(mr.status() === 200 && mj.name === 'Auto Speedy Cockpit' && mj.short_name === 'Cockpit' && mj.lang === 'de-CH' && mj.start_url === '/' && mj.scope === '/' && mj.background_color === '#f2f2f7' && mj.theme_color === '#f2f2f7' && !mj.orientation && mj.icons.some((i) => i.purpose === 'maskable') && symbole.every((x) => !x), 'Manifest und Symbole ohne Anmeldung erreichbar (keine Umleitung auf den Login): Name, Start, Farben, Symbole 192, 512, maskable 512 und apple-touch-icon 180 als PNG in der richtigen Grösse' + symbole.filter(Boolean).join(' '));
  await m.goto(C + '/login');
  ok(await m.evaluate(() => document.querySelector('link[rel="manifest"]')?.getAttribute('href')?.startsWith('/manifest.webmanifest') && !!document.querySelector('link[rel="apple-touch-icon"][href^="/apple-touch-icon.png"]') && document.querySelector('meta[name="theme-color"]')?.content === '#f2f2f7' && /viewport-fit=cover/.test(document.querySelector('meta[name="viewport"]')?.content || '')) && /manifest-src 'self'/.test((await m.request.get(C + '/login')).headers()['content-security-policy'] || ''), 'Kopf der Seite: Manifest, apple-touch-icon, theme-color und viewport-fit=cover sind gesetzt, die CSP erlaubt das Manifest');
  ok((await m.goto(C + '/sw.js')).status() === 200 && (await m.goto(C + '/offline.html')).status() === 200, 'Service Worker und Offline-Seite ohne Login');
  await hin(h, ''); await h.waitForTimeout(800); ok(await h.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())), 'Service Worker angemeldet');
  const dc = await b.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-CH' }); const d = await dc.newPage();
  d.on('console', (x) => { if (x.type() === 'error' && !/status of 404/.test(x.text())) konsole.push(x.text()); }); d.on('pageerror', (e) => konsole.push(String(e)));
  await anmelden(b, d, 'werkstatt@autospeedy.example'); await d.waitForURL(C + '/');
  ok(await d.isVisible('.leiste nav') && /Website pflegen/.test(await d.textContent('h1')), 'Computer: Seitenleiste links, Übersicht rechts');
  ok(await d.isVisible(SCHNELL) && (await d.locator('main .klappe .zeile--schritt:visible').count()) === 3 && !(await d.isVisible('.leiste .klappe')), 'Computer: «Schnell erledigt» und die Hilfe mit den 3 Schritten stehen offen auf der Übersicht');
  await d.click(SCHNELL + ' button:has-text("Ferien eintragen")'); await d.waitForSelector(blatt);
  ok(await d.isVisible('.nav--aktiv[href="#ausnahmen"]') && (await d.getByLabel('Anlass').inputValue()) === 'Betriebsferien', 'Computer: «Ferien eintragen» wechselt den Bereich und öffnet das Blatt');
  await d.waitForTimeout(450); await d.screenshot({ path: S + '/e2e/9a-ferien-computer.png' }); await fertig(d);
  ok(!(await d.$('.speichern')), 'Computer: Blatt ohne Eingabe geschlossen, nichts bleibt zurück');
  await d.click('a.nav[href="#team"]'); await d.waitForSelector('.nav--aktiv[href="#team"]'); ok(await d.isVisible('.leiste nav') && /Team/.test(await d.textContent('h1')), 'Computer: Bereich wechselt rechts, die Leiste bleibt');
  await d.keyboard.press('Tab'); ok(await d.evaluate(() => !!document.activeElement && document.activeElement !== document.body), 'Computer: mit der Tastatur bedienbar');
  await d.waitForTimeout(450); await d.screenshot({ path: S + '/e2e/9-team-computer.png' });
  ok(konsole.length === 0, 'keine Fehler in der Konsole (auch keine CSP-Verstösse)' + (konsole.length ? ': ' + konsole.join(' | ') : ''));
  await hin(h, ''); await h.click('button:has-text("Abmelden")'); await h.waitForURL(C + '/login'); await h.goto(C + '/'); ok(new URL(h.url()).pathname === '/login', 'Abmelden: danach wieder Login');
  await b.close(); console.log('ALLES GRÜN');
})().catch((e) => { console.error(e.message); if (konsole.length) console.error('Konsole: ' + konsole.join(' | ')); process.exit(1); });
