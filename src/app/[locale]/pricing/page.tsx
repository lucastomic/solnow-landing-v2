import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localeMeta } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { pricingLanguages, pricingPath } from '@/content/pricingRoute';
import Nav from '@/components/Nav';
import RevealProvider from '@/components/RevealProvider';
import { PricingPage } from '@/components/sections/PricingPage';
import { FinalCTA, Footer } from '@/components/sections/SectionsEnd';

/** La página de precios vive en `/en/pricing`; el otro idioma la sirve su carpeta hermana. */
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

  const m = (await getDictionary(LOCALE)).pricing.meta;
  const path = pricingPath(LOCALE);

  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: path, languages: pricingLanguages },
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

export default async function PricingRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== LOCALE) notFound();

  return (
    <>
      <RevealProvider />
      <Nav />
      <PricingPage locale={LOCALE} />
      <FinalCTA locale={LOCALE} />
      <Footer locale={LOCALE} />
    </>
  );
}
