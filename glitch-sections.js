(function () {
  'use strict';

  /* ── Helper XSS ── */
  function esc(str) {
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
  }

  /* ── Cursor centralizado — lee el anillo desde el DOM ── */
  function setCursorRing(size, color) {
    const ring = document.getElementById('cring');
    if (!ring) return;
    ring.style.width       = size + 'px';
    ring.style.height      = size + 'px';
    ring.style.borderColor = color || 'var(--teal)';
  }

  /* ── Fecha de cierre REAL de matrícula ──────────────────────────
     Antes era Date.now() + N días, así que el contador se reiniciaba
     en cada recarga y nunca llegaba a cero. Ahora es una fecha fija:
       cierra('2026-09-15')  →  15/09/2026 a las 23:59 hora local.
     ⚠️ Actualiza estas fechas cuando abras una nueva convocatoria;
        al pasarse, la tarjeta se marca como FINALIZADO sola.
  ─────────────────────────────────────────────────────────────── */
  function cierra(fechaISO) {
    return new Date(fechaISO + 'T23:59:59').getTime();
  }

  /* ══════════════════════════════════════
     DATOS — DIPLOMADOS
  ══════════════════════════════════════ */
  const diplomados = [
    {
      id: 1,
      name: 'Diplomado BIM Estructural',
      instructor: 'Ing. Carlos Mendoza',
      category: 'estructural',
      badge: 'badge-cy', badgeLabel: 'BIM',
      price: '$199',
      hours: '120h', level: 'Avanzado', seats: 8,
      img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80',
      desc: 'Domina Revit + ETABS 23 desde modelado hasta análisis sísmico completo con proyecto real de edificio multifamiliar.',
      features: ['Revit 2025/2026', 'ETABS 23', 'SAP2000', 'Certificado digital', 'Proyecto final', 'Soporte 6 meses'],
      endDate: cierra('2026-09-15')   /* cierre de matrícula */
    },
    {
      id: 2,
      name: 'Diplomado Geotécnico Avanzado',
      instructor: 'Ing. María Torres',
      category: 'geotecnia',
      badge: 'badge-ge', badgeLabel: 'GEO5',
      price: '$149',
      hours: '80h', level: 'Profesional', seats: 12,
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
      desc: 'GEO5 2025/2026 completo: cimentaciones, taludes, muros y análisis de estabilidad con casos reales.',
      features: ['GEO5 2025 + 2026', 'Análisis de estabilidad', 'Muros de contención', 'Reportes profesionales'],
      endDate: cierra('2026-09-30')
    },
    {
      id: 3,
      name: 'Maestría Civil 3D Infraestructura',
      instructor: 'Ing. Roberto Salas',
      category: 'infraestructura',
      badge: 'badge-mg', badgeLabel: 'CAD',
      price: '$229',
      hours: '140h', level: 'Máster', seats: 5,
      img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80',
      desc: 'Diseño de carreteras, intersecciones, movimiento de tierras y señalización con Civil 3D. Proyecto real incluido.',
      features: ['Civil 3D 2025', 'Diseño geométrico', 'Pavimentos', 'Señalización vial', 'Proyecto carretera'],
      endDate: cierra('2026-08-31')
    },
    {
      id: 4,
      name: 'Diplomado CYPECAD + Estructuras',
      instructor: 'Ing. Ana Villanueva',
      category: 'estructural',
      badge: 'badge-pu', badgeLabel: 'CYPE',
      price: '$179',
      hours: '96h', level: 'Intermedio', seats: 15,
      img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80',
      desc: 'Diseño y cálculo estructural con CYPECAD 2026: pórticos, losas, muros y exportación a BIM.',
      features: ['CYPECAD 2026.c', 'Diseño en concreto', 'Exportación BIM', 'Normativa NEC/NSR'],
      endDate: cierra('2026-10-15')
    },
    {
      id: 5,
      name: 'Diplomado AutoCAD para Ingeniería',
      instructor: 'Ing. Luis Paredes',
      category: 'cad',
      badge: 'badge-cy', badgeLabel: 'CAD',
      price: '$99',
      hours: '60h', level: 'Básico-Intermedio', seats: 20,
      img: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=400&q=80',
      desc: 'AutoCAD 2025 para ingeniería civil: planos estructurales, detalles, bloques dinámicos y layouts.',
      features: ['AutoCAD 2025', 'Bloques dinámicos', 'Layouts y plot', 'Planos estructurales'],
      endDate: cierra('2026-09-20')
    },
    {
      id: 6,
      name: 'Maestría Diseño Sísmico Avanzado',
      instructor: 'Ing. Jorge Castillo',
      category: 'estructural',
      badge: 'badge-mg', badgeLabel: 'SÍSMICO',
      price: '$249',
      hours: '160h', level: 'Experto', seats: 6,
      img: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?w=400&q=80',
      desc: 'Análisis tiempo-historia, diseño por desempeño y disipadores de energía con ETABS 23 y SAP2000.',
      features: ['ETABS 23', 'SAP2000', 'Análisis no lineal', 'Diseño por desempeño', 'Disipadores sísmicos'],
      endDate: cierra('2026-10-05')
    }
  ];

  /* ══════════════════════════════════════
     DATOS — INTERCAMBIOS
  ══════════════════════════════════════ */
  const intercambios = [
    {
      id: 1,
      name: 'Revit Estructural desde Cero',
      author: 'Pedro García',
      type: 'badge-cy', typeLabel: 'INTERCAMBIO',
      price: '$75', numPrice: 75,
      category: 'bim',
      img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80',
      tags: ['Revit', 'BIM', 'Estructural'],
      desc: 'Curso completo de Revit para ingeniería estructural.'
    },
    {
      id: 2,
      name: 'ETABS 23 Avanzado Completo',
      author: 'Sofía Romero',
      type: 'badge-mg', typeLabel: 'VENTA',
      price: '$95', numPrice: 95,
      category: 'estructural',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
      tags: ['ETABS', 'Sísmico', 'Concreto'],
      desc: 'Análisis y diseño estructural completo con ETABS 23.'
    },
    {
      id: 3,
      name: 'GEO5 Mastery 2025',
      author: 'Daniel Cruz',
      type: 'badge-ge', typeLabel: 'OFERTA',
      price: '$60', numPrice: 60,
      category: 'geotecnia',
      img: 'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?w=400&q=80',
      tags: ['GEO5', 'Geotecnia', 'Cimentaciones'],
      desc: 'Suite GEO5 2025 al completo con proyectos reales.'
    },
    {
      id: 4,
      name: 'Civil 3D Carreteras Pro',
      author: 'Isabella Mora',
      type: 'badge-cy', typeLabel: 'INTERCAMBIO',
      price: '$85', numPrice: 85,
      category: 'infraestructura',
      img: 'https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=400&q=80',
      tags: ['Civil 3D', 'Carreteras', 'Infraestructura'],
      desc: 'Diseño vial completo con Civil 3D: corredores, perfiles y volúmenes.'
    },
    {
      id: 5,
      name: 'CYPECAD 2026 Completo',
      author: 'Marco Quispe',
      type: 'badge-pu', typeLabel: 'SUBASTA',
      price: '$55', numPrice: 55,
      category: 'estructural',
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      tags: ['CYPECAD', 'Estructural', 'NEC'],
      desc: 'Cálculo estructural con CYPECAD 2026.c y normativa actualizada.'
    },
    {
      id: 6,
      name: 'SAP2000 Puentes y Estructuras',
      author: 'Valentina Herrera',
      type: 'badge-mg', typeLabel: 'VENTA',
      price: '$110', numPrice: 110,
      category: 'estructural',
      img: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=400&q=80',
      tags: ['SAP2000', 'Puentes', 'Análisis'],
      desc: 'SAP2000 para diseño de puentes y estructuras especiales.'
    },
    {
      id: 7,
      name: 'AutoCAD 2025 para Ingeniería',
      author: 'Andrés Vega',
      type: 'badge-ge', typeLabel: 'OFERTA',
      price: '$40', numPrice: 40,
      category: 'cad',
      img: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=400&q=80',
      tags: ['AutoCAD', 'CAD', 'Planos'],
      desc: 'AutoCAD profesional para planos de ingeniería civil.'
    },
    {
      id: 8,
      name: 'Maestría BIM + Coordinación',
      author: 'Camila Fuentes',
      type: 'badge-cy', typeLabel: 'INTERCAMBIO',
      price: '$130', numPrice: 130,
      category: 'bim',
      img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=80',
      tags: ['BIM', 'Coordinación', 'Navisworks'],
      desc: 'BIM Management, coordinación multidisciplinaria y clash detection.'
    }
  ];

  /* ══════════════════════════════════════
     PARTÍCULAS
  ══════════════════════════════════════ */
  /* Guardamos referencias a todos los intervalos para poder limpiarlos */
  const particleIntervals = [];

  function initParticles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const chars = '01アイウエオカキクケコ∇∆∫∑∞ABCDEF01';
    const count  = 20;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'cb-particle';
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
      el.style.left              = Math.random() * 100 + '%';
      el.style.top               = '-20px';
      el.style.animationDuration = (8 + Math.random() * 14) + 's';
      el.style.animationDelay    = (Math.random() * 8) + 's';
      el.style.fontSize          = (9 + Math.floor(Math.random() * 6)) + 'px';
      el.style.opacity           = (0.1 + Math.random() * 0.2).toString();
      container.appendChild(el);
      const iv = setInterval(() => {
        el.textContent = chars[Math.floor(Math.random() * chars.length)];
      }, 1200 + Math.random() * 2000);
      particleIntervals.push(iv);
    }
  }

  /* ══════════════════════════════════════
     RIPPLE NEON
  ══════════════════════════════════════ */
  function addRipple(e, btn) {
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');
    ripple.className  = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  /* ══════════════════════════════════════
     CONTADORES REGRESIVOS
     — Se llama UNA SOLA VEZ tras render,
       con cleanup de intervalos previos
  ══════════════════════════════════════ */
  const countdownIntervals = [];

  function clearCountdowns() {
    countdownIntervals.forEach(clearInterval);
    countdownIntervals.length = 0;
  }

  function startCountdowns() {
    clearCountdowns();   /* limpia antes de crear nuevos */
    document.querySelectorAll('[data-countdown]').forEach(el => {
      const endTime = parseInt(el.dataset.countdown);

      function update() {
        const diff = Math.max(0, endTime - Date.now());
        if (diff === 0) {
          el.textContent   = 'FINALIZADO';
          el.style.color   = '#ff0055';
          el.closest('.dip-card')?.classList.add('expired');
          clearInterval(iv);
          return;
        }
        /* Con fechas reales el margen suele ser de semanas: "360:00:00"
           no se entiende, así que sacamos los días aparte. */
        const d  = Math.floor(diff / 86400000);
        const h  = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        const m  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s  = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        el.textContent = d > 0 ? `${d}d ${h}:${m}:${s}` : `${h}:${m}:${s}`;
      }

      update();
      const iv = setInterval(update, 1000);
      countdownIntervals.push(iv);
    });
  }

  /* ══════════════════════════════════════
     MODAL CYBERPUNK
  ══════════════════════════════════════ */
  function openCbModal(data) {
    const overlay = document.getElementById('cbModalOverlay');
    if (!overlay) return;

    /* Usar textContent para evitar XSS */
    const tagEl        = document.getElementById('cbModalTag');
    const titleEl      = document.getElementById('cbModalTitle');
    const instructorEl = document.getElementById('cbModalInstructor');
    const descEl       = document.getElementById('cbModalDesc');
    const priceEl      = document.getElementById('cbModalPrice');
    const featsEl      = document.getElementById('cbModalFeats');

    if (tagEl)        tagEl.textContent        = data.badgeLabel || data.typeLabel || 'CURSO';
    if (titleEl)      titleEl.textContent      = data.name;
    if (instructorEl) instructorEl.textContent = data.instructor || data.author || '';
    if (descEl)       descEl.textContent       = data.desc;
    if (priceEl)      priceEl.textContent      = data.price;

    if (featsEl) {
      const feats = data.features || data.tags || [];
      /* Construir en un solo paso para evitar re-parseo en bucle */
      featsEl.innerHTML = feats
        .map(f => `<div class="cb-modal-feat"><i class="ti ti-check" aria-hidden="true"></i>${esc(f)}</div>`)
        .join('');
    }

    overlay.classList.add('open');

    /* Re-lanzar animación de entrada usando Web Animations API */
    const modal = overlay.querySelector('.cb-modal');
    if (modal) {
      modal.getAnimations().forEach(a => { a.cancel(); a.play(); });
    }
  }

  function closeCbModal() {
    document.getElementById('cbModalOverlay')?.classList.remove('open');
  }

  /* ══════════════════════════════════════
     RENDER — DIPLOMADOS
  ══════════════════════════════════════ */
  function renderDiplomados(data) {
    const grid = document.getElementById('dipGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const noResults = document.getElementById('dipNoResults');

    if (data.length === 0) {
      if (noResults) noResults.classList.add('visible');
      return;
    }
    if (noResults) noResults.classList.remove('visible');

    data.forEach(d => {
      const card = document.createElement('div');
      card.className       = 'dip-card glitch-hover';
      card.dataset.category = d.category;
      card.setAttribute('role', 'listitem');

      /* innerHTML con esc() para datos de texto */
      card.innerHTML = `
        <div class="dip-card-img scanlines-cb">
          <img src="${esc(d.img)}" alt="${esc(d.name)}" loading="lazy">
          <div class="dip-img-glitch" aria-hidden="true"></div>
          <span class="dip-cat-badge ${esc(d.badge)}">${esc(d.badgeLabel)}</span>
          <div class="dip-countdown" data-countdown="${d.endDate}" aria-label="Cuenta regresiva">--:--:--</div>
        </div>
        <div class="dip-card-body">
          <div class="dip-card-name">${esc(d.name)}</div>
          <div class="dip-card-instructor">
            <i class="ti ti-user" aria-hidden="true"></i>${esc(d.instructor)}
          </div>
          <div class="dip-card-info">
            <span class="dip-info-tag">${esc(d.hours)}</span>
            <span class="dip-info-tag">${esc(d.level)}</span>
            <span class="dip-info-tag">${esc(String(d.seats))} plazas</span>
          </div>
          <div class="dip-card-footer">
            <div>
              <div class="dip-price">${esc(d.price)}</div>
              <div class="dip-price-label">inversión total</div>
            </div>
            <button type="button" class="dip-btn glitch-active" data-id="${d.id}" aria-label="Asegurar plaza en ${esc(d.name)}">
              Asegurar Plaza
            </button>
          </div>
        </div>
      `;

      /* Eventos */
      card.addEventListener('click', e => {
        if (!e.target.closest('.dip-btn')) openCbModal(d);
      });

      const btn = card.querySelector('.dip-btn');
      if (btn) {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          addRipple(e, btn);
          setTimeout(() => openCbModal(d), 150);
        });
      }

      /* Cursor ring */
      card.addEventListener('mouseenter', () => setCursorRing(52, 'var(--mg)'));
      card.addEventListener('mouseleave', () => setCursorRing(28, 'var(--teal)'));

      grid.appendChild(card);
    });

    startCountdowns();
  }

  /* Filtros diplomados */
  let dipActiveFilter = 'all';
  let dipSearchQuery  = '';

  function filterDiplomados() {
    let result = diplomados;
    if (dipActiveFilter !== 'all') {
      result = result.filter(d => d.category === dipActiveFilter);
    }
    if (dipSearchQuery) {
      const q = dipSearchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.instructor.toLowerCase().includes(q) ||
        d.category.includes(q)
      );
    }
    renderDiplomados(result);
  }

  function initDiplomados() {
    renderDiplomados(diplomados);

    document.querySelectorAll('.dip-filter').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.dip-filter').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        dipActiveFilter = this.dataset.filter;
        filterDiplomados();
      });
    });

    const search = document.getElementById('dipSearch');
    if (search) {
      search.addEventListener('input', function () {
        dipSearchQuery = this.value.trim();
        filterDiplomados();
      });
    }

    const searchBtn = document.getElementById('dipSearchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', e => {
        addRipple(e, searchBtn);
        filterDiplomados();
      });
    }
  }

  /* ══════════════════════════════════════
     RENDER — INTERCAMBIOS
  ══════════════════════════════════════ */
  function renderIntercambios(data) {
    const grid = document.getElementById('interGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const noResults = document.getElementById('interNoResults');

    if (data.length === 0) {
      if (noResults) noResults.classList.add('visible');
      return;
    }
    if (noResults) noResults.classList.remove('visible');

    data.forEach(d => {
      const card = document.createElement('div');
      card.className        = 'inter-card glitch-hover';
      card.dataset.category = d.category;
      card.setAttribute('role', 'listitem');

      const tagsHtml = d.tags.map(t => `<span class="inter-tag">${esc(t)}</span>`).join('');

      card.innerHTML = `
        <div class="inter-card-img scanlines-cb">
          <img src="${esc(d.img)}" alt="${esc(d.name)}" loading="lazy">
          <span class="inter-type-badge ${esc(d.type)}">${esc(d.typeLabel)}</span>
          <button type="button" class="inter-fav glitch-active" aria-label="Añadir a favoritos" aria-pressed="false">
            <i class="ti ti-star" aria-hidden="true"></i>
          </button>
        </div>
        <div class="inter-card-body">
          <div class="inter-card-name">${esc(d.name)}</div>
          <div class="inter-card-author">
            <i class="ti ti-user-circle" aria-hidden="true"></i>${esc(d.author)}
          </div>
          <div class="inter-card-tags">${tagsHtml}</div>
          <div class="inter-card-footer">
            <div class="inter-price-wrap">
              <div class="inter-price">${esc(d.price)}</div>
              <div class="inter-price-label">precio actual</div>
            </div>
            <button type="button" class="inter-btn glitch-active" data-id="${d.id}" aria-label="Hacer oferta por ${esc(d.name)}">
              <span>Hacer Oferta</span>
            </button>
          </div>
        </div>
      `;

      /* Favorito */
      const favBtn = card.querySelector('.inter-fav');
      if (favBtn) {
        favBtn.addEventListener('click', e => {
          e.stopPropagation();
          const active = favBtn.classList.toggle('active');
          favBtn.setAttribute('aria-pressed', String(active));
          const icon = favBtn.querySelector('i');
          if (icon) icon.className = active ? 'ti ti-star-filled' : 'ti ti-star';
        });
      }

      /* Click card */
      card.addEventListener('click', e => {
        if (!e.target.closest('.inter-btn') && !e.target.closest('.inter-fav')) {
          openCbModal(d);
        }
      });

      /* Click botón oferta */
      const ofertaBtn = card.querySelector('.inter-btn');
      if (ofertaBtn) {
        ofertaBtn.addEventListener('click', e => {
          e.stopPropagation();
          addRipple(e, ofertaBtn);
          setTimeout(() => openCbModal(d), 150);
        });
      }

      /* Cursor ring */
      card.addEventListener('mouseenter', () => setCursorRing(52, 'var(--mg)'));
      card.addEventListener('mouseleave', () => setCursorRing(28, 'var(--teal)'));

      grid.appendChild(card);
    });
  }

  /* Filtros intercambios */
  let interActiveFilter = 'all';
  let interSearchQuery  = '';
  let interSort         = 'default';

  function filterIntercambios() {
    let result = [...intercambios];
    if (interActiveFilter !== 'all') {
      result = result.filter(d => d.category === interActiveFilter);
    }
    if (interSearchQuery) {
      const q = interSearchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.author.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (interSort === 'price-asc')  result.sort((a, b) => a.numPrice - b.numPrice);
    if (interSort === 'price-desc') result.sort((a, b) => b.numPrice - a.numPrice);
    renderIntercambios(result);
  }

  function initIntercambios() {
    renderIntercambios(intercambios);

    document.querySelectorAll('.inter-filter').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.inter-filter').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        interActiveFilter = this.dataset.filter;
        filterIntercambios();
      });
    });

    const search = document.getElementById('interSearch');
    if (search) {
      search.addEventListener('input', function () {
        interSearchQuery = this.value.trim();
        filterIntercambios();
      });
    }

    const sort = document.getElementById('interSort');
    if (sort) {
      sort.addEventListener('change', function () {
        interSort = this.value;
        filterIntercambios();
      });
    }

    const publishBtn = document.getElementById('publishBtn');
    if (publishBtn) {
      publishBtn.addEventListener('click', e => addRipple(e, publishBtn));
    }
  }

  /* ══════════════════════════════════════
     INIT GENERAL
  ══════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initParticles('dipParticles');
    initParticles('interParticles');

    initDiplomados();
    initIntercambios();

    /* Modal */
    const overlay   = document.getElementById('cbModalOverlay');
    const closeBtn  = document.getElementById('cbModalClose');
    if (overlay)  overlay.addEventListener('click', e => { if (e.target === overlay) closeCbModal(); });
    if (closeBtn) closeBtn.addEventListener('click', closeCbModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCbModal(); });

    /* Ripple en botones globales de diplomados/intercambios */
    document.querySelectorAll('.dip-btn, .inter-btn, .inter-publish-btn').forEach(btn => {
      btn.addEventListener('click', e => addRipple(e, btn));
    });
  });

})();