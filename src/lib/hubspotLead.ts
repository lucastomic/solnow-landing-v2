/**
 * Envío del paso 1 de las landings `/lp` a un formulario de HubSpot.
 *
 * Quien rellena los campos y no llega a reservar también es un lead: sin esto
 * sus datos solo viajaban al calendario y, si lo cerraba, no quedaba nada en el
 * CRM. Se envía a la API pública de formularios (sin clave privada: el portal y
 * el formulario no son secretos, van igual en cualquier formulario incrustado),
 * con la cookie `hubspotutk` para que el contacto quede unido a sus visitas.
 *
 * No bloquea nada: el visitante pasa al calendario en el mismo instante, y un
 * fallo de red o un ID sin configurar se queda en silencio (y en consola en
 * desarrollo). La reserva posterior se une al mismo contacto por el email.
 */

import { LP_LEAD_FORM } from '@/content/lp';

export interface LpLead {
  name: string;
  email: string;
  company: string;
}

/** Parámetros de campaña que viajan como propiedades del contacto (mismos nombres que en HubSpot). */
const CAMPAIGN_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'] as const;

function cookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(name + '='))
    ?.split('=')[1];
}

export function submitLpLead(lead: LpLead): void {
  const { portalId, formId, endpoint } = LP_LEAD_FORM;
  if (!portalId || !formId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[lp] Formulario de HubSpot sin configurar (LP_LEAD_FORM en src/content/lp.ts): el lead no se envía.');
    }
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const fields = [
    { name: 'firstname', value: lead.name },
    { name: 'email', value: lead.email },
    { name: 'company', value: lead.company },
    ...CAMPAIGN_FIELDS.map((name) => ({ name, value: params.get(name) ?? '' })),
  ]
    .filter((f) => f.value)
    .map((f) => ({ objectTypeId: '0-1', ...f }));

  const hutk = cookie('hubspotutk');
  const body = {
    fields,
    context: {
      ...(hutk ? { hutk } : {}),
      pageUri: window.location.href,
      pageName: document.title,
    },
  };

  // `keepalive`: si el visitante cierra la pestaña justo después, el envío
  // sigue en curso. Sin `await`: el calendario no espera a HubSpot.
  fetch(`${endpoint}/submissions/v3/integration/submit/${portalId}/${formId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    /* sin red o bloqueado: el calendario sigue funcionando */
  });
}
