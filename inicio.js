/* ═══════════════════════════════════════════════════════════════
   INICIO — Destacados + Top software
   Lee de data/catalogo.js y data/destacados.js. Sin datos duplicados.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const CAT = window.EE_CATALOGO || [];
  const por = k => CAT.find(c => c.llave === k);
  const esc = s => { const d = document.createElement('div'); d.textContent = String(s ?? ''); return d.innerHTML; };

  /* Monograma del icono, como lo haría una tienda de apps:
     "ETABS 23"→ET · "AutoCAD 2025"→AC · "ArcGIS Pro"→AP · "GEO5 2026"→G5 */
  function mono(nombre) {
    const pal = String(nombre).replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/)
      .filter(w => w.length > 1 && !/^\d+$/.test(w) && !/^v\d/i.test(w));
    if (pal.length >= 2 && !/^(pro|suite)$/i.test(pal[1])) return (pal[0][0] + pal[1][0]).toUpperCase();
    const w = pal[0] || String(nombre);
    const camel = w.slice(1).match(/(?<=[a-z])[A-Z]/);          /* AutoCAD → C */
    if (camel) return (w[0] + camel[0]).toUpperCase();
    const dig = w.match(/\d/);                                    /* GEO5 → 5 */
    if (dig && w.length <= 5) return (w[0] + dig[0]).toUpperCase();
    return w.slice(0, 2).toUpperCase();
  }

  window.EE_MONO = mono;

  const ICO_OK  = '<svg viewBox="0 0 24 24" fill="#1d9bf0"><path d="M12 2l2.4 2.1 3.2-.4.9 3.1 2.8 1.6-1.2 3 1.2 3-2.8 1.6-.9 3.1-3.2-.4L12 22l-2.4-2.1-3.2.4-.9-3.1L2.7 15.6l1.2-3-1.2-3 2.8-1.6.9-3.1 3.2.4z"/><path d="M8.5 12.2l2.3 2.3 4.7-4.8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICO_WIN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.4l7.4-1v7.1H3zM11.3 4.3L21 3v8.5h-9.7zM3 12.4h7.4v7.1L3 18.6zM11.3 12.4H21V21l-9.7-1.3z"/></svg>';
  const ICO_CAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';

  const ICO_DL  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></svg>';

  function precio(c) {
    if (c.gratis) return { main: 'Gratis', sub: 'Descarga directa', gratis: true };
    const usd = typeof window.EE_USD === 'function' ? window.EE_USD(c.pen, c.usd) : c.usd;
    return { main: 'S/ ' + c.pen, sub: usd ? '≈ $ ' + usd + ' USD' : '', gratis: false };
  }
  function estrellas(r) {
    const n = Math.round(Number(r) || 0);
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }
  const plataforma = c => (c.so || (c.ficha || []).find(f => f[0] === 'Sistema')?.[1] || 'Windows');

  /* ── VERSIONES ──────────────────────────────────────────────
     Programas con varias versiones en el catálogo (GEO5 2025/2026,
     Cypecad 2019/2026/2027.a, Revit, AutoCAD…) se agrupan por
     FAMILIA. La familia sale sola del nombre (se quita la versión:
     "Cypecad 2027.a" y "CYPECAD 2026" → "cypecad"). Si algún día
     dos programas se agrupan mal, basta con poner en catalogo.js
     familia: "lo-que-sea" para forzar el grupo.                    */
  function familia(c) {
    if (c.familia) return String(c.familia).toLowerCase();
    const w = String(c.nombre).trim().split(/\s+/);
    return [w[0]].concat(w.slice(1).filter(x => !/\d|^β$/.test(x))).join(' ').toLowerCase();
  }
  const FAM = {};
  CAT.forEach(c => (FAM[familia(c)] = FAM[familia(c)] || []).push(c));
  /* En el catálogo van de la más antigua a la más nueva; en el
     selector se muestran al revés: la más reciente arriba. */
  const versionesDe = c => FAM[familia(c)].slice().reverse();
  const verTxt = c => 'v' + String(c.version).replace(/^v/i, '');

  /* ── DESTACADOS ── */
  const track = document.getElementById('dstTrack');
  const lista = (window.EE_DESTACADOS || []).map(por).filter(Boolean);
  const fotos = window.EE_DEST_IMG || {};

  function pintarCard(card, c) {
    const p = precio(c);
    const foto = fotos[c.llave];
    const vers = versionesDe(c);
    card.style.setProperty('--ac', c.color);
    card.dataset.sw = c.llave;          /* «Descargar» abre la ficha de ESTA versión */

    const splash = foto
      ? `<div class="dst-splash foto" style="background-image:url('${esc(foto)}')">`
      : `<div class="dst-splash">`;

    /* Una sola versión → etiqueta fija, como antes.
       Varias → la misma etiqueta con ▾ y un selector nativo encima
       (invisible). En el móvil abre el selector del sistema. */
    const ver = vers.length < 2
      ? `<span class="ver mono">${esc(verTxt(c))}</span>`
      : `<label class="ver ver-sel mono" title="Cambiar versión">${esc(verTxt(c))}` +
          `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>` +
          `<select aria-label="Versión de ${esc(c.nombre)}">` +
            vers.map(v => `<option value="${esc(v.llave)}"${v.llave === c.llave ? ' selected' : ''}>` +
              `${esc(verTxt(v))} — ${v.gratis ? 'Gratis' : 'S/ ' + esc(v.pen)}</option>`).join('') +
          `</select></label>`;

    card.innerHTML =
      splash +
        `<div class="dst-bar"><span></span><span></span><span></span><em class="mono">${esc(c.nombre)}</em></div>` +
        `<span class="dst-flag${p.gratis ? ' gratis' : ''}">${p.gratis ? 'Gratis' : esc(c.lista.cat)}</span>` +
        (foto ? '' : `<div class="dst-app"><span class="app-ico">${esc(mono(c.nombre))}</span><b>${esc(c.dev)}</b></div>`) +
      `</div>` +
      `<div class="dst-body">` +
        `<div class="dst-top"><h3 class="dst-name">${esc(c.nombre)}</h3>${ver}</div>` +
        `<div class="dst-dev">${ICO_OK}${esc(c.dev)}</div>` +
        (c.rating ? `<div class="stars"><span class="s">${estrellas(c.rating)}</span><b>${Number(c.rating).toFixed(1)}</b>(${c.resenas || 0})</div>` : '') +
        `<div class="chips"><span class="chip">${ICO_WIN}${esc(plataforma(c))}</span><span class="chip">${ICO_CAT}${esc(c.lista.cat)}</span></div>` +
        `<div class="dst-foot">` +
          `<div><div class="lbl">Precio</div><div class="dst-price${p.gratis ? ' gratis' : ''}">${esc(p.main)}</div><div class="dst-usd">${esc(p.sub)}</div></div>` +
          `<button class="btn-ink" type="button">${ICO_DL}Descargar</button>` +
        `</div>` +
      `</div>`;

    const sel = card.querySelector('.ver-sel select');
    if (sel) {
      /* Tocar el selector NO debe abrir la ficha ni arrastrar el carril */
      ['click', 'mousedown', 'touchstart', 'touchend', 'pointerdown', 'pointerup']
        .forEach(ev => sel.addEventListener(ev, e => e.stopPropagation(), { passive: true }));
      sel.addEventListener('change', () => {
        const nueva = por(sel.value);
        if (!nueva) return;
        pintarCard(card, nueva);
        card.classList.remove('cambio'); void card.offsetWidth; card.classList.add('cambio');
      });
    }
  }

  lista.forEach(c => {
    const card = document.createElement('article');
    card.className = 'dst-card';
    pintarCard(card, c);
    track.appendChild(card);
  });

  const cnt = document.getElementById('dstCnt');
  if (cnt) cnt.textContent = String(lista.length).padStart(2, '0') + ' programas';

  /* ── Desplazamiento ──────────────────────────────────────────
     Con 20 programas, avanzar de uno en uno obligaba a 16 clics.
     Ahora:
       · las flechas pasan una PÁGINA completa (las tarjetas visibles)
       · se puede deslizar con el dedo, el trackpad o arrastrando
         con el ratón, y la tarjeta queda siempre bien alineada
       · el contador dice qué tramo ves: 05–08 de 20
       · la barra muestra en qué punto de la lista estás
       · las flechas se apagan al llegar al principio o al final */
  const total = lista.length;
  const view  = track.parentElement;
  const prog  = document.getElementById('dstProg');
  const nA    = document.getElementById('dstA');
  const nB    = document.getElementById('dstB');
  const bPrev = document.getElementById('dstPrev');
  const bNext = document.getElementById('dstNext');
  const dos   = n => String(n).padStart(2, '0');

  function medidas() {
    const card = track.children[0];
    const paso = card ? card.offsetWidth + 26 : 1;
    const visibles = Math.max(1, Math.round(view.clientWidth / paso));
    return { paso, visibles };
  }

  function pintar() {
    const { paso, visibles } = medidas();
    const primero = Math.min(total - 1, Math.round(view.scrollLeft / paso));
    const ultimo  = Math.min(total, primero + visibles);
    nA.textContent = dos(primero + 1) + (visibles > 1 ? '–' + dos(ultimo) : '');
    nB.textContent = dos(total);
    const max = view.scrollWidth - view.clientWidth;
    const avance = max > 0 ? view.scrollLeft / max : 1;
    prog.style.width = Math.max(visibles / total, avance) * 100 + '%';
    bPrev.disabled = view.scrollLeft <= 2;
    bNext.disabled = view.scrollLeft >= max - 2 || ultimo >= total;   /* ya se ve la última */
  }

  function mover(dir) {
    const { paso, visibles } = medidas();
    const actual = Math.round(view.scrollLeft / paso);
    /* Saltar a la tarjeta exacta de la página siguiente/anterior, sin
       pasarse del final: así cada página empieza siempre en su sitio. */
    const destino = Math.max(0, Math.min(total - visibles, actual + dir * visibles));
    view.scrollTo({ left: destino * paso, behavior: 'smooth' });
  }
  bPrev.onclick = () => mover(-1);
  bNext.onclick = () => mover(1);

  /* Arrastrar con el ratón (en táctil ya lo hace el navegador) */
  let arr = null;
  view.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    arr = { x: e.clientX, s: view.scrollLeft, movio: false };
  });
  window.addEventListener('mousemove', e => {
    if (!arr) return;
    const dx = e.clientX - arr.x;
    /* Solo se considera arrastre a partir de 5px: un clic normal
       nunca activa 'arrastrando' y llega intacto a la tarjeta. */
    if (!arr.movio && Math.abs(dx) > 4) { arr.movio = true; view.classList.add('arrastrando'); }
    if (arr.movio) view.scrollLeft = arr.s - dx;
  });
  window.addEventListener('mouseup', () => { if (arr) { view.classList.remove('arrastrando'); setTimeout(() => { arr = null; }, 0); } });
  /* Si se arrastró, ese "clic" no abre la ficha */
  view.addEventListener('click', e => { if (arr && arr.movio) { e.stopPropagation(); e.preventDefault(); } }, true);

  view.addEventListener('scroll', () => requestAnimationFrame(pintar), { passive: true });
  window.addEventListener('resize', pintar);
  pintar();

  /* ── TOP SOFTWARE ── */
  const grid = document.getElementById('topGrid');
  const filtros = { todos: () => true, pago: c => !c.gratis, gratis: c => c.gratis };

  function top(f) {
    const orden = CAT.filter(c => c.rating && filtros[f](c))
      .sort((a, b) => (b.rating - a.rating) || ((b.resenas || 0) - (a.resenas || 0)))
      .slice(0, 10);
    grid.innerHTML = orden.map((c, i) => {
      const p = precio(c);
      return `<div class="top-row" data-sw="${esc(c.llave)}" style="--ac:${esc(c.color)}">` +
        `<span class="top-n mono${i < 3 ? ' podio' : ''}">${String(i + 1).padStart(2, '0')}</span>` +
        `<span class="app-ico">${esc(mono(c.nombre))}</span>` +
        `<div class="top-info"><div class="top-name">${esc(c.nombre)}</div>` +
          `<div class="top-sub"><span class="cat">${esc(c.lista.cat)}</span><span class="r">★</span>${Number(c.rating).toFixed(1)} · ${c.resenas || 0} reseñas</div></div>` +
        `<div class="top-r"><span class="pill ${p.gratis ? 'gratis' : 'pago'}">${esc(p.main)}</span>` +
          (p.gratis ? '' : `<div class="top-usd">${esc(p.sub)}</div>`) + `</div>` +
      `</div>`;
    }).join('');
  }
  document.querySelectorAll('.top-tab').forEach(b => b.onclick = () => {
    document.querySelectorAll('.top-tab').forEach(x => x.classList.toggle('on', x === b));
    top(b.dataset.f);
  });
  top('todos');
})();
