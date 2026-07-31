'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, Cpu, Sparkles } from 'lucide-react';

export default function ArchitectureVision({ locale }: { locale: string }) {
  const t = useTranslations('Vision');

  const pillars = [
    {
      icon: Leaf,
      titleKey: 'pillar1Title',
      descKey: 'pillar1Desc',
    },
    {
      icon: ShieldCheck,
      titleKey: 'pillar2Title',
      descKey: 'pillar2Desc',
    },
    {
      icon: Cpu,
      titleKey: 'pillar3Title',
      descKey: 'pillar3Desc',
    },
  ];

  return (
    <section id="vision" className="py-28 bg-neoma-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
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

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="glass-panel p-8 rounded-3xl glass-panel-hover border-neoma-gold/20 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-neoma-surface border border-neoma-gold/30 flex items-center justify-center text-neoma-gold mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-neoma-ivory mb-4">
                    {t(pillar.titleKey as any)}
                  </h3>
                  <p className="text-neoma-gray-300 text-sm leading-relaxed">
                    {t(pillar.descKey as any)}
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
