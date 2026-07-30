import Link from 'next/link';
import { Footer } from '@/components/sections/SectionsEnd';
import RevealProvider from '@/components/RevealProvider';
import { BulletList } from '@/components/atoms';
import { AreaMock, AreaMockSecondary } from '@/components/product/mocks';
import { hasSecondaryMock } from '@/components/product/secondaryMocks';
import { ARROW, AreaCards, Breadcrumb, ProductCta, ProductHeader } from '@/components/product/ProductChrome';
import { getProductArea } from '@/lib/getProduct';
import { productByKey, productHubPath, type ProductBlock, type ProductKey } from '@/content/products';
import { localizedSlugFromSlug } from '@/content/guides';
import type { Locale } from '@/i18n/config';

/**
 * Landing interna de una de las cuatro áreas de producto.
 *
 * Cada área es una URL propia e indexable con su H1, su copy y sus FAQ; el
 * mockup interactivo acompaña, pero no sustituye al texto. Al pie enlaza con
 * las otras tres áreas y con las guías de recursos relacionadas para que el
 * enlazado interno no sea un callejón sin salida.
 */

function Block({ block }: { block: ProductBlock }) {
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
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: '4px 0 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {block.items.map((item, j) => (
        <li
          key={j}
          style={{
            fontSize: 15.5,
            lineHeight: 1.6,
            color: 'var(--fg-2)',
            display: 'grid',
            gridTemplateColumns: '28px 1fr',
            gap: 14,
            alignItems: 'start',
          }}
        >
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

export default async function ProductLanding({
  areaKey,
  locale,
}: {
  areaKey: ProductKey;
  locale: Locale;
}) {
  const { area, shared } = await getProductArea(locale, areaKey);
  const { labels, cta } = shared;
  const meta = productByKey(areaKey);

  return (
    <>
      <RevealProvider />
      <ProductHeader locale={locale} labels={labels} cta={cta} />

      <main>
        {/* Hero */}
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
          <div className="container" style={{ position: 'relative', paddingBlock: '40px 64px' }}>
            <Breadcrumb locale={locale} labels={labels} current={area.card.title} />
            {/* Titular y mockup juntos: lo primero que se ve es qué es y qué
                aspecto tiene. El texto sigue yendo antes en el HTML. */}
            <div className="r-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
              <div>
                <span className="chip chip-accent">
                  {meta.n} · {area.hero.eyebrow}
                </span>
                <h1 className="h-display" style={{ fontSize: 'clamp(32px, 4.6vw, 54px)', margin: '20px 0 20px' }}>
                  {area.hero.h1}
                </h1>
                <p className="lede" style={{ maxWidth: '52ch' }}>{area.hero.lede}</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
                  <a className="btn btn-primary" href={`/${locale}#cta`}>
                    {cta.button}
                    {ARROW}
                  </a>
                  <Link className="btn btn-secondary" href={productHubPath(locale)}>
                    {labels.backToProduct}
                  </Link>
                </div>
              </div>
              <div className="hero-rise" style={{ ['--reveal-delay' as string]: '140ms', minWidth: 0 }}>
                <AreaMock areaKey={areaKey} />
              </div>
            </div>
          </div>
        </section>

        {/* Qué resuelve el área, con la segunda pantalla del área si la tiene */}
        <section className="container" style={{ paddingBlock: 'clamp(48px, 6vw, 80px)' }}>
          {hasSecondaryMock(areaKey) ? (
            /* `r-media-first` invierte las columnas solo en escritorio: en el
               HTML el encabezado sigue yendo antes que el mockup, que es como
               debe apilarse en móvil y como se lee la página. */
            <div className="r-split r-media-first" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
              <div className="reveal">
                <h2 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', marginBottom: 20 }}>
                  {labels.inThisPage}
                </h2>
                <BulletList items={area.bullets} />
              </div>
              <div className="reveal" style={{ ['--reveal-delay' as string]: '140ms', minWidth: 0 }}>
                <AreaMockSecondary areaKey={areaKey} />
              </div>
            </div>
          ) : (
            <div className="reveal" style={{ maxWidth: 760 }}>
              <h2 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', marginBottom: 20 }}>
                {labels.inThisPage}
              </h2>
              <BulletList items={area.bullets} />
            </div>
          )}
        </section>

        {/* Cuerpo indexable */}
        <section className="container" style={{ paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
          <article style={{ maxWidth: 760 }}>
            {area.sections.map((s, i) => (
              <section key={i} style={{ marginBottom: 44 }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 12 }}>
                  {String(i + 1).padStart(2, '0')}
                  <span style={{ color: 'var(--muted-2)' }}> / {String(area.sections.length).padStart(2, '0')}</span>
                </div>
                <h2 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 28px)', marginBottom: 16 }}>{s.h}</h2>
                {s.blocks.map((b, j) => (
                  <Block key={j} block={b} />
                ))}
              </section>
            ))}

            {area.faq.length > 0 && (
              <section style={{ marginTop: 24 }}>
                <h2 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 28px)', marginBottom: 20 }}>{labels.faqTitle}</h2>
                <div style={{ borderTop: '1px solid var(--line-soft)' }}>
                  {area.faq.map((item, i) => (
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
          </article>
        </section>

        {/* Otras áreas */}
        <section className="container" style={{ paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
          <h2 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 28px)', marginBottom: 22 }}>{labels.otherAreasTitle}</h2>
          <AreaCards locale={locale} content={shared} exclude={areaKey} />
        </section>

        {/* Guías relacionadas */}
        {area.guides.length > 0 && (
          <section className="container" style={{ paddingBottom: 'clamp(40px, 5vw, 72px)' }}>
            <h2 className="h-3" style={{ marginBottom: 18 }}>{labels.guidesTitle}</h2>
            <div className="r-split" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {area.guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/${locale}/${localizedSlugFromSlug(g.slug, locale)}`}
                  className="card card-lift"
                  style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, color: 'var(--fg)' }}
                >
                  <span style={{ fontSize: 15.5, lineHeight: 1.4, fontWeight: 500 }}>{g.label}</span>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{ARROW}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ProductCta locale={locale} cta={cta} />
      </main>

      <Footer locale={locale} />
    </>
  );
}
