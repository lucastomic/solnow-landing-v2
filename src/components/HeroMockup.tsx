'use client';
import { useState, CSSProperties } from 'react';
import Image from 'next/image';

/**
 * Maqueta interactiva del hero: la única parte cliente de la sección.
 *
 * Vive en su propio fichero para que `Hero` pueda ser Server Component — el
 * copy no tiene estado y no tiene por qué hidratarse. El calendario y la
 * franja horaria sí son interactivos, y son lo que justifica el JS.
 */
export default function HeroMockup() {
  const [date, setDate] = useState(17);
  const [time, setTime] = useState('13:00');

  return (
    <div
      className="r-hero-mock"
      style={{
        position: 'relative',
        paddingTop: 32,
        paddingRight: 22,
        paddingBottom: 36,
        paddingLeft: 38,
      }}
    >
      <div
        className="mono r-hero-stamp"
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
      <Image
        src="/assets/hero-jetski.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="(max-width: 900px) 100vw, 600px"
        style={{
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
      className="r-hero-notif"
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
          ¡Hola Sara! Tu reserva del 17 está confirmada. Completa tu check-in{' '}
          <a
            href="#"
            style={{
              color: 'var(--accent-2)',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(74,144,192,0.5)',
              textUnderlineOffset: 3,
            }}
          >
            aquí 
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
      className="r-hero-booking"
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
        SELECCIONA HORA
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
