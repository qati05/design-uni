/* Rückruf-Formulare: an den Endpunkt (art «Rückruf»), «angekommen» nur bei Antwort 200; in der Vorschau ohne Endpunkt
   nur vorgeführt; ohne JavaScript per E-Mail-Programm (action). Keine Cookies, nichts gespeichert.
   Zeitfalle wie bei der Schadenmeldung: Token beim Laden holen (GET ?t=1), als «t» mitsenden; bei «zeit-schnell» kurz
   warten und nochmals senden, bei «zeit» (abgelaufen) neues Token holen und einmal nochmals senden. */
(function () {
  "use strict";
  [].forEach.call(document.querySelectorAll("[data-rueckruf]"), function (f) {
    f.noValidate = true;
    var r = f.querySelector("[data-rueckmeldung]"), sendet = false, token = "";
    function holeToken() {
      var ep = f.dataset.endpunkt; if (!ep) return Promise.resolve();
      return fetch(ep + (ep.indexOf("?") > -1 ? "&" : "?") + "t=1").then(function (x) { return x.json(); })
        .then(function (j) { if (j && typeof j.t === "string") token = j.t; }, function () {});
    }
    holeToken();
    function melde(t) { r.hidden = !t; r.textContent = t || ""; }
    function wert(n) { var e = f.elements[n]; return e && e.value ? e.value.trim() : ""; }
    function anliegen() { var x = f.querySelector('input[name="anliegen"]:checked') || f.querySelector('input[name="anliegen"]'); return x ? x.value : "Allgemein"; }
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sendet) return;
      var fehlt = ["name", "telefon"].filter(function (n) { return !wert(n); });
      if (fehlt.length) { melde("Bitte geben Sie " + (fehlt.length === 2 ? "Name und Telefon" : fehlt[0] === "name" ? "Ihren Namen" : "Ihre Telefonnummer") + " an."); f.elements[fehlt[0]].focus(); return; }
      if (!/^[+0-9 ()./-]{6,40}$/.test(wert("telefon"))) { melde("Bitte prüfen Sie die Telefonnummer."); f.elements.telefon.focus(); return; }
      if (wert("website")) return;
      var ep = f.dataset.endpunkt;
      if (!ep) { melde(f.dataset.istVorschau === "ja" ? "Vorschau: Auf der fertigen Website käme Ihre Rückruf-Bitte jetzt bei Auto Speedy an. Hier wird nichts gesendet." : "Bitte rufen Sie uns an: 071 755 88 61."); return; }
      var d = new FormData();
      d.append("art", "Rückruf"); d.append("name", wert("name")); d.append("telefon", wert("telefon")); d.append("bemerkung", "Anliegen: " + anliegen()); d.append("website", wert("website"));
      var ts = f.querySelector('[name="cf-turnstile-response"]'); if (ts) d.append("cf-turnstile-response", ts.value);
      sendet = true; melde("Wird gesendet …");
      function sende(versuch) {
        d.set("t", token);
        return fetch(ep, { method: "POST", body: d }).then(function (x) {
          if (x.ok) return x.json();
          if (x.status !== 422 || versuch >= 3) throw 0;
          return x.json().then(function (j) {
            var fe = (j && j.fehler) || [];
            if (fe.indexOf("zeit-schnell") > -1) return new Promise(function (ok) { setTimeout(ok, Math.min(Number(j.warte) || 4000, 4000) + 250); }).then(function () { return sende(versuch + 1); });
            if (fe.indexOf("zeit") > -1 && versuch === 0) return holeToken().then(function () { return sende(1); });
            throw 0;
          });
        });
      }
      sende(0)
        .then(function () { melde("Angekommen. Wir rufen Sie zurück. Anliegen: " + anliegen() + "."); f.querySelector('button[type="submit"]').disabled = true; })
        .catch(function () { if (window.turnstile) window.turnstile.reset(); melde("Das hat nicht geklappt. Bitte rufen Sie uns an: 071 755 88 61."); })
        .then(function () { sendet = false; });
    });
  });
})();
