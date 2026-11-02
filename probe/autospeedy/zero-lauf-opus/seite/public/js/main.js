/* Auto Speedy AG, Vorschau. Öffnungsstatus und Schadenmeldung.
   Alles Wesentliche steht ohne dieses Skript im HTML; ohne Skript schickt das Formular als «mailto:».
   Keine Cookies, nichts im Speicher des Geräts, keine fremden Hosts, kein Versand an einen Server. */
(function () {
  "use strict";
  var el = document.getElementById("betrieb-daten"), daten = null;
  try { if (el) daten = JSON.parse(el.textContent); } catch (e) {}
  if (!daten) return;

  /* Öffnungsstatus nach der Uhr in Zürich (Feiertage und Betriebsferien sind nicht bekannt) */
  var TAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var uhr = function (m) { var h = Math.floor(m / 60), r = m % 60; return h + "." + (r < 10 ? "0" : "") + r + " Uhr"; };
  function zuerich(d) {
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Zurich", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), t = {};
    f.formatToParts(d).forEach(function (p) { t[p.type] = p.value; });
    return { tag: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[t.weekday], min: parseInt(t.hour, 10) * 60 + parseInt(t.minute, 10) };
  }
  function status(jetzt) {
    var z = zuerich(jetzt), f = daten.zeiten[z.tag] || [], i, j, d, g;
    for (i = 0; i < f.length; i++) if (z.min >= f[i][0] && z.min < f[i][1]) return "Jetzt geöffnet bis " + uhr(f[i][1]) + ".";
    for (j = 0; j <= 7; j++) {
      d = (z.tag + j) % 7; g = daten.zeiten[d] || [];
      for (i = 0; i < g.length; i++) if (j > 0 || g[i][0] > z.min) return "Jetzt geschlossen. Wieder offen " + (j === 0 ? "heute ab " : "am " + TAGE[d] + " ab ") + uhr(g[i][0]) + ".";
    }
    return "Jetzt geschlossen.";
  }
  var teile = document.querySelectorAll("[data-status]"), i;
  for (i = 0; i < teile.length; i++) teile[i].textContent = status(new Date()) + " Feiertage sind nicht berücksichtigt.";

  /* Schadenmeldung */
  function ziffern(s) { return (s || "").replace(/\D/g, ""); }
  function pruefeFeld(feld) {
    var fehler = document.getElementById(feld.id + "-fehler"), text = "";
    var wert = feld.value.trim();
    if (feld.name === "Name" && !wert) text = "Bitte Ihren Namen eingeben.";
    if (feld.name === "Telefon") {
      var z = ziffern(wert);
      if (!wert) text = "Bitte eine Telefonnummer eingeben.";
      else if (z.length < 10) text = "Zu wenig Ziffern. Beispiel: 079 123 45 67";
    }
    if (fehler) fehler.textContent = text;
    if (text) feld.setAttribute("aria-invalid", "true"); else feld.removeAttribute("aria-invalid");
    return !text;
  }
  function nachricht(form) {
    var zeilen = ["Schadenmeldung über die Website", ""], fd = new FormData(form);
    fd.forEach(function (wert, name) { wert = String(wert).trim(); if (wert) zeilen.push(name + ": " + wert); });
    zeilen.push("", "Fotos vom Schaden: bitte an diese E-Mail anhängen.");
    return zeilen.join("\n");
  }
  var formulare = document.querySelectorAll("form.meldung");
  Array.prototype.forEach.call(formulare, function (form) {
    var p = form.id.replace("schadenmeldung", "");
    var knopf = document.getElementById(p + "senden");
    var best = document.getElementById(p + "bestaetigung");
    var pflicht = form.querySelectorAll("[required]");
    Array.prototype.forEach.call(pflicht, function (f) {
      f.addEventListener("blur", function () { if (f.value.trim() || f.hasAttribute("aria-invalid")) pruefeFeld(f); });
      f.addEventListener("input", function () { if (f.hasAttribute("aria-invalid")) pruefeFeld(f); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (knopf.disabled) return;
      var ok = true, erstes = null;
      Array.prototype.forEach.call(pflicht, function (f) { if (!pruefeFeld(f)) { ok = false; if (!erstes) erstes = f; } });
      if (!ok) { erstes.focus({ preventScroll: true }); erstes.closest(".feld").scrollIntoView({ block: "center" }); return; }
      knopf.disabled = true;
      knopf.setAttribute("aria-disabled", "true");
      var text = nachricht(form);
      var modell = form.querySelector("input[name=Modell]:checked"), stelle = form.querySelector("input[name=Stelle]:checked");
      var betreff = (form.getAttribute("data-betreff") || "Schadenmeldung") + (modell ? ": " + modell.value : stelle ? ": " + stelle.value : "");
      document.getElementById(p + "meldung-text").textContent = text;
      best.hidden = false;
      best.focus({ preventScroll: true });
      best.scrollIntoView({ block: "start" });
      var url = "mailto:" + daten.mail + "?subject=" + encodeURIComponent(betreff) + "&body=" + encodeURIComponent(text);
      setTimeout(function () { try { window.location.href = url; } catch (x) {} }, 60);
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll(".bestaetigung .aendern"), function (b) {
    b.addEventListener("click", function () {
      var form = document.getElementById(b.getAttribute("data-form")), p = form.id.replace("schadenmeldung", "");
      var k = document.getElementById(p + "senden");
      k.disabled = false; k.removeAttribute("aria-disabled");
      document.getElementById(p + "bestaetigung").hidden = true;
      k.focus();
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll(".bestaetigung .kopieren"), function (b) {
    b.addEventListener("click", function () {
      var t = document.getElementById(b.getAttribute("data-ziel")).textContent, hinweis = b.closest(".bestaetigung").querySelector(".kopiert");
      var fertig = function () { hinweis.textContent = "Text kopiert. Fügen Sie ihn in eine E-Mail an " + daten.mail + " ein."; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(fertig, function () { hinweis.textContent = "Kopieren ging nicht. Bitte den Text markieren und kopieren."; });
      else hinweis.textContent = "Bitte den Text markieren und kopieren.";
    });
  });
  window.__autospeedy = { status: status };
})();
