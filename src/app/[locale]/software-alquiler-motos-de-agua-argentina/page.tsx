import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getGuide } from '@/lib/getGuide';
import { GuidePage } from '@/components/GuidePage';
import { buildGuideJsonLd } from '@/lib/guideJsonLd';
import { buildGuideMetadata } from '@/lib/guideMetadata';

const SLUG = 'software-alquiler-motos-de-agua-argentina';
const KEY = 'argentina' as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildGuideMetadata(locale, KEY, SLUG);
}

export default async function GuideRoute({
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
