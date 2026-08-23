/* ==========================================================================
   Open After — Cabecera y pie compartidos
   --------------------------------------------------------------------------
   Cada página declara <div data-slot="encabezado"> y <div data-slot="pie">;
   aquí se rellenan. Así el header y el footer se escriben una sola vez.
   ========================================================================== */

(function () {
  "use strict";

  const { config, iconos } = window.OA;
  const { html, raw, ruta } = window.OA.util;

  const enlaces = [
    { texto: "Inicio", href: ruta("index.html"), clave: "inicio" },
    { texto: "Catálogo", href: ruta("catalogo.html"), clave: "catalogo" },
    { texto: "La marca", href: ruta("index.html#la-marca"), clave: "marca" },
  ];

  /* Cada página declara data-pagina en el <html> para marcar su enlace. */
  const paginaActual = document.documentElement.dataset.pagina || "";

  /* --- Cabecera ------------------------------------------------------------- */

  function marcaHeader() {
    const items = enlaces
      .map(
        (e) => html`
          <a
            href="${e.href}"
            ${raw(e.clave === paginaActual ? 'aria-current="page"' : "")}
            >${e.texto}</a
          >
        `,
      )
      .join("");

    return html`
      <a class="saltar-a-contenido" href="#contenido">Saltar al contenido</a>
      <header class="encabezado" data-desplazado="false">
        <div class="contenedor encabezado__barra">
          <a class="marca" href="${ruta("index.html")}">
            <span class="marca__nombre">${config.marca}</span>
            <span class="marca__sub">${config.producto}</span>
          </a>

          <nav class="nav-principal" aria-label="Navegación principal" data-abierto="false">
            ${raw(items)}
          </nav>

          <div class="encabezado__acciones">
            <a
              class="btn-icono"
              href="${ruta("catalogo.html")}"
              aria-label="Buscar en el catálogo"
              data-solo-movil-buscar
            >
              ${raw(iconos.buscar)}
            </a>
            <button
              class="btn-icono"
              type="button"
              data-abrir-carrito
              aria-label="Abrir el carrito"
            >
              ${raw(iconos.bolsa)}
              <span class="contador-carrito" data-contador-carrito hidden>0</span>
            </button>
            <button
              class="btn-icono btn-menu"
              type="button"
              data-alternar-menu
              aria-expanded="false"
              aria-label="Abrir el menú"
            >
              ${raw(iconos.menu)}
            </button>
          </div>
        </div>
      </header>
    `;
  }

  /* --- Pie ------------------------------------------------------------------ */

  function marcaPie() {
    const categorias = window.OA.util
      .categorias()
      .map(
        (c) => html`
          <li>
            <a href="${ruta(`catalogo.html?categoria=${encodeURIComponent(c)}`)}"
              >${c}</a
            >
          </li>
        `,
      )
      .join("");

    const anio = new Date().getFullYear();

    return html`
      <footer class="pie">
        <div class="contenedor">
          <div class="pie__rejilla">
            <div>
              <p class="marca__nombre" style="font-size: 1.5rem">
                ${config.marca}
              </p>
              <p
                style="color: var(--c-ink-soft); font-size: var(--text-small); max-width: 26ch; margin-top: var(--space-2xs)"
              >
                ${config.descripcionCorta}
              </p>
            </div>

            <div>
              <p class="pie__titulo">Catálogo</p>
              <ul class="pie__lista" role="list">
                ${raw(categorias)}
                <li>
                  <a href="${ruta("catalogo.html")}">Ver todo</a>
                </li>
              </ul>
            </div>

            <div>
              <p class="pie__titulo">Contacto</p>
              <ul class="pie__lista" role="list">
                <li>
                  <a href="${window.OA.whatsapp.enlaceGeneral()}" target="_blank" rel="noopener"
                    >WhatsApp</a
                  >
                </li>
                <li>
                  <a
                    href="https://instagram.com/${config.contacto.instagram}"
                    target="_blank"
                    rel="noopener"
                    >@${config.contacto.instagram}</a
                  >
                </li>
                <li>
                  <a href="mailto:${config.contacto.email}"
                    >${config.contacto.email}</a
                  >
                </li>
                <li>${config.contacto.ciudad}</li>
              </ul>
            </div>

            <div>
              <p class="pie__titulo">Envíos</p>
              <p style="font-size: var(--text-small); color: var(--c-ink-soft)">
                ${config.envio.nota}
              </p>
              <a
                class="btn btn--whatsapp"
                style="margin-top: var(--space-sm)"
                href="${window.OA.whatsapp.enlaceGeneral()}"
                target="_blank"
                rel="noopener"
              >
                ${raw(iconos.whatsapp)} Escríbenos
              </a>
            </div>
          </div>

          <div class="pie__base">
            <span>© ${anio} ${config.marca}. Bolsos ${config.producto}.</span>
            <span>Pedidos por WhatsApp · Sin pago en línea</span>
          </div>
        </div>
      </footer>
    `;
  }

  /* --- Comportamiento -------------------------------------------------------- */

  function activarSombraAlDesplazar(encabezado) {
    /* Un centinela de 1px arriba del todo evita escuchar el evento scroll:
       IntersectionObserver no dispara en cada píxel. */
    const centinela = document.createElement("div");
    centinela.setAttribute("aria-hidden", "true");
    centinela.style.cssText = "position:absolute;top:0;height:1px;width:1px";
    document.body.prepend(centinela);

    new IntersectionObserver(
      ([entrada]) => {
        encabezado.dataset.desplazado = String(!entrada.isIntersecting);
      },
      { threshold: 0 },
    ).observe(centinela);
  }

  function activarMenuMovil() {
    const boton = document.querySelector("[data-alternar-menu]");
    const nav = document.querySelector(".nav-principal");
    if (!boton || !nav) return;

    const alternar = (abrir) => {
      nav.dataset.abierto = String(abrir);
      boton.setAttribute("aria-expanded", String(abrir));
      boton.setAttribute("aria-label", abrir ? "Cerrar el menú" : "Abrir el menú");
      boton.innerHTML = abrir ? window.OA.iconos.cerrar : window.OA.iconos.menu;
    };

    boton.addEventListener("click", () => {
      alternar(nav.dataset.abierto !== "true");
    });

    /* Al navegar a un ancla de la misma página el menú debe cerrarse solo. */
    nav.addEventListener("click", (evento) => {
      if (evento.target.closest("a")) alternar(false);
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && nav.dataset.abierto === "true") {
        alternar(false);
        boton.focus();
      }
    });
  }

  function montar() {
    const ranuraEncabezado = document.querySelector('[data-slot="encabezado"]');
    const ranuraPie = document.querySelector('[data-slot="pie"]');

    if (ranuraEncabezado) ranuraEncabezado.outerHTML = marcaHeader();
    if (ranuraPie) ranuraPie.outerHTML = marcaPie();

    const encabezado = document.querySelector(".encabezado");
    if (encabezado) activarSombraAlDesplazar(encabezado);
    activarMenuMovil();

    /* Cualquier botón marcado en el HTML recibe el enlace de WhatsApp, así
       las páginas no tienen que conocer el número. */
    document.querySelectorAll("[data-cta-whatsapp]").forEach((nodo) => {
      nodo.href = window.OA.whatsapp.enlaceGeneral();
    });

    document.dispatchEvent(new CustomEvent("oa:layout-listo"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", montar);
  } else {
    montar();
  }
})();
