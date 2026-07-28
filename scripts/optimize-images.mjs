/**
 * Reescribe a WebP los rasters de `public/` que se sirven sin pasar por el
 * optimizador de imágenes.
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
  // Sello de Lanzadera: 28 px de alto.
  { from: 'logos/lanzadera.png', maxHeight: 96 },
  // Wordmark del Nav y las guías: 162×28 vía next/image. El original venía a
  // 5918 px de ancho, ~36× lo que hace falta.
  { from: 'hollow_logo_name_color.png', maxHeight: 168 },
  // Wordmark blanco: 104×26 en el footer y una fracción de `em` en los mocks.
  { from: 'assets/solnow-wordmark-white.png', maxHeight: 168 },
];

const toWebp = (path) => path.replace(/\.(png|jpe?g|webp)$/i, '.webp');

let before = 0;
let after = 0;

for (const { from, maxHeight } of TARGETS) {
  const source = join(PUBLIC_DIR, from);
  const input = await readFile(source);

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
