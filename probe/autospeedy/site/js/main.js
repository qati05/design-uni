/* Auto Speedy AG, Vorschau. Kein Tracking, keine Cookies, nichts im Speicher des Geräts, keine fremden Hosts.
   Alles Wesentliche steht ohne dieses Skript im HTML (Zeiten, Nummern, Formular als E-Mail-Link). */
(function () {
  "use strict";

  var MAIL = "info@autospeedy.ch";
  // Öffnungszeiten laut Website des Betriebs (fakten.md, Teil 3). Feiertage und Betriebsferien sind nicht bekannt.
  // Tage: 1 = Montag … 5 = Freitag. Zeiten in Minuten seit Mitternacht.
  var TAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var ZEITEN = {
    1: [[450, 720], [795, 1050]],
    2: [[450, 720], [795, 1050]],
    3: [[450, 720], [795, 1050]],
    4: [[450, 720], [795, 1050]],
    5: [[450, 720], [795, 1035]]
  };

  function uhr(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + "." + (m < 10 ? "0" : "") + m + " Uhr";
  }

  // Zeitpunkt in Zürich (unabhängig von der Zeitzone des Geräts)
  function zuerich(jetzt) {
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Zurich", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    var teile = {};
    f.formatToParts(jetzt).forEach(function (p) { teile[p.type] = p.value; });
    var tag = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[teile.weekday];
    return { tag: tag, min: parseInt(teile.hour, 10) * 60 + parseInt(teile.minute, 10) };
  }

  function naechsteOeffnung(tag, min) {
    // gleicher Tag später, sonst nächster Tag mit Zeiten; immer mit Wochentag benannt (nie «morgen»)
    var i, d, fenster, j;
    for (i = 0; i <= 7; i++) {
      d = (tag + i) % 7;
      fenster = ZEITEN[d];
      if (!fenster) continue;
      for (j = 0; j < fenster.length; j++) {
        if (i > 0 || fenster[j][0] > min) return { tag: d, heute: i === 0, min: fenster[j][0] };
      }
    }
    return null;
  }

  function oeffnungsstatus(jetzt) {
    var z = zuerich(jetzt), fenster = ZEITEN[z.tag], j;
    if (fenster) {
      for (j = 0; j < fenster.length; j++) {
        if (z.min >= fenster[j][0] && z.min < fenster[j][1]) {
          return "Laut Öffnungszeiten jetzt geöffnet bis " + uhr(fenster[j][1]) + ".";
        }
      }
    }
    var n = naechsteOeffnung(z.tag, z.min);
    var pause = fenster && z.min >= fenster[0][1] && z.min < fenster[1][0];
    if (!n) return "Laut Öffnungszeiten jetzt geschlossen.";
    if (pause) return "Laut Öffnungszeiten Mittagspause. Wieder offen ab " + uhr(n.min) + ".";
    return "Laut Öffnungszeiten jetzt geschlossen. Wieder offen " + (n.heute ? "heute ab " : "am " + TAGE[n.tag] + " ab ") + uhr(n.min) + ".";
  }

  function statusZeigen() {
    var el = document.querySelectorAll("[data-status]"), i, t;
    if (!el.length) return;
    t = oeffnungsstatus(new Date());
    for (i = 0; i < el.length; i++) el[i].textContent = t;
  }

  /* ---------- Formular «Schaden melden» ---------- */
  var form = document.getElementById("schadenformular");

  function feldFehler(feld, text) {
    var wrap = feld.closest(".feld"), fehler = wrap.querySelector(".fehler");
    if (text) {
      wrap.classList.add("ist-fehler");
      feld.setAttribute("aria-invalid", "true");
      fehler.textContent = text;
    } else {
      wrap.classList.remove("ist-fehler");
      feld.removeAttribute("aria-invalid");
      fehler.textContent = "";
    }
  }

  function pruefeName(f) {
    var v = f.value.trim();
    if (!v) return "Name fehlt. Bitte Namen eintragen.";
    return "";
  }

  function pruefeTelefon(f) {
    var v = f.value.trim(), ziffern = v.replace(/\D/g, "");
    if (!v) return "Telefon fehlt. Bitte Nummer eintragen.";
    if (/[^\d\s+()\/.\-]/.test(v) || ziffern.length < 9 || ziffern.length > 14) {
      return "Telefon prüfen: mindestens 9 Ziffern.";
    }
    return "";
  }

  function istTesla() { return form.querySelector("#tesla").checked; }

  function umschaltenTesla() {
    form.classList.toggle("ist-tesla", istTesla());
  }

  function mailtoBauen() {
    var g = function (id) { var e = form.querySelector(id); return e ? e.value.trim() : ""; };
    var tesla = istTesla();
    var modellEl = form.querySelector("input[name=\"tesla-modell\"]:checked");
    var modell = modellEl ? modellEl.value : "";
    var betreff = "Schadenmeldung" + (tesla ? " Tesla" + (modell ? " " + modell : "") : "");
    var zeilen = ["Schadenmeldung über die Website", ""];
    zeilen.push("Name: " + g("#name"));
    zeilen.push("Telefon: " + g("#telefon"));
    if (tesla) {
      zeilen.push("Der Fall kommt von Tesla: ja");
      zeilen.push("Tesla-Modell: " + (modell || "nicht angegeben"));
      zeilen.push("Tesla-Referenz: " + (g("#referenz") || "nicht angegeben"));
    } else if (g("#fahrzeug")) {
      zeilen.push("Fahrzeug: " + g("#fahrzeug"));
    }
    zeilen.push("", "Was ist passiert:", g("#was") || "(keine Angabe)", "", "Fotos hänge ich an diese E-Mail an, falls ich welche habe.");
    return "mailto:" + MAIL + "?subject=" + encodeURIComponent(betreff) + "&body=" + encodeURIComponent(zeilen.join("\r\n"));
  }

  function formularStarten() {
    var name = form.querySelector("#name"), tel = form.querySelector("#telefon");
    var meldung = form.querySelector("#rueckmeldung"), knopf = form.querySelector("#senden");
    var bestaetigung = document.getElementById("bestaetigung");

    // Vorwahl aus dem Kontext: von der Tesla-Seite kommt ?tesla=1, optional &modell=Model%20Y
    var q = new URLSearchParams(window.location.search);
    if (q.get("tesla") === "1") form.querySelector("#tesla").checked = true;
    var m = q.get("modell");
    if (m) {
      var r = form.querySelectorAll("input[name=\"tesla-modell\"]"), i;
      for (i = 0; i < r.length; i++) if (r[i].value === m) r[i].checked = true;
    }
    umschaltenTesla();
    form.querySelector("#tesla").addEventListener("change", umschaltenTesla);

    name.addEventListener("blur", function () { feldFehler(name, pruefeName(name)); });
    tel.addEventListener("blur", function () { feldFehler(tel, pruefeTelefon(tel)); });
    name.addEventListener("input", function () { if (name.closest(".feld").classList.contains("ist-fehler")) feldFehler(name, pruefeName(name)); });
    tel.addEventListener("input", function () { if (tel.closest(".feld").classList.contains("ist-fehler")) feldFehler(tel, pruefeTelefon(tel)); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var en = pruefeName(name), et = pruefeTelefon(tel), fehlt = [];
      feldFehler(name, en);
      feldFehler(tel, et);
      if (en) fehlt.push("Name");
      if (et) fehlt.push("Telefon");
      if (fehlt.length) {
        meldung.textContent = (fehlt.length === 1 ? "1 Angabe fehlt: " : fehlt.length + " Angaben fehlen: ") + fehlt.join(", ") + ".";
        (en ? name : tel).focus();
        return;
      }
      meldung.textContent = "Ihr E-Mail-Programm wird geöffnet …";
      knopf.disabled = true;
      bestaetigung.hidden = false;
      form.querySelector("#bestaetigung-zusammenfassung").textContent =
        "Name: " + name.value.trim() + ", Telefon: " + tel.value.trim() + (istTesla() ? ", Fall von Tesla" : "") + ".";
      window.location.href = mailtoBauen();
      window.setTimeout(function () { knopf.disabled = false; meldung.textContent = ""; }, 4000);
      bestaetigung.scrollIntoView({ block: "nearest" });
    });
  }

  // Zählpunkte: jeder Kontakt-Link trägt data-zaehl und data-ort. Ohne Endpunkt (leer) wird NICHTS gesendet.
  var ZAEHL_ENDPUNKT = "";
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("[data-zaehl]") : null;
    if (!a || !ZAEHL_ENDPUNKT || !navigator.sendBeacon) return;
    navigator.sendBeacon(ZAEHL_ENDPUNKT, JSON.stringify({ art: a.getAttribute("data-zaehl"), ort: a.getAttribute("data-ort"), seite: location.pathname }));
  });

  // Aufklappmenü «Dienstleistungen»: schliesst bei Klick daneben und mit Escape (ohne dieses Skript bleibt es per Tipp bedienbar)
  var dienst = document.querySelector("details.dienst");
  if (dienst) {
    document.addEventListener("click", function (e) { if (dienst.open && !dienst.contains(e.target)) dienst.open = false; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && dienst.open) { dienst.open = false; dienst.querySelector("summary").focus(); } });
  }

  statusZeigen();
  if (form) formularStarten();
  window.__speedy = { oeffnungsstatus: oeffnungsstatus };
})();
