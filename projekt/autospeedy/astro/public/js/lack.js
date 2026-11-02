/* Lackwahl: hell oder dunkel lackiert. Folgt der Einstellung des Geräts; der Knopf im Kopf wählt für diesen Besuch um.
   Wechsel mit Sprühbewegung (View Transitions, Maske mit weicher Nebelkante); ohne Unterstützung oder unter
   «Bewegung reduzieren» sofort. Speichert nichts auf dem Gerät. */
(function () {
  "use strict";
  var root = document.documentElement, mq = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
  var knopf = document.querySelector("[data-lackwahl]"), text = document.querySelector("[data-lackwahl-text]");
  var manuell = false;
  var ruhig = function () { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; };
  function beschrifte() {
    if (!knopf) return;
    var dunkel = root.getAttribute("data-lack") === "dunkel";
    var t = dunkel ? "Hell lackieren" : "Dunkel lackieren";
    knopf.setAttribute("aria-pressed", dunkel ? "true" : "false"); knopf.title = t; if (text) text.textContent = t;
  }
  function lackiere(ziel) {
    if (root.getAttribute("data-lack") === ziel) return;
    var setze = function () { root.setAttribute("data-lack", ziel); beschrifte(); };
    if (!document.startViewTransition || ruhig()) { setze(); return; }
    root.setAttribute("data-spruehen", ziel);
    var vt = document.startViewTransition(setze);
    vt.finished.then(function () { root.removeAttribute("data-spruehen"); }, function () { root.removeAttribute("data-spruehen"); });
  }
  if (mq) {
    var aufAenderung = function (e) { if (!manuell) lackiere(e.matches ? "dunkel" : "hell"); };
    if (mq.addEventListener) mq.addEventListener("change", aufAenderung); else if (mq.addListener) mq.addListener(aufAenderung);
  }
  if (knopf) {
    knopf.hidden = false; beschrifte();
    knopf.addEventListener("click", function () { manuell = true; lackiere(root.getAttribute("data-lack") === "dunkel" ? "hell" : "dunkel"); });
  }
  window.__lack = lackiere;
})();

/* Navigation: Gruppe «Leistungen» schliesst bei Klick daneben und mit Escape. Ohne Skript geht sie per Klick auf und zu. */
(function () {
  var d = document.querySelector("[data-leistungen]"); if (!d) return;
  document.addEventListener("click", function (e) { if (d.open && !d.contains(e.target)) d.open = false; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && d.open) { d.open = false; d.querySelector("summary").focus(); } });
})();
