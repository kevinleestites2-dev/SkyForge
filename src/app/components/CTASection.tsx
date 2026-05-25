'use client';

import React, { useRef, useEffect, useState } from 'react';

const EXAMPLE_PROMPTS = [
  'A frozen tundra region ruled by an ancient ice dragon cult...',
  'Cyberpunk São Paulo — tech corporations are the gym leaders...',
  'Ancient Egypt, SkyForge based on gods and desert creatures...',
  'The Moon — low gravity routes, crater gyms, starter SkyForge evolved from meteorites...',
];

export default function CTASection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [promptVal, setPromptVal] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [forged, setForged] = useState(false);

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

    [leftRef.current, rightRef.current].forEach((el, i) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 1s cubic-bezier(0.23, 1, 0.32, 1) ${i * 150}ms, transform 1s cubic-bezier(0.23, 1, 0.32, 1) ${i * 150}ms`;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((i) => (i + 1) % EXAMPLE_PROMPTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleForge = () => {
    if (!promptVal.trim()) return;
    setForged(true);
    setTimeout(() => setForged(false), 2500);
  };

  return (
    <section className="min-h-[80vh] flex flex-col lg:flex-row border-t border-border">
      {/* Left panel */}
      <div ref={leftRef} className="w-full lg:w-1/2 bg-secondary flex items-center justify-center p-10 sm:p-16 lg:p-24 relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 blob-blue opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-10 -left-10 w-60 h-60 blob-gold opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-md">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground mb-6 block">
            Ready to Build?
          </span>
          <h2 className="text-section-xl font-black tracking-tighter leading-[0.9] mb-8">
            <span className="text-foreground">START</span>
            <br />
            <span className="text-gradient-blue">FORGING.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-sm">
            No account needed to try. Describe your world below and watch SkyForge bring it to life in seconds.
          </p>

          {/* Stat pills */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Avg. Build Time', value: '< 8 sec' },
              { label: 'Worlds Per Day', value: '2,400+' },
              { label: 'Unique Regions', value: '100%' },
              { label: 'Code Required', value: 'Zero' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card electric-border rounded-xl p-4">
                <div className="text-xl font-black text-gradient-blue">{stat.value}</div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — prompt re-entry */}
      <div ref={rightRef} className="w-full lg:w-1/2 p-10 sm:p-16 lg:p-24 flex items-center">
        <div className="w-full max-w-lg mx-auto">
          <div className="glass-card electric-border rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-primary electric-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-muted-foreground">
                SkyForge Engine — Ready
              </span>
            </div>

            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Describe your world
            </label>
            <textarea
              value={promptVal}
              onChange={(e) => setPromptVal(e.target.value)}
              placeholder={EXAMPLE_PROMPTS[exampleIndex]}
              rows={5}
              className="prompt-input w-full rounded-xl px-5 py-4 text-sm leading-relaxed mb-4"
              aria-label="Describe your SkyForge world"
            />

            <button
              onClick={handleForge}
              className="forge-btn w-full py-4 text-[13px] uppercase tracking-widest font-black"
              aria-label="Forge my game"
            >
              <span>{forged ? '⚡ Building Your World...' : '⚡ Forge My Game'}</span>
            </button>

            <p className="text-center text-[10px] font-mono text-muted-foreground mt-4 opacity-50">
              Free to try. No sign-up required.
            </p>
          </div>

          {/* Floating badge */}
          <div className="floating-badge mt-6 mx-auto w-fit glass-card gold-border rounded-full px-5 py-2.5 flex items-center gap-2">
            <span className="text-accent text-sm">★</span>
            <span className="text-[11px] font-mono font-bold text-muted-foreground tracking-wider">
              47,382 worlds forged and counting
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}