import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { Footer } from '@/components/sections/SectionsEnd';

export interface LegalSection {
  h: string;
  p?: string[];
  list?: string[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  sections: LegalSection[];
}

export function LegalPage({
  doc,
  backLabel,
  locale,
}: {
  doc: LegalDoc;
  backLabel: string;
  locale: Locale;
}) {
  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(247,247,247,0.82)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}
        >
          <Link href={`/${locale}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Image src="/logo_color.png" alt="Solnow" width={104} height={26} style={{ height: 26, width: 'auto' }} />
          </Link>
          <Link
            href={`/${locale}`}
            className="mono"
            style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M11 7H3M6.5 3.5 3 7l3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {backLabel}
          </Link>
        </div>
      </header>

      <main className="container" style={{ maxWidth: 760, paddingBlock: '72px 96px' }}>
        <h1 className="h-display" style={{ fontSize: 'clamp(32px, 4.4vw, 52px)', marginBottom: 12 }}>
          {doc.title}
        </h1>
        <p className="mono" style={{ fontSize: 12, color: 'var(--muted-2)', letterSpacing: '0.06em', marginBottom: 56 }}>
          {doc.updated}
        </p>

        {doc.sections.map((s, i) => (
          <section key={i} style={{ marginBottom: 40 }}>
            {s.h && (
              <h2 className="h-3" style={{ fontSize: 20, marginBottom: 14 }}>
                {s.h}
              </h2>
            )}
            {s.p?.map((para, j) => (
              <p key={j} style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--fg-2)', margin: '0 0 12px' }}>
                {para}
              </p>
            ))}
            {s.list && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {s.list.map((item, j) => (
                  <li
                    key={j}
                    style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-2)', display: 'grid', gridTemplateColumns: '16px 1fr', gap: 10 }}
                  >
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 12, transform: 'translateY(3px)' }}>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </main>

      <Footer locale={locale} />
    </>
  );
}
