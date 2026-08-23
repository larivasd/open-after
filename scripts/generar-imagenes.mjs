/* ==========================================================================
   Open After — Generador de imágenes de ejemplo
   --------------------------------------------------------------------------
   Dibuja un SVG por cada foto declarada en js/productos.js, con una silueta
   distinta según la categoría y el color real del bolso.

   Son marcadores de posición: cuando tengas las fotos reales, bórralos y
   pon tus .jpg con el mismo nombre (tote-ada-1.jpg, tote-ada-2.jpg…), luego
   cambia EXTENSION_FOTO en js/util.js y en scripts/generar-paginas.mjs.

   Uso:  node scripts/generar-imagenes.mjs
   ========================================================================== */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const SALIDA = join(RAIZ, "img", "productos");

const ANCHO = 800;
const ALTO = 1000;
const FONDO = "#F3EFE8";

/* --- Siluetas ---------------------------------------------------------------
   Cada categoría tiene su forma. Coordenadas pensadas para un lienzo de
   800 × 1000 con el bolso centrado entre y=250 e y=780. */

const SILUETAS = {
  Tote: () => `
    <path d="M232 380 h336 l34 372 a24 24 0 0 1-24 26 H222 a24 24 0 0 1-24-26 Z"
          fill="url(#cuerpo)"/>
    <path d="M292 380 c0-92 46-138 108-138 s108 46 108 138"
          fill="none" stroke="url(#asa)" stroke-width="17" stroke-linecap="round"/>
    <path d="M232 380 h336" stroke="rgba(0,0,0,.13)" stroke-width="3"/>`,

  Shopper: () => `
    <path d="M206 396 h388 l30 356 a26 26 0 0 1-26 28 H202 a26 26 0 0 1-26-28 Z"
          fill="url(#cuerpo)"/>
    <path d="M276 396 c0-116 52-172 124-172 s124 56 124 172"
          fill="none" stroke="url(#asa)" stroke-width="15" stroke-linecap="round"/>
    <path d="M206 396 h388" stroke="rgba(0,0,0,.12)" stroke-width="3"/>
    <path d="M240 470 q160 34 320 0" fill="none" stroke="rgba(0,0,0,.07)" stroke-width="6"/>`,

  Bandolera: () => `
    <path d="M262 452 h276 a22 22 0 0 1 22 22 v210 a22 22 0 0 1-22 22 H262
             a22 22 0 0 1-22-22 V474 a22 22 0 0 1 22-22 Z" fill="url(#cuerpo)"/>
    <path d="M240 474 a22 22 0 0 1 22-22 h276 a22 22 0 0 1 22 22 v96
             H240 Z" fill="url(#solapa)"/>
    <path d="M240 570 h320" stroke="rgba(0,0,0,.16)" stroke-width="3"/>
    <path d="M268 452 C268 300 340 232 400 232 s132 68 132 220"
          fill="none" stroke="url(#asa)" stroke-width="13" stroke-linecap="round"/>
    <circle cx="400" cy="586" r="13" fill="rgba(255,255,255,.34)"/>`,

  Mochila: () => `
    <path d="M258 402 h284 a34 34 0 0 1 34 34 v308 a30 30 0 0 1-30 30 H254
             a30 30 0 0 1-30-30 V436 a34 34 0 0 1 34-34 Z" fill="url(#cuerpo)"/>
    <path d="M224 436 a34 34 0 0 1 34-34 h284 a34 34 0 0 1 34 34 v124
             q-176 40-352 0 Z" fill="url(#solapa)"/>
    <path d="M296 402 c0-108 46-162 104-162 s104 54 104 162"
          fill="none" stroke="url(#asa)" stroke-width="11" stroke-linecap="round"/>
    <rect x="372" y="536" width="56" height="34" rx="9" fill="rgba(0,0,0,.24)"/>
    <path d="M262 660 h276" stroke="rgba(0,0,0,.09)" stroke-width="4"/>`,

  Clutch: () => `
    <path d="M186 470 h428 a22 22 0 0 1 22 22 v184 a22 22 0 0 1-22 22 H186
             a22 22 0 0 1-22-22 V492 a22 22 0 0 1 22-22 Z" fill="url(#cuerpo)"/>
    <path d="M164 560 h472" stroke="rgba(0,0,0,.15)" stroke-width="4"/>
    <path d="M164 492 a22 22 0 0 1 22-22 h428 a22 22 0 0 1 22 22 v68 H164 Z"
          fill="url(#solapa)"/>
    <rect x="378" y="546" width="44" height="12" rx="6" fill="rgba(255,255,255,.4)"/>`,

  Mini: () => `
    <path d="M304 476 h192 a26 26 0 0 1 26 26 v168 a26 26 0 0 1-26 26 H304
             a26 26 0 0 1-26-26 V502 a26 26 0 0 1 26-26 Z" fill="url(#cuerpo)"/>
    <path d="M278 540 h244" stroke="rgba(0,0,0,.14)" stroke-width="3"/>
    <path d="M316 476 c0-84 38-124 84-124 s84 40 84 124"
          fill="none" stroke="url(#asa)" stroke-width="11" stroke-linecap="round"/>
    <path d="M300 580 q100 22 200 0" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="8"/>
    <path d="M300 632 q100 22 200 0" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="8"/>`,
};

/* --- Color -------------------------------------------------------------------- */

function aclarar(hex, cantidad) {
  const n = parseInt(hex.replace("#", ""), 16);
  const canal = (desplazamiento) => {
    const v = (n >> desplazamiento) & 0xff;
    const nuevo = Math.round(v + (cantidad > 0 ? (255 - v) * cantidad : v * cantidad));
    return Math.max(0, Math.min(255, nuevo));
  };
  return `rgb(${canal(16)}, ${canal(8)}, ${canal(0)})`;
}

/* --- Variantes ----------------------------------------------------------------
   Cada foto simula una toma distinta: frente, tres cuartos, detalle y una en
   el segundo color. Así la galería y el hover de las tarjetas se ven reales. */

const VARIANTES = [
  { etiqueta: "Frente", rotar: 0, escala: 1, color: 0 },
  { etiqueta: "Tres cuartos", rotar: -7, escala: 0.94, color: 0 },
  { etiqueta: "Detalle", rotar: 3, escala: 1.5, color: 0 },
  { etiqueta: "Otro color", rotar: 0, escala: 1, color: 1 },
  { etiqueta: "En uso", rotar: 9, escala: 0.88, color: 0 },
];

function svg(producto, indiceFoto) {
  const variante = VARIANTES[(indiceFoto - 1) % VARIANTES.length];
  const colores = producto.colores;
  const color = colores[Math.min(variante.color, colores.length - 1)];
  const silueta = (SILUETAS[producto.categoria] || SILUETAS.Tote)();

  const claro = aclarar(color.hex, 0.22);
  const oscuro = aclarar(color.hex, -0.28);
  const asaClara = aclarar(color.hex, -0.12);
  const asaOscura = aclarar(color.hex, -0.42);

  /* ESCALA_BASE llena mejor el encuadre 4:5 de las tarjetas: sin ella la
     silueta queda pequeña y rodeada de aire muerto. El desplazamiento hacia
     arriba deja libre la franja del pie donde va el texto. */
  const ESCALA_BASE = 1.16;
  const SUBIR = 34;
  const escala = variante.escala * ESCALA_BASE;

  const transformar = `translate(${ANCHO / 2} ${ALTO / 2 - SUBIR}) rotate(${variante.rotar}) scale(${escala}) translate(${-ANCHO / 2} ${-ALTO / 2})`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" width="${ANCHO}" height="${ALTO}" role="img" aria-label="${producto.nombre} en ${color.nombre}">
  <defs>
    <linearGradient id="cuerpo" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${claro}"/>
      <stop offset="0.55" stop-color="${color.hex}"/>
      <stop offset="1" stop-color="${oscuro}"/>
    </linearGradient>
    <linearGradient id="solapa" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${aclarar(color.hex, 0.1)}"/>
      <stop offset="1" stop-color="${aclarar(color.hex, -0.14)}"/>
    </linearGradient>
    <linearGradient id="asa" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${asaOscura}"/>
      <stop offset="0.5" stop-color="${asaClara}"/>
      <stop offset="1" stop-color="${asaOscura}"/>
    </linearGradient>
    <radialGradient id="sombra">
      <stop offset="0" stop-color="rgba(60,45,32,.30)"/>
      <stop offset="1" stop-color="rgba(60,45,32,0)"/>
    </radialGradient>
    <clipPath id="marco"><rect width="${ANCHO}" height="${ALTO}"/></clipPath>
  </defs>

  <rect width="${ANCHO}" height="${ALTO}" fill="${FONDO}"/>

  <g clip-path="url(#marco)">
    <g transform="${transformar}">
      <ellipse cx="400" cy="796" rx="196" ry="30" fill="url(#sombra)"/>
      ${silueta}
    </g>
  </g>

  <text x="40" y="944" font-family="Georgia, serif" font-size="30" fill="rgba(43,39,34,.62)">${escaparXml(producto.nombre)}</text>
  <text x="40" y="976" font-family="system-ui, sans-serif" font-size="19" letter-spacing="2.4" fill="rgba(43,39,34,.38)">${escaparXml(color.nombre.toUpperCase())} · ${escaparXml(variante.etiqueta.toUpperCase())}</text>
  <text x="${ANCHO - 40}" y="976" text-anchor="end" font-family="system-ui, sans-serif" font-size="17" letter-spacing="3" fill="rgba(43,39,34,.24)">FOTO DE EJEMPLO</text>
</svg>
`;
}

const escaparXml = (valor) =>
  String(valor).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c],
  );

/* --- Extras ------------------------------------------------------------------- */

/* Imagen de portada para la previsualización del enlace de la home. */
function portada(config) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#FAF7F2"/>
  <rect x="0" y="0" width="14" height="630" fill="#A8593C"/>
  <text x="90" y="286" font-family="Georgia, serif" font-size="96" fill="#2B2722">${escaparXml(config.marca)}</text>
  <text x="96" y="352" font-family="system-ui, sans-serif" font-size="27" letter-spacing="9" fill="#8A7F72">${escaparXml(config.producto.toUpperCase())}</text>
  <text x="96" y="426" font-family="Georgia, serif" font-size="34" font-style="italic" fill="#6B5F52">${escaparXml(config.descripcionCorta)}</text>
</svg>
`;
}

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="7" fill="#2B2722"/>
  <path d="M9 12h14l1.6 12.2a1.6 1.6 0 0 1-1.6 1.8H9a1.6 1.6 0 0 1-1.6-1.8Z" fill="#C7B29A"/>
  <path d="M12.6 12a3.4 3.4 0 0 1 6.8 0" fill="none" stroke="#A8593C" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

/* --- Ejecución ------------------------------------------------------------------ */

async function main() {
  const ventana = { OA: {} };
  for (const archivo of ["js/config.js", "js/productos.js"]) {
    const codigo = await readFile(join(RAIZ, archivo), "utf8");
    new Function("window", codigo)(ventana);
  }
  const { config, productos } = ventana.OA;

  await mkdir(SALIDA, { recursive: true });

  let total = 0;
  await Promise.all(
    productos.flatMap((producto) =>
      Array.from({ length: producto.fotos }, (_, i) => {
        total += 1;
        return writeFile(
          join(SALIDA, `${producto.id}-${i + 1}.svg`),
          svg(producto, i + 1),
          "utf8",
        );
      }),
    ),
  );

  await writeFile(join(RAIZ, "img", "portada.svg"), portada(config), "utf8");
  await writeFile(join(RAIZ, "img", "favicon.svg"), favicon, "utf8");

  console.log(`✓ ${total} imágenes de ejemplo en img/productos/`);
  console.log("✓ img/portada.svg y img/favicon.svg");
  console.log("\n  Cuando tengas las fotos reales:");
  console.log("  1. Ponlas en img/productos/ como <id>-1.jpg, <id>-2.jpg…");
  console.log("  2. Cambia EXTENSION_FOTO a \"jpg\" en js/util.js");
  console.log("     y en scripts/generar-paginas.mjs");
}

main().catch((error) => {
  console.error(`\n✗ ${error.message}\n`);
  process.exitCode = 1;
});
