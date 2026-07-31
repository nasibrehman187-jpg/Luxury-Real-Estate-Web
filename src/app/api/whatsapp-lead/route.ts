import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';
import { parseDeviceTypeFromUA } from '@/lib/attribution';

const waLeadSchema = z.object({
  sourcePage: z.string().default('/'),
  propertyId: z.string().optional().nullable(),
  messageType: z.enum(['property_inquiry', 'consultation', 'investment', 'brochure']).default('consultation'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = waLeadSchema.parse(json);

    const userAgent = req.headers.get('user-agent');
    const deviceType = parseDeviceTypeFromUA(userAgent);

    // Rate Limiting
    const rateLimit = await checkRateLimit(`wa_${parsed.sourcePage || 'global'}`, 20, 60000);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Insert into whatsapp_leads
    try {
      const supabase = await createClient();
      await supabase.from('whatsapp_leads').insert([
        {
          source_page: parsed.sourcePage,
          property_id: parsed.propertyId || null,
          message_type: parsed.messageType,
          device_type: deviceType,
        },
      ]);
    } catch (dbErr) {
      console.warn('WhatsApp lead insert error:', dbErr);
    }

    return NextResponse.json({ success: true, deviceType });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Validation or Server Error' }, { status: 400 });
  }
}
