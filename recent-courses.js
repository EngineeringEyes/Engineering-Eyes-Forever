(function () {
  'use strict';

  /* Helper para escapar HTML y prevenir XSS */
  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  const courses = [
    {
      title:    'Revit 2025 Profesional',
      category: 'BIM & Arquitectura',
      status:   'NUEVO',
      update:   'Hace 3 horas',
      url:      'https://t.me/+xT9picqsAUI5MDAx',
      desc:     'Domina Revit 2025 desde cero hasta nivel profesional con proyectos reales.'
    },
    {
      title:    'Diseño Estructural Avanzado',
      category: 'Ingeniería Civil',
      status:   'ACTUALIZADO',
      update:   'Hoy',
      url:      'https://t.me/+xT9picqsAUI5MDAx',
      desc:     'Análisis y diseño estructural avanzado con ETABS y metodología práctica.'
    },
    {
      title:    'AutoCAD + Civil 3D',
      category: 'Infraestructura',
      status:   'TRENDING',
      update:   'Hace 1 día',
      url:      'https://t.me/+xT9picqsAUI5MDAx',
      desc:     'Diseño de infraestructura vial completo con Civil 3D 2025.'
    },
    {
      title:    'Hidrología e Hidráulica',
      category: 'Recursos Hídricos',
      status:   'NUEVO',
      update:   'Hace 2 días',
      url:      'https://t.me/+xT9picqsAUI5MDAx',
      desc:     'Cálculo hidrológico e hidráulico aplicado a proyectos de ingeniería civil.'
    }
  ];

  function renderCourses() {
    const container = document.getElementById('recent-courses-container');
    if (!container) return;

    /* Limpiar loader */
    container.innerHTML = '';

    if (!courses.length) {
      const msg = document.createElement('p');
      msg.className   = 'no-courses';
      msg.textContent = 'No hay cursos disponibles en este momento.';
      container.appendChild(msg);
      return;
    }

    courses.forEach(course => {
      /* Construir con DOM en lugar de innerHTML para evitar XSS */
      const card = document.createElement('div');
      card.className = 'recent-course-card';

      const glow = document.createElement('div');
      glow.className = 'course-glow';
      glow.setAttribute('aria-hidden', 'true');

      const top = document.createElement('div');
      top.className = 'course-top';

      const badge = document.createElement('span');
      badge.className   = 'course-badge';
      badge.textContent = course.status;

      const update = document.createElement('span');
      update.className   = 'course-update';
      update.textContent = course.update;

      top.appendChild(badge);
      top.appendChild(update);

      const content = document.createElement('div');
      content.className = 'course-content';

      const h3 = document.createElement('h3');
      h3.textContent = course.title;

      const p = document.createElement('p');
      p.textContent = course.category;

      content.appendChild(h3);
      content.appendChild(p);

      const footer = document.createElement('div');
      footer.className = 'course-footer';

      const btn = document.createElement('button');
      btn.type      = 'button';
      btn.className = 'course-button';
      btn.textContent = 'VER MÁS';
      btn.addEventListener('click', () => {
        window.open(course.url, '_blank', 'noopener,noreferrer');
      });

      footer.appendChild(btn);

      card.appendChild(glow);
      card.appendChild(top);
      card.appendChild(content);
      card.appendChild(footer);

      container.appendChild(card);
    });
  }

  /* Ejecutar cuando el DOM esté listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCourses);
  } else {
    renderCourses();
  }

})();