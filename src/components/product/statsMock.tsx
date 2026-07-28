import { ACCENT, BODY, cardStyle, Icon, INK, Kicker, LINE, LINE_SOFT, MUTED, OK, OK_BG, OK_FG, ScreenHead } from './appMock';

/**
 * Mockup de estadísticas (diseño «Estadisticas»): ingresos por canal, top de
 * producto, saldo de colaborador y reservas por día.
 *
 * Medidas en `em` sobre la base de `AppFrame`; ver la cabecera de `appMock.tsx`.
 */

const SOURCES = [
  { label: 'TPV de mostrador', pct: 84, color: ACCENT },
  { label: 'Web', pct: 11, color: '#3c86ac' },
  { label: 'OTAs', pct: 5, color: MUTED },
];

/** Últimos 14 días; el tono se intensifica hacia hoy. */
const DAYS = [
  { d: '14', h: 38, c: '#d7e7f0' },
  { d: '15', h: 44, c: '#d7e7f0' },
  { d: '16', h: 36, c: '#d7e7f0' },
  { d: '17', h: 52, c: '#d7e7f0' },
  { d: '18', h: 48, c: '#d7e7f0' },
  { d: '19', h: 60, c: '#d7e7f0' },
  { d: '20', h: 55, c: '#d7e7f0' },
  { d: '21', h: 64, c: '#a8cbdf' },
  { d: '22', h: 58, c: '#a8cbdf' },
  { d: '23', h: 72, c: '#a8cbdf' },
  { d: '24', h: 68, c: '#a8cbdf' },
  { d: '25', h: 82, c: '#3c86ac' },
  { d: '26', h: 76, c: '#3c86ac' },
  { d: '27', h: 88, c: ACCENT, today: true },
];

const BASES = ['Todas las bases', 'Dénia', 'Jávea', 'Calpe'];

export function StatsScreen() {
  return (
    <div style={{ flex: 1, minHeight: 0, padding: '0.28em 0.32em', display: 'flex', flexDirection: 'column', gap: '0.22em' }}>
      <ScreenHead title="Julio 2026" sub="3 bases · actualizado hace 5 min">
        <div style={{ display: 'flex', gap: '0.08em' }}>
          {BASES.map((b, i) => (
            <span
              key={b}
              style={{
                height: '0.4em',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.16em',
                borderRadius: '0.08em',
                background: i === 0 ? ACCENT : '#fff',
                border: i === 0 ? `0.01em solid ${ACCENT}` : `0.01em solid ${LINE}`,
              }}
            >
              <span style={{ fontSize: '0.14em', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? '#fff' : BODY }}>{b}</span>
            </span>
          ))}
        </div>
      </ScreenHead>

      <div style={{ display: 'flex', gap: '0.2em' }}>
        <div style={{ ...cardStyle, flex: 1.5, padding: '0.24em', display: 'flex', flexDirection: 'column', gap: '0.2em' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Kicker>Ingresos por canal</Kicker>
            <span style={{ fontSize: '0.32em', fontWeight: 700, letterSpacing: '-.02em', color: INK }}>184 k€</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.14em' }}>
            {SOURCES.map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.14em' }}>
                <span style={{ width: '1.5em', flex: 'none', display: 'flex' }}>
                  <span style={{ fontSize: '0.15em', color: INK }}>{s.label}</span>
                </span>
                <span style={{ flex: 1, height: '0.1em', borderRadius: '999px', background: LINE_SOFT, overflow: 'hidden' }}>
                  <span style={{ display: 'block', width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: '999px' }} />
                </span>
                <span style={{ width: '0.44em', flex: 'none', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.15em', fontWeight: 700, color: INK }}>{s.pct} %</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2em' }}>
          <Tile kicker="Producto top" name="Moto de agua · 60 min" value="52 k€ · 520 ventas" />
          <Tile kicker="Saldo de colaborador" name="Náutica Sur" value="1.240 € por liquidar" />
        </div>
      </div>

      <div style={{ ...cardStyle, flex: 1, minHeight: 0, padding: '0.24em', display: 'flex', flexDirection: 'column', gap: '0.18em' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Kicker>Reservas por día · últimos 14 días</Kicker>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.07em',
              height: '0.3em',
              padding: '0 0.12em',
              borderRadius: '999px',
              background: OK_BG,
            }}
          >
            <Icon name="trending-up" size="0.15em" color={OK_FG} />
            <span style={{ fontSize: '0.13em', fontWeight: 700, color: OK_FG }}>+18 % vs. semana pasada</span>
          </span>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch', gap: '0.1em' }}>
          {DAYS.map((b) => (
            <div key={b.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.08em', height: '100%' }}>
              <span style={{ flex: 'none', width: '100%', height: `${b.h}%`, background: b.c, borderRadius: '0.06em 0.06em 0 0' }} />
              <span style={{ fontSize: '0.11em', fontWeight: b.today ? 700 : 400, color: b.today ? ACCENT : MUTED }}>{b.d}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 'none', display: 'flex', gap: '0.36em' }}>
        {['Libro de registro al día', 'Reseñas 4,87 / 5', '38 % de clientes que repiten'].map((t) => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.09em' }}>
            <Icon name="check" size="0.17em" color={OK} />
            <span style={{ fontSize: '0.15em', color: BODY }}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Tile({ kicker, name, value }: { kicker: string; name: string; value: string }) {
  return (
    <div style={{ ...cardStyle, flex: 1, padding: '0.2em 0.24em', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.06em' }}>
      <Kicker>{kicker}</Kicker>
      <span style={{ fontSize: '0.19em', fontWeight: 600, color: INK }}>{name}</span>
      <span style={{ fontSize: '0.17em', fontWeight: 700, color: ACCENT }}>{value}</span>
    </div>
  );
}
