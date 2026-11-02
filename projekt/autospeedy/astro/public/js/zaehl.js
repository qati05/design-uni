/* Zählung ohne Cookies: zählt Tipps auf Elemente mit data-zaehl (Anruf, WhatsApp, Meldung, Saison-Band …).
   Gesendet werden nur Punkt und Ort, keine Kennung, keine Adresse, nichts auf dem Gerät gespeichert.
   Ohne Endpunkt (Vorschau) passiert nichts. */
(function () {
  "use strict";
  var ep = document.documentElement.getAttribute("data-zaehl-endpunkt");
  if (!ep || !navigator.sendBeacon) return;
  var muster = /^[a-z0-9-]{2,40}$/;
  function senden(punkt, ort) {
    if (!muster.test(punkt || "") || !muster.test(ort || "")) return;
    try { navigator.sendBeacon(ep, new Blob([JSON.stringify({ punkt: punkt, ort: ort })], { type: "text/plain" })); } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("[data-zaehl]");
    if (el) senden(el.getAttribute("data-zaehl"), el.getAttribute("data-ort") || "seite");
  }, true);
  window.__zaehl = senden;
})();
