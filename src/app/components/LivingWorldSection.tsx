'use client';

import React, { useEffect, useRef } from 'react';

import Icon from '@/components/ui/AppIcon';

const npcExamples = [
  {
    name: 'Old Man Haruki',
    role: 'Route 7 Hermit',
    line: '"You helped defeat the Neon Syndicate? My grandson told me about you. Take this — it belonged to a trainer who never came back from the Abyss Route."',
    memory: 'Remembers your story progress',
  },
  {
    name: 'Gym Leader Valentina',
    role: 'Coral Reef Gym — Miami Region',
    line: '"Last time we fought, you barely survived my Surge-tide. You\'ve gotten stronger. The whole city knows your name now."',
    memory: 'Tracks battle history',
  },
  {
    name: 'Rival Dex',
    role: 'Your rival — adapts to your choices',
    line: '"You took the fire starter? Smart. I grabbed the one that counters it. Did you really think I wouldn\'t figure out your strategy?"',
    memory: 'Mirrors your decisions',
  },
];

export default function LivingWorldSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
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
      { threshold: 0.1 }
    );

    [leftRef.current, rightRef.current, ...cardRefs.current].forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setStyle = (el: HTMLDivElement | null, delay = 0) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = `opacity 1s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms, transform 1s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`;
  };

  useEffect(() => {
    setStyle(leftRef.current, 0);
    setStyle(rightRef.current, 150);
    cardRefs.current.forEach((el, i) => setStyle(el, 200 + i * 100));
  }, []);

  return (
    <section
      id="engine"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Left: Text content — 7 cols */}
        <div ref={leftRef} className="lg:col-span-7">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground mb-6 block">
            The Living World
          </span>
          <h2 className="text-section-xl font-black tracking-tighter leading-[0.9] mb-8">
            <span className="text-foreground">YOUR WORLD</span>
            <br />
            <span className="text-gradient-blue">BREATHES.</span>
          </h2>
          <div className="space-y-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            <p>
              AI isn&apos;t just the builder — it&apos;s woven into the fabric of every town and route. NPCs remember your actions, adapt to your progress, and react to the choices you make.
            </p>
            <p>
              No scripted loops. No recycled dialogue. Every conversation is generated in context — the world feels alive because it actually is.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            {[
              { icon: 'CpuChipIcon', label: 'Contextual NPC Memory' },
              { icon: 'ArrowPathIcon', label: 'Dynamic World Events' },
              { icon: 'BoltIcon', label: 'Adaptive Rival AI' },
              { icon: 'GlobeAltIcon', label: 'Procedural Lore Generation' },
            ].map((pill) => (
              <div
                key={pill.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-card electric-border"
              >
                <Icon
                  name={pill.icon as Parameters<typeof Icon>[0]['name']}
                  size={14}
                  variant="outline"
                  className="text-primary"
                />
                <span className="text-[11px] font-mono font-bold tracking-wider text-muted-foreground">
                  {pill.label}
                </span>
              </div>
            ))}
          </div>

          {/* Easter egg — subtle, hidden in plain sight */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="easter-egg-hint cursor-default select-none">
              // there may or may not be a secret...
            </p>
          </div>
        </div>

        {/* Right: NPC dialogue cards — 5 cols */}
        <div ref={rightRef} className="lg:col-span-5 flex flex-col gap-4">
          {npcExamples.map((npc, i) => (
            <div
              key={npc.name}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="glass-card electric-border rounded-2xl p-5 sm:p-6 feature-card"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-sm font-black text-foreground tracking-tight">
                    {npc.name}
                  </h4>
                  <p className="text-[10px] font-mono text-primary/70 tracking-widest uppercase mt-0.5">
                    {npc.role}
                  </p>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name="ChatBubbleLeftEllipsisIcon" size={14} variant="outline" className="text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-mono italic border-l-2 border-primary/20 pl-3">
                {npc.line}
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent electric-pulse" />
                <span className="text-[10px] font-mono text-accent/60 tracking-widest uppercase">
                  {npc.memory}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}