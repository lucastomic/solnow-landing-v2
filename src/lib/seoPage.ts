import 'server-only';
import type { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { localeMeta } from '@/i18n/config';
import { productPath } from '@/content/products';
import type { GuideContent } from '@/content/guides';
import type { GuideLabels } from '@/components/GuidePage';
import type { PaginaSeo } from '@/content/seo/paginas';

/** Contenido + etiquetas compartidas de una página programática (equivalente a `getGuide`). */
export async function getSeoPage(p: PaginaSeo): Promise<{ content: GuideContent; labels: GuideLabels }> {
  const g = (await getDictionary(p.locale)).guides;
  return {
    content: p.build(),
    labels: {
      backHome: g.backHome,
      tocLabel: g.tocLabel,
      faqTitle: g.faqTitle,
      relatedTitle: g.relatedTitle,
      disclaimerLabel: g.disclaimerLabel,
      breadcrumbHome: g.breadcrumbHome,
      viewProduct: g.viewProduct,
      byLabel: g.byLabel,
      logosTitle: g.logosTitle,
      groupLabel: g.groups[p.grupo ?? 'recurso'],
      productHref: productPath(p.area, p.locale),
    },
  };
}

/**
 * Metadatos de una página programática. Sin gemela en el otro idioma, el
 * hreflang declara solo el suyo y `x-default`: anunciar una alternativa que no
 * existe sería apuntar a un 404.
 */
export function buildSeoMetadata(p: PaginaSeo): Metadata {
  const content = p.build();
  const url = `/${p.locale}/${p.slug}`;
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: url, languages: { [p.locale]: url, 'x-default': url } },
    openGraph: {
      title: content.meta.ogTitle,
      description: content.meta.description,
      url,
      locale: localeMeta[p.locale].ogLocale,
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title: content.meta.ogTitle, description: content.meta.description },
    robots: { index: true, follow: true },
  };
}
