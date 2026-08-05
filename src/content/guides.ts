/**
 * Registry and shared types for the SEO resource guides ("landings Tier 1").
 *
 * Single source of truth for slugs and per-guide flags, consumed by the route
 * pages (`app/[locale]/<slug>/page.tsx`), the sitemap and the JSON-LD helper.
 * The actual copy lives in the i18n dictionaries (`messages/*.json`) under the
 * top-level `guides` key, keyed by `GuideKey`.
 */

import type { Locale } from '@/i18n/config';

export const GUIDES = [
  { slug: 'software-alquiler-motos-de-agua', key: 'software', group: 'recurso', download: false, howTo: false, priority: 0.9 },
  { slug: 'digitalizar-mostrador-alquiler-motos-de-agua', key: 'mostrador', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'gestion-multi-base-alquiler-motos-de-agua', key: 'multibase', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'whatsapp-reservas-motos-de-agua', key: 'whatsapp', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'eliminar-papeleo-alquiler-nautico', key: 'papeleo', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'contrato-alquiler-motos-de-agua', key: 'contrato', group: 'recurso', download: true, howTo: false, priority: 0.8 },
  { slug: 'normativa-alquiler-motos-de-agua-espana', key: 'normativa', group: 'recurso', download: false, howTo: false, priority: 0.8 },
  { slug: 'libro-registro-motos-de-agua', key: 'libro', group: 'recurso', download: false, howTo: true, priority: 0.8 },
  { slug: 'software-reservas-parasailing', key: 'parasailing', group: 'recurso', download: false, howTo: false, priority: 0.8 },
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

/* ---------------------------------------------------------------------------
 * Per-locale slugs (SEO)
 *
 * Routes are folder-based, so the physical folder name (Spanish) is the same
 * for `/es/` and `/en/`. To serve English URLs on `/en/` we keep the Spanish
 * folder as the internal route and expose an English "display slug" that the
 * proxy rewrites back to the folder. Only the guides below get a distinct EN
 * URL; everything else shares the Spanish slug across locales.
 * ------------------------------------------------------------------------- */

/** English display slug per guide key (only the migrated ones). */
const EN_SLUG: Partial<Record<GuideKey, string>> = {
  mejoresSoftware: 'best-watersports-booking-software',
  fareharborAlt: 'fareharbor-alternative-watersports',
  software: 'jet-ski-rental-software',
  turitopAlt: 'turitop-alternative-watersports',
  normativa: 'jet-ski-rental-regulations-spain',
  mostrador: 'digitize-jet-ski-rental-front-desk',
  canarias: 'jet-ski-booking-software-canary-islands',
  contrato: 'jet-ski-rental-contract-template',
  papeleo: 'eliminate-paperwork-boat-rental',
  multibase: 'multi-base-jet-ski-management',
  whatsapp: 'whatsapp-booking-jet-ski',
  parasailing: 'parasailing-booking-software',
};

/**
 * EN-only consolidation: these guides keep their own ES page, but under `/en/`
 * they 301 into another guide's English page and get no separate EN
 * page/sitemap entry (the Tenerife + Gran Canaria pages fold into Canarias).
 */
const EN_CONSOLIDATE: Partial<Record<GuideKey, GuideKey>> = {
  tenerife: 'canarias',
  granCanaria: 'canarias',
};

/** Slug to show in the URL for a guide in a given locale. */
export function localizedSlug(key: GuideKey, locale: Locale): string {
  if (locale === 'en' && EN_SLUG[key]) return EN_SLUG[key]!;
  return GUIDES.find((g) => g.key === key)!.slug;
}

/**
 * Localized slug starting from a physical (Spanish) slug — used to translate
 * internal links so they point straight at the canonical URL for the current
 * locale, without going through the proxy 301.
 */
export function localizedSlugFromSlug(slug: string, locale: Locale): string {
  const g = guideBySlug(slug);
  if (!g) return slug;
  if (locale === 'en' && EN_CONSOLIDATE[g.key]) {
    return localizedSlug(EN_CONSOLIDATE[g.key]!, 'en');
  }
  return localizedSlug(g.key, locale);
}

/** Whether a guide has its own indexable EN page (false for consolidated ones). */
export function hasEnPage(key: GuideKey): boolean {
  return !EN_CONSOLIDATE[key];
}

/** Find a guide by either its physical (ES) slug or its English display slug. */
export function guideByAnySlug(slug: string): Guide | undefined {
  const byPhysical = guideBySlug(slug);
  if (byPhysical) return byPhysical;
  const key = (Object.keys(EN_SLUG) as GuideKey[]).find((k) => EN_SLUG[k] === slug);
  return key ? GUIDES.find((g) => g.key === key) : undefined;
}

/* ---- Proxy lookup tables (built once at module load) ---- */

/** Physical Spanish slug reached under `/en/` → pretty EN slug it must 301 to. */
export const EN_REDIRECTS: Record<string, string> = {};
/** Pretty EN slug → physical folder slug (rewrite so the page renders). */
export const EN_REWRITES: Record<string, string> = {};

for (const key of Object.keys(EN_SLUG) as GuideKey[]) {
  const physical = GUIDES.find((g) => g.key === key)!.slug;
  EN_REDIRECTS[physical] = EN_SLUG[key]!;
  EN_REWRITES[EN_SLUG[key]!] = physical;
}
for (const key of Object.keys(EN_CONSOLIDATE) as GuideKey[]) {
  const physical = GUIDES.find((g) => g.key === key)!.slug;
  EN_REDIRECTS[physical] = localizedSlug(EN_CONSOLIDATE[key]!, 'en');
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

/**
 * Entrada del `ItemList` de una comparativa tipo listicle.
 *
 * `section` es el índice 1-based de la sección que describe la herramienta —
 * el mismo que `GuidePage` usa para el `id="sec-N"`, así que el ancla del
 * dato estructurado siempre apunta a contenido que existe de verdad en la
 * página. Dos herramientas pueden compartir sección (Bookeo y Regiondo).
 */
export interface GuideListItem {
  name: string;
  section: number;
}

export interface GuideContent {
  meta: { title: string; description: string; ogTitle: string };
  /** Solo en listicles: herramientas comparadas, en orden de aparición. */
  itemList?: GuideListItem[];
  hero: { eyebrow: string; h1: string; lede: string; updated: string; readingTime: string };
  download?: { title: string; desc: string; fileLabel: string; href: string };
  disclaimer?: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  related: { label: string; slug: string }[];
  cta: { title: string; desc: string; button: string };
}
