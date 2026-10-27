/* ═══════════════════════════════════════════════════════════════
   BUSCADOR GLOBAL — busca en todo data/catalogo.js
   · Resultados en vivo mientras escribes
   · Ignora tildes y mayúsculas ("cype" encuentra "CYPECAD")
   · Busca en nombre, desarrollador, categoría e insignias
   · Flechas ↑↓ para moverse, Enter para abrir, Esc para cerrar
   · Atajo "/" desde cualquier parte de la página
   · "Ver todos" lleva al catálogo con la búsqueda ya escrita
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const CAT = window.EE_CATALOGO || [];
  const inp = document.getElementById('busIn');
  const res = document.getElementById('busRes');
  if (!inp || !res || !CAT.length) return;

  const nTot = document.getElementById('busN');
  if (nTot) nTot.textContent = CAT.length;

  const esc = s => { const d = document.createElement('div'); d.textContent = String(s ?? ''); return d.innerHTML; };
  const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* El mismo monograma que usan las tarjetas, si inicio.js lo expone */
  const mono = window.EE_MONO || (n => String(n).slice(0, 2).toUpperCase());

  /* Índice: un texto por programa con todo lo buscable */
  const indice = CAT.map(c => ({
    c,
    nom: norm(c.nombre),
    todo: norm([c.nombre, c.dev, c.lista && c.lista.cat, c.categoria, (c.badges || []).join(' '), c.llave].join(' '))
  }));

  function buscar(q) {
    const t = norm(q).trim();
    if (!t) return [];
    const partes = t.split(/\s+/);
    return indice
      .filter(x => partes.every(p => x.todo.includes(p)))
      .map(x => ({ c: x.c, peso: x.nom.startsWith(t) ? 3 : x.nom.includes(t) ? 2 : 1 }))
      .sort((a, b) => b.peso - a.peso || (b.c.rating || 0) - (a.c.rating || 0))
      .map(x => x.c);
  }

  function resaltar(texto, q) {
    const t = norm(q).trim(); if (!t) return esc(texto);
    const i = norm(texto).indexOf(t);
    if (i < 0) return esc(texto);
    return esc(texto.slice(0, i)) + '<mark>' + esc(texto.slice(i, i + t.length)) + '</mark>' + esc(texto.slice(i + t.length));
  }

  function precio(c) {
    if (c.gratis) return '<span class="pill gratis">Gratis</span>';
    return `<span class="pill pago">S/ ${esc(c.pen)}</span>`;
  }

  let actual = [], sel = -1;

  function pintar() {
    const q = inp.value;
    actual = buscar(q);
    sel = actual.length ? 0 : -1;
    if (!q.trim()) { res.classList.remove('on'); return; }

    if (!actual.length) {
      res.innerHTML = `<div class="bus-vacio">No hay programas para «${esc(q)}». Prueba con el nombre, la marca o la categoría.</div>`;
      res.classList.add('on');
      return;
    }
    const top = actual.slice(0, 6);
    res.innerHTML =
      `<div class="bus-head"><span>${actual.length} resultado${actual.length === 1 ? '' : 's'}</span><span>↑↓ · Enter</span></div>` +
      top.map((c, i) =>
        `<div class="bus-item${i === sel ? ' act' : ''}" data-i="${i}" style="--ac:${esc(c.color)}">` +
          `<span class="app-ico">${esc(mono(c.nombre))}</span>` +
          `<div><div class="nm">${resaltar(c.nombre, q)}</div><div class="sb">${esc(c.dev)} · ${esc(c.lista.cat)}</div></div>` +
          precio(c) +
        `</div>`).join('') +
      `<button class="bus-todo" type="button">Ver los ${actual.length} resultados en el catálogo →</button>`;
    res.classList.add('on');
  }

  function marcar() {
    res.querySelectorAll('.bus-item').forEach(el => el.classList.toggle('act', Number(el.dataset.i) === sel));
  }

  /* Abrir un programa: en el sitio real abrirá su ficha (accordion) */
  function abrir(c) {
    res.classList.remove('on');
    if (typeof window.EE_ABRIR_FICHA === 'function') window.EE_ABRIR_FICHA(c.llave);
    else console.log('[buscador] abrir ficha:', c.llave);
  }

  /* Llevar la búsqueda al catálogo completo */
  function verTodos() {
    res.classList.remove('on');
    const cat = document.getElementById('swSearch');
    const sec = document.getElementById('softwares');
    if (cat) { cat.value = inp.value; cat.dispatchEvent(new Event('input', { bubbles: true })); }
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  inp.addEventListener('input', pintar);
  inp.addEventListener('focus', () => { if (inp.value.trim()) pintar(); });
  inp.addEventListener('keydown', e => {
    const n = Math.min(actual.length, 6);
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); sel = (sel + 1) % n; marcar(); }
    else if (e.key === 'ArrowUp' && n) { e.preventDefault(); sel = (sel - 1 + n) % n; marcar(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (sel >= 0 && actual[sel]) abrir(actual[sel]); else if (inp.value.trim()) verTodos(); }
    else if (e.key === 'Escape') { res.classList.remove('on'); inp.blur(); }
  });
  res.addEventListener('mousedown', e => {
    e.preventDefault();                                   /* que el input no pierda el foco */
    const it = e.target.closest('.bus-item');
    if (it) return abrir(actual[Number(it.dataset.i)]);
    if (e.target.closest('.bus-todo')) verTodos();
  });
  document.addEventListener('click', e => { if (!e.target.closest('.bus')) res.classList.remove('on'); });

  /* Atajo "/" para enfocar desde cualquier parte */
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); inp.focus(); }
  });

  document.getElementById('busGo').addEventListener('click', () => { if (inp.value.trim()) verTodos(); else inp.focus(); });

  /* Chips de categoría */
  document.querySelectorAll('.bus-chip').forEach(ch => ch.addEventListener('click', () => {
    inp.value = ch.dataset.q; inp.focus(); pintar();
  }));

  /* El buscador de la barra de navegación (hoy decorativo) usa este mismo motor */
  const nav = document.querySelector('.nav-search input');
  if (nav) {
    const ir = () => { inp.value = nav.value; document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => { inp.focus(); pintar(); }, 350); };
    nav.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ir(); } });
    document.querySelector('.nav-search-btn')?.addEventListener('click', ir);
  }
})();
