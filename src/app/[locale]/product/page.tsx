import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductHub from '@/components/product/ProductHub';
import { buildProductHubMetadata } from '@/lib/productMetadata';
import { buildProductHubJsonLd } from '@/lib/productJsonLd';

/** El hub de producto vive en `/en/product`; el otro idioma lo sirve `/es/producto`. */
const LOCALE = 'en' as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: LOCALE }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== LOCALE) return {};
  return buildProductHubMetadata(LOCALE);
}

export default async function ProductHubRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== LOCALE) notFound();
  const jsonLd = await buildProductHubJsonLd(LOCALE);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ProductHub locale={LOCALE} />
    </>
  );
}
