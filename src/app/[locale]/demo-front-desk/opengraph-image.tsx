import { getDictionary } from '@/i18n/dictionaries';
import { guideOgSize, guideOgContentType, renderOgCard } from '@/lib/guideOgImage';

export const size = guideOgSize;
export const contentType = guideOgContentType;
export const alt = 'Solnow';

export default async function Image() {
  const ads = (await getDictionary('en')).adsMostrador;
  return renderOgCard({ title: ads.meta.ogTitle, eyebrow: ads.hero.eyebrow });
}
