/* ==========================================================================
   Open After — Catálogo Vursse
   --------------------------------------------------------------------------
   Este es tu inventario. Para agregar un bolso:

     1. Copia un bloque completo y pégalo al final de la lista.
     2. Cambia el `id` (sin espacios ni acentos: se usa en la URL).
     3. Cada color tiene su propia tanda de fotos. Ponlas en img/productos/
        como <id>-<color>-1.jpg, <id>-<color>-2.jpg, ... (el nombre del color
        se usa tal cual, sin acentos, en minúsculas y con guiones en vez de
        espacios: "Azul marino" → azul-marino) y ajusta `fotos` de ese color
        al número de fotos que tenga.
     4. Ejecuta:  node scripts/generar-paginas.mjs
        para crear su página en productos/<id>.html

   El campo `hex` de cada color se usa para pintar el punto de muestra junto
   al nombre del color en la ficha del producto.
   ========================================================================== */

window.OA = window.OA || {};

window.OA.productos = Object.freeze([
  {
    id: "cala",
    nombre: "Cartera Cala",
    categoria: "Cartera",
    precio: 54,
    destacado: true,
    nuevo: true,
    agotado: false,
    colores: [
      { nombre: "Rojo", hex: "#C0392B", fotos: 4 },
      { nombre: "Azul marino", hex: "#1F2A44", fotos: 4 },
      { nombre: "Negro", hex: "#1A1A1A", fotos: 4 },
      // "hex2" marca un color de dos tonos: la muestra se pinta mitad y
      // mitad. Este trae el asa y los herrajes en cuero camel.
      { nombre: "Negro y camel", hex: "#1A1A1A", hex2: "#96603A", fotos: 4 },
      { nombre: "Rosa", hex: "#E7C3C2", fotos: 4 },
    ],
    material:
      "Cuero vegano trenzado; asa en cuero camel (en el mismo tono del cuerpo en la versión Negro)",
    medidas: "20 × 22 × 14 cm",
    capacidad: "4 L",
    descripcion:
      "Cartera tipo balde en cuero vegano trenzado, con asa superior rígida y correa cruzada desmontable con hebillas doradas. Trae un pañuelo decorativo anudado al asa, a juego con cada color.",
    detalles: [
      "Correa cruzada desmontable con hebillas de metal dorado",
      "Cierre superior con solapa magnética",
      "Bolsillo trasero con cierre",
      "Pañuelo decorativo incluido, anudado al asa",
    ],
    cuidados: "Limpiar con paño húmedo. No sumergir en agua.",
  },
]);
