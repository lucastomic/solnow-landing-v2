'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductKey } from '@/content/products';
import { ZoomOverlay, type ZoomArea } from '@/components/narrativa/ZoomOverlay';
import FlowGraph from '@/components/product/FlowGraph';
import { W as GRAPH_W, computeHeight } from '@/components/product/flowLayout';
import type { ProductGraphContent } from '@/content/products';
import type { StoryStep } from '@/content/narrativa';
import type { Locale } from '@/i18n/config';
import { NumLabel } from '@/components/atoms';
import { rich } from '@/components/narrativa/rich';

/**
 * «Cómo funciona», contado sobre el grafo.
 *
 * El grafo se queda clavado en pantalla mientras el visitante hace scroll.
 * Debajo, en el flujo, hay un centinela invisible por paso; cuando uno cruza
 * la mitad de la pantalla, su paso pasa a ser el activo: el texto entra por
 * el lado que le toca, el grafo se comprime hacia el otro y se encienden los
 * nodos de los que habla el texto (los mismos que se encenderían al pasar el
 * ratón por encima).
 *
 * Antes del primer centinela el grafo está solo y a todo el ancho: es el mapa
 * completo, y después cada paso lo lee por partes.
 *
 * En móvil (CSS) no hay lado: el titular va primero en el flujo, el grafo
 * compacto se queda pegado bajo el logo y los pasos son bloques normales que
 * pasan por debajo; el que cruza la línea activa es el que enciende sus nodos.
 * El mismo observer sirve a los dos mundos: los centinelas de escritorio y los
 * bloques de móvil llevan `data-story-step`, y lo que está en `display:none`
 * nunca interseca.
 */
export function FlowStory({
  graph,
  locale,
  intro,
  steps,
  areas,
  zoom,
}: {
  graph: ProductGraphContent;
  locale: Locale;
  intro: { title: string; sub?: string };
  steps: StoryStep[];
  /** Ficha de cada área, para el zoom sobre los nodos. */
  areas: Record<ProductKey, ZoomArea>;
  zoom: { close: string; hint: string; nodeAria: string };
}) {
  const [active, setActive] = useState(-1);
  const [zoomed, setZoom] = useState<ProductKey | null>(null);
  const closeZoom = useCallback(() => setZoom(null), []);
  const box = useRef<HTMLDivElement>(null);

  // El lienzo del grafo mide siempre GRAPH_W px y se escala a la caja con
  // `transform`, texto incluido. Así nunca se corta ni reflowa: al comprimir
  // la caja, el grafo entero se hace pequeño. El observer sigue a la
  // transición de anchura y va actualizando la escala fotograma a fotograma.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      el.style.setProperty('--story-scale', String(e.contentRect.width / GRAPH_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const graphH = computeHeight(graph);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-story-step]'));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Una franja de 1px al 62% de la pantalla: el paso activo es el
        // elemento que la cubre. En escritorio los centinelas miden una
        // pantalla y da igual dónde esté la línea; en móvil el grafo fijo ocupa
        // el tercio superior, así que la línea va por debajo de él. Al salir el
        // último por arriba se queda el último; al salir el primero por abajo,
        // ninguno (el grafo entero).
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.storyStep);
          if (e.isIntersecting) setActive(i);
        }
      },
      { rootMargin: '-62% 0px -38% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = active >= 0 ? steps[active] : null;
  const side = step ? 'right' : 'none';

  const stepBody = (st: StoryStep) => (
    <>
      <h3 className="h-2" style={{ margin: '12px 0 14px', fontSize: 'clamp(24px, 2.6vw, 34px)' }}>
        {st.title}
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {st.bullets.map((b, j) => (
          <li key={j} className="tour-rich" style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--fg-2)' }}>
            {rich(b)}
          </li>
        ))}
      </ul>
      {st.callout && (
        <p className="serif" style={{ margin: '22px 0 0', fontSize: 'clamp(19px, 1.8vw, 24px)', lineHeight: 1.3 }}>
          {st.callout}
        </p>
      )}
    </>
  );

  return (
    <div className="tour-story">
      {zoomed && <ZoomOverlay areaKey={zoomed} area={areas[zoomed]} labels={zoom} onClose={closeZoom} />}
      {/* Móvil: el titular va en el flujo, antes del grafo fijo. */}
      <div className="tour-story-intro-flow container">
        <h3 className="h-1" style={{ margin: 0, fontSize: 'clamp(26px, 3.2vw, 42px)' }}>
          {intro.title}
        </h3>
        {intro.sub && (
          <p className="lede" style={{ marginTop: 10 }}>
            {rich(intro.sub)}
          </p>
        )}
      </div>
      <div className="tour-story-panel" data-side={side}>
        <div className="tour-story-intro container" data-on={active < 0 || undefined} aria-hidden={active >= 0}>
          <h3 className="h-1" style={{ margin: 0, fontSize: 'clamp(26px, 3.2vw, 42px)' }}>
            {intro.title}
          </h3>
          {intro.sub && (
            <p className="lede" style={{ marginTop: 10 }}>
              {rich(intro.sub)}
            </p>
          )}
        </div>
        <div className="tour-story-graph" ref={box} style={{ ['--graph-ratio' as string]: `${GRAPH_W} / ${graphH}` }}>
          <div className="tour-story-canvas" style={{ width: GRAPH_W }}>
            <FlowGraph graph={graph} locale={locale} plain highlight={step?.nodes ?? []} onSelect={(area) => setZoom(area)} zoomLabel={zoom.nodeAria} />
          </div>
        </div>
        <div className="tour-story-text" aria-live="polite">
          {steps.map((st, i) => (
            <div key={i} className="tour-story-step" data-on={i === active || undefined} aria-hidden={i !== active}>
              <NumLabel n={i + 1} of={steps.length} />
              {stepBody(st)}
            </div>
          ))}
        </div>
      </div>
      {/* Móvil: los pasos como bloques en el flujo, bajo el grafo fijo. El que
          cruza la línea activa enciende sus nodos; el resto se atenúa. */}
      <div className="tour-story-steps container">
        {steps.map((st, i) => (
          <div key={i} className="tour-story-block" data-story-step={i} data-on={i === active || undefined}>
            <NumLabel n={i + 1} of={steps.length} />
            {stepBody(st)}
          </div>
        ))}
      </div>
      {/* Escritorio. Centinelas: la entrada (grafo entero) y uno por paso, cada
          uno una pantalla de recorrido. El teclado del tour también para en
          ellos (clase `tour-stop`). El primero se solapa con el hueco que el
          panel ocupa en el flujo (margen negativo en CSS), para que la entrada
          no dure dos pantallas. */}
      <div className="tour-stop tour-story-sentinel" data-story-step={-1} aria-hidden />
      {steps.map((_, i) => (
        <div key={i} className="tour-stop tour-story-sentinel" data-story-step={i} aria-hidden />
      ))}
    </div>
  );
}
