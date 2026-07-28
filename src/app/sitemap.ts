import type { MetadataRoute } from "next";
import { locales, SITE_URL } from "@/i18n/config";
import { GUIDES, localizedSlug, hasEnPage } from "@/content/guides";
import { PRODUCTS, productHubPath, productPath } from "@/content/products";

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

  // Hub de producto + las cuatro landings de área, ambas en los dos idiomas.
  // Cada URL declara sus alternates para que el hreflang del sitemap coincida
  // con el que emite `generateMetadata`.
  const productHubLanguages = Object.fromEntries(
    locales.map((locale) => [locale, `${SITE_URL}${productHubPath(locale)}`])
  );
  const productHub = locales.map((locale) => ({
    url: `${SITE_URL}${productHubPath(locale)}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
    alternates: { languages: productHubLanguages },
  }));

  const productAreas = PRODUCTS.flatMap((area) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_URL}${productPath(area.key, locale)}`])
    );
    return locales.map((locale) => ({
      url: `${SITE_URL}${productPath(area.key, locale)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: area.priority,
      alternates: { languages },
    }));
  });

  const guides = GUIDES.flatMap((guide) => {
    const esUrl = `${SITE_URL}/es/${localizedSlug(guide.key, "es")}`;
    // Per-locale hreflang alternates: EN only when the guide has its own EN page.
    const guideLanguages: Record<string, string> = { es: esUrl };
    if (hasEnPage(guide.key)) {
      guideLanguages.en = `${SITE_URL}/en/${localizedSlug(guide.key, "en")}`;
    }

    const entries: MetadataRoute.Sitemap = [
      {
        url: esUrl,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: guide.priority,
        alternates: { languages: guideLanguages },
      },
    ];
    if (hasEnPage(guide.key)) {
      entries.push({
        url: guideLanguages.en,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: guide.priority,
        alternates: { languages: guideLanguages },
      });
    }
    return entries;
  });

  return [...home, ...productHub, ...productAreas, ...guides, ...legal];
}
