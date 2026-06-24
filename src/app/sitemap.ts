import type { MetadataRoute } from "next";
import { locales, SITE_URL } from "@/i18n/config";
import { GUIDES } from "@/content/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${SITE_URL}/${locale}`])
  );

  const home = locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: { languages },
  }));

  const legal = locales.flatMap((locale) =>
    (["terms", "privacy"] as const).map((page) => ({
      url: `${SITE_URL}/${locale}/${page}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}/${page}`])
        ),
      },
    }))
  );

  const guides = locales.flatMap((locale) =>
    GUIDES.map((guide) => ({
      url: `${SITE_URL}/${locale}/${guide.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: guide.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}/${guide.slug}`])
        ),
      },
    }))
  );

  return [...home, ...guides, ...legal];
}
