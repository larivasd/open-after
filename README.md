# Open After · Bolsos Vursse

Tienda estática de bolsos. Catálogo, buscador, carrito y pedido por WhatsApp.
Sin base de datos, sin pasarela de pago, sin servidor.

- **HTML, CSS y JavaScript puros.** No hay build. Abres `index.html` y funciona.
- **Node solo para dos scripts opcionales** que generan las páginas de producto
  y las imágenes de ejemplo. La web no lo necesita para funcionar.

---

## Empezar en 3 pasos

### 1. Pon tu número de WhatsApp

Abre `js/config.js` y cambia estas dos líneas:

```js
whatsapp: "584141234567",              // tu número, sin +, sin espacios
sitio: "https://TU-USUARIO.github.io/open-after",   // dónde se publicará
```

El número va en formato internacional pegado, sin el `+`:

| País | Prefijo | Ejemplo |
|---|---|---|
| Venezuela | 58 | `584141234567` |
| Colombia | 57 | `573001234567` |
| México | 52 | `525512345678` |
| España | 34 | `34612345678` |

### 2. Míralo en tu computadora

```bash
python3 -m http.server 8000
```

Y abre <http://localhost:8000>.

> También puedes hacer doble clic en `index.html`, pero con el servidor local
> las rutas se comportan igual que en producción.

### 3. Publícalo en GitHub Pages

```bash
git init
git add .
git commit -m "feat: tienda Open After"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/open-after.git
git push -u origin main
```

Después, en GitHub: **Settings → Pages → Source: Deploy from a branch →
Branch: `main` / `/ (root)` → Save**.

En un minuto estará en `https://TU-USUARIO.github.io/open-after/`.

No hace falta GitHub Actions ni configurar nada más: son archivos estáticos y
se sirven tal cual.

---

## Agregar o cambiar bolsos

Todo el inventario vive en **`js/productos.js`**. Es el único archivo que
tocarás normalmente.

### Agregar un bolso

1. Copia un bloque completo del archivo y pégalo al final de la lista.
2. Cambia el `id` (minúsculas, números y guiones — se usa en la URL).
3. Ajusta nombre, precio, categoría, colores, medidas y descripción.
4. Pon sus fotos en `img/productos/` con los nombres `<id>-1.jpg`,
   `<id>-2.jpg`, … y pon en `fotos` cuántas son.
5. Genera su página:

```bash
node scripts/generar-paginas.mjs
```

### Cambiar un precio o el stock

Edita el valor en `js/productos.js`. Los precios y el campo `agotado` se leen
en vivo: **no hace falta regenerar nada**. Solo vuelve a subir el archivo.

Regenera únicamente cuando **agregues, quites o renombres** un bolso, o cuando
cambies su descripción (que va en las metaetiquetas).

### Campos de un producto

| Campo | Qué es |
|---|---|
| `id` | Identificador y URL. Sin espacios ni acentos |
| `nombre` | Nombre visible |
| `categoria` | Agrupa en los filtros. Reutiliza las existentes |
| `precio` | Número, sin símbolo de moneda |
| `fotos` | Cuántas fotos tiene (número entero) |
| `destacado` | `true` para que salga en la portada |
| `nuevo` | `true` para la etiqueta "Nuevo" |
| `agotado` | `true` desactiva el botón de compra |
| `colores` | Lista de `{ nombre, hex }` |
| `material`, `medidas`, `capacidad` | Se muestran en "Medidas y materiales" |
| `descripcion` | Párrafo principal. También va a Google y WhatsApp |
| `detalles` | Lista de viñetas |
| `cuidados` | Instrucciones de cuidado |

---

## Cambiar las fotos de ejemplo por las reales

Las imágenes actuales son SVG generados: siluetas de colores para que veas el
sitio funcionando. Para poner las tuyas:

1. Guarda cada foto en `img/productos/` como `<id>-1.jpg`, `<id>-2.jpg`, …
   Recomendado: **800 × 1000 px** (proporción 4:5), en WebP o JPG.
2. Cambia la extensión en **dos** sitios:
   - `js/util.js` → `const EXTENSION_FOTO = "jpg";`
   - `scripts/generar-paginas.mjs` → `const EXTENSION_FOTO = "jpg";`
3. Regenera las páginas: `node scripts/generar-paginas.mjs`
4. Borra los SVG viejos de `img/productos/`.

La **primera foto** de cada bolso es la que aparece en la tarjeta del catálogo
y en la previsualización de WhatsApp. La **segunda** se muestra al pasar el
cursor sobre la tarjeta: que sea otro ángulo, no la misma.

---

## Los dos scripts

Ambos son opcionales y solo se ejecutan en tu computadora.

```bash
node scripts/generar-paginas.mjs    # crea productos/*.html + sitemap + robots
node scripts/generar-imagenes.mjs   # crea las imágenes SVG de ejemplo
```

`generar-paginas.mjs` además:

- Valida el catálogo (ids repetidos, precios inválidos, colores faltantes) y
  se detiene con un mensaje claro si algo está mal.
- Borra las páginas de bolsos que ya no existen, para que no queden URLs
  vivas de productos retirados.
- Escribe los datos estructurados que permiten a Google mostrar el precio y la
  disponibilidad junto al resultado de búsqueda.

`generar-imagenes.mjs` **sobrescribe** los SVG de ejemplo. No lo ejecutes
después de poner tus fotos reales si usas la extensión `.svg`.

---

## Por qué una página HTML por producto

Cuando le mandas a una clienta el enlace de un bolso, WhatsApp lee las
etiquetas `<meta og:image>` del HTML para mostrar la miniatura. Si toda la
tienda fuera un solo `producto.html?id=3`, **todos los bolsos mostrarían la
misma foto genérica** en la previsualización.

Por eso cada bolso tiene su archivo con sus propias metaetiquetas. El
contenido visible lo arma `js/ficha.js` desde `productos.js`, así que esos
archivos son de ~40 líneas y no hay que mantenerlos a mano.

---

## Estructura

```
open-after/
├── index.html              Portada
├── catalogo.html           Catálogo con buscador y filtros
├── productos/*.html        Generados — no editar a mano
├── css/
│   ├── tokens.css          Colores, tipografía, espaciado. Empieza aquí
│   ├── base.css            Reset y tipografía base
│   ├── componentes.css     Header, botones, tarjeta, carrito, pie
│   └── paginas.css         Portada, catálogo y ficha
├── js/
│   ├── config.js           ← WhatsApp, moneda, contacto
│   ├── productos.js        ← EL CATÁLOGO
│   ├── util.js             Utilidades y búsqueda
│   ├── iconos.js           Iconos SVG
│   ├── carrito.js          Estado del carrito (localStorage)
│   ├── carrito-ui.js       Panel lateral y avisos
│   ├── whatsapp.js         Arma el mensaje del pedido
│   ├── layout.js           Cabecera y pie compartidos
│   ├── tarjeta.js          Tarjeta de producto
│   ├── galeria.js          Galería, zoom y lightbox
│   ├── catalogo.js         Buscador, filtros y orden
│   ├── ficha.js            Página de producto
│   └── inicio.js           Portada
├── img/productos/          Fotos
└── scripts/                Generadores (Node)
```

---

## Cómo funciona el pedido

1. La clienta añade bolsos al carrito. Se guardan en `localStorage`, así que
   siguen ahí si cierra la pestaña y vuelve.
2. Al pulsar **Pedir por WhatsApp** se abre un chat contigo con el pedido ya
   escrito: productos, colores, cantidades y total.
3. Tú confirmas disponibilidad, envío y forma de pago en la conversación.

No hay cobro automático ni registro de usuarios. El carrito solo existe en el
navegador de quien compra: tú no ves nada hasta que te escriben.

---

## Personalizar el diseño

Casi todo sale de `css/tokens.css`. Cambiar la marca de sitio es cuestión de
tocar unas pocas variables:

```css
--c-bone: oklch(97.5% 0.008 85);      /* fondo */
--c-ink: oklch(23% 0.014 60);         /* texto */
--c-terracota: oklch(57% 0.125 42);   /* acento */
--font-display: "Iowan Old Style", Palatino, Georgia, serif;
```

No se cargan fuentes externas a propósito: cero peticiones de red, cero saltos
de maquetación al cargar y funciona sin conexión. Si quieres una tipografía
propia, descarga los archivos a `fonts/` y declara un `@font-face` con
`font-display: swap` — no uses el CDN de Google Fonts, rompe la premisa de que
todo el material sea autocontenido.

Si cambias el titular de la portada, comprueba que "te acompañan" siga
cabiendo en una línea: `--text-hero` está calibrado para esa frase.

---

## Comprobado

Verificado con Playwright sobre Chromium (68 comprobaciones):

- Portada, catálogo y ficha sin errores de consola ni recursos rotos
- Buscador (incluye búsqueda sin acentos), filtros, orden y estado en la URL
- Botón atrás del navegador
- Carrito: añadir, sumar, restar, quitar, vaciar, persistencia tras recarga,
  y el mismo bolso en dos colores como líneas separadas
- Enlace de WhatsApp con producto, color, cantidades y total
- Galería: miniaturas, zoom al pasar el cursor, lightbox con teclado
- Sin scroll horizontal en 320, 375, 768, 1024, 1440 y 1920 px
- Todas las imágenes con `alt` y con `width`/`height` (evita saltos de layout)
- Foco por teclado y un único `<h1>` por página

## Pendiente de tu parte

- [ ] Cambiar `whatsapp` y `sitio` en `js/config.js`
- [ ] Reemplazar los textos de la portada por los tuyos
- [ ] Poner las fotos reales de los bolsos
- [ ] Revisar precios y stock en `js/productos.js`
- [ ] Cambiar `contacto` (Instagram, email, ciudad) en `js/config.js`
