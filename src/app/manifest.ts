import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Solnow",
    short_name: "Solnow",
    description:
      "El sistema operativo para flotas de alquiler acuático con alto volumen.",
    start_url: "/es",
    display: "standalone",
    background_color: "#f7f7f7",
    theme_color: "#106695",
    // El par habitual, en vez de `solnow-mark.png` con `sizes: "any"`: aquello
    // eran 217 KB que el navegador se descargaba en cada visita —el manifest se
    // pide en todas las páginas— para un icono que casi nunca llega a pintarse.
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
