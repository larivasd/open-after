/* ==========================================================================
   Open After — Interfaz del carrito
   --------------------------------------------------------------------------
   Panel lateral, contador de la cabecera y avisos flotantes. Se suscribe al
   estado de carrito.js y se redibuja solo cuando ese estado cambia.
   ========================================================================== */

(function () {
  "use strict";

  const { carrito, config, iconos, whatsapp } = window.OA;
  const { html, raw, formatearPrecio, rutaFoto, rutaProducto, atraparFoco } =
    window.OA.util;

  let panel;
  let scrim;
  let toast;
  let temporizadorToast;
  let ultimoFoco = null;

  /* --- Montaje del panel ----------------------------------------------------- */

  function crearPanel() {
    const contenedor = document.createElement("div");
    contenedor.innerHTML = html`
      <div class="scrim" data-abierto="false" data-cerrar-carrito></div>
      <aside
        class="carrito"
        data-abierto="false"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        aria-hidden="true"
      >
        <div class="carrito__cabecera">
          <h2 class="carrito__titulo">
            Tu selección
            <span
              class="carrito__titulo-cuenta"
              data-cuenta-panel
              style="color: var(--c-ink-faint); font-size: var(--text-small)"
            ></span>
          </h2>
          <button
            class="btn-icono"
            type="button"
            data-cerrar-carrito
            aria-label="Cerrar el carrito"
          >
            ${raw(iconos.cerrar)}
          </button>
        </div>

        <ul class="carrito__lista" data-lineas role="list"></ul>

        <div class="carrito__pie" data-pie hidden>
          <div class="carrito__total">
            <span class="eyebrow">Total</span>
            <span class="carrito__total-cifra" data-total></span>
          </div>
          <a
            class="btn btn--whatsapp btn--bloque btn--grande"
            data-pedir
            href="#"
            target="_blank"
            rel="noopener"
          >
            ${raw(iconos.whatsapp)} Pedir por WhatsApp
          </a>
          <p class="carrito__nota" data-nota-envio></p>
          <button
            class="linea__quitar"
            type="button"
            data-vaciar
            style="justify-self: center"
          >
            Vaciar carrito
          </button>
        </div>
      </aside>
      <div class="toast" data-toast role="status" aria-live="polite"></div>
    `;

    while (contenedor.firstElementChild) {
      document.body.append(contenedor.firstElementChild);
    }

    panel = document.querySelector(".carrito");
    scrim = document.querySelector(".scrim");
    toast = document.querySelector("[data-toast]");
  }

  /* --- Apertura y cierre ------------------------------------------------------ */

  const estaAbierto = () => panel.dataset.abierto === "true";

  function abrir() {
    if (estaAbierto()) return;
    ultimoFoco = document.activeElement;
    panel.dataset.abierto = "true";
    panel.setAttribute("aria-hidden", "false");
    scrim.dataset.abierto = "true";
    document.body.setAttribute("data-scroll-locked", "");
    panel.querySelector("[data-cerrar-carrito]").focus();
  }

  function cerrar() {
    if (!estaAbierto()) return;
    panel.dataset.abierto = "false";
    panel.setAttribute("aria-hidden", "true");
    scrim.dataset.abierto = "false";
    document.body.removeAttribute("data-scroll-locked");
    // Devuelve el foco a donde estaba antes de abrir.
    if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus();
  }

  /* --- Avisos ----------------------------------------------------------------- */

  function mostrarToast(mensaje) {
    if (!toast) return;
    toast.innerHTML = html`${raw(iconos.verificado)} ${mensaje}`;
    toast.dataset.visible = "true";
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => {
      toast.dataset.visible = "false";
    }, 2600);
  }

  /* --- Render ------------------------------------------------------------------ */

  function marcaLinea(linea) {
    const tope = linea.cantidad >= carrito.MAX_UNIDADES;
    return html`
      <li class="linea" data-id="${linea.id}" data-color="${linea.color}">
        <a href="${rutaProducto(linea.producto)}">
          <img
            class="linea__foto"
            src="${rutaFoto(linea.producto, 1)}"
            alt=""
            width="72"
            height="90"
            loading="lazy"
          />
        </a>
        <div class="linea__info">
          <a
            class="linea__nombre"
            href="${rutaProducto(linea.producto)}"
            style="text-decoration: none"
            >${linea.producto.nombre}</a
          >
          <span class="linea__variante">${linea.color}</span>
          <div class="linea__pie">
            <div class="cantidad">
              <button
                class="cantidad__btn"
                type="button"
                data-menos
                aria-label="Quitar una unidad de ${linea.producto.nombre}"
              >
                ${raw(iconos.menos)}
              </button>
              <span class="cantidad__valor" aria-live="polite"
                >${linea.cantidad}</span
              >
              <button
                class="cantidad__btn"
                type="button"
                data-mas
                ${raw(tope ? "disabled" : "")}
                aria-label="Añadir una unidad de ${linea.producto.nombre}"
              >
                ${raw(iconos.mas)}
              </button>
            </div>
            <span class="linea__precio">${formatearPrecio(linea.subtotal)}</span>
          </div>
          <button class="linea__quitar" type="button" data-quitar>
            Quitar
          </button>
        </div>
      </li>
    `;
  }

  function notaEnvio(total) {
    const minimo = config.envio.gratisDesde;
    if (!minimo) return config.envio.nota;
    if (total >= minimo) return "🎉 Tu pedido califica para envío gratis.";
    return `Te faltan ${formatearPrecio(minimo - total)} para el envío gratis.`;
  }

  function render(lineasCrudas) {
    const unidades = carrito.unidades();

    /* Contador de la cabecera. Puede haber más de uno si la página lo repite. */
    document.querySelectorAll("[data-contador-carrito]").forEach((nodo) => {
      const previo = Number(nodo.textContent) || 0;
      nodo.textContent = String(unidades);
      nodo.hidden = unidades === 0;

      if (unidades > previo) {
        nodo.dataset.pulso = "true";
        setTimeout(() => delete nodo.dataset.pulso, 260);
      }
    });

    if (!panel) return;

    const lineas = carrito.detalle();
    const total = carrito.total();
    const lista = panel.querySelector("[data-lineas]");
    const pie = panel.querySelector("[data-pie]");

    panel.querySelector("[data-cuenta-panel]").textContent =
      unidades > 0 ? `· ${unidades} ${unidades === 1 ? "pieza" : "piezas"}` : "";

    if (lineas.length === 0) {
      lista.innerHTML = html`
        <div class="carrito__vacio">
          <p>Todavía no has añadido nada.</p>
          <a class="btn btn--secundario" href="${window.OA.util.ruta("catalogo.html")}"
            >Ver el catálogo</a
          >
        </div>
      `;
      pie.hidden = true;
      return;
    }

    lista.innerHTML = lineas.map(marcaLinea).join("");
    pie.hidden = false;
    panel.querySelector("[data-total]").textContent = formatearPrecio(total);
    panel.querySelector("[data-pedir]").href = whatsapp.enlacePedido(
      lineas,
      total,
    );
    panel.querySelector("[data-nota-envio]").textContent = notaEnvio(total);
  }

  /* --- Eventos ------------------------------------------------------------------ */

  function conectar() {
    /* Delegación en el documento: los botones de abrir carrito viven en la
       cabecera, que se inyecta después de este script. */
    document.addEventListener("click", (evento) => {
      if (evento.target.closest("[data-abrir-carrito]")) {
        evento.preventDefault();
        abrir();
      }
      if (evento.target.closest("[data-cerrar-carrito]")) {
        cerrar();
      }
    });

    panel.addEventListener("click", (evento) => {
      const fila = evento.target.closest(".linea");
      if (!fila) {
        if (evento.target.closest("[data-vaciar]")) {
          carrito.vaciar();
          mostrarToast("Carrito vacío");
        }
        return;
      }

      const { id, color } = fila.dataset;
      const actual = carrito
        .obtener()
        .find((l) => l.id === id && l.color === color);
      if (!actual) return;

      if (evento.target.closest("[data-mas]")) {
        carrito.cambiarCantidad(id, color, actual.cantidad + 1);
      } else if (evento.target.closest("[data-menos]")) {
        carrito.cambiarCantidad(id, color, actual.cantidad - 1);
      } else if (evento.target.closest("[data-quitar]")) {
        carrito.quitar(id, color);
        mostrarToast("Producto quitado");
      }
    });

    document.addEventListener("keydown", (evento) => {
      if (!estaAbierto()) return;
      if (evento.key === "Escape") {
        cerrar();
        return;
      }
      atraparFoco(panel, evento);
    });
  }

  /* --- Arranque ------------------------------------------------------------------ */

  function iniciar() {
    crearPanel();
    conectar();
    carrito.suscribir(render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }

  window.OA.ui = { abrirCarrito: abrir, cerrarCarrito: cerrar, toast: mostrarToast };
})();
