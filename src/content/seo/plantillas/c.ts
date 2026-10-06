/**
 * Plantilla C: documentos del operador (contrato de alquiler, checklist de
 * seguridad). Objetivo: descarga, que alimenta el público de retargeting; el
 * dato propio es el propio documento descargable.
 *
 * Dos variantes según el modificador de la consulta:
 *   - `contrato`: qué lleva el contrato + plantilla PDF.
 *   - `checklist`: comprobaciones antes, durante y después + checklist PDF.
 *
 * La plantilla solo pone la estructura; el contenido sale de `actividades.ts`.
 */

import type { GuideContent } from '@/content/guides';
import type { Actividad } from '@/content/seo/actividades';

const UPDATED = 'Updated · October 2026';

const unitSlug = (a: Actividad) => a.unit.replace(/ /g, '-');

export const contratoSlug = (a: Actividad) => `${unitSlug(a)}-rental-agreement-template`;
export const checklistSlug = (a: Actividad) => `${unitSlug(a)}-safety-checklist`;

/** Ficheros que genera `scripts/seo/generate-downloads.mjs` (mismos nombres). */
export const contratoDownloadHref = (a: Actividad) => `/assets/seo/${contratoSlug(a)}.pdf`;
export const checklistDownloadHref = (a: Actividad) => `/assets/seo/${checklistSlug(a)}.pdf`;

export function plantillaContrato(a: Actividad, extraRelated: { label: string; slug: string }[] = []): GuideContent {
  const c = a.contrato!;
  const href = contratoDownloadHref(a);
  return {
    meta: { title: c.title, description: c.description, ogTitle: c.h1 },
    hero: { eyebrow: 'RESOURCES · CONTRACTS', h1: c.h1, lede: c.lede, updated: UPDATED, readingTime: '6 min read' },
    download: {
      title: `${capitalize(a.unit)} rental agreement template (free PDF)`,
      desc: 'Renter and equipment details, period, deposit, paddling zone, declarations, acknowledgement of risk, minors and signatures, ready to adapt.',
      fileLabel: 'Download the template',
      href,
    },
    disclaimer:
      'This template and guide are for guidance only and do not constitute legal advice. Review the agreement with a legal advisor where you operate before using it with customers.',
    sections: [
      { h: `What a ${a.unit} rental agreement must include`, blocks: [{ type: 'list', items: c.includes }] },
      { h: 'The clauses most often forgotten', blocks: [{ type: 'list', items: c.forgotten }] },
      { h: 'The release clause and its limits', blocks: [{ type: 'p', text: c.release.text, verify: c.release.verify }] },
      { h: 'How to use the template, step by step', blocks: [{ type: 'steps', items: c.steps }] },
      {
        h: 'From paper to the customer’s phone',
        blocks: [
          {
            type: 'p',
            text: `The PDF gets you started. On a busy morning, a paper agreement per paddler is what builds the queue at the stand: with Solnow each customer signs on their phone when they book, or from a QR code at the stand, and the agreement is filed with the booking and the ${a.units} it covers.`,
          },
        ],
      },
    ],
    faq: c.faq,
    related: [...extraRelated, ...a.related],
    cta: {
      title: `Download the ${a.unit} rental agreement template`,
      desc: 'Free PDF, ready to adapt to your company and review with your advisor.',
      button: 'Download the template',
      href,
      download: true,
    },
  };
}

export function plantillaChecklist(a: Actividad, extraRelated: { label: string; slug: string }[] = []): GuideContent {
  const k = a.checklist!;
  const href = checklistDownloadHref(a);
  return {
    meta: { title: k.title, description: k.description, ogTitle: k.h1 },
    hero: { eyebrow: 'RESOURCES · SAFETY', h1: k.h1, lede: k.lede, updated: UPDATED, readingTime: '5 min read' },
    download: {
      title: `${capitalize(a.unit)} safety checklist (free PDF)`,
      desc: 'One printable sheet per ride: the craft, the renter, the briefing and the return, with space to sign each check.',
      fileLabel: 'Download the checklist',
      href,
    },
    sections: [
      { h: 'Before launch: the craft', blocks: [{ type: 'list', items: k.craft }] },
      { h: 'The renter', blocks: [{ type: 'list', items: k.renter, verify: k.renterVerify }] },
      { h: 'The briefing, in this order', blocks: [{ type: 'steps', items: k.briefing }] },
      { h: 'On return', blocks: [{ type: 'list', items: k.onReturn }] },
      { h: 'Our data: checks done before the pontoon', blocks: k.dato },
    ],
    faq: k.faq,
    related: [...extraRelated, ...a.related],
    cta: {
      title: `Download the ${a.unit} safety checklist`,
      desc: 'Free printable PDF for rental operators, one sheet per ride.',
      button: 'Download the checklist',
      href,
      download: true,
    },
  };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
