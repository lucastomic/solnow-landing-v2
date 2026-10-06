// Detección de demanda: rellena volumen, top 10 y puntuación de cada candidata.
//
// Uso:
//   node --env-file=.env.local scripts/seo/demanda.mjs [--dry-run] [--solo-volumen] [--forzar]
//
//   --dry-run       No llama a la API: cuenta peticiones y enseña qué haría.
//   --solo-volumen  Mide volumen pero no consulta el top 10.
//   --forzar        Vuelve a medir filas que ya tienen datos.
//
// Credenciales (DataForSEO, autenticación básica) en `.env.local`, que está en
// .gitignore: DATAFORSEO_LOGIN y DATAFORSEO_PASSWORD. Nunca en el código.
//
// Mercado global: el volumen se pide sin ubicación (todo el mundo) y solo con
// el idioma. El top 10 no existe «global»: Google siempre resuelve desde un
// país, así que se toma uno de referencia por idioma (SERP_LOCATION, abajo).
//
// Puntuación = volumen × hueco × cercanía al producto.
//   hueco: 1 si nadie del sector está en el top 10; baja 0,1 por cada uno (mín. 0,2).
//   cercanía: por matriz × por actividad (tablas abajo, editables).
// Se marcan `descartada:sin-volumen` y `descartada:turista` (top 10 dominado por
// páginas para turistas). Las filas ya aprobadas, en lote o publicadas no se tocan.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, toCsv } from './csv.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CSV = resolve(ROOT, 'src/content/seo/candidatas.csv');
/**
 * Top 10 en bruto por consulta (`idioma|consulta` → URLs). Permite cambiar las
 * listas de sector o de turista y reclasificar sin volver a pagar la SERP.
 */
const CACHE = resolve(ROOT, 'src/content/seo/top10.json');
const API = 'https://api.dataforseo.com/v3';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run');
const SOLO_VOLUMEN = args.has('--solo-volumen');
const FORZAR = args.has('--forzar');

/** País de referencia para el top 10 (códigos de ubicación de DataForSEO). */
const SERP_LOCATION = { en: 2840 /* Estados Unidos */, es: 2724 /* España */ };

/**
 * Software para operadores (reservas, alquiler, exenciones): su presencia en el
 * top 10 resta hueco. La primera línea es la lista aprobada al empezar (Peek
 * es `peekpro.com`, no `peek.com`); el resto son los que aparecieron de verdad
 * en los top 10 de la primera pasada. Las webs genéricas de formularios
 * (jotform, pdffiller, dochub…) no cuentan: no venden a operadores.
 */
const SECTOR = [
  'fareharbor.com', 'bokun.io', 'turitop.com', 'peekpro.com', 'regiondo.com', 'rezdy.com',
  'checkfront.com', 'bookeo.com', 'xola.com',
  'rentmy.co', 'booqable.com', 'reservety.com', 'anolla.com', 'roverd.com', 'bloowatch.com',
  'theflybook.com', 'waverez.com', 'reservatoo.com', 'smartrezbooking.com', 'starboardsuite.com',
  'captainbook.io', 'lokki.rent', 'equipdash.com', 'indexic.net', 'recsystems.com',
  'ridesrentalsoftware.com', 'rentaltide.com', 'guideflow.com', 'yo-rent.com',
  'smartwaiver.com', 'waiverelectronic.com',
];
/** Áreas de proveedores de los marketplaces: también son sector, no turista. */
const SECTOR_SUPPLIER = /(supplier|supply|partner)[.-]?(viator|getyourguide)|((viator|getyourguide)\.[a-z.]+\/(supplier|supply|partner))/i;
/** Páginas para turistas: si dominan el top 10, la intención no es de operador. */
const TURISTA = [
  'tripadvisor.', 'viator.com', 'getyourguide.', 'civitatis.com', 'booking.com', 'expedia.',
  'airbnb.', 'klook.com', 'musement.com', 'yelp.',
];
const TURISTA_MIN = 5;

// E (preguntas de negocio) queda lejos de la demo: atrae a quien está montando
// o pensando el negocio, útil para retargeting, no para cerrar.
const CERCANIA_MATRIZ = { A: 1.0, B: 0.9, C: 0.6, D: 0.5, E: 0.4 };
const CERCANIA_ACTIVIDAD = {
  'jet-ski': 1.0, parasailing: 0.9, generico: 0.9, charter: 0.8,
  kayak: 0.7, 'paddle-surf': 0.7, catamaran: 0.7, hinchables: 0.6,
};

const INTOCABLE = /^(aprobada|lote-|publicada)/;

function auth() {
  const { DATAFORSEO_LOGIN: login, DATAFORSEO_PASSWORD: password } = process.env;
  if (!login || !password) {
    console.error(
      'Faltan DATAFORSEO_LOGIN y DATAFORSEO_PASSWORD.\n' +
        'Añádelos a .env.local y ejecuta: node --env-file=.env.local scripts/seo/demanda.mjs',
    );
    process.exit(1);
  }
  return 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');
}

async function post(path, body, authorization) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { Authorization: authorization, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  const task = json.tasks?.[0];
  if (!res.ok || json.status_code !== 20000 || !task || task.status_code !== 20000) {
    throw new Error(`${path}: ${res.status} ${task?.status_message ?? json.status_message ?? 'respuesta inesperada'}`);
  }
  return task.result ?? [];
}

const host = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

function clasificarTop10(urls) {
  const sector = new Set();
  let turista = 0;
  for (const url of urls) {
    const h = host(url);
    if (SECTOR.some((d) => h === d || h.endsWith('.' + d)) || SECTOR_SUPPLIER.test(url)) sector.add(h);
    else if (TURISTA.some((d) => h.includes(d))) turista++;
  }
  return { sector: [...sector], turista };
}

const hueco = (n) => Math.max(0.2, 1 - 0.1 * n);

async function main() {
  const filas = parseCsv(readFileSync(CSV, 'utf8'));
  const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
  const guardar = () => {
    writeFileSync(CSV, toCsv(filas));
    writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n');
  };
  const editables = filas.filter((f) => !INTOCABLE.test(f.estado));
  const authorization = DRY ? '' : auth();

  // 1. Volumen: una tarea por idioma (hasta 1000 consultas cada una), sin ubicación.
  const sinVolumen = editables.filter((f) => FORZAR || f.volumen === '');
  const porIdioma = Object.groupBy(sinVolumen, (f) => f.idioma);
  console.log(`Volumen: ${sinVolumen.length} consultas en ${Object.keys(porIdioma).length} tareas.`);
  if (!DRY) {
    for (const [idioma, grupo] of Object.entries(porIdioma)) {
      const result = await post(
        '/keywords_data/google_ads/search_volume/live',
        [{ keywords: grupo.map((f) => f.consulta), language_code: idioma }],
        authorization,
      );
      const vol = new Map(result.map((r) => [r.keyword.toLowerCase(), r.search_volume ?? 0]));
      for (const f of grupo) f.volumen = String(vol.get(f.consulta) ?? 0);
    }
    guardar(); // El volumen ya está pagado: que no dependa de que la SERP vaya bien.
  }

  // 2. Top 10: solo donde hay volumen (cada consulta es una petición).
  const key = (f) => `${f.idioma}|${f.consulta}`;
  const conVolumen = editables.filter((f) => Number(f.volumen) > 0 && (FORZAR || !cache[key(f)]));
  console.log(`Top 10: ${SOLO_VOLUMEN ? 0 : conVolumen.length} consultas.`);
  if (!DRY && !SOLO_VOLUMEN) {
    for (const f of conVolumen) {
      try {
        const [res] = await post(
          '/serp/google/organic/live/regular',
          [{ keyword: f.consulta, language_code: f.idioma, location_code: SERP_LOCATION[f.idioma], depth: 10 }],
          authorization,
        );
        cache[key(f)] = (res?.items ?? []).filter((i) => i.type === 'organic').slice(0, 10).map((i) => i.url);
      } catch (err) {
        // Una consulta que falla se queda sin top 10 y se reintenta en la siguiente pasada.
        console.error(`  ✗ ${f.consulta}: ${err.message}`);
      }
    }
  }
  for (const f of editables) {
    const urls = cache[key(f)];
    if (!urls) continue;
    const { sector, turista } = clasificarTop10(urls);
    f.top10_sector = sector.length ? `${sector.length} (${sector.join('; ')})` : '0';
    f._turista = turista;
  }

  // 3. Puntuación y estado.
  for (const f of editables) {
    const vol = Number(f.volumen);
    if (f.volumen === '') continue;
    if (!vol) {
      f.estado = 'descartada:sin-volumen';
      f.puntuacion = '0';
      continue;
    }
    if (f._turista >= TURISTA_MIN) {
      f.estado = 'descartada:turista';
      f.puntuacion = '0';
      continue;
    }
    const nSector = f.top10_sector === '' ? 0 : Number(f.top10_sector.split(' ')[0]);
    const cercania = CERCANIA_MATRIZ[f.matriz] * (CERCANIA_ACTIVIDAD[f.actividad] ?? 0.5);
    f.puntuacion = String(Math.round(vol * hueco(nSector) * cercania));
    f.estado = 'candidata';
  }

  if (DRY) {
    console.log('--dry-run: no se ha llamado a la API ni se ha escrito el CSV.');
    return;
  }
  guardar();

  const vivas = filas
    .filter((f) => f.estado === 'candidata' && f.puntuacion !== '')
    .sort((a, b) => Number(b.puntuacion) - Number(a.puntuacion));
  console.log(`\n${vivas.length} candidatas con demanda (de ${filas.length}):\n`);
  console.table(
    vivas.map((f) => ({
      puntuacion: Number(f.puntuacion),
      consulta: f.consulta,
      idioma: f.idioma,
      matriz: f.matriz,
      volumen: Number(f.volumen),
      top10_sector: f.top10_sector,
      existente: f.pagina_existente,
    })),
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
