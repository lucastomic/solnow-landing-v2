// Genera la matriz de consultas candidatas para el SEO programático.
// Uso: node scripts/seo/candidatas.mjs
//
// Escribe src/content/seo/candidatas.csv. Si el CSV ya existe, conserva lo que
// el script de demanda o una persona haya rellenado (volumen, top 10,
// puntuación, estado) para las consultas que siguen en la matriz; solo añade
// las nuevas. Una candidata NO es una página: lo es cuando su estado pasa a
// `aprobada` y entra en un lote.
//
// Fuera de la matriz a propósito: actividad × destino. Esas páginas ya
// existen y no tienen demanda.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLUMNS, parseCsv, toCsv } from './csv.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, 'src/content/seo/candidatas.csv');

/**
 * `rental`: el operador alquila unidades (se busca «rental software»).
 * `tour`: vende plazas o turnos (se busca «booking software»).
 */
const ACTIVIDADES = [
  { id: 'jet-ski', tipo: 'rental', en: 'jet ski', es: 'motos de agua' },
  { id: 'charter', tipo: 'rental', en: 'boat charter', es: 'chárter náutico' },
  { id: 'kayak', tipo: 'rental', en: 'kayak', es: 'kayak' },
  { id: 'paddle-surf', tipo: 'rental', en: 'paddle board', es: 'paddle surf' },
  { id: 'parasailing', tipo: 'tour', en: 'parasailing', es: 'parasailing' },
  { id: 'catamaran', tipo: 'tour', en: 'catamaran cruise', es: 'excursiones en catamarán' },
  { id: 'hinchables', tipo: 'tour', en: 'inflatable water park', es: 'parque acuático hinchable' },
  { id: 'generico', tipo: 'tour', en: 'watersports', es: 'actividades acuáticas' },
];

const COMPETIDORES = ['FareHarbor', 'Bókun', 'TuriTop', 'Peek', 'Regiondo', 'Rezdy'];
const CANALES = ['Viator', 'GetYourGuide', 'Civitatis'];

// A. actividad × software
function matrizA(a) {
  const en = a.tipo === 'rental'
    ? [`${a.en} rental software`, `${a.en} booking software`]
    : [`${a.en} booking software`, `${a.en} reservation system`];
  const es = a.tipo === 'rental'
    ? [`software alquiler ${a.es}`, `software reservas ${a.es}`]
    : [`software reservas ${a.es}`, `sistema de reservas ${a.es}`];
  return [
    ...en.map((q, i) => ({ consulta: q, idioma: 'en', modificador: i ? 'booking/reservation' : 'software' })),
    ...es.map((q, i) => ({ consulta: q, idioma: 'es', modificador: i ? 'reservas/sistema' : 'software' })),
  ];
}

// B. actividad × competidor
function matrizB(a) {
  return COMPETIDORES.flatMap((c) => [
    { consulta: `${c.toLowerCase()} alternative ${a.en}`, idioma: 'en', modificador: c },
    { consulta: `alternativa a ${c.toLowerCase()} ${a.es}`, idioma: 'es', modificador: c },
  ]);
}

// C. actividad × documento
const DOCUMENTOS = [
  { id: 'contrato', en: (a) => `${a.en} rental agreement template`, es: (a) => `contrato de alquiler ${a.es}` },
  { id: 'exencion', en: (a) => `${a.en} waiver template`, es: (a) => `exención de responsabilidad ${a.es}` },
  { id: 'precios', en: (a) => `${a.en} price list template`, es: (a) => `plantilla lista de precios ${a.es}` },
  { id: 'checklist', en: (a) => `${a.en} safety checklist`, es: (a) => `checklist de seguridad ${a.es}` },
  { id: 'libro', en: (a) => `${a.en} logbook`, es: (a) => `libro de registro ${a.es}` },
];
function matrizC(a) {
  return DOCUMENTOS.flatMap((d) => [
    { consulta: d.en(a), idioma: 'en', modificador: d.id },
    { consulta: d.es(a), idioma: 'es', modificador: d.id },
  ]);
}

// D. actividad × canal de venta
function matrizD(a) {
  return CANALES.flatMap((c) => [
    { consulta: `how to sell ${a.en} on ${c.toLowerCase()}`, idioma: 'en', modificador: c },
    { consulta: `cómo vender ${a.es} en ${c.toLowerCase()}`, idioma: 'es', modificador: c },
  ]);
}

// E. Preguntas de negocio del operador que no encajan en A-D. Solo en inglés.
// Escritas a mano, no combinadas: cada una es una pregunta que se hace quien
// explota (o va a montar) el negocio, nunca quien alquila.
const PREGUNTAS_E = {
  'jet-ski': [
    ['how to start a jet ski rental business', 'start'],
    ['jet ski rental insurance', 'insurance'],
    ['is a jet ski rental business profitable', 'profit'],
    ['how to price jet ski rentals', 'pricing'],
    ['jet ski rental business plan', 'plan'],
    ['how much does a jet ski rental business make', 'revenue'],
    ['jet ski rental license requirements', 'license'],
    ['best jet skis for a rental fleet', 'fleet'],
    ['how to market a jet ski rental business', 'marketing'],
  ],
  charter: [
    ['how to start a boat charter business', 'start'],
    ['boat charter insurance', 'insurance'],
    ['is a boat charter business profitable', 'profit'],
    ['how much does a boat charter business make', 'revenue'],
    ['boat charter business plan', 'plan'],
    ['how to price boat charters', 'pricing'],
    ['charter captain license requirements', 'license'],
  ],
  kayak: [
    ['how to start a kayak rental business', 'start'],
    ['kayak rental insurance', 'insurance'],
    ['is a kayak rental business profitable', 'profit'],
    ['kayak rental business plan', 'plan'],
    ['how to price kayak rentals', 'pricing'],
    ['how much does a kayak rental business make', 'revenue'],
    ['kayak rental business permit', 'license'],
    ['how to market a kayak rental business', 'marketing'],
  ],
  'paddle-surf': [
    ['how to start a paddle board rental business', 'start'],
    ['paddle board rental insurance', 'insurance'],
    ['is a paddle board rental business profitable', 'profit'],
    ['paddle board rental business plan', 'plan'],
    ['how to price paddle board rentals', 'pricing'],
    ['paddle board rental permit', 'license'],
  ],
  parasailing: [
    ['how to start a parasailing business', 'start'],
    ['parasailing business insurance', 'insurance'],
    ['how much does a parasailing business make', 'revenue'],
    ['is a parasailing business profitable', 'profit'],
    ['parasailing business plan', 'plan'],
    ['parasail boat for sale', 'fleet'],
    ['parasailing operator license', 'license'],
  ],
  catamaran: [
    ['how to start a catamaran tour business', 'start'],
    ['catamaran tour business insurance', 'insurance'],
    ['is a catamaran charter business profitable', 'profit'],
    ['how much does a catamaran charter business make', 'revenue'],
    ['catamaran tour business plan', 'plan'],
    ['how to price catamaran tours', 'pricing'],
  ],
  hinchables: [
    ['how to start an inflatable water park business', 'start'],
    ['inflatable water park insurance', 'insurance'],
    ['is an inflatable water park profitable', 'profit'],
    ['how much does an inflatable water park cost', 'cost'],
    ['inflatable water park business plan', 'plan'],
    ['floating water park permit', 'license'],
    ['how much does an inflatable water park make', 'revenue'],
  ],
};
function matrizE(a) {
  return (PREGUNTAS_E[a.id] ?? []).map(([consulta, modificador]) => ({ consulta, idioma: 'en', modificador }));
}

/**
 * Páginas que ya responden a la consulta (publicadas o aparcadas en la rama
 * `contenido/borrador-paginas-actividad`). Clave: matriz|actividad|modificador|idioma;
 * `*` vale para cualquier modificador.
 */
const EXISTENTES = {
  'A|jet-ski|*|en': '/en/jet-ski-rental-software',
  'A|jet-ski|*|es': '/es/software-alquiler-motos-de-agua',
  'A|parasailing|*|en': '/en/parasailing-booking-software',
  'A|parasailing|*|es': '/es/software-reservas-parasailing',
  'A|generico|*|en': '/en/best-watersports-booking-software',
  'A|generico|*|es': '/es/mejores-software-reservas-actividades-acuaticas',
  'B|jet-ski|FareHarbor|en': '/en/fareharbor-alternative-watersports',
  'B|jet-ski|FareHarbor|es': '/es/fareharbor-alternativa-motos-de-agua',
  'B|generico|FareHarbor|en': '/en/fareharbor-alternative-watersports',
  'B|jet-ski|TuriTop|en': '/en/turitop-alternative-watersports',
  'B|jet-ski|TuriTop|es': '/es/turitop-alternativa-motos-de-agua',
  'B|generico|TuriTop|en': '/en/turitop-alternative-watersports',
  'C|jet-ski|contrato|en': '/en/jet-ski-rental-contract-template',
  'C|jet-ski|contrato|es': '/es/contrato-alquiler-motos-de-agua',
  'C|jet-ski|libro|en': '/en/jet-ski-logbook',
  'C|jet-ski|libro|es': '/es/libro-registro-motos-de-agua',
  'A|kayak|*|en': 'borrador:/en/kayak-paddle-board-rental-software',
  'A|kayak|*|es': 'borrador:/es/software-alquiler-kayak-paddle-surf',
  'A|paddle-surf|*|en': 'borrador:/en/kayak-paddle-board-rental-software',
  'A|paddle-surf|*|es': 'borrador:/es/software-alquiler-kayak-paddle-surf',
  'A|charter|*|en': 'borrador:/en/boat-yacht-charter-software',
  'A|charter|*|es': 'borrador:/es/software-alquiler-barcos-charter',
  'A|catamaran|*|en': 'borrador:/en/catamaran-cruise-booking-software',
  'A|catamaran|*|es': 'borrador:/es/software-reservas-excursiones-catamaran',
  'A|hinchables|*|en': 'borrador:/en/inflatable-water-park-booking-software',
  'A|hinchables|*|es': 'borrador:/es/software-reservas-parque-acuatico-hinchable',
  'C|charter|contrato|en': 'borrador:/en/boat-charter-agreement-template',
  'C|charter|contrato|es': 'borrador:/es/contrato-alquiler-barco-charter',
};
// La plantilla de exención aparcada cubre moto de agua, kayak y parasailing.
for (const act of ['jet-ski', 'kayak', 'parasailing', 'generico']) {
  EXISTENTES[`C|${act}|exencion|en`] = 'borrador:/en/watersports-liability-waiver-template';
  EXISTENTES[`C|${act}|exencion|es`] = 'borrador:/es/plantilla-exencion-responsabilidad-actividades-acuaticas';
}

function existente(matriz, actividad, modificador, idioma) {
  return (
    EXISTENTES[`${matriz}|${actividad}|${modificador}|${idioma}`] ??
    EXISTENTES[`${matriz}|${actividad}|*|${idioma}`] ??
    ''
  );
}

const MATRICES = { A: matrizA, B: matrizB, C: matrizC, D: matrizD, E: matrizE };

const filas = [];
for (const [matriz, gen] of Object.entries(MATRICES)) {
  for (const a of ACTIVIDADES) {
    for (const f of gen(a)) {
      filas.push({
        consulta: f.consulta.toLowerCase(),
        idioma: f.idioma,
        matriz,
        actividad: a.id,
        modificador: f.modificador,
        volumen: '',
        top10_sector: '',
        pagina_existente: existente(matriz, a.id, f.modificador, f.idioma),
        puntuacion: '',
        estado: 'candidata',
      });
    }
  }
}

// F. quiosco de autoservicio × actividad (solo castellano). Lista de
// actividades propia: el usuario pidió estas seis, con «barcos» y «alquiler de
// activos» en vez de chárter y genérico. Se publicaron sin medir (lote 4), así
// que entran ya con su estado; `demanda.mjs` no toca filas en lote.
const QUIOSCO_ACTIVIDADES = [
  { id: 'motos-de-agua', para: 'para motos de agua', slug: 'quiosco-autoservicio-alquiler-motos-de-agua' },
  { id: 'parasailing', para: 'para parasailing', slug: 'quiosco-autoservicio-parasailing' },
  { id: 'kayak', para: 'para kayak', slug: 'quiosco-autoservicio-alquiler-kayak' },
  { id: 'barcos', para: 'para barcos', slug: 'quiosco-autoservicio-alquiler-barcos' },
  { id: 'catamaranes', para: 'para catamaranes', slug: 'quiosco-autoservicio-excursiones-catamaran' },
  { id: 'activos', para: 'para alquiler de activos', slug: 'quiosco-autoservicio-alquiler-activos' },
];
const QUIOSCO_SINONIMOS = [
  'quiosco de autoservicio',
  'kiosco de autoservicio',
  'terminal de autoservicio',
  'pantalla de pedido',
  'caja de autopago',
  'caja de autoservicio',
  'autopago',
  'tótem digital',
  'punto de autoservicio',
  'máquina de autoservicio',
  'máquina expendedora',
];
for (const a of QUIOSCO_ACTIVIDADES) {
  for (const sin of QUIOSCO_SINONIMOS) {
    filas.push({
      consulta: `${sin} ${a.para}`,
      idioma: 'es',
      matriz: 'F',
      actividad: a.id,
      modificador: sin,
      volumen: '',
      top10_sector: '',
      pagina_existente: `/es/${a.slug}`,
      puntuacion: '',
      estado: 'lote-4',
    });
  }
}

// Conserva lo ya medido o decidido.
if (existsSync(OUT)) {
  const previas = new Map(parseCsv(readFileSync(OUT, 'utf8')).map((r) => [`${r.consulta}|${r.idioma}`, r]));
  for (const f of filas) {
    const p = previas.get(`${f.consulta}|${f.idioma}`);
    if (!p) continue;
    for (const c of ['volumen', 'top10_sector', 'puntuacion', 'estado']) f[c] = p[c];
    // La página publicada se apunta a mano al cerrar un lote: no se pierde si
    // la tabla EXISTENTES de arriba no la conoce.
    if (!f.pagina_existente && p.pagina_existente) f.pagina_existente = p.pagina_existente;
  }
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, toCsv(filas, COLUMNS));
const porMatriz = Object.fromEntries([...Object.keys(MATRICES), 'F'].map((m) => [m, filas.filter((f) => f.matriz === m).length]));
console.log(`${filas.length} candidatas →`, OUT.replace(ROOT + '/', ''), porMatriz);
