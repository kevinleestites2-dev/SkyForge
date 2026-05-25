'use client';

import React, { useEffect, useRef, useState } from 'react';
import NPCDialog from './NPCDialog';

interface Town {
  name: string;
  type: 'starting' | 'mid' | 'city' | 'elite';
  description: string;
  x: number;
  y: number;
}

interface Route {
  from: number;
  to: number;
  name: string;
  hazard?: string;
}

interface Landmark {
  name: string;
  type: string;
  description: string;
  x: number;
  y: number;
}

interface Starter {
  name: string;
  type: string;
  secondType?: string | null;
  description: string;
  emoji: string;
}

interface GymLeader {
  name: string;
  type: string;
  badge: string;
  description: string;
  location: string;
}

interface EliteMember {
  name: string;
  type: string;
  title: string;
  description: string;
}

interface WorldData {
  regionName: string;
  tagline: string;
  lore: string;
  biome: string;
  atmosphere: string;
  mapLayout: {
    towns: Town[];
    routes: Route[];
    landmarks: Landmark[];
  };
  starters: Starter[];
  gymLeaders: GymLeader[];
  rival: { name: string; personality: string; starterType: string; backstory: string };
  eliteFour: EliteMember[];
  champion: { name: string; type: string; title: string; description: string };
  hiddenSecret: string;
  colors: { primary: string; secondary: string; accent: string };
}

const TYPE_COLORS: Record<string, string> = {
  Fire: '#FF6B35', Water: '#3B9EFF', Grass: '#4CAF50', Electric: '#FFD700',
  Psychic: '#FF69B4', Dark: '#6B4EFF', Dragon: '#7038F8', Ice: '#87CEEB',
  Fighting: '#C03028', Poison: '#A040A0', Ground: '#E0C068', Rock: '#B8A038',
  Bug: '#A8B820', Ghost: '#705898', Steel: '#B8B8D0', Normal: '#A8A878',
  Fairy: '#EE99AC', Flying: '#A890F0',
};

const TILE_W = 80;
const TILE_H = 40;
const TILE_DEPTH = 12;

function isoToScreen(x: number, y: number, offsetX: number, offsetY: number) {
  return {
    sx: offsetX + (x - y) * (TILE_W / 2),
    sy: offsetY + (x + y) * (TILE_H / 2),
  };
}

function drawIsometricTile(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  topColor: string,
  leftColor: string,
  rightColor: string
) {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;

  // Top face
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + hw, sy + hh);
  ctx.lineTo(sx, sy + TILE_H);
  ctx.lineTo(sx - hw, sy + hh);
  ctx.closePath();
  ctx.fillStyle = topColor;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Left face
  ctx.beginPath();
  ctx.moveTo(sx - hw, sy + hh);
  ctx.lineTo(sx, sy + TILE_H);
  ctx.lineTo(sx, sy + TILE_H + TILE_DEPTH);
  ctx.lineTo(sx - hw, sy + hh + TILE_DEPTH);
  ctx.closePath();
  ctx.fillStyle = leftColor;
  ctx.fill();
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(sx + hw, sy + hh);
  ctx.lineTo(sx, sy + TILE_H);
  ctx.lineTo(sx, sy + TILE_H + TILE_DEPTH);
  ctx.lineTo(sx + hw, sy + hh + TILE_DEPTH);
  ctx.closePath();
  ctx.fillStyle = rightColor;
  ctx.fill();
  ctx.stroke();
}

function drawTownMarker(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  town: Town,
  primaryColor: string
) {
  const colors = {
    starting: { top: '#4CAF50', left: '#2E7D32', right: '#388E3C', marker: '#69F0AE' },
    mid: { top: primaryColor, left: adjustBrightness(primaryColor, -40), right: adjustBrightness(primaryColor, -20), marker: '#fff' },
    city: { top: '#FFD700', left: '#F57F17', right: '#F9A825', marker: '#FFEA00' },
    elite: { top: '#9C27B0', left: '#4A148C', right: '#6A1B9A', marker: '#EA80FC' },
  };
  const c = colors[town.type] || colors.mid;

  drawIsometricTile(ctx, sx, sy - 16, c.top, c.left, c.right);

  // Building tower
  ctx.fillStyle = c.marker;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(sx, sy - 28, town.type === 'elite' ? 8 : town.type === 'city' ? 6 : 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Label
  ctx.font = `bold ${town.type === 'elite' ? 11 : 10}px 'Inter', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 4;
  ctx.fillText(town.name, sx, sy - 38);
  ctx.shadowBlur = 0;
}

function adjustBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function IsometricMap({ world, onTownClick }: { world: WorldData; onTownClick: (town: Town) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const towns = world.mapLayout?.towns || [];
    const routes = world.mapLayout?.routes || [];
    const primaryColor = world.colors?.primary || '#3B9EFF';

    // Find bounds
    const maxX = Math.max(...towns.map(t => t.x), 5);
    const maxY = Math.max(...towns.map(t => t.y), 5);
    const gridSize = Math.max(maxX, maxY) + 2;

    const offsetX = W / 2;
    const offsetY = H * 0.25;

    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(1, '#0d0d2b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Draw base terrain grid
    for (let gx = 0; gx < gridSize; gx++) {
      for (let gy = 0; gy < gridSize; gy++) {
        const { sx, sy } = isoToScreen(gx, gy, offsetX, offsetY);
        const noise = (Math.sin(gx * 1.7) + Math.cos(gy * 2.3)) * 0.05;
        const baseBrightness = 0.08 + noise;
        drawIsometricTile(
          ctx, sx, sy,
          `rgba(30, 40, 80, ${baseBrightness + 0.15})`,
          `rgba(15, 20, 50, ${baseBrightness + 0.1})`,
          `rgba(20, 28, 65, ${baseBrightness + 0.12})`
        );
      }
    }

    // Draw routes
    routes.forEach(route => {
      const from = towns[route.from];
      const to = towns[route.to];
      if (!from || !to) return;
      const { sx: sx1, sy: sy1 } = isoToScreen(from.x, from.y, offsetX, offsetY);
      const { sx: sx2, sy: sy2 } = isoToScreen(to.x, to.y, offsetX, offsetY);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = `${primaryColor}55`;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw towns
    towns.forEach(town => {
      const { sx, sy } = isoToScreen(town.x, town.y, offsetX, offsetY);
      drawTownMarker(ctx, sx, sy, town, primaryColor);
    });

    // Draw landmarks
    (world.mapLayout?.landmarks || []).forEach(lm => {
      const { sx, sy } = isoToScreen(lm.x, lm.y, offsetX, offsetY);
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.fillText(lm.type === 'cave' ? '⛰️' : lm.type === 'shrine' ? '⛩️' : lm.type === 'ruins' ? '🏚️' : '🗼', sx, sy - 20);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText(lm.name, sx, sy - 6);
    });

  }, [world]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = mx * scaleX;
    const cy = my * scaleY;

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height * 0.25;

    const towns = world.mapLayout?.towns || [];
    let closest = null;
    let minDist = 30;

    towns.forEach(town => {
      const { sx, sy } = isoToScreen(town.x, town.y, offsetX, offsetY);
      const dx = cx - sx;
      const dy = cy - (sy - 16);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        closest = town;
      }
    });

    if (closest) onTownClick(closest);
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={320}
      onClick={handleClick}
      className="w-full rounded-xl border border-white/10 cursor-pointer"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

export default function ForgeResult({ 
  world, 
  onReset,
  godMode = false 
}: { 
  world: WorldData; 
  onReset: () => void;
  godMode?: boolean;
}) {
  const [activeNPC, setActiveNPC] = useState<{
    name: string;
    type: string;
    personality: string;
    backstory: string;
  } | null>(null);

  const primary = world.colors?.primary || '#3B9EFF';
  const secondary = world.colors?.secondary || '#F5C842';
  const accent = world.colors?.accent || '#A78BFA';

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6 animate-fade-in">
      {/* NPC Dialog */}
      {activeNPC && (
        <NPCDialog 
          npc={activeNPC}
          world={{
            name: world.regionName,
            lore: world.lore,
            biome: world.biome
          }}
          godMode={godMode}
          onClose={() => setActiveNPC(null)}
        />
      )}

      {/* Region Header */}
      <div className="text-center space-y-2">
        <div className="text-xs font-mono uppercase tracking-[0.4em] opacity-60" style={{ color: accent }}>
          ⚡ World Generated
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter" style={{ color: primary }}>
          {world.regionName}
        </h2>
        <p className="text-lg font-mono opacity-70">{world.tagline}</p>
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ borderColor: primary + '60', color: primary }}>
            {world.biome?.toUpperCase()}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold border border-white/20 text-white/60">
            {world.atmosphere}
          </span>
        </div>
      </div>

      {/* Lore */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm leading-relaxed opacity-80 font-mono">{world.lore}</p>
      </div>

      {/* Isometric Map */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-3 flex justify-between items-center">
          <span>Region Map — Isometric View</span>
          <span className="text-[10px] text-primary/60 italic">Click towns to talk to locals</span>
        </div>
        <IsometricMap 
          world={world} 
          onTownClick={(town) => setActiveNPC({
            name: `Resident of ${town.name}`,
            type: 'Local NPC',
            personality: 'Friendly and informative',
            backstory: `I live in ${town.name}. ${town.description}`
          })}
        />
      </div>

      {/* Starters */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">Choose Your Starter</div>
        <div className="grid grid-cols-3 gap-3">
          {world.starters?.map((s, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center hover:border-white/30 transition-colors cursor-pointer">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="font-black text-sm">{s.name}</div>
              <div className="flex gap-1 justify-center mt-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: (TYPE_COLORS[s.type] || '#888') + '33', color: TYPE_COLORS[s.type] || '#888' }}>
                  {s.type}
                </span>
                {s.secondType && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: (TYPE_COLORS[s.secondType] || '#888') + '33', color: TYPE_COLORS[s.secondType] || '#888' }}>
                    {s.secondType}
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-50 mt-2 leading-tight">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gym Leaders + Rival */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4 flex justify-between">
            <span>Gym Leaders</span>
            <span className="text-[9px] text-primary/40 italic">Click to talk</span>
          </div>
          <div className="space-y-3">
            {world.gymLeaders?.slice(0, 4).map((gl, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10"
                onClick={() => setActiveNPC({
                  name: gl.name,
                  type: 'Gym Leader',
                  personality: gl.description,
                  backstory: `I am the gym leader in ${gl.location}. I award the ${gl.badge} badge to those who prove their worth.`
                })}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{ backgroundColor: (TYPE_COLORS[gl.type] || '#888') + '33', color: TYPE_COLORS[gl.type] || '#888' }}>
                  {gl.type[0]}
                </div>
                <div>
                  <div className="text-sm font-bold">{gl.name}</div>
                  <div className="text-[11px] opacity-50">{gl.badge} · {gl.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4 flex justify-between">
            <span>Your Rival</span>
            <span className="text-[9px] text-primary/40 italic">Click to talk</span>
          </div>
          {world.rival && (
            <div 
              className="p-3 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() => setActiveNPC({
                name: world.rival.name,
                type: 'Rival',
                personality: world.rival.personality,
                backstory: world.rival.backstory
              })}
            >
              <div className="text-xl font-black mb-1" style={{ color: secondary }}>{world.rival.name}</div>
              <div className="text-xs opacity-50 mb-2">{world.rival.personality}</div>
              <p className="text-[12px] opacity-70 leading-relaxed">{world.rival.backstory}</p>
            </div>
          )}

          <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-3 mt-5 flex justify-between">
            <span>Champion</span>
          </div>
          {world.champion && (
            <div 
              className="p-3 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() => setActiveNPC({
                name: world.champion.name,
                type: 'Champion',
                personality: world.champion.title,
                backstory: world.champion.description
              })}
            >
              <div className="text-lg font-black" style={{ color: accent }}>{world.champion.name}</div>
              <div className="text-xs opacity-50">{world.champion.title}</div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Secret */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-2">🔍 Hidden in this world...</div>
        <p className="text-sm font-mono opacity-60 italic">{world.hiddenSecret}</p>
      </div>

      {/* Reset */}
      <div className="text-center pb-8">
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-full border border-white/20 text-sm font-black uppercase tracking-widest hover:border-white/50 hover:bg-white/5 transition-colors"
        >
          ⚡ Forge Another World
        </button>
      </div>
    </div>
  );
}
