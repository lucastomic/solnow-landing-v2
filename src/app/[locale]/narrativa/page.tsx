import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';
import { getNarrativa } from '@/content/narrativa';
import { NarrativaTour } from '@/components/narrativa/NarrativaTour';

/**
 * El tour de la narrativa comercial, en `/es/narrativa` y `/en/narrativa`.
 *
 * Es el deck de ventas: lo lleva el vendedor en una llamada o se comparte como
 * enlace. Sin índice en buscadores y fuera del sitemap. No hay autenticación
 * todavía: la URL es lo único que lo protege. El idioma se cambia desde el
 * modo presentador; el mismo slug en los dos locales, sin alternates.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { ui } = await getNarrativa(locale);
  return {
    title: ui.meta.title,
    description: ui.meta.description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
  };
}

export default async function NarrativaRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <NarrativaTour locale={locale} />;
}
