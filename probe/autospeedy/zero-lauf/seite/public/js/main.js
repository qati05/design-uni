/* Auto Speedy AG, Vorschau. Drei Aufgaben, alles ohne Cookies, ohne Speicher auf dem Gerät, ohne fremde Hosts:
   1. Öffnungsstatus nach Zürcher Zeit (Daten aus dem Block «betrieb-daten», eine Quelle: content/betrieb.json).
   2. Handy-Menü: schliesst bei Escape und beim Tipp ausserhalb.
   3. Meldeformular: prüft am Feld, bereitet die E-Mail vor (mailto:), zeigt die Bestätigung sofort.
   Ohne dieses Skript steht der ganze Inhalt da, und das Formular geht als einfacher mailto:-Versand ab. */
(function () {
  "use strict";
  var el = document.getElementById("betrieb-daten"), daten = null;
  try { if (el) daten = JSON.parse(el.textContent); } catch (e) {}

  /* 1 · Status ------------------------------------------------------- */
  var TAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var uhr = function (m) { var h = Math.floor(m / 60), r = m % 60; return h + "." + (r < 10 ? "0" : "") + r + " Uhr"; };
  function zuerich(d) {
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Zurich", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), t = {};
    f.formatToParts(d).forEach(function (p) { t[p.type] = p.value; });
    return { tag: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[t.weekday], min: parseInt(t.hour, 10) * 60 + parseInt(t.minute, 10) };
  }
  function status(jetzt) {
    var z = zuerich(jetzt), f = (daten.zeiten[z.tag] || []), i, j, d, g;
    for (i = 0; i < f.length; i++) if (z.min >= f[i][0] && z.min < f[i][1]) return "Laut Öffnungszeiten jetzt geöffnet bis " + uhr(f[i][1]) + ".";
    for (j = 0; j <= 7; j++) { d = (z.tag + j) % 7; g = daten.zeiten[d] || [];
      for (i = 0; i < g.length; i++) if (j > 0 || g[i][0] > z.min) return "Laut Öffnungszeiten jetzt geschlossen. Wieder offen " + (j === 0 ? "heute ab " : "am " + TAGE[d] + " ab ") + uhr(g[i][0]) + "."; }
    return "Laut Öffnungszeiten jetzt geschlossen.";
  }
  if (daten && daten.zeiten) {
    var teile = document.querySelectorAll("[data-status]"), i;
    for (i = 0; i < teile.length; i++) teile[i].textContent = status(new Date());
    window.__status = status;
  }

  /* 2 · Menü --------------------------------------------------------- */
  var menue = document.querySelector("details.menue");
  if (menue) {
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menue.open) { menue.open = false; menue.querySelector("summary").focus(); } });
    document.addEventListener("click", function (e) { if (menue.open && !menue.contains(e.target)) menue.open = false; });
  }

  /* 3 · Meldeformular ------------------------------------------------ */
  var form = document.getElementById("anfrage");
  if (!form) return;
  form.noValidate = true;
  var tesla = form.getAttribute("data-variante") === "tesla";
  var senden = document.getElementById("senden"), best = document.getElementById("bestaetigung"), melde = document.getElementById("melde-status");
  var NAMEN = { fahrzeug: tesla ? "das Tesla-Modell" : "Fahrzeug", name: "Name", telefon: "Telefon" };
  var MELDUNG = {
    fahrzeug: tesla ? "Bitte wählen Sie das Modell Ihres Teslas." : "Bitte nennen Sie Marke und Modell Ihres Fahrzeugs, zum Beispiel: VW Golf.",
    name: "Bitte nennen Sie Ihren Namen.",
    telefonLeer: "Bitte geben Sie eine Telefonnummer an, zum Beispiel: 079 123 45 67.",
    telefonKurz: "Die Telefonnummer hat zu wenig Ziffern. Beispiel: 079 123 45 67."
  };
  function feldWert(id) {
    if (id === "fahrzeug" && tesla) { var r = form.querySelector('input[name="Fahrzeug"]:checked'); return r ? r.value : ""; }
    var f = document.getElementById(id); return f ? f.value.replace(/^\s+|\s+$/g, "") : "";
  }
  function fehlerText(id) {
    var w = feldWert(id);
    if (id === "telefon") { if (!w) return MELDUNG.telefonLeer; return w.replace(/\D/g, "").length < 9 ? MELDUNG.telefonKurz : ""; }
    return w ? "" : MELDUNG[id];
  }
  function zeigeFehler(id, text) {
    var box = form.querySelector('[data-feld="' + id + '"]'), info = box.querySelector(".info"), span = info.firstElementChild;
    var felder = id === "fahrzeug" && tesla ? box.querySelectorAll("input") : [document.getElementById(id)];
    for (var k = 0; k < felder.length; k++) { if (text) felder[k].setAttribute("aria-invalid", "true"); else felder[k].removeAttribute("aria-invalid"); }
    if (text) { box.classList.add("hat-fehler"); span.textContent = text; span.className = "fehler-text"; }
    else { box.classList.remove("hat-fehler"); span.className = ""; if (info.getAttribute("data-hilfe-html")) span.innerHTML = info.getAttribute("data-hilfe-html"); else span.textContent = info.getAttribute("data-hilfe"); }
  }
  ["fahrzeug", "name", "telefon"].forEach(function (id) {
    var info = form.querySelector('[data-feld="' + id + '"] .info'); if (info) info.setAttribute("data-hilfe-html", info.firstElementChild.innerHTML);
    var felder = id === "fahrzeug" && tesla ? form.querySelectorAll('input[name="Fahrzeug"]') : [document.getElementById(id)];
    for (var k = 0; k < felder.length; k++) {
      felder[k].addEventListener(tesla && id === "fahrzeug" ? "change" : "blur", function () { zeigeFehler(id, fehlerText(id)); });
      if (!(tesla && id === "fahrzeug")) felder[k].addEventListener("input", function () { if (felder[0].getAttribute("aria-invalid") && !fehlerText(id)) zeigeFehler(id, ""); });
    }
  });
  function pruefe() {
    var fehl = [], erstes = null;
    ["fahrzeug", "name", "telefon"].forEach(function (id) {
      var t = fehlerText(id); zeigeFehler(id, t);
      if (t) { fehl.push(NAMEN[id]); if (!erstes) erstes = id === "fahrzeug" && tesla ? form.querySelector('input[name="Fahrzeug"]') : document.getElementById(id); }
    });
    return { fehl: fehl, erstes: erstes };
  }
  function mailtoZeilen() {
    var z = ["Fahrzeug: " + feldWert("fahrzeug"), "Name: " + feldWert("name"), "Telefon: " + feldWert("telefon")];
    var s = feldWert("schaden"); if (s) z.push("Schaden: " + s);
    var weg = form.querySelector('input[name="Weg zu uns"]:checked'); if (weg) z.push("Weg zu uns: " + weg.value);
    z.push("", "Fotos vom Schaden hänge ich an dieses E-Mail an.");
    return z;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (senden.disabled) return;
    var p = pruefe();
    if (p.fehl.length) {
      melde.textContent = (p.fehl.length === 1 ? "Eine Angabe fehlt: " : p.fehl.length + " Angaben fehlen: ") + p.fehl.join(", ") + ".";
      if (p.erstes) p.erstes.focus();
      return;
    }
    melde.textContent = "";
    senden.disabled = true; senden.setAttribute("aria-disabled", "true");
    best.hidden = false; best.setAttribute("data-zaehl-ende", "anfrage");
    try { best.scrollIntoView({ block: "nearest", behavior: "auto" }); best.focus({ preventScroll: true }); } catch (x) {}
    var betreff = "Schadenmeldung: " + feldWert("fahrzeug");
    var href = "mailto:" + form.getAttribute("data-mail") + "?subject=" + encodeURIComponent(betreff) + "&body=" + encodeURIComponent(mailtoZeilen().join("\r\n"));
    var a = document.createElement("a"); a.href = href; a.style.display = "none"; document.body.appendChild(a);
    setTimeout(function () { a.click(); document.body.removeChild(a); }, 60);
  });
  var aendern = document.getElementById("aendern");
  if (aendern) aendern.addEventListener("click", function () { best.hidden = true; senden.disabled = false; senden.removeAttribute("aria-disabled"); senden.focus(); });
  /* Vorwahl aus dem Kontext: tesla.html#modell-y wählt Model Y vor (nur Auswahl, kein Absenden). */
  if (tesla && location.hash.indexOf("#modell-") === 0) {
    var r = document.getElementById(location.hash.slice(1)); if (r && r.type === "radio") r.checked = true;
  }
})();
