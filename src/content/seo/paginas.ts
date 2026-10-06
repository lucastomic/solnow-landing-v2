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

import type { GuideContent } from '@/content/guides';
import type { Locale } from '@/i18n/config';
import type { ProductKey } from '@/content/products';
import { ACTIVIDADES, type ActividadId } from '@/content/seo/actividades';
import { insuranceSlug, planSlug, plantillaPlan, plantillaSeguro } from '@/content/seo/plantillas/e';

export interface PaginaSeo {
  slug: string;
  locale: Locale;
  matriz: 'A' | 'B' | 'C' | 'D' | 'E';
  actividad: ActividadId;
  lote: number;
  /** Consultas de `candidatas.csv` que responde (trazabilidad, no se pintan). */
  consultas: string[];
  /** Landing de producto del tema, para las etiquetas compartidas de la guía. */
  area: ProductKey;
  build: () => GuideContent;
}

const plan = (id: ActividadId, area: ProductKey, consultas: string[]): PaginaSeo => ({
  slug: planSlug(ACTIVIDADES[id]),
  locale: 'en',
  matriz: 'E',
  actividad: id,
  lote: 1,
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
];

export function paginaSeo(locale: string, slug: string): PaginaSeo | undefined {
  return PAGINAS.find((p) => p.locale === locale && p.slug === slug);
}
