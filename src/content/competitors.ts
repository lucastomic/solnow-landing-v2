/**
 * Comparativas con competidores: fuente única.
 *
 * La usan las guías «vs» y «alternativa» (`getGuide` sustituye su tabla por la
 * de aquí) y las landings de campaña (`/[locale]/lp/…`). Antes cada guía
 * llevaba su propia tabla en `messages/*.json`, con etiquetas y valores que
 * divergían entre sí, y todas decían que Solnow no tiene cuota fija: el día que
 * cambió la tarifa quedaron cuatro sitios viejos. La fila de precio de Solnow
 * se genera ahora desde `PLANS`, igual que `/precios`.
 *
 * `verify` marca la celda de un competidor que no viene de una comparativa ya
 * publicada sino de investigación nueva: se pinta como aviso fuera de
 * producción (ver `GuidePage`/landings) y la contrasta una persona.
 */

import type { Locale } from '@/i18n/config';
import { PLANS } from '@/lib/pricingCalc';
import type { GuideBlock, GuideKey } from '@/content/guides';

type L = Record<Locale, string>;

export type CompetitorKey = 'turitop' | 'fareharbor' | 'bokun';

export type RowKey =
  | 'category'
  | 'online'
  | 'website'
  | 'walkin'
  | 'deskPayment'
  | 'contracts'
  | 'logbook'
  | 'liveOps'
  | 'whatsapp'
  | 'multibase'
  | 'channels'
  | 'pricing'
  | 'timeToProd';

const LABEL: Record<RowKey, L> = {
  category: { es: 'Categoría', en: 'Category' },
  online: { es: 'Reservas online', en: 'Online bookings' },
  website: { es: 'Reservas en tu web', en: 'Bookings on your website' },
  walkin: { es: 'Walk-in / mostrador', en: 'Walk-in / front desk' },
  deskPayment: { es: 'Cobro en el mostrador', en: 'Payment at the desk' },
  contracts: { es: 'Contratos y firma', en: 'Contracts and signature' },
  logbook: { es: 'Libro de registro', en: 'Logbook' },
  liveOps: { es: 'Operación en vivo (QR, dashboard)', en: 'Live operation (QR, dashboard)' },
  whatsapp: { es: 'IA en WhatsApp', en: 'AI on WhatsApp' },
  multibase: { es: 'Multi-base', en: 'Multi-base' },
  channels: { es: 'Venta en OTAs', en: 'Selling on OTAs' },
  pricing: { es: 'Precio', en: 'Pricing' },
  timeToProd: { es: 'Tiempo a producción', en: 'Time to production' },
};

const eur = (n: number, locale: Locale) =>
  new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

/** Lo que dice Solnow en cada fila; igual frente a cualquier competidor. */
function solnow(row: RowKey, locale: Locale): string {
  const fixed: Record<Exclude<RowKey, 'pricing'>, L> = {
    category: { es: 'Sistema operativo de alquiler acuático', en: 'Watercraft rental operating system' },
    online: { es: 'Sí, motor integrado', en: 'Yes, integrated engine' },
    website: { es: 'Sí, motor integrado', en: 'Yes, integrated engine' },
    walkin: { es: 'TPV + kiosko', en: 'POS + kiosk' },
    deskPayment: { es: 'Integrado', en: 'Integrated' },
    contracts: { es: 'Integrado, incluye menores', en: 'Integrated, includes minors' },
    logbook: { es: 'Automático', en: 'Automatic' },
    liveOps: { es: 'Sí, multi-base', en: 'Yes, multi-base' },
    whatsapp: { es: 'Agente que cierra 24/7', en: 'Agent that closes 24/7' },
    multibase: { es: 'Real, en una pantalla', en: 'Real, on one screen' },
    channels: { es: 'Viator y GetYourGuide', en: 'Viator and GetYourGuide' },
    timeToProd: { es: 'Días', en: 'Days' },
  };
  if (row !== 'pricing') return fixed[row][locale];
  const from = eur(PLANS.despegue.monthly.first, locale);
  return locale === 'es'
    ? `Cuota fija desde ${from}/mes; 0 % de lo que vende tu equipo`
    : `Fixed fee from ${from}/mo; 0% on what your team sells`;
}

interface Competitor {
  name: string;
  /** Guías publicadas que lo comparan (slug físico ES). */
  vsSlug?: string;
  altSlug?: string;
  them: Partial<Record<RowKey, L>>;
  verify?: Partial<Record<RowKey, string>>;
  /** Qué pasa con la migración desde este motor. Solnow lo sustituye: nunca convive. */
  migration: L;
}

export const COMPETITORS: Record<CompetitorKey, Competitor> = {
  turitop: {
    name: 'TuriTop',
    vsSlug: 'turitop-vs-solnow',
    altSlug: 'turitop-alternativa-motos-de-agua',
    them: {
      category: { es: 'Sistema de reservas online', en: 'Online booking system' },
      online: { es: 'Sí', en: 'Yes' },
      website: { es: 'Sí, su punto fuerte', en: 'Yes, its strong point' },
      walkin: { es: 'Manual', en: 'Manual' },
      contracts: { es: 'Básico', en: 'Basic' },
      logbook: { es: 'No', en: 'No' },
      liveOps: { es: 'No', en: 'No' },
      whatsapp: { es: 'No', en: 'No' },
      multibase: { es: 'Limitado', en: 'Limited' },
      pricing: { es: 'Cuota / plan', en: 'Fee / plan' },
    },
    migration: {
      es: 'Migramos clientes, reservas históricas y configuración desde TuriTop o Excel, sin downtime y sin perder datos.',
      en: 'We migrate customers, historical bookings and configuration from TuriTop or Excel, with no downtime and no data loss.',
    },
  },
  fareharbor: {
    name: 'FareHarbor',
    vsSlug: 'fareharbor-vs-solnow',
    altSlug: 'fareharbor-alternativa-motos-de-agua',
    them: {
      category: { es: 'Motor de reservas de tours', en: 'Tours booking engine' },
      online: { es: 'Sí, muy maduro', en: 'Yes, very mature' },
      walkin: { es: 'Manual', en: 'Manual' },
      deskPayment: { es: 'Manual / externo', en: 'Manual / external' },
      contracts: { es: 'Básico', en: 'Basic' },
      logbook: { es: 'No', en: 'No' },
      liveOps: { es: 'No', en: 'No' },
      whatsapp: { es: 'No', en: 'No' },
      multibase: { es: 'Parcial', en: 'Partial' },
      pricing: { es: 'Comisión por reserva', en: 'Commission per booking' },
      timeToProd: { es: 'Semanas', en: 'Weeks' },
    },
    migration: {
      es: 'La migración está incluida: traemos clientes, reservas históricas y configuración desde FareHarbor o Excel, sin downtime.',
      en: 'Migration is included: we bring customers, historical bookings and configuration from FareHarbor or Excel, with no downtime.',
    },
  },
  // Bókun no tenía comparativa publicada: viene de investigación nueva
  // (docs.bokun.io y bokun.io, 2026-10-06), contrastada fila a fila por el
  // usuario el mismo día.
  bokun: {
    name: 'Bókun',
    them: {
      category: { es: 'Reservas y gestión de canales para experiencias', en: 'Booking and channel management for experiences' },
      online: { es: 'Sí, widget para tu web', en: 'Yes, widget for your website' },
      walkin: { es: 'No', en: 'No' },
      contracts: { es: 'No', en: 'No' },
      liveOps: { es: 'No', en: 'No' },
      whatsapp: { es: 'No', en: 'No' },
      multibase: { es: 'Con subvendedores (planes Plus y Premium)', en: 'Via subvendors (Plus and Premium plans)' },
      channels: { es: 'Su punto fuerte: Viator, GetYourGuide y marketplace', en: 'Its core strength: Viator, GetYourGuide and a marketplace' },
      pricing: { es: 'De 0 a 499 $/mes + 1–1,5 % por reserva', en: '$0–499/mo + 1–1.5% booking fee' },
    },
    migration: {
      es: 'Migramos clientes, reservas históricas y configuración desde Bókun o Excel, sin downtime.',
      en: 'We migrate customers, historical bookings and configuration from Bókun or Excel, with no downtime.',
    },
  },
};

/** Filas que se comparan, en orden, cuando no se pide un subconjunto. */
export const DEFAULT_ROWS: RowKey[] = [
  'category',
  'online',
  'walkin',
  'deskPayment',
  'contracts',
  'liveOps',
  'whatsapp',
  'multibase',
  'channels',
  'pricing',
];

/** Filas de Solnow (etiqueta y valor), sin competidor: para tablas con varios. */
export function solnowRows(rows: RowKey[], locale: Locale) {
  return rows.map((r) => ({ key: r, label: LABEL[r][locale], solnow: solnow(r, locale) }));
}

/** Una fila por cada `RowKey` que el competidor tiene documentada (las demás se omiten). */
export function compareRows(key: CompetitorKey, locale: Locale, rows: RowKey[] = DEFAULT_ROWS) {
  const c = COMPETITORS[key];
  return rows
    .filter((r) => c.them[r])
    .map((r) => ({
      key: r,
      label: LABEL[r][locale],
      them: c.them[r]![locale],
      solnow: solnow(r, locale),
      verify: c.verify?.[r],
    }));
}

/** La tabla en el formato de bloque de las guías. */
export function compareTable(key: CompetitorKey, locale: Locale, rows: RowKey[], highlightCol?: number): GuideBlock {
  return {
    type: 'table',
    columns: [COMPETITORS[key].name, 'Solnow'],
    highlightCol,
    rows: compareRows(key, locale, rows).map((r) => ({ label: r.label, cells: [r.them, r.solnow] })),
  };
}

/**
 * Guías publicadas cuya tabla sale de aquí, con sus filas en el orden en que
 * se publicaron. `getGuide` sustituye la tabla del JSON por esta.
 */
export const GUIDE_TABLES: Partial<Record<GuideKey, { competitor: CompetitorKey; rows: RowKey[] }>> = {
  turitopVs: {
    competitor: 'turitop',
    rows: ['category', 'online', 'website', 'walkin', 'contracts', 'logbook', 'liveOps', 'whatsapp', 'multibase', 'pricing'],
  },
  fareharborVs: {
    competitor: 'fareharbor',
    rows: ['category', 'online', 'walkin', 'deskPayment', 'contracts', 'logbook', 'liveOps', 'whatsapp', 'multibase', 'pricing', 'timeToProd'],
  },
  turitopAlt: {
    competitor: 'turitop',
    rows: ['category', 'walkin', 'liveOps', 'whatsapp', 'contracts', 'logbook', 'multibase', 'pricing'],
  },
  fareharborAlt: {
    competitor: 'fareharbor',
    rows: ['category', 'walkin', 'liveOps', 'contracts', 'logbook', 'multibase', 'whatsapp', 'pricing'],
  },
};
