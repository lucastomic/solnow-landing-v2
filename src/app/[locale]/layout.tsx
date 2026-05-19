import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isLocale, localeMeta, SITE_URL } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        "es-ES": "/es",
        "en-US": "/en",
        "x-default": "/es",
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

  const messages = await getDictionary(locale);
  const j = messages.jsonLd;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: j.orgName,
        url: SITE_URL,
        logo: `${SITE_URL}/assets/solnow-mark.png`,
        description: j.orgDescription,
        areaServed: "Mediterranean",
        foundingLocation: "Valencia, ES",
      },
      {
        "@type": "SoftwareApplication",
        name: j.appName,
        applicationCategory: j.appCategory,
        operatingSystem: "Web",
        description: j.appDescription,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <html lang={locale} data-palette="brand" data-density="regular">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
