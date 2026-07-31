'use client';

import { useState, useEffect } from 'react';
import { initializeAnalytics } from '@/lib/analytics';
import { ShieldCheck, Cookie } from 'lucide-react';

export default function CookieConsent({ locale }: { locale: string }) {
  const [show, setShow] = useState(false);
  const isAr = locale === 'ar';

  useEffect(() => {
    const consent = localStorage.getItem('neoma_cookie_consent');
    if (!consent) {
      setShow(true);
    } else if (consent === 'accepted') {
      initializeAnalytics({
        gaId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || process.env.GOOGLE_ANALYTICS_ID,
        gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || process.env.GOOGLE_TAG_MANAGER_ID,
        pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID,
      });
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('neoma_cookie_consent', 'accepted');
    setShow(false);
    initializeAnalytics({
      gaId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || process.env.GOOGLE_ANALYTICS_ID,
      gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || process.env.GOOGLE_TAG_MANAGER_ID,
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID,
    });
  };

  const handleDecline = () => {
    localStorage.setItem('neoma_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
      <div className="glass-panel p-6 rounded-3xl border-neoma-gold/40 shadow-gold-glow bg-neoma-black/95 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-neoma-gold/10 text-neoma-gold border border-neoma-gold/30">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-playfair font-bold text-neoma-ivory mb-1">
              {isAr ? 'الخصوصية وملفات تعريف الارتباط (PDPL)' : 'Privacy & Cookie Preferences (Saudi PDPL / GDPR)'}
            </h4>
            <p className="text-xs text-neoma-gray-300 leading-relaxed max-w-md">
              {isAr
                ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربة تصفحك وتحليل حركة الزوار وفقاً لنظام حماية البيانات الشخصية.'
                : 'We use essential and analytics cookies to personalize your luxury browsing experience in accordance with Saudi PDPL regulations.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-full border border-neoma-gold/20 text-xs text-neoma-gray-300 hover:text-neoma-ivory"
          >
            {isAr ? 'ضروري فقط' : 'Essential Only'}
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-90"
          >
            {isAr ? 'موافقة' : 'Accept All'}
          </button>
        </div>
      </div>
    </div>
  );
}
