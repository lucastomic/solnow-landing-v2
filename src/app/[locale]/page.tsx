import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import RevealProvider from '@/components/RevealProvider';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import { PainBar, ProductAreas } from '@/components/sections/SectionsProduct';
import { Pillars, Comparison } from '@/components/sections/SectionsMid';
import { WhyNow } from '@/components/sections/SectionsThesis';
import { Onboarding, SocialProof, FinalCTA, Footer } from '@/components/sections/SectionsEnd';
import { FAQ } from '@/components/sections/FAQ';

/** FAQ rich-result schema for the home page (mirrors the on-page FAQ section). */
async function HomeFaqJsonLd({ locale }: { locale: Locale }) {
  const faq = (await getDictionary(locale)).faq;
  const items = (faq?.items ?? []) as { q: string; a: string }[];
  if (items.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}

/**
 * La home se compone aquí, en servidor.
 *
 * Antes todo colgaba de un `HomeClient` con `'use client'` en la raíz, lo que
 * arrastraba el árbol entero al navegador aunque solo cuatro piezas tengan
 * estado. Ahora cada sección estática resuelve sus textos con `getT` y se
 * queda en el HTML; las islas cliente (`Nav`, el mock del hero, la FAQ, el
 * selector de idioma y el calendario) se montan como hijos.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <HomeFaqJsonLd locale={locale} />
      <RevealProvider />
      <Nav />
      <main>
        <Hero locale={locale} variant="a" />
        <PainBar locale={locale} />
        <Pillars locale={locale} />
        <ProductAreas locale={locale} />
        <WhyNow locale={locale} />
        <Comparison locale={locale} />
        <Onboarding locale={locale} />
        <SocialProof locale={locale} />
        <FAQ />
        <FinalCTA locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
