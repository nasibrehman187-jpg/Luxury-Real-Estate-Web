'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatNumber } from '@/i18n/formatters';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { Bed, Bath, Maximize2, Bookmark, Eye, X, ArrowRight, Sparkles } from 'lucide-react';

export interface PropertyItem {
  id: string;
  slug: string;
  development_id: string;
  title_en: string;
  title_ar: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  status: string;
  hero_image: string;
  gallery_images: string[];
  description_en: string;
  description_ar: string;
  featured: boolean;
}

interface Props {
  locale: string;
  properties: PropertyItem[];
}

export default function PropertyExplorer({ locale, properties }: Props) {
  const t = useTranslations('Explorer');
  const isAr = locale === 'ar';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<PropertyItem | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('neoma_favorites') || '[]');
      setFavorites(saved);
    } catch (e) {
      setFavorites([]);
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('neoma_favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const filteredProperties = activeCategory === 'all'
    ? properties
    : properties.filter((p) => p.property_type.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="properties" className="py-28 bg-neoma-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {['all', 'penthouse', 'villa', 'apartment', 'commercial'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                activeCategory === cat
                  ? 'bg-gold-gradient text-neoma-black border-transparent font-bold shadow-gold-glow'
                  : 'glass-panel text-neoma-gray-300 border-neoma-gold/20 hover:border-neoma-gold'
              }`}
            >
              {cat === 'all' ? t('allTypes') : t(`${cat}s` as any || cat)}
            </button>
          ))}
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((item, idx) => {
            const title = isAr ? item.title_ar : item.title_en;
            const desc = isAr ? item.description_ar : item.description_en;
            const isFav = favorites.includes(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group glass-panel rounded-3xl overflow-hidden glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={item.hero_image}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neoma-black via-transparent to-transparent"></div>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                        isFav
                          ? 'bg-neoma-gold text-neoma-black'
                          : 'bg-neoma-black/60 text-neoma-ivory hover:text-neoma-gold'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-neoma-black/80 backdrop-blur-md text-[11px] font-mono text-neoma-gold border border-neoma-gold/30">
                        {item.property_type}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-playfair font-bold text-neoma-ivory group-hover:text-neoma-gold transition-colors">
                      {title}
                    </h3>
                    <p className="text-neoma-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {desc}
                    </p>

                    {/* Specs Row */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neoma-gold/10 text-xs text-neoma-gray-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-neoma-gold" />
                        <span>{formatNumber(item.bedrooms, locale)} {t('bedrooms')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-neoma-gold" />
                        <span>{formatNumber(item.bathrooms, locale)} {t('bathrooms')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-neoma-gold" />
                        <span>{formatNumber(item.area, locale)} m²</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Price & Actions */}
                <div className="p-6 pt-0 border-t border-neoma-gold/10 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-neoma-gold">
                      {formatCurrency(item.price, locale)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuickViewItem(item)}
                      className="p-2.5 rounded-full glass-panel text-neoma-gray-300 hover:text-neoma-gold transition-colors"
                      title={t('quickView')}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/${locale}/properties/${item.slug}`}
                      onClick={() => trackEvent(TRACKING_EVENTS.PROPERTY_VIEW, { slug: item.slug, title })}
                      className="p-2.5 rounded-full bg-neoma-gold text-neoma-black font-semibold hover:bg-neoma-gold-light transition-all"
                    >
                      <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-neoma-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-8 rounded-3xl max-w-2xl w-full border border-neoma-gold/40 relative shadow-gold-glow max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setQuickViewItem(null)}
                className="absolute top-6 right-6 p-2 rounded-full glass-panel text-neoma-ivory hover:text-neoma-gold"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
                <Image
                  src={quickViewItem.hero_image}
                  alt={isAr ? quickViewItem.title_ar : quickViewItem.title_en}
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-xs font-mono text-neoma-gold uppercase tracking-wider block mb-2">
                {quickViewItem.property_type}
              </span>
              <h3 className="text-2xl font-playfair font-bold text-neoma-ivory mb-4">
                {isAr ? quickViewItem.title_ar : quickViewItem.title_en}
              </h3>
              <p className="text-neoma-gray-300 text-sm mb-6 leading-relaxed">
                {isAr ? quickViewItem.description_ar : quickViewItem.description_en}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-neoma-gold/20">
                <span className="text-2xl font-bold text-neoma-gold">
                  {formatCurrency(quickViewItem.price, locale)}
                </span>
                <Link
                  href={`/${locale}/properties/${quickViewItem.slug}`}
                  onClick={() => setQuickViewItem(null)}
                  className="px-6 py-3 rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow"
                >
                  {t('viewDetails')}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
