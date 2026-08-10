/**
 * Logos de clientes en producción, compartidos por la marquesina de
 * `SocialProof` (home) y la franja compacta de la landing de anuncios.
 *
 * `w`/`h` son las dimensiones intrínsecas reales del fichero: `unoptimized`
 * sirve el original, y si el ratio declarado no cuadra con el del archivo la
 * imagen salta al terminar de cargar. Los `.webp` los genera
 * `scripts/optimize-images.mjs` a 3× la altura de render (64 px).
 */
export interface ClientLogo {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { src: '/logos/marina-jets.webp', alt: 'MarinaJets', w: 151, h: 149 },
  { src: '/logos/cocoon.webp', alt: 'Cocoon', w: 671, h: 320 },
  { src: '/logos/elysium.webp', alt: 'Elysium', w: 1576, h: 432 },
  { src: '/logos/jaloque.svg', alt: 'Jaloque', w: 172, h: 82 },
  { src: '/logos/jetskilloret.webp', alt: 'Jet Ski Lloret', w: 400, h: 127 },
  { src: '/logos/ibizarentaboat.png', alt: 'Ibiza Rent a Boat', w: 186, h: 60 },
  { src: '/logos/morairaboatsadventures.webp', alt: 'Moraira Boats Adventures', w: 338, h: 192 },
  { src: '/logos/primeyachtmallorca.webp', alt: 'Prime Yacht Mallorca', w: 206, h: 192 },
  { src: '/logos/rentboatinalicante.webp', alt: 'Rent Boat in Alicante', w: 256, h: 192 },
  { src: '/logos/trulovesailing.webp', alt: 'Trulove Sailing', w: 698, h: 192 },
];
