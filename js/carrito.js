/* ==========================================================================
   Open After — Estado del carrito
   --------------------------------------------------------------------------
   Persiste en localStorage. Todas las operaciones devuelven listas nuevas:
   nunca se muta el estado anterior, así el render siempre parte de un dato
   consistente y es trivial razonar sobre lo que cambió.
   ========================================================================== */

(function () {
  "use strict";

  const { buscarPorId, limitar } = window.OA.util;

  const CLAVE = "openafter.carrito.v1";
  const MAX_UNIDADES = 20;

  /* Una línea = producto + color. El mismo bolso en dos colores son dos
     líneas distintas, que es como lo piensa quien compra. */
  const claveLinea = (id, color) => `${id}::${color}`;

  let lineas = [];
  const suscriptores = new Set();

  /* --- Persistencia --------------------------------------------------------
     localStorage es dato externo: puede estar corrupto, venir de una versión
     vieja del catálogo o haber sido editado a mano. Se valida siempre. */

  function cargar() {
    let crudo;
    try {
      crudo = window.localStorage.getItem(CLAVE);
    } catch (error) {
      // Safari en navegación privada puede lanzar al leer.
      console.warn("No se pudo leer el carrito guardado:", error);
      return [];
    }
    if (!crudo) return [];

    try {
      const datos = JSON.parse(crudo);
      if (!Array.isArray(datos)) return [];
      return datos.map(sanear).filter(Boolean);
    } catch (error) {
      console.warn("Carrito guardado ilegible, se descarta:", error);
      return [];
    }
  }

  /* Descarta líneas cuyo producto ya no existe en el catálogo o cuyo color
     fue retirado, y recorta cantidades fuera de rango. */
  function sanear(linea) {
    if (!linea || typeof linea !== "object") return null;

    const producto = buscarPorId(linea.id);
    if (!producto) return null;

    const nombresColor = producto.colores.map((c) => c.nombre);
    const color = nombresColor.includes(linea.color)
      ? linea.color
      : nombresColor[0];

    const cantidad = Number(linea.cantidad);
    if (!Number.isFinite(cantidad) || cantidad < 1) return null;

    return Object.freeze({
      id: producto.id,
      color,
      cantidad: limitar(Math.floor(cantidad), 1, MAX_UNIDADES),
    });
  }

  function guardar() {
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(lineas));
    } catch (error) {
      // Cuota llena o modo privado: el carrito sigue funcionando en memoria.
      console.warn("No se pudo guardar el carrito:", error);
    }
  }

  /* --- Notificación --------------------------------------------------------- */

  function aplicar(nuevasLineas) {
    lineas = Object.freeze(nuevasLineas);
    guardar();
    suscriptores.forEach((fn) => fn(lineas));
  }

  function suscribir(fn) {
    suscriptores.add(fn);
    fn(lineas);
    return () => suscriptores.delete(fn);
  }

  /* --- Operaciones ----------------------------------------------------------
     Cada una construye una lista nueva a partir de la anterior. */

  function agregar(id, color, cantidad = 1) {
    const candidata = sanear({ id, color, cantidad });
    if (!candidata) return false;

    const clave = claveLinea(candidata.id, candidata.color);
    const existente = lineas.find(
      (l) => claveLinea(l.id, l.color) === clave,
    );

    if (existente) {
      // Suma sobre la línea existente, sin pasar del tope.
      aplicar(
        lineas.map((l) =>
          claveLinea(l.id, l.color) === clave
            ? Object.freeze({
                ...l,
                cantidad: limitar(
                  l.cantidad + candidata.cantidad,
                  1,
                  MAX_UNIDADES,
                ),
              })
            : l,
        ),
      );
    } else {
      aplicar([...lineas, candidata]);
    }
    return true;
  }

  function cambiarCantidad(id, color, cantidad) {
    const clave = claveLinea(id, color);
    const objetivo = limitar(Math.floor(Number(cantidad) || 0), 0, MAX_UNIDADES);

    if (objetivo === 0) return quitar(id, color);

    aplicar(
      lineas.map((l) =>
        claveLinea(l.id, l.color) === clave
          ? Object.freeze({ ...l, cantidad: objetivo })
          : l,
      ),
    );
  }

  function quitar(id, color) {
    const clave = claveLinea(id, color);
    aplicar(lineas.filter((l) => claveLinea(l.id, l.color) !== clave));
  }

  function vaciar() {
    aplicar([]);
  }

  /* --- Derivados ------------------------------------------------------------
     Se calculan al vuelo en lugar de guardarse: no hay forma de que el total
     quede desincronizado de las líneas. */

  const obtener = () => lineas;

  const unidades = () => lineas.reduce((suma, l) => suma + l.cantidad, 0);

  /* Une cada línea con su producto para que la vista no tenga que buscarlo. */
  function detalle() {
    return lineas
      .map((linea) => {
        const producto = buscarPorId(linea.id);
        if (!producto) return null;
        return Object.freeze({
          ...linea,
          producto,
          subtotal: producto.precio * linea.cantidad,
        });
      })
      .filter(Boolean);
  }

  const total = () => detalle().reduce((suma, l) => suma + l.subtotal, 0);

  const estaVacio = () => lineas.length === 0;

  /* Sincroniza entre pestañas abiertas del mismo sitio. */
  window.addEventListener("storage", (evento) => {
    if (evento.key !== CLAVE) return;
    lineas = Object.freeze(cargar());
    suscriptores.forEach((fn) => fn(lineas));
  });

  lineas = Object.freeze(cargar());

  window.OA.carrito = {
    MAX_UNIDADES,
    suscribir,
    agregar,
    cambiarCantidad,
    quitar,
    vaciar,
    obtener,
    detalle,
    unidades,
    total,
    estaVacio,
  };
})();
