/**
 * Rutas de campaña (tráfico de pago).
 *
 * Fuente única para las dos piezas que necesitan reconocerlas: la propia ruta
 * (`src/app/[locale]/demo`) y `DeferredAnalytics`, que en estas páginas carga
 * el etiquetado sin esperar a la primera interacción. Si alguna vez se añade
 * otra landing de anuncios, basta con sumar su slug aquí.
 */
export const ADS_SLUG = 'demo';

/** `true` si el pathname corresponde a una landing de campaña, en cualquier locale. */
export function isAdsPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return /^\/(es|en)\/demo\/?$/.test(pathname);
}
