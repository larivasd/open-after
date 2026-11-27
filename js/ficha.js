/* ==========================================================================
   Open After — Ficha de producto
   --------------------------------------------------------------------------
   La página HTML solo aporta las etiquetas <meta> (para que WhatsApp muestre
   la foto correcta al compartir el enlace) y declara data-producto. Todo el
   contenido visible se arma aquí desde productos.js.
   ========================================================================== */

(function () {
  "use strict";

  const { util, carrito, whatsapp, iconos, tarjeta, galeria } = window.OA;
  const {
    html,
    raw,
    buscarPorId,
    todasLasFotos,
    formatearPrecio,
    visibles,
    ruta,
    limitar,
  } = util;

  let producto;
  let colorElegido;
  let cantidad = 1;
  let raiz;
  let galeriaInstancia;

  /* --- Piezas de la vista ----------------------------------------------------- */

  function marcaMiga() {
    return html`
      <nav class="miga contenedor" aria-label="Ruta de navegación">
        <a href="${ruta("index.html")}">Inicio</a>
        <span aria-hidden="true"> / </span>
        <a href="${ruta(`catalogo.html?categoria=${encodeURIComponent(producto.categoria)}`)}"
          >${producto.categoria}</a
        >
        <span aria-hidden="true"> / </span>
        <span aria-current="page">${producto.nombre}</span>
      </nav>
    `;
  }

  function marcaColores() {
    if (producto.colores.length <= 1) return "";

    const opciones = producto.colores
      .map((c) => {
        // Un color con "hex2" es de dos tonos (p. ej. cuerpo negro con asa
        // camel): la muestra se pinta mitad y mitad en vez de un solo tono.
        const fondo = c.hex2
          ? `linear-gradient(135deg, ${c.hex} 50%, ${c.hex2} 50%)`
          : c.hex;

        return html`
          <button
            class="color-opcion"
            type="button"
            data-color="${c.nombre}"
            aria-pressed="${String(c.nombre === colorElegido)}"
          >
            <span
              class="color-opcion__muestra"
              style="background: ${fondo}"
              aria-hidden="true"
            ></span>
            ${c.nombre}
          </button>
        `;
      })
      .join("");

    return html`
      <div class="campo campo-color">
        <span class="campo__etiqueta">
          Color
          <span class="campo__valor" data-color-elegido>${colorElegido}</span>
        </span>
        <div class="colores" role="group" aria-label="Elegir color">
          ${raw(opciones)}
        </div>
      </div>
    `;
  }

  /* Medidas, material y cuidados son opcionales: un producto sin dato
     oficial (p. ej. los monederos) simplemente no muestra esa fila. */
  function marcaEspecificaciones() {
    const filas = [
      ["Medidas", producto.medidas],
      ["Material", producto.material],
      ["Cuidados", producto.cuidados],
    ].filter(([, valor]) => valor);
    if (filas.length === 0) return "";

    const definiciones = filas
      .map(([nombre, valor]) => html`<dt>${nombre}</dt><dd>${valor}</dd>`)
      .join("");

    return html`
      <details class="detalle">
        <summary class="detalle__resumen">Medidas y materiales</summary>
        <div class="detalle__cuerpo">
          <dl class="especificaciones">${raw(definiciones)}</dl>
        </div>
      </details>
    `;
  }

  function marcaDetalles() {
    return html`
      <div class="ficha-detalles">
        <details class="detalle" open>
          <summary class="detalle__resumen">Detalles</summary>
          <div class="detalle__cuerpo">
            <ul>
              ${raw(producto.detalles.map((d) => html`<li>${d}</li>`).join(""))}
            </ul>
          </div>
        </details>

        ${raw(marcaEspecificaciones())}

        <details class="detalle">
          <summary class="detalle__resumen">Envíos y pedidos</summary>
          <div class="detalle__cuerpo">
            <p>${window.OA.config.envio.nota}</p>
            <p style="margin-top: var(--space-2xs)">
              No hay pago en línea: coordinamos el pedido y la forma de pago
              directamente por WhatsApp.
            </p>
          </div>
        </details>
      </div>
    `;
  }

  function marcaCompra() {
    // "Por encargo": se puede pedir, pero solo coordinando por WhatsApp, así
    // que no tiene sentido dejar añadirlo al carrito como si hubiera stock.
    const porEncargo = producto.estado === "encargar";

    return html`
      <div class="compra">
        <span class="eyebrow compra__categoria">${producto.categoria}</span>
        <h1 class="compra__nombre">${producto.nombre}</h1>
        <p class="compra__precio precio">${formatearPrecio(producto.precio)}</p>
        <p class="compra__descripcion">${producto.descripcion}</p>

        ${raw(marcaColores())}

        <div class="campo campo-cantidad">
          <span class="campo__etiqueta" id="etiqueta-cantidad">Cantidad</span>
          <div class="cantidad" aria-labelledby="etiqueta-cantidad">
            <button
              class="cantidad__btn"
              type="button"
              data-menos
              aria-label="Quitar una unidad"
            >
              ${raw(iconos.menos)}
            </button>
            <span class="cantidad__valor" data-cantidad aria-live="polite">1</span>
            <button
              class="cantidad__btn"
              type="button"
              data-mas
              aria-label="Añadir una unidad"
            >
              ${raw(iconos.mas)}
            </button>
          </div>
        </div>

        <div class="compra__acciones">
          <button
            class="btn btn--primario"
            type="button"
            data-agregar
            ${raw(porEncargo ? "disabled" : "")}
          >
            ${raw(iconos.bolsa)}
            ${porEncargo ? "Por encargo" : "Añadir al carrito"}
          </button>
          <a
            class="btn btn--whatsapp"
            data-consultar
            href="${whatsapp.enlaceProducto(producto, colorElegido)}"
            target="_blank"
            rel="noopener"
          >
            ${raw(iconos.whatsapp)}
            ${porEncargo ? "Pedir por WhatsApp" : "Consultar"}
          </a>
        </div>

        <p class="compra__aviso">
          ${porEncargo
            ? "Esta pieza se hace por encargo: escríbenos por WhatsApp para coordinar el pedido y el tiempo de entrega."
            : window.OA.config.envio.nota}
        </p>

        ${raw(marcaDetalles())}
      </div>
    `;
  }

  /* Relacionados: misma categoría primero, y si no llegan a cuatro se
     completa con el resto del catálogo. */
  function relacionados() {
    const otros = visibles().filter((p) => p.id !== producto.id);
    const mismaCategoria = otros.filter(
      (p) => p.categoria === producto.categoria,
    );
    const resto = otros.filter((p) => p.categoria !== producto.categoria);
    return [...mismaCategoria, ...resto].slice(0, 4);
  }

  function marcaRelacionados() {
    const lista = relacionados();
    if (lista.length === 0) return "";

    return html`
      <section class="relacionados">
        <div class="contenedor">
          <div class="seccion__cabecera">
            <div>
              <span class="eyebrow">También te puede gustar</span>
              <h2 style="font-size: var(--text-h3); margin-top: var(--space-3xs)">
                Otras piezas
              </h2>
            </div>
            <a class="enlace-linea" href="${ruta("catalogo.html")}"
              >Ver todo el catálogo</a
            >
          </div>
          <div class="rejilla-productos">
            ${raw(tarjeta.rejilla(lista, { prioridadHasta: 0 }))}
          </div>
        </div>
      </section>
    `;
  }

  /* --- Interacción -------------------------------------------------------------- */

  function pintarCantidad() {
    const valor = raiz.querySelector("[data-cantidad]");
    if (valor) valor.textContent = String(cantidad);

    const menos = raiz.querySelector("[data-menos]");
    const mas = raiz.querySelector("[data-mas]");
    if (menos) menos.disabled = cantidad <= 1;
    if (mas) mas.disabled = cantidad >= carrito.MAX_UNIDADES;
  }

  function elegirColor(nombre) {
    colorElegido = nombre;

    raiz.querySelectorAll("[data-color]").forEach((boton) => {
      boton.setAttribute(
        "aria-pressed",
        String(boton.dataset.color === colorElegido),
      );
    });

    const etiqueta = raiz.querySelector("[data-color-elegido]");
    if (etiqueta) etiqueta.textContent = colorElegido;

    // El enlace de consulta debe mencionar el color que está seleccionado.
    const consultar = raiz.querySelector("[data-consultar]");
    if (consultar) {
      consultar.href = whatsapp.enlaceProducto(producto, colorElegido);
    }

    // Cada color trae su propia tanda de fotos: la galería se repinta con
    // las que correspondan en vez de quedarse con las del color anterior.
    if (galeriaInstancia) {
      galeriaInstancia.actualizar(todasLasFotos(producto, colorElegido));
    }
  }

  function conectar() {
    raiz.addEventListener("click", (evento) => {
      const color = evento.target.closest("[data-color]");
      if (color) return elegirColor(color.dataset.color);

      if (evento.target.closest("[data-mas]")) {
        cantidad = limitar(cantidad + 1, 1, carrito.MAX_UNIDADES);
        return pintarCantidad();
      }

      if (evento.target.closest("[data-menos]")) {
        cantidad = limitar(cantidad - 1, 1, carrito.MAX_UNIDADES);
        return pintarCantidad();
      }

      if (evento.target.closest("[data-agregar]")) {
        const ok = carrito.agregar(producto.id, colorElegido, cantidad);
        if (ok) {
          window.OA.ui.toast(`${producto.nombre} añadido`);
          window.OA.ui.abrirCarrito();
          cantidad = 1;
          pintarCantidad();
        }
      }
    });
  }

  /* --- Arranque ------------------------------------------------------------------ */

  function iniciar() {
    raiz = document.querySelector("[data-ficha]");
    if (!raiz) return;

    const id = document.documentElement.dataset.producto;
    producto = buscarPorId(id);

    // Un producto "oculto" no debería tener página generada (ver
    // generar-paginas.mjs), pero si alguien llega por un enlace viejo que
    // quedó indexado, se trata igual que si ya no existiera.
    if (producto && producto.estado === "oculto") producto = null;

    if (!producto) {
      // La página existe pero el producto ya no está en el catálogo.
      raiz.innerHTML = html`
        <div class="sin-resultados contenedor">
          <p style="font-family: var(--font-display); font-size: var(--text-h3)">
            Este bolso ya no está disponible.
          </p>
          <a class="btn btn--primario" href="${ruta("catalogo.html")}"
            >Ver el catálogo</a
          >
        </div>
      `;
      return;
    }

    colorElegido = producto.colores[0].nombre;
    document.title = `${producto.nombre} · ${window.OA.config.marca}`;

    raiz.innerHTML = html`
      ${raw(marcaMiga())}
      <div class="contenedor">
        <div class="ficha">
          <div data-galeria></div>
          ${raw(marcaCompra())}
        </div>
      </div>
      ${raw(marcaRelacionados())}
    `;

    galeriaInstancia = galeria.crear(
      raiz.querySelector("[data-galeria]"),
      todasLasFotos(producto, colorElegido),
      producto.nombre,
    );

    pintarCantidad();
    conectar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
