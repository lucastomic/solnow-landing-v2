import { SITE_URL, localeMeta, type Locale } from '@/i18n/config';
import { getProductContent, getProductArea } from '@/lib/getProduct';
import { PRODUCTS, productHubPath, productPath, type ProductKey } from '@/content/products';

const abs = (path: string) => `${SITE_URL}${path}`;

/**
 * JSON-LD for the product hub: WebPage + BreadcrumbList + an ItemList that
 * enumerates the four area landings, so crawlers discover them as a set even
 * before following the links.
 */
export async function buildProductHubJsonLd(locale: Locale) {
  const content = await getProductContent(locale);
  const url = abs(productHubPath(locale));
  const inLanguage = localeMeta[locale].hreflang;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: content.hero.h1,
        description: content.meta.description,
        inLanguage,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: content.labels.breadcrumbHome,
            item: `${SITE_URL}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: content.labels.breadcrumbProduct,
            item: url,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#areas`,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: PRODUCTS.length,
        itemListElement: PRODUCTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: content.areas[p.key].card.title,
          item: abs(productPath(p.key, locale)),
        })),
      },
    ],
  };
}

/**
 * JSON-LD for one area landing: WebPage + BreadcrumbList (3 levels, so the
 * hub shows up in the SERP breadcrumb) + Service for the module itself +
 * FAQPage for the page's own questions.
 */
export async function buildProductAreaJsonLd(locale: Locale, key: ProductKey) {
  const { area, shared } = await getProductArea(locale, key);
  const url = abs(productPath(key, locale));
  const hubUrl = abs(productHubPath(locale));
  const inLanguage = localeMeta[locale].hreflang;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: area.hero.h1,
      description: area.meta.description,
      inLanguage,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      primaryImageOfPage: `${url}/opengraph-image`,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: shared.labels.breadcrumbHome,
          item: `${SITE_URL}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: shared.labels.breadcrumbProduct,
          item: hubUrl,
        },
        { '@type': 'ListItem', position: 3, name: area.card.title, item: url },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: area.card.title,
      description: area.meta.description,
      serviceType: area.hero.eyebrow,
      url,
      inLanguage,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'Mediterranean',
    },
  ];

  if (area.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: area.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
