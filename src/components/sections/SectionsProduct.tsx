'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { SectionHead, BulletList, WindowChrome, NumLabel } from '../atoms';
import { useT } from '@/i18n/I18nProvider';

export function PainBar() {
  const t = useT();
  const bullets = t<{ k: string; u: string; d: string }[]>('painBar.items');
  return (
    <section className="section" style={{ paddingBlock: 100 }}>
      <div className="container">
        <div className="reveal" style={{ maxWidth: 980, marginBottom: 56 }}>
          <h2 className="h-1" style={{ marginBottom: 0 }}>
            {t('painBar.headPre')}
            <span style={{ color: 'var(--muted)' }}>{t('painBar.headEm')}</span>
          </h2>
        </div>
        <div
          className="r-cols-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            border: '1px solid var(--line-soft)',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--line-soft)',
          }}
        >
          {bullets.map((b, i) => (
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
              <NumLabel n={i + 1} of={3} />
              <div
                style={{
                  fontSize: 56,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  fontWeight: 500,
                  color: 'var(--accent)',
                  marginTop: 8,
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
      </div>
    </section>
  );
}

export function Nuclear() {
  const t = useT();
  return (
    <section className="section" style={{ paddingBlock: 140 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <span className="eyebrow">{t('nuclear.eyebrow')}</span>
          <p
            className="h-display"
            style={{
              margin: 0,
              fontSize: 'clamp(36px, 4.8vw, 64px)',
              lineHeight: 1.06,
              letterSpacing: '-0.028em',
              fontWeight: 400,
              color: 'var(--fg-2)',
            }}
          >
            {t('nuclear.p1')}<span className="serif" style={{ color: 'var(--muted)' }}>{t('nuclear.reservar')}</span>{' '}
            <br />
            {t('nuclear.p2')}<span style={{ color: 'var(--fg)' }}>{t('nuclear.vender')}</span>{' '}
            <span style={{ color: 'var(--muted)' }}>{t('nuclear.ya')}</span>{' '}
            <span style={{ color: 'var(--accent)' }}>{t('nuclear.operar')}</span>
          </p>
          <p className="lede" style={{ maxWidth: '68ch', color: 'var(--muted)', fontSize: 18 }}>
            {t('nuclear.lede')}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProductAreas() {
  const t = useT();
  const tabs = t<{ n: string; t: string; s: string }[]>('productAreas.tabs');
  return (
    <section id="producto" className="section" style={{ paddingTop: 60 }}>
      <div className="container">
        <SectionHead
          eyebrow={t('productAreas.eyebrow')}
          title={<>{t('productAreas.title')}</>}
          lede={t('productAreas.lede')}
        />
        <div
          className="mono r-cols-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: 'var(--line-soft)',
            borderRadius: 12,
            overflow: 'hidden',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 80,
          }}
        >
          {tabs.map(({ n, t: label, s }, i) => (
            <a
              key={n}
              href={`#area-${i + 1}`}
              style={{
                background: 'var(--bg)',
                padding: '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                transition: 'background .2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg)')}
            >
              <span style={{ color: 'var(--muted-2)' }}>{n}</span>
              <span
                style={{
                  color: 'var(--fg)',
                  fontSize: 14,
                  textTransform: 'none',
                  letterSpacing: '-0.01em',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  color: 'var(--muted)',
                  textTransform: 'none',
                  letterSpacing: '0',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12.5,
                }}
              >
                {s}
              </span>
            </a>
          ))}
        </div>

        <Area1 />
        <div className="rule-faint" style={{ margin: '100px 0' }} />
        <Area2 />
        <div className="rule-faint" style={{ margin: '100px 0 0' }} />
      </div>

      <Area3 />

      <div className="container">
        <div className="rule-faint" style={{ margin: '0 0 100px' }} />
        <Area4 />
      </div>
    </section>
  );
}

function Area1() {
  const t = useT();
  return (
    <div id="area-1" className="r-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
      <div className="reveal">
        <NumLabel n={1} of={4} />
        <h3 className="h-2" style={{ margin: '16px 0 18px' }}>
          {t('productAreas.area1.h')}
        </h3>
        <p className="lede" style={{ marginBottom: 28 }}>
          {t('productAreas.area1.lede')}
        </p>
        <BulletList items={t<string[]>('productAreas.area1.bullets')} />
      </div>
      <div className="reveal" style={{ ['--reveal-delay' as string]: '140ms' }}>
        <WhatsAppMock />
      </div>
    </div>
  );
}

function WhatsAppMock() {
  const script = useMemo(
    () => [
      { from: 'them', t: 'Hi! Looking to rent 2 jet skis tomorrow afternoon in Denia. Any availability?' },
      {
        from: 'us',
        t: '¡Hola! 👋 Sí, te confirmo: mañana 14 de mayo tenemos 2 Yamaha VX disponibles a las 16:00 (1h). 130€ c/u. ¿Necesitan licencia o sin licencia?',
      },
      { from: 'them', t: 'No license. Is fuel included?' },
      {
        from: 'us',
        t: 'Sin licencia perfecto, va con instructor en base. Combustible incluido para 1h. Te paso link de pago y firmás contrato en línea 👇',
      },
      { from: 'us', t: '🔗 solnow.app/pay/3F8K2  ·  260€  ·  Yamaha VX ×2  ·  16:00–17:00', kind: 'card' },
      { from: 'them', t: 'Paid ✅' },
      {
        from: 'us',
        t: 'Reserva confirmada 🛥️ Te esperamos a las 15:45 en Marina Denia, muelle 4. Llevá DNI/pasaporte. ¡Hasta mañana!',
        kind: 'final',
      },
    ],
    []
  );

  const [n, setN] = useState(1);
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (n >= script.length) {
      const r = setTimeout(() => setN(1), 6000);
      return () => clearTimeout(r);
    }
    const next = script[n];
    setTyping(true);
    const t = setTimeout(() => {
      setTyping(false);
      setN(n + 1);
    }, next.from === 'us' ? 1800 : 1200);
    return () => clearTimeout(t);
  }, [n, script]);

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [n, typing]);

  return (
    <div
      className="r-fluid"
      style={{
        borderRadius: 28,
        background: '#062a3e',
        border: '1px solid #062a3e',
        boxShadow: '0 40px 100px -30px rgba(8,57,84,0.45), 0 0 0 8px rgba(8,57,84,0.06)',
        padding: 10,
        maxWidth: 380,
        marginLeft: 'auto',
      }}
    >
      <div style={{ borderRadius: 22, overflow: 'hidden', background: '#0a3f5d', height: 600, display: 'flex', flexDirection: 'column' }}>
        <div
          className="mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px 6px',
            fontSize: 11,
            color: '#ffffff',
            opacity: 0.85,
          }}
        >
          <span>9:41</span>
          <span style={{ display: 'inline-flex', gap: 4 }}>●●●● 5G ◐</span>
        </div>
        <div
          style={{
            padding: '8px 14px',
            background: '#0e527a',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <button style={{ color: '#c4d6e3', fontSize: 18 }}>‹</button>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4A90C0, #106695)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              color: '#ffffff',
            }}
          >
            S
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: '#ffffff' }}>Jetski · Reservas</div>
            <div style={{ fontSize: 11, color: '#7fe0b3', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="live-dot" style={{ width: 5, height: 5 }} />
              agente IA · responde en &lt; 30s
            </div>
          </div>
          <span style={{ color: '#c4d6e3' }}>⋮</span>
        </div>
        <div
          ref={scrollerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            background: 'linear-gradient(180deg, #08344e, #062a3e)',
          }}
        >
          {script.slice(0, n).map((m, i) => (
            <Bubble key={i} from={m.from} t={m.t} kind={m.kind} />
          ))}
          {typing && n < script.length && script[n].from === 'us' && <TypingBubble />}
        </div>
        <div
          style={{
            padding: '10px 12px',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            background: '#0e527a',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{ flex: 1, padding: '8px 12px', background: '#105477', borderRadius: 999, fontSize: 12, color: '#8aa9bf' }}
          >
            Mensaje
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#4A90C0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            ›
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, t, kind }: { from: string; t: string; kind?: string }) {
  const us = from === 'us';
  if (kind === 'card') {
    return (
      <div style={{ alignSelf: 'flex-end', maxWidth: '86%' }}>
        <div
          style={{
            padding: 10,
            borderRadius: 14,
            borderBottomRightRadius: 4,
            background: '#105477',
            border: '1px solid #4A90C0',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div className="mono" style={{ fontSize: 10, color: '#7ec3e8', letterSpacing: '0.06em' }}>PAGO · STRIPE</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>260€ · Yamaha VX ×2</div>
          <div className="mono" style={{ fontSize: 11, color: '#8aa9bf' }}>16:00–17:00 · 14 may</div>
          <div
            style={{
              padding: '6px 10px',
              background: '#4A90C0',
              color: '#ffffff',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              textAlign: 'center',
              marginTop: 2,
            }}
          >
            Pagar →
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        alignSelf: us ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
        padding: '8px 12px',
        borderRadius: 14,
        borderBottomRightRadius: us ? 4 : 14,
        borderBottomLeftRadius: us ? 14 : 4,
        background: us ? '#106695' : '#0e527a',
        color: '#ffffff',
        fontSize: 13.5,
        lineHeight: 1.42,
        boxShadow: '0 1px 0 rgba(0,0,0,0.2)',
      }}
    >
      {t}
      {kind === 'final' && (
        <div className="mono" style={{ marginTop: 6, fontSize: 10, color: '#7ec3e8', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <span>✓✓</span> 9:42
        </div>
      )}
    </div>
  );
}

function TypingBubble() {
  return (
    <div
      style={{
        alignSelf: 'flex-end',
        padding: '8px 14px',
        borderRadius: 14,
        borderBottomRightRadius: 4,
        background: '#106695',
        display: 'inline-flex',
        gap: 4,
        alignItems: 'center',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#cfe7f5',
            animation: `pulse-dot 1.2s ${i * 0.15}s infinite`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

function Area2() {
  const t = useT();
  return (
    <div id="area-2" className="r-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
      <div className="reveal" style={{ order: 2 }}>
        <NumLabel n={2} of={4} />
        <h3 className="h-2" style={{ margin: '16px 0 18px' }}>
          {t('productAreas.area2.h')}
        </h3>
        <p className="lede" style={{ marginBottom: 28 }}>
          {t('productAreas.area2.lede')}
        </p>
        <BulletList items={t<string[]>('productAreas.area2.bullets')} />
      </div>
      <div className="reveal" style={{ ['--reveal-delay' as string]: '120ms', order: 1 }}>
        <ContractMock />
      </div>
    </div>
  );
}

function ContractMock() {
  return (
    <div className="r-contract" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          background: 'oklch(0.96 0.005 80)',
          color: 'oklch(0.18 0.01 240)',
          borderRadius: 12,
          padding: '22px 24px',
          boxShadow: '0 30px 60px -25px rgba(8,57,84,0.35), 0 0 0 1px rgba(8,57,84,0.08)',
          transform: 'rotate(-1.2deg)',
          maxWidth: 380,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 14 }}>
          <div>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'oklch(0.50 0 0)' }}>CONTRATO DE ALQUILER</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>Banana Jetski SL · #C-2026-0847</div>
          </div>
          <div
            className="chip"
            style={{ background: 'rgba(31,157,107,0.15)', borderColor: 'rgba(31,157,107,0.45)', color: '#0f6e4a' }}
          >
            FIRMADO
          </div>
        </div>
        <div style={{ height: 1, background: 'oklch(0 0 0 / 0.1)', marginBottom: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 11.5, marginBottom: 14 }}>
          <div>
            <span style={{ color: 'oklch(0.50 0 0)' }}>Arrendatario</span>
            <br />
            <strong>Markus Klein</strong>
          </div>
          <div>
            <span style={{ color: 'oklch(0.50 0 0)' }}>Fecha</span>
            <br />
            <strong>14 may 2026</strong>
          </div>
          <div>
            <span style={{ color: 'oklch(0.50 0 0)' }}>Embarcación</span>
            <br />
            <strong>Yamaha VX · JET-03</strong>
          </div>
          <div>
            <span style={{ color: 'oklch(0.50 0 0)' }}>Duración</span>
            <br />
            <strong>16:00 – 17:00</strong>
          </div>
        </div>
        <div
          style={{
            borderTop: '1px dashed oklch(0 0 0 / 0.2)',
            paddingTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
          }}
        >
          <div>
            <svg width="120" height="36" viewBox="0 0 120 36">
              <path
                d="M2 28 C 14 6, 22 30, 32 14 S 56 30, 68 12 S 92 28, 110 8"
                stroke="oklch(0.25 0.05 240)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <div className="mono" style={{ fontSize: 9, color: 'oklch(0.50 0 0)', marginTop: 4 }}>FIRMA · 9:42:18</div>
          </div>
          <div className="mono" style={{ fontSize: 9, color: 'oklch(0.50 0 0)', textAlign: 'right' }}>
            SHA-256
            <br />
            0x8f3a…b4e1
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: 16,
          transform: 'translateX(20%) rotate(1.5deg)',
          maxWidth: 280,
          marginLeft: 'auto',
          marginTop: -40,
          boxShadow: '0 20px 50px -20px rgba(8,57,84,0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em' }}>FACTURA</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ok)' }}>#F-2026-1402</div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>260,00 €</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>IVA incluido · pagado vía Stripe</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['enviada', 'firmada', 'cobrada'].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                fontSize: 9.5,
                padding: '4px 6px',
                borderRadius: 4,
                textAlign: 'center',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.06em',
                background: 'rgba(31,157,107,0.12)',
                color: '#0f6e4a',
                border: '1px solid rgba(31,157,107,0.35)',
              }}
            >
              ✓ {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Area3() {
  const t = useT();
  return (
    <div
      id="area-3"
      style={{
        position: 'relative',
        marginTop: 120,
        marginBottom: 100,
        paddingBlock: 110,
        background:
          'radial-gradient(900px 500px at 80% 30%, rgba(74,144,192,0.18), transparent 70%),' +
          'radial-gradient(700px 500px at 10% 80%, rgba(16,102,149,0.16), transparent 70%),' +
          'linear-gradient(180deg, #0a3f5d, #062a3e)',
        borderBlock: '1px solid rgba(255,255,255,0.06)',
        color: 'var(--ink-fg)',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden className="dotgrid-ink" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
      <div className="container" style={{ position: 'relative' }}>
        <div className="reveal" style={{ maxWidth: 880, marginBottom: 56 }}>
          <span className="eyebrow chip-accent" style={{ padding: '5px 11px' }}>
            {t('productAreas.area3.eyebrow')}
          </span>
          <h3 className="h-1" style={{ margin: '20px 0 18px', color: '#ffffff' }}>
            {t('productAreas.area3.hPre')}
            <em className="serif" style={{ color: '#7ec3e8' }}>
              {t('productAreas.area3.hEm')}
            </em>
            {t('productAreas.area3.hPost')}
          </h3>
          <p className="lede" style={{ color: '#c4d6e3' }}>
            {t('productAreas.area3.ledePre')}
            <strong style={{ color: '#ffffff' }}>{t('productAreas.area3.ledeStrong')}</strong>
            {t('productAreas.area3.ledePost')}
          </p>
        </div>

        <div className="r-split" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          <div className="reveal r-hide">
            <LiveOpsMock />
          </div>
          <div className="reveal" style={{ ['--reveal-delay' as string]: '120ms', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <QRMock />
            <DelayToast />
            <BulletList color="#ffffff" items={t<string[]>('productAreas.area3.bullets')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveOpsMock() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => (x + 1) % 1000), 1000);
    return () => clearInterval(t);
  }, []);

  const bases = [
    { name: 'Denia', onWater: 5, ready: 2, late: 1, color: 'var(--accent)' },
    { name: 'Jávea', onWater: 4, ready: 3, late: 0, color: 'var(--info)' },
    { name: 'Calpe', onWater: 2, ready: 4, late: 0, color: 'var(--warn)' },
  ];

  return (
    <WindowChrome title="ops.solnow.app  /  multi-base" status="LIVE">
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {bases.map((b) => (
            <div
              key={b.name}
              style={{
                padding: 14,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--ink-line)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: b.color, boxShadow: `0 0 8px ${b.color}` }} />
                  <span style={{ fontWeight: 500 }}>{b.name}</span>
                </div>
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{tick % 60}s</span>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 2 }}>
                <Stat label="agua" v={b.onWater} c="var(--accent)" />
                <Stat label="listas" v={b.ready} c="var(--ok)" />
                <Stat label="retraso" v={b.late} c={b.late ? 'var(--danger)' : 'var(--muted-2)'} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderRadius: 10, border: '1px solid var(--ink-line)', overflow: 'hidden' }}>
          <div
            className="mono"
            style={{
              padding: '8px 12px',
              fontSize: 10,
              letterSpacing: '0.08em',
              color: 'var(--ink-muted-2)',
              borderBottom: '1px solid var(--ink-line)',
              background: 'rgba(255,255,255,0.03)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>REGISTRO EN VIVO</span>
            <span>auto-refresh · 1s</span>
          </div>
          {[
            { t: '15:32', who: 'JET-07 · Jávea', ev: 'Embarque registrado (QR)', c: 'var(--ok)' },
            { t: '15:30', who: 'JET-02 · Denia', ev: 'Pago confirmado · 195€', c: 'var(--accent)' },
            { t: '15:28', who: 'JET-04 · Denia', ev: 'Retraso detectado · +12 min', c: 'var(--danger)' },
            { t: '15:24', who: 'JET-09 · Calpe', ev: 'Devolución · 47L combustible', c: 'var(--muted)' },
            { t: '15:21', who: 'JET-03 · Jávea', ev: 'Salida confirmada', c: 'var(--ok)' },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px 1.4fr 1.6fr 14px',
                gap: 12,
                padding: '10px 12px',
                fontSize: 12.5,
                alignItems: 'center',
                borderBottom: i < 4 ? '1px solid var(--ink-line-2)' : 0,
                background: i === 2 ? 'rgba(200,74,58,0.10)' : 'transparent',
              }}
            >
              <span className="mono" style={{ color: 'var(--ink-muted-2)', fontSize: 11 }}>{r.t}</span>
              <span style={{ color: 'var(--ink-fg-2)' }}>{r.who}</span>
              <span style={{ color: r.c, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: r.c }} />
                {r.ev}
              </span>
              <span style={{ color: 'var(--ink-muted-2)' }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </WindowChrome>
  );
}

function Stat({ label, v, c }: { label: string; v: number; c: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 18, fontWeight: 600, color: c, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{v}</span>
      <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

function QRMock() {
  const cells = useMemo(() => {
    const out: { x: number; y: number; on: boolean }[] = [];
    const seed = 7;
    for (let y = 0; y < 12; y++)
      for (let x = 0; x < 12; x++) {
        const corner = (x < 3 && y < 3) || (x > 8 && y < 3) || (x < 3 && y > 8);
        const r = Math.sin((x + 1) * 12.9898 + (y + 1) * 78.233 + seed) * 43758.5453;
        const on = corner ? !((x === 1 || x === 10) && y === 1) : r - Math.floor(r) > 0.55;
        out.push({ x, y, on });
      }
    return out;
  }, []);

  return (
    <WindowChrome title="embarque · QR check-in">
      <div style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            position: 'relative',
            width: 96,
            height: 96,
            borderRadius: 10,
            background: '#ffffff',
            padding: 8,
            overflow: 'hidden',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.4)',
          }}
        >
          <svg viewBox="0 0 12 12" width="100%" height="100%" style={{ shapeRendering: 'crispEdges' }}>
            {cells.map((c, i) =>
              c.on ? <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="#062a3e" /> : null
            )}
          </svg>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '-2px',
              height: 2,
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              boxShadow: '0 0 10px var(--accent)',
              animation: 'qrscan 1.6s ease-in-out infinite',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 10, color: '#7ec3e8', letterSpacing: '0.08em' }}>✓ EMBARCADO</div>
          <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4, color: '#ffffff' }}>Markus Klein · JET-03</div>
          <div style={{ fontSize: 12, color: '#c4d6e3' }}>Jávea · sal. 16:00 · ret. 17:00</div>
          <div className="mono" style={{ fontSize: 10.5, color: '#8aa9bf', marginTop: 6 }}>OK · DNI · seguro · combustible 50L</div>
        </div>
      </div>
    </WindowChrome>
  );
}

function DelayToast() {
  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: 12,
        background: 'rgba(200,74,58,0.20)',
        border: '1px solid rgba(220,110,90,0.6)',
        display: 'grid',
        gridTemplateColumns: '28px 1fr auto',
        gap: 12,
        alignItems: 'center',
        boxShadow: '0 10px 30px -10px rgba(200,74,58,0.25)',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: 'rgba(220,110,90,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffd5cc',
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        ⚠
      </span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#ffffff' }}>Moto JET-04 con 12 min de retraso</div>
        <div className="mono" style={{ fontSize: 10.5, color: '#c4d6e3', letterSpacing: '0.04em' }}>
          Base Denia · alerta automática · hace 38s
        </div>
      </div>
      <button
        style={{ fontSize: 11, padding: '5px 9px', borderRadius: 6, border: '1px solid rgba(220,110,90,0.6)', color: '#ffd5cc' }}
      >
        ABRIR
      </button>
    </div>
  );
}

function Area4() {
  const t = useT();
  return (
    <div id="area-4" className="r-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
      <div className="reveal">
        <NumLabel n={4} of={4} />
        <h3 className="h-2" style={{ margin: '16px 0 18px' }}>
          {t('productAreas.area4.h')}
        </h3>
        <p className="lede" style={{ marginBottom: 28 }}>
          {t('productAreas.area4.lede')}
        </p>
        <BulletList items={t<string[]>('productAreas.area4.bullets')} />
      </div>
      <div className="reveal" style={{ ['--reveal-delay' as string]: '120ms' }}>
        <MetricsMock />
      </div>
    </div>
  );
}

function MetricsMock() {
  const data = [12, 18, 14, 22, 19, 28, 31, 26, 34, 38, 32, 42, 39, 47];
  const max = Math.max(...data);
  const w = 360,
    h = 70,
    pad = 4;
  const pts = data
    .map((v, i) => `${pad + (i / (data.length - 1)) * (w - pad * 2)},${h - pad - (v / max) * (h - pad * 2)}`)
    .join(' ');

  return (
    <WindowChrome title="postventa · métricas del negocio">
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {(
            [
              ['RESERVAS', '1.247', '+22%', 'mes'],
              ['INGRESOS', '€ 184k', '+31%', 'mes'],
              ['RESEÑAS', '4.87', '/ 5', '328 últ.'],
              ['REPITEN', '38%', '+9 pts', 'YoY'],
            ] as [string, string, string, string][]
          ).map(([k, v, d, s]) => (
            <div key={k} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ink-line)' }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-muted-2)', letterSpacing: '0.1em' }}>{k}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-fg)' }}>{v}</span>
                <span className="mono" style={{ fontSize: 11, color: '#7fe0b3' }}>{d}</span>
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-muted-2)' }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, borderRadius: 10, border: '1px solid var(--ink-line)', background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>
              RESERVAS / DÍA · 14 DÍAS
            </span>
            <span className="mono" style={{ fontSize: 10.5, color: '#7fe0b3' }}>↑ tendencia</span>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points={`${pad},${h - pad} ${pts} ${w - pad},${h - pad}`} fill="url(#spark)" />
            <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
            {data.map(
              (v, i) =>
                i === data.length - 1 && (
                  <circle
                    key={i}
                    cx={pad + (i / (data.length - 1)) * (w - pad * 2)}
                    cy={h - pad - (v / max) * (h - pad * 2)}
                    r="3"
                    fill="var(--accent)"
                  />
                )
            )}
          </svg>
        </div>

        <div style={{ padding: 12, borderRadius: 10, border: '1px solid var(--ink-line)', background: 'rgba(255,255,255,0.04)' }}>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-muted)', marginBottom: 8 }}>
            ÚLTIMAS RESEÑAS · GOOGLE / TRIPADVISOR
          </div>
          {[
            ['M. Klein · 5★', 'All booked via WhatsApp in 2 minutes…'],
            ['L. Bianchi · 5★', 'Servizio impeccabile, dal primo messaggio…'],
          ].map(([who, t], i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '6px 0',
                fontSize: 12,
                borderTop: i ? '1px solid var(--ink-line-2)' : 'none',
              }}
            >
              <span style={{ color: 'var(--ink-fg-2)' }}>{who}</span>
              <span style={{ color: 'var(--ink-muted)', textAlign: 'right', flex: 1 }}>"{t}"</span>
            </div>
          ))}
        </div>
      </div>
    </WindowChrome>
  );
}
