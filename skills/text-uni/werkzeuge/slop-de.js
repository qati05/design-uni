// Slop-Prüfung für deutsche Texte von Schweizer KMU-Websites: Floskeln, KI-typische Muster und generische Knöpfe.
// Liest nur den sichtbaren Text (ohne script, style, Kommentare und Tags) und meldet Treffer je Datei mit Zeile und Kontext.
// Aufruf: node werkzeuge/slop-de.js <ordner|datei> [--json <pfad>] [--streng] [--prueflauf] [--erlauben=id1,id2] [--liste=<slop-de.json>]
//   Ordner: alle .html/.htm darin, auch in Unterordnern (ohne node_modules und Ordner mit Punkt). Eine Datei: jede Endung.
//   --json <pfad>     schreibt alle Treffer als JSON (für eigene Auswertungen)
//   --streng          auch Warnungen führen zu Exit-Code 1
//   --prueflauf       für den gemeinsamen Prüflauf (TP7/K1): jeder Treffer ist ein HINWEIS, Exit-Code 0 (K1 sperrt nicht,
//                     Entscheid 13 und zusammenspiel.md Teil 7); keine HTML-Datei heisst «nicht geprüft». Nicht mit --streng.
//   --erlauben=a,b    diese Einträge der Liste auslassen (z. B. sz bei einem Kunden in Deutschland)
// Liste: werkzeuge/slop-de.json; Begründung und bessere Variante stehen je Eintrag in «warum» und «besser».
// Hintergrund und Abgleich mit der Forschung: referenzen/semester1/ki-klang.md, Teil 6.
// Exit-Code: 0 = kein FEHLER, 1 = mindestens ein FEHLER (mit --streng auch eine WARNUNG), 2 = falscher Aufruf; mit --prueflauf 0 oder 2.
// Stufe FEHLER mit belegbar=true wird zu WARNUNG, wenn im selben Satz eine Zahl steht: dann prüft ein Mensch, ob der Beleg trägt.
'use strict';
const fs = require('fs'), path = require('path');

const LISTE = path.join(__dirname, 'slop-de.json');
const VOR = '(?<![\\p{L}\\p{N}])', NACH = '(?![\\p{L}\\p{N}])';
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '', ndash: '–', mdash: '—', szlig: 'ß', auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', laquo: '«', raquo: '»', hellip: '…', rarr: '→' };

function entitiesAufloesen(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') { const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); try { return String.fromCodePoint(n); } catch (x) { return m; } }
    return e in ENTITIES ? ENTITIES[e] : (e.toLowerCase() in ENTITIES ? ENTITIES[e.toLowerCase()] : m);
  });
}

// Ersetzt einen Bereich durch Leerzeichen, behält aber die Zeilenumbrüche (damit die Zeilennummern stimmen).
const leeren = (s) => s.replace(/[^\n]/g, ' ');

// Sichtbarer Text einer HTML-Seite (ohne Code-Beispiele in code und pre), gleich lang wie das Original (Zeilen bleiben erhalten). Tags werden zu Leerzeichen.
function sichtbarerText(html) {
  let t = html
    .replace(/<!--[\s\S]*?-->/g, leeren)
    .replace(/<(script|style|noscript|template|svg|head|code|pre)\b[\s\S]*?<\/\1\s*>/gi, (m) => {
      // Der Title ist sichtbar (Tab, Suchergebnis): aus dem head nur ihn behalten.
      if (/^<head/i.test(m)) return m.replace(/<title[^>]*>([\s\S]*?)<\/title>|[\s\S]/gi, (x, ti) => (ti !== undefined ? leeren(x.slice(0, x.indexOf('>') + 1)) + ti + leeren(x.slice(x.lastIndexOf('<'))) : (x === '\n' ? '\n' : ' ')));
      return leeren(m);
    })
    .replace(/<[^>]*>/g, leeren);
  return t;
}

// Normalisiert Leerraum und merkt für jedes Zeichen die Zeile im Original.
function normalisieren(text) {
  let aus = '', zeilen = [], zeile = 1, leer = true;
  // Entities zeilenweise auflösen, damit die Zeilenzählung stimmt.
  const teile = text.split('\n');
  for (let i = 0; i < teile.length; i++) {
    const z = entitiesAufloesen(teile[i]);
    for (const ch of z) {
      if (/\s/.test(ch)) { if (!leer) { aus += ' '; zeilen.push(zeile); leer = true; } continue; }
      aus += ch; for (let k = 0; k < ch.length; k++) zeilen.push(zeile); leer = false;
    }
    if (!leer) { aus += ' '; zeilen.push(zeile); leer = true; }
    zeile++;
  }
  return { text: aus, zeilen };
}

function zeileBei(html, index) { let n = 1; for (let i = 0; i < index && i < html.length; i++) if (html.charCodeAt(i) === 10) n++; return n; }

// Beschriftungen von Links und Knöpfen: Text des Elements, sonst aria-label bzw. value.
function beschriftungen(html) {
  const aus = [];
  const sauber = html.replace(/<!--[\s\S]*?-->/g, leeren).replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, leeren);
  for (const m of sauber.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi)) {
    let text = entitiesAufloesen(m[3].replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (!text) { const a = m[2].match(/aria-label\s*=\s*"([^"]*)"/i); text = a ? entitiesAufloesen(a[1]).trim() : ''; }
    const href = (m[2].match(/href\s*=\s*"([^"]*)"/i) || [])[1] || '';
    aus.push({ text, href, zeile: zeileBei(html, m.index) });
  }
  for (const m of sauber.matchAll(/<input\b[^>]*type\s*=\s*"(submit|button)"[^>]*>/gi)) {
    const v = m[0].match(/value\s*=\s*"([^"]*)"/i);
    if (v) aus.push({ text: entitiesAufloesen(v[1]).trim(), href: '', zeile: zeileBei(html, m.index) });
  }
  return aus;
}

const kurz = (s) => s.replace(/[\s→›»>.!:]+$/u, '').replace(/^[\s←‹«<]+/u, '').trim().toLowerCase();

function listeLaden(datei = LISTE) {
  const j = JSON.parse(fs.readFileSync(datei, 'utf8'));
  const leere = new Set((j.leereAdjektive || []).map((w) => w.toLowerCase()));
  const eintraege = j.eintraege.map((e) => ({
    ...e,
    regex: (e.muster || []).map((m) => (e.art === 'button' ? new RegExp('^(?:' + m + ')$', 'iu') : new RegExp(e.grenzen === false ? m : VOR + '(?:' + m + ')' + NACH, 'giu'))),
  }));
  return { version: j.version, eintraege, leere };
}

function satzUm(text, start, ende) {
  let a = start; while (a > 0 && !/[.!?]/.test(text[a - 1])) a--;
  let b = ende; while (b < text.length && !/[.!?]/.test(text[b])) b++;
  return text.slice(a, b);
}

function kontext(text, start, ende) {
  const a = Math.max(0, start - 40), b = Math.min(text.length, ende + 40);
  return (a > 0 ? '…' : '') + text.slice(a, b).trim() + (b < text.length ? '…' : '');
}

// Prüft einen Text (HTML oder, mit istHtml=false, reinen Text). Rückgabe: Liste der Treffer.
function pruefeText(roh, { liste = listeLaden(), istHtml = true, erlauben = [] } = {}) {
  const frei = new Set(erlauben);
  const n = normalisieren(istHtml ? sichtbarerText(roh) : roh);
  const T = n.text, treffer = [];
  const melde = (e, start, ende, stufe = e.stufe, hinweis) => treffer.push({ id: e.id, art: e.art, stufe, zeile: n.zeilen[start] || 1, fund: T.slice(start, ende).trim(), kontext: kontext(T, start, ende), warum: e.warum, besser: e.besser, ...(hinweis ? { hinweis } : {}) });
  for (const e of liste.eintraege) {
    if (frei.has(e.id) || e.art === 'button') continue;
    if (e.pruefung === 'dreierkette') {
      for (const m of T.matchAll(/(?<![\p{L}])(\p{Ll}+), (\p{Ll}+),? (?:und|&) (\p{Ll}+)(?![\p{L}])/gu)) {
        const leer = [m[1], m[2], m[3]].filter((w) => liste.leere.has(w.toLowerCase())).length;
        if (leer >= 2) melde(e, m.index, m.index + m[0].length);
      }
      continue;
    }
    for (const r of e.regex) {
      r.lastIndex = 0;
      for (const m of T.matchAll(r)) {
        if (!m[0]) continue;
        let stufe = e.stufe, hinweis;
        if (e.belegbar && stufe === 'FEHLER' && /\d/.test(satzUm(T, m.index, m.index + m[0].length))) { stufe = 'WARNUNG'; hinweis = 'Zahl im selben Satz: Beleg von Hand prüfen'; }
        melde(e, m.index, m.index + m[0].length, stufe, hinweis);
      }
    }
  }
  if (istHtml) {
    const labels = beschriftungen(roh);
    for (const e of liste.eintraege) {
      if (e.art !== 'button' || frei.has(e.id)) continue;
      if (e.pruefung === 'nur-kontakt-cta') {
        const direkt = labels.some((l) => /^(tel:|mailto:|https?:\/\/(wa\.me|api\.whatsapp\.com)\/)/i.test(l.href)) || /href\s*=\s*"(tel:|mailto:)/i.test(roh);
        const kontakt = labels.filter((l) => e.regex.some((r) => r.test(kurz(l.text))));
        if (kontakt.length && !direkt) treffer.push({ id: e.id, art: e.art, stufe: e.stufe, zeile: kontakt[0].zeile, fund: kontakt[0].text, kontext: `Knopf «${kontakt[0].text}», kein tel:- oder mailto:-Link auf der Seite`, warum: e.warum, besser: e.besser });
        continue;
      }
      for (const l of labels) {
        if (l.text && e.regex.some((r) => r.test(kurz(l.text)))) treffer.push({ id: e.id, art: e.art, stufe: e.stufe, zeile: l.zeile, fund: l.text, kontext: `Linktext «${l.text}»${l.href ? ' → ' + l.href : ''}`, warum: e.warum, besser: e.besser });
      }
    }
  }
  return treffer.sort((a, b) => a.zeile - b.zeile || (a.stufe === b.stufe ? 0 : a.stufe === 'FEHLER' ? -1 : 1));
}

function dateienIn(ziel) {
  const st = fs.statSync(ziel);
  if (st.isFile()) return [ziel];
  const aus = [];
  const gehe = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) gehe(p); else if (/\.html?$/i.test(e.name)) aus.push(p);
    }
  };
  gehe(ziel);
  return aus;
}

function pruefePfad(ziel, { liste = listeLaden(), erlauben = [], log = console.log } = {}) {
  const basis = fs.statSync(ziel).isFile() ? path.dirname(ziel) : ziel;
  const ergebnis = { ziel: path.resolve(ziel), zeit: new Date().toISOString(), listeVersion: liste.version, erlaubt: erlauben, dateien: [], fehler: 0, warnungen: 0 };
  for (const f of dateienIn(ziel)) {
    const roh = fs.readFileSync(f, 'utf8');
    const treffer = pruefeText(roh, { liste, istHtml: /\.html?$/i.test(f), erlauben });
    const rel = path.relative(basis, f) || path.basename(f);
    const fe = treffer.filter((t) => t.stufe === 'FEHLER').length, wa = treffer.length - fe;
    ergebnis.dateien.push({ datei: rel, fehler: fe, warnungen: wa, treffer });
    ergebnis.fehler += fe; ergebnis.warnungen += wa;
    log(`${rel.padEnd(28)} Fehler ${fe}  Warnungen ${wa}`);
    for (const t of treffer) log(`  ${t.stufe === 'FEHLER' ? '!' : '-'} ${t.stufe} Z.${t.zeile} [${t.id}] «${t.fund}»: ${t.kontext}${t.hinweis ? ' (' + t.hinweis + ')' : ''}`);
  }
  log(`Dateien: ${ergebnis.dateien.length}`);
  log(`Fehler: ${ergebnis.fehler}`);
  log(`Warnungen: ${ergebnis.warnungen}`);
  return ergebnis;
}

// Erlaubt neben --name=wert auch «--name wert» für Schalter, die einen Wert brauchen.
function schalter(argv, mitWert) {
  const pos = [], opt = {};
  for (let i = 0; i < argv.length; i++) {
    const m = argv[i].match(/^--([^=]+)(?:=(.*))?$/);
    if (!m) { pos.push(argv[i]); continue; }
    if (m[2] !== undefined) opt[m[1]] = m[2];
    else if (mitWert.includes(m[1]) && i + 1 < argv.length && !argv[i + 1].startsWith('--')) opt[m[1]] = argv[++i];
    else opt[m[1]] = true;
  }
  return { pos, opt };
}

function main(argv, log = console.log) {
  const { pos, opt } = schalter(argv, ['json', 'erlauben', 'liste']);
  const ziel = pos[0];
  if (!ziel || !fs.existsSync(ziel) || opt.json === true || (opt.prueflauf && opt.streng)) { console.error('Aufruf: node werkzeuge/slop-de.js <ordner|datei> [--json <pfad>] [--streng | --prueflauf] [--erlauben=id1,id2]'); return 2; }
  let liste;
  try { liste = listeLaden(typeof opt.liste === 'string' ? opt.liste : LISTE); } catch (e) { console.error('Liste nicht lesbar: ' + e.message); return 2; }
  const erlauben = typeof opt.erlauben === 'string' ? opt.erlauben.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const unbekannt = erlauben.filter((id) => !liste.eintraege.some((e) => e.id === id));
  if (unbekannt.length) { console.error('Unbekannte Einträge bei --erlauben: ' + unbekannt.join(', ')); return 2; }
  const r = pruefePfad(ziel, { liste, erlauben, log });
  if (!r.dateien.length) log('Hinweis: keine HTML-Datei gefunden, nichts geprüft.');
  if (opt.prueflauf) {
    r.prueflauf = { kennung: 'TP7/K1', stufe: r.dateien.length ? 'HINWEIS' : 'nicht geprüft', hinweise: r.fehler + r.warnungen };
    log(`Prüflauf TP7/K1: ${r.dateien.length ? (r.fehler + r.warnungen) + ' HINWEIS (sperrt nicht, Entscheid 13)' : 'nicht geprüft'}`);
  }
  if (typeof opt.json === 'string') { fs.mkdirSync(path.dirname(path.resolve(opt.json)), { recursive: true }); fs.writeFileSync(opt.json, JSON.stringify(r, null, 2), 'utf8'); }
  if (opt.prueflauf) return 0;
  return r.fehler > 0 || (opt.streng && r.warnungen > 0) ? 1 : 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { listeLaden, pruefeText, pruefePfad, sichtbarerText, beschriftungen, schalter, main, entitiesAufloesen };
