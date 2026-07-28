'use client';
import { useReveal } from '@/hooks/useReveal';

/** Activa el observer de `.reveal` en páginas servidas como server components. */
export default function RevealProvider() {
  useReveal();
  return null;
}
