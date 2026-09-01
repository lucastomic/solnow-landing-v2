import Script from "next/script";

const PIXEL_ID = "QKrycnWVhgWywBgVUjbxtY";

/**
 * Cola del pixel de OpenAI, tipada en local (el snippet crea `window.oaiq`
 * antes de que llegue el SDK y encola las llamadas hasta entonces).
 */
type OaiqGlobal = {
  oaiq?: (...args: unknown[]) => void;
};

/**
 * Snippet del pixel de OpenAI (atribución de tráfico procedente de ChatGPT).
 * Igual que el de Meta, lo monta `DeferredAnalytics`, no el layout: es un SDK
 * de terceros más que no pinta nada y no tiene por qué competir con la
 * hidratación.
 *
 * `debug` solo fuera de producción: en la web pública llena la consola del
 * visitante sin aportar nada.
 */
export function OpenAIPixelScript() {
  return (
    <Script id="openai-pixel" strategy="afterInteractive">
      {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
oaiq("init",{pixelId:"${PIXEL_ID}",debug:${process.env.NODE_ENV !== "production"}});`}
    </Script>
  );
}

/**
 * Envía una conversión al pixel.
 *
 * Con optional chaining a propósito, igual que el `dataLayer.push` de
 * `MeetingTracker`: si el etiquetado diferido todavía no ha montado el snippet
 * —o un bloqueador lo ha impedido— `window.oaiq` no existe y esto debe quedarse
 * callado, no romper la página.
 */
export function measureOpenAI(
  event: string,
  payload: Record<string, unknown>,
): void {
  (window as unknown as OaiqGlobal).oaiq?.("measure", event, payload);
}
