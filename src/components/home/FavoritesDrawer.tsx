'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/i18n/formatters';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';

interface Props {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesDrawer({ locale, isOpen, onClose }: Props) {
  const [favoritesList, setFavoritesList] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('neoma_favorites') || '[]');
      // Mock lookup for saved property IDs
      const mockDb = [
        {
          id: 'b1c2d3e4-0001-4000-8000-000000000001',
          slug: 'the-sky-penthouse-obsidian',
          title_en: 'The Imperial Sky Penthouse',
          title_ar: 'البنتهاوس الملكي في السماء',
          price: 45000000,
          hero_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'b1c2d3e4-0002-4000-8000-000000000002',
          slug: 'royal-diriyah-palace-estate',
          title_en: 'The Royal Oasis Estate',
          title_ar: 'قصر الواحة الملكي',
          price: 68000000,
          hero_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'b1c2d3e4-0003-4000-8000-000000000003',
          slug: 'coral-sanctuary-overwater-villa',
          title_en: 'Coral Sanctuary Villa',
          title_ar: 'فيلا ملاذ المرجان العائمة',
          price: 24500000,
          hero_image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
        },
      ];

      const found = mockDb.filter((item) => savedIds.includes(item.id));
      setFavoritesList(found);
    } catch (e) {
      setFavoritesList([]);
    }
  }, [isOpen]);

  const removeItem = (id: string) => {
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('neoma_favorites') || '[]');
      const updated = savedIds.filter((item) => item !== id);
      localStorage.setItem('neoma_favorites', JSON.stringify(updated));
      setFavoritesList((prev) => prev.filter((item) => item.id !== id));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const isAr = locale === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neoma-black/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md glass-panel border-l border-neoma-gold/30 bg-neoma-black/95 p-8 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-neoma-gold/20">
                  <div className="flex items-center gap-3">
                    <Bookmark className="w-5 h-5 text-neoma-gold" />
                    <h3 className="text-xl font-playfair font-bold text-neoma-ivory">
                      {isAr ? 'الوحدات المحفوظة' : 'Saved Portfolio'}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full glass-panel text-neoma-ivory hover:text-neoma-gold"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* List */}
                <div className="py-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  {favoritesList.length === 0 ? (
                    <div className="text-center py-12 text-neoma-gray-400 text-sm">
                      {isAr ? 'لا توجد وحدات سكنية محفوظة حالياً.' : 'Your saved portfolio is currently empty.'}
                    </div>
                  ) : (
                    favoritesList.map((item) => (
                      <div
                        key={item.id}
                        className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 border-neoma-gold/15 hover:border-neoma-gold/40 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={item.hero_image}
                            alt={item.title_en}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-playfair font-bold text-neoma-ivory truncate">
                            {isAr ? item.title_ar : item.title_en}
                          </h4>
                          <span className="text-xs font-bold text-neoma-gold block mt-1">
                            {formatCurrency(item.price, locale)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-neoma-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/${locale}/properties/${item.slug}`}
                            onClick={onClose}
                            className="p-2 rounded-full bg-neoma-surface text-neoma-gold hover:bg-neoma-gold hover:text-neoma-black transition-all"
                          >
                            <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="pt-6 border-t border-neoma-gold/20">
                <Link
                  href={`/${locale}#consultation`}
                  onClick={onClose}
                  className="w-full block py-4 text-center rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow"
                >
                  {isAr ? 'طلب استشارة للوحدات المحفوظة' : 'Request Advisory For Saved Portfolio'}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
