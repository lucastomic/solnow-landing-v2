import type { Figure } from '@/content/narrativa';

/**
 * Las figuras de la prueba. Sin librerías: divs y tokens de la web.
 *
 * Reglas que siguen (dataviz): un solo tono para la magnitud (el azul de
 * marca), gris para el «antes» en las comparativas, texto siempre en tinta y
 * nunca en el color de la serie, barras finas ancladas a la línea base con
 * las puntas redondeadas, 2px de superficie entre barras vecinas, y cada
 * figura con \`role="img"\` y un \`aria-label\` que la lee entera.
 */

const BAR = 'var(--accent)';
const BAR_BEFORE = 'var(--muted-2)';

function Title({ children }: { children: string }) {
  return (
    <figcaption className="h-3" style={{ fontSize: 16, marginBottom: 20, color: 'var(--fg)', maxWidth: '40ch' }}>
      {children}
    </figcaption>
  );
}

const BIG = {
  lineHeight: 1,
  letterSpacing: '-0.04em',
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',
} as const;

/** Columnas: magnitud por categoría ordenada. */
function Bars({ f }: { f: Extract<Figure, { type: 'bars' }> }) {
  return (
    <figure className="tour-fig" role="img" aria-label={`${f.title}. ${f.items.map((i) => `${i.label}: ${i.display}`).join('; ')}.`}>
      <Title>{f.title}</Title>
      <div className="tour-fig-bars" style={{ gridTemplateColumns: `repeat(${f.items.length}, 1fr)` }}>
        {f.items.map((it, j) => (
          <div key={j} className="tour-fig-col" title={`${it.label}: ${it.display}`}>
            <span className="mono tour-fig-val">{it.display}</span>
            <div className="tour-fig-bar" style={{ height: `${(it.value / f.max) * 100}%`, background: BAR }} />
          </div>
        ))}
      </div>
      <div className="mono tour-fig-labels" style={{ gridTemplateColumns: `repeat(${f.items.length}, 1fr)` }}>
        {f.items.map((it, j) => (
          <span key={j}>{it.label}</span>
        ))}
      </div>
      {f.xLabel && <p className="mono tour-fig-x">{f.xLabel}</p>}
    </figure>
  );
}

/** Dos cifras enfrentadas, con una barra horizontal proporcional debajo de cada una. */
function Compare({ f }: { f: Extract<Figure, { type: 'compare' }> }) {
  const max = Math.max(f.a.value, f.b.value);
  // Proporción visual acotada: una barra nunca queda por debajo del 1,5 %, para
  // que «9 s frente a 1 h 50» siga siendo una barra y no un punto invisible.
  const w = (v: number) => `${Math.max(1.5, (v / max) * 100)}%`;
  return (
    <figure className="tour-fig" role="img" aria-label={`${f.title}. ${f.a.k}, ${f.a.h}; ${f.b.k}, ${f.b.h}.`}>
      <Title>{f.title}</Title>
      <div className="tour-fig-compare">
        {[f.a, f.b].map((s, i) => (
          <div key={i} className="tour-fig-row" title={`${s.k}: ${s.h}`}>
            <div style={{ ...BIG, fontSize: 'clamp(26px, 2.4vw, 36px)', color: 'var(--fg)' }}>{s.k}</div>
            <div className="tour-fig-track">
              <div className="tour-fig-fill" style={{ width: w(s.value), background: i === 0 ? BAR : BAR_BEFORE }} />
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.45 }}>{s.h}</div>
          </div>
        ))}
      </div>
    </figure>
  );
}

/** Antes / después por grupo: dos barras pegadas, gris y azul. */
function Pairs({ f }: { f: Extract<Figure, { type: 'pairs' }> }) {
  const max = Math.max(...f.groups.flatMap((g) => [g.before, g.after]));
  return (
    <figure
      className="tour-fig"
      role="img"
      aria-label={`${f.title}. ${f.groups.map((g) => `${g.label}: ${f.beforeLabel} ${g.before} %, ${f.afterLabel} ${g.after} %`).join('; ')}.`}
    >
      <Title>{f.title}</Title>
      <div className="tour-fig-pairs">
        {f.groups.map((g, i) => (
          <div key={i} className="tour-fig-group">
            <span style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>{g.label}</span>
            {[
              { v: g.before, c: BAR_BEFORE, l: f.beforeLabel },
              { v: g.after, c: BAR, l: f.afterLabel },
            ].map((b, j) => (
              <div key={j} className="tour-fig-row" title={`${b.l}: ${b.v} %`}>
                <span className="mono tour-fig-val" style={{ width: 44, textAlign: 'right' }}>{b.v} %</span>
                <div className="tour-fig-track">
                  <div className="tour-fig-fill" style={{ width: `${(b.v / max) * 100}%`, background: b.c }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="tour-fig-legend mono">
        <span><i style={{ background: BAR_BEFORE }} />{f.beforeLabel}</span>
        <span><i style={{ background: BAR }} />{f.afterLabel}</span>
      </div>
    </figure>
  );
}

/** Pocas barras en el tiempo, con el valor encima. */
function Trend({ f }: { f: Extract<Figure, { type: 'trend' }> }) {
  return (
    <figure className="tour-fig" role="img" aria-label={`${f.title}. ${f.items.map((i) => `${i.label}: ${i.display}`).join('; ')}.`}>
      <Title>{f.title}</Title>
      <div className="tour-fig-bars tour-fig-bars-trend" style={{ gridTemplateColumns: `repeat(${f.items.length}, 1fr)` }}>
        {f.items.map((it, j) => (
          <div key={j} className="tour-fig-col" title={`${it.label}: ${it.display}`}>
            <span className="tour-fig-val" style={{ ...BIG, fontSize: 'clamp(22px, 2vw, 30px)', color: 'var(--fg)' }}>{it.display}</span>
            <div className="tour-fig-bar" style={{ height: `${(it.value / f.max) * 100}%`, background: BAR, opacity: 0.55 + (j / Math.max(1, f.items.length - 1)) * 0.45 }} />
          </div>
        ))}
      </div>
      <div className="mono tour-fig-labels" style={{ gridTemplateColumns: `repeat(${f.items.length}, 1fr)` }}>
        {f.items.map((it, j) => (
          <span key={j}>{it.label}</span>
        ))}
      </div>
    </figure>
  );
}

export function FigureView({ f }: { f: Figure }) {
  switch (f.type) {
    case 'bars':
      return <Bars f={f} />;
    case 'compare':
      return <Compare f={f} />;
    case 'pairs':
      return <Pairs f={f} />;
    case 'trend':
      return <Trend f={f} />;
  }
}
