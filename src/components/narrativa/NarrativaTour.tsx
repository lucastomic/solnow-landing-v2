import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import { getNarrativa, type Chapter, type Level, type NarrativaUI, type Slide } from '@/content/narrativa';
import { PresenterMode, type ManifestChapter } from '@/components/narrativa/PresenterMode';
import { getProductContent } from '@/lib/getProduct';
import { getT } from '@/i18n/dictionaries';
import type { CalcCopy } from '@/components/sections/PricingCalculator';
import RevealProvider from '@/components/RevealProvider';
import { AdsHeader } from '@/components/ads/AdsChrome';
import { NarrativaRail } from '@/components/narrativa/NarrativaRail';
import { CaseSlide, ChainsSlide, FeatureSlide, FigureSlide, LogosSlide, OverviewSlide, PriceSlide, TitleSlide } from '@/components/narrativa/slides';
import { FlowStory } from '@/components/narrativa/FlowStory';
import { StoryPrint } from '@/components/narrativa/StoryPrint';
import type { ZoomArea } from '@/components/narrativa/ZoomOverlay';
import { PRODUCTS, type ProductKey } from '@/content/products';

/**
 * El tour de la narrativa: un capítulo por bloque de la narrativa comercial,
 * cada uno con sus diapositivas a pantalla completa, y la frase al final.
 *
 * Es un deck cerrado: cabecera con el logo sin enlace, sin nav, sin footer y
 * sin ningún `<a>` en la página. Quien lo recorre lo hace de arriba abajo
 * (o con las flechas), y el índice lateral le dice por dónde va.
 *
 * El grafo de flujo del capítulo 6 es el mismo del hub de producto, en modo
 * `plain`, así que su copy sale del diccionario y no se duplica aquí.
 */
export async function NarrativaTour({ locale }: { locale: Locale }) {
  const { chapters: CHAPTERS, appendix: APPENDIX, storyLoop, ui } = await getNarrativa(locale);
  const { graph: hubGraph, areas: hubAreas } = await getProductContent(locale);
  // La calculadora de precio del modal usa el copy de `/precios`, resuelto aquí.
  const t = await getT(locale);
  const pricing = {
    copy: t<CalcCopy>('pricing.calc'),
    locale,
    billingLabels: { monthly: t('pricing.billingMonthly'), season: t('pricing.billingSeason') },
    ui: ui.pricing,
    calcUi: ui.calc,
    labels: ui.price,
  };
  // Ficha de cada área para el zoom sobre los nodos: titular, entradilla y
  // viñetas de su página de producto. Nada que redactar aparte.
  // Las dos áreas con foto real del sistema en uso la enseñan antes que el mock.
  const photos: Partial<Record<ProductKey, ZoomArea['photo']>> = {
    tpv: { src: '/assets/tpv-mostrador.jpg', alt: 'El TPV de SolNow en un mostrador, cobrando una reserva', w: 1680, h: 916 },
    operacion: {
      src: '/assets/operacion-tiempo-real.jpg',
      alt: 'La pizarra de operación en tiempo real en la pantalla de una base',
      w: 1680,
      h: 916,
    },
  };
  const areas = Object.fromEntries(
    PRODUCTS.map((a) => {
      const c = hubAreas[a.key];
      return [
        a.key,
        { eyebrow: c.hero.eyebrow, title: c.hero.h1, lede: c.hero.lede, bullets: c.bullets, photo: photos[a.key] },
      ];
    }),
  ) as Record<ProductKey, ZoomArea>;
  // El mismo grafo del hub, con el bucle del persigue que el hub aún no pinta.
  const graph = { ...hubGraph, ...storyLoop };
  const rail = CHAPTERS.map((c) => ({ id: c.id, label: c.label }));

  // Manifiesto para el modo presentador: cada diapositiva con su id, su rótulo
  // y su nivel. Los ids son estables (capítulo + posición) y viajan en la URL.
  const manifest: ManifestChapter[] = [
    { id: 'portada', label: ui.presenter.labels.cover, slides: [{ id: 'portada-0', label: 'SolNow', level: 0 as Level }] },
    ...CHAPTERS.map((c) => ({ id: c.id, label: c.label, slides: c.slides.map((sl, i) => ({ id: slideId(c, i), label: slideLabel(sl, ui), level: slideLevel(sl) })) })),
    ...APPENDIX.map((c) => ({ id: c.id, label: c.label, appendix: true, slides: c.slides.map((sl, i) => ({ id: slideId(c, i), label: slideLabel(sl, ui), level: slideLevel(sl) })) })),
  ];

  return (
    <>
      <RevealProvider />
      <PresenterMode manifest={manifest} ui={ui.presenter} locale={locale} />
      <NarrativaRail chapters={rail} appendixId={APPENDIX[0]?.id} labels={ui.rail} />

      <div className="tour-brand">
        <AdsHeader />
      </div>

      <main className="tour">
        {/* Portada: la marca, la categoría y la promesa. Fuera del índice. */}
        <section id="portada" className="tour-chapter" data-chapter="0">
          <article className="tour-slide tour-stop tour-cover" data-first data-slide-id="portada-0" data-level={0}>
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background:
                  'radial-gradient(900px 480px at 80% 0%, rgba(74,144,192,0.18), transparent 60%),' +
                  'radial-gradient(700px 400px at 10% 30%, rgba(16,102,149,0.10), transparent 60%)',
              }}
            />
            <div aria-hidden className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.5, maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)' }} />
            <div className="container hero-rise" style={{ position: 'relative', textAlign: 'center' }}>
              <Image
                src="/hollow_logo_name_color.webp"
                alt="SolNow"
                width={5918}
                height={1024}
                priority
                sizes="(max-width: 768px) 80vw, 520px"
                style={{ width: 'min(520px, 80vw)', height: 'auto', margin: '0 auto 40px' }}
              />
              <h1 className="h-display" style={{ margin: '0 auto', maxWidth: '22ch', fontSize: 'clamp(30px, 4vw, 54px)' }}>
                {emphasise(ui.cover.title, ui.cover.em)}
              </h1>
              <p className="lede" style={{ margin: '24px auto 0', maxWidth: '48ch' }}>
                {ui.cover.lede}
              </p>
            </div>
          </article>
        </section>

        {CHAPTERS.map((ch, ci) => renderChapter(ch, ci + 1, false))}

        {/* Apéndice: lo que se pregunta dos veces. Fuera del índice, después
            del cierre; se salta aquí si el prospecto lo pide. */}
        {APPENDIX.length > 0 && (
          <div className="tour-appendix-sep container" aria-hidden>
            <span className="mono">{ui.rail.appendix}</span>
          </div>
        )}
        {APPENDIX.map((ch) => renderChapter(ch, ui.rail.appendix, false, true))}
      </main>
    </>
  );

  /** Un capítulo: su sección y sus diapositivas, numerado o de apéndice. */
  function renderChapter(ch: Chapter, n: number | string, isFirst: boolean, appendix = false) {
    return (
      <section key={ch.id} id={ch.id} className="tour-chapter" data-chapter={n} data-appendix={appendix || undefined}>
        {ch.slides.map((s, si) => {
          const first = isFirst && si === 0;
          // El relato sobre el grafo se pinta a sí mismo (sticky + centinelas):
          // no cabe en una diapositiva de altura fija con overflow oculto.
          if (s.kind === 'story') {
            return (
              <article key={si} className="tour-story-slide" data-slide-id={slideId(ch, si)} data-level={slideLevel(s)}>
                <FlowStory graph={graph} locale={locale} intro={s.intro} steps={s.steps} areas={areas} zoom={ui.zoom} />
                {/* Solo para el PDF: el relato en páginas. */}
                <StoryPrint graph={graph} locale={locale} intro={s.intro} steps={s.steps} slideId={slideId(ch, si)} level={slideLevel(s)} />
              </article>
            );
          }
          return (
            <article key={si} className="tour-slide tour-stop" data-first={first || undefined} data-slide-id={slideId(ch, si)} data-level={slideLevel(s)}>
              {first && (
                <>
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      background:
                        'radial-gradient(900px 480px at 80% 0%, rgba(74,144,192,0.18), transparent 60%),' +
                        'radial-gradient(700px 400px at 10% 30%, rgba(16,102,149,0.10), transparent 60%)',
                    }}
                  />
                  <div
                    aria-hidden
                    className="dotgrid"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0.5,
                      maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)',
                    }}
                  />
                </>
              )}
              {s.kind === 'title' && <TitleSlide slide={s} n={n} label={ch.label} first={first} />}
              {s.kind === 'overview' && <OverviewSlide slide={s} />}
              {s.kind === 'feature' && <FeatureSlide slide={s} graph={graph} locale={locale} ill={ui.ill} />}
              {s.kind === 'chains' && <ChainsSlide slide={s} calcUi={ui.calc} />}
              {s.kind === 'figure' && <FigureSlide slide={s} />}
              {s.kind === 'case' && <CaseSlide slide={s} />}
              {s.kind === 'logos' && <LogosSlide slide={s} inProduction={ui.logos.inProduction} />}
              {s.kind === 'price' && <PriceSlide slide={s} pricing={pricing} />}
            </article>
          );
        })}
      </section>
    );
  }
}

/** Id estable de una diapositiva: capítulo y posición. */
function slideId(ch: Chapter, i: number) {
  return `${ch.id}-${i}`;
}

/** Sin nivel explícito, una portada es 0 y el resto 1. */
function slideLevel(s: Slide): Level {
  return s.level ?? (s.kind === 'title' ? 0 : 1);
}

/** Titular con un tramo en cursiva de marca. */
function emphasise(title: string, em: string) {
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

/** Rótulo corto para el panel del presentador. */
function slideLabel(s: Slide, ui: NarrativaUI): string {
  switch (s.kind) {
    case 'title':
      return ui.presenter.labels.cover;
    case 'story':
      return s.intro.title;
    case 'case':
      return s.name;
    case 'logos':
      return ui.presenter.labels.logos;
    default:
      return s.title;
  }
}
