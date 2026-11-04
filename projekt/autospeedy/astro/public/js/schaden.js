/* Schadenmeldung. Die Schritte kommen aus dem Formular (Linie Klar 2, Linie Lack 3), Fotos im Browser verkleinert (JPEG, längste Seite 1600 px),
   zwei Wege: A Website (POST an den Endpunkt mit Fortschritt; ohne Endpunkt in der Vorschau nur vorgeführt), B WhatsApp.
   «Angekommen» nur bei Antwort 200 des Servers. Keine Cookies, nichts im Speicher des Geräts.
   Rückmeldung nach BAUPLAN 3.13: Schrittwechsel, Fokus auf die Überschrift, Fortschrittstext, Foto-Vorschau,
   Fehler mit aria-invalid/aria-describedby/role=alert (ohne Schütteln), Senden mit echtem Upload-Fortschritt,
   Erfolg mit Häkchen und Fokus, Sendefehler mit «Nochmals senden» und Telefon. Ohne JavaScript bleibt ein mailto-Formular. */
(function () {
  "use strict";
  var f = document.getElementById("schaden-form"); if (!f) return;
  f.noValidate = true;
  [].forEach.call(document.querySelectorAll("[data-nur-js]"), function (e) { e.hidden = false; });
  var schritte = [].slice.call(f.querySelectorAll("[data-schritt]"));
  var anzeige = [].slice.call(f.querySelectorAll("[data-anzeige]"));
  var fortschrittText = f.querySelector("[data-fortschritt-text]");
  var rueck = f.querySelector("[data-rueckmeldung]"), rapport = document.querySelector("[data-rapport]");
  var plan = f.querySelector(".plan--wahl");
  var kaestchen = [].slice.call(f.querySelectorAll('input[name="stelle"]'));
  var TEL = f.dataset.tel || "071 755 88 61", TEL_E164 = f.dataset.telE164 || "";
  var fotos = []; // { blob, url }
  var ausweis = null; // { blob, url }
  var MAX = 6, aktuell = 1, sendet = false, teslaWunsch = false;
  // Bewegung (BEWEGUNG.md 5): Schritte gleiten ueber CSS-Klassen; gewartet wird nur, wenn das CSS dieser Linie dafuer
  // eine Animation hat. Ohne Animation (andere Linie, Reduced Motion) wechselt alles sofort. Kein Warten vor dem Wechsel.
  var ruhig = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var bereit = false, wechsel = 0;
  function animiert(el) { var a = getComputedStyle(el).animationName; return !!a && a !== "none"; }
  function nachAnimation(el, weiter) {
    if (ruhig || !animiert(el)) { weiter(); return; }
    var fertig = false, t = 0;
    function los() { if (fertig) return; fertig = true; clearTimeout(t); el.removeEventListener("animationend", ende); weiter(); }
    function ende(e) { if (e.target === el) los(); }
    el.addEventListener("animationend", ende);
    t = setTimeout(los, 450); // Rueckfall, falls kein animationend kommt
  }
  function obenFrei() { return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0; }
  function inSicht(el) { var b = el.getBoundingClientRect(); return b.top >= obenFrei() - 1 && b.top < window.innerHeight - 80; }
  function sanftZu(el, block) { el.scrollIntoView({ block: block || "start", behavior: ruhig ? "auto" : "smooth" }); }
  // Alles, was im Fluss nach dem Formular steht (Geschwister des Formulars und seiner Eltern, ohne fixe Elemente)
  function danach(el) {
    var out = [];
    for (var n = el; n && n !== document.body; n = n.parentElement)
      for (var g = n.nextElementSibling; g; g = g.nextElementSibling)
        if (g.offsetParent !== null && getComputedStyle(g).position !== "fixed") out.push(g);
    return out;
  }
  // Ohne Sprung (FLIP): Was nach «ab» im Fluss steht, merkt sich seine Lage, dann aendert sich das Layout, dann gleitet es
  // per transform vom alten an den neuen Ort (zaehlt nicht als Layout-Verschiebung). Nur transform, ~260 ms.
  function ohneSprung(ab, aendern) {
    var els = danach(ab), vor = els.map(function (el) { return el.getBoundingClientRect().top; });
    aendern();
    if (ruhig) return;
    var bewegt = [];
    els.forEach(function (el, i) { var d = vor[i] - el.getBoundingClientRect().top; if (Math.abs(d) < 1) return; el.style.transition = "none"; el.style.transform = "translateY(" + d + "px)"; bewegt.push(el); });
    if (!bewegt.length) return;
    void document.body.offsetHeight;
    bewegt.forEach(function (el) { el.style.transition = "transform var(--dauer-mittel) var(--sanft)"; el.style.transform = ""; });
    setTimeout(function () { bewegt.forEach(function (el) { el.style.transition = ""; }); }, 420);
  }

  // Rückmeldung: info = ruhig (role=status), warnung = Fehler (role=alert)
  function melde(t, warnung) { rueck.hidden = !t; rueck.textContent = t || ""; rueck.setAttribute("role", warnung ? "alert" : "status"); rueck.classList.toggle("rueckmeldung--fehler", !!warnung); }
  var gezaehlt = {};
  function trichter(n) { if (!window.__zaehl) { if (document.readyState !== "complete") window.addEventListener("load", function () { trichter(n); }, { once: true }); return; } if (!gezaehlt[n]) { gezaehlt[n] = true; window.__zaehl("trichter-" + n, "schaden"); } }

  function zeige(n, fokus) {
    var neu = schritte[n - 1], alt = null, richtung = n < aktuell ? "zurueck" : "vor", nr = ++wechsel;
    schritte.forEach(function (s) { if (!alt && s !== neu && !s.hidden) alt = s; });
    aktuell = n; trichter(n);
    anzeige.forEach(function (a) { var i = Number(a.dataset.anzeige); a.classList.toggle("ist-jetzt", i === n); a.classList.toggle("ist-fertig", i < n); if (i === n) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current"); });
    if (fortschrittText) { fortschrittText.hidden = false; fortschrittText.textContent = "Schritt " + n + " von " + schritte.length; }
    melde("");
    if (n === schritte.length) fasseZusammen();
    function zeigeNeu() {
      if (nr !== wechsel) return; // ein spaeterer Wechsel hat uebernommen
      schritte.forEach(function (s) { s.hidden = s !== neu; s.classList.remove("ist-hinaus", "ist-hinein"); });
      if (bereit && !ruhig) { neu.dataset.richtung = richtung; neu.classList.add("ist-hinein"); nachAnimation(neu, function () { neu.classList.remove("ist-hinein"); }); }
      if (f.style.minHeight) ohneSprung(f, function () { f.style.minHeight = ""; }); // nur wenn sie beim Hinausgleiten festgehalten wurde
      if (fokus !== false) {
        var l = neu.querySelector("legend"); if (l) { l.setAttribute("tabindex", "-1"); l.focus({ preventScroll: true }); }
        if (!inSicht(f)) sanftZu(f); // nur scrollen, wenn der Formularkopf nicht im Bild ist
      }
    }
    if (bereit && !ruhig && alt) {
      alt.dataset.richtung = richtung; alt.classList.add("ist-hinaus");
      // Nur wenn diese Linie den Schritt wirklich animiert: Hoehe halten, damit der Fuss nicht springt
      if (animiert(alt)) f.style.minHeight = f.offsetHeight + "px";
      nachAnimation(alt, zeigeNeu);
    } else zeigeNeu();
  }

  function art() { var r = f.querySelector('input[name="art"]:checked'); return r ? r.value : ""; }
  function gewaehlt() { return kaestchen.filter(function (k) { return k.checked; }).map(function (k) { return k.value; }); }
  function wert(n) { var e = f.elements[n]; return e && e.value ? e.value.trim() : ""; }
  function angehakt(n) { var e = f.querySelector('[name="' + n + '"]'); return !!(e && e.checked); }
  function tesla() { return angehakt("tesla"); }
  var modellFeld = f.querySelector("[data-tesla-modell]");
  function modell() { var r = tesla() && f.querySelector('input[name="tesla_modell"]:checked'); return r ? r.value : ""; }
  function teslaText() { return tesla() ? "Tesla" + (modell() && modell() !== "Anderes Modell" ? " " + modell() : "") : ""; }
  function zeigeModell() { if (modellFeld) modellFeld.hidden = !tesla(); }
  var teslaKasten = f.querySelector("[data-tesla]"); if (teslaKasten) teslaKasten.addEventListener("change", zeigeModell);

  // Ersatzwagen (freiwillig): Tesla-Unterfrage nur bei Haken; ?tesla=1 belegt sie vor
  var ersatzKasten = f.querySelector("[data-ersatzwagen]"), ersatzTeslaFeld = f.querySelector("[data-ersatzwagen-tesla-feld]"), ersatzTesla = f.querySelector("[data-ersatzwagen-tesla]");
  function zeigeErsatzTesla() {
    if (!ersatzTeslaFeld) return;
    var an = !!(ersatzKasten && ersatzKasten.checked);
    ersatzTeslaFeld.hidden = !an;
    if (an && teslaWunsch && ersatzTesla && !ersatzTesla.checked) ersatzTesla.checked = true;
    if (!an && ersatzTesla) ersatzTesla.checked = false;
  }
  if (ersatzKasten) ersatzKasten.addEventListener("change", zeigeErsatzTesla);
  function ersatzText() { return ersatzKasten && ersatzKasten.checked ? "Ersatzwagen gewünscht" + (ersatzTesla && ersatzTesla.checked ? ", Tesla wenn möglich" : "") : ""; }

  function fasseZusammen() {
    var z = f.querySelector("[data-zusammen]"); if (!z) return;
    var teile = [art() || "Art fehlt"]; if (gewaehlt().length) teile.push(gewaehlt().join(", "));
    if (fotos.length) teile.push(fotos.length === 1 ? "1 Foto" : fotos.length + " Fotos");
    z.textContent = teile.join(" · ");
  }

  // Feld-Fehler: aria-invalid + beschreibender Text (role=alert), Fokus aufs erste fehlerhafte Feld
  function feldFehler(input, text) {
    if (!input) return;
    var feld = input.closest(".feld") || input.parentElement;
    var id = input.id ? input.id + "-fehler" : null;
    var p = feld.querySelector(".feld-fehler");
    if (!p) { p = document.createElement("p"); p.className = "feld-fehler"; p.setAttribute("role", "alert"); if (id) p.id = id; feld.appendChild(p); }
    p.textContent = text;
    input.setAttribute("aria-invalid", "true");
    if (id) input.setAttribute("aria-describedby", ((input.getAttribute("aria-describedby") || "").replace(id, "").trim() + " " + id).trim());
  }
  function feldOk(input) {
    if (!input) return;
    input.removeAttribute("aria-invalid");
    var feld = input.closest(".feld") || input.parentElement;
    var p = feld && feld.querySelector(".feld-fehler"); if (p) p.remove();
    var id = input.id ? input.id + "-fehler" : null;
    if (id && input.getAttribute("aria-describedby")) input.setAttribute("aria-describedby", input.getAttribute("aria-describedby").replace(id, "").trim());
  }
  ["name", "telefon", "email"].forEach(function (n) { var e = f.elements[n]; if (e) e.addEventListener("input", function () { feldOk(e); }); });

  // Schritt 1: Art wählen führt weiter; Stellen im Plan und in den Kästchen gleich
  [].forEach.call(f.querySelectorAll('input[name="art"]'), function (r) {
    r.addEventListener("change", function () { zeige(2); }); // sofort; die Kachel zeigt die Wahl, waehrend der Schritt hinausgleitet
  });
  function zeichne() { kaestchen.forEach(function (k) { var g = plan && plan.querySelector('[data-stelle="' + k.dataset.stelle + '"]'); if (g) g.classList.toggle("ist-gewaehlt", k.checked); }); }
  kaestchen.forEach(function (k) { k.addEventListener("change", function () { zeichne(); fasseZusammen(); }); });
  if (plan) [].forEach.call(plan.querySelectorAll(".plan__stelle"), function (g) {
    g.addEventListener("click", function () { var k = f.querySelector('input[data-stelle="' + g.dataset.stelle + '"]'); if (k) { k.checked = !k.checked; zeichne(); } });
  });
  [].forEach.call(f.querySelectorAll("[data-weiter]"), function (k) {
    k.addEventListener("click", function () {
      var ziel = Number(k.dataset.weiter);
      if (ziel === 2 && !art()) { melde("Bitte wählen Sie, was passiert ist.", true); var a1 = f.querySelector('input[name="art"]'); if (a1) { a1.focus({ preventScroll: true }); if (!inSicht(a1)) sanftZu(a1, "center"); } return; }
      zeige(ziel);
    });
  });
  [].forEach.call(f.querySelectorAll("[data-zurueck]"), function (k) { k.addEventListener("click", function () { zeige(Number(k.dataset.zurueck)); }); });

  // Fotos im Browser verkleinern (längste Seite 1600 px, JPEG 0.8)
  function verkleinere(datei) {
    return new Promise(function (ok, nein) {
      var url = URL.createObjectURL(datei), img = new Image();
      img.onload = function () {
        var s = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? ok(b) : nein(); }, "image/jpeg", 0.8);
      };
      img.onerror = function () { URL.revokeObjectURL(url); nein(); };
      img.src = url;
    });
  }

  // Schritt 2: Schadenfotos
  var eingabe = f.querySelector("[data-fotos]"), liste = f.querySelector("[data-fotoliste]"), fotoWeiter = f.querySelector("[data-fotoweiter]");
  function zeichneFotos() {
    liste.innerHTML = "";
    fotos.forEach(function (x, i) {
      var li = document.createElement("li"), im = document.createElement("img"), weg = document.createElement("button");
      im.src = x.url; im.alt = "Foto " + (i + 1) + " vom Schaden"; li.className = "foto-neu";
      weg.type = "button"; weg.className = "fotos__weg"; weg.textContent = "Entfernen"; weg.setAttribute("aria-label", "Foto " + (i + 1) + " entfernen");
      weg.addEventListener("click", function () { URL.revokeObjectURL(x.url); fotos.splice(i, 1); zeichneFotos(); });
      li.appendChild(im); li.appendChild(weg); liste.appendChild(li);
    });
    fasseZusammen();
    if (fotoWeiter) { fotoWeiter.textContent = fotos.length ? "Weiter" : "Ohne Foto weiter"; fotoWeiter.classList.toggle("hat-foto", fotos.length > 0); var sf = fotoWeiter.closest("[data-schritt]"); if (sf) sf.classList.toggle("hat-fotos", fotos.length > 0); }
  }
  if (eingabe) eingabe.addEventListener("change", function () {
    var neu = [].slice.call(eingabe.files || []).slice(0, MAX - fotos.length);
    var zuviel = (eingabe.files || []).length > neu.length;
    melde("Foto wird vorbereitet …");
    Promise.all(neu.map(function (d) { return verkleinere(d).then(function (b) { return { blob: b, url: URL.createObjectURL(b) }; }, function () { return null; }); }))
      .then(function (r) { r.forEach(function (x) { if (x) fotos.push(x); }); var kaputt = r.some(function (x) { return !x; }); melde(kaputt ? "Ein Bild liess sich nicht lesen. Bitte als Foto (JPEG) wählen." : zuviel ? "Höchstens " + MAX + " Fotos. Die weiteren wurden nicht übernommen." : "", kaputt || zuviel); zeichneFotos(); eingabe.value = ""; });
  });

  // Fahrzeugausweis (freiwillig, höchstens eins, zählt nicht zu den 6 Schadenfotos)
  var ausweisEingabe = f.querySelector("[data-ausweis]"), ausweisListe = f.querySelector("[data-ausweisliste]");
  function zeichneAusweis() {
    if (!ausweisListe) return;
    ausweisListe.innerHTML = "";
    if (!ausweis) return;
    var li = document.createElement("li"), im = document.createElement("img"), weg = document.createElement("button");
    im.src = ausweis.url; im.alt = "Foto vom Fahrzeugausweis"; li.className = "foto-neu";
    weg.type = "button"; weg.className = "fotos__weg"; weg.textContent = "Entfernen"; weg.setAttribute("aria-label", "Foto vom Fahrzeugausweis entfernen");
    weg.addEventListener("click", function () { URL.revokeObjectURL(ausweis.url); ausweis = null; zeichneAusweis(); });
    li.appendChild(im); li.appendChild(weg); ausweisListe.appendChild(li);
  }
  if (ausweisEingabe) ausweisEingabe.addEventListener("change", function () {
    var d = (ausweisEingabe.files || [])[0]; if (!d) return;
    verkleinere(d).then(function (b) { if (ausweis) URL.revokeObjectURL(ausweis.url); ausweis = { blob: b, url: URL.createObjectURL(b) }; zeichneAusweis(); }, function () { melde("Das Bild liess sich nicht lesen. Bitte als Foto (JPEG) wählen.", true); });
    ausweisEingabe.value = "";
  });

  // Vorwahl über die Adresse: ?art=hagel, ?fahrzeug=tesla (auch ?tesla=1), ?stelle=dach
  function anwenden(q) {
    teslaWunsch = q.get("fahrzeug") === "tesla" || q.get("tesla") === "1";
    if (teslaWunsch) { var t = f.querySelector("[data-tesla]"); if (t) t.checked = true; }
    zeigeModell(); zeigeErsatzTesla();
    var ergaenzen = f.querySelector("[data-ergaenzen]"); if (ergaenzen && (teslaWunsch || q.getAll("stelle").length)) ergaenzen.open = true; // Vorbelegtes bleibt sichtbar
    kaestchen.forEach(function (k) { if (q.getAll("stelle").indexOf(k.dataset.stelle) > -1) k.checked = true; }); zeichne();
    var a = q.get("art") && f.querySelector('input[data-art="' + q.get("art") + '"]');
    if (a) { a.checked = true; zeige(2, false); requestAnimationFrame(function () { f.scrollIntoView({ block: "start" }); }); } else zeige(1, false);
    if (rapport) rapport.hidden = true; f.hidden = false;
  }
  window.__schaden = { anwenden: anwenden };
  anwenden(new URLSearchParams(location.search));
  bereit = true; // erst ab jetzt gleiten Schritte (beim Laden kein Einblenden)

  // Zeitfalle-Token vom Server holen (GET endpunkt?t=1). Ohne Endpunkt oder bei Fehler bleibt das Feld leer.
  (function holeToken() {
    var tokenFeld = f.querySelector("[data-token]"), ep = f.dataset.endpunkt;
    if (!tokenFeld || !ep) return;
    try {
      var x = new XMLHttpRequest();
      x.open("GET", ep + (ep.indexOf("?") > -1 ? "&" : "?") + "t=1");
      x.onload = function () { try { var j = JSON.parse(x.responseText); if (j && typeof j.t === "string") tokenFeld.value = j.t; } catch (e) {} };
      x.send();
    } catch (e) {}
  })();

  // WhatsApp-/mailto-Text
  function nachricht() {
    var z = "Schadenmeldung über autospeedy.ch\n\nWas ist passiert: " + art() + "\nTesla: " + (tesla() ? "ja" + (modell() ? ", " + modell() : "") : "nein");
    if (ersatzText()) z += "\n" + ersatzText();
    z += "\nStellen: " + (gewaehlt().join(", ") || "nicht angegeben") + "\nBemerkung: " + (wert("bemerkung") || "keine") +
      "\nName: " + wert("name") + "\nTelefon: " + wert("telefon") + "\n";
    if (wert("email")) z += "Mail: " + wert("email") + "\n";
    if (wert("kontrollschild")) z += "Kontrollschild: " + wert("kontrollschild") + "\n";
    if (wert("versicherung")) z += "Versicherung: " + wert("versicherung") + "\n";
    if (wert("schadennummer")) z += "Schadennummer: " + wert("schadennummer") + "\n";
    return z;
  }

  function pruefe() {
    var ok = true;
    if (!art()) { zeige(1); melde("Bitte wählen Sie, was passiert ist.", true); return false; }
    var name = f.elements.name, tel = f.elements.telefon, mail = f.elements.email;
    if (!wert("name")) { feldFehler(name, "Bitte geben Sie Ihren Namen an."); ok = false; } else feldOk(name);
    if (!wert("telefon")) { feldFehler(tel, "Bitte geben Sie Ihre Telefonnummer an."); ok = false; }
    else if (!/^[+0-9 ()./-]{6,40}$/.test(wert("telefon"))) { feldFehler(tel, "Bitte prüfen Sie die Telefonnummer."); ok = false; }
    else feldOk(tel);
    if (mail && wert("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wert("email"))) { feldFehler(mail, "Bitte prüfen Sie die Mail-Adresse oder lassen Sie das Feld leer."); ok = false; } else feldOk(mail);
    if (!ok) {
      melde("Bitte ergänzen Sie die rot markierten Felder.", true);
      // Zum ersten Fehlerfeld, nicht an den Seitenanfang: Fokus ohne Sprung, dann ruhig in die Mitte
      var erstes = f.querySelector('[aria-invalid="true"]'); if (erstes) { var zu = erstes.closest("details"); if (zu) zu.open = true; erstes.focus({ preventScroll: true }); sanftZu(erstes, "center"); }
      return false;
    }
    return !wert("website");
  }

  function datumJetzt() { return new Intl.DateTimeFormat("de-CH", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date()) + " Uhr"; }
  function bestaetige(titel, stand, link, echterVersand, ohneFotos) {
    if (!rapport) return;
    rapport.querySelector("[data-r-titel]").textContent = titel;
    rapport.querySelector("[data-r-datum]").textContent = datumJetzt();
    rapport.querySelector("[data-r-art]").textContent = art() + (tesla() ? " (" + teslaText() + ")" : "");
    var ez = rapport.querySelector("[data-r-ersatz-zeile]"), ed = rapport.querySelector("[data-r-ersatz]");
    if (ez && ed) { if (ersatzText()) { ez.hidden = false; ed.textContent = ersatzText(); } else ez.hidden = true; }
    var rs = rapport.querySelector("[data-r-stellen]"); rs.textContent = gewaehlt().join(", "); var wrap = rs.closest("div"); if (wrap) wrap.hidden = !gewaehlt().length;
    rapport.querySelector("[data-r-text]").textContent = wert("bemerkung") || "keine";
    rapport.querySelector("[data-r-kontakt]").textContent = wert("name") + ", " + wert("telefon");
    rapport.querySelector("[data-r-stand]").textContent = stand;
    var bilder = rapport.querySelector("[data-r-fotos]"); bilder.innerHTML = "";
    fotos.forEach(function (x, i) { var im = document.createElement("img"); im.src = x.url; im.alt = "Foto " + (i + 1); bilder.appendChild(im); });
    if (ohneFotos) bilder.innerHTML = ""; // WhatsApp: die Fotos gehen nicht von hier mit, also nicht so tun
    bilder.hidden = ohneFotos || !fotos.length;
    var aendern = rapport.querySelector("[data-r-zurueck]"); if (aendern) aendern.hidden = !!echterVersand; // nach echtem Versand keine zweite Meldung über dasselbe Formular
    // Ruhiger Hinweis: wenn keine «zur Hand»-Angabe da ist, Fahrzeugausweis per WhatsApp nachreichen (kein zweiter Zwang)
    var hinweis = rapport.querySelector("[data-r-ausweis-hinweis]");
    if (hinweis) {
      var etwasDa = ausweis || wert("kontrollschild") || wert("versicherung") || wert("schadennummer");
      hinweis.hidden = !echterVersand || !!etwasDa; // nur beim echten Versand, wenn noch nichts «zur Hand» da ist
      var waLink = hinweis.querySelector("[data-r-ausweis-wa]");
      if (waLink && f.dataset.wa) waLink.href = "https://wa.me/" + f.dataset.wa + "?text=" + encodeURIComponent("Fahrzeugausweis zur Schadenmeldung von " + (wert("name") || ""));
      else if (waLink) waLink.hidden = true;
    }
    var n = rapport.querySelector("[data-r-nochmal]"); n.hidden = !link; if (link) n.href = link;
    var gleitet = false;
    function tausche() { f.hidden = true; f.classList.remove("ist-hinaus"); rapport.hidden = false; }
    function zeigeRapport() {
      if (gleitet) ohneSprung(rapport, tausche); else tausche();
      rapport.focus({ preventScroll: true });
      if (!inSicht(rapport)) sanftZu(rapport);
    }
    // Formular gleitet kurz hinaus, dann kommt die Bestaetigung (CSS); ohne Animation sofort
    if (!ruhig && !f.hidden) { f.classList.add("ist-hinaus"); gleitet = animiert(f); nachAnimation(f, zeigeRapport); } else zeigeRapport();
  }
  if (rapport) rapport.querySelector("[data-r-zurueck]").addEventListener("click", function () { rapport.hidden = true; f.hidden = false; f.classList.remove("ist-hinaus"); zeige(schritte.length); });

  // Fortschrittsbalken (echte Upload-Bytes, sonst unbestimmt)
  var balken = f.querySelector("[data-sende-balken]"), balkenSpan = balken && balken.querySelector("span");
  function balkenZeige(an) { if (!balken) return; balken.hidden = !an; if (balkenSpan) { balkenSpan.style.transform = "scaleX(0)"; } balken.classList.remove("ist-unbestimmt"); }
  function balkenAuf(frac, unbestimmt) { if (!balken) return; if (unbestimmt) { balken.classList.add("ist-unbestimmt"); return; } balken.classList.remove("ist-unbestimmt"); if (balkenSpan) balkenSpan.style.transform = "scaleX(" + Math.max(0, Math.min(1, frac)) + ")"; }

  function sammleDaten() {
    var daten = new FormData();
    daten.append("art", art()); daten.append("name", wert("name")); daten.append("telefon", wert("telefon"));
    daten.append("bemerkung", wert("bemerkung")); if (wert("email")) daten.append("email", wert("email")); daten.append("website", wert("website"));
    if (tesla()) daten.append("tesla", "ja"); if (modell()) daten.append("tesla_modell", modell());
    if (ersatzKasten && ersatzKasten.checked) { daten.append("ersatzwagen", "ja"); if (ersatzTesla && ersatzTesla.checked) daten.append("ersatzwagen_tesla", "ja"); }
    if (wert("kontrollschild")) daten.append("kontrollschild", wert("kontrollschild"));
    if (wert("versicherung")) daten.append("versicherung", wert("versicherung"));
    if (wert("schadennummer")) daten.append("schadennummer", wert("schadennummer"));
    var tok = f.querySelector("[data-token]"); if (tok && tok.value) daten.append("t", tok.value);
    gewaehlt().forEach(function (s) { daten.append("stelle", s); });
    fotos.forEach(function (x, i) { daten.append("foto", x.blob, "schaden-" + (i + 1) + ".jpg"); });
    if (ausweis) daten.append("ausweis", ausweis.blob, "fahrzeugausweis.jpg");
    var ts = f.querySelector('[name="cf-turnstile-response"]'); if (ts) daten.append("cf-turnstile-response", ts.value);
    return daten;
  }

  function knopf(weg) { return f.querySelector('[data-senden="' + weg + '"]'); }
  // Ladezustand: Wo das CSS einen Ring anbietet (.ist-laedt .laden sichtbar), behaelt der Knopf Text und Breite und zeigt
  // den Ring; sonst (andere Linie, Reduced Motion) wird wie bisher der Text ersetzt. aria-busy + disabled in beiden Faellen.
  function sendenAus(knopfEl, text) {
    knopfEl.disabled = true; knopfEl.setAttribute("aria-busy", "true");
    knopfEl.dataset.text = knopfEl.dataset.text || knopfEl.firstChild.textContent;
    var ring = knopfEl.querySelector(".laden");
    if (!ring) { ring = document.createElement("span"); ring.className = "laden"; ring.setAttribute("aria-hidden", "true"); knopfEl.appendChild(ring); }
    knopfEl.classList.add("ist-laedt");
    if (getComputedStyle(ring).display === "none") { knopfEl.classList.remove("ist-laedt"); knopfEl.childNodes[0].textContent = text; }
  }
  function sendenEin(knopfEl, text) { knopfEl.disabled = false; knopfEl.removeAttribute("aria-busy"); knopfEl.classList.remove("ist-laedt"); knopfEl.childNodes[0].textContent = text || knopfEl.dataset.text; }

  function sendeWebsite(knopfEl) {
    var ep = f.dataset.endpunkt;
    if (!ep) {
      bestaetige("Schadenmeldung (Vorschau)", "Vorschau: Auf der fertigen Website käme die Meldung jetzt mit " + (fotos.length === 1 ? "1 Foto" : fotos.length + " Fotos") + " bei Auto Speedy an. In dieser Vorschau wird nichts gesendet.", null);
      return;
    }
    var daten = sammleDaten();
    sendet = true; sendenAus(knopfEl, "Wird gesendet …"); f.setAttribute("aria-busy", "true"); melde("Ihre Meldung wird gesendet …"); balkenZeige(true);
    var x = new XMLHttpRequest();
    x.open("POST", ep);
    if (x.upload) x.upload.onprogress = function (e) { balkenAuf(e.lengthComputable ? e.loaded / e.total : 0, !e.lengthComputable); };
    x.onload = function () {
      sendet = false; f.removeAttribute("aria-busy");
      if (x.status >= 200 && x.status < 300) {
        if (window.__zaehl) window.__zaehl("meldung-gesendet", "website");
        melde(""); balkenAuf(1);
        bestaetige("Danke, Ihre Meldung ist bei uns.", "Angekommen bei Auto Speedy. Wir melden uns bei Ihnen, in der Regel telefonisch in den Öffnungszeiten.", null, true);
      } else {
        sendeFehler(knopfEl);
      }
    };
    x.onerror = function () { sendet = false; f.removeAttribute("aria-busy"); sendeFehler(knopfEl); };
    x.send(daten);
  }
  function sendeFehler(knopfEl) {
    if (window.turnstile) window.turnstile.reset();
    balkenZeige(false);
    sendenEin(knopfEl, "Nochmals senden");
    melde("Das Senden hat nicht geklappt. Ihre Angaben bleiben erhalten. Bitte nochmals senden oder rufen Sie uns an: " + TEL + ".", true);
  }

  [].forEach.call(f.querySelectorAll("[data-senden]"), function (k) {
    k.addEventListener("click", function () {
      if (sendet || !pruefe()) return;
      var weg = k.dataset.senden;
      if (weg === "whatsapp") {
        var text = nachricht();
        var waNr = f.dataset.wa;
        if (!waNr) { melde("WhatsApp ist hier nicht hinterlegt. Bitte rufen Sie uns an: " + TEL + ".", true); return; }
        var wa = "https://wa.me/" + waNr + "?text=" + encodeURIComponent(text);
        window.open(wa, "_blank", "noopener");
        var anhang = fotos.length ? "Bitte hängen Sie dort Ihre " + (fotos.length === 1 ? "1 Foto" : fotos.length + " Fotos") + (ausweis ? " und den Fahrzeugausweis" : "") + " an." : ausweis ? "Bitte hängen Sie dort den Fahrzeugausweis an." : "Fotos hängen Sie in WhatsApp an.";
        bestaetige("Meldung für WhatsApp", "WhatsApp ist geöffnet. Gesendet ist die Nachricht erst, wenn Sie dort auf Senden tippen. " + anhang, wa, false, true);
        return;
      }
      sendeWebsite(k);
    });
  });
  // Ohne Endpunkt und ausserhalb der Vorschau gibt es Weg A nicht
  if (!f.dataset.endpunkt && f.dataset.istVorschau !== "ja") { var a = knopf("website"); if (a) a.hidden = true; var wk = knopf("whatsapp"); if (wk && wk.classList.contains("senden__wa")) wk.className = "k k--blau k--gross"; } // ohne Weg A ist WhatsApp der Hauptweg
  else if (!f.dataset.endpunkt) { var h = f.querySelector("[data-weg-a-hilfe]"); if (h) h.textContent = "In der Vorschau nur vorgeführt, es wird nichts gesendet"; }
})();
