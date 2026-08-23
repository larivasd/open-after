/* ==========================================================================
   Open After — Iconos SVG en línea
   --------------------------------------------------------------------------
   En línea a propósito: cero peticiones extra, heredan currentColor y se
   animan como cualquier otro elemento. Trazo de 1.5 para que acompañen el
   peso de la tipografía.
   ========================================================================== */

(function () {
  "use strict";

  const envoltorio = (contenido, relleno = "none") =>
    `<svg viewBox="0 0 24 24" fill="${relleno}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${contenido}</svg>`;

  window.OA = window.OA || {};

  window.OA.iconos = Object.freeze({
    bolsa: envoltorio(
      '<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    ),
    buscar: envoltorio('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>'),
    cerrar: envoltorio('<path d="M18 6 6 18M6 6l12 12"/>'),
    menu: envoltorio('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    flechaIzq: envoltorio('<path d="M15 5l-7 7 7 7"/>'),
    flechaDer: envoltorio('<path d="M9 5l7 7-7 7"/>'),
    flechaLarga: envoltorio('<path d="M4 12h15M13 6l6 6-6 6"/>'),
    mas: envoltorio('<path d="M12 5v14M5 12h14"/>'),
    menos: envoltorio('<path d="M5 12h14"/>'),
    lupaMas: envoltorio(
      '<circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-3.6-3.6"/>',
    ),
    verificado: envoltorio('<path d="m5 13 4 4L19 7"/>'),
    whatsapp:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z"/></svg>',
    instagram: envoltorio(
      '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
    ),
  });
})();
