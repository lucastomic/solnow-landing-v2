import Image from 'next/image';
import Link from 'next/link';
import { SectionHead } from '../atoms';
import { getT } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { GUIDES, localizedSlug, hasEnPage } from '@/content/guides';
import { PRODUCTS, productHubPath, productPath, type ProductSummary } from '@/content/products';
import { DemoCalendar } from './DemoCalendar';
import { LocaleSelect } from './LocaleSelect';

export async function Onboarding({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const steps = t<
    { day: string; label: string; h: string; points: string[]; you: string }[]
  >('onboarding.steps');
  const qa = t<{ q: string; a: string }[]>('onboarding.qa');

  return (
    <section id="implementacion" className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead
          eyebrow={t('onboarding.eyebrow')}
          title={<>{t('onboarding.title')}</>}
          lede={t('onboarding.lede')}
        />

        <div style={{ position: 'relative', marginBottom: 56 }}>
          <div
            aria-hidden
            className="r-hide"
            style={{
              position: 'absolute',
              top: 30,
              left: '6%',
              right: '6%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--line) 8%, var(--line) 92%, transparent)',
            }}
          />
          <div className="r-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {steps.map((s, i) => (
              <div
                key={i}
                className="reveal"
                style={{ ['--reveal-delay' as string]: `${i * 100}ms`, display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 60 }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'var(--bg)',
                      border: '1px solid var(--accent-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 6px var(--bg), 0 0 0 7px var(--line-soft)',
                      flexShrink: 0,
                    }}
                  >
                    <span className="mono" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 500 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {s.day}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.012em' }}>{s.label}</div>
                  </div>
                </div>
                <div className="card" style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 className="h-3" style={{ fontSize: 17, lineHeight: 1.25 }}>{s.h}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    {s.points.map((p, j) => (
                      <li key={j} style={{ fontSize: 13.5, color: 'var(--muted)', display: 'grid', gridTemplateColumns: '14px 1fr', gap: 8 }}>
                        <span style={{ color: 'var(--accent-dim)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>—</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    style={{
                      marginTop: 8,
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'oklch(1 0 0 / 0.02)',
                      border: '1px dashed var(--line)',
                      fontSize: 12,
                      color: 'var(--fg-2)',
                    }}
                  >
                    <span className="mono" style={{ color: 'var(--muted)', letterSpacing: '0.06em', fontSize: 10 }}>{t('onboarding.yourWork').toUpperCase()}</span>
                    <br />
                    {s.you}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="r-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 64 }}>
          {qa.map((it, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                ['--reveal-delay' as string]: `${i * 80}ms`,
                padding: 24,
                borderRadius: 14,
                border: '1px solid var(--line-soft)',
                background: 'oklch(1 0 0 / 0.015)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em' }}>
                  {t('onboarding.objective').toUpperCase()}{String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="h-3" style={{ fontSize: 17, marginBottom: 10 }}>{it.q}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55 }}>{it.a}</p>
            </div>
          ))}
        </div>

        <div
          className="reveal"
          style={{
            marginTop: 40,
            padding: '20px 24px',
            borderRadius: 12,
            border: '1px solid var(--accent-dim)',
            background: 'linear-gradient(90deg, var(--accent-bg), transparent)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <span className="serif" style={{ fontSize: 19, flex: 1, color: 'var(--fg)' }}>
            {t('onboarding.ctaText')}
          </span>
          <a className="btn btn-primary" href="#cta" style={{ padding: '11px 18px' }}>
            {t('onboarding.ctaButton')}
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export async function SocialProof({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const partners = t<{ n: string; s: string }[]>('socialProof.partners');

  // `w`/`h` son las dimensiones intrínsecas reales del fichero: `unoptimized`
  // sirve el original, y si el ratio declarado no cuadra con el del archivo la
  // imagen salta al terminar de cargar. Los `.webp` los genera
  // `scripts/optimize-images.mjs` a 3× la altura de render (64 px).
  const logos: { src: string; alt: string; w: number; h: number }[] = [
    { src: '/logos/marina-jets.webp', alt: 'MarinaJets', w: 151, h: 149 },
    { src: '/logos/cocoon.webp', alt: 'Cocoon', w: 671, h: 320 },
    { src: '/logos/elysium.webp', alt: 'Elysium', w: 1576, h: 432 },
    { src: '/logos/jaloque.svg', alt: 'Jaloque', w: 172, h: 82 },
    { src: '/logos/jetskilloret.webp', alt: 'Jet Ski Lloret', w: 400, h: 127 },
    { src: '/logos/ibizarentaboat.png', alt: 'Ibiza Rent a Boat', w: 186, h: 60 },
    { src: '/logos/morairaboatsadventures.webp', alt: 'Moraira Boats Adventures', w: 338, h: 192 },
    { src: '/logos/primeyachtmallorca.webp', alt: 'Prime Yacht Mallorca', w: 206, h: 192 },
    { src: '/logos/rentboatinalicante.webp', alt: 'Rent Boat in Alicante', w: 256, h: 192 },
    { src: '/logos/trulovesailing.webp', alt: 'Trulove Sailing', w: 698, h: 192 },
  ];

  return (
    <section className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead eyebrow={t('socialProof.eyebrow')} title={<>{t('socialProof.title')}</>} />



        <div className="reveal" style={{ padding: '24px 0', borderBlock: '1px solid var(--line-soft)', background: 'oklch(1 0 0 / 0.012)' }}>
    
          <div className="marquee">
            <div className="marquee-track">
              {[...logos, ...logos].map((l, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 96,
                  }}
                >
                  <Image
                    src={l.src}
                    alt={l.alt}
                    width={l.w}
                    height={l.h}
                    unoptimized
                    style={{ height: 64, width: 'auto', maxWidth: 240, objectFit: 'contain' }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
          {partners.map(({ n, s }) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {n === 'LANZADERA' ? (
                <Image
                  src="/logos/lanzadera.webp"
                  alt="Lanzadera"
                  width={369}
                  height={96}
                  unoptimized
                  style={{ height: 28, width: 'auto', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '-0.012em' }}>{n}</span>
              )}
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted-2)', letterSpacing: '0.06em' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export async function FinalCTA({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const problems = t<string[]>('finalCta.problems');
  return (
    <section
      id="cta"
      style={{
        position: 'relative',
        paddingBlock: 140,
        overflow: 'hidden',
        borderTop: '1px solid var(--line-soft)',
        background:
          'radial-gradient(900px 600px at 80% 45%, var(--accent-bg), transparent 60%),' +
          'radial-gradient(700px 500px at 0% 50%, var(--accent-bg), transparent 60%),' +
          'linear-gradient(180deg, var(--bg-2), var(--bg))',
      }}
    >
      <div aria-hidden className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      <div className="container" style={{ position: 'relative' }}>
        <div className="r-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }}>
          <div className="reveal">
            <span className="eyebrow">{t('finalCta.eyebrow')}</span>
            <h2 className="h-display" style={{ margin: '16px 0 24px', fontSize: 'clamp(38px, 5.4vw, 72px)' }}>
              {t('finalCta.headPre')}
              <em className="serif" style={{ color: 'var(--accent)' }}>
                {t('finalCta.headEm')}
              </em>
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {problems.map((p, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 14, alignItems: 'start', fontSize: 17, color: 'var(--fg-2)' }}>
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
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a className="btn btn-primary" href="#agendar" style={{ fontSize: 16, padding: '15px 22px' }}>
                {t('finalCta.cta')}
                <svg width="16" height="16" viewBox="0 0 14 14">
                  <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            <p className="mono" style={{ marginTop: 18, fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>
              {t('finalCta.note')}
            </p>
          </div>

          <div id="agendar" className="reveal" style={{ ['--reveal-delay' as string]: '120ms', scrollMarginTop: 90 }}>
            <DemoCalendar />
          </div>
        </div>
      </div>
    </section>
  );
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const legalCol = t<{ h: string; privacy: string; terms: string }>('footer.legalLinks');
  const resourcesCol = t<{ h: string } & Record<string, string>>('footer.resources');
  const comparativasCol = t<{ h: string } & Record<string, string>>('footer.comparativas');
  const loc = locale as Locale;
  const recursoLinks = GUIDES.filter((g) => g.group === 'recurso').map((g) => ({
    label: resourcesCol[g.key],
    href: `/${locale}/${localizedSlug(g.key, loc)}`,
  }));
  const comparativaLinks = GUIDES.filter((g) => g.group === 'comparativa').map((g) => ({
    label: comparativasCol[g.key],
    href: `/${locale}/${localizedSlug(g.key, loc)}`,
  }));
  // Columna de producto: el hub más las cuatro áreas. Reutiliza el contenido de
  // `product` en vez de duplicar etiquetas en `footer`.
  const productCol = t<ProductSummary>('product');
  // Solo el hub y las áreas de mayor prioridad: con las ocho, la columna del
  // footer sería más larga que el resto y se comería la rejilla.
  const FOOTER_AREAS = PRODUCTS.filter((p) => p.priority >= 0.9);
  const productLinks = [
    { label: productCol.labels.areasTitle, href: productHubPath(loc) },
    ...FOOTER_AREAS.map((p) => ({
      label: productCol.areas[p.key].card.title,
      href: productPath(p.key, loc),
    })),
  ];
  const zonasCol = t<{ h: string } & Record<string, string>>('footer.zonas');
  // Under /en/ the consolidated geo pages (Tenerife, Gran Canaria) fold into
  // Canarias, so we don't surface them as separate links.
  const zonaLinks = GUIDES.filter((g) => g.group === 'geo' && (loc === 'es' || hasEnPage(g.key))).map((g) => ({
    label: zonasCol[g.key],
    href: `/${locale}/${localizedSlug(g.key, loc)}`,
  }));

  return (
    <footer style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 80, paddingBottom: 36, background: 'oklch(0.11 0.018 240)' }}>
      <div className="container">
        <div className="r-split" style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(5, 1fr)', gap: 32, marginBottom: 56 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 16 }}>
              <Image src="/assets/solnow-wordmark-white.webp" alt={t('metadata.siteName')} width={104} height={26} style={{ height: 26, width: 'auto' }} />
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: '36ch', margin: 0 }}>
              {t('footer.tagline')}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
              <LocaleSelect locale={locale} label={t('footer.langLabel')} />
            </div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--muted-2)', marginBottom: 14 }}>
              {productCol.labels.breadcrumbProduct.toUpperCase()}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="footer-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--muted-2)', marginBottom: 14 }}>
              {resourcesCol.h.toUpperCase()}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recursoLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="footer-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--muted-2)', marginBottom: 14 }}>
              {comparativasCol.h.toUpperCase()}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {comparativaLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="footer-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--muted-2)', marginBottom: 14 }}>
              {zonasCol.h.toUpperCase()}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {zonaLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="footer-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--muted-2)', marginBottom: 14 }}>
              {legalCol.h.toUpperCase()}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: legalCol.privacy, href: `/${locale}/privacy` },
                { label: legalCol.terms, href: `/${locale}/terms` },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="footer-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 28,
            borderTop: '1px solid var(--line-soft)',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', letterSpacing: '0.04em' }}>
            {t('footer.legal')}
          </div>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="live-dot" />
            {t('footer.status')}
          </div>
        </div>
      </div>
    </footer>
  );
}
