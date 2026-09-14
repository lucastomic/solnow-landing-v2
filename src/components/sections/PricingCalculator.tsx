'use client';

import { useId, useMemo } from 'react';
import {
  computeQuote,
  isAvailable,
  type Inputs,
  type PlanKey,
} from '@/lib/pricingCalc';

/**
 * Calculadora de la sección de pricing.
 *
 * Los textos llegan por props, resueltos en servidor: `I18nProvider` serializa
 * en el HTML de *todas* las páginas lo que reciba, así que meter el namespace
 * `pricing` en `CLIENT_NAMESPACES` se pagaría en cada carga del sitio para una
 * sección que vive en una sola. Aquí solo viaja lo que esta isla usa.
 *
 * Las fórmulas están en `@/lib/pricingCalc`, ninguna aquí.
 */
export interface CalcCopy {
  title: string;
  lede: string;
  gmv: string;
  online: string;
  onlineHint: string;
  whatsapp: string;
  bases: string;
  basesUnit: string;
  basesUnitOne: string;
  planLabel: string;
  planPricier: string;
  planUnavailable: string;
  ledeLocked: string;
  cta: string;
  planLockedHint: string;
  cheapest: string;
  lines: Record<'manual' | 'channel' | 'agent', { l: string; d: string }>;
  otaNote: string;
  feeToggle: string;
  feeTeaser: string;
  feeScope: string;
  fixed: string;
  totalYear: string;
  ofBilling: string;
}

const PLAN_NAME: Record<PlanKey, string> = { despegue: 'Despegue', escalar: 'Escalar' };
const PLAN_KEYS: PlanKey[] = ['despegue', 'escalar'];

/**
 * La factura. El estado no vive aquí sino en `PricingSurface`, que lo comparte
 * con las tarjetas: el conmutador mensual/temporada mueve las dos superficies a
 * la vez, y con un estado por superficie el total dejaría de cuadrar con el
 * precio que anuncia la tarjeta de arriba.
 */
export default function PricingCalculator({
  copy,
  locale,
  input,
  onChange,
}: {
  copy: CalcCopy;
  locale: string;
  input: Inputs;
  onChange: (next: (prev: Inputs) => Inputs) => void;
}) {
  const q = useMemo(() => computeQuote(input), [input]);
  const uid = useId();

  const nLoc = locale === 'en' ? 'en-US' : 'es-ES';
  // `useGrouping: true` no es el defecto en `es-ES`, que deja los cuatro dígitos
  // sin separar (6628) y los cinco separados (10.544). Mezclar las dos formas en
  // la misma columna se lee como un error de la página.
  const eurFmt = new Intl.NumberFormat(nLoc, { maximumFractionDigits: 0, useGrouping: true });
  const eur = (n: number) => '€' + eurFmt.format(Math.round(n));
  const pct = (n: number) => Math.round(n * 100) + '%';

  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => onChange((p) => ({ ...p, [k]: v }));

  // `DemoCalendar` reenvía los `calc_*` de la URL al embed de HubSpot, que los
  // adjunta al contacto: el comercial abre la llamada con la facturación y las
  // bases delante en vez de gastar los diez primeros minutos preguntándolas.
  const demoHref =
    `/${locale}/demo?` +
    new URLSearchParams({
      calc_facturacion: String(input.gmv),
      calc_bases: String(input.bases),
      calc_canales: `online ${Math.round(input.onlineShare * 100)}% · whatsapp ${Math.round(
        input.whatsappShare * 100
      )}%`,
      calc_pago: PLAN_NAME[q.plan],
      calc_total: String(Math.round(q.netYearAvg)),
    }).toString();

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
        <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
          {isAvailable('despegue', input.bases) ? copy.lede : copy.ledeLocked}
        </div>
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
            onChange={(v) => set('gmv', v)}
          />
          <Slider
            id={uid + '-online'}
            label={copy.online}
            hint={copy.onlineHint}
            readout={pct(input.onlineShare) + ' · ' + eur(q.onlineGmv)}
            min={0}
            max={100}
            step={5}
            value={Math.round(input.onlineShare * 100)}
            onChange={(v) => set('onlineShare', v / 100)}
          />
          <p style={{ margin: '-6px 0 0', fontSize: 11, lineHeight: 1.45, color: 'var(--muted-2)' }}>{copy.otaNote}</p>
          <Slider
            id={uid + '-whatsapp'}
            label={copy.whatsapp}
            readout={pct(input.whatsappShare) + ' · ' + eur(q.whatsappGmv)}
            min={0}
            max={100}
            step={5}
            value={Math.round(input.whatsappShare * 100)}
            onChange={(v) => set('whatsappShare', v / 100)}
          />
          <Stepper
            label={copy.bases}
            unit={copy.basesUnit}
            unitOne={copy.basesUnitOne}
            value={input.bases}
            min={1}
            max={10}
            onChange={(v) => set('bases', v)}
          />
        </div>

        {/* ── Factura ── */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted-2)' }}>
                {copy.planLabel.toUpperCase()}
              </span>
              <span style={{ display: 'inline-flex', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 999, padding: 3 }}>
                {PLAN_KEYS.map((k) => {
                  const active = q.plan === k;
                  const allowed = isAvailable(k, input.bases);
                  return (
                    <button
                      key={k}
                      type="button"
                      disabled={!allowed}
                      aria-pressed={active}
                      onClick={() => set('plan', k)}
                      title={allowed ? undefined : copy.planLockedHint}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 999,
                        border: 0,
                        fontSize: 11.5,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: active ? 500 : 400,
                        letterSpacing: '0.02em',
                        background: active ? 'var(--accent)' : 'transparent',
                        color: active ? 'var(--accent-fg)' : allowed ? 'var(--fg-2)' : 'var(--muted-2)',
                        cursor: allowed ? 'pointer' : 'not-allowed',
                        opacity: allowed ? 1 : 0.5,
                        transition: 'background .15s ease, color .15s ease',
                      }}
                    >
                      {PLAN_NAME[k]}
                      {allowed ? (
                        q.recommended === k && (
                          <span style={{ marginLeft: 6, fontSize: 9.5, opacity: active ? 0.85 : 0.7 }}>
                            {copy.cheapest}
                          </span>
                        )
                      ) : (
                        <span style={{ marginLeft: 6, fontSize: 9.5, opacity: 0.7 }}>{copy.planUnavailable}</span>
                      )}
                    </button>
                  );
                })}
              </span>
            </div>
            {q.plan !== q.recommended && (
              <span style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>{copy.planPricier}</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {q.lines.map((l, idx) => {
              const zero = l.key === 'manual' || (l.key === 'channel' && input.bookingFee);
              return (
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
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                      {copy.lines[l.key].l}
                      <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', marginLeft: 8 }}>
                        {l.rate === 0 ? '0%' : pct(l.rate)} ·{' '}
                        {l.isRange
                          ? eur(l.base) + '–' + eur(l.baseHigh)
                          : eur(l.base)}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 1 }}>
                      {copy.lines[l.key].d}
                    </div>
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      fontVariantNumeric: 'tabular-nums',
                      color: zero ? 'var(--accent)' : 'var(--fg)',
                    }}
                  >
                    {zero && l.key === 'channel' ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: 'var(--muted-2)', fontWeight: 400, marginRight: 6 }}>
                          {eur(l.gross)}
                        </span>
                        {eur(0)}
                      </>
                    ) : l.isRange ? (
                      eur(l.net) + '–' + eur(l.netHigh)
                    ) : (
                      eur(l.net)
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Una opción más de la factura, no un cartel: sin caja ni fondo, con
              el mismo peso tipográfico que las notas de las líneas de arriba. */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              cursor: 'pointer',
              marginTop: -4,
            }}
          >
            <input
              type="checkbox"
              checked={input.bookingFee}
              onChange={(e) => set('bookingFee', e.target.checked)}
              style={{ width: 13, height: 13, marginTop: 2, accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--fg-2)' }}>{copy.feeToggle}</span>
              <span style={{ display: 'block', fontSize: 11, color: 'var(--muted-2)', marginTop: 1, lineHeight: 1.4 }}>
                {copy.feeScope}
              </span>
            </span>
          </label>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 10,
              paddingTop: 10,
              borderTop: '1px solid var(--line-soft)',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>
              {copy.totalYear}
              <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', marginLeft: 8 }}>
                {copy.fixed} {eur(q.fixed)}
              </span>
            </span>
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                className="mono"
                style={{ fontSize: 22, fontWeight: 500, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}
              >
                {eur(q.netYearAvg)}
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)' }}>
                {pctOfBilling(q.netYearAvg, input.gmv, nLoc)} {copy.ofBilling}
              </span>
            </span>
          </div>

          {/* La puerta iluminada: el número ya calculado, antes de tocar nada. */}
          {!input.bookingFee && (
            <p style={{ margin: '-4px 0 0', fontSize: 12, lineHeight: 1.45, color: 'var(--muted)' }}>
              {copy.feeTeaser.replace('{pct}', pct(q.lines[1].rate))}{' '}
              <strong style={{ color: 'var(--ok)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                {eur(q.netYearAvgWithFee)}
              </strong>
              .
            </p>
          )}

          <div
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
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

        </div>
      </div>
    </div>
  );
}

/** Porcentaje que representa la factura sobre la facturación, con un decimal. */
function pctOfBilling(net: number, gmv: number, nLoc: string): string {
  if (gmv <= 0) return '—';
  const v = (net / gmv) * 100;
  const digits = v < 10 ? 1 : 0;
  return new Intl.NumberFormat(nLoc, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v) + '%';
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
  // El relleno del raíl es lo único que no se puede expresar sin conocer el
  // valor, así que viaja como custom property y el resto se queda en el CSS.
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
