/**
 * Geometría del mapa de flujo de producto.
 *
 * Módulo puro y determinista (sin React, sin `Date`/`Math.random`): las
 * posiciones se calculan a partir del número de nodos de cada banda en lugar de
 * leerse de arrays literales, de modo que añadir un canal, un eslabón o una
 * salida no obliga a recolocar nada a mano. `FlowGraph.tsx` solo pinta.
 *
 * Sistema de coordenadas: un viewBox de `W` × `H` unidades. Los nodos se
 * posicionan en porcentaje sobre un contenedor con `aspectRatio: W/H`, así que
 * `H` puede crecer sin tocar el CSS.
 */

import type { ProductGraphContent, ProductGraphNode } from '@/content/products';

export const W = 1180;
const H_MIN = 420;
const PAD_Y = 20;

const CHANNEL = { x: 0, w: 190, h: 62, minGap: 30 };
const OUT = { x: 930, w: 230, h: 90, minGap: 32 };
const CHAIN = { x0: 290, x1: 870, h: 72, gap: 60, minW: 110 };
const LOOP = { w: 300, h: 64, gapTop: 46 };

/** Pasillo vertical libre entre la columna de canales y la cadena. */
const GUTTER = (CHANNEL.x + CHANNEL.w + CHAIN.x0) / 2;
/** Aire por encima y por debajo de la cadena para que quepan las Bézier. */
const EDGE_ROOM = 60;

/** Rangos que el layout sabe repartir sin que las cajas se pisen. */
const CAPACITY = {
  channels: { min: 1, max: 5 },
  chain: { min: 1, max: 4 },
  outputs: { min: 1, max: 3 },
} as const;

export type NodeKind = 'channel' | 'chain' | 'out' | 'loop';

export type PlacedNode = ProductGraphNode & {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: NodeKind;
};

export type Edge = {
  d: string;
  /** Ids de los dos nodos que une; alimenta el resaltado por hover/focus. */
  on: string[];
  kind: 'flow' | 'feedback';
};

function clampBand<T>(
  nodes: readonly T[],
  { min, max }: { min: number; max: number },
  name: string,
): T[] {
  if (process.env.NODE_ENV !== 'production' && (nodes.length < min || nodes.length > max)) {
    console.warn(`[FlowGraph] ${name}: ${nodes.length} nodos (soportado ${min}–${max})`);
  }
  return nodes.slice(0, max);
}

/** Alto necesario para apilar `n` cajas de alto `h` con separación mínima `gap`. */
function stackNeed(n: number, h: number, gap: number): number {
  return n <= 0 ? 0 : 2 * PAD_Y + n * h + (n - 1) * gap;
}

export function computeHeight(graph: ProductGraphContent): number {
  const chainStack = CHAIN.h + (graph.loop ? LOOP.gapTop + LOOP.h : 0);
  return Math.max(
    H_MIN,
    stackNeed(graph.channels.length, CHANNEL.h, CHANNEL.minGap),
    stackNeed(graph.outputs.length, OUT.h, OUT.minGap),
    2 * PAD_Y + chainStack + 2 * EDGE_ROOM,
  );
}

/** Borde superior de la caja `i` de `n`, repartidas de extremo a extremo. */
function spreadY(i: number, n: number, h: number, H: number): number {
  if (n <= 1) return (H - h) / 2;
  const span = H - 2 * PAD_Y - h;
  return PAD_Y + (span * i) / (n - 1);
}

/** Reparto horizontal del eslabón `i` de `n` dentro de la banda central. */
function chainSlot(i: number, n: number): { x: number; w: number } {
  const span = CHAIN.x1 - CHAIN.x0;
  const gap =
    n <= 1 ? 0 : Math.max(0, Math.min(CHAIN.gap, (span - n * CHAIN.minW) / (n - 1)));
  const w = (span - gap * (n - 1)) / n;
  return { x: CHAIN.x0 + i * (w + gap), w };
}

export function layout(graph: ProductGraphContent): { H: number; nodes: PlacedNode[] } {
  const H = computeHeight(graph);

  const channelNodes = clampBand(graph.channels, CAPACITY.channels, 'channels');
  const chainNodes = clampBand(graph.chain, CAPACITY.chain, 'chain');
  const outNodes = clampBand(graph.outputs, CAPACITY.outputs, 'outputs');

  const channels: PlacedNode[] = channelNodes.map((n, i) => ({
    ...n,
    kind: 'channel',
    x: CHANNEL.x,
    w: CHANNEL.w,
    h: CHANNEL.h,
    y: spreadY(i, channelNodes.length, CHANNEL.h, H),
  }));

  const outs: PlacedNode[] = outNodes.map((n, i) => ({
    ...n,
    kind: 'out',
    x: OUT.x,
    w: OUT.w,
    h: OUT.h,
    y: spreadY(i, outNodes.length, OUT.h, H),
  }));

  // Con bucle, lo que se centra es el conjunto cadena + bucle, no la cadena sola.
  const chainStack = CHAIN.h + (graph.loop ? LOOP.gapTop + LOOP.h : 0);
  const chainY = (H - chainStack) / 2;
  const chain: PlacedNode[] = chainNodes.map((n, i) => ({
    ...n,
    kind: 'chain',
    ...chainSlot(i, chainNodes.length),
    y: chainY,
    h: CHAIN.h,
  }));

  const loop: PlacedNode[] = [];
  if (graph.loop && chain.length > 0) {
    // Centrado bajo el eslabón de cobro, sin salirse de la banda de la cadena.
    const pay = chain.find((n) => n.role === 'payment') ?? chain[chain.length - 1];
    const cx = pay.x + pay.w / 2;
    const x = Math.min(Math.max(cx - LOOP.w / 2, CHAIN.x0), CHAIN.x1 - LOOP.w);
    loop.push({
      ...graph.loop,
      kind: 'loop',
      x,
      y: chainY + CHAIN.h + LOOP.gapTop,
      w: LOOP.w,
      h: LOOP.h,
    });
  }

  return { H, nodes: [...channels, ...chain, ...outs, ...loop] };
}

export function buildEdges(nodes: PlacedNode[]): Edge[] {
  const channels = nodes.filter((n) => n.kind === 'channel');
  const chain = nodes.filter((n) => n.kind === 'chain');
  const outs = nodes.filter((n) => n.kind === 'out');
  const loop = nodes.find((n) => n.kind === 'loop');

  const edges: Edge[] = [];
  // Sin cadena no hay grafo que dibujar; salir antes evita reventar en SSR.
  if (chain.length === 0) return edges;

  const head = chain[0];
  const tail = chain[chain.length - 1];
  const chainCy = head.y + head.h / 2;

  // Canales → primer eslabón.
  for (const c of channels) {
    const cy = c.y + c.h / 2;
    edges.push({
      kind: 'flow',
      d: `M ${c.x + c.w} ${cy} C ${c.x + c.w + 60} ${cy}, ${head.x - 60} ${chainCy}, ${head.x} ${chainCy}`,
      on: [c.id, head.id],
    });
  }

  // Cadena lineal.
  for (let i = 0; i < chain.length - 1; i++) {
    edges.push({
      kind: 'flow',
      d: `M ${chain[i].x + chain[i].w} ${chainCy} L ${chain[i + 1].x} ${chainCy}`,
      on: [chain[i].id, chain[i + 1].id],
    });
  }

  // Cadena → salidas.
  for (const o of outs) {
    const oy = o.y + o.h / 2;
    const dy = oy - chainCy;

    // Una salida alineada con el eje de la cadena no puede recibir curvas desde
    // arriba/abajo sin atravesar las cajas: se conecta solo desde la cola.
    if (Math.abs(dy) < CHAIN.h) {
      edges.push({
        kind: 'flow',
        d: `M ${tail.x + tail.w} ${chainCy} C ${tail.x + tail.w + 40} ${chainCy}, ${o.x - 40} ${oy}, ${o.x} ${oy}`,
        on: [tail.id, o.id],
      });
      continue;
    }

    const up = dy < 0;
    for (const n of chain) {
      const cx = n.x + n.w / 2;
      const y0 = up ? n.y : n.y + n.h;
      edges.push({
        kind: 'flow',
        d: `M ${cx} ${y0} C ${cx} ${oy + (up ? 45 : -45)}, ${o.x - 90} ${oy}, ${o.x} ${oy}`,
        on: [n.id, o.id],
      });
    }
  }

  // Bucle de recuperación: el cobro que se cae baja al nodo "persigue", y de ahí
  // vuelve al canal principal. Se dibuja discontinuo para leerse como retorno.
  if (loop) {
    const pay = chain.find((n) => n.role === 'payment') ?? tail;
    const px = pay.x + pay.w / 2;
    const entryX = Math.min(Math.max(px, loop.x + 40), loop.x + loop.w - 40);
    edges.push({
      kind: 'feedback',
      d: `M ${px} ${pay.y + pay.h} C ${px} ${pay.y + pay.h + 26}, ${entryX} ${loop.y - 26}, ${entryX} ${loop.y}`,
      on: [pay.id, loop.id],
    });

    const primary = channels.find((c) => c.role === 'primary') ?? channels[0];
    if (primary) {
      const lcy = loop.y + loop.h / 2;
      const py = primary.y + primary.h / 2;
      // S de un solo cúbico: sale por la izquierda del bucle, sube por el pasillo
      // libre entre canales y cadena, y entra horizontal en el canal principal.
      edges.push({
        kind: 'feedback',
        d: `M ${loop.x} ${lcy} C ${GUTTER} ${lcy}, ${GUTTER} ${py}, ${primary.x + primary.w} ${py}`,
        on: [loop.id, primary.id],
      });
    }
  }

  return edges;
}
