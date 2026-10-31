#!/usr/bin/env python3
"""Baut site/*.html aus einem Rahmen (Kopf, Fuss) und den Seiteninhalten.
Aufruf: python3 -I werkzeug/bauen.py <projektordner>"""
import sys, pathlib, html
basis = pathlib.Path(sys.argv[1]); site = basis / 'site'

TEL, TEL_H = '071 755 88 61', 'tel:+41717558861'
MOBIL, MOBIL_H = '076 615 44 41', 'tel:+41766154441'
MAIL = 'info@autospeedy.ch'
ROUTE = 'https://www.google.com/maps/search/?api=1&query=Auto%20Speedy%20AG%2C%20Alte%20Landstrasse%2063%2C%209450%20Altst%C3%A4tten'
GOOGLE = 'https://www.google.com/maps/place/Auto+Speedy+AG/@47.369432,9.559048,15z/data=!4m2!3m1!1s0x0:0x910d215ca34ca91?hl=de'
AUTOSCOUT = 'https://www.autoscout24.ch/de/s/seller-67678'
NAV = [('carrosserie.html', 'Carrosserie'), ('lack.html', 'Lack'), ('occasionen.html', 'Occasionen'), ('betrieb.html', 'Betrieb'), ('kontakt.html', 'Kontakt')]

def tel(ort, gross=False, text=TEL, href=TEL_H):
    return f'<a class="{"tel-gross" if gross else ""}" href="{href}" data-zaehl="anruf" data-ort="{ort}">{text.replace(" ", "&nbsp;")}</a>'

def kopf(aktiv):
    links = ''.join(f'<a href="{h}"{" aria-current=\"page\"" if h == aktiv else ""}>{t}</a>' for h, t in NAV)
    return f'''<a class="skip" href="#inhalt">Zum Inhalt</a>
<header class="kopf"><div class="rahmen">
  <a class="kopf__name" href="index.html">Auto Speedy AG</a>
  <nav class="kopf__nav" aria-label="Seiten">{links}</nav>
  <details class="kopf__menue"><summary>Menü</summary><nav aria-label="Seiten (Handy)">{links}</nav></details>
  <a class="kopf__tel" href="{TEL_H}" data-zaehl="anruf" data-ort="kopf">{TEL.replace(" ", "&nbsp;")}</a>
</div></header>'''

FUSS = f'''<footer class="fuss"><div class="rahmen">
  <dl class="schriftfeld">
    <div><dt>Betrieb</dt><dd>Auto Speedy AG<br>Carrosserie, Spritzwerk, Occasionen</dd></div>
    <div><dt>Anschrift</dt><dd>Alte Landstrasse 63<br>9450 Altstätten SG<br><a href="{ROUTE}" data-zaehl="route" data-ort="fuss">Route öffnen</a></dd></div>
    <div><dt>Offen</dt><dd>Mo–Do 07.30–12.00, 13.15–17.30<br>Fr 07.30–12.00, 13.15–17.15</dd></div>
    <div><dt>Telefon</dt><dd>{tel("fuss")}<br>Mobil {tel("fuss-mobil", text=MOBIL, href=MOBIL_H)}<br><a href="mailto:{MAIL}" data-zaehl="mail" data-ort="fuss">{MAIL}</a></dd></div>
  </dl>
  <p class="fuss__unten"><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a><span>Vorschau, nicht veröffentlicht. Fotos: Auto Speedy AG.</span></p>
</div></footer>'''

def seite(datei, titel, beschreibung, inhalt, aktiv=''):
    doc = f'''<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(titel)}</title>
<meta name="description" content="{html.escape(beschreibung)}">
<meta name="robots" content="noindex">
<link rel="preload" href="schriften/saira-condensed-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="stil.css">
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('bewegt');</script>
</head>
<body>
{kopf(aktiv)}
<main id="inhalt">
{inhalt}
</main>
{FUSS}
<script src="seite.js" defer></script>
</body>
</html>
'''
    (site / datei).write_text(doc, encoding='utf-8')

# Stellen am Auto: id, Name, Fläche (SVG-Pfad), Mitte der Markierung
STELLEN = [
    ('front', 'Stossstange vorne', 'M290 70 Q380 50 470 70 L490 112 L270 112 Z', (380, 88)),
    ('haube', 'Motorhaube', 'M270 112 L490 112 L506 252 L254 252 Z', (380, 185)),
    ('scheibe', 'Frontscheibe', 'M262 262 Q380 240 498 262 L478 330 Q380 318 282 330 Z', (380, 292)),
    ('dach', 'Dach', 'M282 330 Q380 318 478 330 L478 520 Q380 530 282 520 Z', (380, 425)),
    ('heck', 'Heck', 'M266 582 Q380 600 494 582 L506 698 L254 698 Z', (380, 640)),
    ('hinten', 'Stossstange hinten', 'M258 702 L502 702 L498 730 Q380 765 262 730 Z', (380, 726)),
    ('links', 'Seite links', 'M246 262 L282 262 L282 582 L246 582 Z', (262, 420)),
    ('rechts', 'Seite rechts', 'M478 262 L514 262 L514 582 L478 582 Z', (498, 420)),
    ('felgen', 'Felgen', 'M232 160 h18 v84 h-18 Z M510 160 h18 v84 h-18 Z M232 600 h18 v84 h-18 Z M510 600 h18 v84 h-18 Z', (519, 642)),
]

def skizze(beschriftungen=True):
    zonen = ''.join(f'<path class="zone" data-stelle="{i}" d="{d}"><title>{n}</title></path>' for i, n, d, _ in STELLEN)
    marken = ''.join(f'<circle class="marke" data-marke="{i}" cx="{x}" cy="{y}" r="{30 if i in ("links","rechts","felgen") else 40}" transform="rotate(-90 {x} {y})"/>' for i, _, _, (x, y) in STELLEN)
    texte = '''<g class="beschriftungen">
  <path class="leitung" d="M500 200 L560 220 H740"/><text x="562" y="210">Originalteile, nach Herstellervorgabe</text>
  <path class="leitung" d="M470 420 L560 400 H740"/><text x="562" y="390">Hagel und Dellen</text>
  <path class="leitung" d="M282 296 L210 270 H20"/><text x="20" y="260">Scheiben wechseln, reparieren</text>
  <path class="leitung" d="M282 640 L210 660 H20"/><text x="20" y="650">Lack aus eigenen Kabinen</text>
  <path class="leitung" d="M506 690 L560 760 H740"/><text x="562" y="750">Tesla Approved Body Shop</text>
</g>''' if beschriftungen else ''
    return f'''<svg viewBox="0 0 760 800" role="img" aria-label="Auto von oben als Strichzeichnung. Tippen Sie die beschädigte Stelle an.">
  <g class="strich">
    <path d="M290 70 Q380 50 470 70 L500 120 Q512 160 512 220 L512 640 Q512 700 498 730 Q380 765 262 730 Q248 700 248 640 L248 220 Q248 160 260 120 Z"/>
    <path d="M262 262 Q380 240 498 262 L478 330 Q380 318 282 330 Z"/>
    <path d="M282 520 Q380 530 478 520 L494 582 Q380 600 266 582 Z"/>
    <path d="M282 330 L282 520 M478 330 L478 520"/>
    <path d="M254 252 L506 252 M254 698 L506 698 M270 112 L490 112"/>
    <path d="M250 420 H282 M478 420 H510"/>
    <path d="M248 290 L214 278 L214 306 L248 314 M512 290 L546 278 L546 306 L512 314"/>
    <rect x="232" y="160" width="18" height="84" rx="6"/><rect x="510" y="160" width="18" height="84" rx="6"/>
    <rect x="232" y="600" width="18" height="84" rx="6"/><rect x="510" y="600" width="18" height="84" rx="6"/>
    <path d="M296 84 Q318 78 336 86 M424 86 Q442 78 464 84 M290 716 Q316 724 334 716 M426 716 Q444 724 470 716"/>
  </g>
  <text class="richtung" x="380" y="34" text-anchor="middle">vorne</text>
  <g class="hinweis" aria-hidden="true"><circle cx="440" cy="94" r="38" stroke-dasharray="8 8"/><path d="M478 108 L560 150 H738"/><text x="562" y="140">Zum Beispiel hier antippen</text></g>
  {texte}
  <g>{zonen}</g>
  <g aria-hidden="true">{marken}</g>
</svg>'''

def stellen_auswahl():
    return '<fieldset class="stellen"><legend>Wo ist der Schaden? Antippen, mehrere möglich.</legend>' + ''.join(
        f'<label><input type="checkbox" name="stelle" value="{n}" data-stelle="{i}"><span>{n}</span></label>' for i, n, _, _ in STELLEN) + '</fieldset>'

def formular(ort, mit_stellen=True):
    return f'''<form class="formular" id="melden" data-ziel="" data-mail="{MAIL}" data-zaehl="anfrage" data-ort="{ort}" novalidate>
  {stellen_auswahl() if mit_stellen else ''}
  <div class="feld"><label for="{ort}-name">Name *</label><input id="{ort}-name" name="name" autocomplete="name" required><p class="fehler" id="{ort}-name-f">Bitte Ihren Namen eintragen.</p></div>
  <div class="feld"><label for="{ort}-tel">Telefon *</label><input id="{ort}-tel" name="telefon" type="tel" inputmode="tel" autocomplete="tel" required><p class="fehler" id="{ort}-tel-f">Bitte eine Telefonnummer eintragen, zum Beispiel 079 123 45 67.</p></div>
  <div class="feld"><label for="{ort}-auto">Marke, Modell oder Kennzeichen (optional)</label><input id="{ort}-auto" name="auto" autocomplete="off"></div>
  <div class="feld"><label for="{ort}-text">Was ist passiert? (optional)</label><textarea id="{ort}-text" name="text"></textarea></div>
  <div><button class="knopf" type="submit">Schaden melden</button></div>
  <p class="formular__hinweis">Unverbindlich. Ihre Angaben nutzen wir nur für diese Meldung. Verantwortlich: Auto Speedy AG, Altstätten (<a href="datenschutz.html">Datenschutz</a>). Fotos hängen Sie in der Mail an, die sich nach dem Tippen öffnet.</p>
  <div class="meldung" role="status" aria-live="polite"></div>
</form>'''

ABLAUF = f'''<ol class="ablauf">
  <li><h3>Melden</h3><p>Rufen Sie an ({tel("ablauf")}) oder schicken Sie zwei Fotos: eines vom ganzen Auto, eines von der Stelle.</p></li>
  <li><h3>Offerte und Versicherung</h3><p>Sie erhalten eine Offerte. Die Abwicklung mit Ihrer Versicherung erledigen wir.</p></li>
  <li><h3>Reparatur</h3><p>Nach Herstellervorgaben, ausschliesslich mit Original-Ersatzteilen. Wie lange es dauert, sagen wir Ihnen mit der Offerte.</p></li>
</ol>'''

BELEGE = f'''<dl class="belege">
  <div class="beleg-zeile"><dt>Zertifiziert</dt><dd>Tesla Approved Body Shop</dd></div>
  <div class="beleg-zeile"><dt>Partner</dt><dd>Ayvens, Land Rover, AMAG</dd></div>
  <div class="beleg-zeile"><dt>Bewertungen</dt><dd>4,8 von 5 auf Google, 33 Bewertungen · <a href="{GOOGLE}" rel="noopener" data-zaehl="bewertungen" data-ort="belege">lesen</a></dd></div>
  <div class="beleg-zeile"><dt>Betrieb</dt><dd>Aktiengesellschaft seit 2016, 10 Leute, davon 2 in Ausbildung</dd></div>
</dl>'''

def foto(name, alt, unterschrift, laden='lazy'):
    return f'''<figure class="beleg-foto"><img src="bilder/{name}-800.webp" srcset="bilder/{name}-800.webp 800w, bilder/{name}-1600.webp 1600w" sizes="340px" width="800" height="1000" alt="{html.escape(alt)}" loading="{laden}" decoding="async"><figcaption>{unterschrift}</figcaption></figure>'''

def band(name, alt, unterschrift):
    return f'''<figure class="band-foto"><img src="bilder/{name}-1600.webp" srcset="bilder/{name}-800.webp 800w, bilder/{name}-1600.webp 1600w" sizes="100vw" width="1600" height="686" alt="{html.escape(alt)}" decoding="async"><figcaption class="rahmen">{unterschrift}</figcaption></figure>'''

# ---------- Startseite ----------
seite('index.html', 'Carrosserie und Lack in Altstätten · Auto Speedy AG',
      'Unfall, Hagel, Lackschaden: Stelle antippen, Fotos schicken. Carrosserie und Spritzwerk in Altstätten SG, Tesla Approved Body Shop, Abwicklung mit der Versicherung.',
f'''<section class="skizze-buehne" aria-labelledby="titel"><div class="rahmen skizze-raster">
  <div class="skizze-text">
    <h1 id="titel">Wo hat es Ihr Auto erwischt?</h1>
    <p class="lead">Carrosserie und Spritzwerk in Altstätten SG. Tippen Sie die Stelle an und schicken Sie uns zwei Fotos. Mit Ihrer Versicherung rechnen wir direkt ab.</p>
    <div class="aktionen"><a class="knopf" href="#melden" data-zaehl="anfrage-start" data-ort="hero">Schaden melden</a><p>{tel("hero", gross=True)}<span class="vh"> </span></p></div>
    <p class="notiz">Mo–Do 07.30–17.30, Fr bis 17.15, über Mittag 12.00–13.15 zu</p>
  </div>
  <div class="skizze" data-skizze>{skizze()}</div>
</div></section>

<section class="abschnitt abschnitt--blech" aria-labelledby="melden-titel"><div class="rahmen zwei">
  <div><div class="abschnitt__kopf"><h2 id="melden-titel">Schaden melden</h2><p class="lead">Die Stellen, die Sie oben antippen, sind hier schon ausgewählt.</p></div>
  {formular("start")}</div>
  {foto("dellen-haende", "Ein Mitarbeiter drückt mit Klebelaschen eine Delle aus einem weissen Auto", "Dellen drücken mit Klebelaschen, in der Halle an der Alten Landstrasse 63.")}
</div></section>

<section class="abschnitt" aria-labelledby="ablauf-titel"><div class="rahmen">
  <div class="abschnitt__kopf"><h2 id="ablauf-titel">Was nach der Meldung passiert</h2></div>
  {ABLAUF}
</div></section>

<section class="abschnitt abschnitt--blech" aria-labelledby="arbeit-titel"><div class="rahmen zwei">
  <div><div class="abschnitt__kopf"><h2 id="arbeit-titel">Blech und Lack unter einem Dach</h2><p class="lead">Vom Kratzer bis zum Chassisschaden, vom Lackschaden bis zur Neulackierung. Dazu Felgen, Folierung und Aufbereitung.</p></div>
    <ul class="liste"><li><a href="carrosserie.html">Unfallreparatur</a></li><li><a href="carrosserie.html#hagel">Hagel und Dellen</a></li><li><a href="carrosserie.html#scheiben">Scheiben</a></li><li><a href="lack.html">Lack und Neulackierung</a></li><li><a href="lack.html#felgen">Alufelgen</a></li><li><a href="lack.html#folie">Folierung</a></li></ul>
  </div>
  {foto("lack-l", "Lackierer im Overall voller Lacknebel, mit Atemmaske und Spritzpistole", "Aus der Lackierkabine: Overall, Maske, Spritzpistole.")}
</div></section>

<section class="abschnitt" aria-labelledby="beleg-titel"><div class="rahmen zwei">
  <div><div class="abschnitt__kopf"><h2 id="beleg-titel">Was belegt ist</h2></div>{BELEGE}</div>
  <div class="abschnitt__kopf"><h3>Occasionen</h3><p>Auf dem Areal stehen laufend Occasionen. Alle sind auf AutoScout24 hinterlegt.</p><p><a class="knopf knopf--leise" href="occasionen.html">Zu den Occasionen</a></p></div>
</div></section>''')

# ---------- Carrosserie ----------
seite('carrosserie.html', 'Carrosserie, Hagel und Unfall · Auto Speedy AG Altstätten',
      'Unfallreparaturen vom Blechschaden bis zum Chassisschaden, Hagel, Dellen, Scheiben, Rost und Schweissarbeiten. Mit Originalteilen und Abwicklung mit der Versicherung.',
f'''<section class="seitenkopf seitenkopf--band"><div class="rahmen">
  <div class="skizze-text breit"><h1>Vom Kratzer bis zum Chassisschaden.</h1>
  <p class="lead">Wir reparieren nach Herstellervorgaben und verwenden ausschliesslich Original-Ersatzteile. Die Schadensabwicklung mit der Versicherung erledigen wir für Sie.</p>
  <div class="aktionen"><a class="knopf" href="index.html#melden" data-zaehl="anfrage-start" data-ort="carrosserie">Schaden melden</a>{tel("carrosserie", gross=True)}</div></div>
</div>
{band("dellen-haende", "Ein Mitarbeiter drückt mit Klebelaschen eine Delle aus einem weissen Auto", "Dellen drücken mit Klebelaschen.")}
</section>
<section class="abschnitt abschnitt--blech"><div class="rahmen">
  <div class="abschnitt__kopf"><h2>Was wir an der Carrosserie machen</h2></div>
  <ul class="liste"><li>Unfallschäden, vom kleinen Blechschaden bis zum Chassisschaden</li><li id="hagel">Hagelschäden</li><li>Dellen drücken</li><li id="scheiben">Scheiben wechseln und reparieren</li><li>Rost</li><li>Stossstangen</li><li>Schweissarbeiten</li><li>Abwicklung mit der Versicherung</li></ul>
</div></section>
<section class="abschnitt"><div class="rahmen"><div class="abschnitt__kopf"><h2>So läuft es ab</h2></div>{ABLAUF}</div></section>''', 'carrosserie.html')

# ---------- Lack ----------
seite('lack.html', 'Spritzwerk, Felgen und Folierung · Auto Speedy AG Altstätten',
      'Lackschäden, Neulackierung, Restaurationen, Aufpolieren und Aufbereitung in eigenen Lackierkabinen. Dazu Alufelgen und Folierung.',
f'''<section class="seitenkopf"><div class="rahmen zwei">
  <div class="skizze-text"><h1>Lack aus eigenen Kabinen.</h1>
  <p class="lead">Für die Lackierung haben wir neue, grössere Lackierkabinen. Kleine Lackschäden setzen wir mit kleinstmöglichem Aufwand instand.</p>
  <div class="aktionen"><a class="knopf" href="index.html#melden" data-zaehl="anfrage-start" data-ort="lack">Schaden melden</a>{tel("lack", gross=True)}</div></div>
  {foto("lack-911", "Roter Porsche 911 auf einer Hebebühne in einer hellen Lackierkabine", "Porsche 911 in der Lackierkabine.", "eager")}
</div></section>
<section class="abschnitt abschnitt--blech"><div class="rahmen zwei">
  <div><div class="abschnitt__kopf"><h2>Spritzwerk</h2></div>
  <ul class="liste"><li>Einfache Lackschäden</li><li>Komplette Neulackierung</li><li>Versicherungsfälle</li><li>Restaurationen</li><li>Aufpolieren</li><li>Fahrzeugaufbereitung</li><li>Lackieren aller Gegenstände</li></ul></div>
  {foto("lack-k", "Lackierer in Schutzanzug lackiert eine Heckklappe in der Kabine", "Lackieren einer Heckklappe.")}
</div></section>
<section class="abschnitt" id="felgen"><div class="rahmen zwei">
  <div class="abschnitt__kopf"><h2>Alufelgen</h2><p class="lead">Felgen bearbeiten und lackieren wir ebenfalls. Was genau dazugehört, sagen wir Ihnen am Telefon.</p></div>
  {foto("felge-c", "Alufelge in Beerenrot auf einem Gitter", "Felge in Beerenrot.")}
</div></section>
<section class="abschnitt abschnitt--blech" id="folie"><div class="rahmen zwei">
  <div class="abschnitt__kopf"><h2>Folierung</h2><p class="lead">Ganze Fahrzeuge oder Streifen. Bilder aus der Halle, mehr am Telefon.</p></div>
  {foto("folie-ferrari", "Grauer Ferrari mit gelbem Folienstreifen in der Halle", "Streifen in Gelb, foliert.")}
</div></section>''', 'lack.html')

# ---------- Occasionen ----------
seite('occasionen.html', 'Occasionen in Altstätten · Auto Speedy AG',
      'Laufend Occasionen auf dem Areal in Altstätten, alle auf AutoScout24. Ankauf, Leasing und Beratung, markenunabhängig.',
f'''<section class="seitenkopf"><div class="rahmen zwei">
  <div class="skizze-text"><h1>Occasionen auf dem Areal.</h1>
  <p class="lead">Unsere Occasionen sind alle auf AutoScout24 hinterlegt. Wir kaufen auch Ihr Auto an, beraten markenunabhängig und vermitteln Leasing.</p>
  <div class="aktionen"><a class="knopf" href="{AUTOSCOUT}" rel="noopener" data-zaehl="autoscout" data-ort="occasionen">Occasionen auf AutoScout24</a>{tel("occasionen", gross=True)}</div></div>
  {foto("occasion", "Grüner VW Käfer vor den Hallen, im Hintergrund Berge", "Auf dem Areal an der Alten Landstrasse.", "eager")}
</div></section>
<section class="abschnitt abschnitt--blech"><div class="rahmen"><ul class="liste"><li>Auto Ankauf</li><li>Verkauf von Occasionen</li><li>Leasing</li><li>Technische Beratung</li></ul></div></section>''', 'occasionen.html')

# ---------- Betrieb ----------
seite('betrieb.html', 'Der Betrieb · Auto Speedy AG Altstätten',
      'Auto Speedy AG an der Alten Landstrasse 63 in Altstätten: Geschäftsführer Shpejtim Pirku, zertifiziert als Tesla Approved Body Shop.',
f'''<section class="seitenkopf seitenkopf--band"><div class="rahmen">
  <div class="skizze-text breit"><h1 class="zitat">«Qualität, die man sieht und fährt.»</h1>
  <p class="lead">So steht es auf unserem Bild zum Jubiläum. Geführt wird die Auto Speedy AG von Shpejtim Pirku, den alle «Speedy» nennen.</p></div>
</div>
{band("halle-himmel", "Die Halle der Auto Speedy AG an der Alten Landstrasse 63 mit Autos davor", "Alte Landstrasse 63, etwas ausserhalb von Altstätten.")}
</section>
<section class="abschnitt abschnitt--blech"><div class="rahmen zwei">
  <div><div class="abschnitt__kopf"><h2>Belege</h2></div>{BELEGE}</div>
  <div class="abschnitt__kopf"><h2>Team</h2><p>Zehn Leute arbeiten in Administration, Carrosserie, Lackiererei und Aufbereitung, zwei davon in Ausbildung. Namen und Fotos zeigen wir hier, sobald alle einverstanden sind.</p>
  <h3>Stellen</h3><p>Ob gerade Stellen offen sind, ergänzen wir nach Rücksprache mit dem Betrieb. Fragen Sie gern direkt: {tel("stellen")}.</p></div>
</div></section>''', 'betrieb.html')

# ---------- Kontakt ----------
seite('kontakt.html', 'Kontakt und Anfahrt · Auto Speedy AG Altstätten',
      'Auto Speedy AG, Alte Landstrasse 63, 9450 Altstätten. Telefon 071 755 88 61. Mo–Do 07.30–17.30, Fr bis 17.15.',
f'''<section class="seitenkopf"><div class="rahmen zwei">
  <div class="skizze-text"><h1>{TEL}</h1>
  <p class="lead">Mo–Do 07.30–12.00 und 13.15–17.30, Fr bis 17.15. Ob am Samstag jemand da ist, ergänzen wir nach Rücksprache mit dem Betrieb.</p>
  <div class="aktionen"><a class="knopf" href="{TEL_H}" data-zaehl="anruf" data-ort="kontakt-knopf">071&nbsp;755&nbsp;88&nbsp;61 anrufen</a><a class="knopf knopf--leise" href="{ROUTE}" rel="noopener" data-zaehl="route" data-ort="kontakt">Route öffnen</a></div></div>
  <dl class="belege">
    <div class="beleg-zeile"><dt>Anschrift</dt><dd>Alte Landstrasse 63, 9450 Altstätten SG, etwas ausserhalb der Stadt</dd></div>
    <div class="beleg-zeile"><dt>Mobil</dt><dd>{tel("kontakt-mobil", text=MOBIL, href=MOBIL_H)}</dd></div>
    <div class="beleg-zeile"><dt>Mail</dt><dd><a href="mailto:{MAIL}" data-zaehl="mail" data-ort="kontakt">{MAIL}</a></dd></div>
    <div class="beleg-zeile"><dt>Mittag</dt><dd>12.00–13.15 zu</dd></div>
  </dl>
</div></section>
<section class="abschnitt abschnitt--blech"><div class="rahmen"><div class="abschnitt__kopf"><h2>Schaden melden</h2></div>{formular("kontakt")}</div></section>''', 'kontakt.html')

# ---------- Recht ----------
seite('impressum.html', 'Impressum · Auto Speedy AG', 'Impressum der Auto Speedy AG, Altstätten.',
f'''<section class="seitenkopf"><div class="rahmen" style="max-width:52rem"><h1>Impressum</h1>
<p class="lead" style="margin-top:1.5rem">Auto Speedy AG, Alte Landstrasse 63, 9450 Altstätten SG, Schweiz. UID CHE-221.907.243. Geschäftsführer: Shpejtim Pirku.</p>
<p style="margin-top:1rem">Telefon {tel("impressum")} · <a href="mailto:{MAIL}" data-zaehl="mail" data-ort="impressum">{MAIL}</a></p>
<p style="margin-top:1rem">Mehrwertsteuernummer und Handelsregisteramt ergänzen wir nach Rücksprache mit dem Betrieb.</p></div></section>''')
seite('datenschutz.html', 'Datenschutz · Auto Speedy AG', 'Datenschutzerklärung der Auto Speedy AG.',
f'''<section class="seitenkopf"><div class="rahmen" style="max-width:52rem"><h1>Datenschutz</h1>
<p class="lead" style="margin-top:1.5rem">Verantwortlich: Auto Speedy AG, Alte Landstrasse 63, 9450 Altstätten, {MAIL}.</p>
<p style="margin-top:1rem">Wenn Sie einen Schaden melden, öffnet sich Ihr Mailprogramm mit Ihren Angaben. Sie senden die Mail selbst an {MAIL}. Wir nutzen die Angaben nur für Ihre Meldung.</p>
<p style="margin-top:1rem">Diese Website setzt keine Cookies und lädt keine Inhalte von fremden Servern. Links zu Google Maps und AutoScout24 öffnen Sie selbst; dort gelten deren Regeln.</p>
<p style="margin-top:1rem">Wo die Website liegt und wie lange wir Meldungen aufbewahren, ergänzen wir nach Rücksprache mit dem Betrieb.</p></div></section>''')
seite('404.html', 'Seite nicht gefunden · Auto Speedy AG', 'Diese Seite gibt es nicht.',
f'''<section class="seitenkopf"><div class="rahmen"><h1>Hier ist keine Stelle markiert.</h1>
<p class="lead" style="margin:1.5rem 0">Diese Seite gibt es nicht. Zurück zur <a href="index.html">Schadenskizze</a> oder direkt anrufen: {tel("404")}.</p></div></section>''')
print('gebaut:', sorted(p.name for p in site.glob('*.html')))
