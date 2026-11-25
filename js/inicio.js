/* ==========================================================================
   Open After — Portada
   --------------------------------------------------------------------------
   Rellena las rejillas dinámicas y las fotos del hero desde el catálogo, para
   que la portada no quede desactualizada al cambiar productos.js.
   ========================================================================== */

(function () {
  "use strict";

  const { util, tarjeta } = window.OA;
  const { productos, rutaFoto, html, raw } = util;

  function destacados() {
    const marcados = productos().filter((p) => p.destacado && !p.agotado);
    // Si nadie está marcado como destacado, muestra los primeros disponibles.
    const base = marcados.length > 0 ? marcados : productos().filter((p) => !p.agotado);
    return base.slice(0, 4);
  }

  const novedades = () =>
    productos()
      .filter((p) => p.nuevo && !p.agotado)
      .slice(0, 4);

  function pintarRejilla(selector, lista, opciones) {
    const zona = document.querySelector(selector);
    if (!zona) return;

    // Sin nada que mostrar, se retira la sección completa en vez de dejar
    // un titular colgando sobre un hueco vacío.
    if (lista.length === 0) {
      const seccion = zona.closest("section");
      if (seccion) seccion.remove();
      return;
    }

    zona.innerHTML = tarjeta.rejilla(lista, opciones);
  }

  /* Las tres fotos del hero salen de los destacados, así el catálogo manda. */
  function pintarHero() {
    const zona = document.querySelector("[data-hero-fotos]");
    if (!zona) return;

    const elegidos = destacados();
    if (elegidos.length < 2) {
      zona.remove();
      return;
    }

    const [primero, segundo] = elegidos;

    zona.innerHTML = html`
      <figure class="hero__foto hero__foto--alta">
        <img
          src="${rutaFoto(primero, primero.colores[0].nombre, 1)}"
          alt="${primero.nombre}"
          width="600"
          height="1000"
          fetchpriority="high"
          decoding="async"
        />
      </figure>
      <figure class="hero__foto hero__foto--baja">
        <img
          src="${rutaFoto(segundo, segundo.colores[0].nombre, 1)}"
          alt="${segundo.nombre}"
          width="480"
          height="600"
          fetchpriority="high"
          decoding="async"
        />
      </figure>
    `;
  }

  /* La foto del bloque editorial: la pieza más cara del catálogo, que suele
     ser también la más fotogénica. */
  function pintarEditorial() {
    const zona = document.querySelector("[data-editorial-foto]");
    if (!zona) return;

    const insignia = productos()
      .slice()
      .sort((a, b) => b.precio - a.precio)[0];

    zona.innerHTML = html`
      <img
        src="${rutaFoto(
          insignia,
          insignia.colores[0].nombre,
          insignia.colores[0].fotos > 2 ? 3 : 1,
        )}"
        alt="${insignia.nombre}"
        width="640"
        height="800"
        loading="lazy"
        decoding="async"
      />
    `;
  }

  function pintarCuenta() {
    document.querySelectorAll("[data-cuenta-modelos]").forEach((nodo) => {
      nodo.textContent = String(productos().length);
    });
  }

  function iniciar() {
    pintarHero();
    pintarCuenta();
    pintarRejilla("[data-destacados]", destacados(), { prioridadHasta: 0 });
    pintarRejilla("[data-novedades]", novedades(), { prioridadHasta: 0 });
    pintarEditorial();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
