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

  /* ── DESTACADOS ── */
  const track = document.getElementById('dstTrack');
  const lista = (window.EE_DESTACADOS || []).map(por).filter(Boolean);
  const fotos = window.EE_DEST_IMG || {};

  lista.forEach(c => {
    const p = precio(c);
    const foto = fotos[c.llave];
    const card = document.createElement('article');
    card.className = 'dst-card';
    card.style.setProperty('--ac', c.color);
    card.dataset.sw = c.llave;

    const splash = foto
      ? `<div class="dst-splash foto" style="background-image:url('${esc(foto)}')">`
      : `<div class="dst-splash">`;

    card.innerHTML =
      splash +
        `<div class="dst-bar"><span></span><span></span><span></span><em class="mono">${esc(c.nombre)}</em></div>` +
        `<span class="dst-flag${p.gratis ? ' gratis' : ''}">${p.gratis ? 'Gratis' : esc(c.lista.cat)}</span>` +
        (foto ? '' : `<div class="dst-app"><span class="app-ico">${esc(mono(c.nombre))}</span><b>${esc(c.dev)}</b></div>`) +
      `</div>` +
      `<div class="dst-body">` +
        `<div class="dst-top"><h3 class="dst-name">${esc(c.nombre)}</h3><span class="ver mono">v${esc(String(c.version).replace(/^v/i,''))}</span></div>` +
        `<div class="dst-dev">${ICO_OK}${esc(c.dev)}</div>` +
        (c.rating ? `<div class="stars"><span class="s">${estrellas(c.rating)}</span><b>${Number(c.rating).toFixed(1)}</b>(${c.resenas || 0})</div>` : '') +
        `<div class="chips"><span class="chip">${ICO_WIN}${esc(plataforma(c))}</span><span class="chip">${ICO_CAT}${esc(c.lista.cat)}</span></div>` +
        `<div class="dst-foot">` +
          `<div><div class="lbl">Precio</div><div class="dst-price${p.gratis ? ' gratis' : ''}">${esc(p.main)}</div><div class="dst-usd">${esc(p.sub)}</div></div>` +
          `<button class="btn-ink" type="button">Ver ficha →</button>` +
        `</div>` +
      `</div>`;
    track.appendChild(card);
  });

  const cnt = document.getElementById('dstCnt');
  if (cnt) cnt.textContent = String(lista.length).padStart(2, '0') + ' programas';

  let pag = 0;
  const total = lista.length;
  const prog = document.getElementById('dstProg');
  document.getElementById('dstB').textContent = String(total).padStart(2, '0');

  function pintar() {
    const card = track.children[0]; if (!card) return;
    const paso = card.offsetWidth + 26;
    const visibles = Math.max(1, Math.floor((track.parentElement.clientWidth - 36 + 26) / paso));
    const max = Math.max(0, total - visibles);
    pag = Math.min(Math.max(pag, 0), max);
    track.style.transform = `translateX(${-pag * paso}px)`;
    document.getElementById('dstA').textContent = String(pag + 1).padStart(2, '0');
    prog.style.width = Math.min(100, (pag + visibles) / total * 100) + '%';
  }
  document.getElementById('dstPrev').onclick = () => { pag--; pintar(); };
  document.getElementById('dstNext').onclick = () => { pag++; pintar(); };
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
