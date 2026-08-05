/**
 * Registry and shared types for the product landings.
 *
 * Single source of truth for the per-locale slugs, consumed by the route pages
 * (`app/[locale]/producto/**` in ES, `app/[locale]/product/**` in EN), the flow
 * graph on the home page, the sitemap and the metadata/JSON-LD helpers.
 * The copy itself lives in the i18n dictionaries (`messages/*.json`) under the
 * top-level `product` key, keyed by `ProductKey`.
 *
 * Each landing targets one commercial keyword rather than one conceptual area —
 * hence `tpv` and `contratos` are separate pages even though the front desk
 * flow spans both, and likewise `whatsapp` and `motor`. The informational
 * counterpart of each keyword lives in `@/content/guides`; see `AREA_FOR_GUIDE`
 * below for how the two clusters point at each other instead of competing.
 *
 * Unlike the guides — which share one physical folder per slug and rewrite the
 * English URL through the proxy — product areas use a genuinely different
 * folder per locale (`producto` vs `product`), so each locale renders its own
 * static route and no rewrite is needed.
 */

import type { Locale } from '@/i18n/config';
import type { GuideKey } from '@/content/guides';

export const PRODUCTS = [
  {
    key: 'tpv',
    n: '5.1',
    core: true,
    es: 'tpv-alquiler-motos-de-agua',
    en: 'pos-jet-ski-rental',
    priority: 0.9,
  },
  {
    key: 'contratos',
    n: '5.2',
    core: false,
    es: 'contratos-digitales-firma-electronica',
    en: 'digital-rental-contracts',
    priority: 0.9,
  },
  {
    key: 'whatsapp',
    n: '5.3',
    core: false,
    es: 'agente-ia-whatsapp',
    en: 'whatsapp-ai-agent',
    priority: 0.9,
  },
  {
    key: 'persigue',
    n: '5.4',
    core: false,
    es: 'recuperar-reservas-abandonadas',
    en: 'recover-abandoned-bookings',
    priority: 0.9,
  },
  {
    key: 'colaboradores',
    n: '5.5',
    core: false,
    es: 'portal-colaboradores',
    en: 'partner-portal',
    priority: 0.8,
  },
  {
    key: 'operacion',
    n: '5.6',
    core: false,
    es: 'control-flota-tiempo-real',
    en: 'real-time-fleet-control',
    priority: 0.8,
  },
  {
    key: 'motor',
    n: '5.7',
    core: false,
    es: 'motor-de-reservas',
    en: 'booking-engine',
    priority: 0.8,
  },
  {
    key: 'datos',
    n: '5.8',
    core: false,
    es: 'datos-unificados',
    en: 'unified-data',
    priority: 0.7,
  },
] as const;

export type ProductArea = (typeof PRODUCTS)[number];
export type ProductKey = ProductArea['key'];

/** Folder segment that hosts the product routes in each locale. */
export const PRODUCT_BASE: Record<Locale, string> = {
  es: 'producto',
  en: 'product',
};

export function productByKey(key: ProductKey): ProductArea {
  return PRODUCTS.find((p) => p.key === key)!;
}

/** Resolve an area from a URL slug, scoped to the locale that owns that slug. */
export function productBySlug(slug: string, locale: Locale): ProductArea | undefined {
  return PRODUCTS.find((p) => p[locale] === slug);
}

/** Absolute-from-root path of an area landing in a given locale. */
export function productPath(key: ProductKey, locale: Locale): string {
  return `/${locale}/${PRODUCT_BASE[locale]}/${productByKey(key)[locale]}`;
}

/** Absolute-from-root path of the product hub in a given locale. */
export function productHubPath(locale: Locale): string {
  return `/${locale}/${PRODUCT_BASE[locale]}`;
}

/* ---------------------------------------------------------------------------
 * Legacy slugs
 *
 * The first cut of these landings shipped four conceptual areas. Three of those
 * slugs changed when the set was rebuilt around commercial keywords. The pages
 * were never deployed, but a preview build may have been crawled, so the proxy
 * 301s the old slugs instead of letting them 404.
 * ------------------------------------------------------------------------- */

export const LEGACY_SLUGS: Record<string, ProductKey> = {
  // ES
  'mostrador-autoservicio': 'tpv',
  'venta-online-agente-ia': 'whatsapp',
  'operacion-tiempo-real': 'operacion',
  // EN
  'self-service-front-desk': 'tpv',
  'online-booking-ai-agent': 'whatsapp',
  'real-time-operations': 'operacion',
};

/* ---------------------------------------------------------------------------
 * Guides → product areas
 *
 * The guides cluster answers informational queries ("how to…", "what is…",
 * "template/PDF"); the product landings answer the commercial ones for the same
 * topic. Sending each guide to *its* area rather than to the generic hub keeps
 * the two clusters complementary: the guide ranks for the question and hands the
 * reader to the page that sells the answer.
 * ------------------------------------------------------------------------- */

export const AREA_FOR_GUIDE: Record<GuideKey, ProductKey> = {
  software: 'tpv',
  mostrador: 'tpv',
  multibase: 'operacion',
  whatsapp: 'whatsapp',
  papeleo: 'contratos',
  contrato: 'contratos',
  normativa: 'contratos',
  libro: 'operacion',
  // Parasailing vende el mostrador del pantalán: el walk-in es la mitad de su
  // facturación, así que la landing comercial que le corresponde es el TPV.
  parasailing: 'tpv',
  fareharborAlt: 'motor',
  turitopAlt: 'motor',
  fareharborVs: 'motor',
  turitopVs: 'motor',
  mejoresSoftware: 'motor',
  // Las páginas geo venden el núcleo del producto.
  tenerife: 'tpv',
  granCanaria: 'tpv',
  canarias: 'tpv',
  argentina: 'tpv',
  mexico: 'tpv',
};

/* ---- Content shape (mirrors the JSON stored in messages/*.json) ---- */

export type ProductBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] };

export interface ProductSection {
  h: string;
  blocks: ProductBlock[];
}

export interface ProductAreaContent {
  meta: { title: string; description: string; ogTitle: string };
  /** `tag` presenta el nombre propio del área donde el lector llega frío. */
  card: { title: string; sub: string; tag?: string };
  hero: { eyebrow: string; h1: string; lede: string };
  bullets: string[];
  sections: ProductSection[];
  faq: { q: string; a: string }[];
  /** Resource guides worth cross-linking from this area (physical ES slugs). */
  guides: { label: string; slug: string }[];
}

/**
 * Anchors the graph topology to semantics instead of array position, so the
 * feedback edges keep pointing at the right nodes if the order ever changes:
 * `payment` is where an abandoned checkout drops out of the chain, `primary`
 * is the channel the recovery loop pushes it back into.
 */
export type ProductGraphRole = 'payment' | 'primary';

export interface ProductGraphNode {
  id: string;
  label: string;
  sub: string;
  /** Area this node opens. */
  area: ProductKey;
  role?: ProductGraphRole;
}

export interface ProductGraphContent {
  channelsLabel: string;
  flowLabel: string;
  outputsLabel: string;
  /** Legend entry for the recovery loop; only shown when `loop` is present. */
  loopLabel?: string;
  caption: string;
  channels: ProductGraphNode[];
  chain: ProductGraphNode[];
  outputs: ProductGraphNode[];
  /** Recovery loop hanging below the chain. Optional: the graph degrades cleanly. */
  loop?: ProductGraphNode;
}

export interface ProductHubContent {
  meta: { title: string; description: string; ogTitle: string };
  hero: { eyebrow: string; h1: string; lede: string };
  graph: ProductGraphContent;
  home: {
    eyebrow: string;
    title: string;
    coreTag: string;
    /** CTA de las tarjetas destacadas; `cardCtaShort`, el de las compactas. */
    cardCta: string;
    cardCtaShort: string;
    detailTitle: string;
    detailHint: string;
  };
  labels: {
    breadcrumbHome: string;
    breadcrumbProduct: string;
    backHome: string;
    backToProduct: string;
    areasTitle: string;
    otherAreasTitle: string;
    faqTitle: string;
    guidesTitle: string;
    inThisPage: string;
    demo: string;
  };
  cta: { title: string; desc: string; button: string };
}

export interface ProductContent extends ProductHubContent {
  areas: Record<ProductKey, ProductAreaContent>;
}

/**
 * Everything the home section and the footer need, without dragging the whole
 * `areas` tree (sections, FAQ, guide lists) into the client bundle.
 */
export interface ProductSummary extends ProductHubContent {
  areas: Record<ProductKey, Pick<ProductAreaContent, 'card'>>;
}
