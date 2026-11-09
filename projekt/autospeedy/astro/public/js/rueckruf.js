/* Rückruf-Formulare: an POST /api/rueckruf (direkt per Mail an den Betrieb, kein Cockpit). «Angekommen» nur, wenn der
   Server 200 mit ok:true antwortet; in der Vorschau ohne Endpunkt nur vorgeführt; ohne JavaScript per E-Mail-Programm
   (action). Keine Cookies, nichts gespeichert.
   Felder: anliegen, name, telefon, zeit (je angetipptes Feld), bemerkung, email (falls vorhanden), ort, website, t.
   Zeitfalle wie bei der Schadenmeldung: Token beim Laden holen (GET ?t=1), als «t» mitsenden; bei «zeit-schnell» kurz
   warten und nochmals senden, bei «zeit» (abgelaufen) neues Token holen und einmal nochmals senden.
   Rückmeldung wie bei der Schadenmeldung (QA N01, N02, C08): Pflichtfelder mit aria-invalid und Text am Feld
   (aria-describedby), der Feldfehler verschwindet, sobald die Eingabe gilt; Validierungs- und Sendefehler mit role=alert,
   Senden mit aria-busy (der Knopf bleibt fokussierbar), Erfolg mit Fokus auf der Rückmeldung (tabindex=-1).
   Erfolg und Fehler unterscheiden sich über Klassen (rueckmeldung--ok, rueckmeldung--fehler), nicht nur im Text. */
(function () {
  "use strict";
  var TEL_FEHLT = "Bitte geben Sie Ihre Telefonnummer an.", TEL_KURZ = "Bitte prüfen Sie die Telefonnummer. Sie braucht mindestens 9 Ziffern.";
  function telefonOk(t) { var z = (t.match(/[0-9]/g) || []).length; return /^[+0-9 ()./-]{6,40}$/.test(t) && z >= 9 && z <= 15; }
  [].forEach.call(document.querySelectorAll("[data-rueckruf]"), function (f) {
    f.noValidate = true;
    var r = f.querySelector("[data-rueckmeldung]"), sendet = false, token = "";
    var knopf = f.querySelector('button[type="submit"]');
    var TEL = "071 755 88 61";
    function holeToken() {
      var ep = f.dataset.endpunkt; if (!ep) return Promise.resolve();
      return fetch(ep + (ep.indexOf("?") > -1 ? "&" : "?") + "t=1").then(function (x) { return x.json(); })
        .then(function (j) { if (j && typeof j.t === "string") token = j.t; }, function () {});
    }
    holeToken();
    // art: "" (ruhig, role=status), "fehler" (role=alert), "ok" (role=status, Erfolg). mitTel: Telefonnummer als Link anhängen.
    function melde(t, art, mitTel) {
      r.hidden = !t; r.textContent = t || "";
      if (t && mitTel) { var a = document.createElement("a"); a.href = "tel:" + TEL.replace(/^0/, "+41").replace(/\s/g, ""); a.textContent = TEL; a.dataset.zaehl = "anruf"; a.dataset.ort = "rueckruf-fehler"; r.appendChild(a); r.appendChild(document.createTextNode(".")); }
      r.setAttribute("role", art === "fehler" ? "alert" : "status");
      r.classList.toggle("rueckmeldung--fehler", art === "fehler");
      r.classList.toggle("rueckmeldung--ok", art === "ok");
    }
    function wert(n) { var e = f.elements[n]; return e && e.value ? e.value.trim() : ""; }
    function anliegen() { var x = f.querySelector('input[name="anliegen"]:checked') || f.querySelector('input[name="anliegen"]'); return x ? x.value : "Allgemein"; }
    // Angetippte Zeiten aus dem Zeitwahl-Raster (Linie Klar); der Server nimmt nur Werte aus diesem Raster an
    function zeiten() { return [].map.call(f.querySelectorAll('input[name="zeit"]:checked'), function (e) { return e.value; }); }

    // Feldfehler wie in schaden.js: Text am Feld, aria-invalid, aria-describedby
    function feldFehler(input, text) {
      var feld = input.closest(".feld") || input.parentElement, id = input.id ? input.id + "-fehler" : "";
      var p = feld.querySelector(".feld-fehler");
      if (!p) { p = document.createElement("p"); p.className = "feld-fehler"; if (id) p.id = id; feld.appendChild(p); }
      p.textContent = text;
      input.setAttribute("aria-invalid", "true");
      if (id) input.setAttribute("aria-describedby", ((input.getAttribute("aria-describedby") || "").replace(id, "").trim() + " " + id).trim());
    }
    function feldOk(input) {
      if (!input || input.getAttribute("aria-invalid") !== "true") return;
      input.removeAttribute("aria-invalid");
      var feld = input.closest(".feld") || input.parentElement, p = feld && feld.querySelector(".feld-fehler"); if (p) p.remove();
      var id = input.id ? input.id + "-fehler" : "", d = input.getAttribute("aria-describedby");
      if (id && d) { d = d.replace(id, "").trim(); if (d) input.setAttribute("aria-describedby", d); else input.removeAttribute("aria-describedby"); }
    }
    // Ein Feld prüfen; gibt den Fehlertext zurück oder "" (gültig)
    function fehlerVon(n) {
      if (n === "name") return wert("name") ? "" : "Bitte geben Sie Ihren Namen an.";
      if (!wert("telefon")) return TEL_FEHLT;
      return telefonOk(wert("telefon")) ? "" : TEL_KURZ;
    }
    // C08: Während der Eingabe verschwindet der Feldfehler, sobald die Eingabe gilt; ohne offene Fehler auch der Sammelhinweis.
    ["name", "telefon"].forEach(function (n) {
      var e = f.elements[n]; if (!e) return;
      e.addEventListener("input", function () {
        if (e.getAttribute("aria-invalid") !== "true" || fehlerVon(n)) return;
        feldOk(e);
        if (!f.querySelector('[aria-invalid="true"]') && r.classList.contains("rueckmeldung--fehler")) melde("");
      });
    });
    function pruefe() {
      var erstes = null;
      ["name", "telefon"].forEach(function (n) {
        var e = f.elements[n], t = fehlerVon(n); if (!e) return;
        if (t) { feldFehler(e, t); if (!erstes) erstes = e; } else feldOk(e);
      });
      if (!erstes) return true;
      var nurTel = erstes === f.elements.telefon && wert("telefon");
      melde(nurTel ? TEL_KURZ : "Bitte ergänzen Sie die rot markierten Felder.", "fehler");
      erstes.focus();
      return false;
    }
    function besetzt(an) {
      if (!knopf) return;
      if (an) knopf.setAttribute("aria-busy", "true"); else knopf.removeAttribute("aria-busy"); // ein zweiter Klick wird über «sendet» abgefangen
    }
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sendet) return;
      if (!pruefe()) return;
      if (wert("website")) return;
      var ep = f.dataset.endpunkt;
      if (!ep) { melde(f.dataset.istVorschau === "ja" ? "Vorschau: Auf der fertigen Website käme Ihre Rückruf-Bitte jetzt bei Auto Speedy an. Hier wird nichts gesendet." : "Bitte rufen Sie uns an: ", f.dataset.istVorschau === "ja" ? "" : "fehler", f.dataset.istVorschau !== "ja"); return; }
      var d = new FormData();
      d.append("anliegen", anliegen()); d.append("name", wert("name")); d.append("telefon", wert("telefon"));
      zeiten().forEach(function (z) { d.append("zeit", z); });
      d.append("bemerkung", wert("bemerkung")); d.append("email", wert("email")); d.append("website", wert("website"));
      d.append("ort", (knopf && knopf.dataset.ort) || "");
      var ts = f.querySelector('[name="cf-turnstile-response"]'); if (ts) d.append("cf-turnstile-response", ts.value);
      // Senden: aria-busy, aber nicht disabled, damit der Fokus auf dem Knopf bleibt (QA K03/N01)
      sendet = true; besetzt(true); f.setAttribute("aria-busy", "true"); melde("Wird gesendet …");
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
        .then(function () {
          melde("Angekommen. Wir rufen Sie zurück" + (zeiten().length ? ", wenn möglich " + zeiten().join(", ") : "") + ". Anliegen: " + anliegen() + ".", "ok");
          // N01: zuerst den Fokus auf die Rückmeldung, dann erst den Knopf sperren (sonst fiele der Fokus auf den Seitenanfang)
          r.setAttribute("tabindex", "-1"); r.focus();
          besetzt(false); if (knopf) knopf.disabled = true;
        })
        .catch(function () { if (window.turnstile) window.turnstile.reset(); besetzt(false); melde("Das hat nicht geklappt. Bitte nochmals senden oder rufen Sie uns an: ", "fehler", true); })
        .then(function () { sendet = false; f.removeAttribute("aria-busy"); });
    });
  });
})();
