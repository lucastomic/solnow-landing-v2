/**
 * Registry and shared types for the SEO resource guides ("landings Tier 1").
 *
 * Single source of truth for slugs and per-guide flags, consumed by the route
 * pages (`app/[locale]/<slug>/page.tsx`), the sitemap and the JSON-LD helper.
 * The actual copy lives in the i18n dictionaries (`messages/*.json`) under the
 * top-level `guides` key, keyed by `GuideKey`.
 */

export const GUIDES = [
  { slug: 'software-alquiler-motos-de-agua', key: 'software', group: 'recurso', download: false, howTo: false, priority: 0.9 },
  { slug: 'digitalizar-mostrador-alquiler-motos-de-agua', key: 'mostrador', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'gestion-multi-base-alquiler-motos-de-agua', key: 'multibase', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'whatsapp-reservas-motos-de-agua', key: 'whatsapp', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'eliminar-papeleo-alquiler-nautico', key: 'papeleo', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'contrato-alquiler-motos-de-agua', key: 'contrato', group: 'recurso', download: true, howTo: false, priority: 0.8 },
  { slug: 'normativa-alquiler-motos-de-agua-espana', key: 'normativa', group: 'recurso', download: false, howTo: false, priority: 0.8 },
  { slug: 'libro-registro-motos-de-agua', key: 'libro', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'fareharbor-alternativa-motos-de-agua', key: 'fareharborAlt', group: 'comparativa', download: false, howTo: false, priority: 0.8 },
  { slug: 'turitop-alternativa-motos-de-agua', key: 'turitopAlt', group: 'comparativa', download: false, howTo: false, priority: 0.8 },
  { slug: 'fareharbor-vs-solnow', key: 'fareharborVs', group: 'comparativa', download: false, howTo: false, priority: 0.8 },
  { slug: 'turitop-vs-solnow', key: 'turitopVs', group: 'comparativa', download: false, howTo: false, priority: 0.8 },
  { slug: 'mejores-software-reservas-actividades-acuaticas', key: 'mejoresSoftware', group: 'comparativa', download: false, howTo: false, priority: 0.8 },
  { slug: 'software-reservas-motos-de-agua-tenerife', key: 'tenerife', group: 'geo', download: false, howTo: false, priority: 0.8 },
  { slug: 'software-reservas-motos-de-agua-gran-canaria', key: 'granCanaria', group: 'geo', download: false, howTo: false, priority: 0.8 },
  { slug: 'software-reservas-motos-de-agua-canarias', key: 'canarias', group: 'geo', download: false, howTo: false, priority: 0.8 },
  { slug: 'software-alquiler-motos-de-agua-argentina', key: 'argentina', group: 'geo', download: false, howTo: false, priority: 0.8 },
  { slug: 'software-alquiler-motos-de-agua-mexico', key: 'mexico', group: 'geo', download: false, howTo: false, priority: 0.8 },
] as const;

export type GuideGroup = Guide['group'];

export type Guide = (typeof GUIDES)[number];
export type GuideKey = Guide['key'];
export type GuideSlug = Guide['slug'];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function slugForKey(key: GuideKey): GuideSlug {
  return GUIDES.find((g) => g.key === key)!.slug;
}

/* ---- Content shape (mirrors the JSON stored in messages/*.json) ---- */

export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; tone?: 'warn' | 'info' | 'accent'; text: string }
  | { type: 'steps'; items: string[] }
  | { type: 'table'; columns: string[]; highlightCol?: number; rows: { label: string; cells: string[] }[] };

export interface GuideSection {
  h: string;
  blocks: GuideBlock[];
}

export interface GuideContent {
  meta: { title: string; description: string; ogTitle: string };
  hero: { eyebrow: string; h1: string; lede: string; updated: string; readingTime: string };
  download?: { title: string; desc: string; fileLabel: string; href: string };
  disclaimer?: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  related: { label: string; slug: string }[];
  cta: { title: string; desc: string; button: string };
}
