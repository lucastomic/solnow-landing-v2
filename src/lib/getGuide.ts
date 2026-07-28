import 'server-only';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { GUIDES, type GuideContent, type GuideKey } from '@/content/guides';
import { AREA_FOR_GUIDE, productPath } from '@/content/products';
import type { GuideLabels } from '@/components/GuidePage';

/** Loads a guide's content + shared labels from the i18n dictionaries. */
export async function getGuide(
  locale: Locale,
  key: GuideKey,
): Promise<{ content: GuideContent; labels: GuideLabels }> {
  const g = (await getDictionary(locale)).guides;
  const group = GUIDES.find((x) => x.key === key)!.group;
  const groups = g.groups as Record<string, string>;
  const labels: GuideLabels = {
    backHome: g.backHome,
    tocLabel: g.tocLabel,
    faqTitle: g.faqTitle,
    relatedTitle: g.relatedTitle,
    disclaimerLabel: g.disclaimerLabel,
    breadcrumbHome: g.breadcrumbHome,
    viewProduct: g.viewProduct,
    groupLabel: groups[group] ?? '',
    // Cada guía apunta a la landing de producto de su tema, no al hub genérico.
    productHref: productPath(AREA_FOR_GUIDE[key], locale),
  };
  return { content: g[key] as unknown as GuideContent, labels };
}
