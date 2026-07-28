import 'server-only';
import { getDictionary, type Messages } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type {
  ProductAreaContent,
  ProductContent,
  ProductKey,
} from '@/content/products';

/**
 * Comprobación en compilación de que el diccionario trae copy completo para
 * todas las áreas declaradas en `PRODUCTS`.
 *
 * Sin esto, añadir un área y olvidar su copy en `messages/*.json` pasaba el
 * build y reventaba al renderizar. La única parte que no se puede comprobar así
 * es el discriminante `type` de los bloques: TypeScript infiere `string` al
 * importar JSON, no la unión de literales, de ahí `LooseBlock`.
 */
type LooseBlock = { type: string; text?: string; items?: string[] };
type LooseArea = Omit<ProductAreaContent, 'sections'> & {
  sections: { h: string; blocks: LooseBlock[] }[];
};

// Falla el build si falta un área o si a alguna le falta un campo obligatorio.
type AreasInDictionary = Messages['product']['areas'];
const _areasAreComplete: Record<ProductKey, LooseArea> = {} as AreasInDictionary;
void _areasAreComplete;

/** Loads the whole `product` branch of a dictionary. */
export async function getProductContent(locale: Locale): Promise<ProductContent> {
  const d = await getDictionary(locale);
  return d.product as unknown as ProductContent;
}

/** Loads a single area's content plus the shared hub labels/CTA. */
export async function getProductArea(
  locale: Locale,
  key: ProductKey,
): Promise<{ area: ProductAreaContent; shared: ProductContent }> {
  const shared = await getProductContent(locale);
  return { area: shared.areas[key], shared };
}
