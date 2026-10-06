// Genera los descargables de las páginas programáticas (matriz E).
// Uso: node --experimental-strip-types scripts/seo/generate-downloads.mjs [actividad …]
//   Sin argumentos genera todos; con ids (`parasailing paddle-surf`) solo esos,
//   para no reescribir PDFs ya publicados.
//
// Lee las listas por actividad (costes, coberturas, preguntas del seguro) de
// src/content/seo/actividades.ts, la misma fuente que pinta la página, para que
// el PDF y la página no digan cosas distintas. Escribe en public/assets/seo/ con
// los nombres que esperan `planDownloadHref` e `insuranceDownloadHref`.
//
// Los checklists de seguros llevan la banda de borrador hasta que una persona
// los revise: hablan de coberturas, y eso depende del país y de la aseguradora.

import PDFDocument from 'pdfkit';
import { createWriteStream, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACTIVIDADES } from '../../src/content/seo/actividades.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, 'public/assets/seo');
mkdirSync(OUT, { recursive: true });

const ACCENT = '#106695';
const INK = '#083954';
const MUTED = '#5a7a91';
const LINE = '#c9d4de';
const DRAFT = '#b4232a';

const slug = (a) => a.business.replace(/ /g, '-');
/** Helvetica (WinAnsi) no tiene «≈»: en el PDF va «~». */
const pdfText = (s) => s.replace(/≈/g, '~');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---- Contenido por actividad que no está en la página (solo en la hoja) ---- */

const FLEET = {
  'jet-ski': [['Jet skis in service', ''], ['Spares for breakdowns', ''], ['Riders per craft (driver + passengers)', ''], ['Slot lengths sold (15 / 30 / 60 min)', ''], ['Rentable hours per day', ''], ['Turnaround between rides (min)', '']],
  kayak: [['Single kayaks', ''], ['Double kayaks', ''], ['Paddle boards', ''], ['Spare paddles and leashes', ''], ['Life jackets by size (S / M / L / child)', ''], ['Rentable hours per day', '']],
  charter: [['Boat 1: model, capacity, skippered / bareboat', ''], ['Boat 2: model, capacity, skippered / bareboat', ''], ['Boat 3: model, capacity, skippered / bareboat', ''], ['Skippers available per day', ''], ['Turnaround between charters (hours)', '']],
  parasailing: [['Parasail boats and winch type', ''], ['Canopies by wind range', ''], ['Harnesses: single / tandem / triple', ''], ['Deck seats for observers', ''], ['Full rotation time (launch to next launch, min)', ''], ['Flying hours per day', '']],
  'paddle-surf': [['Inflatable boards by size', ''], ['Hard boards by size', ''], ['Adjustable paddles and spare fins', ''], ['Leashes and life jackets by size', ''], ['Places per lesson / class', ''], ['Rentable hours per day', '']],
  hinchables: [['Modules in the course layout', ''], ['Capacity per session (manufacturer)', ''], ['Lifeguards on the water per session', ''], ['Session length and changeover (min)', ''], ['Sessions per day', ''], ['Life jackets by size', '']],
};
const CAPACITY = {
  'jet-ski': 'Rides per day ~ jet skis × (rentable hours × 60) ÷ (slot length + turnaround)',
  kayak: 'Rentals per day ~ units × rentable hours ÷ average rental length; add guided tour seats separately',
  charter: 'Charter days per season ~ boats × operating days × share of days booked (half days count as 0.5)',
  parasailing: 'Flyers per day ~ boats × flying hours × (60 ÷ rotation minutes) × average flyers per flight',
  'paddle-surf': 'Board-hours per day ~ boards × rentable hours × utilization; add lesson and class places separately',
  hinchables: 'Participants per day ~ sessions per day × capacity per session × fill rate',
};
const PRICES = {
  'jet-ski': ['15 minutes', '30 minutes', '60 minutes', 'Guided ride', 'Passenger supplement', 'Deposit', 'Late return (per 15 min)'],
  kayak: ['Single kayak · 1 h', 'Double kayak · 1 h', 'Paddle board · 1 h', 'Half day', 'Guided tour (per person)', 'Extras: dry bag, phone case, photos'],
  charter: ['Half day', 'Full day', 'Week', 'Skipper (per day)', 'Fuel (policy)', 'Extras: paddle board, catering', 'Security deposit'],
  parasailing: ['Single flight', 'Tandem flight (per person)', 'Triple flight (per person)', 'Observer seat', 'Photo / video package', 'Hotel or agent commission'],
  'paddle-surf': ['Board · 1 h', 'Board · half day', 'Beginner lesson', 'Guided tour', 'SUP yoga or class', 'Wetsuit or extras'],
  hinchables: ['Session · adult', 'Session · child', 'Group (per person)', 'Birthday party package', 'Season pass', 'Locker or extras'],
};
const FIXED = {
  'jet-ski': ['Moorings / dock space', 'Insurance', 'Financing or lease of the fleet', 'Maintenance and winter storage', 'Booking and payment software', 'Year-round staff'],
  kayak: ['Concession / permit', 'Insurance', 'Storage and transport', 'Fleet replacement (boards and paddles wear out)', 'Booking and waiver software', 'Year-round staff'],
  charter: ['Berths', 'Insurance', 'Financing or owner payments', 'Maintenance and haul-out', 'Broker and OTA commissions (% of sales)', 'Booking and contract software', 'Year-round crew'],
  parasailing: ['Berth or dock', 'Parasail insurance', 'Boat financing', 'Towline, webbing and canopy replacement', 'Engine and winch maintenance', 'Captain retainer outside the season'],
  'paddle-surf': ['Concession / permit', 'Insurance', 'Storage and van or trailer', 'Board and paddle replacement', 'Instructor certification renewals', 'Booking and waiver software'],
  hinchables: ['Water concession', 'Insurance', 'Installation and removal', 'Winter storage', 'Module repairs and replacement', 'Lifeguard rota for the season'],
};
/** Modelo de negocio (sección 1) y licencias a confirmar (sección 9), por actividad. */
const MODEL = {
  charter: 'Skippered / bareboat / both',
  parasailing: 'Flights from the dock / from the beach · single, tandem, triple',
  'paddle-surf': 'Rentals / lessons / tours / classes · fixed stand or mobile',
  hinchables: 'Open sessions / groups / parties / season passes',
};
const ACTIVITY_PERMIT = {
  charter: 'Commercial registration of the boats',
  parasailing: 'Passenger vessel inspection and parasail operating rules',
  hinchables: 'Safety standard for the floating course and inspection',
};
const PEOPLE_RULES = {
  charter: 'Skipper and bareboat licence rules',
  parasailing: 'Captain licence and crew requirements',
  'paddle-surf': 'Instructor certification for lessons',
  hinchables: 'Lifeguard qualifications and ratio per session',
};

/* ---- Render ---- */

function render(file, { sub, title, intro, draft, sections, footer }) {
  const doc = new PDFDocument({ size: 'A4', margin: 56 });
  doc.pipe(createWriteStream(resolve(OUT, file)));
  const W = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const X = doc.page.margins.left;
  const room = (h) => {
    if (doc.y + h > doc.page.height - doc.page.margins.bottom) doc.addPage();
  };

  doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(15).text('Solnow');
  doc.fillColor(MUTED).font('Helvetica').fontSize(9).text(sub);
  doc.moveDown(0.8);
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(17).text(title);
  doc.moveTo(X, doc.y + 6).lineTo(X + W, doc.y + 6).strokeColor(ACCENT).lineWidth(1.5).stroke();
  doc.moveDown(1.2);

  if (draft) {
    const y0 = doc.y;
    doc.fillColor(DRAFT).font('Helvetica-Bold').fontSize(9).text(draft, X + 8, y0 + 6, { width: W - 16 });
    const h = doc.y - y0 + 6;
    doc.rect(X, y0, W, h).strokeColor(DRAFT).lineWidth(1).dash(3, { space: 2 }).stroke().undash();
    doc.x = X;
    doc.y = y0 + h;
    doc.moveDown(0.8);
  }

  doc.fillColor('#1f4d6b').font('Helvetica').fontSize(9.5).text(intro, { lineGap: 1.5 });

  for (const s of sections) {
    room(80);
    doc.moveDown(0.9);
    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(10).text(s.head.toUpperCase(), X, doc.y, { characterSpacing: 0.5 });
    doc.moveDown(0.4);
    if (s.note) {
      doc.fillColor(MUTED).font('Helvetica-Oblique').fontSize(8.5).text(s.note, { lineGap: 1 });
      doc.moveDown(0.4);
    }
    if (s.fields) {
      for (const [label, hint] of s.fields) {
        room(40);
        doc.fillColor(INK).font('Helvetica-Bold').fontSize(9.5).text(label, X);
        if (hint) doc.fillColor(MUTED).font('Helvetica-Oblique').fontSize(8.5).text(hint);
        doc.fillColor(LINE).font('Helvetica').fontSize(9).text('_'.repeat(95));
        doc.moveDown(0.25);
      }
    }
    if (s.table) {
      const { columns, rows, firstWidth = 0.4 } = s.table;
      const w0 = W * firstWidth;
      const wc = (W - w0) / (columns.length - 1);
      const drawRow = (cells, bold) => {
        // Alto según el texto de la primera columna: una fila larga parte en
        // dos líneas en vez de cortarse.
        doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5);
        const rowH = Math.max(20, doc.heightOfString(cells[0], { width: w0 - 8 }) + 12);
        room(rowH);
        const y = doc.y;
        cells.forEach((c, i) => {
          const x = i === 0 ? X : X + w0 + (i - 1) * wc;
          doc.fillColor(bold ? INK : '#1f4d6b').font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5)
            .text(c, x + 4, y + 6, { width: (i === 0 ? w0 : wc) - 8 });
        });
        doc.moveTo(X, y + rowH).lineTo(X + W, y + rowH).strokeColor(LINE).lineWidth(0.6).stroke();
        doc.x = X;
        doc.y = y + rowH;
      };
      drawRow(columns, true);
      for (const r of rows) drawRow([r, ...columns.slice(1).map(() => '')], false);
      doc.moveDown(0.3);
    }
    if (s.formula) {
      room(30);
      doc.moveDown(0.3);
      doc.fillColor(INK).font('Helvetica-Bold').fontSize(9).text(s.formula, X, doc.y, { width: W });
    }
  }

  room(50);
  doc.moveDown(1.2);
  doc.moveTo(X, doc.y).lineTo(X + W, doc.y).strokeColor('#e6ebf1').lineWidth(0.8).stroke();
  doc.moveDown(0.5);
  doc.fillColor(MUTED).font('Helvetica-Oblique').fontSize(8).text(footer, X, doc.y, { width: W, lineGap: 1.5 });
  doc.end();
  console.log('generated', `public/assets/seo/${file}`);
}

const DRAFT_TEXT = 'DRAFT · PENDING REVIEW. The covers listed depend on the country and the insurer and have not been verified by a person. Do not publish until this notice is removed.';

const only = process.argv.slice(2);
for (const a of Object.values(ACTIVIDADES)) {
  if (only.length && !only.includes(a.id)) continue;
  const p = a.plan;
  render(`${slug(a)}-business-plan-template.pdf`, {
    sub: `${cap(a.business)} business plan template`,
    title: `${a.business.toUpperCase()} BUSINESS PLAN`,
    intro: pdfText(`Fill in every line with your own quotes and numbers. ${p.formula}`),
    sections: [
      { head: '1 · The business', fields: [['Company name and legal form', ''], ['Site(s) or base(s)', 'Where you launch or berth, and who grants permission to operate there'], ['Season', 'Opening and closing dates'], ['Model', MODEL[a.id] ?? 'Free rental / guided / both']] },
      { head: '2 · Customers and channels', fields: [['Who books', 'Visitors, groups, families, locals, companies'], ['Sales channels and share of bookings', 'Walk-in, website, WhatsApp, hotels and partners, OTAs, brokers'], ['Competitors nearby and their prices', '']] },
      { head: '3 · Fleet and capacity', table: { columns: ['Item', 'Quantity', 'Notes'], rows: FLEET[a.id].map(([r]) => r) }, formula: CAPACITY[a.id] },
      { head: '4 · Prices', table: { columns: ['Product', 'Low season', 'High season'], rows: PRICES[a.id] } },
      { head: '5 · Startup costs', table: { columns: ['Item', 'Quote / amount', 'Supplier'], rows: p.startupCosts, firstWidth: 0.55 } },
      { head: '6 · Costs that run all year', table: { columns: ['Item', 'Per month', 'Per year'], rows: FIXED[a.id] } },
      { head: '7 · Season forecast', note: 'One row per month you operate. Utilization is the share of sellable capacity you expect to sell.', table: { columns: ['Month', 'Operating days', 'Utilization %', 'Revenue'], rows: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'], firstWidth: 0.25 } },
      { head: '8 · Break-even', fields: [['Costs that run all year (section 6, per year)', ''], ['Margin per ' + ({ charter: 'charter day', parasailing: 'flyer', hinchables: 'participant' }[a.id] ?? 'rental') + ' after fuel, commissions and variable costs', ''], ['Break-even = costs per year ÷ margin per unit', 'How many you need to sell before the business makes money']] },
      { head: '9 · Permits, licences and insurance to confirm', note: 'Requirements depend on your country, region and harbour or beach authority. List each one and who you confirmed it with.', fields: [['Permit to operate from the site', 'Authority · status · date'], [ACTIVITY_PERMIT[a.id] ?? 'Activity permit or licence', 'Authority · status · date'], [PEOPLE_RULES[a.id] ?? 'Renter age and licence rules', 'Authority · status · date'], ['Insurance', 'Broker · covers · limits']] },
    ],
    footer: 'Template provided by Solnow for planning only; it is not financial, legal or insurance advice. Run bookings, signed agreements and check-in from day one with Solnow: solnow.io',
  });

  if (a.insurance) {
    const s = a.insurance;
    render(`${slug(a)}-insurance-broker-checklist.pdf`, {
      sub: `${cap(a.business)} insurance: broker checklist`,
      title: `${a.business.toUpperCase()} INSURANCE: QUESTIONS FOR YOUR BROKER`,
      draft: DRAFT_TEXT,
      intro: 'Take this to a broker who insures watersports. Fill in section 1 before the meeting, tick each cover you discussed, and use the last table to compare quotes on the same basis.',
      sections: [
        { head: '1 · Your operation', fields: [['Activities', a.id === 'kayak' ? 'Kayak / paddle board rental, guided tours' : 'Free rental, guided rides'], ['Fleet', `Number of ${a.units} and other craft`], ['Sites and season', ''], ['Expected customers per season', '']] },
        { head: '2 · Covers to ask about', fields: s.covers.map((c) => [`[  ] ${c}`, 'Included? · limit · deductible · exclusions']) },
        { head: '3 · What the insurer will ask you', fields: s.insurerAsks.map((q) => [q, 'Your answer and where the record is kept']) },
        { head: '4 · Compare quotes', table: { columns: ['', 'Quote A', 'Quote B', 'Quote C'], rows: ['Insurer / broker', 'Premium per year', 'Liability limit per incident', 'Renter / participant injury covered?', a.id === 'kayak' ? 'Paddle boards and guided tours included?' : 'Hull cover per craft', 'Deductible per claim', 'Main exclusions', 'Seasonal or suspendable?'], firstWidth: 0.34 } },
      ],
      footer: 'Checklist provided by Solnow for information only; it is not insurance or legal advice. Cover and requirements depend on where you operate and on each insurer. Store every signed agreement and waiver with its booking with Solnow: solnow.io',
    });
  }
}
