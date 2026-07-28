import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductLanding from '@/components/product/ProductLanding';
import { PRODUCTS, productBySlug } from '@/content/products';
import { buildProductAreaMetadata } from '@/lib/productMetadata';
import { buildProductAreaJsonLd } from '@/lib/productJsonLd';

/** Las cuatro áreas en en. Cualquier otro slug es un 404 real. */
const LOCALE = 'en' as const;

export const dynamicParams = false;

// Se generan los dos segmentos de abajo arriba: esta carpeta solo existe para
// su idioma, así que fija el locale en lugar de heredarlo del padre.
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ locale: LOCALE, slug: p[LOCALE] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== LOCALE) return {};
  const area = productBySlug(slug, LOCALE);
  if (!area) return {};
  return buildProductAreaMetadata(LOCALE, area.key);
}

export default async function ProductAreaRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (locale !== LOCALE) notFound();
  const area = productBySlug(slug, LOCALE);
  if (!area) notFound();
  const jsonLd = await buildProductAreaJsonLd(LOCALE, area.key);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ProductLanding areaKey={area.key} locale={LOCALE} />
    </>
  );
}
