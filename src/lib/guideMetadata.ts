import type { Metadata } from 'next';
import { localeMeta, type Locale } from '@/i18n/config';
import { getGuide } from '@/lib/getGuide';
import type { GuideKey } from '@/content/guides';

/**
 * Builds the full Metadata for a resource-guide page (canonical + hreflang,
 * Open Graph and Twitter card). The per-route `opengraph-image.tsx` is picked
 * up automatically by Next and applied to both `openGraph.images` and
 * `twitter.images`, so the social card shows the guide's own title/image.
 */
export async function buildGuideMetadata(
  locale: Locale,
  key: GuideKey,
  slug: string,
): Promise<Metadata> {
  const { content } = await getGuide(locale, key);
  const url = `/${locale}/${slug}`;

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: url,
      languages: { 'es-ES': `/es/${slug}`, 'en-US': `/en/${slug}`, 'x-default': `/es/${slug}` },
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
