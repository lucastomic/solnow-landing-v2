import type { ProductKey } from '@/content/products';
import { PLANS, SEASON_DISCOUNT } from '@/lib/pricingCalc';
import type { Chapter, NarrativaUI } from '@/content/narrativa';

/**
 * The SolNow sales narrative in English. Same structure, ids and levels as the
 * Spanish original in `narrativa.ts`: a slide id (`chapter-index`) means the
 * same slide in both languages, so a presenter selection carries over when the
 * language is switched. Figures are the same; only the words change.
 */

const eur = (n: number) => `€${n.toLocaleString('en-US')}`;
const pct = (p: number) => `${Math.round(p * 100)}%`;

export const STORY_LOOP_EN = {
  loopLabel: 'Recovery loop',
  loopPosition: 'above' as const,
  loop: { id: 'persigue', label: 'Follow-up', sub: 'recovers what goes cold', area: 'persigue' as ProductKey },
};

export const CHAPTERS_EN: Chapter[] = [
  {
    id: 'problema',
    label: 'The problem',
    slides: [
      {
        kind: 'title',
        title: 'Handling a booking takes far too much human work.',
        em: 'far too much human work',
        image: {
          src: '/assets/mostrador-papel.jpg',
          alt: 'A staff member fills in a paper contract at the hut while the queue waits in the sun',
          w: 1680,
          h: 916,
        },
      },
      {
        kind: 'feature',
        title: 'Whichever door it comes through, the same chain',
        bullets: ['Front desk, WhatsApp, website, agency or OTA: six steps, and a person at every one.'],
        media: { type: 'illustration', name: 'channels' },
        mediaFirst: true,
      },
      {
        kind: 'feature',
        n: 1,
        of: 3,
        title: 'You pay in staff hours',
        level: 2,
        bullets: ['People hired to serve, charge and board customers, spending the day on paperwork and messages.'],
        media: { type: 'illustration', name: 'hours' },
      },
      {
        kind: 'feature',
        n: 2,
        of: 3,
        title: 'You pay in lost bookings',
        level: 2,
        bullets: ['The ones nobody answers in time, and the conversations that go cold with nobody chasing them.'],
        media: { type: 'illustration', name: 'lost' },
        mediaFirst: true,
      },
      {
        kind: 'feature',
        n: 3,
        of: 3,
        title: 'You pay in not knowing what is going on',
        level: 2,
        bullets: ['How many wrote, how many paid, what is in the till, what is happening at the other base: rebuilt by hand, late, or never known.'],
        media: { type: 'illustration', name: 'unknown' },
      },
    ],
  },
  {
    id: 'coste',
    label: 'What it costs',
    slides: [
      {
        kind: 'title',
        title: 'What it costs to leave it unsolved.',
        em: 'leave it unsolved',
        lede: 'Measured at our customers before automating, in units that scale to any operator.',
      },
      {
        kind: 'chains',
        title: 'In units that scale to your business',
        rows: [
          {
            label: 'Hours',
            nodes: [
              { k: '8 h', h: 'per 100 bookings', p: 'Replying, details, contract, payment and boarding: 5 minutes per booking.' },
              { k: '€8,000-11,000', h: 'per seasonal hire', p: 'Salary, social security, training and letting go. And next year, again.' },
            ],
          },
          {
            label: 'Bookings',
            nodes: [
              { k: '1 in 10', h: 'waits more than an hour', p: 'And at night nobody answers.' },
              { k: '53 in 100', h: 'conversations go cold', p: 'No follow-up, nobody chases them.' },
              { k: '€600-1,600', h: 'per 100 conversations', p: 'Chasing them recovers 4-7 bookings.' },
            ],
          },
          {
            label: 'What nobody knows',
            nodes: [
              { k: '?', h: 'what is in the till', p: 'The close is rebuilt by hand.', unknown: true },
              { k: '?', h: 'how many of those who write end up paying', p: 'Nobody knows.', unknown: true },
              { k: '?', h: 'what is happening at the other base', p: 'The owner finds out when something breaks.', unknown: true },
            ],
          },
        ],
        note: 'Measured at our customers before automating.',
        calculator: 'Work out what it costs you',
      },
    ],
  },
  {
    id: 'hoy',
    label: 'How it is solved today',
    slides: [
      {
        kind: 'title',
        title: 'Everything out there solves one part of the cycle.',
        em: 'one part',
      },
      {
        kind: 'overview',
        title: 'Five ways to solve it today, and why none is enough',
        layout: 'matrix',
        columns: ['Front desk', 'WhatsApp', 'Legal contract', 'Live operations'],
        items: [
          {
            h: 'By hand',
            p: 'Calendar, whiteboard, Excel, paper and the owner’s phone. It holds up to about 30 bookings a day; past that, bookings get lost and the owner never rests.',
            covers: [false, false, false, false],
          },
          {
            h: 'More people',
            p: 'Absorbs the peak, but it is months of salary, training every year, and it still does not cover nights or weekends.',
            covers: [true, false, false, false],
          },
          {
            h: 'A booking engine',
            p: 'TuriTop, FareHarbor, Bookeo, WooCommerce do online well, but they are built for tours and museums: they do not know what a jet ski is, a contract with minors, or a logbook. And online is the small door: at a front-desk operator 80-90% of revenue comes in at the base, and there the engine does not exist, does not close the industry contract and does not run the day.',
            covers: [false, false, false, false],
          },
          {
            h: 'A WhatsApp bot',
            p: 'It replies but does not close: sends people to the website to find a date, does not know what is free, does not register the customer who wants to pay at the base, and nobody knows how many of those who write end up paying.',
            covers: [false, true, false, false],
          },
          {
            h: 'Build it yourself',
            p: 'Fine for one piece. The whole cycle, payments, legal contracts, multi-base, operations, partners, is years of work and permanent maintenance.',
            covers: [false, false, false, false],
          },
        ],
        note:
          'None covers front desk, WhatsApp, legal contract and live operations in the same system, which is why none gives back the three things: **the hours, the bookings that slip away, and a full picture of the business**.',
      },
    ],
  },
  {
    id: 'cambio',
    label: 'What has changed',
    slides: [
      {
        kind: 'title',
        title: 'Three things have changed, all of them recently.',
        em: 'all of them recently',
      },
      {
        kind: 'overview',
        title: 'What is possible today and was not three years ago',
        layout: 'timeline',
        items: [
          {
            k: 'Change 1',
            h: 'The customer already does the paperwork on their phone',
            p: 'Signing, paying and identifying yourself on a phone is normal for everyone. So the contract, the logbook and the payment can leave the front-desk queue: **the customer does them, not the employee**.',
          },
          {
            k: 'Change 2',
            h: 'An AI now really sells',
            p: 'It does not follow a flow tree: it holds a conversation, quotes, checks availability and leaves the customer paying. For the first time WhatsApp can be answered **at 3 a.m. without a person**.',
          },
          {
            k: 'Change 3',
            h: 'At last there is software built for this industry',
            p: 'Until now nobody had built it: it was too small to justify it, and what exists is generic tour tooling half-adapted. **SolNow is the only system built top to bottom for water activities**, and that is why it exists now.',
          },
        ],
      },
    ],
  },
  {
    id: 'como',
    label: 'How it works',
    slides: [
      {
        kind: 'title',
        title: 'A booking engine is an online shop. SolNow is the operating system of the business.',
        em: 'the operating system of the business',
        lede: 'The till, the contract, boarding and WhatsApp all run through it, whichever door the money comes through. One argument, in four steps.',
      },
      {
        kind: 'story',
        level: 0,
        intro: {
          title: 'Everything runs through the same system',
          sub: 'Channels → sales chain → data. One argument, in four steps.',
        },
        steps: [
          {
            title: 'Every channel, one inventory',
            bullets: [
              'Front desk, website, WhatsApp, OTAs and partners all sell **from the same calendar**.',
              'A booking from GetYourGuide or a hotel gets **the same contract and the same QR** as one from the front desk.',
              'No channel sells what another has already sold.',
            ],
            nodes: ['wa', 'web', 'most', 'colab'],
          },
          {
            title: 'Every channel all the way to the end, with this industry’s pieces',
            bullets: [
              'Not just the booking: **the rental’s legal contract, the logbook, the manifest**, payment at the base (POS and kiosk), the live board, the boarding QR and the fleet in real time, across several bases.',
              'The customer enters their details, **signs and pays themselves**, whichever way they come in.',
            ],
            nodes: ['cobro', 'contrato', 'qr'],
          },
          {
            title: 'That is why we hold the complete data of the business',
            bullets: [
              'Who wrote, who paid, what is in the till, what is on the water.',
              '**Nobody else can build it**: you cannot have the data of a flow that does not go through your system.',
            ],
            nodes: ['mon', 'rep'],
          },
          {
            title: 'And that data pays two dividends',
            bullets: [
              '**The system sells on its own.** An AI salesperson on WhatsApp connected to availability, prices and fleet: replies in seconds at any hour, quotes, confirms in the chat and sends a link just to pay and sign; and chases conversations that go cold and abandoned checkouts.',
              '**The owner sees everything without being there.** How many wrote, how many got a price, how many paid, what is in the till per base and the hours the system absorbed, right now.',
            ],
            nodes: ['wa', 'persigue', 'rep'],
          },
        ],
      },
      {
        kind: 'overview',
        title: 'And we set it up for you',
        level: 2,
        layout: 'grid',
        intro: 'Fleet, configuration and team training in two weeks, so you do not have to build it yourself.',
        items: [
          { k: '01', h: 'Fleet' },
          { k: '02', h: 'Configuration' },
          { k: '03', h: 'Team training' },
        ],
      },
      { kind: 'title', title: 'Demo', em: 'Demo' },
    ],
  },
  {
    id: 'prueba',
    label: 'How we know it is better',
    slides: [
      {
        kind: 'title',
        title: 'It is in production. This is what the system does, measured in August 2026.',
        em: 'in production',
        lede: 'The strongest month of the year, at real operators. First what holds for anyone; then two customers by name.',
      },
      {
        kind: 'figure',
        title: 'The AI sells on its own, and the follow-up recovers what goes cold',
        sub: 'The more it is left alone, the more it closes.',
        figures: [
          {
            type: 'compare',
            title: 'Response time',
            a: { k: '9 s', h: 'the AI, day and night', value: 9 },
            b: { k: '1 h 50', h: 'a team member, on average', value: 6600 },
          },
          {
            type: 'bars',
            title: 'Conversations that close, by how many turns the AI handled alone before a person stepped in',
            items: [
              { label: '0', value: 27, display: '27%' },
              { label: '1', value: 41, display: '41%' },
              { label: '2', value: 45, display: '45%' },
              { label: '3', value: 41, display: '41%' },
              { label: '4', value: 46, display: '46%' },
              { label: '5+', value: 54, display: '54%' },
            ],
            max: 60,
            xLabel: 'turns the AI handled alone',
          },
          {
            type: 'pairs',
            title: 'The follow-up: the customer who went quiet with the payment link in hand',
            beforeLabel: 'No follow-up',
            afterLabel: 'With follow-up',
            groups: [
              { label: 'Writes back', before: 31, after: 78 },
              { label: 'Books', before: 9, after: 32 },
            ],
          },
        ],
      },
      {
        kind: 'figure',
        title: 'The owner sees everything',
        figures: [
          {
            type: 'compare',
            title: 'Share of a front-desk operator’s revenue each system can see',
            a: { k: '11%', h: 'a booking engine: online only', value: 11 },
            b: { k: '100%', h: 'SolNow: everything that comes in at the base', value: 100 },
          },
        ],
        note: 'Every figure in this chapter comes straight from the operator’s dashboard: who wrote, who paid, what closed at night, which channel cancels. **None was calculated for this document.**',
      },
      {
        kind: 'case',
        name: 'Banana Summer · Grupo Marinajets',
        profile: '8 bases · mostly front desk · August 2026',
        logo: { src: '/casos/marinajets-logo.webp', alt: 'Grupo Marinajets', w: 202, h: 168 },
        photo: { src: '/casos/marinajets-flota.webp', alt: 'The Grupo Marinajets jet-ski fleet on the pontoon', w: 386, h: 560 },
        lede: 'Same season, same team, twice the volume.',
        rows: [
          {
            label: 'Fewer hours',
            nodes: [
              { k: '+12,000', h: 'contracts on the customer’s phone', p: 'In one month. Not one sheet of paper.' },
              { k: '+7,500', h: 'passengers boarded with a scan', p: 'The logbook fills itself in.' },
              { k: '≈ 450 h', h: 'a month that nobody did', p: 'Three full-time people.' },
            ],
          },
          {
            label: 'More bookings',
            nodes: [
              { k: '60%', h: 'of sales turns handled by the AI', p: 'At night, 70%.' },
              { k: '6 in 10', h: 'agent bookings paid with no human input', p: 'Nobody on the team writes a word.' },
            ],
          },
          {
            label: 'The follow-up',
            nodes: [
              { k: '+1,000', h: 'conversations go cold a month', p: 'The customer gets a price and goes quiet.' },
              { k: '78%', h: 'come back with a follow-up', p: 'Versus 31% who come back on their own.' },
              { k: '€10,000-27,000', h: 'a month recovered', p: 'Bookings that did not use to happen.' },
            ],
          },
        ],
      },
      {
        kind: 'case',
        name: 'Moraira Boats Adventures',
        profile: '1 base · website and agent · August 2026',
        logo: { src: '/logos/morairaboatsadventures.webp', alt: 'Moraira Boats Adventures', w: 338, h: 192 },
        photo: { src: '/casos/moraira-cueva.webp', alt: 'A Moraira Boats trip entering a sea cave', w: 510, h: 560 },
        lede: 'The WhatsApp that sells on its own.',
        rows: [
          {
            label: 'More bookings',
            nodes: [
              { k: '14 s', h: 'to reply', p: '99.9% of the time, in under a minute.' },
              { k: '80%', h: 'of WhatsApp turns handled by the AI', p: 'Day and night, in the customer’s language: 43% arrive in another one.' },
              { k: '71%', h: 'close when the agent sends the payment link' },
              { k: '9 in 10', h: 'agent bookings paid with no human input', p: 'Nobody on the team writes a line.' },
            ],
          },
          {
            label: 'Chat and web',
            nodes: [
              { k: '1 in 5', h: 'chat bookings are completed in the web engine', p: 'The agent gives the price, the website takes the payment.' },
            ],
          },
          {
            label: 'The follow-up',
            nodes: [
              { k: '3 in 4', h: 'conversations go cold', p: 'The customer asks, gets a price and goes quiet.' },
              { k: '€5,000-13,000', h: 'a month recoverable', p: 'Projection with automatic follow-up at a business like theirs.' },
            ],
          },
        ],
      },
      { kind: 'logos', title: 'Operators already running on SolNow', level: 2 },
    ],
  },
  {
    id: 'precio',
    label: 'And it costs',
    slides: [
      {
        kind: 'title',
        title: 'One fee per base, and the bulk follows sales.',
        em: 'follows sales',
      },
      {
        kind: 'price',
        level: 0,
        title: 'All included, no tiers',
        fixed: {
          first: `${eur(PLANS.escalar.season.first)} per season for the first base`,
          extra: `${eur(PLANS.escalar.season.extra)} for each additional base`,
          monthly: `Or monthly: ${eur(PLANS.escalar.monthly.first)} for the first and ${eur(PLANS.escalar.monthly.extra)} for each additional (${pct(SEASON_DISCOUNT)} more than the season price).`,
        },
        rows: [
          { k: '0%', h: 'of everything you do yourself', p: 'Front desk, manual, partners.' },
          {
            k: pct(PLANS.escalar.channelPct),
            h: 'of what SolNow collects online',
            p: 'Can be passed on to the traveller as a booking fee.',
          },
          {
            k: `+${pct(PLANS.escalar.vendorPct)}`,
            h: 'of what the agent sells',
            p: 'Every booking it creates or that is paid through its link. It earns like a salesperson, only on what it sells; answering, chasing and after-sales are in the fee.',
          },
        ],
        note: 'In November the invoice goes down on its own.',
        alt: `One base and just starting? Despegue: ${eur(PLANS.despegue.season.first)} per season (${eur(PLANS.despegue.monthly.first)} a month), ${pct(PLANS.despegue.channelPct)} of what SolNow collects online and +${pct(PLANS.despegue.vendorPct)} of what the agent sells. Same modules.`,
        calculator: 'Work out your fee',
        annual: {
          k: '€9,000-11,000',
          h: 'a year for an operator of our profile: less than one seasonal hire, for the work of three.',
        },
      },
    ],
  },
];

export const APPENDIX_EN: Chapter[] = [
  {
    id: 'preguntas',
    label: 'What they always ask',
    slides: [
      {
        kind: 'overview',
        title: 'Three questions that always come up',
        layout: 'grid',
        items: [
          {
            k: '“My team already replies fast”',
            h: 'On average it takes 1 h 50',
            p: 'Because 1 in 10 customers waits more than an hour and at night nobody answers. The AI takes 9 seconds, always.',
          },
          {
            k: '“Does it sell worse than a person?”',
            h: 'The data says the opposite',
            p: 'The more turns the AI handles alone, the more the conversation closes: from 27% to 54%. And the days the team interrupts it most do not close more.',
          },
          {
            k: '“And in winter?”',
            h: `The fee is ${eur(PLANS.escalar.monthly.first)} a month for the first base`,
            p: 'The rest is commission on what SolNow collects or closes. In November the invoice goes down on its own.',
          },
        ],
      },
    ],
  },
];

export const UI_EN: NarrativaUI = {
  meta: { title: 'The SolNow narrative', description: 'The SolNow sales narrative, in the order the operator needs to hear it.' },
  cover: {
    title: 'The first operating system for water-activity businesses.',
    em: 'operating system',
    lede: 'Serve and capture more bookings with fewer staff, across every channel: front desk, website, WhatsApp, OTAs and partners.',
  },
  rail: { chapters: 'Chapters', appendix: 'Appendix' },
  logos: { inProduction: 'In production' },
  price: { eyebrow: 'Fee per base · Escalar', variable: 'The bulk follows sales', allIncluded: 'All included, no tiers.' },
  zoom: { close: 'Close', hint: 'Esc to go back to the map', nodeAria: 'see in detail' },
  presenter: {
    title: 'Presenter mode',
    hint: 'Open and close with P P (twice), ⌥⇧P or ⌘⇧P. What you tick is saved in this browser and in the link.',
    levels: [
      { label: 'Summary', hint: 'Only the cover and the idea of each chapter. Ten minutes.' },
      { label: 'Presentation', hint: 'The whole narrative, without the detail that only comes out if they ask.' },
      { label: 'Full detail', hint: 'Everything, including the supporting slides.' },
    ],
    appendixPrefix: 'Appendix · ',
    byLevel: 'Hidden by the detail level',
    showAll: 'Show everything',
    copyLink: 'Copy link with this selection',
    language: 'Language',
    labels: { cover: 'Cover', logos: 'Logos' },
  },
  calc: {
    eyebrow: 'What it costs · your business',
    title: 'What it costs you today',
    intro: 'Three figures from your season. The units are the ones measured at our customers before automating.',
    bookings: 'Bookings a day in season',
    chats: 'WhatsApp conversations a day',
    months: 'Months of season',
    monthsUnit: 'months',
    hours: 'Hours',
    conversations: 'Conversations',
    hoursPerDay: 'h a day',
    hoursPerDayH: 'of paperwork and queue',
    hoursPerSeason: 'h over the season, at {min} min per booking.',
    hires: 'in {n} seasonal hires',
    hiresH: 'Salary, social security, training and letting go.',
    hiresP: '',
    slowH: 'wait more than an hour',
    slowP: 'And at night nobody answers.',
    perDay: 'a day',
    perMonth: 'a month',
    coolH: 'go cold with no follow-up',
    coolP: 'Chasing them recovers {range}.',
    lostH: 'a month that nobody chases',
    lostP: '{range} over the season.',
    totalP: 'per season, between staff and bookings that slip away. Not counting what is never measured.',
    hint: 'Estimate using the narrative’s units · Esc to go back',
  },
  pricing: {
    eyebrow: 'And it costs · your business',
    billing: 'Billing',
    roiEyebrow: 'Your estimated return',
    roiIntro: 'Three more figures. What leaving it unsolved costs you today, in the units of the “What it costs” chapter, against what you would pay.',
    roiHires: 'People you do not have to hire',
    roiLost: 'Bookings that go cold today and the follow-up recovers',
    roiTotal: 'What you get back per season',
    roiPay: 'What you pay a year, from your invoice above',
    roiBig: 'estimated return on what you pay. Not counting what is never measured: till, nights, languages.',
    hint: 'The same formulas as the website · Estimate using the narrative’s units · Esc to go back',
  },
  ill: {
    channels: ['Front desk', 'WhatsApp', 'Website', 'Agency', 'OTA'],
    steps: ['Reply', 'Quote', 'Take details', 'Contract', 'Charge', 'Board'],
    chainCaption: 'Minutes of a person · every booking · every day',
    day: { messages: 'Messages', quote: 'Quote', data: 'Details', contract: 'Contract', charge: 'Charge', board: 'Board' },
    legendPaper: 'Paperwork and payment',
    legendMessages: 'Answering messages',
    chats: [
      { who: 'Laura', t: 'Hi! Do you have 2 jet skis tomorrow at 12?', when: '3 min ago', state: 'Unanswered' },
      { who: 'Marco', t: 'Do you have availability Saturday?', when: '40 min ago', state: 'Unanswered' },
      { who: 'Chloé', t: 'OK, and how much would an hour be?', when: '2 h ago', state: 'Went cold' },
      { who: 'Iván', t: 'Can you send me the link to pay?', when: 'yesterday', state: 'Went cold' },
      { who: 'Sophie', t: 'Nous sommes 6, c’est possible ?', when: 'yesterday 02:14', state: 'At night, nobody' },
    ],
    inbox: 'WhatsApp · Bookings',
    inboxOpen: '5 open',
    unknown: ['How many wrote today?', 'How many paid?', 'What is in the till?', 'What is happening at the other base?'],
    unknownCaption: 'Rebuilt by hand · late · or never known',
  },
  fmt: { locale: 'en-US' },
};
