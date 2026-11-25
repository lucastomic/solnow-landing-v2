/**
 * Pricing 2027: el fijo de los dos planes y la tarifa por canal, más la
 * aritmética de la calculadora corta (modal de la narrativa).
 *
 * Sin JSX, sin textos y sin estado: entra un `Inputs`, sale un `Quote`.
 *
 * Fuente de verdad del modelo: `SolNow/Pricing/Pricing 2027.md` en el vault.
 * Distinta de `@/lib/calculator`, que sirve a la comparativa larga de
 * `/es/calculator` con sus propias tarifas en `@/content/calculator`.
 */

/**
 * Los dos planes. Solo cambia el fijo y qué canales abre cada uno: el
 * porcentaje por canal es el mismo en los dos (ver `RATES`). Subir de plan es
 * abrir canales, no ahorrarse un punto.
 *
 * `season` es el pago anual (−33 %). La clave se conserva por compatibilidad
 * con las URLs y el conmutador de `PricingSurface`.
 */
export const PLANS = {
  despegue: {
    monthly: { first: 99, extra: null },
    season: { first: 790, extra: null },
  },
  escalar: {
    monthly: { first: 199, extra: 99 },
    season: { first: 1590, extra: 790 },
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/** Modalidad de cobro de la parte fija: mensual o anual. */
export type Billing = 'monthly' | 'season';

/** Descuento del pago anual frente a doce mensualidades. */
export const SEASON_DISCOUNT = 1 - PLANS.escalar.season.first / (PLANS.escalar.monthly.first * 12);

/**
 * Tarifa por canal, igual en los dos planes. Depende de dónde se vende y de
 * quién fija el precio, nunca del medio de pago.
 *
 * - `web` 3 %: motor web (web, widget, bono) y kiosko con colaborador o fuera
 *   de la base. Lo paga el cliente final como «gastos de gestión», en línea
 *   aparte y visibles desde el primer precio. Si el operador no lo repercute,
 *   lo asume él al mismo 3 %.
 * - `agent` 1 %: reservas del agente de IA en WhatsApp. Lo paga el operador.
 *   Si el cliente paga online, la reserva pasa además por el motor web y suma
 *   su 3 % de gastos de gestión (ver `agentOnline` en `Inputs`). Pagada en
 *   efectivo, solo el 1 %.
 * - `ota` 1 %: OTA sincronizada. Lo paga el operador.
 * - `manual` 0 %: mostrador, teléfono, WhatsApp del equipo, enlace de pago que
 *   envía el equipo, colaboradores a mano.
 *
 * El kiosko en la base (1 %) no tiene control en la calculadora corta: se
 * menciona en una nota para no añadir otro deslizador.
 */
export const RATES = {
  web: 0.03,
  agent: 0.01,
  ota: 0.01,
  manual: 0,
} as const;

export type ChannelKey = keyof typeof RATES;

/**
 * Líneas de la factura: los cuatro canales más `agentWeb`, el 3 % del motor
 * web sobre lo que el agente cobra online.
 */
export type LineKey = ChannelKey | 'agentWeb';

/** Quién paga cada línea, si el operador repercute el 3 %. */
export const PAYER: Record<LineKey, 'client' | 'you' | null> = {
  web: 'client',
  agent: 'you',
  agentWeb: 'client',
  ota: 'you',
  manual: null,
};

/**
 * Cuota fija del año para un plan, unas bases y una modalidad.
 * En mensual son doce cuotas; en anual, el precio anual tal cual.
 */
export function fixedFor(plan: PlanKey, bases: number, billing: Billing): number {
  const p = PLANS[plan];
  const extras = Math.max(0, bases - 1);
  if (billing === 'season') return p.season.first + (p.season.extra ?? 0) * extras;
  return (p.monthly.first + (p.monthly.extra ?? 0) * extras) * 12;
}

/**
 * El plan que corresponde. No hay comparación de precio: con el mismo % en los
 * dos planes, Despegue siempre sale más barato con una base. Escalar se
 * necesita por producto (varias bases, kioskos, TPV), no por volumen.
 */
export function planFor(bases: number): PlanKey {
  return bases >= 2 ? 'escalar' : 'despegue';
}

export interface Inputs {
  /** Facturación de toda la temporada, todos los canales. */
  gmv: number;
  /** Parte que entra por el motor web, en tanto por uno. */
  webShare: number;
  /** Parte que vende el agente de IA en WhatsApp, en tanto por uno. */
  agentShare: number;
  /**
   * De lo que vende el agente, la parte que el cliente paga online (el resto,
   * en efectivo), en tanto por uno. Esa parte suma el 3 % del motor web.
   */
  agentOnline: number;
  /** Parte que entra por OTAs, en tanto por uno. */
  otaShare: number;
  bases: number;
  billing: Billing;
  /** «Lo asumo yo»: el operador no repercute el 3 % y lo paga él. */
  absorb: boolean;
}

export const DEFAULTS: Inputs = {
  gmv: 400_000,
  webShare: 0.2,
  agentShare: 0.05,
  agentOnline: 1,
  otaShare: 0.1,
  bases: 2,
  billing: 'season',
  absorb: false,
};

/** Las tres partes de canal nunca suman más de 1: el resto es manual al 0 %. */
export type ShareKey = 'webShare' | 'agentShare' | 'otaShare';
const SHARE_KEYS: ShareKey[] = ['webShare', 'agentShare', 'otaShare'];

/** Fija una parte recortándola para que la suma no pase de 100 %. */
export function withShare(i: Inputs, key: ShareKey, value: number): Inputs {
  const others = SHARE_KEYS.filter((k) => k !== key).reduce((a, k) => a + i[k], 0);
  return { ...i, [key]: Math.max(0, Math.min(value, 1 - others)) };
}

export interface Line {
  key: LineKey;
  /** Facturación sobre la que se aplica la tarifa. */
  base: number;
  rate: number;
  amount: number;
  payer: 'client' | 'you' | null;
}

export interface Quote {
  plan: PlanKey;
  lines: Line[];
  /** Cuota fija del año. */
  fixed: number;
  /**
   * Lo que sale del bolsillo del operador: fijo + 1 % (agente y OTAs). Con
   * `absorb`, también el 3 %.
   */
  youPay: number;
  /**
   * Lo que paga su cliente como gastos de gestión, aparte del precio: el 3 %
   * de la web y de lo que el agente cobra online. 0 con `absorb`.
   */
  clientPays: number;
  /** Todo lo que cobra SolNow al año. */
  total: number;
}

/**
 * La cuenta, sin tramos ni mínimos:
 *
 *   web       = gmv × webShare                     → 3 % cliente
 *   agent     = gmv × agentShare                   → 1 % operador
 *   agentWeb  = agent × agentOnline                → 3 % cliente
 *   ota       = gmv × otaShare                     → 1 % operador
 *   manual    = gmv − web − agent − ota            → 0 %
 *
 *   youPay     = fijo + 1 % (+ 3 % si `absorb`)
 *   clientPays = 3 % (0 si `absorb`)
 */
export function computeQuote(i: Inputs): Quote {
  const web = i.gmv * i.webShare;
  const agent = i.gmv * i.agentShare;
  const agentWeb = agent * i.agentOnline;
  const ota = i.gmv * i.otaShare;
  const manual = Math.max(0, i.gmv - web - agent - ota);

  const line = (key: LineKey, base: number, rate: number): Line => {
    const payer = PAYER[key];
    return { key, base, rate, amount: base * rate, payer: payer === 'client' && i.absorb ? 'you' : payer };
  };
  const lines = [
    line('web', web, RATES.web),
    line('agent', agent, RATES.agent),
    line('agentWeb', agentWeb, RATES.web),
    line('ota', ota, RATES.ota),
    line('manual', manual, RATES.manual),
  ];

  const plan = planFor(i.bases);
  const fixed = fixedFor(plan, i.bases, i.billing);
  const sum = (who: 'client' | 'you') => lines.filter((l) => l.payer === who).reduce((a, l) => a + l.amount, 0);
  const youPay = fixed + sum('you');
  const clientPays = sum('client');

  return { plan, lines, fixed, youPay, clientPays, total: youPay + clientPays };
}
