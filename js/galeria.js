/* ==========================================================================
   Open After — Galería de producto
   --------------------------------------------------------------------------
   Zoom sin librerías: se mueve el background-position del marco, que es una
   propiedad que el compositor puede resolver sin recalcular layout.

   Las fotos viven en un carrusel con scroll-snap nativo: eso da swipe táctil
   real sin JS de gestos. "mostrar(i)" desplaza el carrusel a esa foto; un
   listener de scroll detecta cuando el usuario desliza a mano y sincroniza
   el resto (miniaturas/puntos, lightbox) sin volver a disparar el scroll.

   Cada color del producto trae su propia tanda de fotos, así que la galería
   expone `actualizar(nuevasFotos)` para repintarse cuando se elige otro color
   sin reconstruir la ficha entera.
   ========================================================================== */

(function () {
  "use strict";

  const { html, raw, atraparFoco } = window.OA.util;
  const { iconos } = window.OA;

  const ZOOM = 2.1; // debe coincidir con background-size en paginas.css

  function crear(contenedor, fotosIniciales, nombreProducto) {
    if (fotosIniciales.length === 0) return null;

    let fotos = fotosIniciales;
    let indice = 0;
    let marco;
    let carrusel;
    let lightbox = null;
    let ultimoFoco = null;

    /* --- Pintado ------------------------------------------------------------
       Se puede llamar más de una vez: al cambiar de color, el marco y las
       miniaturas se reconstruyen desde cero con la nueva tanda de fotos. */

    function pintar() {
      const diapositivas = fotos
        .map(
          (src, i) => html`
            <img
              class="galeria__foto"
              src="${src}"
              alt="${nombreProducto}, foto ${i + 1} de ${fotos.length}"
              width="800"
              height="1000"
              loading="${i === 0 ? "eager" : "lazy"}"
              fetchpriority="${i === 0 ? "high" : "auto"}"
              decoding="async"
            />
          `,
        )
        .join("");

      const miniaturas = fotos
        .map(
          (src, i) => html`
            <button
              class="miniatura"
              type="button"
              data-indice="${i}"
              aria-current="${String(i === 0)}"
              aria-label="Ver foto ${i + 1} de ${fotos.length}"
            >
              <img
                src="${src}"
                alt=""
                width="96"
                height="96"
                loading="lazy"
                decoding="async"
              />
            </button>
          `,
        )
        .join("");

      contenedor.innerHTML = html`
        <div class="galeria">
          <div
            class="galeria__marco"
            data-marco
            data-zoom="false"
            role="button"
            tabindex="0"
            aria-label="Ampliar la foto de ${nombreProducto}"
          >
            <div class="galeria__carrusel" data-carrusel>
              ${raw(diapositivas)}
            </div>
            <span class="galeria__pista">${raw(iconos.lupaMas)} Ampliar</span>
          </div>
          ${raw(
            fotos.length > 1
              ? html`<div class="galeria__miniaturas">${raw(miniaturas)}</div>`
              : "",
          )}
        </div>
      `;

      marco = contenedor.querySelector("[data-marco]");
      carrusel = contenedor.querySelector("[data-carrusel]");
      conectarMarco();
      conectarCarrusel();
    }

    /* --- Cambio de foto ---------------------------------------------------- */

    /* Actualiza miniaturas/lightbox para la foto actual, sin mover el
       carrusel: lo usan tanto `mostrar()` como el listener de scroll. */
    function sincronizar() {
      marco.style.backgroundImage = "";
      marco.dataset.zoom = "false";

      contenedor.querySelectorAll(".miniatura").forEach((boton) => {
        boton.setAttribute(
          "aria-current",
          String(Number(boton.dataset.indice) === indice),
        );
      });

      if (lightbox) actualizarLightbox();
    }

    /* Para saltar a una foto a propósito: clic en miniatura/punto, flechas
       de teclado o los botones del lightbox. Desliza el carrusel y listo:
       el listener de scroll no hace nada porque el índice ya va a coincidir. */
    function mostrar(nuevo) {
      indice = (nuevo + fotos.length) % fotos.length;
      carrusel.scrollTo({
        left: indice * carrusel.clientWidth,
        behavior: "smooth",
      });
      sincronizar();
    }

    /* Detecta cuando el usuario desliza el carrusel con el dedo o el mouse,
       sin pasar por `mostrar()` (así no reinicia el propio scroll). */
    function conectarCarrusel() {
      let pendiente;
      carrusel.addEventListener("scroll", () => {
        clearTimeout(pendiente);
        pendiente = setTimeout(() => {
          const nuevo = Math.round(carrusel.scrollLeft / carrusel.clientWidth);
          if (nuevo !== indice && nuevo >= 0 && nuevo < fotos.length) {
            indice = nuevo;
            sincronizar();
          }
        }, 100);
      });
    }

    /* Cambia a otro color: nuevas fotos, se vuelve a la primera y se cierra
       cualquier lightbox abierto (sus botones de navegación quedarían
       referenciando la tanda anterior). */
    function actualizar(nuevasFotos) {
      if (nuevasFotos.length === 0) return;
      cerrarLightbox();
      if (lightbox) {
        lightbox.remove();
        lightbox = null;
      }
      fotos = nuevasFotos;
      indice = 0;
      pintar();
    }

    contenedor.addEventListener("click", (evento) => {
      const mini = evento.target.closest(".miniatura");
      if (mini) mostrar(Number(mini.dataset.indice));
    });

    /* --- Zoom al pasar el cursor -------------------------------------------
       Solo con puntero fino: en táctil un "hover" sintético dejaría la imagen
       ampliada y trabada. */

    const punteroFino = window.matchMedia("(hover: hover) and (pointer: fine)");

    function moverZoom(evento) {
      const caja = marco.getBoundingClientRect();
      const x = ((evento.clientX - caja.left) / caja.width) * 100;
      const y = ((evento.clientY - caja.top) / caja.height) * 100;

      // Compensa la escala para que el borde de la imagen coincida con el
      // borde del marco en los extremos.
      const factor = ZOOM / (ZOOM - 1);
      marco.style.backgroundPosition = `${x * factor - (factor - 1) * 50}% ${
        y * factor - (factor - 1) * 50
      }%`;
    }

    function activarZoom() {
      if (!punteroFino.matches) return;
      marco.style.backgroundImage = `url("${fotos[indice]}")`;
      marco.dataset.zoom = "true";
    }

    function desactivarZoom() {
      marco.dataset.zoom = "false";
    }

    /* Vuelve a enganchar los eventos propios del marco cada vez que se
       repinta, porque `pintar()` lo reemplaza por un nodo nuevo. */
    function conectarMarco() {
      marco.addEventListener("pointerenter", (evento) => {
        if (evento.pointerType !== "mouse") return;
        activarZoom();
        moverZoom(evento);
      });

      marco.addEventListener("pointermove", (evento) => {
        if (evento.pointerType !== "mouse" || marco.dataset.zoom !== "true") return;
        moverZoom(evento);
      });

      marco.addEventListener("pointerleave", desactivarZoom);
      marco.addEventListener("click", abrirLightbox);
      marco.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
          evento.preventDefault();
          abrirLightbox();
        }
      });
    }

    /* --- Lightbox ------------------------------------------------------------ */

    function construirLightbox() {
      const nodo = document.createElement("div");
      nodo.className = "lightbox";
      nodo.dataset.abierto = "false";
      nodo.setAttribute("role", "dialog");
      nodo.setAttribute("aria-modal", "true");
      nodo.setAttribute("aria-label", `Fotos de ${nombreProducto}`);
      nodo.innerHTML = html`
        <button
          class="btn-icono lightbox__cerrar"
          type="button"
          data-cerrar
          aria-label="Cerrar"
        >
          ${raw(iconos.cerrar)}
        </button>
        ${raw(
          fotos.length > 1
            ? html`
                <button
                  class="btn-icono lightbox__nav lightbox__nav--prev"
                  type="button"
                  data-prev
                  aria-label="Foto anterior"
                >
                  ${raw(iconos.flechaIzq)}
                </button>
                <button
                  class="btn-icono lightbox__nav lightbox__nav--next"
                  type="button"
                  data-next
                  aria-label="Foto siguiente"
                >
                  ${raw(iconos.flechaDer)}
                </button>
              `
            : "",
        )}
        <div class="lightbox__lienzo">
          <img data-lightbox-img src="${fotos[indice]}" alt="" />
        </div>
        <p class="lightbox__contador" data-lightbox-cuenta></p>
      `;
      document.body.append(nodo);

      nodo.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-cerrar]") || evento.target === nodo) {
          cerrarLightbox();
        } else if (evento.target.closest("[data-prev]")) {
          mostrar(indice - 1);
        } else if (evento.target.closest("[data-next]")) {
          mostrar(indice + 1);
        }
      });

      return nodo;
    }

    function actualizarLightbox() {
      const img = lightbox.querySelector("[data-lightbox-img]");
      img.src = fotos[indice];
      img.alt = `${nombreProducto}, foto ${indice + 1} de ${fotos.length}`;
      lightbox.querySelector("[data-lightbox-cuenta]").textContent =
        fotos.length > 1 ? `${indice + 1} / ${fotos.length}` : "";
    }

    function abrirLightbox() {
      if (!lightbox) lightbox = construirLightbox();
      ultimoFoco = document.activeElement;
      actualizarLightbox();
      lightbox.dataset.abierto = "true";
      document.body.setAttribute("data-scroll-locked", "");
      lightbox.querySelector("[data-cerrar]").focus();
    }

    function cerrarLightbox() {
      if (!lightbox || lightbox.dataset.abierto !== "true") return;
      lightbox.dataset.abierto = "false";
      document.body.removeAttribute("data-scroll-locked");
      if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus();
    }

    document.addEventListener("keydown", (evento) => {
      const abierto = lightbox && lightbox.dataset.abierto === "true";

      if (abierto) {
        if (evento.key === "Escape") return cerrarLightbox();
        if (evento.key === "ArrowLeft") return mostrar(indice - 1);
        if (evento.key === "ArrowRight") return mostrar(indice + 1);
        return atraparFoco(lightbox, evento);
      }

      /* Con la galería enfocada las flechas también cambian de foto. */
      if (document.activeElement === marco) {
        if (evento.key === "ArrowLeft") mostrar(indice - 1);
        if (evento.key === "ArrowRight") mostrar(indice + 1);
      }
    });

    pintar();

    return { mostrar, actualizar, abrirLightbox };
  }

  window.OA.galeria = { crear };
})();
