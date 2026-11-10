// Zugang im echten Betrieb, gegen das gebaute Cockpit OHNE Demo. Cloudflare Access wird gespielt: Dieses Skript bietet auf
// Port 4499 die öffentlichen Schlüssel an (wie <team>.cloudflareaccess.com/cdn-cgi/access/certs) und stellt Ausweise aus.
// Cockpit dazu starten mit:  ACCESS_TEAM=http://127.0.0.1:4499 ACCESS_AUD=test-aud npx next start -p 4411
// Aufruf: node tests/betrieb.cjs   (COCKPIT_URL: andere Adresse als http://localhost:4411)
const http = require('node:http');
const { generateKeyPairSync, createSign } = require('node:crypto');
const { chromium } = require('playwright');
const C = process.env.COCKPIT_URL || 'http://localhost:4411', TEAM = 'http://127.0.0.1:4499', AUD = 'test-aud';
const ok = (b, t) => { if (!b) throw new Error('FEHLER: ' + t); console.log('ok  ' + t); };
const paar = () => { const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 }); return { privat: privateKey, jwk: { ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' } }; };
const b64 = (x) => Buffer.from(JSON.stringify(x)).toString('base64url');
const ausweis = (p, nutz = {}) => { const jetzt = Math.floor(Date.now() / 1000); const teil = b64({ alg: 'RS256', kid: 'k1', typ: 'JWT' }) + '.' + b64({ iss: TEAM, aud: [AUD], email: 'chef@beispiel.example', iat: jetzt, nbf: jetzt, exp: jetzt + 600, ...nutz }); return teil + '.' + createSign('RSA-SHA256').update(teil).sign(p.privat).toString('base64url'); };

(async () => {
  const echt = paar(), fremd = paar(); let geholt = 0;
  const access = http.createServer((q, a) => { if (q.url === '/cdn-cgi/access/certs') { geholt++; a.setHeader('content-type', 'application/json'); a.end(JSON.stringify({ keys: [echt.jwk] })); } else { a.statusCode = 404; a.end(); } });
  await new Promise((r) => access.listen(4499, '127.0.0.1', r));
  try {
    const hole = (pfad, jwt) => fetch(C + pfad, { redirect: 'manual', headers: jwt ? { 'cf-access-jwt-assertion': jwt } : {} });
    for (const p of ['/', '/irgendwo', '/api/demo-foto/x.webp']) { const r = await hole(p); ok(r.status === 403, 'ohne Ausweis von Access: ' + p + ' → 403'); }
    const zu = await hole('/'); const zuText = await zu.text();
    ok(/Kein Zugang/.test(zuText) && /\/cdn-cgi\/access\/logout/.test(zuText) && !/<h1[^>]*>Website pflegen/.test(zuText) && zu.headers.get('cache-control') === 'no-store', 'die 403-Seite sagt «Kein Zugang», bietet «Neu anmelden» und zeigt nichts vom Cockpit');
    ok((await hole('/', ausweis(fremd))).status === 403, 'gefälschter Ausweis (anderer Schlüssel) → 403');
    ok((await hole('/', ausweis(echt, { aud: ['andere-anwendung'] }))).status === 403, 'Ausweis für eine andere Anwendung → 403');
    ok((await hole('/', ausweis(echt, { exp: Math.floor(Date.now() / 1000) - 600 }))).status === 403, 'abgelaufener Ausweis → 403');
    const drin = await hole('/', ausweis(echt)); const drinText = await drin.text();
    ok(drin.status === 200 && /<h1[^>]*>Website pflegen/.test(drinText) && !/Kein Zugang/.test(drinText), 'gültiger Ausweis → 200, das Cockpit antwortet');
    ok(/nicht erreichbar/.test(drinText) && !/Demo/.test(drinText), 'ohne Verbindung zur Website (GITHUB_… nicht gesetzt) sagt es das klar; kein Demo-Band im Betrieb');
    ok(/nonce-/.test(drin.headers.get('content-security-policy') || '') && !(drin.headers.get('set-cookie')), 'strenge CSP, und das Cockpit setzt keine Cookies');
    ok(geholt >= 1 && geholt <= 2, 'die Schlüssel von Access wurden geholt und zwischengespeichert (' + geholt + ' Abruf, höchstens je einer für Proxy und Seite)');
    ok((await hole('/demo/postfach', ausweis(echt))).status === 404 && [307, 308].includes((await hole('/login', ausweis(echt))).status), 'Demo-Postfach gibt es nicht; alte Adresse /login leitet um');
    ok((await hole('/api/demo-foto/x.webp', ausweis(echt))).status === 404, 'Demo-Fotos gibt es im Betrieb nicht');
    // Im Browser: Abmelden führt zur Abmelde-Adresse von Access (die gibt es lokal nicht, darum zählt nur die Adresse).
    const b = await chromium.launch(); const k = await b.newContext({ extraHTTPHeaders: { 'cf-access-jwt-assertion': ausweis(echt) } }); const p = await k.newPage();
    await p.goto(C + '/'); ok(await p.isVisible('button:has-text("Abmelden")'), 'im Betrieb gibt es «Abmelden»');
    await p.click('button:has-text("Abmelden")'); await p.waitForURL((u) => u.pathname === '/cdn-cgi/access/logout');
    ok(true, '«Abmelden» führt zu /cdn-cgi/access/logout (Cloudflare Access beendet dort die Anmeldung)');
    ok(await p.evaluate(() => true) && (await k.cookies()).length === 0, 'auch im Browser: keine eigenen Cookies');
    await b.close(); console.log('ALLES GRÜN');
  } finally { access.close(); }
})().catch((e) => { console.error(e.message); process.exit(1); });
