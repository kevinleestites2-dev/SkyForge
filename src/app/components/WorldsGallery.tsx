'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

// BENTO GRID AUDIT
// Array has 6 cards: [Miami Vice, Mars Colony, Medieval Japan, Underwater Kingdom, Post-Apocalyptic, Neon Tokyo]
// Desktop grid-cols-3:
// Row 1: [col-1: Miami Vice cs-1 rs-2] [col-2: Mars Colony cs-1 rs-1] [col-3: Medieval Japan cs-1 rs-1]
// Row 2: [col-1: FILLED by Miami Vice rs-2] [col-2: Underwater cs-1 rs-1] [col-3: PostApoc cs-1 rs-1]
// Row 3: [col-1: Neon Tokyo cs-3 rs-1]
// Placed 6/6 cards ✓

const worlds = [
{
  id: 'miami',
  name: 'Miami Vice Region',
  prompt: 'Neon-soaked Miami where gang leaders are gym bosses',
  biome: 'Urban / Coastal',
  gyms: 8,
  starters: 'Flamingo · Gator · Manatee',
  image: "https://images.unsplash.com/photo-1718605771777-42924240ed6a",
  alt: 'Dark neon-lit Miami cityscape at night, wet streets reflecting electric blue and pink lights, deep shadows, cinematic atmospheric glow',
  tag: 'URBAN',
  tagColor: 'text-primary',
  span: 'row-span-2'
},
{
  id: 'mars',
  name: 'Mars Colony 2157',
  prompt: 'Terraformed Martian routes, starter SkyForge from Earth mission animals',
  biome: 'Sci-Fi / Barren',
  gyms: 8,
  starters: 'Rover · Probe · Cosmo',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_15a487d17-1774450952174.png",
  alt: 'Desolate rust-red Martian surface at night with distant colony domes glowing blue, deep space darkness, cinematic low-key lighting',
  tag: 'SCI-FI',
  tagColor: 'text-accent',
  span: ''
},
{
  id: 'japan',
  name: 'Feudal Japan Region',
  prompt: 'Feudal lords as Elite Four, starters based on koi, cranes, and tigers',
  biome: 'Historical / Forest',
  gyms: 8,
  starters: 'Koi · Crane · Tiger',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_16f00a272-1772249648388.png",
  alt: 'Ancient Japanese temple in misty forest at dusk, deep shadows between cedar trees, dim lantern glow, dark atmospheric fog',
  tag: 'HISTORICAL',
  tagColor: 'text-purple-400',
  span: ''
},
{
  id: 'underwater',
  name: 'Abyss Kingdom',
  prompt: 'Underwater 3000m deep, coral reef gym leaders, submarines replace bikes',
  biome: 'Aquatic / Deep Sea',
  gyms: 8,
  starters: 'Angler · Abyss · Coral',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_11fb07319-1772140263942.png",
  alt: 'Deep ocean darkness with bioluminescent coral and creatures emitting electric blue and teal glow, pitch black water, cinematic underwater atmosphere',
  tag: 'AQUATIC',
  tagColor: 'text-cyan-400',
  span: ''
},
{
  id: 'postapoc',
  name: 'The Wasteland',
  prompt: 'Post-apocalyptic wasteland, radiation zones replace gyms, rival has mutated Eevee',
  biome: 'Post-Apocalyptic',
  gyms: 8,
  starters: 'Ember · Rust · Decay',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_123bb4044-1772897587947.png",
  alt: 'Desolate post-apocalyptic wasteland at dusk, burnt orange sky, crumbling ruins silhouetted against smoke, dark oppressive atmosphere',
  tag: 'WASTELAND',
  tagColor: 'text-orange-400',
  span: ''
},
{
  id: 'tokyo',
  name: 'Neon Tokyo 2099',
  prompt: 'Cyberpunk Tokyo, digital SkyForge manifested from corrupted data streams',
  biome: 'Cyberpunk / Urban',
  gyms: 8,
  starters: 'Glitch · Cipher · Neon',
  image: "https://images.unsplash.com/photo-1696217572865-f7ffb96b9977",
  alt: 'Cyberpunk Tokyo skyline at night, dense neon signs in Japanese, deep shadows between skyscrapers, electric blue and magenta light pollution, dark cinematic atmosphere',
  tag: 'CYBERPUNK',
  tagColor: 'text-pink-400',
  span: 'col-span-3'
}];


export default function WorldsGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reveal');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);

    const cards = gridRef.current?.querySelectorAll('.world-card-wrapper');
    cards?.forEach((card, i) => {
      (card as HTMLElement).style.transitionDelay = `${i * 80}ms`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="worlds"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div
        ref={titleRef}
        className="mb-16 opacity-100"
        style={{ transition: 'opacity 0.8s ease, transform 0.8s ease' }}>
        
        <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground mb-4 block">
          Generated Worlds
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <h2 className="text-section-xl font-black tracking-tighter leading-[0.9]">
            <span className="text-foreground">EVERY WORLD</span>
            <br />
            <span className="text-gradient-blue">IS UNIQUE.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-sm leading-relaxed">
            No two prompts generate the same world. Every region, every NPC, every storyline — procedurally crafted by AI.
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      {/* STEP 4: JSX comments above each card div */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
        
        {/* [col-1: Miami Vice cs-1 rs-2] */}
        <div
          className="world-card-wrapper lg:row-span-2 opacity-100"
          style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          
          <div className="world-card h-full relative overflow-hidden electric-border group">
            <AppImage
              src={worlds[0].image}
              alt={worlds[0].alt}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" />
            
            {/* Scrim: dark gradient from bottom for white text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <span className={`text-[9px] font-mono font-black tracking-[0.3em] uppercase ${worlds[0].tagColor}`}>
                {worlds[0].tag}
              </span>
              <div>
                <h3 className="text-card-lg font-black tracking-tighter text-white mb-1">
                  {worlds[0].name}
                </h3>
                <p className="text-xs text-white/60 font-mono leading-relaxed mb-3">
                  {worlds[0].prompt}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md glass-dark text-[9px] font-mono font-bold text-white/70 tracking-wider">
                    {worlds[0].biome}
                  </span>
                  <span className="px-2 py-1 rounded-md glass-dark text-[9px] font-mono font-bold text-white/70 tracking-wider">
                    Starters: {worlds[0].starters}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* [col-2: Mars Colony cs-1 rs-1] */}
        <div
          className="world-card-wrapper opacity-100"
          style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          
          <div className="world-card h-full relative overflow-hidden electric-border group">
            <AppImage
              src={worlds[1].image}
              alt={worlds[1].alt}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              <span className={`text-[9px] font-mono font-black tracking-[0.3em] uppercase ${worlds[1].tagColor}`}>
                {worlds[1].tag}
              </span>
              <div>
                <h3 className="text-xl font-black tracking-tighter text-white mb-1">{worlds[1].name}</h3>
                <p className="text-xs text-white/60 font-mono">{worlds[1].biome}</p>
              </div>
            </div>
          </div>
        </div>

        {/* [col-3: Medieval Japan cs-1 rs-1] */}
        <div
          className="world-card-wrapper opacity-100"
          style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          
          <div className="world-card h-full relative overflow-hidden electric-border group">
            <AppImage
              src={worlds[2].image}
              alt={worlds[2].alt}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              <span className={`text-[9px] font-mono font-black tracking-[0.3em] uppercase ${worlds[2].tagColor}`}>
                {worlds[2].tag}
              </span>
              <div>
                <h3 className="text-xl font-black tracking-tighter text-white mb-1">{worlds[2].name}</h3>
                <p className="text-xs text-white/60 font-mono">{worlds[2].biome}</p>
              </div>
            </div>
          </div>
        </div>

        {/* [col-2: Underwater cs-1 rs-1] */}
        <div
          className="world-card-wrapper opacity-100"
          style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          
          <div className="world-card h-full relative overflow-hidden electric-border group">
            <AppImage
              src={worlds[3].image}
              alt={worlds[3].alt}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              <span className={`text-[9px] font-mono font-black tracking-[0.3em] uppercase ${worlds[3].tagColor}`}>
                {worlds[3].tag}
              </span>
              <div>
                <h3 className="text-xl font-black tracking-tighter text-white mb-1">{worlds[3].name}</h3>
                <p className="text-xs text-white/60 font-mono">{worlds[3].biome}</p>
              </div>
            </div>
          </div>
        </div>

        {/* [col-3: PostApoc cs-1 rs-1] */}
        <div
          className="world-card-wrapper opacity-100"
          style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          
          <div className="world-card h-full relative overflow-hidden electric-border group">
            <AppImage
              src={worlds[4].image}
              alt={worlds[4].alt}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              <span className={`text-[9px] font-mono font-black tracking-[0.3em] uppercase ${worlds[4].tagColor}`}>
                {worlds[4].tag}
              </span>
              <div>
                <h3 className="text-xl font-black tracking-tighter text-white mb-1">{worlds[4].name}</h3>
                <p className="text-xs text-white/60 font-mono">{worlds[4].biome}</p>
              </div>
            </div>
          </div>
        </div>

        {/* [col-1: Neon Tokyo cs-3 rs-1] — full width */}
        <div
          className="world-card-wrapper sm:col-span-2 lg:col-span-3 opacity-100"
          style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          
          <div className="world-card h-full relative overflow-hidden electric-border group">
            <AppImage
              src={worlds[5].image}
              alt={worlds[5].alt}
              fill
              sizes="100vw"
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105" />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end sm:justify-center max-w-2xl">
              <span className={`text-[9px] font-mono font-black tracking-[0.3em] uppercase mb-3 ${worlds[5].tagColor}`}>
                {worlds[5].tag}
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tighter text-white mb-2">
                {worlds[5].name}
              </h3>
              <p className="text-sm text-white/60 font-mono leading-relaxed mb-4 max-w-md">
                {worlds[5].prompt}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg glass-dark text-[10px] font-mono font-bold text-white/70 tracking-wider">
                  {worlds[5].biome}
                </span>
                <span className="px-3 py-1.5 rounded-lg glass-dark text-[10px] font-mono font-bold text-white/70 tracking-wider">
                  Starters: {worlds[5].starters}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}