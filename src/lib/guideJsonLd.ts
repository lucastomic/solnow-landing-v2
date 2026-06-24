import { SITE_URL, localeMeta, type Locale } from '@/i18n/config';
import type { GuideContent } from '@/content/guides';

/**
 * Builds the per-page JSON-LD @graph for a resource guide:
 * Article + BreadcrumbList + FAQPage (+ HowTo when the guide has a steps block).
 * Injected in the page via a <script type="application/ld+json"> tag.
 */
export function buildGuideJsonLd(content: GuideContent, locale: Locale, slug: string) {
  const url = `${SITE_URL}/${locale}/${slug}`;
  const inLanguage = localeMeta[locale].hreflang;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: content.hero.h1,
      description: content.meta.description,
      inLanguage,
      mainEntityOfPage: url,
      dateModified: '2026-06-24',
      author: { '@id': `${SITE_URL}/#organization` },
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Solnow', item: `${SITE_URL}/${locale}` },
        { '@type': 'ListItem', position: 2, name: content.hero.h1, item: url },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: content.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  const stepsSection = content.sections.find((s) => s.blocks.some((b) => b.type === 'steps'));
  const stepsBlock = stepsSection?.blocks.find((b) => b.type === 'steps');
  if (stepsBlock && stepsBlock.type === 'steps') {
    graph.push({
      '@type': 'HowTo',
      '@id': `${url}#howto`,
      name: stepsSection!.h,
      inLanguage,
      step: stepsBlock.items.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text,
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
