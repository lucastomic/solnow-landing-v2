'use client';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import { PainBar, ProductAreas } from '@/components/sections/SectionsProduct';
import { Pillars, Comparison } from '@/components/sections/SectionsMid';
import { WhyNow } from '@/components/sections/SectionsThesis';
import { Onboarding, SocialProof, FAQ, FinalCTA, Footer } from '@/components/sections/SectionsEnd';
import { useReveal } from '@/hooks/useReveal';

function RevealProvider() {
  useReveal();
  return null;
}

export default function HomeClient() {
  return (
    <>
      <RevealProvider />
      <Nav />
      <main>
        <Hero variant="a" />
        <PainBar />
        <Pillars />
        <ProductAreas />
        <WhyNow />
        <Comparison />
        <Onboarding />
        <SocialProof />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
