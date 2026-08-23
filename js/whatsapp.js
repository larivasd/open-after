/* ==========================================================================
   Open After — Enlaces de WhatsApp
   --------------------------------------------------------------------------
   Arma el mensaje del pedido y lo codifica en un enlace wa.me. No usa la
   API de Meta ni el catálogo de WhatsApp Business: es un enlace normal que
   abre el chat con el texto ya escrito.
   ========================================================================== */

(function () {
  "use strict";

  const { config } = window.OA;
  const { formatearPrecio } = window.OA.util;

  /* WhatsApp corta los enlaces muy largos. 1800 caracteres del texto ya
     codificado deja margen suficiente frente al límite práctico. */
  const MAX_LONGITUD_CODIFICADA = 1800;

  /* Deja el número en solo dígitos: tolera que alguien escriba "+58 414-123
     4567" en config.js. */
  const numeroLimpio = () => String(config.whatsapp).replace(/\D/g, "");

  function enlace(texto) {
    const numero = numeroLimpio();
    let codificado = encodeURIComponent(texto);

    if (codificado.length > MAX_LONGITUD_CODIFICADA) {
      const recorte =
        texto.slice(0, 900) +
        "\n\n… (pedido largo, se lo detallo por aquí en el chat)";
      codificado = encodeURIComponent(recorte);
    }

    return `https://wa.me/${numero}?text=${codificado}`;
  }

  /* --- Mensajes ------------------------------------------------------------- */

  /* Consulta general, sin pedido: botón del pie y del cierre de portada. */
  function enlaceGeneral() {
    return enlace(
      `${config.mensaje.saludo}\nMe interesan los bolsos ${config.producto}. ¿Me pueden ayudar?`,
    );
  }

  /* Consulta por un bolso concreto, desde su ficha. */
  function enlaceProducto(producto, color) {
    const variante = color ? ` en color ${color}` : "";
    return enlace(
      `${config.mensaje.saludo}\nMe interesa el *${producto.nombre}*${variante} (${formatearPrecio(producto.precio)}).\n\n¿Está disponible?`,
    );
  }

  /* Pedido completo desde el carrito. El asterisco es negrita en WhatsApp. */
  function enlacePedido(lineas, total) {
    if (lineas.length === 0) return enlaceGeneral();

    const items = lineas
      .map(
        (l, i) =>
          `${i + 1}. *${l.producto.nombre}* — ${l.color}\n   ${l.cantidad} × ${formatearPrecio(l.producto.precio)} = ${formatearPrecio(l.subtotal)}`,
      )
      .join("\n");

    const partes = [
      config.mensaje.saludo,
      config.mensaje.intro,
      "",
      items,
      "",
      `*Total: ${formatearPrecio(total)}*`,
      "",
      config.mensaje.cierre,
    ];

    return enlace(partes.join("\n"));
  }

  window.OA.whatsapp = { enlace, enlaceGeneral, enlaceProducto, enlacePedido };
})();
