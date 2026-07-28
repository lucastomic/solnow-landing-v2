import type { ProductKey } from '@/content/products';

/**
 * Áreas con una segunda pantalla que se enseña más abajo en su landing.
 *
 * Vive fuera de `mocks.tsx` porque ese módulo es de cliente y la landing, que
 * es servidor, necesita consultarlo para elegir el layout. `mocks.tsx` teclea
 * su mapa contra esta lista, así que ninguna de las dos puede desfasarse.
 */
export const AREAS_WITH_SECONDARY = ['tpv', 'operacion'] as const satisfies readonly ProductKey[];

export type SecondaryKey = (typeof AREAS_WITH_SECONDARY)[number];

export function hasSecondaryMock(areaKey: ProductKey): areaKey is SecondaryKey {
  return (AREAS_WITH_SECONDARY as readonly ProductKey[]).includes(areaKey);
}
