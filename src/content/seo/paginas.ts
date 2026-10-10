/**
 * Registro de las páginas programáticas publicadas.
 *
 * Solo entra aquí lo que está en un lote aprobado (`estado` = `lote-N` en
 * `candidatas.csv`): una candidata no es una página. De este registro salen la
 * ruta `[locale]/[slug]`, su hreflang, el sitemap y los enlaces entre páginas,
 * así que añadir una fila es todo lo que hace falta para publicar.
 *
 * Las páginas de la matriz E son solo en inglés: la consulta no tiene demanda
 * medible en español, y una gemela sin búsquedas sería justo el relleno que
 * esta máquina evita. Sin gemela, el hreflang declara solo `en` y `x-default`.
 */

import type { GuideContent, GuideGroup } from '@/content/guides';
import type { Locale } from '@/i18n/config';
import type { ProductKey } from '@/content/products';
import { ACTIVIDADES, type ActividadId } from '@/content/seo/actividades';
import { insuranceSlug, planSlug, plantillaPlan, plantillaSeguro } from '@/content/seo/plantillas/e';
import { checklistSlug, contratoSlug, plantillaChecklist, plantillaContrato } from '@/content/seo/plantillas/c';
import { plantillaQuiosco, quioscoSlug, type QuioscoId } from '@/content/seo/plantillas/f';

export interface PaginaSeo {
  slug: string;
  locale: Locale;
  matriz: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  /** La matriz F tiene su propia lista de actividades (`QuioscoId`). */
  actividad: ActividadId | QuioscoId;
  lote: number;
  /** Consultas de `candidatas.csv` que responde (trazabilidad, no se pintan). */
  consultas: string[];
  /** Landing de producto del tema, para las etiquetas compartidas de la guía. */
  area: ProductKey;
  /** Grupo en el índice de guías y en la miga de pan. Por defecto, `recurso`. */
  grupo?: GuideGroup;
  build: () => GuideContent;
}

const plan = (id: ActividadId, area: ProductKey, consultas: string[], lote = 1): PaginaSeo => ({
  slug: planSlug(ACTIVIDADES[id]),
  locale: 'en',
  matriz: 'E',
  actividad: id,
  lote,
  consultas,
  area,
  build: () => plantillaPlan(ACTIVIDADES[id]),
});

const seguro = (id: ActividadId, consultas: string[]): PaginaSeo => ({
  slug: insuranceSlug(ACTIVIDADES[id]),
  locale: 'en',
  matriz: 'E',
  actividad: id,
  lote: 1,
  consultas,
  area: 'contratos',
  build: () => plantillaSeguro(ACTIVIDADES[id]),
});

/**
 * Matriz F: quiosco de autoservicio × actividad, solo en castellano. Una página
 * por actividad cubre los diez sinónimos de la búsqueda (ver `plantillas/f.ts`).
 * Publicadas sin medir demanda por decisión del usuario (2026-10-10).
 */
const quiosco = (id: QuioscoId, consultas: string[]): PaginaSeo => ({
  slug: quioscoSlug(id),
  locale: 'es',
  matriz: 'F',
  actividad: id,
  lote: 4,
  consultas,
  area: 'tpv',
  grupo: 'actividad',
  build: () => plantillaQuiosco(id),
});

/** Las diez formas de buscar un quiosco, con el «para …» de cada actividad detrás. */
const SINONIMOS = [
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
const consultasQuiosco = (para: string) => SINONIMOS.map((s) => `${s} ${para}`);

export const PAGINAS: PaginaSeo[] = [
  plan('jet-ski', 'tpv', [
    'jet ski rental business plan',
    'how to start a jet ski rental business',
    'is a jet ski rental business profitable',
  ]),
  plan('kayak', 'tpv', [
    'kayak rental business plan',
    'how to start a kayak rental business',
    'is a kayak rental business profitable',
  ]),
  plan('charter', 'motor', ['boat charter business plan', 'how to start a boat charter business']),
  seguro('jet-ski', ['jet ski rental insurance']),
  seguro('kayak', ['kayak rental insurance']),
  // Lote 2: cada página cubre también el plan de negocio y el seguro de su
  // actividad en secciones propias (esas consultas no tienen página aparte).
  plan('parasailing', 'tpv', ['how to start a parasailing business', 'parasailing business plan', 'parasailing business insurance'], 2),
  plan('paddle-surf', 'tpv', ['how to start a paddle board rental business', 'paddle board rental business plan', 'paddle board rental insurance'], 2),
  plan('hinchables', 'tpv', ['inflatable water park business plan', 'how to start an inflatable water park business', 'inflatable water park insurance'], 2),
  // Lote 3, matriz C: documentos del operador con su descargable.
  {
    slug: contratoSlug(ACTIVIDADES.kayak),
    locale: 'en',
    matriz: 'C',
    actividad: 'kayak',
    lote: 3,
    consultas: ['kayak rental agreement template'],
    area: 'contratos',
    build: () =>
      plantillaContrato(ACTIVIDADES.kayak, [
        { label: 'Watersports liability waiver template', slug: 'plantilla-exencion-responsabilidad-actividades-acuaticas' },
        { label: 'Kayak rental insurance for operators', slug: insuranceSlug(ACTIVIDADES.kayak) },
      ]),
  },
  {
    slug: checklistSlug(ACTIVIDADES['jet-ski']),
    locale: 'en',
    matriz: 'C',
    actividad: 'jet-ski',
    lote: 3,
    consultas: ['jet ski safety checklist'],
    area: 'operacion',
    build: () =>
      plantillaChecklist(ACTIVIDADES['jet-ski'], [
        { label: 'Jet ski rental insurance for operators', slug: insuranceSlug(ACTIVIDADES['jet-ski']) },
        { label: 'How to start a jet ski rental business', slug: planSlug(ACTIVIDADES['jet-ski']) },
      ]),
  },
  // Lote 4, matriz F: quiosco de autoservicio por actividad.
  quiosco('motos-de-agua', consultasQuiosco('para motos de agua')),
  quiosco('parasailing', consultasQuiosco('para parasailing')),
  quiosco('kayak', consultasQuiosco('para kayak')),
  quiosco('barcos', consultasQuiosco('para barcos')),
  quiosco('catamaranes', consultasQuiosco('para catamaranes')),
  quiosco('activos', consultasQuiosco('para alquiler de activos')),
];

export function paginaSeo(locale: string, slug: string): PaginaSeo | undefined {
  return PAGINAS.find((p) => p.locale === locale && p.slug === slug);
}
