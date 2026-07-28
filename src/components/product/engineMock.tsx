import type { ReactNode } from 'react';
import { ACCENT, ACCENT_DEEP, ACCENT_SOFT, BODY, Icon, INK, LINE, MUTED, OK, OK_BG, OK_FG, PhoneCta, PhoneFrame } from './appMock';

/**
 * Mockup del motor de reservas (diseño «Motor de reservas»): disponibilidad,
 * pago y contrato en el móvil del cliente.
 *
 * Medidas en `em` contra los 390 px del móvil; ver la cabecera de `appMock.tsx`.
 */

export function EnginePhones() {
  return (
    <>
      <Availability />
      <Payment />
      <Contract />
    </>
  );
}

function Availability() {
  const days = [
    { d: 'Vie', n: '31' },
    { d: 'Sáb', n: '1', on: true },
    { d: 'Dom', n: '2' },
    { d: 'Lun', n: '3', full: true },
  ];
  const slots = [
    { t: '08:00 – 12:00', free: '3 libres' },
    { t: '10:00 – 14:00', free: '1 libre', on: true },
    { t: '14:00 – 18:00', free: 'Completo', full: true },
  ];

  return (
    <PhoneFrame header="none">
      {/* Hueco de imagen del diseño: sin foto de barco, un degradado de marca. */}
      <div
        style={{
          height: '1.5em',
          flex: 'none',
          background: 'linear-gradient(150deg, #cfe4f1, #9dc4dc)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="boat" size="0.6em" color="rgba(16,102,149,.5)" />
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '0.2em', display: 'flex', flexDirection: 'column', gap: '0.18em' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.04em' }}>
          <span style={{ fontSize: '0.22em', fontWeight: 700, letterSpacing: '-.01em', color: INK }}>Princess V48 · medio día</span>
          <span style={{ fontSize: '0.15em', color: BODY }}>Dénia · patrón incluido</span>
        </div>

        <Field label="Elige el día">
          <div style={{ display: 'flex', gap: '0.08em' }}>
            {days.map((d) => (
              <div
                key={d.n}
                style={{
                  flex: 1,
                  height: '0.66em',
                  background: d.on ? ACCENT_SOFT : d.full ? '#f7f9f9' : undefined,
                  border: d.on ? `0.02em solid ${ACCENT}` : `0.01em solid ${LINE}`,
                  borderRadius: '0.14em',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.02em',
                }}
              >
                <span style={{ fontSize: '0.12em', color: d.on ? ACCENT : d.full ? '#d1d5db' : MUTED }}>{d.d}</span>
                <span style={{ fontSize: d.on ? '0.19em' : '0.18em', fontWeight: d.on ? 700 : 600, color: d.on ? ACCENT : d.full ? '#d1d5db' : INK }}>
                  {d.n}
                </span>
              </div>
            ))}
          </div>
        </Field>

        <Field label="Elige la hora">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1em' }}>
            {slots.map((s) => (
              <div
                key={s.t}
                style={{
                  height: '0.6em',
                  background: s.on ? ACCENT_SOFT : s.full ? '#f7f9f9' : undefined,
                  border: s.on ? `0.02em solid ${ACCENT}` : `0.01em solid ${LINE}`,
                  borderRadius: '0.14em',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 0.18em',
                  gap: '0.12em',
                }}
              >
                <span style={{ flex: 1, display: 'flex' }}>
                  <span style={{ fontSize: '0.17em', fontWeight: s.on ? 700 : 500, color: s.on ? ACCENT : s.full ? MUTED : INK }}>{s.t}</span>
                </span>
                <span style={{ fontSize: '0.13em', fontWeight: 700, color: s.full ? MUTED : OK }}>{s.free}</span>
              </div>
            ))}
          </div>
        </Field>

        <span style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.15em', color: BODY }}>Precio de temporada alta</span>
          <span style={{ fontSize: '0.28em', fontWeight: 700, letterSpacing: '-.02em', color: INK }}>500 €</span>
        </div>
        <PhoneCta>Continuar</PhoneCta>
      </div>
    </PhoneFrame>
  );
}

function Payment() {
  return (
    <PhoneFrame header="none">
      <TopBar title="Pago">
        <Icon name="shield-check" size="0.15em" color={OK} />
        <span style={{ fontSize: '0.13em', color: BODY }}>Stripe</span>
      </TopBar>

      <div style={{ flex: 1, minHeight: 0, padding: '0.2em', display: 'flex', flexDirection: 'column', gap: '0.18em' }}>
        <div style={{ border: `0.01em solid ${LINE}`, borderRadius: '0.16em', padding: '0.16em', display: 'flex', flexDirection: 'column', gap: '0.1em' }}>
          <span style={{ fontSize: '0.16em', fontWeight: 600, color: INK }}>Princess V48 · medio día</span>
          <span style={{ fontSize: '0.14em', color: BODY }}>Sáb 1 ago · 10:00 – 14:00</span>
          <span style={{ height: '0.01em', background: LINE }} />
          {[
            ['Charter', '413,22 €'],
            ['IVA 21 %', '86,78 €'],
          ].map(([k, v]) => (
            <span key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.14em', color: BODY }}>{k}</span>
              <span style={{ fontSize: '0.14em', color: BODY }}>{v}</span>
            </span>
          ))}
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.16em', fontWeight: 600, color: INK }}>Total</span>
            <span style={{ fontSize: '0.26em', fontWeight: 700, color: INK }}>500 €</span>
          </span>
        </div>

        <Field label="Cuánto pagas ahora">
          <div style={{ display: 'flex', gap: '0.1em' }}>
            <div style={{ flex: 1, border: `0.02em solid ${ACCENT}`, background: ACCENT_SOFT, borderRadius: '0.16em', padding: '0.14em', display: 'flex', flexDirection: 'column', gap: '0.05em' }}>
              <span style={{ fontSize: '0.14em', fontWeight: 700, color: ACCENT_DEEP }}>Todo</span>
              <span style={{ fontSize: '0.22em', fontWeight: 700, color: ACCENT }}>500 €</span>
            </div>
            <div style={{ flex: 1, border: `0.01em solid ${LINE}`, borderRadius: '0.16em', padding: '0.14em', display: 'flex', flexDirection: 'column', gap: '0.02em' }}>
              <span style={{ fontSize: '0.14em', fontWeight: 600, color: INK }}>Señal</span>
              <span style={{ fontSize: '0.22em', fontWeight: 700, color: INK }}>150 €</span>
              <span style={{ fontSize: '0.12em', color: BODY }}>350 € en la base</span>
            </div>
          </div>
        </Field>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1em' }}>
          <div style={{ height: '0.56em', border: `0.01em solid ${LINE}`, borderRadius: '0.14em', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.16em' }}>
            <span style={{ fontSize: '0.15em', color: INK }}>4242 4242 4242 4242</span>
            <Icon name="credit-card" size="0.18em" color={MUTED} />
          </div>
          <div style={{ display: 'flex', gap: '0.1em' }}>
            {[
              ['08 / 28', INK],
              ['CVC', MUTED],
            ].map(([t, c]) => (
              <div key={t} style={{ flex: 1, height: '0.56em', border: `0.01em solid ${LINE}`, borderRadius: '0.14em', display: 'flex', alignItems: 'center', padding: '0 0.16em' }}>
                <span style={{ fontSize: '0.15em', color: c }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <span style={{ flex: 1 }} />
        <PhoneCta>Pagar 500 €</PhoneCta>
      </div>
    </PhoneFrame>
  );
}

function Contract() {
  return (
    <PhoneFrame header="none">
      <TopBar title="Contrato">
        <Icon name="signature" size="0.15em" color={ACCENT} />
        <span style={{ fontSize: '0.13em', color: BODY }}>eIDAS</span>
      </TopBar>

      <div style={{ flex: 1, minHeight: 0, padding: '0.2em', display: 'flex', flexDirection: 'column', gap: '0.18em' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.12em', background: OK_BG, borderRadius: '0.14em', padding: '0.14em 0.16em' }}>
          <Icon name="check" size="0.19em" color={OK} />
          <span style={{ fontSize: '0.15em', fontWeight: 600, color: OK_FG }}>Pago confirmado · 500 €</span>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            border: `0.01em solid ${LINE}`,
            borderRadius: '0.16em',
            padding: '0.16em',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.1em',
          }}
        >
          <span style={{ fontSize: '0.11em', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: MUTED }}>
            Contrato de alquiler
          </span>
          {[
            'El arrendatario asume la responsabilidad por los daños causados durante el alquiler y acepta la zona de navegación autorizada.',
            'La hora de regreso es vinculante; los retrasos se cobran según tarifa.',
          ].map((t) => (
            <span key={t} style={{ fontSize: '0.13em', lineHeight: 1.55, color: BODY, textWrap: 'pretty' }}>
              {t}
            </span>
          ))}
          <span style={{ fontSize: '0.13em', lineHeight: 1.55, color: MUTED }}>Se preautoriza una fianza de 600 € al recoger.</span>
        </div>

        <Field label="Firma aquí">
          <div style={{ height: '1em', border: `0.01em dashed #d1d5db`, borderRadius: '0.1em', background: '#f7f9f9' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%' }} aria-hidden>
              <path
                d="M28 68 C 46 26, 62 24, 68 46 C 74 68, 60 82, 54 72 C 48 62, 66 44, 92 44 C 112 44, 104 70, 118 70 C 132 70, 138 34, 156 34 C 172 34, 162 68, 178 68 C 196 68, 200 40, 218 44 C 232 47, 226 66, 244 60 C 256 56, 262 48, 272 40"
                fill="none"
                stroke={INK}
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Field>

        <span style={{ flex: 1 }} />
        <PhoneCta>Firmar y reservar</PhoneCta>
      </div>
    </PhoneFrame>
  );
}

function TopBar({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ height: '0.64em', flex: 'none', display: 'flex', alignItems: 'center', gap: '0.12em', padding: '0 0.2em', borderBottom: `0.01em solid ${LINE}` }}>
      <Icon name="arrow-left" size="0.19em" color={BODY} />
      <span style={{ flex: 1, display: 'flex' }}>
        <span style={{ fontSize: '0.17em', fontWeight: 600, color: INK }}>{title}</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.06em' }}>{children}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1em' }}>
      <span style={{ fontSize: '0.11em', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: MUTED }}>{label}</span>
      {children}
    </div>
  );
}
