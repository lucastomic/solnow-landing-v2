import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getT } from '@/i18n/dictionaries';
import { CLIENT_LOGOS } from '@/components/sections/clientLogos';

/**
 * Las piezas fijas de las landings de campaña (`/demo`, `/demo-mostrador`).
 *
 * Cabecera, fila de logos y footer son idénticos en todas: sin `Nav` ni el
 * `Footer` completo, porque en tráfico de pago cada enlace que no lleva a la
 * acción es una fuga. Viven aquí para que una landing nueva no los copie y
 * acaben divergiendo.
 */

export function AdsHeader() {
  return (
    <header style={{ position: 'relative', zIndex: 10 }}>
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', height: 64, paddingTop: 12 }}
      >
        {/* Marca sin enlace: es la landing, no hay a dónde ir desde el logo. */}
        <Image
          src="/hollow_logo_name_color.webp"
          alt="Solnow"
          width={162}
          height={28}
          priority
          style={{ width: 162, height: 'auto' }}
        />
      </div>
    </header>
  );
}

export function AdsLogos({ title }: { title: string }) {
  return (
    <section style={{ paddingBlock: 8 }}>
      <div className="container">
        <p
          className="mono reveal"
          style={{
            margin: '0 0 20px',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted-2)',
            textAlign: 'center',
          }}
        >
          {title}
        </p>
        {/* Fila estática, no la marquesina de la home: una animación en bucle
            al lado del calendario compite con la única acción de la página. */}
        <div
          className="reveal"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px 44px',
            padding: '24px 0',
            borderBlock: '1px solid var(--line-soft)',
          }}
        >
          {CLIENT_LOGOS.map((l) => (
            <Image
              key={l.src}
              src={l.src}
              alt={l.alt}
              width={l.w}
              height={l.h}
              unoptimized
              style={{ height: 44, width: 'auto', maxWidth: 170, objectFit: 'contain' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Footer mínimo: solo las dos páginas legales. Nada más. */
export async function AdsFooter({ locale }: { locale: Locale }) {
  const t = await getT(locale);
  return (
    <footer style={{ borderTop: '1px solid var(--line-soft)', paddingBlock: 28 }}>
      <div
        className="container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
          // Centrado, no `space-between`: al quitar el copyright queda un solo
          // bloque, y `space-between` lo habría dejado pegado a la izquierda.
          justifyContent: 'center',
          fontSize: 13,
          color: 'var(--muted)',
        }}
      >
        <span style={{ display: 'flex', gap: 20 }}>
          <Link href={`/${locale}/privacy`} style={{ color: 'inherit' }}>
            {t('footer.legalLinks.privacy')}
          </Link>
          <Link href={`/${locale}/terms`} style={{ color: 'inherit' }}>
            {t('footer.legalLinks.terms')}
          </Link>
        </span>
      </div>
    </footer>
  );
}
