import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeMeta } from '@/i18n/config';
import { getGuide } from '@/lib/getGuide';
import { GuidePage } from '@/components/GuidePage';
import { buildGuideJsonLd } from '@/lib/guideJsonLd';

const SLUG = 'libro-registro-motos-de-agua';
const KEY = 'libro' as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { content } = await getGuide(locale, KEY);
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${locale}/${SLUG}`,
      languages: { 'es-ES': `/es/${SLUG}`, 'en-US': `/en/${SLUG}`, 'x-default': `/es/${SLUG}` },
    },
    openGraph: {
      title: content.meta.ogTitle,
      description: content.meta.description,
      url: `/${locale}/${SLUG}`,
      locale: localeMeta[locale].ogLocale,
      type: 'article',
    },
    robots: { index: true, follow: true },
  };
}

export default async function LibroGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { content, labels } = await getGuide(locale, KEY);
  const jsonLd = buildGuideJsonLd(content, locale, SLUG);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <GuidePage content={content} locale={locale} labels={labels} />
    </>
  );
}
