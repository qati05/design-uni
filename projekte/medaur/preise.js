// Medaur · Preisseite. Rechner läuft immer; Bewegung nur mit .bewegt (GSAP da, keine reduzierte Bewegung).
(() => {
  const html = document.documentElement;
  const bewegt = html.classList.contains('bewegt') && window.gsap && window.ScrollTrigger;
  if (!bewegt) html.classList.remove('bewegt');
  const D = JSON.parse(document.getElementById('preisdaten').textContent);
  const chf = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '’');

  // Rechner: Grösse, Abo, Zahlung, Zeitraum → Beleg. Zusätze ändern diese Summe nie. Raten nur bei Business mit Abo.
  const form = document.querySelector('.wahl');
  const zeilenEl = document.querySelector('[data-ausgabe="zeilen"]');
  const totalEl = document.querySelector('[data-ausgabe="total"]');
  const totalLabel = totalEl && totalEl.previousElementSibling;
  const danachEl = document.querySelector('[data-ausgabe="danach"]');
  const ABO = { pflege: 'Pflege', betreuung: 'Betreuung' };
  let alt = 4800;

  function zaehle(el, von, bis, vor) {
    if (!bewegt || von === bis) { el.textContent = vor + chf(bis); return; }
    const t0 = performance.now(), dauer = 420;
    const schritt = (t) => {
      const p = Math.min(1, (t - t0) / dauer), e = 1 - Math.pow(1 - p, 3);
      el.textContent = vor + chf(von + (bis - von) * e);
      if (p < 1) requestAnimationFrame(schritt);
    };
    requestAnimationFrame(schritt);
  }

  function rechne() {
    const f = new FormData(form);
    const g = f.get('groesse'), abo = f.get('abo'), jahre = Number(f.get('jahre'));
    const w = D.websites[g];
    const raten = form.querySelector('input[value="raten"]');
    raten.disabled = g !== 'business' || abo === 'kein';
    if (raten.disabled && raten.checked) form.querySelector('input[value="normal"]').checked = true;
    const zahlung = new FormData(form).get('zahlung');
    const ab = w.ab ? 'ab ' : '';
    const z = [];
    if (zahlung === 'raten') {
      z.push([`Website ${w.name}, erste Zahlung`, chf(D.raten.erste)]);
      z.push([`${D.raten.anzahl} Raten zu ${D.raten.rate}, ohne Zins`, chf(D.raten.anzahl * D.raten.rate)]);
    } else {
      const anz = g === 'business' ? D.anzahlung : Math.round(w.preis * 0.3 / 10) * 10;
      z.push([`Website ${w.name}, bei Vertrag (30 %)`, ab + chf(anz)]);
      z.push(['Rest bei Abnahme', ab + chf(w.preis - anz)]);
    }
    if (w.inklusiv) z.push([`Betreuung, Monat 1–${w.inklusiv}`, 'inbegriffen', true]);
    const monate = 12 * jahre - w.inklusiv;
    let summe = w.preis;
    if (abo === 'kein') {
      z.push(['Kein Abo: Code und Domain gehören Ihnen', '0']);
    } else {
      const p = D.abos[abo];
      summe += p * monate;
      z.push([`${ABO[abo]}, ${monate} × ${p}`, chf(p * monate)]);
    }
    zeilenEl.innerHTML = z.map(([was, wert, gelb]) => `<li class="beleg__zeile${gelb ? ' beleg__zeile--gelb' : ''} ist-neu"><span class="beleg__was">${was}</span><span class="beleg__wert">${wert}</span></li>`).join('');
    totalLabel.textContent = `Total ${jahre} ${jahre === 1 ? 'Jahr' : 'Jahre'}`;
    zaehle(totalEl, alt, summe, ab);
    alt = summe;
    const erste = w.inklusiv ? `Erste Monatsrechnung zu Beginn von Monat ${w.inklusiv + 1} nach dem Livegang` : 'Monatsrechnung ab dem ersten Monat nach dem Livegang';
    danachEl.textContent = zahlung === 'raten'
      ? `Monat 1–${w.inklusiv}: nur die Rate, CHF ${D.raten.rate}. Ab Monat ${w.inklusiv + 1}: CHF ${D.raten.rate + D.abos[abo]} (Rate und ${ABO[abo]}), nach der letzten Rate CHF ${D.abos[abo]}. Das Abo ist jeden Monat kündbar; der Rest der Website wird dann auf einmal fällig.`
      : abo === 'kein'
      ? 'Danach zahlen Sie uns nichts. Das Hosting zahlen Sie dem Anbieter Ihrer Wahl, Richtwert CHF 16 im Monat.'
      : `${erste}: CHF ${D.abos[abo]}. Jeden Monat kündbar.${w.ab ? ' Premium: Festpreis schriftlich mit dem Entwurf.' : ''}`;
  }
  if (form) { form.addEventListener('change', rechne); rechne(); }

  // Türen: weich aufklappen (nur mit Bewegung); zum Drucken alles offen.
  if (bewegt) {
    for (const d of document.querySelectorAll('.tuer, .frage')) {
      const sum = d.querySelector('summary');
      sum.addEventListener('click', (ev) => {
        if (d.open) return;
        ev.preventDefault();
        d.open = true;
        const inhalt = sum.nextElementSibling;
        inhalt.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
      });
    }
  }
  // Direktlink auf eine Tür (#gefunden-werden, #arbeit-abgeben, #z-…) öffnet sie.
  const oeffne = () => { const z = location.hash && document.querySelector(location.hash); const d = z && z.closest('details'); if (d) { d.open = true; z.scrollIntoView(); } };
  addEventListener('hashchange', oeffne); oeffne();
  addEventListener('beforeprint', () => { for (const d of document.querySelectorAll('details')) d.open = true; });

  // Haken setzen sich, wenn die Karte sichtbar wird.
  for (const box of document.querySelectorAll('.paket, .abo, .ehrlich__raster > div')) {
    box.querySelectorAll('.haken li').forEach((li, i) => li.style.setProperty('--n', i));
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { box.classList.add('ist-an'); o.disconnect(); } }, { threshold: 0.25 }).observe(box);
  }

  if (!bewegt) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const WEICH = 1;

  // Überschriften: Wort für Wort aus einer Maske.
  for (const h of document.querySelectorAll('.preise h1, .preise h2')) {
    const worte = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = worte.map((w) => `<span class="wm" aria-hidden="true"><span>${w}</span></span>`).join(' ');
    const teile = h.querySelectorAll('.wm > span');
    gsap.set(teile, { y: 0, yPercent: 110 });
    const los = () => gsap.to(teile, { yPercent: 0, duration: .8, ease: 'expo.out', stagger: .05 });
    if (h.tagName === 'H1') los(); else ScrollTrigger.create({ trigger: h, start: 'top 88%', once: true, onEnter: los });
  }

  // Beleg im Hero druckt sich aus: Papier fährt heraus, Zeilen kommen der Reihe nach, Beträge zählen.
  const beleg = document.querySelector('.p-hero .beleg');
  if (beleg) {
    beleg.classList.add('beleg--druck');
    const zeilen = beleg.querySelectorAll('.beleg__zeile, .beleg__fuss');
    const tl = gsap.timeline({ delay: .35 });
    tl.fromTo(beleg, { '--druck': '0%' }, { '--druck': '100%', duration: 1.1, ease: 'power2.inOut' })
      .from(zeilen, { y: -10, autoAlpha: 0, duration: .35, stagger: .14, ease: 'power2.out' }, .25);
    for (const el of beleg.querySelectorAll('[data-zahl]')) {
      const ziel = Number(el.dataset.zahl), o = { v: 0 };
      tl.to(o, { v: ziel, duration: .7, ease: 'power2.out', onUpdate: () => { el.textContent = chf(o.v); } }, .55);
    }
    tl.set(beleg, { clearProps: 'clipPath' });
  }

  // Weg: am Desktop fährt die Spur seitwärts, solange die Bühne steht; am Handy füllt sich die Linie nach unten.
  const weg = document.querySelector('.weg');
  const liste = weg.querySelector('.weg__liste');
  const stationen = [...weg.querySelectorAll('.station')];
  const markiere = (i) => stationen.forEach((s, k) => { s.classList.toggle('ist-dran', k === i); s.classList.toggle('war-dran', k < i); });
  ScrollTrigger.matchMedia({
    '(min-width: 900px)': () => {
      const spur = weg.querySelector('.weg__spur');
      const weite = () => { const cs = getComputedStyle(spur); return Math.max(0, liste.scrollWidth - (spur.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight))); };
      const st = ScrollTrigger.create({
        trigger: weg, start: 'top top', end: 'bottom bottom', scrub: WEICH, invalidateOnRefresh: true,
        onUpdate: (s) => {
          liste.style.setProperty('--x', `${-weite() * s.progress}px`);
          weg.style.setProperty('--fort', s.progress.toFixed(4));
          markiere(Math.min(stationen.length - 1, Math.floor(s.progress * stationen.length)));
        },
      });
      return () => { st.kill(); liste.style.removeProperty('--x'); };
    },
    '(max-width: 899px)': () => {
      const st = ScrollTrigger.create({
        trigger: liste, start: 'top 60%', end: 'bottom 60%', scrub: WEICH,
        onUpdate: (s) => {
          weg.style.setProperty('--fort', s.progress.toFixed(4));
          markiere(Math.min(stationen.length - 1, Math.floor(s.progress * stationen.length)));
        },
      });
      return () => st.kill();
    },
  });

  // Karten steigen auf, Business zuletzt und etwas höher.
  ScrollTrigger.batch('.paket, .abo, .zusatz, .garantie__liste li, .ehrlich__raster > div', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.from(els, { y: 48, autoAlpha: 0, duration: .8, ease: 'expo.out', stagger: .09 }),
  });
  ScrollTrigger.create({
    trigger: '.klein__liste', start: 'top 90%', once: true,
    onEnter: () => gsap.from('.klein__liste li', { y: -40, rotation: () => gsap.utils.random(-8, 8), autoAlpha: 0, duration: .7, ease: 'bounce.out', stagger: .07 }),
  });
  gsap.from('.paket__marke', { scale: 0, rotation: -12, duration: .6, ease: 'back.out(3)', scrollTrigger: { trigger: '.paket--haupt', start: 'top 80%', once: true } });
})();
