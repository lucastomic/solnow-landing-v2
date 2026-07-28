import { ACCENT, ACCENT_DEEP, ACCENT_SOFT, BODY, cardStyle, Icon, INK, LINE, LINE_SOFT, MUTED, OK, OK_BG, OK_FG, PhoneCta, PhoneFrame, PhoneHead, Pill, ScreenHead } from './appMock';

/**
 * Mockup de operación en tiempo real (diseño «Operación tiempo real»):
 * tablero de flota por horas y lista de embarque.
 *
 * Medidas en `em` sobre la base de `AppFrame`; ver la cabecera de `appMock.tsx`.
 */


/* ── Tablero en vivo ─────────────────────────────────────────────────────── */

/** Paleta de las reservas del tablero: un color por cliente, no por estado. */
const TONES = [
  { bar: '#0284c7', bg: '#e0f2fe', fg: '#075985' },
  { bar: '#e11d48', bg: '#ffe4e6', fg: '#9f1239' },
  { bar: '#16a34a', bg: '#dcfce7', fg: '#15803d' },
  { bar: '#0d9488', bg: '#ccfbf1', fg: '#115e59' },
  { bar: '#f59e0b', bg: '#fef3c7', fg: '#b45309' },
  { bar: '#c026d3', bg: '#fae8ff', fg: '#86198f' },
  { bar: '#106695', bg: ACCENT_SOFT, fg: ACCENT_DEEP },
  { bar: '#7c3aed', bg: '#ede9fe', fg: '#5b21b6' },
];

/** Media hora por columna: 22 columnas van de las 09:00 a las 20:00. */
const COLS = 22;
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
/** La barra roja del «ahora»: columna 17 de 22 → las 17:00. */
const NOW_COL = 17;

type Slot = { col: number; span: number; who: string; tone: number; alert?: boolean };
type Row = { unit: string; slots: Slot[] };

const ROWS: Row[] = [
  { unit: 'Moto #1', slots: [{ col: 2, span: 2, who: 'Iris Sánchez', tone: 0 }, { col: 4, span: 2, who: 'Enzo Jourdan', tone: 1 }, { col: 7, span: 2, who: 'Francesco B.', tone: 2 }, { col: 10, span: 2, who: 'Vladyslav K.', tone: 3 }, { col: 13, span: 2, who: 'Saoirse D.', tone: 4 }, { col: 16, span: 2, who: 'Thyrion Alice', tone: 5 }, { col: 18, span: 2, who: 'Matías Vásquez', tone: 6 }, { col: 21, span: 2, who: 'Juan Navarro', tone: 7 }] },
  { unit: 'Moto #2', slots: [{ col: 2, span: 2, who: 'Alberto Mir', tone: 3 }, { col: 5, span: 2, who: 'Aya Alaoui', tone: 4 }, { col: 8, span: 2, who: 'Cristina Cl.', tone: 1 }, { col: 11, span: 2, who: 'Mohemmed A.', tone: 0 }, { col: 14, span: 2, who: 'Nosatov I.', tone: 5 }, { col: 18, span: 2, who: 'Tomás Martín', tone: 6 }, { col: 20, span: 2, who: 'Barbat Ilan', tone: 2, alert: true }] },
  { unit: 'Moto #3', slots: [{ col: 3, span: 2, who: 'Jørgen Se.', tone: 2 }, { col: 6, span: 2, who: 'Leonardo P.', tone: 7 }, { col: 9, span: 2, who: 'Kacper N.', tone: 5 }, { col: 12, span: 2, who: 'Soufiane B.', tone: 0 }, { col: 15, span: 2, who: 'Annarita E.', tone: 1 }, { col: 18, span: 2, who: 'Martín 888', tone: 6 }, { col: 21, span: 2, who: 'Rubén Rey', tone: 3 }] },
  { unit: 'Moto #4', slots: [{ col: 2, span: 2, who: 'Kaline Souza', tone: 1 }, { col: 4, span: 2, who: 'Rocco Vinci', tone: 4 }, { col: 7, span: 2, who: 'Balraj Sar.', tone: 3 }, { col: 10, span: 2, who: 'Hayley Sla.', tone: 7 }, { col: 13, span: 2, who: 'Miguel An.', tone: 2 }, { col: 16, span: 2, who: 'Izan Espinosa', tone: 0 }, { col: 18, span: 2, who: 'Jeremy Wauq.', tone: 5, alert: true }, { col: 20, span: 2, who: 'Mikael R.', tone: 6 }] },
  { unit: 'Moto #5', slots: [{ col: 2, span: 2, who: 'Nerea García', tone: 5 }, { col: 5, span: 2, who: 'Paula Yebes', tone: 0 }, { col: 8, span: 2, who: 'Karim B.', tone: 2 }, { col: 11, span: 2, who: 'Samuele R.', tone: 1 }, { col: 14, span: 2, who: 'María Idoyaga', tone: 4 }, { col: 18, span: 2, who: 'Lasse H.', tone: 7, alert: true }, { col: 21, span: 2, who: 'Khadija A.', tone: 3 }] },
  { unit: 'Moto #6', slots: [{ col: 3, span: 2, who: 'Patricia S.', tone: 7 }, { col: 6, span: 2, who: 'Senne Francken', tone: 3 }, { col: 9, span: 2, who: 'Yajaira Martín', tone: 6 }, { col: 12, span: 2, who: 'Amad D.', tone: 4 }, { col: 15, span: 2, who: 'Jake M.', tone: 1 }, { col: 18, span: 2, who: 'Mamoudou T.', tone: 2, alert: true }, { col: 20, span: 2, who: 'Ilyass Belyazid', tone: 0 }] },
  { unit: 'Moto #7', slots: [{ col: 2, span: 2, who: 'Noa Peris', tone: 4 }, { col: 5, span: 2, who: 'Théo Marchand', tone: 6 }, { col: 8, span: 2, who: 'Greta Falk', tone: 3 }, { col: 11, span: 2, who: 'Óscar Ibáñez', tone: 7 }, { col: 14, span: 2, who: 'Sanna Virta', tone: 5 }, { col: 17, span: 2, who: 'Dilan Yıldız', tone: 0 }, { col: 20, span: 2, who: 'Ada Kowal', tone: 1 }] },
  { unit: 'Moto #8', slots: [{ col: 3, span: 2, who: 'Bruno Sá', tone: 1 }, { col: 6, span: 2, who: 'Lena Hoffmann', tone: 2 }, { col: 9, span: 2, who: 'Hugo Sanchís', tone: 5 }, { col: 12, span: 2, who: 'Nadia Chraibi', tone: 4 }, { col: 15, span: 2, who: 'Elliot Grant', tone: 7 }, { col: 18, span: 2, who: 'Vera Lombardi', tone: 3 }, { col: 21, span: 2, who: 'Toni Sabater', tone: 6 }] },
  { unit: 'Seabob #1', slots: [{ col: 4, span: 2, who: 'Alba Ferrer', tone: 3 }, { col: 7, span: 2, who: 'Marc Puig', tone: 0 }, { col: 10, span: 2, who: 'Yusuf Demir', tone: 1 }, { col: 13, span: 2, who: 'Chiara Neri', tone: 6 }, { col: 16, span: 2, who: 'Pablo Herrán', tone: 5 }, { col: 19, span: 2, who: 'Emma Dubois', tone: 2 }] },
  { unit: 'Seabob #2', slots: [{ col: 5, span: 2, who: 'Ivan Petrov', tone: 7 }, { col: 8, span: 2, who: 'Lucía Ferreira', tone: 4 }, { col: 11, span: 2, who: 'Tom Baker', tone: 3 }, { col: 14, span: 2, who: 'Sara Micó', tone: 1 }, { col: 17, span: 2, who: 'Jonas Weiss', tone: 0 }, { col: 20, span: 2, who: 'Mei Tanaka', tone: 5 }] },
  { unit: 'Princess V48', slots: [{ col: 2, span: 4, who: 'Aurora Ferri · mañana', tone: 3 }, { col: 8, span: 8, who: 'Agustina Dramis · medio día', tone: 1 }, { col: 18, span: 6, who: 'Kacper · charter al atardecer', tone: 0, alert: true }] },
  { unit: 'Sunseeker 55', slots: [{ col: 3, span: 6, who: 'Ilaria Conte · medio día', tone: 6 }, { col: 11, span: 5, who: 'Peter Nagy · tarde', tone: 7 }, { col: 18, span: 5, who: 'Rania Haddad · atardecer', tone: 4 }] },
  { unit: 'Lagoon 400', slots: [{ col: 2, span: 5, who: 'Carlos García · mañana', tone: 5 }, { col: 8, span: 16, who: 'Dimo · charter de día', tone: 2 }] },
  { unit: 'Zodiac Pro', slots: [{ col: 4, span: 3, who: 'Nils Bergström', tone: 0 }, { col: 9, span: 3, who: 'Alicia Prats', tone: 3 }, { col: 14, span: 3, who: 'Otto Lehtinen', tone: 1 }, { col: 19, span: 3, who: 'Farah Nasser', tone: 6 }] },
];

/** `1.5em` de etiqueta + 22 columnas de `0.44em`. */
const GRID = `1.5em repeat(${COLS}, 0.44em)`;

export function OpsBoardScreen() {
  return (
    <div style={{ flex: 1, minHeight: 0, padding: '0.28em 0.32em', display: 'flex', flexDirection: 'column', gap: '0.22em' }}>
      <ScreenHead title="Hoy · 27 de julio">
        <Pill tone="ok">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6em' }}>
            <span style={{ width: '0.6em', height: '0.6em', borderRadius: '999px', background: OK, display: 'inline-block' }} />
            En vivo · 17:00
          </span>
        </Pill>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: '0.15em', color: BODY }}>14 unidades</span>
      </ScreenHead>

      <div style={{ ...cardStyle, flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, height: '0.34em', borderBottom: `0.01em solid ${LINE}`, background: '#f7f9f9' }}>
          <div />
          {HOURS.map((h, i) => (
            <div
              key={h}
              style={{ gridColumn: `${2 + i * 2} / span 2`, display: 'flex', alignItems: 'center', paddingLeft: '0.08em' }}
            >
              <span style={{ fontSize: '0.12em', fontWeight: i * 2 + 2 === NOW_COL + 1 ? 700 : 600, color: i * 2 + 2 === NOW_COL + 1 ? ACCENT : MUTED }}>
                {h}
              </span>
            </div>
          ))}
        </div>

        {ROWS.map((r, ri) => (
          <div
            key={r.unit}
            style={{
              display: 'grid',
              gridTemplateColumns: GRID,
              height: '0.44em',
              borderBottom: ri < ROWS.length - 1 ? `0.01em solid ${LINE_SOFT}` : 0,
            }}
          >
            <div style={{ gridColumn: 1, display: 'flex', alignItems: 'center', paddingLeft: '0.16em', borderRight: `0.01em solid ${LINE}` }}>
              <span style={{ fontSize: '0.13em', fontWeight: 600, color: INK }}>{r.unit}</span>
            </div>
            {r.slots.map((s) => {
              const t = TONES[s.tone];
              return (
                <div
                  key={s.col}
                  style={{
                    gridColumn: `${s.col} / span ${s.span}`,
                    margin: '0.05em 0.03em',
                    borderLeft: `0.03em solid ${s.alert ? '#ef4444' : t.bar}`,
                    background: t.bg,
                    borderRadius: '0.06em',
                    boxShadow: s.alert ? '0 0 0 0.02em #ef4444' : undefined,
                    padding: '0.04em 0.07em',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    // Lo ya pasado se atenúa; lo que queda por delante, no.
                    opacity: s.col + s.span <= NOW_COL ? 0.82 : 1,
                  }}
                >
                  <span style={{ fontSize: '0.11em', fontWeight: 700, color: t.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.who}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Línea del «ahora», sobre la rejilla. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '0.34em',
            bottom: 0,
            left: `calc(1.5em + ${NOW_COL - 1} * 0.44em)`,
            width: '0.02em',
            background: '#ef4444',
          }}
        />
      </div>
    </div>
  );
}

/* ── Check-in, desde el móvil del muelle ────────────────────────────────── */

type Departure = { time: string; what: string; count: string; bar: string; badge: string; badgeBg: string; badgeFg: string };

const NOW: Departure[] = [
  { time: '17:00', what: 'Moto de agua · Pontón', count: '2 / 2 embarcados', bar: OK, badge: '', badgeBg: OK_BG, badgeFg: OK_FG },
  { time: '17:30', what: 'Princess V48 · atardecer', count: '3 / 4 embarcados', bar: '#f59e0b', badge: '1 pendiente', badgeBg: '#fef3c7', badgeFg: '#b45309' },
];

const NEXT: Departure[] = [
  { time: '18:00', what: 'Moto de agua', count: '0 / 2 embarcados', bar: ACCENT, badge: 'En 50 min', badgeBg: ACCENT_SOFT, badgeFg: ACCENT_DEEP },
  { time: '18:30', what: 'Lagoon 400', count: '0 / 8 embarcados', bar: ACCENT, badge: 'En 80 min', badgeBg: ACCENT_SOFT, badgeFg: ACCENT_DEEP },
  { time: '19:00', what: 'Seabob', count: '0 / 2 embarcados', bar: ACCENT, badge: 'En 110 min', badgeBg: ACCENT_SOFT, badgeFg: ACCENT_DEEP },
];

export function OpsCheckInPhones() {
  return (
    <>
      <PhoneFrame>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 'none', padding: '0.18em 0.2em 0.14em', display: 'flex', flexDirection: 'column', gap: '0.12em', background: '#fff', borderBottom: `0.01em solid ${LINE}` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.03em' }}>
              <span style={{ fontSize: '0.22em', fontWeight: 700, letterSpacing: '-.01em', color: INK }}>Check-in</span>
              <span style={{ fontSize: '0.14em', color: BODY }}>Hoy · 186 de 240 embarcados</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.1em', height: '0.48em', padding: '0 0.14em', background: '#f7f9f9', border: `0.01em solid ${LINE}`, borderRadius: '0.1em' }}>
              <Icon name="search" size="0.18em" color={MUTED} />
              <span style={{ fontSize: '0.15em', color: MUTED }}>Buscar pasajero…</span>
            </div>
            <PhoneCta>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
                <Icon name="qr" size="1.1em" color="#fff" />
                Escanear QR
              </span>
            </PhoneCta>
          </div>

          <div style={{ flex: 1, minHeight: 0, padding: '0.16em 0.2em', display: 'flex', flexDirection: 'column', gap: '0.12em' }}>
            <Kick>Ahora · 17:00</Kick>
            {NOW.map((d) => (
              <DepartureCard key={d.time} d={d} done={!d.badge} />
            ))}
            <Kick>Siguientes</Kick>
            {NEXT.map((d) => (
              <DepartureCard key={d.time} d={d} />
            ))}
          </div>
        </div>
      </PhoneFrame>

      <PhoneFrame>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <PhoneHead back="Atrás" title="Princess V48 · atardecer" sub="17:30 · 3 de 4 embarcados" />
          <div style={{ flex: 1, minHeight: 0, padding: '0.16em 0.2em', display: 'flex', flexDirection: 'column', gap: '0.12em' }}>
            {[
              ['Kacper Nowak', 'Embarcó 17:12'],
              ['Ada Kowal', 'Embarcó 17:13'],
              ['Bruno Sá', 'Embarcó 17:15'],
            ].map(([who, when]) => (
              <div key={who} style={{ border: `0.01em solid ${LINE}`, borderRadius: '0.12em', padding: '0.14em 0.16em', display: 'flex', alignItems: 'center', gap: '0.14em' }}>
                <span style={{ width: '0.3em', height: '0.3em', flex: 'none', borderRadius: '999px', background: OK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size="0.17em" color="#fff" />
                </span>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.02em' }}>
                  <span style={{ fontSize: '0.16em', fontWeight: 600, color: INK }}>{who}</span>
                  <span style={{ fontSize: '0.13em', color: OK }}>{when}</span>
                </span>
              </div>
            ))}

            <div style={{ border: `0.02em solid ${ACCENT}`, borderRadius: '0.12em', padding: '0.14em 0.16em', display: 'flex', flexDirection: 'column', gap: '0.12em' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.14em' }}>
                <span style={{ width: '0.3em', height: '0.3em', flex: 'none', borderRadius: '999px', border: '0.02em solid #d1d5db' }} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.02em' }}>
                  <span style={{ fontSize: '0.16em', fontWeight: 600, color: INK }}>Soufiane Bel</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.06em' }}>
                    <Icon name="signature" size="0.14em" color={OK} />
                    <span style={{ fontSize: '0.13em', color: OK }}>Firmado</span>
                  </span>
                </span>
              </div>
              <div style={{ height: '0.5em', borderRadius: '0.1em', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.16em', fontWeight: 600, color: '#fff' }}>Embarcar</span>
              </div>
            </div>

            <span style={{ flex: 1 }} />

            <div style={{ height: '0.54em', border: `0.01em solid ${LINE}`, background: '#fff', borderRadius: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.09em' }}>
              <Icon name="anchor" size="0.18em" color={ACCENT} />
              <span style={{ fontSize: '0.16em', fontWeight: 600, color: ACCENT }}>Dar salida</span>
            </div>
          </div>
        </div>
      </PhoneFrame>

      <PhoneFrame>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 'none', padding: '0.18em 0.2em 0.16em', background: '#fff', borderBottom: `0.01em solid ${LINE}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.1em', marginBottom: '0.12em' }}>
              <Icon name="x" size="0.18em" color={BODY} />
              <span style={{ fontSize: '0.14em', color: BODY }}>Cancelar</span>
            </div>
            <div style={{ fontSize: '0.22em', fontWeight: 700, letterSpacing: '-.01em', color: INK }}>Escanea el QR del cliente</div>
            <div style={{ fontSize: '0.14em', color: BODY, marginTop: '0.21em' }}>Apunta al código de su móvil</div>
          </div>

          <div style={{ flex: 1, minHeight: 0, padding: '0.2em', display: 'flex', flexDirection: 'column', gap: '0.16em' }}>
            <div style={{ flex: 1, minHeight: 0, borderRadius: '0.16em', background: INK, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '2.1em', height: '2.1em', position: 'relative' }}>
                {([
                  ['top', 'left', '0.12em 0 0 0'],
                  ['top', 'right', '0 0.12em 0 0'],
                  ['bottom', 'left', '0 0 0 0.12em'],
                  ['bottom', 'right', '0 0 0.12em 0'],
                ] as const).map(([v, h, radius]) => (
                  <span
                    key={`${v}${h}`}
                    style={{
                      position: 'absolute',
                      [v]: 0,
                      [h]: 0,
                      width: '0.44em',
                      height: '0.44em',
                      [v === 'top' ? 'borderTop' : 'borderBottom']: '0.04em solid #fff',
                      [h === 'left' ? 'borderLeft' : 'borderRight']: '0.04em solid #fff',
                      borderRadius: radius,
                    }}
                  />
                ))}
                <span style={{ position: 'absolute', left: '0.1em', right: '0.1em', top: '50%', height: '0.02em', background: '#22c55e', boxShadow: '0 0 0.12em rgba(34,197,94,.9)' }} />
              </div>
              <span style={{ position: 'absolute', bottom: '0.2em', fontSize: '0.14em', color: '#d7e7f0' }}>Buscando un código…</span>
            </div>

            <div style={{ border: `0.02em solid ${OK}`, borderRadius: '0.12em', padding: '0.16em', display: 'flex', alignItems: 'center', gap: '0.14em' }}>
              <span style={{ width: '0.38em', height: '0.38em', flex: 'none', borderRadius: '999px', background: OK_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size="0.2em" color={OK} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.02em' }}>
                <span style={{ fontSize: '0.16em', fontWeight: 600, color: INK }}>Soufiane Bel</span>
                <span style={{ fontSize: '0.13em', color: BODY }}>Princess V48 · atardecer · 17:30</span>
              </span>
              <span style={{ background: OK_BG, borderRadius: '999px', padding: '0.05em 0.1em', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.12em', fontWeight: 700, color: OK_FG }}>Embarcado</span>
              </span>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </>
  );
}

function Kick({ children }: { children: string }) {
  return (
    <span style={{ fontSize: '0.11em', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: MUTED }}>{children}</span>
  );
}

function DepartureCard({ d, done }: { d: Departure; done?: boolean }) {
  return (
    <div
      style={{
        background: '#fff',
        border: `0.01em solid ${LINE}`,
        borderLeft: `0.04em solid ${d.bar}`,
        borderRadius: '0.12em',
        padding: '0.14em 0.16em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.12em',
      }}
    >
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.03em' }}>
        <span style={{ fontSize: '0.16em', fontWeight: 600, color: INK }}>{d.time} · {d.what}</span>
        <span style={{ fontSize: '0.13em', color: BODY }}>{d.count}</span>
      </span>
      {done ? (
        <span style={{ width: '0.3em', height: '0.3em', borderRadius: '999px', background: OK_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size="0.17em" color={OK} />
        </span>
      ) : (
        <span style={{ background: d.badgeBg, borderRadius: '999px', padding: '0.05em 0.1em', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '0.12em', fontWeight: 700, color: d.badgeFg }}>{d.badge}</span>
        </span>
      )}
    </div>
  );
}
