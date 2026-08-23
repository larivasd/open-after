/* ==========================================================================
   Open After — Utilidades compartidas
   ========================================================================== */

(function () {
  "use strict";

  window.OA = window.OA || {};

  /* --- Rutas ---------------------------------------------------------------
     Las páginas dentro de productos/ están un nivel más abajo, así que
     declaran data-base=".." en el <html>. El resto usa ".". */
  const base = document.documentElement.dataset.base || ".";

  const ruta = (relativa) => `${base}/${relativa}`.replace(/\/{2,}/g, "/");

  /* --- Plantillas seguras --------------------------------------------------
     `html` escapa todo lo que se interpola. Para insertar marcado ya
     construido hay que envolverlo en `raw()` de forma explícita, así no se
     cuela HTML sin querer desde el catálogo o desde el buscador. */
  const RAW = Symbol("raw");

  const raw = (valor) => ({ [RAW]: String(valor) });

  function escapar(valor) {
    if (valor === null || valor === undefined) return "";
    if (typeof valor === "object" && RAW in valor) return valor[RAW];
    if (Array.isArray(valor)) return valor.map(escapar).join("");
    return String(valor).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  function html(cadenas, ...valores) {
    return cadenas.reduce(
      (salida, cadena, i) =>
        salida + cadena + (i < valores.length ? escapar(valores[i]) : ""),
      "",
    );
  }

  /* --- Formato ------------------------------------------------------------- */

  function formatearPrecio(valor) {
    const { simbolo, locale, decimales } = window.OA.config.moneda;
    const cifra = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    }).format(valor);
    return `${simbolo}${cifra}`;
  }

  /* --- Catálogo ------------------------------------------------------------ */

  const productos = () => window.OA.productos;

  const buscarPorId = (id) => productos().find((p) => p.id === id) || null;

  /* Devuelve la ruta de la foto n (1-indexada) de un producto.
     Cambia la extensión aquí si usas .jpg o .webp en lugar de .svg. */
  const EXTENSION_FOTO = "svg";

  const rutaFoto = (producto, indice = 1) =>
    ruta(`img/productos/${producto.id}-${indice}.${EXTENSION_FOTO}`);

  const todasLasFotos = (producto) =>
    Array.from({ length: producto.fotos }, (_, i) => rutaFoto(producto, i + 1));

  const rutaProducto = (producto) => ruta(`productos/${producto.id}.html`);

  const categorias = () => [...new Set(productos().map((p) => p.categoria))];

  /* --- Búsqueda ------------------------------------------------------------
     Normaliza acentos para que "bandolera mia" encuentre "Bandolera Mía".
     Con un catálogo de decenas de piezas esto sobra; no hace falta Fuse.js. */
  function normalizar(texto) {
    return String(texto)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /* Índice de búsqueda por producto, calculado una sola vez. */
  const indice = new WeakMap();

  function textoBuscable(producto) {
    if (!indice.has(producto)) {
      indice.set(
        producto,
        normalizar(
          [
            producto.nombre,
            producto.categoria,
            producto.material,
            producto.descripcion,
            producto.colores.map((c) => c.nombre).join(" "),
          ].join(" "),
        ),
      );
    }
    return indice.get(producto);
  }

  /* Todos los términos deben aparecer: buscar "tote negro" no devuelve
     todos los totes más todos los negros. */
  function coincide(producto, consulta) {
    const terminos = normalizar(consulta).split(/\s+/).filter(Boolean);
    if (terminos.length === 0) return true;
    const texto = textoBuscable(producto);
    return terminos.every((t) => texto.includes(t));
  }

  /* --- Varios -------------------------------------------------------------- */

  function debounce(fn, espera = 160) {
    let id;
    return function (...args) {
      clearTimeout(id);
      id = setTimeout(() => fn.apply(this, args), espera);
    };
  }

  const limitar = (valor, min, max) => Math.min(Math.max(valor, min), max);

  /* Atrapa el foco dentro de un panel abierto (carrito, lightbox) para que
     el tabulador no se escape al fondo de la página. */
  function atraparFoco(contenedor, evento) {
    if (evento.key !== "Tab") return;
    const focoables = contenedor.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focoables.length === 0) return;
    const primero = focoables[0];
    const ultimo = focoables[focoables.length - 1];
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  window.OA.util = {
    base,
    ruta,
    html,
    raw,
    escapar,
    formatearPrecio,
    productos,
    buscarPorId,
    rutaFoto,
    todasLasFotos,
    rutaProducto,
    categorias,
    normalizar,
    coincide,
    debounce,
    limitar,
    atraparFoco,
  };
})();
