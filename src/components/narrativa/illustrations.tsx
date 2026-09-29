import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import type { NarrativaUI } from '@/content/narrativa';

type Ill = NarrativaUI['ill'];

/**
 * Ilustraciones del problema (capítulo 1). Son divs y SVG con los tokens de
 * la web, sin estado: se renderizan en servidor y cuentan lo que el texto ya
 * no tiene que contar. Cada una cabe en la columna de una `SlideFeature`.
 *
 * Añadir una ilustración: una función aquí y su nombre en `ILLUSTRATIONS`,
 * para que el contenido pueda pedirla por clave.
 */

const card: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: 14,
  boxShadow: '0 1px 0 rgba(8,57,84,0.04), 0 4px 12px -6px rgba(8,57,84,0.06)',
};

/* ── Canales → cadena ──────────────────────────────────────────────────── */

/** Iconos de los cinco canales, en el orden de `ui.ill.channels`. */
const CHANNEL_ICONS = [
  'M4 10h16v9H4zM2 7h20v3H2zM9 13h6',
  'M4 5h16v11H9l-5 4z',
  'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  'M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6',
  'M3 12h18M3 12l4-4M3 12l4 4M14 6l7 6-7 6',
];

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/** Cinco puertas de entrada que desembocan en la misma cadena de seis pasos. */
export function ChannelsToChain({ ill }: { ill: Ill }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div className="tour-ill-channels">
        {ill.channels.map((k, i) => (
          <div key={k} style={{ ...card, padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--accent)' }}>
            <Icon d={CHANNEL_ICONS[i]} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{k}</span>
          </div>
        ))}
      </div>
      {/* Las cinco líneas convergen en un punto. */}
      <svg viewBox="0 0 500 70" width="100%" height="70" preserveAspectRatio="none" aria-hidden style={{ display: 'block' }}>
        {[50, 150, 250, 350, 450].map((x) => (
          <path key={x} d={`M${x} 0 C ${x} 40, 250 30, 250 70`} fill="none" stroke="var(--line)" strokeWidth="1.5" />
        ))}
        <circle cx="250" cy="66" r="4" fill="var(--accent)" />
      </svg>
      <div className="tour-ill-steps">
        {ill.steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
            <span
              className="mono"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--accent-bg)',
                color: 'var(--accent)',
                fontSize: 12.5,
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{s}</span>
          </div>
        ))}
      </div>
      <p className="mono" style={{ margin: '18px 0 0', textAlign: 'center', fontSize: 11.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {ill.chainCaption}
      </p>
    </div>
  );
}

/* ── Horas del equipo ──────────────────────────────────────────────────── */

/** Bloques de la jornada: clave de `ui.ill.day` y ancho en % del día. */
const DAY: { t: keyof Ill['day']; w: number }[] = [
  { t: 'messages', w: 14 },
  { t: 'quote', w: 8 },
  { t: 'data', w: 12 },
  { t: 'contract', w: 14 },
  { t: 'charge', w: 9 },
  { t: 'board', w: 10 },
  { t: 'messages', w: 12 },
  { t: 'contract', w: 11 },
  { t: 'charge', w: 10 },
];

/** Quien pone las horas: caras y nombres, no puestos. Recortes en `public/assets/equipo`. */
const TEAM = [
  { name: 'Álvaro', src: '/assets/equipo/alvaro.webp' },
  { name: 'Marta', src: '/assets/equipo/marta.webp' },
  { name: 'Dani', src: '/assets/equipo/dani.webp' },
];

/** La jornada de cada persona del equipo, de 09:00 a 21:00, llena de papel y mensajes. */
export function TeamHours({ ill }: { ill: Ill }) {
  const people = TEAM;
  return (
    <div style={{ ...card, padding: 'clamp(16px, 2vw, 26px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 12, fontSize: 11, color: 'var(--muted-2)' }} className="mono">
        <span />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['09:00', '12:00', '15:00', '18:00', '21:00'].map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      </div>
      {people.map((p, row) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>
            <Image
              src={p.src}
              alt=""
              width={28}
              height={28}
              style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--line)', flex: 'none', objectFit: 'cover' }}
            />
            {p.name}
          </div>
          <div style={{ display: 'flex', gap: 2, height: 30, borderRadius: 6, overflow: 'hidden', background: 'var(--surface-2)' }}>
            {DAY.slice(row === 2 ? 0 : row, row === 2 ? 9 : 8 + row).map((b, i) => (
              <span
                key={i}
                className="tour-ill-hours-seg"
                style={{
                  width: `${b.w}%`,
                  background: b.t === 'messages' ? 'var(--accent-2)' : 'var(--accent-dim)',
                  opacity: b.t === 'messages' ? 0.55 : 0.75,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 6,
                  fontSize: 10.5,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {ill.day[b.t]}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 16, marginTop: 4, fontSize: 11.5, color: 'var(--muted)' }}>
        <span><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--accent-dim)', opacity: 0.75, marginRight: 6 }} />{ill.legendPaper}</span>
        <span><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--accent-2)', opacity: 0.55, marginRight: 6 }} />{ill.legendMessages}</span>
      </div>
    </div>
  );
}

/* ── Reservas que se pierden ───────────────────────────────────────────── */

/** Una bandeja de WhatsApp en la que las conversaciones se van apagando. */
export function LostBookings({ ill }: { ill: Ill }) {
  const CHATS = ill.chats;
  return (
    <div style={{ ...card, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)' }} className="mono">
        <span>{ill.inbox}</span>
        <span>{ill.inboxOpen}</span>
      </div>
      {CHATS.map((c, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '36px 1fr auto',
            gap: 12,
            alignItems: 'center',
            padding: '12px 16px',
            borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)',
            opacity: 1 - i * 0.16,
          }}
        >
          <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: 'var(--fg-2)' }}>
            {c.who[0]}
          </span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{c.who}</span>
            <span style={{ display: 'block', fontSize: 13, color: 'var(--fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.t}</span>
          </span>
          <span style={{ textAlign: 'right' }}>
            <span className="mono" style={{ display: 'block', fontSize: 10.5, color: 'var(--muted-2)' }}>{c.when}</span>
            <span style={{ display: 'inline-block', marginTop: 4, fontSize: 10.5, padding: '2px 7px', borderRadius: 999, background: i < 2 ? 'rgba(217,138,26,0.14)' : 'var(--surface-2)', color: i < 2 ? 'var(--warn)' : 'var(--muted)' }}>
              {c.state}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── No saber qué pasa ─────────────────────────────────────────────────── */

/** Un panel con las cuatro preguntas del dueño y ninguna respuesta. */
export function UnknownBoard({ ill }: { ill: Ill }) {
  const UNKNOWN = ill.unknown.map((q) => ({ q }));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {UNKNOWN.map((u, i) => (
        <div key={i} style={{ ...card, padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{u.q}</span>
          <span
            style={{
              fontSize: 'clamp(34px, 3.4vw, 48px)',
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: '-0.04em',
              color: 'var(--muted-2)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ?
          </span>
          <span style={{ height: 6, borderRadius: 3, background: 'var(--surface-2)', width: `${55 + i * 10}%` }} />
        </div>
      ))}
      <p className="mono" style={{ gridColumn: '1 / -1', margin: '6px 0 0', fontSize: 11.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {ill.unknownCaption}
      </p>
    </div>
  );
}

export const ILLUSTRATIONS: Record<string, (ill: Ill) => ReactNode> = {
  channels: (ill) => <ChannelsToChain ill={ill} />,
  hours: (ill) => <TeamHours ill={ill} />,
  lost: (ill) => <LostBookings ill={ill} />,
  unknown: (ill) => <UnknownBoard ill={ill} />,
};

export type IllustrationKey = keyof typeof ILLUSTRATIONS;
