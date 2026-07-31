'use client';

import { useState } from 'react';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { MessageSquare, X } from 'lucide-react';

export default function WhatsAppButton({ locale, propertyId }: { locale: string; propertyId?: string }) {
  const [openMenu, setOpenMenu] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+966500000000';
  const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, '');

  const templates = [
    {
      label: locale === 'ar' ? 'استفسار عن المشاريع والوحدات' : 'Property Inquiry',
      message: 'Hello, I am interested in exploring NEOMA luxury residences.',
      type: 'property_inquiry',
    },
    {
      label: locale === 'ar' ? 'حجز استشارة خاصة' : 'Schedule Consultation',
      message: 'I would like to schedule a private consultation with a senior NEOMA advisor.',
      type: 'consultation',
    },
    {
      label: locale === 'ar' ? 'طلب معلومات الاستثمار' : 'Investment Information',
      message: 'I would like to receive the NEOMA investment prospectus and capital growth report.',
      type: 'investment',
    },
  ];

  const handleOpen = async (tpl: typeof templates[0]) => {
    trackEvent(TRACKING_EVENTS.WHATSAPP_CLICK, { template: tpl.message, type: tpl.type });

    // Post to server-side WhatsApp lead logging endpoint
    try {
      await fetch('/api/whatsapp-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
          propertyId: propertyId || null,
          messageType: tpl.type,
        }),
      });
    } catch (e) {
      console.warn('WhatsApp lead tracking endpoint failed:', e);
    }

    const encoded = encodeURIComponent(tpl.message);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
    setOpenMenu(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {openMenu && (
        <div className="mb-3 glass-panel p-4 rounded-2xl w-64 border-neoma-emerald/40 bg-neoma-black/95 space-y-2 shadow-emerald-glow">
          <div className="flex items-center justify-between border-b border-neoma-emerald/20 pb-2">
            <span className="text-xs font-mono text-neoma-emerald font-bold uppercase">
              WhatsApp Direct
            </span>
            <button onClick={() => setOpenMenu(false)} className="text-neoma-gray-400 hover:text-neoma-ivory">
              <X className="w-4 h-4" />
            </button>
          </div>
          {templates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => handleOpen(tpl)}
              className="w-full text-left p-2.5 rounded-xl hover:bg-neoma-surface text-xs font-medium text-neoma-ivory hover:text-neoma-emerald transition-colors"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="p-4 rounded-full bg-neoma-emerald text-neoma-ivory font-bold shadow-emerald-glow hover:scale-105 transition-all flex items-center justify-center"
        title="WhatsApp VIP Connect"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
      </button>
    </div>
  );
}
