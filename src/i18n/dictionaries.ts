import 'server-only';
import type { Locale } from './config';

const dictionaries = {
  es: () => import('@/messages/es.json').then((m) => m.default),
  en: () => import('@/messages/en.json').then((m) => m.default),
};

export type Messages = Awaited<ReturnType<(typeof dictionaries)['es']>>;

/** Diccionario completo. Solo servidor: lo usan las páginas y `getGuide`/`getProduct`. */
export const getDictionary = async (locale: Locale): Promise<Messages> =>
  dictionaries[locale]();

/** El `tag` es opcional y solo lo trae alguna área, así que se une a mano. */
type AreaCard = Messages['product']['areas']['tpv']['card'] & { tag?: string };

/**
 * Subconjunto del diccionario que se envía al cliente a través de `I18nProvider`.
 *
 * El proveedor serializa en el HTML de *todas* las páginas lo que reciba, así
 * que mandarlo entero significaba arrastrar las 18 guías y el cuerpo de las
 * ocho landings de producto a cada carga, incluida la home, que no muestra nada
 * de eso. Ningún componente cliente lee `guides`, y de `product.areas` solo
 * necesita `card` (la rejilla de tarjetas y la columna del footer); el resto se
 * renderiza en servidor.
 */
export type ClientMessages = Omit<Messages, 'guides' | 'product'> & {
  product: Omit<Messages['product'], 'areas'> & {
    areas: Record<string, { card: AreaCard }>;
  };
};

export const getClientDictionary = async (locale: Locale): Promise<ClientMessages> => {
  const { guides: _guides, product, ...rest } = await getDictionary(locale);
  void _guides;
  const areas = Object.fromEntries(
    Object.entries(product.areas).map(([key, area]) => [key, { card: area.card }]),
  );
  return { ...rest, product: { ...product, areas } };
};
