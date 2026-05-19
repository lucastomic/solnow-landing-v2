import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Solnow",
    short_name: "Solnow",
    description:
      "El sistema operativo para flotas de motos de agua con alto volumen.",
    start_url: "/es",
    display: "standalone",
    background_color: "#f7f7f7",
    theme_color: "#106695",
    icons: [
      {
        src: "/assets/solnow-mark.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
