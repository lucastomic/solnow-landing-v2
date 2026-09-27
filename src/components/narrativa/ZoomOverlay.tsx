'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { ProductKey } from '@/content/products';
import { AreaMock, AreaMockSecondary } from '@/components/product/mocks';
import { hasSecondaryMock } from '@/components/product/secondaryMocks';
import { rich } from '@/components/narrativa/rich';

/** Lo que el overlay cuenta de un área: la ficha de producto, sin secciones. */
export interface ZoomArea {
  eyebrow: string;
  title: string;
  lede: string;
  bullets: string[];
  /** Foto real del sistema en uso; va antes que el mock cuando existe. */
  photo?: { src: string; alt: string; w: number; h: number };
}

/**
 * «Zoom in» sobre un nodo del grafo: la ficha del área en una capa encima
 * del tour. Se cierra con Esc, con el botón o pinchando fuera, y al cerrarse
 * la página no se ha movido: el grafo sigue en el mismo paso.
 *
 * Es el apéndice del deck: el detalle existe, pero solo sale si el prospecto
 * pregunta. Por eso no navega a ninguna parte (el tour no tiene enlaces).
 *
 * Mientras está abierto, el rail ignora el teclado (busca \`.tour-zoom\`) y el
 * body no hace scroll.
 */
export function ZoomOverlay({
  areaKey,
  area,
  labels,
  onClose,
}: {
  areaKey: ProductKey;
  area: ZoomArea;
  labels: { close: string; hint: string };
  onClose: () => void;
}) {
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="tour-zoom" onClick={onClose}>
      <div
        className="tour-zoom-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-zoom-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeBtn} type="button" className="tour-zoom-close" onClick={onClose} aria-label={labels.close}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <div className="tour-zoom-grid">
          <div className="tour-zoom-text">
            <span className="eyebrow">{area.eyebrow}</span>
            <h3 id="tour-zoom-title" className="h-2" style={{ margin: '14px 0 12px', fontSize: 'clamp(22px, 2.4vw, 30px)' }}>
              {area.title}
            </h3>
            <p style={{ margin: '0 0 18px', color: 'var(--fg-2)', fontSize: 15.5, lineHeight: 1.6 }}>{rich(area.lede)}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {area.bullets.map((b, i) => (
                <li
                  key={i}
                  className="tour-rich"
                  style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, fontSize: 15, lineHeight: 1.55, color: 'var(--fg-2)' }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      border: '1px solid var(--accent-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      fontSize: 11,
                      transform: 'translateY(2px)',
                    }}
                  >
                    ↳
                  </span>
                  <span>{rich(b)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tour-zoom-media">
            {area.photo && (
              <Image
                src={area.photo.src}
                alt={area.photo.alt}
                width={area.photo.w}
                height={area.photo.h}
                sizes="(max-width: 900px) 100vw, 55vw"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16, border: '1px solid var(--line-soft)' }}
              />
            )}
            <div className="tour-shot" style={{ borderRadius: 16, border: '1px solid var(--line-soft)' }}>
              <AreaMock areaKey={areaKey} />
            </div>
            {hasSecondaryMock(areaKey) && (
              <div className="tour-shot" style={{ borderRadius: 16, border: '1px solid var(--line-soft)' }}>
                <AreaMockSecondary areaKey={areaKey} />
              </div>
            )}
          </div>
        </div>
        <p className="mono tour-zoom-hint">{labels.hint}</p>
      </div>
    </div>
  );
}
