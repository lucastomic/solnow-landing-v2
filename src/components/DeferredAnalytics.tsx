'use client';

import { useEffect, useState } from 'react';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import { MetaPixelScript } from '@/components/MetaPixel';

const GTM_ID = 'GTM-W7TQ38LJ';
const GA_ID = 'G-C48R6MLF4L';

/**
 * Margen tras el evento `load` antes de cargar por nuestra cuenta si nadie ha
 * tocado la página.
 */
const IDLE_TIMEOUT_MS = 3000;

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

/**
 * Etiquetado (GTM, GA4, Meta Pixel y, en cascada desde GTM, HubSpot) cargado
 * fuera del arranque.
 *
 * Entre los cuatro suman ~570 KiB y buena parte del trabajo de hilo principal,
 * y ninguno pinta nada. Montarlos con `afterInteractive` los metía en la ruta
 * crítica de una landing que se sirve prerenderizada desde CDN. Se cargan con
 * lo que ocurra primero: una interacción real, o el primer hueco de
 * inactividad una vez la página ya ha terminado de cargar.
 *
 * Contrapartida asumida: no se miden las sesiones que rebotan en menos de ~3 s
 * sin tocar la página. No hay eventos propios que dependan de `fbq`/`gtag`
 * antes de tiempo — no existe ninguna llamada a esas globales en el código.
 */
export function DeferredAnalytics() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
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
  }, []);

  if (!load) return null;

  return (
    <>
      <GoogleTagManager gtmId={GTM_ID} />
      <GoogleAnalytics gaId={GA_ID} />
      <MetaPixelScript />
    </>
  );
}
