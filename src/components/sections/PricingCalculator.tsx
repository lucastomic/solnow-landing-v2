'use client';

import { useId, useMemo } from 'react';
import { computeQuote, withShare, type ChannelKey, type Inputs, type ShareKey } from '@/lib/pricingCalc';

/**
 * Calculadora corta del Pricing 2027 (la usa el modal de la narrativa).
 *
 * Entradas: facturación, % web, % agente de IA, % OTAs y bases. Salida: el
 * fijo, el 1 % que pagas tú y el 3 % que paga tu cliente, por separado. Sin
 * conmutador de repercutir: el 3 % va incluido en el precio por defecto, y si
 * el operador no lo repercute lo asume al mismo 3 % (lo dice `absorbNote`).
 *
 * Los textos llegan por props, resueltos en servidor (`pricing.calc`). Las
 * fórmulas están en `@/lib/pricingCalc`, ninguna aquí.
 */
export interface CalcCopy {
  title: string;
  lede: string;
  gmv: string;
  web: string;
  webHint: string;
  agent: string;
  agentHint: string;
  ota: string;
  otaHint: string;
  bases: string;
  basesUnit: string;
  basesUnitOne: string;
  planLabel: string;
  planWhy: { despegue: string; escalar: string };
  kioskNote: string;
  lines: Record<ChannelKey, string>;
  fixed: string;
  youPay: string;
  youPayHint: string;
  clientPays: string;
  clientPaysHint: string;
  absorbNote: string;
  ofBilling: string;
  cta: string;
}

const PLAN_NAME = { despegue: 'Despegue', escalar: 'Escalar' } as const;

export default function PricingCalculator({
  copy,
  locale,
  input,
  onChange,
  noCta = false,
}: {
  copy: CalcCopy;
  locale: string;
  input: Inputs;
  onChange: (next: (prev: Inputs) => Inputs) => void;
  /** Sin el botón de demo: el tour de narrativa no puede tener enlaces. */
  noCta?: boolean;
}) {
  const q = useMemo(() => computeQuote(input), [input]);
  const uid = useId();

  const nLoc = locale === 'en' ? 'en-US' : 'es-ES';
  // `useGrouping: true` no es el defecto en `es-ES`: sin él, 6628 y 10.544
  // convivirían en la misma columna.
  const eurFmt = new Intl.NumberFormat(nLoc, { maximumFractionDigits: 0, useGrouping: true });
  const eur = (n: number) => '€' + eurFmt.format(Math.round(n));
  const pct = (n: number) => Math.round(n * 100) + ' %';

  const setShare = (k: ShareKey, v: number) => onChange((p) => withShare(p, k, v));

  const demoHref =
    `/${locale}/demo?` +
    new URLSearchParams({
      calc_facturacion: String(input.gmv),
      calc_bases: String(input.bases),
      calc_canales: `web ${Math.round(input.webShare * 100)}% · agente ${Math.round(
        input.agentShare * 100
      )}% · ota ${Math.round(input.otaShare * 100)}%`,
      calc_pago: PLAN_NAME[q.plan],
      calc_total: String(Math.round(q.total)),
    }).toString();

  const shareSlider = (k: ShareKey, label: string, hint: string) => (
    <Slider
      id={uid + '-' + k}
      label={label}
      hint={hint}
      readout={pct(input[k]) + ' · ' + eur(input.gmv * input[k])}
      min={0}
      max={100}
      step={5}
      value={Math.round(input[k] * 100)}
      onChange={(v) => setShare(k, v / 100)}
    />
  );

  const totalRow = (label: string, hint: string, amount: number, accent: boolean) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'baseline' }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{label}</div>
        <div style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 1, lineHeight: 1.4 }}>{hint}</div>
      </div>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span
          className="mono"
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: accent ? 'var(--accent)' : 'var(--fg)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {eur(amount)}
        </span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)' }}>
          {pctOfBilling(amount, input.gmv, nLoc)} {copy.ofBilling}
        </span>
      </span>
    </div>
  );

  return (
    <div
      className="reveal"
      style={{
        marginTop: 24,
        borderRadius: 18,
        border: '1px solid var(--line)',
        background: 'var(--surface)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 22px',
          borderBottom: '1px solid var(--line-soft)',
          background: 'var(--surface-2)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--fg)', letterSpacing: '-0.012em' }}>
          {copy.title}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{copy.lede}</div>
      </div>

      <div className="r-calc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {/* ── Entradas ── */}
        <div
          className="r-calc-left"
          style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16, borderRight: '1px solid var(--line-soft)' }}
        >
          <Slider
            id={uid + '-gmv'}
            label={copy.gmv}
            readout={eur(input.gmv)}
            min={50_000}
            max={3_000_000}
            step={25_000}
            value={input.gmv}
            onChange={(v) => onChange((p) => ({ ...p, gmv: v }))}
          />
          {shareSlider('webShare', copy.web, copy.webHint)}
          {shareSlider('agentShare', copy.agent, copy.agentHint)}
          {shareSlider('otaShare', copy.ota, copy.otaHint)}
          <Stepper
            label={copy.bases}
            unit={copy.basesUnit}
            unitOne={copy.basesUnitOne}
            value={input.bases}
            min={1}
            max={10}
            onChange={(v) => onChange((p) => ({ ...p, bases: v }))}
          />
        </div>

        {/* ── Factura ── */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted-2)' }}>
              {copy.planLabel.toUpperCase()} · {PLAN_NAME[q.plan]}
            </span>
            <span style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>
              {copy.planWhy[q.plan]} {copy.kioskNote}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 10,
                padding: '8px 0',
                borderBottom: '1px solid var(--line-soft)',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{copy.fixed}</span>
              <span className="mono" style={{ fontSize: 14, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                {eur(q.fixed)}
              </span>
            </div>
            {q.lines.map((l, idx) => (
              <div
                key={l.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: idx < q.lines.length - 1 ? '1px solid var(--line-soft)' : 0,
                  alignItems: 'baseline',
                }}
              >
                <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                  {copy.lines[l.key]}
                  <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', marginLeft: 8 }}>
                    {pct(l.rate)} · {eur(l.base)}
                  </span>
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    fontVariantNumeric: 'tabular-nums',
                    color: l.amount === 0 ? 'var(--accent)' : 'var(--fg)',
                  }}
                >
                  {eur(l.amount)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 10, borderTop: '1px solid var(--line-soft)' }}>
            {totalRow(copy.youPay, copy.youPayHint, q.youPay, true)}
            {totalRow(copy.clientPays, copy.clientPaysHint, q.clientPays, false)}
          </div>

          <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.45, color: 'var(--muted-2)' }}>{copy.absorbNote}</p>

          {!noCta && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a
                href={demoHref}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 15px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 500,
                  background: 'var(--accent)',
                  color: 'var(--accent-fg)',
                  whiteSpace: 'nowrap',
                }}
              >
                {copy.cta}
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Porcentaje que representa un importe sobre la facturación, con un decimal. */
function pctOfBilling(amount: number, gmv: number, nLoc: string): string {
  if (gmv <= 0) return '—';
  const v = (amount / gmv) * 100;
  const digits = v < 10 ? 1 : 0;
  return new Intl.NumberFormat(nLoc, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v) + ' %';
}

function Slider({
  id,
  label,
  hint,
  readout,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  readout: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  // El relleno del raíl viaja como custom property; el resto está en el CSS.
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>
          {label}
        </label>
        <span
          className="mono"
          style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}
        >
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
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--fill' as string]: fill + '%' }}
      />
      {hint && <span style={{ fontSize: 11, color: 'var(--muted-2)', lineHeight: 1.4 }}>{hint}</span>}
    </div>
  );
}

function Stepper({
  label,
  unit,
  unitOne,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  unit: string;
  unitOne: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const btn = (d: number, sign: string, disabled: boolean) => (
    <button
      type="button"
      aria-label={label + ' ' + sign}
      disabled={disabled}
      onClick={() => onChange(Math.min(max, Math.max(min, value + d)))}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: '1px solid var(--line)',
        background: 'var(--surface)',
        color: disabled ? 'var(--muted-2)' : 'var(--fg)',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 15,
        lineHeight: 1,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {sign}
    </button>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {btn(-1, '−', value <= min)}
        <span
          className="mono"
          style={{ fontSize: 13, minWidth: 58, textAlign: 'center', color: 'var(--accent)', fontWeight: 500 }}
        >
          {value} {value === 1 ? unitOne : unit}
        </span>
        {btn(1, '+', value >= max)}
      </span>
    </div>
  );
}
