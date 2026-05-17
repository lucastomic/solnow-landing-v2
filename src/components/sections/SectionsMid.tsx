'use client';
import { SectionHead } from '../atoms';

export function Comparison() {
  const cols = [
    { k: 'gen', name: 'Motores genéricos', sub: 'FareHarbor · Bookeo' },
    { k: 'h2o', name: 'Software watersports', sub: 'verticales near-water' },
    { k: 'own', name: 'Solución propia con IA', sub: 'build-it-yourself' },
    { k: 'sol', name: 'Solnow', sub: 'sistema operativo completo', highlight: true },
  ];
  const rows: [string, number | string, number | string, number | string, number | string][] = [
    ['Motor de reservas', 1, 1, 0.5, 1],
    ['Vertical jet ski', 0, 0.5, 0, 1],
    ['Operación en tiempo real (QR + dashboard)', 0, 0, 0, 1],
    ['IA conversacional que cierra ventas', 0, 0, 0.5, 1],
    ['Integraciones OTAs náuticas', 0.5, 0.5, 0, 1],
    ['Cumplimiento legal del sector', 0.5, 0, 0, 1],
    ['Soporte en temporada alta', 0, 0.5, 0, 1],
    ['Tiempo a producción', 'Semanas', 'Semanas', '6–12 meses', 'Días'],
  ];

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
          eyebrow="05 · Comparativa"
          title={<>Cómo nos comparamos con las otras opciones que estás evaluando</>}
        />
        <div
          className="reveal"
          style={{
            border: '1px solid var(--line)',
            borderRadius: 18,
            overflow: 'hidden',
            background: 'var(--bg-2)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr repeat(4, 1fr)',
              background: 'var(--bg)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div style={{ padding: '20px 24px' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted-2)' }}>CAPACIDAD</div>
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
                    NOSOTROS
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
              <span style={{ color: 'var(--ok)', fontSize: 14 }}>●</span> incluido
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--warn)' }}>◐</span> parcial
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--muted-2)' }}>○</span> no
            </span>
          </div>
          <span style={{ flex: 1 }} />
          <p className="serif" style={{ margin: 0, fontSize: 19, color: 'var(--fg-2)', maxWidth: '54ch' }}>
            Construir desde cero tiene sentido si tu producto es tu diferencial. Si tu diferencial es operar motos en el agua,
            cada mes que dedicás a programar es un mes que no escalás.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Partner() {
  const items = [
    {
      h: 'Incentivos alineados',
      s: 'Cobramos un % sobre las reservas que generamos + coste por conversación de IA. Sin cuota fija. Si no facturás, no cobramos.',
      pull: '0% cuota fija',
    },
    {
      h: 'Delegación total de lo digital',
      s: 'Web, sistema, IA, configuración, optimización. Tú operás motos, nosotros operamos tu negocio digital.',
      pull: '95% del trabajo',
    },
    {
      h: 'Soporte como partner, no como proveedor',
      s: 'Capacitación completa, carga de activos, ayuda con precios y fotos, disponibilidad real en temporada alta.',
      pull: 'Sin tickets',
    },
  ];
  return (
    <section className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead
          eyebrow="06 · Modelo de partner"
          title={<>No somos un proveedor. Somos un partner que cobra cuando vos facturás.</>}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
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
