import FlowGraph from '@/components/product/FlowGraph';
import { W as GRAPH_W, computeHeight } from '@/components/product/flowLayout';
import { NumLabel } from '@/components/atoms';
import { rich } from '@/components/narrativa/rich';
import type { ProductGraphContent } from '@/content/products';
import type { StoryStep } from '@/content/narrativa';
import type { Locale } from '@/i18n/config';

/**
 * «Cómo funciona» para el PDF. El relato sobre el grafo vive del scroll y no
 * se puede imprimir, así que aquí va en páginas: el grafo entero con el
 * titular, y una por paso con el texto al lado y sus nodos encendidos.
 *
 * En pantalla no se ve (`.tour-print-only`). Todas las páginas llevan el id de
 * la diapositiva del relato: el presentador las oculta con ella.
 */
export function StoryPrint({
  graph,
  locale,
  intro,
  steps,
  slideId,
  level,
}: {
  graph: ProductGraphContent;
  locale: Locale;
  intro: { title: string; sub?: string };
  steps: StoryStep[];
  slideId: string;
  level: number;
}) {
  const graphH = computeHeight(graph);
  const pages: { nodes: string[]; body: React.ReactNode }[] = [
    {
      nodes: [],
      body: (
        <>
          <h3 className="h-1" style={{ margin: 0, fontSize: 30 }}>
            {intro.title}
          </h3>
          {intro.sub && (
            <p className="lede" style={{ marginTop: 10, fontSize: 16 }}>
              {rich(intro.sub)}
            </p>
          )}
        </>
      ),
    },
    ...steps.map((st, i) => ({
      nodes: st.nodes,
      body: (
        <>
          <NumLabel n={i + 1} of={steps.length} />
          <h3 className="h-2" style={{ margin: '10px 0 12px', fontSize: 24 }}>
            {st.title}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {st.bullets.map((b, j) => (
              <li key={j} className="tour-rich" style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg-2)' }}>
                {rich(b)}
              </li>
            ))}
          </ul>
          {st.callout && (
            <p className="serif" style={{ margin: '16px 0 0', fontSize: 18, lineHeight: 1.3 }}>
              {st.callout}
            </p>
          )}
        </>
      ),
    })),
  ];
  return (
    <>
      {pages.map((pg, i) => (
        <article key={i} className="tour-slide tour-print-only" data-slide-id={slideId} data-level={level} aria-hidden>
          <div className="tour-print-story">
            <div className="tour-print-box" style={{ ['--graph-ratio' as string]: `${GRAPH_W} / ${graphH}` }}>
              <div className="tour-print-canvas" style={{ width: GRAPH_W, transform: `scale(${(604.7 / GRAPH_W).toFixed(4)})` }}>
                <FlowGraph graph={graph} locale={locale} plain highlight={pg.nodes} />
              </div>
            </div>
            <div>{pg.body}</div>
          </div>
        </article>
      ))}
    </>
  );
}
