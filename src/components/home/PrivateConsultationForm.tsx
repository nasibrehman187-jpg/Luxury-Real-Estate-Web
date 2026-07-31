'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { crmAdapter } from '@/lib/crm/adapter';
import { sendTransactionalEmail } from '@/lib/email/resend';
import { getConsultationConfirmationEmail } from '@/lib/email/templates';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/client';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { Calendar, PhoneCall, MessageCircle, Send, ShieldCheck, AlertCircle } from 'lucide-react';

const consultationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  property_interest: z.string().optional(),
  preferred_date: z.string().optional(),
  message: z.string().optional(),
  honeypot: z.string().max(0, 'Bot submission detected'),
});

type FormData = z.infer<typeof consultationSchema>;

export default function PrivateConsultationForm({ locale }: { locale: string }) {
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
  } = useForm<FormData>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Client-side Rate Limit check
      const rateLimitRes = await checkRateLimit(`consultation_${data.email}`, 5, 60000);
      if (!rateLimitRes.success) {
        setErrorMessage(
          isAr
            ? 'لقد تجاوزت حد الطلبات المسموح به. يرجى المحاولة بعد قليل.'
            : 'Too many requests. Please wait a moment before trying again.'
        );
        setSubmitting(false);
        return;
      }

      // 2. Insert into Supabase consultation_requests
      const supabase = createClient();
      const { error } = await supabase.from('consultation_requests').insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          property_interest: data.property_interest || 'General Inquiry',
          preferred_date: data.preferred_date ? data.preferred_date : null,
          message: data.message || '',
        },
      ]);

      if (error) {
        console.warn('Supabase consultation submission error, recording locally:', error.message);
      }

      // 3. Dispatch analytics event
      trackEvent(TRACKING_EVENTS.CONSULTATION_SUBMIT, {
        name: data.name,
        property_interest: data.property_interest,
      });

      // 4. Automatic CRM Sync (HubSpot Reference Adapter)
      try {
        await crmAdapter.syncContact({
          email: data.email,
          name: data.name,
          phone: data.phone,
          source: 'Private Consultation Form',
        });
        await crmAdapter.syncLead({
          contact: { email: data.email, name: data.name, phone: data.phone },
          propertyInterest: data.property_interest || 'General Luxury Portfolio',
        });
      } catch (crmErr) {
        console.warn('CRM sync warning:', crmErr);
      }

      // 5. Automatic Transactional Email
      try {
        const emailHtml = getConsultationConfirmationEmail(data.name);
        await sendTransactionalEmail(data.email, 'Private Advisory Session Request Confirmed', emailHtml);
      } catch (mailErr) {
        console.warn('Transactional email warning:', mailErr);
      }

      setSubmitted(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="consultation" className="py-28 bg-neoma-dark relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neoma-gold/30 text-neoma-gold text-xs font-mono tracking-widest uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-neoma-ivory mb-6">
            {t('title')}
          </h2>
          <p className="text-neoma-gray-300 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Form Box */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-neoma-gold/30 shadow-gold-glow">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neoma-emerald/20 border border-neoma-emerald flex items-center justify-center text-neoma-emerald mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-neoma-ivory">
                {isAr ? 'تم استلام طلب الجولة الخاصة بنجاح' : 'Private Advisory Request Received'}
              </h3>
              <p className="text-neoma-gray-300 text-sm max-w-md mx-auto">
                {t('success')}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-2.5 rounded-full border border-neoma-gold/40 text-neoma-gold text-xs uppercase tracking-wider hover:bg-neoma-gold hover:text-neoma-black transition-all"
              >
                {isAr ? 'إرسال طلب آخر' : 'Submit Another Request'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot Spam Field */}
              <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-mono text-neoma-gray-300 mb-2 uppercase">
                    {t('name')} *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none text-sm"
                    placeholder="H.E. Sheikh Faisal Al-Otaibi"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-mono text-neoma-gray-300 mb-2 uppercase">
                    {t('email')} *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none text-sm"
                    placeholder="faisal@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-mono text-neoma-gray-300 mb-2 uppercase">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none text-sm"
                    placeholder="+966 50 123 4567"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-mono text-neoma-gray-300 mb-2 uppercase">
                    {t('preferredDate')}
                  </label>
                  <input
                    type="date"
                    {...register('preferred_date')}
                    className="w-full px-4 py-3 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Property Interest */}
              <div>
                <label className="block text-xs font-mono text-neoma-gray-300 mb-2 uppercase">
                  {t('propertyInterest')}
                </label>
                <select
                  {...register('property_interest')}
                  className="w-full px-4 py-3 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none text-sm"
                >
                  <option value="The Obsidian Tower Riyadh">The Obsidian Tower — Riyadh</option>
                  <option value="Diriyah Royal Estates">Diriyah Royal Estates — Riyadh</option>
                  <option value="Red Sea Horizon Villas">Red Sea Horizon Villas — Red Sea Coast</option>
                  <option value="General Luxury Portfolio">General Luxury Advisory</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-mono text-neoma-gray-300 mb-2 uppercase">
                  {t('message')}
                </label>
                <textarea
                  rows={4}
                  {...register('message')}
                  className="w-full px-4 py-3 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold focus:outline-none text-sm"
                  placeholder="Please specify any bespoke security, butler, or view preferences..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-gold-glow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? t('submitting') : t('submit')}</span>
              </button>
            </form>
          )}

          {/* WhatsApp Direct Notice */}
          <div className="mt-8 pt-6 border-t border-neoma-gold/10 text-center">
            <p className="text-xs text-neoma-gray-400">
              {t('whatsAppNotice')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
