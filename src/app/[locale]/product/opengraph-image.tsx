import { getProductContent } from '@/lib/getProduct';
import { productOgSize, productOgContentType, renderProductOg } from '@/lib/productOgImage';

export const size = productOgSize;
export const contentType = productOgContentType;
export const alt = 'Solnow';

export default async function Image() {
  const content = await getProductContent('en');
  return renderProductOg({ eyebrow: content.hero.eyebrow, title: content.meta.ogTitle });
}
