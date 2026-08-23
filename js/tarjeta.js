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
    if (producto.agotado) {
      return '<span class="insignia insignia--agotado">Agotado</span>';
    }
    if (producto.nuevo) {
      return '<span class="insignia insignia--nuevo">Nuevo</span>';
    }
    return "";
  }

  /* `prioridad` marca las primeras tarjetas visibles: sin lazy y con
     fetchpriority alto, para que la LCP no espere. El resto va perezoso. */
  function tarjeta(producto, { prioridad = false } = {}) {
    const tieneAlterna = producto.fotos > 1;
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
            src="${rutaFoto(producto, 1)}"
            alt="${producto.nombre} en ${producto.colores[0].nombre}"
            width="480"
            height="600"
            ${raw(cargaPrincipal)}
            decoding="async"
          />
          ${raw(
            tieneAlterna
              ? html`<img
                  class="tarjeta__foto tarjeta__foto--alterna"
                  src="${rutaFoto(producto, 2)}"
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
        <p class="tarjeta__meta">
          ${producto.categoria} ·
          ${producto.colores.length}
          ${producto.colores.length === 1 ? "color" : "colores"}
        </p>
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
