import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getT } from '@/i18n/dictionaries';
import { SectionHead, NumLabel } from '@/components/atoms';
import RevealProvider from '@/components/RevealProvider';
import { localizedSlugFromSlug } from '@/content/guides';
import { CLIENT_LOGOS } from '@/components/sections/clientLogos';
import { DemoCalendar } from '@/components/sections/DemoCalendar';
import { WhatsAppCta } from '@/components/ads/WhatsAppCta';
import { DemoStickyCta } from '@/components/ads/DemoStickyCta';
import { WhatsAppMock } from '@/components/product/whatsappMock';

/**
 * Landing de campaña: una sola acción, reservar demo.
 *
 * No reutiliza `Nav` ni el `Footer` completo a propósito. Los dos están llenos
 * de enlaces —producto, guías, zonas— que en tráfico orgánico son navegación y
 * en tráfico de pago son fugas: cada clic que no sea el calendario es un clic
 * que se ha pagado y no convierte. Aquí solo hay salidas legales.
 *
 * La acción principal es escribirle al agente por WhatsApp, no reservar una
 * videollamada. Pedirle media hora de agenda a un dueño de base que viene de un
 * anuncio es un salto enorme, y la propia tesis del producto es que la puerta
 * de entrada es el WhatsApp: que lo viva en vez de leerlo. Además el número del
 * visitante se queda aunque no llegue a reservar, que es más de lo que deja un
 * calendario sin rellenar.
 *
 * El calendario baja a segundo CTA, con sección propia antes del cierre. Como
 * ya no se arma en el hero, vuelve a cargarse en diferido (sin `eager`): el
 * observer y el clic en `#agendar` lo montan cuando de verdad hace falta.
 */
export async function DemoLanding({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const bullets = t<string[]>('adsDemo.hero.bullets');
  // `caseSlug`/`caseLabel` solo los traen las cifras que tienen caso de éxito
  // detrás; las otras dos se quedan sin enlace.
  const stats =
    t<{ k: string; u: string; d: string; caseSlug?: string; caseLabel?: string }[]>(
      'adsDemo.stats.items'
    );
  const cards = t<{ h: string; p: string }[]>('adsDemo.value.cards');
  const faq = t<{ q: string; a: string }[]>('adsDemo.faq.items');

  return (
    <>
      <RevealProvider />
      <DemoStickyCta label={t('adsDemo.sticky.cta')} note={t('adsDemo.sticky.note')} />

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
        {/* ── Hero: copy a la izquierda, el agente contestando a la derecha ── */}
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
                gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
                gap: 64,
                alignItems: 'start',
              }}
            >
              <div className="hero-rise">
                <span className="eyebrow">{t('adsDemo.hero.eyebrow')}</span>
                {/* Un punto por debajo del `clamp` de `.h-display` (40-84px): este
                    titular son dos frases y a tamaño completo se comía el pliegue
                    entero, dejando el CTA fuera de pantalla en un portátil. */}
                <h1
                  className="h-display"
                  style={{ margin: '18px 0 24px', fontSize: 'clamp(34px, 4.4vw, 58px)', lineHeight: 1.03 }}
                >
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

                {/* La acción de la página. El enlace al calendario va debajo y
                    en `btn-ghost`: sigue estando, pero no compite. */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 20px' }}>
                  <WhatsAppCta
                    className="btn btn-primary"
                    label={t('adsDemo.hero.ctaPrimary')}
                    message={t('adsDemo.hero.ctaMessage')}
                    placement="hero"
                    style={{ fontSize: 16, padding: '15px 22px' }}
                  />
                  <a className="btn btn-ghost" href="#agendar" style={{ fontSize: 14.5 }}>
                    {t('adsDemo.hero.ctaSecondary')}
                  </a>
                </div>

                <p className="mono" style={{ margin: '22px 0 0', fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>
                  {t('adsDemo.hero.trustNote')}
                </p>
              </div>

              {/* El hilo del agente, animado. Es el mismo mockup de la landing de
                  producto, y aquí hace de prueba de la promesa del titular: se ve
                  contestar antes de escribirle. `r-split` colapsa por debajo de
                  1000px, así que en móvil cae bajo el copy sin nada extra. */}
              <div className="hero-rise" style={{ ['--reveal-delay' as string]: '120ms' }}>
                <WhatsAppMock contact="Solnow · Agente demo" status="agente IA · responde en 9 s" />
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

        {/* ── Las cifras ───────────────────────────────────────────────────── */}
        {/* Mismo tratamiento que el `PainBar` de la home, pero al revés: allí
            son los números del problema; aquí, los de la solución. Quien llega
            de un anuncio ya sabe qué le duele, hay que enseñarle qué gana.
            Resultados medidos, no características: «24/7» o «1 flujo» los
            promete cualquier SaaS, «45.000 € en un mes» no. */}
        <section className="section" style={{ paddingTop: 72, paddingBottom: 24 }}>
          <div className="container">
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
                  {/* `clamp` en vez de 48 fijo: con cuatro columnas la caja es
                      más estrecha y «45.000 €» se salía. */}
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
                  {/* El operador no se queda suelto: quien dude de la cifra tiene
                      dónde comprobarla. `marginTop: auto` los alinea abajo aunque
                      los descriptores de al lado ocupen distinto número de líneas. */}
                  {b.caseSlug && b.caseLabel && (
                    <Link
                      className="footer-link"
                      href={`/${locale}/${localizedSlugFromSlug(b.caseSlug, locale)}`}
                      style={{ marginTop: 'auto', paddingTop: 10, fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      {b.caseLabel}
                      <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
                        <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Qué hay detrás de lo que acaba de probar ─────────────────────── */}
        <section className="section" style={{ paddingTop: 72, paddingBottom: 96 }}>
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

        {/* ── Segundo CTA: el calendario ───────────────────────────────────── */}
        {/* Ya no está en el hero, así que `DemoCalendar` vuelve a cargarse en
            diferido: lo arman el observer (400px antes de entrar) o el clic en
            cualquier ancla `#agendar`, que es lo que apunta aquí desde el hero y
            desde el cierre. Un millón de bytes de HubSpot que solo se pagan si
            alguien baja hasta aquí. */}
        {/* El fondo tintado lo heredó de la sección de pasos que vivía aquí:
            sin él, las tarjetas de arriba y el calendario se leían como un solo
            bloque plano. */}
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
              eyebrow={t('adsDemo.calendar.eyebrow')}
              title={<>{t('adsDemo.calendar.title')}</>}
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
              {t('adsDemo.calendar.note')}
            </p>
            <div className="reveal" style={{ maxWidth: 860, marginInline: 'auto' }}>
              <DemoCalendar passThroughParams trackConversion="ads_demo" />
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

        {/* ── CTA final: de vuelta al agente ───────────────────────────────── */}
        {/* El `id` no es un ancla de navegación: lo observa `DemoStickyCta` para
            esconderse mientras este bloque está a la vista. */}
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
            <h2 className="h-display" style={{ margin: '0 0 28px', fontSize: 'clamp(34px, 4.6vw, 60px)' }}>
              {t('adsDemo.final.head')}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '14px 20px' }}>
              <WhatsAppCta
                className="btn btn-primary"
                label={t('adsDemo.final.cta')}
                message={t('adsDemo.hero.ctaMessage')}
                placement="final"
                style={{ fontSize: 16, padding: '15px 22px' }}
              />
              <a className="btn btn-ghost" href="#agendar" style={{ fontSize: 14.5 }}>
                {t('adsDemo.final.ctaSecondary')}
              </a>
            </div>
            <p className="mono" style={{ marginTop: 18, marginBottom: 0, fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>
              {t('adsDemo.final.note')}
            </p>
          </div>
        </section>
      </main>

      {/* Footer mínimo: solo las dos páginas legales. Nada más. */}
      <footer style={{ borderTop: '1px solid var(--line-soft)', paddingBlock: 28 }}>
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'center',
            // Centrado, no `space-between`: al quitar el copyright queda un solo
            // bloque, y `space-between` lo habría dejado pegado a la izquierda.
            justifyContent: 'center',
            fontSize: 13,
            color: 'var(--muted)',
          }}
        >
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
