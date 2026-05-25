import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import WorldsGallery from './components/WorldsGallery';
import WhatGetsForged from './components/WhatGetsForged';
import LivingWorldSection from './components/LivingWorldSection';
import CTASection from './components/CTASection';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Noise texture overlay — premium film feel */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Navigation */}
      <Header />

      {/* Main content */}
      <main>
        {/* Section 1: Hero — atmospheric depth, prompt input, particle canvas */}
        <HeroSection />

        {/* Section 2: Generated Worlds Gallery — bento grid */}
        <WorldsGallery />

        {/* Section 3: What Gets Forged — staggered feature cards */}
        <WhatGetsForged />

        {/* Section 4: The Living World — asymmetric split + NPC dialogue + Easter egg */}
        <LivingWorldSection />

        {/* Section 5: CTA — split screen with prompt re-entry */}
        <CTASection />
      </main>

      {/* Footer — Pattern 1 Linear */}
      <Footer />
    </div>
  );
}