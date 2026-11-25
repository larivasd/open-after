/* ==========================================================================
   Open After — Generador de páginas de producto
   --------------------------------------------------------------------------
   Crea un archivo productos/<id>.html por cada bolso de js/productos.js.

   Cada página lleva sus propias etiquetas <meta> escritas en el HTML: eso es
   lo que lee WhatsApp para mostrar la foto correcta cuando compartes el
   enlace de un bolso concreto. El contenido visible lo arma ficha.js.

   Uso:  node scripts/generar-paginas.mjs
   ========================================================================== */

import { readFile, writeFile, readdir, unlink, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const SALIDA = join(RAIZ, "productos");

/* --- Carga de datos --------------------------------------------------------
   config.js y productos.js están escritos para el navegador (asignan sobre
   `window`). Se ejecutan aquí con un `window` de mentira para no tener que
   duplicar el catálogo en otro formato. */

async function cargarDatos() {
  const ventana = { OA: {} };

  for (const archivo of ["js/config.js", "js/productos.js"]) {
    const ruta = join(RAIZ, archivo);
    if (!existsSync(ruta)) {
      throw new Error(`No se encuentra ${archivo}. ¿Estás en la raíz del proyecto?`);
    }
    const codigo = await readFile(ruta, "utf8");
    new Function("window", codigo)(ventana);
  }

  const { config, productos } = ventana.OA;

  if (!config?.sitio) {
    throw new Error("Falta `sitio` en js/config.js");
  }
  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error("js/productos.js no exporta ningún producto");
  }

  return { config, productos };
}

/* --- Validación ------------------------------------------------------------
   Errores caros de descubrir en producción: dos bolsos con el mismo id se
   pisan la página, y un id con espacios rompe la URL. */

function validar(productos) {
  const problemas = [];
  const vistos = new Set();

  for (const p of productos) {
    if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) {
      problemas.push(
        `id inválido: "${p.id}" (solo minúsculas, números y guiones)`,
      );
    }
    if (vistos.has(p.id)) problemas.push(`id repetido: "${p.id}"`);
    vistos.add(p.id);

    if (!Number.isFinite(p.precio) || p.precio <= 0) {
      problemas.push(`${p.id}: precio inválido (${p.precio})`);
    }
    if (!Array.isArray(p.colores) || p.colores.length === 0) {
      problemas.push(`${p.id}: necesita al menos un color`);
    } else {
      for (const c of p.colores) {
        if (!Number.isInteger(c.fotos) || c.fotos < 1) {
          problemas.push(
            `${p.id}: el color "${c.nombre}" necesita "fotos" como entero >= 1`,
          );
        }
      }
    }
  }

  if (problemas.length > 0) {
    throw new Error(`Problemas en el catálogo:\n  · ${problemas.join("\n  · ")}`);
  }
}

/* --- Utilidades ------------------------------------------------------------- */

const esc = (valor) =>
  String(valor ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

/* Recorta la descripción para las metaetiquetas sin cortar una palabra. */
function resumir(texto, limite = 155) {
  const limpio = String(texto).replace(/\s+/g, " ").trim();
  if (limpio.length <= limite) return limpio;
  const corte = limpio.slice(0, limite);
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
}

const EXTENSION_FOTO = "jpg"; // debe coincidir con EXTENSION_FOTO en js/util.js

/* Reproduce slugColor() de js/util.js: el nombre del color sin acentos, en
   minúsculas y con guiones en vez de espacios. */
function slugColor(nombre) {
  return String(nombre)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
}

const rutaFotoColor = (producto, color, indice) =>
  `img/productos/${producto.id}-${slugColor(color.nombre)}-${indice}.${EXTENSION_FOTO}`;

/* --- Plantilla --------------------------------------------------------------- */

function plantilla(producto, config) {
  const base = config.sitio.replace(/\/+$/, "");
  const url = `${base}/productos/${producto.id}.html`;
  const imagen = `${base}/${rutaFotoColor(producto, producto.colores[0], 1)}`;
  const titulo = `${producto.nombre} · ${config.marca}`;
  const descripcion = resumir(producto.descripcion);

  /* Datos estructurados: es lo que permite que Google muestre el precio y la
     disponibilidad junto al resultado de búsqueda. */
  const datosEstructurados = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: descripcion,
    image: producto.colores.flatMap((color) =>
      Array.from(
        { length: color.fotos },
        (_, i) => `${base}/${rutaFotoColor(producto, color, i + 1)}`,
      ),
    ),
    brand: { "@type": "Brand", name: config.producto },
    category: producto.categoria,
    material: producto.material,
    color: producto.colores.map((c) => c.nombre).join(", "),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: config.moneda.codigo,
      price: String(producto.precio),
      availability: producto.agotado
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: config.marca },
    },
  };

  return `<!doctype html>
<html lang="es" data-base=".." data-pagina="catalogo" data-producto="${esc(producto.id)}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(titulo)}</title>
    <meta name="description" content="${esc(descripcion)}" />
    <meta name="theme-color" content="#FAF7F2" />
    <link rel="canonical" href="${esc(url)}" />
    <link rel="icon" href="../img/favicon.svg" type="image/svg+xml" />

    <!-- Previsualización al compartir este bolso por WhatsApp -->
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="${esc(config.marca)}" />
    <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(descripcion)}" />
    <meta property="og:image" content="${esc(imagen)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="product:price:amount" content="${esc(producto.precio)}" />
    <meta property="product:price:currency" content="${esc(config.moneda.codigo)}" />
    <meta name="twitter:card" content="summary_large_image" />

    <link rel="stylesheet" href="../css/tokens.css" />
    <link rel="stylesheet" href="../css/base.css" />
    <link rel="stylesheet" href="../css/componentes.css" />
    <link rel="stylesheet" href="../css/paginas.css" />

    <!-- La primera foto es la LCP de esta página -->
    <link
      rel="preload"
      as="image"
      href="../${esc(rutaFotoColor(producto, producto.colores[0], 1))}"
    />

    <script type="application/ld+json">
${JSON.stringify(datosEstructurados, null, 6).replace(/</g, "\\u003c")}
    </script>
  </head>

  <body>
    <div data-slot="encabezado"></div>

    <main id="contenido" data-ficha>
      <noscript>
        <div class="contenedor" style="padding-block: var(--space-xl)">
          <h1>${esc(producto.nombre)}</h1>
          <p class="lead">${esc(producto.descripcion)}</p>
          <p>Precio: ${esc(config.moneda.simbolo)}${esc(producto.precio)}</p>
          <p>Activa JavaScript para ver las fotos y usar el carrito.</p>
        </div>
      </noscript>
    </main>

    <div data-slot="pie"></div>

    <script defer src="../js/config.js"></script>
    <script defer src="../js/productos.js"></script>
    <script defer src="../js/util.js"></script>
    <script defer src="../js/iconos.js"></script>
    <script defer src="../js/whatsapp.js"></script>
    <script defer src="../js/carrito.js"></script>
    <script defer src="../js/tarjeta.js"></script>
    <script defer src="../js/layout.js"></script>
    <script defer src="../js/carrito-ui.js"></script>
    <script defer src="../js/galeria.js"></script>
    <script defer src="../js/ficha.js"></script>
  </body>
</html>
`;
}

/* --- Sitemap ------------------------------------------------------------------ */

function sitemap(productos, config) {
  const base = config.sitio.replace(/\/+$/, "");
  const urls = [
    `${base}/`,
    `${base}/catalogo.html`,
    ...productos.map((p) => `${base}/productos/${p.id}.html`),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n")}
</urlset>
`;
}

/* --- Ejecución ----------------------------------------------------------------- */

async function main() {
  const { config, productos } = await cargarDatos();
  validar(productos);

  await mkdir(SALIDA, { recursive: true });

  /* Borra páginas de bolsos que ya no están en el catálogo, para que no
     queden URLs vivas de productos retirados. */
  const vigentes = new Set(productos.map((p) => `${p.id}.html`));
  const existentes = await readdir(SALIDA).catch(() => []);
  const huerfanas = existentes.filter(
    (f) => f.endsWith(".html") && !vigentes.has(f),
  );

  await Promise.all(huerfanas.map((f) => unlink(join(SALIDA, f))));

  await Promise.all(
    productos.map((p) =>
      writeFile(join(SALIDA, `${p.id}.html`), plantilla(p, config), "utf8"),
    ),
  );

  await writeFile(join(RAIZ, "sitemap.xml"), sitemap(productos, config), "utf8");

  /* robots.txt se regenera aquí para que la URL del sitemap no se quede
     apuntando a un dominio viejo al cambiar `sitio` en config.js. */
  await writeFile(
    join(RAIZ, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${config.sitio.replace(/\/+$/, "")}/sitemap.xml\n`,
    "utf8",
  );

  console.log(`✓ ${productos.length} páginas de producto en productos/`);
  if (huerfanas.length > 0) {
    console.log(`✓ ${huerfanas.length} página(s) obsoleta(s) eliminada(s)`);
  }
  console.log("✓ sitemap.xml y robots.txt actualizados");
  console.log(`  Sitio configurado en: ${config.sitio}`);
}

main().catch((error) => {
  console.error(`\n✗ ${error.message}\n`);
  process.exitCode = 1;
});
