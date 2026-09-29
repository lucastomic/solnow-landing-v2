'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PricingCalculator, { type CalcCopy } from '@/components/sections/PricingCalculator';
import { computeQuote, DEFAULTS, type Billing, type Inputs } from '@/lib/pricingCalc';
import { estimate, Slider } from '@/components/narrativa/CostCalculator';
import type { NarrativaUI } from '@/content/narrativa';

type PricingUI = NarrativaUI['pricing'];
type CalcUI = NarrativaUI['calc'];

/**
 * La calculadora de precio de \`/precios\`, en un modal encima del tour.
 *
 * Misma isla, mismas fórmulas (\`@/lib/pricingCalc\`) y mismo copy que la
 * página pública, así que no puede desfasarse de ella. Solo cambian dos
 * cosas: no lleva el botón de demo (el tour no tiene enlaces) y arranca en
 * temporada, que es lo que se factura a casi todos (\`DEFAULTS.billing\`).
 *
 * El conmutador mensual/temporada vive aquí, como en \`PricingSurface\`: el
 * total de la calculadora cuadra con lo que dice la tarjeta del capítulo.
 */
export function PricingModal({
  copy,
  locale,
  billingLabels,
  ui,
  calcUi,
  onClose,
}: {
  copy: CalcCopy;
  locale: string;
  billingLabels: Record<Billing, string>;
  ui: PricingUI;
  calcUi: CalcUI;
  onClose: () => void;
}) {
  const [input, setInput] = useState<Inputs>(DEFAULTS);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Retorno estimado: lo que hoy cuesta no resolverlo (mismas unidades que la
  // calculadora del capítulo «Qué cuesta») frente a lo que paga al año.
  const [bookings, setBookings] = useState(60);
  const [chats, setChats] = useState(40);
  const [months, setMonths] = useState(5);
  const q = useMemo(() => computeQuote(input), [input]);
  const est = useMemo(() => estimate(bookings, chats, months), [bookings, chats, months]);
  const cost = Math.max(1, q.netYearAvg);
  const roi: [number, number] = [est.totalSeason[0] / cost, est.totalSeason[1] / cost];
  const nLoc = locale === 'en' ? 'en-US' : 'es-ES';
  const times = (n: number) => `×${n.toLocaleString(nLoc, { maximumFractionDigits: 1 })}`;
  const rangeL = (a: number, b: number, unit: string) =>
    `${Math.round(a).toLocaleString(nLoc)}-${Math.round(b).toLocaleString(nLoc)} ${unit}`;

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

  return (
    <div className="tour-zoom" onClick={onClose}>
      <div className="tour-zoom-panel" role="dialog" aria-modal="true" aria-labelledby="tour-pricing-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeBtn} type="button" className="tour-zoom-close" onClick={onClose} aria-label="×">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, paddingRight: 40 }}>
          <div>
            <span className="eyebrow">{ui.eyebrow}</span>
            <h3 id="tour-pricing-title" className="h-2" style={{ margin: '14px 0 0', fontSize: 'clamp(22px, 2.4vw, 30px)' }}>
              {copy.title}
            </h3>
          </div>
          <div className="calc-toggle" role="group" aria-label={ui.billing} style={{ minWidth: 240 }}>
            {(['season', 'monthly'] as Billing[]).map((b) => (
              <button key={b} type="button" aria-pressed={input.billing === b} onClick={() => setInput((p) => ({ ...p, billing: b }))}>
                {billingLabels[b]}
              </button>
            ))}
          </div>
        </div>
        <PricingCalculator copy={copy} locale={locale} input={input} onChange={setInput} noCta />

        <div className="tour-roi">
          <div className="tour-roi-inputs">
            <span className="eyebrow">{ui.roiEyebrow}</span>
            <p style={{ margin: '10px 0 18px', fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>{ui.roiIntro}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Slider id="roi-bookings" label={calcUi.bookings} value={bookings} min={10} max={300} step={5} readout={`${bookings}`} onChange={setBookings} />
              <Slider id="roi-chats" label={calcUi.chats} value={chats} min={5} max={200} step={5} readout={`${chats}`} onChange={setChats} />
              <Slider id="roi-months" label={calcUi.months} value={months} min={3} max={8} step={1} readout={`${months} ${calcUi.monthsUnit}`} onChange={setMonths} />
            </div>
          </div>
          <div className="tour-roi-out">
            <div className="tour-roi-line">
              <span>{ui.roiHires}</span>
              <strong className="mono">{rangeL(est.hireCost[0], est.hireCost[1], '€')}</strong>
            </div>
            <div className="tour-roi-line">
              <span>{ui.roiLost}</span>
              <strong className="mono">{rangeL(est.lostPerSeason[0], est.lostPerSeason[1], '€')}</strong>
            </div>
            <div className="tour-roi-line" data-total>
              <span>{ui.roiTotal}</span>
              <strong className="mono">{rangeL(est.totalSeason[0], est.totalSeason[1], '€')}</strong>
            </div>
            <div className="tour-roi-line">
              <span>{ui.roiPay}</span>
              <strong className="mono">{Math.round(q.netYearAvg).toLocaleString(nLoc)} €</strong>
            </div>
            <div className="card-ink tour-roi-total">
              <span className="tour-roi-big">{times(roi[0])} – {times(roi[1])}</span>
              <span>{ui.roiBig}</span>
            </div>
          </div>
        </div>
        <p className="mono tour-zoom-hint">{ui.hint}</p>
      </div>
    </div>
  );
}

export function PricingModalLauncher({
  label,
  copy,
  locale,
  billingLabels,
  ui,
  calcUi,
}: {
  label: string;
  copy: CalcCopy;
  locale: string;
  billingLabels: Record<Billing, string>;
  ui: PricingUI;
  calcUi: CalcUI;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" className="btn btn-primary tour-calc-launch" onClick={() => setOpen(true)} style={{ fontSize: 15 }}>
        {label}
      </button>
      {open && <PricingModal copy={copy} locale={locale} billingLabels={billingLabels} ui={ui} calcUi={calcUi} onClose={close} />}
    </>
  );
}
