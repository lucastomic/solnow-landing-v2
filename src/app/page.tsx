'use client';
import { useEffect } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import { PainBar, Nuclear, ProductAreas } from '@/components/sections/SectionsProduct';
import { Pillars, ForWhom, Comparison, Partner } from '@/components/sections/SectionsMid';
import { Onboarding, SocialProof, FAQ, FinalCTA, Footer } from '@/components/sections/SectionsEnd';
import { Pricing } from '@/components/sections/SectionsPricing';
import { useReveal } from '@/hooks/useReveal';

function RevealProvider() {
  useReveal();
  return null;
}

export default function Home() {
  return (
    <>
      <RevealProvider />
      <Nav />
      <main>
        <Hero variant="a" />
        <PainBar />
        <Nuclear />
        <ProductAreas />
        <Pillars />
        <ForWhom />
        <Comparison />
        <Partner />
        <Pricing />
        <Onboarding />
        <SocialProof />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
