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

  { tag:"Asesoría", titulo:"Ingeniería Inversa", pen: 1000, unidad:"por hora",
    desc:"Necesitas liberar un binario? nosotros lo evaluaremos.",
    puntos:["IDA Pro · Ghidra","x64dbg · dnSpy","Analisis"],
    img:"https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80",
    color:"#f7d152", cta:"Agendar", url:"https://t.me/+xT9picqsAUI5MDAx" },

  { tag:"Modelado", titulo:"Modelado BIM", pen: 450, desde:true, unidad:"por proyecto",
    desc:"Modelamos tu proyecto en Revit con estándares BIM, planos coordinados y entregables listos para obra.",
    puntos:["Arquitectura y estructura","Planos automáticos","Archivo editable"],
    img:"https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80",
    color:"#e74c3c", cta:"Cotizar", url:"https://t.me/+xT9picqsAUI5MDAx" },

  { tag:"Cálculo", titulo:"Cálculo estructural", pen: 800, desde:true, unidad:"por proyecto",
    desc:"Análisis sísmico y diseño de elementos de concreto y acero, con memoria de cálculo y planos de armado.",
    puntos:["Memoria de cálculo","Planos de armado","Norma E.030"],
    img:"https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80",
    color:"#6fb8ff", cta:"Cotizar", url:"https://t.me/+xT9picqsAUI5MDAx" },

  { tag:"Capacitación", titulo:"Capacitación a medida", precio:"A convenir", unidad:"grupos",
    desc:"Programas de formación para equipos y universidades, adaptados al software y al nivel del grupo.",
    puntos:["Presencial o virtual","Material incluido","Certificado"],
    img:"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=80",
    color:"#9b59b6", cta:"Consultar", url:"https://t.me/+xT9picqsAUI5MDAx" }
];
