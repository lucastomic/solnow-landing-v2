import type { Locale } from '@/i18n/config';

/**
 * Rutas de campaña (tráfico de pago).
 *
 * Fuente única para las piezas que necesitan reconocerlas: las propias rutas
 * (`src/app/[locale]/demo`, `demo-mostrador`, `demo-front-desk`) y
 * `DeferredAnalytics`, que en estas páginas carga el etiquetado sin esperar a
 * la primera interacción. Si alguna vez se añade otra landing de anuncios,
 * basta con sumar su slug aquí.
 */
export const ADS_SLUG = 'demo';

/**
 * Landing del mostrador: para quien llega de un anuncio por la cola, el papel
 * y el embarque, no por el agente de WhatsApp. Slug traducido, así que cada
 * idioma tiene su carpeta y sirve solo el suyo (mismo patrón que `precios`).
 */
export const ADS_MOSTRADOR_SLUG: Record<Locale, string> = {
  es: 'demo-mostrador',
  en: 'demo-front-desk',
};

export const adsMostradorPath = (locale: Locale) => `/${locale}/${ADS_MOSTRADOR_SLUG[locale]}`;

/** Alternates de idioma, tal como los quiere `Metadata.alternates.languages`. */
export const adsMostradorLanguages = {
  es: adsMostradorPath('es'),
  en: adsMostradorPath('en'),
  'x-default': adsMostradorPath('en'),
};

const ADS_PATHS = new Set<string>([
  `/es/${ADS_SLUG}`,
  `/en/${ADS_SLUG}`,
  adsMostradorPath('es'),
  adsMostradorPath('en'),
]);

/** `true` si el pathname corresponde a una landing de campaña, en cualquier locale. */
export function isAdsPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return ADS_PATHS.has(pathname.replace(/\/+$/, ''));
}
