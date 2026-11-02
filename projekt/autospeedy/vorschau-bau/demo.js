/* Demo-Bau Auto Speedy: rechts der Betrieb (Postfach, WhatsApp, Cockpit), links das Kundenhandy mit der Website.
   Bildet das echte System nach (cockpit/), aber alles bleibt im Speicher dieses Browsers. Nichts wird gesendet.
   Texte und Abläufe wie im echten Cockpit; Beispiel-Meldungen sind als «Beispiel» markiert. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function h(tag, attr, kinder) {
    var e = document.createElement(tag);
    Object.keys(attr || {}).forEach(function (k) {
      var v = attr[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "text") e.textContent = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    });
    [].concat(kinder || []).forEach(function (c) { if (c !== null && c !== undefined && c !== false) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }

  // ---------- Zustand (nur im Speicher)
  var MIN = 60e3, STD = 60 * MIN;
  var STATUS_NAME = { neu: "Neu", zurueckgerufen: "Zurückgerufen", offerte: "Offerte", auftrag: "Auftrag", erledigt: "Erledigt", verloren: "Verloren" };
  function naechste(s) {
    return { neu: ["zurueckgerufen", "verloren"], zurueckgerufen: ["offerte", "auftrag", "verloren", "neu"], offerte: ["auftrag", "verloren", "zurueckgerufen"], auftrag: ["erledigt", "offerte"], erledigt: ["auftrag"], verloren: ["neu"] }[s];
  }
  var t0 = Date.now();
  var S = {
    login: "aus", code: null,
    reiter: "postfach", seite: "liste", filter: "alle", offen: null,
    mails: [], gelesen: {}, wa: [], waGesehen: 0,
    meldungen: [
      { id: "b1", erstellt: t0 - 25 * MIN, art: "Parkschaden", tesla: false, stellen: ["Heck-Stossstange"], bemerkung: "BEISPIEL", name: "Beispiel Kunde A", telefon: "071 555 00 01", quelle: "website", status: "neu", notiz: "", fotos: [], beispiel: true },
      { id: "b2", erstellt: t0 - 26 * STD, art: "Unfall", tesla: false, stellen: ["Seite links vorne"], bemerkung: "BEISPIEL", name: "Beispiel Kundin B", telefon: "071 555 00 02", quelle: "website", status: "offerte", notiz: "Offerte an Versicherung (Beispiel)", fotos: [], beispiel: true, email: "kundin.b@beispiel.example" },
      { id: "b3", erstellt: t0 - 50 * STD, art: "Rückruf", tesla: false, stellen: [], bemerkung: "Anliegen: Lackschaden (BEISPIEL)", name: "Beispiel Kunde C", telefon: "071 555 00 03", quelle: "website", status: "auftrag", notiz: "", fotos: [], beispiel: true },
      { id: "b4", erstellt: t0 - 98 * STD, art: "Felge", tesla: false, stellen: ["Felgen"], bemerkung: "BEISPIEL", name: "Beispiel Kundin D", telefon: "071 555 00 04", quelle: "website", status: "verloren", notiz: "", fotos: [], beispiel: true },
      { id: "b5", erstellt: t0 - 120 * STD, art: "Hagel", tesla: true, stellen: ["Dach", "Motorhaube"], bemerkung: "BEISPIEL", name: "Beispiel Kunde E", telefon: "071 555 00 05", quelle: "website", status: "erledigt", notiz: "", fotos: [], beispiel: true },
    ],
    zaehl: { anruf: 9, whatsapp: 2, bewertung: 1 }, // Beispielwerte der letzten 30 Tage, dazu was in der Demo passiert
    pflege: {
      hinweis: { aktiv: false, text: "Hagel? Melden Sie den Schaden jetzt mit Fotos." },
      zeiten: [
        { tage: "Montag bis Donnerstag", kurz: "Mo bis Do", fenster: [["7.30", "12.00"], ["13.15", "17.30"]] },
        { tage: "Freitag", kurz: "Fr", fenster: [["7.30", "12.00"], ["13.15", "17.15"]] },
      ],
    },
    schritte: {},
    versatz: 0, ablauf: [],
    punkte: { "trichter-1": 5, "trichter-2": 3, "trichter-3": 2, gesendet: 2 }, // Beispielwerte, dazu was in der Demo passiert
  };
  function jetzt() { return Date.now() + S.versatz; }
  function protokoll(wer, text) { S.ablauf.push({ zeit: jetzt(), wer: wer, text: text }); }
  var RUNDGANG = [
    { id: "melden", text: "Links einen Schaden melden, mit Mail" },
    { id: "mail", text: "Rechts die Mail öffnen" },
    { id: "login", text: "Im Cockpit anmelden" },
    { id: "auftrag", text: "Meldung auf «Auftrag» setzen" },
    { id: "erledigt", text: "In der Mail «erledigt» tippen" },
    { id: "vorspulen", text: "24 Stunden vorspulen" },
    { id: "pflege", text: "Website ändern" },
    { id: "zahlen", text: "Zahlen ansehen" },
  ];
  function geschafft(id) { if (!S.schritte[id]) { S.schritte[id] = true; rundgang(); } }

  // ---------- Hilfen
  function wann(t) {
    var d = jetzt() - t;
    if (d < MIN) return "gerade eben";
    if (d < STD) return "vor " + Math.round(d / MIN) + " Min.";
    if (d < 24 * STD) return "vor " + Math.round(d / STD) + " Std.";
    return new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(t));
  }
  function toast(t) {
    var el = $("#d-toast"); el.textContent = t; el.classList.add("an");
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("an"); }, 3200);
  }
  var website = $("#d-website");
  function anWebsite(m) { m.quelle = "as-rahmen"; website.contentWindow.postMessage(m, "*"); }
  function zeile(z) { return z.fenster.map(function (f) { return f[0] + " bis " + f[1]; }).join(" und "); }
  function zeitenKurz(p) { return p.zeiten.map(function (z) { return z.kurz + " " + zeile(z) + " Uhr"; }).join(", "); }

  // ---------- Nachrichten von der Website (Kundenhandy)
  window.addEventListener("message", function (e) {
    var m = e.data || {};
    if (m.quelle !== "as-website") return;
    if (m.typ === "meldung" || m.typ === "rueckruf") {
      var neu = {
        id: "d" + Date.now().toString(36), erstellt: jetzt(), email: m.email || null, art: m.typ === "rueckruf" ? "Rückruf" : m.art, tesla: !!m.tesla, stellen: m.stellen || [],
        bemerkung: m.typ === "rueckruf" ? "Anliegen: " + m.anliegen : (m.bemerkung || ""), name: m.name, telefon: m.telefon, quelle: "website", status: "neu", notiz: "",
        fotos: (m.fotos || []).map(function (b) { return URL.createObjectURL(b); }), aus_demo: true,
      };
      S.meldungen.unshift(neu);
      S.mails.unshift({ id: "m" + neu.id, zeit: jetzt(), von: "Website autospeedy.ch", betreff: (m.typ === "rueckruf" ? "Neue Rückruf-Bitte" : "Neue Schadenmeldung: " + neu.art + (neu.tesla ? " (Tesla)" : "")),
        text: (m.typ === "rueckruf" ? "Jemand bittet um Rückruf.\nAnliegen: " + m.anliegen : "Eine neue Schadenmeldung ist eingegangen.\n\nWas: " + neu.art + (neu.tesla ? " (Tesla)" : "") + "\nFotos: " + neu.fotos.length + "\nStellen am Auto: " + (neu.stellen.join(", ") || "nicht angegeben") + "\nMail vom Kunden: " + (neu.email ? "angegeben" : "keine")) +
          "\n\nName, Telefon und Fotos stehen aus Datenschutzgründen nicht in dieser Mail, nur im Cockpit.", ziel: neu.id });
      protokoll("Kunde", (m.typ === "rueckruf" ? "bittet auf der Website um Rückruf." : "sendet die Schadenmeldung auf der Website (" + neu.art + ", " + (neu.fotos.length === 1 ? "1 Foto" : neu.fotos.length + " Fotos") + ")."));
      protokoll("Website", "prüft die Angaben und speichert sie in der Datenbank in Zürich. Ab jetzt im Cockpit.");
      protokoll("Mailversand", "schickt den Hinweis an info@autospeedy.ch, ohne Name und Telefon.");
      if (neu.email) {
        protokoll("Mailversand", "schickt dem Kunden eine Bestätigung an " + neu.email + ".");
        setTimeout(function () { anWebsite({ typ: "kundenmail", betreff: "Ihre Schadenmeldung bei Auto Speedy", text: "Guten Tag " + (neu.name.split(/\s+/)[0] || "") + "\n\nIhre Schadenmeldung (" + neu.art + ") ist bei Auto Speedy angekommen. Wir melden uns bei Ihnen, in der Regel telefonisch.\n\nFreundliche Grüsse\nAuto Speedy AG" }); }, 1400);
      }
      if (m.typ === "meldung") { S.punkte.gesendet++; }
      klingel("ablauf");
      geschafft("melden");
      klingel("postfach");
      zeichne();
    }
    if (m.typ === "whatsapp") {
      S.wa.push({ zeit: jetzt(), von: "kunde", text: m.text, fotos: (m.fotos || []).map(function (b) { return URL.createObjectURL(b); }) });
      protokoll("Kunde", "schickt die Meldung per WhatsApp. Sie kommt auf dem Geschäftshandy an, nicht ins Cockpit.");
      S.punkte.gesendet++;
      geschafft("melden");
      klingel("whatsapp");
      zeichne();
    }
    if (m.typ === "zaehl") {
      if (/^trichter-\d$/.test(m.punkt)) { S.punkte[m.punkt] = (S.punkte[m.punkt] || 0) + 1; }
      var p = m.punkt === "anruf" ? "anruf" : /whatsapp/.test(m.punkt) ? "whatsapp" : m.punkt === "bewertung-geoeffnet" ? "bewertung" : null;
      if (p) { S.zaehl[p] = (S.zaehl[p] || 0) + 1; if (S.reiter === "cockpit" && S.seite === "zahlen") zeichne(); }
    }
  });
  function klingel(reiter) {
    var k = $('[data-reiter="' + reiter + '"]');
    if (k) { k.classList.remove("klingelt"); void k.offsetWidth; k.classList.add("klingelt"); }
  }

  // ---------- Reiter rechts
  function reiter() {
    var ungelesen = S.mails.filter(function (m) { return !S.gelesen[m.id]; }).length;
    var waNeu = S.wa.filter(function (x) { return x.von === "kunde"; }).length - S.waGesehen;
    [].forEach.call(document.querySelectorAll("[data-reiter]"), function (b) {
      var r = b.getAttribute("data-reiter");
      b.setAttribute("aria-selected", r === S.reiter ? "true" : "false");
      var z = b.querySelector(".d-zahl");
      if (r === "ablauf" && S.reiter === "ablauf") S.ablaufGesehen = S.ablauf.length;
      var n = r === "postfach" ? ungelesen : r === "whatsapp" ? Math.max(0, waNeu) : r === "ablauf" ? S.ablauf.length - (S.ablaufGesehen || 0) : 0;
      z.textContent = n ? String(n) : ""; z.hidden = !n;
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-reiter]");
    if (b) { S.reiter = b.getAttribute("data-reiter"); zeichne(); }
  });

  // ---------- Postfach
  function postfach() {
    var offen = S.mails.filter(function (m) { return m.id === S.offeneMail; })[0];
    var liste = h("ul", { class: "d-mails", "aria-label": "Mails" }, S.mails.length ? S.mails.map(function (m) {
      return h("li", {}, [h("button", { type: "button", class: "d-mail" + (S.gelesen[m.id] ? "" : " ungelesen") + (offen === m ? " offen" : ""), onclick: function () { S.offeneMail = m.id; S.gelesen[m.id] = true; if (m.ziel) geschafft("mail"); zeichne(); } }, [
        h("span", { class: "d-mail__von", text: m.von }), h("span", { class: "d-mail__betreff", text: m.betreff }), h("span", { class: "d-mail__zeit", text: wann(m.zeit) }),
      ])]);
    }) : [h("li", { class: "d-leer", text: "Noch keine Mail. Melden Sie links als Kunde einen Schaden." })]);
    var lesen = offen ? h("article", { class: "d-lesen" }, [
      h("p", { class: "unterzeile", text: "Von: " + offen.von + " · An: info@autospeedy.ch · " + wann(offen.zeit) }),
      h("h2", { text: offen.betreff }),
      h("pre", { text: offen.text }),
      offen.ziel ? h("button", { type: "button", class: "knopf", onclick: function () { S.reiter = "cockpit"; S.nachLogin = offen.ziel; if (S.login === "an") { S.seite = "detail"; S.offen = offen.ziel; } zeichne(); } }, "Im Cockpit öffnen") : null,
      offen.code ? h("p", { class: "d-code", text: offen.code }) : null,
      offen.auftrag ? auftragKasten(offen) : null,
    ]) : h("article", { class: "d-lesen d-lesen--leer" }, [h("p", { class: "unterzeile", text: "Mail links antippen zum Lesen." })]);
    return h("div", { class: "d-postfach" }, [h("div", { class: "d-postfach__kopf" }, [h("b", { text: "Postfach info@autospeedy.ch" }), h("span", { class: "unterzeile", text: "Ihr bestehendes Mailprogramm" })]), h("div", { class: "d-postfach__inhalt" }, [liste, lesen])]);
  }

  function auftragKasten(mail) {
    var m = S.meldungen.filter(function (x) { return x.id === mail.auftrag; })[0];
    if (mail.erledigt) return h("div", { class: "d-seite" }, [h("p", { class: "ok-text", text: "Erledigt gemeldet. " + (m && m.email ? "Der Kunde bekommt in 24 Stunden einmal die Bitte um eine Bewertung." : "Der Kunde hat keine Mail angegeben: Bewertung im Cockpit per WhatsApp erbitten.") })]);
    if (!m || m.status !== "auftrag") return h("div", { class: "d-seite" }, [h("p", { class: "unterzeile", text: "Link nicht mehr gültig: Der Auftrag ist schon erledigt oder nicht mehr «Auftrag»." })]);
    return h("div", { class: "d-seite" }, [
      h("p", { class: "d-seite__adresse", text: "Tipp auf den Link öffnet: cockpit.autospeedy.ch/auftrag/…" }),
      h("b", { text: "Auftrag erledigt?" }), h("p", { text: m.art + (m.tesla ? " (Tesla)" : "") + " · eingegangen " + wann(m.erstellt) }),
      h("button", { type: "button", class: "knopf gross", onclick: function () {
        if (m.status !== "auftrag") return;
        mail.erledigt = true;
        protokoll("Klick in der Mail", "Auftrag «" + m.art + "» als erledigt gemeldet, ohne Anmelden. Der Link gilt nur einmal.");
        statusSetzen(m, "erledigt");
        geschafft("erledigt"); zeichne();
      } }, "Ja, Auftrag ist erledigt"),
    ]);
  }

  // ---------- Ablauf: was im Hintergrund passiert ist
  function ablauf() {
    var heute = new Date(jetzt()).toDateString();
    return h("div", { class: "d-ablauf" }, [
      h("div", { class: "d-postfach__kopf" }, [h("b", { text: "Ablauf" }), h("span", { class: "unterzeile", text: "Was im Hintergrund passiert, in der Reihenfolge. Im Echten sieht das niemand, es läuft einfach." })]),
      S.ablauf.length ? h("ol", { class: "d-ablauf__liste" }, S.ablauf.map(function (e, i) {
        var d = new Date(e.zeit);
        return h("li", { class: i === S.ablauf.length - 1 ? "neu" : "" }, [
          h("span", { class: "d-ablauf__zeit", text: (d.toDateString() === heute ? "" : new Intl.DateTimeFormat("de-CH", { weekday: "short" }).format(d) + " ") + new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit" }).format(d) }),
          h("span", { class: "d-ablauf__wer", "data-wer": e.wer, text: e.wer }), h("span", { text: e.text }),
        ]);
      })) : h("p", { class: "d-leer", text: "Noch nichts passiert. Melden Sie links als Kunde einen Schaden." }),
    ]);
  }

  // ---------- WhatsApp (Geschäftshandy)
  function whatsapp() {
    S.waGesehen = S.wa.filter(function (x) { return x.von === "kunde"; }).length;
    return h("div", { class: "d-wa" }, [
      h("div", { class: "d-wa__kopf" }, [h("b", { text: "WhatsApp auf dem Geschäftshandy" }), h("span", { text: "Nummer noch zu bestätigen" })]),
      h("div", { class: "d-wa__verlauf" }, S.wa.length ? S.wa.map(function (x) {
        return h("div", { class: "d-wa__blase " + (x.von === "kunde" ? "kunde" : "betrieb") }, [
          x.fotos && x.fotos.length ? h("div", { class: "d-wa__fotos" }, x.fotos.map(function (u) { return h("img", { src: u, alt: "Foto vom Schaden" }); })) : null,
          h("p", { text: x.text }), h("span", { class: "d-wa__zeit", text: wann(x.zeit) }),
        ]);
      }) : [h("p", { class: "d-leer", text: "Noch keine Nachricht. Links in der Schadenmeldung «Per WhatsApp senden» wählen." })]),
      h("p", { class: "d-wa__fuss", text: "WhatsApp-Meldungen kommen wie heute auf Ihr Handy, nicht ins Cockpit. Fotos sehen Sie direkt im Chat." }),
    ]);
  }

  // ---------- Cockpit
  function kopf(aktiv) {
    function link(id, t) { return h("button", { type: "button", "aria-current": aktiv === id ? "page" : null, onclick: function () { S.seite = id; S.offen = null; if (id === "zahlen") geschafft("zahlen"); zeichne(); } }, t); }
    return h("header", { class: "kopf" }, [
      h("img", { src: LOGO, width: "95", height: "34", alt: "Auto Speedy AG" }), h("span", { class: "titel", text: "Cockpit" }),
      h("nav", { class: "kopf-nav", "aria-label": "Bereiche" }, [link("liste", "Meldungen"), link("zahlen", "Zahlen"), link("pflege", "Website")]),
      h("span", { class: "unterzeile", text: "info@autospeedy.ch" }),
      h("button", { type: "button", class: "knopf leise", onclick: function () { S.login = "aus"; S.seite = "liste"; zeichne(); } }, "Abmelden"),
    ]);
  }
  function anmelden() {
    var inhalt;
    if (S.login === "aus") {
      inhalt = [h("h1", { text: "Werkstatt-Cockpit" }), h("p", { class: "unterzeile", text: "Code per Mail, dann Fingerabdruck oder Gesicht. Danach bleiben Sie auf diesem Gerät 30 Tage angemeldet." }),
        h("form", { class: "karte formular", onsubmit: function (e) {
          e.preventDefault();
          S.code = String(100000 + Math.floor(Math.random() * 900000));
          S.mails.unshift({ id: "c" + Date.now(), zeit: Date.now(), von: "Auto Speedy Cockpit", betreff: "Ihr Anmelde-Code", text: "Ihr Code: " + S.code + "\nGültig 10 Minuten. Haben Sie keinen Code angefordert, ignorieren Sie diese Mail.", code: S.code });
          S.login = "code"; klingel("postfach"); zeichne();
        } }, [h("label", { for: "d-email", text: "Mail-Adresse" }), h("input", { id: "d-email", type: "email", value: "info@autospeedy.ch", autocomplete: "email" }), h("button", { type: "submit", class: "knopf" }, "Code per Mail senden")])];
    } else if (S.login === "code") {
      var fehler = h("p", { class: "meldung-text", role: "alert", hidden: true });
      inhalt = [h("h1", { text: "Code eingeben" }), h("p", { class: "unterzeile" }, ["Der Code ist im ", h("button", { type: "button", class: "d-textknopf", onclick: function () { S.reiter = "postfach"; S.offeneMail = S.mails[0] && S.mails[0].id; if (S.offeneMail) S.gelesen[S.offeneMail] = true; zeichne(); } }, "Postfach"), " angekommen."]),
        h("form", { class: "karte formular", onsubmit: function (e) {
          e.preventDefault();
          var c = $("#d-code").value.replace(/\s/g, "");
          if (c !== S.code) { fehler.hidden = false; fehler.textContent = "Der Code stimmt nicht. Bitte den Code aus der Mail eingeben."; return; }
          S.login = "finger"; zeichne();
        } }, [h("label", { for: "d-code", text: "6-stelliger Code" }), h("input", { id: "d-code", type: "text", inputmode: "numeric", maxlength: "6", class: "code", autocomplete: "one-time-code" }), fehler, h("button", { type: "submit", class: "knopf" }, "Weiter")])];
    } else {
      inhalt = [h("h1", { text: "Noch ein Tipp" }), h("p", { class: "unterzeile", text: "Bestätigen Sie mit Fingerabdruck oder Gesicht, wie beim Entsperren des Handys." }),
        h("div", { class: "karte formular" }, [h("button", { type: "button", class: "knopf gross", onclick: finger }, [FINGER(), "Mit Fingerabdruck bestätigen"]), h("p", { class: "unterzeile", text: "Demo: Hier nur ein Knopf. Im Echten fragt Ihr Handy oder Laptop nach Finger oder Gesicht; der Fingerabdruck verlässt das Gerät nie." })])];
    }
    return h("main", { class: "seite schmal anmelden" }, [h("img", { src: LOGO, width: "135", height: "48", alt: "Auto Speedy AG" })].concat(inhalt));
  }
  function finger() {
    var o = $("#d-finger"); o.hidden = false; o.classList.remove("fertig");
    setTimeout(function () { o.classList.add("fertig"); }, 900);
    setTimeout(function () {
      o.hidden = true; S.login = "an"; geschafft("login");
      if (S.nachLogin) { S.seite = "detail"; S.offen = S.nachLogin; S.nachLogin = null; } else S.seite = "liste";
      zeichne();
    }, 1500);
  }
  function kennzahlen() {
    var m = S.meldungen;
    var auftraege = m.filter(function (x) { return x.status === "auftrag" || x.status === "erledigt"; }).length;
    var entschieden = auftraege + m.filter(function (x) { return x.status === "verloren"; }).length;
    return { gesamt: m.length, neu: m.filter(function (x) { return x.status === "neu"; }).length, offen: m.filter(function (x) { return x.status === "zurueckgerufen" || x.status === "offerte"; }).length,
      auftraege: auftraege, quote: entschieden ? Math.round(auftraege / entschieden * 100) : null, alt: m.filter(function (x) { return x.status === "neu" && Date.now() - x.erstellt > 2 * STD; }).length };
  }
  function liste() {
    var k = kennzahlen();
    var filter = ["alle", "neu", "zurueckgerufen", "offerte", "auftrag", "erledigt", "verloren"];
    var sichtbar = S.meldungen.filter(function (x) { return S.filter === "alle" || x.status === S.filter; });
    return h("main", { class: "seite" }, [
      h("h1", { text: "Schadenmeldungen" }),
      h("div", { class: "kennzahlen" }, [
        h("div", { class: "kennzahl" }, [h("b", { text: String(k.neu) }), h("span", { text: "neu, noch nicht zurückgerufen" })]),
        h("div", { class: "kennzahl" }, [h("b", { text: String(k.offen) }), h("span", { text: "in Arbeit (zurückgerufen, Offerte)" })]),
        h("div", { class: "kennzahl" }, [h("b", { text: String(k.auftraege) }), h("span", { text: "wurden zum Auftrag" })]),
        h("div", { class: "kennzahl" }, [h("b", { text: k.quote === null ? "–" : k.quote + " %" }), h("span", { text: "Abschlussquote" })]),
      ]),
      h("nav", { class: "reiter", "aria-label": "Filter" }, filter.map(function (f) {
        var n = f === "alle" ? S.meldungen.length : S.meldungen.filter(function (x) { return x.status === f; }).length;
        return h("button", { type: "button", "aria-current": S.filter === f ? "page" : null, onclick: function () { S.filter = f; zeichne(); } }, (f === "alle" ? "Alle" : STATUS_NAME[f]) + " (" + n + ")");
      })),
      h("ul", { class: "liste" }, sichtbar.map(function (x) {
        return h("li", {}, [h("button", { type: "button", class: "zeile st-" + x.status + (x.aus_demo ? " d-neu" : ""), onclick: function () { S.seite = "detail"; S.offen = x.id; zeichne(); } }, [
          h("span", {}, [h("span", { class: "art", text: x.art + " " }), x.tesla ? h("span", { class: "pille tesla", text: "Tesla" }) : null, " ", x.beispiel ? h("span", { class: "pille beispiel", text: "Beispiel" }) : null,
            h("span", { class: "meta", text: " " + x.name + " · " + wann(x.erstellt) + " · " + (x.fotos.length === 1 ? "1 Foto" : x.fotos.length + " Fotos") })]),
          h("span", { class: "pille st-" + x.status, text: STATUS_NAME[x.status] }),
        ])]);
      })),
    ]);
  }
  function detail() {
    var m = S.meldungen.filter(function (x) { return x.id === S.offen; })[0];
    if (!m) { S.seite = "liste"; return liste(); }
    var notiz = h("textarea", { id: "d-notiz", rows: "3", maxlength: "2000" }); notiz.value = m.notiz;
    return h("main", { class: "seite" }, [
      h("p", {}, [h("button", { type: "button", class: "d-textknopf", onclick: function () { S.seite = "liste"; S.offen = null; zeichne(); } }, "← Alle Meldungen")]),
      h("h1", {}, [m.art + " ", m.tesla ? h("span", { class: "pille tesla", text: "Tesla" }) : null, " ", m.beispiel ? h("span", { class: "pille beispiel", text: "Beispiel" }) : null]),
      h("p", { class: "unterzeile" }, ["Eingegangen " + wann(m.erstellt) + " über die Website · Status: ", h("span", { class: "pille st-" + m.status, text: STATUS_NAME[m.status] })]),
      h("div", { class: "detail" }, [
        h("section", { class: "karte" }, [
          h("h2", { text: "Kunde und Schaden" }),
          h("dl", {}, [h("dt", { text: "Name" }), h("dd", { text: m.name }), h("dt", { text: "Telefon" }), h("dd", { text: m.telefon }), h("dt", { text: "Mail" }), h("dd", { text: m.email || "nicht angegeben" }), h("dt", { text: "Stellen am Auto" }), h("dd", { text: m.stellen.join(", ") || "nicht angegeben" }), h("dt", { text: "Bemerkung" }), h("dd", { text: m.bemerkung || "keine" })]),
          h("div", { class: "aktionen" }, [
            h("button", { type: "button", class: "knopf", onclick: function () { toast("Demo: Ihr Handy würde jetzt " + m.telefon + " anrufen."); } }, "Anrufen"),
            h("button", { type: "button", class: "knopf gruen", onclick: function () { toast("Demo: WhatsApp würde sich öffnen mit «Guten Tag " + m.name + ", hier ist Auto Speedy wegen Ihrer Schadenmeldung (" + m.art + ").»"); } }, "WhatsApp"),
            m.status === "erledigt" && !m.email ? h("button", { type: "button", class: "knopf leise d-bewertung", onclick: function () { bewertung(m); } }, "Bewertung per WhatsApp erbitten") : null,
          ]),
          h("h2", { class: "abstand-oben", text: "Fotos (" + m.fotos.length + ")" }),
          m.fotos.length ? h("div", { class: "fotos" }, m.fotos.map(function (u, i) { return h("img", { src: u, alt: "Foto " + (i + 1) + " vom Schaden" }); })) : h("p", { class: "unterzeile", text: "Keine Fotos geschickt." }),
        ]),
        h("section", { class: "karte lack" }, [
          h("h2", { text: "Nächster Schritt" }),
          h("div", { class: "aktionen" }, naechste(m.status).map(function (n) {
            return h("button", { type: "button", class: n === "verloren" || n === "neu" ? "knopf leise" : "knopf", onclick: function () { statusSetzen(m, n); zeichne(); } }, n === "neu" ? "Zurück auf Neu" : "→ " + STATUS_NAME[n]);
          })),
          h("p", { class: "hinweis abstand-oben", text: m.bewertungGesendet ? "Bitte um Bewertung per Mail gesendet." : m.bewertungFaellig ? "Bitte um Bewertung per Mail geplant: " + datum(m.bewertungFaellig) + "." : m.email ? "Bei «Erledigt» geht 24 Stunden später einmal die Bitte um Bewertung per Mail an den Kunden." : "Keine Mail vom Kunden: Bei «Erledigt» die Bewertung per WhatsApp erbitten." }),
          h("div", { class: "formular abstand-oben" }, [h("label", { for: "d-notiz", text: "Notiz (nur intern)" }), notiz, h("button", { type: "button", class: "knopf leise", onclick: function () { m.notiz = notiz.value; toast("Notiz gespeichert."); } }, "Notiz speichern")]),
        ]),
      ]),
    ]);
  }
  function planen(m, vorher) {
    if (m.status === "erledigt" && vorher !== "erledigt") {
      if (m.email && !m.bewertungGesendet) { m.bewertungFaellig = jetzt() + 24 * STD; protokoll("Datenbank", "plant die Bitte um Bewertung an " + m.email + " für " + datum(m.bewertungFaellig) + "."); }
      else if (!m.email) protokoll("Cockpit", "Kunde hat keine Mail angegeben: Bewertung per WhatsApp erbitten.");
    } else if (m.status !== "erledigt" && !m.bewertungGesendet) m.bewertungFaellig = null;
  }
  function statusSetzen(m, n) {
    var vorher = m.status; m.status = n;
    protokoll("Cockpit", m.art + ": Status «" + STATUS_NAME[n] + "».");
    if (n === "auftrag") {
      S.mails.unshift({ id: "a" + m.id + Date.now(), zeit: jetzt(), von: "Auto Speedy Cockpit", betreff: "Auftrag: " + m.art + (m.tesla ? " (Tesla)" : "") + ". Wenn fertig, hier melden", auftrag: m.id,
        text: "Ein neuer Auftrag läuft: " + m.art + (m.tesla ? " (Tesla)" : "") + ".\n\nWenn das Auto fertig ist, tippen Sie unten und bestätigen. Ohne Anmelden.\n\n" +
          (m.email ? "Der Kunde hat seine Mail angegeben: 24 Stunden nach «erledigt» bekommt er einmal die Bitte um eine Bewertung." : "Der Kunde hat keine Mail angegeben: Bitte um Bewertung im Cockpit per WhatsApp.") });
      protokoll("Mailversand", "schickt info@autospeedy.ch die Auftrags-Mail mit dem Link «erledigt melden».");
      klingel("postfach"); geschafft("auftrag");
    }
    planen(m, vorher);
  }
  function datum(t) { return new Intl.DateTimeFormat("de-CH", { weekday: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) + " Uhr"; }
  function vorspulen() {
    S.versatz += 24 * STD;
    protokoll("Demo", "24 Stunden vorgespult.");
    var faellig = S.meldungen.filter(function (m) { return m.status === "erledigt" && m.email && m.bewertungFaellig && !m.bewertungGesendet && m.bewertungFaellig <= jetzt(); });
    protokoll("Zeitplan", "prüft alle 15 Minuten, ob eine Bitte um Bewertung fällig ist: " + (faellig.length ? faellig.length + " fällig." : "keine fällig."));
    faellig.forEach(function (m, i) {
      m.bewertungGesendet = jetzt();
      var text = "Guten Tag " + (m.name.split(/\s+/)[0] || "") + "\n\nIhr Auto ist fertig. Danke für Ihr Vertrauen.\nHat alles gepasst? Über eine kurze Bewertung freuen wir uns sehr:\nautospeedy.ch/bewerten/\n\nFreundliche Grüsse\nAuto Speedy AG";
      protokoll("Mailversand", "schickt die Bitte um Bewertung an " + m.email + ". Jede Bitte geht nur einmal.");
      if (!m.beispiel) setTimeout(function () { anWebsite({ typ: "kundenmail", betreff: "Danke für Ihren Auftrag bei Auto Speedy", text: text, link: true }); }, 400 + i * 300);
    });
    if (faellig.length) { geschafft("vorspulen"); toast("24 Stunden später: Links bekommt der Kunde die Bitte um Bewertung per Mail."); }
    else toast("Vorgespult. Nichts fällig: Erst eine Meldung mit Mail auf «Erledigt» setzen.");
    $("#d-uhr").textContent = uhr(); zeichne();
  }
  function uhr() { return new Intl.DateTimeFormat("de-CH", { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(jetzt())); }
  function bewertung(m) {
    var text = "Guten Tag " + m.name + ", danke für Ihren Auftrag bei Auto Speedy. Über eine kurze Bewertung freuen wir uns: autospeedy.ch/bewerten/";
    S.wa.push({ zeit: jetzt(), von: "betrieb", text: text, fotos: [] });
    anWebsite({ typ: "bewertung", text: text });
    protokoll("Cockpit", "Bitte um Bewertung per WhatsApp an " + m.name + ".");
    toast("Gesendet. Links sieht der Kunde die Nachricht auf seinem Handy.");
  }
  function zahlen() {
    var web = S.meldungen.filter(function (x) { return x.quelle === "website"; });
    var auftraege = web.filter(function (x) { return x.status === "auftrag" || x.status === "erledigt"; }).length;
    var verloren = web.filter(function (x) { return x.status === "verloren"; }).length;
    var quote = auftraege + verloren ? Math.round(auftraege / (auftraege + verloren) * 100) : null;
    var proArt = {};
    web.forEach(function (x) { proArt[x.art] = (proArt[x.art] || 0) + 1; });
    var max = Math.max.apply(null, Object.keys(proArt).map(function (k) { return proArt[k]; }).concat([1]));
    return h("main", { class: "seite" }, [
      h("h1", { text: "Zahlen" }),
      h("p", { class: "unterzeile", text: "Was über die Website kam, letzte 30 Tage. Demo: Beispielwerte plus das, was Sie gerade gemacht haben." }),
      h("div", { class: "kennzahlen" }, [
        h("div", { class: "kennzahl" }, [h("b", { text: String(web.length) }), h("span", { text: "Anfragen über die Website (Formular und Rückruf)" })]),
        h("div", { class: "kennzahl" }, [h("b", { text: String(auftraege) }), h("span", { text: "davon Aufträge" })]),
        h("div", { class: "kennzahl" }, [h("b", { text: quote === null ? "–" : quote + " %" }), h("span", { text: "Abschlussquote (Aufträge von allen entschiedenen)" })]),
        h("div", { class: "kennzahl" }, [h("b", { text: String(S.zaehl.anruf) }), h("span", { text: "Tipps auf die Telefonnummer" })]),
      ]),
      h("h2", { text: "Schadenmeldung Schritt für Schritt" }),
      h("p", { class: "unterzeile", text: "Wo Leute aufgeben. Fällt ein Schritt stark ab, ist er zu schwer." }),
      h("table", { class: "zahlen" }, [h("tbody", {}, [["Schadenmeldung geöffnet", "trichter-1"], ["Art gewählt, bei den Fotos", "trichter-2"], ["Bei Name und Telefon", "trichter-3"], ["Abgeschickt (Website oder WhatsApp)", "gesendet"]].map(function (t) {
        var n = S.punkte[t[1]] || 0, start = S.punkte["trichter-1"] || 1, a = Math.round(n / start * 100);
        return h("tr", {}, [h("th", { text: t[0] }), h("td", { class: "d-balken" }, [h("span", { style: "--w:" + Math.min(100, a) + "%" })]), h("td", { class: "zahl", text: n + " · " + a + " %" })]);
      }))]),
      h("h2", { text: "Anfragen nach Art" }),
      h("table", { class: "zahlen" }, [h("tbody", {}, Object.keys(proArt).map(function (k) {
        return h("tr", {}, [h("th", { text: k }), h("td", { class: "d-balken" }, [h("span", { style: "--w:" + Math.round(proArt[k] / max * 100) + "%" })]), h("td", { class: "zahl", text: String(proArt[k]) })]);
      }))]),
      h("p", { class: "unterzeile", text: "Anrufe selbst kann die Website nicht zählen, nur Tipps auf die Nummer. WhatsApp-Meldungen laufen über Ihr Handy und sind hier nicht dabei." }),
    ]);
  }
  function pflege() {
    var p = S.pflege;
    var feld = function (i, n, k) { return h("input", { "aria-label": p.zeiten[i].tage + ", " + (n + 1) + ". Zeit " + (k ? "bis" : "von"), "data-z": i + "." + n + "." + k, value: p.zeiten[i].fenster[n][k], inputmode: "decimal", maxlength: "5", size: "5" }); };
    var meldung = h("p", { class: "ok-text", role: "status" });
    return h("main", { class: "seite" }, [
      h("h1", { text: "Website pflegen" }),
      h("p", { class: "unterzeile" }, ["Was hier steht, steht nach dem Speichern auf autospeedy.ch. Heute: ", h("b", { text: zeitenKurz(p) }), "."]),
      h("form", { class: "pflege", onsubmit: function (e) {
        e.preventDefault();
        var alt = zeitenKurz(p);
        var neu = JSON.parse(JSON.stringify(p));
        var fehler = null;
        [].forEach.call(e.currentTarget.querySelectorAll("[data-z]"), function (inp) {
          var t = inp.getAttribute("data-z").split(".").map(Number), v = inp.value.trim();
          if (!/^([01]?\d|2[0-3])\.[0-5]\d$/.test(v)) fehler = fehler || p.zeiten[t[0]].tage + ": «" + v + "» ist keine Zeit (z. B. 17.15).";
          neu.zeiten[t[0]].fenster[t[1]][t[2]] = v;
        });
        neu.hinweis.aktiv = $("#d-h-aktiv").checked; neu.hinweis.text = $("#d-h-text").value.trim().slice(0, 120);
        if (fehler) { meldung.className = "meldung-text"; meldung.textContent = fehler; return; }
        S.pflege = neu;
        anWebsite({ typ: "pflege", zeitenAlt: alt, zeitenNeu: zeitenKurz(neu), tage: neu.zeiten.map(function (z) { return { tage: z.tage, text: z.fenster.map(function (f) { return f[0] + " bis " + f[1] + " Uhr"; }).join(" und ") }; }), hinweis: neu.hinweis, ziel: "#start" });
        geschafft("pflege");
        zeichne();
        toast("Gespeichert. Links ist die Website schon aktuell (im Echten nach etwa 2 Minuten).");
      } }, [
        h("fieldset", { class: "karte" }, [h("legend", { text: "Hinweis oben auf der Website" }), h("p", { class: "unterzeile", text: "Zum Beispiel nach einem Hagelsturm." }),
          h("label", { class: "schalter" }, [h("input", { type: "checkbox", id: "d-h-aktiv", checked: p.hinweis.aktiv }), " Hinweis zeigen"]),
          h("label", { for: "d-h-text", text: "Text (höchstens 120 Zeichen)" }), h("input", { id: "d-h-text", value: p.hinweis.text, maxlength: "120" })]),
        h("fieldset", { class: "karte" }, [h("legend", { text: "Öffnungszeiten" })].concat(p.zeiten.map(function (z, i) {
          return h("div", { class: "zeile-zeit" }, [h("span", { class: "tage", text: z.tage }), h("span", { class: "fenster" }, [feld(i, 0, 0), "bis", feld(i, 0, 1)]), h("span", { class: "fenster" }, [feld(i, 1, 0), "bis", feld(i, 1, 1)])]);
        }))),
        h("fieldset", { class: "karte" }, [h("legend", { text: "Feiertage, Ferien und Team" }), h("p", { class: "unterzeile", text: "Im echten Cockpit auch hier: Feiertage und Betriebsferien eintragen, Team mit Fotos ändern. In der Demo weggelassen." })]),
        h("div", { class: "speichern-leiste" }, [meldung, h("button", { type: "submit", class: "knopf" }, "Speichern und veröffentlichen")]),
      ]),
    ]);
  }
  function cockpit() {
    if (S.login !== "an") return anmelden();
    var seite = S.seite === "detail" ? detail() : S.seite === "zahlen" ? zahlen() : S.seite === "pflege" ? pflege() : liste();
    return h("div", {}, [kopf(S.seite === "detail" ? "liste" : S.seite), seite]);
  }

  // ---------- Rundgang
  function rundgang() {
    var aktuell = RUNDGANG.filter(function (s) { return !S.schritte[s.id]; })[0];
    var ol = $("#d-rundgang ol"); ol.textContent = "";
    RUNDGANG.forEach(function (s, i) {
      ol.appendChild(h("li", { class: S.schritte[s.id] ? "fertig" : s === aktuell ? "jetzt" : "", "aria-current": s === aktuell ? "step" : null }, [h("span", { class: "nr", text: S.schritte[s.id] ? "✓" : String(i + 1) }), h("span", { text: s.text })]));
    });
  }

  // ---------- Zeichnen
  var LOGO = $("#d-logo").getAttribute("src");
  function FINGER() { var s = $("#d-finger-symbol").cloneNode(true); s.removeAttribute("id"); s.hidden = false; return s; }
  function zeichne() {
    var f = $("#d-fenster"); var oben = f.scrollTop;
    f.textContent = "";
    f.appendChild(S.reiter === "postfach" ? postfach() : S.reiter === "whatsapp" ? whatsapp() : S.reiter === "ablauf" ? ablauf() : cockpit());
    f.scrollTop = S.reiter === "cockpit" && S.seite === S.letzteSeite ? oben : 0; S.letzteSeite = S.seite;
    reiter();
  }
  $("#d-neu").addEventListener("click", function () { location.reload(); });
  $("#d-vorspulen").addEventListener("click", vorspulen);
  $("#d-uhr").textContent = uhr();
  setInterval(function () { $("#d-uhr").textContent = uhr(); }, 30000);

  // Website laden: als Blob, damit die Datei ohne Server läuft
  var html = JSON.parse($("#d-website-html").textContent);
  website.src = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  rundgang(); zeichne();
})();
