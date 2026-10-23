/* ═══════════════════════════════════════════════════════════════
   SERVICIOS — Engineering Eyes
   FUENTE ÚNICA. Edita SOLO este archivo para cambiar los servicios.

   ➕ AGREGAR UNO: copia un bloque { ... } y pégalo antes del ];
   🗑️ QUITAR UNO: borra su bloque.
   El carrusel se adapta solo a la cantidad que haya.

   Campos:
     tag     etiqueta de arriba
     titulo  nombre del servicio
     pen     PRECIO EN SOLES, solo el número: pen: 60
             El equivalente en dólares se calcula solo, con el mismo
             tipo de cambio y comisión del catálogo de software
             (window.EE_PRECIOS, en data/catalogo.js).
     desde   true → antepone "Desde" al precio
     precio  alternativa a `pen` para texto libre: "A convenir".
             Con `precio` NO se muestra el equivalente en dólares.
     unidad  letra pequeña junto al precio
     desc    uno o dos renglones
     puntos  viñetas (3 es lo que mejor entra)
     img     foto de fondo
     color   acento de la tarjeta (hex)
     cta     texto del botón
     url     a dónde lleva el botón
═══════════════════════════════════════════════════════════════ */
window.EE_SERVICIOS = [
  { tag:"Instalación", titulo:"Instalación remota", pen: 60, unidad:"por programa",
    desc:"Instalamos y configuramos el software en tu PC por acceso remoto, con prueba de funcionamiento incluida.",
    puntos:["Sesión 1 a 1","Verificación final","Soporte 7 días"],
    img:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
    color:"#00d4c8", cta:"Solicitar", url:"https://t.me/+xT9picqsAUI5MDAx" },

  { tag:"Asesoría", titulo:"Ingeniería Inversa", pen: 1000, unidad:".",
    desc:"Analizamos el binario o app que quieras liberar.",
    puntos:["ETABS · Ida pro","x64xgb · ghidra","Lo analizamos"],
    img:"https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80",
    color:"#f7d152", cta:"Agendar", url:"https://t.me/+xT9picqsAUI5MDAx" }

  /* ➕ Copia un bloque { ... } completo y pégalo aquí para añadir
     otro servicio. El carrusel se adapta a la cantidad que haya. */
];
