import { ACCENT, ACCENT_SOFT, BODY, cardStyle, Icon, INK, Kicker, LINE, LINE_SOFT, MUTED, OK_BG, OK_FG, ScreenHead } from './appMock';

/**
 * Mockup del portal de colaboradores (diseño «Portal colaboradores»):
 * comisiones calculadas y saldo por liquidar.
 *
 * Medidas en `em` sobre la base de `AppFrame`; ver la cabecera de `appMock.tsx`.
 */

const COLS = '1.6fr 1fr 1fr 1fr 1.5em';

const PARTNERS = [
  { name: 'Hotel Bahía Azul', icon: 'hotel', bookings: '42', rate: '15 %', fee: '1.840 €', settled: false },
  { name: 'Náutica Sur', icon: 'briefcase', bookings: '31', rate: '12 %', fee: '1.240 €', settled: false },
  { name: 'Resort Cala Blanca', icon: 'hotel', bookings: '18', rate: '15 %', fee: '825 €', settled: false },
  { name: 'Ibiza Travel Co.', icon: 'briefcase', bookings: '12', rate: '10 %', fee: '430 €', settled: true },
  { name: 'Hostal Marina', icon: 'hotel', bookings: '9', rate: '12 %', fee: '310 €', settled: true },
  { name: 'Sunset Concierge', icon: 'briefcase', bookings: '6', rate: '10 %', fee: '215 €', settled: true },
] as const;

export function PartnersScreen() {
  return (
    <div style={{ flex: 1, minHeight: 0, padding: '0.28em 0.32em', display: 'flex', flexDirection: 'column', gap: '0.22em' }}>
      <ScreenHead title="Colaboradores" sub="Julio · comisiones calculadas solas">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.03em' }}>
          <Kicker>Saldo por liquidar</Kicker>
          <span style={{ fontSize: '0.28em', fontWeight: 700, color: INK }}>3.905 €</span>
        </div>
      </ScreenHead>

      <div style={{ ...cardStyle, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: COLS,
            height: '0.48em',
            flex: 'none',
            alignItems: 'center',
            padding: '0 0.24em',
            borderBottom: `0.01em solid ${LINE}`,
            background: '#f7f9f9',
          }}
        >
          {['Colaborador', 'Reservas', 'Comisión', 'A pagar', 'Estado'].map((h, i) => (
            <span key={h} style={{ display: 'flex', justifyContent: i === 4 ? 'flex-end' : 'flex-start' }}>
              <span style={{ fontSize: '0.12em', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: MUTED }}>{h}</span>
            </span>
          ))}
        </div>

        {PARTNERS.map((p, i) => (
          <div
            key={p.name}
            style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              height: '0.84em',
              alignItems: 'center',
              padding: '0 0.24em',
              borderBottom: i < PARTNERS.length - 1 ? `0.01em solid ${LINE_SOFT}` : 0,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.12em' }}>
              <span
                style={{
                  width: '0.36em',
                  height: '0.36em',
                  flex: 'none',
                  borderRadius: '999px',
                  background: p.settled ? LINE_SOFT : ACCENT_SOFT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={p.icon} size="0.17em" color={p.settled ? BODY : ACCENT} />
              </span>
              <span style={{ fontSize: '0.15em', fontWeight: 600, color: INK }}>{p.name}</span>
            </span>
            <span style={{ display: 'flex' }}>
              <span style={{ fontSize: '0.15em', color: INK }}>{p.bookings}</span>
            </span>
            <span style={{ display: 'flex' }}>
              <span style={{ fontSize: '0.15em', color: INK }}>{p.rate}</span>
            </span>
            <span style={{ display: 'flex' }}>
              <span style={{ fontSize: '0.16em', fontWeight: 700, color: INK }}>{p.fee}</span>
            </span>
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ background: p.settled ? OK_BG : '#fef3c7', borderRadius: '999px', padding: '0.05em 0.11em', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.12em', fontWeight: 700, color: p.settled ? OK_FG : '#b45309' }}>
                  {p.settled ? 'Liquidado' : 'Por liquidar'}
                </span>
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
