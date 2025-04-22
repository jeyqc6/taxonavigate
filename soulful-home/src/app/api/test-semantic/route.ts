import { NextResponse } from 'next/server';
import { performSemanticSearch } from '@/lib/semantic_search';

// Mock user report for testing
const mockUserReport = {
  internal_report: {
    aesthetic_style: "minimalist with natural elements",
    emotional_tone: "calm and peaceful",
    behavioral_habit: "enjoys reading and meditation",
    target_ad_copy: {
      trend_orientation: "timeless over trendy",
      ad_resistance: "low",
      tone: "warm and inviting"
    },
    packaged_for: "wellness and lifestyle brands"
  },
  persona_copy: "A gentle minimalist who finds peace in simplicity and nature",
  style_tags: {
    aesthetic_style: "minimalist with natural elements",
    material_texture: "wood and linen",
    lighting_mood: "soft and warm",
    room_typology: "reading nook",
    emotional_imagery: "peaceful and serene",
    persona_cues: "mindful and intentional"
  },
  home_archetype: "gentle minimalist"
};

export async function GET() {
  try {
    const results = await performSemanticSearch(mockUserReport);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in semantic search test:', error);
    return NextResponse.json(
      { error: 'Failed to perform semantic search' },
      { status: 500 }
    );
  }
} 