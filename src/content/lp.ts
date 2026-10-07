/**
 * Landings de destino de Google Ads (`/[locale]/lp/…`): registro.
 *
 * Dos plantillas, cada una alimentada por datos: añadir una landing es añadir
 * una entrada aquí (y, si es de categoría, sus textos en `messages/*.json`,
 * bajo `lp.pages.<key>`). La ruta `[locale]/lp/[...slug]` solo sirve lo que
 * está en este registro; cualquier otra URL bajo `/lp` es un 404.
 *
 * Todas son `noindex` (no compiten con las páginas de producto ni con las
 * comparativas en orgánico) y no van al sitemap. Su única conversión es la
 * reunión reservada: `meeting_booked` en el dataLayer, como en `/demo`.
 */

import type { Locale } from '@/i18n/config';
import type { CompetitorKey } from '@/content/competitors';

/** Áreas cuyo mockup puede enseñar una landing (`LazyAreaMock`). */
export type LpProductMock = 'tpv' | 'motor' | 'contratos' | 'operacion' | 'whatsapp';

export type LpPage =
  | {
      template: 'categoria';
      /** Clave de los textos en `lp.pages`. */
      key: 'jetski' | 'watersports';
      slug: Record<Locale, string[]>;
      /** Competidores de la comparativa breve. */
      compare: CompetitorKey[];
    }
  | {
      template: 'alternativa';
      competitor: CompetitorKey;
      slug: Record<Locale, string[]>;
    };

const ALT: Record<Locale, string> = { es: 'alternativa', en: 'alternative' };

const alternativa = (competitor: CompetitorKey): LpPage => ({
  template: 'alternativa',
  competitor,
  slug: { es: [ALT.es, competitor], en: [ALT.en, competitor] },
});

export const LP_PAGES: LpPage[] = [
  {
    template: 'categoria',
    key: 'jetski',
    slug: { es: ['motos-de-agua'], en: ['jet-ski'] },
    compare: ['turitop', 'fareharbor', 'bokun'],
  },
  {
    template: 'categoria',
    key: 'watersports',
    slug: { es: ['actividades-acuaticas'], en: ['water-sports'] },
    compare: ['turitop', 'fareharbor', 'bokun'],
  },
  alternativa('turitop'),
  alternativa('fareharbor'),
  alternativa('bokun'),
];

/** Identificador estable de la página para la medición (`lp_page`). */
export const lpId = (p: LpPage) => (p.template === 'categoria' ? p.key : `alt-${p.competitor}`);

export function lpBySlug(locale: Locale, slug: string[]): LpPage | undefined {
  return LP_PAGES.find((p) => p.slug[locale].join('/') === slug.join('/'));
}

export const lpPath = (p: LpPage, locale: Locale) => `/${locale}/lp/${p.slug[locale].join('/')}`;

/**
 * Nombres de los parámetros que recibe el embed de HubSpot (y por tanto de las
 * propiedades que tienen que existir en el formulario de «demo-solnow»). Los de
 * campaña (`utm_*`, `gclid`) los reenvía `DemoCalendar` con su propio nombre.
 */
export const HUBSPOT_FIELDS = {
  name: 'firstName',
  email: 'email',
  company: 'company',
} as const;

/**
 * Formulario de HubSpot que recibe el paso 1 (nombre, email, empresa y los de
 * campaña), para no perder a quien no llega a reservar. Ver
 * `src/lib/hubspotLead.ts`. Con los IDs vacíos no se envía nada.
 *
 * `endpoint`: la cuenta está en el centro de datos europeo (el calendario es
 * `meetings-eu1`), así que la API de formularios es la de `eu1`.
 */
export const LP_LEAD_FORM = {
  portalId: '',
  formId: '',
  endpoint: 'https://api-eu1.hsforms.com',
};

/**
 * WhatsApp de las landings `/lp`: el equipo comercial (+34 613 89 36 18), no el
 * agente demo de `/demo`. Formato `wa.me`: prefijo y dígitos, sin `+`.
 */
export const LP_WHATSAPP_NUMBER = '34613893618';
