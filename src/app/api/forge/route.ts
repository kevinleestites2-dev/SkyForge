import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, godMode } = await req.json();
    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json({ error: 'Prompt too short' }, { status: 400 });
    }

    const systemPrompt = godMode
      ? `You are a master game world architect. The user has unlocked GOD MODE — ALL genre restrictions are removed. Generate ANY type of game world they describe. Be bold, creative, and epic. This is SkyForge — the only limit is imagination.`
      : `You are a master game world architect for SkyForge. Generate rich, detailed game worlds based on user descriptions. Any genre, any era, any universe. Be creative and original.`;

    const worldPrompt = `${systemPrompt}

User description: "${prompt}"

Generate a complete game world in this EXACT JSON format:
{
  "regionName": "Name of the region",
  "tagline": "Short epic tagline for the region",
  "lore": "2-3 sentences of world lore and backstory",
  "biome": "Primary biome type (e.g. volcanic, ocean, tundra, jungle, urban, space, etc.)",
  "atmosphere": "The mood/vibe in 3-5 words",
  "mapLayout": {
    "towns": [
      { "name": "Town name", "type": "starting|mid|city|elite", "description": "Brief description", "x": 0, "y": 0 },
      { "name": "Town name", "type": "mid", "description": "Brief description", "x": 2, "y": 1 },
      { "name": "Town name", "type": "mid", "description": "Brief description", "x": 1, "y": 3 },
      { "name": "Town name", "type": "city", "description": "Brief description", "x": 3, "y": 2 },
      { "name": "Town name", "type": "elite", "description": "Brief description", "x": 4, "y": 4 }
    ],
    "routes": [
      { "from": 0, "to": 1, "name": "Route name", "hazard": "Optional hazard description" }
    ],
    "landmarks": [
      { "name": "Landmark name", "type": "cave|tower|ruins|lab|shrine", "description": "Brief description", "x": 2, "y": 2 }
    ]
  },
  "starters": [
    { "name": "Creature name", "type": "Fire", "secondType": "Dark", "description": "Brief description", "emoji": "🔥" },
    { "name": "Creature name", "type": "Water", "secondType": null, "description": "Brief description", "emoji": "💧" },
    { "name": "Creature name", "type": "Nature", "secondType": "Poison", "description": "Brief description", "emoji": "🌿" }
  ],
  "gymLeaders": [
    { "name": "Leader name", "type": "Fire", "badge": "Badge name", "description": "Brief backstory", "location": "Town name" },
    { "name": "Leader name", "type": "Water", "badge": "Badge name", "description": "Brief backstory", "location": "Town name" }
  ],
  "rival": {
    "name": "Rival name",
    "personality": "Brief personality description",
    "starterType": "Fire",
    "backstory": "1-2 sentence backstory"
  },
  "eliteFour": [
    { "name": "Elite member name", "type": "Dragon", "title": "The Destroyer", "description": "Brief description" }
  ],
  "champion": {
    "name": "Champion name",
    "type": "Psychic",
    "title": "Champion title",
    "description": "Brief description"
  },
  "hiddenSecret": "One cryptic hint about a hidden area or mystery in this world",
  "colors": {
    "primary": "#3B9EFF",
    "secondary": "#F5C842",
    "accent": "#A78BFA"
  }
}

Return ONLY valid JSON. No markdown, no explanation, just the JSON object.`;

    const body = {
      contents: [{ parts: [{ text: worldPrompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 2048 }
    };

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini error:', err);
      return NextResponse.json({ error: 'Gemini API error' }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const cleaned = raw.replace(/^```json\n?/,'').replace(/\n?```$/,'').trim();
    
    let world;
    try {
      world = JSON.parse(cleaned);
    } catch {
      console.error('JSON parse error:', cleaned.substring(0, 200));
      return NextResponse.json({ error: 'Failed to parse world data' }, { status: 500 });
    }

    return NextResponse.json({ world });
  } catch (err) {
    console.error('Forge API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
