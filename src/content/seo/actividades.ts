/**
 * Lo que de verdad cambia entre actividades en las páginas programáticas.
 *
 * Las plantillas (`plantillas/*.ts`) solo ponen la estructura; todo lo que
 * diferencia una página de moto de agua de una de kayak sale de aquí: cómo se
 * gana el dinero, en qué se gasta al empezar, qué pasos tiene, qué pide el
 * seguro y qué dato propio tenemos. Si una actividad no tiene un dato propio
 * publicable, va un bloque `pending`: nunca una cifra estimada.
 *
 * Solo inglés: la matriz E no tiene demanda medible en español (ver
 * `candidatas.csv`).
 */

import type { GuideBlock, GuideSection } from '@/content/guides';

export type ActividadId = 'jet-ski' | 'kayak' | 'charter';

export interface Actividad {
  id: ActividadId;
  /** «jet ski rental», para frases como «a jet ski rental business». */
  business: string;
  /** Unidad que se alquila, en singular y plural. */
  unit: string;
  units: string;

  plan: {
    title: string;
    description: string;
    h1: string;
    /** Respuesta directa: va como primer párrafo. */
    lede: string;
    /** Cómo se gana el dinero, en una fórmula sin cifras inventadas. */
    formula: string;
    drivers: string[];
    startupCosts: string[];
    steps: string[];
    permits: { text: string; verify: string };
    /** Dato propio publicado, atribuido y fechado. */
    dato: GuideSection;
    /** La cifra de cartera que falta para el plan (siempre pendiente hasta tenerla). */
    benchmark: string;
    faq: { q: string; a: string; verify?: string }[];
  };

  insurance?: {
    title: string;
    description: string;
    h1: string;
    lede: string;
    ledeVerify: string;
    covers: string[];
    coversVerify: string;
    insurerAsks: string[];
    compare: string[];
    dato: GuideBlock[];
    faq: { q: string; a: string; verify?: string }[];
  };

  /** Guías existentes (slug físico) o páginas programáticas (slug inglés). */
  related: { label: string; slug: string }[];
}

const MARINAJETS = 'Grupo Marina Jets, 8 jet ski and water activity bases in the Mediterranean';
const MORAIRA = 'Moraira Boats Adventures, boat rental and kayak trips on Spain’s Costa Blanca';

export const ACTIVIDADES: Record<ActividadId, Actividad> = {
  'jet-ski': {
    id: 'jet-ski',
    business: 'jet ski rental',
    unit: 'jet ski',
    units: 'jet skis',
    plan: {
      title: 'How to Start a Jet Ski Rental Business (Free Business Plan Template)',
      description:
        'Steps, startup costs and the numbers that decide whether a jet ski rental business is profitable, with a free business plan template built for jet ski operators.',
      h1: 'How to start a jet ski rental business',
      lede:
        'To start a jet ski rental business you need a launch site you are allowed to operate from, a fleet sized to peak-season demand, the permits and insurance your location requires, and a way to sell, sign and check in customers fast enough for summer queues. Whether it is profitable comes down to one number: how many hours each jet ski spends on the water during the weeks that pay for the whole year. The steps and the business plan template below are built around that number.',
      formula:
        'Season revenue ≈ jet skis in service × rentable hours per day × utilization × average price per hour × operating days. Profit is what is left after the costs that run all year: moorings or dock space, insurance, financing, maintenance and the off-season.',
      drivers: [
        'Utilization in peak weeks: every jet ski idle while a queue waits at the desk is revenue you cannot recover in October.',
        'Turnaround between rides: refuelling, briefing and paperwork eat into the 15, 30 or 60-minute slots you sell.',
        'Fleet downtime: a craft in the workshop in August costs you its whole peak-week revenue, so budget spares.',
        'Fuel and late returns: both come out of margin unless they are written into the rental agreement and charged.',
        'Mix of guided rides and free rentals: guided tours sell at a different price and need different staff.',
      ],
      startupCosts: [
        'Jet skis, new or used, plus at least one spare for peak weeks.',
        'Moorings, dock space or trailers, and the launch or concession fee for your site.',
        'Safety equipment: life jackets in every size, a rescue boat, radios, first aid.',
        'Insurance for the fleet and for liability (see the insurance guide).',
        'Permits and licences for the site and the activity.',
        'Staff: instructors and front-desk team, plus their training before the season.',
        'Booking, rental agreement and payment system, and a card terminal for walk-ins.',
        'Fuel, maintenance and a reserve for the months with no revenue.',
      ],
      steps: [
        'Secure the site: find out who grants permission to operate from that beach or harbour, and on what terms.',
        'Size the fleet to the queue on a peak afternoon, not to the average day, and add spares.',
        'Get the permits, licences and insurance your location requires before you buy the fleet.',
        'Set prices by duration (15, 30, 60 minutes) and by season, including fuel, deposit and late-return rules.',
        'Set up booking, signed rental agreements and payments before day one, for online customers and for walk-ins.',
        'Train staff on the safety briefing, the riding zone and the check-in routine.',
        'Plan the off-season: maintenance, storage and the fixed costs that keep running.',
      ],
      permits: {
        text: 'Who may rent a jet ski, from what age, with which licence or boater-education card, inside which zone and with which insurance is set by your country, state or harbour authority. Write those rules into your rental agreement and your safety briefing, and get them confirmed locally before you commit to a site.',
        verify: 'Jet ski rental permits, renter age/licence rules and mandatory insurance vary by country, state and harbour authority. Confirm with a local advisor before publishing.',
      },
      dato: {
        h: 'Our data: the desk hours a plan usually forgets',
        blocks: [
          {
            type: 'feature',
            value: '≈ 450 h',
            label: 'a month · estimated',
            text: `of desk and WhatsApp work that nobody had to do in August at ${MARINAJETS}, once sales, contracts and check-in ran on Solnow. In a business plan that is the line for peak-season front-desk staff.`,
          },
          {
            type: 'stats',
            items: [
              { value: '12,000+', label: 'contracts signed on the customer’s phone in one month.' },
              { value: '36%', label: 'of customers reach the pontoon with the contract already signed.' },
            ],
          },
          { type: 'p', text: 'Production data, August 2026. The full numbers are in the Grupo Marina Jets case study.' },
        ],
      },
      benchmark:
        'Portfolio benchmark for the plan: average utilization per jet ski in peak weeks and average price per 30 minutes across Solnow operators. Pull from the production database only with explicit approval; do not estimate.',
      faq: [
        {
          q: 'Is a jet ski rental business profitable?',
          a: 'It can be, if the hours each jet ski spends on the water in peak weeks cover the costs that run all year: moorings, insurance, financing and maintenance. The business plan template lets you test that with your own fleet, prices and season length.',
        },
        {
          q: 'How many jet skis do I need to start?',
          a: 'Size the fleet to the queue you expect on a peak afternoon, not to the average day, and keep at least one spare for breakdowns. The template has a capacity sheet to work it out.',
        },
        {
          q: 'How much does it cost to start a jet ski rental business?',
          a: 'It depends on new or used craft, the site and its fees, and the insurance your location requires. The template lists every line to fill in; we do not publish averages we cannot back with data.',
        },
      ],
    },
    insurance: {
      title: 'Jet Ski Rental Insurance: What Cover an Operator Needs (Checklist)',
      description:
        'The insurance a jet ski rental business usually needs, what insurers ask about your operation and how to compare quotes. Free checklist to take to your broker.',
      h1: 'Jet ski rental insurance for operators',
      lede:
        'A jet ski rental business is usually insured with a combination of liability cover for injuries and damage your renters cause to other people, physical damage (hull) cover for each jet ski, and cover for your staff and premises. What is mandatory, the minimum limits and whether renter injuries are covered depend on where you operate, so the useful starting point is knowing what to ask a broker who insures watersports. Download the checklist below and take it to that meeting.',
      ledeVerify: 'Typical cover for jet ski rental operators and what is mandatory vary by country and insurer. Confirm with a watersports insurance broker.',
      covers: [
        'Third-party liability: injury or damage your renters cause to swimmers, other boats or property.',
        'Renter or passenger injury: often excluded or limited in standard policies, so ask explicitly.',
        'Hull or physical damage for each jet ski, including theft and damage while moored or on a trailer.',
        'Employer’s liability or workers’ compensation for instructors and desk staff.',
        'Premises, equipment and business interruption if a season is cut short.',
      ],
      coversVerify: 'Names, scope and availability of each cover depend on the jurisdiction and the insurer. Confirm with a broker.',
      insurerAsks: [
        'How you check renters’ age and any licence or boater card required.',
        'What the safety briefing covers and whether it is recorded.',
        'The riding zone, how it is marked and who supervises it from the shore or a rescue boat.',
        'Whether every renter signs a rental agreement and a waiver, and where those are stored.',
        'Maintenance logs for each craft and your incident records.',
      ],
      compare: [
        'Put the quotes side by side on the same limits per incident and per year.',
        'Read the exclusions: renter injuries, alcohol, riding outside the zone, unlicensed drivers.',
        'Check the deductible per claim and who pays it under your rental agreement.',
        'Ask whether cover can be seasonal or suspended in the months you do not operate.',
      ],
      dato: [
        {
          type: 'feature',
          value: '12,000+',
          label: 'contracts in one month',
          text: `signed on the customer’s phone at ${MARINAJETS}, each one filed with its booking. When an insurer asks for the agreement behind an incident, it is a search, not a box of paper. Production data, August 2026.`,
        },
      ],
      faq: [
        {
          q: 'Is insurance required to rent out jet skis?',
          a: 'In most places some liability cover is required to rent jet skis commercially, but the minimum and the authority that sets it vary. Ask your harbour authority or local regulator, and a broker who insures watersports.',
          verify: 'Mandatory insurance for commercial jet ski rental by jurisdiction. Confirm before publishing.',
        },
        {
          q: 'Does a signed waiver replace insurance?',
          a: 'No. A waiver records that the renter was informed of the risks and accepted the rules; it does not pay for an injury or for damage to the jet ski.',
          verify: 'Relationship between waivers and liability/insurance by jurisdiction. Confirm with a legal advisor.',
        },
        {
          q: 'Can renters be charged for damage to the jet ski?',
          a: 'Yes, if your rental agreement says so: most operators hold a deposit and set how much of any damage or deductible the renter pays.',
        },
      ],
    },
    related: [
      { label: 'Jet ski rental software: the 2026 checklist', slug: 'software-alquiler-motos-de-agua' },
      { label: 'Jet ski rental contract template', slug: 'contrato-alquiler-motos-de-agua' },
      { label: 'Case study: Grupo Marina Jets', slug: 'caso-de-exito-marinajets' },
    ],
  },

  kayak: {
    id: 'kayak',
    business: 'kayak rental',
    unit: 'kayak',
    units: 'kayaks',
    plan: {
      title: 'How to Start a Kayak Rental Business (Free Business Plan Template)',
      description:
        'How to start a kayak and paddle board rental business: site, fleet mix, costs, pricing and what makes it profitable. Free business plan template for kayak operators.',
      h1: 'How to start a kayak rental business',
      lede:
        'To start a kayak rental business you need a launch spot where you are allowed to operate, a fleet mixed between single kayaks, doubles and paddle boards, insurance, and a fast way to get people signed and on the water at the beach. It is profitable when volume makes up for the low ticket: a kayak rents for far less than a motorized craft, so the margin is in turnover per unit, guided tours and extras, not in the hourly price. The steps and the business plan template below are built around that.',
      formula:
        'Season revenue ≈ (units × rentable hours per day × utilization × average price per hour) + (guided tour seats × tour price) + extras, over the operating days. Costs are low per unit but storage, transport, staff and the site run all season.',
      drivers: [
        'Turnover per unit: short slots and a fast check-in matter more than the price per hour.',
        'Fleet mix: groups and families want doubles; a fleet of singles turns away whole groups.',
        'Guided tours: caves, sunsets or nature routes sell at several times the rental price per person.',
        'Extras: dry bags, waterproof phone cases, photos and wetsuits add margin with almost no cost.',
        'Weather days: wind closes the beach, so a clear rebooking policy protects the revenue already sold.',
      ],
      startupCosts: [
        'Single and double kayaks and paddle boards, with paddles and spares.',
        'Life jackets in every size, dry bags and leashes.',
        'Racks, a storage container or shed, and a trailer or van if you launch from several spots.',
        'The beach stand, and the concession or permit fee for the site.',
        'Insurance and any guide or rescue certifications you need.',
        'Staff for the stand and guides for tours.',
        'Booking, waiver and payment system that works at the beach.',
        'Signage and listings where visitors look for things to do.',
      ],
      steps: [
        'Secure the launch spot and the permission to rent from it.',
        'Choose the fleet mix: singles, doubles and boards, in the proportion of the groups you expect.',
        'Get insurance and the waiver you will have every renter sign.',
        'Price by the hour, the half day and the guided tour, with a weather policy written down.',
        'Set up booking and waivers so customers arrive signed, and walk-ups can sign from a QR code.',
        'Train staff on the briefing: zone, wind limits, return time and what to do if someone capsizes.',
        'Add guided tours once rentals run smoothly: they lift the average ticket the most.',
      ],
      permits: {
        text: 'Where you may launch, how far from shore renters may paddle, whether guides need a certification and which insurance applies depend on the local authority and the terms of your beach or water concession. Put the zone and the wind limit in the waiver and in the briefing, and confirm them locally before you open.',
        verify: 'Kayak/SUP rental permits, paddling zones, guide certification and insurance requirements vary by country and local authority. Confirm with a local advisor.',
      },
      dato: {
        h: 'Our data: answering fast in a low-ticket business',
        blocks: [
          {
            type: 'feature',
            tone: 'ink',
            value: '80%',
            label: 'of WhatsApp turns',
            text: `are handled by the AI at ${MORAIRA}, replying in 14 seconds at any hour. In kayak rental a late reply is a lost sale: visitors message several companies on the same beach and book with whoever answers first. Production data, August 2026.`,
          },
        ],
      },
      benchmark:
        'Portfolio benchmark for the plan: average price per hour and share of guided tours vs free rental across Solnow kayak operators. Pull from the production database only with explicit approval; do not estimate.',
      faq: [
        {
          q: 'Is a kayak rental business profitable?',
          a: 'It can be, if turnover per unit is high enough in peak weeks and guided tours lift the average ticket. With a low price per hour, a slow check-in or a fleet that does not match group sizes eats the margin. Test it with your own numbers in the template.',
        },
        {
          q: 'How many kayaks do I need to start?',
          a: 'Start from the groups you expect on a busy morning: how many couples, families and solo paddlers. That gives you the mix of doubles, singles and boards, and the template turns it into a fleet size.',
        },
        {
          q: 'Should I offer guided tours or only rentals?',
          a: 'Rentals are simpler to run; guided tours sell at a higher price per person and fill the days when free rental is quiet. Many operators start with rentals and add tours once the stand runs smoothly.',
        },
      ],
    },
    insurance: {
      title: 'Kayak Rental Insurance: What Cover an Operator Needs (Checklist)',
      description:
        'The insurance a kayak and paddle board rental business usually needs, what insurers ask about rentals and guided tours, and how to compare quotes. Free broker checklist.',
      h1: 'Kayak rental insurance for operators',
      lede:
        'A kayak rental business is usually insured mainly for liability: the risk is people in the water, not expensive craft, so cover for injury to renters and to others matters more than insuring each kayak. Guided tours, paddle boards and how far renters may go change what the insurer asks and what it costs. What is mandatory depends on your location and your beach or water concession, so start with the right questions for a broker who insures paddle sports. Download the checklist below.',
      ledeVerify: 'Typical cover for kayak/SUP rental operators, the weight of liability vs equipment cover and what is mandatory vary by country and insurer. Confirm with a broker.',
      covers: [
        'General or third-party liability for injury and damage to others.',
        'Participant injury on rentals and on guided tours, which insurers often treat differently.',
        'Professional liability for guides, if you run tours.',
        'Equipment cover for the fleet, racks and storage against theft and storm damage.',
        'Employer’s liability or workers’ compensation for staff and guides.',
      ],
      coversVerify: 'Names, scope and availability of each cover depend on the jurisdiction and the insurer. Confirm with a broker.',
      insurerAsks: [
        'Whether you rent only, guide tours, or both, and the guide-to-participant ratio on tours.',
        'Guide certifications and the training of stand staff.',
        'Life jacket policy and the briefing every renter receives.',
        'The paddling zone, the wind or swell limit for closing, and how you check returns.',
        'Whether every participant signs a waiver, including guardians for minors, and where it is stored.',
      ],
      compare: [
        'Check that the same policy covers rentals, guided tours and paddle boards, or which is excluded.',
        'Compare limits per incident and per year on the same basis.',
        'Read the exclusions: alcohol, paddling outside the zone, unsupervised minors.',
        'Ask about seasonal cover for the months the stand is closed.',
      ],
      dato: [
        {
          type: 'pending',
          text: 'Own data for kayak insurance: share of kayak participants arriving with the waiver already signed, from a Solnow kayak operator using digital waivers. We have no kayak client with this data published yet; do not reuse jet ski figures.',
        },
      ],
      faq: [
        {
          q: 'Is insurance required to rent kayaks?',
          a: 'It depends on the location and on your beach or water concession; many concessions require liability cover. Check the terms of your permit and ask a broker who insures paddle sports.',
          verify: 'Mandatory insurance for kayak/SUP rental by jurisdiction and concession. Confirm before publishing.',
        },
        {
          q: 'Does the same policy cover paddle boards?',
          a: 'Not always. Some policies list the craft they cover, so name kayaks, paddle boards and any other craft you rent when you ask for a quote.',
          verify: 'Whether kayak policies extend to SUP varies by insurer. Confirm with a broker.',
        },
        {
          q: 'Does a signed waiver replace insurance?',
          a: 'No. A waiver records that the participant was informed of the risks and accepted the rules; it does not pay for an injury.',
          verify: 'Relationship between waivers and liability/insurance by jurisdiction. Confirm with a legal advisor.',
        },
      ],
    },
    related: [
      { label: 'Case study: Moraira Boats', slug: 'caso-de-exito-moraira' },
      { label: 'Digitize the front desk', slug: 'digitalizar-mostrador-alquiler-motos-de-agua' },
      { label: 'Best watersports booking software compared', slug: 'mejores-software-reservas-actividades-acuaticas' },
    ],
  },

  charter: {
    id: 'charter',
    business: 'boat charter',
    unit: 'boat',
    units: 'boats',
    plan: {
      title: 'How to Start a Boat Charter Business (Free Business Plan Template)',
      description:
        'How to start a boat charter business: skippered or bareboat, licences, berths, pricing and the numbers behind profitability. Free business plan template for charter operators.',
      h1: 'How to start a boat charter business',
      lede:
        'To start a boat charter business, first decide whether you will charter skippered, bareboat or both, because that choice drives your licences, insurance, crew and prices. Then you need boats with a berth, the commercial registration and permits your flag and harbour require, and a way to quote, take deposits and sign charter agreements before departure. It is profitable when the days each boat is booked in high season cover the costs that run all year: berthing, insurance, maintenance and the boat’s financing.',
      formula:
        'Season revenue ≈ boats × charter days sold per boat × average price per day, plus skipper, fuel and extras. Profit is what remains after berthing, insurance, maintenance, financing and broker commissions, which run whether the boat goes out or not.',
      drivers: [
        'Days sold per boat in high season: the number that pays for the year.',
        'Half-day versus full-day mix: half days fill gaps but add turnaround work.',
        'Skipper cost and availability on skippered charters.',
        'Fuel policy: full-to-full or charged by engine hours, written into the agreement.',
        'Channel commissions: brokers, agencies and OTAs take a share of each booking.',
        'Damage and security deposits, and how quickly you can turn a boat around after a charter.',
      ],
      startupCosts: [
        'Boats: purchase, lease or a management agreement with owners.',
        'Commercial registration, survey and the safety equipment required for charter use.',
        'Berths in the marina or harbour you operate from.',
        'Insurance for hull, liability and passengers.',
        'Skippers and crew, and their licences.',
        'Maintenance, haul-out and an off-season reserve.',
        'Booking, deposit and charter agreement system, plus WhatsApp for quotes.',
        'Marketing and listings with brokers and OTAs.',
      ],
      steps: [
        'Choose the model: skippered, bareboat or both, and the boats that fit it.',
        'Set up the company and the commercial registration your flag and harbour require.',
        'Secure berths and insurance before the first booking.',
        'Build the price table by season and duration, with deposit, security deposit and fuel rules.',
        'Open sales channels: your website, WhatsApp for quotes, brokers and agencies.',
        'Write the charter agreement and the check-in routine: inventory, condition, licence or skipper details.',
        'Plan maintenance windows and the off-season so the fleet is ready for high season.',
      ],
      permits: {
        text: 'Which licence a skipper or a bareboat charterer needs, how a boat must be registered and equipped for commercial charter, and which insurance is mandatory depend on the boat’s flag and the harbour you operate from. Confirm them before buying or leasing boats: they decide which boats you can use and how.',
        verify: 'Commercial charter registration, skipper/bareboat licensing and mandatory insurance vary by flag state and harbour authority. Confirm with a maritime advisor.',
      },
      dato: {
        h: 'Our data: charter customers write in their own language',
        blocks: [
          {
            type: 'feature',
            value: '43%',
            label: 'of conversations',
            text: `arrive in another language at ${MORAIRA}. Charter customers ask before they book: which boat, how many people, whether a licence is needed. If the answer waits for someone who speaks their language, the booking goes to another company in the marina. Production data, August 2026.`,
          },
        ],
      },
      benchmark:
        'Portfolio benchmark for the plan: average days booked per boat in high season and split between half and full days across Solnow charter operators. Pull from the production database only with explicit approval; do not estimate.',
      faq: [
        {
          q: 'Is a boat charter business profitable?',
          a: 'It can be, when the days each boat is booked in high season cover berthing, insurance, maintenance and financing for the whole year. The template lets you test that with your boats, prices and season.',
        },
        {
          q: 'Skippered or bareboat: which should I start with?',
          a: 'Skippered charters need crew but let you take customers without a licence; bareboat needs no crew but stricter checks and insurance. Many operators start with one model and add the other once the fleet and processes are stable.',
          verify: 'Licensing and insurance differences between skippered and bareboat charter vary by flag and harbour. Confirm locally.',
        },
        {
          q: 'Do I need to own the boats?',
          a: 'No. Some operators charter boats under management agreements with private owners. The plan should then include the owner’s share of each booking.',
        },
      ],
    },
    related: [
      { label: 'Eliminate paperwork in boat rental', slug: 'eliminar-papeleo-alquiler-nautico' },
      { label: 'Case study: Moraira Boats', slug: 'caso-de-exito-moraira' },
      { label: 'Answer WhatsApp 24/7 with AI', slug: 'whatsapp-reservas-motos-de-agua' },
    ],
  },
};
