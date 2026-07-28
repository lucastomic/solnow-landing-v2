import Script from "next/script";

const PIXEL_ID = "1725227561961856";

/**
 * Snippet del pixel. Lo monta `DeferredAnalytics` cuando toca, no el layout:
 * `fbevents.js` son 165 KiB que no tienen por qué competir con la hidratación.
 */
export function MetaPixelScript() {
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
    </Script>
  );
}

/**
 * Fallback sin JavaScript. Va aparte y se renderiza en el HTML inicial: es un
 * `<img>` estático, no cuesta nada, y es justo el caso en el que el diferido
 * por interacción nunca llegaría a dispararse.
 */
export function MetaPixelNoScript() {
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
