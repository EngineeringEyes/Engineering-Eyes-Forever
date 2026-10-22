/* ═══════════════════════════════════════════════════════════════
   SECCIÓN SERVICIOS — motor del carrusel
   Los datos están en data/servicios.js (window.EE_SERVICIOS).
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const datos = window.EE_SERVICIOS || [];
  const stage = document.getElementById('srvStage');
  if (!stage || !datos.length) {
    if (stage) console.error('[EE] data/servicios.js no se cargó: la sección quedó vacía.');
    return;
  }

  const track = document.getElementById('srvTrack');
  const dotsC = document.getElementById('srvDots');
  const esc = s => { const d = document.createElement('div'); d.textContent = String(s == null ? '' : s); return d.innerHTML; };

  /* ── Construir las tarjetas ── */
  datos.forEach((s, i) => {
    const card = document.createElement('article');
    card.className = 'srv-card';
    card.style.setProperty('--ac', s.color || '#00d4c8');
    card.dataset.i = i;

    const puntos = (s.puntos || []).map(p => `<li>${esc(p)}</li>`).join('');
    const img = s.img ? `style="background-image:url('${esc(s.img)}')"` : '';

    card.innerHTML =
      `<div class="srv-bg" ${img}></div>` +
      `<div class="srv-veil" aria-hidden="true"></div>` +
      `<div class="srv-body">` +
        `<span class="srv-tag">${esc(s.tag || '')}</span>` +
        `<h3 class="srv-titulo">${esc(s.titulo || '')}</h3>` +
        `<div class="srv-precio-fila">` +
          `<span class="srv-precio">${esc(s.precio || '')}</span>` +
          `<span class="srv-unidad">${esc(s.unidad || '')}</span>` +
        `</div>` +
        `<p class="srv-desc">${esc(s.desc || '')}</p>` +
        `<ul class="srv-puntos">${puntos}</ul>` +
        `<a class="srv-cta" href="${esc(s.url || '#')}" target="_blank" rel="noopener noreferrer">${esc(s.cta || 'Consultar')}</a>` +
      `</div>`;

    card.addEventListener('click', e => {
      if (e.target.closest('.srv-cta')) return;     /* el botón hace lo suyo */
      if (Number(card.dataset.i) !== actual) ir(Number(card.dataset.i));
    });
    track.appendChild(card);
  });

  const cards = [...track.querySelectorAll('.srv-card')];
  const total = cards.length;
  let actual = Math.floor(total / 2);

  /* ── Puntos de navegación ── */
  datos.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'srv-dot';
    b.setAttribute('aria-label', 'Ver ' + (s.titulo || ('servicio ' + (i + 1))));
    b.addEventListener('click', () => ir(i));
    dotsC.appendChild(b);
  });
  const dots = [...dotsC.children];

  /* ── Colocación: la distancia al centro decide todo ── */
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pintar() {
    const estrecho = window.innerWidth < 900;
    const sepX  = estrecho ? 150 : 215;    /* separación horizontal */
    const sepZ  = estrecho ? 180 : 230;    /* hundimiento en profundidad */
    const giro  = estrecho ? 38  : 46;     /* grados de rotación */

    cards.forEach((c, i) => {
      const d = i - actual;                /* distancia con signo */
      const a = Math.abs(d);
      const dir = Math.sign(d);

      /* Las que quedan muy lejos se ocultan: no tiene sentido pintarlas */
      if (a > 3) { c.style.opacity = '0'; c.style.pointerEvents = 'none'; return; }

      const x = d * sepX;
      const z = -a * sepZ;
      const rot = -dir * Math.min(a, 2.2) * giro;
      const escala = 1 - Math.min(a, 3) * 0.085;

      /* La distorsión crece con la distancia: 0 = nítida, 3 = máxima.
         Quien pida menos movimiento no recibe ni ondulación ni blur. */
      const nivel = reducido ? 0 : Math.min(a, 3);
      const op    = a === 0 ? 1 : Math.max(0.30, 1 - a * 0.22);

      c.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${rot}deg) scale(${escala})`;
      c.classList.remove('ab1', 'ab2', 'ab3');
      if (nivel > 0) c.classList.add('ab' + nivel);
      c.style.opacity   = String(op);
      c.style.zIndex    = String(100 - a);
      c.style.pointerEvents = 'auto';
      c.classList.toggle('is-active', a === 0);
      c.setAttribute('aria-hidden', a === 0 ? 'false' : 'true');

      c.style.boxShadow = a === 0
        ? '0 30px 70px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.08)'
        : '0 16px 40px rgba(0,0,0,.5)';
    });

    dots.forEach((d, i) => d.classList.toggle('on', i === actual));
  }

  function ir(i) {
    actual = (i + total) % total;
    pintar();
  }
  const siguiente = () => ir(actual + 1);
  const anterior  = () => ir(actual - 1);

  document.getElementById('srvPrev').addEventListener('click', anterior);
  document.getElementById('srvNext').addEventListener('click', siguiente);

  /* ── Teclado, solo cuando la sección está a la vista ── */
  document.addEventListener('keydown', e => {
    const r = stage.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); siguiente(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); anterior(); }
  });

  /* ── Deslizar con el dedo ──
     Solo cuenta como gesto horizontal si se mueve más en X que en Y;
     así el arrastre vertical sigue desplazando la página. */
  let x0 = null, y0 = null, horizontal = false;
  stage.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { x0 = null; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; horizontal = false;
  }, { passive: true });

  stage.addEventListener('touchmove', e => {
    if (x0 === null) return;
    const dx = e.touches[0].clientX - x0;
    const dy = e.touches[0].clientY - y0;
    if (!horizontal && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3) horizontal = true;
  }, { passive: true });

  stage.addEventListener('touchend', e => {
    if (x0 === null || !horizontal) { x0 = null; return; }
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 45) (dx < 0 ? siguiente() : anterior());
  }, { passive: true });

  /* Arrastre con ratón */
  let mx = null;
  stage.addEventListener('mousedown', e => { mx = e.clientX; });
  window.addEventListener('mouseup', e => {
    if (mx === null) return;
    const dx = e.clientX - mx; mx = null;
    if (Math.abs(dx) > 60) (dx < 0 ? siguiente() : anterior());
  });

  window.addEventListener('resize', pintar);
  pintar();
})();
