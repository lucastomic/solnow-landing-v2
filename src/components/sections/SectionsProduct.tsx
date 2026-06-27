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

export function ProductAreas() {
  const t = useT();
  const tabs = t<{ n: string; t: string; s: string; core?: boolean }[]>('productAreas.tabs');
  const coreTag = t('productAreas.coreTag');
  return (
    <section id="producto" className="section" style={{ paddingTop: 60 }}>
      <div className="container">
        <SectionHead eyebrow={t('productAreas.eyebrow')} title={<>{t('productAreas.title')}</>} />
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
          {tabs.map(({ n, t: label, s, core }, i) => (
            <a
              key={n}
              href={`#area-${i + 1}`}
              style={{
                background: core ? 'var(--accent-bg)' : 'var(--bg)',
                padding: '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                transition: 'background .2s ease',
                borderBottom: core ? '2px solid var(--accent)' : '2px solid transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = core ? 'var(--accent-bg)' : 'var(--surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = core ? 'var(--accent-bg)' : 'var(--bg)')}
            >
              <span style={{ color: core ? 'var(--accent)' : 'var(--muted-2)' }}>
                {n}
                {core && ` · ${coreTag}`}
              </span>
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

        <WalkInArea />
        <div className="rule-faint" style={{ margin: '100px 0' }} />
        <OnlineArea />
      </div>

      <OpsArea />

      <div className="container">
        <div className="rule-faint" style={{ margin: '0 0 100px' }} />
        <DataArea />
      </div>
    </section>
  );
}

// ── 5.1 Mostrador / walk-in self-service — el núcleo ───────────────────
function WalkInArea() {
  const t = useT();
  return (
    <div id="area-1" className="r-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
      <div className="reveal">
        <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em' }}>5.1</span>
        <h3 className="h-2" style={{ margin: '16px 0 18px' }}>{t('productAreas.walkin.h')}</h3>
        <BulletList items={t<string[]>('productAreas.walkin.bullets')} />
      </div>
      <div className="reveal" style={{ ['--reveal-delay' as string]: '140ms' }}>
        <WalkInFlow />
      </div>
    </div>
  );
}

// Three-step walk-in flow: TPV → QR → signed contract
function WalkInFlow() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {['TPV · mostrador', 'QR generado', 'Contrato firmado'].map((label, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 8,
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              letterSpacing: '0.04em',
              background: step === i ? 'var(--accent)' : 'var(--surface-2)',
              color: step === i ? 'var(--accent-fg)' : 'var(--muted)',
              border: '1px solid ' + (step === i ? 'var(--accent)' : 'var(--line-soft)'),
              transition: 'all .3s ease',
            }}
          >
            <span style={{ opacity: 0.7 }}>{String(i + 1)}</span> · {label}
          </div>
        ))}
      </div>

      <WindowChrome title="solnow.app  /  mostrador" status={step === 2 ? 'FIRMADO' : 'EN CURSO'}>
        <div style={{ padding: 18, minHeight: 360, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {step === 0 && <TPVStep />}
          {step === 1 && <QRStep />}
          {step === 2 && <SignedStep />}
        </div>
      </WindowChrome>

      <div
        style={{
          position: 'absolute',
          bottom: -18,
          right: 18,
          background: 'var(--accent)',
          color: 'var(--accent-fg)',
          padding: '8px 14px',
          borderRadius: 999,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.02em',
          boxShadow: '0 12px 28px -10px var(--accent)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        <span className="live-dot" style={{ background: '#fff' }} />
        firmado en 14s
      </div>
    </div>
  );
}

function TPVStep() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 280,
          padding: 20,
          borderRadius: 14,
          background: 'var(--ink)',
          color: 'var(--ink-fg)',
          border: '1px solid var(--ink-line)',
        }}
      >
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>TPV · MARINAJETS DENIA</div>
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', margin: '10px 0 4px' }}>260,00 €</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-muted-2)' }}>Yamaha VX ×2 · 16:00–17:00</div>
        <div
          style={{
            marginTop: 16,
            padding: '10px',
            borderRadius: 8,
            background: 'rgba(31,157,107,0.18)',
            border: '1px solid rgba(31,157,107,0.4)',
            color: '#7fe0b3',
            fontSize: 12.5,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <span>✓</span> Pago aprobado · Visa ****4291
        </div>
      </div>
      <p className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0 }}>Venta cargada en 6 segundos →</p>
    </div>
  );
}

function QRStep() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, justifyContent: 'center' }}>
      <div style={{ width: 130, height: 130, borderRadius: 12, padding: 10, background: '#fff', boxShadow: '0 12px 30px -10px rgba(8,57,84,0.3)' }}>
        <QRPattern />
      </div>
      <div style={{ maxWidth: 200 }}>
        <div className="chip chip-accent" style={{ marginBottom: 10 }}>ESCANEA PARA CONTINUAR</div>
        <h4 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 500, letterSpacing: '-0.014em' }}>El cliente completa todo desde su móvil</h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
          Datos, documento, firma del contrato y consentimientos — sin papeles, sin frenar la cola.
        </p>
      </div>
    </div>
  );
}

function SignedStep() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          background: 'oklch(0.97 0.004 80)',
          color: 'oklch(0.20 0.01 240)',
          borderRadius: 12,
          padding: '20px 22px',
          boxShadow: '0 20px 40px -20px rgba(8,57,84,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
          <div>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'oklch(0.50 0 0)' }}>CONTRATO DE ALQUILER</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>MarinaJets · #C-2026-0847</div>
          </div>
          <div className="chip" style={{ background: 'rgba(31,157,107,0.15)', borderColor: 'rgba(31,157,107,0.45)', color: '#0f6e4a' }}>✓ FIRMADO</div>
        </div>
        <div style={{ height: 1, background: 'oklch(0 0 0 / 0.1)', marginBottom: 12 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11.5 }}>
          <div>
            <span style={{ color: 'oklch(0.50 0 0)' }}>Arrendatario</span>
            <br />
            <strong>Markus Klein</strong>
          </div>
          <div>
            <span style={{ color: 'oklch(0.50 0 0)' }}>Firma</span>
            <br />
            <strong>14 may · 9:42:18</strong>
          </div>
        </div>
        <div style={{ borderTop: '1px dashed oklch(0 0 0 / 0.2)', marginTop: 12, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <svg width="110" height="30" viewBox="0 0 120 36">
            <path d="M2 28 C 14 6, 22 30, 32 14 S 56 30, 68 12 S 92 28, 110 8" stroke="oklch(0.25 0.05 240)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
          <span className="mono" style={{ fontSize: 9, color: 'oklch(0.50 0 0)', textAlign: 'right' }}>
            eIDAS · SHA-256
            <br />
            0x8f3a…b4e1
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['pagado', 'datos', 'firmado', 'libro de registros'].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              fontSize: 9.5,
              padding: '5px 4px',
              borderRadius: 4,
              textAlign: 'center',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              background: 'var(--accent-bg)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-dim)',
            }}
          >
            ✓ {s}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 5.2 Venta online: motor de reservas + agente IA ────────────────────
function OnlineArea() {
  const t = useT();
  return (
    <div id="area-2" className="r-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
      <div className="reveal" style={{ order: 2 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em' }}>5.2</span>
        <h3 className="h-2" style={{ margin: '16px 0 18px' }}>{t('productAreas.online.h')}</h3>
        {/* <p className="lede" style={{ marginBottom: 28 }}>{t('productAreas.online.lede')}</p> */}
        <BulletList items={t<string[]>('productAreas.online.bullets')} />
      </div>
      <div className="reveal" style={{ ['--reveal-delay' as string]: '140ms', order: 1 }}>
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
        t: 'Sin licencia perfecto, va con instructor en base. Combustible incluido para 1h. Te paso link de pago y firmas contrato en línea 👇',
      },
      { from: 'us', t: '🔗 solnow.app/pay/3F8K2  ·  260€  ·  Yamaha VX ×2  ·  16:00–17:00', kind: 'card' },
      { from: 'them', t: 'Paid ✅' },
      {
        from: 'us',
        t: 'Reserva confirmada 🛥️ Te esperamos a las 15:45 en Marina Denia, muelle 4. Lleva DNI/pasaporte. ¡Hasta mañana!',
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
    const showTyping = setTimeout(() => setTyping(true), 0);
    const advance = setTimeout(() => {
      setTyping(false);
      setN((v) => v + 1);
    }, next.from === 'us' ? 1800 : 1200);
    return () => {
      clearTimeout(showTyping);
      clearTimeout(advance);
    };
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
            <div style={{ fontSize: 13.5, fontWeight: 500, color: '#ffffff' }}>MarinaJets · Reservas</div>
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
          <div style={{ flex: 1, padding: '8px 12px', background: '#105477', borderRadius: 999, fontSize: 12, color: '#8aa9bf' }}>Mensaje</div>
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

// ── 5.3 Operación en tiempo real — full bleed ──────────────────────────
function OpsArea() {
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
        <div className="reveal" style={{ maxWidth: 1500, marginBottom: 56 }}>
          <span className="eyebrow chip-accent" style={{ padding: '5px 11px' }}>
            {t('productAreas.ops.eyebrow')}
          </span>
          <h3 className="h-1" style={{ margin: '20px 0 18px', color: '#ffffff' }}>
            {t('productAreas.ops.hPre')}
            <em className="serif" style={{ color: '#7ec3e8' }}>
              {t('productAreas.ops.hEm')}
            </em>
            {t('productAreas.ops.hPost')}
          </h3>
      
        </div>

        <div className="r-split" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          <div className="reveal r-hide">
            <LiveOpsMock />
          </div>
          <div className="reveal" style={{ ['--reveal-delay' as string]: '120ms', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <QRMock />
            <DelayToast />
            <BulletList color="#ffffff" items={t<string[]>('productAreas.ops.bullets')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveOpsMock() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((x) => (x + 1) % 1000), 1000);
    return () => clearInterval(id);
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
            {cells.map((c, i) => (c.on ? <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="#062a3e" /> : null))}
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
        <div className="mono" style={{ fontSize: 10.5, color: '#c4d6e3', letterSpacing: '0.04em' }}>Base Denia · alerta automática · hace 38s</div>
      </div>
      <button style={{ fontSize: 11, padding: '5px 9px', borderRadius: 6, border: '1px solid rgba(220,110,90,0.6)', color: '#ffd5cc' }}>ABRIR</button>
    </div>
  );
}

function QRPattern() {
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
    <svg viewBox="0 0 12 12" width="100%" height="100%" style={{ shapeRendering: 'crispEdges' }}>
      {cells.map((c, i) => (c.on ? <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="#062a3e" /> : null))}
    </svg>
  );
}

// ── 5.4 Datos unificados — el valor que más pesa ───────────────────────
function DataArea() {
  const t = useT();
  return (
    <div id="area-4" className="r-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
      <div className="reveal">
        <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em' }}>{t('productAreas.data.label')}</span>
        <h3 className="h-2" style={{ margin: '16px 0 18px' }}>{t('productAreas.data.h')}</h3>
        <BulletList items={t<string[]>('productAreas.data.bullets')} />
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
    <WindowChrome title="dashboard · datos unificados · multi-base" status="3 BASES">
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Agrupadas', 'Denia', 'Jávea', 'Calpe'].map((b, i) => (
            <div
              key={b}
              style={{
                flex: i === 0 ? '0 0 auto' : 1,
                padding: '6px 12px',
                borderRadius: 7,
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: '0.04em',
                textAlign: 'center',
                background: i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                color: i === 0 ? 'var(--accent-fg)' : 'var(--ink-fg-2)',
                border: '1px solid ' + (i === 0 ? 'var(--accent)' : 'var(--ink-line)'),
              }}
            >
              {b}
            </div>
          ))}
        </div>

        <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--ink-line)', background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>INGRESOS POR FUENTE</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-fg)', letterSpacing: '-0.02em' }}>€ 184k</span>
          </div>
          {(
            [
              ['Walk-in / mostrador', 84, 'var(--accent)'],
              ['Web', 11, 'var(--accent-2)'],
              ['OTAs', 5, '#5d7e94'],
            ] as [string, number, string][]
          ).map(([label, pct, c]) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 34px', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-fg-2)' }}>{label}</span>
              <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: c, borderRadius: 999 }} />
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-fg-2)', textAlign: 'right' }}>{pct}%</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {(
            [
              ['TOP PRODUCTO', 'VIP Mediterránea', '€ 52k'],
              ['COLAB · SALDO', 'Náutica Sur', '€ 1.240'],
            ] as [string, string, string][]
          ).map(([k, v, num]) => (
            <div key={k} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ink-line)' }}>
              <div className="mono" style={{ fontSize: 9.5, color: 'var(--ink-muted-2)', letterSpacing: '0.08em' }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-fg)', marginTop: 4, letterSpacing: '-0.01em' }}>{v}</div>
              <div className="mono" style={{ fontSize: 12, color: '#7fe0b3', marginTop: 2 }}>{num}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, borderRadius: 10, border: '1px solid var(--ink-line)', background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>RESERVAS / DÍA · 14 DÍAS</span>
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
                  <circle key={i} cx={pad + (i / (data.length - 1)) * (w - pad * 2)} cy={h - pad - (v / max) * (h - pad * 2)} r="3" fill="var(--accent)" />
                )
            )}
          </svg>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
            {['✓ libro de registros', '✓ reseñas 4.87/5', '✓ repiten 38%'].map((s) => (
              <span key={s} className="mono" style={{ fontSize: 10.5, color: 'var(--ink-muted-2)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}
