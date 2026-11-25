/* ==========================================================================
   Open After — Tarjeta de producto
   --------------------------------------------------------------------------
   Se usa en la portada, en el catálogo y en los relacionados de la ficha.
   Un solo sitio donde cambiar cómo se ve un bolso en una rejilla.
   ========================================================================== */

(function () {
  "use strict";

  const { html, raw, formatearPrecio, rutaFoto, rutaProducto } = window.OA.util;

  function insignia(producto) {
    if (producto.estado === "encargar") {
      return '<span class="insignia insignia--encargar">Por encargo</span>';
    }
    if (producto.nuevo) {
      return '<span class="insignia insignia--nuevo">Nuevo</span>';
    }
    return "";
  }

  /* Puntos de color bajo el nombre: igual que en la ficha, un color con
     "hex2" se pinta mitad y mitad. */
  function marcaColores(producto) {
    const puntos = producto.colores
      .map((c) => {
        const fondo = c.hex2
          ? `linear-gradient(135deg, ${c.hex} 50%, ${c.hex2} 50%)`
          : c.hex;
        return `<span class="tarjeta__color-punto" style="background: ${fondo}" title="${c.nombre}"></span>`;
      })
      .join("");

    const nombres = producto.colores.map((c) => c.nombre).join(", ");

    return html`
      <div class="tarjeta__colores" aria-label="Colores disponibles: ${nombres}">
        ${raw(puntos)}
      </div>
    `;
  }

  /* `prioridad` marca las primeras tarjetas visibles: sin lazy y con
     fetchpriority alto, para que la LCP no espere. El resto va perezoso. */
  function tarjeta(producto, { prioridad = false } = {}) {
    const primerColor = producto.colores[0];
    const tieneAlterna = primerColor.fotos > 1;
    const cargaPrincipal = prioridad
      ? 'loading="eager" fetchpriority="high"'
      : 'loading="lazy"';

    return html`
      <a
        class="tarjeta"
        href="${rutaProducto(producto)}"
        data-categoria="${producto.categoria}"
      >
        <div class="tarjeta__marco">
          ${raw(insignia(producto))}
          <img
            class="tarjeta__foto"
            src="${rutaFoto(producto, primerColor.nombre, 1)}"
            alt="${producto.nombre} en ${primerColor.nombre}"
            width="480"
            height="600"
            ${raw(cargaPrincipal)}
            decoding="async"
          />
          ${raw(
            tieneAlterna
              ? html`<img
                  class="tarjeta__foto tarjeta__foto--alterna"
                  src="${rutaFoto(producto, primerColor.nombre, 2)}"
                  alt=""
                  width="480"
                  height="600"
                  loading="lazy"
                  decoding="async"
                />`
              : "",
          )}
        </div>
        <div class="tarjeta__cuerpo">
          <h3 class="tarjeta__nombre">${producto.nombre}</h3>
          <span class="tarjeta__precio precio"
            >${formatearPrecio(producto.precio)}</span
          >
        </div>
        ${producto.colores.length > 1 ? raw(marcaColores(producto)) : ""}
        <p class="tarjeta__meta">${producto.categoria}</p>
      </a>
    `;
  }

  /* Las 4 primeras de cualquier rejilla se consideran sobre el pliegue. */
  const rejilla = (productos, { prioridadHasta = 4 } = {}) =>
    productos
      .map((p, i) => tarjeta(p, { prioridad: i < prioridadHasta }))
      .join("");

  window.OA.tarjeta = { tarjeta, rejilla };
})();
