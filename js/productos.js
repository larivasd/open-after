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
    nombre: "Cala",
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
      "PVC de alta densidad, con herrajes en zamak color oro y forro interior en poliéster sublimado",
    medidas: "22 × 23 × 15 cm",
    capacidad: "4 L",
    descripcion:
      "Compacto por fuera, organizado por dentro. Cala es un bolso estructurado en PVC pensado para llevar lo esencial con orden. Cuenta con manija corta y una correa larga graduable en el mismo tono para usarlo de diferentes formas. En el interior incorpora un bolsillo con cremallera y otro bolsillo abierto. Su broche magnético y el mosquetón interior que une los laterales ayudan a mantener la apertura del bolso más recogida. Además, incluye pañoleta para darle un detalle diferente al diseño.",
    detalles: [
      "Manija corta y correa larga graduable incluida, en el mismo tono",
      "Pañoleta decorativa incluida",
      "1 bolsillo interior con cremallera y 1 bolsillo interior abierto",
      "Cierre con broche magnético y mosquetón interior que une los laterales",
      "Herrajes en zamak color oro",
      "Forro interior en poliéster sublimado",
      "Hecho en Colombia",
    ],
    cuidados:
      "Limpiar con crema limpiadora para bolsos o con un paño suave ligeramente húmedo. No usar detergentes abrasivos ni cepillos. No lavar en máquina. No sumergir en agua. Evitar peso excesivo o presión prolongada para conservar su forma. Guardar en lugar seco.",
  },
  {
    id: "zoe",
    nombre: "Zoe",
    categoria: "Bandolera",
    precio: 35,
    destacado: true,
    nuevo: true,
    estado: "disponible",
    colores: [
      { nombre: "Coñac", hex: "#96603A", fotos: 3 },
      { nombre: "Negro", hex: "#1A1A1A", fotos: 3 },
    ],
    material:
      "PVC con herraje en zamak color oro, cremallera en nylon y forro interior en poliéster sublimado",
    medidas: "23 × 19 × 9 cm",
    capacidad: "2 L",
    descripcion:
      "Ideal para los días que necesitas practicidad y que tu outfit resalte. En su interior dispone de tres compartimientos; el de mayor espacio tiene cierre en cremallera para mayor seguridad. Además, incluye una correa ajustable en el mismo material.",
    detalles: [
      "Tres compartimientos interiores; el de mayor espacio cierra con cremallera",
      "Correa ajustable en el mismo material",
      "Herraje en zamak color oro",
      "Forro interior en poliéster sublimado",
      "Hecho en Colombia",
    ],
    cuidados:
      "Limpiar con crema limpiadora para bolsos o con un paño suave ligeramente húmedo. No usar detergentes abrasivos ni cepillos. No lavar en máquina. No sumergir en agua. Evitar peso excesivo o presión prolongada para conservar su forma. Guardar en lugar seco.",
  },
  {
    id: "camila",
    nombre: "Camila",
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
    nombre: "Elly",
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
    nombre: "Vita",
    categoria: "Bandolera",
    precio: 70,
    destacado: true,
    nuevo: true,
    estado: "disponible",
    colores: [{ nombre: "Negro", hex: "#1A1A1A", fotos: 4 }],
    material:
      "PVC sintético de alta densidad, con herrajes en zamak color oro y forro interior en poliéster sublimado",
    medidas: "22 × 17 × 8 cm",
    capacidad: "3 L",
    descripcion:
      "Lo esencial contigo y las manos libres. Vita es una bandolera compacta en PVC que puedes llevar cruzada tipo pechera o adaptar a tu forma de uso gracias a su correa bordada artesanalmente, removible y graduable. Su interior incluye un bolsillo abierto pensado para guardar el celular separado de otros objetos y ayudar a evitar roces o rayones. Además, sus compartimientos exteriores con cremallera permiten mantener a la mano lo que usas con más frecuencia.",
    detalles: [
      "Correa bordada artesanalmente, removible y graduable",
      "Se puede usar cruzada tipo pechera",
      "Bolsillo interior abierto para el celular",
      "Compartimientos exteriores con cremallera",
      "Herrajes en zamak color oro",
      "Forro interior en poliéster sublimado",
      "Hecho en Colombia",
    ],
    cuidados:
      "Limpiar con paño seco o ligeramente húmedo. Evitar contacto directo con alcohol o perfumes. Guardar en su funda cuando no esté en uso. No exponer al sol prolongadamente.",
  },
  {
    id: "ritmo",
    nombre: "Ritmo",
    categoria: "Bandolera",
    precio: 75,
    destacado: false,
    nuevo: false,
    estado: "disponible",
    colores: [
      { nombre: "Amarillo", hex: "#E8B339", fotos: 3 },
      { nombre: "Negro", hex: "#1A1A1A", fotos: 3 },
    ],
    material:
      "PVC de alta densidad, con herrajes en zamak color oro y forro interior en poliéster sublimado",
    medidas: "21 × 19 × 12 cm",
    capacidad: "2.5 L",
    descripcion:
      "Dos compartimientos para organizar el día sin complicarte. Ritmo es un bolso pequeño y estructurado en PVC que distribuye el espacio en dos compartimientos independientes con cremallera. En el interior incorpora un bolsillo con cremallera y otro bolsillo abierto, para separar los objetos pequeños y mantenerlos más fáciles de encontrar. Incluye manijas cortas y una correa larga graduable tipo cinturón para llevarlo como manos libres.",
    detalles: [
      "Dos compartimientos independientes con cremallera",
      "1 bolsillo interior con cremallera y 1 bolsillo interior abierto",
      "Manijas cortas y correa larga graduable tipo cinturón",
      "Se puede usar como manos libres",
      "Herrajes en zamak color oro",
      "Forro interior en poliéster sublimado",
      "Hecho en Colombia",
    ],
    cuidados:
      "Limpiar con crema limpiadora para bolsos o con un paño suave ligeramente húmedo. No usar detergentes abrasivos ni cepillos. No lavar en máquina. No sumergir en agua. Evitar peso excesivo o presión prolongada para conservar su forma. Guardar en lugar seco.",
  },
  {
    id: "jessica",
    nombre: "Jessica",
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
