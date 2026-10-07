'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { LpProductMock } from '@/content/lp';

/**
 * El mockup del producto, cargado cuando se acerca a la pantalla y encajado
 * en una caja de alto fijo.
 *
 * En las landings de campaña va bajo el pliegue y es el JS propio más pesado
 * de la página (pantallas animadas). Hidratarlo al cargar competía con el hero
 * por el hilo principal en móvil; aquí su chunk ni se descarga hasta que el
 * visitante baja.
 *
 * Todas las pantallas miden lo mismo de alto, aunque no tengan la misma forma:
 * las de escritorio y móviles (`AppFrame`/`PhoneStage`, 1194 × 834) crecen con
 * el ancho, así que se les limita el ancho para no pasar del alto de la caja;
 * la de WhatsApp tiene alto fijo (622 px), así que se reduce con `zoom` hasta
 * ese mismo alto.
 */
const AreaMock = dynamic(() => import('@/components/product/mocks').then((m) => m.AreaMock), { ssr: false });

/** Proporción del lienzo de `AppFrame` y `PhoneStage`. */
const CANVAS_RATIO = 1194 / 834;
/** Alto total de `WhatsAppMock` (600 de pantalla + 10 de marco arriba y abajo + 1 de borde). */
const WHATSAPP_HEIGHT = 622;

export function LazyAreaMock({ areaKey }: { areaKey: LpProductMock }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    const resize = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    resize.observe(el);
    return () => {
      observer.disconnect();
      resize.disconnect();
    };
  }, []);

  const fit =
    areaKey === 'whatsapp'
      ? { zoom: height ? height / WHATSAPP_HEIGHT : 1, width: 380 }
      : { width: height ? `min(100%, ${Math.floor(height * CANVAS_RATIO)}px)` : '100%' };

  return (
    <div
      ref={ref}
      // Mismo alto para todas: crece con la pantalla, entre 380 y 460 px.
      style={{ height: 'clamp(380px, 36vw, 460px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {show && height > 0 && (
        <div style={fit}>
          <AreaMock areaKey={areaKey} />
        </div>
      )}
    </div>
  );
}
