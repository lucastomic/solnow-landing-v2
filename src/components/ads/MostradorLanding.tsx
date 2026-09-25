import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { localeMeta, type Locale } from '@/i18n/config';
import { getDictionary, getT } from '@/i18n/dictionaries';
import { adsMostradorLanguages, adsMostradorPath } from '@/content/adsLanding';
import { SectionHead, NumLabel } from '@/components/atoms';
import RevealProvider from '@/components/RevealProvider';
import { localizedSlugFromSlug } from '@/content/guides';
import { PLANS } from '@/lib/pricingCalc';
import { DemoCalendar } from '@/components/sections/DemoCalendar';
import { DemoStickyCta } from '@/components/ads/DemoStickyCta';
import { AdsHeader, AdsLogos, AdsFooter } from '@/components/ads/AdsChrome';
import { AreaMock, AreaMockSecondary } from '@/components/product/mocks';

/**
 * Landing de campaña para quien llega por el mostrador, no por la IA.
 *
 * `/demo` está construida alrededor del agente de WhatsApp: su mock, sus cifras
 * y un CTA que abre el chat. A quien le duele la cola de agosto, el contrato en
 * papel y el libro de registro, eso le habla de otro producto. Esta es la misma
 * estructura de campaña (sin nav, una sola acción, footer legal) contada desde
 * la caseta: venta → QR → contrato en el móvil → embarque con escaneo.
 *
 * La acción es el calendario, no WhatsApp: el mostrador no se prueba desde el
 * móvil del visitante, se enseña en una demo montada con su flota.
 *
 * Las cifras son las del caso de Grupo Marina Jets tal como está publicado
 * (redondeadas a petición del cliente, horas «≈» y «estimadas»). El kiosko de
 * autoservicio queda fuera a propósito hasta que esté listo para venderse.
 */
/** Fotos reales del sistema en uso: esquinas y sombra de tarjeta, a todo el ancho de su columna. */
const PHOTO_STYLE = {
  width: '100%',
  height: 'auto',
  display: 'block',
  borderRadius: 16,
  border: '1px solid var(--line-soft)',
  boxShadow: '0 24px 60px -24px rgba(9, 40, 64, 0.35)',
} as const;

export async function MostradorLanding({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const bullets = t<string[]>('adsMostrador.hero.bullets');
  const pain = t<{ k: string; h: string; p: string }[]>('adsMostrador.pain.items');
  const stats = t<{ k: string; u: string; d: string }[]>('adsMostrador.stats.items');
  const steps = t<{ h: string; p: string }[]>('adsMostrador.steps.items');
  // El precio sale de `PLANS`, no del copy: si cambia la cuota, el FAQ no se
  // queda atrás. `t` solo interpola hojas string, así que se sustituye aquí.
  const price =
    locale === 'es' ? `${PLANS.despegue.monthly.first} €` : `€${PLANS.despegue.monthly.first}`;
  const faq = t<{ q: string; a: string }[]>('adsMostrador.faq.items').map((f) => ({
    ...f,
    a: f.a.replace('{price}', price),
  }));

  // Cada paso con su pantalla. Son los mismos mockups de las páginas de
  // producto: la entrega del QR del TPV, la firma en el móvil y el embarque.
  const stepMocks = [
    <AreaMockSecondary key="tpv" areaKey="tpv" />,
    <AreaMock key="contratos" areaKey="contratos" />,
    <AreaMockSecondary key="operacion" areaKey="operacion" />,
  ];

  return (
    <>
      <RevealProvider />
      <DemoStickyCta
        label={t('adsMostrador.sticky.cta')}
        note={t('adsMostrador.sticky.note')}
        formLocation="ads_mostrador_sticky"
      />

      <AdsHeader />

      <main>
        {/* ── Hero: el titular a la izquierda, la venta en el TPV a la derecha ── */}
        <section id="top" style={{ position: 'relative', paddingTop: 40, paddingBottom: 72, overflow: 'hidden' }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(900px 480px at 80% 0%, rgba(74,144,192,0.18), transparent 60%),' +
                'radial-gradient(700px 400px at 10% 30%, rgba(16,102,149,0.10), transparent 60%)',
            }}
          />
          <div
            aria-hidden
            className="dotgrid"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.5,
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)',
            }}
          />

          <div className="container" style={{ position: 'relative' }}>
            <div
              className="r-split"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: 56,
                alignItems: 'center',
              }}
            >
              <div className="hero-rise">
                <span className="eyebrow">{t('adsMostrador.hero.eyebrow')}</span>
                <h1
                  className="h-display"
                  style={{ margin: '18px 0 24px', fontSize: 'clamp(34px, 4.4vw, 58px)', lineHeight: 1.03 }}
                >
                  {t('adsMostrador.hero.headPre')}
                  <em className="serif" style={{ color: 'var(--accent)' }}>
                    {t('adsMostrador.hero.headEm')}
                  </em>
                  {t('adsMostrador.hero.headPost')}
                </h1>
                <p className="lede" style={{ maxWidth: '52ch', marginBottom: 32 }}>
                  {t('adsMostrador.hero.lede')}
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  {bullets.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '28px 1fr',
                        gap: 14,
                        alignItems: 'start',
                        fontSize: 16.5,
                        color: 'var(--fg-2)',
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: '1px solid var(--accent-dim)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent)',
                          fontSize: 13,
                          transform: 'translateY(2px)',
                        }}
                      >
                        ↳
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* `#agendar` también arma el embed de HubSpot al hacer clic
                    (`DemoCalendar` escucha en captura), así que el calendario
                    empieza a cargar antes de que termine el scroll. */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 20px' }}>
                  <a className="btn btn-primary" href="#agendar" style={{ fontSize: 16, padding: '15px 22px' }}>
                    {t('adsMostrador.hero.ctaPrimary')}
                  </a>
                  <a className="btn btn-ghost" href="#como" style={{ fontSize: 14.5 }}>
                    {t('adsMostrador.hero.ctaSecondary')}
                  </a>
                </div>

                <p className="mono" style={{ margin: '22px 0 0', fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>
                  {t('adsMostrador.hero.trustNote')}
                </p>
              </div>

              {/* Foto real del TPV en un mostrador, no el mock: a quien llega por
                  la cola le convence más ver el equipo trabajando que una
                  captura. `priority` porque es el elemento más grande del
                  pliegue (LCP). */}
              <div className="hero-rise" style={{ ['--reveal-delay' as string]: '120ms', minWidth: 0 }}>
                <Image
                  src="/assets/tpv-mostrador.jpg"
                  alt={t('adsMostrador.hero.photoAlt')}
                  width={1680}
                  height={916}
                  priority
                  sizes="(max-width: 1000px) 100vw, 50vw"
                  style={PHOTO_STYLE}
                />
              </div>
            </div>
          </div>
        </section>

        <AdsLogos title={t('adsMostrador.logos.title')} />

        {/* ── El dolor: agosto con el mostrador en papel ───────────────────── */}
        <section className="section" style={{ paddingTop: 88, paddingBottom: 40 }}>
          <div className="container">
            <SectionHead
              eyebrow={t('adsMostrador.pain.eyebrow')}
              title={<>{t('adsMostrador.pain.title')}</>}
              align="center"
            />
            <div className="r-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {pain.map((c, i) => (
                <div
                  key={i}
                  className="card reveal"
                  style={{ ['--reveal-delay' as string]: `${i * 80}ms`, padding: 28 }}
                >
                  <div
                    style={{
                      fontSize: 'clamp(30px, 3vw, 40px)',
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      fontWeight: 500,
                      color: 'var(--fg)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {c.k}
                  </div>
                  <h3 className="h-3" style={{ margin: '14px 0 10px', fontSize: 18 }}>{c.h}</h3>
                  <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.6 }}>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cómo funciona: un paso por fila, cada uno con su pantalla ──────── */}
        <section id="como" className="section" style={{ paddingTop: 72, paddingBottom: 48, scrollMarginTop: 24 }}>
          <div className="container">
            <SectionHead
              eyebrow={t('adsMostrador.steps.eyebrow')}
              title={<>{t('adsMostrador.steps.title')}</>}
              align="center"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(56px, 7vw, 96px)' }}>
              {steps.map((s, i) => (
                // `r-media-first` en las filas pares invierte las columnas solo en
                // escritorio; en móvil el texto va siempre antes que la pantalla.
                <div
                  key={i}
                  className={i % 2 === 1 ? 'r-split r-media-first' : 'r-split'}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}
                >
                  <div className="reveal">
                    <NumLabel n={i + 1} of={steps.length} />
                    <h3 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', margin: '14px 0 14px' }}>{s.h}</h3>
                    <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 16.5, lineHeight: 1.65, maxWidth: '48ch' }}>{s.p}</p>
                  </div>
                  <div className="reveal" style={{ ['--reveal-delay' as string]: '140ms', minWidth: 0 }}>
                    {stepMocks[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Y todas las bases ────────────────────────────────────────────── */}
        <section className="section" style={{ paddingTop: 40, paddingBottom: 72 }}>
          <div className="container">
            <div
              className="card r-split r-media-first"
              style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 48, alignItems: 'center', padding: 'clamp(24px, 4vw, 44px)' }}
            >
              <div className="reveal">
                <h3 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', margin: '0 0 14px' }}>
                  {t('adsMostrador.steps.fleet.h')}
                </h3>
                <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 16.5, lineHeight: 1.65 }}>
                  {t('adsMostrador.steps.fleet.p')}
                </p>
              </div>
              <div className="reveal" style={{ ['--reveal-delay' as string]: '140ms', minWidth: 0 }}>
                <Image
                  src="/assets/operacion-tiempo-real.jpg"
                  alt={t('adsMostrador.steps.fleet.photoAlt')}
                  width={1680}
                  height={916}
                  sizes="(max-width: 1000px) 100vw, 55vw"
                  style={PHOTO_STYLE}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Las cifras: el caso publicado de Grupo Marina Jets ──────────────── */}
        <section className="section" style={{ paddingTop: 48, paddingBottom: 96 }}>
          <div className="container">
            <SectionHead
              eyebrow={t('adsMostrador.stats.eyebrow')}
              title={<>{t('adsMostrador.stats.title')}</>}
              align="center"
            />
            <div
              className="r-cols-4"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1,
                border: '1px solid var(--line-soft)',
                borderRadius: 16,
                overflow: 'hidden',
                background: 'var(--line-soft)',
              }}
            >
              {stats.map((b, i) => (
                <div
                  key={i}
                  className="reveal"
                  style={{
                    ['--reveal-delay' as string]: `${i * 90}ms`,
                    padding: '32px 28px',
                    background: 'var(--bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 'clamp(32px, 3.2vw, 44px)',
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      fontWeight: 500,
                      color: 'var(--accent)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {b.k}
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--fg)', marginTop: 6, fontWeight: 500 }}>{b.u}</div>
                  <div style={{ fontSize: 14, color: 'var(--muted)' }}>{b.d}</div>
                </div>
              ))}
            </div>
            {/* Quien dude de la cifra tiene dónde comprobarla. */}
            <p className="reveal" style={{ textAlign: 'center', margin: '24px 0 0' }}>
              <Link
                className="footer-link"
                href={`/${locale}/${localizedSlugFromSlug(t('adsMostrador.stats.caseSlug'), locale)}`}
                style={{ fontSize: 14.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {t('adsMostrador.stats.caseLabel')}
                <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
                  <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </p>
          </div>
        </section>

        {/* ── La acción: el calendario ─────────────────────────────────────── */}
        {/* Carga en diferido: lo arman el observer (400px antes de entrar) o el
            clic en cualquier ancla `#agendar` —hero, barra fija y cierre—. */}
        <section
          id="agendar"
          className="section"
          style={{
            paddingBlock: 96,
            scrollMarginTop: 24,
            background: 'var(--bg-2)',
            borderBlock: '1px solid var(--line-soft)',
          }}
        >
          <div className="container">
            <SectionHead
              eyebrow={t('adsMostrador.calendar.eyebrow')}
              title={<>{t('adsMostrador.calendar.title')}</>}
              align="center"
            />
            <p
              className="reveal"
              style={{
                maxWidth: '62ch',
                margin: '0 auto 36px',
                textAlign: 'center',
                color: 'var(--fg-2)',
                fontSize: 15.5,
                lineHeight: 1.6,
              }}
            >
              {t('adsMostrador.calendar.note')}
            </p>
            <div className="reveal" style={{ maxWidth: 860, marginInline: 'auto' }}>
              <DemoCalendar passThroughParams trackConversion="ads_mostrador" />
            </div>
          </div>
        </section>

        {/* ── FAQ: objeciones, sin acordeón ────────────────────────────────── */}
        <section className="section" style={{ paddingBlock: 96 }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <SectionHead title={<>{t('adsMostrador.faq.title')}</>} align="center" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {faq.map((f, i) => (
                <div
                  key={i}
                  className="reveal"
                  style={{ borderTop: '1px solid var(--line-soft)', padding: '22px 0' }}
                >
                  <h3 className="h-3" style={{ margin: '0 0 8px', fontSize: 18 }}>{f.q}</h3>
                  <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.65 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cierre ───────────────────────────────────────────────────────── */}
        {/* El `id` lo observa `DemoStickyCta` para esconderse aquí. */}
        <section
          id="cierre"
          style={{
            position: 'relative',
            paddingBlock: 96,
            overflow: 'hidden',
            background:
              'radial-gradient(900px 600px at 80% 45%, var(--accent-bg), transparent 60%),' +
              'linear-gradient(180deg, var(--bg-2), var(--bg))',
            borderTop: '1px solid var(--line-soft)',
          }}
        >
          <div aria-hidden className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
          <div className="container reveal" style={{ position: 'relative', textAlign: 'center' }}>
            <h2 className="h-display" style={{ margin: '0 auto 28px', maxWidth: '20ch', fontSize: 'clamp(34px, 4.6vw, 60px)' }}>
              {t('adsMostrador.final.head')}
            </h2>
            <a className="btn btn-primary" href="#agendar" style={{ fontSize: 16, padding: '15px 22px' }}>
              {t('adsMostrador.final.cta')}
            </a>
            <p className="mono" style={{ marginTop: 18, marginBottom: 0, fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>
              {t('adsMostrador.final.note')}
            </p>
          </div>
        </section>
      </main>

      <AdsFooter locale={locale} />
    </>
  );
}

/**
 * Metadatos de la landing, compartidos por las dos carpetas de idioma.
 *
 * `noindex` por lo mismo que `/demo`: es una página de campaña que no aporta
 * nada al orgánico. Sin `Disallow` en `robots.ts`, porque AdsBot lo respeta y
 * desaprobaría el anuncio.
 */
export async function mostradorMetadata(locale: Locale): Promise<Metadata> {
  const m = (await getDictionary(locale)).adsMostrador.meta;
  const path = adsMostradorPath(locale);
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: path, languages: adsMostradorLanguages },
    openGraph: {
      title: m.ogTitle,
      description: m.description,
      url: path,
      locale: localeMeta[locale].ogLocale,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: m.ogTitle, description: m.description },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
  };
}
