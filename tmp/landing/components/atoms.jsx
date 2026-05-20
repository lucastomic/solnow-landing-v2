// atoms.jsx — small shared building blocks
const { useState, useEffect, useRef, useMemo } = React;

// Intersection observer reveal — auto-applies .in to .reveal elements
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Section header
function SectionHead({ eyebrow, title, lede, align = 'left', accent }) {
  return (
    <div className="reveal" style={{
      display: 'flex', flexDirection: 'column', gap: 18,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align === 'center' ? 'center' : 'left',
      marginBottom: 56, maxWidth: align === 'center' ? 780 : 820,
      marginInline: align === 'center' ? 'auto' : 0,
    }}>
      {eyebrow && <span className={"eyebrow " + (accent === false ? 'no-dot' : '')}>{eyebrow}</span>}
      <h2 className="h-1">{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

// Bullet list with hairline + accent tick
function BulletList({ items }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
      {items.map((it, i) => (
        <li key={i} style={{
          display: 'grid', gridTemplateColumns: '20px 1fr', gap: 14,
          alignItems: 'baseline',
          padding: '14px 0',
          borderTop: i === 0 ? '1px solid var(--line-soft)' : 'none',
          borderBottom: '1px solid var(--line-soft)',
          fontSize: 15.5,
          color: 'var(--fg-2)',
          lineHeight: 1.5,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 18, height: 18, borderRadius: 4,
            border: '1px solid var(--accent-dim)',
            color: 'var(--accent)',
            transform: 'translateY(2px)',
          }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4 L4 7 L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

// Mock window chrome — used for product mockups
function WindowChrome({ title, status, children, accent = false, style }) {
  return (
    <div className="card-ink" style={{
      borderRadius: 16,
      ...style,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        borderBottom: '1px solid var(--ink-line)',
        background: 'linear-gradient(180deg, var(--ink-3), var(--ink-2))',
        fontSize: 12, color: 'var(--ink-muted)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.02em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-flex', gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'oklch(0.62 0.16 25)' }} />
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'oklch(0.78 0.14 80)' }} />
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'oklch(0.72 0.14 145)' }} />
          </span>
          <span style={{ marginLeft: 8 }}>{title}</span>
        </div>
        {status && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 11 }}>{status}</span>
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

// Image-slot placeholder (subtle stripe + monospace caption)
function Placeholder({ label, height = 200, style }) {
  return (
    <div style={{
      height, borderRadius: 12,
      border: '1px dashed var(--line)',
      background:
        'repeating-linear-gradient(135deg, rgba(8,57,84,0.03) 0 8px, rgba(8,57,84,0.06) 8px 16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--muted)',
      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
      ...style,
    }}>{label}</div>
  );
}

// Big section number / numeric index
function NumLabel({ n, of }) {
  return (
    <span className="mono" style={{
      fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em',
    }}>
      {String(n).padStart(2, '0')}{of && <span style={{ opacity: 0.5 }}> / {String(of).padStart(2, '0')}</span>}
    </span>
  );
}

Object.assign(window, { useReveal, SectionHead, BulletList, WindowChrome, Placeholder, NumLabel });
