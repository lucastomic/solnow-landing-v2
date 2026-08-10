'use client';
import { useEffect, useRef } from 'react';

/**
 * El global del etiquetado, tipado en local.
 *
 * Sin `declare global`: `@next/third-parties` ya augmenta `Window` con
 * `dataLayer`, y una segunda declaración con otro tipo no compila.
 */
type TagGlobals = {
  dataLayer?: { push(entry: Record<string, unknown>): void };
};

/**
 * Conversión de la landing de anuncios: reunión reservada.
 *
 * El embed de HubSpot Meetings es un iframe cross-origin, así que la única
 * señal de que alguien ha cerrado hueco es el `postMessage` que emite al
 * confirmar (`meetingBookSucceeded`). Sin esto, la campaña solo puede optimizar
 * contra visitas a la página, que es justo la métrica que no importa.
 *
 * No pinta nada: es un listener con un guard de una sola ejecución (HubSpot
 * puede repetir el mensaje si el usuario recarga el paso de confirmación).
 *
 * El `dataLayer.push` va con optional chaining a propósito: si el CMP (Sirdata)
 * ha bloqueado GTM, `dataLayer` sencillamente no existe y esto debe quedarse
 * callado, no romper la página.
 *
 * El `Schedule` de Meta lo emite SOLO la CAPI (Lambda), disparado por el paso
 * del deal a "Demo agendada". No lo mandamos también desde el pixel: sin un
 * `event_id` compartido, Meta contaría la misma demo dos veces (el scheduler de
 * HubSpot no permite inyectar ese id). La CAPI es la fuente única: a prueba de
 * ad blockers y del CMP, y cubre también el alta manual por WhatsApp.
 */
export function MeetingTracker() {
  const fired = useRef(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (fired.current) return;

      let host: string;
      try {
        host = new URL(event.origin).hostname;
      } catch {
        return;
      }
      if (host !== 'hubspot.com' && !host.endsWith('.hubspot.com')) return;

      const data = event.data as { meetingBookSucceeded?: boolean } | null;
      if (data?.meetingBookSucceeded !== true) return;

      fired.current = true;
      const w = window as unknown as TagGlobals;
      w.dataLayer?.push({ event: 'meeting_booked', form_location: 'ads_demo' });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return null;
}
