import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MostradorLanding, mostradorMetadata } from '@/components/ads/MostradorLanding';

/**
 * Landing de campaña del mostrador en `/en/demo-front-desk`. El otro idioma la sirve su
 * carpeta hermana (slugs en `ADS_MOSTRADOR_SLUG`).
 */
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
  return mostradorMetadata(LOCALE);
}

export default async function MostradorRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== LOCALE) notFound();
  return <MostradorLanding locale={LOCALE} />;
}
