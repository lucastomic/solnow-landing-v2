import type { Metadata } from 'next';
import { localeMeta, type Locale } from '@/i18n/config';
import { getGuide } from '@/lib/getGuide';
import { localizedSlug, hasEnPage, type GuideKey } from '@/content/guides';

/**
 * Builds the full Metadata for a resource-guide page (canonical + hreflang,
 * Open Graph and Twitter card). The per-route `opengraph-image.tsx` is picked
 * up automatically by Next and applied to both `openGraph.images` and
 * `twitter.images`, so the social card shows the guide's own title/image.
 */
export async function buildGuideMetadata(
  locale: Locale,
  key: GuideKey,
  // `slug` (the physical folder slug) is accepted for call-site compatibility;
  // the canonical/hreflang URLs are derived per-locale from the key instead.
  _slug?: string,
): Promise<Metadata> {
  const { content } = await getGuide(locale, key);
  const url = `/${locale}/${localizedSlug(key, locale)}`;
  const esUrl = `/es/${localizedSlug(key, 'es')}`;

  const languages: Record<string, string> = { es: esUrl };
  if (hasEnPage(key)) {
    const enUrl = `/en/${localizedSlug(key, 'en')}`;
    languages.en = enUrl;
    // x-default → English: international EN traffic outweighs ES (mostly brand).
    languages['x-default'] = enUrl;
  } else {
    // Consolidated pages exist only in ES.
    languages['x-default'] = esUrl;
  }

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: content.meta.ogTitle,
      description: content.meta.description,
      url,
      locale: localeMeta[locale].ogLocale,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.ogTitle,
      description: content.meta.description,
    },
    robots: { index: true, follow: true },
  };
}
