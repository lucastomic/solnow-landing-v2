'use client';
import { useState } from 'react';
import Link from 'next/link';
import { productPath, type ProductGraphContent } from '@/content/products';
import { W, layout, buildEdges, type PlacedNode } from '@/components/product/flowLayout';
import type { Locale } from '@/i18n/config';

/**
 * Mapa de flujo del producto: canales de entrada → cadena de venta → salidas de
 * datos, más un bucle de recuperación que devuelve al canal principal lo que se
 * cae en el cobro.
 *
 * Cada nodo es un enlace real a la landing interna de su área, así que el grafo
 * también es la red de enlaces internos hacia las ocho páginas — son `<a href>`
 * en el HTML del servidor, no elementos que aparezcan al hidratar.
 *
 * La geometría vive en `flowLayout.ts`; aquí solo se pinta.
 */

/**
 * La posición viaja en variables CSS, no en `left`/`top` directos: así la hoja
 * de estilos puede ignorarlas y apilar los nodos en vertical en móvil, donde
 * un lienzo de 1040 px solo se podría ver arrastrando de lado.
 */
function nodeStyle(n: PlacedNode, active: boolean, H: number) {
  const pct = (v: number, total: number) => `${(v / total) * 100}%`;
  return {
    ['--x' as string]: pct(n.x, W),
    ['--y' as string]: pct(n.y, H),
    ['--w' as string]: pct(n.w, W),
    ['--h' as string]: pct(n.h, H),
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    gap: 4,
    padding: '12px 16px',
    borderRadius: 12,
    background: n.kind === 'chain' ? 'var(--accent-bg)' : 'var(--bg)',
    border: '1px ' + (n.kind === 'loop' ? 'dashed' : 'solid'),
    borderColor: active
      ? 'var(--accent)'
      : n.kind === 'chain' || n.kind === 'loop'
        ? 'var(--accent-dim)'
        : 'var(--line)',
    boxShadow: active ? '0 14px 30px -14px var(--accent)' : '0 1px 0 var(--line-soft)',
    transform: active ? 'translateY(-2px)' : 'none',
    transition: 'opacity .22s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease',
    // La opacidad de los nodos apagados va en CSS (`[data-dim]`) y no aquí: en
    // móvil no hay puntero, el `hot` se queda pegado al tocar y la hoja de
    // estilos necesita poder anularla.
  };
}

/** Bandas del grafo, en el orden en que se leen apiladas en móvil. */
const BANDS = [
  { kind: 'channel', label: 'channelsLabel' },
  { kind: 'chain', label: 'flowLabel' },
  { kind: 'out', label: 'outputsLabel' },
  // El bucle de recuperación es opcional: si no hay nodo, la banda no se pinta.
  { kind: 'loop', label: 'loopLabel' },
] as const;

export default function FlowGraph({
  graph,
  locale,
}: {
  graph: ProductGraphContent;
  locale: Locale;
}) {
  const [hot, setHot] = useState<string | null>(null);
  const { H, nodes } = layout(graph);
  const edges = buildEdges(nodes);

  return (
    <div className="reveal">
      <div className="flow-graph-scroll" style={{ paddingBottom: 4 }}>
        <div className="flow-graph-stage" style={{ ['--flow-ratio' as string]: `${W} / ${H}` }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
            aria-hidden
          >
            {edges.map((e, i) => {
              const on = hot ? e.on.includes(hot) : false;
              const feedback = e.kind === 'feedback';
              return (
                <g key={i} style={{ transition: 'opacity .22s ease' }} opacity={hot ? (on ? 1 : 0.18) : feedback ? 0.45 : 0.55}>
                  <path
                    d={e.d}
                    fill="none"
                    stroke={on ? 'var(--accent)' : feedback ? 'var(--muted-2)' : 'var(--line)'}
                    strokeWidth={on ? 1.8 : 1.2}
                    strokeDasharray={feedback ? '7 7' : undefined}
                    strokeLinecap={feedback ? 'round' : undefined}
                  />
                  <path
                    className={feedback ? 'flow-dash-rev' : 'flow-dash'}
                    d={e.d}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.8"
                    strokeDasharray="5 14"
                    opacity={on ? 0.9 : feedback ? 0.28 : 0.35}
                  />
                </g>
              );
            })}
          </svg>

          {BANDS.map(({ kind, label }) => {
            const band = nodes.filter((n) => n.kind === kind);
            if (band.length === 0) return null;
            return (
              <div key={kind} className="flow-band" data-band={kind}>
                <span className="mono flow-band-label">{graph[label]}</span>
                {band.map((n) => {
                  const active = hot === n.id;
                  const linked = hot
                    ? hot === n.id || edges.some((e) => e.on.includes(hot) && e.on.includes(n.id))
                    : true;
                  return (
                    <Link
                      key={n.id}
                      href={productPath(n.area, locale)}
                      onMouseEnter={() => setHot(n.id)}
                      onMouseLeave={() => setHot(null)}
                      onFocus={() => setHot(n.id)}
                      onBlur={() => setHot(null)}
                      className="flow-node"
                      data-dim={!linked || undefined}
                      style={nodeStyle(n, active, H)}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          letterSpacing: '-0.014em',
                          color: 'var(--fg)',
                          lineHeight: 1.2,
                        }}
                      >
                        {n.label}
                      </span>
                      <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.02em' }}>
                        {n.sub}
                      </span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* El `display` va en CSS: en móvil la leyenda se oculta, y un estilo en
          línea le ganaría a la media query. */}
      <div className="mono flow-legend">
        <span>{graph.channelsLabel}</span>
        <span>→ {graph.flowLabel}</span>
        <span>→ {graph.outputsLabel}</span>
        {graph.loop && graph.loopLabel && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <svg width="20" height="8" viewBox="0 0 20 8" aria-hidden>
              <path d="M0 4h20" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 4" strokeLinecap="round" />
            </svg>
            {graph.loopLabel}
          </span>
        )}
      </div>
    </div>
  );
}
