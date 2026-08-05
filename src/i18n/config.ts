export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const SITE_URL = 'https://www.solnow.io';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * BCP-47 tags used for hreflang / og:locale, keyed by app locale.
 *
 * `hreflang` va sin región a propósito: `es-ES` solo apunta a hispanohablantes
 * de España y dejaba fuera a LatAm, que es justo el público de las landings de
 * Argentina y México. `es`/`en` cubren el idioma completo.
 */
export const localeMeta: Record<Locale, { hreflang: string; ogLocale: string }> = {
  es: { hreflang: 'es', ogLocale: 'es_ES' },
  en: { hreflang: 'en', ogLocale: 'en_US' },
};
