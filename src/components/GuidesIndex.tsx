import Link from 'next/link';
import Nav from '@/components/Nav';
import RevealProvider from '@/components/RevealProvider';
import { FinalCTA, Footer } from '@/components/sections/SectionsEnd';
import { GUIDES, hasEnPage, localizedSlug, type GuideContent, type GuideGroup } from '@/content/guides';
import { PAGINAS } from '@/content/seo/paginas';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

/** Orden de las secciones: primero lo que se descarga, al final las zonas. */
const GROUP_ORDER: GuideGroup[] = ['recurso', 'actividad', 'comparativa', 'caso', 'geo'];

interface Entry {
  href: string;
  title: string;
  desc: string;
  download: boolean;
}

/**
 * Índice de guías (`/es/guias`, `/en/guides`).
 *
 * Sale de los dos registros —`GUIDES` y las páginas programáticas de
 * `PAGINAS`—, así que una guía nueva aparece aquí sin tocar este fichero. En
 * inglés no se listan las guías consolidadas (Tenerife, Gran Canaria,
 * Argentina, México): su URL inglesa es un 301 a otra página.
 */
export default async function GuidesIndex({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.guidesIndex;
  const g = dict.guides as unknown as Record<string, GuideContent> & { groups: Record<string, string> };

  const byGroup = new Map<GuideGroup, Entry[]>(GROUP_ORDER.map((k) => [k, []]));
  for (const guide of GUIDES) {
    if (locale === 'en' && !hasEnPage(guide.key)) continue;
    const c = g[guide.key];
    byGroup.get(guide.group)!.push({
      href: `/${locale}/${localizedSlug(guide.key, locale)}`,
      title: c.hero.h1,
      desc: c.meta.description,
      download: guide.download,
    });
  }
  // Las programáticas solo existen en su idioma. Casi todas son recursos de
  // operador (planes de negocio, seguros, plantillas); las que no, lo dicen.
  for (const p of PAGINAS.filter((x) => x.locale === locale)) {
    const c = p.build();
    byGroup.get(p.grupo ?? 'recurso')!.push({
      href: `/${p.locale}/${p.slug}`,
      title: c.hero.h1,
      desc: c.meta.description,
      download: Boolean(c.download),
    });
  }

  const sections = GROUP_ORDER.map((key) => ({ key, label: g.groups[key], items: byGroup.get(key)! })).filter(
    (s) => s.items.length > 0,
  );
  const total = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <>
      <RevealProvider />
      <Nav />

      <main>
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid var(--line-soft)',
            background: 'linear-gradient(180deg, var(--surface-2), var(--bg))',
          }}
        >
          <div
            aria-hidden
            className="dotgrid"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.4,
              maskImage: 'linear-gradient(180deg, #000, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(180deg, #000, transparent 85%)',
            }}
          />
          <div className="container" style={{ position: 'relative', paddingBlock: '120px 56px' }}>
            <div style={{ maxWidth: 780 }}>
              <span className="chip">{t.eyebrow}</span>
              <h1 className="h-display" style={{ fontSize: 'clamp(32px, 4.6vw, 54px)', margin: '20px 0 20px' }}>
                {t.h1}
              </h1>
              <p className="lede" style={{ maxWidth: '62ch' }}>{t.lede}</p>
            </div>

            {/* Saltos a cada grupo: con casi cuarenta guías, bajar a ciegas cansa. */}
            <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32 }}>
              {sections.map((s) => (
                <a key={s.key} href={`#${s.key}`} className="chip" style={{ textDecoration: 'none' }}>
                  {s.label} · {s.items.length}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <div className="container" style={{ paddingBlock: 'clamp(40px, 5vw, 72px)' }}>
          <p className="mono" style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted-2)', margin: '0 0 8px' }}>
            {t.count.replace('{n}', String(total))}
          </p>

          {sections.map((s) => (
            <section key={s.key} id={s.key} style={{ scrollMarginTop: 88, marginTop: 40 }}>
              <h2 className="h-2" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', margin: '0 0 20px' }}>{s.label}</h2>
              <ul className="guides-grid">
                {s.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="card guide-card">
                      {item.download && <span className="chip chip-accent" style={{ alignSelf: 'flex-start' }}>{t.download}</span>}
                      <h3 className="h-3" style={{ margin: 0 }}>{item.title}</h3>
                      <p className="guide-card-desc">{item.desc}</p>
                      <span className="mono guide-card-more">
                        {t.read}
                        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
                          <path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <FinalCTA locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
