import type { ReactNode } from 'react';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { ProductGraphContent } from '@/content/products';
import type { NarrativaUI, SlideCase, SlideChains, SlideFeature, SlideFigure, SlideLogos, SlideOverview, SlidePrice, SlideTitle } from '@/content/narrativa';
import { FigureView } from '@/components/narrativa/figures';
import { NumLabel } from '@/components/atoms';
import { AreaMock, AreaMockSecondary } from '@/components/product/mocks';
import FlowGraph from '@/components/product/FlowGraph';
import { AdsLogos } from '@/components/ads/AdsChrome';
import { ILLUSTRATIONS } from '@/components/narrativa/illustrations';
import { rich } from '@/components/narrativa/rich';
import { CostCalculatorLauncher } from '@/components/narrativa/CostCalculator';
import { PricingModalLauncher } from '@/components/narrativa/PricingModal';
import type { CalcCopy } from '@/components/sections/PricingCalculator';
import type { Billing } from '@/lib/pricingCalc';

/** Lo que la calculadora de precio necesita del servidor. */
export interface PricingProps {
  copy: CalcCopy;
  locale: string;
  billingLabels: Record<Billing, string>;
  ui: NarrativaUI['pricing'];
  calcUi: NarrativaUI['calc'];
  labels: NarrativaUI['price'];
}

/**
 * Las tres plantillas del deck (Kazanjy, cap. 3): título de sección, resumen
 * y feature. Cada diapositiva del tour se compone con una de ellas y nada
 * más, así que una diapositiva nueva es un objeto en `content/narrativa.ts`.
 *
 * Todo lleva `.reveal` con retardo escalonado, salvo la primera diapositiva,
 * que entra con `.hero-rise` para no retrasar el LCP.
 */


/** Titular con un tramo en cursiva de marca. */
function emphasised(title: string, em?: string): ReactNode {
  if (!em) return title;
  const i = title.indexOf(em);
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <em className="serif">{em}</em>
      {title.slice(i + em.length)}
    </>
  );
}

const delay = (i: number) => ({ ['--reveal-delay' as string]: `${i * 90}ms` });

const PHOTO_STYLE = {
  borderRadius: 16,
  border: '1px solid var(--line-soft)',
  boxShadow: '0 24px 60px -24px rgba(9, 40, 64, 0.35)',
} as const;

/* ── Título de sección ─────────────────────────────────────────────────── */

export function TitleSlide({
  slide,
  n,
  label,
  first,
}: {
  slide: SlideTitle;
  /** Número de capítulo; una cadena («Apéndice») cuando no va numerado. */
  n: number | string;
  label: string;
  first?: boolean;
}) {
  const cls = first ? 'hero-rise' : 'reveal';
  const text = (
    <div className={cls} style={{ maxWidth: slide.image ? undefined : 960 }}>
        <span className="eyebrow">
          {typeof n === 'number' ? String(n).padStart(2, '0') : n} · {label}
        </span>
        <h2
          className="h-display"
          style={{ margin: '22px 0 0', fontSize: slide.image ? 'clamp(30px, 3.8vw, 54px)' : 'clamp(34px, 4.8vw, 66px)', lineHeight: 1.03 }}
        >
          {emphasised(slide.title, slide.em)}
        </h2>
        {slide.lede && (
          <p className="lede" style={{ maxWidth: '58ch', marginTop: 28 }}>
            {rich(slide.lede)}
          </p>
        )}
        {slide.clients && (
          <div className="tour-clients">
            {slide.clients.map((c, i) => (
              <div key={i} className="card tour-client reveal" style={delay(i + 1)}>
                <Image src={c.logo.src} alt={c.logo.alt} width={c.logo.w} height={c.logo.h} style={{ height: 56, width: 'auto', maxWidth: 160, objectFit: 'contain' }} />
                <div>
                  <div className="h-3" style={{ fontSize: 17 }}>{c.name}</div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em', marginTop: 4 }}>{c.profile}</div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
  if (!slide.image) {
    return (
      <div className="container" style={{ position: 'relative' }}>
        {text}
      </div>
    );
  }
  return (
    // La foto manda: se lleva la columna ancha y el contenedor crece un poco
    // para que no quede en sello.
    <div className="container" style={{ position: 'relative', maxWidth: 1360 }}>
      <div className="r-split" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.3fr)', gap: 'clamp(28px, 4vw, 56px)', alignItems: 'center' }}>
        {text}
        <div className={cls} style={{ ...delay(1), minWidth: 0 }}>
          <Image
            src={slide.image.src}
            alt={slide.image.alt}
            width={slide.image.w}
            height={slide.image.h}
            priority={first}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ width: '100%', height: 'auto', display: 'block', ...PHOTO_STYLE }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Resumen ───────────────────────────────────────────────────────────── */

function Head({ title, sub, intro }: { title: string; sub?: string; intro?: string }) {
  return (
    <div className="reveal" style={{ marginBottom: 36, maxWidth: 820 }}>
      <h3 className="h-1" style={{ margin: 0, fontSize: 'clamp(28px, 3.4vw, 46px)' }}>
        {title}
      </h3>
      {sub && (
        <p className="lede" style={{ marginTop: 14 }}>
          {rich(sub)}
        </p>
      )}
      {intro && (
        <p style={{ margin: '16px 0 0', color: 'var(--fg-2)', fontSize: 16.5, lineHeight: 1.6, maxWidth: '62ch' }}>
          {rich(intro)}
        </p>
      )}
    </div>
  );
}

function Note({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="lede reveal" style={{ marginTop: 36, maxWidth: '62ch', ...delay(4) }}>
      {rich(text)}
    </p>
  );
}

const BIG = {
  lineHeight: 1,
  letterSpacing: '-0.04em',
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',
} as const;

export function OverviewSlide({ slide }: { slide: SlideOverview }) {
  const { layout, items } = slide;
  return (
    <div className="container">
      <Head title={slide.title} sub={slide.sub} intro={slide.intro} />

      {layout === 'list' && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 860 }}>
          {items.map((it, i) => (
            <li
              key={i}
              className="reveal"
              style={{
                ...delay(i),
                display: 'grid',
                gridTemplateColumns: '28px 1fr',
                gap: 16,
                padding: '16px 0',
                borderTop: '1px solid var(--line-soft)',
                fontSize: 17,
                lineHeight: 1.55,
                color: 'var(--fg-2)',
              }}
            >
              <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', paddingTop: 5 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="tour-rich">{rich(it.h)}</span>
            </li>
          ))}
        </ul>
      )}

      {layout === 'grid' && (
        <div className="r-cols-3" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, items.length)}, 1fr)`, gap: 20 }}>
          {items.map((it, i) => (
            <div key={i} className="card reveal" style={{ ...delay(i), padding: 28 }}>
              {it.k && (
                <span className="mono" style={{ fontSize: 12, color: 'var(--accent)', letterSpacing: '0.08em' }}>
                  {it.k}
                </span>
              )}
              <h4 className="h-3" style={{ margin: '12px 0 10px', fontSize: 20 }}>
                {rich(it.h)}
              </h4>
              {it.p && (
                <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.6 }}>
                  {rich(it.p)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {layout === 'stats' && (
        <div
          className={items.length > 3 ? 'r-cols-5' : 'r-cols-3'}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${items.length}, 1fr)`,
            gap: 1,
            border: '1px solid var(--line-soft)',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--line-soft)',
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className="reveal"
              style={{ ...delay(i), padding: '30px 24px', background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <div style={{ ...BIG, fontSize: 'clamp(30px, 2.8vw, 42px)', color: 'var(--accent)' }}>{it.k}</div>
              <div style={{ fontSize: 15.5, color: 'var(--fg)', fontWeight: 500, marginTop: 4 }}>{rich(it.h)}</div>
              {it.p && <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>{rich(it.p)}</div>}
            </div>
          ))}
        </div>
      )}

      {layout === 'chain' && (
        <ol className="tour-chain">
          {items.map((it, i) => (
            <li key={i} className="reveal" style={delay(i)}>
              <span className="mono tour-chain-n">{i + 1}</span>
              <span>{it.h}</span>
            </li>
          ))}
        </ol>
      )}

      {layout === 'split' && (
        <div className="r-split" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 24 }}>
          {items.map((it, i) => (
            <div
              key={i}
              className={(it.accent ? 'card-ink' : 'card') + ' reveal'}
              style={{ ...delay(i), padding: 'clamp(24px, 3vw, 40px)' }}
            >
              <span
                className="eyebrow"
                style={it.accent ? { color: 'var(--ink-muted)' } : undefined}
              >
                {it.k}
              </span>
              <h4
                className="h-2"
                style={{ margin: '16px 0 12px', fontSize: 'clamp(22px, 2.4vw, 30px)', color: it.accent ? 'var(--ink-fg)' : undefined }}
              >
                {rich(it.h)}
              </h4>
              {it.p && (
                <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.6, color: it.accent ? 'var(--ink-fg-2)' : 'var(--fg-2)' }}>
                  {rich(it.p)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {layout === 'matrix' && (
        <div className="tour-matrix">
          <div className="tour-matrix-head" aria-hidden>
            <span />
            {slide.columns?.map((c) => (
              <span key={c} className="mono">
                {c}
              </span>
            ))}
          </div>
          {items.map((it, i) => (
            <div key={i} className="tour-matrix-row reveal" style={delay(i)}>
              <div>
                <h4 className="h-3" style={{ margin: '0 0 6px', fontSize: 18 }}>
                  {it.h}
                </h4>
                {it.p && (
                  <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14.5, lineHeight: 1.55 }}>
                    {rich(it.p)}
                  </p>
                )}
              </div>
              {slide.columns?.map((c, j) => (
                <span key={c} className="tour-matrix-cell" data-on={it.covers?.[j] ? 'true' : 'false'}>
                  <span className="mono tour-matrix-col">{c}</span>
                  <span aria-label={it.covers?.[j] ? 'Lo cubre' : 'No lo cubre'}>{it.covers?.[j] ? '✓' : '—'}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {layout === 'timeline' && (
        <ol className="tour-timeline">
          {items.map((it, i) => (
            <li key={i} className="reveal" style={delay(i)}>
              <span className="tour-timeline-dot" aria-hidden />
              <span className="eyebrow no-dot">{it.k}</span>
              <h4 className="h-2" style={{ margin: '12px 0 10px', fontSize: 'clamp(22px, 2.4vw, 30px)' }}>
                {rich(it.h)}
              </h4>
              {it.p && (
                <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 16.5, lineHeight: 1.6 }}>
                  {rich(it.p)}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      <Note text={slide.note} />
    </div>
  );
}

/* ── Feature ───────────────────────────────────────────────────────────── */

export function FeatureSlide({
  slide,
  graph,
  locale,
  ill,
}: {
  slide: SlideFeature;
  graph: ProductGraphContent;
  locale: Locale;
  ill: NarrativaUI['ill'];
}) {
  const m = slide.media;
  let media: ReactNode;
  // Con marco solo las capturas de producto; fotos e ilustraciones traen el suyo.
  let framed = false;
  if (m.type === 'flow') {
    media = <FlowGraph graph={graph} locale={locale} plain />;
  } else if (m.type === 'image') {
    media = (
      <Image
        src={m.image.src}
        alt={m.image.alt}
        width={m.image.w}
        height={m.image.h}
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ width: '100%', height: 'auto', display: 'block', ...PHOTO_STYLE }}
      />
    );
  } else if (m.type === 'illustration') {
    media = ILLUSTRATIONS[m.name](ill);
  } else {
    media = m.secondary ? <AreaMockSecondary areaKey={m.area} /> : <AreaMock areaKey={m.area} />;
    framed = true;
  }
  const wide = m.type === 'flow';

  return (
    <div className="container">
      {/* El grafo necesita el ancho entero (su lienzo mide 1040px): va debajo
          del texto, no al lado. */}
      <div
        className={wide ? undefined : 'r-split' + (slide.mediaFirst ? ' r-media-first' : '')}
        style={{
          display: 'grid',
          gridTemplateColumns: wide ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: wide ? 40 : 'clamp(32px, 5vw, 64px)',
          alignItems: 'center',
        }}
      >
        <div className="reveal">
          {slide.n && <NumLabel n={slide.n} of={slide.of} />}
          <h3 className="h-1" style={{ margin: '12px 0 14px', fontSize: 'clamp(26px, 3vw, 40px)' }}>
            {slide.title}
          </h3>
          {slide.sub && (
            <p className="lede" style={{ margin: '0 0 22px', fontSize: 17 }}>
              {rich(slide.sub)}
            </p>
          )}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {slide.bullets.map((b, i) => (
              <li
                key={i}
                className="tour-rich"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 1fr',
                  gap: 12,
                  alignItems: 'start',
                  fontSize: 16.5,
                  lineHeight: 1.6,
                  color: 'var(--fg-2)',
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: '1px solid var(--accent-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    fontSize: 12,
                    transform: 'translateY(3px)',
                  }}
                >
                  ↳
                </span>
                <span>{rich(b)}</span>
              </li>
            ))}
          </ul>
          {slide.callout && (
            <p
              className="serif"
              style={{ margin: '26px 0 0', fontSize: 'clamp(20px, 2vw, 26px)', lineHeight: 1.3, maxWidth: '30ch' }}
            >
              {slide.callout}
            </p>
          )}
        </div>
        <div className="reveal" style={{ ...delay(2), minWidth: 0 }}>
          {framed ? <div className="tour-shot" style={PHOTO_STYLE}>{media}</div> : media}
        </div>
      </div>
    </div>
  );
}

/* ── Cadenas causa → efecto ────────────────────────────────────────────── */

/** Filas de cifras encadenadas; las usan el coste y los casos de cliente. */
function ChainRows({ rows, compact }: { rows: SlideChains['rows']; compact?: boolean }) {
  return (
    <div className={'tour-flows' + (compact ? ' tour-flows-compact' : '')}>
      {rows.map((row, r) => (
        <div key={r} className="tour-flow reveal" style={delay(r)}>
          <span className="eyebrow no-dot tour-flow-label">{row.label}</span>
          <div className="tour-flow-nodes">
            {row.nodes.map((n, i) => (
              <div key={i} className="tour-flow-node" data-unknown={n.unknown || undefined}>
                <div className="tour-flow-k">{n.k}</div>
                <div className="tour-flow-h">{n.h}</div>
                {n.p && <div className="tour-flow-p">{rich(n.p)}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChainsSlide({ slide, calcUi }: { slide: SlideChains; calcUi: NarrativaUI['calc'] }) {
  return (
    <div className="container">
      <Head title={slide.title} sub={slide.sub} />
      <ChainRows rows={slide.rows} />
      <Note text={slide.note} />
      {slide.calculator && (
        <div className="reveal" style={{ ...delay(5), marginTop: 26 }}>
          <CostCalculatorLauncher label={slide.calculator} ui={calcUi} />
        </div>
      )}
    </div>
  );
}

/* ── Figuras ───────────────────────────────────────────────────────────── */

export function FigureSlide({ slide }: { slide: SlideFigure }) {
  return (
    <div className="container">
      <Head title={slide.title} sub={slide.sub} />
      <div className="tour-figures" data-cols={slide.figures.length + (slide.aside ? 1 : 0)}>
        {slide.figures.map((f, i) => (
          <div key={i} className="reveal" style={delay(i)}>
            <FigureView f={f} />
          </div>
        ))}
        {slide.aside && (
          <div className="tour-fig-aside reveal" style={delay(slide.figures.length)}>
            {slide.aside.map((it, i) => (
              <div key={i} className="tour-fig-tile">
                <div style={{ ...BIG, fontSize: 'clamp(26px, 2.4vw, 34px)', color: 'var(--accent)' }}>{it.k}</div>
                <div style={{ fontSize: 14.5, color: 'var(--fg)', fontWeight: 500, marginTop: 6 }}>{rich(it.h)}</div>
                {it.p && <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.45, marginTop: 2 }}>{rich(it.p)}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      <Note text={slide.note} />
    </div>
  );
}

/* ── Caso de cliente ───────────────────────────────────────────────────── */

export function CaseSlide({ slide }: { slide: SlideCase }) {
  return (
    <div className="container">
      <div className="tour-case">
        <div className="tour-case-who reveal">
          <Image src={slide.logo.src} alt={slide.logo.alt} width={slide.logo.w} height={slide.logo.h} style={{ height: 64, width: 'auto', maxWidth: 180, objectFit: 'contain' }} />
          <span className="eyebrow no-dot" style={{ marginTop: 18 }}>{slide.profile}</span>
          <h3 className="h-1" style={{ margin: '10px 0 12px', fontSize: 'clamp(26px, 3vw, 40px)' }}>
            {slide.name}
          </h3>
          <p className="lede" style={{ margin: 0, fontSize: 18 }}>{rich(slide.lede)}</p>
          {slide.photo && (
            <Image
              src={slide.photo.src}
              alt={slide.photo.alt}
              width={slide.photo.w}
              height={slide.photo.h}
              sizes="(max-width: 900px) 100vw, 30vw"
              className="tour-case-photo"
            />
          )}
        </div>
        <div className="tour-case-stats">
          <ChainRows rows={slide.rows} compact />
        </div>
      </div>
    </div>
  );
}

/* ── Logos ─────────────────────────────────────────────────────────────── */

export function LogosSlide({ slide, inProduction }: { slide: SlideLogos; inProduction: string }) {
  return (
    <div style={{ width: '100%' }}>
      <div className="container">
        <Head title={slide.title} />
      </div>
      <AdsLogos title={inProduction} />
    </div>
  );
}

/* ── Precio ────────────────────────────────────────────────────────────── */

export function PriceSlide({ slide, pricing }: { slide: SlidePrice; pricing: PricingProps }) {
  return (
    <div className="container">
      <Head title={slide.title} />
      <div className="r-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24, alignItems: 'stretch' }}>
        <div className="card-ink reveal" style={{ padding: 'clamp(24px, 3vw, 40px)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="eyebrow" style={{ color: 'var(--ink-muted)' }}>
            {pricing.labels.eyebrow}
          </span>
          <div style={{ ...BIG, fontSize: 'clamp(30px, 3vw, 44px)', color: 'var(--ink-fg)', marginTop: 10 }}>{slide.fixed.first}</div>
          <div style={{ fontSize: 16.5, color: 'var(--ink-fg-2)' }}>{slide.fixed.extra}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: 'auto', paddingTop: 20 }}>
            {slide.fixed.monthly}
          </div>
        </div>
        <div className="card reveal" style={{ ...delay(1), padding: 'clamp(20px, 2.5vw, 32px)', display: 'flex', flexDirection: 'column' }}>
          <span className="eyebrow">{pricing.labels.variable}</span>
          {slide.rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '84px 1fr',
                gap: 18,
                padding: '16px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)',
                marginTop: i === 0 ? 14 : 0,
              }}
            >
              <div style={{ ...BIG, fontSize: 30, color: 'var(--accent)' }}>{r.k}</div>
              <div>
                <div style={{ fontSize: 16.5, fontWeight: 500, color: 'var(--fg)' }}>{r.h}</div>
                <div style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.5, marginTop: 4 }}>{r.p}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* El agente, fuera del variable: incluido en la cuota, no una comisión más. */}
      <div
        className="card reveal r-split"
        style={{
          ...delay(2),
          marginTop: 16,
          padding: 'clamp(16px, 2vw, 24px) clamp(20px, 2.5vw, 32px)',
          display: 'grid',
          gridTemplateColumns: '1fr minmax(0, 340px)',
          gap: 24,
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 16.5, fontWeight: 500, color: 'var(--fg)' }}>{slide.agent.h}</div>
          <div style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.5, marginTop: 4 }}>{slide.agent.p}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="mono" style={{ fontSize: 15, fontWeight: 500, color: 'var(--accent)', whiteSpace: 'nowrap', flexShrink: 0 }}>{slide.agent.k}</span>
          <span style={{ fontSize: 13, color: 'var(--muted-2)', lineHeight: 1.45 }}>{slide.agent.kp}</span>
        </div>
      </div>
      <p className="mono reveal" style={{ ...delay(3), margin: '28px 0 0', fontSize: 12.5, color: 'var(--muted)', letterSpacing: '0.04em' }}>
        {pricing.labels.allIncluded} {slide.note}
      </p>
      <div className="reveal" style={{ ...delay(4), marginTop: 26, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 24px' }}>
        <PricingModalLauncher label={slide.calculator} copy={pricing.copy} locale={pricing.locale} billingLabels={pricing.billingLabels} ui={pricing.ui} calcUi={pricing.calcUi} />
        {/* Despegue, en pequeño y apagado: existe, pero casi nadie va ahí. */}
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted-2)', lineHeight: 1.5, maxWidth: '60ch' }}>{slide.alt}</p>
      </div>
    </div>
  );
}
