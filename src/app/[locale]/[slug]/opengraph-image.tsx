import { PAGINAS, paginaSeo } from '@/content/seo/paginas';
import { guideOgSize, guideOgContentType, renderGuideOg, renderOgCard } from '@/lib/guideOgImage';

export const size = guideOgSize;
export const contentType = guideOgContentType;
export const alt = 'Solnow';

export function generateStaticParams() {
  return PAGINAS.map((p) => ({ locale: p.locale, slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const p = paginaSeo(locale, slug);
  return p ? renderGuideOg(p.build()) : renderOgCard({ title: 'Solnow' });
}
