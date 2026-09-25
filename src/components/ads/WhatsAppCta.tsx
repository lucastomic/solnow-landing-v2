'use client';
import { useRef } from 'react';
import { measureOpenAI } from '@/components/OpenAIPixel';

/**
 * El global del etiquetado, tipado en local. Mismo motivo que en
 * `MeetingTracker`: `@next/third-parties` ya augmenta `Window` con `dataLayer`.
 */
type TagGlobals = {
  dataLayer?: { push(entry: Record<string, unknown>): void };
};

/**
 * Número del agente demo, en el formato que pide `wa.me`: prefijo de país y
 * dígitos, sin `+` ni espacios. Es +34 744 62 20 93.
 *
 * Fuente única: lo usan el CTA del hero y el del cierre. Si algún día hay un
 * número por idioma, este es el sitio donde se bifurca.
 */
const WHATSAPP_NUMBER = '34744622093';

/**
 * Enlace al agente demo.
 *
 * El texto precargado va limpio, sin `utm_*` ni `gclid`: lo escribe el visitante
 * en su propio WhatsApp y cualquier cosa que le metamos ahí la lee él. La
 * atribución de campaña viaja por el evento de `dataLayer`, no por el mensaje.
 */
export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface WhatsAppCtaProps {
  /** Texto del botón. */
  label: string;
  /** Mensaje precargado en la conversación. */
  message: string;
  /** Dónde está el botón, para separar el del hero del del cierre. */
  placement: 'hero' | 'final';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * CTA principal de la landing de campaña: abrir el agente en WhatsApp.
 *
 * Es la conversión que de verdad importa aquí. Pedirle una videollamada de 30
 * minutos a un dueño de base que viene de un anuncio es un salto enorme;
 * escribirle al agente y ver que contesta en 9 segundos es la promesa vivida, y
 * deja el teléfono del visitante aunque no llegue a reservar.
 *
 * Emite `whatsapp_demo_click` en el `dataLayer` y `lead_created` en el pixel de
 * OpenAI. `meeting_booked` (`MeetingTracker`) se queda como estaba, para el
 * calendario: son dos conversiones distintas y quién optimiza cuál se decide en
 * GTM, no aquí.
 *
 * El guard de una sola ejecución evita contar dos veces el doble clic nervioso;
 * la navegación no se toca, así que el enlace sigue siendo un enlace normal
 * —abrible en pestaña nueva, copiable— y funciona aunque el `dataLayer` no
 * exista porque el CMP ha bloqueado GTM.
 */
export function WhatsAppCta({ label, message, placement, className, style }: WhatsAppCtaProps) {
  const fired = useRef(false);

  const onClick = () => {
    if (fired.current) return;
    fired.current = true;

    const w = window as unknown as TagGlobals;
    w.dataLayer?.push({ event: 'whatsapp_demo_click', form_location: `ads_demo_${placement}` });
    measureOpenAI('lead_created', { type: 'customer_action' });
  };

  return (
    <a
      className={className}
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      style={style}
    >
      {label}
      {/* Glifo de WhatsApp, inline: una petición menos y hereda `currentColor`. */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.04 0 1.2.87 2.36.99 2.53.12.16 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
      </svg>
    </a>
  );
}
