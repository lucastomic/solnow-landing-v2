import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { guideOgSize, guideOgContentType, renderOgCard } from '@/lib/guideOgImage';

export const size = guideOgSize;
export const contentType = guideOgContentType;
export const alt = 'Solnow';

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safe = isLocale(locale) ? locale : 'es';
  const ads = (await getDictionary(safe)).adsDemo;
  return renderOgCard({ title: ads.meta.ogTitle, eyebrow: ads.hero.eyebrow });
}
