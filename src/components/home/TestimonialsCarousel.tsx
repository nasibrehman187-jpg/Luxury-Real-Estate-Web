'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

export interface TestimonialItem {
  id: string;
  client_name: string;
  nationality: string;
  development: string;
  rating: number;
  quote_en: string;
  quote_ar: string;
  avatar: string;
  featured: boolean;
}

interface Props {
  locale: string;
  testimonials: TestimonialItem[];
}

export default function TestimonialsCarousel({ locale, testimonials }: Props) {
  const t = useTranslations('Testimonials');
  const isAr = locale === 'ar';

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!testimonials || testimonials.length === 0) return null;

  const activeTestimonial = testimonials[currentIndex];
  const quote = isAr ? activeTestimonial.quote_ar : activeTestimonial.quote_en;

  return (
    <section className="py-28 bg-neoma-black relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neoma-gold/30 text-neoma-gold text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-neoma-ivory mb-6">
            {t('title')}
          </h2>
          <p className="text-neoma-gray-300 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Carousel Slide */}
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border-neoma-gold/30 relative shadow-gold-glow">
          <Quote className="w-12 h-12 text-neoma-gold/20 mx-auto mb-8" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Star Rating */}
              <div className="flex justify-center gap-1">
                {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-neoma-gold text-neoma-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg sm:text-2xl font-playfair font-medium text-neoma-ivory leading-relaxed max-w-3xl mx-auto italic">
                "{quote}"
              </p>

              {/* Author */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {activeTestimonial.avatar && (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-neoma-gold/40">
                    <Image
                      src={activeTestimonial.avatar}
                      alt={activeTestimonial.client_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h4 className="text-base font-bold text-neoma-ivory">
                    {activeTestimonial.client_name}
                  </h4>
                  <span className="text-xs font-mono text-neoma-gold">
                    {activeTestimonial.nationality} • {activeTestimonial.development}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-neoma-gold/10">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full glass-panel text-neoma-ivory hover:text-neoma-gold hover:border-neoma-gold transition-all"
            >
              <ChevronLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-neoma-gold' : 'bg-neoma-surface'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full glass-panel text-neoma-ivory hover:text-neoma-gold hover:border-neoma-gold transition-all"
            >
              <ChevronRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
