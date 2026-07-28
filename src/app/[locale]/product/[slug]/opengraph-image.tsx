import { PRODUCTS, productBySlug } from '@/content/products';
import { getProductArea, getProductContent } from '@/lib/getProduct';
import { productOgSize, productOgContentType, renderProductOg } from '@/lib/productOgImage';

export const size = productOgSize;
export const contentType = productOgContentType;
export const alt = 'Solnow';

const LOCALE = 'en' as const;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ locale: LOCALE, slug: p[LOCALE] }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = productBySlug(slug, LOCALE);
  if (!meta) {
    const content = await getProductContent(LOCALE);
    return renderProductOg({ eyebrow: content.hero.eyebrow, title: content.meta.ogTitle });
  }
  const { area } = await getProductArea(LOCALE, meta.key);
  return renderProductOg({ eyebrow: `${meta.n} · ${area.hero.eyebrow}`, title: area.meta.ogTitle });
}
