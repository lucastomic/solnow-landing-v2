/**
 * Prepara los rasters de `public/` que el navegador se descarga tal cual:
 * los que se sirven con `<Image unoptimized>` y los iconos que declara el
 * `<head>`. Ninguno pasa por el optimizador de imágenes de Next.
 *
 * El carrusel de clientes usa `<Image unoptimized>`, así que el navegador se
 * descarga el fichero original tal cual: eran ~1,5 MB de PNG para pintarlos a
 * 64 px de alto. Se preprocesan aquí, en build-time, en lugar de gastar cuota
 * de optimización de Vercel en cada variante.
 *
 * Idempotente: todas las fuentes son PNG/JPG, así que el `.webp` de salida
 * nunca pisa su propio origen. Los dos logos que ya venían en WebP quedan
 * fuera a propósito — reencodificarlos sobre sí mismos degradaría la imagen un
 * poco más en cada pasada, y con 30 KB no compensa.
 *
 * Los iconos van aparte, al final: no son un carrusel sino favicon, apple-icon
 * y los dos tamaños del manifest, y se generan a medida en vez de reutilizar un
 * original enorme (ver `ICONS`).
 *
 *   node scripts/optimize-images.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

/**
 * `maxHeight` es 3× la altura de render, el techo razonable de densidad de
 * pantalla. Nunca se amplía: `withoutEnlargement` deja intactos los que ya son
 * más pequeños (marina-jets, ibizarentaboat).
 */
const TARGETS = [
  // Carrusel de clientes: 64 px de alto, ancho máximo 240 px.
  { from: 'logos/marina-jets.png', maxHeight: 192 },
  { from: 'logos/jetskilloret.png', maxHeight: 192 },
  { from: 'logos/ibizarentaboat.png', maxHeight: 192 },
  { from: 'logos/morairaboatsadventures.png', maxHeight: 192 },
  { from: 'logos/primeyachtmallorca.png', maxHeight: 192 },
  { from: 'logos/rentboatinalicante.png', maxHeight: 192 },
  { from: 'logos/trulovesailing.png', maxHeight: 192 },
  // Estos dos solo existen en WebP: no hay PNG del que partir. Quedaron fuera
  // de la lista cuando se escribió el script —reencodificar WebP sobre sí mismo
  // degrada— y por eso seguían sirviéndose a tamaño completo: 1576×432 y
  // 671×320 para pintarse a 44 px de alto. Aquí el reencodeo no es gratuito
  // pero sí puntual: el guard de abajo salta el fichero en cuanto ya cumple el
  // alto, así que una segunda pasada no vuelve a tocarlo.
  { from: 'logos/elysium.webp', maxHeight: 192 },
  { from: 'logos/cocoon.webp', maxHeight: 192 },
  // Sello de Lanzadera: 28 px de alto.
  { from: 'logos/lanzadera.png', maxHeight: 96 },
  // Wordmark del Nav y las guías: 162×28 vía next/image. El original venía a
  // 5918 px de ancho, ~36× lo que hace falta.
  { from: 'hollow_logo_name_color.png', maxHeight: 168 },
  // Wordmark blanco: 104×26 en el footer y una fracción de `em` en los mocks.
  { from: 'assets/solnow-wordmark-white.png', maxHeight: 168 },
  // Caso de éxito de Banana Summer: el logo del cliente en el hero (56 px de
  // alto) y la foto en acuarela dentro del cuerpo. Ninguna pasa por
  // `next/image` optimizado, así que se preprocesan como el resto.
  { from: 'casos/marinajets-logo.png', maxHeight: 168 },
  // Las acuarelas conservan su alto nativo (425 px): son el máximo que hay y
  // recortarlas se comería el difuminado de los bordes, que es el efecto.
  { from: 'casos/marinajets-acuarela.png', maxHeight: 850 },
  { from: 'casos/marinajets-banana.png', maxHeight: 850 },
  // Las dos verticales sí se bajan: a tamaño nativo ocupaban 677 px de alto en
  // mitad de una columna de 760, y la foto se comía la sección.
  { from: 'casos/marinajets-flota.png', maxHeight: 560 },
  { from: 'casos/marinajets-parasailing.jpg', maxHeight: 560 },
  // Caso de Moraira Boats: casi cuadrada, va a un lado del texto como las
  // verticales de Marina Jets y se baja al mismo alto.
  { from: 'casos/moraira-cueva.jpg', maxHeight: 560 },
];

const toWebp = (path) => path.replace(/\.(png|jpe?g|webp)$/i, '.webp');

let before = 0;
let after = 0;

for (const { from, maxHeight } of TARGETS) {
  const source = join(PUBLIC_DIR, from);
  const input = await readFile(source);

  // Cuando la fuente ya es WebP, la salida pisa su propio origen. Saltar el que
  // ya cumple el alto es lo que mantiene el script idempotente en ese caso.
  if (toWebp(from) === from) {
    const { height } = await sharp(input).metadata();
    if (height <= maxHeight) {
      console.log(`${from.padEnd(42)} sin cambios (ya está a ${height} px de alto)`);
      before += input.byteLength;
      after += input.byteLength;
      continue;
    }
  }

  const output = await sharp(input)
    .resize({ height: maxHeight, fit: 'inside', withoutEnlargement: true })
    // Los logos son planos y con transparencia; `effort: 6` aprieta bastante
    // más sin coste perceptible porque esto corre una vez, no por petición.
    .webp({ quality: 82, effort: 6 })
    .toBuffer();

  // Un PNG ya diminuto y bien cuantizado puede salir más grande en WebP.
  if (output.byteLength >= input.byteLength) {
    console.log(`${from.padEnd(42)} sin cambios (WebP no mejora el original)`);
    before += input.byteLength;
    after += input.byteLength;
    continue;
  }

  const destination = join(PUBLIC_DIR, toWebp(from));
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, output);

  const { width, height } = await sharp(output).metadata();
  before += input.byteLength;
  after += output.byteLength;

  const delta = ((1 - output.byteLength / input.byteLength) * 100).toFixed(0);
  console.log(
    `${toWebp(from).padEnd(42)} ${width}x${height}`.padEnd(58) +
      `${(input.byteLength / 1024).toFixed(0)} KB → ${(output.byteLength / 1024).toFixed(0)} KB  (-${delta}%)`
  );
}

console.log(
  `\nTotal: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB ` +
    `(-${((1 - after / before) * 100).toFixed(0)}%)`
);

/**
 * Iconos declarados en el `<head>` y en el manifest.
 *
 * Se servían dos originales de pantalla completa: `logo_color.png` (726×720,
 * 55 KB) como favicon, shortcut y apple-icon a la vez —el navegador lo pedía
 * dos veces por página— y `assets/solnow-mark.png` (963×514, 217 KB) como
 * icono único del manifest, con `sizes: "any"`. Son 277 KB que no pinta nadie y
 * que caían justo en la ventana en la que la landing de anuncios todavía se
 * está pintando.
 *
 * El manifest quiere cuadrados: `fit: contain` con fondo transparente rellena
 * sin recortar la marca ni deformarla.
 */
const ICONS = [
  { from: 'logo_color.png', to: 'icon-32.png', size: 32 },
  { from: 'logo_color.png', to: 'apple-icon.png', size: 180 },
  { from: 'assets/solnow-mark.png', to: 'icons/icon-192.png', size: 192 },
  { from: 'assets/solnow-mark.png', to: 'icons/icon-512.png', size: 512 },
];

console.log('\nIconos:');

for (const { from, to, size } of ICONS) {
  const input = await readFile(join(PUBLIC_DIR, from));

  const output = await sharp(input)
    .resize({
      width: size,
      height: size,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  const destination = join(PUBLIC_DIR, to);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, output);

  console.log(
    `${to.padEnd(42)} ${size}x${size}`.padEnd(58) +
      `${(input.byteLength / 1024).toFixed(0)} KB → ${(output.byteLength / 1024).toFixed(1)} KB`
  );
}
