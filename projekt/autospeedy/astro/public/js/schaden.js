/* Schadenmeldung: Schadenplan schaltet die Kästchen, Prüfung der Pflichtfelder, Schadenrapport.
   Mit Endpunkt: POST, «angekommen» nur bei Antwort 200. Ohne Endpunkt: Rapport und Übergabe an das E-Mail-Programm.
   Keine Cookies, nichts im Speicher des Geräts. Ohne JavaScript schickt das Formular über mailto (action). */
(function () {
  "use strict";
  var f = document.getElementById("schaden-form"); if (!f) return;
  var plan = document.querySelector(".plan--wahl"), auto = document.querySelector("[data-nur-js]");
  var kaestchen = [].slice.call(f.querySelectorAll('input[name="Stelle"]'));
  var rueck = f.querySelector("[data-rueckmeldung]"), rapport = document.querySelector("[data-rapport]");
  if (auto) auto.hidden = false;
  f.noValidate = true; // ohne JavaScript prüft der Browser selbst

  function zeichne() {
    kaestchen.forEach(function (k) {
      var g = plan && plan.querySelector('[data-stelle="' + k.dataset.stelle + '"]');
      if (g) g.classList.toggle("ist-gewaehlt", k.checked);
    });
  }
  kaestchen.forEach(function (k) { k.addEventListener("change", zeichne); });
  if (plan) [].forEach.call(plan.querySelectorAll(".plan__stelle"), function (g) {
    g.addEventListener("click", function () {
      var k = f.querySelector('input[data-stelle="' + g.dataset.stelle + '"]'); if (!k) return;
      k.checked = !k.checked; zeichne();
    });
  });

  var q = new URLSearchParams(location.search);
  if (q.get("fahrzeug") === "tesla") { var t = f.querySelector('input[value="Tesla"]'); if (t) t.checked = true; }
  (q.getAll("stelle") || []).forEach(function (id) { var k = f.querySelector('input[data-stelle="' + id + '"]'); if (k) k.checked = true; });
  zeichne();

  function wert(n) { var e = f.elements[n]; return e ? (e.value || "").trim() : ""; }
  function gewaehlt() { return kaestchen.filter(function (k) { return k.checked; }).map(function (k) { return k.value; }); }
  function melde(text) { rueck.hidden = false; rueck.textContent = text; }

  function zeigeRapport(stand, mailLink) {
    var jetzt = new Date();
    var datum = new Intl.DateTimeFormat("de-CH", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(jetzt);
    rapport.querySelector("[data-r-datum]").textContent = datum + " Uhr";
    rapport.querySelector("[data-r-fahrzeug]").textContent = (f.querySelector('input[name="Fahrzeug"]:checked') || {}).value || "";
    rapport.querySelector("[data-r-stellen]").textContent = gewaehlt().join(", ") || "nicht angegeben";
    rapport.querySelector("[data-r-text]").textContent = wert("Beschreibung");
    rapport.querySelector("[data-r-kontakt]").textContent = wert("Name") + ", " + wert("Telefon");
    rapport.querySelector("[data-r-stand]").textContent = stand;
    var ziel = rapport.querySelector("[data-r-auto]"); ziel.innerHTML = "";
    if (plan) { var kopie = plan.cloneNode(true); kopie.removeAttribute("aria-label"); kopie.setAttribute("aria-hidden", "true"); ziel.appendChild(kopie); }
    var m = rapport.querySelector("[data-r-mail]");
    if (mailLink) { m.hidden = false; m.href = mailLink; } else { m.hidden = true; }
    f.hidden = true; rapport.hidden = false; rapport.focus({ preventScroll: true }); rapport.scrollIntoView({ block: "start" });
  }
  rapport.querySelector("[data-r-zurueck]").addEventListener("click", function () { rapport.hidden = true; f.hidden = false; rueck.hidden = true; f.querySelector("button[type=submit]").focus(); });

  var sendet = false;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sendet) return;
    if (!f.checkValidity()) {
      var erstes = f.querySelector(":invalid");
      melde("Bitte füllen Sie die Felder mit «(Pflicht)» aus. Es fehlt: " + (erstes.closest("fieldset") ? "Ihr Fahrzeug" : (f.querySelector('label[for="' + erstes.id + '"]') || {}).textContent || "ein Pflichtfeld") + ".");
      erstes.focus(); return;
    }
    if (wert("website")) return; // Spamschutz
    var text = "Schadenmeldung über autospeedy.ch\n\nFahrzeug: " + ((f.querySelector('input[name="Fahrzeug"]:checked') || {}).value || "") +
      "\nStellen: " + (gewaehlt().join(", ") || "nicht angegeben") + "\nWas ist passiert: " + wert("Beschreibung") +
      "\nName: " + wert("Name") + "\nTelefon: " + wert("Telefon") + "\n";
    var ep = f.dataset.endpunkt;
    if (!ep) {
      var mail = "mailto:" + f.dataset.mail + "?subject=" + encodeURIComponent("Schadenmeldung: " + (gewaehlt()[0] || "Fahrzeug")) + "&body=" + encodeURIComponent(text);
      zeigeRapport("Noch nicht gesendet. Tippen Sie auf «Im E-Mail-Programm öffnen» und dort auf Senden. Fotos vom Schaden hängen Sie dort an.", mail);
      return;
    }
    sendet = true; melde("Ihre Meldung wird gesendet …");
    fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      fahrzeug: (f.querySelector('input[name="Fahrzeug"]:checked') || {}).value, stellen: gewaehlt(),
      beschreibung: wert("Beschreibung"), name: wert("Name"), telefon: wert("Telefon"), website: wert("website") }) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function () { rueck.hidden = true; zeigeRapport("Angekommen bei Auto Speedy. Wir melden uns bei Ihnen.", null); })
      .catch(function () { melde("Das Senden hat nicht geklappt. Bitte rufen Sie uns an: 071 755 88 61."); })
      .then(function () { sendet = false; });
  });
})();
