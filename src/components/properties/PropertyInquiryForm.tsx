'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/client';
import { extractAttribution } from '@/lib/attribution';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { Send, Phone, MessageSquare, AlertCircle, ShieldCheck } from 'lucide-react';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  message: z.string().optional(),
  request_callback: z.boolean().default(false),
  honeypot: z.string().max(0, 'Bot submission detected'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function PropertyInquiryForm({
  locale,
  propertyId,
  propertyTitle,
}: {
  locale: string;
  propertyId?: string;
  propertyTitle?: string;
}) {
  const t = useTranslations('Consultation');
  const isAr = locale === 'ar';

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { request_callback: false },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Rate Limiting Check
      const rateLimit = await checkRateLimit(`inquiry_${data.email}`, 5, 60000);
      if (!rateLimit.success) {
        setErrorMessage(
          isAr
            ? 'لقد تجاوزت حد الطلبات المسموح به. يرجى المحاولة بعد قليل.'
            : 'Too many requests. Please wait a moment before trying again.'
        );
        setSubmitting(false);
        return;
      }

      // 2. Extract Lead Attribution
      const attr = extractAttribution();
      const finalMsg = data.request_callback
        ? `[REQUEST CALLBACK] ${data.message || ''}`.trim()
        : data.message || '';

      // 3. Log to property_inquiries
      const supabase = createClient();
      const { error } = await supabase.from('property_inquiries').insert([
        {
          property_id: propertyId || null,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: finalMsg,
          source_page: typeof window !== 'undefined' ? window.location.pathname : '/properties',
          utm_source: attr.utm_source,
          utm_medium: attr.utm_medium,
          utm_campaign: attr.utm_campaign,
          device_type: attr.device_type,
          status: 'new',
        },
      ]);

      if (error) {
        console.warn('Property inquiry DB error:', error.message);
      }

      // 4. Dispatch Analytics Event
      trackEvent(TRACKING_EVENTS.PROPERTY_INQUIRY, {
        propertyId,
        propertyTitle,
        request_callback: data.request_callback,
      });

      setSubmitted(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border-neoma-gold/30 shadow-gold-glow">
      <h3 className="text-xl font-playfair font-bold text-neoma-ivory mb-2">
        {isAr ? 'استفسار مباشر عن الوحدة' : 'Direct Property Inquiry'}
      </h3>
      <p className="text-neoma-gray-400 text-xs mb-6">
        {isAr
          ? 'تواصل مع مستشار الوحدة المخصص لمعاينة خطط الأسعار والتوفر.'
          : 'Connect directly with a dedicated luxury advisor for pricing and availability.'}
      </p>

      {submitted ? (
        <div className="text-center py-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-neoma-emerald/20 border border-neoma-emerald flex items-center justify-center text-neoma-emerald mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-neoma-ivory">
            {isAr ? 'تم إرسال استفسارك بنجاح' : 'Inquiry Submitted'}
          </h4>
          <p className="text-neoma-gray-300 text-xs">
            {isAr ? 'سيتواصل معك المستشار الخاص في أقرب وقت.' : 'A dedicated advisor will respond shortly.'}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-4 py-2 rounded-full border border-neoma-gold/30 text-neoma-gold text-xs uppercase"
          >
            {isAr ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-mono">
          <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-neoma-gray-300 mb-1">Full Name *</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none"
              placeholder="H.E. Sheikh Faisal"
            />
            {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-neoma-gray-300 mb-1">Email Address *</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none"
              placeholder="faisal@example.com"
            />
            {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-neoma-gray-300 mb-1">Phone Number *</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none"
              placeholder="+966 50 123 4567"
            />
            {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-neoma-gray-300 mb-1">Inquiry Details</label>
            <textarea
              rows={3}
              {...register('message')}
              className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none"
              placeholder="Specific floor level, view, or financing questions..."
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="request_callback"
              {...register('request_callback')}
              className="w-4 h-4 accent-neoma-gold rounded cursor-pointer"
            />
            <label htmlFor="request_callback" className="text-neoma-gray-300 text-xs font-sans cursor-pointer">
              {isAr ? 'طلب الاتصال الهاتفي الفوري' : 'Request immediate phone callback'}
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال الاستفسار' : 'Submit Inquiry')}</span>
          </button>
        </form>
      )}
    </div>
  );
}
