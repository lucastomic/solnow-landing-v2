'use client';
import { useState, CSSProperties } from 'react';
import { useT } from '@/i18n/I18nProvider';

interface HeroProps {
  variant?: 'a' | 'b';
}

export default function Hero({ variant = 'a' }: HeroProps) {
  const t = useT();
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
          <div className="reveal">
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

          <div className="reveal r-fluid" style={{ ['--reveal-delay' as string]: '120ms', position: 'relative' }}>
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMockup() {
  const [date, setDate] = useState(17);
  const [time, setTime] = useState('13:00');

  return (
    <div
      style={{
        position: 'relative',
        paddingTop: 32,
        paddingRight: 22,
        paddingBottom: 36,
        paddingLeft: 38,
      }}
    >
      <div
        className="mono"
        style={{
          position: 'absolute',
          top: 6,
          right: 24,
          fontSize: 11,
          color: 'var(--muted)',
          letterSpacing: '0.06em',
        }}
      >
        9:41 · solnow.app
      </div>

      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 3.1',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 30px 80px -20px rgba(8,57,84,0.4), 0 0 0 1px var(--line)',
        }}
      >
        <SunsetScene />
      </div>

      <NotificationCard />
      <BookingCard date={date} setDate={setDate} time={time} setTime={setTime} />
    </div>
  );
}

function SunsetScene() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <img
        src="/assets/hero-jetski.png"
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(70% 70% at 50% 50%, transparent 55%, rgba(6,30,52,0.35) 100%),' +
            'linear-gradient(180deg, transparent 60%, rgba(6,30,52,0.25) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function NotificationCard() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 56,
        right: -8,
        width: 312,
        padding: 14,
        borderRadius: 16,
        background: 'linear-gradient(180deg, rgba(8,42,68,0.62), rgba(8,42,68,0.48))',
        backdropFilter: 'blur(18px) saturate(140%)',
        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 20px 50px -16px rgba(8,57,84,0.4), 0 0 0 1px rgba(0,0,0,0.04) inset',
        display: 'grid',
        gridTemplateColumns: '36px 1fr',
        gap: 12,
        color: '#fff',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-2), var(--accent))',
          border: '1.5px solid rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        S
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em' }}>
            Banana Jetski · Reservas
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>9:41</div>
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#fff',
            marginTop: 4,
            lineHeight: 1.45,
            letterSpacing: '-0.005em',
          }}
        >
          ¡Hola Sara! Tu reserva del 17 está confirmada. Completá tu check-in{' '}
          <a
            href="#"
            style={{
              color: 'var(--accent-2)',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(74,144,192,0.5)',
              textUnderlineOffset: 3,
            }}
          >
            aquí ›
          </a>
        </div>
      </div>
    </div>
  );
}

interface BookingCardProps {
  date: number;
  setDate: (d: number) => void;
  time: string;
  setTime: (t: string) => void;
}

function BookingCard({ date, setDate, time, setTime }: BookingCardProps) {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const cells: { d: number; off?: boolean }[] = [
    { d: 28, off: true }, { d: 29, off: true }, { d: 30, off: true },
    { d: 1 }, { d: 2 }, { d: 3 }, { d: 4 },
    { d: 5 }, { d: 6 }, { d: 7 }, { d: 8 }, { d: 9 }, { d: 10 }, { d: 11 },
    { d: 12 }, { d: 13 }, { d: 14 }, { d: 15 }, { d: 16 }, { d: 17 }, { d: 18 },
    { d: 19 }, { d: 20 }, { d: 21 }, { d: 22 }, { d: 23 }, { d: 24 }, { d: 25 },
    { d: 26 }, { d: 27 }, { d: 28 }, { d: 29 }, { d: 30 }, { d: 31 }, { d: 1, off: true },
  ];
  const times = ['10:00', '13:00', '15:00', '16:30', '18:00'];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: -24,
        left: -22,
        width: 304,
        padding: '18px 18px 18px',
        borderRadius: 18,
        background: 'linear-gradient(180deg, rgba(8,42,68,0.66), rgba(8,42,68,0.52))',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 30px 70px -20px rgba(8,57,84,0.5), 0 0 0 1px rgba(0,0,0,0.04) inset',
        color: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>
            EXPERIENCIA
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2, letterSpacing: '-0.01em' }}>VIP Mediterránea</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={chevBtn}>‹</button>
          <button style={chevBtn}>›</button>
        </div>
      </div>

      <div
        className="mono"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 2,
          marginBottom: 6,
          fontSize: 10,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.55)',
          textAlign: 'center',
        }}
      >
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 16 }}>
        {cells.map((cell, i) => {
          const isSelected = !cell.off && cell.d === date;
          return (
            <button
              key={i}
              onClick={() => !cell.off && setDate(cell.d)}
              style={{
                fontFamily: 'var(--font-mono)',
                aspectRatio: '1 / 1',
                fontSize: 11.5,
                borderRadius: '50%',
                background: isSelected ? 'var(--accent)' : 'transparent',
                color: cell.off ? 'rgba(255,255,255,0.25)' : isSelected ? '#fff' : 'rgba(255,255,255,0.85)',
                fontWeight: isSelected ? 500 : 400,
                cursor: cell.off ? 'default' : 'pointer',
                border: 'none',
                boxShadow: isSelected ? '0 4px 12px rgba(16,102,149,0.5)' : 'none',
                transition: 'background .15s ease',
              }}
            >
              {cell.d}
            </button>
          );
        })}
      </div>

      <div
        className="mono"
        style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', marginBottom: 8 }}
      >
        SELECCIONÁ HORA
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {times.map((tm) => {
          const active = tm === time;
          return (
            <button
              key={tm}
              onClick={() => setTime(tm)}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.02em',
                background: active ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                color: active ? '#fff' : 'rgba(255,255,255,0.85)',
                border: '1px solid ' + (active ? 'var(--accent)' : 'rgba(255,255,255,0.18)'),
                boxShadow: active ? '0 4px 10px rgba(16,102,149,0.4)' : 'none',
                cursor: 'pointer',
                transition: 'background .15s ease',
              }}
            >
              {tm}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const chevBtn: CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 8,
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'rgba(255,255,255,0.85)',
  fontSize: 14,
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};
