import 'server-only';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { GuideContent, GuideKey } from '@/content/guides';
import type { GuideLabels } from '@/components/GuidePage';

/** Loads a guide's content + shared labels from the i18n dictionaries. */
export async function getGuide(
  locale: Locale,
  key: GuideKey,
): Promise<{ content: GuideContent; labels: GuideLabels }> {
  const g = (await getDictionary(locale)).guides;
  const labels: GuideLabels = {
    backHome: g.backHome,
    faqTitle: g.faqTitle,
    relatedTitle: g.relatedTitle,
    disclaimerLabel: g.disclaimerLabel,
  };
  return { content: g[key] as unknown as GuideContent, labels };
}
