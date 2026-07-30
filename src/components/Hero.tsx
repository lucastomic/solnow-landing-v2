import type { Locale } from '@/i18n/config';
import { getT } from '@/i18n/dictionaries';
import HeroMockup from './HeroMockup';

interface HeroProps {
  locale: Locale;
  variant?: 'a' | 'b';
}

export default async function Hero({ locale, variant = 'a' }: HeroProps) {
  const t = await getT(locale);
  const headlines = {
    a: {
      h1: (
        <>
          {t('hero.a.pre')}
          <em className="serif" style={{ color: 'var(--accent)' }}>
            {t('hero.a.em')}
          </em>
          {t('hero.a.post')}
        </>
      ),
      sub: t('hero.a.sub'),
    },
    b: {
      h1: (
        <>
          {t('hero.b.pre')}
          <em className="serif">{t('hero.b.em')}</em>
          {t('hero.b.post')}
        </>
      ),
      sub: t('hero.b.sub'),
    },
  };
  const c = headlines[variant] || headlines.a;

  return (
    <section id="top" style={{ position: 'relative', paddingTop: 116, paddingBottom: 64, overflow: 'hidden' }}>
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
            alignItems: 'center',
          }}
        >
          <div className="hero-rise">
            <h1 className="h-display" style={{ marginTop: 0, marginBottom: 24 }}>{c.h1}</h1>
            <p className="lede" style={{ maxWidth: '52ch', marginBottom: 36 }}>{c.sub}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
              <a className="btn btn-primary" href="#cta">
                {t('hero.ctaPrimary')}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="btn btn-secondary" href="#producto">
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M3 2v8l7-4z" fill="currentColor" />
                </svg>
                {t('hero.ctaSecondary')}
              </a>
            </div>
          </div>

          <div className="hero-rise r-fluid" style={{ ['--reveal-delay' as string]: '120ms', position: 'relative' }}>
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
