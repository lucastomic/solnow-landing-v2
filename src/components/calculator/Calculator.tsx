'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  computeQuote,
  fromQuery,
  money,
  percent,
  percentOf100,
  pricingIntegrityError,
  toQuery,
  withChannel,
  channels,
  type Channels,
  type ControlledChannel,
  type Inputs,
} from '@/lib/calculator';
import { persist, useInitialQuery } from './config';
import { Controls } from './Controls';
import { Results } from './Results';

const CONTACT_EMAIL = 'lucastomic@solnow.io';

/** El reparto en una línea, para el enlace de la demo y el correo del desglose. */
const CHANNEL_SUMMARY = (ch: Channels, sep: string) =>
  [
    `${percentOf100(ch.card)} tarjeta`,
    `${percentOf100(ch.manual)} manual`,
    `${percentOf100(ch.online)} web`,
    `${percentOf100(ch.whatsapp)} WhatsApp`,
    `${percentOf100(ch.otas)} OTAs`,
  ].join(sep);

/**
 * Calculadora pública de precio.
 *
 * Todo el estado es un `Inputs` y todo lo derivado sale de `computeQuote`, así
 * que no hay forma de que la cifra grande y el calendario discrepen: son la
 * misma cuenta leída dos veces.
 *
 * Se hidrata con los valores por defecto y solo después lee la URL o el
 * almacenamiento local. Hacerlo al revés significaría renderizar en servidor
 * algo que el servidor no puede saber, y pagarlo con un desajuste de
 * hidratación en cada visita que llegue con un enlace compartido.
 */
export function Calculator({ locale }: { locale: string }) {
  // El `key` remonta el cuerpo cuando el snapshot pasa del valor de servidor al
  // del visitante, que es lo que deja el estado inicial correcto sin un
  // `setState` dentro de un efecto. Ocurre una vez, al hidratar, porque el
  // snapshot está cacheado de por vida.
  const query = useInitialQuery();
  return <CalculatorBody key={query} locale={locale} initial={fromQuery(query)} />;
}

function CalculatorBody({ locale, initial }: { locale: string; initial: Inputs }) {
  const [inputs, setInputs] = useState<Inputs>(initial);

  const query = toQuery(inputs);

  useEffect(() => {
    // `replaceState` y no `router.replace`: esto no es una navegación, y
    // empujar una entrada al historial por cada píxel de arrastre convertiría
    // el botón «atrás» en inservible. El retardo evita además el tope de
    // llamadas de Safari mientras se arrastra (ver `persist`).
    const id = window.setTimeout(() => persist(query), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  const patch = useCallback((p: Partial<Inputs>) => setInputs((prev) => ({ ...prev, ...p })), []);

  // Los conceptos apagados en la leyenda no viven en `Inputs`: no son un dato
  // del negocio del visitante, son una lente sobre la comparativa. Mezclarlos
  // con la facturación y las bases los colaría en el enlace de la demo como si
  // fueran datos suyos.
  const [hidden, setHidden] = useState<string[]>([]);
  const toggleConcept = useCallback(
    (key: string) =>
      setHidden((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])),
    [],
  );
  const setChannel = useCallback(
    (key: ControlledChannel, value: number) => setInputs((prev) => withChannel(prev, key, value)),
    [],
  );

  const quote = computeQuote(inputs, hidden);
  // La segunda propuesta es el mismo negocio con otra tarifa nuestra: se
  // recalcula entera, no se parchea, para que no haya forma de que las dos
  // columnas discrepen en algo que no sea el precio.
  const quotes = inputs.pricingB
    ? [quote, computeQuote({ ...inputs, pricing: inputs.pricingB }, hidden)]
    : [quote];
  // Con el pricing editable, la integridad hay que comprobarla sobre el que se
  // está usando: si alguien pone el anual por encima de doce mensualidades en
  // pantalla, la página tiene que avisar igual que si estuviera en el fichero.
  const integrity = pricingIntegrityError(inputs.pricing);

  // Anuncio para lector de pantalla, aparte del DOM visible: arrastrar un
  // deslizador dispara decenas de renders y leer el resultado entero en cada
  // uno es inservible. Se anuncia el titular, y solo cuando la mano se para.
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const id = window.setTimeout(
      () => setAnnouncement(`${money(quote.total)} al año, un ${percent(quote.effectiveRate)} de tu facturación.`),
      500,
    );
    return () => window.clearTimeout(id);
  }, [quote.total, quote.effectiveRate]);

  if (integrity) {
    // La regla de integridad de §4.2: antes que publicar un descuento negativo
    // en la web pública, la calculadora se calla. Un precio mal en público es
    // un problema comercial, no un bug que se arregla el lunes.
    return (
      <div
        className="card"
        style={{ padding: 28, borderColor: 'var(--danger)', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <h2 className="h-3">La calculadora está en revisión</h2>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 15 }}>
          Estamos actualizando las tarifas. Escríbenos y te pasamos tu precio a mano, hoy mismo.
        </p>
        <p className="mono" style={{ margin: 0, fontSize: 11.5, color: 'var(--muted-2)' }}>
          {integrity}
        </p>
        <a className="btn btn-primary" href={`/${locale}/demo`} style={{ alignSelf: 'flex-start', marginTop: 6 }}>
          Hablar con nosotros
        </a>
      </div>
    );
  }

  const ch = channels(inputs);
  // El comercial llega a la llamada sabiendo la facturación y las bases, que es
  // justo lo que se tarda diez minutos en preguntar por teléfono.
  const demoHref =
    `/${locale}/demo?` +
    new URLSearchParams({
      calc_facturacion: String(inputs.revenue),
      calc_bases: String(inputs.bases),
      calc_canales: CHANNEL_SUMMARY(ch, ' / '),
      calc_pago: inputs.billing === 'season' ? 'temporada' : 'mensual',
      calc_total: String(Math.round(quote.total)),
    }).toString();

  const mailHref =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Mi desglose de precio de SolNow')}` +
    `&body=${encodeURIComponent(
      [
        'Hola, he calculado mi precio en solnow.io y me gustaría recibir el desglose.',
        '',
        `Facturación anual: ${money(inputs.revenue)}`,
        `Bases: ${inputs.bases}`,
        `Canales: ${CHANNEL_SUMMARY(ch, ' · ')}`,
        `Modalidad: ${inputs.billing === 'season' ? 'pago por temporada' : 'pago mensual'}`,
        `Coste anual estimado: ${money(quote.total)} (${percent(quote.effectiveRate)})`,
        '',
        `Mi cálculo: https://www.solnow.io/${locale}/calculator?${query}`,
      ].join('\n'),
    )}`;

  return (
    <>
      <div className="calc-grid">
        <div className="calc-panel">
          <Controls inputs={inputs} onChange={patch} onChannel={setChannel} />
        </div>

        <div>
          <Results quotes={quotes} hidden={hidden} onToggle={toggleConcept} />

          {/* Después del resultado, y nunca antes. El desglose entero se ve sin
              dar un solo dato: ponerlo tras un email destruiría la herramienta. */}
          <div
            style={{
              marginTop: 26,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '14px 22px',
            }}
          >
            <a className="btn btn-primary" href={demoHref}>
              Ver una demo con tus números
            </a>
            <a className="btn btn-ghost" href={mailHref}>
              Recibir este desglose por email
            </a>
          </div>
        </div>
      </div>

      <p aria-live="polite" role="status" style={SR_ONLY}>
        {announcement}
      </p>
    </>
  );
}

/** Fuera de pantalla pero dentro del árbol de accesibilidad; `display:none` no lo anunciaría. */
const SR_ONLY: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};
