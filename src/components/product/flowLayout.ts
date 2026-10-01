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
const LOOP = { w: 300, h: 56, gapTop: 72 };

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

export type NodeKind = 'channel' | 'chain' | 'data' | 'out' | 'loop';

/**
 * `horizontal` (el hub): canales a la izquierda, cadena en fila, salidas a la
 * derecha. `vertical` (el tour): canales en fila arriba, la cadena cae hacia
 * abajo y las salidas, si las hay, cierran por debajo. A la izquierda, el
 * bucle de Persigue cuelga del cobro y sube a los canales; a la derecha, una
 * llave recoge toda la operación en el dato.
 */
export type Orientation = 'horizontal' | 'vertical';

export type PlacedNode = ProductGraphNode & {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: NodeKind;
  /** Canal al que vuelve el bucle de Persigue. */
  chased?: boolean;
};

/** Punto de unión de los canales (el sello de SolNow), solo en vertical. */
export type Hub = { x: number; y: number; size: number };

export type Edge = {
  d: string;
  /** Ids de los dos nodos que une; alimenta el resaltado por hover/focus. */
  on: string[];
  kind: 'flow' | 'feedback';
  /**
   * Etapa en la que aparece cuando el grafo se construye por partes (solo en
   * vertical): 1 canales→sello, 2 cadena, 3 el dato y el bucle (y las
   * salidas, si las hay).
   */
  stage?: number;
};

/** Etapa en la que aparece cada tipo de nodo; el sello es la 1. */
export const NODE_STAGE: Record<NodeKind, number> = { channel: 0, chain: 2, data: 3, out: 3, loop: 3 };

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
  // La cadena va siempre centrada; el bucle cuelga a un lado y necesita su
  // sitio a ese lado (y, por simetría, el mismo aire al otro).
  const side = Math.max(EDGE_ROOM, graph.loop ? LOOP.gapTop + LOOP.h : 0);
  return Math.max(
    H_MIN,
    stackNeed(graph.channels.length, CHANNEL.h, CHANNEL.minGap),
    stackNeed(graph.outputs.length, OUT.h, OUT.minGap),
    2 * PAD_Y + CHAIN.h + 2 * side,
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

/* ── Vertical ─────────────────────────────────────────────────────────── */

export const VW = 1000;
const V_CHANNEL = { y: PAD_Y, w: 184, h: 100 };
const V_CHAIN = { w: 280, h: 72, gap: 56 };
const V_OUT = { w: 280, h: 72, gap: 60 };
const V_LOOP = { w: 230, h: 56 };
/** El dato: a la derecha, simétrico con el bucle, tras una llave que abarca
 *  toda la operación (del sello a la cola de la cadena). */
const V_DATA = { w: 230, h: 64 };
const V_BRACE = { gap: 40, depth: 14, tip: 12 };
/** Aire entre bandas para que quepan las Bézier que bajan. */
const V_BAND_GAP = 90;
/** El sello en el que convergen los canales, justo antes del primer eslabón. */
const V_HUB = { size: 60, above: 66, below: 40 };
const V_TOP_GAP = V_HUB.above + V_HUB.size + V_HUB.below;

/** Lienzo del grafo según la orientación. */
export function canvasSize(
  graph: ProductGraphContent,
  orientation: Orientation = 'horizontal',
): { W: number; H: number } {
  if (orientation === 'horizontal') return { W, H: computeHeight(graph) };
  const n = Math.min(graph.chain.length, CAPACITY.chain.max);
  const chainH = n * V_CHAIN.h + Math.max(0, n - 1) * V_CHAIN.gap;
  const outH = graph.outputs.length ? V_BAND_GAP + V_OUT.h : 0;
  return { W: VW, H: 2 * PAD_Y + V_CHANNEL.h + V_TOP_GAP + chainH + outH };
}

/** Borde izquierdo de la caja `i` de `n`, repartidas de extremo a extremo. */
function spreadX(i: number, n: number, w: number): number {
  if (n <= 1) return (VW - w) / 2;
  return ((VW - w) * i) / (n - 1);
}

function layoutVertical(graph: ProductGraphContent): { W: number; H: number; nodes: PlacedNode[]; hub: Hub } {
  const { W: VW_, H } = canvasSize(graph, 'vertical');

  const channelNodes = clampBand(graph.channels, CAPACITY.channels, 'channels');
  const chainNodes = clampBand(graph.chain, CAPACITY.chain, 'chain');
  const outNodes = clampBand(graph.outputs, CAPACITY.outputs, 'outputs');

  // Los canales a los que vuelve el bucle: los de `loopTo`, o el principal.
  const chased = (n: ProductGraphNode) => (graph.loopTo ? graph.loopTo.includes(n.id) : n.role === 'primary');
  const channels: PlacedNode[] = channelNodes.map((n, i) => ({
    ...n,
    kind: 'channel',
    x: spreadX(i, channelNodes.length, V_CHANNEL.w),
    y: V_CHANNEL.y,
    w: V_CHANNEL.w,
    h: V_CHANNEL.h,
    chased: chased(n) || undefined,
  }));

  const chainX = (VW_ - V_CHAIN.w) / 2;
  const hub: Hub = {
    x: (VW_ - V_HUB.size) / 2,
    y: V_CHANNEL.y + V_CHANNEL.h + V_HUB.above,
    size: V_HUB.size,
  };
  const chainY0 = hub.y + V_HUB.size + V_HUB.below;
  const chain: PlacedNode[] = chainNodes.map((n, i) => ({
    ...n,
    kind: 'chain',
    x: chainX,
    y: chainY0 + i * (V_CHAIN.h + V_CHAIN.gap),
    w: V_CHAIN.w,
    h: V_CHAIN.h,
  }));

  // El dato, a la derecha y a media altura de la llave (del sello a la cola).
  const data: PlacedNode[] = [];
  if (graph.data && chain.length > 0) {
    const tail = chain[chain.length - 1];
    const mid = (hub.y + tail.y + tail.h) / 2;
    data.push({
      ...graph.data,
      kind: 'data',
      x: VW_ - V_DATA.w,
      y: mid - V_DATA.h / 2,
      w: V_DATA.w,
      h: V_DATA.h,
    });
  }

  // Las salidas, juntas y centradas debajo.
  const outY = H - PAD_Y - V_OUT.h;
  const outSpan = outNodes.length * V_OUT.w + Math.max(0, outNodes.length - 1) * V_OUT.gap;
  const outs: PlacedNode[] = outNodes.map((n, i) => ({
    ...n,
    kind: 'out',
    x: (VW_ - outSpan) / 2 + i * (V_OUT.w + V_OUT.gap),
    y: outY,
    w: V_OUT.w,
    h: V_OUT.h,
  }));

  const loop: PlacedNode[] = [];
  if (graph.loop && chain.length > 0) {
    // A la altura del cobro, donde se cae lo que no se paga, y en el lado de
    // los canales a los que vuelve: el retorno sube sin cruzar la cadena.
    const src = chain.find((n) => n.role === 'payment') ?? chain[chain.length - 1];
    const targets = channels.filter((c) => c.chased);
    const tx = targets.length ? targets.reduce((a, c) => a + c.x + c.w / 2, 0) / targets.length : 0;
    const left = tx <= VW_ / 2;
    loop.push({
      ...graph.loop,
      kind: 'loop',
      x: left ? 0 : VW_ - V_LOOP.w,
      y: src.y + (src.h - V_LOOP.h) / 2,
      w: V_LOOP.w,
      h: V_LOOP.h,
    });
  }

  return { W: VW_, H, nodes: [...channels, ...chain, ...data, ...outs, ...loop], hub };
}

function buildEdgesVertical(nodes: PlacedNode[], hub?: Hub): Edge[] {
  const channels = nodes.filter((n) => n.kind === 'channel');
  const chain = nodes.filter((n) => n.kind === 'chain');
  const data = nodes.find((n) => n.kind === 'data');
  const outs = nodes.filter((n) => n.kind === 'out');
  const loop = nodes.find((n) => n.kind === 'loop');

  const edges: Edge[] = [];
  if (chain.length === 0) return edges;

  const head = chain[0];
  const tail = chain[chain.length - 1];
  const cx = head.x + head.w / 2;

  // Canales → sello → primer eslabón: bajan y convergen en el sello, y de
  // ahí sale una sola línea. Sin sello, convergen en el eslabón.
  const join = hub ? hub.y : head.y;
  const bend = hub ? 40 : 50;
  for (const c of channels) {
    const x = c.x + c.w / 2;
    const y = c.y + c.h;
    edges.push({
      kind: 'flow',
      d: `M ${x} ${y} C ${x} ${y + bend}, ${cx} ${join - bend}, ${cx} ${join}`,
      on: [c.id, head.id],
      stage: hub ? 1 : 2,
    });
  }
  if (hub) {
    edges.push({
      kind: 'flow',
      d: `M ${cx} ${hub.y + hub.size} L ${cx} ${head.y}`,
      // Se enciende con cualquier canal y con el eslabón.
      on: [head.id, ...channels.map((c) => c.id)],
      stage: 2,
    });
  }

  // Cadena lineal, de arriba abajo.
  for (let i = 0; i < chain.length - 1; i++) {
    edges.push({
      kind: 'flow',
      d: `M ${cx} ${chain[i].y + chain[i].h} L ${cx} ${chain[i + 1].y}`,
      on: [chain[i].id, chain[i + 1].id],
      stage: 2,
    });
  }

  // La llave: abarca la operación entera (del sello a la cola) y apunta al
  // dato, que la recoge toda.
  if (data) {
    const bx = head.x + head.w + V_BRACE.gap;
    const { depth: d, tip: t } = V_BRACE;
    const y0 = hub ? hub.y : head.y;
    const y1 = tail.y + tail.h;
    const ym = data.y + data.h / 2;
    edges.push({
      kind: 'flow',
      d: `M ${bx} ${y0} Q ${bx + d} ${y0} ${bx + d} ${y0 + d} L ${bx + d} ${ym - d} Q ${bx + d} ${ym} ${bx + d + t} ${ym} Q ${bx + d} ${ym} ${bx + d} ${ym + d} L ${bx + d} ${y1 - d} Q ${bx + d} ${y1} ${bx} ${y1}`,
      on: [data.id],
      stage: 3,
    });
    edges.push({
      kind: 'flow',
      d: `M ${bx + d + t + 8} ${ym} L ${data.x} ${ym}`,
      on: [data.id],
      stage: 3,
    });
  }

  // Cola → salidas.
  const src = tail;
  const sy = src.y + src.h;
  for (const o of outs) {
    const ox = o.x + o.w / 2;
    edges.push({
      kind: 'flow',
      d: `M ${cx} ${sy} C ${cx} ${sy + 50}, ${ox} ${o.y - 50}, ${ox} ${o.y}`,
      on: [src.id, o.id],
      stage: 3,
    });
  }

  // Bucle: del cobro sale de lado hacia Persigue y sube a los canales a los
  // que vuelve, entrando por su cuarto exterior para no pisar su arista de bajada.
  if (loop) {
    const from = chain.find((n) => n.role === 'payment') ?? tail;
    const left = loop.x < from.x;
    const fy = from.y + from.h / 2;
    const lcy = loop.y + loop.h / 2;
    const x0 = left ? from.x : from.x + from.w;
    const x1 = left ? loop.x + loop.w : loop.x;
    edges.push({
      kind: 'feedback',
      d: `M ${x0} ${fy} C ${(x0 + x1) / 2} ${fy}, ${(x0 + x1) / 2} ${lcy}, ${x1} ${lcy}`,
      on: [from.id, loop.id],
      stage: 3,
    });

    const targets = channels.filter((c) => c.chased);
    // De fuera hacia dentro: el más exterior sale del borde del bucle.
    const ordered = left ? targets : [...targets].reverse();
    ordered.forEach((t, i) => {
      const lx = left ? loop.x + 46 + i * 120 : loop.x + loop.w - 46 - i * 120;
      const px = left ? t.x + t.w / 4 : t.x + (3 * t.w) / 4;
      const pb = t.y + t.h;
      edges.push({
        kind: 'feedback',
        d: `M ${lx} ${loop.y} C ${lx} ${loop.y - 60}, ${px} ${pb + 60}, ${px} ${pb}`,
        on: [loop.id, t.id],
        stage: 3,
      });
    });
  }

  return edges;
}

/* ── Horizontal ───────────────────────────────────────────────────────── */

export function layout(
  graph: ProductGraphContent,
  orientation: Orientation = 'horizontal',
): { W: number; H: number; nodes: PlacedNode[]; hub?: Hub } {
  if (orientation === 'vertical') return layoutVertical(graph);
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

  // La cadena se centra sola; el bucle cuelga encima o debajo de ella.
  const above = graph.loopPosition === 'above';
  const chainY = (H - CHAIN.h) / 2;
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
      y: above ? chainY - LOOP.gapTop - LOOP.h : chainY + CHAIN.h + LOOP.gapTop,
      w: LOOP.w,
      h: LOOP.h,
    });
  }

  return { W, H, nodes: [...channels, ...chain, ...outs, ...loop] };
}

export function buildEdges(
  nodes: PlacedNode[],
  orientation: Orientation = 'horizontal',
  hub?: Hub,
): Edge[] {
  if (orientation === 'vertical') return buildEdgesVertical(nodes, hub);
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

    // Sin bucle (el hub público), cada eslabón alimenta las salidas, como
    // siempre. Con bucle (el tour), las salidas cuelgan solo del último
    // eslabón: una curva por salida, que no se cruza con el bucle.
    const up = dy < 0;
    const sources = loop ? [tail] : chain;
    for (const n of sources) {
      const cx = n.x + n.w / 2;
      const y0 = up ? n.y : n.y + n.h;
      edges.push({
        kind: 'flow',
        d: `M ${cx} ${y0} C ${cx} ${oy + (up ? 45 : -45)}, ${o.x - 90} ${oy}, ${o.x} ${oy}`,
        on: [n.id, o.id],
      });
    }
  }

  // Bucle de recuperación: el cobro que se cae va al nodo "persigue" (debajo o
  // encima de la cadena), y de ahí vuelve al canal principal. Se dibuja
  // discontinuo para leerse como retorno.
  if (loop) {
    const pay = chain.find((n) => n.role === 'payment') ?? tail;
    const px = pay.x + pay.w / 2;
    const entryX = Math.min(Math.max(px, loop.x + 40), loop.x + loop.w - 40);
    const above = loop.y < pay.y;
    const y0 = above ? pay.y : pay.y + pay.h;
    const y1 = above ? loop.y + loop.h : loop.y;
    const bend = above ? -26 : 26;
    edges.push({
      kind: 'feedback',
      d: `M ${px} ${y0} C ${px} ${y0 + bend}, ${entryX} ${y1 - bend}, ${entryX} ${y1}`,
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
