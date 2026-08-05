import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isLocale, localeMeta, SITE_URL } from "@/i18n/config";
import { getDictionary, getClientDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";
import { MetaPixelNoScript } from "@/components/MetaPixel";
import { DeferredAnalytics } from "@/components/DeferredAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Solo la cursiva: la clase `.serif` fuerza `font-style: italic` y el único uso
// suelto de `--font-serif` (SectionsMid) también. El `@import` que había antes
// pedía `ital@0;1` y descargaba la redonda para nada.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
  display: "swap",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#f7f7f7",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const m = (await getDictionary(locale)).metadata;
  const path = `/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    icons: {
      icon: "/logo_color.png",
      shortcut: "/logo_color.png",
      apple: "/logo_color.png",
    },
    alternates: {
      canonical: path,
      languages: {
        es: "/es",
        en: "/en",
        // x-default → inglés: es la versión que sirve al tráfico internacional
        // que no encaja en ninguna de las dos variantes declaradas.
        "x-default": "/en",
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: path,
      siteName: m.siteName,
      locale: localeMeta[locale].ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // El JSON-LD se arma en servidor con el diccionario completo; al cliente solo
  // viaja el subconjunto que los componentes cliente leen de verdad.
  const j = (await getDictionary(locale)).jsonLd;
  const messages = await getClientDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: j.orgName,
        url: SITE_URL,
        logo: `${SITE_URL}/assets/solnow-mark.png`,
        image: `${SITE_URL}/assets/solnow-mark.png`,
        description: j.orgDescription,
        areaServed: "Mediterranean",
        foundingLocation: "Valencia, ES",
        // TODO(SEO §5.1): add LinkedIn, Capterra and GetApp profile URLs here
        // once available — they reinforce the entity for search engines/LLMs.
        sameAs: ["https://www.instagram.com/solnow.io"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: j.orgName,
        url: SITE_URL,
        inLanguage: localeMeta[locale].hreflang,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: j.appName,
        applicationCategory: j.appCategory,
        operatingSystem: "Web",
        description: j.appDescription,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        // TODO(SEO §5.2): add real pricing tiers as an AggregateOffer, e.g.
        // offers: { "@type": "AggregateOffer", priceCurrency: "EUR",
        //   lowPrice: "0", highPrice: "199", offerCount: "3" }
      },
    ],
  };

  return (
    <html lang={locale} data-palette="brand" data-density="regular">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      >
        {/* El <noscript> del pixel va dentro de <body>: como hijo directo de
            <html> es HTML inválido y rompe la hidratación. */}
        <MetaPixelNoScript />
        <DeferredAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
