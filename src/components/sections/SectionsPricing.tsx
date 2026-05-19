'use client';
import { useState, useMemo } from 'react';
import { SectionHead } from '../atoms';
import { useT, useLocale } from '@/i18n/I18nProvider';

const numLocale: Record<string, string> = { es: 'es-ES', en: 'en-US' };

interface Feature {
  l: string;
  v: boolean | string;
  tag?: string;
}

interface MsgTier {
  name: string;
  pitch: string;
  feeSuffix: string;
  annualNote?: string;
  badge?: string;
  cta: string;
  features: { l: string; v?: string }[];
}

/**
 * Numeric / structural plan config stays in code (pricing logic, never
 * translated). `featureV` decides each feature row's icon+value:
 *   false → not included (X) · true → included (✓) · 'msg' → use the
 *   localized string from messages.
 */
const TIER_CONFIG: Record<
  string,
  {
    feeNum: number;
    commissionPct: number;
    aiConv: number;
    aiAdv: number;
    annualDiscount: number;
    highlight?: boolean;
    featureV: (boolean | 'msg')[];
  }
> = {
  starter: {
    feeNum: 0,
    commissionPct: 0.035,
    aiConv: 0.49,
    aiAdv: 0.79,
    annualDiscount: 0,
    featureV: [false, true, false, 'msg'],
  },
  pro: {
    feeNum: 99,
    commissionPct: 0.02,
    aiConv: 0.35,
    aiAdv: 0.65,
    annualDiscount: 1 / 3,
    highlight: true,
    featureV: [true, true, false, 'msg'],
  },
  scale: {
    feeNum: 199,
    commissionPct: 0.0075,
    aiConv: 0.29,
    aiAdv: 0.59,
    annualDiscount: 1 / 3,
    featureV: [true, true, 'msg', 'msg'],
  },
};

const TIER_KEYS = ['starter', 'pro', 'scale'] as const;

interface Tier {
  key: string;
  name: string;
  pitch: string;
  feeNum: number;
  commissionPct: number;
  aiConv: number;
  aiAdv: number;
  feeSuffix: string;
  annualDiscount: number;
  annualNote?: string;
  highlight?: boolean;
  badge?: string;
  features: Feature[];
  cta: string;
}

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const isAnnual = billing === 'annual';
  const tr = useT();

  const tiers: Tier[] = TIER_KEYS.map((key) => {
    const cfg = TIER_CONFIG[key];
    const msg = tr<MsgTier>(`pricing.tiers.${key}`);
    const features: Feature[] = cfg.featureV.map((flag, idx) => ({
      l: msg.features[idx].l,
      v: flag === 'msg' ? msg.features[idx].v ?? '' : flag,
    }));
    return {
      key,
      name: msg.name,
      pitch: msg.pitch,
      feeNum: cfg.feeNum,
      commissionPct: cfg.commissionPct,
      aiConv: cfg.aiConv,
      aiAdv: cfg.aiAdv,
      feeSuffix: msg.feeSuffix,
      annualDiscount: cfg.annualDiscount,
      annualNote: msg.annualNote,
      highlight: cfg.highlight,
      badge: msg.badge,
      features,
      cta: msg.cta,
    };
  });

  const facts = tr<{ k: string; v: string }[]>('pricing.facts');

  return (
    <section id="pricing" className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 56,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 820, flex: 1 }}>
            <SectionHead
              eyebrow={tr('pricing.eyebrow')}
              title={<>{tr('pricing.title')}</>}
              lede={tr('pricing.lede')}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <BillingToggle value={billing} onChange={setBilling} />
          </div>
        </div>

        <div className="r-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }}>
          {tiers.map((t, i) => (
            <PricingCard key={t.key} t={t} i={i} isAnnual={isAnnual} />
          ))}
        </div>

        <PriceCalculator />

        <div
          className="reveal r-cols-4"
          style={{
            marginTop: 28,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: 'var(--line-soft)',
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid var(--line-soft)',
          }}
        >
          {facts.map(({ k, v }) => (
            <div key={k} style={{ background: 'var(--surface)', padding: '18px 20px' }}>
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.1em' }}>
                {k.toUpperCase()}
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--fg)', marginTop: 4, fontWeight: 500, letterSpacing: '-0.01em' }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ t, i, isAnnual = false }: { t: Tier; i: number; isAnnual: boolean }) {
  const tr = useT();
  const hi = t.highlight;
  const fmtEur = (n: number) => '€' + (n % 1 === 0 ? n : n.toFixed(0));
  const feeFactor = isAnnual ? 1 - t.annualDiscount : 1;
  const feeNow = t.feeNum * feeFactor;
  const feeOrig = t.feeNum;
  const hasAnnualOff = isAnnual && t.annualDiscount > 0;
  const comm = t.commissionPct * 100;
  const aiConv = t.aiConv;
  const aiAdv = t.aiAdv;
  const fmtPct = (n: number) => (n % 1 === 0 ? n + '%' : n.toFixed(2).replace(/\.?0+$/, '') + '%');
  const fmtConv = (n: number) => '€' + n.toFixed(2).replace('.', ',');

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
          padding: '32px 28px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          position: 'relative',
        }}
      >
        {hi && (
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
            {t.badge}
          </span>
        )}

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <h3
              className="h-2"
              style={{ margin: 0, fontSize: 26, letterSpacing: '-0.022em', color: hi ? 'var(--ink-fg)' : 'var(--fg)' }}
            >
              {t.name}
            </h3>
            <span
              className="mono"
              style={{ fontSize: 10.5, letterSpacing: '0.08em', color: hi ? 'rgba(255,255,255,0.55)' : 'var(--muted-2)' }}
            >
              {String(i + 1).padStart(2, '0')} / 03
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: hi ? 'var(--ink-fg-2)' : 'var(--muted)' }}>
            {t.pitch}
          </p>
        </div>

        <div
          style={{
            padding: '18px 0',
            borderTop: '1px solid ' + (hi ? 'rgba(255,255,255,0.12)' : 'var(--line-soft)'),
            borderBottom: '1px solid ' + (hi ? 'rgba(255,255,255,0.12)' : 'var(--line-soft)'),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 44,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: '-0.030em',
                color: hi ? 'var(--ink-fg)' : 'var(--accent)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {feeNow === 0 ? '€0' : fmtEur(feeNow)}
            </span>
            {hasAnnualOff && feeOrig > 0 && (
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: hi ? 'var(--ink-muted)' : 'var(--muted-2)',
                  textDecoration: 'line-through',
                  textDecorationThickness: '1px',
                }}
              >
                {fmtEur(feeOrig)}
              </span>
            )}
            <span style={{ fontSize: 13, color: hi ? 'var(--ink-muted)' : 'var(--muted)' }}>{t.feeSuffix}</span>
          </div>
          {hasAnnualOff && t.annualNote && (
            <div
              className="mono"
              style={{ fontSize: 10.5, letterSpacing: '0.06em', color: hi ? 'var(--accent-2)' : 'var(--accent)', marginTop: 6 }}
            >
              {tr('pricing.billedAnnual')} · {t.annualNote.toUpperCase()} · {tr('pricing.feeOnly')}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
            {(
              [
                [tr('pricing.commission'), fmtPct(comm), null, true],
                [tr('pricing.aiConv'), fmtConv(aiConv) + ' ' + tr('pricing.perConv'), null, false],
                [tr('pricing.aiAdv'), fmtConv(aiAdv) + ' ' + tr('pricing.perConv'), null, false],
              ] as [string, string, string | null, boolean][]
            ).map(([k, v, vOrig, wide]) => (
              <div
                key={k}
                style={{
                  gridColumn: wide ? '1 / -1' : 'auto',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: hi ? 'rgba(255,255,255,0.05)' : 'var(--surface-2)',
                  border: '1px solid ' + (hi ? 'rgba(255,255,255,0.08)' : 'var(--line-soft)'),
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: hi ? 'var(--ink-muted-2)' : 'var(--muted-2)',
                  }}
                >
                  {k}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    marginTop: 2,
                    letterSpacing: '-0.01em',
                    color: hi ? 'var(--ink-fg)' : 'var(--fg)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span>{v}</span>
                  {isAnnual && vOrig && vOrig !== v && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: hi ? 'var(--ink-muted-2)' : 'var(--muted-2)',
                        textDecoration: 'line-through',
                        textDecorationThickness: '1px',
                      }}
                    >
                      {vOrig}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
          {t.features.map((feat, idx) => (
            <li
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '20px 1fr auto',
                gap: 12,
                padding: '10px 0',
                borderBottom:
                  idx < t.features.length - 1
                    ? '1px solid ' + (hi ? 'rgba(255,255,255,0.06)' : 'var(--line-soft)')
                    : 0,
                alignItems: 'center',
                fontSize: 13.5,
                color: hi ? 'var(--ink-fg-2)' : 'var(--fg-2)',
                opacity: feat.v === false ? (hi ? 0.45 : 0.55) : 1,
              }}
            >
              <FeatureIcon ok={feat.v !== false} hi={!!hi} />
              <span>{feat.l}</span>
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.02em',
                  color:
                    feat.v === false
                      ? hi ? 'var(--ink-muted-2)' : 'var(--muted-2)'
                      : hi ? 'var(--accent-2)' : 'var(--accent)',
                  textAlign: 'right',
                }}
              >
                {typeof feat.v === 'string' ? feat.v : feat.v ? feat.tag || tr('pricing.included') : '—'}
              </span>
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
            padding: '13px 18px',
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
          {t.cta}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

function FeatureIcon({ ok, hi }: { ok: boolean; hi: boolean }) {
  if (ok) {
    return (
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border: '1px solid ' + (hi ? 'var(--accent-2)' : 'var(--accent-dim)'),
          background: hi ? 'rgba(74,144,192,0.18)' : 'var(--accent-bg)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: hi ? 'var(--accent-2)' : 'var(--accent)',
        }}
      >
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4 L4 7 L9 1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  return (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        border: '1px solid ' + (hi ? 'rgba(255,255,255,0.12)' : 'var(--line)'),
        background: 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hi ? 'var(--ink-muted-2)' : 'var(--muted-2)',
      }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 1 L7 7 M7 1 L1 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function BillingToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: 'monthly' | 'annual') => void;
}) {
  const tr = useT();
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
        letterSpacing: '0.02em',
      }}
    >
      {(
        [
          { v: 'monthly', l: tr('pricing.billingMonthly') },
          { v: 'annual', l: tr('pricing.billingAnnual') },
        ] as { v: 'monthly' | 'annual'; l: string }[]
      ).map((opt) => {
        const active = value === opt.v;
        return (
          <button
            key={opt.v}
            onClick={() => onChange(opt.v)}
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'var(--accent-fg)' : 'var(--fg-2)',
              fontWeight: active ? 500 : 400,
              transition: 'background .15s ease, color .15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            {opt.l}
            {opt.v === 'annual' && !active && (
              <span
                style={{
                  background: 'var(--accent-bg)',
                  color: 'var(--accent)',
                  fontSize: 9.5,
                  letterSpacing: '0.04em',
                  padding: '1px 5px',
                  borderRadius: 4,
                }}
              >
                {tr('pricing.billingSave')}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface PlanCalc {
  key: string;
  eligible: boolean;
  fee: number;
  commission: number;
  ai: number;
  total: number;
  cfg: { fee: number; commission: number; ai: number; maxBases: number; minBases: number; annual: number };
}

function PriceCalculator() {
  const tr = useT();
  const locale = useLocale();
  const nLoc = numLocale[locale] ?? 'es-ES';
  const [bases, setBases] = useState(2);
  const [reservas, setReservas] = useState(450);
  const [ticket, setTicket] = useState(130);
  const [convs, setConvs] = useState(900);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [throughSolnow, setThroughSolnow] = useState(75);

  const billable = Math.round(reservas * (throughSolnow / 100));
  const gmv = billable * ticket;
  const totalRevenue = reservas * ticket;
  const isAnnual = billing === 'annual';

  const plans = useMemo<PlanCalc[]>(() => {
    const cfgs: Record<string, { fee: number; commission: number; ai: number; maxBases: number; minBases: number; annual: number }> = {
      starter: { fee: 0,   commission: 0.035, ai: 0.49, maxBases: 1,  minBases: 1, annual: 0 },
      pro:     { fee: 99,  commission: 0.020, ai: 0.35, maxBases: 5,  minBases: 1, annual: 1 / 3 },
      scale:   { fee: 199, commission: 0.0075, ai: 0.29, maxBases: 10, minBases: 1, annual: 1 / 3 },
    };
    return ['starter', 'pro', 'scale'].map((key) => {
      const cfg = cfgs[key];
      const eligible = bases >= cfg.minBases && bases <= cfg.maxBases;
      const feeFactor = isAnnual ? 1 - cfg.annual : 1;
      const feeTotal = cfg.fee * bases * feeFactor;
      const commission = gmv * cfg.commission;
      const aiCost = convs * cfg.ai;
      const total = feeTotal + commission + aiCost;
      return { key, eligible, fee: feeTotal, commission, ai: aiCost, total, cfg };
    });
  }, [bases, gmv, convs, isAnnual]);

  const eligiblePlans = plans.filter((p) => p.eligible);
  const best = eligiblePlans.reduce<PlanCalc | null>((a, b) => (a && a.total <= b.total ? a : b), null);

  const fmt = (n: number) => '€ ' + Math.round(n).toLocaleString(nLoc);

  return (
    <div
      className="reveal"
      style={{
        marginTop: 56,
        borderRadius: 22,
        overflow: 'hidden',
        border: '1px solid var(--line)',
        background: 'var(--surface)',
        boxShadow: '0 30px 80px -40px rgba(8,57,84,0.18)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 28px',
          borderBottom: '1px solid var(--line-soft)',
          background: 'var(--surface-2)',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--accent-bg)',
              border: '1px solid var(--accent-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="3" y="2" width="10" height="12" rx="2" />
              <path d="M5 5h6 M5 8h6 M5 11h3" />
            </svg>
          </span>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--muted)' }}>{tr('pricing.calc.label').toUpperCase()}</div>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.014em' }}>{tr('pricing.calc.title')}</div>
          </div>
        </div>
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      <div className="r-split r-calc" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', minHeight: 480 }}>
        <div
          style={{
            padding: '28px 32px',
            borderRight: '1px solid var(--line-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <Slider label={tr('pricing.calc.bases')} unit={tr('pricing.calc.basesUnit')} value={bases} min={1} max={10} step={1} onChange={setBases} nLoc={nLoc} />
          <Slider label={tr('pricing.calc.reservas')} unit="" value={reservas} min={30} max={3000} step={10} onChange={setReservas} nLoc={nLoc} />
          <Slider label={tr('pricing.calc.ticket')} unit={tr('pricing.calc.ticketUnit')} value={ticket} min={60} max={400} step={5} onChange={setTicket} nLoc={nLoc} />
          <Slider
            label={tr('pricing.calc.convs')}
            unit=""
            value={convs}
            min={100}
            max={6000}
            step={50}
            onChange={setConvs}
            nLoc={nLoc}
            hint={tr('pricing.calc.convsHint')}
          />
          <Slider
            label={tr('pricing.calc.throughSolnow')}
            unit={tr('pricing.calc.throughSolnowUnit')}
            value={throughSolnow}
            min={20}
            max={100}
            step={5}
            onChange={setThroughSolnow}
            nLoc={nLoc}
            hint={tr('pricing.calc.throughSolnowHint', {
              billable: billable.toLocaleString(nLoc),
              gmv: fmt(gmv),
            })}
          />
        </div>

        <div
          style={{
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--muted)' }}>
              {tr('pricing.calc.monthlyCost').toUpperCase()}{isAnnual ? tr('pricing.calc.annualBilling').toUpperCase() : ''}
            </span>
            {best && (
              <span
                className="mono"
                style={{
                  fontSize: 10.5,
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                {tr('pricing.calc.bestOption').toUpperCase()} · {best.key.toUpperCase()}
              </span>
            )}
          </div>

          {plans.map((p) => (
            <PlanResult key={p.key} p={p} best={best} fmt={fmt} isAnnual={isAnnual} />
          ))}

          <RevenueBlock best={best} totalRevenue={totalRevenue} fmt={fmt} />
        </div>
      </div>
    </div>
  );
}

function RevenueBlock({
  best,
  totalRevenue,
  fmt,
}: {
  best: PlanCalc | null;
  totalRevenue: number;
  fmt: (n: number) => string;
}) {
  const tr = useT();
  if (!best || totalRevenue === 0) return null;
  const pct = ((best.total / totalRevenue) * 100).toFixed(1);

  return (
    <div
      className="r-split"
      style={{
        marginTop: 6,
        padding: '18px 20px',
        borderRadius: 12,
        background: 'var(--accent-bg)',
        border: '1px solid rgba(16,102,149,0.22)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <div>
        <div className="mono" style={{ fontSize: 10.5, color: 'var(--accent)', letterSpacing: '0.08em' }}>
          {tr('pricing.calc.revenueTitle').toUpperCase()}
        </div>
        <div style={{ fontSize: 14, color: 'var(--fg-2)', marginTop: 4, lineHeight: 1.5 }}>
          {tr('pricing.calc.revenueBody', { pct, total: fmt(totalRevenue) })}
        </div>
      </div>
      <a className="btn btn-primary" href="#cta" style={{ padding: '11px 16px', fontSize: 13.5 }}>
        {tr('pricing.calc.revenueCta')}
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path
            d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = '',
  hint,
  nLoc,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit?: string;
  hint?: string;
  nLoc: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{label}</span>
        <span
          className="mono"
          style={{ fontSize: 14, fontWeight: 500, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.005em' }}
        >
          {value.toLocaleString(nLoc)}
          {unit}
        </span>
      </div>
      <div style={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 999, background: 'var(--line)' }} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: pct + '%',
            height: 4,
            borderRadius: 999,
            background: 'var(--accent)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', margin: 0 }}
        />
        <div
          style={{
            position: 'absolute',
            left: `calc(${pct}% - 9px)`,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'var(--accent)',
            border: '3px solid var(--surface)',
            boxShadow: '0 2px 6px rgba(8,57,84,0.25), 0 0 0 1px var(--accent-dim)',
            pointerEvents: 'none',
          }}
        />
      </div>
      {hint && (
        <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.02em' }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function PlanResult({
  p,
  best,
  fmt,
  isAnnual,
}: {
  p: PlanCalc;
  best: PlanCalc | null;
  fmt: (n: number) => string;
  isAnnual: boolean;
}) {
  const tr = useT();
  const labels: Record<string, string> = { starter: 'Starter', pro: 'Pro', scale: 'Scale' };
  const isBest = best && p.key === best.key && p.eligible;
  const disabled = !p.eligible;

  return (
    <div
      className="r-planrow"
      style={{
        padding: '14px 16px',
        borderRadius: 12,
        background: isBest ? 'linear-gradient(135deg, var(--accent-bg), var(--surface))' : disabled ? 'transparent' : 'var(--surface)',
        border: '1px solid ' + (isBest ? 'var(--accent-dim)' : 'var(--line-soft)'),
        opacity: disabled ? 0.55 : 1,
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        alignItems: 'center',
        gap: 14,
        transition: 'background .2s ease, border-color .2s ease',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14.5, fontWeight: 500, letterSpacing: '-0.01em' }}>{labels[p.key]}</span>
          {isBest && (
            <span
              className="mono"
              style={{ fontSize: 9.5, letterSpacing: '0.08em', background: 'var(--accent)', color: 'var(--accent-fg)', padding: '2px 6px', borderRadius: 4 }}
            >
              {tr('pricing.calc.recommended')}
            </span>
          )}
          {isAnnual && !disabled && p.cfg.annual > 0 && (
            <span
              className="mono"
              style={{
                fontSize: 9.5,
                letterSpacing: '0.06em',
                color: 'var(--accent)',
                background: 'var(--accent-bg)',
                border: '1px solid rgba(16,102,149,0.25)',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {tr('pricing.calc.feeOff', { pct: Math.round(p.cfg.annual * 100) })}
            </span>
          )}
          {disabled && (
            <span
              className="mono"
              style={{ fontSize: 9.5, letterSpacing: '0.06em', color: 'var(--muted-2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--line-soft)' }}
            >
              {p.key === 'starter' && tr('pricing.calc.onlyOneBase')}
              {p.key === 'pro' && tr('pricing.calc.maxFiveBases')}
            </span>
          )}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, letterSpacing: '0.02em' }}>
          {tr('pricing.calc.breakdown', {
            fee: fmt(p.fee),
            commission: fmt(p.commission),
            ai: fmt(p.ai),
          })}
        </div>
      </div>
      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.04em' }}>
        {tr('pricing.calc.perMonth')}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: '-0.018em',
          color: isBest ? 'var(--accent)' : 'var(--fg)',
          fontVariantNumeric: 'tabular-nums',
          minWidth: 110,
          textAlign: 'right',
        }}
      >
        {fmt(p.total)}
      </div>
    </div>
  );
}
