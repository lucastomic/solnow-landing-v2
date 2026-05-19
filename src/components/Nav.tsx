'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useT } from '@/i18n/I18nProvider';

export default function Nav() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Cerrar el drawer al volver a desktop para evitar estado bloqueado.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const on = () => mq.matches && setOpen(false);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const items: [string, string][] = [
    [t('nav.producto'), '#producto'],
    [t('nav.comparativa'), '#comparativa'],
    [t('nav.implementacion'), '#implementacion'],
    [t('nav.faq'), '#faq'],
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background .25s ease, border-color .25s ease, backdrop-filter .25s ease',
        background: scrolled || open ? 'rgba(247,247,247,0.82)' : 'transparent',
        backdropFilter: scrolled || open ? 'blur(20px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled || open ? 'blur(20px) saturate(140%)' : 'none',
        borderBottom: scrolled || open ? '1px solid var(--line)' : '1px solid transparent',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <a href="#top" style={{ display: 'inline-flex', alignItems: 'center' }} onClick={() => setOpen(false)}>
          <Image
            src="/hollow_logo_name_color.png"
            alt="Solnow"
            width={162}
            height={28}
            priority
            style={{ height: 28, width: 'auto' }}
          />
        </a>

        <nav className="r-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {items.map(([l, h]) => (
            <a
              key={h}
              href={h}
              style={{ fontSize: 13.5, color: 'var(--fg-2)', transition: 'color .15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-2)')}
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="r-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="https://app.nautisync.com" style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>{t('nav.signIn')}</a>
          <a className="btn btn-primary" style={{ padding: '9px 16px', fontSize: 13.5 }} href="#cta">
            {t('nav.cta')}
          </a>
        </div>

        <button
          className="r-nav-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            margin: -8,
            color: 'var(--fg)',
            cursor: 'pointer',
          }}
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="r-nav-drawer">
          {items.map(([l, h]) => (
            <a key={h} href={h} style={{ color: 'var(--fg)' }} onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
          <div style={{ height: 1, background: 'var(--line-soft)', margin: '10px 0' }} />
          <a href="https://app.nautisync.com" style={{ color: 'var(--fg-2)' }} onClick={() => setOpen(false)}>
            {t('nav.signIn')}
          </a>
          <a
            className="btn btn-primary"
            style={{ marginTop: 10, justifyContent: 'center', padding: '13px 20px', fontSize: 14.5 }}
            href="#cta"
            onClick={() => setOpen(false)}
          >
            {t('nav.cta')}
          </a>
        </div>
      )}
    </header>
  );
}
