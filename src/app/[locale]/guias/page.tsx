import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localeMeta } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { guidesIndexLanguages, guidesIndexPath } from '@/content/guidesRoute';
import GuidesIndex from '@/components/GuidesIndex';

/** Las guías viven en `/es/guias`; el otro idioma lo sirve su carpeta hermana (`/en/guides`). */
const LOCALE = 'es' as const;

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

  const m = (await getDictionary(LOCALE)).guidesIndex.meta;
  const path = guidesIndexPath(LOCALE);

  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: path, languages: guidesIndexLanguages },
    openGraph: {
      title: m.ogTitle,
      description: m.description,
      url: path,
      locale: localeMeta[LOCALE].ogLocale,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: m.ogTitle, description: m.description },
  };
}

export default async function GuidesIndexRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== LOCALE) notFound();
  return <GuidesIndex locale={LOCALE} />;
}
