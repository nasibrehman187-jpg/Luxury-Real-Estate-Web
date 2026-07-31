'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/client';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { Calendar, Clock, X, Send, ShieldCheck, AlertCircle } from 'lucide-react';

const viewingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Phone number is required'),
  preferred_date: z.string().min(1, 'Please select a date'),
  preferred_time: z.string().min(1, 'Please select a business hour slot'),
  notes: z.string().optional(),
  honeypot: z.string().max(0),
});

type ViewingData = z.infer<typeof viewingSchema>;

// Business hours 9 AM - 6 PM Riyadh time
const BUSINESS_HOURS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

interface Props {
  locale: string;
  propertyId: string;
  propertyTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivateViewingModal({
  locale,
  propertyId,
  propertyTitle,
  isOpen,
  onClose,
}: Props) {
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
  } = useForm<ViewingData>({
    resolver: zodResolver(viewingSchema),
  });

  const onSubmit = async (data: ViewingData) => {
    // Immediate client button disable
    setSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Rate Limiting Check
      const rateLimit = await checkRateLimit(`viewing_${data.email}`, 5, 60000);
      if (!rateLimit.success) {
        setErrorMessage(
          isAr
            ? 'لقد تجاوزت حد الطلبات المسموح به. يرجى المحاولة بعد قليل.'
            : 'Too many requests. Please wait a moment.'
        );
        setSubmitting(false);
        return;
      }

      // 2. Server-side Duplicate Prevention Check (last 10 minutes)
      const supabase = createClient();
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

      const { data: existingBookings } = await supabase
        .from('private_viewings')
        .select('id')
        .eq('email', data.email)
        .eq('property_id', propertyId)
        .eq('preferred_date', data.preferred_date)
        .gte('created_at', tenMinsAgo);

      if (existingBookings && existingBookings.length > 0) {
        setErrorMessage(
          isAr
            ? 'توجد جولة خاصة بنفس البيانات تم تقديمها مؤخراً. يرجى الانتظار لتأكيد موعدك.'
            : 'A private viewing request with these details was submitted recently. Our team is reviewing it.'
        );
        setSubmitting(false);
        return;
      }

      // 3. Insert into private_viewings
      const { error } = await supabase.from('private_viewings').insert([
        {
          property_id: propertyId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferred_date: data.preferred_date,
          preferred_time: data.preferred_time,
          notes: data.notes || '',
          status: 'pending',
        },
      ]);

      if (error) {
        console.warn('Private viewing DB insert error:', error.message);
      }

      // 4. Dispatch Analytics Event
      trackEvent(TRACKING_EVENTS.VIEWING_BOOKING, {
        propertyId,
        propertyTitle,
        date: data.preferred_date,
        time: data.preferred_time,
      });

      setSubmitted(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to book viewing');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-neoma-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel p-8 rounded-3xl max-w-lg w-full border border-neoma-gold/40 relative shadow-gold-glow bg-neoma-black/95 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full glass-panel text-neoma-ivory hover:text-neoma-gold"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-neoma-gold/20 border border-neoma-gold flex items-center justify-center text-neoma-gold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-playfair font-bold text-neoma-ivory">
                {isAr ? 'حجز معاينة خاصة' : 'Schedule Private Viewing'}
              </h3>
              <span className="text-xs font-mono text-neoma-gold">
                {propertyTitle}
              </span>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-neoma-emerald/20 border border-neoma-emerald flex items-center justify-center text-neoma-emerald mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-neoma-ivory">
                {isAr ? 'تم طلب موعد المعاينة الخاصة' : 'Viewing Requested'}
              </h4>
              <p className="text-neoma-gray-300 text-xs leading-relaxed max-w-sm mx-auto">
                {isAr
                  ? 'تم استلام طلبك بنجاح. سيتواصل معك مستشار المعاينة لتأكيد الموعد.'
                  : 'Your request has been logged. An advisory concierge will confirm your viewing window.'}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase"
              >
                {isAr ? 'إغلاق النافذة' : 'Close Window'}
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
                  className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold"
                  placeholder="H.E. Sheikh Faisal"
                />
                {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neoma-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold"
                    placeholder="faisal@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-neoma-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold"
                    placeholder="+966 50 123 4567"
                  />
                  {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neoma-gray-300 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('preferred_date')}
                    className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold"
                  />
                  {errors.preferred_date && <p className="text-red-400 text-[11px] mt-1">{errors.preferred_date.message}</p>}
                </div>

                <div>
                  <label className="block text-neoma-gray-300 mb-1">Riyadh Business Hour *</label>
                  <select
                    {...register('preferred_time')}
                    className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold"
                  >
                    <option value="">Select Time Slot</option>
                    {BUSINESS_HOURS.map((hr) => (
                      <option key={hr} value={hr}>{hr}</option>
                    ))}
                  </select>
                  {errors.preferred_time && <p className="text-red-400 text-[11px] mt-1">{errors.preferred_time.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-neoma-gray-300 mb-1">Special Viewing Notes</label>
                <textarea
                  rows={2}
                  {...register('notes')}
                  className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold"
                  placeholder="Helipad access or security detail escort requirement..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Confirming Window...' : 'Confirm Private Viewing'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
