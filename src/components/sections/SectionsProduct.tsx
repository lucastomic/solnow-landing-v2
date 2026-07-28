'use client';
import Link from 'next/link';
import { SectionHead, NumLabel } from '../atoms';
import { useT, useLocale } from '@/i18n/I18nProvider';
import FlowGraph from '@/components/product/FlowGraph';
import { AreaCards } from '@/components/product/ProductChrome';
import { productHubPath, type ProductSummary } from '@/content/products';

export function PainBar() {
  const t = useT();
  const bullets = t<{ k: string; u: string; d: string }[]>('painBar.items');
  return (
    <section className="section" style={{ paddingBlock: 100 }}>
      <div className="container">
        <div className="reveal" style={{ maxWidth: 980, marginBottom: 56 }}>
          <h2 className="h-1" style={{ marginBottom: 0 }}>
            {t('painBar.headPre')}
            <span style={{ color: 'var(--muted)' }}>{t('painBar.headEm')}</span>
          </h2>
        </div>
        <div
          className="r-cols-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            border: '1px solid var(--line-soft)',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--line-soft)',
          }}
        >
          {bullets.map((b, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                ['--reveal-delay' as string]: `${i * 90}ms`,
                padding: '32px 28px',
                background: 'var(--bg)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <NumLabel n={i + 1} of={3} />
              <div
                style={{
                  fontSize: 56,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  fontWeight: 500,
                  color: 'var(--accent)',
                  marginTop: 8,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {b.k}
              </div>
              <div style={{ fontSize: 16, color: 'var(--fg)', marginTop: 6, fontWeight: 500 }}>{b.u}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>{b.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Sección de producto de la home.
 *
 * Sustituye a las cuatro áreas desplegadas en la propia home: ahora muestra el
 * mapa de flujo y las cuatro tarjetas, y cada nodo/tarjeta lleva a su landing
 * interna (`/es/producto/…`, `/en/product/…`), donde vive el contenido en
 * detalle y donde se indexa cada área por separado.
 */
export function ProductAreas() {
  const t = useT();
  const locale = useLocale();
  const product = t<ProductSummary>('product');

  return (
    <section id="producto" className="section" style={{ paddingTop: 60, paddingBottom: 40 }}>
      <div className="container">
        <SectionHead eyebrow={product.home.eyebrow} title={<>{product.home.title}</>} />

        <div style={{ marginBottom: 90 }}>
          <FlowGraph graph={product.graph} locale={locale} />
        </div>

        <div
          className="reveal"
          style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 22 }}
        >
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg)' }}>
            {product.home.detailTitle}
          </h3>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>
            {product.home.detailHint}
          </span>
        </div>

        <AreaCards locale={locale} content={product} />

        <div
          style={{
            marginTop: 16,
            display: 'flex',
            gap: 18,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <p className="mono" style={{ margin: 0, fontSize: 11, letterSpacing: '0.04em', color: 'var(--muted-2)' }}>
            {product.graph.caption}
          </p>
          <Link
            href={productHubPath(locale)}
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {product.labels.areasTitle}
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
