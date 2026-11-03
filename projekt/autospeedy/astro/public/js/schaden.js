/* Schadenmeldung «in drei Tipps». Schritte 1 bis 3, Fotos im Browser verkleinert (JPEG, längste Seite 1600 px),
   zwei Wege: A Website (POST an den Endpunkt; ohne Endpunkt in der Vorschau nur vorgeführt), B WhatsApp.
   «Angekommen» nur bei Antwort 200 des Servers. Keine Cookies, nichts im Speicher des Geräts.
   Ohne JavaScript bleibt ein normales Formular über mailto. */
(function () {
  "use strict";
  var f = document.getElementById("schaden-form"); if (!f) return;
  f.noValidate = true;
  [].forEach.call(document.querySelectorAll("[data-nur-js]"), function (e) { e.hidden = false; });
  var schritte = [].slice.call(f.querySelectorAll("[data-schritt]"));
  var anzeige = [].slice.call(f.querySelectorAll("[data-anzeige]"));
  var rueck = f.querySelector("[data-rueckmeldung]"), rapport = document.querySelector("[data-rapport]");
  var plan = f.querySelector(".plan--wahl");
  var kaestchen = [].slice.call(f.querySelectorAll('input[name="stelle"]'));
  var fotos = []; // { blob, url }
  var MAX = 6, aktuell = 1, sendet = false;

  function melde(t) { rueck.hidden = !t; rueck.textContent = t || ""; }
  var gezaehlt = {};
  function trichter(n) { if (!window.__zaehl) { if (document.readyState !== "complete") window.addEventListener("load", function () { trichter(n); }, { once: true }); return; } if (!gezaehlt[n]) { gezaehlt[n] = true; window.__zaehl("trichter-" + n, "schaden"); } }
  function zeige(n, fokus) {
    aktuell = n; trichter(n);
    schritte.forEach(function (s) { s.hidden = Number(s.dataset.schritt) !== n; });
    anzeige.forEach(function (a) { var i = Number(a.dataset.anzeige); a.classList.toggle("ist-jetzt", i === n); a.classList.toggle("ist-fertig", i < n); if (i === n) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current"); });
    melde("");
    if (n === 3) fasseZusammen();
    if (fokus !== false) { var l = schritte[n - 1].querySelector("legend"); l.setAttribute("tabindex", "-1"); l.focus({ preventScroll: true }); f.scrollIntoView({ block: "start" }); }
  }
  function art() { var r = f.querySelector('input[name="art"]:checked'); return r ? r.value : ""; }
  function gewaehlt() { return kaestchen.filter(function (k) { return k.checked; }).map(function (k) { return k.value; }); }
  function wert(n) { var e = f.elements[n]; return e && e.value ? e.value.trim() : ""; }
  function tesla() { var t = f.querySelector("[data-tesla]"); return !!(t && t.checked); }
  // Tesla: Modell zum Antippen, nur wenn «Es ist ein Tesla» gewählt ist (Empfang bleibt gleich, das Modell steht in Meldung und Mail)
  var modellFeld = f.querySelector("[data-tesla-modell]");
  function modell() { var r = tesla() && f.querySelector('input[name="tesla_modell"]:checked'); return r ? r.value : ""; }
  function teslaText() { return tesla() ? "Tesla" + (modell() && modell() !== "Anderes Modell" ? " " + modell() : "") : ""; }
  function zeigeModell() { if (modellFeld) modellFeld.hidden = !tesla(); }
  var teslaKasten = f.querySelector("[data-tesla]"); if (teslaKasten) teslaKasten.addEventListener("change", zeigeModell);
  function fasseZusammen() {
    var z = f.querySelector("[data-zusammen]"); if (!z) return;
    var teile = [art() || "Art fehlt"]; if (gewaehlt().length) teile.push(gewaehlt().join(", "));
    teile.push(fotos.length === 1 ? "1 Foto" : fotos.length + " Fotos");
    z.textContent = teile.join(" · ");
  }

  // Schritt 1: Art wählen führt weiter; Stellen im Plan und in den Kästchen gleich
  [].forEach.call(f.querySelectorAll('input[name="art"]'), function (r) {
    r.addEventListener("change", function () { setTimeout(function () { zeige(2); }, 180); });
  });
  function zeichne() { kaestchen.forEach(function (k) { var g = plan && plan.querySelector('[data-stelle="' + k.dataset.stelle + '"]'); if (g) g.classList.toggle("ist-gewaehlt", k.checked); }); }
  kaestchen.forEach(function (k) { k.addEventListener("change", zeichne); });
  if (plan) [].forEach.call(plan.querySelectorAll(".plan__stelle"), function (g) {
    g.addEventListener("click", function () { var k = f.querySelector('input[data-stelle="' + g.dataset.stelle + '"]'); if (k) { k.checked = !k.checked; zeichne(); } });
  });
  [].forEach.call(f.querySelectorAll("[data-weiter]"), function (k) {
    k.addEventListener("click", function () {
      var ziel = Number(k.dataset.weiter);
      if (ziel === 2 && !art()) { melde("Bitte wählen Sie, was passiert ist."); f.querySelector('input[name="art"]').focus(); return; }
      zeige(ziel);
    });
  });
  [].forEach.call(f.querySelectorAll("[data-zurueck]"), function (k) { k.addEventListener("click", function () { zeige(Number(k.dataset.zurueck)); }); });

  // Schritt 2: Fotos verkleinern und zeigen
  var eingabe = f.querySelector("[data-fotos]"), liste = f.querySelector("[data-fotoliste]"), fotoWeiter = f.querySelector("[data-fotoweiter]");
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
  function zeichneFotos() {
    liste.innerHTML = "";
    fotos.forEach(function (x, i) {
      var li = document.createElement("li"), im = document.createElement("img"), weg = document.createElement("button");
      im.src = x.url; im.alt = "Foto " + (i + 1) + " vom Schaden";
      weg.type = "button"; weg.className = "fotos__weg"; weg.textContent = "Entfernen"; weg.setAttribute("aria-label", "Foto " + (i + 1) + " entfernen");
      weg.addEventListener("click", function () { URL.revokeObjectURL(x.url); fotos.splice(i, 1); zeichneFotos(); });
      li.appendChild(im); li.appendChild(weg); liste.appendChild(li);
    });
    fotoWeiter.textContent = fotos.length ? "Weiter" : "Ohne Foto weiter";
  }
  eingabe.addEventListener("change", function () {
    var neu = [].slice.call(eingabe.files || []).slice(0, MAX - fotos.length);
    if ((eingabe.files || []).length > neu.length) melde("Höchstens " + MAX + " Fotos.");
    Promise.all(neu.map(function (d) { return verkleinere(d).then(function (b) { return { blob: b, url: URL.createObjectURL(b) }; }, function () { return null; }); }))
      .then(function (r) { r.forEach(function (x) { if (x) fotos.push(x); }); if (r.some(function (x) { return !x; })) melde("Ein Bild liess sich nicht lesen. Bitte als Foto (JPEG) wählen."); zeichneFotos(); eingabe.value = ""; });
  });

  // Vorwahl über die Adresse oder die Vorschau-Datei: ?art=hagel, ?fahrzeug=tesla, ?stelle=dach
  function anwenden(q) {
    if (q.get("fahrzeug") === "tesla") { var t = f.querySelector("[data-tesla]"); if (t) t.checked = true; }
    zeigeModell();
    kaestchen.forEach(function (k) { if (q.getAll("stelle").indexOf(k.dataset.stelle) > -1) k.checked = true; }); zeichne();
    var a = q.get("art") && f.querySelector('input[data-art="' + q.get("art") + '"]');
    if (a) { a.checked = true; zeige(2, false); requestAnimationFrame(function () { f.scrollIntoView({ block: "start" }); }); } else zeige(1, false);
    rapport.hidden = true; f.hidden = false;
  }
  window.__schaden = { anwenden: anwenden };
  anwenden(new URLSearchParams(location.search));

  // Senden
  function nachricht() {
    return "Schadenmeldung über autospeedy.ch\n\nWas ist passiert: " + art() + "\nTesla: " + (tesla() ? "ja" + (modell() ? ", " + modell() : "") : "nein") +
      "\nStellen: " + (gewaehlt().join(", ") || "nicht angegeben") + "\nBemerkung: " + (wert("bemerkung") || "keine") +
      "\nName: " + wert("name") + "\nTelefon: " + wert("telefon") + "\n";
  }
  function pruefe() {
    if (!art()) { zeige(1); melde("Bitte wählen Sie, was passiert ist."); return false; }
    var fehlt = ["name", "telefon"].filter(function (n) { return !wert(n); });
    if (fehlt.length) { melde("Bitte geben Sie " + (fehlt.length === 2 ? "Name und Telefon" : fehlt[0] === "name" ? "Ihren Namen" : "Ihre Telefonnummer") + " an."); f.elements[fehlt[0]].focus(); return false; }
    if (wert("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wert("email"))) { melde("Bitte prüfen Sie die Mail-Adresse oder lassen Sie das Feld leer."); f.elements.email.focus(); return false; }
    return !wert("website");
  }
  function bestaetige(titel, stand, link) {
    var d = new Intl.DateTimeFormat("de-CH", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date());
    rapport.querySelector("[data-r-titel]").textContent = titel;
    rapport.querySelector("[data-r-datum]").textContent = d + " Uhr";
    rapport.querySelector("[data-r-art]").textContent = art() + (tesla() ? " (" + teslaText() + ")" : "");
    var rs = rapport.querySelector("[data-r-stellen]"); rs.textContent = gewaehlt().join(", "); var rz = rs.closest("div") && rs.closest("div").parentElement === rapport.querySelector("dl") ? rs.closest("div") : null; if (rz) rz.hidden = !gewaehlt().length; else { rs.hidden = !gewaehlt().length; if (rs.previousElementSibling) rs.previousElementSibling.hidden = !gewaehlt().length; }
    rapport.querySelector("[data-r-text]").textContent = wert("bemerkung") || "keine";
    rapport.querySelector("[data-r-kontakt]").textContent = wert("name") + ", " + wert("telefon");
    rapport.querySelector("[data-r-stand]").textContent = stand;
    var bilder = rapport.querySelector("[data-r-fotos]"); bilder.innerHTML = "";
    fotos.forEach(function (x, i) { var im = document.createElement("img"); im.src = x.url; im.alt = "Foto " + (i + 1); bilder.appendChild(im); });
    bilder.hidden = !fotos.length;
    var n = rapport.querySelector("[data-r-nochmal]"); n.hidden = !link; if (link) n.href = link;
    f.hidden = true; rapport.hidden = false; rapport.focus({ preventScroll: true }); rapport.scrollIntoView({ block: "start" });
  }
  rapport.querySelector("[data-r-zurueck]").addEventListener("click", function () { rapport.hidden = true; f.hidden = false; zeige(3); });

  [].forEach.call(f.querySelectorAll("[data-senden]"), function (k) {
    k.addEventListener("click", function () {
      if (sendet || !pruefe()) return;
      var weg = k.dataset.senden, text = nachricht();
      if (weg === "whatsapp") {
        var wa = "https://wa.me/" + f.dataset.wa + "?text=" + encodeURIComponent(text);
        window.open(wa, "_blank", "noopener");
        bestaetige("Meldung für WhatsApp", "WhatsApp ist geöffnet. Gesendet ist die Nachricht erst, wenn Sie dort auf Senden tippen. Fotos hängen Sie in WhatsApp an.", wa);
        return;
      }
      var ep = f.dataset.endpunkt;
      if (!ep) {
        bestaetige("Schadenmeldung (Vorschau)", "Vorschau: Auf der fertigen Website käme die Meldung jetzt mit " + (fotos.length === 1 ? "1 Foto" : fotos.length + " Fotos") + " bei Auto Speedy an. In dieser Vorschau wird nichts gesendet.", null);
        return;
      }
      var daten = new FormData();
      daten.append("art", art()); daten.append("name", wert("name")); daten.append("telefon", wert("telefon"));
      daten.append("bemerkung", wert("bemerkung")); if (wert("email")) daten.append("email", wert("email")); daten.append("website", wert("website")); if (tesla()) daten.append("tesla", "ja"); if (modell()) daten.append("tesla_modell", modell());
      gewaehlt().forEach(function (s) { daten.append("stelle", s); });
      fotos.forEach(function (x, i) { daten.append("foto", x.blob, "schaden-" + (i + 1) + ".jpg"); });
      var ts = f.querySelector('[name="cf-turnstile-response"]'); if (ts) daten.append("cf-turnstile-response", ts.value); // Cloudflare Turnstile, falls eingebaut
      sendet = true; melde("Ihre Meldung wird gesendet …");
      fetch(ep, { method: "POST", body: daten })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function () { if (window.__zaehl) window.__zaehl("meldung-gesendet", "website"); melde(""); bestaetige("Schadenmeldung angekommen", "Angekommen bei Auto Speedy. Wir melden uns bei Ihnen.", null); })
        .catch(function () { if (window.turnstile) window.turnstile.reset(); melde("Das Senden hat nicht geklappt. Bitte senden Sie die Meldung per WhatsApp oder rufen Sie uns an: 071 755 88 61."); })
        .then(function () { sendet = false; });
    });
  });
  // Ohne Endpunkt und ausserhalb der Vorschau gibt es Weg A nicht
  if (!f.dataset.endpunkt && f.dataset.istVorschau !== "ja") { var a = f.querySelector('[data-senden="website"]'); if (a) a.hidden = true; }
  else if (!f.dataset.endpunkt) { var h = f.querySelector("[data-weg-a-hilfe]"); if (h) h.textContent = "Mit Ihren Fotos direkt an Auto Speedy (Vorschau: nichts wird gesendet)"; }
})();
