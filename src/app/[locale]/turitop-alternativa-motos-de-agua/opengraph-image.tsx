import { isLocale } from '@/i18n/config';
import { getGuide } from '@/lib/getGuide';
import { guideOgSize, guideOgContentType, renderGuideOg } from '@/lib/guideOgImage';

export const size = guideOgSize;
export const contentType = guideOgContentType;
export const alt = 'Solnow';

const KEY = 'turitopAlt' as const;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safe = isLocale(locale) ? locale : 'es';
  const { content } = await getGuide(safe, KEY);
  return renderGuideOg(content);
}
