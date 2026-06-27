'use client';
import { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  label: string;
}

/** Sticky table of contents with scroll-spy active highlighting. */
export function GuideToc({ title, items }: { title: string; items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el != null);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -68% 0px', threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label={title} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span
        className="mono"
        style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-2)' }}
      >
        {title}
      </span>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          borderLeft: '1px solid var(--line)',
        }}
      >
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                style={{
                  display: 'block',
                  padding: '7px 0 7px 16px',
                  marginLeft: -1,
                  borderLeft: `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
                  color: on ? 'var(--accent)' : 'var(--muted)',
                  fontSize: 13.5,
                  lineHeight: 1.4,
                  fontWeight: on ? 500 : 400,
                  transition: 'color .15s ease, border-color .15s ease',
                }}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
