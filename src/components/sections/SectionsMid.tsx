'use client';
import { SectionHead } from '../atoms';
import { useT } from '@/i18n/I18nProvider';

export function Pillars() {
  const t = useT();
  const pillars = t<{ n: string; h: string; s: string }[]>('pillars.items');
  const icons = [
    <svg key="0" width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="6" y="4" width="32" height="36" rx="4" />
      <path d="M14 13h16 M14 21h16 M14 29h10" />
      <path d="M27 33 L30 36 L36 28" stroke="currentColor" strokeWidth="1.8" />
    </svg>,
    <svg key="1" width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M22 6 L34 12 V24 C34 32 28 37 22 39 C16 37 10 32 10 24 V12 Z" />
      <path d="M16 22 L20 26 L29 16" strokeWidth="1.8" />
    </svg>,
    <svg key="2" width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 28 C 9 20, 15 20, 22 28 S 35 36, 42 28" />
      <path d="M2 18 C 9 10, 15 10, 22 18 S 35 26, 42 18" opacity="0.5" />
      <circle cx="22" cy="23" r="2.4" fill="currentColor" stroke="none" />
    </svg>,
  ];
  const pilarLabel = t('pillars.pilarLabel');

  return (
    <section id="pilares" className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead
          eyebrow={t('pillars.eyebrow')}
          title={
            <>
              {t('pillars.titlePre')}
              <em className="serif" style={{ color: 'var(--accent)' }}>{t('pillars.titleEm')}</em>
            </>
          }
        />
        <div
          className="r-cols-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            background: 'var(--line-soft)',
            borderRadius: 18,
            overflow: 'hidden',
            border: '1px solid var(--line-soft)',
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={p.n}
              className="reveal"
              style={{
                ['--reveal-delay' as string]: `${i * 80}ms`,
                background: 'var(--bg)',
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                minHeight: 220,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span style={{ color: 'var(--accent)' }}>{icons[i]}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.1em' }}>
                  {pilarLabel} {p.n}
                </span>
              </div>
              <h3 className="h-3" style={{ marginTop: 12, fontSize: 21, letterSpacing: '-0.018em', lineHeight: 1.2 }}>
                {p.h}
              </h3>
              {/* <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: 0, lineHeight: 1.55 }}>{p.s}</p> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Comparison() {
  const t = useT();
  const colKeys = ['gen', 'h2o', 'own', 'sol'] as const;
  const colDefs = t<{ name: string; sub: string }[]>('comparison.cols');
  const cols = colKeys.map((k, i) => ({
    k,
    name: colDefs[i].name,
    sub: colDefs[i].sub,
    highlight: k === 'sol',
  }));
  const rowLabels = t<string[]>('comparison.rowLabels');
  const ttp = t<string[]>('comparison.timeToProd');
  const rowValues: (number | string)[][] = [
    [1, 1, 0.5, 1],
    [0, 0.5, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0.5, 1],
    [0.5, 0.5, 0, 1],
    [0.5, 0, 0, 1],
    [0, 0.5, 0, 1],
    [ttp[0], ttp[1], ttp[2], ttp[3]],
  ];
  const rows = rowLabels.map(
    (label, i) =>
      [label, ...rowValues[i]] as [
        string,
        number | string,
        number | string,
        number | string,
        number | string
      ]
  );

  const cell = (v: number | string, isLast: boolean) => {
    if (typeof v === 'string') {
      return (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: isLast ? 'var(--accent)' : 'var(--muted)', letterSpacing: '0.02em' }}>
          {v}
        </span>
      );
    }
    if (v === 1) return <span style={{ color: isLast ? 'var(--accent)' : 'var(--ok)', fontSize: 18 }}>●</span>;
    if (v === 0.5) return <span style={{ color: 'var(--warn)', fontSize: 14 }}>◐</span>;
    return <span style={{ color: 'var(--muted-2)', fontSize: 18, opacity: 0.6 }}>○</span>;
  };

  return (
    <section id="comparativa" className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead
          eyebrow={t('comparison.eyebrow')}
          title={<>{t('comparison.title')}</>}
        />
        <div
          className="reveal r-cmp-wrap"
          style={{
            border: '1px solid var(--line)',
            borderRadius: 18,
            overflow: 'hidden',
            background: 'var(--bg-2)',
          }}
        >
          <div
            className="r-cmp-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr repeat(4, 1fr)',
              background: 'var(--bg)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div style={{ padding: '20px 24px' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted-2)' }}>{t('comparison.capability').toUpperCase()}</div>
            </div>
            {cols.map((c) => (
              <div
                key={c.k}
                style={{
                  padding: '20px 18px',
                  background: c.highlight ? 'var(--accent-bg)' : 'transparent',
                  borderLeft: '1px solid var(--line-soft)',
                  position: 'relative',
                }}
              >
                {c.highlight && (
                  <span
                    className="mono"
                    style={{
                      position: 'absolute',
                      top: -1,
                      right: 14,
                      transform: 'translateY(-50%)',
                      fontSize: 9.5,
                      letterSpacing: '0.1em',
                      color: 'var(--accent-fg)',
                      background: 'var(--accent)',
                      padding: '3px 7px',
                      borderRadius: 4,
                    }}
                  >
                    {t('comparison.us').toUpperCase()}
                  </span>
                )}
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: c.highlight ? 'var(--accent)' : 'var(--fg-2)',
                    letterSpacing: '-0.012em',
                  }}
                >
                  {c.name}
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted-2)', marginTop: 4, letterSpacing: '0.04em' }}>
                  {c.sub}
                </div>
              </div>
            ))}
          </div>
          {rows.map((r, i) => (
            <div
              key={i}
              className="r-cmp-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr repeat(4, 1fr)',
                borderBottom: i < rows.length - 1 ? '1px solid var(--line-soft)' : 0,
                transition: 'background .2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--line-soft)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ padding: '18px 24px', fontSize: 14.5, color: 'var(--fg-2)' }}>{r[0]}</div>
              {(r.slice(1) as (number | string)[]).map((v, j) => (
                <div
                  key={j}
                  style={{
                    padding: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: j === 3 ? 'var(--accent-bg)' : 'transparent',
                    borderLeft: '1px solid var(--line-soft)',
                  }}
                >
                  {cell(v, j === 3)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="reveal" style={{ marginTop: 32, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--ok)', fontSize: 14 }}>●</span> {t('comparison.legendIncluded')}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--warn)' }}>◐</span> {t('comparison.legendPartial')}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--muted-2)' }}>○</span> {t('comparison.legendNo')}
            </span>
          </div>
          <span style={{ flex: 1 }} />
          <p className="serif" style={{ margin: 0, fontSize: 19, color: 'var(--fg-2)', maxWidth: '54ch' }}>
            {t('comparison.closing')}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Partner() {
  const t = useT();
  const items = t<{ pull: string; h: string; s: string }[]>('partner.items');
  return (
    <section className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead
          eyebrow={t('partner.eyebrow')}
          title={<>{t('partner.title')}</>}
        />
        <div className="r-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {items.map((it, i) => (
            <div
              key={i}
              className="reveal card"
              style={{
                ['--reveal-delay' as string]: `${i * 80}ms`,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  color: 'var(--accent)',
                  lineHeight: 1,
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                }}
              >
                {it.pull}
              </div>
              <h3 className="h-3" style={{ fontSize: 19 }}>{it.h}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: 0, flex: 1 }}>{it.s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
