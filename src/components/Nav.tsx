'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const items: [string, string][] = [
    ['Producto', '#producto'],
    ['Para quién', '#para-quien'],
    ['Comparativa', '#comparativa'],
    ['Implementación', '#implementacion'],
    ['FAQ', '#faq'],
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
        background: scrolled ? 'rgba(247,247,247,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(140%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <a href="#top" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <Image src="/assets/solnow-wordmark-color.png" alt="Solnow" width={104} height={26} style={{ height: 26, width: 'auto' }} />
          <span className="chip" style={{ marginLeft: 4, padding: '2px 7px', fontSize: 10 }}>BETA</span>
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>Entrar</button>
          <a className="btn btn-primary" style={{ padding: '9px 16px', fontSize: 13.5 }} href="#cta">
            Pedir demo
          </a>
        </div>
      </div>
    </header>
  );
}
