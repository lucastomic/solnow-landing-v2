import { getT } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { SectionHead } from '../atoms';
import { PLANS } from '@/lib/pricingCalc';
import { pricingPath } from '@/content/pricingRoute';

const numLocale: Record<string, string> = { es: 'es-ES', en: 'en-US' };

/** Formateador de euros compartido. `es-ES` no agrupa los cuatro dígitos por
 *  defecto, y €1590 junto a €15.900 se lee como un error de la página. */
function euroFmt(locale: Locale) {
  const f = new Intl.NumberFormat(numLocale[locale] ?? 'es-ES', {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  return (n: number) => '€' + f.format(n);
}

/**
 * Teaser de pricing para la home.
 *
 * La home cuenta una historia y pide la demo; cuatro deslizadores y una factura
 * desglosada le cortan el clímax al lector y lo mandan a una hoja de cálculo.
 * Aquí solo va la promesa —la escalera en tres líneas y el precio de entrada— y
 * el enlace a la página donde eso se puede calcular.
 *
 * Las cifras salen de `@/lib/pricingCalc`, las mismas que leen las tarjetas y
 * la calculadora: tres superficies diciendo lo mismo, o el día que cambie una
 * tarifa habría tres sitios donde se queda vieja.
 */
export async function PricingTeaser({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const eur = euroFmt(locale);
  const rows = t<{ l: string }[]>('pricing.teaser.rows');
  const pct = (n: number) => Math.round(n * 100) + '%';
  const values = [
    '0%',
    pct(PLANS.escalar.channelPct),
    '+' + pct(PLANS.escalar.vendorPct),
  ];

  return (
    <section id="pricing" className="section" style={{ paddingBlock: 42 }}>
      <div className="container">
        <SectionHead
          eyebrow={t('pricing.eyebrow')}
          title={<>{t('pricing.title')}</>}
          lede={t('pricing.teaser.lede')}
          compact
        />

        <div
          className="reveal r-split"
          style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'center' }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 560 }}>
            {rows.map((r, i) => (
              <li
                key={r.l}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 14,
                  alignItems: 'baseline',
                  padding: '10px 0',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--line-soft)' : 0,
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: 'var(--accent)',
                    minWidth: 46,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {values[i]}
                </span>
                <span style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.45 }}>{r.l}</span>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 500,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: 'var(--accent)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {t('pricing.teaser.from', { price: eur(PLANS.despegue.monthly.first) })}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
                {t('pricing.teaser.fromNote')}
              </div>
            </div>
            <a
              href={pricingPath(locale)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                background: 'var(--accent)',
                color: 'var(--accent-fg)',
              }}
            >
              {t('pricing.teaser.cta')}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
