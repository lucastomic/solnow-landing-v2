import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuidePage } from '@/components/GuidePage';
import { PAGINAS, paginaSeo } from '@/content/seo/paginas';
import { buildGuideJsonLd } from '@/lib/guideJsonLd';
import { buildSeoMetadata, getSeoPage } from '@/lib/seoPage';

/**
 * Páginas programáticas (`src/content/seo/paginas.ts`). Solo existen las del
 * registro: cualquier otro slug es un 404, así que una candidata sin aprobar
 * no puede publicarse por accidente. Las carpetas estáticas hermanas (las
 * guías escritas a mano) tienen prioridad sobre esta ruta.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return PAGINAS.map((p) => ({ locale: p.locale, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = paginaSeo(locale, slug);
  return p ? buildSeoMetadata(p) : {};
}

export default async function SeoRoute({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const p = paginaSeo(locale, slug);
  if (!p) notFound();
  const { content, labels } = await getSeoPage(p);
  const jsonLd = buildGuideJsonLd(content, p.locale, p.slug);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <GuidePage content={content} locale={p.locale} labels={labels} />
    </>
  );
}
