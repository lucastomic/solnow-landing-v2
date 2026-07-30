/**
 * Resolución de traducciones compartida entre servidor y cliente.
 *
 * No lleva directiva a propósito: lo consumen tanto `getT` (servidor, sobre el
 * diccionario completo) como `useT` (cliente, sobre el subconjunto que viaja en
 * el HTML). Estaba duplicado en `I18nProvider`, y dos implementaciones de la
 * misma resolución acaban divergiendo.
 */

export type Vars = Record<string, string | number>;

/** Traductor: resuelve una ruta con puntos contra un diccionario. */
export type Translate = <T = string>(path: string, vars?: Vars) => T;

function resolve(messages: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);
}

function interpolate(value: string, vars?: Vars): string {
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

/**
 * Construye un traductor sobre un diccionario ya cargado.
 *
 * - Las hojas string se devuelven con interpolación opcional de `{var}`.
 * - Las hojas array u objeto se devuelven tal cual (tipadas por el genérico)
 *   para listas como viñetas o entradas de FAQ.
 * - Una clave inexistente devuelve la propia ruta, dejando los huecos a la
 *   vista en vez de romper el render.
 */
export function createTranslator(messages: unknown): Translate {
  return <T = string,>(path: string, vars?: Vars): T => {
    const found = resolve(messages, path);
    if (found === undefined) return path as unknown as T;
    if (typeof found === 'string') return interpolate(found, vars) as unknown as T;
    return found as T;
  };
}
