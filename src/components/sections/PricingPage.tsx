import type { Locale } from '@/i18n/config';
import { getT } from '@/i18n/dictionaries';
import { SectionHead } from '../atoms';
import PricingSurface, { type MsgPlan, type PlansCopy } from './PricingSurface';
import { type CalcCopy } from './PricingCalculator';
import { FaqAccordion } from './FAQ';

/**
 * La página de precios: tarjetas, calculadora y letra pequeña, en ese orden.
 *
 * Las tarjetas y la calculadora no se separan nunca. Sin los planes al lado, la
 * calculadora pierde el contexto de qué está calculando; juntas son el activo
 * —la página de precios que la competencia no publica— y por eso viven en una
 * URL propia: se comparte por WhatsApp entre socios, es el enlace del
 * seguimiento tras la demo, el destino de los anuncios con intención de precio
 * y lo que posiciona contra las páginas de «contacta con ventas».
 */
export async function PricingPage({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  const billing = t<{ q: string; a: string }[]>('pricing.billingFaq.items');

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
              rows: t<PlansCopy['rows']>('pricing.rows'),
              bothPlans: t('pricing.bothPlans'),
              perMonth: t('pricing.perMonth'),
              perSeason: t('pricing.perSeason'),
              extraMonth: t('pricing.extraBase'),
              extraSeason: t('pricing.extraBaseSeason'),
              billingMonthly: t('pricing.billingMonthly'),
              billingSeason: t('pricing.billingSeason'),
            }}
            calcCopy={t<CalcCopy>('pricing.calc')}
            locale={locale}
          />
        </div>
      </section>

      {/* La letra pequeña como argumento, no como nota al pie: quien llega aquí
          buscando precio quiere saber justo lo que las demás páginas esconden. */}
      <FaqAccordion
        items={billing}
        eyebrow={t('pricing.billingFaq.eyebrow')}
        title={t('pricing.billingFaq.title')}
        id="facturacion"
        paddingBlock={72}
      />
    </main>
  );
}
