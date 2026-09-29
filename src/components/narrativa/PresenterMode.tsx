'use client';
import { useEffect, useState } from 'react';
import { loadPresenter, resetPresenter, setPresenter, toggleHidden, usePresenter, type Level } from '@/components/narrativa/presenterStore';
import type { NarrativaUI } from '@/content/narrativa';

export interface ManifestSlide {
  id: string;
  label: string;
  level: Level;
}
export interface ManifestChapter {
  id: string;
  label: string;
  appendix?: boolean;
  slides: ManifestSlide[];
}

const LEVEL_VALUES: Level[] = [0, 1, 2];
const LOCALES = ['es', 'en'] as const;

/**
 * Modo presentador: ⌥⇧P abre un panel donde el vendedor elige el nivel de
 * detalle (Kazanjy: «zoom in, zoom out») y esconde capítulos o diapositivas
 * para esa presentación. Lo que decide queda en el navegador y en la URL.
 *
 * Aplicar la selección es poner `hidden` en los `<article data-slide-id>` y
 * en las secciones que se quedan sin diapositivas: el HTML viene del servidor
 * y no hace falta volver a pintarlo. El índice lateral lee el mismo estado.
 */
export function PresenterMode({
  manifest,
  ui,
  locale,
}: {
  manifest: ManifestChapter[];
  ui: NarrativaUI['presenter'];
  locale: 'es' | 'en';
}) {
  const [open, setOpen] = useState(false);
  const st = usePresenter();

  // Cambiar de idioma es ir a la misma página en el otro locale, con el mismo
  // hash: los ids de diapositiva coinciden, así que la selección se conserva.
  const switchTo = (l: (typeof LOCALES)[number]) => {
    if (l === locale) return;
    window.location.assign(`/${l}/narrativa${window.location.hash}`);
  };

  useEffect(() => {
    loadPresenter();
    // Tres puertas: ⌥⇧P, ⌘⇧P (o Ctrl⇧P) y pulsar P dos veces seguidas. Las
    // extensiones del navegador se quedan a veces con la primera; la doble
    // pulsación no la intercepta nadie. También abre `#presentador` en la URL.
    // Diferido a un tick: abrir desde el hash no es sincronizar estado.
    if (window.location.hash.includes('presentador')) {
      const id = window.setTimeout(() => setOpen(true), 0);
      window.addEventListener('beforeunload', () => window.clearTimeout(id), { once: true });
    }
    let lastP = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.code !== 'KeyP') return;
      if ((e.altKey && e.shiftKey) || ((e.metaKey || e.ctrlKey) && e.shiftKey)) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!e.altKey && !e.metaKey && !e.ctrlKey) {
        const now = Date.now();
        if (now - lastP < 450) {
          setOpen((o) => !o);
          lastP = 0;
        } else {
          lastP = now;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    // Sin teclado (móvil): tres toques seguidos en el logo fijo.
    let taps: number[] = [];
    const onTap = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest('.tour-brand')) return;
      const now = Date.now();
      taps = [...taps.filter((x) => now - x < 700), now];
      if (taps.length >= 3) {
        taps = [];
        setOpen((o) => !o);
      }
    };
    document.addEventListener('pointerup', onTap);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerup', onTap);
    };
  }, []);

  // Aplica la selección al DOM.
  useEffect(() => {
    const hidden = new Set(st.hidden);
    for (const ch of manifest) {
      const chapterHidden = hidden.has(ch.id);
      let visible = 0;
      for (const sl of ch.slides) {
        // Una diapositiva puede tener varios elementos (el relato sobre el
        // grafo y sus páginas de impresión comparten id): se ocultan todos.
        const els = document.querySelectorAll<HTMLElement>(`[data-slide-id="${sl.id}"]`);
        if (!els.length) continue;
        const hide = chapterHidden || hidden.has(sl.id) || sl.level > st.level;
        els.forEach((el) => {
          el.hidden = hide;
        });
        if (!hide) visible++;
      }
      const sec = document.getElementById(ch.id);
      if (sec) sec.hidden = visible === 0;
    }
  }, [st, manifest]);

  if (!open) return null;

  const hidden = new Set(st.hidden);
  const copyLink = () => {
    void navigator.clipboard?.writeText(window.location.href);
  };
  // El PDF es la propia página impresa (hoja de estilos `@media print`):
  // una página por diapositiva visible. Se cierra el panel para que no salga.
  const printPdf = () => {
    setOpen(false);
    window.setTimeout(() => window.print(), 80);
  };

  return (
    <aside className="tour-presenter" role="dialog" aria-label="Modo presentador">
      <div className="tour-presenter-head">
        <span className="eyebrow">{ui.title}</span>
        <button type="button" className="tour-zoom-close" onClick={() => setOpen(false)} aria-label="×" style={{ position: 'static' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <p className="tour-presenter-hint">{ui.hint}</p>

      <div className="tour-presenter-lang" role="group" aria-label={ui.language}>
        <span className="eyebrow no-dot">{ui.language}</span>
        <div className="calc-toggle" style={{ width: 150 }}>
          {LOCALES.map((l) => (
            <button key={l} type="button" aria-pressed={l === locale} onClick={() => switchTo(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="tour-presenter-levels" role="radiogroup">
        {LEVEL_VALUES.map((v) => (
          <button key={v} type="button" role="radio" aria-checked={st.level === v} onClick={() => setPresenter({ level: v })}>
            <strong>{v} · {ui.levels[v].label}</strong>
            <span>{ui.levels[v].hint}</span>
          </button>
        ))}
      </div>

      <div className="tour-presenter-list">
        {manifest.map((ch) => {
          const chOff = hidden.has(ch.id);
          return (
            <div key={ch.id} className="tour-presenter-chapter" data-off={chOff || undefined}>
              <label className="tour-presenter-row" data-chapter>
                <input type="checkbox" checked={!chOff} onChange={(e) => toggleHidden(ch.id, !e.currentTarget.checked)} />
                <span>{ch.appendix ? ui.appendixPrefix : ''}{ch.label}</span>
              </label>
              {ch.slides.map((sl) => {
                const byLevel = sl.level > st.level;
                const off = hidden.has(sl.id);
                return (
                  <label key={sl.id} className="tour-presenter-row" data-dim={(chOff || byLevel) || undefined} title={byLevel ? ui.byLevel : undefined}>
                    <input type="checkbox" checked={!off} disabled={chOff} onChange={(e) => toggleHidden(sl.id, !e.currentTarget.checked)} />
                    <span>{sl.label}</span>
                    <span className="mono tour-presenter-lvl">N{sl.level}</span>
                  </label>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="tour-presenter-foot">
        <button type="button" className="btn btn-secondary" onClick={resetPresenter} style={{ fontSize: 13, padding: '9px 14px' }}>
          {ui.showAll}
        </button>
        <button type="button" className="btn btn-primary" onClick={copyLink} style={{ fontSize: 13, padding: '9px 14px' }}>
          {ui.copyLink}
        </button>
        <button type="button" className="btn btn-secondary" onClick={printPdf} title={ui.pdfHint} style={{ fontSize: 13, padding: '9px 14px' }}>
          {ui.pdf}
        </button>
        <p className="tour-presenter-hint" style={{ flexBasis: '100%' }}>{ui.pdfHint}</p>
      </div>
    </aside>
  );
}
