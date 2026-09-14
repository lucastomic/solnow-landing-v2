import type { Locale } from '@/i18n/config';

/**
 * La página de precios, con su slug por idioma.
 *
 * Un solo sitio donde vive la ruta: la usan el enlace del nav, el teaser de la
 * home, el sitemap y los metadatos con sus `hreflang`. Cuando el slug cambie,
 * cambia aquí y en ninguna parte más — un enlace suelto a `/es/precios` que se
 * quede atrás es un 404 en la página que más intención de compra recibe.
 *
 * Mismo patrón que `producto`/`product`: carpeta por idioma bajo `[locale]`,
 * cada una sirviendo solo el suyo.
 */
export const PRICING_SLUG: Record<Locale, string> = {
  es: 'precios',
  en: 'pricing',
};

export const pricingPath = (locale: Locale) => `/${locale}/${PRICING_SLUG[locale]}`;

/** Alternates de idioma, tal como los quiere `Metadata.alternates.languages`. */
export const pricingLanguages = {
  es: pricingPath('es'),
  en: pricingPath('en'),
  'x-default': pricingPath('en'),
};
