'use client';
import { useState } from 'react';
import { SectionHead } from '../atoms';
import { useT } from '@/i18n/I18nProvider';

/**
 * Acordeón de preguntas frecuentes.
 *
 * Se queda en cliente por el `useState`: solo una abierta a la vez y la
 * primera desplegada de entrada. `<details name>` daría lo mismo sin JS, pero
 * el atributo `name` no existe en los navegadores más antiguos del
 * browserslist del proyecto (Chrome 111 / Safari 16.4) y allí se abrirían
 * varias a la vez.
 */
export function FAQ() {
  const t = useT();
  const faqs = t<{ q: string; a: string }[]>('faq.items');

  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section" style={{ paddingBlock: 120 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <SectionHead eyebrow={t('faq.eyebrow')} title={<>{t('faq.title')}</>} />
        <div style={{ borderTop: '1px solid var(--line-soft)' }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'grid',
                    gridTemplateColumns: '36px 1fr 32px',
                    gap: 20,
                    alignItems: 'center',
                    padding: '22px 4px',
                    transition: 'color .15s',
                  }}
                >
                  <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.08em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.014em', color: isOpen ? 'var(--accent)' : 'var(--fg)' }}>
                    {f.q}
                  </span>
                  <span
                    style={{
                      justifySelf: 'end',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid ' + (isOpen ? 'var(--accent-dim)' : 'var(--line)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isOpen ? 'var(--accent)' : 'var(--muted)',
                      transition: 'transform .25s ease',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      fontSize: 16,
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows .35s cubic-bezier(.2,.7,.2,1)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 56px 22px', maxWidth: '64ch', color: 'var(--muted)', fontSize: 15, lineHeight: 1.55 }}>
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
