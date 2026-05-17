'use client';
import { useState, useEffect, useMemo } from 'react';
import { WindowChrome } from './atoms';

interface HeroProps {
  variant?: 'a' | 'b';
}

export default function Hero({ variant = 'a' }: HeroProps) {
  const headlines = {
    a: {
      h1: (
        <>
          El sistema operativo de las empresas de motos de agua con{' '}
          <em className="serif" style={{ color: 'var(--accent)' }}>
            alto volumen
          </em>
        </>
      ),
      sub: 'Digitalizamos venta, papeleo, operación en tiempo real y postventa. Para operadores con flotas que ya no escalan con sistemas genéricos.',
    },
    b: {
      h1: (
        <>
          Tu flota crece. Tu software te <em className="serif">frena</em>.
        </>
      ),
      sub: 'Solnow es el sistema operativo que reemplaza Excel, calendarios y cuatro herramientas inconexas con una única plataforma diseñada para alto volumen multi-base.',
    },
  };
  const c = headlines[variant] || headlines.a;

  return (
    <section id="top" style={{ position: 'relative', paddingTop: 140, paddingBottom: 80, overflow: 'hidden' }}>
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
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <div className="reveal">
            <h1 className="h-display" style={{ marginTop: 0, marginBottom: 24 }}>{c.h1}</h1>
            <p className="lede" style={{ maxWidth: '56ch', marginBottom: 36 }}>{c.sub}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
              <a className="btn btn-primary" href="#cta">
                Pedir demo personalizada
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="btn btn-secondary" href="#producto">
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M3 2v8l7-4z" fill="currentColor" />
                </svg>
                Ver cómo funciona
              </a>
            </div>

      
          </div>

          <div className="reveal" style={{ ['--reveal-delay' as string]: '120ms', position: 'relative' }}>
            <FleetDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}

function FleetDashboard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const fleet = useMemo(
    () => [
      { id: 'JET-01', base: 'Denia', status: 'on-water', timer: '+0:42:18', rider: 'M. Torres' },
      { id: 'JET-02', base: 'Denia', status: 'on-water', timer: '+1:08:55', rider: 'L. Pérez' },
      { id: 'JET-03', base: 'Jávea', status: 'returning', timer: '+0:56:02', rider: 'A. Klein' },
      { id: 'JET-04', base: 'Denia', status: 'late', timer: '+12 min', rider: 'R. Smith' },
      { id: 'JET-05', base: 'Calpe', status: 'ready', timer: 'Próx. 15:30', rider: 'B. Foster' },
      { id: 'JET-06', base: 'Jávea', status: 'maint', timer: '—', rider: '—' },
    ],
    []
  );

  type StatusKey = 'on-water' | 'returning' | 'late' | 'ready' | 'maint';
  const tones: Record<StatusKey, { c: string; label: string }> = {
    'on-water': { c: 'var(--accent)', label: 'en agua' },
    returning: { c: 'var(--info)', label: 'regresando' },
    late: { c: 'var(--danger)', label: 'retraso' },
    ready: { c: 'var(--ok)', label: 'lista' },
    maint: { c: 'var(--muted)', label: 'mantto' },
  };

  return (
    <WindowChrome title="solnow.app  /  ops · multi-base" status="EN VIVO">
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {(
            [
              ['EN AGUA', '11', 'de 18'],
              ['HOY', '42', 'reservas'],
              ['INGRESOS', '€ 6.840', 'D −2'],
              ['ALERTAS', '1', 'activa'],
            ] as [string, string, string][]
          ).map(([k, v, s], i) => (
            <div
              key={k}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: i === 3 ? 'rgba(200,74,58,0.18)' : 'rgba(255,255,255,0.04)',
                border: '1px solid ' + (i === 3 ? 'rgba(220,110,90,0.45)' : 'var(--ink-line)'),
              }}
            >
              <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--ink-muted)' }}>{k}</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginTop: 2,
                  color: i === 3 ? '#ffb4a3' : 'var(--ink-fg)',
                }}
              >
                {v}
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-muted-2)', marginTop: 1 }}>{s}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            height: 110,
            borderRadius: 10,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--ink-line)',
            background: 'radial-gradient(120% 100% at 50% 100%, #0e527a 0%, #0a3f5d 60%, #062a3e 100%)',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(transparent 49%, rgba(255,255,255,0.06) 50%, transparent 51%),' +
                'linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.06) 50%, transparent 51%)',
              backgroundSize: '36px 36px',
              maskImage: 'linear-gradient(180deg, transparent, black 40%, black 90%, transparent)',
            }}
          />
          {['Denia 24%', 'Jávea 38%', 'Calpe 18%', 'Altea 20%'].map((b, i) => (
            <div
              key={b}
              style={{
                position: 'absolute',
                top: 10 + (i % 2) * 14,
                left: 24 + i * 22 + '%',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.04em',
                color: 'var(--ink-fg-2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--accent-2)' : 'rgba(255,255,255,0.35)',
                  boxShadow: i === 0 ? '0 0 10px var(--accent)' : 'none',
                }}
              />
              {b}
            </div>
          ))}
          {(
            [
              [18, 70],
              [32, 78],
              [46, 64],
              [58, 84],
              [70, 70],
              [82, 78],
            ] as [number, number][]
          ).map(([x, y], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x + '%',
                top: y + '%',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i === 3 ? 'var(--danger)' : 'var(--accent)',
                boxShadow: i === 3 ? '0 0 8px var(--danger)' : '0 0 6px var(--accent)',
                transform: 'translate(-50%, -50%)',
                animation: i === 3 ? 'pulse-dot 1.4s infinite' : 'none',
              }}
            />
          ))}
        </div>

        <div style={{ borderRadius: 10, border: '1px solid var(--ink-line)', overflow: 'hidden' }}>
          <div
            className="mono"
            style={{
              display: 'grid',
              gridTemplateColumns: '74px 1fr 80px 96px 24px',
              gap: 10,
              padding: '8px 12px',
              fontSize: 10,
              letterSpacing: '0.08em',
              color: 'var(--ink-muted-2)',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid var(--ink-line)',
            }}
          >
            <span>ID</span>
            <span>BASE / PILOTO</span>
            <span>ESTADO</span>
            <span>TIEMPO</span>
            <span></span>
          </div>
          {fleet.map((f, i) => {
            const isLate = f.status === 'late';
            const tone = tones[f.status as StatusKey];
            return (
              <div
                key={f.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '74px 1fr 80px 96px 24px',
                  gap: 10,
                  padding: '11px 12px',
                  alignItems: 'center',
                  borderBottom: i < fleet.length - 1 ? '1px solid var(--ink-line-2)' : 0,
                  background: isLate ? 'rgba(200,74,58,0.10)' : 'transparent',
                  fontSize: 12.5,
                }}
              >
                <span className="mono" style={{ color: 'var(--ink-fg-2)' }}>{f.id}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ color: 'var(--ink-fg)' }}>{f.base}</span>
                  <span style={{ color: 'var(--ink-muted-2)', fontSize: 11 }}>{f.rider}</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: tone.c }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: tone.c,
                      boxShadow: isLate ? '0 0 6px ' + tone.c : 'none',
                    }}
                  />
                  <span style={{ fontSize: 11.5 }}>{tone.label}</span>
                </span>
                <span className="mono" style={{ color: 'var(--ink-fg-2)', fontSize: 11.5 }}>{f.timer}</span>
                <span style={{ color: 'var(--ink-muted)', fontSize: 14, justifySelf: 'end' }}>›</span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(200,74,58,0.20)',
            border: '1px solid rgba(220,110,90,0.55)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'pulse-dot 2.5s infinite',
          }}
        >
          <span style={{ fontSize: 16 }}>⚠</span>
          <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-fg)' }}>
            <strong style={{ fontWeight: 600 }}>JET-04</strong> con 12 min de retraso · Base Denia
            <span className="mono" style={{ color: 'var(--ink-muted)', marginLeft: 8, fontSize: 11 }}>hace 1m</span>
          </div>
          <button
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              letterSpacing: '0.06em',
              color: 'var(--ink-fg-2)',
              padding: '4px 8px',
              border: '1px solid var(--ink-line)',
              borderRadius: 6,
            }}
          >
            VER
          </button>
        </div>
      </div>
    </WindowChrome>
  );
}
