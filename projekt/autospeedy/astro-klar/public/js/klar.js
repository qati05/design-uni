/* Linie «Klar»: Kopf wird beim Scrollen weiss, Menü-Blatt, ruhiges Erscheinen. Ohne JS ist alles sichtbar und bedienbar. */
(function () {
  "use strict";
  var kopf = document.querySelector("[data-kopf]");
  function pruefe() { if (kopf) kopf.classList.toggle("ist-unten", window.scrollY > 24); }
  window.addEventListener("scroll", pruefe, { passive: true }); pruefe();
  var blatt = document.querySelector("[data-menu]");
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-menu-auf]") && blatt) blatt.showModal();
    if (e.target.closest("[data-menu-zu]") && blatt) blatt.close();
    if (blatt && e.target === blatt) blatt.close();
  });
  var teile = [].slice.call(document.querySelectorAll(".zeigen"));
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { teile.forEach(function (t) { t.classList.add("ist-da"); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("ist-da"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
  teile.forEach(function (t) { io.observe(t); });
})();
