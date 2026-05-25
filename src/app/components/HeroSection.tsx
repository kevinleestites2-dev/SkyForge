'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import ForgeResult from './ForgeResult';


interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const PLACEHOLDER_PROMPTS = [
  'A neon-soaked Miami Vice region where gang leaders are gym bosses and starter SkyForge are inspired by flamingos, gators, and manatees...',
  'Post-apocalyptic wasteland region. Radiation zones replace gyms. Rival is a scavenger with a mutated Eevee...',
  'Medieval Japan — feudal lords are Elite Four, starters are SkyForge based on koi, cranes, and tigers...',
  'Underwater kingdom 3000m deep. No land routes. Submarines replace bikes. Eight coral reef gym leaders...',
  'Mars Colony, 2157. Terraformed routes. Starter SkyForge evolved from Earth creatures sent in early missions...',
];

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const [promptValue, setPromptValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [godModeActive, setGodModeActive] = useState(false);
  const [forgeClicked, setForgeClicked] = useState(false);
  const [worldData, setWorldData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgeError, setForgeError] = useState<string | null>(null);
  const [statCount, setStatCount] = useState(0);

  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Rotate placeholder prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Stat counter animation
  useEffect(() => {
    const target = 47382;
    const duration = 2200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setStatCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const timeout = setTimeout(() => requestAnimationFrame(tick), 800);
    return () => clearTimeout(timeout);
  }, []);

  // Particle canvas
  const spawnParticle = useCallback((canvas: HTMLCanvasElement) => {
    const colors = ['#3B9EFF', '#7DC8FF', '#F5C842', '#FFE066', '#A78BFA'];
    const x = Math.random() * canvas.width;
    const y = canvas.height + 10;
    particlesRef.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(Math.random() * 1.5 + 0.8),
      radius: Math.random() * 2.5 + 0.8,
      opacity: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 140 + 80,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let spawnTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spawnTimer++;
      if (spawnTimer % 4 === 0) spawnParticle(canvas);

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      particlesRef.current.forEach((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.008;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.2) {
          p.opacity = lifeRatio / 0.2;
        } else if (lifeRatio > 0.7) {
          p.opacity = 1 - (lifeRatio - 0.7) / 0.3;
        } else {
          p.opacity = 1;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [spawnParticle]);

  // Cursor-reactive blobs + 3D tilt + magnetic button
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (clientX - centerX) / centerX;
      const moveY = (clientY - centerY) / centerY;

      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translate(${moveX * 60}px, ${moveY * 60}px)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translate(${moveX * -40}px, ${moveY * -40}px)`;
      }
      if (blob3Ref.current) {
        blob3Ref.current.style.transform = `translate(${moveX * 30}px, ${moveY * -20}px)`;
      }

      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `perspective(1000px) rotateY(${moveX * 3}deg) rotateX(${-moveY * 2}deg)`;
      }

      // Badge magnetic
      if (badgeRef.current) {
        const rect = badgeRef.current.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const dx = clientX - bx;
        const dy = clientY - by;
        if (Math.hypot(dx, dy) < 160) {
          badgeRef.current.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
        } else {
          badgeRef.current.style.transform = 'translate(0px, 0px)';
        }
      }

      // CTA magnetic
      if (ctaBtnRef.current) {
        const rect = ctaBtnRef.current.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const dx = clientX - bx;
        const dy = clientY - by;
        if (Math.hypot(dx, dy) < 120) {
          ctaBtnRef.current.style.transform = `scale(1.04) translate(${dx * 0.25}px, ${dy * 0.25}px)`;
        } else {
          ctaBtnRef.current.style.transform = '';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // God Mode detection
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPromptValue(val);
    if (val.toLowerCase().includes('ghostmode.skyforge')) {
      setGodModeActive(true);
    }
  };

  const handleForge = async () => {
    if (!promptValue.trim()) return;
    setForgeClicked(true);
    setIsLoading(true);
    setForgeError(null);
    setWorldData(null);
    try {
      const res = await fetch('/api/forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptValue, godMode: godModeActive }),
      });
      const data = await res.json();
      if (data.world) {
        setWorldData(data.world);
      } else {
        setForgeError(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setForgeError('Network error. Try again.');
    } finally {
      setIsLoading(false);
      setForgeClicked(false);
    }
  };

  const handleReset = () => {
    setWorldData(null);
    setPromptValue('');
    setForgeError(null);
  };

  const closeGodMode = () => setGodModeActive(false);

  return (
    <>
      {/* God Mode Overlay */}
      <div className={`god-mode-overlay ${godModeActive ? 'active' : ''}`}>
        <div className="scanline" />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-purple-300 mb-6 opacity-80">
            ⚡ SYSTEM OVERRIDE DETECTED ⚡
          </div>
          <h2 className="text-hero-xl font-black tracking-tighter text-foreground mb-4 god-flicker">
            GOD MODE
          </h2>
          <p className="text-xl font-mono text-purple-200 mb-3">
            Universal Engine Unlocked.
          </p>
          <p className="text-muted-foreground font-mono text-sm mb-10 leading-relaxed">
            All genre restrictions removed. RPG, survival, horror, platformer,<br className="hidden sm:block" />
            strategy, racing — if you can describe it, we build it.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {['RPG', 'Survival Horror', 'Platformer', 'Strategy', 'Racing', 'Roguelike', 'Fighting', 'Puzzle'].map((g) => (
              <span key={g} className="px-3 py-1.5 rounded-full border border-purple-400/40 text-purple-200 text-xs font-mono font-bold tracking-widest">
                {g}
              </span>
            ))}
          </div>
          <button
            onClick={closeGodMode}
            className="px-8 py-3 rounded-full border border-purple-400/50 text-purple-200 text-xs font-black uppercase tracking-widest hover:bg-purple-400/10 transition-colors"
          >
            Enter The Void
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-24"
        id="hero"
      >
        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Atmospheric Blobs */}
        <div
          ref={blob1Ref}
          className="absolute top-1/4 left-1/4 w-[45vw] h-[45vw] blob-blue pointer-events-none z-0"
          style={{ transition: 'transform 1s cubic-bezier(0.23, 1, 0.32, 1)' }}
          aria-hidden="true"
        />
        <div
          ref={blob2Ref}
          className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] blob-gold pointer-events-none z-0"
          style={{ transition: 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
          aria-hidden="true"
        />
        <div
          ref={blob3Ref}
          className="absolute top-1/3 right-1/3 w-[30vw] h-[30vw] blob-purple pointer-events-none z-0"
          style={{ transition: 'transform 0.9s cubic-bezier(0.23, 1, 0.32, 1)' }}
          aria-hidden="true"
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,158,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,158,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        {/* Hero Content */}
        <div
          ref={heroContentRef}
          className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-10 electric-border"
            style={{ transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary electric-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-muted-foreground">
              AI Game Engine — Any World, Fully Playable
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-hero-xl font-black tracking-tighter leading-[0.88] mb-6">
            <span className="block text-foreground">YOU IMAGINE IT.</span>
            <span className="block text-gradient-hero">WE BUILD IT.</span>
            <span className="block text-foreground">YOU PLAY IT.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto mb-12">
            Type any world. SkyForge generates a{' '}
            <span className="text-primary font-bold">fully playable SkyForge game</span>{' '}
            — custom region, gym leaders, rivals, starters, story, and living NPCs —{' '}
            <span className="text-accent font-bold">right in your browser.</span>
          </p>

          {/* Prompt Box */}
          <div id="forge" className="relative max-w-3xl mx-auto group">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 blur opacity-40 group-focus-within:opacity-80 transition-opacity duration-500" />
            <div className="relative glass-card rounded-2xl p-3 sm:p-4">
              <textarea
                ref={promptRef}
                value={promptValue}
                onChange={handlePromptChange}
                placeholder={PLACEHOLDER_PROMPTS[placeholderIndex]}
                rows={4}
                className="prompt-input w-full rounded-xl px-4 sm:px-6 py-4 text-sm sm:text-base leading-relaxed"
                aria-label="Describe your SkyForge world"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3 px-2">
                <p className="text-[11px] font-mono text-muted-foreground opacity-60">
                  Any region, any setting, any world. No limits.
                </p>
                <button
                  ref={ctaBtnRef}
                  onClick={handleForge}
                  className="forge-btn flex items-center gap-2 px-6 sm:px-8 py-3.5 text-[12px] uppercase tracking-widest font-black whitespace-nowrap w-full sm:w-auto justify-center"
                  aria-label="Forge my game"
                >
                  <span>
                    {isLoading ? '⚡ Forging World...' : forgeClicked ? '⚡ Forging...' : '⚡ Forge My Game'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10">
            <div className="text-center">
              <div className="stat-counter text-2xl sm:text-3xl font-black text-gradient-blue">
                {statCount.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                Worlds Forged
              </div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-gradient-gold">∞</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                Possible Regions
              </div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-foreground">0</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                Lines of Code Needed
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
          <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-muted-foreground">
            Scroll to explore
          </span>
          <div className="w-px h-12 bg-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-primary scroll-bar-anim" />
          </div>
        </div>
      </section>
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-blue-400/60 animate-spin" />
          </div>
          <p className="text-sm font-mono opacity-60 animate-pulse">Forging your world with Gemini AI...</p>
        </div>
      )}
      {forgeError && (
        <div className="max-w-lg mx-auto mt-8 p-4 rounded-xl border border-red-400/30 bg-red-400/10 text-center">
          <p className="text-sm font-mono text-red-300">{forgeError}</p>
          <button onClick={handleReset} className="mt-3 text-xs font-bold underline opacity-60 hover:opacity-100">Try again</button>
        </div>
      )}
      {worldData && (
        <div className="px-4 sm:px-6 lg:px-8">
          <ForgeResult 
            world={worldData as Parameters<typeof ForgeResult>[0]['world']} 
            onReset={handleReset} 
            godMode={godModeActive} 
          />
        </div>
      )}
    </>
  );
}