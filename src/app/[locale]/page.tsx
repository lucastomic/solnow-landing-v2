import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import HomeClient from './HomeClient';

/** FAQ rich-result schema for the home page (mirrors the on-page FAQ section). */
async function HomeFaqJsonLd({ locale }: { locale: string }) {
  if (!isLocale(locale)) return null;
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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <HomeFaqJsonLd locale={locale} />
      <HomeClient />
    </>
  );
}
