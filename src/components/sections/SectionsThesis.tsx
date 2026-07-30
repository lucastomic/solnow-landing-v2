import { getT } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

// ─── Why now: the self-service megatrend ──────────────────────────────
export async function WhyNow({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const steps = t<{ sector: string; from: string; to: string }[]>('whyNow.ladder');

  const icons = [
    <svg key="bank" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 8 L10 3 L18 8 M3 8v8 M7 8v8 M13 8v8 M17 8v8 M2 17h16" />
    </svg>,
    <svg key="cart" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 3h2l2 10h9l2-7H5" />
      <circle cx="8" cy="17" r="1.2" />
      <circle cx="15" cy="17" r="1.2" />
    </svg>,
    <svg key="fork" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M5 2v6a2 2 0 0 0 4 0V2 M7 8v10 M14 2c-1.5 0-2 2-2 4s.5 4 2 4v8" />
    </svg>,
    <svg key="wave" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 4-2 M2 12c2-2 4-2 6 0s4 2 6 0 4-2 4-2" />
    </svg>,
  ];

  return (
    <section
      id="por-que-ahora"
      className="section"
      style={{
        paddingBlock: 120,
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(900px 500px at 85% 10%, rgba(74,144,192,0.16), transparent 70%),' +
          'linear-gradient(180deg, #0a3f5d, #062a3e)',
        borderBlock: '1px solid rgba(255,255,255,0.06)',
        color: 'var(--ink-fg)',
      }}
    >
      <div aria-hidden className="dotgrid-ink" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      <div className="container" style={{ position: 'relative' }}>
        <div className="reveal" style={{ maxWidth: 820, marginBottom: 56 }}>
          <span className="eyebrow chip-accent" style={{ padding: '5px 11px' }}>{t('whyNow.eyebrow')}</span>
          <h2 className="h-1" style={{ margin: '20px 0 0', color: '#ffffff' }}>
            {t('whyNow.title')}
          </h2>
        </div>

        <div className="why-ladder r-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {steps.map((step, i) => {
            const active = i === steps.length - 1;
            return (
              <div
                key={step.sector}
                className="reveal"
                style={{
                  ['--reveal-delay' as string]: `${i * 100}ms`,
                  position: 'relative',
                  padding: 24,
                  borderRadius: 16,
                  background: active
                    ? 'linear-gradient(180deg, var(--accent), var(--accent-dim))'
                    : 'rgba(255,255,255,0.04)',
                  border: '1px solid ' + (active ? 'transparent' : 'rgba(255,255,255,0.10)'),
                  boxShadow: active ? '0 24px 50px -20px rgba(16,102,149,0.6)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  minHeight: 210,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    background: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid ' + (active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  {icons[i]}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10.5,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: active ? 'rgba(255,255,255,0.75)' : 'var(--ink-muted)',
                      marginBottom: 8,
                    }}
                  >
                    {step.sector}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 13.5,
                        color: active ? 'rgba(255,255,255,0.7)' : 'var(--ink-muted-2)',
                        textDecoration: 'line-through',
                        textDecorationColor: active ? 'rgba(255,255,255,0.4)' : 'var(--ink-muted-2)',
                      }}
                    >
                      {step.from}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
                        <path
                          d="M3 6h6M6.5 3 9.5 6l-3 3"
                          stroke={active ? '#fff' : 'var(--accent-2)'}
                          strokeWidth="1.4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.012em', color: '#ffffff' }}>
                        {step.to}
                      </span>
                    </span>
                  </div>
                </div>

                {active && (
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.08em',
                      color: 'rgba(255,255,255,0.85)',
                      borderTop: '1px solid rgba(255,255,255,0.2)',
                      paddingTop: 12,
                    }}
                  >
                    {t('whyNow.youAreHere')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
