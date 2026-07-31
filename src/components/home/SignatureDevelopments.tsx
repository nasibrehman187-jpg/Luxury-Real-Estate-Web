'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/i18n/formatters';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';

export interface DevelopmentItem {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  location: string;
  starting_price: number;
  category: string;
  short_description_en: string;
  short_description_ar: string;
  hero_image: string;
  amenities: string[];
}

interface Props {
  locale: string;
  developments: DevelopmentItem[];
}

export default function SignatureDevelopments({ locale, developments }: Props) {
  const t = useTranslations('Developments');
  const isAr = locale === 'ar';

  return (
    <section id="developments" className="py-28 bg-neoma-black relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-neoma-gold/5 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
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

        {/* Developments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {developments.map((item, idx) => {
            const name = isAr ? item.name_ar : item.name_en;
            const desc = isAr ? item.short_description_ar : item.short_description_en;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="group glass-panel rounded-3xl overflow-hidden glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Parallax Zoom */}
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={item.hero_image}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neoma-black via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-neoma-black/80 backdrop-blur-md text-[11px] font-mono text-neoma-gold border border-neoma-gold/30">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-neoma-gold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-neoma-ivory group-hover:text-neoma-gold transition-colors">
                      {name}
                    </h3>
                    <p className="text-neoma-gray-300 text-sm leading-relaxed line-clamp-3">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-8 pt-0 border-t border-neoma-gold/10 mt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] font-mono text-neoma-gray-500 uppercase">
                      {t('startingFrom')}
                    </span>
                    <span className="text-lg font-bold text-neoma-gold">
                      {formatCurrency(item.starting_price, locale)}
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/developments/${item.slug}`}
                    onClick={() => trackEvent(TRACKING_EVENTS.DEVELOPMENT_VIEW, { slug: item.slug, name })}
                    className="p-3 rounded-full bg-neoma-surface border border-neoma-gold/30 text-neoma-gold hover:bg-neoma-gold hover:text-neoma-black transition-all"
                  >
                    <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
