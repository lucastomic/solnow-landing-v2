import { ImageResponse } from 'next/og';
import type { GuideContent } from '@/content/guides';

/** Shared Open Graph image renderer for resource-guide pages. */
export const guideOgSize = { width: 1200, height: 630 };
export const guideOgContentType = 'image/png';

export function renderGuideOg(content: GuideContent) {
  return renderOgCard({
    title: content.meta.ogTitle || content.hero.h1,
    eyebrow: content.hero.eyebrow,
  });
}

/**
 * La tarjeta en crudo, para las páginas que no son guías (la landing de
 * campaña) y por tanto no tienen un `GuideContent` del que sacar los textos.
 */
export function renderOgCard({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #062a3e 0%, #083954 55%, #106695 100%)',
          color: '#f7f9fc',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          Solnow
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {eyebrow ? (
            <div style={{ display: 'flex', fontSize: 24, color: '#8aa9bf', letterSpacing: '0.06em' }}>
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: 'flex',
              fontSize: 58,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 24,
            color: '#8aa9bf',
            letterSpacing: '0.04em',
          }}
        >
          www.solnow.io
        </div>
      </div>
    ),
    guideOgSize,
  );
}
