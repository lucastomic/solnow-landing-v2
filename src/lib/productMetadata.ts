import type { Metadata } from 'next';
import { localeMeta, locales, type Locale } from '@/i18n/config';
import { getProductContent, getProductArea } from '@/lib/getProduct';
import { productHubPath, productPath, type ProductKey } from '@/content/products';

/**
 * Hreflang map for a product URL. Every area and the hub exist in both locales
 * under their own localized path, so the alternates are always complete.
 * `x-default` points at Spanish: it is the primary market and matches the
 * home page's own x-default.
 */
function languagesFor(path: (locale: Locale) => string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeMeta[locale].hreflang] = path(locale);
  }
  languages['x-default'] = path('es');
  return languages;
}

/** Metadata for `/es/producto` and `/en/product`. */
export async function buildProductHubMetadata(locale: Locale): Promise<Metadata> {
  const { meta } = await getProductContent(locale);
  const url = productHubPath(locale);

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages: languagesFor(productHubPath) },
    openGraph: {
      title: meta.ogTitle,
      description: meta.description,
      url,
      locale: localeMeta[locale].ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle,
      description: meta.description,
    },
    robots: { index: true, follow: true },
  };
}

/** Metadata for a single product-area landing. */
export async function buildProductAreaMetadata(
  locale: Locale,
  key: ProductKey,
): Promise<Metadata> {
  const { area } = await getProductArea(locale, key);
  const url = productPath(key, locale);

  return {
    title: area.meta.title,
    description: area.meta.description,
    alternates: {
      canonical: url,
      languages: languagesFor((l) => productPath(key, l)),
    },
    openGraph: {
      title: area.meta.ogTitle,
      description: area.meta.description,
      url,
      locale: localeMeta[locale].ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: area.meta.ogTitle,
      description: area.meta.description,
    },
    robots: { index: true, follow: true },
  };
}
