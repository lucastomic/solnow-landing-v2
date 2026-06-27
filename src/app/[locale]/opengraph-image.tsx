import { ImageResponse } from "next/og";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Solnow";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "es";
  const m = (await getDictionary(safeLocale)).metadata;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #062a3e 0%, #083954 55%, #106695 100%)",
          color: "#f7f9fc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Solnow
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            {m.title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#c4d6e3",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            {m.description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            color: "#8aa9bf",
            letterSpacing: "0.04em",
          }}
        >
          www.solnow.io
        </div>
      </div>
    ),
    size
  );
}
