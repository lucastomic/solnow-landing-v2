import { ACCENT, BODY, Icon, INK, LINE, MUTED, OK, OK_BG, PhoneCta, PhoneFrame } from './appMock';

/**
 * Mockup de contratos (diseño «Contratos firma digital»): la firma en el móvil
 * del cliente.
 *
 * Medidas en `em` contra los 390 px del móvil; ver la cabecera de `appMock.tsx`.
 */

/* ── En el móvil del cliente ─────────────────────────────────────────────── */

export function ContractPhones() {
  return (
    <>
      <PhoneFrame>
        <div style={{ flex: 1, minHeight: 0, padding: '0.24em 0.22em', display: 'flex', flexDirection: 'column', gap: '0.18em' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.04em' }}>
            <span style={{ fontSize: '0.22em', fontWeight: 700, letterSpacing: '-.01em', color: INK }}>Contrato de alquiler</span>
            <span style={{ fontSize: '0.15em', color: BODY }}>Moto de agua · sáb 1 ago, 12:00</span>
          </div>

          <div style={{ border: `0.01em solid ${LINE}`, borderRadius: '0.12em', padding: '0.16em', display: 'flex', flexDirection: 'column', gap: '0.12em' }}>
            {[
              ['Arrendatario', 'Marta Ruiz'],
              ['Embarcación', 'Sea-Doo · 7ª-BA-2-19-24'],
              ['Fianza', '600 €'],
            ].map(([k, v]) => (
              <span key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.14em', color: BODY }}>{k}</span>
                <span style={{ fontSize: '0.14em', fontWeight: 600, color: INK }}>{v}</span>
              </span>
            ))}
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              border: `0.01em solid ${LINE}`,
              borderRadius: '0.12em',
              padding: '0.16em',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.09em',
            }}
          >
            <span style={{ fontSize: '0.11em', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: MUTED }}>
              Condiciones del alquiler náutico
            </span>
            {[
              'El arrendatario declara estar en posesión de la titulación válida para la embarcación descrita y asume la responsabilidad por los daños causados durante el alquiler…',
              'La navegación queda limitada a la zona autorizada y a las horas de luz. La hora de regreso es vinculante; los retrasos se cobran según tarifa.',
            ].map((t) => (
              <span key={t} style={{ fontSize: '0.13em', lineHeight: 1.55, color: BODY, textWrap: 'pretty' }}>
                {t}
              </span>
            ))}
            <span style={{ fontSize: '0.13em', lineHeight: 1.55, color: MUTED }}>La fianza se devuelve tras la entrega.</span>
          </div>

          <div style={{ border: `0.01em solid ${LINE}`, borderRadius: '0.12em', padding: '0.14em 0.16em', display: 'flex', flexDirection: 'column', gap: '0.1em' }}>
            <span style={{ fontSize: '0.13em', fontWeight: 600, color: INK }}>Firma aquí</span>
            <div style={{ height: '1.1em', border: `0.01em dashed #d1d5db`, borderRadius: '0.1em', background: '#f7f9f9' }}>
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
          </div>

          <PhoneCta>Firmar y enviar</PhoneCta>
        </div>
      </PhoneFrame>

      <PhoneFrame>
        <div style={{ flex: 1, minHeight: 0, padding: '0.36em 0.22em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2em' }}>
          <div
            style={{
              width: '0.64em',
              height: '0.64em',
              borderRadius: '999px',
              background: OK_BG,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="check" size="0.32em" color={OK} />
          </div>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.05em' }}>
            <span style={{ fontSize: '0.22em', fontWeight: 700, letterSpacing: '-.01em', color: INK }}>Firmado</span>
            <span style={{ fontSize: '0.15em', color: BODY, textWrap: 'pretty' }}>Te llega una copia al correo</span>
          </div>

          <div style={{ width: '100%', border: `0.01em solid ${LINE}`, borderRadius: '0.12em', padding: '0.16em', display: 'flex', flexDirection: 'column', gap: '0.12em' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.1em' }}>
              <Icon name="shield-check" size="0.17em" color={OK} />
              <span style={{ fontSize: '0.14em', fontWeight: 600, color: INK }}>Firma electrónica eIDAS</span>
            </span>
            {[
              ['Sello de tiempo', '01/08/2026 11:58:04'],
              ['Contrato', '#C-2026-1184'],
            ].map(([k, v]) => (
              <span key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.13em', color: BODY }}>{k}</span>
                <span style={{ fontSize: '0.13em', color: INK }}>{v}</span>
              </span>
            ))}
            <span style={{ fontSize: '0.13em', color: BODY }}>Hash del documento</span>
            <span style={{ fontSize: '0.12em', color: MUTED, wordBreak: 'break-all', lineHeight: 1.5 }}>a7f3c9e21b04d8…5fe0c6b93a11</span>
          </div>

          <div style={{ width: '100%', border: `0.01em solid ${LINE}`, borderRadius: '0.12em', padding: '0.14em 0.16em', display: 'flex', alignItems: 'center', gap: '0.12em' }}>
            <Icon name="users" size="0.17em" color={ACCENT} />
            <span style={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <span style={{ fontSize: '0.14em', color: BODY, textWrap: 'pretty' }}>1 menor en esta reserva</span>
            </span>
            <span style={{ background: '#fef3c7', borderRadius: '999px', padding: '0.05em 0.1em', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '0.13em', fontWeight: 700, color: '#b45309' }}>Tutor</span>
            </span>
          </div>

          <span style={{ flex: 1 }} />
          <div style={{ width: '100%' }}>
            <PhoneCta tone="ghost">Descargar PDF</PhoneCta>
          </div>
        </div>
      </PhoneFrame>
    </>
  );
}
