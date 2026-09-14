'use client';

import {
  SEASONALITY_PRESETS,
} from '@/content/calculator';
import { useState } from 'react';
import {
  alternatives,
  PROPOSAL_LABELS,
  lineLabel,
  money,
  percent,
  percentOf100,
  type Alternative,
  type CostLine,
  type Quote,
} from '@/lib/calculator';

/**
 * Un color por línea de factura, compartido por el desglose y la comparativa.
 *
 * Que el tramo de WhatsApp sea del mismo verde en los dos sitios es lo que
 * permite ver de un vistazo que en la barra de FareHarbor ese tramo no existe.
 */
const LINE_COLOR: Record<string, string> = {
  fixed: 'var(--accent-dim)',
  online: 'var(--accent)',
  whatsapp: 'var(--ok)',
  otas: 'var(--accent-2)',
  // Ni el banco ni la atención humana los cobra ninguna plataforma: el operador
  // los paga igual. Por eso salen de la escala de marca —que es la de lo que sí
  // se le vende— y por eso llevan dos tonos distintos entre sí: son dos costes
  // distintos y en la barra van pegados.
  bank: 'var(--cost-bank)',
  human: 'var(--cost-human)',
  card: 'var(--warn)',
  manual: 'var(--muted-2)',
};

const colorOf = (line: CostLine) => LINE_COLOR[line.key] ?? 'var(--muted)';

/** Tramos que no cobra la plataforma de esa fila: el operador los paga igual. */
const EXTERNAL = new Set(['bank', 'human']);

function Block({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="card" style={{ padding: '24px 24px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <h2 className="h-3">{title}</h2>
        {caption && <p style={{ margin: 0, fontSize: 13.5, color: 'var(--fg-2)' }}>{caption}</p>}
      </div>
      {children}
    </section>
  );
}

const footnote: React.CSSProperties = { margin: 0, fontSize: 11.5, lineHeight: 1.5, color: 'var(--muted-2)' };

/* ── 0 · La propuesta, en cristiano ───────────────────────────────────── */

/**
 * La tarifa contada en una frase y una lista, antes de cualquier gráfico.
 *
 * Las barras y la tabla responden «cuánto»; esto responde «cómo se cobra», que
 * es lo primero que pregunta cualquiera y lo que hasta ahora había que deducir
 * leyendo las etiquetas de los tramos.
 */
/** Una fila de la propuesta: el concepto y lo que se cobra por él. */
function ProposalRow({
  name,
  color,
  rate,
  free,
}: {
  name: string;
  color: string;
  rate: string;
  free: boolean;
}) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        padding: '7px 0',
        borderTop: '1px solid var(--line-soft)',
        fontSize: 13.5,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
        <span className="calc-swatch" style={{ background: color, flex: 'none', transform: 'translateY(1px)' }} />
        <span style={{ color: free ? 'var(--muted)' : 'var(--fg-2)' }}>{name}</span>
      </span>
      <span
        className="mono"
        style={{ fontSize: 12.5, textAlign: 'right', color: free ? 'var(--ok)' : 'var(--accent)', fontWeight: 500 }}
      >
        {rate}
      </span>
    </li>
  );
}

function Proposal({ quote, index, many }: { quote: Quote; index: number; many: boolean }) {
  const { pricing, billing, bases } = quote.inputs;
  const fee = pricing.fixed[billing === 'season' ? 'season' : 'monthly'];
  const perSuffix = billing === 'season' ? '/año' : '/mes';
  // De más barato a más caro, y no en el orden de la factura: la lista se lee
  // como una escalera, y una escalera que no sube no se entiende. El orden
  // canónico manda en las barras y en la tabla, donde lo que importa es
  // reconocer cada tramo en su sitio; aquí importa el relato.
  const fixedLine = quote.lines.find((l) => l.key === 'fixed');
  const channels = [...quote.lines.filter((l) => l.key !== 'fixed')].sort((a, b) => {
    const pct = (l: CostLine) => (l.channel ? pricing.rates[l.channel].pct : 0);
    // A igualdad de porcentaje se respeta el orden de la factura, para que dos
    // canales al 2% no bailen entre sí al mover un deslizador.
    return pct(a) - pct(b) || quote.lines.indexOf(a) - quote.lines.indexOf(b);
  });

  return (
    <section
      className="card"
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        // La propuesta que se está detallando abajo se marca con el filete, no
        // con otro color: los colores de esta página ya significan canales.
        boxShadow: many && index === 0 ? 'inset 3px 0 0 var(--accent)' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <span className="eyebrow no-dot">{many ? `Propuesta ${PROPOSAL_LABELS[index]}` : 'Cómo te cobramos'}</span>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 7, whiteSpace: 'nowrap' }}>
          <strong
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: 'var(--accent)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {money(quote.total)}
          </strong>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>al año · {percent(quote.effectiveRate)}</span>
        </span>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
        {/* La cuota abre la lista: es lo que se paga pase lo que pase, y las
            demás filas son ya la escalera de lo que se vende. Su «tarifa» no es
            su importe sino su composición —primera base más adicionales—, que
            es lo que hay que entender para saber qué pasa al abrir otra. */}
        {fixedLine && (
          <ProposalRow
            name="Cuota fija"
            color={colorOf(fixedLine)}
            rate={
              fee.first === 0
                ? 'sin cuota'
                : bases > 1
                  ? `${money(fee.first)}${perSuffix} + ${money(fee.extra)} por base`
                  : `${money(fee.first)}${perSuffix}`
            }
            free={fee.first === 0}
          />
        )}
        {channels.map((l) => (
          <ProposalRow key={l.key} name={l.name} color={colorOf(l)} rate={l.rate} free={l.amount === 0} />
        ))}
      </ul>
    </section>
  );
}

/* ── 2 · El desglose ──────────────────────────────────────────────────── */

/**
 * Nombre de cada concepto en la leyenda.
 *
 * Sin porcentajes ni importes a propósito: es la clave de color de siete barras
 * a la vez, y cada una tiene los suyos. El detalle de cada tramo vive en su
 * `title` y en la lista de tarifas del pie.
 */
const LEGEND_LABEL: Record<string, string> = {
  fixed: 'Cuota fija',
  online: 'Web y motor',
  otas: 'OTAs',
  card: 'Tarjeta física',
  manual: 'Manual y efectivo',
  bank: 'Tu banco',
  whatsapp: 'WhatsApp',
  human: 'Atender WhatsApp a mano',
};

/** El orden de la leyenda es el de la factura, para leerla contra las barras. */
const LEGEND_ORDER = [
  'fixed', 'online', 'otas', 'card', 'manual', 'bank', 'whatsapp', 'human',
];

/**
 * Clave de color de la comparativa.
 *
 * Solo lista los conceptos que de verdad aparecen en alguna barra: con el
 * datáfono apagado no hay tramo de pagos presenciales, y anunciarlo en la
 * leyenda mandaría a buscar un color que no está.
 */
function Legend({
  rows,
  hidden,
  onToggle,
}: {
  rows: Alternative[];
  hidden: readonly string[];
  onToggle: (key: string) => void;
}) {
  const present = new Set(rows.flatMap((r) => r.lines.filter((l) => l.amount > 0).map((l) => l.key)));
  // Un concepto apagado deja de tener importe en todas las barras, así que
  // saldría de `present` y no habría forma de volver a encenderlo. Se le suma
  // lo oculto para que su botón siga ahí, en gris.
  const items = LEGEND_ORDER.filter((key) => present.has(key) || hidden.includes(key));

  return (
    <div className="calc-legend">
      {items.map((key) => {
        const off = hidden.includes(key);
        return (
          <button
            key={key}
            type="button"
            className="calc-legend-item calc-legend-toggle"
            aria-pressed={!off}
            data-off={off}
            onClick={() => onToggle(key)}
            title={off ? 'Volver a contarlo' : 'Quitarlo de la comparación'}
          >
            <span
              className="calc-swatch"
              style={{ background: off ? 'transparent' : LINE_COLOR[key] ?? 'var(--muted)' }}
              data-external={EXTERNAL.has(key)}
              data-off={off}
            />
            {LEGEND_LABEL[key] ?? key}
          </button>
        );
      })}
    </div>
  );
}

/**
 * El desglose en tabla, debajo de la barra.
 *
 * La barra dice de un vistazo qué pesa; la tabla dice cuánto es exactamente.
 * Existe porque un tramo estrecho —la cuota fija de un operador grande, el
 * mostrador a 0 €— no tiene sitio para su importe, y ese número no puede vivir
 * solo dentro de un `title` que en móvil nadie va a abrir.
 */
function BreakdownTable({ quote }: { quote: Quote }) {
  const { revenue } = quote.inputs;
  const num: React.CSSProperties = {
    textAlign: 'right',
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  };
  const cell: React.CSSProperties = { padding: '9px 12px', borderTop: '1px solid var(--line-soft)' };
  const head: React.CSSProperties = {
    padding: '8px 12px',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 400,
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    background: 'var(--surface-2)',
    whiteSpace: 'nowrap',
  };

  return (
    // La tabla es lo que sí puede desbordar: se desplaza dentro de su caja, no
    // empuja la página a lo ancho.
    <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: 10 }}>
      <table style={{ width: '100%', minWidth: 520, borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th scope="col" style={{ ...head, textAlign: 'left' }}>Concepto</th>
            <th scope="col" style={{ ...head, textAlign: 'right' }}>Facturación</th>
            <th scope="col" style={{ ...head, textAlign: 'right' }}>Tarifa</th>
            <th scope="col" style={{ ...head, textAlign: 'right' }}>Coste/año</th>
            <th scope="col" style={{ ...head, textAlign: 'right' }}>% del total</th>
          </tr>
        </thead>
        <tbody>
          {quote.lines.map((l) => {
            // Una línea a 0 € se apaga en vez de esconderse: que lo que vendes a
            // mano salga en gris con un 0 € es el argumento, no un hueco.
            const free = l.amount === 0;
            const color = free ? 'var(--muted-2)' : undefined;
            // Un coste derivado no es un canal: su facturación es un trozo de la
            // del canal de arriba, no una fila más que sumar. Se sangra y su
            // base se marca con «de», que es lo que impide leer la columna como
            // una partición y sumarla.
            const derived = l.parent !== undefined;
            return (
              <tr key={l.key}>
                <th
                  scope="row"
                  style={{
                    ...cell,
                    textAlign: 'left',
                    fontWeight: derived ? 400 : 500,
                    color: color ?? (derived ? 'var(--fg-2)' : 'var(--fg)'),
                    paddingLeft: derived ? 34 : 12,
                  }}
                >
                  <span
                    className="calc-swatch"
                    style={{
                      background: free ? 'transparent' : colorOf(l),
                      border: free ? '1px dashed var(--muted-2)' : undefined,
                      display: 'inline-block',
                      marginRight: 8,
                      verticalAlign: 1,
                    }}
                    data-external={EXTERNAL.has(l.key)}
                  />
                  {l.name}
                </th>
                <td style={{ ...cell, ...num, color: color ?? (derived ? 'var(--muted-2)' : 'var(--fg-2)') }}>
                  {l.base === null ? '—' : derived ? `de ${money(l.base)}` : money(l.base)}
                </td>
                <td style={{ ...cell, ...num, color: color ?? 'var(--muted)' }}>{l.rate}</td>
                <td style={{ ...cell, ...num, color: color ?? 'var(--fg)', fontWeight: 500 }}>
                  {money(l.amount)}
                </td>
                <td style={{ ...cell, ...num, color: color ?? 'var(--muted)' }}>
                  {quote.total > 0 && !free ? percentOf100((l.amount / quote.total) * 100) : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" style={{ ...cell, textAlign: 'left', borderTop: '2px solid var(--line)', fontWeight: 500 }}>
              Total
            </th>
            <td style={{ ...cell, ...num, borderTop: '2px solid var(--line)', color: 'var(--fg-2)' }}>
              {money(revenue)}
            </td>
            <td style={{ ...cell, ...num, borderTop: '2px solid var(--line)', color: 'var(--muted)' }}>
              {percent(quote.effectiveRate)}
            </td>
            <td style={{ ...cell, ...num, borderTop: '2px solid var(--line)', color: 'var(--accent)', fontWeight: 500 }}>
              {money(quote.total)}
            </td>
            <td style={{ ...cell, ...num, borderTop: '2px solid var(--line)', color: 'var(--muted)' }}>100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Breakdown({ quote }: { quote: Quote }) {
  return (
    <Block
      title="De qué se compone"
      caption="Una cuota por base y un escalón de comisión por canal. Cada escalón es una cosa más que hacemos por esa reserva."
    >
      <div style={{ display: 'flex', height: 72, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}>
        {quote.lines.filter((l) => l.amount > 0).map((l) => {
          const share = quote.total > 0 ? (l.amount / quote.total) * 100 : 0;
          // Un tramo estrecho no puede enseñar tres cosas. Suelta primero el
          // nombre y luego el porcentaje, y se queda con el importe, que es el
          // dato; la leyenda de debajo lo nombra igualmente.
          const room = share >= 17 ? 'full' : share >= 8 ? 'amount' : 'none';
          return (
            <div
              key={l.key}
              title={`${lineLabel(l)}: ${money(l.amount)}`}
              data-external={EXTERNAL.has(l.key)}
              className="calc-vs-seg"
              style={{
                width: `${share}%`,
                background: colorOf(l),
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: 2,
                padding: '0 12px',
              }}
            >
              {room === 'full' && <span style={{ fontSize: 11, opacity: 0.85 }}>{lineLabel(l)}</span>}
              {room !== 'none' && (
                <strong style={{ fontSize: 15, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                  {money(l.amount)}
                </strong>
              )}
              {room === 'full' && (
                <span className="mono" style={{ fontSize: 10.5, opacity: 0.8 }}>{percentOf100(share)}</span>
              )}
            </div>
          );
        })}
      </div>

      <BreakdownTable quote={quote} />
    </Block>
  );
}

/* ── 3 · El calendario de pagos ───────────────────────────────────────── */

function Schedule({ quote }: { quote: Quote }) {
  const season = quote.inputs.billing === 'season';
  const peak = Math.max(...quote.schedule.map((m) => m.total), 1);
  const freeMonths = quote.schedule.filter((m) => m.free).map((m) => m.label);

  return (
    <Block
      title="Cuándo lo pagas"
      caption={
        season ? (
          <strong style={{ fontWeight: 500, color: 'var(--accent)' }}>
            De noviembre a febrero no pagas cuota.
          </strong>
        ) : (
          <strong style={{ fontWeight: 500 }}>Pagas lo mismo en enero que en agosto.</strong>
        )
      }
    >
      <div
        role="img"
        aria-label={
          'Calendario de pagos mes a mes. ' +
          quote.schedule.map((m) => `${m.label}: ${money(m.total)}${m.free ? ', sin cuota fija' : ''}`).join('. ')
        }
      >
        <div className="calc-months">
          {quote.schedule.map((m) => (
            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
              {/* Apiladas: variable abajo, cuota encima. El mes «sin cuota» se
                  distingue porque literalmente le falta el tramo de arriba, no
                  solo por el tono. */}
              {m.fixed > 0 && (
                <div className="calc-month-bar" style={{ height: `${(m.fixed / peak) * 100}%`, background: LINE_COLOR.fixed }} />
              )}
              <div
                className="calc-month-bar"
                style={{
                  height: `${(m.variable / peak) * 100}%`,
                  background: 'var(--accent-2)',
                  borderRadius: m.fixed > 0 ? 0 : '4px 4px 0 0',
                  ...(m.free ? { background: 'var(--accent-bg)', border: '1px dashed var(--accent-2)', borderBottom: 0 } : null),
                }}
              />
            </div>
          ))}
        </div>

        <div className="calc-month-labels" aria-hidden="true">
          {quote.schedule.map((m) => (
            <div key={m.label} style={{ textAlign: 'center', minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 10, color: m.free ? 'var(--accent)' : 'var(--muted)', letterSpacing: '0.02em' }}>
                {m.label}
              </div>
              {m.free && (
                <div className="r-hide" style={{ fontSize: 9, color: 'var(--accent)', opacity: 0.8, marginTop: 2, whiteSpace: 'nowrap' }}>
                  sin cuota
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {season && freeMonths.length > 0 && (
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg-2)' }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 2,
              background: 'var(--accent-bg)',
              border: '1px dashed var(--accent-2)',
              marginRight: 7,
              verticalAlign: -1,
            }}
          />
          {freeMonths.join(', ')}: solo comisión de lo que vendas, sin cuota.
        </p>
      )}

      <p style={footnote}>
        Reparto sobre el perfil «{SEASONALITY_PRESETS[quote.inputs.seasonality].label}» que has
        elegido en los ajustes. Cambiar de perfil mueve el reparto, nunca el total del año.
      </p>
    </Block>
  );
}

/* ── 4 · La comparativa ───────────────────────────────────────────────── */

function Capabilities({ capabilities }: { capabilities: Alternative['capabilities'] }) {
  return (
    <div className="calc-caps-wrap">
      {capabilities.map((cap) => (
        <span key={cap.key} className="calc-cap" data-on={cap.on}>
          <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true" style={{ flex: 'none' }}>
            {cap.on ? (
              <path d="M1 5 L4 8 L9 2" stroke="var(--ok)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M2 5 H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
          {cap.label}
        </span>
      ))}
    </div>
  );
}

function Row({ row, peak }: { row: Alternative; peak: number }) {
  return (
    <div className="calc-vs-row" data-solnow={row.isSolnow}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span
          style={{
            fontSize: 13.5,
            fontWeight: row.isSolnow ? 500 : 400,
            color: row.isSolnow ? 'var(--accent)' : 'var(--fg-2)',
          }}
        >
          {row.name}
        </span>
        {!row.verified && (
          <span className="mono" style={{ fontSize: 9.5, color: 'var(--warn)', letterSpacing: '0.04em' }}>
            SIN VERIFICAR
          </span>
        )}
      </div>

      {/* El desglose vive dentro de la barra: cada tramo es una línea de la
          factura de esa plataforma, con el mismo color que en el desglose de
          arriba. Así se ve que a FareHarbor le faltan tramos enteros, no que
          sean más baratos. */}
      <div className="calc-vs-bar" style={{ width: `${(row.total / peak) * 100}%`, minWidth: 4 }}>
        {row.lines.filter((l) => l.amount > 0).map((l) => {
          const share = row.total > 0 ? (l.amount / row.total) * 100 : 0;
          return (
            <div
              key={l.key}
              className="calc-vs-seg"
              data-external={EXTERNAL.has(l.key)}
              title={`${row.name} · ${lineLabel(l)}: ${money(l.amount)}`}
              // Sin opacidad ni variación de tono: el tramo «Web y motor» es
              // exactamente el mismo azul en las siete barras. Es lo que
              // permite compararlas de un vistazo en vez de leer cifras. SolNow
              // se distingue por el marco de la fila, no por el color.
              style={{ width: `${share}%`, background: colorOf(l) }}
            >
              {share >= 22 && money(l.amount)}
            </div>
          );
        })}
      </div>

      <strong
        style={{
          fontSize: 14,
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          color: row.isSolnow ? 'var(--accent)' : 'var(--fg)',
          whiteSpace: 'nowrap',
          textAlign: 'right',
        }}
      >
        {money(row.total)}
      </strong>

      <div className="calc-vs-caps">
        <Capabilities capabilities={row.capabilities} />
      </div>
    </div>
  );
}

function Comparison({
  quotes,
  hidden,
  onToggle,
}: {
  quotes: readonly Quote[];
  hidden: readonly string[];
  onToggle: (key: string) => void;
}) {
  const quote = quotes[0];
  // Sin filtrar, solo para la leyenda: un concepto apagado tiene que seguir
  // teniendo su botón, y si no está en ninguna fila no hay dónde volver a darle.
  const all = alternatives(quotes);
  const rows = alternatives(quotes, hidden);
  const peak = Math.max(...rows.map((r) => r.total), 1);
  const fareharbor = rows.find((r) => r.key === 'fareharbor');
  // Si SolNow saliera más caro, la frase se omite. Enseñar un número en contra
  // en la propia página de precios no es transparencia, es un autogol.
  const saving = fareharbor ? fareharbor.total - quote.total : 0;


  return (
    <Block title="Lo mismo, con las alternativas">
      {hidden.length > 0 && (
        <p
          style={{
            margin: 0,
            padding: '9px 12px',
            borderRadius: 8,
            background: 'var(--accent-bg)',
            fontSize: 12.5,
            color: 'var(--fg-2)',
          }}
        >
          Estás comparando sin {hidden.length === 1 ? 'un concepto' : `${hidden.length} conceptos`}.{' '}
          <strong style={{ fontWeight: 500 }}>Tu precio real no cambia</strong>: lo tienes entero en
          «De qué se compone», aquí debajo. Vuelve a pulsar en la leyenda para contarlo otra vez.
        </p>
      )}

      <Legend rows={all} hidden={hidden} onToggle={onToggle} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r) => (
          <Row key={r.key} row={r} peak={peak} />
        ))}
      </div>

      {hidden.length === 0 && (
      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--fg)', lineHeight: 1.5 }}>
        Los motores de reserva digitalizan el canal donde tienes el{' '}
        <strong style={{ fontWeight: 500 }}>{quote.channels.online}%</strong> de tu facturación.
        Nosotros cubrimos el <strong style={{ fontWeight: 500, color: 'var(--accent)' }}>100%</strong>,
        empezando por lo que vendes en el sitio, donde tienes el{' '}
        <strong style={{ fontWeight: 500 }}>
          {Math.round(quote.channels.manual + quote.channels.card)}%
        </strong>{' '}
        — y lo que apuntas a mano no paga comisión.
      </p>
      )}

      {saving > 0 && (
        <p style={{ margin: 0, fontSize: 15, color: 'var(--fg)' }}>
          Con FareHarbor pagarías{' '}
          <strong style={{ fontWeight: 500, color: 'var(--accent)' }}>{money(saving)} más al año</strong>{' '}
          {hidden.length === 0 && ' y seguirías sin mostrador ni WhatsApp'}.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {rows.map((r) => (
          <p key={r.key} style={footnote}>
            <span style={{ color: 'var(--muted)' }}>{r.name}</span> · {r.note}
          </p>
        ))}
      </div>

    </Block>
  );
}

/* ── Composición ──────────────────────────────────────────────────────── */

export function Results({
  quotes,
  hidden,
  onToggle,
}: {
  quotes: readonly Quote[];
  hidden: readonly string[];
  onToggle: (key: string) => void;
}) {
  // El desglose y el calendario miran una propuesta a la vez: son el detalle de
  // una factura, y dos facturas superpuestas no se leen. La comparativa es la
  // que las enfrenta.
  const [shown, setShown] = useState(0);
  const quote = quotes[Math.min(shown, quotes.length - 1)];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Arriba del todo: qué te cobramos. Las dos, si hay dos. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`,
          gap: 12,
          alignItems: 'start',
        }}
      >
        {quotes.map((q, i) => (
          <Proposal key={i} quote={q} index={i} many={quotes.length > 1} />
        ))}
      </div>

      <Comparison quotes={quotes} hidden={hidden} onToggle={onToggle} />
      {quotes.length > 1 && (
        <div className="calc-toggle" role="group" aria-label="Propuesta que se detalla debajo">
          {quotes.map((q, i) => (
            <button key={i} type="button" aria-pressed={shown === i} onClick={() => setShown(i)}>
              Propuesta {PROPOSAL_LABELS[i]} · {money(q.total)}
            </button>
          ))}
        </div>
      )}
      <Breakdown quote={quote} />
      <Schedule quote={quote} />
    </div>
  );
}
