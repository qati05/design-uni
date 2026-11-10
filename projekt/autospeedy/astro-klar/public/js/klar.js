/* Linie «Klar»: Kopf beim Scrollen, Menü-Blatt, ruhiges Erscheinen, Leiste am Handy, Vorher-nachher-Regler,
   Fremdinhalte erst nach Klick. Ohne JS ist alles sichtbar und bedienbar. Kein Inline-Skript (CSP: script-src 'self'). */
(function () {
  "use strict";
  var wurzel = document.documentElement;
  wurzel.classList.add("js");

  // Einblenden beim Rollen (Startseite, Hallmark «one reveal»): einmal je Element. Die Klasse «reveal-an» kommt nur, wenn der
  // Browser beobachten kann und Bewegung erwünscht ist; sonst (und ohne Skript) steht alles von Anfang an da.
  try {
    var zeigen = document.querySelectorAll("[data-reveal], [data-reveal-liste]");
    if (zeigen.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Wer springt (Anker, «zurück», schnelles Rollen), überholt Elemente, ohne dass sie je im Bild waren. Darum gilt:
      // erscheint ein Element, sind alle davor (weiter oben) auch da. Dort sieht niemand die Bewegung, es bleibt aber nichts leer.
      var reihe = [].slice.call(zeigen), stand = -1;
      var beob = new IntersectionObserver(function (es) {
        var bis = stand;
        es.forEach(function (e) { if (e.isIntersecting) bis = Math.max(bis, reihe.indexOf(e.target)); });
        for (var i = stand + 1; i <= bis; i++) { reihe[i].classList.add("is-in"); beob.unobserve(reihe[i]); }
        stand = bis;
      }, { rootMargin: "0px 0px -10% 0px" });
      wurzel.classList.add("reveal-an");
      reihe.forEach(function (el) { beob.observe(el); });
    }
  } catch (e) { wurzel.classList.remove("reveal-an"); }
  // iOS setzt :active nur zuverlaessig, wenn ein touchstart-Listener existiert (BEWEGUNG.md 2). Leer und passiv.
  document.addEventListener("touchstart", function () {}, { passive: true });
  var ruhig = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Bewegungsschicht nur, wenn IntersectionObserver vorhanden ist und keine Reduced-Motion-Vorgabe gilt (BAUPLAN 3.0.2)
  if ("IntersectionObserver" in window && !ruhig) wurzel.classList.add("js-bewegung");

  // Kopf wird ab ca. 80 px Scroll schmaler und milchig (Bewegung 20; CSS macht nur die Hoehe als Bewegung, ohne Layoutsprung)
  var kopf = document.querySelector("[data-kopf]");
  function kopfPruefe() { if (kopf) kopf.classList.toggle("ist-unten", window.scrollY > 80); }
  window.addEventListener("scroll", kopfPruefe, { passive: true }); kopfPruefe();

  // Hinweis-Banner und Pop-up (BAUPLAN 4.2). Der Build zeigt nur Hinweise im Zeitraum; hier zusätzlich ausblenden,
  // falls der nächtliche Neubau einmal ausfällt (data-von/data-bis). Banner schliessbar (sessionStorage, ohne Personendaten).
  var heuteISO = (function () {
    var d = new Date(), z = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  })();
  function imZeitraum(el) {
    var von = el.getAttribute("data-von"), bis = el.getAttribute("data-bis");
    return (!von || von <= heuteISO) && (!bis || heuteISO <= bis);
  }
  function hinweisSpeicher() { try { return JSON.parse(sessionStorage.getItem("hinweis-zu") || "[]"); } catch (e) { return []; } }
  var hinweisBox = document.querySelector("[data-hinweise]");
  function hinweisHoehe() {
    var h = hinweisBox && hinweisBox.offsetParent !== null ? hinweisBox.getBoundingClientRect().height : 0;
    wurzel.style.setProperty("--hinweis-hoehe", Math.round(h) + "px");
  }
  if (hinweisBox) {
    var zu = hinweisSpeicher();
    [].forEach.call(hinweisBox.querySelectorAll("[data-hinweis]"), function (p) {
      if (!imZeitraum(p) || zu.indexOf(p.getAttribute("data-key")) !== -1) { p.remove(); return; }
      var knopf = p.querySelector("[data-hinweis-zu]");
      if (knopf) knopf.addEventListener("click", function () {
        var liste = hinweisSpeicher(), key = p.getAttribute("data-key");
        if (liste.indexOf(key) === -1) liste.push(key);
        try { sessionStorage.setItem("hinweis-zu", JSON.stringify(liste)); } catch (e) {}
        p.remove(); hinweisHoehe();
      });
    });
    if (!hinweisBox.querySelector("[data-hinweis]")) hinweisBox.remove();
    hinweisHoehe();
    window.addEventListener("resize", hinweisHoehe, { passive: true });
  }

  // Karte in der Ecke: schliessbar wie die Leiste (derselbe Merker), ausserhalb des Zeitraums gar nicht da.
  var ecke = document.querySelector("[data-hinweis-ecke]");
  if (ecke) {
    if (!imZeitraum(ecke) || hinweisSpeicher().indexOf(ecke.getAttribute("data-key")) !== -1) ecke.remove();
    else {
      var zuEcke = ecke.querySelector("[data-hinweis-ecke-zu]");
      if (zuEcke) zuEcke.addEventListener("click", function () {
        var liste = hinweisSpeicher(), key = ecke.getAttribute("data-key");
        if (liste.indexOf(key) === -1) liste.push(key);
        try { sessionStorage.setItem("hinweis-zu", JSON.stringify(liste)); } catch (e) {}
        ecke.classList.add("geht");
        setTimeout(function () { ecke.remove(); }, 180);
      });
    }
  }

  // Pop-up (BAUPLAN 4.2): als <dialog> erst nach 2 s, einmal pro Sitzung. Die Komponente rendert es nie auf /schaden-melden/.
  var popup = document.querySelector("[data-hinweis-popup]");
  if (popup && typeof popup.showModal === "function" && imZeitraum(popup)) {
    var gesehen = false;
    try { gesehen = sessionStorage.getItem("hinweis-popup") === "1"; } catch (e) {}
    var zuPopup = popup.querySelector("[data-hinweis-popup-zu]");
    if (zuPopup) zuPopup.addEventListener("click", function () { popup.close(); });
    if (!gesehen) {
      setTimeout(function () {
        if (popup.open) return;
        try { sessionStorage.setItem("hinweis-popup", "1"); } catch (e) {}
        popup.showModal();
      }, 2000);
    }
  } else if (popup) {
    popup.remove();
  }

  // Handyleiste (BAUPLAN 3.11 + Design-Review 22:00, 2): per IntersectionObserver.
  // An, sobald die HERO-CTAs (.hero .ctas) aus dem Bild gescrollt sind — nicht der ganze Hero, damit nie
  // vier CTAs gleichzeitig sichtbar sind. Aus, solange der Fuss (letzter Aufruf, dort dieselben Knoepfe) sichtbar ist
  // oder ein Eingabefeld den Fokus hat (Bildschirmtastatur). Unterseiten ohne Hero: ganzer Abschnitt.
  var leiste = document.querySelector(".handyleiste");
  // QA C05: auch auf der Tesla-Seite erst nach dem Hero-Knopf «Tesla-Schaden melden»
  var heroZiel = document.querySelector(".hero .ctas, .leistung-kopf .knoepfe, .tesla--seite .tesla__kopf .knoepfe") || document.querySelector(".hero, .buehne--start");
  if (leiste && heroZiel) {
    document.body.classList.add("leiste-spaeter");
    if ("IntersectionObserver" in window) {
      var schlussEls = [].slice.call(document.querySelectorAll(".fuss"));
      var heroSichtbar = true, schlussSichtbar = false, fokusFeld = false;
      var feld = function (el) { return el && el.matches && el.matches("input, textarea, select"); };
      function stelleLeiste() { document.body.classList.toggle("leiste-an", !heroSichtbar && !schlussSichtbar && !fokusFeld); }
      new IntersectionObserver(function (es) { es.forEach(function (e) { heroSichtbar = e.isIntersecting; }); stelleLeiste(); }).observe(heroZiel);
      if (schlussEls.length) {
        var ioSchluss = new IntersectionObserver(function (es) {
          es.forEach(function (e) { e.target.dataset.sichtbar = e.isIntersecting ? "1" : ""; });
          schlussSichtbar = schlussEls.some(function (el) { return el.dataset.sichtbar === "1"; });
          stelleLeiste();
        });
        schlussEls.forEach(function (el) { ioSchluss.observe(el); });
      }
      document.addEventListener("focusin", function (e) { if (feld(e.target)) { fokusFeld = true; stelleLeiste(); } });
      document.addEventListener("focusout", function (e) { if (feld(e.target)) { fokusFeld = false; stelleLeiste(); } });
      stelleLeiste();
    } else {
      // Ohne IntersectionObserver bleibt die Leiste sichtbar: kein JS versteckt Inhalt.
      document.body.classList.remove("leiste-spaeter");
    }
  }

  // Menü-Blatt (BEWEGUNG.md 4). Oeffnen: showModal(), dann .ist-auf (CSS blendet ein). Schliessen: .ist-auf weg,
  // CSS blendet aus, erst danach close() (Safari kennt overlay/allow-discrete nicht). Ausloeser: X, Esc, Tipp daneben,
  // Tipp auf einen Link (Navigation laeuft sofort weiter), Rueckkehr aus dem Verlauf (pageshow). Fokus zurueck auf den Hamburger.
  // Ohne JS ist der Hamburger ein Link auf #menue (Liste im Kopf, :target).
  var blatt = document.querySelector("[data-menu]");
  var menuKnopf = document.querySelector("[data-menu-auf]");
  var blattTimer = 0;
  function menuStand(offen) {
    if (!menuKnopf) return;
    menuKnopf.setAttribute("aria-expanded", offen ? "true" : "false");
    menuKnopf.setAttribute("aria-label", offen ? "Menü schliessen" : "Menü öffnen");
  }
  if (menuKnopf && blatt && typeof blatt.showModal === "function") {
    menuKnopf.setAttribute("role", "button");
    menuKnopf.setAttribute("aria-haspopup", "dialog");
    menuKnopf.setAttribute("aria-expanded", "false");
  }
  function blattFertigZu() {
    if (blattTimer) { clearTimeout(blattTimer); blattTimer = 0; }
    blatt.removeEventListener("transitionend", blattEnde);
    blatt.classList.remove("ist-zu");
    if (blatt.open) blatt.close();
    wurzel.classList.remove("menue-offen");
    menuStand(false);
  }
  function blattEnde(e) { if (e.target === blatt.querySelector(".blatt__innen") && e.propertyName === "transform") blattFertigZu(); }
  function blattAuf() {
    if (!blatt || blatt.open) return;
    if (blattTimer) blattFertigZu();
    wurzel.classList.add("menue-offen");
    blatt.showModal();
    menuStand(true);
    void blatt.offsetWidth; // Startzustand festhalten, damit der Uebergang sicher laeuft
    blatt.classList.add("ist-auf");
  }
  function blattZu(fokusZurueck) {
    if (!blatt || !blatt.open || blatt.classList.contains("ist-zu")) return;
    blatt.classList.add("ist-zu");
    blatt.classList.remove("ist-auf");
    if (fokusZurueck && menuKnopf) menuKnopf.focus({ preventScroll: true });
    if (ruhig) { blattFertigZu(); return; }
    blatt.addEventListener("transitionend", blattEnde);
    blattTimer = setTimeout(blattFertigZu, 340); // Rueckfall, falls kein transitionend kommt
  }
  document.addEventListener("click", function (e) {
    if (!blatt || typeof blatt.showModal !== "function") return;
    if (e.target.closest("[data-menu-auf]")) { e.preventDefault(); blattAuf(); return; }
    if (e.target.closest("[data-menu-zu]") || e.target === blatt) { blattZu(true); return; }
    // Link im Blatt: Ausblenden starten, Navigation nicht aufhalten
    if (e.target.closest(".blatt a")) blattZu(false);
  });
  if (blatt) {
    // Esc: eigenes, weiches Schliessen statt des harten Standard-close()
    blatt.addEventListener("cancel", function (e) { e.preventDefault(); blattZu(true); });
    // Falls der Dialog doch hart geschlossen wird (z. B. vom Browser): Zustand aufraeumen
    blatt.addEventListener("close", function () { blatt.classList.remove("ist-auf", "ist-zu"); wurzel.classList.remove("menue-offen"); menuStand(false); });
    // Zurueck aus dem Verlauf (bfcache): Menue geschlossen
    window.addEventListener("pageshow", function (e) { if (e.persisted && blatt.open) blattFertigZu(); });
  }

  // Fremdinhalte (z. B. AutoScout24) laden erst nach Klick. Die Google-Bewertungen laden NICHT im Browser:
  // Note, Anzahl und Link kommen beim Build (bau/bewertungen.mjs); hier gibt es keine Anfrage an Google.
  [].forEach.call(document.querySelectorAll("[data-fremd]"), function (box) {
    var knopf = box.querySelector("[data-fremd-laden]"); if (!knopf) return;
    knopf.hidden = false;
    knopf.addEventListener("click", function () {
      var ziel = box.querySelector("[data-fremd-ziel]"), src = box.dataset.src;
      if (!/^https:\/\//.test(src)) return;
      if (box.dataset.art === "skript") { var s = document.createElement("script"); s.src = src; s.async = true; ziel.appendChild(s); }
      else { var f = document.createElement("iframe"); f.src = src; f.title = box.dataset.titel; f.loading = "lazy"; f.className = "fremd__rahmen"; f.style.height = (parseInt(box.dataset.hoehe, 10) || 900) + "px"; ziel.appendChild(f); }
      knopf.hidden = true;
    });
  });

  // Vorher-nachher (BAUPLAN 3.8 + Korrektur Motion 9): Maus folgt mit weichem Nachlauf (Lerp pro Frame via
  // requestAnimationFrame, 0.18/Frame); beim Verlassen des Bildes bleibt die Linie stehen. Touch 1:1 ohne Transition,
  // Tippen und Tastatur springen (--feder-regler). Unter Reduced Motion springt auch die Maus ohne Nachlauf.
  [].forEach.call(document.querySelectorAll("[data-vergleich]"), function (fig) {
    var flaeche = fig.querySelector(".vergleich__buehne"), regler = fig.querySelector(".vergleich__regler");
    var hinweisAn = false, hinweisTimer = null, beruehrt = false;
    var istPos = 50, zielPos = 50, laufRaf = 0;
    function hinweisWeg() {
      beruehrt = true;
      if (hinweisTimer) { clearTimeout(hinweisTimer); hinweisTimer = null; }
      if (hinweisAn) { fig.classList.remove("ist-hinweis"); hinweisAn = false; }
    }
    function schreibePos(p) { fig.style.setProperty("--pos", Math.round(p * 100) / 100); }
    function schreibeWert(p) { regler.value = Math.round(p); regler.setAttribute("aria-valuetext", Math.round(p) + " Prozent vorher"); }
    function stoppLauf() { if (laufRaf) { cancelAnimationFrame(laufRaf); laufRaf = 0; } }
    // Direkt ohne Nachlauf (Touch, Tippen, Tastatur, Reduced Motion). CSS steuert bei taste/tipp den Sprung.
    function direkt(p, quelle) {
      p = Math.max(0, Math.min(100, p)); hinweisWeg(); stoppLauf();
      fig.dataset.quelle = quelle; istPos = zielPos = p; schreibePos(p); schreibeWert(p);
    }
    // Maus mit Nachlauf: Ziel merken, Wert/ARIA sofort setzen, die Linie lerpt pro Frame zum Ziel (nur transform/clip).
    function lerpSchritt() {
      var d = zielPos - istPos;
      if (Math.abs(d) < 0.1) { istPos = zielPos; schreibePos(istPos); laufRaf = 0; return; }
      istPos += d * 0.18; schreibePos(istPos); laufRaf = requestAnimationFrame(lerpSchritt);
    }
    function maus(p) {
      p = Math.max(0, Math.min(100, p)); hinweisWeg();
      fig.dataset.quelle = "maus"; zielPos = p; schreibeWert(p);
      if (!laufRaf) laufRaf = requestAnimationFrame(lerpSchritt);
    }
    function ausZeiger(e) { var r = flaeche.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; }
    var finger = null, bewegt = false; // aktiver Touch-Zeiger; senkrechtes Wischen bleibt Scrollen (touch-action: pan-y)
    flaeche.addEventListener("pointermove", function (e) {
      if (e.pointerType === "mouse" || e.pointerType === "pen") { if (ruhig) direkt(ausZeiger(e), "maus"); else maus(ausZeiger(e)); }
      else if (e.pointerId === finger) { bewegt = true; direkt(ausZeiger(e), "touch"); }
    });
    // Beim Verlassen des Bildes haelt der Nachlauf an; die Linie bleibt stehen (Korrektur Motion 9)
    flaeche.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse" || e.pointerType === "pen") stoppLauf(); });
    flaeche.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "touch") return;
      finger = e.pointerId; bewegt = false;
      try { flaeche.setPointerCapture(e.pointerId); } catch (x) {}
      hinweisWeg();
      fig.classList.add("ist-zieht");
    });
    ["pointerup", "pointercancel"].forEach(function (t) {
      flaeche.addEventListener(t, function (e) {
        if (e.pointerId !== finger) return;
        if (!bewegt) direkt(ausZeiger(e), "tipp"); // Tippen auf eine Stelle springt mit --feder-regler
        finger = null; fig.classList.remove("ist-zieht");
      });
    });
    // Tastatur (BAUPLAN 3.8): Pfeil +-5, Bild auf/ab +-10, Pos1/Ende 0/100. Sprung mit --feder-regler.
    regler.addEventListener("keydown", function (e) {
      var p = +regler.value;
      switch (e.key) {
        case "ArrowLeft": case "ArrowDown": p -= 5; break;
        case "ArrowRight": case "ArrowUp": p += 5; break;
        case "PageDown": p -= 10; break;
        case "PageUp": p += 10; break;
        case "Home": p = 0; break;
        case "End": p = 100; break;
        default: return;
      }
      e.preventDefault();
      direkt(p, "taste");
    });
    regler.addEventListener("input", function () { direkt(+regler.value, "taste"); });
    // Einmaliger Hinweis bei 60 % Sichtbarkeit, nur solange unberuehrt; jede Eingabe bricht ihn ab (BAUPLAN 3.8)
    if (!ruhig && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; io.disconnect();
        if (beruehrt) return;
        hinweisAn = true;
        fig.classList.add("ist-hinweis");
        hinweisTimer = setTimeout(function () { fig.classList.remove("ist-hinweis"); hinweisAn = false; hinweisTimer = null; }, 1700);
      }, { threshold: 0.6 });
      io.observe(fig);
    }
  });

  // Partnerband: ohne sichtbaren Knopf (Roni 10.11.2026). Mit der Maus haelt es beim Darueberfahren an, mit der Tastatur
  // beim Fokus (beides CSS). Ohne Maus (Handy) haelt ein Tipp auf das Band es an, der naechste Tipp laesst es weiterlaufen
  // (WCAG 2.2.2: Bewegung laesst sich anhalten). Ein Tipp auf ein verlinktes Logo oeffnet wie bisher den Link.
  // Unter Reduced Motion laeuft nichts.
  [].forEach.call(document.querySelectorAll("[data-partnerband]"), function (band) {
    band.addEventListener("click", function (e) {
      if (!window.matchMedia || !window.matchMedia("(hover: none)").matches) return;
      if (e.target.closest && e.target.closest("a")) return;
      band.classList.toggle("ist-pausiert");
    });
  });

  // Kleiner Helfer (BAUPLAN 3.5/3.7): beobachtet Elemente, setzt einmal .ist-da und hoert dann auf (unobserve).
  // Nur aktiv bei html.js-bewegung. Elemente, die beim Laden schon im Bild sind, bekommen sofort .ist-da
  // ohne Transition (Klasse .ohne-uebergang fuer einen Frame), damit nichts nachtraeglich aufblitzt.
  function beobachte(selektor, opt) {
    if (!wurzel.classList.contains("js-bewegung")) return;
    opt = opt || {};
    var els = [].slice.call(document.querySelectorAll(selektor));
    if (!els.length) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("ist-da"); io.unobserve(e.target); } });
    }, { threshold: opt.schwelle || 0, rootMargin: opt.rand || "0px" });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add("ohne-uebergang", "ist-da");
        requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove("ohne-uebergang"); }); });
      } else io.observe(el);
    });
  }
  // Foto-Reveal (3.5), Tesla-Ablauf (3.7) und Sterne (3.10, nur mit echten Daten: .bew-kopf--echt)
  beobachte(".foto-ein", { schwelle: 0.25, rand: "0px 0px -8% 0px" });
  beobachte(".vorher-nachher__slider", { schwelle: 0.25 });   // 21: Regler blendet sanft ein
  beobachte(".tesla-teil .ablauf", { schwelle: 0.5 });
  beobachte(".bew-kopf--echt", { schwelle: 0.5 });
  beobachte(".fuss-slogan", { schwelle: 0.25 });
  // Feder (Roni 04.11.2026, KUNDENWEG.md 3): Titel, Aufrufe und Listen sinken beim Hereinscrollen ruhig ein.
  // Klassen werden nur hier gesetzt (kein Eingriff in die Bausteine); ohne JS und bei Reduced Motion steht alles sofort.
  function federn(selektor, klasse) {
    if (!wurzel.classList.contains("js-bewegung")) return;
    try { [].forEach.call(document.querySelectorAll(selektor), function (el) { el.classList.add(klasse); }); } catch (e) {}
  }
  federn("main h2:not(form h2):not(.bestaetigung h2):not(.hero h2), .anfrage, .vorher-nachher__text", "feder");
  federn(".karten, .faq__liste, .ablauf-kunde__liste, .weitere__liste, .bew-zitate", "feder-liste");
  beobachte(".feder, .feder-liste", { rand: "0px 0px -8% 0px" });
  // Das fruehere generische «.zeigen»-Einblenden jeder Sektion ist entfernt (BAUPLAN 3.15):
  // es bleibt nur das gezielte Erscheinen fuer Fotos und den Tesla-Ablauf (oben).

  // Fuss (Korrektur Footer): Öffnungsstatus, heutige Zeile, Kopieren, «Nach oben».
  // Eine Quelle: Zeiten aus betrieb.json, Wortlaut aus texte.json (Datenblock #fuss-daten). Zeitzone Europe/Zurich.
  // Ohne dieses Skript bleibt die neutrale Zeile stehen und die Wochen-Tabelle ist vollstaendig (kein falscher Zustand).
  function zuerich(d) {
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), p = {};
    f.formatToParts(d).forEach(function (t) { p[t.type] = t.value; });
    return { tag: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday], min: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10),
      utc: Date.UTC(parseInt(p.year, 10), parseInt(p.month, 10) - 1, parseInt(p.day, 10)) };
  }
  // Reine, testbare Funktion: aus Daten und Zeitpunkt den Status-Satz und «offen» ableiten. Ausnahme (Feiertag,
  // Betriebsferien) nach Datum ersetzt die Wochenzeiten des Tages. [] = an diesem Tag geschlossen.
  function berechneStatus(daten, jetzt) {
    var s = daten.status, sprache = (document.documentElement && document.documentElement.lang) || "de-CH";
    var tagName = function (d) { return new Intl.DateTimeFormat(sprache, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 4 + d))); };
    var uhr = function (m) { var h = Math.floor(m / 60), r = m % 60; return h + "." + (r < 10 ? "0" : "") + r; };
    var z = zuerich(jetzt), aus = daten.ausnahmen || {};
    function fenster(j) {
      var datum = new Date(z.utc + j * 864e5).toISOString().slice(0, 10);
      return Object.prototype.hasOwnProperty.call(aus, datum) ? aus[datum] : (daten.zeiten[(z.tag + j) % 7] || []);
    }
    var f = fenster(0), i, j, d, g;
    for (i = 0; i < f.length; i++) if (z.min >= f[i][0] && z.min < f[i][1]) return { offen: true, text: s.offen.replace("{bis}", uhr(f[i][1])) };
    for (j = 0; j <= 7; j++) { d = (z.tag + j) % 7; g = fenster(j);
      for (i = 0; i < g.length; i++) if (j > 0 || g[i][0] > z.min)
        return { offen: false, text: j === 0 ? s.zuHeute.replace("{ab}", uhr(g[i][0])) : s.zuTag.replace("{tag}", tagName(d)).replace("{ab}", uhr(g[i][0])),
          wann: (j === 0 ? "heute" : j === 1 ? "morgen" : "am " + tagName(d)) + " ab " + uhr(g[i][0]) + " Uhr" }; // für Danke-Texte der Formulare
    }
    return { offen: false, text: s.zu };
  }
  window.__klar = { status: berechneStatus };
  var fussDaten = null, fussEl = document.querySelector(".fuss[data-fuss]");
  try { if (fussEl) fussDaten = JSON.parse(fussEl.getAttribute("data-fuss")); } catch (e) {}
  if (fussDaten && fussDaten.zeiten && fussDaten.status) {
    window.__klar.daten = fussDaten;
    var r = berechneStatus(fussDaten, new Date());
    [].forEach.call(document.querySelectorAll("[data-status]"), function (p) { p.textContent = r.text; p.dataset.zustand = r.offen ? "offen" : "zu"; });
    // Kundenweg (KUNDENWEG.md 1): Statuszeile unter den Hero-Knoepfen erst mit Status zeigen; geschlossen kommt der Satz
    // dazu, dass Melden jederzeit geht. Ohne JS bleibt die Zeile verborgen (die Faktenleiste zeigt dann die Zeiten).
    [].forEach.call(document.querySelectorAll("[data-hero-status]"), function (z) {
      z.hidden = false;
      var zu = z.querySelector("[data-wenn-zu]");
      if (zu) zu.hidden = r.offen;
      // Status nicht doppelt: die Faktenleiste direkt darunter zeigt dann wieder die Wochenzeiten.
      [].forEach.call(document.querySelectorAll(".leiste-fakten .fakt-status"), function (f) { f.remove(); });
    });
    // Heutige Zeile in der Wochen-Tabelle als Text «heute» markieren.
    var heuteNr = zuerich(new Date()).tag;
    [].forEach.call(document.querySelectorAll(".fuss-woche tr[data-ld]"), function (tr) {
      var ld = (tr.getAttribute("data-ld") || "").split(",");
      if (ld.indexOf(String(heuteNr)) === -1) return;
      tr.classList.add("ist-heute");
      var th = tr.querySelector("th");
      if (th && !th.querySelector(".fuss-woche__heute")) { var m = document.createElement("span"); m.className = "fuss-woche__heute"; m.textContent = "heute"; th.appendChild(m); }
    });
  }

  // Kopieren (Telefon, Adresse): nur mit Clipboard-API. Ohne JS kein Knopf.
  // Rueckmeldung (Pruefung 10.11.2026, Befund 19): Der Knopf selbst zeigt kurz «Kopiert» mit Haken (sichtbar dort, wo man
  // getippt hat, Breite bleibt gleich), und die aria-live-Zeile (role=status) sagt «Adresse kopiert» bzw. «Telefon kopiert»
  // fuer Screenreader. Nach 2 Sekunden steht wieder der alte Text; die Zeile wird geleert, damit ein zweites Kopieren
  // wieder gemeldet wird.
  if (navigator.clipboard && navigator.clipboard.writeText) {
    [].forEach.call(document.querySelectorAll("[data-kopieren]"), function (knopf) {
      var text = knopf.textContent, zurueck = 0;
      knopf.hidden = false;
      knopf.addEventListener("click", function () {
        navigator.clipboard.writeText(knopf.getAttribute("data-kopieren")).then(function () {
          var ziel = knopf.closest(".fuss-ort");
          var meldung = ziel && ziel.querySelector("[data-kopiert-ziel]");
          if (meldung) { meldung.textContent = ""; meldung.textContent = knopf.getAttribute("data-kopiert") || "Kopiert"; }
          if (!knopf.classList.contains("ist-kopiert")) knopf.style.minWidth = knopf.offsetWidth + "px";
          knopf.classList.add("ist-kopiert"); knopf.textContent = "Kopiert";
          clearTimeout(zurueck);
          zurueck = setTimeout(function () {
            knopf.classList.remove("ist-kopiert"); knopf.textContent = text; knopf.style.minWidth = "";
            if (meldung) meldung.textContent = "";
          }, 2000);
        }).catch(function () {});
      });
    });
  }

  // Weiches Mausrad (Roni 04.11.2026: «sanft, als fiele eine Feder»). Nur Maus mit Rastenrad am Desktop, nie unter
  // Reduced Motion, nie Touch: das Handy scrollt nativ. Trackpads (kleine, feine Schritte) bleiben nativ, weil sie
  // schon selbst ausrollen. Jeder Radschritt verschiebt das Ziel; die Seite folgt mit einer gedaempften Annaeherung
  // (pro Frame 9 % der Reststrecke, bildratenunabhaengig) und kommt ohne Ueberschwingen zur Ruhe.
  // Nicht geglaettet: Zoom (Strg), quer, verschachtelte Scrollbereiche, offene Dialoge. Tastatur, Scrollbalken und
  // Anker fuehren weiter nativ; der Zustand gleicht sich dann von selbst ab.
  if (!ruhig && matchMedia("(hover: hover) and (pointer: fine)").matches && "requestAnimationFrame" in window) {
    var radZiel = window.scrollY, radIst = window.scrollY, radLaeuft = false, radZeit = 0, radSelbst = false;
    var radMax = function () { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); };
    var eigenerBereich = function (el) {
      for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
        if (el.tagName === "DIALOG" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") return true;
        var st = getComputedStyle(el).overflowY;
        if ((st === "auto" || st === "scroll") && el.scrollHeight > el.clientHeight + 1) return true;
      }
      return false;
    };
    var radStopp = function () { radLaeuft = false; radZiel = radIst = window.scrollY; };
    var radSchritt = function (t) {
      if (!radLaeuft) return;
      var dt = radZeit ? Math.min(64, t - radZeit) : 16.7; radZeit = t;
      var rest = radZiel - radIst;
      radIst += rest * (1 - Math.pow(1 - 0.09, dt / 16.7));
      if (Math.abs(rest) < 0.5) { radIst = radZiel; radLaeuft = false; }
      radSelbst = true;
      window.scrollTo({ top: radIst, behavior: "instant" });
      if (radLaeuft) requestAnimationFrame(radSchritt);
    };
    window.addEventListener("wheel", function (e) {
      if (e.defaultPrevented || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      // Trackpad oder Praezisionsrad: kleine, krumme Schritte -> nativ lassen (und eine laufende Glaettung abgeben)
      if (e.deltaMode === 0 && Math.abs(dy) < 40) { if (radLaeuft) radStopp(); return; }
      if (wurzel.classList.contains("menue-offen") || document.querySelector("dialog[open]") || eigenerBereich(e.target)) return;
      e.preventDefault();
      if (!radLaeuft) { radIst = window.scrollY; radZiel = radIst; }
      radZiel = Math.max(0, Math.min(radMax(), radZiel + dy));
      if (!radLaeuft) { radLaeuft = true; radZeit = 0; requestAnimationFrame(radSchritt); }
    }, { passive: false });
    // Fremdes Scrollen (Tastatur, Balken, Anker, Suche) uebernimmt sofort; die eigene Bewegung meldet sich ueber radSelbst.
    window.addEventListener("scroll", function () { if (radSelbst) { radSelbst = false; return; } if (radLaeuft) radStopp(); }, { passive: true });
    ["mousedown", "keydown"].forEach(function (typ) { window.addEventListener(typ, function () { if (radLaeuft) radStopp(); }, { passive: true }); });
  }

  // «Nach oben»: ruhiges Scrollen, bei reduzierter Bewegung springen. Ohne JS springt der #top-Link selbst.
  var obenKnopf = document.querySelector("[data-nach-oben]");
  if (obenKnopf) obenKnopf.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: ruhig ? "auto" : "smooth" });
  });
})();
