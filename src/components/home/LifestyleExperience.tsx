'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Waves, Sparkles, Film, Cpu, TreePine, Crown, Utensils, Anchor, Briefcase } from 'lucide-react';

export default function LifestyleExperience({ locale }: { locale: string }) {
  const t = useTranslations('Lifestyle');

  const experiences = [
    { icon: Waves, key: 'infinityPool' },
    { icon: Sparkles, key: 'wellnessSpa' },
    { icon: Film, key: 'privateCinema' },
    { icon: Cpu, key: 'smartHome' },
    { icon: TreePine, key: 'rooftopGardens' },
    { icon: Crown, key: 'concierge' },
    { icon: Utensils, key: 'fineDining' },
    { icon: Anchor, key: 'marina' },
    { icon: Briefcase, key: 'businessLounge' },
  ];

  return (
    <section id="lifestyle" className="py-28 bg-neoma-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neoma-gold/30 text-neoma-gold text-xs font-mono tracking-widest uppercase mb-4">
            <Crown className="w-3.5 h-3.5" />
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-neoma-ivory mb-6">
            {t('title')}
          </h2>
          <p className="text-neoma-gray-300 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* 3x3 Luxury Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-3xl glass-panel-hover group flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-2xl bg-neoma-surface border border-neoma-gold/30 flex items-center justify-center text-neoma-gold mb-6 group-hover:scale-110 group-hover:bg-neoma-gold group-hover:text-neoma-black transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-playfair font-bold text-neoma-ivory mb-3 group-hover:text-neoma-gold transition-colors">
                    {t(exp.key as any)}
                  </h3>
                  <p className="text-neoma-gray-400 text-xs leading-relaxed">
                    Designed to international five-star resort standards, offering unmatched privacy, security, and elevated comfort.
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
