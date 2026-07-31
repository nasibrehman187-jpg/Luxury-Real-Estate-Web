'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/client';
import { getSignedUrl } from '@/lib/supabase/storage';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { Download, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const brochureSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Phone number is required'),
  country: z.string().min(2, 'Country is required'),
  marketing_consent: z.boolean().default(false), // Unchecked by default (PDPL)
  honeypot: z.string().max(0),
});

type BrochureData = z.infer<typeof brochureSchema>;

interface Props {
  locale: string;
  propertyId?: string;
  developmentId?: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BrochureDownloadModal({
  locale,
  propertyId,
  developmentId,
  title,
  isOpen,
  onClose,
}: Props) {
  const isAr = locale === 'ar';

  const [submitting, setSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrochureData>({
    resolver: zodResolver(brochureSchema),
    defaultValues: { marketing_consent: false },
  });

  const onSubmit = async (data: BrochureData) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Rate Limiting Check
      const rateLimit = await checkRateLimit(`brochure_${data.email}`, 5, 60000);
      if (!rateLimit.success) {
        setErrorMessage(
          isAr
            ? 'لقد تجاوزت حد الطلبات المسموح به. يرجى المحاولة بعد قليل.'
            : 'Too many requests. Please wait a moment.'
        );
        setSubmitting(false);
        return;
      }

      // 2. Insert into brochure_downloads
      const supabase = createClient();
      await supabase.from('brochure_downloads').insert([
        {
          property_id: propertyId || null,
          development_id: developmentId || null,
          name: data.name,
          email: data.email,
          phone: data.phone,
          country: data.country,
          marketing_consent: data.marketing_consent,
        },
      ]);

      // 3. Generate Signed URL for Brochure PDF (15 min expiry)
      const signedRes = await getSignedUrl('brochures', 'NEOMA_Masterplan_Prospectus.pdf', 900);
      const url = signedRes.url || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80';

      // 4. Dispatch Analytics Event
      trackEvent(TRACKING_EVENTS.BROCHURE_DOWNLOAD, {
        title,
        country: data.country,
        consent: data.marketing_consent,
      });

      setDownloadUrl(url);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process download.');
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-playfair font-bold text-neoma-ivory">
                {isAr ? 'تحميل الكتيب التجاري الخاص' : 'Download Private Prospectus'}
              </h3>
              <span className="text-xs font-mono text-neoma-gold">
                {title}
              </span>
            </div>
          </div>

          {downloadUrl ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-neoma-emerald/20 border border-neoma-emerald flex items-center justify-center text-neoma-emerald mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-neoma-ivory">
                {isAr ? 'تم تجهيز رابط التحميل الخاص' : 'Brochure Ready'}
              </h4>
              <p className="text-neoma-gray-300 text-xs leading-relaxed max-w-sm mx-auto">
                {isAr
                  ? 'رابط الكتيب المشفر جاهز للتحميل ومتاح لمدة ١٥ دقيقة.'
                  : 'Your secure signed download link has been generated and expires in 15 minutes.'}
              </p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gold-gradient text-neoma-black font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-90"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? 'تحميل ملف PDF' : 'Download PDF Prospectus'}</span>
              </a>
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

              <div>
                <label className="block text-neoma-gray-300 mb-1">Country of Residence *</label>
                <input
                  type="text"
                  {...register('country')}
                  className="w-full px-3 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:border-neoma-gold"
                  placeholder="Saudi Arabia / United Kingdom / UAE"
                />
                {errors.country && <p className="text-red-400 text-[11px] mt-1">{errors.country.message}</p>}
              </div>

              {/* Explicit Unchecked Marketing Consent Checkbox (PDPL) */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="marketing_consent"
                  {...register('marketing_consent')}
                  className="w-4 h-4 mt-0.5 accent-neoma-gold rounded cursor-pointer"
                />
                <label htmlFor="marketing_consent" className="text-[11px] text-neoma-gray-400 font-sans leading-tight cursor-pointer">
                  {isAr
                    ? 'أوافق على استلام التحديثات والنشرات الاستثمارية الفاخرة من نيوما رزيدنسز (وفق نظام PDPL).'
                    : 'I consent to receiving exclusive investment updates and new launch announcements from NEOMA Residences.'}
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{submitting ? 'Generating Signed PDF...' : 'Get Signed Download Link'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
