'use client';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

/** Alto reservado para el iframe de HubSpot; evita el salto al montarlo. */
const CALENDAR_MIN_HEIGHT = 660;

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
 */
export function DemoCalendar() {
  const [armed, setArmed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (armed) return;
    const arm = () => setArmed(true);

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
    <div ref={ref} style={{ position: 'relative', minHeight: CALENDAR_MIN_HEIGHT }}>
      <div
        className="meetings-iframe-container"
        data-src="https://meetings-eu1.hubspot.com/lucas-tomic/demo-solnow?embed=true"
        style={{ minHeight: CALENDAR_MIN_HEIGHT }}
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
    </div>
  );
}
