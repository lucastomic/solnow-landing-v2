import { Footer } from '@/components/sections/SectionsEnd';
import RevealProvider from '@/components/RevealProvider';
import FlowGraph from '@/components/product/FlowGraph';
import { AreaCards, Breadcrumb, ProductCta, ProductHeader } from '@/components/product/ProductChrome';
import { getProductContent } from '@/lib/getProduct';
import type { Locale } from '@/i18n/config';

/**
 * Hub de producto (`/es/producto`, `/en/product`).
 *
 * Es la página padre de las cuatro landings de área: repite el mapa de flujo de
 * la home y enlaza cada nodo y cada tarjeta con su ficha, de modo que el
 * crawler llega a las cuatro desde un único salto.
 */
export default async function ProductHub({ locale }: { locale: Locale }) {
  const content = await getProductContent(locale);
  const { hero, labels, cta, graph } = content;

  return (
    <>
      <RevealProvider />
      <ProductHeader locale={locale} labels={labels} cta={cta} />

      <main>
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
            <Breadcrumb locale={locale} labels={labels} />
            <div style={{ maxWidth: 780 }}>
              <span className="chip">{hero.eyebrow}</span>
              <h1 className="h-display" style={{ fontSize: 'clamp(32px, 4.6vw, 54px)', margin: '20px 0 20px' }}>
                {hero.h1}
              </h1>
              <p className="lede" style={{ maxWidth: '62ch' }}>{hero.lede}</p>
            </div>
          </div>
        </section>

        <section className="section container" style={{ paddingBlock: 'clamp(48px, 6vw, 80px)' }}>
          <FlowGraph graph={graph} locale={locale} />

          <div
            style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', margin: '72px 0 24px' }}
          >
            <h2 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', margin: 0 }}>{labels.areasTitle}</h2>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>
              {content.home.detailHint}
            </span>
          </div>
          <AreaCards locale={locale} content={content} />
          <p className="mono" style={{ marginTop: 16, fontSize: 11, letterSpacing: '0.04em', color: 'var(--muted-2)' }}>
            {graph.caption}
          </p>
        </section>

        <ProductCta locale={locale} cta={cta} />
      </main>

      <Footer />
    </>
  );
}
