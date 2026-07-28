import { ACCENT, ACCENT_SOFT, BODY, cardStyle, Icon, INK, Kicker, LINE, LINE_SOFT, MUTED, OK_BG, OK_FG, ScreenHead } from './appMock';

/**
 * Mockup de recuperación (diseño «Recuperacion»): reservas que se cayeron y
 * el seguimiento automático que las cierra.
 *
 * Medidas en `em` sobre la base de `AppFrame`; ver la cabecera de `appMock.tsx`.
 */

type LeadState = 'chasing' | 'booked' | 'replied' | 'closed';

const BADGES: Record<LeadState, { label: string; bg: string; fg: string }> = {
  chasing: { label: 'Persiguiendo', bg: ACCENT_SOFT, fg: ACCENT },
  booked: { label: 'Reservó', bg: OK_BG, fg: OK_FG },
  replied: { label: 'Respondió', bg: '#fffbeb', fg: '#b45309' },
  closed: { label: 'Cerrado', bg: LINE_SOFT, fg: MUTED },
};

const LEADS: { who: string; why: string; icon: 'credit-card' | 'message-square'; state: LeadState; on?: boolean }[] = [
  { who: 'Marta Ruiz', why: 'Se cayó en el pago · moto 60 min · 100 €', icon: 'credit-card', state: 'chasing', on: true },
  { who: 'Tom Baker', why: 'Preguntó el jueves y no contestó · Lagoon 400', icon: 'message-square', state: 'booked' },
  { who: 'Lena Hoffmann', why: 'Se cayó en el pago · charter al atardecer · 350 €', icon: 'credit-card', state: 'replied' },
  { who: 'Yusuf Demir', why: 'Preguntó disponibilidad · lleva 6 días en silencio', icon: 'message-square', state: 'chasing' },
  { who: 'Chiara Neri', why: 'Se cayó en el pago · charter de medio día · 500 €', icon: 'credit-card', state: 'booked' },
  { who: 'Nils Bergström', why: 'Pidió para un grupo de 6 · 2 días en silencio', icon: 'message-square', state: 'closed' },
];

export function RecoveryScreen() {
  return (
    <div style={{ flex: 1, minHeight: 0, padding: '0.28em 0.32em', display: 'flex', flexDirection: 'column', gap: '0.2em' }}>
      <ScreenHead title="Reservas que nunca ocurrieron" sub="Detectadas solas · perseguidas sin que muevas un dedo">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.12em',
            height: '0.44em',
            padding: '0 0.18em',
            background: '#fff',
            border: `0.01em solid ${LINE}`,
            borderRadius: '0.1em',
          }}
        >
          <span style={{ fontSize: '0.15em', color: INK }}>Modo persigue</span>
          <span
            style={{
              width: '0.44em',
              height: '0.26em',
              borderRadius: '999px',
              background: ACCENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 0.03em',
            }}
          >
            <span style={{ width: '0.2em', height: '0.2em', borderRadius: '999px', background: '#fff' }} />
          </span>
          <span style={{ fontSize: '0.14em', fontWeight: 700, color: ACCENT }}>On</span>
        </div>
      </ScreenHead>

      <div style={{ display: 'flex', gap: '0.2em' }}>
        <Kpi label="Detectadas este mes" value="38 oportunidades" />
        <Kpi label="Recuperadas" value="11 reservas · 4.180 €" tone={OK_FG} />
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '0.2em' }}>
        <div style={{ ...cardStyle, flex: 1.15, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 'none', display: 'flex', gap: '0.08em', padding: '0.16em 0.2em', borderBottom: `0.01em solid ${LINE}` }}>
            {[
              ['Las 38', true],
              ['Pago caído', false],
              ['Sin respuesta', false],
            ].map(([label, on]) => (
              <span
                key={String(label)}
                style={{
                  height: '0.32em',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 0.12em',
                  borderRadius: '0.08em',
                  background: on ? ACCENT : LINE_SOFT,
                }}
              >
                <span style={{ fontSize: '0.13em', fontWeight: on ? 600 : 500, color: on ? '#fff' : BODY }}>{label}</span>
              </span>
            ))}
          </div>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {LEADS.map((l, i) => {
              const b = BADGES[l.state];
              return (
                <div
                  key={l.who}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.14em',
                    padding: '0.15em 0.2em',
                    borderBottom: i < LEADS.length - 1 ? `0.01em solid ${LINE_SOFT}` : 0,
                    background: l.on ? ACCENT_SOFT : undefined,
                    borderLeft: l.on ? `0.03em solid ${ACCENT}` : undefined,
                  }}
                >
                  <span
                    style={{
                      width: '0.36em',
                      height: '0.36em',
                      flex: 'none',
                      borderRadius: '999px',
                      background: l.on ? '#fff' : LINE_SOFT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={l.icon} size="0.17em" color={l.on ? ACCENT : BODY} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.02em' }}>
                    <span style={{ fontSize: '0.15em', fontWeight: 600, color: INK }}>{l.who}</span>
                    <span style={{ fontSize: '0.13em', color: BODY }}>{l.why}</span>
                  </span>
                  <span style={{ background: b.bg, borderRadius: '999px', padding: '0.05em 0.1em', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.12em', fontWeight: 700, color: b.fg }}>{b.label}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <RecoveryChat />
      </div>
    </div>
  );
}

/**
 * La conversación, sola. Es lo que enseña la portada de la tarjeta del área en
 * la rejilla: el mensaje automático se entiende de un vistazo, el panel entero
 * no.
 */
export function RecoveryChatScreen() {
  return (
    <div style={{ flex: 1, minHeight: 0, padding: '0.28em 0.32em', display: 'flex' }}>
      {/* Un `fontSize` intermedio reescala en bloque todo lo que cuelga: las
          medidas de dentro son `em` y se miden contra este, no contra la base
          del marco. */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', fontSize: '1.55em' }}>
        <RecoveryChat />
      </div>
    </div>
  );
}

function RecoveryChat() {
  return (
    <div style={{ ...cardStyle, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: '0.12em', padding: '0.16em 0.2em', borderBottom: `0.01em solid ${LINE}` }}>
        <span
          style={{
            width: '0.36em',
            height: '0.36em',
            borderRadius: '999px',
            background: ACCENT_SOFT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="bot" size="0.18em" color={ACCENT} />
        </span>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.02em' }}>
          <span style={{ fontSize: '0.15em', fontWeight: 600, color: INK }}>Marta Ruiz</span>
          <span style={{ fontSize: '0.13em', color: BODY }}>WhatsApp · lo lleva Solnow</span>
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '0.2em', display: 'flex', flexDirection: 'column', gap: '0.14em' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1em' }}>
          <span style={{ flex: 1, height: '0.01em', background: LINE_SOFT }} />
          <span style={{ fontSize: '0.13em', color: MUTED }}>Pago caído · vie 14:22</span>
          <span style={{ flex: 1, height: '0.01em', background: LINE_SOFT }} />
        </div>

        <Bubble side="in" text="¡Hola Marta! Tu moto del sábado a las 12:00 sigue reservada. ¿Te la guardo?" meta="Enviado solo · 2 h después" />
        <Bubble side="out" text="Sí por favor, me falló la tarjeta" meta="Marta · vie 17:05" />
        <Bubble side="in" text="Sin problema: aquí tienes un enlace de pago nuevo, válido 24 h. Te mantengo la franja." meta="Enviado solo · vie 17:05" />

        <span style={{ flex: 1 }} />

        <div style={{ border: `0.01em solid ${LINE}`, borderRadius: '0.12em', padding: '0.14em 0.16em', display: 'flex', alignItems: 'center', gap: '0.12em' }}>
          <Icon name="clock" size="0.17em" color={ACCENT} />
          <span style={{ flex: 1, minWidth: 0, display: 'flex' }}>
            <span style={{ fontSize: '0.14em', color: BODY }}>Siguiente aviso en 22 h si no paga</span>
          </span>
          <span style={{ fontSize: '0.14em', fontWeight: 600, color: ACCENT }}>Tomar el control</span>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone = INK }: { label: string; value: string; tone?: string }) {
  return (
    <div style={{ ...cardStyle, flex: 1, padding: '0.2em 0.24em', display: 'flex', flexDirection: 'column', gap: '0.06em' }}>
      <Kicker>{label}</Kicker>
      <span style={{ fontSize: '0.3em', fontWeight: 700, color: tone }}>{value}</span>
    </div>
  );
}

function Bubble({ side, text, meta }: { side: 'in' | 'out'; text: string; meta: string }) {
  const inbound = side === 'in';
  return (
    <div
      style={{
        alignSelf: inbound ? 'flex-start' : 'flex-end',
        maxWidth: '88%',
        background: inbound ? ACCENT_SOFT : LINE_SOFT,
        borderRadius: inbound ? '0.12em 0.12em 0.12em 0.04em' : '0.12em 0.12em 0.04em 0.12em',
        padding: '0.12em 0.14em',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.06em',
      }}
    >
      <span style={{ fontSize: '0.14em', color: INK, textWrap: 'pretty' }}>{text}</span>
      <span style={{ fontSize: '0.11em', color: MUTED }}>{meta}</span>
    </div>
  );
}
