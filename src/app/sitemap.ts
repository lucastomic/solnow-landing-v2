import type { MetadataRoute } from "next";
import { locales, SITE_URL } from "@/i18n/config";
import { GUIDES, localizedSlug, hasEnPage } from "@/content/guides";
import { PRODUCTS, productHubPath, productPath } from "@/content/products";
import { pricingPath } from "@/content/pricingRoute";

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

  // Precios: en los dos idiomas y con alternates cruzados. Es la página que
  // captura las búsquedas de «cuánto cuesta», así que va con la misma prioridad
  // que el hub de producto.
  const pricing: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${SITE_URL}${pricingPath(locale)}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.9,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${pricingPath(l)}`])) },
  }));

  // Calculadora: solo `/es`, sin alternates. `proxy.ts` redirige `/en/calculator`
  // aquí mismo, así que declarar una alternativa inglesa sería anunciar una URL
  // que responde 301 a esta.
  const calculator = [
    {
      url: `${SITE_URL}/es/calculator`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  return [...home, ...pricing, ...productHub, ...productAreas, ...guides, ...calculator, ...legal];
}
