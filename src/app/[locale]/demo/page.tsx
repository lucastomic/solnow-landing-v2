import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeMeta } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { DemoLanding } from '@/components/ads/DemoLanding';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const m = (await getDictionary(locale)).adsDemo.meta;
  const path = `/${locale}/demo`;

  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: path,
      languages: { es: '/es/demo', en: '/en/demo', 'x-default': '/en/demo' },
    },
    openGraph: {
      title: m.ogTitle,
      description: m.description,
      url: path,
      locale: localeMeta[locale].ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.ogTitle,
      description: m.description,
    },
    // Único `noindex` del sitio. Es una landing de campaña: duplica el mensaje
    // de la home sin aportar nada al orgánico, y si Google la indexara
    // competiría con la home por las mismas consultas.
    //
    // Deliberadamente NO se añade un `Disallow` en `robots.ts`: AdsBot respeta
    // robots.txt y marcaría el destino como no rastreable, lo que desaprueba el
    // anuncio. El `noindex` la mantiene fuera del índice sin bloquear el rastreo.
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
  };
}

export default async function DemoRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <DemoLanding locale={locale} />;
}
