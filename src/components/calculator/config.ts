'use client';

import { useSyncExternalStore } from 'react';
import { DEFAULTS, toQuery } from '@/lib/calculator';

/** Última configuración del visitante. Versionada: si cambian los campos, la clave cambia. */
const STORAGE_KEY = 'solnow.calculator.v1';

/** Lo que el servidor puede saber: nada del visitante, así que los valores de partida. */
const SERVER_SNAPSHOT = toQuery(DEFAULTS);

/**
 * La configuración de arranque, leída una sola vez.
 *
 * Se cachea a propósito y para siempre: es *la inicial*, no «la actual». Sin
 * la caché, cada vez que la calculadora escribiese la URL el snapshot cambiaría
 * y React remontaría el árbol, tirando por la ventana el estado del visitante
 * justo mientras arrastra un deslizador.
 */
let initial: string | null = null;

function getClientSnapshot(): string {
  if (initial !== null) return initial;

  // La URL manda sobre lo guardado: quien abre un enlace compartido quiere ver
  // ese cálculo, no el suyo de la semana pasada.
  const fromUrl = window.location.search.slice(1);
  if (fromUrl.length > 0) return (initial = fromUrl);

  try {
    initial = window.localStorage.getItem(STORAGE_KEY) || SERVER_SNAPSHOT;
  } catch {
    // Safari en modo privado lanza al tocar localStorage. La calculadora
    // funciona igual sin memoria; caerse por no poder recordar, no.
    initial = SERVER_SNAPSHOT;
  }
  return initial;
}

/** No hay nada a lo que suscribirse: la configuración inicial ocurre una vez y no cambia. */
const subscribe = () => () => {};

/**
 * Configuración de arranque como query string.
 *
 * En servidor devuelve los valores por defecto y en cliente los del visitante,
 * que es exactamente para lo que existe `useSyncExternalStore`: un dato que
 * solo el navegador conoce, sin desajuste de hidratación y sin un `setState`
 * dentro de un efecto.
 */
export function useInitialQuery(): string {
  return useSyncExternalStore(subscribe, getClientSnapshot, () => SERVER_SNAPSHOT);
}

/**
 * Vuelca la configuración a la URL y al almacenamiento local.
 *
 * Va con retardo desde quien la llama, y no en cada render, porque arrastrar un
 * deslizador dispara decenas de cambios por segundo y Safari corta
 * `replaceState` a unas cien llamadas por cada treinta segundos: escribir en
 * cada fotograma no es solo derroche, acaba lanzando.
 */
export function persist(query: string): void {
  window.history.replaceState(null, '', `${window.location.pathname}?${query}`);
  try {
    window.localStorage.setItem(STORAGE_KEY, query);
  } catch {
    /* ver arriba */
  }
}
