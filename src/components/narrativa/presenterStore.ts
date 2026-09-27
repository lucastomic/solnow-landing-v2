'use client';
import { useSyncExternalStore } from 'react';

/**
 * Estado del modo presentador: nivel de detalle y diapositivas ocultas.
 *
 * Vive fuera de React para que lo compartan el panel, el índice lateral y el
 * aplicador que esconde diapositivas, sin pasar props por toda la página.
 *
 * Se guarda en dos sitios: en `localStorage` (la preparación del vendedor
 * sobrevive a la recarga) y en el hash de la URL (`#l=1&h=id,id`), para que
 * el enlace que se comparte lleve la misma selección. El hash manda sobre lo
 * guardado cuando existe.
 */
export type Level = 0 | 1 | 2;

export interface PresenterState {
  level: Level;
  hidden: string[];
}

const KEY = 'narrativa-presenter';
const DEFAULT: PresenterState = { level: 2, hidden: [] };

let state: PresenterState = DEFAULT;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function parseHash(): PresenterState | null {
  if (typeof window === 'undefined') return null;
  const h = window.location.hash.replace(/^#/, '');
  if (!h.includes('l=') && !h.includes('h=')) return null;
  const q = new URLSearchParams(h);
  const level = Number(q.get('l') ?? 2);
  const hidden = (q.get('h') ?? '').split(',').filter(Boolean);
  return { level: (level === 0 || level === 1 ? level : 2) as Level, hidden };
}

function writeHash(s: PresenterState) {
  const q = new URLSearchParams();
  if (s.level !== 2) q.set('l', String(s.level));
  if (s.hidden.length) q.set('h', s.hidden.join(','));
  const hash = q.toString();
  // `replaceState` y no `location.hash =`: cambiar el hash haría scroll al ancla.
  window.history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);
}

/** Carga el estado inicial una vez en el cliente (hash > guardado > defecto). */
export function loadPresenter() {
  const fromHash = parseHash();
  if (fromHash) {
    state = fromHash;
  } else {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) state = { ...DEFAULT, ...(JSON.parse(raw) as Partial<PresenterState>) };
    } catch {
      state = DEFAULT;
    }
  }
  emit();
}

export function setPresenter(next: Partial<PresenterState>) {
  state = { ...state, ...next };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* sin almacenamiento, el hash sigue funcionando */
  }
  writeHash(state);
  emit();
}

export function toggleHidden(id: string, hide: boolean) {
  const set = new Set(state.hidden);
  if (hide) set.add(id);
  else set.delete(id);
  setPresenter({ hidden: Array.from(set) });
}

export function resetPresenter() {
  setPresenter(DEFAULT);
}

export function usePresenter(): PresenterState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => DEFAULT,
  );
}
