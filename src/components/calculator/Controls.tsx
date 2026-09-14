'use client';

import type { CSSProperties } from 'react';
import {
  BANK,
  PRICING_EDITOR,
  BASES,
  CARD_SHARE,
  PRESENCIAL,
  CHANNEL_ORDER,
  HUMAN_WHATSAPP,
  OTAS,
  REVENUE,
  SEASONALITY_KEYS,
  SEASONALITY_PRESETS,
  TICKET,
  WHATSAPP,
  type Billing,
  type ChannelKey,
  type Rate,
  type SeasonalityKey,
} from '@/content/calculator';
import {
  channels,
  integer,
  money,
  percentOf100,
  unitMoney,
  isDefaultPricing,
  DEFAULT_PRICING,
  PROPOSAL_LABELS,
  type Pricing,
  type ControlledChannel,
  type Inputs,
} from '@/lib/calculator';

/**
 * Un deslizador con su etiqueta, su valor y su nota.
 *
 * Es un `<input type="range">` de verdad, no un div con handlers: el teclado,
 * el lector de pantalla y el gesto táctil ya funcionan y no hay que
 * reimplementarlos. Lo único que se añade es `aria-valuetext`, porque sin él
 * un lector anuncia «800000» en vez de «800.000 €».
 */
function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  valueText,
  readout,
  hint,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueText: string;
  readout: React.ReactNode;
  hint: string;
  onChange: (v: number) => void;
}) {
  // El relleno del raíl es la única parte que no se puede expresar sin conocer
  // el valor, así que viaja como custom property y el resto se queda en el CSS.
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <label htmlFor={id} style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>
          {label}
        </label>
        <span className="mono" style={{ fontSize: 13.5, color: 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {readout}
        </span>
      </div>
      <input
        id={id}
        className="calc-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        style={{ '--fill': `${fill}%` } as CSSProperties}
      />
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: 'var(--muted)' }}>{hint}</p>
    </div>
  );
}

/**
 * Nombre y color de cada canal en el reparto. Los colores son los mismos que
 * los de las barras de resultado: el visitante ve aquí el verde de WhatsApp y
 * lo reconoce después en su factura y en la comparativa.
 */
const CHANNEL_LABEL: Record<ChannelKey, string> = {
  online: 'Web y motor',
  otas: 'OTAs',
  card: 'Tarjeta física',
  manual: 'Manual y efectivo',
  whatsapp: 'WhatsApp',
};

const CHANNEL_COLOR: Record<ChannelKey, string> = {
  online: 'var(--accent)',
  otas: 'var(--accent-2)',
  card: 'var(--warn)',
  manual: 'var(--muted-2)',
  whatsapp: 'var(--ok)',
};

/**
 * Un campo numérico de tarifa.
 *
 * Aquí no valen deslizadores: un precio se escribe («2,5»), no se busca
 * arrastrando, y el paso que haría falta para acertar un 0,75% dejaría el
 * recorrido inservible para el resto de valores.
 */
function Price({
  label,
  value,
  suffix,
  step = 0.05,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
      <span style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.3 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <input
          type="number"
          value={value}
          min={0}
          step={step}
          onChange={(e) => {
            const v = Number(e.currentTarget.value);
            // Un campo vacío da `NaN`, y dejar que entre en el estado propaga el
            // NaN a la factura entera. Se queda en cero hasta que escriba algo.
            onChange(Number.isFinite(v) && v >= 0 ? v : 0);
          }}
          style={{
            width: '100%',
            minWidth: 0,
            padding: '7px 8px',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--fg)',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 6,
          }}
        />
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)' }}>{suffix}</span>
      </span>
    </label>
  );
}

/** Una fila del reparto de canales, con su color y su porcentaje. */
function Share({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <span className="calc-legend-item">
      <span className="calc-swatch" style={{ background: color }} />
      {label} <strong style={{ fontWeight: 500, color: 'var(--fg)' }}>{percentOf100(value)}</strong>
    </span>
  );
}

export function Controls({
  inputs,
  onChange,
  onChannel,
}: {
  inputs: Inputs;
  /** Cambia un campo suelto (facturación, bases, modalidad, datáfono). */
  onChange: (patch: Partial<Inputs>) => void;
  /** Los canales van aparte: recolocan el reparto para que siga sumando 100. */
  onChannel: (key: ControlledChannel, value: number) => void;
}) {
  const ch = channels(inputs);
  const billing = (value: Billing, label: string) => (
    <button type="button" aria-pressed={inputs.billing === value} onClick={() => onChange({ billing: value })}>
      {label}
    </button>
  );

  return (
    <div className="card" style={{ padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 26 }}>
      <Slider
        id="calc-revenue"
        label="¿Cuánto facturas al año?"
        value={inputs.revenue}
        min={REVENUE.min}
        max={REVENUE.max}
        step={REVENUE.step}
        readout={`${integer(inputs.revenue)} €`}
        valueText={`${integer(inputs.revenue)} euros al año`}
        hint="Suma de todas tus reservas, con IVA incluido."
        onChange={(revenue) => onChange({ revenue })}
      />

      <Slider
        id="calc-bases"
        label="¿En cuántas bases operas?"
        value={inputs.bases}
        min={BASES.min}
        max={BASES.max}
        step={BASES.step}
        readout={inputs.bases === 1 ? '1 base' : `${inputs.bases} bases`}
        valueText={inputs.bases === 1 ? '1 base' : `${inputs.bases} bases`}
        hint="Cada punto físico desde el que sales: playa, puerto, local."
        onChange={(bases) => onChange({ bases })}
      />

      <Slider
        id="calc-presencial"
        label="¿Qué parte vendes en el sitio?"
        value={inputs.presencial}
        min={PRESENCIAL.min}
        max={PRESENCIAL.max}
        step={PRESENCIAL.step}
        readout={`${inputs.presencial}%`}
        valueText={`${inputs.presencial}% presencial`}
        hint="Walk-ins y todo lo que se cierra en el mostrador, en la playa o en el pantalán."
        onChange={(v) => onChannel('presencial', v)}
      />

      {/* La segunda mitad de la pregunta presencial, y por eso va pegada a ella
          y no en Ajustes avanzados: es la que parte lo presencial en los dos
          canales que de verdad son. Lo que se apunta a mano no nos paga nada;
          lo que pasa por nuestro datáfono, un 1% + 0,20 €. */}
      <Slider
        id="calc-card"
        label="De eso, ¿cuánto cobras con tarjeta?"
        value={inputs.card}
        min={CARD_SHARE.min}
        max={CARD_SHARE.max}
        step={CARD_SHARE.step}
        readout={`${inputs.card}%`}
        valueText={`${inputs.card}% del presencial con tarjeta`}
        hint="Con datáfono o kiosko. El resto lo apuntas a mano o lo cobras en efectivo, y eso no nos paga nada."
        onChange={(card) => onChange({ card })}
      />

      <Slider
        id="calc-whatsapp"
        label="¿Cuánto cierras por WhatsApp?"
        value={ch.whatsapp}
        min={WHATSAPP.min}
        max={WHATSAPP.max}
        step={WHATSAPP.step}
        readout={`${ch.whatsapp}%`}
        valueText={`${ch.whatsapp}% por WhatsApp`}
        hint="Reservas que crea y cobra el agente de IA, atendiendo o persiguiendo carritos caídos."
        onChange={(v) => onChannel('whatsapp', v)}
      />

      <Slider
        id="calc-otas"
        label="¿Cuánto te entra por OTAs?"
        value={ch.otas}
        min={OTAS.min}
        max={OTAS.max}
        step={OTAS.step}
        readout={`${ch.otas}%`}
        valueText={`${ch.otas}% por OTAs`}
        hint="GetYourGuide, Viator, Civitatis y agencias colaboradoras."
        onChange={(v) => onChannel('otas', v)}
      />

      {/* El reparto completo, con `online` como lo que es: el resto. Va aquí y
          no bajo cada deslizador porque los cuatro se leen juntos o no se leen. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 2 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Tu reparto, sobre 100:</span>
        {/* Mismo orden que la factura y que todas las barras: lo dicta
            `CHANNEL_ORDER`, no esta lista. */}
        <div className="calc-legend">
          {CHANNEL_ORDER.map((key) => (
            <Share key={key} color={CHANNEL_COLOR[key]} label={CHANNEL_LABEL[key]} value={ch[key]} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>¿Cómo prefieres pagar la cuota?</span>
        <div className="calc-toggle" role="group" aria-label="Modalidad de pago">
          {billing('monthly', 'Pago mensual')}
          {billing('season', 'Pago por temporada')}
        </div>
      </div>


      {/* Los supuestos. Van plegados porque el 90% de los visitantes no los va a
          tocar, y abiertos porque el 10% que sí quiere hacerlo tiene razón: con
          un ticket de 25 € en vez de 141 € la cuenta cambia de forma. Nada se
          asume ya a su espalda. */}
      {PRICING_EDITOR && (
        <PricingEditor pricing={inputs.pricing} pricingB={inputs.pricingB} onChange={onChange} />
      )}

      <details style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 18 }}>
        <summary
          style={{
            cursor: 'pointer',
            fontSize: 13.5,
            fontWeight: 500,
            color: 'var(--fg-2)',
            listStyle: 'revert',
          }}
        >
          Ajustes avanzados
        </summary>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 20 }}>
          <Slider
            id="calc-ticket"
            label="¿Cuál es tu ticket medio?"
            value={inputs.ticket}
            min={TICKET.min}
            max={TICKET.max}
            step={TICKET.step}
            readout={money(inputs.ticket)}
            valueText={`${inputs.ticket} euros de ticket medio`}
            hint="Cuántos euros deja una reserva de media. Manda en los importes que no son porcentaje: el mínimo por reserva y el fijo por operación del datáfono."
            onChange={(ticket) => onChange({ ticket })}
          />

          <Slider
            id="calc-bank"
            label="¿Qué te cobra tu banco por cobrar con tarjeta?"
            value={inputs.bank}
            min={BANK.min}
            max={BANK.max}
            step={BANK.step}
            readout={percentOf100(inputs.bank)}
            valueText={`${percentOf100(inputs.bank)} de comisión bancaria`}
            hint="Lo que te descuenta hoy tu TPV. Este coste lo tienes con nosotros y con cualquier alternativa, así que sale en todas las barras."
            onChange={(bank) => onChange({ bank })}
          />

          <Slider
            id="calc-human"
            label="¿Cuánto te cuesta atender a mano una reserva de WhatsApp?"
            value={inputs.human}
            min={HUMAN_WHATSAPP.min}
            max={HUMAN_WHATSAPP.max}
            step={HUMAN_WHATSAPP.step}
            readout={`${unitMoney(inputs.human)}/reserva`}
            valueText={`${inputs.human} euros por reserva atendida a mano`}
            hint="El tiempo de tu equipo contestando, cotizando y cobrando. Con nosotros lo hace el agente; con cualquier alternativa lo sigue haciendo alguien."
            onChange={(human) => onChange({ human })}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>
              ¿Cómo se reparte tu año?
            </span>
            <div
              className="calc-toggle"
              role="group"
              aria-label="Perfil de estacionalidad"
              style={{ gridTemplateColumns: `repeat(${SEASONALITY_KEYS.length}, 1fr)` }}
            >
              {SEASONALITY_KEYS.map((key: SeasonalityKey) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={inputs.seasonality === key}
                  onClick={() => onChange({ seasonality: key })}
                >
                  {SEASONALITY_PRESETS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: 'var(--muted)' }}>
              {SEASONALITY_PRESETS[inputs.seasonality].hint} Mueve el calendario de pagos, no el
              total del año.
            </p>
          </div>
        </div>
      </details>

    </div>
  );
}

/**
 * Los once números de una propuesta, cada uno con cómo leerlo y cómo escribirlo.
 *
 * La tabla existe para no repetir once veces el mismo `<Price>` con dos
 * columnas: con dos propuestas en pantalla serían veintidós campos escritos a
 * mano, y bastaría equivocarse en un `set` para que la columna B editara la A.
 */
const PRICING_FIELDS: readonly {
  group: 'fijo' | 'escalera';
  label: string;
  suffix: string;
  step: number;
  get: (p: Pricing) => number;
  set: (p: Pricing, v: number) => Pricing;
}[] = [
  {
    group: 'fijo', label: '1ª base · mensual', suffix: '€/mes', step: 1,
    get: (p) => p.fixed.monthly.first,
    set: (p, v) => ({ ...p, fixed: { ...p.fixed, monthly: { ...p.fixed.monthly, first: v } } }),
  },
  {
    group: 'fijo', label: 'Adicional · mensual', suffix: '€/mes', step: 1,
    get: (p) => p.fixed.monthly.extra,
    set: (p, v) => ({ ...p, fixed: { ...p.fixed, monthly: { ...p.fixed.monthly, extra: v } } }),
  },
  {
    group: 'fijo', label: '1ª base · anual', suffix: '€/año', step: 10,
    get: (p) => p.fixed.season.first,
    set: (p, v) => ({ ...p, fixed: { ...p.fixed, season: { ...p.fixed.season, first: v } } }),
  },
  {
    group: 'fijo', label: 'Adicional · anual', suffix: '€/año', step: 10,
    get: (p) => p.fixed.season.extra,
    set: (p, v) => ({ ...p, fixed: { ...p.fixed, season: { ...p.fixed.season, extra: v } } }),
  },
  ...pctField('manual', 'Manual y efectivo'),
  ...pctField('card', 'Tarjeta física'),
  {
    group: 'escalera', label: 'Tarjeta · fijo por operación', suffix: '€', step: 0.05,
    get: (p) => p.rates.card.perBooking,
    set: (p, v) => setRate(p, 'card', { perBooking: v }),
  },
  ...pctField('online', 'Web y motor'),
  ...pctField('otas', 'OTAs'),
  ...pctField('whatsapp', 'WhatsApp'),
  {
    group: 'escalera', label: 'Mínimo por reserva', suffix: '€', step: 0.05,
    get: (p) => p.min,
    set: (p, v) => ({ ...p, min: v }),
  },
];

function setRate(p: Pricing, key: ChannelKey, patch: Partial<Rate>): Pricing {
  return { ...p, rates: { ...p.rates, [key]: { ...p.rates[key], ...patch } } };
}

/** Un porcentaje de canal. Se guarda en tanto por uno y se edita en por ciento. */
function pctField(key: ChannelKey, label: string) {
  return [
    {
      group: 'escalera' as const, label, suffix: '%', step: 0.05,
      // Dos decimales: `0.0075 × 100` da `0.7500000000000001` y el campo lo
      // enseñaría entero.
      get: (p: Pricing) => Math.round(p.rates[key].pct * 10000) / 100,
      set: (p: Pricing, v: number) => setRate(p, key, { pct: v / 100 }),
    },
  ];
}

/**
 * Nuestras propias tarifas, editables, y opcionalmente dos a la vez.
 *
 * ⚠️ El documento funcional pedía que esto **no** existiera en la web pública:
 * enseñar los porcentajes invita a negociarlos antes de la primera llamada. Se
 * apaga entero con `PRICING_EDITOR` en `content/calculator.ts`.
 */
function PricingEditor({
  pricing,
  pricingB,
  onChange,
}: {
  pricing: Pricing;
  pricingB: Pricing | null;
  onChange: (patch: { pricing?: Pricing; pricingB?: Pricing | null }) => void;
}) {
  const columns: (Pricing | null)[] = pricingB ? [pricing, pricingB] : [pricing];

  const group = (name: 'fijo' | 'escalera', title: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12, color: 'var(--fg-2)', fontWeight: 500 }}>{title}</span>
      {PRICING_FIELDS.filter((f) => f.group === name).map((f) => (
        <div
          key={f.label}
          style={{
            display: 'grid',
            gridTemplateColumns: `1fr repeat(${columns.length}, 96px)`,
            gap: 8,
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.3 }}>{f.label}</span>
          {columns.map((p, i) => (
            <Price
              key={i}
              value={f.get(p!)}
              suffix={f.suffix}
              step={f.step}
              label={`${f.label} · propuesta ${PROPOSAL_LABELS[i]}`}
              onChange={(v) =>
                onChange(i === 0 ? { pricing: f.set(p!, v) } : { pricingB: f.set(p!, v) })
              }
            />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <details style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 18 }}>
      <summary style={{ cursor: 'pointer', fontSize: 13.5, fontWeight: 500, color: 'var(--accent)', listStyle: 'revert' }}>
        Nuestro pricing
      </summary>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 18 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={pricingB !== null}
            // La segunda propuesta arranca clonando la primera: comparar dos
            // tarifas empieza casi siempre por cambiar un número de una de
            // ellas, no por escribir once desde cero.
            onChange={(e) => onChange({ pricingB: e.currentTarget.checked ? { ...pricing } : null })}
            style={{ width: 15, height: 15, accentColor: 'var(--accent)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 13, color: 'var(--fg)' }}>Comparar dos propuestas</span>
        </label>

        {columns.length > 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: `1fr repeat(${columns.length}, 96px)`, gap: 8 }}>
            <span />
            {columns.map((_, i) => (
              <span
                key={i}
                className="mono"
                style={{ fontSize: 10.5, letterSpacing: '0.08em', color: 'var(--accent)', textAlign: 'center' }}
              >
                {PROPOSAL_LABELS[i]}
              </span>
            ))}
          </div>
        )}

        {group('fijo', 'Cuota por base')}
        {group('escalera', 'La escalera')}

        {(!isDefaultPricing(pricing) || pricingB) && (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ alignSelf: 'flex-start', padding: '7px 14px', fontSize: 12.5 }}
            onClick={() => onChange({ pricing: DEFAULT_PRICING, pricingB: null })}
          >
            Volver a la tarifa de catálogo
          </button>
        )}
      </div>
    </details>
  );
}
