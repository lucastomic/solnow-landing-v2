/**
 * Toda la aritmética de la calculadora de precio, sin una sola cifra dentro.
 *
 * Las cifras viven en `@/content/calculator`; la UI vive en
 * `@/components/calculator`. Este módulo es puro y no importa React a
 * propósito: es la parte que se puede razonar —y comprobar— leyéndola.
 */

import {
  BANK,
  BASES,
  CARD_SHARE,
  CHANNEL_ORDER,
  CAPABILITIES,
  COMPETITORS,
  FIXED,
  INITIAL_BILLING,
  MONTH_LABELS,
  OTAS,
  COMMISSION_MIN,
  FALLBACK,
  HUMAN_WHATSAPP,
  INITIAL_SEASONALITY,
  PRESENCIAL,
  RATES,
  REVENUE,
  SEASONALITY_KEYS,
  SEASONALITY_PRESETS,
  SEASON_MONTHS,
  SOLNOW_COVERS,
  TICKET,
  UNVERIFIED_COMPETITORS,
  WHATSAPP,
  type Billing,
  type CapabilityKey,
  type ChannelKey,
  type Competitor,
  type Rate,
  type SeasonalityKey,
} from '@/content/calculator';

/* ── Entrada ──────────────────────────────────────────────────────────── */

export interface Inputs {
  /** Facturación anual con IVA, en euros. */
  revenue: number;
  /** Número de bases físicas. */
  bases: number;
  /** % de la facturación que vende presencialmente (tarjeta + a mano). */
  presencial: number;
  /** % que cierra el agente de WhatsApp. */
  whatsapp: number;
  /** % que entra por OTAs y colaboradores. */
  otas: number;
  billing: Billing;

  /* Supuestos. Antes se asumían a espaldas del visitante; ahora los ajusta él,
     y por eso viajan en la URL como cualquier otro control. */

  /** Ticket medio, en euros. */
  ticket: number;
  /** De lo presencial, el % que cobra con tarjeta. El resto lo apunta a mano. */
  card: number;
  /** Lo que le cobra su banco por cobrar con tarjeta, en %. */
  bank: number;
  /** Lo que le cuesta atender a mano una reserva de WhatsApp, en euros. */
  human: number;
  /** Perfil de estacionalidad. Reparte el año; no cambia el total. */
  seasonality: SeasonalityKey;

  /**
   * Nuestras propias tarifas.
   *
   * Van en `Inputs` y no en `content` porque la página deja editarlas (ver
   * `PRICING_EDITOR`). `content` sigue siendo la fuente de los valores de
   * partida: esto es lo que el visitante haya puesto encima.
   */
  pricing: Pricing;

  /**
   * Una segunda propuesta de tarifa, para comparar dos modelos nuestros sobre
   * el mismo operador. `null` cuando solo hay una.
   *
   * No es un canal ni un supuesto del negocio: es la misma pregunta que
   * `pricing` hecha dos veces, así que vive al lado y no en otro sitio.
   */
  pricingB: Pricing | null;
}

/** Lo que cobramos: la cuota por base y la tarifa de cada canal. */
export interface Pricing {
  fixed: { monthly: { first: number; extra: number }; season: { first: number; extra: number } };
  rates: Record<ChannelKey, Rate>;
  /** Mínimo por reserva comisionable, en euros. */
  min: number;
}

export const DEFAULT_PRICING: Pricing = {
  fixed: {
    monthly: { ...FIXED.monthly },
    season: { ...FIXED.season },
  },
  rates: Object.fromEntries(
    CHANNEL_ORDER.map((k) => [k, { ...RATES[k] }]),
  ) as Record<ChannelKey, Rate>,
  min: COMMISSION_MIN,
};

export const DEFAULTS: Inputs = {
  revenue: REVENUE.initial,
  bases: BASES.initial,
  presencial: PRESENCIAL.initial,
  whatsapp: WHATSAPP.initial,
  otas: OTAS.initial,
  billing: INITIAL_BILLING,
  ticket: TICKET.initial,
  card: CARD_SHARE.initial,
  bank: BANK.initial,
  human: HUMAN_WHATSAPP.initial,
  seasonality: INITIAL_SEASONALITY,
  pricing: DEFAULT_PRICING,
  pricingB: null,
};

/** La curva del perfil elegido, con caída al de partida si la clave no existe. */
export function curveOf(key: SeasonalityKey): readonly number[] {
  return (SEASONALITY_PRESETS[key] ?? SEASONALITY_PRESETS[INITIAL_SEASONALITY]).curve;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Redondea al múltiplo de `step` más cercano dentro de [min, max]. */
function snap(v: number, { min, max, step }: { min: number; max: number; step: number }) {
  return clamp(Math.round(v / step) * step, min, max);
}

/* ── Los cuatro canales ───────────────────────────────────────────────── */

export type Channels = Record<ChannelKey, number>;

/** Las tres claves que el visitante mueve. `online` es el resto. */
export type ControlledChannel = 'presencial' | 'whatsapp' | 'otas';

/**
 * Los cinco canales, siempre sumando 100.
 *
 * El visitante mueve tres —presencial, WhatsApp y OTAs— y `online` es el resto;
 * que sea derivado es justamente lo que hace imposible enseñar una suma que no
 * cuadre. Lo presencial se parte después en dos canales de verdad según qué
 * parte se cobre con tarjeta: `card` paga nuestro 1% + 0,20 €, `manual` no paga
 * nada. Son tarifas distintas, así que son filas distintas.
 *
 * Cuando los tres controlados se pasan de 100 entre ellos, el exceso se
 * descuenta de los otros dos manteniendo su proporción, de modo que ningún
 * deslizador tenga que recortar su recorrido para proteger la suma.
 */
export function channels(i: Pick<Inputs, ControlledChannel | 'card'>): Channels {
  const presencial = clamp(i.presencial, 0, 100);
  let whatsapp = clamp(i.whatsapp, 0, 100);
  let otas = clamp(i.otas, 0, 100);

  const excess = presencial + whatsapp + otas - 100;
  if (excess > 0) {
    const others = whatsapp + otas;
    if (others > 0) {
      whatsapp = Math.round(whatsapp - (excess * whatsapp) / others);
      otas = Math.round(otas - (excess * otas) / others);
    }
    // El redondeo de los dos recortes puede dejar un punto suelto; se lo come
    // el que más tenga, que es el que menos lo nota.
    const drift = presencial + whatsapp + otas - 100;
    if (drift !== 0) {
      if (whatsapp >= otas) whatsapp = Math.max(0, whatsapp - drift);
      else otas = Math.max(0, otas - drift);
    }
  }

  const card = (presencial * clamp(i.card, 0, 100)) / 100;
  return {
    manual: presencial - card,
    card,
    whatsapp,
    otas,
    online: Math.max(0, 100 - presencial - whatsapp - otas),
  };
}

/** Lo presencial: los dos canales que salen del mismo mostrador. */
export const presencialShare = (ch: Channels) => ch.manual + ch.card;

/**
 * Mueve un canal y deja que los demás se recoloquen.
 *
 * En el caso normal solo se mueve `online`, que es el resto: el visitante
 * arrastra lo presencial y ve bajar la web, que es lo que espera. Solo cuando
 * `online` ya está a cero empieza a ceder terreno el resto, y lo hace
 * proporcionalmente para no reescribir un reparto que nadie ha tocado.
 */
export function withChannel(inputs: Inputs, key: ControlledChannel, value: number): Inputs {
  return normalise({ ...inputs, [key]: value });
}

/** Deja `presencial`, `whatsapp` y `otas` ya recolocados dentro de `Inputs`. */
function normalise(inputs: Inputs): Inputs {
  const ch = channels(inputs);
  return { ...inputs, presencial: presencialShare(ch), whatsapp: ch.whatsapp, otas: ch.otas };
}

/* ── Parte fija ───────────────────────────────────────────────────────── */

/** `fijo = primera base + adicional × (bases − 1)`, en la unidad de la tarifa. */
function fixedRate(bases: number, billing: Billing, pricing: Pricing): number {
  const rate = pricing.fixed[billing === 'season' ? 'season' : 'monthly'];
  return rate.first + rate.extra * (Math.max(1, bases) - 1);
}

export function fixedAnnual(bases: number, billing: Billing, pricing: Pricing): number {
  const rate = fixedRate(bases, billing, pricing);
  return billing === 'season' ? rate : rate * 12;
}

/** Ahorro del anual frente a pagar los doce meses, en tanto por uno. */
export function seasonSaving(bases: number, pricing: Pricing): number {
  const twelve = fixedRate(bases, 'monthly', pricing) * 12;
  return twelve === 0 ? 0 : 1 - fixedRate(bases, 'season', pricing) / twelve;
}

/**
 * Reglas de integridad, comprobadas contra las tarifas de verdad.
 *
 * El anual solo se puede vender como ahorro si de hecho lo es, y el mostrador
 * solo se puede vender como el canal barato si de hecho es el más barato. Si
 * alguien edita `content/calculator.ts` y rompe una de esas relaciones, la
 * página no debe enseñar un descuento negativo ni un incentivo invertido: debe
 * avisar y callarse la cifra. Devuelve el motivo, o `null` si todo está bien.
 *
 * El fijo se comprueba en los extremos —1 base y el máximo—: la relación es
 * lineal en `bases`, así que si se cumple en los dos extremos se cumple en
 * todos los puntos intermedios.
 */
export function pricingIntegrityError(pricing: Pricing = DEFAULT_PRICING): string | null {
  for (const bases of [BASES.min, BASES.max]) {
    if (fixedRate(bases, 'season', pricing) >= fixedRate(bases, 'monthly', pricing) * 12) {
      return `Con ${bases} base(s), la tarifa anual no es más barata que doce mensualidades.`;
    }
  }
  for (const key of SEASONALITY_KEYS) {
    const total = curveOf(key).reduce((a, b) => a + b, 0);
    if (Math.abs(total - 1) > 0.005) {
      return `El perfil de estacionalidad «${key}» suma ${(total * 100).toFixed(1)}% en vez de 100%. Revisa SEASONALITY_PRESETS en src/content/calculator.ts.`;
    }
  }
  const manual = pricing.rates.manual.pct;
  if (CHANNEL_ORDER.some((k) => k !== 'manual' && pricing.rates[k].pct < manual)) {
    return 'Lo que se apunta a mano no es el canal más barato: vender más a mano subiría el precio.';
  }
  return null;
}

/* ── El coste, por componentes ────────────────────────────────────────── */

/**
 * Una línea de la factura.
 *
 * La comparativa pinta estas mismas líneas para SolNow y para cada competidor,
 * y por eso el desglose de cada barra se lee sin salir de ella: no es un
 * resumen de la barra, es de lo que la barra está hecha.
 */
export interface CostLine {
  key: string;
  /** El concepto, a secas: «Web y motor», «Cuota fija», «Tu banco». */
  name: string;
  /**
   * La tarifa que lo produce: «2%», «1% + 0,20 €», «11,70 €/reserva».
   *
   * Va separada del nombre —antes iban fundidos en una sola cadena— porque la
   * tabla del desglose las quiere en columnas distintas, y partir un rótulo ya
   * montado por su punto medio es la clase de cosa que se rompe el día que un
   * nombre lleve un punto.
   */
  rate: string;
  /** Facturación sobre la que se aplica la tarifa. `null` en la cuota fija. */
  base: number | null;
  amount: number;
  /** De qué canal sale, cuando sale de uno. Da el color en la barra. */
  channel?: ChannelKey;
  /**
   * El canal del que esta línea es un coste derivado, no un canal más.
   *
   * Los pagos presenciales y el banco caen sobre un trozo de lo que se vende a
   * mano; la atención humana, sobre lo de WhatsApp. Sin esta marca, la tabla
   * los listaba al mismo nivel que los canales y su columna de facturación
   * sumaba 1.164.000 € contra un total de 800.000 €: el mismo dinero contado
   * dos veces.
   */
  parent?: ChannelKey;
}

/** `Web y motor · 2%`, para el rótulo de un tramo y su tooltip. */
export const lineLabel = (l: CostLine) => (l.rate ? `${l.name} · ${l.rate}` : l.name);

export interface Channelised {
  revenue: Channels;
  bookings: number;
}

/** Facturación anual imputada a cada canal, y reservas estimadas. */
function split(inputs: Inputs): Channelised {
  const ch = channels(inputs);
  const revenue = Object.fromEntries(
    CHANNEL_ORDER.map((k) => [k, (inputs.revenue * ch[k]) / 100]),
  ) as Channels;
  return { revenue, bookings: inputs.ticket > 0 ? inputs.revenue / inputs.ticket : 0 };
}

const CHANNEL_LABEL: Record<ChannelKey, string> = {
  manual: 'Manual y efectivo',
  card: 'Tarjeta física',
  online: 'Web y motor',
  whatsapp: 'WhatsApp',
  otas: 'OTAs',
};

/**
 * Coste anual de una plataforma cualquiera, línea a línea.
 *
 * Un solo modelo para SolNow y para la competencia: cuota, coste por reserva y
 * un porcentaje por canal. Que la comparativa salga de la misma función que el
 * resultado es lo que impide que las dos cuentas se separen con el tiempo.
 *
 * Un canal que la plataforma no cubre no genera línea: con FareHarbor las
 * reservas de WhatsApp simplemente no existen, no es que cuesten cero.
 */
function costLines(
  s: Channelised,
  spec: PlatformSpec,
  ticket: number,
): CostLine[] {
  const out: CostLine[] = [];

  if (spec.monthlyFee > 0) {
    out.push({
      key: 'fixed',
      name: 'Cuota fija',
      rate: `${money(spec.monthlyFee)}/mes`,
      base: null,
      amount: spec.monthlyFee * 12,
    });
  }

  for (const key of CHANNEL_ORDER) {
    const charge = chargeFor(key, spec);
    const base = s.revenue[key];
    const bookings = ticket > 0 ? base / ticket : 0;

    // Una línea a 0 € se conserva: un canal que se cubre y no se cobra no es lo
    // mismo que un canal que no se cubre. Es el caso de lo que el operador
    // apunta a mano, y enseñar «Manual y efectivo · 0% · 0 €» es el argumento.
    out.push({
      key: charge.key,
      name: charge.name,
      rate: charge.rate
        ? channelRateLabel(charge.rate, spec.minPerBooking ?? 0, ticket)
        : 'no lo cubre',
      base,
      amount: charge.rate
        ? channelAmount(base, bookings, charge.rate, spec.minPerBooking ?? 0, ticket)
        : 0,
      channel: key,
    });
  }
  return out;
}

/** Lo que una plataforma cobra en cada canal, más su cuota. */
interface PlatformSpec {
  monthlyFee: number;
  /** Su tarifa en cada canal. Solo se mira en los canales que cubre. */
  rates: Record<ChannelKey, Rate>;
  covers: Record<CapabilityKey, boolean>;
  /** Mínimo por reserva comisionable. Regla de SolNow; la competencia pasa 0. */
  minPerBooking?: number;
  /** Tarifas de repuesto para los canales que no cubre. Ver `FALLBACK`. */
  fallback: Record<'bank' | 'human', { name: string; rate: Rate }>;
}

/**
 * Quién cobra este canal, y a qué precio.
 *
 * Si la plataforma lo cubre, cobra ella. Si no lo cubre, el canal **no sale
 * gratis**: la tarjeta física la sigue cobrando su banco y el WhatsApp lo sigue
 * atendiendo alguien de su equipo. Eso es lo que convierte la comparativa en
 * una comparación de lo mismo, en vez de premiar a quien menos hace.
 *
 * Un canal sin capacidad asociada —lo que se apunta a mano— lo «cubre» todo el
 * mundo, porque no hay nada que cubrir: nadie cobra por ello.
 */
function chargeFor(
  key: ChannelKey,
  spec: PlatformSpec,
): { key: string; name: string; rate: Rate | null } {
  const isCapability = CAPABILITIES.some((c) => c.key === key);
  if (!isCapability || spec.covers[key as CapabilityKey]) {
    return { key, name: CHANNEL_LABEL[key], rate: spec.rates[key] };
  }

  const fallback = FALLBACK[key];
  if (!fallback) return { key, name: CHANNEL_LABEL[key], rate: null };

  const { name, rate } = spec.fallback[fallback];
  return { key: fallback, name, rate };
}

/** `2%`, `1% + 0,20 €/reserva`, `11,70 €/reserva`, `0%`. */
function channelRateLabel(rate: Rate, min: number, ticket: number): string {
  const parts: string[] = [];
  // Con tickets pequeños el mínimo manda sobre el porcentaje anunciado, y decir
  // «2%» cuando se está cobrando 0,20 € por reserva sería falso.
  const bound = min > 0 && ticket > 0 && rate.pct > 0 && ticket * rate.pct < min;
  if (bound) return `mín. ${unitMoney(min)}/reserva`;
  if (rate.pct > 0) parts.push(formatPct(rate.pct));
  if (rate.perBooking > 0) parts.push(`${unitMoney(rate.perBooking)}/reserva`);
  return parts.join(' + ') || '0%';
}

/**
 * Lo que cuesta un canal: su porcentaje más su fijo por reserva.
 *
 * El mínimo por reserva es `max(importe × %, mínimo)` **por reserva**, no sobre
 * el total del canal, y solo en escalones > 0%: una reserva al 0% no es
 * comisionable, así que tampoco tiene mínimo — sin ese corte, lo que se apunta
 * a mano pasaba a cobrar 0,20 € por reserva.
 */
function channelAmount(base: number, bookings: number, rate: Rate, min: number, ticket: number): number {
  const pctPart =
    rate.pct <= 0 || min <= 0 || ticket <= 0
      ? base * rate.pct
      : bookings * Math.max(ticket * rate.pct, min);
  return pctPart + bookings * rate.perBooking;
}

/**
 * Una **tarifa** en porcentaje: `2%`, `2,5%`, `0,75%`.
 *
 * No usa el formato de un decimal del resto de la página: ese redondeo convertía
 * un 0,75% en «0,8%», y una tarifa mal escrita en pantalla es una tarifa mal
 * comunicada. Dos decimales como techo y ninguno como suelo, para que un 2%
 * redondo no se lea como «2,00%».
 */
const formatPct = (v: number) => `${rateFmt.format(v * 100)}%`;


/* ── Resultado ────────────────────────────────────────────────────────── */

export interface Quote {
  inputs: Inputs;
  channels: Channels;
  revenueByChannel: Channels;
  bookings: number;
  lines: CostLine[];
  fixed: number;
  /** Todo lo que no es cuota: la suma de los cinco canales. */
  variable: number;
  total: number;
  /** Coste anual ÷ facturación anual, en tanto por uno. */
  effectiveRate: number;
  schedule: MonthCharge[];
  seasonSaving: number;
}

export interface MonthCharge {
  label: string;
  fixed: number;
  variable: number;
  total: number;
  /** Mes sin cuota fija: modalidad anual, de noviembre a febrero. */
  free: boolean;
}

/**
 * Las tarifas de repuesto, con los importes que ha puesto el visitante.
 *
 * Viven aquí y no en `content` porque sus cifras las pone él: lo que le cobra
 * su banco y lo que le cuesta que alguien atienda el WhatsApp. `FALLBACK` solo
 * dice qué canal cae en cuál.
 */
function fallbackRates(inputs: Inputs): PlatformSpec['fallback'] {
  return {
    bank: {
      name: 'Tu banco',
      rate: { pct: clamp(inputs.bank, 0, 100) / 100, perBooking: 0 },
    },
    human: {
      name: 'Atender WhatsApp a mano',
      rate: { pct: 0, perBooking: Math.max(0, inputs.human) },
    },
  };
}

/**
 * @param hidden Conceptos apagados en la leyenda.
 *
 * Se filtran **aquí** y no al pintar: si el desglose los quitara por su cuenta,
 * su total y el de la comparativa dirían cosas distintas sobre la misma
 * factura. Apagado un concepto, deja de existir para toda la página.
 */
export function computeQuote(raw: Inputs, hidden: readonly string[] = []): Quote {
  const inputs: Inputs = normalise({
    ...raw,
    revenue: snap(raw.revenue, REVENUE),
    bases: snap(raw.bases, BASES),
    ticket: snap(raw.ticket, TICKET),
    card: snap(raw.card, CARD_SHARE),
    bank: snap(raw.bank, BANK),
    human: snap(raw.human, HUMAN_WHATSAPP),
  });

  const s = split(inputs);
  const fixed = fixedAnnual(inputs.bases, inputs.billing, inputs.pricing);

  const channelLines = costLines(
    s,
    {
      monthlyFee: 0,
      rates: inputs.pricing.rates,
      covers: SOLNOW_COVERS,
      minPerBooking: inputs.pricing.min,
      fallback: fallbackRates(inputs),
    },
    inputs.ticket,
  );

  const showFixed = !hidden.includes('fixed');
  const shownChannels = channelLines.filter((l) => !hidden.includes(l.key));

  const lines: CostLine[] = [
    ...(showFixed
      ? [
          {
            key: 'fixed',
            name: 'Cuota fija',
            rate:
              inputs.billing === 'season'
                ? `${money(fixedRate(inputs.bases, 'season', inputs.pricing))}/año`
                : `${money(fixedRate(inputs.bases, 'monthly', inputs.pricing))}/mes`,
            base: null,
            amount: fixed,
          },
        ]
      : []),
    ...shownChannels,
  ];

  const shownFixed = showFixed ? fixed : 0;
  const variable = sum(shownChannels);
  const total = shownFixed + variable;

  return {
    inputs,
    channels: channels(inputs),
    revenueByChannel: s.revenue,
    bookings: s.bookings,
    lines,
    fixed: shownFixed,
    variable,
    effectiveRate: inputs.revenue > 0 ? total / inputs.revenue : 0,
    total,
    schedule: schedule(inputs, inputs.revenue > 0 ? variable / inputs.revenue : 0, showFixed),
    seasonSaving: seasonSaving(inputs.bases, inputs.pricing),
  };
}

const sum = (lines: CostLine[]) => lines.reduce((a, l) => a + l.amount, 0);

function schedule(inputs: Inputs, variableRate: number, showFixed: boolean): MonthCharge[] {
  const seasonMonthly = fixedRate(inputs.bases, 'season', inputs.pricing) / SEASON_MONTHS.length;
  const monthly = fixedRate(inputs.bases, 'monthly', inputs.pricing);

  return curveOf(inputs.seasonality).map((weight, i) => {
    const charged =
      showFixed && (inputs.billing === 'monthly' || (SEASON_MONTHS as readonly number[]).includes(i));
    const fixedPart = !charged ? 0 : inputs.billing === 'season' ? seasonMonthly : monthly;
    const variablePart = inputs.revenue * weight * variableRate;
    return {
      label: MONTH_LABELS[i],
      fixed: fixedPart,
      variable: variablePart,
      total: fixedPart + variablePart,
      free: !charged,
    };
  });
}

/* ── Comparativa ──────────────────────────────────────────────────────── */

export interface Alternative {
  key: string;
  name: string;
  total: number;
  lines: CostLine[];
  /** Las capacidades visibles en la tabla, con si esta plataforma las cubre. */
  capabilities: readonly { key: CapabilityKey; label: string; on: boolean }[];
  note: string;
  chargesTraveler: boolean;
  verified: boolean;
  isSolnow: boolean;
}

/**
 * El mismo operador en cada alternativa, de menor a mayor.
 *
 * SolNow entra en el ranking como una más y se ordena por lo que cuesta, no por
 * dónde nos gustaría que saliera: una comparativa amañada se detecta en la
 * primera llamada y cuesta más que el lead que gana. Lo que sí viaja con cada
 * fila es **qué no cubre**, porque el precio a secas compara dos cosas que no
 * son la misma.
 */
export function alternatives(
  quotes: readonly Quote[],
  hidden: readonly string[] = [],
): Alternative[] {
  // Las propuestas solo se diferencian en lo que cobramos: el negocio del
  // operador —su reparto por canales, su ticket, su banco— es el mismo en
  // todas, así que la competencia se calcula una vez, sobre la primera.
  const [primary] = quotes;
  const { inputs } = primary;
  const s: Channelised = { revenue: primary.revenueByChannel, bookings: primary.bookings };
  const fallback = fallbackRates(inputs);
  const capabilities = (covers: Record<CapabilityKey, boolean>) =>
    CAPABILITIES.map((cap) => ({ ...cap, on: covers[cap.key] }));

  const rivals = COMPETITORS.filter(
    (c: Competitor) => c.verified || UNVERIFIED_COMPETITORS === 'show',
  ).map((c: Competitor) => {
    // Un canal que no cubre no se le descuenta: se lo cobra otro. Ver
    // `chargeFor`. Su coste por reserva solo cae en los canales que sí cubre —
    // no puede cobrar por reservas que nunca ve.
    const rates = Object.fromEntries(
      CHANNEL_ORDER.map((k) => [k, { pct: c.pct[k], perBooking: c.perBooking }]),
    ) as Record<ChannelKey, Rate>;

    const lines = costLines(s, { monthlyFee: c.monthlyFee, rates, covers: c.covers, fallback }, inputs.ticket);
    return {
      key: c.key,
      name: c.name,
      total: sum(lines),
      lines,
      capabilities: capabilities(c.covers),
      note: c.note,
      chargesTraveler: c.chargesTraveler,
      verified: c.verified,
      isSolnow: false,
    };
  });

  const ours: Alternative[] = quotes.map((q, i) => ({
    key: proposalKey(i),
    name: quotes.length > 1 ? `SolNow · ${PROPOSAL_LABELS[i]}` : 'SolNow',
    total: q.total,
    lines: q.lines,
    capabilities: capabilities(SOLNOW_COVERS),
    note: quotes.length > 1 ? `Propuesta ${PROPOSAL_LABELS[i]}` : 'Tu resultado',
    chargesTraveler: false,
    verified: true,
    isSolnow: true,
  }));

  return applyHidden([...ours, ...rivals], hidden);
}

/** Cómo se nombran las propuestas nuestras cuando hay más de una. */
export const PROPOSAL_LABELS = ['A', 'B'] as const;

export const proposalKey = (i: number) => (i === 0 ? 'solnow' : `solnow-${PROPOSAL_LABELS[i]}`);

const sortByTotal = (rows: Alternative[]) => [...rows].sort((a, b) => a.total - b.total);

/**
 * Quita de la tabla los conceptos que el visitante ha apagado en la leyenda.
 *
 * No es un filtro de dibujo: los totales se recalculan sin esas líneas y la
 * tabla se reordena, porque apagar «Tu banco» responde a «¿y si el banco no
 * existiera?» en las siete barras a la vez, que es justo la pregunta que se
 * hace en una demo.
 *
 * Un concepto apagado sigue apareciendo en la leyenda, en gris: si desapareciera
 * de ahí no habría forma de volver a encenderlo.
 */
function applyHidden(rows: Alternative[], hidden: readonly string[]): Alternative[] {
  // Sin atajo para la lista vacía: esta función es también la que ordena, y
  // devolver las filas tal cual dejaba la tabla en el orden de declaración.
  if (hidden.length === 0) return sortByTotal(rows);
  return sortByTotal(
    rows.map((row) => {
      const lines = row.lines.filter((l) => !hidden.includes(l.key));
      return { ...row, lines, total: sum(lines) };
    }),
  );
}

/* ── Formato ──────────────────────────────────────────────────────────── */

// `useGrouping: true` no es el defecto: `es-ES` usa `min2`, que deja los
// cuatro dígitos sin separar (8180 €) y los cinco separados (10.544 €). Mezclar
// las dos formas en la misma barra se lee como un error de la página.
const eur = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0, useGrouping: true });
const cents = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct1 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const rateFmt = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** `8.180 €`. Euros enteros: ningún importe de la factura lleva decimales. */
export const money = (v: number) => `${eur.format(Math.round(v))} €`;

/**
 * `11,70 €`, `0,20 €`, `99 €`. Para precios unitarios —por reserva, por
 * operación—, donde los céntimos son parte de la tarifa y redondearlos la
 * cambia: 11,70 € por reserva no es «12 € por reserva».
 */
export const unitMoney = (v: number) =>
  Number.isInteger(v) ? `${eur.format(v)} €` : `${cents.format(v)} €`;

/** `1,0%`. El único sitio con decimal, y solo uno. */
export const percent = (v: number) => `${pct1.format(v * 100)}%`;

/** `1,0%` a partir de un valor ya en base 100. */
export const percentOf100 = (v: number) => `${pct1.format(v)}%`;

export const integer = (v: number) => eur.format(Math.round(v));

function seasonalityFrom(v: string | null): SeasonalityKey {
  return v !== null && (SEASONALITY_KEYS as string[]).includes(v)
    ? (v as SeasonalityKey)
    : DEFAULTS.seasonality;
}

/* ── URL ──────────────────────────────────────────────────────────────── */

/**
 * La configuración cabe en la barra de direcciones, de modo que el visitante
 * pueda copiar el enlace, volver a su cálculo o mandárselo a un socio. Claves
 * cortas porque la URL se comparte a mano y por WhatsApp.
 */
export function toQuery(i: Inputs): string {
  const ch = channels(i);
  return new URLSearchParams({
    f: String(i.revenue),
    b: String(i.bases),
    m: String(presencialShare(ch)),
    w: String(ch.whatsapp),
    o: String(ch.otas),
    p: i.billing === 'season' ? 'temp' : 'mes',
    t: String(i.ticket),
    k: String(i.card),
    n: String(i.bank),
    h: String(i.human),
    s: i.seasonality,
    // Solo viaja si se ha tocado: en el 99% de los enlaces el pricing es el de
    // tarifa, y meterlo siempre convertiría una URL que se comparte por
    // WhatsApp en una ristra de once números.
    ...(isDefaultPricing(i.pricing) ? {} : { pr: encodePricing(i.pricing) }),
    ...(i.pricingB ? { prb: encodePricing(i.pricingB) } : {}),
  }).toString();
}

/** Los once números del pricing, en orden fijo. Ver `encodePricing`. */
const PRICING_FIELDS: readonly ((p: Pricing) => number)[] = [
  (p) => p.fixed.monthly.first,
  (p) => p.fixed.monthly.extra,
  (p) => p.fixed.season.first,
  (p) => p.fixed.season.extra,
  (p) => p.rates.manual.pct * 100,
  (p) => p.rates.card.pct * 100,
  (p) => p.rates.card.perBooking,
  (p) => p.rates.online.pct * 100,
  (p) => p.rates.otas.pct * 100,
  (p) => p.rates.whatsapp.pct * 100,
  (p) => p.min,
];

const encodePricing = (p: Pricing) => PRICING_FIELDS.map((f) => f(p)).join('_');

/**
 * Lo contrario. Si falta un número o hay basura, ese campo cae a la tarifa de
 * catálogo en vez de tumbar el resto: un enlace recortado tiene que seguir
 * enseñando un precio, aunque sea el nuestro de lista.
 */
function decodePricing(raw: string | null): Pricing {
  if (!raw) return DEFAULT_PRICING;
  const n = raw.split('_').map(Number);
  const at = (i: number, fallback: number) =>
    Number.isFinite(n[i]) && n[i] >= 0 ? n[i] : fallback;
  const d = DEFAULT_PRICING;
  return {
    fixed: {
      monthly: { first: at(0, d.fixed.monthly.first), extra: at(1, d.fixed.monthly.extra) },
      season: { first: at(2, d.fixed.season.first), extra: at(3, d.fixed.season.extra) },
    },
    rates: {
      manual: { pct: at(4, d.rates.manual.pct * 100) / 100, perBooking: 0 },
      card: { pct: at(5, d.rates.card.pct * 100) / 100, perBooking: at(6, d.rates.card.perBooking) },
      online: { pct: at(7, d.rates.online.pct * 100) / 100, perBooking: 0 },
      otas: { pct: at(8, d.rates.otas.pct * 100) / 100, perBooking: 0 },
      whatsapp: { pct: at(9, d.rates.whatsapp.pct * 100) / 100, perBooking: 0 },
    },
    min: at(10, d.min),
  };
}

export const isDefaultPricing = (p: Pricing) =>
  PRICING_FIELDS.every((f) => f(p) === f(DEFAULT_PRICING));

/** Lo contrario, tolerante: cualquier parámetro ausente o basura cae al default. */
export function fromQuery(search: string): Inputs {
  const p = new URLSearchParams(search);
  const num = (key: string, fallback: number) => {
    // `Number('')` es 0, no `NaN`, así que un `?b=` vacío en un enlace mal
    // recortado se leería como «cero bases» en vez de caer al valor de partida.
    const raw = p.get(key)?.trim();
    if (!raw) return fallback;
    const v = Number(raw);
    return Number.isFinite(v) ? v : fallback;
  };

  const base: Inputs = {
    revenue: snap(num('f', DEFAULTS.revenue), REVENUE),
    bases: snap(num('b', DEFAULTS.bases), BASES),
    presencial: clamp(num('m', DEFAULTS.presencial), 0, 100),
    whatsapp: clamp(num('w', DEFAULTS.whatsapp), 0, 100),
    otas: clamp(num('o', DEFAULTS.otas), 0, 100),
    billing: p.get('p') === 'mes' ? 'monthly' : p.get('p') === 'temp' ? 'season' : DEFAULTS.billing,
    ticket: snap(num('t', DEFAULTS.ticket), TICKET),
    card: snap(num('k', DEFAULTS.card), CARD_SHARE),
    bank: snap(num('n', DEFAULTS.bank), BANK),
    human: snap(num('h', DEFAULTS.human), HUMAN_WHATSAPP),
    // Una clave desconocida cae al perfil de partida en vez de romper el
    // calendario: la URL se comparte a mano y llega recortada más de una vez.
    seasonality: seasonalityFrom(p.get('s')),
    pricing: decodePricing(p.get('pr')),
    // A diferencia de `pr`, aquí la ausencia sí significa algo: no hay segunda
    // propuesta. Por eso no cae al catálogo, cae a `null`.
    pricingB: p.get('prb') ? decodePricing(p.get('prb')) : null,
  };
  // Normalizar aquí y no al pintar: así el estado que entra por la URL es del
  // mismo tipo que el que produce cualquier deslizador, y no hay un reparto
  // «de enlace compartido» que se comporte distinto.
  return normalise(base);
}
