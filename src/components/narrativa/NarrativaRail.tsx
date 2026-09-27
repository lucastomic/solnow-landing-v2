'use client';
import { useEffect, useState } from 'react';
import { usePresenter } from '@/components/narrativa/presenterStore';

interface RailChapter {
  id: string;
  label: string;
}

/**
 * Índice lateral del tour y mandos del vendedor.
 *
 * Son botones y no anclas a propósito: el tour no puede tener ningún `<a>`, y
 * `scrollIntoView` hace el mismo trabajo sin tocar la URL. El capítulo activo
 * lo decide un observer sobre `section.tour-chapter`; el que más pantalla
 * ocupa gana, para que en el paso de un capítulo al otro no parpadee.
 *
 * Las flechas y PageUp/PageDown saltan de diapositiva en diapositiva, no de
 * capítulo: es lo que espera quien presenta con un deck. Home/End van al
 * principio y al final.
 *
 * En móvil el índice se esconde (CSS) y solo queda la barra de progreso de
 * arriba, pintada desde el mismo estado.
 */
export function NarrativaRail({
  chapters,
  appendixId,
  labels,
}: {
  chapters: RailChapter[];
  appendixId?: string;
  labels: { chapters: string; appendix: string };
}) {
  const [active, setActive] = useState(chapters[0]?.id ?? '');
  const [inAppendix, setInAppendix] = useState(false);
  // Un capítulo escondido por el presentador desaparece también del índice.
  const presenter = usePresenter();
  const shown = chapters.filter((c) => !presenter.hidden.includes(c.id));

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section.tour-chapter'));
    if (!sections.length) return;
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.intersectionRatio);
        let best = '';
        let bestRatio = 0;
        for (const [id, r] of ratios) {
          if (r > bestRatio) {
            best = id;
            bestRatio = r;
          }
        }
        if (!best) return;
        // Las secciones de apéndice no se numeran: el índice no marca ninguna
        // y se enciende el botón «Apéndice».
        const el = document.getElementById(best);
        const appendix = !!el?.dataset.appendix;
        setInAppendix(appendix);
        if (!appendix) setActive(best);
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';

    const onKey = (ev: KeyboardEvent) => {
      const t = ev.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      // Con una ficha abierta encima del grafo, el teclado es de la ficha.
      if (document.querySelector('.tour-zoom')) return;

      // Paradas: cada diapositiva y cada paso del relato sobre el grafo,
      // saltando las que el presentador ha escondido (sin caja en pantalla).
      const slides = Array.from(document.querySelectorAll<HTMLElement>('.tour-stop')).filter((el) => el.offsetParent !== null);
      if (!slides.length) return;
      // La diapositiva actual es la última cuyo inicio ya ha pasado por el
      // tercio superior de la pantalla.
      const line = window.innerHeight / 3;
      let current = 0;
      slides.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= line) current = i;
      });

      let target: number | null = null;
      switch (ev.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          target = Math.min(slides.length - 1, current + 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          target = Math.max(0, current - 1);
          break;
        case 'Home':
          target = 0;
          break;
        case 'End':
          target = slides.length - 1;
          break;
      }
      if (target === null) return;
      ev.preventDefault();
      slides[target].scrollIntoView({ behavior, block: 'start' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const index = Math.max(0, shown.findIndex((c) => c.id === active));
  const progress = (index + 1) / Math.max(1, shown.length);

  const go = (id: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="tour-progress" aria-hidden style={{ ['--tour-progress' as string]: progress }} />
      <nav className="tour-rail" aria-label={labels.chapters}>
        <ol>
          {shown.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => go(c.id)}
                aria-current={!inAppendix && c.id === active ? 'step' : undefined}
                aria-label={`${i + 1}. ${c.label}`}
              >
                <span className="tour-rail-dot" />
                <span className="tour-rail-label">
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span> {c.label}
                </span>
              </button>
            </li>
          ))}
        </ol>
        {appendixId && (
          <button
            type="button"
            className="tour-rail-appendix"
            onClick={() => go(appendixId)}
            aria-current={inAppendix ? 'step' : undefined}
            aria-label={labels.appendix}
          >
            <span className="tour-rail-label">{labels.appendix}</span>
            <span className="tour-rail-dot tour-rail-plus" aria-hidden>
              +
            </span>
          </button>
        )}
      </nav>
    </>
  );
}
