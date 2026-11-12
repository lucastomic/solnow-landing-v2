import type { CSSProperties } from 'react';
import type { Locale } from '@/i18n/config';
import { getT } from '@/i18n/dictionaries';
import { SectionHead } from '../atoms';
import PricingSurface, { type MsgPlan } from './PricingSurface';
import { FaqAccordion } from './FAQ';

interface ChannelsCopy {
  eyebrow: string;
  title: string;
  head: { channel: string; fee: string; payer: string };
  rows: { c: string; v: string; p: string }[];
}

const TH: CSSProperties = {
  textAlign: 'left',
  padding: '12px 14px',
  borderBottom: '1px solid var(--line)',
  fontWeight: 600,
  color: 'var(--fg)',
};
const TD: CSSProperties = {
  padding: '12px 14px',
  borderBottom: '1px solid var(--line-soft)',
  color: 'var(--fg-2)',
  verticalAlign: 'top',
};

/**
 * La página de precios: cabecera, dos planes, tabla de canales y letra pequeña.
 *
 * La tabla de canales es el pricing: el porcentaje depende del canal y es el
 * mismo en los dos planes, así que va una vez, debajo de las tarjetas, y no
 * repetido dentro de cada una.
 */
export async function PricingPage({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const faq = t<{ q: string; a: string }[]>('pricing.billingFaq.items');
  const ch = t<ChannelsCopy>('pricing.channels');

  return (
    <main>
      <section className="section" style={{ paddingBlock: '110px 42px' }}>
        <div className="container">
          <SectionHead
            eyebrow={t('pricing.eyebrow')}
            title={<>{t('pricing.title')}</>}
            lede={t('pricing.lede')}
            compact
          />
          <PricingSurface
            copy={{
              plans: {
                despegue: t<MsgPlan>('pricing.plans.despegue'),
                escalar: t<MsgPlan>('pricing.plans.escalar'),
              },
              core: t('pricing.core'),
              noExtras: t('pricing.noExtras'),
              perMonth: t('pricing.perMonth'),
              perYear: t('pricing.perYear'),
              extraMonth: t('pricing.extraBase'),
              extraYear: t('pricing.extraBaseYear'),
              billingMonthly: t('pricing.billingMonthly'),
              billingAnnual: t('pricing.billingAnnual'),
            }}
            locale={locale}
          />
        </div>
      </section>

      <section id="canales" className="section" style={{ paddingBlock: 42 }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <SectionHead eyebrow={ch.eyebrow} title={<>{ch.title}</>} compact />
          <div className="reveal r-cmp-wrap">
            <table className="r-cmp-row" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14.5 }}>
              <thead>
                <tr>
                  <th style={TH}>{ch.head.channel}</th>
                  <th style={{ ...TH, width: 90 }}>{ch.head.fee}</th>
                  <th style={TH}>{ch.head.payer}</th>
                </tr>
              </thead>
              <tbody>
                {ch.rows.map((r) => (
                  <tr key={r.c}>
                    <td style={{ ...TD, color: 'var(--fg)' }}>{r.c}</td>
                    <td
                      className="mono"
                      style={{ ...TD, color: 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {r.v}
                    </td>
                    <td style={TD}>{r.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FaqAccordion
        items={faq}
        eyebrow={t('pricing.billingFaq.eyebrow')}
        title={t('pricing.billingFaq.title')}
        id="facturacion"
        paddingBlock={72}
      />
    </main>
  );
}
