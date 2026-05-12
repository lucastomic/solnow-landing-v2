'use client';
import { SectionHead } from '../atoms';

export function Pillars() {
  const pillars = [
    {
      n: '01',
      h: 'Cobertura operativa real',
      s: 'Antes + durante + después. No solo reservas.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="22" cy="22" r="20" />
          <circle cx="22" cy="22" r="13" opacity="0.55" />
          <circle cx="22" cy="22" r="6" opacity="0.3" />
          <circle cx="22" cy="22" r="2" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      n: '02',
      h: 'Vertical específico jet ski',
      s: 'Construido para alto volumen multi-base desde cero.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M2 32h40M2 26h40M2 20h40" opacity="0.4" />
          <path d="M6 12 L22 4 L38 12" />
          <circle cx="22" cy="14" r="2" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      n: '03',
      h: 'IA nativa integrada',
      s: 'Cierra ventas en WhatsApp, no responde FAQs.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="6" y="6" width="32" height="32" rx="6" />
          <path d="M14 24 L20 30 L32 16" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead
          eyebrow="05 · Defendibilidad"
          title={<>Tres pilares que no se replican por separado</>}
          lede="Por qué ningún competidor puede copiar las tres cosas a la vez sin reescribir su producto desde cero."
        />
        <div
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
                minHeight: 280,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span style={{ color: 'var(--accent)' }}>{p.icon}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.1em' }}>{p.n}</span>
              </div>
              <h3 className="h-3" style={{ marginTop: 12, fontSize: 22, letterSpacing: '-0.018em' }}>{p.h}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 15, margin: 0 }}>{p.s}</p>
            </div>
          ))}
        </div>
        <div
          className="reveal"
          style={{
            marginTop: 32,
            padding: '20px 26px',
            border: '1px solid var(--line-soft)',
            borderRadius: 12,
            background: 'oklch(1 0 0 / 0.02)',
            fontSize: 15,
            color: 'var(--fg-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 26, color: 'var(--accent)', lineHeight: 1 }}>"</span>
          Quitar cualquiera de los tres debilita los otros dos. Por eso el combo es lo defendible, no las piezas separadas.
        </div>
      </div>
    </section>
  );
}

export function ForWhom() {
  const yes = [
    'Operás 10+ motos de agua',
    'Tenés 2+ bases físicas',
    'Gestionás 30+ reservas/día en temporada alta',
    'Recibís alto volumen de consultas por WhatsApp',
    'Ya probaste software genérico o Excel y no escala',
  ];
  const no = [
    'Tenés una flota chica que gestionás con calendario',
    'Hacés charter con tripulación',
    'Operás catamaranes de tours compartidos',
    'Sos broker sin flota propia',
    'Hacés excursiones organizadas con guía',
  ];
  return (
    <section id="para-quien" className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead
          eyebrow="06 · Para quién"
          title={<>Si entrás en este perfil, te ahorrás la demo basura</>}
          lede="Solnow está construido para un cliente muy específico. Te decimos antes de la llamada si tu negocio encaja."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <Qualifier kind="yes" title="Solnow es para vos si:" items={yes} />
          <Qualifier kind="no" title="Solnow no es para vos si:" items={no} />
        </div>

        <div
          className="reveal"
          style={{
            marginTop: 28,
            padding: '28px 32px',
            border: '1px solid var(--line-soft)',
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--accent-bg), transparent)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'oklch(1 0 0 / 0.04)',
              border: '1px solid var(--line-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--accent)" strokeWidth="1.4">
              <circle cx="9" cy="14" r="4" />
              <circle cx="19" cy="14" r="4" />
              <path d="M9 18 L19 18 M14 6 L14 10" />
            </svg>
          </div>
          <div>
            <div className="h-3" style={{ marginBottom: 6, fontSize: 18 }}>¿Y si tengo flota mixta?</div>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14.5, maxWidth: '64ch' }}>
              Solnow funciona para operadores donde las motos de agua son el activo principal pero también ofrecen quads, kayaks,
              paddle o parasailing. El sistema gestiona toda la flota como un único inventario.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Qualifier({ kind, title, items }: { kind: 'yes' | 'no'; title: string; items: string[] }) {
  const isYes = kind === 'yes';
  return (
    <div
      className="reveal"
      style={{
        padding: 32,
        borderRadius: 18,
        border: '1px solid ' + (isYes ? 'var(--accent-dim)' : 'var(--line-soft)'),
        background: isYes ? 'linear-gradient(180deg, var(--accent-bg), oklch(1 0 0 / 0.02))' : 'oklch(1 0 0 / 0.015)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 className="h-3" style={{ fontSize: 20, color: isYes ? 'var(--fg)' : 'var(--fg-2)' }}>{title}</h3>
        <span className="mono" style={{ fontSize: 11, color: isYes ? 'var(--accent)' : 'var(--muted-2)', letterSpacing: '0.08em' }}>
          {isYes ? '✓ MATCH' : '✗ SKIP'}
        </span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
        {items.map((it, i) => (
          <li
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '22px 1fr',
              gap: 12,
              padding: '13px 0',
              borderTop: '1px solid var(--line-soft)',
              color: isYes ? 'var(--fg)' : 'var(--muted)',
              fontSize: 15,
              textDecoration: isYes ? 'none' : 'line-through',
              textDecorationColor: 'oklch(0.40 0.01 240)',
            }}
          >
            <span style={{ color: isYes ? 'var(--accent)' : 'var(--muted-2)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
              {isYes ? '✓' : '✕'}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
          eyebrow="07 · Comparativa"
          title={<>Las comparaciones que el prospect ya está haciendo en su cabeza</>}
        />
        <div
          className="reveal"
          style={{
            border: '1px solid var(--line)',
            borderRadius: 18,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, oklch(0.18 0.022 240), oklch(0.15 0.020 240))',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr repeat(4, 1fr)',
              background: 'oklch(0 0 0 / 0.2)',
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
                      color: 'oklch(0.12 0.02 240)',
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
              onMouseEnter={(e) => (e.currentTarget.style.background = 'oklch(1 0 0 / 0.015)')}
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
          eyebrow="08 · Modelo de partner"
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
