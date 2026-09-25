import Script from "next/script";

const CLARITY_ID = "ynqz7gi6va";

/**
 * Snippet de Microsoft Clarity (mapas de calor y grabaciones de sesión).
 * Igual que los pixels de Meta y OpenAI, lo monta `DeferredAnalytics`, no el
 * layout: no pinta nada y no tiene por qué competir con la hidratación.
 */
export function ClarityScript() {
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
    </Script>
  );
}
