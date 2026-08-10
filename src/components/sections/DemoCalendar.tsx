'use client';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { MeetingTracker } from '@/components/ads/MeetingTracker';

/** Alto reservado para el iframe de HubSpot; evita el salto al montarlo. */
const CALENDAR_MIN_HEIGHT = 660;

const EMBED_SRC = 'https://meetings-eu1.hubspot.com/lucas-tomic/demo-solnow?embed=true';

/**
 * Parámetros de campaña que se reenvían al embed.
 *
 * HubSpot los adjunta al contacto y a la reunión, así que la atribución
 * (qué anuncio pagó esta demo) llega al CRM sin tocar nada más. Lista cerrada
 * a propósito: cualquier query string acaba en la URL del iframe, y no hay
 * motivo para reenviar lo que no sea de campaña.
 */
const CAMPAIGN_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
] as const;

function withCampaignParams(src: string): string {
  const incoming = new URLSearchParams(window.location.search);
  const url = new URL(src);
  for (const key of CAMPAIGN_PARAMS) {
    const value = incoming.get(key);
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

interface DemoCalendarProps {
  /**
   * Arma el calendario al montar, sin esperar al observer.
   *
   * Solo para la landing de anuncios: ahí el calendario *es* la página y el
   * tráfico llega con intención de reservar, así que el coste del embed está
   * justificado desde el primer momento. En la home sigue siendo diferido.
   */
  eager?: boolean;
  /** Reenvía los parámetros de campaña de la URL al embed (ver `CAMPAIGN_PARAMS`). */
  passThroughParams?: boolean;
  /** Monta el listener que registra la reunión reservada como conversión. */
  trackConversion?: boolean;
  /** Alto reservado, por si el hueco de la página no es el de la home. */
  minHeight?: number;
}

/**
 * Calendario de HubSpot, cargado bajo demanda.
 *
 * `MeetingsEmbedCode.js` arrastra ~870 KiB (script, iframe cross-origin y tres
 * WOFF2 de LexendDeca) — más que todo el JS propio del sitio junto. Vive al
 * fondo de la home, así que cargarlo en cada visita era regalar el hilo
 * principal. Se arma con lo que ocurra primero:
 *
 *  - el bloque entra en el viewport ampliado 400px, o
 *  - alguien pulsa un CTA que ancla aquí (`#cta` / `#agendar`), porque el salto
 *    es instantáneo y no da tiempo a que el observer reaccione.
 *
 * Con `eager` se salta esa espera (ver la prop). El `Script` sigue en
 * `afterInteractive` en ambos casos: el HTML y el LCP no dependen de él.
 */
export function DemoCalendar({
  eager = false,
  passThroughParams = false,
  trackConversion = false,
  minHeight = CALENDAR_MIN_HEIGHT,
}: DemoCalendarProps = {}) {
  // `eager` no pasa por estado: hacerlo obligaría a un `setState` síncrono en el
  // efecto y a un render extra para algo que ya se sabe al montar.
  const [observed, setObserved] = useState(false);
  const armed = eager || observed;
  const ref = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);

  // Los parámetros de campaña se escriben directamente en el DOM, no vía estado:
  // el `data-src` renderizado en servidor no puede conocerlos y cualquier
  // diferencia rompería la hidratación. `MeetingsEmbedCode.js` lo lee al cargar
  // —una petición de red más tarde—, así que llega siempre después de esto.
  useEffect(() => {
    if (!passThroughParams || !embedRef.current) return;
    embedRef.current.dataset.src = withCampaignParams(EMBED_SRC);
  }, [passThroughParams]);

  useEffect(() => {
    if (armed) return;
    const arm = () => setObserved(true);

    // En captura: así se arma aunque el handler del ancla detenga la
    // propagación o el navegador procese el salto antes del burbujeo.
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a[href="#cta"], a[href="#agendar"]')) {
        arm();
      }
    };
    document.addEventListener('click', onClick, true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) arm();
      },
      { rootMargin: '400px' }
    );
    if (ref.current) observer.observe(ref.current);

    return () => {
      document.removeEventListener('click', onClick, true);
      observer.disconnect();
    };
  }, [armed]);

  return (
    <div ref={ref} style={{ position: 'relative', minHeight }}>
      <div
        ref={embedRef}
        className="meetings-iframe-container"
        data-src={EMBED_SRC}
        style={{ minHeight }}
      />
      {!armed && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--line-soft)',
            background: 'var(--surface)',
          }}
        />
      )}
      {armed && (
        <Script
          id="hubspot-meetings-embed"
          src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
          strategy="afterInteractive"
        />
      )}
      {trackConversion && <MeetingTracker />}
    </div>
  );
}
