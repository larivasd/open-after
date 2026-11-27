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

   `referenciaOficial` (opcional) es el link al producto equivalente en
   levursse.com de donde se copió nombre de color, descripción, detalles
   y cuidados tal cual los publica la marca. No se muestra en el sitio:
   es solo para poder volver a esa página si hay que verificar algo.
   Si un producto no tiene este campo es porque no se encontró (todavía)
   un equivalente exacto por nombre en el sitio oficial.
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
    // "Azul marino" y "Negro y camel" no aparecen como colores oficiales de
    // Cala en levursse.com (los oficiales son Azul celeste, Menta, Negro,
    // Rosa, Miel, Rojo y Salvia): revisar si son variantes propias o si el
    // nombre de color debería ajustarse.
    referenciaOficial: "https://levursse.com/products/bolso-2-azul-celeste",
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
      { nombre: "Miel", hex: "#96603A", fotos: 3 },
      { nombre: "Negro", hex: "#1A1A1A", fotos: 3 },
    ],
    material:
      "PVC con herraje en zamak color oro, cremallera en nylon y forro interior en poliéster sublimado",
    medidas: "23 × 19 × 9 cm",
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
    // "Negro" no aparece entre los colores oficiales de Zoe en
    // levursse.com (son Miel, Azul oscuro, Rojo y Beige): revisar si es
    // una variante propia o si el nombre debería ajustarse.
    referenciaOficial: "https://levursse.com/products/cartera-zoe-azul-oscuro",
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
      // Antes decía "Rosa" y "Azul marino": en levursse.com este color se
      // llama "Beige" y el azul se llama simplemente "Azul".
      { nombre: "Beige", hex: "#E6C9B8", fotos: 3 },
      { nombre: "Azul", hex: "#1F2A44", fotos: 3 },
    ],
    material:
      "PVC de alta densidad con textura granulada, herrajes en zamak color oro y forro interior en poliéster sublimado",
    medidas: "36 × 25 × 10 cm",
    descripcion:
      "Espacio y organización para acompañarte durante todo el día. Base es un bolso amplio y estructurado en PVC. Su interior cuenta con división central y bolsillo con cremallera para ayudarte a mantener tus cosas organizadas. Incluye una correa intercambiable y graduable tipo cinturón para llevarlo al hombro o cruzado.",
    detalles: [
      "Diseño estructurado con broche frontal metálico",
      "Interior amplio con división central y bolsillo interior con cremallera",
      "Correa intercambiable y graduable tipo cinturón, al hombro o cruzado",
      "Bolsillo posterior con cremallera",
      "Herrajes en zamak color oro",
      "Forro interior en poliéster sublimado",
      "Hecho en Colombia",
    ],
    cuidados:
      "Limpiar con un paño suave ligeramente húmedo o con crema limpiadora para bolsos. Material de fácil mantenimiento. No lavar en máquina. No usar cepillos ni detergentes fuertes que puedan afectar el color o el acabado. No colocar peso excesivo ni sobrecargar, para conservar su estructura.",
    referenciaOficial: "https://levursse.com/products/bolso-base-rosa-palido",
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
    material:
      "PVC sintético o PU de alta densidad, con herrajes en zamak color oro y forro interior en poliéster sublimado",
    medidas: "30 × 12 × 11 cm",
    descripcion:
      "Bolso mediano de silueta estructurada tipo baguette o baúl alargado, con acabado texturizado y brillo sutil. Sus líneas limpias mantienen la forma y ofrecen versatilidad tanto en looks casuales como elegantes, con asas superiores con hebillas decorativas y argollas laterales para adaptarlo a tu estilo.",
    detalles: [
      "Asas superiores con hebillas decorativas y argollas laterales",
      "Cierre superior con cremallera en nylon",
      "Placa frontal con detalles de la marca",
      "Herrajes en zamak color oro",
      "Forro interior en poliéster sublimado",
      "Hecho en Colombia",
    ],
    cuidados:
      "Limpiar en seco con un paño suave, seco o ligeramente humedecido con agua. Aplicar crema limpiadora especial para bolsos sintéticos para conservar su brillo y textura. Evitar el contacto con alcohol, solventes, perfumes directos o superficies abrasivas que puedan rayar o desgastar el recubrimiento. Guardar con relleno interior para que no pierda la forma.",
    // A diferencia de los demás, este texto no lo verifiqué yo mismo en
    // levursse.com: lo encontró Gemini en una ficha archivada/oculta del
    // modelo "Bolso Ely". No hay referenciaOficial porque no tengo la URL
    // exacta; si aparece, agregarla aquí.
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
    referenciaOficial:
      "https://levursse.com/products/bandolera-vita-%F0%9F%90%A2-negro",
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
    referenciaOficial:
      "https://levursse.com/products/bolso-ritmo-coleccion-intencion-amarillo",
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
      // Antes decía "Amarillo": en levursse.com este tono de tejido se
      // llama "Mostaza" (los únicos colores de este modelo son Negro y
      // Mostaza).
      { nombre: "Mostaza", hex: "#C9962D", fotos: 1 },
      { nombre: "Negro", hex: "#1A1A1A", fotos: 2 },
    ],
    material: "Tejido de hilo (crochet), con correa de cuero ajustable",
    medidas: "30 × 33 × 10 cm",
    descripcion:
      "Un bolso que juega con el contraste y la textura. Su diseño tejido con franjas crea un ritmo visual sutil que aporta carácter, mientras su silueta flexible se adapta al movimiento con naturalidad. Es liviano, cómodo y fácil de llevar, con correa ajustable para usar al hombro.",
    detalles: [
      "Diseño tejido a rayas, con bolsita organizadora interna con cremallera",
      "Bolsa interna: 30 × 25 × 4 cm",
      "Correa ajustable para usar al hombro",
      "Ligero, amplio y funcional para uso diario",
      "Hecho en Colombia",
    ],
    cuidados:
      "Lavar a mano con jabón suave. No lavar en lavadora. No restregar sobre superficies ásperas. Secar al aire libre. La correa puede limpiarse con un paño suave ligeramente húmedo.",
    referenciaOficial:
      "https://levursse.com/products/bolso-tejido-con-funda-interna-3",
  },
  {
    // En levursse.com este modelo se llama "Bolso Abby".
    id: "kathy",
    nombre: "Kathy",
    categoria: "Bandolera",
    precio: 60,
    destacado: false,
    nuevo: true,
    estado: "disponible",
    colores: [
      { nombre: "Verde pino", hex: "#2F4A3E", fotos: 3 },
      { nombre: "Café", hex: "#A08670", fotos: 3 },
    ],
    material:
      "PVC sintético de alta densidad, con herrajes zamak en tono dorado, cremallera en nylon y forro interior en poliéster sublimado",
    medidas: "22 × 15 × 9 cm",
    descripcion:
      "Pequeño, práctico y con dos formas de llevarlo. Abby es un bolso pequeño en PVC, ideal para llevar lo esencial bien organizado. Incluye dos correas graduables —una en el mismo tono y un strap tejido con diseño— para cambiar la forma de llevarlo según el momento. En su interior cuenta con un bolsillo con cremallera y un bolsillo independiente para guardar el celular y evitar que se roce con otros objetos.",
    detalles: [
      "Dos correas graduables incluidas: una en el mismo tono y un strap tejido intercambiable",
      "Bolsillo interior con cremallera y bolsillo interior para el celular",
      "Bolsillo exterior con cremallera en el espaldar",
      "Cierre principal con cremallera",
      "Sello de marca en relieve frontal, cosido",
      "Herrajes zamak en tono dorado",
      "Forro interior en poliéster sublimado",
      "Hecho en Colombia",
    ],
    cuidados:
      "Limpiar con crema limpiadora para bolsos o con un paño suave ligeramente húmedo. No usar detergentes abrasivos ni cepillos. No lavar en máquina. No sumergir en agua. Evitar peso excesivo o presión prolongada para conservar su forma. Guardar en lugar seco.",
    referenciaOficial: "https://levursse.com/products/bolso-abby-verde-pistacho",
  },
  {
    id: "noma",
    nombre: "Noma",
    categoria: "Morral",
    precio: 65,
    destacado: false,
    nuevo: true,
    estado: "disponible",
    colores: [
      // Ambos son de dos tonos: cuerpo en lona negra y solapa/base en
      // PVC de color (con asa y correas en rojo o mostaza, respectivamente).
      { nombre: "Negro y verde", hex: "#1A1A1A", hex2: "#2F4A3E", fotos: 5 },
      { nombre: "Negro y azul", hex: "#1A1A1A", hex2: "#7C9CC8", fotos: 6 },
    ],
    material: "Lona y PVC",
    medidas: "32 × 36 × 13 cm",
    descripcion:
      "Todo en su lugar, incluso cuando necesitas llevar más. Noma es un morral amplio para mujer, elaborado en lona y PVC, con espacio para organizar lo que necesitas durante el día. Su compartimento independiente y acolchado para portátil de hasta 13\" ayuda a mantenerlo protegido y separado, mientras su apertura ajustable permite ganar espacio cuando necesitas llevar algo más grande.",
    detalles: [
      "Compartimento independiente y acolchado para portátil de hasta 13\"",
      "1 bolsillo interior con cremallera y 2 abiertos",
      "Bolsillo frontal con cremallera",
      "Bolsillo lateral para botella o sombrilla",
      "Cierre principal con cremallera",
      "Apertura ajustable",
      "Correas ajustables",
    ],
    cuidados:
      "Limpiar con crema limpiadora para bolsos o con un paño suave ligeramente húmedo. No usar detergentes abrasivos ni cepillos. No lavar en máquina. No sumergir en agua. Evitar peso excesivo o presión prolongada para conservar su forma. Guardar en lugar seco.",
    referenciaOficial: "https://levursse.com/products/maleta-negro-y-verde",
  },
  {
    id: "vianca",
    nombre: "Vianca",
    categoria: "Cartera",
    precio: 50,
    destacado: false,
    nuevo: true,
    estado: "disponible",
    colores: [{ nombre: "Azul", hex: "#232B45", fotos: 4 }],
    material: "PVC",
    medidas: "22 × 21 × 12 cm",
    descripcion:
      "Dos formas de llevarla. Todo más fácil de organizar. Vianca es un bolso en PVC con un compartimento central con cremallera que divide y organiza el interior. Llévala con su correa corta bordada VURSSE o como manos libres con su correa larga graduable. Su logo frontal cosido le da el detalle distintivo.",
    detalles: [
      "División central con cremallera",
      "Bolsillo posterior con cremallera",
      "Correa corta bordada VURSSE",
      "Correa larga graduable",
      "Logo frontal cosido",
    ],
    cuidados:
      "Limpiar con crema limpiadora para bolsos o con un paño suave ligeramente húmedo. No usar detergentes abrasivos ni cepillos. No lavar en máquina. No sumergir en agua. Evitar peso excesivo o presión prolongada para conservar su forma. Guardar en lugar seco.",
    referenciaOficial: "https://levursse.com/products/bolso-vianca-azul",
  },
  {
    id: "portacelular",
    nombre: "Portacelular",
    categoria: "Portacelular",
    precio: 50,
    destacado: false,
    nuevo: true,
    estado: "disponible",
    colores: [
      { nombre: "Negro", hex: "#1A1A1A", fotos: 3 },
      // En levursse.com este tono se llama "Terracota" aunque en foto se ve
      // casi rojo (la URL oficial es .../portacelular-naranja).
      { nombre: "Terracota", hex: "#C8402E", fotos: 4 },
      // "Rosa" en el sitio oficial: es un rosa empolvado que tira a taupe.
      { nombre: "Rosa", hex: "#B48C76", fotos: 3 },
      { nombre: "Azul", hex: "#2E3561", fotos: 4 },
      { nombre: "Celeste", hex: "#8DB0DA", fotos: 4 },
      { nombre: "Amarillo", hex: "#F2B82C", fotos: 4 },
      { nombre: "Blanco", hex: "#E8E1DA", fotos: 4 },
    ],
    material:
      "PVC, con herraje zamak en color oro, cremallera en nylon y forro interior en poliéster sublimado",
    medidas: "13 × 20 × 7 cm",
    descripcion:
      "Compacto, práctico y versátil. Este portacelular está diseñado para llevar lo esencial de forma cómoda y segura. Cuenta con compartimientos funcionales que facilitan la organización y un diseño liviano ideal para acompañarte en tu rutina diaria. Incluye un strap intercambiable que le da un toque personalizable, convirtiéndolo en el complemento perfecto para cualquier ocasión.",
    detalles: [
      "Diseño liviano con múltiples compartimientos",
      "Strap removible e intercambiable",
      "Bolsillo frontal y bolsillo posterior externo",
      "Ideal para uso diario y viajes cortos",
      "Herraje zamak en color oro con detalles de la marca",
      "Forro interior en poliéster sublimado",
      "Hecho en Colombia",
    ],
    cuidados:
      "Lavar a mano con jabón suave. No lavar en máquina para evitar daños en la herrajería. No usar cepillos abrasivos. Secar al aire libre. Evitar fricción excesiva sobre superficies ásperas.",
    // Ojo: en levursse.com la pestaña "Detalles" de este producto habla de
    // lona y 16 × 26 × 10 cm, lo que contradice la "Descripción" (PVC,
    // 13 × 20 × 7 cm) y parece copiada de otro modelo. Se usó la Descripción.
    referenciaOficial: "https://levursse.com/products/portacelular-negro",
  },
  {
    // No existe un monedero/billetera en levursse.com (solo tarjeteros, que
    // son otro diseño): nombre, colores y texto son propios y se limitan a
    // lo que se ve en la foto. Sin medidas ni material confirmados.
    id: "monedero-rombos",
    nombre: "Monedero Rombos",
    categoria: "Monedero",
    precio: 20,
    destacado: false,
    nuevo: true,
    estado: "disponible",
    colores: [
      { nombre: "Crema", hex: "#E5E0D6", fotos: 1 },
      { nombre: "Verde salvia", hex: "#B7BE9C", fotos: 1 },
    ],
    descripcion:
      "Monedero tipo billetera con acabado acolchado en rombos y solapa con broche metálico cuadrado. Compacto para llevar dentro de tu bolso lo esencial: tarjetas, billetes y monedas.",
    detalles: [
      "Acabado acolchado en rombos",
      "Cierre de solapa con broche metálico",
    ],
  },
  {
    // Igual que "Monedero Rombos": sin equivalente en levursse.com.
    id: "monedero-broche",
    nombre: "Monedero Broche",
    categoria: "Monedero",
    precio: 20,
    destacado: false,
    nuevo: true,
    estado: "disponible",
    colores: [{ nombre: "Rojo", hex: "#9E1B22", fotos: 1 }],
    descripcion:
      "Monedero alargado tipo billetera con textura granulada y cierre de lengüeta con broche metálico plateado. Ideal para llevar tarjetas, billetes y monedas en orden.",
    detalles: [
      "Formato alargado tipo billetera",
      "Textura granulada",
      "Cierre de lengüeta con broche metálico plateado",
    ],
  },
]);
