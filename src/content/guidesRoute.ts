import type { Locale } from '@/i18n/config';

/**
 * El índice de guías, con su slug por idioma.
 *
 * Mismo patrón que `pricingRoute.ts`: carpeta por idioma bajo `[locale]`, cada
 * una sirviendo solo el suyo, y un único sitio donde vive la ruta para el
 * footer, el sitemap y los `hreflang`. `proxy.ts` manda la carpeta del otro
 * idioma (`/es/guides`, `/en/guias`) a la buena con un 301.
 */
export const GUIDES_INDEX_SLUG: Record<Locale, string> = {
  es: 'guias',
  en: 'guides',
};

export const guidesIndexPath = (locale: Locale) => `/${locale}/${GUIDES_INDEX_SLUG[locale]}`;

/** Alternates de idioma, tal como los quiere `Metadata.alternates.languages`. */
export const guidesIndexLanguages = {
  es: guidesIndexPath('es'),
  en: guidesIndexPath('en'),
  'x-default': guidesIndexPath('en'),
};
