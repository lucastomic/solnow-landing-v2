import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '@/components/sections/SectionsEnd';
import { BulletList } from '@/components/atoms';
import { GuideToc } from '@/components/GuideToc';
import { localizedSlugFromSlug, type GuideBlock, type GuideContent } from '@/content/guides';
import type { Locale } from '@/i18n/config';

export interface GuideLabels {
  backHome: string;
  tocLabel: string;
  faqTitle: string;
  relatedTitle: string;
  disclaimerLabel: string;
  breadcrumbHome: string;
  viewProduct: string;
  groupLabel: string;
  /** Landing de producto del tema de esta guía; la resuelve `getGuide`. */
  productHref: string;
}

const CALLOUT: Record<'warn' | 'info' | 'accent', { bg: string; border: string }> = {
  warn: { bg: 'rgba(217,138,26,0.07)', border: 'var(--warn)' },
  info: { bg: 'rgba(74,144,192,0.07)', border: 'var(--info)' },
  accent: { bg: 'var(--accent-bg)', border: 'var(--accent)' },
};

/**
 * Rampa secuencial de las columnas, validada contra el fondo claro: banda de
 * luminosidad correcta y monótona, más oscuro cuanto mayor es el valor del eje.
 *
 * El primer paso es gris a propósito. No es un tono más de la escala: marca el
 * caso de referencia —la conversación que nadie dejó avanzar— frente al que se
 * lee todo lo demás.
 *
 * Los dos tonos claros quedan por debajo de 3:1 contra la superficie. Es
 * admisible porque cada columna lleva su valor escrito encima; si algún día se
 * quitan esas etiquetas, hay que oscurecer la rampa.
 */
const BAR_RAMP = ['#8aa1b3', '#86b9d6', '#64a3c8', '#438cb8', '#2575a6', '#106695'];

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
    <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Block({ block }: { block: GuideBlock }) {
  if (block.type === 'p') {
    return <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--fg-2)', margin: '0 0 16px' }}>{block.text}</p>;
  }

  if (block.type === 'list') {
    return (
      <div style={{ margin: '4px 0 22px' }}>
        <BulletList items={block.items} />
      </div>
    );
  }

  if (block.type === 'steps') {
    return (
      <ol style={{ listStyle: 'none', padding: 0, margin: '4px 0 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {block.items.map((item, j) => (
          <li key={j} style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-2)', display: 'grid', gridTemplateColumns: '28px 1fr', gap: 14, alignItems: 'start' }}>
            <span
              className="mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: '50%',
                border: '1px solid var(--accent-dim)',
                color: 'var(--accent)',
                fontSize: 12,
                transform: 'translateY(-1px)',
              }}
            >
              {String(j + 1).padStart(2, '0')}
            </span>
            <span style={{ paddingTop: 2 }}>{item}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === 'stats') {
    const cols = Math.min(block.items.length, 3);
    return (
      <div
        className="guide-stats"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: 12,
          margin: '8px 0 26px',
        }}
      >
        {block.items.map((item, j) => (
          <div
            key={j}
            style={{
              background: 'var(--accent-bg)',
              borderRadius: 12,
              padding: '22px 20px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              minWidth: 0,
            }}
          >
            <span
              className="h-display"
              style={{
                fontSize: cols === 1 ? 'clamp(40px, 6vw, 72px)' : 'clamp(34px, 4.4vw, 52px)',
                lineHeight: 1,
                color: 'var(--accent)',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                overflowWrap: 'anywhere',
              }}
            >
              {item.value}
            </span>
            <span style={{ fontSize: 14.5, lineHeight: 1.45, color: 'var(--fg-2)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === 'bars') {
    return (
      <figure
        style={{ margin: '10px 0 30px' }}
        role="img"
        aria-label={`${block.title}. ${block.items
          .map((it) => `${it.label}: ${it.display}`)
          .join('; ')}.`}
      >
        <figcaption
          className="h-3"
          style={{ fontSize: 17, marginBottom: 24, color: 'var(--fg)', maxWidth: '46ch' }}
        >
          {block.title}
        </figcaption>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${block.items.length}, 1fr)`,
            // 2px de hueco de superficie entre columnas contiguas.
            gap: 2,
            alignItems: 'end',
            height: 220,
            borderBottom: '1px solid var(--line)',
          }}
        >
          {block.items.map((item, j) => (
            <div
              key={j}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 12.5,
                  textAlign: 'center',
                  color: 'var(--fg)',
                  marginBottom: 6,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.display}
              </span>
              <div
                title={`${item.label}: ${item.display}`}
                style={{
                  height: `${(item.value / block.max) * 100}%`,
                  // Anclada a la línea base y redondeada solo por arriba.
                  borderRadius: '4px 4px 0 0',
                  background: BAR_RAMP[Math.min(j, BAR_RAMP.length - 1)],
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="mono"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${block.items.length}, 1fr)`,
            gap: 2,
            marginTop: 10,
            fontSize: 12,
            textAlign: 'center',
            color: 'var(--muted)',
          }}
        >
          {block.items.map((item, j) => (
            <span key={j}>{item.label}</span>
          ))}
        </div>

        <p
          className="mono"
          style={{
            margin: '14px 0 0',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--muted-2)',
            textAlign: 'center',
          }}
        >
          {block.xLabel}
        </p>
      </figure>
    );
  }

  if (block.type === 'feature') {
    const ink = block.tone === 'ink';
    return (
      <div
        className={ink ? 'card-ink r-feature' : 'r-feature'}
        style={{
          display: 'grid',
          // Proporción fija, no `auto`: con `auto` una cifra larga como
          // «10.000 – 27.000 €» se quedaba con casi todo el ancho y dejaba el
          // párrafo a una palabra por línea.
          gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
          gap: ink ? 32 : 28,
          alignItems: 'center',
          margin: '10px 0 30px',
          padding: ink ? '34px 32px' : '4px 0',
          borderRadius: ink ? 'var(--radius-lg)' : 0,
          borderLeft: ink ? undefined : '2px solid var(--accent)',
          paddingLeft: ink ? 32 : 26,
        }}
      >
        <div>
          <div
            className="h-display"
            style={{
              fontSize: 'clamp(38px, 5.2vw, 64px)',
              lineHeight: 1,
              letterSpacing: '-0.035em',
              color: ink ? 'var(--ink-fg)' : 'var(--accent)',
              fontVariantNumeric: 'tabular-nums',
              // Una cifra con rango puede partir en dos líneas antes que
              // desbordar su columna.
              overflowWrap: 'anywhere',
            }}
          >
            {block.value}
          </div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: ink ? 'var(--ink-muted)' : 'var(--muted-2)',
              marginTop: 12,
            }}
          >
            {block.label}
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 16.5,
            lineHeight: 1.65,
            color: ink ? 'var(--ink-fg-2)' : 'var(--fg-2)',
          }}
        >
          {block.text}
        </p>
      </div>
    );
  }

  if (block.type === 'figure') {
    if (block.side) {
      return (
        <figure
          className="r-figure-side"
          style={{
            margin: '10px 0 30px',
            display: 'grid',
            gridTemplateColumns: block.side === 'left' ? 'minmax(0, 320px) minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 320px)',
            gap: 28,
            alignItems: 'center',
          }}
        >
          <Image
            src={block.src}
            alt={block.alt}
            width={block.w}
            height={block.h}
            unoptimized
            style={{ width: '100%', height: 'auto', display: 'block', order: block.side === 'left' ? 0 : 1 }}
          />
          {block.caption && (
            <figcaption
              style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--fg-2)', order: block.side === 'left' ? 1 : 0 }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }
    return (
      <figure style={{ margin: '8px 0 28px' }}>
        {/* `unoptimized`, como los logos de clientes: el fichero ya viene al
            tamaño de render desde `scripts/optimize-images.mjs` y pasarlo otra
            vez por `/_next/image` solo gastaría cuota. */}
        <Image
          src={block.src}
          alt={block.alt}
          width={block.w}
          height={block.h}
          unoptimized
          style={{ width: '100%', height: 'auto', maxWidth: block.w, display: 'block', marginInline: 'auto' }}
        />
        {block.caption && (
          <figcaption
            className="mono"
            style={{ fontSize: 12, color: 'var(--muted-2)', letterSpacing: '0.04em', textAlign: 'center', marginTop: 12 }}
          >
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === 'table') {
    const hl = block.highlightCol;
    return (
      <div className="r-cmp-wrap" style={{ margin: '8px 0 24px' }}>
        <table
          className="r-cmp-row"
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14.5, tableLayout: 'fixed' }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 14px', borderBottom: '1px solid var(--line)' }} />
              {block.columns.map((c, k) => (
                <th
                  key={k}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--line)',
                    color: k === hl ? 'var(--accent)' : 'var(--fg)',
                    fontWeight: 600,
                    background: k === hl ? 'var(--accent-bg)' : 'transparent',
                    borderTopLeftRadius: k === hl ? 8 : 0,
                    borderTopRightRadius: k === hl ? 8 : 0,
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line-soft)', color: 'var(--muted)', fontWeight: 500 }}>
                  {row.label}
                </td>
                {row.cells.map((cell, k) => (
                  <td
                    key={k}
                    style={{
                      padding: '12px 14px',
                      borderBottom: '1px solid var(--line-soft)',
                      color: k === hl ? 'var(--fg)' : 'var(--fg-2)',
                      background: k === hl ? 'var(--accent-bg)' : 'transparent',
                      fontWeight: k === hl ? 500 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // callout
  const tone = CALLOUT[block.tone ?? 'accent'];
  return (
    <div
      style={{
        background: tone.bg,
        borderLeft: `3px solid ${tone.border}`,
        borderRadius: 8,
        padding: '14px 18px',
        margin: '6px 0 22px',
        fontSize: 15,
        lineHeight: 1.6,
        color: 'var(--fg-2)',
      }}
    >
      {block.text}
    </div>
  );
}

export function GuidePage({
  content,
  locale,
  labels,
}: {
  content: GuideContent;
  locale: Locale;
  labels: GuideLabels;
}) {
  const { hero, download, sections, faq, related, cta, disclaimer } = content;
  const ctaHref = cta.href ? `/${locale}/${cta.href}` : `/${locale}#cta`;
  const productHref = labels.productHref;
  const sectionId = (i: number) => `sec-${i + 1}`;
  const tocItems = sections.map((s, i) => ({ id: sectionId(i), label: s.h }));

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(247,247,247,0.82)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 16 }}>
          <Link href={`/${locale}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Image src="/hollow_logo_name_color.webp" alt="Solnow" width={162} height={28} priority style={{ width: 162, height: 'auto' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Link
              href={`/${locale}`}
              className="mono r-hide"
              style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M11 7H3M6.5 3.5 3 7l3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {labels.backHome}
            </Link>
            <a className="btn btn-primary" href={ctaHref} style={{ fontSize: 13 }}>
              {cta.button}
              {ARROW}
            </a>
          </div>
        </div>
      </header>

      {/* Hero — left-aligned band with a subtle wash, matching the new docs design */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--line-soft)',
          background: 'linear-gradient(180deg, var(--surface-2), var(--bg))',
        }}
      >
        <div
          aria-hidden
          className="dotgrid"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
            maskImage: 'linear-gradient(180deg, #000, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(180deg, #000, transparent 85%)',
          }}
        />
        <div className="container" style={{ position: 'relative', paddingBlock: '40px 56px' }}>
          <div style={{ maxWidth: 1080, marginInline: 'auto' }}>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mono" style={{ fontSize: 12, letterSpacing: '0.03em', color: 'var(--muted-2)', display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              <Link href={`/${locale}`} style={{ color: 'var(--muted)' }}>{labels.breadcrumbHome}</Link>
              {labels.groupLabel && (
                <>
                  <span aria-hidden>/</span>
                  <span style={{ color: 'var(--muted)' }}>{labels.groupLabel}</span>
                </>
              )}
              <span aria-hidden>/</span>
              <span style={{ color: 'var(--accent)' }}>{hero.eyebrow}</span>
            </nav>

            <div style={{ maxWidth: 760 }}>
              {/* El logo del cliente por delante del chip: en un caso de éxito
                  lo primero que hay que reconocer es de quién se habla. */}
              {hero.logo && (() => {
                const logo = (
                  <Image
                    src={hero.logo.src}
                    alt={hero.logo.alt}
                    width={hero.logo.w}
                    height={hero.logo.h}
                    unoptimized
                    style={{ height: 72, width: 'auto', display: 'block', marginBottom: 22 }}
                  />
                );
                return hero.website ? (
                  <a href={hero.website.href} target="_blank" rel="noopener" style={{ display: 'block', width: 'fit-content' }}>
                    {logo}
                  </a>
                ) : (
                  logo
                );
              })()}
              <span className="chip">{hero.eyebrow}</span>
              <h1 className="h-display" style={{ fontSize: 'clamp(32px, 4.6vw, 54px)', margin: '20px 0 20px' }}>
                {hero.h1}
              </h1>
              <p className="lede" style={{ maxWidth: '60ch' }}>{hero.lede}</p>
              <p className="mono" style={{ fontSize: 12.5, color: 'var(--muted-2)', letterSpacing: '0.04em', marginTop: 18 }}>
                {hero.updated} · {hero.readingTime}
                {/* Enlace a la web del cliente: el caso habla de un negocio real
                    y cualquiera tiene que poder comprobarlo. */}
                {hero.website && (
                  <>
                    {' · '}
                    <a
                      href={hero.website.href}
                      target="_blank"
                      rel="noopener"
                      style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}
                    >
                      {hero.website.label} ↗
                    </a>
                  </>
                )}
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
                <a className="btn btn-primary" href={ctaHref}>
                  {cta.button}
                  {ARROW}
                </a>
                <a className="btn btn-secondary" href={productHref}>
                  {labels.viewProduct}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingBlock: '52px 80px' }}>
        <div className="guide-grid">
          <div style={{ minWidth: 0, maxWidth: 760 }}>
            <article>
              {download && (
                <div
                  className="card card-lift"
                  style={{
                    marginBottom: 48,
                    padding: 24,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderColor: 'var(--accent)',
                    background: 'var(--accent-bg)',
                  }}
                >
                  <div style={{ maxWidth: '46ch' }}>
                    <div className="h-3" style={{ marginBottom: 6 }}>{download.title}</div>
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>{download.desc}</p>
                  </div>
                  <a className="btn btn-primary" href={download.href} download style={{ whiteSpace: 'nowrap' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                      <path d="M7 2v7M3.5 6 7 9.5 10.5 6M2.5 12h9" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {download.fileLabel}
                  </a>
                </div>
              )}

              {sections.map((s, i) => (
                <section key={i} id={sectionId(i)} style={{ marginBottom: 44 }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 12 }}>
                    {String(i + 1).padStart(2, '0')}
                    <span style={{ color: 'var(--muted-2)' }}> / {String(sections.length).padStart(2, '0')}</span>
                  </div>
                  <h2 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 28px)', marginBottom: 16 }}>{s.h}</h2>
                  {s.blocks.map((b, j) => (
                    <Block key={j} block={b} />
                  ))}
                </section>
              ))}

              {disclaimer && (
                <div
                  style={{
                    marginTop: 8,
                    padding: '16px 18px',
                    borderRadius: 10,
                    border: '1px solid var(--line)',
                    background: 'var(--surface-2)',
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: 'var(--muted)',
                  }}
                >
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--muted-2)', display: 'block', marginBottom: 6 }}>
                    {labels.disclaimerLabel.toUpperCase()}
                  </span>
                  {disclaimer}
                </div>
              )}
            </article>

            {/* FAQ. Puede no haberla: los casos de éxito van directos al CTA. */}
            {faq.length > 0 && (
            <section style={{ marginTop: 72 }}>
              <h2 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 28px)', marginBottom: 20 }}>{labels.faqTitle}</h2>
              <div style={{ borderTop: '1px solid var(--line-soft)' }}>
                {faq.map((item, i) => (
                  <details key={i} style={{ borderBottom: '1px solid var(--line-soft)', padding: '4px 0' }}>
                    <summary
                      style={{
                        cursor: 'pointer',
                        listStyle: 'none',
                        padding: '16px 0',
                        fontSize: 16.5,
                        fontWeight: 500,
                        color: 'var(--fg)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 16,
                        alignItems: 'center',
                      }}
                    >
                      {item.q}
                      <span className="mono" style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0 }}>+</span>
                    </summary>
                    <p style={{ margin: '0 0 18px', fontSize: 15.5, lineHeight: 1.7, color: 'var(--fg-2)', maxWidth: '64ch' }}>{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
            )}

            {/* Related */}
            {related.length > 0 && (
              <section style={{ marginTop: 64 }}>
                <h2 className="h-3" style={{ marginBottom: 18 }}>{labels.relatedTitle}</h2>
                <div className="r-split" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/${locale}/${localizedSlugFromSlug(r.slug, locale as Locale)}`}
                      className="card card-lift"
                      style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, color: 'var(--fg)' }}
                    >
                      <span style={{ fontSize: 15.5, lineHeight: 1.4, fontWeight: 500 }}>{r.label}</span>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{ARROW}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky table of contents */}
          <aside className="guide-toc">
            <GuideToc title={labels.tocLabel} items={tocItems} />
          </aside>
        </div>
      </div>

      {/* Final CTA */}
      <section className="container" style={{ paddingBottom: 96 }}>
        <div
          className="card-ink"
          style={{
            padding: 'clamp(32px, 5vw, 56px)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            background:
              'radial-gradient(700px 380px at 85% 15%, rgba(74,144,192,0.22), transparent 70%),' +
              'linear-gradient(180deg, #0a3f5d, #062a3e)',
          }}
        >
          <div aria-hidden className="dotgrid-ink" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
          <div style={{ position: 'relative', maxWidth: '40ch' }}>
            <h2 className="h-2" style={{ color: 'var(--ink-fg)', fontSize: 'clamp(24px, 3vw, 34px)', marginBottom: 12 }}>{cta.title}</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-muted)' }}>{cta.desc}</p>
          </div>
          <a className="btn btn-primary" href={ctaHref} style={{ whiteSpace: 'nowrap', position: 'relative' }}>
            {cta.button}
            {ARROW}
          </a>
        </div>
      </section>

      <Footer locale={locale} />
    </>
  );
}
