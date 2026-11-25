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

   `estado` controla si el bolso se puede comprar, solo encargar o ni
   siquiera se muestra:
     - "disponible" → normal, se puede añadir al carrito.
     - "encargar"   → se ve en la tienda, pero no se puede añadir al
                       carrito: solo queda el botón de WhatsApp para
                       coordinar el pedido.
     - "oculto"      → no aparece en ningún lado del sitio (ni catálogo,
                       ni portada, ni su propia página).
   ========================================================================== */

window.OA = window.OA || {};

window.OA.productos = Object.freeze([
  {
    id: "cala",
    nombre: "Cartera Cala",
    categoria: "Cartera",
    precio: 55,
    destacado: true,
    nuevo: true,
    estado: "disponible",
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
  {
    id: "zoe",
    nombre: "Bandolera Zoe",
    categoria: "Bandolera",
    precio: 35,
    destacado: true,
    nuevo: true,
    estado: "disponible",
    colores: [
      { nombre: "Coñac", hex: "#96603A", fotos: 3 },
      { nombre: "Negro", hex: "#1A1A1A", fotos: 3 },
    ],
    material: "Cuero vegano liso con herrajes dorados",
    medidas: "19 × 15 × 7 cm",
    capacidad: "2 L",
    descripcion:
      "Bandolera estructurada con solapa y un broche de corazón dorado como único adorno. Trae asa superior corta y correa cruzada desmontable para llevarla de las dos formas.",
    detalles: [
      "Cierre de solapa con broche magnético en forma de corazón",
      "Asa superior corta y correa cruzada desmontable",
      "Bolsillo interior",
      "Herrajes dorados",
    ],
    cuidados: "Limpiar con paño húmedo.",
  },
  {
    id: "camila",
    nombre: "Tote Camila",
    categoria: "Tote",
    precio: 80,
    destacado: true,
    nuevo: false,
    estado: "disponible",
    colores: [
      { nombre: "Rosa", hex: "#E6C9B8", fotos: 3 },
      { nombre: "Azul marino", hex: "#1F2A44", fotos: 3 },
    ],
    material: "Cuero vegano liso con cierre de broche giratorio",
    medidas: "34 × 27 × 13 cm",
    capacidad: "12 L",
    descripcion:
      "Tote estructurado con cierre de broche giratorio al frente. Dos asas superiores y correa cruzada desmontable para llevarlo como bandolera cuando hacen falta las manos libres.",
    detalles: [
      "Cierre de broche giratorio",
      "Dos asas superiores",
      "Correa cruzada desmontable",
      "Bolsillo trasero con cierre",
    ],
    cuidados: "Limpiar con paño húmedo. Hidratar cada 6 meses.",
  },
  {
    id: "elly",
    nombre: "Bandolera Elly",
    categoria: "Bandolera",
    precio: 60,
    destacado: false,
    nuevo: true,
    estado: "disponible",
    colores: [{ nombre: "Negro", hex: "#1A1A1A", fotos: 4 }],
    material: "Cuero vegano liso con herrajes dorados",
    medidas: "26 × 13 × 9 cm",
    capacidad: "3 L",
    descripcion:
      "Bandolera alargada tipo baguette, con dos asas ajustables y una correa adicional estampada que se puede intercambiar según el look. Cierre superior de cremallera con bolsillo frontal.",
    detalles: [
      "Dos asas ajustables: al hombro o cruzada",
      "Correa estampada desmontable incluida",
      "Bolsillo frontal con cierre",
      "Placa de la marca al frente",
    ],
    cuidados: "Limpiar con paño húmedo.",
  },
  {
    id: "vita",
    nombre: "Bandolera Vita",
    categoria: "Bandolera",
    precio: 70,
    destacado: true,
    nuevo: true,
    estado: "disponible",
    colores: [{ nombre: "Negro", hex: "#1A1A1A", fotos: 4 }],
    material: "Cuero vegano texturizado tipo cocodrilo, con correa bordada",
    medidas: "22 × 16 × 11 cm",
    capacidad: "3 L",
    descripcion:
      "Bandolera estructurada en cuero texturizado tipo cocodrilo, con una correa ancha bordada a mano con motivos de tortugas y hojas. Dos compartimentos con cierre y bolsillo frontal.",
    detalles: [
      "Correa ancha bordada a mano, desmontable",
      "Dos compartimentos principales con cierre",
      "Bolsillo frontal con cierre",
      "Herrajes dorados",
    ],
    cuidados: "Limpiar con paño húmedo. No mojar la correa bordada.",
  },
  {
    id: "ritmo",
    nombre: "Bandolera Ritmo",
    categoria: "Bandolera",
    precio: 75,
    destacado: false,
    nuevo: false,
    estado: "disponible",
    colores: [
      { nombre: "Amarillo", hex: "#E8B339", fotos: 3 },
      { nombre: "Negro", hex: "#1A1A1A", fotos: 3 },
    ],
    material: "Cuero vegano liso con cierre de broche giratorio",
    medidas: "18 × 20 × 10 cm",
    capacidad: "2.5 L",
    descripcion:
      "Bandolera de silueta redondeada con doble compartimento de cremallera y broche giratorio decorativo al frente. Asa superior rígida y correa cruzada larga.",
    detalles: [
      "Doble compartimento con cremallera",
      "Broche giratorio decorativo",
      "Asa superior rígida",
      "Correa cruzada desmontable",
    ],
    cuidados: "Limpiar con paño húmedo.",
  },
  {
    id: "jessica",
    nombre: "Shopper Jessica",
    categoria: "Shopper",
    precio: 40,
    destacado: false,
    nuevo: true,
    estado: "disponible",
    colores: [
      { nombre: "Amarillo", hex: "#C9962D", fotos: 1 },
      { nombre: "Negro", hex: "#1A1A1A", fotos: 2 },
    ],
    material: "Tejido crochet de algodón con asa de cuero",
    medidas: "40 × 38 × 14 cm",
    capacidad: "16 L",
    descripcion:
      "Shopper tejida a crochet en rayas, con asa de cuero a juego con el color. Liviana y amplia, ideal para el día a día o la playa.",
    detalles: [
      "Tejido crochet de algodón",
      "Asa de cuero a juego con el color",
      "Interior amplio sin forro",
      "Cada pieza puede variar ligeramente por ser tejida a mano",
    ],
    cuidados: "Limpiar con paño seco. Evitar exposición prolongada al agua.",
  },
]);
