'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleTagManager } from '@next/third-parties/google';
import { MetaPixelScript } from '@/components/MetaPixel';
import { OpenAIPixelScript } from '@/components/OpenAIPixel';
import { isAdsPath } from '@/content/adsLanding';

const GTM_ID = 'GTM-W7TQ38LJ';

/**
 * Margen tras el evento `load` antes de cargar por nuestra cuenta si nadie ha
 * tocado la página.
 */
const IDLE_TIMEOUT_MS = 3000;

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

/**
 * Etiquetado (GTM, Meta Pixel, pixel de OpenAI y, en cascada desde GTM, GA4 y
 * HubSpot) cargado fuera del arranque.
 *
 * GA4 (`G-C48R6MLF4L`) no se monta aquí a propósito: lo dispara GTM con la
 * etiqueta de Google en `Initialization - All Pages`. Cargarlo además desde el
 * código duplicaba los `page_view` y, peor, se saltaba el CMP (Sirdata), que
 * solo controla lo que pasa por GTM.
 *
 * Entre todos suman ~570 KiB y buena parte del trabajo de hilo principal,
 * y ninguno pinta nada. Montarlos con `afterInteractive` los metía en la ruta
 * crítica de una landing que se sirve prerenderizada desde CDN. Se cargan con
 * lo que ocurra primero: una interacción real, o el primer hueco de
 * inactividad una vez la página ya ha terminado de cargar.
 *
 * Contrapartida asumida: no se miden las sesiones que rebotan en menos de ~3 s
 * sin tocar la página. Es aceptable en tráfico orgánico, pero no en el de pago:
 * ahí esas sesiones se pagan una a una, y perderlas falsea el CPA de la
 * campaña. Por eso las landings de anuncios (`isAdsPath`) cargan el etiquetado
 * de entrada. El consentimiento no cambia: el CMP (Sirdata) sigue decidiendo
 * qué dispara GTM de verdad.
 *
 * La única llamada propia a estas globales es la conversión de reunión
 * reservada (`MeetingTracker`). En la landing de anuncios los tags están
 * cargados de entrada; en la home, reservar exige interactuar con el
 * calendario, así que para entonces el etiquetado también ha arrancado.
 */
export function DeferredAnalytics() {
  const eager = isAdsPath(usePathname());
  const [load, setLoad] = useState(eager);

  useEffect(() => {
    if (eager) return;

    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const start = () => setLoad(true);

    // Una interacción real gana siempre y de inmediato: si alguien toca la
    // página, hay que medirlo aunque todavía esté cargando.
    for (const event of INTERACTION_EVENTS) {
      window.addEventListener(event, start, { once: true, passive: true });
    }

    // El contador de inactividad no arranca hasta que la página ha terminado
    // de cargar. Arrancarlo al hidratar era contraproducente: con el hilo
    // principal saturado —justo el caso de un móvil— nunca llega un hueco de
    // idle, así que vencía el `timeout` y los ~570 KiB entraban de golpe
    // mientras la página aún pintaba.
    const scheduleIdle = () => {
      // Safari todavía no trae `requestIdleCallback`; ahí el timeout es el
      // único disparador pasivo.
      if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(start, { timeout: IDLE_TIMEOUT_MS });
      } else {
        timeoutHandle = setTimeout(start, IDLE_TIMEOUT_MS);
      }
    };

    if (document.readyState === 'complete') {
      scheduleIdle();
    } else {
      window.addEventListener('load', scheduleIdle, { once: true });
    }

    return () => {
      for (const event of INTERACTION_EVENTS) {
        window.removeEventListener(event, start);
      }
      window.removeEventListener('load', scheduleIdle);
      if (idleHandle !== undefined) window.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
    };
  }, [eager]);

  if (!load) return null;

  return (
    <>
      <GoogleTagManager gtmId={GTM_ID} />
      <MetaPixelScript />
      <OpenAIPixelScript />
    </>
  );
}
