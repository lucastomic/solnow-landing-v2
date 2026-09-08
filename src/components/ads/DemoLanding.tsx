import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getT } from '@/i18n/dictionaries';
import { SectionHead, NumLabel } from '@/components/atoms';
import RevealProvider from '@/components/RevealProvider';
import { CLIENT_LOGOS } from '@/components/sections/clientLogos';
import { DemoCalendar } from '@/components/sections/DemoCalendar';

/**
 * Landing de campaña: una sola acción, reservar demo.
 *
 * No reutiliza `Nav` ni el `Footer` completo a propósito. Los dos están llenos
 * de enlaces —producto, guías, zonas— que en tráfico orgánico son navegación y
 * en tráfico de pago son fugas: cada clic que no sea el calendario es un clic
 * que se ha pagado y no convierte. Aquí solo hay salidas legales.
 *
 * El calendario va en el hero, no al final como en la home: quien llega de un
 * anuncio ya ha leído el argumento en el propio anuncio.
 */
export async function DemoLanding({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const bullets = t<string[]>('adsDemo.hero.bullets');
  const cards = t<{ h: string; p: string }[]>('adsDemo.value.cards');
  const steps = t<{ h: string; p: string }[]>('adsDemo.how.steps');
  const faq = t<{ q: string; a: string }[]>('adsDemo.faq.items');

  return (
    <>
      <RevealProvider />

      <header style={{ position: 'relative', zIndex: 10 }}>
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', height: 64, paddingTop: 12 }}
        >
          {/* Marca sin enlace: es la landing, no hay a dónde ir desde el logo. */}
          <Image
            src="/hollow_logo_name_color.webp"
            alt="Solnow"
            width={162}
            height={28}
            priority
            style={{ width: 162, height: 'auto' }}
          />
        </div>
      </header>

      <main>
        {/* ── Hero: copy a la izquierda, calendario a la derecha ───────────── */}
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
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.05fr)',
                gap: 64,
                alignItems: 'start',
              }}
            >
              <div className="hero-rise">
                <span className="eyebrow">{t('adsDemo.hero.eyebrow')}</span>
                <h1 className="h-display" style={{ margin: '18px 0 24px' }}>
                  {t('adsDemo.hero.headPre')}
                  <em className="serif" style={{ color: 'var(--accent)' }}>
                    {t('adsDemo.hero.headEm')}
                  </em>
                  {t('adsDemo.hero.headPost')}
                </h1>
                <p className="lede" style={{ maxWidth: '52ch', marginBottom: 32 }}>
                  {t('adsDemo.hero.lede')}
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

                <p className="mono" style={{ margin: 0, fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>
                  {t('adsDemo.hero.trustNote')}
                </p>
              </div>

              {/* `r-split` colapsa a una columna por debajo de 1000px, así que en
                  móvil el calendario cae justo bajo el copy sin nada extra. */}
              <div id="agendar" className="hero-rise" style={{ ['--reveal-delay' as string]: '120ms', scrollMarginTop: 24 }}>
                <DemoCalendar eager passThroughParams trackConversion="ads_demo" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Prueba social ────────────────────────────────────────────────── */}
        <section style={{ paddingBlock: 8 }}>
          <div className="container">
            <p
              className="mono reveal"
              style={{
                margin: '0 0 20px',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted-2)',
                textAlign: 'center',
              }}
            >
              {t('adsDemo.logos.title')}
            </p>
            {/* Fila estática, no la marquesina de la home: una animación en bucle
                al lado del calendario compite con la única acción de la página. */}
            <div
              className="reveal"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '28px 44px',
                padding: '24px 0',
                borderBlock: '1px solid var(--line-soft)',
              }}
            >
              {CLIENT_LOGOS.map((l) => (
                <Image
                  key={l.src}
                  src={l.src}
                  alt={l.alt}
                  width={l.w}
                  height={l.h}
                  unoptimized
                  style={{ height: 44, width: 'auto', maxWidth: 170, objectFit: 'contain' }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Qué se ve en la demo ─────────────────────────────────────────── */}
        <section className="section" style={{ paddingBlock: 96 }}>
          <div className="container">
            <SectionHead
              eyebrow={t('adsDemo.value.eyebrow')}
              title={<>{t('adsDemo.value.title')}</>}
              align="center"
            />
            <div className="r-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {cards.map((c, i) => (
                <div
                  key={i}
                  className="card card-lift reveal"
                  style={{ ['--reveal-delay' as string]: `${i * 80}ms`, padding: 28 }}
                >
                  <NumLabel n={i + 1} of={cards.length} />
                  <h3 className="h-3" style={{ margin: '14px 0 10px' }}>{c.h}</h3>
                  <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.6 }}>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Qué pasa después de reservar ─────────────────────────────────── */}
        <section className="section" style={{ paddingBlock: 96, background: 'var(--bg-2)', borderBlock: '1px solid var(--line-soft)' }}>
          <div className="container">
            <SectionHead
              eyebrow={t('adsDemo.how.eyebrow')}
              title={<>{t('adsDemo.how.title')}</>}
              align="center"
            />
            <div className="r-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="reveal"
                  style={{ ['--reveal-delay' as string]: `${i * 80}ms`, borderTop: '1px solid var(--line)', paddingTop: 20 }}
                >
                  <NumLabel n={i + 1} of={steps.length} />
                  <h3 className="h-3" style={{ margin: '12px 0 10px' }}>{s.h}</h3>
                  <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.6 }}>{s.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="section" style={{ paddingBlock: 96 }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <SectionHead title={<>{t('adsDemo.faq.title')}</>} align="center" />
            {/* Sin acordeón: son cuatro respuestas cortas y son objeciones. Un
                clic de más para leerlas es un clic de más para no reservar. */}
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

        {/* ── CTA final: de vuelta al calendario del hero ──────────────────── */}
        <section
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
            <h2 className="h-display" style={{ margin: '0 0 28px', fontSize: 'clamp(34px, 4.6vw, 60px)' }}>
              {t('adsDemo.final.head')}
            </h2>
            <a className="btn btn-primary" href="#agendar" style={{ fontSize: 16, padding: '15px 22px' }}>
              {t('adsDemo.final.cta')}
              <svg width="16" height="16" viewBox="0 0 14 14">
                <path d="M7 3v8M3.5 7.5 7 11l3.5-3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <p className="mono" style={{ marginTop: 18, marginBottom: 0, fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>
              {t('adsDemo.final.note')}
            </p>
          </div>
        </section>
      </main>

      {/* Footer mínimo: copyright y las dos páginas legales. Nada más. */}
      <footer style={{ borderTop: '1px solid var(--line-soft)', paddingBlock: 28 }}>
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            color: 'var(--muted)',
          }}
        >
          <span>{t('adsDemo.footer.rights', { year: new Date().getFullYear() })}</span>
          <span style={{ display: 'flex', gap: 20 }}>
            <Link href={`/${locale}/privacy`} style={{ color: 'inherit' }}>
              {t('footer.legalLinks.privacy')}
            </Link>
            <Link href={`/${locale}/terms`} style={{ color: 'inherit' }}>
              {t('footer.legalLinks.terms')}
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
