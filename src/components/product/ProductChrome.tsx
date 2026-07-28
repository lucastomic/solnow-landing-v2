import type { ReactElement } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChaseThumb } from '@/components/product/thumbs';
import type { Locale } from '@/i18n/config';
import { productByKey, productHubPath, productPath, type ProductHubContent, type ProductKey } from '@/content/products';
import { PRODUCTS } from '@/content/products';

/**
 * Cabecera, migas y bloques compartidos por el hub de producto y las cuatro
 * landings de área. Son server components: todo el texto llega renderizado en
 * el HTML inicial, que es lo que rastrean e indexan los buscadores.
 */

export const ARROW = (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
    <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ProductHeader({
  locale,
  labels,
  cta,
}: {
  locale: Locale;
  labels: ProductHubContent['labels'];
  cta: ProductHubContent['cta'];
}) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(247,247,247,0.9)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 16 }}>
        <Link href={`/${locale}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Image src="/hollow_logo_name_color.png" alt="Solnow" width={162} height={28} priority style={{ width: 162, height: 'auto' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Link
            href={`/${locale}`}
            className="mono r-hide"
            style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M11 7H3M6.5 3.5 3 7l3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {labels.backHome}
          </Link>
          <a className="btn btn-primary" href={`/${locale}#cta`} style={{ fontSize: 13 }}>
            {cta.button}
            {ARROW}
          </a>
        </div>
      </div>
    </header>
  );
}

export function Breadcrumb({
  locale,
  labels,
  current,
}: {
  locale: Locale;
  labels: ProductHubContent['labels'];
  /** Tercer nivel; si falta, las migas terminan en el hub de producto. */
  current?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mono"
      style={{
        fontSize: 12,
        letterSpacing: '0.03em',
        color: 'var(--muted-2)',
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 28,
      }}
    >
      <Link href={`/${locale}`} style={{ color: 'var(--muted)' }}>
        {labels.breadcrumbHome}
      </Link>
      <span aria-hidden>/</span>
      {current ? (
        <Link href={productHubPath(locale)} style={{ color: 'var(--muted)' }}>
          {labels.breadcrumbProduct}
        </Link>
      ) : (
        <span style={{ color: 'var(--accent)' }}>{labels.breadcrumbProduct}</span>
      )}
      {current && (
        <>
          <span aria-hidden>/</span>
          <span style={{ color: 'var(--accent)' }}>{current}</span>
        </>
      )}
    </nav>
  );
}

/**
 * Colocación de cada área en la rejilla tipo bento: la primera destacada abre
 * con su pila al lado, las demás destacadas van en pareja y las anchas cierran.
 * Al ser un `Record<ProductKey, …>`, añadir un área obliga a colocarla, y la
 * unión discriminada impide declarar una destacada sin su portada.
 *
 * La portada es una miniatura del mockup o una foto a sangre.
 */
type Shot = { kind: 'mock'; node: ReactElement } | { kind: 'photo'; src: string; alt: string };
type Slot = { order: number; size: 'small' | 'wide' } | { order: number; size: 'big'; shot: Shot };

const LAYOUT: Record<ProductKey, Slot> = {
  tpv: {
    order: 1,
    size: 'big',
    shot: { kind: 'photo', src: '/assets/tpv-mostrador.jpg', alt: 'El TPV de Solnow en el mostrador de un alquiler de motos de agua' },
  },
  contratos: { order: 2, size: 'small' },
  whatsapp: { order: 3, size: 'small' },
  motor: { order: 4, size: 'small' },
  persigue: { order: 5, size: 'big', shot: { kind: 'mock', node: <ChaseThumb /> } },
  operacion: {
    order: 6,
    size: 'big',
    shot: { kind: 'photo', src: '/assets/operacion-tiempo-real.jpg', alt: 'Pantalla de operación en tiempo real de Solnow en la oficina de un alquiler náutico' },
  },
  colaboradores: { order: 7, size: 'wide' },
  datos: { order: 8, size: 'wide' },
};

/**
 * Índice de áreas. Con las ocho es la rejilla bento con miniaturas; como
 * "otras áreas" dentro de una landing (`exclude`) se degrada a tarjetas
 * uniformes: falta un área, así que el bento no cuadraría, y ahí el bloque es
 * secundario y no debe competir con el contenido de la propia landing.
 */
export function AreaCards({
  locale,
  content,
  exclude,
}: {
  locale: Locale;
  content: ProductHubContent & { areas: Record<ProductKey, { card: { title: string; sub: string; tag?: string } }> };
  exclude?: ProductKey;
}) {
  const areas = content.areas;
  const card = (key: ProductKey, big: boolean, i: number) => {
    const p = productByKey(key);
    const slot = LAYOUT[key];
    return (
      <Link
        key={key}
        href={productPath(key, locale)}
        className={`feature-card reveal ${big ? 'feature-big' : 'feature-small'}`}
        data-tone={big && p.core ? 'core' : undefined}
        style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}
      >
        {big && slot.size === 'big' && (
          slot.shot.kind === 'photo' ? (
            <div className="feature-shot feature-shot-photo">
              <Image
                src={slot.shot.src}
                alt={slot.shot.alt}
                fill
                sizes="(max-width: 560px) 100vw, (max-width: 1000px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className="feature-shot">
              <div className="feature-thumb">
                <div className="feature-thumb-in">{slot.shot.node}</div>
              </div>
            </div>
          )
        )}
        <div className="feature-body">
          <span className="mono feature-area">
            {p.n}
            {areas[key].card.tag && ` · ${areas[key].card.tag}`}
            {p.core && ` · ${content.home.coreTag}`}
          </span>
          <span className="feature-title">{areas[key].card.title}</span>
          <span className="feature-sub">{areas[key].card.sub}</span>
          <span className="mono feature-cta">{big ? content.home.cardCta : content.home.cardCtaShort} →</span>
        </div>
      </Link>
    );
  };

  // Dentro de una landing falta un área, así que el bento no cuadra: ahí el
  // bloque es secundario y va en tarjetas uniformes.
  if (exclude) {
    return (
      <div className="feature-grid-4">
        {[...PRODUCTS]
          .filter((p) => p.key !== exclude)
          .sort((a, b) => LAYOUT[a.key].order - LAYOUT[b.key].order)
          .map((p, i) => card(p.key, false, i))}
      </div>
    );
  }

  const ordered = [...PRODUCTS].sort((a, b) => LAYOUT[a.key].order - LAYOUT[b.key].order).map((p) => p.key);
  const bigs = ordered.filter((k) => LAYOUT[k].size === 'big');
  const stack = ordered.filter((k) => LAYOUT[k].size === 'small');
  const wides = ordered.filter((k) => LAYOUT[k].size === 'wide');

  return (
    <div className="feature-rows">
      <div className="feature-grid">
        {card(bigs[0], true, 0)}
        <div className="feature-stack">{stack.map((k, i) => card(k, false, i + 1))}</div>
      </div>
      <div className="feature-grid">{bigs.slice(1).map((k, i) => card(k, true, i))}</div>
      <div className="feature-grid">{wides.map((k, i) => card(k, false, i))}</div>
    </div>
  );
}

export function ProductCta({ locale, cta }: { locale: Locale; cta: ProductHubContent['cta'] }) {
  return (
    <section className="container" style={{ paddingBottom: 96 }}>
      <div
        className="card-ink"
        style={{
          padding: 'clamp(32px, 5vw, 56px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          background:
            'radial-gradient(700px 380px at 85% 15%, rgba(74,144,192,0.22), transparent 70%),' +
            'linear-gradient(180deg, #0a3f5d, #062a3e)',
        }}
      >
        <div aria-hidden className="dotgrid-ink" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        <div style={{ position: 'relative', maxWidth: '40ch' }}>
          <h2 className="h-2" style={{ color: 'var(--ink-fg)', fontSize: 'clamp(24px, 3vw, 34px)', marginBottom: 12 }}>
            {cta.title}
          </h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-muted)' }}>{cta.desc}</p>
        </div>
        <a className="btn btn-primary" href={`/${locale}#cta`} style={{ whiteSpace: 'nowrap', position: 'relative' }}>
          {cta.button}
          {ARROW}
        </a>
      </div>
    </section>
  );
}
