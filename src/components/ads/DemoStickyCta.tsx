'use client';
import { useEffect, useState } from 'react';

/** El global del etiquetado, tipado en local. Mismo motivo que en `WhatsAppCta`. */
type TagGlobals = {
  dataLayer?: { push(entry: Record<string, unknown>): void };
};

/**
 * Secciones que apagan la barra: mientras alguna esté a la vista, el flotante
 * sobra. `#agendar` es el calendario —taparlo con un botón que lleva al
 * calendario es absurdo— y `#cierre` es el CTA final, que ya ofrece lo mismo a
 * tamaño completo.
 */
const SILENCERS = ['#agendar', '#cierre'];

interface DemoStickyCtaProps {
  label: string;
  note: string;
}

/**
 * Barra fija con el CTA de reservar demo.
 *
 * Aparece cuando el hero sale de pantalla, no antes: mientras el hero está a la
 * vista su propio enlace al calendario ya hace este trabajo, y una barra encima
 * solo tapa contenido.
 *
 * El enlace es un ancla normal a `#agendar`. Eso importa: `DemoCalendar`
 * escucha en captura los clics sobre `a[href="#agendar"]` y arma el embed de
 * HubSpot en ese momento, así que pulsar aquí no solo baja la página, también
 * dispara la carga del calendario antes de que el scroll termine.
 *
 * No se puede cerrar, a propósito: es una landing de campaña con una sola
 * acción. A cambio ocupa una franja baja y se aparta sola en las dos secciones
 * donde estorbaría.
 */
export function DemoStickyCta({ label, note }: DemoStickyCtaProps) {
  const [past, setPast] = useState(false);
  const [silenced, setSilenced] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting),
      // El hero se da por superado cuando queda menos de su 15% a la vista, no
      // al primer píxel: si no, la barra parpadea con cualquier scroll corto.
      { threshold: 0.15 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targets = SILENCERS.map((id) => document.querySelector(id)).filter(
      (el): el is Element => el !== null
    );
    if (!targets.length) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setSilenced(visible.size > 0);
      },
      { rootMargin: '-10% 0px -10% 0px' }
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const shown = past && !silenced;

  const onClick = () => {
    const w = window as unknown as TagGlobals;
    w.dataLayer?.push({ event: 'demo_cta_click', form_location: 'ads_demo_sticky' });
  };

  return (
    <div
      className="demo-sticky"
      data-shown={shown ? 'true' : 'false'}
      // Fuera del árbol de foco mientras está oculta: si no, tabular desde el
      // hero saltaba a un botón invisible al fondo de la pantalla.
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="demo-sticky-inner">
        <p className="demo-sticky-note">{note}</p>
        <a className="btn btn-primary" href="#agendar" onClick={onClick}>
          {label}
          <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
