import type { Locale } from '@/i18n/config';
import { getT } from '@/i18n/dictionaries';
import { SectionHead } from '@/components/atoms';
import RevealProvider from '@/components/RevealProvider';
import { AdsHeader, AdsLogos, AdsFooter } from '@/components/ads/AdsChrome';
import { DemoStickyCta } from '@/components/ads/DemoStickyCta';
import { LazyAreaMock } from '@/components/lp/LazyAreaMock';
import { PricingTeaser } from '@/components/sections/SectionsPricing';
import { Marker, MARKER, SHOW_MARKERS } from '@/components/GuidePage';
import { LpDemoBlock, type LpDemoLabels } from '@/components/lp/LpDemoBlock';
import { COMPETITORS, compareRows, solnowRows, type CompetitorKey, type RowKey } from '@/content/competitors';
import { localizedSlugFromSlug } from '@/content/guides';
import { PLANS } from '@/lib/pricingCalc';
import { lpId, type LpPage } from '@/content/lp';
import { ChannelsToChain } from '@/components/narrativa/illustrations';
import Image from 'next/image';
import { CLIENT_LOGOS } from '@/components/sections/clientLogos';
import { UI_ES } from '@/content/narrativa';
import { UI_EN } from '@/content/narrativa.en';

/** Filas de la comparativa breve de las landings de categoría. */
const SHORT_ROWS: RowKey[] = ['walkin', 'contracts', 'liveOps', 'whatsapp', 'pricing'];

/**
 * Plantilla única de las landings de Google Ads (`/[locale]/lp/…`).
 *
 * Una sola acción: reservar demo. Sin `Nav` ni `Footer` completo (cabecera y
 * pie de `AdsChrome`, como `/demo`). Lo único que abre fuera de la página es el
 * enlace a la comparativa completa, en pestaña nueva para no perder esta.
 *
 * Nada con forma de botón que no lo sea: las cifras, etiquetas y titulares son
 * texto plano, y todo lo que lleva estilo de botón hace algo.
 */
export async function LpLanding({ page, locale }: { page: LpPage; locale: Locale }) {
  const t = await getT(locale);
  const id = lpId(page);
  const name = page.template === 'alternativa' ? COMPETITORS[page.competitor].name : '';
  const vars = { name };

  const h1 = page.template === 'categoria' ? t(`lp.pages.${page.key}.h1`) : t('lp.pages.alt.h1', vars);
  const sub = page.template === 'categoria' ? t(`lp.pages.${page.key}.sub`) : t('lp.pages.alt.sub', vars);

  const demo = t<Omit<LpDemoLabels, 'whatsappLabel' | 'whatsappMessage' | 'privacyHref'>>('lp.demo');
  const demoLabels: LpDemoLabels = {
    ...demo,
    whatsappLabel: t('lp.whatsapp.label'),
    whatsappMessage: t('lp.whatsapp.message'),
    privacyHref: `/${locale}/privacy`,
  };

  type Card = { h: string; p: string };
  type Stat = { k: string; u: string; d: string };
  const costs = t<Card[]>('lp.story.problem.costs');
  const how = t<Card[]>('lp.story.how.cards');
  const stats = t<Stat[]>('lp.story.proof.items');
  // La ilustración de la cadena viene del tour `/[locale]/narrativa`, con sus etiquetas por idioma.
  const ill = (locale === 'es' ? UI_ES : UI_EN).ill;
  const expect = t<string[]>('lp.expect.items');
  /** Pantalla de cada fila de «cómo funciona», en el orden de `lp.story.how.cards`. */
  const HOW_MOCKS = ['whatsapp', 'contratos', 'operacion'] as const;
  const eur = new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const pricingFaq = t('lp.pricingFaq', { from: eur.format(PLANS.despegue.monthly.first) });
  const faq = t<{ q: string; a: string; verify?: string }[]>('lp.faq.items').map((f) => ({
    ...f,
    a: f.a === '{pricing}' ? pricingFaq : f.a,
  }));


  return (
    <>
      <RevealProvider />
      <DemoStickyCta label={t('lp.sticky.cta')} note={t('lp.sticky.note')} formLocation={`ads_lp_${id}_sticky`} />
      <AdsHeader />

      <main>
        {/* ── Hero: titular con la keyword y el bloque de demo ───────────────
            En escritorio la demo va a la derecha, a la vista sin scroll; en
            móvil `r-split` la apila justo debajo del titular. */}
        <section id="top" style={{ position: 'relative', paddingTop: 28, paddingBottom: 56, overflow: 'hidden' }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(900px 480px at 80% 0%, rgba(74,144,192,0.16), transparent 60%),' +
                'radial-gradient(700px 400px at 10% 30%, rgba(16,102,149,0.08), transparent 60%)',
            }}
          />
          <div className="container" style={{ position: 'relative' }}>
            <div
              className="r-split"
              // Centrado vertical: el formulario es más alto que el titular, y
              // arriba del todo la columna izquierda se quedaba media vacía.
              style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: 56, alignItems: 'center' }}
            >
              <div>
                <h1 className="h-display" style={{ margin: '0 0 18px', fontSize: 'clamp(32px, 4.2vw, 54px)', lineHeight: 1.05 }}>
                  {h1}
                </h1>
                <p className="lede" style={{ maxWidth: '52ch', margin: 0 }}>{sub}</p>
                {/* Confianza a la vista, como hacen las landings de demo del
                    sector: clientes reales, en pequeño y sin enlaces. */}
                <p className="mono" style={{ margin: '32px 0 12px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>
                  {t('lp.heroTrust')}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 26px' }}>
                  {CLIENT_LOGOS.slice(0, 5).map((l) => (
                    <Image key={l.src} src={l.src} alt={l.alt} width={l.w} height={l.h} unoptimized style={{ height: 30, width: 'auto', maxWidth: 120, objectFit: 'contain', filter: 'grayscale(1)', opacity: 0.7 }} />
                  ))}
                </div>
              </div>
              <div id="agendar" style={{ scrollMarginTop: 16 }}>
                <LpDemoBlock labels={demoLabels} page={id} placement="hero" />
              </div>
            </div>
          </div>
        </section>

        {/* El cuerpo sigue la narrativa comercial (nota «Narrativa (orden
            Kazanjy)» en Obsidian), condensada: problema → por qué lo de hoy no
            alcanza → cómo funciona → prueba → precio. Una idea por bloque y
            solo cifras ya publicadas. En la alternativa, la tabla va primero:
            es lo que vienen a comparar. */}

        {page.template === 'alternativa' && (
          <section className="section" style={{ paddingBlock: 56 }}>
            <div className="container" style={{ maxWidth: 880 }}>
              <SectionHead title={<>{t('lp.compare.tableTitle', vars)}</>} lede={t('lp.story.today.lede')} align="center" compact />
              <CompareTable competitor={page.competitor} locale={locale} />
              <p style={{ margin: '20px 0 0', fontSize: 15.5, color: 'var(--fg-2)', textAlign: 'center' }}>
                {COMPETITORS[page.competitor].migration[locale]}
              </p>
              <MoreLink competitor={page.competitor} locale={locale} label={t('lp.compare.more', vars)} />
            </div>
          </section>
        )}

        {/* ── El problema ──────────────────────────────────────────────── */}
        {page.template === 'categoria' && (
          <section className="section" style={{ paddingBlock: 64 }}>
            <div className="container" style={{ maxWidth: 880 }}>
              <SectionHead title={<>{t('lp.story.problem.title')}</>} lede={t('lp.story.problem.lede')} align="center" compact />
              <ChannelsToChain ill={ill} />
              <div className="r-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 36, textAlign: 'center' }}>
                {costs.map((c, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg)' }}>{c.h}</div>
                    <div style={{ fontSize: 14.5, color: 'var(--muted)', marginTop: 4 }}>{c.p}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Lo que hay hoy no alcanza ────────────────────────────────── */}
        {page.template === 'categoria' && (
          <section className="section" style={{ paddingBlock: 64, background: 'var(--bg-2)', borderBlock: '1px solid var(--line-soft)' }}>
            <div className="container" style={{ maxWidth: 1000 }}>
              <SectionHead title={<>{t('lp.story.today.title')}</>} lede={t('lp.story.today.lede')} align="center" compact />
              <ShortCompare competitors={page.compare} locale={locale} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 24px', justifyContent: 'center' }}>
                {page.compare.map((c) => (
                  <MoreLink key={c} competitor={c} locale={locale} label={t('lp.compare.more', { name: COMPETITORS[c].name })} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Cómo funciona: tres filas, una pantalla del producto en cada una ── */}
        <section className="section" style={{ paddingBlock: 72 }}>
          <div className="container">
            <SectionHead title={<>{t('lp.story.how.title')}</>} align="center" compact />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
              {how.map((c, i) => (
                <div
                  key={i}
                  className="r-split"
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.75fr) minmax(0, 1.25fr)', gap: 48, alignItems: 'center' }}
                >
                  <div style={{ order: i % 2 ? 2 : 1 }}>
                    <h3 className="h-2" style={{ margin: '0 0 10px', fontSize: 'clamp(22px, 2.4vw, 30px)' }}>{c.h}</h3>
                    <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 16.5, lineHeight: 1.6, maxWidth: '40ch' }}>{c.p}</p>
                  </div>
                  <div style={{ order: i % 2 ? 1 : 2, minWidth: 0 }}>
                    <LazyAreaMock areaKey={HOW_MOCKS[i]} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 56 }}>
              <p style={{ margin: 0, fontSize: 15.5, color: 'var(--fg)', fontWeight: 500, textAlign: 'center' }}>{t('lp.story.how.install')}</p>
              <a className="btn btn-primary" href="#agendar">{t('lp.cta')}</a>
            </div>
          </div>
        </section>

        {/* ── Prueba ───────────────────────────────────────────────────── */}
        <AdsLogos title={t('lp.proof.logosTitle')} />
        <section className="section" style={{ paddingTop: 28, paddingBottom: 56 }}>
          <div className="container">
            <div
              className="r-cols-4"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1,
                border: '1px solid var(--line-soft)',
                borderRadius: 16,
                overflow: 'hidden',
                background: 'var(--line-soft)',
              }}
            >
              {stats.map((b, i) => (
                <div key={i} style={{ padding: '22px 20px', background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 'clamp(28px, 2.8vw, 38px)', lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 500, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                    {b.k}
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--fg)', fontWeight: 500 }}>{b.u}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{b.d}</div>
                </div>
              ))}
            </div>
            <p className="mono" style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--muted-2)', textAlign: 'center' }}>{t('lp.story.proof.note')}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
              <a className="btn btn-primary" href="#agendar">{t('lp.cta')}</a>
            </div>
          </div>
        </section>

        {/* ── 6 · Precio, de la misma fuente que /precios ──────────────── */}
        <PricingTeaser locale={locale} eyebrow={t('lp.pricing.eyebrow')} cta={{ href: '#agendar', label: t('lp.pricing.cta') }} />

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="section" style={{ paddingBlock: 56 }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <SectionHead title={<>{t('lp.faq.title')}</>} align="center" compact />
            {faq.map((f, i) => (
              <div key={i} style={{ borderTop: '1px solid var(--line-soft)', padding: '20px 0' }}>
                <h3 className="h-3" style={{ margin: '0 0 8px', fontSize: 18 }}>{f.q}</h3>
                {f.verify && <Marker label={MARKER.verify} text={f.verify} />}
                <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.65 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Demo otra vez ────────────────────────────────────────────── */}
        {/* `id="cierre"`: lo observa `DemoStickyCta` para esconderse aquí. */}
        <section id="cierre" className="section" style={{ paddingBlock: 72, background: 'var(--bg-2)', borderTop: '1px solid var(--line-soft)' }}>
          <div className="container">
            <div className="r-split" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.9fr)', gap: 56, alignItems: 'center' }}>
              <div>
                <h2 className="h-1" style={{ margin: '0 0 24px' }}>{t('lp.final.title')}</h2>
                <p className="mono" style={{ margin: '0 0 14px', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {t('lp.expect.title')}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {expect.map((e) => (
                    <li key={e} style={{ display: 'flex', gap: 12, alignItems: 'baseline', fontSize: 17, color: 'var(--fg)' }}>
                      <span aria-hidden style={{ color: 'var(--accent)', fontWeight: 600 }}>✓</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
              <LpDemoBlock labels={demoLabels} page={id} placement="final" />
            </div>
          </div>
        </section>
      </main>

      <AdsFooter locale={locale} />
    </>
  );
}

/** Tabla Solnow frente a un competidor (plantilla alternativa). */
function CompareTable({ competitor, locale }: { competitor: CompetitorKey; locale: Locale }) {
  const rows = compareRows(competitor, locale);
  return (
    <div className="r-cmp-wrap">
      <table className="r-cmp-row" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={TH} />
            <th style={{ ...TH, color: 'var(--accent)', background: 'var(--accent-bg)', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>Solnow</th>
            <th style={TH}>{COMPETITORS[competitor].name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td style={{ ...TD, color: 'var(--muted)', fontWeight: 500 }}>{r.label}</td>
              <td style={{ ...TD, color: 'var(--fg)', background: 'var(--accent-bg)', fontWeight: 500 }}>{r.solnow}</td>
              <td style={TD}>
                {r.verify && SHOW_MARKERS && <Marker label={MARKER.verify} text={r.verify} />}
                {r.them}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Comparativa breve: Solnow frente a varios competidores en pocas filas. */
function ShortCompare({ competitors, locale }: { competitors: CompetitorKey[]; locale: Locale }) {
  const rows = solnowRows(SHORT_ROWS, locale);
  const byCompetitor = Object.fromEntries(
    competitors.map((c) => [c, Object.fromEntries(compareRows(c, locale, SHORT_ROWS).map((r) => [r.key, r]))]),
  );
  return (
    <div className="r-cmp-wrap">
      <table className="r-cmp-row" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14.5, tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={TH} />
            <th style={{ ...TH, color: 'var(--accent)', background: 'var(--accent-bg)', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>Solnow</th>
            {competitors.map((c) => (
              <th key={c} style={TH}>{COMPETITORS[c].name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td style={{ ...TD, color: 'var(--muted)', fontWeight: 500 }}>{r.label}</td>
              <td style={{ ...TD, color: 'var(--fg)', background: 'var(--accent-bg)', fontWeight: 500 }}>{r.solnow}</td>
              {competitors.map((c) => {
                const cell = byCompetitor[c][r.key];
                return (
                  <td key={c} style={TD}>
                    {cell?.verify && SHOW_MARKERS && <Marker label={MARKER.verify} text={cell.verify} />}
                    {cell?.them ?? '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Enlace a la comparativa completa publicada, en pestaña nueva: es la única
 * salida de la página aparte de las legales, y no debe cerrar la landing.
 * Bókun no tiene comparativa publicada, así que no lleva enlace.
 */
function MoreLink({ competitor, locale, label }: { competitor: CompetitorKey; locale: Locale; label: string }) {
  const slug = COMPETITORS[competitor].vsSlug;
  if (!slug) return null;
  return (
    <p style={{ margin: '14px 0 0', textAlign: 'center' }}>
      <a
        className="footer-link"
        href={`/${locale}/${localizedSlugFromSlug(slug, locale)}`}
        target="_blank"
        rel="noopener"
        style={{ fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        {label} ↗
      </a>
    </p>
  );
}

const TH: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 14px',
  borderBottom: '1px solid var(--line)',
  fontWeight: 600,
  color: 'var(--fg)',
};
const TD: React.CSSProperties = {
  padding: '12px 14px',
  borderBottom: '1px solid var(--line-soft)',
  color: 'var(--fg-2)',
  verticalAlign: 'top',
};
