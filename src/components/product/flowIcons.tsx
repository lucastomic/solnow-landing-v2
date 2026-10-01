/**
 * Iconos de los nodos del grafo, por id de nodo. El grafo vertical (el tour)
 * los enseña en lugar de la línea secundaria: un dibujo por área se lee antes
 * que dos líneas de texto. Trazo de 1.5 sobre 24×24, en `currentColor`.
 */
const PATHS: Record<string, string> = {
  // WhatsApp: bocadillo con auricular.
  wa: 'M3.5 20.5l1.3-3.8A8.5 8.5 0 1 1 8 19.6zM9 8.2c-.2 2.9 3.4 6.6 6.6 6.8l1-1.6-2.1-1.1-.9.8c-1-.5-2-1.5-2.5-2.5l.8-.9-1-2.1z',
  web: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  // Mostrador: tienda con toldo.
  most: 'M3 9l1.5-5h15L21 9M3 9h18M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 12v9h14v-9M10 21v-5h4v5',
  colab: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 20c0-3 2.7-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 15c1.8.5 3 2.4 3 5',
  // OTAs: entrada de actividad.
  ota: 'M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM14 7v10',
  cobro: 'M2 6h20v12H2zM2 10h20M6 15h4',
  // Contrato: hoja con firma.
  contrato: 'M6 2h9l5 5v15H6zM14 2v6h6M9 17c1-2 2-2 3 0s2 2 3 0',
  qr: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM6 6h1v1H6zM17 6h1v1h-1zM6 17h1v1H6zM14 14h3v3h-3zM18 18h3v3h-3zM14 20h2M20 14v2',
  // Monitorización: pantalla con pulso.
  mon: 'M2 4h20v13H2zM8 21h8M12 17v4M5 11h3l2-4 3 7 2-3h4',
  rep: 'M4 20h16M7 16v-4M12 16V6M17 16V9',
  // Persigue: flecha de vuelta.
  persigue: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
};

export function FlowIcon({ id, size = 24 }: { id: string; size?: number }) {
  const d = PATHS[id];
  if (!d) return null;
  return (
    <svg
      className="flow-node-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}
