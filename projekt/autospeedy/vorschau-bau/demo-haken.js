/* Demo-Bau, Seite «Kundenhandy»: statt zu senden, meldet die Website dem Demo-Rahmen, was passiert ist.
   Nichts verlässt den Browser. Ohne Rahmen (Datei direkt geöffnet) bleibt alles wie in der Vorschau. */
(function () {
  "use strict";
  if (window.parent === window) return;
  function an(m) { m.quelle = "as-website"; window.parent.postMessage(m, "*"); }
  window.__demo = function (typ, daten) { daten.typ = typ; an(daten); };
  // Zählung wie zaehl.js (Trichter der Schadenmeldung), hier an den Demo-Rahmen statt an den Server
  window.__zaehl = function (punkt, ort) { an({ typ: "zaehl", punkt: punkt, ort: ort || "seite" }); };

  var hinweis;
  function toast(t) {
    if (!hinweis) { hinweis = document.createElement("div"); hinweis.className = "demo-toast"; hinweis.setAttribute("role", "status"); document.body.appendChild(hinweis); }
    hinweis.textContent = t; hinweis.classList.add("an");
    clearTimeout(toast.t); toast.t = setTimeout(function () { hinweis.classList.remove("an"); }, 2600);
  }

  document.addEventListener("click", function (e) {
    var z = e.target.closest("[data-zaehl]");
    if (z) an({ typ: "zaehl", punkt: z.getAttribute("data-zaehl"), ort: z.getAttribute("data-ort") || "" });
    var tel = e.target.closest('a[href^="tel:"]');
    if (tel) { e.preventDefault(); if (!z) an({ typ: "zaehl", punkt: "anruf", ort: "seite" }); toast("Demo: Das Handy würde jetzt Auto Speedy anrufen."); }
    var mail = e.target.closest('a[href^="mailto:"]');
    if (mail) { e.preventDefault(); toast("Demo: Das Mailprogramm würde sich öffnen."); }
    var aus = e.target.closest('a[href^="http"]');
    if (aus) { e.preventDefault(); toast("Demo: Dieser Link führt zu einer anderen Website."); }
  }, true);

  function zeilen(alt, neu) {
    [].forEach.call(document.querySelectorAll("span, td, p, li"), function (el) {
      if (el.children.length === 0 && el.textContent.trim() === alt) el.textContent = neu;
    });
  }
  function pflege(m) {
    if (m.zeitenAlt && m.zeitenNeu) zeilen(m.zeitenAlt, m.zeitenNeu);
    (m.tage || []).forEach(function (t) {
      [].forEach.call(document.querySelectorAll('th[scope="row"]'), function (th) {
        if (th.textContent.trim() === t.tage && th.nextElementSibling) th.nextElementSibling.textContent = t.text;
      });
    });
    var alt = document.querySelector("p.saison"); if (alt) alt.remove();
    if (m.hinweis && m.hinweis.aktiv && m.hinweis.text) {
      var p = document.createElement("p"); p.className = "saison";
      var a = document.createElement("a"); a.href = "#schaden-melden"; a.setAttribute("data-abfrage", "art=hagel"); a.setAttribute("data-zaehl", "saison"); a.setAttribute("data-ort", "band");
      a.textContent = m.hinweis.text + " "; var s = document.createElement("span"); s.setAttribute("aria-hidden", "true"); s.textContent = "→"; a.appendChild(s);
      p.appendChild(a); var kopf = document.querySelector("header"); kopf.parentNode.insertBefore(p, kopf);
    }
    window.__gehe(m.ziel || "#start");
    toast("Website aktualisiert.");
  }
  function bewertung(m) {
    var o = document.createElement("div"); o.className = "demo-wa";
    o.innerHTML = '<div class="demo-wa__kopf"><b>Auto Speedy AG</b><span>WhatsApp</span></div><div class="demo-wa__blase"></div><div class="demo-wa__knoepfe"><button type="button" data-oeffnen>Bewertungsseite öffnen</button><button type="button" data-zu>Schliessen</button></div>';
    o.querySelector(".demo-wa__blase").textContent = m.text;
    o.querySelector("[data-oeffnen]").onclick = function () { o.remove(); window.__gehe("#bewerten"); an({ typ: "zaehl", punkt: "bewertung-geoeffnet", ort: "whatsapp" }); };
    o.querySelector("[data-zu]").onclick = function () { o.remove(); };
    document.body.appendChild(o);
  }
  function kundenmail(m) {
    var o = document.createElement("div"); o.className = "demo-wa demo-mail";
    o.innerHTML = '<div class="demo-wa__kopf"><b>Neue Mail</b><span>Auto Speedy AG</span></div><div class="demo-mail__betreff"></div><div class="demo-wa__blase"></div><div class="demo-wa__knoepfe"><button type="button" data-oeffnen>Bewertungsseite öffnen</button><button type="button" data-zu>Schliessen</button></div>';
    o.querySelector(".demo-mail__betreff").textContent = m.betreff;
    o.querySelector(".demo-wa__blase").textContent = m.text;
    var auf = o.querySelector("[data-oeffnen]");
    if (m.link) auf.onclick = function () { o.remove(); window.__gehe("#bewerten"); an({ typ: "zaehl", punkt: "bewertung-geoeffnet", ort: "mail" }); };
    else auf.remove();
    o.querySelector("[data-zu]").onclick = function () { o.remove(); };
    document.body.appendChild(o);
  }
  window.addEventListener("message", function (e) {
    var m = e.data || {};
    if (m.quelle !== "as-rahmen") return;
    if (m.typ === "kundenmail") kundenmail(m);
    if (m.typ === "pflege") pflege(m);
    if (m.typ === "bewertung") bewertung(m);
    if (m.typ === "gehe") window.__gehe(m.ziel);
  });

  var css = document.createElement("style");
  css.textContent = ".demo-toast{position:fixed;left:12px;right:12px;bottom:90px;z-index:99;padding:12px 14px;background:#14202a;color:#fff;font:600 15px/1.35 Barlow,Arial,sans-serif;opacity:0;transform:translateY(8px);transition:.2s;pointer-events:none}.demo-toast.an{opacity:1;transform:none}" +
    ".demo-wa{position:fixed;inset:auto 10px 96px;z-index:98;background:#e9ddd1;border:1px solid #c9bcae;box-shadow:0 12px 32px rgba(0,0,0,.25);font:400 16px/1.4 Barlow,Arial,sans-serif;color:#14202a;animation:demoWa .3s ease-out}" +
    ".demo-wa__kopf{display:flex;justify-content:space-between;padding:10px 12px;background:#1f7a4d;color:#fff}.demo-mail{background:#fff;border-color:#c4e0f8}.demo-mail .demo-wa__kopf{background:#1566b8}.demo-mail__betreff{padding:10px 12px 0;font-weight:700}.demo-mail .demo-wa__blase{background:#f3f5f6;max-height:260px;overflow:auto}.demo-mail .demo-wa__knoepfe button{background:#1566b8}.demo-mail .demo-wa__knoepfe [data-zu]{background:#fff;color:#14202a;border:1px solid #dde3e7}.demo-wa__blase{margin:12px;padding:10px 12px;background:#fff;white-space:pre-wrap}" +
    ".demo-wa__knoepfe{display:flex;gap:8px;padding:0 12px 12px}.demo-wa__knoepfe button{flex:1;min-height:44px;border:0;background:#1f7a4d;color:#fff;font:700 14px/1 Barlow,Arial,sans-serif;text-transform:uppercase;cursor:pointer}.demo-wa__knoepfe [data-zu]{background:#fff;color:#14202a}" +
    "@keyframes demoWa{from{opacity:0;transform:translateY(16px)}}@media (prefers-reduced-motion:reduce){.demo-wa,.demo-toast{animation:none;transition:none}}";
  document.head.appendChild(css);
  an({ typ: "bereit" });
})();
