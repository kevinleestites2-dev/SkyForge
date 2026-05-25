'use client';

import React, { useState, useEffect, useRef } from 'react';

interface NPCDialogProps {
  npc: {
    name: string;
    type: string;
    personality: string;
    backstory: string;
  };
  world: {
    name: string;
    lore: string;
    biome: string;
  };
  godMode: boolean;
  onClose: () => void;
}

export default function NPCDialog({ npc, world, godMode, onClose }: NPCDialogProps) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'player' | 'npc'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isTyping]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() || isTyping) return;

    const playerText = message.trim();
    setMessage('');
    setChat((prev) => [...prev, { role: 'player', text: playerText }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/npc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npcName: npc.name,
          npcType: npc.type,
          npcPersonality: npc.personality,
          npcBackstory: npc.backstory,
          worldName: world.name,
          worldLore: world.lore,
          worldBiome: world.biome,
          playerMessage: playerText,
          godMode,
        }),
      });

      const data = await res.json();
      if (data.response) {
        setChat((prev) => [...prev, { role: 'npc', text: data.response }]);
      } else {
        setChat((prev) => [...prev, { role: 'npc', text: "..." }]);
      }
    } catch (err) {
      console.error('Failed to talk to NPC:', err);
      setChat((prev) => [...prev, { role: 'npc', text: "I have nothing to say to you right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0a0a0f] border border-[#F5C842]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#7C3AED]/20 to-transparent flex justify-between items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#F5C842]/60">{npc.type}</div>
            <h3 className="text-xl font-black text-white">{npc.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white/50 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px] scroll-smooth"
        >
          {chat.length === 0 && (
            <div className="text-center py-8 opacity-40">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm font-mono">Say something to {npc.name}...</p>
            </div>
          )}
          
          {chat.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === 'player' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'player' 
                  ? 'bg-[#7C3AED] text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842]/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842]/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842]/50" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form 
          onSubmit={handleSend}
          className="p-4 border-t border-white/10 bg-white/5 flex gap-2"
        >
          <input
            autoFocus
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${npc.name}...`}
            className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#F5C842]/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="px-4 py-2 bg-[#F5C842] text-black font-bold rounded-full text-xs uppercase tracking-widest disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
