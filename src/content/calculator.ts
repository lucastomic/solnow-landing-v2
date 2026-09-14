/**
 * Datos editables de la calculadora pública de precio (`/es/calculator`).
 *
 * Fuente de verdad: `Pricing v1` en el vault de Obsidian — «El fijo y la
 * escalera», «Canal de origen y atribución» y «Reglas de cálculo y
 * facturación». Si esas notas y este fichero discrepan, mandan las notas.
 *
 * Todo lo que cambia con el tiempo vive aquí y solo aquí: tarifas, escalera de
 * comisión, pagos presenciales, competencia, estacionalidad y ticket medio. La
 * lógica (`@/lib/calculator`) no contiene ni una cifra, y la UI no contiene
 * ninguna fórmula. Cambiar un precio es tocar este fichero y nada más.
 */

/**
 * Deja al visitante editar **nuestras** tarifas desde la página.
 *
 * ⚠️ El documento funcional pedía justo lo contrario para la web pública: «en la
 * versión pública las comisiones son fijas y no editables; exponerlas invitaría
 * a negociar el precio antes de la primera llamada». Con `false` el bloque
 * desaparece y la calculadora vuelve a usar las tarifas de este fichero, sin
 * tocar nada más.
 */
export const PRICING_EDITOR = true;

/** Modalidad de cobro de la parte fija. */
export type Billing = 'monthly' | 'season';

/**
 * Los cinco canales en los que se reparte lo que vende el operador.
 *
 * `manual` y `card` son los dos presenciales, y son **canales distintos**, no
 * uno con un matiz: una reserva que apuntas a mano y cobras en efectivo no nos
 * paga nada; la misma reserva cobrada con nuestro datáfono paga el 1% + 0,20 €.
 * Que pase por el mostrador y que se meta a mano son dos cosas diferentes, y
 * meterlas en el mismo saco hacía que la tabla cobrara 0% sobre dinero que sí
 * lleva tarifa.
 */
export type ChannelKey = 'manual' | 'card' | 'online' | 'whatsapp' | 'otas';

/**
 * Orden en el que se lee la factura, y por tanto en el que se pintan los tramos
 * de todas las barras, la leyenda y el reparto.
 *
 * Va de lo que el cliente ya da por hecho a lo que le sorprende: primero lo que
 * cobra el motor, luego las OTAs, después los dos presenciales —la tarjeta y lo
 * que se mete a mano, que es donde tiene el grueso y no paga nada— y al final
 * WhatsApp, que es el escalón que hay que explicar. Cambiarlo aquí lo cambia en
 * la página entera. La cuota fija va siempre delante de los cinco.
 */
export const CHANNEL_ORDER: readonly ChannelKey[] = ['online', 'otas', 'card', 'manual', 'whatsapp'];

/* ── 1 · El fijo ──────────────────────────────────────────────────────── */

/**
 * Cuota por base. Un solo producto, todo incluido: motor, bono, links de pago,
 * WhatsApp (atención y persigue), OTAs, colaboradores, TPV, contratos y firma,
 * embarque, pizarra, liquidaciones, dashboards, kiosk, datáfono, usuarios
 * ilimitados, **conversaciones ilimitadas** y onboarding done-for-you.
 *
 * No son planes y no hay tiers de features: es la misma cosa para todos.
 *
 * El anual son ocho cuotas —cuatro gratis, un 33% menos— y se paga al abrir
 * temporada. Es la respuesta a la objeción de invierno.
 */
export const FIXED = {
  monthly: { first: 199, extra: 99 },
  season: { first: 1590, extra: 790 },
} as const;

/**
 * Meses en los que se cobra cuota en modalidad anual (0 = enero).
 * Marzo–octubre: ocho meses, los mismos ocho que financia la tarifa anual.
 */
export const SEASON_MONTHS = [2, 3, 4, 5, 6, 7, 8, 9] as const;

/* ── 2 · Lo que cobramos por canal ────────────────────────────────────── */

/** Tarifa de un canal: un porcentaje, y opcionalmente un fijo por reserva. */
export interface Rate {
  pct: number;
  perBooking: number;
}

/**
 * Lo que cobra SolNow en cada canal.
 *
 * Los cuatro primeros son la escalera de comisión, y el escalón lo decide
 * **quién creó la reserva**, no cómo se pagó:
 *
 * - `manual` **0%** — lo hiciste vos: a mano, en efectivo, pizarra,
 *   formularios. No hay comisión donde SolNow no es dueña del flujo.
 * - `online` **2%** — SolNow lo cobró: motor de reservas, bono regalo, links.
 * - `otas` **2%** — OTAs conectadas. Adicional a lo que ya cobra la propia OTA,
 *   y sobre el precio bruto de la reserva.
 * - `whatsapp` **4%** — SolNow lo vendió: reserva creada por el agente y
 *   cobrada por su link. Es el escalón más alto porque es el único canal en el
 *   que el software no asiste la venta: la cierra.
 *
 * `card` está **fuera de la escalera**: no es comisión, es la pasarela del
 * datáfono y el kiosk con la adquirencia dentro, y sustituye a la del banco en
 * vez de sumarse a ella.
 *
 * ⚠️ El precio de `card` no está cerrado. La nota de pricing dice que no se
 * publica hasta tener el coste de adquirencia negociado por escrito, y que si
 * el mezclado real supera el 0,85% el precio de lanzamiento sube a
 * 1,2% + 0,20 €.
 *
 * Invariante del modelo: `manual` es el más barato de los cinco. Si dejara de
 * serlo, vender más a mano subiría el precio y el argumento se daría la vuelta.
 */
export const RATES: Record<ChannelKey, Rate> = {
  manual: { pct: 0, perBooking: 0 },
  card: { pct: 0.01, perBooking: 0.2 },
  online: { pct: 0.02, perBooking: 0 },
  whatsapp: { pct: 0.04, perBooking: 0 },
  otas: { pct: 0.02, perBooking: 0 },
};

/** Mínimo por reserva comisionable, en euros. Solo en escalones > 0%. */
export const COMMISSION_MIN = 0.2;

/* ── 3 · Lo que paga cuando la plataforma no cubre el canal ───────────── */

/**
 * Un canal que la plataforma no cubre no sale gratis: lo cubre otro, y cobra.
 *
 * - Si nadie le da datáfono, la tarjeta física la sigue cobrando **su banco**.
 * - Si nadie le atiende el WhatsApp, lo atiende **alguien de su equipo**, y ese
 *   rato cuesta dinero.
 *
 * Son los dos costes que el operador tiene con cualquier alternativa y no tiene
 * con nosotros. Sin ellos, la comparativa mide dos cosas distintas y nos deja
 * pagando por canales que a los demás les salen «gratis» solo porque no los
 * hacen.
 *
 * Los importes los pone el visitante (ver `BANK` y `HUMAN_WHATSAPP`); esto solo
 * dice qué canal cae en cuál.
 */
export const FALLBACK: Partial<Record<ChannelKey, 'bank' | 'human'>> = {
  card: 'bank',
  whatsapp: 'human',
};

/* ── 4 · Competencia ──────────────────────────────────────────────────── */

/**
 * Qué cubre cada plataforma. Es la mitad de la comparativa: nuestra comisión y
 * la de FareHarbor no compran lo mismo, y una barra de precio a secas lo
 * esconde. El orden es el de la página.
 */
export const CAPABILITIES = [
  { key: 'online', label: 'Web y motor' },
  { key: 'otas', label: 'OTAs' },
  { key: 'card', label: 'Cobro con tarjeta' },
  { key: 'whatsapp', label: 'WhatsApp con IA' },
] as const;

export type CapabilityKey = (typeof CAPABILITIES)[number]['key'];

export interface Competitor {
  key: string;
  name: string;
  /** Cuota fija mensual, en euros. */
  monthlyFee: number;
  /** Coste por reserva, en euros. */
  perBooking: number;
  /** Comisión por canal. Un canal que no cubre no genera coste: ver `covers`. */
  pct: Record<ChannelKey, number>;
  /** La comisión la paga el viajero en el checkout, no el operador. */
  chargesTraveler: boolean;
  covers: Record<CapabilityKey, boolean>;
  /** Cómo se compone la tarifa, en una línea. */
  note: string;
  /**
   * Tarifa contrastada contra la web pública del proveedor.
   *
   * En `false` la cifra es una estimación y **no debe publicarse**: la propia
   * especificación avisa de que un precio erróneo en la web pública es un
   * problema comercial, no un bug. `UNVERIFIED_COMPETITORS` decide qué hace la
   * página con ellos.
   */
  verified: boolean;
}

/** Última verificación real de los precios públicos de la competencia. */
export const COMPETITORS_VERIFIED_AT = '2026-08-28';

/**
 * Qué hacer con los competidores cuya tarifa no está contrastada.
 *
 * `'hide'` los deja fuera de la página hasta que alguien los verifique y ponga
 * su `verified` en `true`. Es el valor con el que hay que desplegar.
 * `'show'` los pinta igualmente, marcados: sirve para revisar la página en
 * local antes de tener las tarifas confirmadas.
 */
export const UNVERIFIED_COMPETITORS: 'hide' | 'show' = 'show';

const NO_PCT: Record<ChannelKey, number> = { manual: 0, card: 0, online: 0, whatsapp: 0, otas: 0 };

export const COMPETITORS: readonly Competitor[] = [
  {
    key: 'fareharbor',
    name: 'FareHarbor',
    monthlyFee: 0,
    perBooking: 0,
    pct: { ...NO_PCT, online: 0.06, otas: 0.02 },
    chargesTraveler: true,
    covers: { card: false, whatsapp: false, online: true, otas: true },
    note: '6% online + 2% OTAs · sin cuota',
    verified: true,
  },
  {
    key: 'regiondo',
    name: 'Regiondo',
    monthlyFee: 99,
    perBooking: 0.49,
    pct: { ...NO_PCT, online: 0.025, otas: 0.025 },
    chargesTraveler: false,
    covers: { card: false, whatsapp: false, online: true, otas: true },
    note: '99 €/mes + 0,49 €/reserva + 2,5% online y OTAs',
    verified: true,
  },
  {
    key: 'turitop',
    name: 'TuriTop',
    monthlyFee: 299,
    perBooking: 0,
    pct: { ...NO_PCT, online: 0.0075, otas: 0.0075 },
    chargesTraveler: false,
    covers: { card: false, whatsapp: false, online: true, otas: true },
    note: '299 €/mes + 0,75% de comisión',
    verified: true,
  },
  {
    key: 'bokun',
    name: 'Bókun',
    monthlyFee: 499,
    perBooking: 0,
    // «1% fee for applicable bookings». Se aplica a online y a OTAs: el fee de
    // Bókun nace justamente de su red de distribución (Viator/Tripadvisor), así
    // que dejar las OTAs fuera sería quitarle el canal para el que se cobra.
    pct: { ...NO_PCT, online: 0.01, otas: 0.01 },
    chargesTraveler: false,
    covers: { card: false, whatsapp: false, online: true, otas: true },
    note: '499 €/mes + 1% de las reservas aplicables',
    verified: true,
  },
  {
    key: 'checkfront',
    name: 'Checkfront',
    monthlyFee: 99,
    perBooking: 0,
    // «3% online booking fee». Literal: solo sobre las reservas online. Las que
    // entran por OTA no pasan por su checkout, así que no lo devengan.
    pct: { ...NO_PCT, online: 0.03 },
    chargesTraveler: false,
    covers: { card: false, whatsapp: false, online: true, otas: true },
    note: '99 €/mes + 3% de las reservas online',
    verified: true,
  },
  {
    key: 'peek',
    name: 'Peek Pro',
    monthlyFee: 0,
    perBooking: 0,
    // «Variable fees of up to 6% and 8% for all online bookings». Se toma el 6%,
    // que es el escalón bajo: inflar al competidor con su peor tarifa es la
    // forma más rápida de perder la discusión en la llamada.
    //
    // Su «merchant service fee» (2,3% + 0,30 €/ticket) NO entra en el cálculo:
    // es su pasarela de pago, no su comisión de software, y el operador paga
    // una pasarela con cualquier plataforma. Ninguna barra incluye pasarela de
    // cobro online, así que contársela solo a él compararía dos cosas
    // distintas. Se menciona en su `note`, que es donde no distorsiona nada.
    pct: { ...NO_PCT, online: 0.06 },
    chargesTraveler: true,
    covers: { card: false, whatsapp: false, online: true, otas: true },
    note: '6% de las reservas online · sin cuota · puede repercutirse al viajero. Cobra además su propia pasarela: 2,3% + 0,30 €/ticket',
    verified: true,
  },
];

/** Lo que cubre SolNow. Vive aquí para que la comparativa se lea de una sola tabla. */
export const SOLNOW_COVERS: Record<CapabilityKey, boolean> = {
  card: true,
  whatsapp: true,
  online: true,
  otas: true,
  };

/* ── 5 · Estacionalidad y ticket medio ────────────────────────────────── */

/**
 * Perfiles de estacionalidad: reparto de la facturación anual por mes
 * (enero → diciembre), en tanto por uno.
 *
 * Ya no se asume uno a espaldas del visitante: elige el suyo. Un operador de
 * Canarias factura en enero y uno de Jávea no, y con una única curva el
 * calendario de pagos le contaba a la mitad de ellos una película que no era la
 * suya. No cambia el total del año, solo cómo se reparte.
 *
 * Cada curva debe sumar 1 — `pricingIntegrityError` las comprueba todas.
 */
export const SEASONALITY_PRESETS = {
  mediterraneo: {
    label: 'Mediterráneo',
    hint: 'Pico en julio y agosto, invierno parado.',
    curve: [0.01, 0.01, 0.02, 0.05, 0.08, 0.13, 0.22, 0.26, 0.13, 0.06, 0.02, 0.01],
  },
  canarias: {
    label: 'Todo el año',
    hint: 'Canarias y destinos de invierno: temporada larga y sin parón.',
    curve: [0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.11, 0.12, 0.09, 0.08, 0.07, 0.06],
  },
  flat: {
    label: 'Plana',
    hint: 'Mismo volumen todos los meses. Útil para comparar sin ruido.',
    curve: Array.from({ length: 12 }, () => 1 / 12),
  },
} as const;

export type SeasonalityKey = keyof typeof SEASONALITY_PRESETS;

export const SEASONALITY_KEYS = Object.keys(SEASONALITY_PRESETS) as SeasonalityKey[];

export const INITIAL_SEASONALITY: SeasonalityKey = 'mediterraneo';

export const MONTH_LABELS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
] as const;

/**
 * Ticket medio, en euros. El valor de partida es el de «Ejemplos y margen».
 *
 * Influye en todo lo que no es un porcentaje: el fijo de 0,20 € por operación
 * de datáfono, el mínimo por reserva comisionable y el coste por reserva de
 * Regiondo. Con tickets bajos esas tres cosas pesan mucho más, así que dejarlo
 * fijo escondía justo el caso en el que la cuenta cambia de forma.
 */
export const TICKET = { min: 15, max: 400, step: 1, initial: 141 };

/**
 * De lo que vende presencialmente, la parte que cobra con tarjeta, en %. El
 * resto lo apunta a mano y no le paga comisión a nadie.
 */
export const CARD_SHARE = { min: 0, max: 100, step: 5, initial: 70 };

/**
 * Lo que le cuesta atender **a mano** una reserva de WhatsApp, en euros.
 *
 * Es el coste que tiene hoy y que ninguna alternativa le quita, porque ninguna
 * atiende WhatsApp: alguien de su equipo contesta, cotiza y cobra. Con nosotros
 * lo hace el agente, y por eso en nuestra barra este tramo no existe — en su
 * lugar está el 4%.
 *
 * Mismo patrón que `BANK`: un coste real del operador que aparece en todas las
 * barras menos en la nuestra, y que sin él haría comparar dos cosas distintas.
 */
export const HUMAN_WHATSAPP = { min: 0, max: 40, step: 0.1, initial: 11.7 };


/**
 * Lo que su banco le cobra por cobrar con tarjeta, en % (no en tanto por uno:
 * es un deslizador y se lee en porcentaje).
 *
 * Es un coste que el operador ya tiene, con SolNow y sin SolNow, y por eso
 * aparece en **todas** las barras de la comparativa: con las alternativas lo
 * paga sobre el 100% de lo que cobra con tarjeta, porque ninguna le da
 * terminal; con nosotros, solo sobre lo que no pasa por el nuestro.
 *
 * El valor de partida es el mezclado de «Ejemplos y margen». Ojo: esa cifra es
 * el coste de adquirencia estimado *nuestro* tras negociar, no lo que el banco
 * de un operador sin negociar le cobra a él, que suele ser bastante más alto.
 */
export const BANK = { min: 0, max: 3, step: 0.1, initial: 0.9 };

/* ── 6 · Valores de los controles ─────────────────────────────────────── */

export const REVENUE = { min: 100_000, max: 5_000_000, step: 50_000, initial: 800_000 };
export const BASES = { min: 1, max: 12, step: 1, initial: 2 };

/**
 * Reparto de partida. Es el perfil ICP de «Ejemplos y margen» —800 K, 2–3
 * bases— y reproduce sus cifras: ~9.300 € sin datáfono, ~11.600 € con él.
 *
 * `online` no tiene control propio: es el resto, y por eso no aparece aquí.
 */
export const PRESENCIAL = { min: 0, max: 100, step: 1, initial: 65 };
export const WHATSAPP = { min: 0, max: 60, step: 1, initial: 8 };
export const OTAS = { min: 0, max: 50, step: 1, initial: 10 };
export const INITIAL_BILLING: Billing = 'season';

