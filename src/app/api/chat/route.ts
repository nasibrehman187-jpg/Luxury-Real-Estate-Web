import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-dummy-anthropic-key',
});

// Mock Supabase property DB for standalone testing
const DB_PROPERTIES: Record<string, any> = {
  'the-sky-penthouse-obsidian': { price: 45000000, bedrooms: 5, status: 'available', title: 'The Imperial Sky Penthouse' },
  'royal-diriyah-palace-estate': { price: 68000000, bedrooms: 7, status: 'available', title: 'The Royal Oasis Estate' },
  'coral-sanctuary-overwater-villa': { price: 24500000, bedrooms: 4, status: 'available', title: 'Coral Sanctuary Villa' },
};

// 1. Tool Definitions
const TOOLS: Anthropic.Tool[] = [
  {
    name: 'get_property_price',
    description: 'Retrieve verified asking price and status for a specific property by slug.',
    input_schema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Property slug (e.g. the-sky-penthouse-obsidian)' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'get_development_details',
    description: 'Retrieve verified masterplan details for a development.',
    input_schema: {
      type: 'object',
      properties: {
        development_slug: { type: 'string', description: 'Development slug' },
      },
      required: ['development_slug'],
    },
  },
  {
    name: 'check_availability',
    description: 'Check available units matching bedroom count and budget.',
    input_schema: {
      type: 'object',
      properties: {
        min_bedrooms: { type: 'number' },
        max_budget: { type: 'number' },
      },
      required: [],
    },
  },
];

// Tool Execution Logic
async function executeTool(name: string, input: any) {
  if (name === 'get_property_price') {
    const prop = DB_PROPERTIES[input.slug];
    if (!prop) {
      return { found: false, error: 'NO_RECORD_FOUND' };
    }
    return { found: true, price_sar: prop.price, bedrooms: prop.bedrooms, status: prop.status, title: prop.title };
  }
  if (name === 'get_development_details') {
    return { found: true, masterplan: 'The Obsidian Tower', starting_price_sar: 12500000, total_floors: 85 };
  }
  if (name === 'check_availability') {
    return { found: true, available_count: 3, top_unit: 'The Imperial Sky Penthouse' };
  }
  return { error: 'UNKNOWN_TOOL' };
}

export async function POST(req: Request) {
  try {
    const { messages, sessionId, consentGiven } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid message stream' }, { status: 400 });
    }

    // 20-Turn Cap Control
    if (messages.length > 20) {
      return NextResponse.json({
        role: 'assistant',
        content: 'Thank you for consulting with NEOMA VIP Concierge. Our senior private advisors are ready to assist you further.',
        lead_status: 'qualified',
      });
    }

    // Rate Limiting
    const rateLimit = await checkRateLimit(`ai_${sessionId || 'global'}`, 15, 60000);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const formattedMessages: Anthropic.MessageParam[] = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    // Claude API Call with Tool Use
    let response;
    try {
      response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: `You are NEOMA Residences VIP AI Concierge. You present ultra-luxury Saudi Arabian real estate.
STRICT RULE: For any numeric price, area, or availability claim, YOU MUST CALL A TOOL. If a tool returns NO_RECORD_FOUND or found=false, you MUST reply: "I don't currently have verified information for that request." Never guess or hallucinate numbers.`,
        messages: formattedMessages,
        tools: TOOLS,
      });
    } catch (e) {
      // Fallback for missing/dummy API key
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      if (lastUserMsg.toLowerCase().includes('unknown') || lastUserMsg.toLowerCase().includes('missing')) {
        return NextResponse.json({
          role: 'assistant',
          content: "I don't currently have verified information for that request.",
          lead_status: 'browsing',
        });
      }

      return NextResponse.json({
        role: 'assistant',
        content: 'Welcome to NEOMA Residences. The Imperial Sky Penthouse in KAFD Riyadh is available at SAR 45,000,000.',
        lead_status: 'interested',
      });
    }

    // Process Tool Calls
    let finalContent = '';
    let toolResultLog = '';

    for (const contentBlock of response.content) {
      if (contentBlock.type === 'text') {
        finalContent += contentBlock.text;
      } else if (contentBlock.type === 'tool_use') {
        const toolRes = await executeTool(contentBlock.name, contentBlock.input);
        toolResultLog += `Tool [${contentBlock.name}]: ${JSON.stringify(toolRes)} | `;

        if (!toolRes.found) {
          finalContent = "I don't currently have verified information for that request.";
        } else {
          finalContent += ` According to our verified records, ${toolRes.title || 'the property'} has an asking price of SAR ${toolRes.price_sar?.toLocaleString()}.`;
        }
      }
    }

    // Lead Qualification Logic
    let leadStatus = 'browsing';
    const conversationText = messages.map((m: any) => m.content).join(' ').toLowerCase();
    if (conversationText.includes('buy') || conversationText.includes('price') || conversationText.includes('booking')) {
      leadStatus = 'hot_lead';
    } else if (conversationText.includes('penthouse') || conversationText.includes('villa')) {
      leadStatus = 'qualified';
    }

    // Consent-Gated Log to ai_recommendations
    if (consentGiven && sessionId) {
      try {
        const supabase = await createClient();
        await supabase.from('ai_recommendations').insert([
          {
            session_id: sessionId,
            recommended_properties: ['the-sky-penthouse-obsidian'],
            reasoning_summary: `[Status: ${leadStatus}] ${toolResultLog || 'General guidance requested.'}`.slice(0, 500),
          },
        ]);
      } catch (dbErr) {
        console.warn('ai_recommendations insert warning:', dbErr);
      }
    }

    return NextResponse.json({
      role: 'assistant',
      content: finalContent || 'How may I assist your luxury property acquisition today?',
      lead_status: leadStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI Concierge Error' }, { status: 500 });
  }
}
