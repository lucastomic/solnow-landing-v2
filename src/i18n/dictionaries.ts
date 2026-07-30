import 'server-only';
import type { Locale } from './config';
import { createTranslator, type Translate } from './resolve';

const dictionaries = {
  es: () => import('@/messages/es.json').then((m) => m.default),
  en: () => import('@/messages/en.json').then((m) => m.default),
};

export type Messages = Awaited<ReturnType<(typeof dictionaries)['es']>>;

/** Diccionario completo. Solo servidor: lo usan las páginas y `getGuide`/`getProduct`. */
export const getDictionary = async (locale: Locale): Promise<Messages> =>
  dictionaries[locale]();

/**
 * Traductor de servidor, contraparte de `useT`.
 *
 * Misma firma que el hook cliente a propósito: una sección pasa de cliente a
 * servidor cambiando `const t = useT()` por `const t = await getT(locale)`, sin
 * tocar una línea de su JSX. Y al resolver aquí, los textos se quedan en el
 * HTML en vez de viajar también serializados para la hidratación.
 */
export const getT = async (locale: Locale): Promise<Translate> =>
  createTranslator(await getDictionary(locale));

/**
 * Namespaces que necesitan los componentes cliente, y solo esos.
 *
 * `I18nProvider` serializa en el HTML de *todas* las páginas lo que reciba, así
 * que cada clave de más se paga en cada carga. Tras pasar las secciones
 * estáticas a servidor, los únicos que llaman a `useT` son:
 *
 *   - `Nav`  → `nav`
 *   - `FAQ`  → `faq`
 *
 * Todo lo demás (guías, producto, onboarding, footer, hero…) lo resuelve `getT`
 * en servidor y viaja ya renderizado dentro del HTML.
 *
 * Si un componente cliente estrena un namespace, hay que añadirlo aquí: `useT`
 * devuelve la ruta en crudo cuando falta una clave, así que el síntoma sería
 * ver `faq.items` escrito en pantalla, no un error.
 */
const CLIENT_NAMESPACES = ['nav', 'faq'] as const;

export type ClientMessages = Pick<Messages, (typeof CLIENT_NAMESPACES)[number]>;

export const getClientDictionary = async (locale: Locale): Promise<ClientMessages> => {
  const messages = await getDictionary(locale);
  return Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]),
  ) as ClientMessages;
};
