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
     "hex2" se pinta mitad y mitad. Van FUERA del <a> de la tarjeta (ver
     tarjeta()) para poder hacer clic en un punto sin navegar a la ficha.
     data-nombre alimenta el tooltip propio de css/componentes.css (el
     title nativo tarda en aparecer y casi no se ve en móvil). */
  function marcaColores(producto) {
    const puntos = producto.colores
      .map((c, i) => {
        const fondo = c.hex2
          ? `linear-gradient(135deg, ${c.hex} 50%, ${c.hex2} 50%)`
          : c.hex;
        return html`
          <button
            class="tarjeta__color-punto"
            type="button"
            style="background: ${fondo}"
            aria-label="Ver en ${c.nombre}"
            aria-pressed="${String(i === 0)}"
            data-nombre="${c.nombre}"
            data-foto="${rutaFoto(producto, c.nombre, 1)}"
            data-alt="${producto.nombre} en ${c.nombre}"
          ></button>
        `;
      })
      .join("");

    return html`<div class="tarjeta__colores">${raw(puntos)}</div>`;
  }

  /* `prioridad` marca las primeras tarjetas visibles: sin lazy y con
     fetchpriority alto, para que la LCP no espere. El resto va perezoso. */
  function tarjeta(producto, { prioridad = false } = {}) {
    const primerColor = producto.colores[0];
    const cargaPrincipal = prioridad
      ? 'loading="eager" fetchpriority="high"'
      : 'loading="lazy"';

    return html`
      <div class="tarjeta">
        <a class="tarjeta__enlace" href="${rutaProducto(producto)}">
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
          </div>
          <div class="tarjeta__cuerpo">
            <h3 class="tarjeta__nombre">${producto.nombre}</h3>
            <span class="tarjeta__precio precio"
              >${formatearPrecio(producto.precio)}</span
            >
          </div>
        </a>
        ${producto.colores.length > 1 ? raw(marcaColores(producto)) : ""}
        <p class="tarjeta__meta">${producto.categoria}</p>
      </div>
    `;
  }

  /* Las 4 primeras de cualquier rejilla se consideran sobre el pliegue. */
  const rejilla = (productos, { prioridadHasta = 4 } = {}) =>
    productos
      .map((p, i) => tarjeta(p, { prioridad: i < prioridadHasta }))
      .join("");

  /* Las fotos de los demás colores no se piden hasta que se hace clic en
     su punto: la primera vez tarda porque el navegador recién las está
     descargando. Una vez la página está en reposo (sin pelear por ancho
     de banda con las fotos principales), se precargan todas en silencio
     para que el cambio de color se sienta instantáneo. */
  function precargarFotosDeColores() {
    const rutas = new Set();
    document.querySelectorAll(".tarjeta__color-punto[data-foto]").forEach((p) => {
      rutas.add(p.dataset.foto);
    });
    rutas.forEach((ruta) => {
      new Image().src = ruta;
    });
  }

  window.addEventListener("load", () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(precargarFotosDeColores);
    } else {
      setTimeout(precargarFotosDeColores, 500);
    }
  });

  /* Un solo listener delegado para toda la página: funciona sin importar
     cuántas veces se repinte una rejilla (catálogo, portada, relacionados). */
  document.addEventListener("click", (evento) => {
    const punto = evento.target.closest(".tarjeta__color-punto");
    if (!punto) return;

    evento.preventDefault();

    const tarjetaEl = punto.closest(".tarjeta");
    const foto = tarjetaEl?.querySelector(".tarjeta__foto");
    if (!foto) return;

    foto.src = punto.dataset.foto;
    foto.alt = punto.dataset.alt;

    tarjetaEl.querySelectorAll(".tarjeta__color-punto").forEach((p) => {
      p.setAttribute("aria-pressed", String(p === punto));
    });
  });

  window.OA.tarjeta = { tarjeta, rejilla };
})();
