'use client';

import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { localizedSlug, guideByAnySlug } from '@/content/guides';
import { PRODUCT_BASE, productBySlug, productHubPath, productPath } from '@/content/products';

const LANG_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'es', label: '🇪🇸 Español' },
  { value: 'en', label: '🇬🇧 English' },
];

/**
 * Selector de idioma del footer.
 *
 * Es la única pieza del `Footer` que necesita JavaScript, así que vive aparte
 * para que las ~200 líneas de enlaces y textos que la rodean se rendericen en
 * servidor. Recibe `locale` y la etiqueta accesible por props porque el resto
 * del footer ya no tiene contexto de i18n en cliente.
 */
export function LocaleSelect({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: string) => {
    if (next === locale) return;
    const rest = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '');
    const parts = rest.split('/').filter(Boolean);
    // Producto: la carpeta y el slug cambian con el idioma, así que se traduce
    // aquí en vez de dejar que el 301 del proxy haga el salto.
    if (parts.length && parts[0] === PRODUCT_BASE[locale]) {
      const area = parts[1] ? productBySlug(parts[1], locale) : undefined;
      router.push(area ? productPath(area.key, next as Locale) : productHubPath(next as Locale));
      return;
    }
    // Translate the guide slug to the target locale so we don't 404 / bounce
    // through a 301 when switching languages on a guide page.
    const g = parts.length ? guideByAnySlug(parts[0]) : undefined;
    if (g) {
      const tail = parts.slice(1).join('/');
      router.push(`/${next}/${localizedSlug(g.key, next as Locale)}${tail ? `/${tail}` : ''}`);
      return;
    }
    router.push(`/${next}${rest}`);
  };

  return (
    <select
      className="mono"
      aria-label={label}
      style={{
        background: 'oklch(1 0 0 / 0.02)',
        border: '1px solid var(--line)',
        color: 'var(--fg-2)',
        padding: '7px 10px',
        borderRadius: 6,
        fontSize: 12,
        letterSpacing: '0.04em',
      }}
      value={locale}
      onChange={(e) => switchLocale(e.target.value)}
    >
      {LANG_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
