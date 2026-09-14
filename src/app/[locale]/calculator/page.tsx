import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { isLocale, localeMeta, SITE_URL } from '@/i18n/config';
import RevealProvider from '@/components/RevealProvider';
import Nav from '@/components/Nav';
import { Footer } from '@/components/sections/SectionsEnd';
import { Calculator } from '@/components/calculator/Calculator';
import { FIXED, RATES, type ChannelKey } from '@/content/calculator';

/** Cómo se nombra cada escalón en el dato estructurado. */
const CHANNEL_NAME: Record<ChannelKey, string> = {
  manual: 'a mano',
  card: 'con tarjeta en el sitio',
  online: 'en web y motor',
  whatsapp: 'en WhatsApp',
  otas: 'en OTAs',
};

const pct = (v: number) => `${String(v * 100).replace('.', ',')}%`;

/**
 * Calculadora pública de precio.
 *
 * Solo en español. El documento de producto trae el copy en un único idioma y
 * el público es el operador náutico mediterráneo, así que `/en/calculator` se
 * redirige en `proxy.ts` en vez de publicar una traducción a medias que
 * competiría en hreflang con esta.
 */

const TITLE = 'Calcula lo que te costaría SolNow';
const DESCRIPTION =
  'Cinco datos y ves tu precio: coste anual, desglose por canal, calendario de pagos mes a mes y lo que pagarías con FareHarbor, Regiondo o TuriTop —y qué cubre cada una. Sin dejar el email.';

export function generateStaticParams() {
  return [{ locale: 'es' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'es') return {};

  const path = '/es/calculator';
  return {
    title: TITLE,
    description: DESCRIPTION,
    // Una sola versión de idioma: sin `languages`, porque declarar un `en` que
    // redirige a esta misma URL es exactamente el hreflang roto que Search
    // Console marca como «alternativa sin retorno».
    alternates: { canonical: path },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: path,
      locale: localeMeta.es.ogLocale,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
    robots: { index: true, follow: true },
  };
}

/**
 * Datos estructurados de la oferta.
 *
 * Las cifras salen de `@/content/calculator`, no de literales: si alguien sube
 * la tarifa y el JSON-LD se queda con la vieja, Google publica en el resultado
 * de búsqueda un precio que la página ya no ofrece.
 */
function OfferJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SolNow',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE_URL}/es/calculator`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: String(FIXED.monthly.extra),
      highPrice: String(FIXED.monthly.first),
      offerCount: '2',
      description:
        'Cuota fija por base, todo incluido, más una escalera de comisión por canal de origen: ' +
        (['manual', 'card', 'online', 'otas', 'whatsapp'] as const)
          .map((k) => `${pct(RATES[k].pct)} ${CHANNEL_NAME[k]}`)
          .join(', ') +
        '.',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}

export default async function CalculatorRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) permanentRedirect('/es/calculator');
  // `proxy.ts` ya redirige `/en/calculator`. Esto es el cinturón por si algún
  // día la ruta entra por un camino que no pasa por el proxy: mejor un 301 al
  // castellano que una página en un idioma que no existe.
  if (locale !== 'es') permanentRedirect('/es/calculator');

  return (
    <>
      <OfferJsonLd />
      <RevealProvider />
      <Nav />
      <main>
        <section className="section" style={{ paddingTop: 132, paddingBottom: 0 }}>
          <div className="container">
            <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <span className="eyebrow">Calculadora de precio</span>
              <h1 className="h-1">
                Lo que te costaría SolNow, <span className="serif">con tus números</span>
              </h1>
              <p className="lede">
                Cinco datos y lo ves entero: el coste del año, de qué se compone, qué pagas cada mes
                y qué pagarías con las alternativas —y qué cubre cada una. Sin dejar el email.
              </p>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 44 }}>
          <div className="container">
            <Calculator locale="es" />
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
