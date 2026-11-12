'use client';

import { useState } from 'react';
import { PLANS, SEASON_DISCOUNT, type Billing, type PlanKey } from '@/lib/pricingCalc';

const PLAN_KEYS: PlanKey[] = ['despegue', 'escalar'];

/** Plan que se pinta destacado. Presentación, no precio. */
const HIGHLIGHT: PlanKey = 'escalar';

export interface MsgPlan {
  name: string;
  audience: string;
  badge?: string;
  /** Texto bajo el precio cuando el plan no admite bases adicionales. */
  bases?: string;
  features: string[];
  cta: string;
}

export interface PlansCopy {
  plans: Record<PlanKey, MsgPlan>;
  /** Lo que es igual en los dos planes, dicho una vez y no dos. */
  core: string;
  noExtras: string;
  /** Sufijos del precio grande, uno por modalidad. */
  perMonth: string;
  perYear: string;
  /** Plantillas de la base adicional, con `{price}`. */
  extraMonth: string;
  extraYear: string;
  billingMonthly: string;
  billingAnnual: string;
}

/**
 * Las dos tarjetas de plan con el conmutador mensual/anual.
 *
 * Solo el fijo sale de `@/lib/pricingCalc` (cuotas y descuento anual). Los
 * porcentajes por canal no van aquí: son iguales en los dos planes y viven en
 * la tabla de canales de `PricingPage`.
 *
 * Los textos llegan resueltos desde servidor: meter el namespace `pricing` en
 * el diccionario de cliente se pagaría en el HTML de todas las páginas.
 */
export default function PricingSurface({ copy, locale }: { copy: PlansCopy; locale: string }) {
  const [billing, setBilling] = useState<Billing>('monthly');

  const eurFmt = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  const eur = (n: number) => '€' + eurFmt.format(n);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <BillingToggle
          value={billing}
          onChange={setBilling}
          labels={{ monthly: copy.billingMonthly, season: copy.billingAnnual }}
        />
      </div>

      <div
        className="r-split"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, alignItems: 'stretch' }}
      >
        {PLAN_KEYS.map((key, i) => (
          <PlanCard key={key} planKey={key} i={i} billing={billing} copy={copy} eur={eur} />
        ))}
      </div>

      <p
        className="reveal"
        style={{
          margin: '18px 0 0',
          fontSize: 13,
          color: 'var(--muted)',
          textAlign: 'center',
          lineHeight: 1.55,
        }}
      >
        {copy.core}
        <br />
        {copy.noExtras}
      </p>
    </>
  );
}

/**
 * Conmutador de modalidad.
 *
 * El descuento vive aquí y no en la tarjeta: quien está mirando la vista
 * mensual también tiene que ver que existe un −33%, y en la tarjeta solo lo
 * vería el que ya está en anual.
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
  const annual = billing === 'season';

  // El importe que de verdad se paga en la modalidad elegida, sin equivalencias
  // mensuales ni asteriscos de «facturado anualmente».
  const price = annual ? cfg.season.first : cfg.monthly.first;
  const extra = annual ? cfg.season.extra : cfg.monthly.extra;
  const extraLine =
    extra === null ? (msg.bases ?? '') : (annual ? copy.extraYear : copy.extraMonth).replace('{price}', eur(extra));

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
              {annual ? copy.perYear : copy.perMonth}
            </span>
          </div>

          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: hi ? 'var(--ink-fg-2)' : 'var(--fg-2)', marginTop: 8 }}>
            {extraLine}
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {msg.features.map((f, idx) => (
            <li
              key={f}
              style={{
                padding: '6px 0',
                fontSize: 13.5,
                lineHeight: 1.45,
                color: hi ? 'var(--ink-fg-2)' : 'var(--fg-2)',
                borderBottom:
                  idx < msg.features.length - 1 ? '1px solid ' + (hi ? 'rgba(255,255,255,0.06)' : 'var(--line-soft)') : 0,
              }}
            >
              {f}
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
