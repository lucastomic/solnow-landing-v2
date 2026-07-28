import type { ReactNode } from 'react';
import { ACCENT, ACCENT_SOFT, BODY, Icon, INK, LINE, MUTED, OK } from './appMock';

/**
 * Mockup del TPV (diseño «TPV v2»): cargar la venta y pasarle el móvil al
 * cliente.
 *
 * Medidas en `em` sobre la base de `AppFrame`; ver la cabecera de `appMock.tsx`.
 */

export type TpvStep = 'sale' | 'handover';

export function TpvScreen({ step }: { step: TpvStep }) {
  return step === 'sale' ? <LoadSale /> : <HandOver />;
}

/* ── 1 · Cargar la venta ─────────────────────────────────────────────────── */

function LoadSale() {
  const catalog = [
    { name: 'Moto de agua · 60 min', price: '100 €', tone: 'jet', on: true },
    { name: 'Moto de agua · 30 min', price: '60 €', tone: 'jet', on: false },
    { name: 'Princess V48 · Medio día', price: '500 €', tone: 'boat', on: false },
    { name: 'Lagoon 400 · Día completo', price: '1.000 €', tone: 'boat', on: false },
  ] as const;
  const slots = [
    { h: '15:00', free: '3 libres' },
    { h: '16:00', free: '4 libres' },
    { h: '17:00', free: '2 libres', on: true },
    { h: '18:00', free: '4 libres' },
    { h: '19:00', free: 'Completo', full: true },
  ];

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <div style={{ flex: 1, minWidth: 0, padding: '0.32em 0.32em 0', display: 'flex', flexDirection: 'column', gap: '0.24em' }}>
        <h4 style={{ margin: 0, fontSize: '0.24em', fontWeight: 700, letterSpacing: '-.01em', color: INK }}>¿Qué van a alquilar?</h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.16em' }}>
          {catalog.map((c) => (
            <div
              key={c.name}
              style={{
                background: '#fff',
                border: c.on ? `0.02em solid ${ACCENT}` : `0.01em solid ${LINE}`,
                borderRadius: '0.12em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.16em',
                padding: '0.14em',
                position: 'relative',
                boxShadow: c.on ? '0 0.06em 0.2em rgba(16,102,149,.12)' : '0 0.04em 0.16em rgba(17,24,39,.04)',
              }}
            >
              <Thumb tone={c.tone} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.06em' }}>
                <div style={{ fontSize: '0.18em', fontWeight: 600, color: INK }}>{c.name}</div>
                <div style={{ fontSize: '0.22em', fontWeight: 700, color: ACCENT }}>{c.price}</div>
              </div>
              {c.on && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0.12em',
                    right: '0.12em',
                    width: '0.24em',
                    height: '0.24em',
                    borderRadius: '999px',
                    background: ACCENT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="check" size="0.15em" color="#fff" />
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.12em' }}>
          <div style={{ fontSize: '0.16em', fontWeight: 600, color: INK }}>Franja horaria</div>
          <div style={{ display: 'flex', gap: '0.12em' }}>
            {slots.map((s) => (
              <div
                key={s.h}
                style={{
                  height: '0.72em',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.03em',
                  background: s.on ? ACCENT_SOFT : s.full ? '#f7f9f9' : '#fff',
                  border: s.on ? `0.02em solid ${ACCENT}` : `0.01em solid ${LINE}`,
                  borderRadius: '0.1em',
                }}
              >
                <span style={{ fontSize: s.on ? '0.17em' : '0.16em', fontWeight: s.on ? 700 : 500, color: s.on ? ACCENT : s.full ? MUTED : INK }}>
                  {s.h}
                </span>
                <span style={{ fontSize: '0.13em', fontWeight: 600, color: s.full ? MUTED : OK }}>{s.free}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside
        style={{
          width: '3.92em',
          flex: 'none',
          background: '#fff',
          borderLeft: `0.01em solid ${LINE}`,
          display: 'flex',
          flexDirection: 'column',
          padding: '0.32em 0.28em',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2em' }}>
          <div style={{ fontSize: '0.16em', fontWeight: 600, color: INK }}>Moto de agua · 60 min</div>
          <div style={{ fontSize: '0.15em', color: BODY }}>Hoy a las 17:00</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.16em', color: INK }}>Unidades</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.16em' }}>
              <Stepper icon="minus" />
              {/* `minWidth` va en el mismo elemento que el `fontSize`, así que
                  se expresa contra él: 20 px del diseño / 22 px de texto. */}
              <span style={{ fontSize: '0.22em', fontWeight: 700, color: INK, minWidth: '0.91em', textAlign: 'center' }}>2</span>
              <Stepper icon="plus" on />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2em' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.16em', fontWeight: 600, color: INK }}>Total</span>
            <span style={{ fontSize: '0.34em', fontWeight: 700, letterSpacing: '-.02em', color: INK }}>200 €</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.12em' }}>
            <PayTile icon="banknote" label="Efectivo" on />
            <PayTile icon="credit-card" label="Tarjeta" />
          </div>
          <Cta>Cobrar 200 €</Cta>
        </div>
      </aside>
    </div>
  );
}

/* ── 2 · Pasarle el móvil al cliente ─────────────────────────────────────── */

function HandOver() {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.28em',
        padding: '0.4em',
      }}
    >
      <div style={{ fontSize: '0.24em', fontWeight: 600, letterSpacing: '-.01em', color: INK }}>
        Pide al cliente que escanee el código
      </div>

      <div
        style={{
          background: '#fff',
          border: `0.01em solid ${LINE}`,
          borderRadius: '0.16em',
          padding: '0.36em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0.08em 0.28em rgba(17,24,39,.05)',
        }}
      >
        <Qr />
      </div>

      <div style={{ width: '3.92em' }}>
        <Cta>Nueva venta</Cta>
      </div>
    </div>
  );
}

/* ── Piezas ──────────────────────────────────────────────────────────────── */

function Cta({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        height: '0.6em',
        borderRadius: '0.1em',
        background: ACCENT,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: '0.18em', fontWeight: 600 }}>{children}</span>
    </div>
  );
}

function Stepper({ icon, on }: { icon: 'minus' | 'plus'; on?: boolean }) {
  return (
    <span
      style={{
        width: '0.48em',
        height: '0.48em',
        border: `0.01em solid ${on ? ACCENT : LINE}`,
        background: on ? ACCENT_SOFT : 'transparent',
        borderRadius: '0.1em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} size="0.18em" color={on ? ACCENT : BODY} />
    </span>
  );
}

function PayTile({ icon, label, on }: { icon: 'banknote' | 'credit-card'; label: string; on?: boolean }) {
  return (
    <div
      style={{
        height: '0.74em',
        border: `${on ? '0.02em' : '0.01em'} solid ${on ? ACCENT : LINE}`,
        background: on ? ACCENT_SOFT : 'transparent',
        borderRadius: '0.1em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.06em',
      }}
    >
      <Icon name={icon} size="0.22em" color={on ? ACCENT : BODY} />
      <span style={{ fontSize: '0.14em', fontWeight: on ? 700 : 600, color: on ? ACCENT : BODY }}>{label}</span>
    </div>
  );
}

/** Miniatura del catálogo. El diseño trae un hueco de imagen, no una foto. */
function Thumb({ tone }: { tone: 'jet' | 'boat' }) {
  return (
    <div
      style={{
        width: '0.96em',
        height: '0.76em',
        flex: 'none',
        borderRadius: '0.08em',
        background: tone === 'jet' ? 'linear-gradient(150deg, #cfe4f1, #9dc4dc)' : 'linear-gradient(150deg, #d9e7ef, #aec9d9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={tone === 'jet' ? 'jet' : 'boat'} size="0.34em" color="rgba(16,102,149,.55)" />
    </div>
  );
}

/** QR determinista con los tres patrones de localización. */
function Qr() {
  const N = 25;
  const cells: boolean[] = [];
  const inFinder = (r: number, c: number) => {
    const f = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return f(0, 0) || f(0, N - 7) || f(N - 7, 0);
  };
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (inFinder(r, c)) {
        const lr = r < 7 ? r : r - (N - 7);
        const lc = c < 7 ? c : c - (N - 7);
        const ring = Math.max(Math.abs(lr - 3), Math.abs(lc - 3));
        cells.push(ring === 3 || ring <= 1);
      } else {
        const h = (r * 73856093) ^ (c * 19349663) ^ (r * c * 83492791);
        cells.push(((h >>> 5) & 7) > 3);
      }
    }
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${N}, 0.11em)`, gridTemplateRows: `repeat(${N}, 0.11em)` }}>
      {cells.map((on, i) => (
        <div key={i} style={{ background: on ? INK : 'transparent' }} />
      ))}
    </div>
  );
}
