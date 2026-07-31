'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Navigation, Sparkles } from 'lucide-react';

export default function LocationIntelligence({ locale }: { locale: string }) {
  const t = useTranslations('Location');
  const [activeTab, setActiveTab] = useState<'riyadh' | 'redsea' | 'jeddah'>('riyadh');

  const locations = {
    riyadh: {
      name: 'Riyadh — KAFD & Diriyah',
      lat: '24.7636 N',
      lng: '46.6433 E',
      desc: 'The epicentre of Saudi Arabia’s financial and cultural renaissance.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    },
    redsea: {
      name: 'Red Sea Coastal Region',
      lat: '28.0125 N',
      lng: '34.6210 E',
      desc: 'Pristine turquoise lagoon sanctuaries engineered with zero-carbon marine design.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    },
    jeddah: {
      name: 'Jeddah Waterfront Corniche',
      lat: '21.5433 N',
      lng: '39.1728 E',
      desc: 'Ultra-luxury coastal skyline towers overlooking the Red Sea Riviera.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
  };

  const current = locations[activeTab];

  return (
    <section id="location" className="py-28 bg-neoma-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neoma-gold/30 text-neoma-gold text-xs font-mono tracking-widest uppercase mb-4">
            <MapPin className="w-3.5 h-3.5" />
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-neoma-ivory mb-6">
            {t('title')}
          </h2>
          <p className="text-neoma-gray-300 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-4 mb-12">
          {(['riyadh', 'redsea', 'jeddah'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === key
                  ? 'bg-neoma-gold text-neoma-black font-bold shadow-gold-glow'
                  : 'glass-panel text-neoma-gray-300 hover:text-neoma-gold'
              }`}
            >
              {t(key as any)}
            </button>
          ))}
        </div>

        {/* Interactive Location Showcase */}
        <div className="glass-panel rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border-neoma-gold/30">
          <div className="lg:col-span-7 relative h-96 lg:h-auto min-h-[400px]">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neoma-black via-transparent to-transparent lg:block hidden"></div>
          </div>

          <div className="lg:col-span-5 p-10 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-neoma-gold">
              <Navigation className="w-4 h-4" />
              <span>{current.lat} | {current.lng}</span>
            </div>
            <h3 className="text-3xl font-playfair font-bold text-neoma-ivory">
              {current.name}
            </h3>
            <p className="text-neoma-gray-300 text-sm leading-relaxed">
              {current.desc}
            </p>
            <div className="pt-4 border-t border-neoma-gold/20 flex items-center justify-between text-xs font-mono text-neoma-gold">
              <span>Mapbox 3D Ready Layer</span>
              <span className="uppercase font-bold">Kingdom of Saudi Arabia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
