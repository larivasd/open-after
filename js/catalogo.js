/* ==========================================================================
   Open After — Página de catálogo
   --------------------------------------------------------------------------
   Buscador, filtro por categoría y orden. El estado vive en la URL
   (?q=&categoria=&orden=) para que un resultado filtrado se pueda compartir
   por WhatsApp y para que el botón atrás del navegador funcione.
   ========================================================================== */

(function () {
  "use strict";

  const { util, tarjeta, iconos } = window.OA;
  const { html, raw, visibles, categorias, coincide, debounce } = util;

  const ORDENES = Object.freeze({
    destacados: {
      etiqueta: "Destacados",
      comparar: (a, b) =>
        Number(b.destacado) - Number(a.destacado) ||
        Number(b.nuevo) - Number(a.nuevo),
    },
    "precio-asc": {
      etiqueta: "Precio: menor a mayor",
      comparar: (a, b) => a.precio - b.precio,
    },
    "precio-desc": {
      etiqueta: "Precio: mayor a menor",
      comparar: (a, b) => b.precio - a.precio,
    },
    nombre: {
      etiqueta: "Nombre A–Z",
      comparar: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
    },
  });

  const TODAS = "todas";

  let raiz;
  let campoBusqueda;

  /* --- Estado en la URL ------------------------------------------------------ */

  function leerEstado() {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("categoria") || TODAS;
    const orden = params.get("orden") || "destacados";

    return Object.freeze({
      consulta: params.get("q") || "",
      // Valida contra el catálogo real: un parámetro inventado no rompe nada.
      categoria: categorias().includes(categoria) ? categoria : TODAS,
      orden: orden in ORDENES ? orden : "destacados",
    });
  }

  function escribirEstado(estado, { reemplazar = false } = {}) {
    const params = new URLSearchParams();
    if (estado.consulta) params.set("q", estado.consulta);
    if (estado.categoria !== TODAS) params.set("categoria", estado.categoria);
    if (estado.orden !== "destacados") params.set("orden", estado.orden);

    const cadena = params.toString();
    const url = cadena
      ? `${window.location.pathname}?${cadena}`
      : window.location.pathname;

    const metodo = reemplazar ? "replaceState" : "pushState";
    window.history[metodo](estado, "", url);
  }

  /* --- Filtrado --------------------------------------------------------------- */

  function filtrar(estado) {
    return visibles()
      .filter((p) => estado.categoria === TODAS || p.categoria === estado.categoria)
      .filter((p) => coincide(p, estado.consulta))
      .slice() // no reordenar el catálogo original
      .sort(ORDENES[estado.orden].comparar);
  }

  /* --- Render ----------------------------------------------------------------- */

  function marcaControles(estado) {
    const pildoras = [TODAS, ...categorias()]
      .map((c) => {
        const activa = c === estado.categoria;
        return html`
          <button
            class="filtro"
            type="button"
            data-categoria="${c}"
            aria-pressed="${String(activa)}"
          >
            ${c === TODAS ? "Todos" : c}
          </button>
        `;
      })
      .join("");

    const opciones = Object.entries(ORDENES)
      .map(
        ([clave, { etiqueta }]) => html`
          <option value="${clave}" ${raw(clave === estado.orden ? "selected" : "")}>
            ${etiqueta}
          </option>
        `,
      )
      .join("");

    return html`
      <div class="controles">
        <div class="buscador">
          <span class="buscador__icono">${raw(iconos.buscar)}</span>
          <label class="sr-only" for="busqueda">Buscar bolsos</label>
          <input
            class="buscador__campo"
            id="busqueda"
            type="search"
            name="q"
            placeholder="Buscar por nombre, color o material…"
            autocomplete="off"
            value="${estado.consulta}"
          />
          <button
            class="buscador__limpiar"
            type="button"
            data-limpiar
            aria-label="Limpiar la búsqueda"
            ${raw(estado.consulta ? "" : "hidden")}
          >
            ${raw(iconos.cerrar)}
          </button>
        </div>

        <div class="filtros" role="group" aria-label="Filtrar por categoría">
          ${raw(pildoras)}
        </div>

        <label class="sr-only" for="orden">Ordenar por</label>
        <select class="orden" id="orden" data-orden>
          ${raw(opciones)}
        </select>
      </div>
    `;
  }

  function marcaResultados(lista, estado) {
    if (lista.length === 0) {
      return html`
        <div class="sin-resultados">
          <p style="font-family: var(--font-display); font-size: var(--text-h3)">
            No encontramos nada para “${estado.consulta}”.
          </p>
          <p>Prueba con otro término o mira el catálogo completo.</p>
          <button class="btn btn--secundario" type="button" data-reiniciar>
            Ver todos los bolsos
          </button>
        </div>
      `;
    }

    return html`
      <p class="resumen-resultados" role="status">
        ${lista.length} ${lista.length === 1 ? "bolso" : "bolsos"}
        ${raw(estado.categoria !== TODAS ? html` en ${estado.categoria}` : "")}
        ${raw(estado.consulta ? html` para “${estado.consulta}”` : "")}
      </p>
      <div class="rejilla-productos">${raw(tarjeta.rejilla(lista))}</div>
    `;
  }

  /* Solo se redibuja la zona de resultados: el input conserva el foco y el
     cursor mientras se escribe. */
  function pintarResultados(estado) {
    const zona = raiz.querySelector("[data-resultados]");
    zona.innerHTML = marcaResultados(filtrar(estado), estado);
  }

  function pintarTodo(estado) {
    raiz.innerHTML = html`
      ${raw(marcaControles(estado))}
      <div data-resultados></div>
    `;
    pintarResultados(estado);
    campoBusqueda = raiz.querySelector("#busqueda");
  }

  /* --- Eventos ------------------------------------------------------------------ */

  function actualizar(cambios, { reemplazar = false } = {}) {
    const estado = Object.freeze({ ...leerEstado(), ...cambios });
    escribirEstado(estado, { reemplazar });
    return estado;
  }

  /* Sincroniza los controles sin reconstruirlos, para no perder el foco. */
  function sincronizarControles(estado) {
    raiz.querySelectorAll("[data-categoria]").forEach((boton) => {
      boton.setAttribute(
        "aria-pressed",
        String(boton.dataset.categoria === estado.categoria),
      );
    });
    const select = raiz.querySelector("[data-orden]");
    if (select) select.value = estado.orden;

    const limpiar = raiz.querySelector("[data-limpiar]");
    if (limpiar) limpiar.hidden = !estado.consulta;
  }

  function conectar() {
    const buscarConRetardo = debounce((valor) => {
      // replaceState: escribir no debe llenar el historial de entradas.
      const estado = actualizar({ consulta: valor }, { reemplazar: true });
      sincronizarControles(estado);
      pintarResultados(estado);
    }, 180);

    raiz.addEventListener("input", (evento) => {
      if (evento.target.matches("#busqueda")) {
        buscarConRetardo(evento.target.value);
      }
    });

    raiz.addEventListener("change", (evento) => {
      if (evento.target.matches("[data-orden]")) {
        const estado = actualizar({ orden: evento.target.value });
        pintarResultados(estado);
      }
    });

    raiz.addEventListener("click", (evento) => {
      const pildora = evento.target.closest("[data-categoria]");
      if (pildora) {
        const estado = actualizar({ categoria: pildora.dataset.categoria });
        sincronizarControles(estado);
        pintarResultados(estado);
        return;
      }

      if (evento.target.closest("[data-limpiar]")) {
        const estado = actualizar({ consulta: "" });
        if (campoBusqueda) {
          campoBusqueda.value = "";
          campoBusqueda.focus();
        }
        sincronizarControles(estado);
        pintarResultados(estado);
        return;
      }

      if (evento.target.closest("[data-reiniciar]")) {
        const estado = actualizar({ consulta: "", categoria: TODAS });
        pintarTodo(estado);
      }
    });

    /* Botón atrás y adelante del navegador. */
    window.addEventListener("popstate", () => {
      pintarTodo(leerEstado());
    });
  }

  function iniciar() {
    raiz = document.querySelector("[data-catalogo]");
    if (!raiz) return;

    pintarTodo(leerEstado());
    conectar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
