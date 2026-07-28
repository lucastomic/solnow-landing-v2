import type { CSSProperties, ReactNode } from 'react';

/**
 * Marco y piezas comunes de los mockups de aplicación (diseños «TPV v2»,
 * «Operación tiempo real» y «Estadísticas»).
 *
 * Los tres miden 1194×834. Para que quepan igual en la columna de una landing
 * que en la miniatura del índice, el marco declara un contenedor y fija su
 * `font-size` en proporción al ancho disponible: la base equivale a 100 px del
 * diseño, así que cada medida del original se escribe en `em` dividida entre
 * 100 (24px → 0.24em). Cambiar el ancho reescala todo junto, sin `transform`
 * ni cálculos en JS.
 *
 * Regla al editar: un elemento que fije `fontSize` no debe llevar además otras
 * medidas en `em`; ahí el `em` ya mide contra su propio tamaño y no contra la
 * base. Si hacen falta las dos cosas, se separan en dos elementos.
 *
 * Sin estado ni efectos a propósito: `mocks.tsx` (cliente) los anima cambiando
 * de pantalla, y `thumbs.tsx` (servidor) los usa fijos.
 */

export const W = 1194;
export const H = 834;

export const INK = '#111827';
export const BODY = '#4b5563';
export const LINE = '#e5e7eb';
export const LINE_SOFT = '#f1f4f5';
export const MUTED = '#9ca3af';
export const OK = '#16a34a';
export const OK_BG = '#dcfce7';
export const OK_FG = '#15803d';
export const WARN = '#b45309';
export const CANVAS = '#f7f9f9';
export const ACCENT = '#106695';
export const ACCENT_SOFT = '#eef5f9';
export const ACCENT_DEEP = '#0b4c6f';

/** Ventana de la aplicación: cabecera de marca + lienzo. */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ containerType: 'inline-size', width: '100%' }}>
      <div
        style={{
          // 100 cqw / 1194 · 100 → la base `em` vale 100 px del diseño.
          fontSize: `calc(100cqw / ${W} * 100)`,
          fontFamily: 'var(--font-sans)',
          aspectRatio: `${W} / ${H}`,
          background: CANVAS,
          borderRadius: '0.2em',
          overflow: 'hidden',
          boxShadow: '0 0.01em 0.02em rgba(17,24,39,.05), 0 0.24em 0.6em rgba(16,102,149,.14)',
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1.2,
        }}
      >
        <div
          style={{
            height: '0.64em',
            flex: 'none',
            background: ACCENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0.28em',
          }}
        >
          {/* <img> y no next/image: dentro del marco el tamaño se define en
              `em`, así que no hay dimensiones intrínsecas que optimizar.
              `width`/`height` van igualmente para dar el ratio al navegador
              antes de que llegue el fichero. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/solnow-wordmark-white.webp"
            alt=""
            width={626}
            height={168}
            style={{ height: '0.22em', width: 'auto', display: 'block' }}
          />
          <span style={{ fontSize: '0.14em', color: '#d7e7f0' }}>Laura M.</span>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Escenario para los diseños de móvil: mismo lienzo de 1194×834 que la
 * ventana de escritorio —así el mockup no cambia de alto al pasar de pestaña—
 * con uno a tres móviles centrados.
 */
export function PhoneStage({ children }: { children: ReactNode }) {
  return (
    <div style={{ containerType: 'inline-size', width: '100%' }}>
      <div
        style={{
          fontSize: `calc(100cqw / ${W} * 100)`,
          fontFamily: 'var(--font-sans)',
          aspectRatio: `${W} / ${H}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.16em',
          lineHeight: 1.2,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Ancho del móvil dentro del escenario, en la base de `PhoneStage`. */
export const PHONE_W = '3.6em';
const PHONE = 390;

/**
 * Móvil. Declara su propio contenedor, así que sus medidas se escriben en `em`
 * contra 390 px de ancho de diseño, no contra los 1194 del escenario.
 */
export function PhoneFrame({ header, children }: { header?: 'brand' | 'none'; children: ReactNode }) {
  return (
    <div style={{ width: PHONE_W, flex: 'none', containerType: 'inline-size' }}>
      <div
        style={{
          fontSize: `calc(100cqw / ${PHONE} * 100)`,
          aspectRatio: `${PHONE} / 800`,
          background: '#fff',
          borderRadius: '0.32em',
          overflow: 'hidden',
          boxShadow: '0 0.01em 0.02em rgba(17,24,39,.05), 0 0.24em 0.6em rgba(16,102,149,.16)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {header !== 'none' && (
          <div
            style={{
              height: '0.52em',
              flex: 'none',
              background: ACCENT,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '0.1em',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/solnow-wordmark-white.webp"
              alt=""
              width={626}
              height={168}
              style={{ height: '0.18em', width: 'auto', display: 'block' }}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/** Barra de navegación del móvil: acción a la izquierda, título debajo. */
export function PhoneHead({ back, title, sub }: { back?: string; title: string; sub?: string }) {
  return (
    <div style={{ flex: 'none', padding: '0.18em 0.2em 0.16em', background: '#fff', borderBottom: `0.01em solid ${LINE}` }}>
      {back && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1em', marginBottom: '0.12em' }}>
          <Icon name="arrow-left" size="0.18em" color={BODY} />
          <span style={{ fontSize: '0.14em', color: BODY }}>{back}</span>
        </div>
      )}
      <div style={{ fontSize: '0.22em', fontWeight: 700, letterSpacing: '-.01em', color: INK }}>{title}</div>
      {sub && <div style={{ fontSize: '0.14em', color: BODY, marginTop: '0.21em' }}>{sub}</div>}
    </div>
  );
}

/** Botón de ancho completo dentro de un móvil. */
export function PhoneCta({ tone = 'solid', children }: { tone?: 'solid' | 'ghost'; children: ReactNode }) {
  return (
    <div
      style={{
        height: '0.56em',
        flex: 'none',
        borderRadius: '0.14em',
        background: tone === 'solid' ? ACCENT : '#fff',
        border: tone === 'solid' ? undefined : `0.01em solid ${LINE}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.09em',
      }}
    >
      <span style={{ fontSize: '0.17em', fontWeight: 600, color: tone === 'solid' ? '#fff' : ACCENT }}>{children}</span>
    </div>
  );
}

/** Cabecera interna: título, subtítulo y lo que se le cuelgue a la derecha. */
export function ScreenHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.16em' }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.04em' }}>
        <span style={{ fontSize: '0.24em', fontWeight: 700, letterSpacing: '-.01em', color: INK }}>{title}</span>
        {sub && <span style={{ fontSize: '0.15em', color: BODY }}>{sub}</span>}
      </div>
      {children}
    </div>
  );
}

/** Píldora de estado (verde, ámbar o azul). */
export function Pill({ tone, children }: { tone: 'ok' | 'warn' | 'accent'; children: ReactNode }) {
  const c =
    tone === 'ok'
      ? { bg: OK_BG, fg: OK_FG }
      : tone === 'warn'
        ? { bg: '#fffbeb', fg: WARN }
        : { bg: ACCENT_SOFT, fg: ACCENT_DEEP };
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.07em',
        height: '0.32em',
        padding: '0 0.12em',
        borderRadius: '999px',
        background: c.bg,
        color: c.fg,
      }}
    >
      <span style={{ fontSize: '0.13em', fontWeight: 700 }}>{children}</span>
    </span>
  );
}

/** Tarjeta blanca del lienzo. */
export const cardStyle: CSSProperties = {
  background: '#fff',
  border: `0.01em solid ${LINE}`,
  borderRadius: '0.12em',
  boxShadow: '0 0.01em 0.02em rgba(17,24,39,.04), 0 0.04em 0.16em rgba(17,24,39,.04)',
};

/** Rótulo en versalitas de cada bloque. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontSize: '0.11em', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: MUTED }}>
      {children}
    </span>
  );
}

/* Iconos en línea: el proyecto no usa librería de iconos. */
const PATHS: Record<string, ReactNode> = {
  check: <path d="M4 12.5l5 5L20 6.5" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
    </>
  ),
  'trending-up': (
    <>
      <path d="M3 17.5 9.5 11l4 4L21 7.5" />
      <path d="M15.5 7.5H21v5.5" />
    </>
  ),
  'credit-card': (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  banknote: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6" />
    </>
  ),
  'id-card': (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8.5" cy="10.5" r="2" />
      <path d="M14 10h5M14 14h5M5.5 16.5c.5-1.5 1.7-2.3 3-2.3s2.5.8 3 2.3" />
    </>
  ),
  signature: (
    <>
      <path d="M14 3v5h5" />
      <path d="M19 11v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7z" />
      <path d="M8 16.5c1.6-2.5 3.2.8 4.8-1.2" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M20 14v.01M20 20v.01M14 20v.01M17 17v.01" />
    </>
  ),
  'arrow-left': <path d="M20 12H4M10 6l-6 6 6 6" />,
  x: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />,
  'message-square': <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  bot: (
    <>
      <rect x="3.5" y="8" width="17" height="12" rx="3" />
      <path d="M12 8V4.5M8.5 13.5v1.5M15.5 13.5v1.5" />
    </>
  ),
  hotel: (
    <>
      <path d="M4 21V4.5A1.5 1.5 0 0 1 5.5 3h13A1.5 1.5 0 0 1 20 4.5V21" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M10 21v-4h4v4" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.3-7.5 9.5-4.4-1.2-7.5-4.9-7.5-9.5V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 19c0-3.4 2.7-5.3 6-5.3s6 1.9 6 5.3" />
      <path d="M16.5 6.2a3.2 3.2 0 0 1 0 6M17.5 14.2c2 .6 3.5 2.2 3.5 4.8" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <path d="M12 7.5V21M5 13a7 7 0 0 0 14 0" />
      <path d="M3.5 13H6M18 13h2.5" />
    </>
  ),
  jet: (
    <>
      <path d="M3 16.5c2.5 0 3-1.5 5.5-1.5S12 16.5 14.5 16.5 18.5 15 21 15" />
      <path d="M5 13.5l2-4h6l3 4z" />
      <path d="M13 9.5l3-2" />
    </>
  ),
  boat: (
    <>
      <path d="M3 16.5c2.5 0 3-1.5 5.5-1.5S12 16.5 14.5 16.5 18.5 15 21 15" />
      <path d="M4.5 13.5h14l-2-4h-10z" />
      <path d="M11.5 9.5V4l5 5.5" />
    </>
  ),
};

export function Icon({ name, size, color }: { name: keyof typeof PATHS; size: string; color: string }) {
  const style: CSSProperties = { width: size, height: size, flex: 'none', display: 'block' };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden>
      {PATHS[name]}
    </svg>
  );
}
