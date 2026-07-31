import { NextResponse } from 'next/server';
import { z } from 'zod';

const comparePdfSchema = z.object({
  properties: z.array(z.object({
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    price: z.number(),
    bedrooms: z.number(),
    area: z.number(),
  })).min(1),
  locale: z.string().default('en'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = comparePdfSchema.parse(json);

    const titleText = parsed.locale === 'ar' ? 'NEOMA Residences — Property Comparison' : 'NEOMA Residences — Property Comparison';
    const bodyLines = parsed.properties.map(
      (p) => `- ${p.title_en || p.title_ar}: SAR ${p.price.toLocaleString()} | ${p.bedrooms} Beds | ${p.area} sq.m`
    );

    const pdfBuffer = Buffer.from(
      `%PDF-1.4\n1 0 obj\n<< /Title (${titleText}) /Subject (Comparison Matrix) >>\nendobj\n${bodyLines.join('\n')}`
    );

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="NEOMA_Comparison.pdf"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'PDF Generation Error' }, { status: 400 });
  }
}
