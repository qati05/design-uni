#!/usr/bin/env node
/* Erzeugt die Vorschau-Seiten in ../site/ aus einer Quelle.
   Aufruf: node werkzeuge/bauen.cjs
   Bricht ab, wenn ein Titel nicht 40 bis 60 Zeichen oder eine Beschreibung nicht 110 bis 155 Zeichen hat (S1, S9, S12),
   wenn eine Seite nicht genau ein <h1> hat oder wenn Eszett im sichtbaren Text steht (CH1). */
const fs = require("fs");
const path = require("path");

const SITE = path.join(__dirname, "..", "site");
const DATEN = path.join(__dirname, "..", "daten");
const bewertungen = JSON.parse(fs.readFileSync(path.join(DATEN, "bewertungen.json"), "utf8"));

const NBSP = " ";
const TEL1 = { zeige: "071 755 88 61", href: "tel:+41717558861" };
const TEL2 = { zeige: "076 615 44 41", href: "tel:+41766154441" };
const MAIL = "info@autospeedy.ch";
const ROUTE = "https://www.google.com/maps/search/?api=1&query=Auto+Speedy+AG%2C+Alte+Landstrasse+63%2C+9450+Altst%C3%A4tten&query_place_id=ChIJfWvlb90Xm0cRkco0yhXSEAk";
const GOOGLE = "https://www.google.com/maps/search/?api=1&query=Auto+Speedy+AG&query_place_id=ChIJfWvlb90Xm0cRkco0yhXSEAk";
const AUTOSCOUT = "https://www.autoscout24.ch/de/s/seller-67678";
const CARROSSERIESUISSE = "https://www.carrosseriesuisse.ch/de/automobilisten/branchenverzeichnis/detail/auto-speedy-ag-1";
const U = (h, m) => `${h}.${m}${NBSP}Uhr`;

const NAV = [
  ["carrosserie.html", "Carrosserie"],
  ["lackiererei.html", "Lackiererei"],
  ["felgen-folierung.html", "Felgen und Folierung"],
  ["occasionen.html", "Occasionen"],
  ["betrieb.html", "Betrieb"],
  ["kontakt.html", "Kontakt"],
];

const DIENST = NAV.slice(0, 4);   // Carrosserie, Lackiererei, Felgen und Folierung, Occasionen
const REST = NAV.slice(4);        // Betrieb, Kontakt
const ICON_TEL = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/></svg>';
const STERN = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#121416" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
const STERNE5 = `<span class="sterne" aria-hidden="true">${STERN.repeat(5)}</span>`;

/* ---------- Bausteine ---------- */
function telLink(t, ort, klasse = "", inhalt) {
  return `<a${klasse ? ` class="${klasse}"` : ""} href="${t.href}" data-zaehl="anruf" data-ort="${ort}">${inhalt || `<span class="nowrap">${t.zeige}</span>`}</a>`;
}
function routeLink(ort, text = "Route zur Alten Landstrasse 63 öffnen") {
  return `<a href="${ROUTE}" data-zaehl="route" data-ort="${ort}">${text}</a>`;
}
function mailLink(ort) {
  return `<a href="mailto:${MAIL}" data-zaehl="mail" data-ort="${ort}">${MAIL}</a>`;
}
function schadenKnopf(ort, text = "Schaden melden", href = "schaden-melden.html", extra = "knopf-gross") {
  return `<a class="knopf ${extra}" href="${href}" data-zaehl="anfrage" data-ort="${ort}">${text}</a>`;
}
function bild(datei, alt, caption, opt = {}) {
  const { kante = true, klasse = "", breite, hoehe, lazy = true, fetch = false } = opt;
  const dim = breite ? ` width="${breite}" height="${hoehe}"` : "";
  return `<figure class="bild ${klasse}">${kante ? '<div class="kante-bar' + (opt.zug ? " kante-zug" : "") + '"></div>' : ""}<img src="bilder/${datei}" alt="${alt}"${dim}${lazy ? ' loading="lazy"' : ""}${fetch ? ' fetchpriority="high"' : ""} decoding="async">${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
}
function zeiten() {
  return `<table class="zeiten"><caption class="sr">Öffnungszeiten</caption><tbody>
<tr><th scope="row">Montag bis Donnerstag</th><td>${U(7, "30")} bis ${U(12, "00")} und ${U(13, "15")} bis ${U(17, "30")}</td></tr>
<tr><th scope="row">Freitag</th><td>${U(7, "30")} bis ${U(12, "00")} und ${U(13, "15")} bis ${U(17, "15")}</td></tr>
<tr><th scope="row">Samstag und Sonntag</th><td>geschlossen</td></tr>
</tbody></table>`;
}
function zeile(href, titel, zusatz, ort) {
  return `<li><a href="${href}" data-ort="${ort}"><strong>${titel}</strong><span class="pfeil" aria-hidden="true">→</span><span class="zusatz">${zusatz}</span></a></li>`;
}
function abschluss(ort = "abschluss") {
  return `<section class="abschluss" aria-labelledby="abschluss-titel"><div class="rahmen">
<h2 id="abschluss-titel">Schaden melden in zwei Angaben</h2>
<p class="spalte">Name und Telefon genügen. Ihr E-Mail-Programm öffnet die Meldung vorbereitet. Sie senden sie dort ab.</p>
<div class="aktionen">${schadenKnopf(ort)} ${telLink(TEL1, ort, "knopf knopf-leise knopf-gross", `${ICON_TEL}<span><span class="sr">Anrufen: </span><span class="nowrap">${TEL1.zeige}</span></span>`)}</div>
</div></section>`;
}
function luecke(text) {
  return `<p class="luecke">${text}</p>`;
}

/* ---------- Rahmen ---------- */
function seite({ datei, title, desc, h1, body, aktiv = "", jsonld = "", abschlussOrt = "abschluss", ohneAbschluss = false }) {
  if (title.length < 40 || title.length > 60) throw new Error(`${datei}: Titel ${title.length} Zeichen: ${title}`);
  if (desc.length < 110 || desc.length > 155) throw new Error(`${datei}: Beschreibung ${desc.length} Zeichen: ${desc}`);
  const imDienst = DIENST.some(([h]) => h === aktiv);
  const dienstLinks = (cls) => DIENST.map(([h, t]) => `<li><a href="${h}"${aktiv === h ? ' aria-current="page"' : ""}>${t}</a></li>`).join("");
  const restLinks = REST.map(([h, t]) => `<li><a href="${h}"${aktiv === h ? ' aria-current="page"' : ""}>${t}</a></li>`).join("");
  const navDesk = `<li><details class="dienst${imDienst ? " ist-aktiv" : ""}"><summary>Dienstleistungen</summary><ul class="dienst-liste">${dienstLinks()}</ul></details></li>${restLinks}`;
  const navMenue = `<li><a href="index.html"${aktiv === "index.html" ? ' aria-current="page"' : ""}>Start</a></li><li><details class="dienst-m"${imDienst ? " open" : ""}><summary>Dienstleistungen</summary><ul>${dienstLinks()}</ul></details></li>${restLinks}`;
  const html = `<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light">
<link rel="preload" href="schriften/bigshoulders-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="schriften/publicsans-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="bilder/logo-wirbel-s.png" type="image/png">
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/zusatz.css">
${jsonld ? `<script type="application/ld+json">${jsonld}</script>\n` : ""}<script src="js/main.js" defer></script>
</head>
<body>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
<div class="vorschau"><div class="rahmen">Vorschau zur Freigabe, nicht veröffentlicht. Stand 1. November 2026.</div></div>
<header class="kopf">
<div class="rahmen kopf-innen">
<a class="marke" href="index.html" aria-label="Auto Speedy AG, zur Startseite"><img src="bilder/logo-wirbel-s.png" width="76" height="46" alt="Auto Speedy AG"><span class="marke-text" aria-hidden="true">Auto Speedy AG</span></a>
<nav class="nav-desktop" aria-label="Hauptmenü"><ul>${navDesk}<li><a class="etikett-link" href="tesla.html"${aktiv === "tesla.html" ? ' aria-current="page"' : ""} data-ort="kopf">Tesla</a></li></ul></nav>
<div class="kopf-aktionen">
<a class="knopf knopf-text" href="schaden-melden.html" data-zaehl="anfrage" data-ort="kopf">Schaden melden</a>
${telLink(TEL1, "kopf", "knopf knopf-leise", `${ICON_TEL}<span class="sr">Anrufen: ${TEL1.zeige}</span><span class="tel-zahl nowrap" aria-hidden="true">${TEL1.zeige}</span>`)}
<details class="menue"><summary>Menü<span class="sr"> öffnen</span></summary>
<nav class="menue-liste" aria-label="Menü"><ul>${navMenue}<li><a href="tesla.html" data-ort="menue">Tesla-Schaden</a></li></ul></nav></details>
</div>
</div>
</header>
<main id="inhalt">
${body}
${ohneAbschluss ? "" : abschluss(abschlussOrt)}
</main>
<footer class="fuss"><div class="rahmen">
<div class="fuss-raster">
<div><h2>Auto Speedy AG</h2><p>Alte Landstrasse 63<br>9450 Altstätten<br>${routeLink("fuss", "Route öffnen")}</p></div>
<div><h2>Erreichbar</h2><ul><li>${telLink(TEL1, "fuss")}</li><li>${telLink(TEL2, "fuss")}</li><li>${mailLink("fuss")}</li></ul><p>Montag bis Donnerstag ${U(7, "30")} bis ${U(17, "30")}<br>Freitag ${U(7, "30")} bis ${U(17, "15")}<br>mittags ${U(12, "00")} bis ${U(13, "15")} zu</p></div>
<div><h2>Seiten</h2><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}<li><a href="tesla.html">Tesla</a></li><li><a href="schaden-melden.html">Schaden melden</a></li><li><a href="impressum.html">Impressum</a></li><li><a href="datenschutz.html">Datenschutz</a></li></ul></div>
</div>
<p class="schriftfeld">Auto Speedy AG · UID CHE-221.907.243 · Altstätten. Fotos von der bisherigen Website des Betriebs. Tesla ist eine Marke von Tesla, Inc.</p>
</div></footer>
</body>
</html>
`;
  const nH1 = (html.match(/<h1[ >]/g) || []).length;
  if (nH1 !== 1) throw new Error(`${datei}: ${nH1} h1`);
  if (/ß/.test(html)) throw new Error(`${datei}: Eszett`);
  fs.writeFileSync(path.join(SITE, datei), html);
  return datei;
}

const LOCAL = {
  "@context": "https://schema.org",
  "@type": "AutoBodyShop",
  name: "Auto Speedy AG",
  address: { "@type": "PostalAddress", streetAddress: "Alte Landstrasse 63", postalCode: "9450", addressLocality: "Altstätten", addressRegion: "SG", addressCountry: "CH" },
  telephone: "+41717558861",
  email: MAIL,
  geo: { "@type": "GeoCoordinates", latitude: 47.369432, longitude: 9.559048 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "07:30", closes: "12:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "13:15", closes: "17:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "07:30", closes: "12:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "13:15", closes: "17:15" },
  ],
};
const LD = JSON.stringify(LOCAL);

/* ---------- Bewertungen ---------- */
function bewertungsBlock() {
  const bal = [[5, 33], [4, 2], [3, 1], [2, 0], [1, 1]]
    .map(([s, n]) => `<div class="balken"><span>${s}${NBSP}Sterne</span><span class="spur"><span class="fuell" style="--w:${Math.round((n / 37) * 100)}%"></span></span><span>${n}</span></div>`)
    .join("");
  const karten = bewertungen
    .map((b) => `<li class="karte"><span class="sterne" role="img" aria-label="${b.sterne} von 5 Sternen">${STERN.repeat(b.sterne)}</span><blockquote><p>${b.text}</p></blockquote><p class="quelle">Google-Bewertung, ${b.monat}</p><span class="marke-offen">Einwilligung der Verfasserin oder des Verfassers offen</span></li>`)
    .join("");
  return `<section class="abschnitt" aria-labelledby="bew-titel"><div class="rahmen">
<h2 id="bew-titel">4,8 von 5 auf Google bei 37 Bewertungen</h2>
<div class="bewertung">
<div class="bew-kopf"><p class="bew-zahl" aria-hidden="true">4,8</p>${STERNE5}
<p><strong>37 Bewertungen auf Google Maps</strong><br><span class="klein">Stand 1. November 2026. Der Betrieb hat noch keine Bewertung beantwortet.</span></p>
${bal}
<p><a href="${GOOGLE}" data-zaehl="route" data-ort="bewertungen">Alle Bewertungen auf Google lesen</a></p></div>
<ul class="karten">${karten}</ul>
</div></div></section>`;
}

/* ---------- Seiten ---------- */
const seiten = [];

seiten.push(seite({
  datei: "index.html",
  title: "Carrosserie und Lackiererei in Altstätten | Auto Speedy",
  desc: "Auto Speedy AG in Altstätten: Carrosserie, Lackiererei, Alufelgen und Occasionen. Montag bis Freitag geöffnet. Schaden melden mit Name und Telefon.",
  jsonld: LD,
  aktiv: "index.html",
  abschlussOrt: "abschluss-start",
  body: `<section class="hero hero-start"><div class="rahmen"><div class="hero-gitter">
<div class="hero-text">
<h1>Erst die Kante. Dann der Lack.</h1>
<p class="lead">Carrosserie, Lackiererei und Felgen in Altstätten. Ihr Auto hat einen Schaden? Für die Meldung genügen Name und Telefon.</p>
<div class="aktionen">${schadenKnopf("hero")}</div>
<p class="status" data-status>Montag bis Freitag geöffnet, mittags von ${U(12, "00")} bis ${U(13, "15")} zu.</p>
</div>
${bild("halle-defender-schild.jpg", "Graue Halle mit dem Schild von Auto Speedy, davor ein matt schwarzer Land Rover Defender und weitere Fahrzeuge", "Auto Speedy an der Alten Landstrasse 63 in Altstätten", { klasse: "hero-bild", zug: true, breite: 1200, hoehe: 900, lazy: false, fetch: true })}
</div></div></section>

<section class="abschnitt" aria-labelledby="zeiten-titel"><div class="rahmen">
<h2 id="zeiten-titel">Offen von Montag bis Freitag</h2>
<div class="paar">
<div>${zeiten()}<p class="klein">An Feiertagen und in Betriebsferien gelten andere Zeiten.</p></div>
<div><p><strong>Alte Landstrasse 63<br>9450 Altstätten</strong></p><p>${routeLink("start-zeiten")}</p>
<p>Telefon ${telLink(TEL1, "start-zeiten")}<br>Mobil ${telLink(TEL2, "start-zeiten")}<br>E-Mail ${mailLink("start-zeiten")}<br><a href="${GOOGLE}" data-zaehl="route" data-ort="start-bewertung">4,8 von 5 bei 37 Google-Bewertungen</a></p></div>
</div></div></section>

<section class="abschnitt" aria-labelledby="leistung-titel"><div class="rahmen">
<h2 id="leistung-titel">Carrosserie, Lack, Felgen und Occasionen an einer Adresse</h2>
<ul class="zeilen">
${zeile("carrosserie.html", "Carrosserie", "Unfall-, Hagel- und Dellenschäden, Rost, Stossstangen, Scheiben", "start-leistung")}
${zeile("lackiererei.html", "Lackiererei", "Lackschäden, Neulackierung, Aufpolieren, Fahrzeugaufbereitung", "start-leistung")}
${zeile("felgen-folierung.html", "Felgen und Folierung", "Alufelgen und Folierung, mit Bildern aus dem Betrieb", "start-leistung")}
${zeile("occasionen.html", "Occasionen", "Verkauf, Ankauf, Leasing, technische Beratung", "start-leistung")}
</ul></div></section>

<section class="abschnitt" aria-labelledby="tesla-titel"><div class="rahmen"><div class="abschluss" style="margin-top:0">
<h2 id="tesla-titel">Tesla beschädigt? Hier sind Sie richtig.</h2>
<p class="spalte">Auto Speedy ist Tesla Approved Body Shop. Kommt Ihr Fall von Tesla, wählen Sie das in der Meldung aus. Das Modell wählen Sie mit einem Tipp.</p>
<div class="aktionen">${schadenKnopf("start-tesla", "Tesla-Schaden melden", "schaden-melden.html?tesla=1")} <a class="knopf knopf-leise knopf-gross" href="tesla.html" data-ort="start-tesla">Tesla-Seite ansehen</a></div>
</div></div></section>

${bewertungsBlock()}`,
}));

seiten.push(seite({
  datei: "carrosserie.html",
  title: "Unfallschaden reparieren in Altstätten | Auto Speedy",
  desc: "Unfallschaden, Hagel, Dellen, Rost oder Scheibe: Die Carrosserie von Auto Speedy in Altstätten repariert und klärt die Versicherung. Schaden melden.",
  aktiv: "carrosserie.html",
  abschlussOrt: "abschluss-carrosserie",
  body: `<section class="hero"><div class="rahmen">
<h1>Unfallschaden reparieren in Altstätten</h1>
<p class="lead">Ihr Auto hat einen Unfallschaden. Auto Speedy repariert ihn vom kleinen Blechschaden bis zum Chassisschaden und erledigt die Schadensabwicklung mit der Versicherung.</p>
<div class="aktionen">${schadenKnopf("carrosserie-hero")}</div>
${bild("hebebuehne-audi.jpg", "Dunkler Personenwagen auf der Hebebühne in der Werkstatt, Front ohne Stossstange", "Fahrzeug auf der Hebebühne in der Werkstatt von Auto Speedy", { klasse: "bild-rechts", zug: true, breite: 1400, hoehe: 933, lazy: false })}
</div></section>

<section class="abschnitt" aria-labelledby="schaeden-titel"><div class="rahmen">
<h2 id="schaeden-titel">Diese Schäden repariert die Carrosserie</h2>
<ul class="liste-punkte spalte">
<li>Unfallschäden, von kleinen Blechschäden bis zu grösseren Chassisschäden</li>
<li>Hagelschäden und Dellendrücken</li>
<li>Rostreparatur</li>
<li>Stossstangenreparatur</li>
<li>Scheiben wechseln und reparieren</li>
<li>Schweissarbeiten</li>
</ul></div></section>

<section class="abschnitt" id="dellen" aria-labelledby="dellen-titel"><div class="rahmen"><div class="paar">
<div><h2 id="dellen-titel">Hagelschäden und Dellen sind eine eigene Leistung</h2>
<p>Auto Speedy nennt Hagelschäden und Dellendrücken als eigene Leistungen. Der Teamleiter der Carrosserie ist Spengler für Hagel- und Dellendrücken.</p></div>
${bild("lack-kante-rot-weiss.jpg", "Nahaufnahme einer Karosseriekante, rot lackiert, mit weissem Abdeckband daneben", "Karosseriekante mit Abdeckband", { breite: 900, hoehe: 1200 })}
</div></div></section>

<section class="abschnitt" aria-labelledby="vers-titel"><div class="rahmen">
<h2 id="vers-titel">Die Versicherung gehört zur Reparatur</h2>
<p class="spalte">Die Schadensabwicklung mit der Versicherung erledigt Auto Speedy für Sie. Verwendet werden ausschliesslich Original-Ersatzteile.</p></div></section>

<section class="abschnitt" aria-labelledby="fz-titel"><div class="rahmen">
<h2 id="fz-titel">Für Personenwagen, Nutzfahrzeuge, Oldtimer und Wohnmobile</h2>
<p class="spalte">Carrosserie Suisse führt Auto Speedy für diese Fahrzeugarten auf (Stand 1. November 2026):</p>
<ul class="liste-punkte spalte"><li>Personenwagen</li><li>Nutzfahrzeuge und Anhänger, bis und über 3,5 Tonnen</li><li>Oldtimer und Youngtimer</li><li>Wohnmobile und Wohnwagen</li></ul>
<p class="spalte"><a href="${CARROSSERIESUISSE}" data-ort="carrosserie-verband">Eintrag bei Carrosserie Suisse lesen</a></p></div></section>

<section class="abschnitt" aria-labelledby="preis-titel"><div class="rahmen">
<h2 id="preis-titel">Was eine Reparatur kostet, hängt vom Schaden ab</h2>
${luecke("Schaden, Fahrzeug und Ersatzteile bestimmen den Preis. Eine Zahl nennen wir hier, sobald der Betrieb Preise freigibt.")}</div></section>`,
}));

seiten.push(seite({
  datei: "lackiererei.html",
  title: "Lackschaden und Neulackierung in Altstätten | Auto Speedy",
  desc: "Lackschaden, Neulackierung, Aufpolieren und Fahrzeugaufbereitung in Altstätten. Die Lackiererei von Auto Speedy arbeitet in der Kabine. Schaden melden.",
  aktiv: "lackiererei.html",
  abschlussOrt: "abschluss-lack",
  body: `<section class="hero"><div class="rahmen">
<h1>Lackschaden reparieren in Altstätten</h1>
<p class="lead">Ihr Auto hat einen Lackschaden. Auto Speedy repariert einfache Lackschäden, lackiert komplett neu und bereitet Fahrzeuge auf.</p>
<div class="aktionen">${schadenKnopf("lack-hero")}</div>
${bild("kabine-defender-seite.jpg", "Land Rover Defender in der Lackierkabine auf einem Boden mit blauen Rampen", "Defender in der Lackierkabine, die Motorhaube ist abgedeckt", { klasse: "bild-rechts", zug: true, breite: 1200, hoehe: 900, lazy: false })}
</div></section>

<section class="abschnitt" aria-labelledby="lack-liste"><div class="rahmen">
<h2 id="lack-liste">Das lackiert und poliert Auto Speedy</h2>
<ul class="liste-punkte spalte">
<li>einfache Lackschäden</li>
<li>komplette Neulackierung</li>
<li>Versicherungsfälle</li>
<li>Restaurationen</li>
<li>Aufpolieren</li>
<li>Lackieren aller Gegenstände</li>
<li>Fahrzeugaufbereitung</li>
</ul></div></section>

<section class="abschnitt" aria-labelledby="wie-titel"><div class="rahmen"><div class="paar">
<div><h2 id="wie-titel">Erst abkleben, dann lackieren</h2>
<p>Auf den Fotos aus der Kabine sehen Sie Abdeckband und blaue Folie an Tür, Radhaus und Stossstange. Das Fahrzeug steht in einer Lackierkabine, die laut Betrieb neu und grösser ist.</p></div>
${bild("lackierer-kabine.jpg", "Ein Lackierer von hinten in der Lackierkabine vor einem mit blauer Folie abgedeckten Fahrzeug", "Lackierer in der Kabine, das Fahrzeug ist abgedeckt", { breite: 1200, hoehe: 1600 })}
</div></div></section>

<section class="abschnitt" aria-labelledby="preis-titel"><div class="rahmen">
<h2 id="preis-titel">Was eine Lackierung kostet, hängt vom Schaden ab</h2>
${luecke("Fläche, Farbe und Zustand bestimmen den Preis. Eine Zahl nennen wir hier, sobald der Betrieb Preise freigibt.")}</div></section>`,
}));

seiten.push(seite({
  datei: "felgen-folierung.html",
  title: "Alufelgen und Folierung in Altstätten | Auto Speedy",
  desc: "Alufelgen und Folierung bei Auto Speedy in Altstätten: Bilder von Felgen mit Bordsteinschaden, fertigen Felgen und foliierten Fahrzeugen. Schaden melden.",
  aktiv: "felgen-folierung.html",
  abschlussOrt: "abschluss-felgen",
  body: `<section class="hero"><div class="rahmen">
<h1>Alufelgen und Folierung in Altstätten</h1>
<p class="lead">Alufelgen und Folierung gehören zum Angebot von Auto Speedy. Die Bilder zeigen Felgen mit Bordsteinschaden, fertige Felgen und Fahrzeuge mit Folie.</p>
${luecke("Was genau zu Alufelgen und Folierung gehört, tragen wir hier ein, sobald der Betrieb es beschrieben hat.")}
<div class="aktionen">${schadenKnopf("felgen-hero")}</div>
</div></section>

<section class="abschnitt" id="felgen" aria-labelledby="felgen-titel"><div class="rahmen">
<h2 id="felgen-titel">Felgen vom Bordsteinschaden bis zur fertigen Felge</h2>
<div class="raster raster-3">
${bild("felge-bordstein.jpg", "Graue Alufelge mit abgeschabtem Rand", "Alufelge mit Bordsteinschaden", { breite: 1200, hoehe: 900 })}
${bild("felge-markiert.jpg", "Alufelge mit blau umkreistem Schaden am Rand", "Schaden am Felgenrand, blau markiert", { breite: 900, hoehe: 1200 })}
${bild("felge-blau-abgeklebt.jpg", "Schwarze Alufelge mit blauem Abdeckband am Rand", "Felge mit blauem Abdeckband", { breite: 900, hoehe: 1200 })}
${bild("felge-magenta.jpg", "Magentafarbene Felge auf einem Gitterrost", "Felge in Magenta auf dem Gestell", { breite: 900, hoehe: 1200 })}
${bild("felge-gold-regal.jpg", "Goldene Speichenfelge mit poliertem Rand auf einem Ständer", "Goldene Speichenfelge auf dem Ständer", { breite: 900, hoehe: 1200 })}
${bild("felge-schwarz-detail.jpg", "Nahaufnahme einer schwarzen Alufelge mit polierten Speichenkanten", "Schwarze Alufelge, Speichenkanten poliert", { breite: 1200, hoehe: 900 })}
</div></div></section>

<section class="abschnitt" id="folierung" aria-labelledby="folie-titel"><div class="rahmen">
<h2 id="folie-titel">Folierung am Fahrzeug, wie die Bilder sie zeigen</h2>
<div class="raster raster-3">
${bild("folie-motorhaube.jpg", "Motorhaube eines Land Rover Defender mit schwarzer Folie in der Kabine", "Motorhaube mit schwarzer Folie", { breite: 1200, hoehe: 900 })}
${bild("lieferwagen-rot-folie.jpg", "Lieferwagen mit roter Folie an der Front in der Werkstatt", "Lieferwagen mit roter Folie", { breite: 1200, hoehe: 900 })}
${bild("lieferwagen-abgeklebt.jpg", "Weisser Lieferwagen mit Pritsche, Front teilweise rot und abgeklebt", "Lieferwagen, teilweise abgeklebt", { breite: 1200, hoehe: 900 })}
${bild("defender-schriftzug-matt.jpg", "Nahaufnahme des Defender-Schriftzugs auf matter grauer Oberfläche", "Defender-Schriftzug auf matter Oberfläche", { breite: 1200, hoehe: 900 })}
${bild("matt-kante-blau.jpg", "Matte schwarze Karosseriekante, blau gespiegelt", "Matte Kante, blau gespiegelt", { breite: 900, hoehe: 1200 })}
</div></div></section>`,
}));

seiten.push(seite({
  datei: "occasionen.html",
  title: "Occasionen und Autoankauf in Altstätten | Auto Speedy",
  desc: "Auto Speedy in Altstätten verkauft Occasionen, kauft Autos an und berät zu Leasing. Die aktuellen Fahrzeuge stehen bei AutoScout24. Schaden melden.",
  aktiv: "occasionen.html",
  abschlussOrt: "abschluss-occasionen",
  body: `<section class="hero"><div class="rahmen">
<h1>Occasionen kaufen und verkaufen in Altstätten</h1>
<p class="lead">Auto Speedy verkauft Occasionen und kauft Autos an. Die aktuellen Fahrzeuge stehen bei AutoScout24.</p>
<div class="aktionen"><a class="knopf knopf-gross" href="${AUTOSCOUT}" data-ort="occasionen-hero" rel="noopener">Occasionen bei AutoScout24 ansehen</a> ${telLink(TEL1, "occasionen-hero", "knopf knopf-leise knopf-gross", `${ICON_TEL}<span><span class="sr">Anrufen: </span><span class="nowrap">${TEL1.zeige}</span></span>`)}</div>
${bild("halle-areal.jpg", "Graue Metallhalle mit Schild, davor mehrere parkierte Fahrzeuge", "Fahrzeuge vor der Halle von Auto Speedy", { klasse: "bild-rechts", zug: true, breite: 1600, hoehe: 1200, lazy: false })}
</div></section>

<section class="abschnitt" aria-labelledby="handel-titel"><div class="rahmen">
<h2 id="handel-titel">Das gehört zum Autohandel</h2>
<ul class="liste-punkte spalte">
<li>Autoankauf</li>
<li>Verkauf von Occasionen</li>
<li>schnelle Abwicklung</li>
<li>Leasing</li>
<li>technische Beratung</li>
<li>Abwicklung von Versicherungen</li>
</ul>
<p class="spalte">Auto Speedy ist eine markenunabhängige Garage. Preise und Angaben zur Garantie stehen im jeweiligen Inserat bei AutoScout24.</p></div></section>`,
}));

seiten.push(seite({
  datei: "betrieb.html",
  title: "Team und Ausbildung | Auto Speedy Altstätten",
  desc: "Das Team der Auto Speedy AG in Altstätten: Administration, Carrosserie, Lackiererei und Aufbereitung. Ausbildungsbetrieb für Spengler und Lackierer EFZ.",
  aktiv: "betrieb.html",
  abschlussOrt: "abschluss-betrieb",
  body: `<section class="hero"><div class="rahmen">
<h1>Das Team von Auto Speedy in Altstätten</h1>
<p class="lead">Auto Speedy AG ist eine Aktiengesellschaft in Altstätten. Laut Handelsregister betreibt sie eine Carrosserie, Autospenglerei und Autolackiererei sowie Autohandel.</p>
${bild("halle-defender-schild.jpg", "Grau verkleidete Halle mit Schild von Auto Speedy, davor ein matt schwarzer Land Rover Defender", "Halle von Auto Speedy an der Alten Landstrasse 63", { klasse: "bild-rechts", zug: true, breite: 1200, hoehe: 900, lazy: false })}
</div></section>

<section class="abschnitt team" aria-labelledby="team-titel"><div class="rahmen">
<h2 id="team-titel">Wer arbeitet wo</h2>
<h3>Administration</h3>
<dl><dt>Shpejtim Pirku «Speedy»</dt><dd>Geschäftsführer</dd><dt>Lea Schlegel</dt><dd>Annahme, HR-Assistentin</dd><dt>Martyna Skweres</dt><dd>Kauffrau EBA in Ausbildung</dd></dl>
<h3>Carrosserie</h3>
<dl><dt>Arsim Selmani</dt><dd>Teamleiter Carrosserie, Spengler für Hagel- und Dellendrücken</dd><dt>Dragan Tejic</dt><dd>Carrosserie-Spengler, Schweisstechniker</dd><dt>Enes Rushiti</dt><dd>Carrosserie-Spengler</dd></dl>
<h3>Lackiererei</h3>
<dl><dt>Sheref Kamili</dt><dd>Carrosserie-Lackierer</dd><dt>Fabio Cezza</dt><dd>Carrosserie-Lackierer</dd><dt>Anna Meier</dt><dd>Carrosserie-Lackiererin EFZ in Ausbildung</dd></dl>
<h3>Aufbereitung und Finish</h3>
<dl><dt>Armend Nuhii</dt><dd>Aufbereiter, Finisher</dd></dl>
${luecke("Fotos der Mitarbeitenden zeigen wir hier, sobald alle einverstanden sind.")}
</div></section>

<section class="abschnitt" aria-labelledby="ausb-titel"><div class="rahmen">
<h2 id="ausb-titel">Auto Speedy bildet Spengler und Lackierer aus</h2>
<p class="spalte">Laut Carrosserie Suisse ist Auto Speedy Ausbildungsbetrieb für Carrosseriespengler/-in EFZ und Carrosserielackierer/-in EFZ. Der Verband führt den Betrieb als «TOP-Ausbildungsbetrieb» und als Scheibenkonzept-Partner (Stand 1. November 2026). <a href="${CARROSSERIESUISSE}" data-ort="betrieb-verband">Eintrag lesen</a>.</p>
<p class="spalte">${luecke("Welche Stellen offen sind, klären Sie am besten telefonisch.")}</p></div></section>

<section class="abschnitt" aria-labelledby="partner-titel"><div class="rahmen">
<h2 id="partner-titel">Partner von Herstellern und Flotten</h2>
<p class="spalte">Auto Speedy nennt sich zertifizierter Partner für Karosserie und Lack von Tesla (Approved Body Shop), Land Rover, AMAG und Ayvens.</p>
<p><span class="marke-offen">Nachweis des Betriebs offen</span></p></div></section>`,
}));

seiten.push(seite({
  datei: "kontakt.html",
  title: "Kontakt, Zeiten und Anfahrt | Auto Speedy Altstätten",
  desc: "Auto Speedy AG, Alte Landstrasse 63 in Altstätten: Telefon 071 755 88 61, E-Mail, Öffnungszeiten von Montag bis Freitag und Route. Schaden melden.",
  aktiv: "kontakt.html",
  jsonld: LD,
  abschlussOrt: "abschluss-kontakt",
  body: `<section class="hero"><div class="rahmen">
<h1>So erreichen Sie Auto Speedy</h1>
<p class="lead" style="font-size:clamp(2rem,6vw,3.5rem);font-family:var(--titel);font-weight:800;line-height:1;margin-bottom:.25em">${telLink(TEL1, "kontakt-hero")}</p>
<p class="lead">Montag bis Freitag erreichen Sie den Betrieb telefonisch. Mobil: ${telLink(TEL2, "kontakt-hero")}.</p>
</div></section>

<section class="abschnitt" aria-labelledby="k-zeiten"><div class="rahmen"><div class="paar">
<div><h2 id="k-zeiten">Zeiten und Anschrift</h2><p class="status" data-status>Montag bis Freitag geöffnet, mittags von ${U(12, "00")} bis ${U(13, "15")} zu.</p>${zeiten()}<p class="klein">An Feiertagen und in Betriebsferien gelten andere Zeiten.</p></div>
<div><h2>Anfahrt und E-Mail</h2><p><strong>Auto Speedy AG<br>Alte Landstrasse 63<br>9450 Altstätten</strong></p><p>${routeLink("kontakt-anfahrt")}</p><p>E-Mail: ${mailLink("kontakt-anfahrt")}</p>
<p class="klein">Der Betrieb liegt etwas ausserhalb der Stadt Altstätten.</p></div>
</div></div></section>

<section class="abschnitt" aria-labelledby="k-tesla"><div class="rahmen">
<h2 id="k-tesla">Für Fälle von Tesla gelten dieselben Nummern</h2>
<p class="spalte">Wer einen Fall von Tesla weiterleitet, erreicht den Betrieb unter denselben Nummern. Die Meldung mit Modell und Tesla-Referenz geht mit einem Tipp: <a href="schaden-melden.html?tesla=1" data-zaehl="anfrage" data-ort="kontakt-tesla">Tesla-Schaden melden</a>.</p></div></section>`,
}));

const TESLA_MODELLE = ["Model 3", "Model Y", "Model S", "Model X"];
seiten.push(seite({
  datei: "tesla.html",
  title: "Tesla-Schaden melden in Altstätten | Auto Speedy",
  desc: "Tesla beschädigt? Auto Speedy in Altstätten ist Tesla Approved Body Shop. Modell wählen, Tesla-Referenz angeben und den Schaden in zwei Angaben melden.",
  aktiv: "tesla.html",
  abschlussOrt: "abschluss-tesla",
  ohneAbschluss: false,
  body: `<section class="hero"><div class="rahmen">
<h1>Tesla-Schaden? Hier sind Sie richtig.</h1>
<p class="lead">Auto Speedy in Altstätten ist Tesla Approved Body Shop. Ihr Tesla hat einen Schaden, oder Tesla hat Ihren Fall an uns weitergeleitet: Melden Sie ihn hier in zwei Angaben.</p>
<div class="aktionen">${schadenKnopf("tesla-hero", "Tesla-Schaden melden", "schaden-melden.html?tesla=1")} ${telLink(TEL1, "tesla-hero", "knopf knopf-leise knopf-gross", `${ICON_TEL}<span><span class="sr">Anrufen: </span><span class="nowrap">${TEL1.zeige}</span></span>`)}</div>
<p class="klein">Der Status als Tesla Approved Body Shop beruht auf einer Aussage des Betriebs. Der Nachweis steht noch aus.</p>
</div></section>

<section class="abschnitt" aria-labelledby="modell-titel"><div class="rahmen">
<h2 id="modell-titel">Modell wählen, Meldung ist vorbereitet</h2>
<p class="spalte">Ein Tipp auf Ihr Modell öffnet die Meldung mit gesetztem Tesla-Fall und gewähltem Modell. Fehlt Ihr Modell, wählen Sie «anderes Modell» in der Meldung.</p>
<ul class="zeilen">
${TESLA_MODELLE.map((m) => `<li><a href="schaden-melden.html?tesla=1&amp;modell=${encodeURIComponent(m)}" data-zaehl="anfrage" data-ort="tesla-modell"><strong>${m}</strong><span class="pfeil" aria-hidden="true">→</span><span class="zusatz">Schaden am ${m} melden</span></a></li>`).join("\n")}
</ul></div></section>

<section class="abschnitt" aria-labelledby="tref-titel"><div class="rahmen"><div class="paar">
<div><h2 id="tref-titel">Für Mitarbeitende von Tesla</h2>
<p>Leiten Sie einen Fall weiter, tragen die Kundinnen und Kunden die Tesla-Referenz in der Meldung ein. Das Feld ist freiwillig.</p>
<p>Direkt erreichen Sie den Betrieb unter ${telLink(TEL1, "tesla-mitarbeitende")} und ${mailLink("tesla-mitarbeitende")}.</p>
${luecke("Welche Angaben Tesla bei einer Weiterleitung mitgibt, tragen wir hier ein, sobald der Betrieb es beschrieben hat.")}</div>
${bild("folie-motorhaube.jpg", "Motorhaube eines Fahrzeugs mit schwarzer Folie in der Lackierkabine", "Arbeit in der Lackierkabine von Auto Speedy", { breite: 1200, hoehe: 900 })}
</div></div></section>`,
}));

function feld(id, label, art, extra = "") {
  return `<div class="feld"><label for="${id}">${label}</label>${extra}<p class="fehler" id="${id}-fehler" role="alert"></p></div>`;
}
seiten.push(seite({
  datei: "schaden-melden.html",
  title: "Schaden melden in zwei Angaben | Auto Speedy Altstätten",
  desc: "Schaden bei Auto Speedy in Altstätten melden: Name und Telefon genügen, alles andere ist freiwillig. Auch für Tesla-Fälle mit Modellwahl und Referenz.",
  aktiv: "schaden-melden.html",
  ohneAbschluss: true,
  body: `<section class="hero"><div class="rahmen">
<h1>Schaden melden</h1>
<p class="lead">Name und Telefon genügen. Alles andere ist freiwillig.</p>
<p class="spalte"><strong>Unfall mit Verletzten?</strong> Rufen Sie zuerst 144 oder 117 an.</p>
</div></section>

<section class="abschnitt"><div class="rahmen"><div class="paar">
<div>
<form id="schadenformular" class="formular" action="mailto:${MAIL}?subject=Schadenmeldung" method="post" enctype="text/plain" novalidate>
<div class="haken"><input type="checkbox" id="tesla" name="tesla" value="ja"><label for="tesla">Der Fall kommt von Tesla</label></div>
<div class="feld"><label for="name">Name <span aria-hidden="true">*</span></label><input type="text" id="name" name="name" autocomplete="name" required aria-describedby="name-fehler"><p class="fehler" id="name-fehler" role="alert"></p></div>
<div class="feld"><label for="telefon">Telefon <span aria-hidden="true">*</span></label><input type="tel" id="telefon" name="telefon" autocomplete="tel" inputmode="tel" required aria-describedby="telefon-hilfe telefon-fehler"><p class="hilfe" id="telefon-hilfe">Für den Rückruf. Beispiel: 079 123 45 67.</p><p class="fehler" id="telefon-fehler" role="alert"></p></div>
<div class="feld nur-eigen"><label for="fahrzeug">Fahrzeug (freiwillig)</label><input type="text" id="fahrzeug" name="fahrzeug" autocomplete="off" aria-describedby="fahrzeug-hilfe"><p class="hilfe" id="fahrzeug-hilfe">Marke und Modell, zum Beispiel VW Golf.</p></div>
<fieldset class="feld nur-tesla"><legend>Tesla-Modell (freiwillig)</legend><div class="chips">
${TESLA_MODELLE.concat(["anderes Modell"]).map((m) => `<label class="chip"><input type="radio" name="tesla-modell" value="${m}"><span>${m}</span></label>`).join("")}
</div></fieldset>
<div class="feld nur-tesla"><label for="referenz">Tesla-Referenz (freiwillig)</label><input type="text" id="referenz" name="referenz" autocomplete="off" aria-describedby="referenz-hilfe"><p class="hilfe" id="referenz-hilfe">Die Nummer, die Sie von Tesla erhalten haben.</p></div>
<div class="feld"><label for="was">Was ist passiert? (freiwillig)</label><textarea id="was" name="was" rows="4"></textarea></div>
<div class="sendebereich">
<button class="knopf knopf-gross" type="submit" id="senden">Schaden melden und E-Mail öffnen</button>
<p class="rueckmeldung" id="rueckmeldung" role="status" aria-live="polite"></p>
<p class="datenschutz-satz">Die E-Mail öffnet sich vorbereitet. Gesendet ist sie erst, wenn Sie in Ihrem E-Mail-Programm auf «Senden» tippen. Wir verwenden Ihre Angaben nur für diese Schadenmeldung. Verantwortlich: Auto Speedy AG, Alte Landstrasse 63, 9450 Altstätten. Mehr in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
</div>
</form>
<div class="bestaetigung" id="bestaetigung" hidden tabindex="-1">
<p><span class="etikett">Vorbereitet</span></p>
<p><strong>Ihre E-Mail ist vorbereitet.</strong> Gesendet ist sie erst, wenn Sie in Ihrem E-Mail-Programm auf «Senden» tippen.</p>
<p id="bestaetigung-zusammenfassung" class="klein"></p>
<p>Hat sich nichts geöffnet? Schreiben Sie an ${mailLink("bestaetigung")} oder rufen Sie ${telLink(TEL1, "bestaetigung")} an.</p>
</div>
</div>
<aside aria-labelledby="danach-titel"><h2 id="danach-titel">So geht es danach weiter</h2>
<ol class="liste-punkte spalte" style="list-style:decimal">
<li>Sie melden den Schaden mit Name und Telefon.</li>
<li>Der Betrieb meldet sich bei Ihnen.</li>
<li>Die Schadensabwicklung mit der Versicherung erledigt Auto Speedy für Sie.</li>
</ol>
${luecke("Wie schnell sich der Betrieb meldet, tragen wir hier ein, sobald er es festgelegt hat.")}
<p class="klein">Fotos des Schadens können Sie an die E-Mail anhängen.</p>
</aside>
</div></div></section>`,
}));

seiten.push(seite({
  datei: "impressum.html",
  title: "Impressum der Auto Speedy AG in Altstätten",
  desc: "Impressum der Auto Speedy AG, Alte Landstrasse 63, 9450 Altstätten: Firma, UID, Handelsregister, Vertretung, Kontakt und Herkunft der Bilder.",
  aktiv: "",
  ohneAbschluss: true,
  body: `<section class="hero"><div class="rahmen"><h1>Impressum</h1></div></section>
<section class="abschnitt"><div class="rahmen spalte">
<h2>Firma und Anschrift</h2>
<p><strong>Auto Speedy AG</strong><br>Alte Landstrasse 63<br>9450 Altstätten</p>
<p>UID: CHE-221.907.243<br>Handelsregister-Nummer: CH-320.3.080.980-3<br>Sitz: Altstätten SG, Aktiengesellschaft</p>
<p>Zweck laut Handelsregister: Betrieb einer Carrosserie, Autospenglerei und Autolackiererei sowie Autohandel.</p>
<h2>Vertretung und Kontakt</h2>
<p>Verwaltungsrat mit Einzelunterschrift: Shpejtim Pirku.<br>Telefon ${telLink(TEL1, "impressum")}, E-Mail ${mailLink("impressum")}.</p>
<h2>Bilder</h2>
<p>Die Fotos stammen von der bisherigen Website des Betriebs. Die Rechte klärt der Betrieb vor der Veröffentlichung.</p>
<p class="klein">Entwurf zur Freigabe. Eine Rechtsprüfung steht aus.</p></div></section>`,
}));

seiten.push(seite({
  datei: "datenschutz.html",
  title: "Datenschutzerklärung der Auto Speedy AG | Altstätten",
  desc: "Datenschutz bei Auto Speedy in Altstätten: keine Cookies, keine fremden Server, Schadenmeldung per E-Mail. Entwurf zur Freigabe, Rechtsprüfung offen.",
  aktiv: "",
  ohneAbschluss: true,
  body: `<section class="hero"><div class="rahmen"><h1>Datenschutz</h1><p class="lead">Entwurf zur Freigabe. Eine Rechtsprüfung steht aus.</p></div></section>
<section class="abschnitt"><div class="rahmen spalte">
<h2>Wer verantwortlich ist</h2>
<p>Auto Speedy AG, Alte Landstrasse 63, 9450 Altstätten. E-Mail ${mailLink("datenschutz")}.</p>
<h2>Was diese Website tut</h2>
<p>Diese Vorschau setzt keine Cookies und speichert nichts auf Ihrem Gerät. Schriften und Bilder liegen auf demselben Server. Es werden keine fremden Dienste geladen.</p>
<h2>Was bei einer Schadenmeldung geschieht</h2>
<p>Das Formular sendet nichts selbst. Es öffnet Ihr E-Mail-Programm mit einer vorbereiteten Nachricht an ${MAIL}. Ihre Angaben (Name, Telefon, freiwillig Fahrzeug, Tesla-Modell, Tesla-Referenz und Beschreibung) gehen erst an den Betrieb, wenn Sie die E-Mail senden. Der Betrieb nutzt sie nur, um Ihre Schadenmeldung zu beantworten.</p>
<h2>Links auf andere Seiten</h2>
<p>Die Links zu Google Maps, AutoScout24 und Carrosserie Suisse führen auf fremde Seiten. Dort gelten deren Datenschutzerklärungen.</p>
<h2>Zählung der Kontakte</h2>
<p>Vorgesehen ist eine Zählung ohne Cookies, die nur Art und Stelle eines Tipps erfasst, keine Kennung und keine IP-Adresse. In dieser Vorschau ist sie abgeschaltet. Vor der Veröffentlichung wird sie hier genau beschrieben.</p>
${luecke("Hosting, Standort des Servers und Aufbewahrung der E-Mails tragen wir hier ein, sobald der Betrieb sie genannt hat.")}
<h2>Ihre Rechte</h2>
<p>Sie können Auskunft über Ihre Daten verlangen und sie berichtigen oder löschen lassen. Schreiben Sie dazu an ${mailLink("datenschutz")}.</p></div></section>`,
}));

seiten.push(seite({
  datei: "404.html",
  title: "Seite nicht gefunden | Auto Speedy Altstätten, Carrosserie",
  desc: "Diese Seite gibt es nicht. Hier finden Sie Carrosserie, Lackiererei, Felgen und Occasionen von Auto Speedy in Altstätten und die Schadenmeldung.",
  aktiv: "",
  ohneAbschluss: true,
  body: `<section class="hero"><div class="rahmen">
<h1>Hier liegt kein Band.</h1>
<p class="lead">Diese Seite gibt es nicht. Vielleicht hilft einer dieser Wege.</p>
<ul class="zeilen spalte">
${zeile("index.html", "Zur Startseite", "Carrosserie, Lackiererei, Felgen, Occasionen", "404")}
${zeile("schaden-melden.html", "Schaden melden", "Name und Telefon genügen", "404")}
${zeile("kontakt.html", "Kontakt und Zeiten", "Telefon, Anschrift, Öffnungszeiten", "404")}
</ul></div></section>`,
}));

fs.writeFileSync(path.join(SITE, "robots.txt"), "User-agent: *\nDisallow: /\n");
console.log("gebaut:", seiten.join(", "));
