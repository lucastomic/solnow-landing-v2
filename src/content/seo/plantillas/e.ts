/**
 * Plantilla E: preguntas de negocio del operador (cómo empezar, plan de
 * negocio, rentabilidad, seguros). Objetivo: descarga, que alimenta el
 * público de retargeting; la demo no es la llamada a la acción aquí.
 *
 * Dos variantes sobre la misma matriz, según el modificador de la consulta:
 *   - `plan`: cómo montar el negocio + plan de negocio descargable.
 *   - `seguro`: qué seguro necesita + checklist para el corredor.
 *
 * La plantilla solo pone la estructura; el contenido sale de `actividades.ts`.
 */

import type { GuideContent } from '@/content/guides';
import type { Actividad } from '@/content/seo/actividades';

const UPDATED = 'Updated · October 2026';

const businessSlug = (a: Actividad) => a.business.replace(/ /g, '-');
/** «a jet ski rental» / «an inflatable water park». */
const withArticle = (a: Actividad) => `${a.article ?? 'a'} ${a.business}`;

/** Ficheros que genera `scripts/seo/generate-downloads.mjs` (mismos nombres). */
export const planDownloadHref = (a: Actividad) => `/assets/seo/${businessSlug(a)}-business-plan-template.pdf`;
export const insuranceDownloadHref = (a: Actividad) => `/assets/seo/${businessSlug(a)}-insurance-broker-checklist.pdf`;

export function plantillaPlan(a: Actividad): GuideContent {
  const p = a.plan;
  const href = planDownloadHref(a);
  return {
    meta: { title: p.title, description: p.description, ogTitle: p.h1 },
    hero: {
      eyebrow: 'RESOURCES · BUSINESS PLAN',
      h1: p.h1,
      lede: p.lede,
      verify: p.ledeVerify,
      updated: UPDATED,
      readingTime: '8 min read',
    },
    download: {
      title: `${capitalize(a.business)} business plan template (free PDF)`,
      desc: `Sections for the ${a.unit} fleet, the site, startup costs, prices, a capacity sheet and the season forecast, ready to fill in with your own numbers.`,
      fileLabel: 'Download the business plan',
      href,
    },
    sections: [
      {
        h: `Is ${withArticle(a)} business profitable?`,
        blocks: [
          { type: 'p', text: p.formula },
          { type: 'list', items: p.drivers },
          { type: 'pending', text: p.benchmark },
        ],
      },
      {
        h: 'Startup costs to budget',
        blocks: [
          { type: 'p', text: 'These are the lines your plan needs. The template has a row for each one; fill in your own quotes rather than an average from the internet.' },
          { type: 'list', items: p.startupCosts },
        ],
      },
      {
        h: `How to start ${withArticle(a)} business, step by step`,
        blocks: [{ type: 'steps', items: p.steps }],
      },
      // Secciones propias para las consultas «business plan» e «insurance»
      // que no tienen página aparte (solo si la actividad las trae).
      ...(p.planSections
        ? [
            {
              h: `What goes in ${withArticle(a)} business plan`,
              blocks: [
                { type: 'p' as const, text: `The template has one section for each of these, written for ${a.units}; fill them in with your own quotes.` },
                { type: 'list' as const, items: p.planSections },
              ],
            },
          ]
        : []),
      ...(p.insuranceSection
        ? [
            {
              h: `Insurance for ${withArticle(a)} business`,
              blocks: [
                { type: 'p' as const, text: p.insuranceSection.intro, verify: p.insuranceSection.coversVerify },
                { type: 'list' as const, items: p.insuranceSection.covers, verify: p.insuranceSection.coversVerify },
                { type: 'p' as const, text: 'What the insurer will ask about your operation:' },
                { type: 'list' as const, items: p.insuranceSection.insurerAsks },
              ],
            },
          ]
        : []),
      {
        h: 'Permits, licences and insurance',
        blocks: [{ type: 'callout', tone: 'warn', verify: p.permits.verify, text: p.permits.text }],
      },
      p.dato,
      {
        h: 'Run it from day one without paper',
        blocks: [
          {
            type: 'p',
            text: `The plan assumes a desk that can keep up in peak weeks. With Solnow, customers book and pay online or on WhatsApp, sign the rental agreement on their phone before they arrive, and walk-ups check in from a QR code, so the ${a.units} spend their time on the water instead of waiting for paperwork.`,
          },
        ],
      },
    ],
    faq: p.faq,
    related: a.insurance
      ? [{ label: `${capitalize(a.business)} insurance for operators`, slug: insuranceSlug(a) }, ...a.related]
      : a.related,
    cta: {
      title: `Download the ${a.business} business plan template`,
      desc: 'Free PDF, built for this activity. Fill it in with your own fleet, prices and season.',
      button: 'Download the business plan',
      href,
      download: true,
    },
  };
}

export function plantillaSeguro(a: Actividad): GuideContent {
  const s = a.insurance!;
  const href = insuranceDownloadHref(a);
  return {
    meta: { title: s.title, description: s.description, ogTitle: s.h1 },
    hero: {
      eyebrow: 'RESOURCES · INSURANCE',
      h1: s.h1,
      lede: s.lede,
      verify: s.ledeVerify,
      updated: UPDATED,
      readingTime: '6 min read',
    },
    download: {
      title: `${capitalize(a.business)} insurance: questions for your broker (free PDF)`,
      desc: 'The covers to ask about, the questions an insurer will ask you, and a sheet to compare quotes side by side.',
      fileLabel: 'Download the broker checklist',
      href,
    },
    disclaimer:
      'This guide and checklist are for information only and are not insurance or legal advice. Cover, limits and requirements depend on where you operate and on each insurer; confirm them with a licensed broker.',
    sections: [
      {
        h: 'The covers to ask about',
        blocks: [{ type: 'list', verify: s.coversVerify, items: s.covers }],
      },
      {
        h: 'What insurers will ask about your operation',
        blocks: [
          { type: 'p', text: 'Expect questions about how you run the activity day to day. Having the answers, and the records behind them, ready before the meeting makes the quote faster and more accurate.' },
          { type: 'list', items: s.insurerAsks },
        ],
      },
      {
        h: 'Records you can show',
        blocks: s.dato,
      },
      {
        h: 'How to compare quotes',
        blocks: [{ type: 'steps', verify: 'Quote-comparison criteria for watersports insurance. Confirm with a broker.', items: s.compare }],
      },
    ],
    faq: s.faq,
    related: [{ label: `How to start a ${a.business} business`, slug: planSlug(a) }, ...a.related],
    cta: {
      title: 'Download the broker checklist',
      desc: `Free PDF for ${a.business} operators: covers, questions and a quote comparison sheet.`,
      button: 'Download the checklist',
      href,
      download: true,
    },
  };
}

export const planSlug = (a: Actividad) => `how-to-start-${a.article ?? 'a'}-${businessSlug(a)}-business`;
export const insuranceSlug = (a: Actividad) => `${businessSlug(a)}-insurance`;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
