/* ==========================================================================
   Open After — Configuración de la tienda
   --------------------------------------------------------------------------
   ESTE ES EL ARCHIVO QUE DEBES EDITAR PRIMERO.
   Cambia el número de WhatsApp y los datos de contacto por los tuyos.
   ========================================================================== */

window.OA = window.OA || {};

window.OA.config = Object.freeze({
  /* --- Marca ------------------------------------------------------------ */
  marca: "Open After",
  producto: "Vursse",
  descripcionCorta: "Bolsos Vursse hechos para durar y acompañar.",

  /* --- Dirección pública -------------------------------------------------
     Sin barra final. WhatsApp y Google exigen URL absoluta para mostrar la
     foto al compartir un enlace: con una ruta relativa la miniatura no sale.
     Después de cambiarla, ejecuta `node scripts/generar-paginas.mjs`.
     GitHub Pages:  https://TU-USUARIO.github.io/open-after
     Dominio propio: https://openafter.com
     ⚠️ CAMBIA ESTO ANTES DE PUBLICAR. */
  sitio: "https://larivasd.github.io/open-after",

  /* --- WhatsApp ----------------------------------------------------------
     Número en formato internacional, SIN el signo +, sin espacios ni guiones.
     Ejemplos:
       Venezuela  58 + 4141234567  ->  "584141234567"
       Colombia   57 + 3001234567  ->  "573001234567"
       México     52 + 5512345678  ->  "525512345678"
       España     34 + 612345678   ->  "34612345678"
     ⚠️ CAMBIA ESTE NÚMERO ANTES DE PUBLICAR. */
  whatsapp: "584141234567",

  /* --- Moneda ------------------------------------------------------------
     `locale` controla el separador de miles y decimales.
     `decimales: 0` es lo habitual si tus precios son cifras redondas. */
  moneda: Object.freeze({
    simbolo: "$",
    codigo: "USD",
    locale: "es-VE",
    decimales: 0,
  }),

  /* --- Contacto ---------------------------------------------------------- */
  contacto: Object.freeze({
    instagram: "openafter.store",
    email: "hola@openafter.com",
    ciudad: "Caracas, Venezuela",
  }),

  /* --- Envíos y textos comerciales --------------------------------------- */
  envio: Object.freeze({
    nota: "Envíos a todo el país. Coordinamos por WhatsApp.",
    gratisDesde: 120, // 0 para desactivar el aviso de envío gratis
  }),

  /* --- Mensaje de WhatsApp -----------------------------------------------
     Encabezado y cierre del pedido que se autogenera desde el carrito. */
  mensaje: Object.freeze({
    saludo: "¡Hola Open After! 👋",
    intro: "Quiero hacer un pedido:",
    cierre: "¿Me confirman disponibilidad y el costo de envío?",
  }),
});
