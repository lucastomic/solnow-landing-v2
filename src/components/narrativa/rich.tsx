import type { ReactNode } from 'react';

/** `**negrita**` → `<strong>`. Es el único marcado que admite el contenido del tour. */
export function rich(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}
