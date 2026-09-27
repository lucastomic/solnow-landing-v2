'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { NarrativaUI } from '@/content/narrativa';

type CalcUI = NarrativaUI['calc'];
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

/**
 * «Cuánto te cuesta hoy»: el prospecto mete tres datos y ve el coste de no
 * resolverlo en su negocio, con las mismas unidades de la narrativa.
 *
 * Es el nivel de personalización del capítulo «Qué cuesta» (Kazanjy: enseñar
 * al prospecto qué pasa con sus datos). Se abre en un modal encima del tour,
 * como el zoom del grafo, y se cierra sin haber movido la página.
 *
 * Las constantes son las de la nota «Narrativa (orden Kazanjy)», medidas en
 * nuestros clientes antes de automatizar. Si cambia una cifra allí, cambia
 * aquí; no hay otra fuente.
 */
export const UNITS = {
  /** Minutos de una persona por reserva: contestar, datos, contrato, cobro y embarque. */
  minutesPerBooking: 5,
  /** Coste de un puesto de temporada: sueldo, Seguridad Social, formarlo y despedirlo. */
  seasonalHireCost: [8000, 11000] as const,
  /** Jornada de 8 h; un puesto de temporada trabaja 6 días de 7. */
  hoursPerDay: 8,
  daysPerMonth: 26,
  /** De cada 100 conversaciones, 53 se enfrían sin seguimiento. */
  coolShare: 0.53,
  /** Perseguirlas recupera 4-7 reservas por cada 100 conversaciones. */
  recoveredPer100: [4, 7] as const,
  /** Que valen 600-1.600 € por cada 100 conversaciones. */
  eurosPer100: [600, 1600] as const,
  /** 1 de cada 10 clientes espera más de una hora. */
  slowShare: 0.1,
};

export const range = (a: number, b: number, unit: string) =>
  `${Math.round(a).toLocaleString('es-ES')}-${Math.round(b).toLocaleString('es-ES')} ${unit}`;

export function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  readout,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  readout: string;
  onChange: (v: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <label htmlFor={id} style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>
          {label}
        </label>
        <span className="mono" style={{ fontSize: 13.5, color: 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {readout}
        </span>
      </div>
      <input
        id={id}
        className="calc-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={readout}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        style={{ '--fill': `${fill}%` } as CSSProperties}
      />
    </div>
  );
}

/** Lo que cuesta hoy no resolverlo, a partir de tres datos del negocio. */
export function estimate(bookings: number, chats: number, months: number) {
  // Horas: minutos por reserva → horas al día → puestos de temporada → euros.
  const hoursPerDay = (bookings * UNITS.minutesPerBooking) / 60;
  const hoursPerSeason = hoursPerDay * UNITS.daysPerMonth * months;
  const hires = hoursPerDay / UNITS.hoursPerDay;
  const hireCost = UNITS.seasonalHireCost.map((c) => c * hires) as [number, number];

  // Conversaciones: al mes → se enfrían → reservas y euros recuperables.
  const chatsPerMonth = chats * 30;
  const coolPerMonth = chatsPerMonth * UNITS.coolShare;
  const recoveredPerMonth = UNITS.recoveredPer100.map((r) => (chatsPerMonth * r) / 100) as [number, number];
  const lostPerMonth = UNITS.eurosPer100.map((e) => (chatsPerMonth * e) / 100) as [number, number];
  const lostPerSeason = lostPerMonth.map((e) => e * months) as [number, number];
  const slowPerDay = chats * UNITS.slowShare;

  const totalSeason: [number, number] = [hireCost[0] + lostPerSeason[0], hireCost[1] + lostPerSeason[1]];
  return { hoursPerDay, hoursPerSeason, hires, hireCost, coolPerMonth, recoveredPerMonth, lostPerMonth, lostPerSeason, slowPerDay, totalSeason };
}

function Result({ k, h, p }: { k: string; h: string; p: string }) {
  return (
    <div className="tour-fig-tile" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontSize: 'clamp(24px, 2.2vw, 32px)', lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 500, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
        {k}
      </div>
      <div style={{ fontSize: 14.5, color: 'var(--fg)', fontWeight: 500, marginTop: 6 }}>{h}</div>
      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.45, marginTop: 2 }}>{p}</div>
    </div>
  );
}

export function CostCalculator({ ui, onClose }: { ui: CalcUI; onClose: () => void }) {
  const loc = ui.hint.startsWith('Estimate') ? 'en-US' : 'es-ES';
  const num = (n: number, d = 0) => n.toLocaleString(loc, { maximumFractionDigits: d });
  const rangeL = (a: number, b: number, unit: string) => `${num(a)}-${num(b)} ${unit}`;
  const [bookings, setBookings] = useState(60);
  const [chats, setChats] = useState(40);
  const [months, setMonths] = useState(5);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const { hoursPerDay, hoursPerSeason, hires, hireCost, coolPerMonth, recoveredPerMonth, lostPerMonth, lostPerSeason, slowPerDay, totalSeason } =
    estimate(bookings, chats, months);

  return (
    <div className="tour-zoom" onClick={onClose}>
      <div className="tour-zoom-panel" role="dialog" aria-modal="true" aria-labelledby="tour-calc-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeBtn} type="button" className="tour-zoom-close" onClick={onClose} aria-label="×">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <div className="tour-zoom-grid" style={{ gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.2fr)' }}>
          <div className="tour-zoom-text">
            <span className="eyebrow">{ui.eyebrow}</span>
            <h3 id="tour-calc-title" className="h-2" style={{ margin: '14px 0 10px', fontSize: 'clamp(22px, 2.4vw, 30px)' }}>
              {ui.title}
            </h3>
            <p style={{ margin: '0 0 26px', color: 'var(--fg-2)', fontSize: 14.5, lineHeight: 1.55 }}>{ui.intro}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Slider id="calc-bookings" label={ui.bookings} value={bookings} min={10} max={300} step={5} readout={`${bookings}`} onChange={setBookings} />
              <Slider id="calc-chats" label={ui.chats} value={chats} min={5} max={200} step={5} readout={`${chats}`} onChange={setChats} />
              <Slider id="calc-months" label={ui.months} value={months} min={3} max={8} step={1} readout={`${months} ${ui.monthsUnit}`} onChange={setMonths} />
            </div>
          </div>
          <div className="tour-zoom-media">
            <span className="eyebrow no-dot">{ui.hours}</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Result k={`${num(hoursPerDay, 1)} ${ui.hoursPerDay}`} h={ui.hoursPerDayH} p={`${num(hoursPerSeason)} ${fill(ui.hoursPerSeason, { min: String(UNITS.minutesPerBooking) })}`} />
              <Result k={rangeL(hireCost[0], hireCost[1], '€')} h={fill(ui.hires, { n: num(hires, 1) })} p={ui.hiresH} />
            </div>
            <span className="eyebrow no-dot" style={{ marginTop: 8 }}>{ui.conversations}</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Result k={`${Math.round(slowPerDay)} ${ui.perDay}`} h={ui.slowH} p={ui.slowP} />
              <Result k={`${num(coolPerMonth)} ${ui.perMonth}`} h={ui.coolH} p={fill(ui.coolP, { range: rangeL(recoveredPerMonth[0], recoveredPerMonth[1], loc === 'en-US' ? 'bookings' : 'reservas') })} />
              <Result k={rangeL(lostPerMonth[0], lostPerMonth[1], '€')} h={ui.lostH} p={fill(ui.lostP, { range: rangeL(lostPerSeason[0], lostPerSeason[1], '€') })} />
            </div>
            <div className="card-ink" style={{ padding: '22px 24px', marginTop: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 18px' }}>
              <span style={{ fontSize: 'clamp(28px, 2.8vw, 40px)', lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 500, color: 'var(--ink-fg)', fontVariantNumeric: 'tabular-nums' }}>
                {rangeL(totalSeason[0], totalSeason[1], '€')}
              </span>
              <span style={{ fontSize: 15, color: 'var(--ink-fg-2)' }}>{ui.totalP}</span>
            </div>
          </div>
        </div>
        <p className="mono tour-zoom-hint">{ui.hint}</p>
      </div>
    </div>
  );
}

/** El botón que abre la calculadora, para usarlo desde una diapositiva de servidor. */
export function CostCalculatorLauncher({ label, ui }: { label: string; ui: CalcUI }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)} style={{ fontSize: 15 }}>
        {label}
      </button>
      {open && <CostCalculator ui={ui} onClose={close} />}
    </>
  );
}
