/**
 * Plantilla F: quiosco de autoservicio por actividad (solo castellano).
 *
 * Una página por actividad, no una por sinónimo: «quiosco», «tótem», «terminal»,
 * «caja de autopago» o «punto de autoservicio» son la misma búsqueda con otro
 * nombre, y diez páginas casi iguales competirían entre sí. Cada página cubre
 * los diez términos en su título, su tabla de equivalencias y sus FAQ.
 *
 * Lo que se afirma del producto sale de la ficha del TPV (`product.areas.tpv`):
 * modo kiosko en el mismo equipo que el mostrador, navegador sin terminal
 * propietario, disponibilidad compartida, QR y firma. El autopago con tarjeta
 * sin personal no está documentado, así que va con `verify`.
 */

import type { GuideBlock, GuideContent } from '@/content/guides';
import { AUTHOR } from '@/content/seo/plantillas/e';

export type QuioscoId = 'motos-de-agua' | 'parasailing' | 'kayak' | 'barcos' | 'catamaranes' | 'activos';

interface Quiosco {
  id: QuioscoId;
  slug: string;
  /** «para motos de agua», tal cual va detrás de «Quiosco de autoservicio». */
  para: string;
  /** Lo que el quiosco vende en esta actividad: «una moto de agua por franjas». */
  vende: string;
  title: string;
  description: string;
  lede: string;
  /** Por qué en esta actividad el autoservicio tiene sentido (o dónde no). */
  porQue: string[];
  /** El recorrido del cliente en el quiosco, paso a paso. */
  pasos: string[];
  /** Qué sigue necesitando a una persona: el límite honesto del autoservicio. */
  limite: GuideBlock;
  /** Dato propio publicado, o el hueco marcado si no lo hay. */
  dato: GuideBlock[];
  faq: { q: string; a: string; verify?: string }[];
  related: { label: string; slug: string }[];
}

const UPDATED = 'Actualizado · octubre 2026';

/** El dato de cartera que falta, igual en todas hasta tenerlo medido. */
const pendiente = (actividad: string): GuideBlock => ({
  type: 'pending',
  text: `Falta dato propio: porcentaje de ventas sin reserva resueltas en modo kiosko en operadores de ${actividad} de la cartera de Solnow, con periodo y número de bases.`,
});

const AUTOPAGO_VERIFY =
  'Confirmar con producto si el modo kiosko cobra con tarjeta sin personal (datáfono desatendido o pago en el móvil del cliente) antes de prometer «autopago».';

const QUIOSCOS: Record<QuioscoId, Quiosco> = {
  'motos-de-agua': {
    id: 'motos-de-agua',
    slug: 'quiosco-autoservicio-alquiler-motos-de-agua',
    para: 'para motos de agua',
    vende: 'una moto de agua por franjas de 15, 30 o 60 minutos',
    title: 'Quiosco de autoservicio para alquiler de motos de agua (tótem y autopago) | Solnow',
    description:
      'Quiosco, tótem o terminal de autoservicio para alquiler de motos de agua: el cliente elige franja, firma el contrato y recibe su QR sin hacer cola. Funciona en una tablet, sin máquina propia.',
    lede:
      'Un quiosco de autoservicio para motos de agua es una pantalla de cara al cliente —una tablet o un tótem en el pantalán— donde quien llega sin reserva elige la franja y el número de motos, deja sus datos y firma el contrato sin pasar por el mostrador. Con Solnow es el modo kiosko del mismo TPV que usa tu personal: comparte disponibilidad con la web y WhatsApp, así que nunca vende una moto que ya está fuera.',
    porQue: [
      'El cliente sin reserva llega en oleadas: a media mañana y a media tarde se forma la cola justo cuando todo el personal está en el pantalán.',
      'La venta es repetitiva —franja, número de motos, extras— y se presta a resolverla sin ayuda.',
      'Cada conductor tiene que dejar datos y firmar: en el quiosco lo hace mientras espera, no delante del mostrador.',
      'El personal deja de transcribir y se queda en lo que no se automatiza: el briefing, la entrega y la vuelta de las motos.',
    ],
    pasos: [
      'El cliente ve en la pantalla las próximas franjas libres, con el precio de temporada ya aplicado.',
      'Elige franja, número de motos y extras.',
      'Deja los datos de cada conductor y firma el contrato en la pantalla o desde su móvil con el QR.',
      'Recibe el QR de la reserva, con el que se hace el embarque en el pantalán.',
    ],
    limite: {
      type: 'p',
      text: 'La comprobación de la edad y la titulación de quien conduce, y si la moto sale sin titulación solo en circuito balizado o con monitor, la sigue haciendo una persona antes de embarcar. El quiosco recoge los datos; no decide quién puede conducir.',
      verify: 'Requisitos de edad y titulación para conducir motos de agua de alquiler en España (circuito balizado sin titulación): revisar antes de publicar.',
    },
    dato: [
      {
        type: 'p',
        text: 'Grupo Marina Jets, con ocho bases de motos de agua y actividades en el Mediterráneo, ahorró ≈450 horas de trabajo en agosto con Solnow, según su caso de éxito. Es la cifra de todo el sistema, no solo del modo kiosko.',
      },
      pendiente('motos de agua'),
    ],
    faq: [
      {
        q: '¿Puede el cliente alquilar una moto de agua sin hablar con nadie?',
        a: 'Puede elegir franja, dejar sus datos y firmar sin pasar por el mostrador. La entrega de la moto, el briefing de seguridad y la comprobación de quién conduce siguen siendo del personal.',
      },
    ],
    related: [
      { label: 'Cómo digitalizar el mostrador de tu alquiler de motos de agua', slug: 'digitalizar-mostrador-alquiler-motos-de-agua' },
      { label: 'Software para alquiler de motos de agua', slug: 'software-alquiler-motos-de-agua' },
      { label: 'Caso de éxito: Grupo Marina Jets', slug: 'caso-de-exito-marinajets' },
      { label: 'Quiosco de autoservicio para alquiler de barcos', slug: 'quiosco-autoservicio-alquiler-barcos' },
    ],
  },

  parasailing: {
    id: 'parasailing',
    slug: 'quiosco-autoservicio-parasailing',
    para: 'para parasailing',
    vende: 'plazas en el próximo vuelo',
    title: 'Quiosco de autoservicio para parasailing: venta de plazas y exención | Solnow',
    description:
      'Tótem o quiosco de autoservicio para parasailing: el cliente ve los próximos vuelos con plazas, compra la suya y firma la exención en la pantalla. Sin máquina expendedora: funciona en una tablet.',
    lede:
      'Un quiosco de autoservicio para parasailing vende plazas, no unidades: el cliente ve en la pantalla los próximos vuelos con hueco, compra las plazas de su grupo y firma la exención de responsabilidad de cada pasajero antes de subir al barco. Con Solnow es el modo kiosko del TPV, con la capacidad de cada salida compartida con la web, WhatsApp y los colaboradores.',
    porQue: [
      'Cada salida tiene una capacidad fija: el quiosco solo ofrece las plazas que quedan, sin que nadie tenga que contarlas.',
      'Todos los pasajeros tienen que firmar la exención antes de embarcar; hacerlo en el quiosco evita la fila de firmas en el muelle.',
      'Los grupos llegan juntos y deciden rápido: ver la próxima salida libre en la pantalla cierra la venta en el momento.',
    ],
    pasos: [
      'El cliente ve los próximos vuelos y cuántas plazas quedan en cada uno.',
      'Elige salida y número de pasajeros.',
      'Cada pasajero deja sus datos y firma la exención, en la pantalla o en su móvil con el QR.',
      'Recibe el QR de la reserva para embarcar.',
    ],
    limite: {
      type: 'p',
      text: 'Las condiciones de cada vuelo —peso de los pasajeros, menores que vuelan acompañados, si el viento permite salir— las decide la tripulación. El quiosco vende la plaza y recoge las firmas; no autoriza el vuelo.',
      verify: 'Límites de peso y condiciones para menores en parasailing: revisar antes de publicar cualquier cifra.',
    },
    dato: [pendiente('parasailing')],
    faq: [
      {
        q: '¿Qué pasa si se cancela un vuelo por viento?',
        a: 'La salida se cancela o se mueve en el sistema y deja de aparecer en el quiosco. Las reservas afectadas quedan identificadas para recolocarlas en otro vuelo.',
      },
    ],
    related: [
      { label: 'Software de reservas para parasailing', slug: 'software-reservas-parasailing' },
      { label: 'Plantilla de exención de responsabilidad para actividades acuáticas', slug: 'plantilla-exencion-responsabilidad-actividades-acuaticas' },
      { label: 'Quiosco de autoservicio para excursiones en catamarán', slug: 'quiosco-autoservicio-excursiones-catamaran' },
    ],
  },

  kayak: {
    id: 'kayak',
    slug: 'quiosco-autoservicio-alquiler-kayak',
    para: 'para kayak',
    vende: 'kayaks y tablas de paddle surf por horas',
    title: 'Quiosco de autoservicio para alquiler de kayak y paddle surf | Solnow',
    description:
      'Quiosco, tótem o punto de autoservicio para alquiler de kayak y paddle surf: el cliente elige horas, firma el contrato y sale al agua sin esperar al personal. Funciona en una tablet.',
    lede:
      'Un quiosco de autoservicio para alquiler de kayak es una pantalla en la caseta o en la playa donde el cliente elige kayak individual, doble o tabla de paddle surf, las horas que quiere, firma el contrato y recibe su QR sin esperar a que alguien le atienda. En kayak el ticket es bajo y el volumen alto: es la actividad donde más pesa que cada venta no ocupe a una persona.',
    porQue: [
      'Ticket bajo y muchas ventas pequeñas: el tiempo de personal por venta se come el margen si cada alquiler pasa por el mostrador.',
      'La venta es sencilla —tipo de unidad y horas— y el cliente la entiende sin explicación.',
      'En muchas casetas de playa hay una sola persona: si está en el agua ayudando a alguien, el quiosco sigue vendiendo.',
    ],
    pasos: [
      'El cliente elige kayak individual, doble o tabla de paddle surf, y cuántas horas.',
      'Ve el precio con la tarifa de temporada aplicada y los extras disponibles.',
      'Deja sus datos y firma el contrato, en la pantalla o en su móvil con el QR.',
      'Recibe el QR para recoger el material.',
    ],
    limite: {
      type: 'p',
      text: 'La entrega del material, el chaleco y las indicaciones de la zona de navegación siguen siendo del personal, igual que revisar el estado del kayak a la vuelta.',
    },
    dato: [pendiente('kayak y paddle surf')],
    faq: [
      {
        q: '¿Sirve para paddle surf además de kayak?',
        a: 'Sí. Cada tipo de unidad —kayak individual, doble, tabla de paddle surf— es un producto con su propia disponibilidad y su precio por horas.',
      },
    ],
    related: [
      { label: 'Software de alquiler de kayak y paddle surf', slug: 'software-alquiler-kayak-paddle-surf' },
      { label: 'Plantilla de exención de responsabilidad para actividades acuáticas', slug: 'plantilla-exencion-responsabilidad-actividades-acuaticas' },
      { label: 'Quiosco de autoservicio para alquiler de motos de agua', slug: 'quiosco-autoservicio-alquiler-motos-de-agua' },
    ],
  },

  barcos: {
    id: 'barcos',
    slug: 'quiosco-autoservicio-alquiler-barcos',
    para: 'para barcos',
    vende: 'barcos por medio día, día completo o franjas',
    title: 'Quiosco de autoservicio para alquiler de barcos y chárter | Solnow',
    description:
      'Tótem o quiosco de autoservicio para alquiler de barcos: el cliente consulta disponibilidad, reserva y firma el contrato en la pantalla, y el personal solo revisa titulación y fianza.',
    lede:
      'Un quiosco de autoservicio para alquiler de barcos deja que el cliente consulte qué barcos quedan libres, reserve medio día o día completo, deje sus datos y firme el contrato en una pantalla del puerto, sin ocupar al personal. En barcos el ticket es alto y siempre hay una comprobación humana —titulación o patrón, fianza—, así que el quiosco no sustituye al mostrador: le quita todo lo que no es esa comprobación.',
    porQue: [
      'Consultar disponibilidad y precio es lo que más tiempo ocupa en el mostrador, y es justo lo que el cliente puede hacer solo.',
      'El contrato de un barco es largo: firmarlo en la pantalla o en el móvil mientras espera ahorra la parte más lenta de la entrega.',
      'Los clientes que ya reservaron en la web o por WhatsApp hacen su check-in en el quiosco con el QR, sin pasar por la cola.',
    ],
    pasos: [
      'El cliente ve los barcos libres para el día, con duración y precio de temporada.',
      'Elige barco, duración y si sale con o sin patrón.',
      'Deja sus datos y firma el contrato en la pantalla o en su móvil con el QR.',
      'El personal revisa titulación y fianza, y entrega el barco.',
    ],
    limite: {
      type: 'p',
      text: 'Comprobar la titulación de quien patronea un barco sin patrón, cobrar o bloquear la fianza y hacer la entrega técnica siguen siendo del personal. El quiosco deja todo lo demás hecho cuando el cliente llega al mostrador.',
      verify: 'Titulación necesaria para alquilar barcos sin patrón en España según eslora y potencia: revisar antes de publicar.',
    },
    dato: [pendiente('alquiler de barcos')],
    faq: [
      {
        q: '¿El cliente puede pagar la fianza en el quiosco?',
        a: 'Hoy la fianza la gestiona el personal en la entrega. El quiosco deja la reserva, los datos y el contrato listos para que esa gestión sea lo único que quede.',
        verify: 'Confirmar con producto cómo se cobra o bloquea la fianza en el flujo de barcos.',
      },
    ],
    related: [
      { label: 'Software para alquiler de barcos y chárter', slug: 'software-alquiler-barcos-charter' },
      { label: 'Contrato de alquiler de barco o chárter (plantilla gratis)', slug: 'contrato-alquiler-barco-charter' },
      { label: 'Quiosco de autoservicio para excursiones en catamarán', slug: 'quiosco-autoservicio-excursiones-catamaran' },
    ],
  },

  catamaranes: {
    id: 'catamaranes',
    slug: 'quiosco-autoservicio-excursiones-catamaran',
    para: 'para catamaranes',
    vende: 'plazas en salidas de catamarán',
    title: 'Quiosco de autoservicio para excursiones en catamarán: venta de billetes | Solnow',
    description:
      'Quiosco o tótem de autoservicio para vender billetes de excursiones en catamarán en el puerto: plazas por salida en tiempo real, compra en la pantalla y embarque con QR. Sin máquina expendedora.',
    lede:
      'Un quiosco de autoservicio para catamaranes hace en el puerto lo que haría una máquina expendedora de billetes, pero conectado a tu disponibilidad: el cliente ve las próximas salidas con plazas libres, compra las de su grupo y recibe un QR con el que embarca. Con Solnow es el modo kiosko del TPV, en una tablet o un tótem, con las mismas plazas que vendes en la web, por WhatsApp y a través de hoteles y colaboradores.',
    porQue: [
      'Vendes plazas, no barcos: es la venta que más se parece a un billete y la que mejor encaja en el autoservicio.',
      'Las plazas de cada salida se comparten entre todos los canales, así que el quiosco nunca vende por encima de la capacidad.',
      'El paseo por el puerto es el momento de la venta impulsiva: una pantalla con «próxima salida, quedan 12 plazas» la cierra sin vendedor.',
    ],
    pasos: [
      'El cliente ve las salidas del día y las plazas libres de cada una.',
      'Elige salida y número de plazas.',
      'Deja sus datos y recibe el billete con QR, en la pantalla o en su móvil.',
      'Embarca enseñando el QR, que el personal lee aunque no haya conexión en el muelle.',
    ],
    limite: {
      type: 'p',
      text: 'Las salidas privadas, los grupos grandes y los cambios por mal tiempo los sigue gestionando el personal. El quiosco resuelve la venta de plazas sueltas, que es la mayoría.',
    },
    dato: [pendiente('excursiones en catamarán')],
    faq: [
      {
        q: '¿Es lo mismo que una máquina expendedora de billetes?',
        a: 'Hace lo mismo de cara al cliente —elegir salida, comprar plazas, llevarse el billete— pero no es una máquina: es una pantalla conectada en tiempo real a las plazas que vendes en todos tus canales, y el billete es un QR.',
      },
    ],
    related: [
      { label: 'Software de reservas para excursiones en catamarán', slug: 'software-reservas-excursiones-catamaran' },
      { label: 'Quiosco de autoservicio para parasailing', slug: 'quiosco-autoservicio-parasailing' },
      { label: 'Quiosco de autoservicio para alquiler de barcos', slug: 'quiosco-autoservicio-alquiler-barcos' },
    ],
  },

  activos: {
    id: 'activos',
    slug: 'quiosco-autoservicio-alquiler-activos',
    para: 'para alquiler de activos',
    vende: 'unidades por franjas horarias',
    title: 'Quiosco de autoservicio para alquiler de activos y equipos | Solnow',
    description:
      'Quiosco, tótem o terminal de autoservicio para negocios que alquilan activos por horas: disponibilidad por unidad, contrato firmado en la pantalla y QR de recogida. Funciona en una tablet.',
    lede:
      'Un quiosco de autoservicio para alquiler de activos es una pantalla donde el cliente elige qué unidad quiere —una moto de agua, un barco, un kayak, una tabla— y para qué franja, firma el contrato y recibe un QR de recogida sin pasar por el mostrador. Funciona para cualquier negocio que alquila unidades contadas por tiempo y necesita saber en todo momento cuáles están fuera, cuáles libres y quién ha firmado qué.',
    porQue: [
      'Alquilar un activo no es vender un producto: la unidad tiene que volver, y el quiosco solo ofrece las que de verdad están libres en esa franja.',
      'Cada alquiler lleva datos del cliente y un contrato firmado, que es la parte lenta del mostrador y la que mejor se hace en una pantalla.',
      'El mismo equipo sirve de TPV para tu personal en hora punta y de quiosco para el cliente el resto del día.',
    ],
    pasos: [
      'El cliente ve las unidades libres para la franja que le interesa, con su precio.',
      'Elige unidad, duración y extras.',
      'Deja sus datos y firma el contrato en la pantalla o en su móvil con el QR.',
      'Recibe el QR con el que recoge la unidad.',
    ],
    limite: {
      type: 'p',
      text: 'Solnow está hecho para el alquiler náutico y de actividades: flota, franjas, contratos, embarque. Si tus activos son de otro tipo, en la demo vemos contigo si tu operación encaja antes de que decidas nada.',
    },
    dato: [pendiente('alquiler de activos')],
    faq: [
      {
        q: '¿Qué tipo de activos puedo alquilar desde el quiosco?',
        a: 'Cualquier unidad que se alquile por tiempo y tenga disponibilidad propia: motos de agua, barcos, kayaks, tablas de paddle surf y material asociado. Cada tipo es un producto con su precio y sus franjas.',
      },
    ],
    related: [
      { label: 'Software para alquiler de motos de agua', slug: 'software-alquiler-motos-de-agua' },
      { label: 'Cómo eliminar el papeleo en el alquiler náutico', slug: 'eliminar-papeleo-alquiler-nautico' },
      { label: 'Quiosco de autoservicio para alquiler de kayak', slug: 'quiosco-autoservicio-alquiler-kayak' },
    ],
  },
};

export const quioscoSlug = (id: QuioscoId) => QUIOSCOS[id].slug;

/**
 * Los diez nombres con los que se busca lo mismo. La tabla dice qué es cada uno
 * en un alquiler, para que la página responda a todos sin repetirse.
 */
function equivalencias(q: Quiosco): GuideBlock {
  return {
    type: 'table',
    // La columna de etiquetas (`label`) no lleva cabecera: `columns` es solo la de contenido.
    columns: [`Qué es en un negocio ${q.para.replace(/^para /, 'de ')}`],
    rows: [
      { label: 'Quiosco o kiosco de autoservicio', cells: ['La pantalla de cara al cliente donde compra y firma sin pasar por el mostrador.'] },
      { label: 'Terminal de autoservicio', cells: ['El mismo quiosco visto como equipo: una tablet o un ordenador con navegador.'] },
      { label: 'Pantalla o pantalla de pedido', cells: [`Lo que ve el cliente: ${q.vende}, con disponibilidad y precio.`] },
      { label: 'Tótem o tótem digital', cells: ['El soporte vertical donde va la pantalla. Es opcional: sirve cualquier soporte para tablet.'] },
      { label: 'Punto de autoservicio', cells: ['El sitio donde lo pones: el pantalán, la caseta, la entrada del puerto.'] },
      { label: 'Caja de autopago, caja de autoservicio, autopago', cells: ['La parte del cobro. El cliente deja la venta hecha; cómo se cobra depende de tu datáfono y tu pasarela.'] },
      { label: 'Máquina de autoservicio o expendedora (billetes, entradas)', cells: ['Lo que hace de cara al cliente, sin máquina propia: el billete o la entrada es un QR en su móvil.'] },
    ],
  };
}

export function plantillaQuiosco(id: QuioscoId): GuideContent {
  const q = QUIOSCOS[id];
  const titulo = `Quiosco de autoservicio ${q.para}`;
  return {
    meta: { title: q.title, description: q.description, ogTitle: titulo },
    hero: { eyebrow: 'PRODUCTO · AUTOSERVICIO', h1: titulo, lede: q.lede, updated: UPDATED, readingTime: '5 min de lectura' },
    author: AUTHOR,
    logos: true,
    sections: [
      { h: `Por qué un quiosco de autoservicio ${q.para}`, blocks: [{ type: 'list', items: q.porQue }] },
      { h: 'Cómo compra el cliente en el quiosco, paso a paso', blocks: [{ type: 'steps', items: q.pasos }] },
      {
        h: 'Quiosco, tótem, terminal o caja de autopago: qué es cada cosa',
        blocks: [
          {
            type: 'p',
            text: 'Se busca con muchos nombres, pero en un negocio de alquiler todos describen la misma pieza vista desde un lado distinto. Esto es lo que significa cada uno en el tuyo:',
          },
          equivalencias(q),
        ],
      },
      {
        h: 'Sin máquina propia: el mismo equipo que tu TPV',
        blocks: [
          {
            type: 'p',
            text: 'No hace falta comprar un terminal propietario. El modo kiosko funciona en una tablet o un ordenador con navegador, el mismo equipo que tu personal usa como TPV en modo mostrador. En hora punta lo maneja el personal para despachar rápido; el resto del día se deja de cara al cliente.',
          },
          {
            type: 'list',
            items: [
              'Disponibilidad real compartida con la web, WhatsApp y los colaboradores: el quiosco nunca vende lo que ya está vendido.',
              'Precios por temporada, duración, base y producto aplicados solos.',
              'Extras sugeridos en el momento de la venta.',
              'Cierre de caja por base y por turno, junto con las ventas del mostrador.',
            ],
          },
          {
            type: 'p',
            text: 'El cobro se integra con el datáfono que ya uses o con uno conectado a la pasarela de pago.',
            verify: AUTOPAGO_VERIFY,
          },
        ],
      },
      { h: 'Qué sigue necesitando a una persona', blocks: [q.limite] },
      { h: 'Nuestro dato', blocks: q.dato },
    ],
    faq: [
      ...q.faq,
      {
        q: '¿Tengo que comprar un quiosco o un tótem?',
        a: 'No. Funciona en una tablet o un ordenador con navegador. El tótem es solo el soporte: puedes usar cualquiera, o dejar la tablet en el mostrador.',
      },
      {
        q: '¿El cliente puede pagar solo, como en una caja de autopago?',
        a: 'El quiosco deja la venta hecha y el cobro se integra con tu datáfono o tu pasarela de pago.',
        verify: AUTOPAGO_VERIFY,
      },
      {
        q: '¿Necesita el cliente instalar una aplicación?',
        a: 'No. Si sigue en su móvil, el QR abre una página en el navegador: sin descargas, sin registro y sin cuenta.',
      },
      {
        q: '¿Funciona si se cae internet?',
        a: 'El embarque y la lectura de QR funcionan sin conexión y se sincronizan al recuperarla. El cobro con tarjeta sí necesita conexión, como cualquier TPV.',
      },
    ],
    related: q.related,
    cta: {
      title: `Ve el quiosco de autoservicio ${q.para} con tu operación`,
      desc: 'En 30 minutos lo configuramos con tus productos, tus franjas y tus precios.',
      button: 'Pedir demo',
    },
  };
}
