/* Editor /admin/ (BAUPLAN 4.1/4.7). Vanilla-JS, kein Inline-Skript, kein Fremdhost (CSP: script-src 'self').
   Lädt site.json über GET /api/admin/laden (hinter Cloudflare Access), bearbeitet Zeiten, Ferien, Team, Inhaber,
   Hinweise und den Bewertungen-Schalter und speichert über POST /api/admin/speichern. Teamfotos werden im Browser
   auf 800 px JPEG verkleinert und über POST /api/admin/foto gelegt. Bewegung nach 4.7 (ruhig, Reduced Motion statisch).
   Attrappe nur mit data-lokal (ADMIN_LOKAL=1 im Dev-Modus); im Build steht dieses Attribut nie. */
(function () {
  "use strict";
  var LOKAL = document.body.dataset.lokal === "1";

  var WOCHENTAGE = [["Monday", "Montag"], ["Tuesday", "Dienstag"], ["Wednesday", "Mittwoch"], ["Thursday", "Donnerstag"], ["Friday", "Freitag"], ["Saturday", "Samstag"], ["Sunday", "Sonntag"]];
  var LINKS = [
    { wert: "", text: "(kein Link)" },
    { wert: "/schaden-melden/", text: "Schaden melden" },
    { wert: "/schaden-melden/?art=hagel", text: "Schaden melden (Hagel)" },
    { wert: "/tesla/", text: "Tesla" },
    { wert: "/kontakt/", text: "Kontakt" },
    { wert: "/occasionen/", text: "Occasionen" },
    { wert: "/team/", text: "Team" },
  ];
  var ARTEN = [["hagel", "Hagel"], ["ferien", "Ferien"], ["geschlossen", "Geschlossen"], ["aktion", "Aktion"], ["info", "Info"]];
  var POPUP_ARTEN = { hagel: true, aktion: true };
  var SYMBOLE = {
    hagel: '<path d="M12 2.5c3.2 3.4 5.2 6.1 5.2 8.8a5.2 5.2 0 1 1-10.4 0C6.8 8.6 8.8 5.9 12 2.5Z"/><circle cx="12" cy="19.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="21" r="1.1" fill="currentColor" stroke="none"/><circle cx="16" cy="21" r="1.1" fill="currentColor" stroke="none"/>',
    ferien: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/>',
    geschlossen: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    aktion: '<path d="M12 3.2 14.5 8.6l5.9.7-4.4 4 1.2 5.8L12 16.3 6.8 19.1 8 13.3l-4.4-4 5.9-.7Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8h.01"/>',
  };
  var REITER_NAME = { zeiten: "Zeiten", ferien: "Ferien", team: "Team", inhaber: "Inhaber", hinweise: "Hinweise", bewertungen: "Bewertungen" };

  var DOMAIN = document.body.dataset.domain || "autospeedy.ch";
  var WA = document.body.dataset.wa || "";
  var BETRIEB = document.body.dataset.betrieb || "Auto Speedy";
  var MAIL_FORMAT = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  var daten = null, sha = null, aktiv = "zeiten";
  var meldungEl = document.querySelector("[data-meldung]");
  var toastEl = document.querySelector("[data-toast]");
  var mailEl = document.querySelector("[data-mail]");

  // ---------- kleine Helfer ----------
  function el(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    for (var i = 2; i < arguments.length; i++) { var c = arguments[i]; if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); }
    return e;
  }
  function feld(label, eingabe) { return el("div", { class: "admin-feld" }, el("label", { text: label }), eingabe); }
  function eingabe(typ, wert, bei) { var i = el("input", { type: typ, value: typ === "date" ? (wert || "") : null }); if (typ !== "date") i.value = wert || ""; else i.value = wert || ""; i.addEventListener("input", bei); return i; }
  function textfeld(wert, bei, max) { var t = el("textarea"); if (max) t.maxLength = max; t.value = wert || ""; t.addEventListener("input", bei); return t; }
  function schalter(label, an, bei) { var i = el("input", { type: "checkbox" }); i.checked = !!an; i.addEventListener("change", function () { bei(i.checked); }); return el("div", { class: "admin-schalter" }, i, el("label", { text: label })); }
  function knopf(text, klasse, bei) { var b = el("button", { type: "button", class: "admin-knopf" + (klasse ? " " + klasse : ""), text: text }); b.addEventListener("click", bei); return b; }
  function auswahl(optionen, wert, bei) { var s = el("select"); optionen.forEach(function (o) { var op = el("option", { value: o[0], text: o[1] }); if (o[0] === wert) op.selected = true; s.appendChild(op); }); s.addEventListener("change", function () { bei(s.value); }); return s; }

  function meldung(text, fehler) {
    if (!meldungEl) return;
    meldungEl.hidden = !text; meldungEl.textContent = text || "";
    meldungEl.classList.toggle("admin-meldung--fehler", !!fehler);
  }
  var toastTimer = null, toastAusTimer = null;
  function toast(text) {
    if (!toastEl) return;
    clearTimeout(toastTimer); clearTimeout(toastAusTimer);
    toastEl.classList.remove("ist-aus"); toastEl.hidden = false; toastEl.textContent = text;
    toastTimer = setTimeout(function () {
      toastEl.classList.add("ist-aus");
      toastAusTimer = setTimeout(function () { toastEl.hidden = true; toastEl.classList.remove("ist-aus"); }, 200);
    }, 2400);
  }

  // ---------- Laden ----------
  function neutralesModell() {
    return { _hinweis: "", zeiten: [], ausnahmen: [], team: [], stimme: { text: "", name: "", rolle: "", freigegeben: false }, hinweise: [], bewertungen: { zeigen: true } };
  }
  // Attrappe nur im Dev-Modus (data-lokal). Neutral, als «Beispiel» gekennzeichnet; keine echten Inhalte.
  function attrappe() {
    return {
      _hinweis: "Beispiel (Attrappe, nur lokal)", zeiten: [], ausnahmen: [], team: [{ name: "Beispiel", leute: [] }],
      stimme: { text: "", name: "", rolle: "", freigegeben: false },
      hinweise: [{ art: "info", form: "banner", titel: "Beispiel", text: "Beispiel-Hinweis (Attrappe).", link: "", von: "2026-01-01", bis: "2099-12-31" }],
      bewertungen: { zeigen: true },
    };
  }
  function normiere(roh) {
    var d = roh || neutralesModell();
    d.zeiten = d.zeiten || []; d.ausnahmen = d.ausnahmen || []; d.team = d.team || [];
    d.stimme = d.stimme || { text: "", name: "", rolle: "", freigegeben: false };
    d.bewertungen = d.bewertungen || { zeigen: true };
    if (!d.hinweise) {
      d.hinweise = [];
      if (d.hinweis && d.hinweis.aktiv && (d.hinweis.text || "").trim().length >= 3) {
        d.hinweise.push({ art: "info", form: "banner", titel: "", text: d.hinweis.text, link: d.hinweis.link || "", von: "1970-01-01", bis: "9999-12-31" });
      }
    }
    delete d.hinweis; // «hinweise» ist ab jetzt die Quelle; das Schema migriert sonst doppelt
    return d;
  }

  function laden() {
    if (LOKAL) { daten = normiere(attrappe()); sha = "lokal"; if (mailEl) { mailEl.hidden = false; mailEl.textContent = "Attrappe (lokal)"; } fertig(); return; }
    fetch("/api/admin/laden", { headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (res) {
        if (res.status === 200 && res.j && res.j.ok) { daten = normiere(res.j.site); sha = res.j.sha; meldung(""); }
        else if (res.status === 401) { daten = normiere(neutralesModell()); meldung("Nicht angemeldet. Bitte über den Zugang von Auto Speedy öffnen (Cloudflare Access). Speichern ist erst dann möglich.", true); }
        else { daten = normiere(neutralesModell()); meldung("Die Website-Datei konnte nicht geladen werden. Speichern ist erst nach erfolgreichem Laden möglich.", true); }
        fertig();
      })
      .catch(function () { daten = normiere(neutralesModell()); meldung("Keine Verbindung zum Server. Vorschau ohne Speichern.", true); fertig(); });
  }
  function fertig() { zeigeReiter(aktiv); }

  // ---------- Reiter ----------
  [].forEach.call(document.querySelectorAll("[data-reiter]"), function (b) {
    b.addEventListener("click", function () { zeigeReiter(b.getAttribute("data-reiter")); });
  });
  function zeigeReiter(id) {
    aktiv = id;
    [].forEach.call(document.querySelectorAll("[data-reiter]"), function (b) { b.setAttribute("aria-selected", b.getAttribute("data-reiter") === id ? "true" : "false"); });
    [].forEach.call(document.querySelectorAll("[data-panel]"), function (p) { p.hidden = p.getAttribute("data-panel") !== id; });
    var panel = document.querySelector('[data-panel="' + id + '"]');
    if (!panel) return;
    if (id === "bewerten") { panel.textContent = ""; baueBewerten(panel); return; } // braucht keine site.json
    if (!daten) return;
    panel.textContent = "";
    ({ zeiten: baueZeiten, ferien: baueFerien, team: baueTeam, inhaber: baueInhaber, hinweise: baueHinweise, bewertungen: baueBewertungen }[id] || function () {})(panel);
  }

  // ---------- Zeiten ----------
  function baueZeiten(panel) {
    daten.zeiten.forEach(function (z, i) {
      var karte = el("div", { class: "admin-karte" });
      karte.appendChild(el("div", { class: "admin-karte__kopf" }, el("h3", { text: z.tage || ("Zeile " + (i + 1)) }),
        knopf("Entfernen", "admin-knopf--entfernen", function () { daten.zeiten.splice(i, 1); zeigeReiter("zeiten"); })));
      karte.appendChild(feld("Tage, ausgeschrieben", eingabe("text", z.tage, function (e) { z.tage = e.target.value; })));
      karte.appendChild(feld("Tage, kurz", eingabe("text", z.kurz, function (e) { z.kurz = e.target.value; })));
      karte.appendChild(schalter("Geschlossen", z.geschlossen, function (an) { z.geschlossen = an; zeigeReiter("zeiten"); }));
      if (!z.geschlossen) {
        z.fenster = z.fenster || [];
        z.fenster.forEach(function (f, fi) {
          karte.appendChild(el("div", { class: "admin-zeile" },
            feld("von", eingabe("text", f.von, function (e) { f.von = e.target.value; })),
            feld("bis", eingabe("text", f.bis, function (e) { f.bis = e.target.value; }))));
        });
        if (z.fenster.length < 2) karte.appendChild(knopf("Zeitfenster hinzufügen", "admin-knopf--neu", function () { z.fenster.push({ von: "", bis: "" }); zeigeReiter("zeiten"); }));
      }
      panel.appendChild(karte);
    });
    panel.appendChild(knopf("Tageszeile hinzufügen", "admin-knopf--neu", function () { daten.zeiten.push({ tage: "", kurz: "", wochentage: ["Monday"], geschlossen: false, fenster: [{ von: "", bis: "" }] }); zeigeReiter("zeiten"); }));
  }

  // ---------- Ferien / Ausnahmen ----------
  function baueFerien(panel) {
    daten.ausnahmen.forEach(function (a, i) {
      var karte = el("div", { class: "admin-karte" });
      karte.appendChild(el("div", { class: "admin-karte__kopf" }, el("h3", { text: a.name || ("Eintrag " + (i + 1)) }),
        knopf("Entfernen", "admin-knopf--entfernen", function () { daten.ausnahmen.splice(i, 1); zeigeReiter("ferien"); })));
      karte.appendChild(feld("Bezeichnung", eingabe("text", a.name, function (e) { a.name = e.target.value; })));
      karte.appendChild(feld("Datum", eingabe("date", a.datum, function (e) { a.datum = e.target.value; })));
      karte.appendChild(schalter("Ganzer Tag geschlossen", a.geschlossen !== false, function (an) { a.geschlossen = an; zeigeReiter("ferien"); }));
      if (a.geschlossen === false) {
        karte.appendChild(el("div", { class: "admin-zeile" },
          feld("offen von", eingabe("text", a.von, function (e) { a.von = e.target.value; })),
          feld("offen bis", eingabe("text", a.bis, function (e) { a.bis = e.target.value; }))));
      }
      panel.appendChild(karte);
    });
    panel.appendChild(knopf("Ferien oder Feiertag hinzufügen", "admin-knopf--neu", function () { daten.ausnahmen.push({ name: "", datum: "", geschlossen: true }); zeigeReiter("ferien"); }));
  }

  // ---------- Team ----------
  function baueTeam(panel) {
    daten.team.forEach(function (g, gi) {
      var karte = el("div", { class: "admin-karte" });
      karte.appendChild(el("div", { class: "admin-karte__kopf" }, el("h3", { text: g.name || ("Gruppe " + (gi + 1)) }),
        knopf("Gruppe entfernen", "admin-knopf--entfernen", function () { daten.team.splice(gi, 1); zeigeReiter("team"); })));
      karte.appendChild(feld("Gruppe", eingabe("text", g.name, function (e) { g.name = e.target.value; })));
      g.leute = g.leute || [];
      g.leute.forEach(function (p, pi) {
        var person = el("div", { class: "admin-karte" });
        person.appendChild(el("div", { class: "admin-karte__kopf" }, el("h3", { text: p.name || ("Person " + (pi + 1)) }),
          knopf("Entfernen", "admin-knopf--entfernen", function () { g.leute.splice(pi, 1); zeigeReiter("team"); })));
        person.appendChild(feld("Name", eingabe("text", p.name, function (e) { p.name = e.target.value; })));
        person.appendChild(feld("Rolle", eingabe("text", p.rolle, function (e) { p.rolle = e.target.value; })));
        person.appendChild(feld("Mail (freiwillig)", eingabe("email", p.email, function (e) { p.email = e.target.value || undefined; })));
        person.appendChild(schalter("Auf der Website zeigen (nur mit Zustimmung)", p.einverstaendnis, function (an) { p.einverstaendnis = an; }));
        // Foto
        var bild = el("img", { alt: "" }); bild.src = p.foto || "/bilder/logo-96.webp";
        var datei = el("input", { type: "file", accept: "image/jpeg,image/png,image/webp" });
        datei.addEventListener("change", function () { if (datei.files && datei.files[0]) fotoWaehlen(p, datei.files[0], bild); });
        person.appendChild(feld("Foto (wird auf 800 px JPEG verkleinert)", el("div", { class: "admin-foto" }, bild, datei)));
        karte.appendChild(person);
      });
      karte.appendChild(knopf("Person hinzufügen", "admin-knopf--neu", function () { g.leute.push({ name: "", rolle: "", einverstaendnis: false }); zeigeReiter("team"); }));
      panel.appendChild(karte);
    });
    panel.appendChild(knopf("Gruppe hinzufügen", "admin-knopf--neu", function () { daten.team.push({ name: "", leute: [] }); zeigeReiter("team"); }));
  }

  // Teamfoto im Browser auf 800 px JPEG verkleinern (längste Seite), EXIF fällt beim Neuzeichnen weg.
  function verkleinere(datei) {
    return new Promise(function (aufl, ab) {
      var url = URL.createObjectURL(datei); var img = new Image();
      img.onload = function () {
        var k = Math.min(1, 800 / Math.max(img.width, img.height));
        var c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? aufl(b) : ab(new Error("kein Blob")); }, "image/jpeg", 0.85);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ab(new Error("kein Bild")); };
      img.src = url;
    });
  }
  function fotoWaehlen(person, datei, bild) {
    verkleinere(datei).then(function (blob) {
      bild.src = URL.createObjectURL(blob);
      if (LOKAL) { toast("Foto verkleinert (lokal, nicht gespeichert)."); return; }
      var fd = new FormData(); fd.append("name", person.name || "foto"); fd.append("foto", blob, "foto.jpg");
      fetch("/api/admin/foto", { method: "POST", body: fd }).then(function (r) { return r.json(); }).then(function (j) {
        if (j && j.ok) { person.foto = j.foto; toast("Foto hochgeladen. Es erscheint nach dem nächsten Neubau."); }
        else meldung("Foto konnte nicht gespeichert werden.", true);
      }).catch(function () { meldung("Foto konnte nicht gespeichert werden.", true); });
    }).catch(function () { meldung("Das Bild konnte nicht verkleinert werden.", true); });
  }

  // ---------- Inhaber (stimme) ----------
  function baueInhaber(panel) {
    var s = daten.stimme;
    panel.appendChild(feld("Satz vom Inhaber (höchstens 240 Zeichen)", textfeld(s.text, function (e) { s.text = e.target.value; }, 240)));
    panel.appendChild(feld("Name", eingabe("text", s.name, function (e) { s.name = e.target.value; })));
    panel.appendChild(feld("Rolle", eingabe("text", s.rolle, function (e) { s.rolle = e.target.value; })));
    panel.appendChild(schalter("Auf der Website zeigen (nur mit Zustimmung des Inhabers)", s.freigegeben, function (an) { s.freigegeben = an; }));
  }

  // ---------- Hinweise ----------
  function baueHinweise(panel) {
    daten.hinweise.forEach(function (h, i) {
      var karte = el("div", { class: "admin-karte" });
      karte.appendChild(el("div", { class: "admin-karte__kopf" }, el("h3", { text: "Hinweis " + (i + 1) }),
        knopf("Entfernen", "admin-knopf--entfernen", function () { daten.hinweise.splice(i, 1); zeigeReiter("hinweise"); })));
      karte.appendChild(el("div", { class: "admin-zeile" },
        feld("Art", auswahl(ARTEN, h.art, function (v) { h.art = v; if (!POPUP_ARTEN[v]) h.form = "banner"; zeigeReiter("hinweise"); })),
        feld("Form", auswahl(POPUP_ARTEN[h.art] ? [["banner", "Banner"], ["popup", "Pop-up"]] : [["banner", "Banner"]], h.form, function (v) { h.form = v; }))));
      karte.appendChild(feld("Titel (höchstens 50 Zeichen)", (function () { var i2 = eingabe("text", h.titel, function (e) { h.titel = e.target.value; vorschau(); }); i2.maxLength = 50; return i2; })()));
      karte.appendChild(feld("Text (höchstens 160 Zeichen)", textfeld(h.text, function (e) { h.text = e.target.value; vorschau(); }, 160)));
      karte.appendChild(feld("Führt zu (Link)", auswahl(LINKS.map(function (l) { return [l.wert, l.text]; }), h.link || "", function (v) { h.link = v; })));
      karte.appendChild(el("div", { class: "admin-zeile" },
        feld("Zeigen ab", eingabe("date", h.von, function (e) { h.von = e.target.value; })),
        feld("Zeigen bis", eingabe("date", h.bis, function (e) { h.bis = e.target.value; }))));
      // Vorschau im echten C-Stil
      var box = el("div", { class: "admin-vorschau" }, el("span", { class: "admin-vorschau__marke", text: "Vorschau" }));
      var vorlage = document.querySelector("[data-vorlage-hinweis]");
      var vp = vorlage.content.firstElementChild.cloneNode(true);
      box.appendChild(vp);
      karte.appendChild(box);
      function vorschau() {
        vp.className = "hinweis hinweis--" + h.art;
        vp.querySelector(".hinweis__symbol").innerHTML = SYMBOLE[h.art] || "";
        vp.querySelector("[data-vorschau-titel]").textContent = h.titel || "";
        vp.querySelector("[data-vorschau-text]").textContent = h.text || "";
      }
      vorschau();
      panel.appendChild(karte);
    });
    if (daten.hinweise.length < 3) panel.appendChild(knopf("Hinweis hinzufügen", "admin-knopf--neu", function () { daten.hinweise.push({ art: "info", form: "banner", titel: "", text: "", link: "", von: "", bis: "" }); zeigeReiter("hinweise"); }));
    else panel.appendChild(el("p", { class: "admin-platzhalter", text: "Höchstens 3 Hinweise." }));
  }

  // ---------- Bewertungen ----------
  function baueBewertungen(panel) {
    panel.appendChild(el("p", { class: "admin-platzhalter", text: "Zeigt Note, Anzahl und Link — keine einzelnen Bewertungstexte." }));
    panel.appendChild(schalter("Google-Bewertungen auf der Website zeigen", daten.bewertungen.zeigen, function (an) { daten.bewertungen.zeigen = an; }));
  }

  // ---------- Bewertung anfragen (BAUPLAN 4.5) ----------
  // Eine Mail pro Anfrage, keine Liste, keine Datenbank. Dieselbe Adresse in dieser Sitzung wird gewarnt;
  // gespeichert wird nur ein kurzer Hash in sessionStorage (keine Klartext-Adresse).
  function mailHash(mail) {
    var s = mail.toLowerCase().trim(), h = 5381; // djb2, nur als Merker in der Sitzung
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return "h" + h.toString(36);
  }
  function gesendeteHashes() { try { return JSON.parse(sessionStorage.getItem("bewertung-gesendet") || "[]"); } catch (e) { return []; } }
  function merkeHash(hash) { var a = gesendeteHashes(); if (a.indexOf(hash) < 0) a.push(hash); try { sessionStorage.setItem("bewertung-gesendet", JSON.stringify(a)); } catch (e) {} }

  function baueBewerten(panel) {
    var bestaetigt = false;
    panel.appendChild(el("p", { class: "admin-platzhalter", text: "Es geht eine einzige, neutrale Mail mit der Bitte um eine Bewertung raus. Es wird nichts gespeichert und keine Liste geführt." }));
    var mailE = eingabe("email", "", function () { bestaetigt = false; note(""); });
    var vornameE = eingabe("text", "", function () {});
    panel.appendChild(feld("Mailadresse", mailE));
    panel.appendChild(feld("Vorname (freiwillig)", vornameE));

    var hinweisE = el("p", { class: "admin-meldung", hidden: "hidden" });
    hinweisE.setAttribute("role", "status");
    panel.appendChild(hinweisE);
    function note(text, fehler) { hinweisE.hidden = !text; hinweisE.textContent = text || ""; hinweisE.classList.toggle("admin-meldung--fehler", !!fehler); }

    var sendenKnopf = knopf("Anfrage senden", "admin-knopf--neu", senden);
    var waKnopf = knopf("Per WhatsApp bitten", null, perWhatsapp);
    panel.appendChild(el("div", { class: "admin-zeile" }, sendenKnopf, waKnopf));

    // Download des QR-Codes (vom Build erzeugt) und Druckvorlage
    panel.appendChild(el("p", { class: "admin-platzhalter" },
      el("a", { href: "/bewerten/qr.svg", download: "autospeedy-bewerten-qr.svg", text: "QR-Code herunterladen (SVG)" }),
      " · ",
      el("a", { href: "/bewerten/druck/", target: "_blank", rel: "noopener", text: "Druckvorlage (A6) öffnen" })));

    function senden() {
      var mail = (mailE.value || "").trim();
      if (mail.length < 3 || mail.length > 254 || !MAIL_FORMAT.test(mail)) { note("Bitte eine gültige Mailadresse eintragen.", true); return; }
      var hash = mailHash(mail);
      if (!bestaetigt && gesendeteHashes().indexOf(hash) >= 0) { note("Diese Adresse wurde in dieser Sitzung schon angefragt. Zum erneuten Senden nochmals auf «Anfrage senden» klicken.", true); bestaetigt = true; return; }
      if (LOKAL) { merkeHash(hash); note(""); mailE.value = ""; vornameE.value = ""; bestaetigt = false; toast("Anfrage gesendet (lokal, keine echte Mail)."); return; }
      sendenKnopf.disabled = true;
      fetch("/api/admin/bewertung", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mail: mail, vorname: (vornameE.value || "").trim() || undefined }) })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
        .then(function (res) {
          if (res.status === 200 && res.j.ok) { merkeHash(hash); note(""); mailE.value = ""; vornameE.value = ""; bestaetigt = false; toast("Anfrage gesendet. Es ging genau eine Mail raus."); }
          else if (res.status === 401) note("Nicht angemeldet. Bitte über den Zugang von Auto Speedy öffnen.", true);
          else if (res.status === 422) note("Bitte eine gültige Mailadresse eintragen.", true);
          else if (res.status === 429) note("Heute wurden schon viele Anfragen gesendet. Bitte morgen erneut versuchen.", true);
          else note("Die Anfrage konnte nicht gesendet werden. Bitte später erneut versuchen.", true);
        })
        .catch(function () { note("Keine Verbindung zum Server.", true); })
        .then(function () { sendenKnopf.disabled = false; });
    }

    function perWhatsapp() {
      if (!WA) { note("Für den Betrieb ist keine WhatsApp-Nummer hinterlegt.", true); return; }
      var link = "https://" + DOMAIN + "/bewerten/?q=whatsapp";
      var text = "Guten Tag, vielen Dank für Ihren Auftrag bei " + BETRIEB + ". Über diesen Link können Sie uns bewerten: " + link;
      window.open("https://wa.me/" + encodeURIComponent(WA) + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    }
  }

  // ---------- Speichern ----------
  var speichernKnopf = document.querySelector("[data-speichern]");
  if (speichernKnopf) speichernKnopf.addEventListener("click", speichern);
  function speichern() {
    if (!daten) return;
    if (LOKAL) { toast("Gespeichert. Die Website ist in etwa 1 bis 2 Minuten aktuell."); return; }
    speichernKnopf.disabled = true;
    fetch("/api/admin/speichern", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ site: daten, sha: sha, bereich: REITER_NAME[aktiv] || "Website" }) })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (res) {
        if (res.status === 200 && res.j.ok) { meldung(""); toast("Gespeichert. Die Website ist in etwa 1 bis 2 Minuten aktuell."); laden(); }
        else if (res.status === 409) meldung("Die Datei wurde inzwischen an anderer Stelle geändert. Bitte neu laden.", true);
        else if (res.status === 401) meldung("Nicht angemeldet. Bitte über den Zugang von Auto Speedy öffnen.", true);
        else if (res.status === 422) meldung("Bitte Eingaben prüfen: " + ((res.j.stellen || []).join("; ") || "ungültig"), true);
        else meldung("Speichern fehlgeschlagen. Bitte später erneut versuchen.", true);
      })
      .catch(function () { meldung("Keine Verbindung zum Server.", true); })
      .then(function () { speichernKnopf.disabled = false; });
  }

  laden();
})();
