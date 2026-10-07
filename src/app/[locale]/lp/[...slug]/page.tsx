import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeMeta, locales } from '@/i18n/config';
import { getT } from '@/i18n/dictionaries';
import { LpLanding } from '@/components/lp/LpLanding';
import { COMPETITORS } from '@/content/competitors';
import { LP_PAGES, lpBySlug, lpPath } from '@/content/lp';

/** Solo las landings del registro (`src/content/lp.ts`); el resto bajo `/lp` es 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LP_PAGES.flatMap((p) => locales.map((locale) => ({ locale, slug: p.slug[locale] })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = lpBySlug(locale, slug);
  if (!page) return {};
  const t = await getT(locale);
  const key = page.template === 'categoria' ? page.key : 'alt';
  const vars = { name: page.template === 'alternativa' ? COMPETITORS[page.competitor].name : '' };
  const path = lpPath(page, locale);
  return {
    title: { absolute: t(`lp.pages.${key}.meta.title`, vars) },
    description: t(`lp.pages.${key}.meta.description`, vars),
    alternates: {
      canonical: path,
      languages: Object.fromEntries(locales.map((l) => [l, lpPath(page, l)])),
    },
    openGraph: { url: path, locale: localeMeta[locale].ogLocale, type: 'website' },
    // Landing de campaña: `noindex` para que no compita en orgánico con las
    // páginas de producto y las comparativas. Sin `Disallow` en robots.ts:
    // AdsBot lo respeta y desaprobaría el anuncio (mismo criterio que /demo).
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  };
}

export default async function LpRoute({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = lpBySlug(locale, slug);
  if (!page) notFound();
  return <LpLanding page={page} locale={locale} />;
}
