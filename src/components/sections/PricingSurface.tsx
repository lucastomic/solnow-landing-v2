'use client';

import { useState } from 'react';
import {
  DEFAULTS,
  PLANS,
  SEASON_DISCOUNT,
  type Billing,
  type Inputs,
  type PlanKey,
} from '@/lib/pricingCalc';
import PricingCalculator, { type CalcCopy } from './PricingCalculator';

const PLAN_KEYS: PlanKey[] = ['despegue', 'escalar'];

/** Plan que se pinta destacado. Presentación, no precio. */
const HIGHLIGHT: PlanKey = 'escalar';

export interface MsgPlan {
  name: string;
  audience: string;
  badge?: string;
  feeNote: string;
  onboarding: string;
  cta: string;
}

export interface PlansCopy {
  plans: Record<PlanKey, MsgPlan>;
  rows: {
    manual: string;
    online: string;
    onlineNote: string;
    vendor: string;
    vendorNote: string;
    onboarding: string;
  };
  /** Lo que es igual en los dos planes, dicho una vez y no dos. */
  bothPlans: string;
  /** Sufijos del precio grande, uno por modalidad. */
  perMonth: string;
  perSeason: string;
  /** Plantillas de la base adicional, con `{price}`. */
  extraMonth: string;
  extraSeason: string;
  billingMonthly: string;
  billingSeason: string;
}

/**
 * Las tarjetas y la calculadora, gobernadas por un solo estado.
 *
 * El conmutador mensual/temporada tiene que mover las dos superficies a la vez:
 * si cada una guardara su modalidad, la tarjeta podría anunciar el precio de
 * temporada mientras la factura de abajo suma doce mensualidades, y el total
 * dejaría de cuadrar con lo que el visitante está leyendo. Por eso el estado
 * vive aquí arriba y baja por props, en vez de dentro de la calculadora.
 *
 * Los textos llegan resueltos desde servidor: meter el namespace `pricing` en
 * el diccionario de cliente se pagaría en el HTML de todas las páginas.
 */
export default function PricingSurface({
  copy,
  calcCopy,
  locale,
}: {
  copy: PlansCopy;
  calcCopy: CalcCopy;
  locale: string;
}) {
  const [input, setInput] = useState<Inputs>(DEFAULTS);

  const eurFmt = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  const eur = (n: number) => '€' + eurFmt.format(n);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <BillingToggle
          value={input.billing}
          onChange={(billing) => setInput((p) => ({ ...p, billing }))}
          labels={{ monthly: copy.billingMonthly, season: copy.billingSeason }}
        />
      </div>

      <div
        className="r-split"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, alignItems: 'stretch' }}
      >
        {PLAN_KEYS.map((key, i) => (
          <PlanCard key={key} planKey={key} i={i} billing={input.billing} copy={copy} eur={eur} />
        ))}
      </div>

      <p
        className="reveal"
        style={{
          margin: '12px 0 0',
          fontSize: 12.5,
          color: 'var(--muted)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        {copy.bothPlans}
      </p>

      <PricingCalculator copy={calcCopy} locale={locale} input={input} onChange={setInput} />
    </>
  );
}

/**
 * Conmutador de modalidad.
 *
 * El descuento vive aquí y no en la tarjeta: quien está mirando la vista
 * mensual también tiene que ver que existe un −33%, y en la tarjeta solo lo
 * vería el que ya está en temporada.
 */
function BillingToggle({
  value,
  onChange,
  labels,
}: {
  value: Billing;
  onChange: (v: Billing) => void;
  labels: Record<Billing, string>;
}) {
  const off = Math.round(SEASON_DISCOUNT * 100);
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 999,
        padding: 3,
        fontFamily: 'var(--font-mono)',
        fontSize: 11.5,
      }}
    >
      {(['monthly', 'season'] as Billing[]).map((v) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 999,
              border: 0,
              cursor: 'pointer',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'var(--accent-fg)' : 'var(--fg-2)',
              fontWeight: active ? 500 : 400,
              transition: 'background .15s ease, color .15s ease',
            }}
          >
            {labels[v]}
            {v === 'season' && (
              <span
                style={{
                  fontSize: 9.5,
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: active ? 'rgba(255,255,255,0.18)' : 'var(--accent-bg)',
                  color: active ? 'var(--accent-fg)' : 'var(--accent)',
                }}
              >
                −{off}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PlanCard({
  planKey: key,
  i,
  billing,
  copy,
  eur,
}: {
  planKey: PlanKey;
  i: number;
  billing: Billing;
  copy: PlansCopy;
  eur: (n: number) => string;
}) {
  const cfg = PLANS[key];
  const msg = copy.plans[key];
  const hi = HIGHLIGHT === key;
  const pct = (n: number) => Math.round(n * 100) + '%';
  const season = billing === 'season';

  // El importe que de verdad se paga en la modalidad elegida, sin equivalencias
  // mensuales ni asteriscos de «facturado anualmente»: la letra chica de la
  // que precisamente nos diferenciamos.
  const price = season ? cfg.season.first : cfg.monthly.first;
  const extra = season ? cfg.season.extra : cfg.monthly.extra;
  const extraLine =
    extra === null
      ? msg.feeNote
      : (season ? copy.extraSeason : copy.extraMonth).replace('{price}', eur(extra));

  // Solo lo que diferencia a un plan del otro. Módulos y conversaciones son
  // idénticos en los dos, así que comparar dos columnas iguales no informa:
  // bajan a la franja común de debajo.
  const rows: { l: string; v: string; note: string }[] = [
    { l: copy.rows.manual, v: '0%', note: '' },
    { l: copy.rows.online, v: pct(cfg.channelPct), note: copy.rows.onlineNote },
    { l: copy.rows.vendor, v: '+' + pct(cfg.vendorPct), note: copy.rows.vendorNote },
    { l: copy.rows.onboarding, v: msg.onboarding, note: '' },
  ];

  return (
    <div
      className="reveal"
      style={{
        ['--reveal-delay' as string]: `${i * 90}ms`,
        position: 'relative',
        borderRadius: 18,
        padding: hi ? 2 : 0,
        background: hi ? 'linear-gradient(180deg, var(--accent), var(--accent-dim))' : 'transparent',
        boxShadow: hi ? '0 24px 60px -24px rgba(16,102,149,0.45)' : 'none',
        display: 'flex',
      }}
    >
      <div
        style={{
          flex: 1,
          background: hi ? 'var(--ink)' : 'var(--surface)',
          color: hi ? 'var(--ink-fg)' : 'var(--fg)',
          borderRadius: hi ? 16 : 18,
          border: hi ? '0' : '1px solid var(--line)',
          padding: '18px 24px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          position: 'relative',
        }}
      >
        {hi && msg.badge && (
          <span
            className="mono"
            style={{
              position: 'absolute',
              top: -1,
              left: 24,
              transform: 'translateY(-50%)',
              fontSize: 10.5,
              letterSpacing: '0.1em',
              fontWeight: 500,
              background: 'var(--accent)',
              color: 'var(--accent-fg)',
              padding: '5px 10px',
              borderRadius: 999,
            }}
          >
            {msg.badge}
          </span>
        )}

        <div>
          <h3
            className="h-2"
            style={{ margin: '0 0 6px', fontSize: 26, letterSpacing: '-0.022em', color: hi ? 'var(--ink-fg)' : 'var(--fg)' }}
          >
            {msg.name}
          </h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: hi ? 'var(--ink-fg-2)' : 'var(--muted)' }}>
            {msg.audience}
          </p>
        </div>

        <div
          style={{
            padding: '10px 0',
            borderTop: '1px solid ' + (hi ? 'rgba(255,255,255,0.12)' : 'var(--line-soft)'),
            borderBottom: '1px solid ' + (hi ? 'rgba(255,255,255,0.12)' : 'var(--line-soft)'),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 36,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: '-0.030em',
                color: hi ? 'var(--ink-fg)' : 'var(--accent)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {eur(price)}
            </span>
            <span style={{ fontSize: 13, color: hi ? 'var(--ink-muted)' : 'var(--muted)' }}>
              {season ? copy.perSeason : copy.perMonth}
            </span>
          </div>

          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: hi ? 'var(--ink-fg-2)' : 'var(--fg-2)', marginTop: 8 }}>
            {extraLine}
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
          {rows.map((r, idx) => (
            <li
              key={r.l}
              style={{
                padding: '5px 0',
                borderBottom:
                  idx < rows.length - 1 ? '1px solid ' + (hi ? 'rgba(255,255,255,0.06)' : 'var(--line-soft)') : 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 13.5, color: hi ? 'var(--ink-fg-2)' : 'var(--fg-2)' }}>{r.l}</span>
                <span
                  className="mono"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: 'right',
                    color: hi ? 'var(--accent-2)' : 'var(--accent)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {r.v}
                </span>
              </div>
              {r.note && (
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 1.35,
                    marginTop: 2,
                    color: hi ? 'var(--ink-muted)' : 'var(--muted-2)',
                  }}
                >
                  {r.note}
                </div>
              )}
            </li>
          ))}
        </ul>

        <a
          href="#cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '11px 18px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '-0.005em',
            background: hi ? 'var(--accent)' : 'transparent',
            color: hi ? 'var(--accent-fg)' : 'var(--fg)',
            border: hi ? '0' : '1px solid var(--line)',
            boxShadow: hi ? '0 10px 24px -10px var(--accent)' : 'none',
            marginTop: 6,
          }}
        >
          {msg.cta}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
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
  );
}
