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

export type ActividadId = 'jet-ski' | 'kayak' | 'charter' | 'parasailing' | 'paddle-surf' | 'hinchables';

export interface Actividad {
  id: ActividadId;
  /** «jet ski rental», para frases como «a jet ski rental business». */
  business: string;
  /** Artículo delante de `business` («an inflatable water park»). Por defecto, «a». */
  article?: 'a' | 'an';
  /** Unidad que se alquila, en singular y plural. */
  unit: string;
  units: string;

  plan: {
    title: string;
    description: string;
    h1: string;
    /** Respuesta directa: va como primer párrafo. */
    lede: string;
    /** Aviso VERIFICAR para la respuesta directa, si afirma algo legal o de seguros. */
    ledeVerify?: string;
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
    /**
     * Cifras con fuente (base de datos de Solnow, fabricantes, tarifas
     * oficiales). Con ellas la página ya no deja el hueco de `benchmark`.
     * Toda celda de precio lleva su fuente al lado: si no hay fuente, el texto
     * lo dice en vez de poner una cifra.
     */
    numbers?: {
      data: GuideBlock[];
      prices?: GuideBlock;
      costs: GuideBlock;
      costsNote: string;
      example?: GuideBlock;
      exampleResult?: string;
    };
    faq: { q: string; a: string; verify?: string }[];
    /**
     * Sección propia «qué lleva el plan de negocio», para las páginas que
     * cubren también la consulta «business plan» de la actividad.
     */
    planSections?: string[];
    /**
     * Sección propia de seguro, para las actividades cuya consulta de seguro
     * no tiene página aparte.
     */
    insuranceSection?: { intro: string; covers: string[]; coversVerify: string; insurerAsks: string[] };
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

  /** Matriz C · contrato de alquiler: página + PDF (mismos campos y cláusulas). */
  contrato?: {
    title: string;
    description: string;
    h1: string;
    lede: string;
    includes: string[];
    forgotten: string[];
    release: { text: string; verify: string };
    steps: string[];
    /** Campos y cláusulas del PDF. */
    fields: [string, string][];
    clauses: [string, string][];
    faq: { q: string; a: string; verify?: string }[];
  };

  /** Matriz C · checklist de seguridad: página + PDF (mismas listas). */
  checklist?: {
    title: string;
    description: string;
    h1: string;
    lede: string;
    craft: string[];
    renter: string[];
    renterVerify: string;
    briefing: string[];
    onReturn: string[];
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
      numbers: {
        "data": [
          {
            "type": "stats",
            "items": [
              {
                "value": "€82",
                "label": "median price of a 30-minute jet ski rental, per craft (middle half of rides: €60–85)."
              },
              {
                "value": "€130",
                "label": "median price of a 1-hour rental (middle half: €112–140); 2 hours, €190."
              },
              {
                "value": "79%",
                "label": "of the season’s rides happen in July and August; June to September, 97%."
              }
            ]
          },
          {
            "type": "p",
            "text": "Source: over 5,000 paid jet ski rentals at Grupo Marina Jets (8 bases in Spain) in the 2026 season, from Solnow. About three quarters were registered by staff at the desk or the dock (walk-ins and phone sales), 16% came through the online booking engine and 8% through WhatsApp."
          }
        ],
        "costs": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Sea-Doo Spark (2-up / 3-up)",
              "cells": [
                "from $7,099 / $8,699",
                "sea-doo.brp.com, 2027 US MSRP"
              ]
            },
            {
              "label": "Sea-Doo GTI 130",
              "cells": [
                "from $12,299",
                "sea-doo.brp.com, 2027 US MSRP"
              ]
            },
            {
              "label": "Yamaha JetBlaster / VX",
              "cells": [
                "$8,999 / $12,899",
                "yamahawaverunners.com, US MSRP, Oct 2026"
              ]
            },
            {
              "label": "Insurance",
              "cells": [
                "Quote from a broker",
                "No credible published premiums found; ask a watersports broker for a quote"
              ]
            }
          ]
        },
        "costsNote": "Manufacturer prices exclude freight, preparation and taxes. Ask the dealer about fleet or outfitter programs: BRP publishes one for Sea-Doo, without prices.",
        "prices": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "30 minutes · Spain",
              "cells": [
                "€82 median (€60–85)",
                "Solnow data · Grupo Marina Jets, 8 bases in Spain, 2026 season"
              ]
            },
            {
              "label": "1 hour · Spain",
              "cells": [
                "€130 median (€112–140)",
                "Solnow data · Grupo Marina Jets, 8 bases in Spain, 2026 season"
              ]
            },
            {
              "label": "30 min / 1 hour · Spain, list prices",
              "cells": [
                "€90–110 / €130–190",
                "Solnow · rates set by jet ski operators in Spain (2 for 30 min, 3 for 1 h), 2026"
              ]
            },
            {
              "label": "30 min / 1 hour · US",
              "cells": [
                "$60–90 / $80–150",
                "getmyboat.com, July 2026 (planning baseline)"
              ]
            }
          ]
        },
        "example": {
          "type": "table",
          "columns": [
            "Figure",
            "Source"
          ],
          "rows": [
            {
              "label": "Two 30-minute rides in one hour",
              "cells": [
                "2 × €82 = €164",
                "Solnow data · Grupo Marina Jets, 8 bases in Spain, 2026 season"
              ]
            },
            {
              "label": "One 1-hour ride",
              "cells": [
                "€130",
                "Solnow data · Grupo Marina Jets, 8 bases in Spain, 2026 season"
              ]
            },
            {
              "label": "Rides to equal the price of a GTI 130 (US)",
              "cells": [
                "$12,299 ÷ $60–90 = 137–205 rides of 30 min",
                "sea-doo.brp.com + getmyboat.com"
              ]
            }
          ]
        },
        "exampleResult": "Filled back to back, 30-minute slots bring in about 26% more per craft-hour than 1-hour rides, before the turnaround time between riders. And because almost four fifths of the season falls in July and August, those two months have to pay for most of the year."
      },
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
          a: 'It depends on new or used craft, the site and its fees, and the insurance your location requires. The startup-costs table above lists the published craft prices we could check; insurance and site fees have to be quoted for your location, and the template has a line for each.',
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
    checklist: {
      title: 'Jet Ski Safety Checklist for Rental Operators (Free PDF)',
      description:
        'The safety checklist a jet ski rental runs on every ride: the craft before launch, the renter, the briefing and the return. Free printable PDF for operators.',
      h1: 'Jet ski safety checklist for rental operators',
      lede:
        'A jet ski safety checklist for a rental business has four parts: the craft before it launches (hull, fuel, engine, kill-switch lanyard), the renter (age and any licence your location requires, life jacket fit), the briefing (controls, riding zone, return signal) and the return (time, damage, fuel). Run it the same way on every ride and keep a record of it, because that record is what shows how you operate when something goes wrong. Download the printable checklist below.',
      craft: [
        'Hull: no cracks or new damage since the last ride; drain plugs in.',
        'Engine starts and idles normally; no fuel smell in the engine compartment.',
        'Fuel enough for the slot plus a reserve.',
        'Kill-switch lanyard present and working: the engine stops when it is pulled.',
        'Throttle and handlebar move freely and return to neutral.',
        'Required equipment on board for your location, such as a whistle or a fire extinguisher.',
      ],
      renter: [
        'Age and any licence or boater card required where you operate, checked against an ID.',
        'Rental agreement and waiver signed, by the driver and by every passenger.',
        'Life jacket of the right size, fastened and adjusted, for everyone on board.',
        'Not under the influence of alcohol or drugs.',
        'Number of people on the craft within its rated capacity.',
      ],
      renterVerify: 'Minimum age, licence/boater-education rules and required on-board equipment for jet ski rental vary by country and state. Confirm with the local authority.',
      briefing: [
        'Controls: throttle, how to stop the engine, and that a jet ski needs throttle to steer.',
        'Lanyard attached to the driver\u2019s wrist or life jacket at all times.',
        'The riding zone, its limits, and the distance to keep from swimmers, other boats and the shore.',
        'How to reboard after a fall, and what to do if the engine stops.',
        'The return time and the signal staff use to call riders back.',
      ],
      onReturn: [
        'Return time recorded; late returns noted under the rental agreement.',
        'Craft checked for new damage, with photos if there is any.',
        'Fuel level recorded and the craft refuelled for the next slot.',
        'Any incident during the ride written down while the renter is still there.',
      ],
      dato: [
        {
          type: 'stats',
          items: [
            { value: '7,500+', label: 'passengers boarded with a QR scan in one month, each check-in recorded against its booking.' },
            { value: '36%', label: 'of customers reach the pontoon with the agreement already signed from home.' },
          ],
        },
        { type: 'p', text: `${MARINAJETS}. Production data, August 2026. When the renter checks are done before the customer reaches the pontoon, the briefing is the only thing left at the dock.` },
      ],
      faq: [
        {
          q: 'Who should fill in the checklist?',
          a: 'The person who launches the craft. The point is that the same checks happen on every ride, whoever is on shift, and that each one leaves a record.',
        },
        {
          q: 'Paper or digital?',
          a: 'Either works if it is done every time. Digital makes the record searchable by craft, renter and date; paper is fine as long as it is filed with the booking.',
        },
        {
          q: 'Does the checklist replace the rental agreement?',
          a: 'No. The agreement sets the terms of the rental; the checklist records that the craft and the renter were checked before launch. You need both.',
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
        'Guided tours: caves, sunsets or nature routes sell per person for about twice what the same hours of rental earn per paddler.',
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
      numbers: {
        "data": [
          {
            "type": "stats",
            "items": [
              {
                "value": "€25–30",
                "label": "per hour for a double kayak; €50 for two hours."
              },
              {
                "value": "€45–50",
                "label": "per person for a 2 to 3-hour guided kayak tour."
              }
            ]
          },
          {
            "type": "p",
            "text": "Source: rates set in Solnow by two kayak and paddle board operators in Spain (Costa Blanca and Castellón), 2026 season. A guided tour sells per person for about what a double kayak earns in two hours."
          }
        ],
        "costs": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Single sit-on-top kayak (Perception)",
              "cells": [
                "$559–899",
                "confluenceoutdoor.com, Oct 2026"
              ]
            },
            {
              "label": "Tandem sit-on-top kayak (Perception)",
              "cells": [
                "$799–1,249",
                "confluenceoutdoor.com, Oct 2026"
              ]
            },
            {
              "label": "Tandem sit-on-top (Feelfree Gemini)",
              "cells": [
                "$749",
                "feelfreeus.com, Oct 2026"
              ]
            },
            {
              "label": "Insurance",
              "cells": [
                "Quote from a broker",
                "No credible published premiums found; ask a watersports broker for a quote"
              ]
            }
          ]
        },
        "costsNote": "Manufacturer retail prices; paddles, seats and life jackets are extra.",
        "prices": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Double kayak · 1 h · Spain",
              "cells": [
                "€25–30",
                "Solnow · rates of two operators in Spain, 2026"
              ]
            },
            {
              "label": "Double kayak · 2 h · Spain",
              "cells": [
                "€50",
                "Solnow · one operator on the Costa Blanca, 2026"
              ]
            },
            {
              "label": "Guided tour · per person · Spain",
              "cells": [
                "€45–50",
                "Solnow · rates of two operators in Spain, 2026"
              ]
            },
            {
              "label": "Single / double · 1 h · Mallorca",
              "cells": [
                "€16 / €27",
                "barcelo.com listing, one operator, Oct 2026"
              ]
            },
            {
              "label": "Single / double · 1 h · US",
              "cells": [
                "$15–30 / $20–40",
                "Three operators in FL, VA and MA (published rates, Oct 2026)"
              ]
            }
          ]
        },
        "example": {
          "type": "table",
          "columns": [
            "Figure",
            "Source"
          ],
          "rows": [
            {
              "label": "Tandem kayak (Perception Rambler 13.5 T)",
              "cells": [
                "$799",
                "confluenceoutdoor.com"
              ]
            },
            {
              "label": "Double kayak rental, 1 hour (US)",
              "cells": [
                "$20–40",
                "Published rates of three US operators"
              ]
            },
            {
              "label": "Rental hours to equal its price",
              "cells": [
                "$799 ÷ $20–40 = 20–40 hours",
                "Calculated"
              ]
            }
          ]
        },
        "exampleResult": "A double kayak pays for itself in a few busy weekends; the margin then depends on how many hours each unit is out and on how many guided tours you add, not on the hourly price."
      },
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
    contrato: {
      title: 'Kayak Rental Agreement Template (Free PDF): Clauses Every Operator Needs',
      description:
        'Free kayak and paddle board rental agreement template: renter details, equipment, deposit, paddling zone, return time, declarations, release and signatures for every paddler.',
      h1: 'Kayak rental agreement template',
      lede:
        'A kayak rental agreement identifies the renter and the equipment, sets the rental period, price and deposit, records the paddling zone and the return time, collects the renter\u2019s declarations (can swim, will wear a life jacket) and an acknowledgement of risk, and is signed by every paddler, or by a guardian for minors. Below is a free PDF template with those clauses, built for kayak and paddle board rentals, and how to get it signed before customers reach the beach.',
      includes: [
        'Renter: name, ID, phone and an emergency contact.',
        'Equipment: each kayak or board by number, with paddles, life jackets and extras.',
        'Period: start time and agreed return time.',
        'Price, payment and deposit, and what the deposit covers.',
        'Paddling zone and the conditions under which staff call everyone back.',
        'Renter declarations: can swim, fit to paddle, no alcohol, will wear the life jacket.',
        'Acknowledgement of risk and release, within what the law allows.',
        'Signature of every adult paddler, and of a guardian for each minor.',
      ],
      forgotten: [
        'Doubles: both paddlers sign, not just the one who paid.',
        'Lost or damaged paddles, leashes and dry bags: what each one costs.',
        'Wind and swell: staff can end the rental early, and what happens to the price.',
        'Late return: how it is charged and how you check that everyone came back.',
      ],
      release: {
        text: 'A release clause records that the renter accepted the inherent risks of paddling. How far it protects you depends on where you operate: some places uphold clear recreational releases, others limit them, and in many jurisdictions no clause excludes liability for your own negligence. Keep the release, but do not rely on it instead of insurance and good operating practice.',
        verify: 'Enforceability of liability releases in rental agreements varies by US state and is limited under EU/UK consumer law. Confirm with a legal advisor for each market.',
      },
      steps: [
        'Add your company details, prices and deposit once.',
        'Mark the paddling zone and the return time on every agreement.',
        'Record each unit by number, with the paddles and life jackets that go with it.',
        'Have every adult paddler sign, and a guardian sign for each minor.',
        'File the agreement with the booking, and check the equipment back in against it.',
      ],
      fields: [
        ['Rental company', 'Legal name · address · phone'],
        ['Renter', 'Full name · ID/Passport · phone · emergency contact'],
        ['Equipment', 'Kayak / board no. · type (single, double, SUP) · paddles · life jackets · extras'],
        ['Period', 'Date · start time · agreed return time'],
        ['Price and deposit', 'Amount · payment method · deposit held'],
        ['Paddling zone', 'Area and limits shown to the renter'],
      ],
      clauses: [
        ['1. Rental', 'The rental company provides the equipment listed above for the agreed period. The renter returns it at the agreed time, at the same place and in the same condition.'],
        ['2. Price and deposit', 'The renter pays the agreed price. The deposit covers loss of or damage to the equipment and late return, and is refunded on return less any amounts due.'],
        ['3. Paddling zone and conditions', 'The renter stays within the zone shown and returns immediately if called back by staff or if wind or sea conditions change. Staff may end the rental early for safety reasons.'],
        ['4. Renter declarations', 'The renter declares that they can swim, are fit to paddle, are not under the influence of alcohol or drugs, will wear the life jacket provided at all times and have received the safety briefing.'],
        ['5. Equipment', 'The renter is responsible for the equipment during the rental and pays for loss or damage caused by misuse, according to the price list displayed.'],
        ['6. Acknowledgement of risk', 'The renter acknowledges the inherent risks of paddling, including capsizing, cold water, wind and currents, and, to the extent permitted by applicable law, accepts them. Nothing in this agreement limits liability that cannot be excluded by law.'],
        ['7. Minors', 'A minor may only paddle with the written consent of a parent or legal guardian, who signs this agreement on their behalf.'],
        ['8. Data protection', 'Personal data is processed to manage the rental and meet legal obligations, in accordance with applicable data protection law.'],
      ],
      faq: [
        {
          q: 'Does every paddler need to sign?',
          a: 'Every adult on the water should sign their own agreement or be listed and sign on the same one; for a double kayak that means both paddlers. A guardian signs for each minor.',
        },
        {
          q: 'Is a release in the agreement enough to protect me?',
          a: 'No. It records that the renter accepted the risks, but how far it holds depends on where you operate, and it will not cover your own negligence. Insurance and a consistent safety routine do that work.',
          verify: 'Scope of liability releases by jurisdiction. Confirm with a legal advisor.',
        },
        {
          q: 'Can customers sign it on their phone?',
          a: 'Yes. Electronic signatures are accepted for this kind of agreement in many places; with Solnow customers sign when they book or from a QR code at the stand, and the agreement is filed with the booking.',
          verify: 'Validity of electronic signatures for rental agreements and waivers by jurisdiction (e.g. ESIGN/UETA in the US, eIDAS in the EU). Confirm.',
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
      numbers: {
        "data": [
          {
            "type": "stats",
            "items": [
              {
                "value": "€745",
                "label": "median price of a half-day charter (3–5 h); middle half €540–875."
              },
              {
                "value": "€1,340",
                "label": "median price of a full-day charter (6–8 h); middle half €1,000–2,075."
              },
              {
                "value": "86%",
                "label": "of those charters go out with a skipper."
              }
            ]
          },
          {
            "type": "p",
            "text": "Source: 176 charter prices quoted through Solnow by 9 operators in Spain in 2026. 95% of the trips fall between May and September, with June the busiest month."
          }
        ],
        "costs": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Berth, Port de Pollença (Mallorca) · low season, Oct–May",
              "cells": [
                "€0.485 per m² per day",
                "Official maximum tariff, BOIB, January 2025"
              ]
            },
            {
              "label": "Berth, Port de Pollença · high season, Jun–Sep",
              "cells": [
                "€1.298 per m² per day",
                "Official maximum tariff, BOIB, January 2025"
              ]
            },
            {
              "label": "Skipper day rate",
              "cells": [
                "No official source",
                "Only single-operator listings found; ask local skippers"
              ]
            },
            {
              "label": "Insurance",
              "cells": [
                "Quote from a broker",
                "No credible published premiums found; ask a watersports broker for a quote"
              ]
            }
          ]
        },
        "costsNote": "Berth tariffs vary by marina; most Balearic ports publish theirs in the official gazette (BOIB).",
        "prices": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Half day (3–5 h) · Spain",
              "cells": [
                "€745 median (€540–875)",
                "Solnow · 51 quotes, 7 operators in Spain, 2026"
              ]
            },
            {
              "label": "Full day (6–8 h) · Spain",
              "cells": [
                "€1,340 median (€1,000–2,075)",
                "Solnow · 112 quotes, 5 operators in Spain, 2026"
              ]
            }
          ]
        },
        "example": {
          "type": "table",
          "columns": [
            "Figure",
            "Source"
          ],
          "rows": [
            {
              "label": "Berth of 48 m² (e.g. 12 × 4 m), Jun–Sep (122 days)",
              "cells": [
                "48 × €1.298 × 122 = €7,601",
                "Official tariff, Port de Pollença"
              ]
            },
            {
              "label": "Same berth, Oct–May (243 days)",
              "cells": [
                "48 × €0.485 × 243 = €5,657",
                "Official tariff, Port de Pollença"
              ]
            },
            {
              "label": "Berth for a year",
              "cells": [
                "€13,258",
                "Calculated"
              ]
            },
            {
              "label": "Full-day charters to cover it",
              "cells": [
                "€13,258 ÷ €1,340 = about 10",
                "Solnow median, Spain 2026"
              ]
            }
          ]
        },
        "exampleResult": "At the maximum official tariff, ten median full-day charters pay one boat’s berth for the year; insurance, maintenance, skippers and financing come on top. The berth size is an example: use your own boat’s."
      },
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

  parasailing: {
    id: 'parasailing',
    business: 'parasailing',
    unit: 'parasail boat',
    units: 'parasail boats',
    plan: {
      title: 'How to Start a Parasailing Business: Business Plan & Insurance',
      description:
        'What it takes to start a parasailing business: winch boat, canopies, a licensed captain, flying area, wind policy, insurance and a flight-based business plan. Free plan template.',
      h1: 'How to start a parasailing business',
      lede:
        'To start a parasailing business you need a winch boat built or converted for parasail, canopies and harnesses rated for the flight combinations you will sell, a licensed captain and deck crew, an area where you are allowed to fly, and insurance written specifically for parasail operations. The money is made per flight: each boat runs a rotation of single, tandem and triple flights, and the wind decides how many scheduled slots actually fly. The business plan template below is built around that rotation, and the insurance section covers what to ask before you buy the boat.',
      ledeVerify:
        'Captain licensing for carrying paying passengers, where parasailing may operate and the availability of parasail-specific insurance vary by country and state. Confirm before publishing.',
      formula:
        'Daily revenue ≈ boats × hours you can fly × flights per hour per boat × average flyers per flight × price per flyer, plus observer seats and photo or video packages. The rotation (launch, flight, winch-in, swap flyers) sets flights per hour; the wind sets how many of the scheduled hours you actually fly.',
      drivers: [
        'Rotation time: every minute saved between winch-in and the next launch is another flight in the afternoon.',
        'Flight mix: tandem and triple flights put more paying flyers on the same rope time as a single.',
        'Weight limits: groups whose combined weight is outside the canopy range have to be split, which costs a slot.',
        'Observer seats and photos: passengers who ride but do not fly fill deck space you are already paying to run.',
        'Wind days: a gusty afternoon cancels a full boat, so a fast rebooking routine protects revenue already sold.',
        'Fuel per rotation: the boat runs under load for the whole flight, so fuel is a real cost per flight.',
      ],
      startupCosts: [
        'Parasail boat with winch and flight deck, new or converted, plus a survey before purchase.',
        'Canopies for light and stronger wind, harnesses, spreader bars and towlines, with spares.',
        'A replacement schedule for towlines and webbing, budgeted as a running cost.',
        'Captain and deck crew, their licences and training.',
        'Wind meter, radios, life jackets for flyers and observers, first aid and rescue equipment.',
        'Berth or dock, and a booking booth where customers check in and are weighed.',
        'Insurance written for parasail operations.',
        'Booking system that records each flyer\'s weight and signed waiver before boarding.',
      ],
      steps: [
        'Confirm where you may operate and fly, and what the authority requires of parasail operators there.',
        'Hire or become the licensed captain, and train deck crew on launch, recovery and emergency procedures.',
        'Get insurance quotes before you buy the boat: some insurers will only cover certain boats and equipment.',
        'Buy or convert the boat and the flight equipment, and follow the manufacturer\'s limits for each canopy.',
        'Write the wind go/no-go policy and the weight limits per flight combination before the first booking.',
        'Set up booking that captures weight, flight type and the signed waiver for every flyer.',
        'Agree commissions with hotels and beach agents: parasailing sells heavily through them.',
      ],
      permits: {
        text: 'Parasail operators are usually regulated twice: as a passenger-carrying boat, which brings captain licensing and boat inspection, and as an activity, which can bring rules on where you fly, wind limits and equipment standards. Confirm both with the maritime authority where you operate before you commit to a boat.',
        verify: 'Parasail regulation (captain licensing, vessel inspection, flying areas, wind limits, standards such as ASTM F3099 in the US) varies by country and state. Confirm with a maritime advisor.',
      },
      dato: {
        h: 'Our data: parasailing sells on WhatsApp, at night too',
        blocks: [
          {
            type: 'feature',
            tone: 'ink',
            value: '70%',
            label: 'of night-time sales turns',
            text: `are handled by the AI at ${MARINAJETS}, which sells parasailing alongside jet skis and towables; it replies in 9 seconds against 1 h 50 for a person. Group-wide figure, not parasailing alone. Production data, August 2026.`,
          },
        ],
      },
      benchmark:
        'Portfolio benchmark for the plan: average flyers per flight and share of tandem/triple flights across Solnow parasailing operators. Pull from the production database only with explicit approval; do not estimate.',
      numbers: {
        "data": [
          {
            "type": "stats",
            "items": [
              {
                "value": "€60",
                "label": "median ticket per parasailing booking (middle half €50–120)."
              },
              {
                "value": "58%",
                "label": "of bookings sold at the booth on the dock; 18% on the online booking engine."
              },
              {
                "value": "76%",
                "label": "of the season’s bookings in July and August."
              }
            ]
          },
          {
            "type": "p",
            "text": "Source: 1,572 paid parasailing bookings at Grupo Marina Jets (Spain) in the 2026 season, from Solnow. A booking can include more than one flyer."
          }
        ],
        "costs": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Commercial parasail canopy (35–52 ft)",
              "cells": [
                "C$5,785–10,728",
                "Canadian Aerosports 2024 price list"
              ]
            },
            {
              "label": "Winch boat, used (2019 OceanPro 35, USCG-certified for 15)",
              "cells": [
                "$235,000 asking",
                "One listing, denisonyachtsales.com, Aug 2026"
              ]
            },
            {
              "label": "New winch boat",
              "cells": [
                "No published price",
                "Builders quote on request"
              ]
            },
            {
              "label": "Insurance",
              "cells": [
                "Quote from a broker",
                "No credible published premiums found; ask a watersports broker for a quote"
              ]
            }
          ]
        },
        "costsNote": "Harness, bar and towline are priced separately from the canopy.",
        "prices": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Per booking · Spain",
              "cells": [
                "€60 median (€50–120)",
                "Solnow data · Grupo Marina Jets, 8 bases in Spain, 2026 season"
              ]
            },
            {
              "label": "Single / tandem / triple · Benidorm",
              "cells": [
                "€80 / €120 / €180",
                "comunitatvalenciana.com, one operator, Oct 2026"
              ]
            },
            {
              "label": "Per flyer by height · Clearwater, FL",
              "cells": [
                "$91–115",
                "aaa.com listing, Oct 2026"
              ]
            },
            {
              "label": "Flyer / observer · Destin, FL",
              "cells": [
                "$67.80 / $50.85",
                "greetwell.com listing, Oct 2026"
              ]
            }
          ]
        },
        "example": {
          "type": "table",
          "columns": [
            "Figure",
            "Source"
          ],
          "rows": [
            {
              "label": "Used winch boat (one listing)",
              "cells": [
                "$235,000",
                "denisonyachtsales.com"
              ]
            },
            {
              "label": "Price per flyer, Clearwater",
              "cells": [
                "$91–115",
                "aaa.com"
              ]
            },
            {
              "label": "Flyers to equal the boat’s price",
              "cells": [
                "$235,000 ÷ $91–115 = about 2,000–2,600",
                "Calculated"
              ]
            }
          ]
        },
        "exampleResult": "The boat is the investment that decides the plan: it takes a couple of thousand flyers just to equal the price of one used boat, before captain, fuel, insurance and canopy replacement. That is why rotation time and tandem or triple flights matter so much."
      },
      planSections: [
        'Flight rotation and capacity: rotation time per boat, flights per hour, flyers per flight.',
        'Price tiers: single, tandem, triple, observer, photo or video package.',
        'Flying calendar: months and hours with usable wind, and the share of days you expect to cancel.',
        'Equipment replacement: towlines, webbing and canopies on a schedule, as a yearly cost.',
        'Captain availability: who skippers each boat every day of the season.',
        'Sales channels: walk-up at the booth, hotels and beach agents (with their commission), online.',
      ],
      insuranceSection: {
        intro:
          'Parasail insurance is specialist cover: ask a broker who already insures parasail operators, and get quotes before you buy the boat, because the insurer may set conditions on the boat, the winch and the flight equipment.',
        covers: [
          'Marine liability for passengers, including flyers while they are in the air, not only on deck.',
          'Hull and machinery for the boat, and cover for the winch, canopies and towlines.',
          'Liability to third parties: swimmers, other boats, the shore.',
          'Crew cover: employer\'s liability or the maritime equivalent for captain and deck hands.',
        ],
        coversVerify: 'Whether flyers count as passengers, and the names and availability of each cover, depend on the jurisdiction and the insurer. Confirm with a broker.',
        insurerAsks: [
          'The captain\'s licence and the crew\'s training.',
          'The maintenance and replacement log for towlines, winch and canopies.',
          'Your wind limit, how you measure it and who decides to stop flying.',
          'How flyers are weighed and how the flight combination is chosen.',
          'Signed waivers for every flyer, including guardians for minors.',
        ],
      },
      faq: [
        {
          q: 'How many flights can one boat do a day?',
          a: 'It depends on your rotation time, the hours you can fly and the wind. Time a full rotation (launch, flight, winch-in, swap) on your boat and work out flights per hour from that; the template has a sheet for it. We do not publish an average we cannot back.',
        },
        {
          q: 'Do I need a captain\'s licence to run a parasail boat?',
          a: 'In most places, carrying paying passengers requires a licensed captain, and parasailing may add its own requirements. Confirm with the maritime authority where you will operate.',
          verify: 'Captain licensing for commercial parasailing by jurisdiction. Confirm.',
        },
        {
          q: 'Is parasailing profitable?',
          a: 'It can be when the boat flies full rotations through the windy season and tandem and triple flights fill the rope time. The costs that decide it are the boat, the captain, insurance and equipment replacement; test them in the template with your own numbers.',
        },
      ],
    },
    related: [
      { label: 'Parasailing booking software', slug: 'software-reservas-parasailing' },
      { label: 'Case study: Grupo Marina Jets', slug: 'caso-de-exito-marinajets' },
      { label: 'Answer WhatsApp 24/7 with AI', slug: 'whatsapp-reservas-motos-de-agua' },
    ],
  },

  'paddle-surf': {
    id: 'paddle-surf',
    business: 'paddle board rental',
    unit: 'paddle board',
    units: 'paddle boards',
    plan: {
      title: 'How to Start a Paddle Board Rental Business: Business Plan & Insurance',
      description:
        'Starting a paddle board (SUP) rental: sheltered water, inflatable vs hard boards, lessons and tours, wind days, insurance and a business plan template made for SUP.',
      h1: 'How to start a paddle board rental business',
      lede:
        'To start a paddle board rental business you need sheltered water where you are allowed to rent, a fleet of boards in a few sizes (inflatable, hard or a mix) with adjustable paddles, leashes and life jackets, insurance that covers both rentals and lessons, and a sign-and-go routine at the stand. Many renters are first-timers, so lessons, guided tours and classes such as SUP yoga often earn more per hour than plain rentals, and offshore wind is the condition that closes the water. The business plan and insurance sections below are written for SUP.',
      formula:
        'Revenue ≈ (boards × rentable hours × utilization × price per hour) + lessons and classes (places × price) + guided tours, over the days the wind allows. A board is cheap to buy; the stand, staff, storage and the days you cannot open are what decide the year.',
      drivers: [
        'Lessons and classes: a lesson sells for about twice an hour\u2019s rental on the same board.',
        'Offshore wind: it is the condition that blows beginners away from shore, so it closes the stand and caps the season.',
        'Board choice: inflatables travel and store easily and survive drops; hard boards glide better but ding and need racks.',
        'Sizes: a light renter on a big board or a heavy renter on a small one ends the rental early.',
        'Fixed stand or mobile: a van that delivers boards to lakes and events reaches more water with the same fleet.',
        'Small losses: paddles, fins and leashes go missing unless they are listed on the agreement.',
      ],
      startupCosts: [
        'Boards in two or three sizes, inflatable or hard, plus spare fins.',
        'Adjustable paddles, leashes, life jackets in every size, and pumps for inflatables.',
        'Racks, a storage unit, and a trailer or van if you operate from more than one spot.',
        'Stand or booth, and the permit or concession for the launch spot.',
        'Instructor certification for whoever teaches lessons and classes.',
        'Wetsuits if the water is cold in your shoulder season.',
        'Insurance covering rentals, lessons and classes.',
        'Booking and waiver system that works from a QR code at the stand.',
      ],
      steps: [
        'Choose water that is sheltered from offshore wind, and get permission to rent there.',
        'Decide inflatable, hard or a mix, and buy sizes for the renters you expect.',
        'Certify at least one instructor before you sell lessons.',
        'Design the formats: hourly rental, beginner lesson, guided tour, sunset or yoga session.',
        'Get insurance that names every format you sell.',
        'Set up booking and waivers so renters sign before they reach the water, or at the stand from a QR code.',
        'Write the wind rule (who closes the stand and when) and the rebooking policy.',
      ],
      permits: {
        text: 'Depending on where you operate, a paddle board can count as a vessel, which brings its own rules on life jackets and safety equipment; renting from a beach or lake usually needs a permit or concession; and teaching may require a recognised instructor certification. Confirm all three locally before the season.',
        verify: 'Whether a SUP counts as a vessel (e.g. US Coast Guard rules outside swimming/surfing areas), required equipment, rental permits and instructor certification vary by country and local authority. Confirm.',
      },
      dato: {
        h: 'Our data',
        blocks: [
          {
            type: 'pending',
            text: 'Own data for SUP: e.g. share of revenue from lessons and classes vs rentals, or share of renters signing before they arrive, from a Solnow paddle board operator. We have no SUP client with publishable data yet; do not reuse kayak or jet ski figures.',
          },
        ],
      },
      benchmark:
        'Portfolio benchmark for the plan: average price per board-hour and lesson share across Solnow paddle board operators. Pull from the production database only with explicit approval; do not estimate.',
      numbers: {
        "data": [
          {
            "type": "stats",
            "items": [
              {
                "value": "€10",
                "label": "for 30 minutes on a paddle board (two operators); €15 for an hour."
              },
              {
                "value": "€30",
                "label": "for a paddle board lesson."
              }
            ]
          },
          {
            "type": "p",
            "text": "Source: rates set in Solnow by paddle board operators in Castellón, Spain, 2026 season. A lesson sells for twice an hour’s rental on the same board."
          }
        ],
        "costs": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Inflatable boards (Tower)",
              "cells": [
                "$349–549",
                "towerpaddleboards.com, Oct 2026"
              ]
            },
            {
              "label": "Fleet discount (Tower, 5+ boards)",
              "cells": [
                "$30 off per board",
                "towerpaddleboards.com, Oct 2026"
              ]
            },
            {
              "label": "Insurance",
              "cells": [
                "Quote from a broker",
                "No credible published premiums found; ask a watersports broker for a quote"
              ]
            }
          ]
        },
        "costsNote": "Inflatable boards usually ship with paddle, pump and leash; check what each package includes.",
        "prices": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Paddle board · 30 min / 1 h · Spain",
              "cells": [
                "€10 / €15",
                "Solnow · two operators (30 min) and one (1 h) in Castellón, 2026"
              ]
            },
            {
              "label": "Paddle board · 1 h · Mallorca / Barcelona",
              "cells": [
                "€16 / €15",
                "barcelo.com and guruwalk.com listings, Oct 2026"
              ]
            },
            {
              "label": "Lesson · Spain",
              "cells": [
                "€30",
                "Solnow · one operator in Castellón, 2026"
              ]
            },
            {
              "label": "Paddle board · 1 h · US",
              "cells": [
                "$20–35",
                "Three operators in FL, VA and MA (published rates, Oct 2026)"
              ]
            }
          ]
        },
        "example": {
          "type": "table",
          "columns": [
            "Figure",
            "Source"
          ],
          "rows": [
            {
              "label": "Inflatable board (Tower Premium)",
              "cells": [
                "$449",
                "towerpaddleboards.com"
              ]
            },
            {
              "label": "Rental, 1 hour (US)",
              "cells": [
                "$20–35",
                "Published rates of three US operators"
              ]
            },
            {
              "label": "Rental hours to equal its price",
              "cells": [
                "$449 ÷ $20–35 = 13–22 hours",
                "Calculated"
              ]
            }
          ]
        },
        "exampleResult": "A board pays for itself in a couple of busy weeks. What decides the year is how many days the wind lets you open and how much of the revenue comes from lessons and classes."
      },
      planSections: [
        'Fleet by type and size, with the expected life of each board.',
        'Formats and schedule: rentals, lessons, tours and classes, with places and prices.',
        'Wind calendar: months, and the share of days you expect offshore wind to close the stand.',
        'Fixed stand or mobile: the van, the trailer and the spots you will serve.',
        'Instructor cost: certification, hours and who covers lessons on busy days.',
        'Small-equipment budget: paddles, fins and leashes lost or broken each season.',
      ],
      insuranceSection: {
        intro:
          'For SUP, the format you sell changes the cover: an insurer looks differently at an unsupervised rental, a lesson with an instructor and a yoga class on the water. List every format when you ask for a quote.',
        covers: [
          'General liability for rentals: injury or damage to others caused by renters.',
          'Professional or instructor liability for lessons, tours and classes.',
          'Equipment cover for boards and paddles against theft from the beach and storm damage.',
          'Vehicle cover for the van or trailer if you deliver boards.',
        ],
        coversVerify: 'Names, scope and availability of each cover depend on the jurisdiction and the insurer. Confirm with a broker.',
        insurerAsks: [
          'Which formats you sell, and whether classes such as SUP yoga are included.',
          'Instructor certifications and the instructor-to-participant ratio.',
          'Your leash and life jacket policy.',
          'Your offshore wind rule and the area renters may paddle in.',
          'Signed waivers for every participant, including guardians for minors.',
        ],
      },
      faq: [
        {
          q: 'Inflatable or hard paddle boards for a rental fleet?',
          a: 'Inflatables are easier to transport, store and repair, and they survive being dropped; hard boards are faster and more stable for experienced paddlers but ding and need racks. Many rentals start with inflatables and add a few hard boards for tours.',
        },
        {
          q: 'Do I need to offer lessons?',
          a: 'You can rent without them, but beginners who take a lesson stay out longer and come back. If you teach, certify the instructor and make sure the insurance names lessons.',
          verify: 'Instructor certification and insurance requirements for SUP lessons by jurisdiction. Confirm.',
        },
        {
          q: 'How long is the paddle board season?',
          a: 'It is set by water temperature and wind where you operate, not by the calendar. The template has a sheet to forecast it month by month.',
        },
      ],
    },
    related: [
      { label: 'How to start a kayak rental business', slug: 'how-to-start-a-kayak-rental-business' },
      { label: 'Digitize the front desk', slug: 'digitalizar-mostrador-alquiler-motos-de-agua' },
      { label: 'Best watersports booking software compared', slug: 'mejores-software-reservas-actividades-acuaticas' },
    ],
  },

  hinchables: {
    id: 'hinchables',
    business: 'inflatable water park',
    article: 'an',
    unit: 'module',
    units: 'inflatable modules',
    plan: {
      title: 'How to Start an Inflatable Water Park: Business Plan & Insurance',
      description:
        'Starting an inflatable (floating) water park: water concession, modules and anchoring, lifeguards, timed sessions, insurance and a business plan template for floating parks.',
      h1: 'How to start an inflatable water park business',
      lede:
        'To start an inflatable water park you need a stretch of water where you are allowed to anchor a floating course for the season, modules and an anchoring system from a manufacturer, lifeguards on every session, and liability insurance that covers people on the course. The park sells timed sessions to a capped number of people, so revenue depends on how many sessions you fill each day, while most of the investment comes before the first ticket: modules, anchoring and installation. The business plan and insurance sections below follow that model.',
      ledeVerify:
        'Water-space permits, lifeguard requirements and liability insurance for floating parks vary by country and local authority. Confirm before publishing.',
      formula:
        'Daily revenue ≈ sessions per day × capacity per session × fill rate × price per person, plus groups, birthday parties and season passes. Installation, removal, anchoring and the season\'s lifeguard rota are fixed whether the sessions fill or not.',
      drivers: [
        'Fill rate on weekdays: weekends sell out, and the season is made or lost on the weekday sessions.',
        'Capacity per session: set by the course and by how many lifeguards are on the water, not by demand.',
        'Session length: shorter sessions mean more turns per day but more changeover time.',
        'Groups: schools, summer camps and parties fill weekday mornings at a fixed price.',
        'Water temperature and weather: they set the opening and closing dates and close sessions on bad days.',
        'Wear and repairs: punctures and UV damage take modules out of the course mid-season.',
      ],
      startupCosts: [
        'Inflatable modules for the course layout, from a manufacturer with installation guidance.',
        'Anchoring and mooring system for the site\'s depth and bottom.',
        'Installation and removal each season, and winter storage for the modules.',
        'Blowers or compressors and repair kits.',
        'Life jackets in every size, rescue boards and first aid.',
        'Lifeguards: certification, uniforms and a full-season rota.',
        'Water concession and permits, and insurance.',
        'Booth, lockers and a booking and waiver system with guardian consent for minors.',
      ],
      steps: [
        'Find the water and get the concession or permit to anchor there for the season.',
        'Choose the manufacturer and layout, and take their capacity, depth and age guidance as your limits.',
        'Plan lifeguard staffing per session before you set session sizes.',
        'Get liability insurance for participants on the course before installation.',
        'Install and anchor following the manufacturer\'s instructions, and keep a daily inspection log.',
        'Set the session grid and capacity, and sell groups and parties for weekday mornings.',
        'Have every participant sign a waiver, with a guardian signing for each minor, before they reach the booth.',
      ],
      permits: {
        text: 'A floating park usually needs permission to occupy the water for the season, has to meet the safety standards that apply to floating inflatable play equipment where you operate, and must be staffed by qualified lifeguards. Each of these comes from a different authority; confirm all of them before you order modules.',
        verify: 'Water-space concessions, applicable safety standards for floating inflatables (e.g. EN 15649 in Europe, ASTM F2374 for inflatable amusement devices in the US), lifeguard qualifications and ratios vary by country and authority. Confirm.',
      },
      dato: {
        h: 'Our data',
        blocks: [
          {
            type: 'pending',
            text: 'Own data for floating parks: e.g. share of participants arriving with the waiver already signed, or weekday vs weekend fill rate, from a Solnow inflatable park operator. We have no inflatable park client with publishable data; do not reuse other activities\' figures.',
          },
        ],
      },
      benchmark:
        'Portfolio benchmark for the plan: average fill rate per session on weekdays vs weekends across Solnow inflatable park operators. Pull from the production database only with explicit approval; do not estimate.',
      numbers: {
        "data": [
          {
            "type": "p",
            "text": "We have no inflatable park among Solnow operators with data we can publish, so this page has no session prices of our own. The equipment prices below are published dealer prices."
          }
        ],
        "costs": {
          "type": "table",
          "columns": [
            "Price",
            "Source"
          ],
          "rows": [
            {
              "label": "Large commercial module (Aquaglide Kaos)",
              "cells": [
                "$6,639.99",
                "barts.com dealer list, Oct 2026"
              ]
            },
            {
              "label": "Smaller modules (Swimstairs XL / Plunge Slide)",
              "cells": [
                "$1,029.99 / $979.99",
                "barts.com dealer list, Oct 2026"
              ]
            },
            {
              "label": "Anchoring: anchor bag set / vertical mooring line",
              "cells": [
                "$114.99 / $113.99",
                "barts.com dealer list, Oct 2026"
              ]
            },
            {
              "label": "Complete park",
              "cells": [
                "Quote only",
                "Manufacturers do not publish complete-park prices"
              ]
            },
            {
              "label": "Insurance",
              "cells": [
                "Quote from a broker",
                "No credible published premiums found; ask a watersports broker for a quote"
              ]
            }
          ]
        },
        "costsNote": "A park is several modules plus anchoring, installation and lifeguards; ask the manufacturer for a quote on your layout."
      },
      planSections: [
        'Course and capacity: modules, layout and the capacity per session the manufacturer and your lifeguards allow.',
        'Session grid: sessions per day, length and changeover time.',
        'Fill-rate forecast: weekdays and weekends, month by month.',
        'Season cost of installing, removing and storing the course.',
        'Lifeguard rota: cost per session and for the season.',
        'Group sales: schools, camps and parties, with their prices.',
      ],
      insuranceSection: {
        intro:
          'For a floating park, the cover that matters most is liability for participants on the course; equipment cover for the modules is the second line. Insurers will want to see how the course is installed, inspected and supervised.',
        covers: [
          'Public or general liability for participants and visitors.',
          'Equipment cover for modules and anchoring against storms, punctures and vandalism.',
          'Employer\'s liability or workers\' compensation for lifeguards and staff.',
          'Business interruption for closures caused by damage to the course.',
        ],
        coversVerify: 'Names, scope and availability of each cover depend on the jurisdiction and the insurer. Confirm with a broker.',
        insurerAsks: [
          'The manufacturer, the installation and who certified the anchoring.',
          'The daily inspection log: inflation, anchors, seams.',
          'Lifeguard qualifications and how many are on the water per session.',
          'Minimum age and height, mandatory life jackets, and the safety briefing before each session.',
          'Signed waivers for every participant, with guardian consent for minors.',
        ],
      },
      faq: [
        {
          q: 'How many people can be on the course at once?',
          a: 'The manufacturer\'s capacity for your layout and the number of lifeguards on the water set the limit. Use the lower of the two for every session.',
          verify: 'Capacity and lifeguard ratio rules for floating parks by jurisdiction. Confirm.',
        },
        {
          q: 'Can young children use an inflatable water park?',
          a: 'Usually with a minimum age or height and a life jacket, as the manufacturer and local rules set. Put the rule on the booking page and the waiver so parents know before they arrive.',
          verify: 'Minimum age/height rules for floating inflatable parks. Confirm.',
        },
        {
          q: 'Is an inflatable water park profitable?',
          a: 'It depends on filling weekday sessions across a season long enough to pay back the modules, installation and lifeguards. The template lets you test the session grid and fill rate with your own numbers.',
        },
      ],
    },
    related: [
      { label: 'Digitize the front desk', slug: 'digitalizar-mostrador-alquiler-motos-de-agua' },
      { label: 'How to start a paddle board rental business', slug: 'how-to-start-a-paddle-board-rental-business' },
      { label: 'Best watersports booking software compared', slug: 'mejores-software-reservas-actividades-acuaticas' },
    ],
  },
};
