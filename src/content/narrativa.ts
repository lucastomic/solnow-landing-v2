import type { ProductKey } from '@/content/products';
import { PLANS, SEASON_DISCOUNT } from '@/lib/pricingCalc';

/**
 * La narrativa comercial de SolNow, en el orden en que el operador la tiene que
 * oír (Kazanjy): problema → quién → coste → cómo se resuelve hoy → qué cambió →
 * cómo funciona → prueba → precio. La lee el tour de `/es/narrativa`.
 *
 * Fuente: la nota «Narrativa (orden Kazanjy)» del vault de Obsidian. Se copia
 * fiel; si una cifra cambia, cambia primero allí. Las de precio no se escriben:
 * salen de `PLANS`, para que el deck no pueda desfasarse de la web.
 *
 * Es un deck, y un deck nunca está terminado: cada capítulo es una lista de
 * diapositivas hechas con tres plantillas (título, resumen, feature). Añadir
 * una diapositiva es añadir un objeto aquí; no hace falta tocar componentes.
 *
 * Marcado inline: `**negrita**` en cualquier texto se pinta como énfasis.
 */

export interface SlideImage {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export interface SlideTitle {
  kind: 'title';
  /** Titular. `em` es el tramo que va en cursiva de marca. */
  title: string;
  em?: string;
  lede?: string;
  /** Foto a la derecha del titular; sin ella, el titular ocupa el ancho. */
  image?: SlideImage;
  /** Tarjetas de cliente bajo el titular (la prueba: «hay otros como tú»). */
  clients?: { name: string; profile: string; logo: SlideImage }[];
}

export interface OverviewItem {
  /** Cifra grande o rótulo corto (en `stats`, `chain`, `timeline`, `split`). */
  k?: string;
  h: string;
  p?: string;
  /** Solo en `matrix`: qué columnas cubre, en el orden de `columns`. */
  covers?: boolean[];
  /** Solo en `split`: la columna que se destaca en tinta. */
  accent?: boolean;
}

export interface SlideOverview {
  kind: 'overview';
  title: string;
  sub?: string;
  /** Párrafo antes de la lista. */
  intro?: string;
  layout: 'list' | 'grid' | 'stats' | 'chain' | 'matrix' | 'timeline' | 'split';
  /** Solo en `matrix`: cabeceras de columna. */
  columns?: string[];
  items: OverviewItem[];
  /** Cierre de la diapositiva, después de la lista. */
  note?: string;
}

export interface SlideFeature {
  kind: 'feature';
  /** Número de escalón, cuando la diapositiva es uno de una serie. */
  n?: number;
  of?: number;
  title: string;
  sub?: string;
  bullets: string[];
  media:
    | { type: 'mock'; area: ProductKey; secondary?: boolean }
    | { type: 'flow' }
    | { type: 'image'; image: SlideImage }
    | { type: 'illustration'; name: 'channels' | 'hours' | 'lost' | 'unknown' };
  /** Frase que se destaca bajo los bullets. */
  callout?: string;
  mediaFirst?: boolean;
}

export interface ChainNode {
  /** La cifra. */
  k: string;
  h: string;
  p?: string;
  /** Sin cifra conocida: se pinta apagado, con «?». */
  unknown?: boolean;
}

/** Filas de cifras encadenadas por causa → efecto. */
export interface SlideChains {
  kind: 'chains';
  title: string;
  sub?: string;
  rows: { label: string; nodes: ChainNode[] }[];
  note?: string;
  /** Botón que abre la calculadora «cuánto te cuesta hoy» (nivel de detalle del prospecto). */
  calculator?: string;
}

/** Una cifra dibujada. Cada figura lleva su título corto. */
export type Figure =
  | { type: 'bars'; title: string; items: { label: string; value: number; display: string }[]; max: number; xLabel?: string }
  | { type: 'compare'; title: string; a: { k: string; h: string; value: number }; b: { k: string; h: string; value: number } }
  | {
      type: 'pairs';
      title: string;
      beforeLabel: string;
      afterLabel: string;
      groups: { label: string; before: number; after: number }[];
    }
  | { type: 'trend'; title: string; items: { label: string; value: number; display: string }[]; max: number };

/** Un cliente con nombre: logo, perfil, foto y sus cifras concretas. */
export interface SlideCase {
  kind: 'case';
  name: string;
  profile: string;
  logo: SlideImage;
  photo?: SlideImage;
  lede: string;
  /** Sus cifras, encadenadas: las de la izquierda producen la de la derecha. */
  rows: { label: string; nodes: ChainNode[] }[];
}

/** Una o dos figuras, con tiles de apoyo opcionales al lado. */
export interface SlideFigure {
  kind: 'figure';
  title: string;
  sub?: string;
  figures: Figure[];
  aside?: OverviewItem[];
  note?: string;
}

/** Un paso del relato sobre el grafo: qué nodos enciende y por qué lado entra. */
export interface StoryStep {
  title: string;
  bullets: string[];
  callout?: string;
  /** Ids de nodos del grafo (`product.graph` en `messages/es.json`). */
  nodes: string[];
}

/**
 * El bucle de recuperación del grafo, solo en el tour: cuelga bajo la cadena y
 * vuelve a WhatsApp. Es el primer dividendo del dato (el sistema vende solo),
 * y sin él ese paso se contaba con palabras. El hub de producto no lo pinta
 * todavía; cuando se decida, va a `product.graph.loop` en `messages/*.json`.
 */
export const STORY_LOOP = {
  loopLabel: 'Bucle de recuperación',
  loopPosition: 'above' as const,
  loop: { id: 'persigue', label: 'Persigue', sub: 'recupera lo que se enfría', area: 'persigue' as ProductKey },
  /** Canal que el tour añade a los del hub: las OTAs, aparte de hoteles y agencias. */
  extraChannels: [{ id: 'ota', label: 'GetYourGuide y Viator', sub: 'OTAs', area: 'colaboradores' as ProductKey }],
  /**
   * El tour reordena las salidas del hub: la monitorización entra en la
   * cadena operativa y el reporting pasa a ser el dato que lo recoge todo,
   * del que sale Persigue.
   */
  toChain: ['mon'],
  asData: { id: 'rep', sub: 'el dato de todo: canales, cobros, flota y caja' },
  dataLabel: 'El dato',
  /** Persigue vuelve a WhatsApp y a la web (los checkouts abandonados). */
  loopTo: ['wa', 'web'],
};

/** El grafo del producto fijo en pantalla y los pasos leyéndolo por partes. */
export interface SlideStory {
  kind: 'story';
  /** Primera parada: el grafo entero, con un titular encima. */
  intro: { title: string; sub?: string };
  steps: StoryStep[];
}

export interface SlideLogos {
  kind: 'logos';
  title: string;
}

export interface SlidePrice {
  kind: 'price';
  title: string;
  /** El fijo, en temporada (lo que se factura a casi todos) y, en pequeño, al mes. */
  fixed: { first: string; extra: string; monthly: string };
  rows: { k: string; h: string; p: string }[];
  /**
   * El agente, en una franja aparte debajo de las dos tarjetas. Como tercera
   * fila del variable se leía como una comisión más sumada a la online; es un
   * vendedor que ya viene incluido y solo cobra lo que él mismo cobra.
   */
  agent: { h: string; p: string; k: string; kp: string };
  note: string;
  /** Despegue, en una línea discreta: casi nadie va ahí, pero existe. */
  alt: string;
  /** Botón que abre la calculadora de precio en un modal. */
  calculator: string;
}

/**
 * Nivel de detalle (Kazanjy, «zoom in, zoom out»): 0 la idea del capítulo,
 * 1 la narrativa entera, 2 el apoyo que solo sale si preguntan. Sin `level`,
 * una portada es 0 y el resto 1. El modo presentador elige hasta dónde bajar.
 */
export type Level = 0 | 1 | 2;

export type Slide = (
  | SlideTitle
  | SlideOverview
  | SlideFeature
  | SlideChains
  | SlideFigure
  | SlideCase
  | SlideStory
  | SlideLogos
  | SlidePrice
) & { level?: Level };

export interface Chapter {
  id: string;
  /** Rótulo corto del índice lateral. */
  label: string;
  slides: Slide[];
}

/**
 * Textos de interfaz del tour (portada, índice, panel del presentador,
 * modales, calculadoras e ilustraciones). Van por idioma junto al contenido,
 * no en `messages/*.json`: son de una página privada y no tienen que viajar
 * en el HTML del resto del sitio.
 */
export interface NarrativaUI {
  meta: { title: string; description: string };
  cover: { title: string; em: string; lede: string };
  rail: { chapters: string; appendix: string };
  logos: { inProduction: string };
  price: { eyebrow: string; variable: string; allIncluded: string };
  zoom: { close: string; hint: string; nodeAria: string };
  presenter: {
    title: string;
    hint: string;
    levels: { label: string; hint: string }[];
    appendixPrefix: string;
    byLevel: string;
    showAll: string;
    copyLink: string;
    pdf: string;
    pdfHint: string;
    language: string;
    labels: { cover: string; logos: string };
  };
  calc: {
    eyebrow: string;
    title: string;
    intro: string;
    bookings: string;
    chats: string;
    months: string;
    monthsUnit: string;
    hours: string;
    conversations: string;
    hoursPerDay: string;
    hoursPerDayH: string;
    hoursPerSeason: string;
    hires: string;
    hiresH: string;
    hiresP: string;
    slowH: string;
    slowP: string;
    perDay: string;
    perMonth: string;
    coolH: string;
    coolP: string;
    lostH: string;
    lostP: string;
    totalP: string;
    hint: string;
  };
  pricing: {
    eyebrow: string;
    billing: string;
    roiEyebrow: string;
    roiIntro: string;
    roiHires: string;
    roiLost: string;
    roiTotal: string;
    roiPay: string;
    roiBig: string;
    hint: string;
  };
  ill: {
    channels: string[];
    steps: string[];
    chainCaption: string;
    day: { messages: string; quote: string; data: string; contract: string; charge: string; board: string };
    legendPaper: string;
    legendMessages: string;
    chats: { who: string; t: string; when: string; state: string }[];
    inbox: string;
    inboxOpen: string;
    unknown: string[];
    unknownCaption: string;
  };
  fmt: { locale: string };
}

export const UI_ES: NarrativaUI = {
  meta: { title: 'La narrativa de SolNow', description: 'La narrativa comercial de SolNow, en el orden en que el operador la tiene que oír.' },
  cover: {
    title: 'El primer sistema operativo para empresas de actividades acuáticas.',
    em: 'sistema operativo',
    lede: 'Atender y capturar más reservas con menos personal, en todos los canales: mostrador, web, WhatsApp, OTAs y colaboradores.',
  },
  rail: { chapters: 'Capítulos', appendix: 'Apéndice' },
  logos: { inProduction: 'En producción' },
  price: { eyebrow: 'Cuota por base · Escalar', variable: 'El grueso sigue a las ventas', allIncluded: 'Todo incluido, sin tiers.' },
  zoom: { close: 'Cerrar', hint: 'Esc para volver al grafo', nodeAria: 'ver en detalle' },
  presenter: {
    title: 'Modo presentador',
    hint: 'Abre y cierra con P P (dos veces), ⌥⇧P o ⌘⇧P; en el móvil, tres toques en el logo. Lo que marques se guarda en este navegador y en el enlace.',
    levels: [
      { label: 'Resumen', hint: 'Solo la portada y la idea de cada capítulo. Diez minutos.' },
      { label: 'Presentación', hint: 'La narrativa entera, sin el detalle que solo sale si preguntan.' },
      { label: 'Detalle completo', hint: 'Todo, incluidas las diapositivas de apoyo.' },
    ],
    appendixPrefix: 'Apéndice · ',
    byLevel: 'Oculta por el nivel de detalle',
    showAll: 'Mostrar todo',
    copyLink: 'Copiar enlace con esta selección',
    pdf: 'Descargar PDF',
    pdfHint: 'Una página por diapositiva, apaisada, con esta selección. En el diálogo elige «Guardar como PDF» y sin márgenes.',
    language: 'Idioma',
    labels: { cover: 'Portada', logos: 'Logos' },
  },
  calc: {
    eyebrow: 'Qué cuesta · tu negocio',
    title: 'Cuánto te cuesta hoy',
    intro: 'Tres datos de tu temporada. Las unidades son las medidas en nuestros clientes antes de automatizar.',
    bookings: 'Reservas al día en temporada',
    chats: 'Conversaciones de WhatsApp al día',
    months: 'Meses de temporada',
    monthsUnit: 'meses',
    hours: 'Horas',
    conversations: 'Conversaciones',
    hoursPerDay: 'h al día',
    hoursPerDayH: 'de papel y cola',
    hoursPerSeason: 'h en la temporada, a {min} min por reserva.',
    hires: 'en {n} puestos de temporada',
    hiresH: 'Sueldo, Seguridad Social, formarlos y despedirlos.',
    hiresP: '',
    slowH: 'esperan más de una hora',
    slowP: 'Y de noche nadie contesta.',
    perDay: 'al día',
    perMonth: 'al mes',
    coolH: 'se enfrían sin seguimiento',
    coolP: 'Perseguirlas recupera {range}.',
    lostH: 'al mes que nadie persigue',
    lostP: '{range} en la temporada.',
    totalP: 'por temporada, entre gente y reservas que se escapan. Sin contar lo que no se mide.',
    hint: 'Estimación con las unidades de la narrativa · Esc para volver',
  },
  pricing: {
    eyebrow: 'Y cuesta · tu negocio',
    billing: 'Modalidad de pago',
    roiEyebrow: 'Tu retorno estimado',
    roiIntro: 'Tres datos más. Lo que te cuesta hoy no resolverlo, con las unidades del capítulo «Qué cuesta», frente a lo que pagarías.',
    roiHires: 'Gente que no hay que contratar',
    roiLost: 'Reservas que hoy se enfrían y el persigue recupera',
    roiTotal: 'Lo que recuperas por temporada',
    roiPay: 'Lo que pagas al año, según tu factura de arriba',
    roiBig: 'de retorno estimado sobre lo que pagas. Sin contar lo que no se mide: caja, noche, idiomas.',
    hint: 'Las mismas fórmulas que la web · Estimación con las unidades de la narrativa · Esc para volver',
  },
  ill: {
    channels: ['Mostrador', 'WhatsApp', 'Web', 'Agencia', 'OTA'],
    steps: ['Contestar', 'Cotizar', 'Tomar datos', 'Contrato', 'Cobrar', 'Embarcar'],
    chainCaption: 'Minutos de una persona · cada reserva · cada día',
    day: { messages: 'Mensajes', quote: 'Cotizar', data: 'Datos', contract: 'Contrato', charge: 'Cobrar', board: 'Embarcar' },
    legendPaper: 'Papeleo y cobro',
    legendMessages: 'Contestar mensajes',
    chats: [
      { who: 'Laura', t: 'Hola! ¿Tenéis 2 motos mañana a las 12?', when: 'hace 3 min', state: 'Sin contestar' },
      { who: 'Marco', t: 'Do you have availability Saturday?', when: 'hace 40 min', state: 'Sin contestar' },
      { who: 'Chloé', t: 'Vale, ¿y cuánto sería una hora?', when: 'hace 2 h', state: 'Se enfrió' },
      { who: 'Iván', t: '¿Me pasas el enlace para pagar?', when: 'ayer', state: 'Se enfrió' },
      { who: 'Sophie', t: 'Nous sommes 6, c’est possible ?', when: 'ayer 02:14', state: 'De noche, nadie' },
    ],
    inbox: 'WhatsApp · Reservas',
    inboxOpen: '5 sin cerrar',
    unknown: ['¿Cuántos escribieron hoy?', '¿Cuántos pagaron?', '¿Qué hay en caja?', '¿Qué pasa en la otra base?'],
    unknownCaption: 'Se reconstruye a mano · tarde · o no se sabe',
  },
  fmt: { locale: 'es-ES' },
};

const eur = (n: number) => `${n.toLocaleString('es-ES')} €`;
const pct = (p: number) => `${Math.round(p * 100)} %`;

export const CHAPTERS: Chapter[] = [
  {
    id: 'problema',
    label: 'El problema',
    slides: [
      {
        kind: 'title',
        title: 'Atender una reserva cuesta demasiado trabajo humano.',
        em: 'demasiado trabajo humano',
        image: {
          src: '/assets/mostrador-papel.jpg',
          alt: 'Un empleado rellena un contrato en papel en la caseta mientras la cola espera al sol',
          w: 1680,
          h: 916,
        },
      },
      {
        kind: 'feature',
        title: 'Entre por donde entre, la misma cadena',
        bullets: ['Mostrador, WhatsApp, web, agencia u OTA: seis pasos y una persona en cada uno.'],
        media: { type: 'illustration', name: 'channels' },
        mediaFirst: true,
      },
      {
        kind: 'feature',
        n: 1,
        of: 3,
        title: 'Se paga en horas del equipo',
        level: 2,
        bullets: ['Gente contratada para atender, cobrar y embarcar, que se pasa el día en papeles y mensajes.'],
        media: { type: 'illustration', name: 'hours' },
      },
      {
        kind: 'feature',
        n: 2,
        of: 3,
        title: 'Se paga en reservas que se pierden',
        level: 2,
        bullets: ['Las que nadie contesta a tiempo y las conversaciones que se enfrían sin que nadie las persiga.'],
        media: { type: 'illustration', name: 'lost' },
        mediaFirst: true,
      },
      {
        kind: 'feature',
        n: 3,
        of: 3,
        title: 'Se paga en no saber qué pasa',
        level: 2,
        bullets: ['Cuántos escribieron, cuántos pagaron, qué hay en caja, qué pasa en la otra base: se reconstruye a mano, tarde, o no se sabe.'],
        media: { type: 'illustration', name: 'unknown' },
      },
    ],
  },
  // «Quién lo tiene» no va: en una presentación de ventas ya está implícito, el
  // prospecto es quien lo tiene. El bloque sigue en la nota de Obsidian.
  {
    id: 'coste',
    label: 'Qué cuesta',
    slides: [
      {
        kind: 'title',
        title: 'Qué cuesta no resolverlo.',
        em: 'no resolverlo',
        lede: 'Medido en nuestros clientes antes de automatizar, en unidades que escalan a cualquier operador.',
      },
      {
        kind: 'chains',
        title: 'En unidades que escalan a tu negocio',
        rows: [
          {
            label: 'Horas',
            nodes: [
              { k: '8 h', h: 'cada 100 reservas', p: 'Contestar, datos, contrato, cobro y embarque: 5 minutos por reserva.' },
              { k: '8.000-11.000 €', h: 'cada puesto de temporada', p: 'Sueldo, Seguridad Social, formarlo y despedirlo. Y el año que viene, otra vez.' },
            ],
          },
          {
            label: 'Reservas',
            nodes: [
              { k: '1 de cada 10', h: 'espera más de una hora', p: 'Y de noche nadie contesta.' },
              { k: '53 de cada 100', h: 'conversaciones se enfrían', p: 'Sin seguimiento, nadie las persigue.' },
              { k: '600-1.600 €', h: 'cada 100 conversaciones', p: 'Perseguirlas recupera 4-7 reservas.' },
            ],
          },
          {
            label: 'Lo que no se sabe',
            nodes: [
              { k: '?', h: 'qué hay en caja', p: 'El cierre se reconstruye a mano.', unknown: true },
              { k: '?', h: 'cuántos de los que escriben pagan', p: 'Nadie lo sabe.', unknown: true },
              { k: '?', h: 'qué pasa en la otra base', p: 'El dueño se entera cuando algo se rompe.', unknown: true },
            ],
          },
        ],
        note: 'Medido en nuestros clientes antes de automatizar.',
        calculator: 'Calcula lo que te cuesta a ti',
      },
    ],
  },
  {
    id: 'hoy',
    label: 'Cómo se resuelve hoy',
    slides: [
      {
        kind: 'title',
        title: 'Todo lo que hay resuelve una parte del ciclo.',
        em: 'una parte',
      },
      {
        kind: 'overview',
        title: 'Cinco maneras de resolverlo hoy, y por qué no alcanzan',
        layout: 'matrix',
        columns: ['Mostrador', 'WhatsApp', 'Contrato legal', 'Operación en vivo'],
        items: [
          {
            h: 'A mano',
            p: 'Calendario, pizarra, Excel, papel y el móvil del dueño. Aguanta hasta unas 30 reservas al día; a partir de ahí se pierden reservas y el dueño no descansa.',
            covers: [false, false, false, false],
          },
          {
            h: 'Más gente',
            p: 'Absorbe el pico, pero son meses de sueldo, formar cada año, y sigue sin cubrir la noche ni el fin de semana.',
            covers: [true, false, false, false],
          },
          {
            h: 'Un motor de reservas',
            p: 'TuriTop, FareHarbor, Bookeo, WooCommerce hacen bien el online, pero están hechos para tours y museos: no saben qué es una moto, un contrato con menores ni un libro de registro. Y el online es la puerta pequeña: en un operador de mostrador el 80-90 % de la facturación entra en la base, y ahí el motor no existe, no cierra el contrato del sector ni opera el día.',
            covers: [false, false, false, false],
          },
          {
            h: 'Un bot de WhatsApp',
            p: 'Contesta pero no cierra: manda a la web a buscar fecha, no sabe qué hay libre, no registra al que quiere pagar en la base, y nadie sabe cuántos de los que escriben pagan.',
            covers: [false, true, false, false],
          },
          {
            h: 'Hacerlo uno mismo',
            p: 'Vale para una pieza. El ciclo entero —pagos, contratos legales, multi-base, operación, colaboradores— son años y mantenimiento permanente.',
            covers: [false, false, false, false],
          },
        ],
        note:
          'Ninguna cubre mostrador, WhatsApp, contrato legal y operación en vivo en el mismo sistema, y por eso ninguna devuelve las tres cosas: **las horas, las reservas que se escapan y una foto entera del negocio**.',
      },
    ],
  },
  {
    id: 'cambio',
    label: 'Qué ha cambiado',
    slides: [
      {
        kind: 'title',
        title: 'Tres cosas han cambiado, y las tres recientes.',
        em: 'las tres recientes',
      },
      {
        kind: 'overview',
        title: 'Lo que hoy se puede y hace tres años no',
        layout: 'timeline',
        items: [
          {
            k: 'Cambio 1',
            h: 'El cliente ya hace el trámite en su móvil',
            p: 'Firmar, pagar e identificarse en el teléfono es normal para todo el mundo. Por eso el contrato, el libro de registro y el cobro pueden salir de la cola del mostrador: **los hace el cliente, no el empleado**.',
          },
          {
            k: 'Cambio 2',
            h: 'Una IA ya vende de verdad',
            p: 'No sigue un árbol de flujos: mantiene una conversación, cotiza, mira disponibilidad y deja al cliente pagando. Por primera vez se puede atender el WhatsApp **a las 3 de la mañana sin una persona**.',
          },
          {
            k: 'Cambio 3',
            h: 'Por fin hay software hecho para este sector',
            p: 'Hasta ahora nadie lo había construido: era demasiado pequeño para justificarlo, y lo que hay son herramientas genéricas de tours adaptadas a medias. **SolNow es el único sistema hecho de arriba abajo para actividades acuáticas**, y por eso existe ahora.',
          },
        ],
      },
    ],
  },
  {
    id: 'como',
    label: 'Cómo funciona',
    slides: [
      {
        kind: 'title',
        title: 'Un motor de reservas es una tienda online. SolNow es el sistema operativo del negocio.',
        em: 'el sistema operativo del negocio',
        lede: 'Por él pasa la caja, el contrato, el embarque y el WhatsApp, entre por donde entre el dinero. Un solo argumento, en cuatro pasos.',
      },
      {
        kind: 'story',
        level: 0,
        intro: {
          title: 'Todo pasa por el mismo sistema',
          sub: 'Canales → cadena de venta → dato. Un solo argumento, en cuatro pasos.',
        },
        steps: [
          {
            title: 'Todos los canales, un solo inventario',
            bullets: [
              'Mostrador, web, WhatsApp, OTAs y colaboradores venden **del mismo calendario**.',
              'Una reserva de GetYourGuide o de un hotel recibe **el mismo contrato y el mismo QR** que una del mostrador.',
              'Ningún canal vende lo que otro ya vendió.',
            ],
            nodes: ['wa', 'web', 'most', 'colab', 'ota'],
          },
          {
            title: 'Cada canal hasta el final, con las piezas de este sector',
            bullets: [
              'No solo la reserva: **el contrato legal del alquiler, el libro de registro, el manifiesto**, el cobro en base (TPV y kiosk), la pizarra en vivo, el QR de embarque y la flota en tiempo real, con varias bases.',
              'El cliente mete sus datos, **firma y paga él mismo**, sea por donde sea que entre.',
            ],
            nodes: ['cobro', 'contrato', 'qr', 'mon'],
          },
          {
            title: 'Por eso tenemos el dato completo del negocio',
            bullets: [
              'Quién escribió, quién pagó, qué hay en caja, qué está en el agua: **todo en un mismo reporting**, de todos los canales y todas las bases.',
              '**Nadie más puede construirlo**: no se puede tener el dato de un flujo que no pasa por tu sistema.',
              '**Y el dato trabaja**: Persigue sabe quién recibió precio y no pagó, y vuelve a por él por WhatsApp o en la web.',
            ],
            nodes: ['rep', 'persigue'],
          },
        ],
      },
      {
        kind: 'overview',
        title: 'Y lo instalamos nosotros',
        level: 2,
        layout: 'grid',
        intro: 'Flota, configuración y formación del equipo en dos semanas, para que no tengas que montarlo tú.',
        items: [
          { k: '01', h: 'Flota' },
          { k: '02', h: 'Configuración' },
          { k: '03', h: 'Formación del equipo' },
        ],
      },
      { kind: 'title', title: 'Demo', em: 'Demo' },
    ],
  },
  {
    id: 'prueba',
    label: 'Cómo sabemos que es mejor',
    slides: [
      // ── Primero el sistema: cifras que valen para cualquier operador ──
      {
        kind: 'title',
        title: 'Está en producción. Esto es lo que hace el sistema, medido en agosto de 2026.',
        em: 'en producción',
        lede: 'El mes más fuerte del año, en operadores reales. Primero lo que vale para cualquiera; después, dos clientes con nombre.',
      },
      {
        kind: 'figure',
        title: 'La IA vende sola, y el persigue recupera lo que se enfría',
        sub: 'Cuanto más sola se la deja, más cierra.',
        figures: [
          {
            type: 'compare',
            title: 'Tiempo de respuesta',
            a: { k: '9 s', h: 'la IA, de día y de noche', value: 9 },
            b: { k: '1 h 50', h: 'una persona del equipo, de media', value: 6600 },
          },
          {
            type: 'bars',
            title: 'Conversaciones que cierran, según los turnos que la IA lleva sola antes de que entre una persona',
            items: [
              { label: '0', value: 27, display: '27 %' },
              { label: '1', value: 41, display: '41 %' },
              { label: '2', value: 45, display: '45 %' },
              { label: '3', value: 41, display: '41 %' },
              { label: '4', value: 46, display: '46 %' },
              { label: '5+', value: 54, display: '54 %' },
            ],
            max: 60,
            xLabel: 'turnos que la IA llevó sola',
          },
          {
            type: 'pairs',
            title: 'El persigue: el cliente que calló con el enlace de pago en la mano',
            beforeLabel: 'Sin seguimiento',
            afterLabel: 'Con seguimiento',
            groups: [
              { label: 'Vuelve a escribir', before: 31, after: 78 },
              { label: 'Reserva', before: 9, after: 32 },
            ],
          },
        ],
      },
      {
        kind: 'figure',
        title: 'El dueño lo ve todo',
        figures: [
          {
            type: 'compare',
            title: 'Facturación de un operador de mostrador que ve cada sistema',
            a: { k: '11 %', h: 'un motor de reservas: solo el online', value: 11 },
            b: { k: '100 %', h: 'SolNow: todo lo que entra por la base', value: 100 },
          },
        ],
        note: 'Cada cifra de este capítulo sale del panel del operador tal cual: quién escribió, quién pagó, qué se cerró de noche, qué canal cancela. **Ninguna se calculó para este documento.**',
      },

      // ── Después, dos clientes con nombre ──
      {
        kind: 'case',
        name: 'Banana Summer · Grupo Marinajets',
        profile: '8 bases · mucho mostrador · agosto 2026',
        logo: { src: '/casos/marinajets-logo.webp', alt: 'Grupo Marinajets', w: 202, h: 168 },
        photo: { src: '/casos/marinajets-flota.webp', alt: 'La flota de motos de agua de Grupo Marinajets en el pantalán', w: 386, h: 560 },
        lede: 'Misma temporada, mismo equipo, el doble de volumen.',
        rows: [
          {
            label: 'Menos horas',
            nodes: [
              { k: '+12.000', h: 'contratos en el móvil del cliente', p: 'En un mes. Ni un papel.' },
              { k: '+7.500', h: 'pasajeros con un escaneo', p: 'El libro de registro se rellena solo.' },
              { k: '≈ 450 h', h: 'al mes que no hizo nadie', p: 'Tres personas a jornada completa.' },
            ],
          },
          {
            label: 'Más reservas',
            nodes: [
              { k: '60 %', h: 'de los turnos de venta los atiende la IA', p: 'De noche, el 70 %.' },
              { k: '6 de cada 10', h: 'reservas del agente se pagan solas', p: 'Sin que nadie del equipo escriba.' },
            ],
          },
          {
            label: 'El persigue',
            nodes: [
              { k: '+1.000', h: 'conversaciones se enfrían al mes', p: 'El cliente recibe precio y calla.' },
              { k: '78 %', h: 'vuelve con un seguimiento', p: 'Frente al 31 % que vuelve solo.' },
              { k: '10.000-27.000 €', h: 'al mes recuperados', p: 'Reservas que antes no ocurrían.' },
            ],
          },
        ],
      },
      {
        kind: 'case',
        name: 'Moraira Boats Adventures',
        profile: '1 base · web y agente · agosto 2026',
        logo: { src: '/logos/morairaboatsadventures.webp', alt: 'Moraira Boats Adventures', w: 338, h: 192 },
        photo: { src: '/casos/moraira-cueva.webp', alt: 'Una excursión de Moraira Boats entrando en una cueva', w: 510, h: 560 },
        lede: 'El WhatsApp que vende solo.',
        rows: [
          {
            label: 'Más reservas',
            nodes: [
              { k: '14 s', h: 'tarda en responder', p: 'El 99,9 % de las veces, en menos de un minuto.' },
              { k: '80 %', h: 'de los turnos de WhatsApp los atiende la IA', p: 'De día y de noche, en el idioma del cliente: el 43 % llega en otro.' },
              { k: '71 %', h: 'cierra cuando el agente manda el enlace de pago' },
              { k: '9 de cada 10', h: 'reservas del agente se pagan solas', p: 'Sin que nadie del equipo escriba una línea.' },
            ],
          },
          {
            label: 'Chat y web',
            nodes: [
              { k: '1 de cada 5', h: 'reservas del chat se remata en el motor web', p: 'El agente da el precio, la web cobra.' },
            ],
          },
          {
            label: 'El persigue',
            nodes: [
              { k: '3 de cada 4', h: 'conversaciones se enfrían', p: 'El cliente pregunta, recibe precio y calla.' },
              { k: '5.000-13.000 €', h: 'al mes recuperables', p: 'Proyección con el seguimiento automático en un negocio como el suyo.' },
            ],
          },
        ],
      },
      { kind: 'logos', title: 'Operadores que ya trabajan con SolNow', level: 2 },
    ],
  },
  {
    id: 'precio',
    label: 'Y cuesta',
    slides: [
      {
        kind: 'title',
        title: 'Una cuota por base, y el grueso sigue a las ventas.',
        em: 'sigue a las ventas',
      },
      {
        kind: 'price',
        level: 0,
        title: 'Todo incluido, sin tiers',
        fixed: {
          first: `${eur(PLANS.escalar.season.first)} por temporada la primera base`,
          extra: `${eur(PLANS.escalar.season.extra)} cada base adicional`,
          monthly: `O al mes: ${eur(PLANS.escalar.monthly.first)} la primera y ${eur(PLANS.escalar.monthly.extra)} cada adicional (${pct(SEASON_DISCOUNT)} más que en temporada).`,
        },
        rows: [
          { k: '0 %', h: 'de todo lo que haces tú', p: 'Mostrador, manual, colaboradores.' },
          {
            k: pct(PLANS.escalar.channelPct),
            h: 'de lo que SolNow cobra online',
            p: 'Trasladable al viajero como gastos de gestión.',
          },
        ],
        agent: {
          h: 'Agente de IA, incluido',
          p: 'Activo desde el primer día. Atender, responder, perseguir y postventa van dentro de la cuota.',
          k: `+${pct(PLANS.escalar.vendorPct)}`,
          kp: 'Solo en las reservas que cobra por su propio enlace.',
        },
        note: 'En noviembre la factura baja sola.',
        alt: `¿Una sola base y empezando? Despegue: ${eur(PLANS.despegue.season.first)} por temporada (${eur(PLANS.despegue.monthly.first)} al mes) y ${pct(PLANS.despegue.channelPct)} de lo que SolNow cobra online. Mismos módulos y mismo agente.`,
        calculator: 'Calcula tu cuota',
      },
    ],
  },
];

/**
 * La frase. Ya no se pinta como cierre del tour (el usuario la quitó el
 * 2026-09-27); queda aquí por si vuelve a hacer falta en la versión enviable.
 */
export const CLOSING = {
  id: 'frase',
  label: 'La frase',
  quote:
    'En este negocio, el que responde primero se lleva la reserva. SolNow responde en 9 segundos, a las 3 de la mañana también, confirma disponibilidad y deja al cliente pagando y firmando desde el chat. Y en el mostrador, el cliente queda contratado en segundos sin frenar la cola. La misma temporada con el mismo equipo y el doble de volumen, o con tres personas menos.',
};

/**
 * Apéndice: lo que se pregunta dos veces (comparativas con un motor concreto,
 * objeciones). Fuera del índice lateral; hoy vacío.
 */
export const APPENDIX: Chapter[] = [
  {
    id: 'preguntas',
    label: 'Lo que siempre preguntan',
    slides: [
      {
        kind: 'overview',
        title: 'Tres preguntas que siempre salen',
        layout: 'grid',
        items: [
          {
            k: '«Mi equipo ya contesta rápido»',
            h: 'De media tarda 1 h 50',
            p: 'Porque 1 de cada 10 clientes espera más de una hora y de noche nadie contesta. La IA tarda 9 segundos siempre.',
          },
          {
            k: '«¿Vende peor que una persona?»',
            h: 'Los datos dicen lo contrario',
            p: 'Cuantos más turnos lleva la IA sola, más cierra la conversación: del 27 % al 54 %. Y los días en que el equipo la interrumpe más no cierran más.',
          },
          {
            k: '«¿Y en invierno?»',
            h: `La cuota es ${eur(PLANS.escalar.monthly.first)} al mes por la primera base`,
            p: 'El resto es comisión sobre lo que SolNow cobra o cierra. En noviembre la factura baja sola.',
          },
        ],
      },
    ],
  },
];

/** El tour en un idioma: capítulos, apéndice, bucle del grafo y textos de interfaz. */
export interface Narrativa {
  chapters: Chapter[];
  appendix: Chapter[];
  storyLoop: typeof STORY_LOOP;
  ui: NarrativaUI;
}

export async function getNarrativa(locale: 'es' | 'en'): Promise<Narrativa> {
  if (locale === 'en') {
    const en = await import('@/content/narrativa.en');
    return { chapters: en.CHAPTERS_EN, appendix: en.APPENDIX_EN, storyLoop: en.STORY_LOOP_EN, ui: en.UI_EN };
  }
  return { chapters: CHAPTERS, appendix: APPENDIX, storyLoop: STORY_LOOP, ui: UI_ES };
}
