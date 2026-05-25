'use client';

import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const features = [
  {
    icon: 'MapIcon',
    iconVariant: 'outline' as const,
    title: 'Custom Region Layout',
    description:
      'Every town, route, cave, and landmark generated from your prompt. No two maps are alike — geography, climate, and biome emerge directly from your world concept.',
    detail: '8 gyms · Elite Four · Champion · Side routes',
    accent: 'primary',
    offset: '',
  },
  {
    icon: 'UserGroupIcon',
    iconVariant: 'outline' as const,
    title: 'Living Characters',
    description:
      'Gym leaders, rivals, professor, evil team, NPC trainers — all with unique personalities, dialogue trees, and backstories. NPCs remember your choices and respond dynamically.',
    detail: 'AI-driven dialogue · Reactive world · Memory system',
    accent: 'accent',
    offset: 'lg:mt-20',
  },
  {
    icon: 'SparklesIcon',
    iconVariant: 'solid' as const,
    title: 'Starters, Story & Lore',
    description:
      'Three starter SkyForge designed for your world. A full eight-badge storyline with twists, lore, and an endgame that fits your setting. No cookie-cutter plots.',
    detail: '3 unique starters · Full storyline · Custom lore',
    accent: 'primary',
    offset: 'lg:mt-44',
  },
];

export default function WhatGetsForged() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((card) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.9s cubic-bezier(0.23, 1, 0.32, 1), transform 0.9s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-20">
        <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground mb-4 block">
          What Gets Forged
        </span>
        <h2 className="text-section-xl font-black tracking-tighter leading-[0.9]">
          <span className="text-foreground">EVERY ELEMENT.</span>
          <br />
          <span className="text-gradient-gold">AI GENERATED.</span>
        </h2>
      </div>

      {/* Staggered Cards — offset vertical rhythm */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={`feature-card glass-card p-8 sm:p-10 flex flex-col justify-between min-h-[380px] ${feature.offset}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div>
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                  feature.accent === 'accent' ?'bg-accent/10' :'bg-primary/10'
                }`}
              >
                <Icon
                  name={feature.icon as Parameters<typeof Icon>[0]['name']}
                  variant={feature.iconVariant}
                  size={28}
                  className={feature.accent === 'accent' ? 'text-accent' : 'text-primary'}
                />
              </div>

              <h3 className="text-card-lg font-black tracking-tighter text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {feature.description}
              </p>
            </div>

            {/* Detail tag */}
            <div
              className={`mt-8 pt-6 border-t ${
                feature.accent === 'accent' ? 'border-accent/15' : 'border-primary/15'
              }`}
            >
              <p
                className={`text-[11px] font-mono font-bold tracking-widest uppercase ${
                  feature.accent === 'accent' ? 'text-accent/70' : 'text-primary/70'
                }`}
              >
                {feature.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}