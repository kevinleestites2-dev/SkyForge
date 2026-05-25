import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  try {
    const {
      npcName,
      npcType,
      npcPersonality,
      npcBackstory,
      worldName,
      worldLore,
      worldBiome,
      playerMessage,
      godMode
    } = await req.json();

    if (!playerMessage) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const systemPrompt = `You are ${npcName}, a ${npcType} in the world of ${worldName}.
World Lore: ${worldLore}
World Biome: ${worldBiome}
Your Personality: ${npcPersonality}
Your Backstory: ${npcBackstory}

${godMode ? 'GOD MODE is active: You are aware that this world is one of many infinite possibilities and your genre restrictions are lifted.' : 'Stay strictly in character as an inhabitant of this world.'}

Rules for your response:
1. Speak IN CHARACTER.
2. Be punchy and alive.
3. Keep it to 1-3 sentences max.
4. Do not sound like an AI assistant. Have attitude, quirks, and soul.
5. Use the world context (lore, biome) in your speech if relevant.`;

    const chatPrompt = `${systemPrompt}

Player says: "${playerMessage}"

${npcName}'s response:`;

    const body = {
      contents: [{ parts: [{ text: chatPrompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 150,
      }
    };

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini error (NPC):', err);
      return NextResponse.json({ error: 'Gemini API error' }, { status: 500 });
    }

    const data = await response.json();
    const npcResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response...";

    return NextResponse.json({ response: npcResponse.trim() });
  } catch (err) {
    console.error('NPC API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
