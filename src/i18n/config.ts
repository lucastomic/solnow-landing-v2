export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const SITE_URL = 'https://www.solnow.io';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP-47 tags used for hreflang / og:locale, keyed by app locale. */
export const localeMeta: Record<Locale, { hreflang: string; ogLocale: string }> = {
  es: { hreflang: 'es-ES', ogLocale: 'es_ES' },
  en: { hreflang: 'en-US', ogLocale: 'en_US' },
};
