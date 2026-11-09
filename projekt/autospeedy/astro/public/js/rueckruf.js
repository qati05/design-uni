/* Rückruf-Formulare: an POST /api/rueckruf (direkt per Mail an den Betrieb, kein Cockpit). «Angekommen» nur, wenn der
   Server 200 mit ok:true antwortet; in der Vorschau ohne Endpunkt nur vorgeführt; ohne JavaScript per E-Mail-Programm
   (action). Keine Cookies, nichts gespeichert.
   Felder: anliegen, name, telefon, zeit (je angetipptes Feld), bemerkung, email (falls vorhanden), ort, website, t.
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
    // Angetippte Zeiten aus dem Zeitwahl-Raster (Linie Klar); der Server nimmt nur Werte aus diesem Raster an
    function zeiten() { return [].map.call(f.querySelectorAll('input[name="zeit"]:checked'), function (e) { return e.value; }); }
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sendet) return;
      var fehlt = ["name", "telefon"].filter(function (n) { return !wert(n); });
      if (fehlt.length) { melde("Bitte geben Sie " + (fehlt.length === 2 ? "Name und Telefon" : fehlt[0] === "name" ? "Ihren Namen" : "Ihre Telefonnummer") + " an."); f.elements[fehlt[0]].focus(); return; }
      var ziffern = (wert("telefon").match(/[0-9]/g) || []).length;
      if (!/^[+0-9 ()./-]{6,40}$/.test(wert("telefon")) || ziffern < 9 || ziffern > 15) { melde("Bitte prüfen Sie die Telefonnummer. Sie braucht mindestens 9 Ziffern."); f.elements.telefon.focus(); return; }
      if (wert("website")) return;
      var ep = f.dataset.endpunkt;
      if (!ep) { melde(f.dataset.istVorschau === "ja" ? "Vorschau: Auf der fertigen Website käme Ihre Rückruf-Bitte jetzt bei Auto Speedy an. Hier wird nichts gesendet." : "Bitte rufen Sie uns an: 071 755 88 61."); return; }
      var d = new FormData();
      d.append("anliegen", anliegen()); d.append("name", wert("name")); d.append("telefon", wert("telefon"));
      zeiten().forEach(function (z) { d.append("zeit", z); });
      d.append("bemerkung", wert("bemerkung")); d.append("email", wert("email")); d.append("website", wert("website"));
      var knopf = f.querySelector('button[type="submit"]'); d.append("ort", (knopf && knopf.dataset.ort) || "");
      var ts = f.querySelector('[name="cf-turnstile-response"]'); if (ts) d.append("cf-turnstile-response", ts.value);
      sendet = true; melde("Wird gesendet …");
      function sende(versuch) {
        d.set("t", token);
        return fetch(ep, { method: "POST", body: d }).then(function (x) {
          if (x.ok) return x.json().then(function (j) { if (!j || j.ok !== true) throw 0; return j; });
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
        .then(function () { melde("Angekommen. Wir rufen Sie zurück" + (zeiten().length ? ", wenn möglich " + zeiten().join(", ") : "") + ". Anliegen: " + anliegen() + "."); f.querySelector('button[type="submit"]').disabled = true; })
        .catch(function () { if (window.turnstile) window.turnstile.reset(); melde("Das hat nicht geklappt. Bitte rufen Sie uns an: 071 755 88 61."); })
        .then(function () { sendet = false; });
    });
  });
})();
