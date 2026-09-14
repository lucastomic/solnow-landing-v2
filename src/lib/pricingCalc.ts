/**
 * Aritmética de la calculadora de la sección de pricing.
 *
 * Sin JSX, sin textos y sin estado: entra un `Inputs`, sale un `Quote`. Todo lo
 * que se ve en pantalla se deriva de aquí, para que la UI no contenga ni una
 * fórmula y este fichero se pueda leer (y comprobar) de un tirón.
 *
 * Fuente de verdad del modelo: `SolNow/Pricing/Pricing.md` en el vault.
 * Distinta de `@/lib/calculator`, que sirve a la calculadora larga de
 * `/es/calculator` y todavía implementa el modelo de un solo plan.
 */

/**
 * Los dos planes. Mismos módulos; solo cambian el fijo y la capa canal.
 *
 * La capa vendedor es idéntica a propósito: el agente vale lo mismo lo
 * contrates donde lo contrates.
 */
export const PLANS = {
  despegue: {
    monthly: { first: 99, extra: null },
    season: { first: 790, extra: null },
    channelPct: 0.04,
    vendorPct: 0.02,
  },
  escalar: {
    monthly: { first: 199, extra: 99 },
    season: { first: 1590, extra: 790 },
    channelPct: 0.02,
    vendorPct: 0.02,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/** Modalidad de cobro de la parte fija. */
export type Billing = 'monthly' | 'season';

/** Descuento del pago por temporada: ocho cuotas en vez de doce. */
export const SEASON_DISCOUNT = 1 - PLANS.escalar.season.first / (PLANS.escalar.monthly.first * 12);

/**
 * Cuota fija del año para un plan, unas bases y una modalidad.
 *
 * En mensual son doce cuotas; en temporada, el precio de temporada tal cual.
 * Es el unico sitio donde se convierte entre las dos, para que las tarjetas y
 * la calculadora no puedan contar el fijo de formas distintas.
 */
export function fixedFor(plan: PlanKey, bases: number, billing: Billing): number {
  const p = PLANS[plan];
  const extras = Math.max(0, bases - 1);
  if (billing === 'season') return p.season.first + (p.season.extra ?? 0) * extras;
  return (p.monthly.first + (p.monthly.extra ?? 0) * extras) * 12;
}

/**
 * GMV online a partir del cual Escalar sale mas barato que Despegue, aun
 * pagando el doble de fijo.
 *
 * Depende de la modalidad, y no es un detalle: con el fijo mensual la
 * diferencia de cuota es de 1.200 EUR y el cruce cae en 60 K; con el de
 * temporada es de 800 EUR y cae en 40 K. Fijar uno de los dos haria que, en la
 * otra vista, la pagina recomendara el plan que cobra mas.
 *
 * La capa vendedor no entra: es identica en los dos planes y se cancela.
 */
export function escalarThreshold(billing: Billing): number {
  return (
    (fixedFor('escalar', 1, billing) - fixedFor('despegue', 1, billing)) /
    (PLANS.despegue.channelPct - PLANS.escalar.channelPct)
  );
}

/**
 * Despegue admite una sola base. No es una valla de precio sino de producto,
 * asi que el visitante no puede saltarsela eligiendo a mano.
 */
export function isAvailable(plan: PlanKey, bases: number): boolean {
  return plan === 'escalar' || bases < 2;
}

/** Por que se recomienda el plan que se recomienda. */
export type PlanReason = 'bases' | 'volume' | 'lowVolume';

/**
 * El plan que sale **mas barato para el operador** con sus datos.
 *
 * Compara **siempre sin repercutir**, aunque el visitante tenga encendido el
 * toggle de gastos de gestion: repercutir es una palanca suya, no un hecho de
 * su negocio, y metida en la cuenta la capa canal vale 0 para los dos planes,
 * gana el fijo mas bajo y la pagina acaba recomendando Despegue —con su 4%— a
 * quien solo le conviene si le pasa ese recargo al viajero en el checkout.
 *
 * La modalidad de pago si entra, porque cambia el fijo que se esta enseñando.
 */
export function planFor(
  bases: number,
  onlineGmv: number,
  billing: Billing
): { plan: PlanKey; reason: PlanReason } {
  if (bases >= 2) return { plan: 'escalar', reason: 'bases' };
  const cost = (k: PlanKey) => fixedFor(k, bases, billing) + onlineGmv * PLANS[k].channelPct;
  return cost('escalar') < cost('despegue')
    ? { plan: 'escalar', reason: 'volume' }
    : { plan: 'despegue', reason: 'lowVolume' };
}

export interface Inputs {
  /** Facturación de toda la temporada, todos los canales, IVA incluido. */
  gmv: number;
  /**
   * Parte que entra online, en tanto por uno: **motor y links de pago**, los
   * dos canales repercutibles.
   *
   * Las OTAs quedan fuera a propósito. Pagan capa canal pero no admiten gastos
   * de gestión —el precio lo fija la OTA—, así que meterlas aquí hacía que el
   * toggle pusiera a 0 € una línea que incluía dinero no repercutible. Se
   * despachan con una nota en la UI: modelarlas costaría un quinto control y
   * la calculadora pública no lo necesita.
   */
  onlineShare: number;
  /** Parte de la venta total que empieza por WhatsApp, en tanto por uno. */
  whatsappShare: number;
  /** Puntos de venta configurados. */
  bases: number;
  /** El operador repercute la capa canal al viajero como gastos de gestión. */
  bookingFee: boolean;
  /** Modalidad del fijo. La comparten las tarjetas y la calculadora. */
  billing: Billing;
  /**
   * Plan elegido a mano. `null` deja mandar a la recomendación.
   *
   * Se puede elegir el más caro —hay quien quiere ver la otra columna— pero no
   * uno imposible: Despegue con dos bases no existe, y `computeQuote` lo ignora
   * en vez de facturar un plan que no se puede contratar.
   */
  plan: PlanKey | null;
}

/**
 * Qué parte de la venta que **empieza por WhatsApp** acaba siendo base
 * facturable del agente.
 *
 * El operador no sabe —ni tiene por qué— qué porcentaje cierra el agente de
 * punta a punta. Sí sabe cuánto de su venta entra por WhatsApp, porque lo vive
 * todos los días. Así que se le pregunta eso y el ratio lo pone la producción.
 *
 * Medido en agosto de 2026 con la misma metodología en las dos cuentas:
 * numerador, la regla del pricing (reserva creada por el agente y cobrada por
 * su link, que es lo que de verdad se factura); denominador, toda reserva del
 * teléfono que habló por WhatsApp, que es lo que el operador llama «venta de
 * WhatsApp».
 *
 *   Banana  27.690 € / 114.675 € = 24,1%  ← la cuenta grande, el extremo bajo
 *   Moraira 12.498 € /  34.516 € = 36,2%
 *
 * Se muestra como rango, no como punto: el agente es la línea más pequeña de la
 * factura y fingir precisión decimal sobre una estimación sería peor que
 * enseñar la horquilla real.
 */
export const AGENT_RATIO = { low: 27_690 / 114_675, high: 12_498 / 34_516 } as const;

/** Mes al que corresponde la medición, para la etiqueta visible. */
export const AGENT_RATIO_SOURCE = '2026-08';

/**
 * Punto de partida de la calculadora: un operador de dos bases, con algo menos
 * de la mitad de su venta online y un tercio entrando por WhatsApp.
 */
export const DEFAULTS: Inputs = {
  gmv: 400_000,
  onlineShare: 0.45,
  whatsappShare: 0.35,
  bases: 2,
  // Apagado de salida, como manda la nota de pricing: descubrir el €0 es el
  // momento que vende, no el supuesto del que se parte.
  bookingFee: false,
  plan: null,
  // La nota de pricing asume que casi todos eligen temporada, y es un precio
  // real y vinculante: anclar ahi no es optimismo, es lo que se factura.
  billing: 'season',
};

/**
 * Una línea de la factura.
 *
 * Las tres son un rango: las dos primeras salen de datos que da el propio
 * operador y sus extremos coinciden, la del agente se estima y no. Que todas
 * tengan la misma forma evita un caso especial en cada punto de la UI.
 */
export interface Line {
  key: 'manual' | 'channel' | 'agent';
  /** Importe de negocio sobre el que se aplica la línea. */
  base: number;
  baseHigh: number;
  /** Tarifa en tanto por uno. */
  rate: number;
  /** Coste real al año, ya descontado lo que se repercute al viajero. */
  net: number;
  netHigh: number;
  /** Lo que se facturaría sin repercutir nada. Solo difiere en la capa canal. */
  gross: number;
  /** `true` si los dos extremos no coinciden y hay que pintar horquilla. */
  isRange: boolean;
}

export interface Quote {
  /** Plan con el que está calculada esta factura. */
  plan: PlanKey;
  /** El que sale más barato con estos datos. */
  recommended: PlanKey;
  /** Por qué ese y no el otro. La UI elige el texto con esto, no adivinando. */
  reason: PlanReason;
  /** GMV que no pasa por ningún canal nuestro: mostrador y reservas a mano. */
  manualGmv: number;
  onlineGmv: number;
  /** Venta que empieza por WhatsApp, tal como la declara el operador. */
  whatsappGmv: number;
  /** Extremos de la base facturable estimada del agente. */
  agentLow: number;
  agentHigh: number;
  lines: Line[];
  /** Cuota fija del año, con las bases adicionales dentro. */
  fixed: number;
  /** Coste real del año, con los gastos de gestión repercutidos descontados. */
  netYear: number;
  netYearHigh: number;
  /** Punto medio de la horquilla. Es lo que se enseña como total. */
  netYearAvg: number;
  /**
   * Lo que costaría el año repercutiendo la capa canal al viajero.
   *
   * Se calcula siempre, esté el toggle como esté, para poder enseñar el número
   * antes de que nadie lo toque: la repercusión es el diferenciador y quedaba
   * invisible para quien no marca la casilla.
   */
  netYearAvgWithFee: number;
  /** Lo que el operador repercute al viajero en todo el año. */
  passedOn: number;
}

export function computeQuote(i: Inputs): Quote {
  const onlineGmv = i.gmv * i.onlineShare;
  const { plan: recommended, reason } = planFor(i.bases, onlineGmv, i.billing);
  const planKey = i.plan && isAvailable(i.plan, i.bases) ? i.plan : recommended;
  const plan = PLANS[planKey];

  const manualGmv = i.gmv - onlineGmv;
  const whatsappGmv = i.gmv * i.whatsappShare;

  // La base del agente se deriva del benchmark, no se pregunta. Nunca puede
  // superar el online: lo que se factura por la regla del pricing entró cobrado
  // por el link del agente, y eso es dinero que cobramos online.
  const agentBase = (r: number) => Math.min(whatsappGmv * r, onlineGmv);
  const agentLow = agentBase(AGENT_RATIO.low);
  const agentHigh = agentBase(AGENT_RATIO.high);

  // La capa canal cubre **todo** lo que cobramos online, incluidas las reservas
  // del agente: su 4% total se lee 2% canal + 2% vendedor, no un 4% aparte.
  const channel = onlineGmv * plan.channelPct;

  // Solo la capa canal es repercutible, y la vendedor jamás: es la comisión del
  // agente, y nadie le pasa al cliente el sueldo de su vendedor.
  const passedOn = i.bookingFee ? channel : 0;

  const line = (
    key: Line['key'],
    base: number,
    baseHigh: number,
    rate: number,
    net: number,
    netHigh: number,
    gross: number
  ): Line => ({ key, base, baseHigh, rate, net, netHigh, gross, isRange: Math.round(net) !== Math.round(netHigh) });

  const lines: Line[] = [
    line('manual', manualGmv, manualGmv, 0, 0, 0, 0),
    line('channel', onlineGmv, onlineGmv, plan.channelPct, channel - passedOn, channel - passedOn, channel),
    line(
      'agent',
      agentLow,
      agentHigh,
      plan.vendorPct,
      agentLow * plan.vendorPct,
      agentHigh * plan.vendorPct,
      agentHigh * plan.vendorPct
    ),
  ];

  const fixed = fixedFor(planKey, i.bases, i.billing);

  const netYear = fixed + lines.reduce((a, l) => a + l.net, 0);
  const netYearHigh = fixed + lines.reduce((a, l) => a + l.netHigh, 0);

  return {
    plan: planKey,
    recommended,
    reason,
    manualGmv,
    onlineGmv,
    whatsappGmv,
    agentLow,
    agentHigh,
    lines,
    fixed,
    netYear,
    netYearHigh,
    netYearAvg: (netYear + netYearHigh) / 2,
    netYearAvgWithFee: (netYear + netYearHigh) / 2 - (passedOn > 0 ? 0 : channel),
    passedOn,
  };
}

/**
 * Invariantes del modelo. Si una falla, la página miente sobre un precio, que
 * es un problema comercial y no un bug de UI.
 */
export function integrityError(): string | null {
  if (PLANS.despegue.channelPct <= PLANS.escalar.channelPct) {
    return 'La capa canal de Despegue debe ser mayor que la de Escalar: si no, el upgrade no abarata nada.';
  }
  if (PLANS.despegue.vendorPct !== PLANS.escalar.vendorPct) {
    return 'La capa vendedor es la misma en los dos planes: el agente vale lo mismo se contrate donde se contrate.';
  }
  for (const billing of ['monthly', 'season'] as Billing[]) {
    const th = escalarThreshold(billing);
    if (!(th > 0) || !Number.isFinite(th)) {
      return `El umbral de Escalar no es un importe valido en ${billing}.`;
    }
    // El selector y el umbral tienen que contar lo mismo en cada vista: si
    // divergen, la pagina recomienda un plan y enseña un total que dice otra.
    if (
      planFor(1, th * 1.01, billing).plan !== 'escalar' ||
      planFor(1, th * 0.99, billing).plan !== 'despegue'
    ) {
      return `El umbral no coincide con el plan que elige el selector en ${billing}.`;
    }
  }
  for (const key of ['despegue', 'escalar'] as const) {
    const p = PLANS[key];
    if (p.season.first >= p.monthly.first * 12) {
      return `El pago por temporada de ${key} no ahorra nada frente a doce mensualidades.`;
    }
  }
  return null;
}
