'use client';
import { useId, useState } from 'react';
import ReactDOM from 'react-dom';
import { DemoCalendar } from '@/components/sections/DemoCalendar';
import { WhatsAppCta } from '@/components/ads/WhatsAppCta';
import { HUBSPOT_FIELDS, LP_WHATSAPP_NUMBER } from '@/content/lp';
import { submitLpLead, type LpLead } from '@/lib/hubspotLead';

export interface LpDemoLabels {
  title: string;
  sub: string;
  name: string;
  email: string;
  company: string;
  submit: string;
  note: string;
  edit: string;
  whatsappLabel: string;
  whatsappMessage: string;
  /** Aviso bajo el botón; `{link}` es el enlace a la política de privacidad. */
  privacy: string;
  privacyLink: string;
  privacyHref: string;
  /** Aviso VERIFICAR del texto legal (solo fuera de producción). */
  privacyVerify?: string;
}

/**
 * Bloque de demo de las landings `/lp`: tres campos y, después, el calendario.
 *
 * Al enviar los campos se crea el contacto en HubSpot (`submitLpLead`), aunque
 * el visitante no llegue a reservar; el email es obligatorio porque sin él
 * HubSpot no crea contacto.
 *
 * En dos pasos a propósito. Los campos son HTML ligero que va en el render del
 * hero, así que el LCP no depende de nada externo; el embed de HubSpot (~870 KiB
 * con su iframe) solo se arma cuando alguien ha dicho quién es, y entonces
 * llega con esos datos ya puestos (`prefill`) junto a los de campaña. Al enfocar
 * el primer campo se precalientan las conexiones para que el salto sea corto.
 *
 * La conversión no es el envío de estos campos: es la reunión confirmada, que
 * registra `MeetingTracker` (`meeting_booked`, una vez por página aunque haya
 * dos bloques).
 */
export function LpDemoBlock({
  labels,
  page,
  placement,
}: {
  labels: LpDemoLabels;
  /** Identificador de la landing, para `lp_page` y `form_location`. */
  page: string;
  placement: 'hero' | 'final';
}) {
  const id = useId();
  const [values, setValues] = useState<LpLead | null>(null);

  const warm = () => {
    ReactDOM.preconnect('https://static.hsappstatic.net');
    ReactDOM.preconnect('https://meetings-eu1.hubspot.com');
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lead: LpLead = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      company: String(data.get('company') ?? '').trim(),
    };
    submitLpLead(lead);
    setValues(lead);
  };

  return (
    <div className="card" style={{ padding: 'clamp(20px, 3vw, 28px)', background: 'var(--surface)', boxShadow: '0 18px 40px -24px rgba(8,57,84,0.35)' }}>
      <h2 className="h-3" style={{ margin: '0 0 6px', fontSize: 21 }}>{labels.title}</h2>
      <p style={{ margin: '0 0 18px', fontSize: 14.5, lineHeight: 1.5, color: 'var(--fg-2)' }}>{labels.sub}</p>

      {values ? (
        <>
          <DemoCalendar
            eager
            passThroughParams
            prefill={{
              [HUBSPOT_FIELDS.name]: values.name,
              [HUBSPOT_FIELDS.email]: values.email,
              [HUBSPOT_FIELDS.company]: values.company,
            }}
            trackConversion="ads_lp"
            trackPage={page}
            minHeight={640}
          />
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setValues(null)}
            style={{ marginTop: 10, fontSize: 13.5 }}
          >
            ← {labels.edit}
          </button>
        </>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field id={`${id}-name`} label={labels.name}>
            <input id={`${id}-name`} name="name" required autoComplete="name" onFocus={warm} style={INPUT} />
          </Field>
          <Field id={`${id}-email`} label={labels.email}>
            <input id={`${id}-email`} name="email" type="email" required autoComplete="email" inputMode="email" style={INPUT} />
          </Field>
          <Field id={`${id}-company`} label={labels.company}>
            <input id={`${id}-company`} name="company" required autoComplete="organization" style={INPUT} />
          </Field>
          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 4, fontSize: 15.5, padding: '14px 20px' }}>
            {labels.submit}
          </button>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'var(--muted)', textAlign: 'center' }}>{labels.note}</p>
          {labels.privacyVerify && (
            <span
              className="mono"
              style={{
                display: 'block',
                fontSize: 11,
                lineHeight: 1.5,
                color: '#8a4b00',
                background: 'rgba(217,138,26,0.14)',
                border: '1px dashed var(--warn)',
                borderRadius: 6,
                padding: '6px 10px',
              }}
            >
              VERIFICAR — {labels.privacyVerify}
            </span>
          )}
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--muted)', textAlign: 'center' }}>
            {labels.privacy.split('{link}')[0]}
            <a href={labels.privacyHref} target="_blank" rel="noopener" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
              {labels.privacyLink}
            </a>
            {labels.privacy.split('{link}')[1]}
          </p>
        </form>
      )}

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'center' }}>
        <WhatsAppCta
          className="btn btn-ghost"
          label={labels.whatsappLabel}
          message={labels.whatsappMessage}
          placement={placement}
          eventName="whatsapp_click"
          formLocation={`ads_lp_${page}_${placement}`}
          number={LP_WHATSAPP_NUMBER}
          style={{ fontSize: 13.5, gap: 8 }}
        />
      </div>
    </div>
  );
}

const INPUT: React.CSSProperties = {
  width: '100%',
  height: 46,
  padding: '0 14px',
  fontSize: 16, // 16 px o más: por debajo, iOS hace zoom al enfocar.
  fontFamily: 'inherit',
  color: 'var(--fg)',
  background: 'var(--bg)',
  border: '1px solid var(--line)',
  borderRadius: 10,
};

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
