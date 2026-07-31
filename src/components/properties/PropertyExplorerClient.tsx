'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { formatCurrency, formatNumber } from '@/i18n/formatters';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import PropertyCompareModal from './PropertyCompareModal';
import PrivateViewingModal from './PrivateViewingModal';
import BrochureDownloadModal from './BrochureDownloadModal';
import { Bed, Bath, Maximize2, Layers, Calendar, Download, Bookmark, ArrowRight, Eye } from 'lucide-react';

interface Props {
  locale: string;
  properties: any[];
  initialType: string;
  initialBedrooms: string;
  currentPage: number;
}

export default function PropertyExplorerClient({
  locale,
  properties,
  initialType,
  initialBedrooms,
  currentPage,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAr = locale === 'ar';

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<any | null>(null);
  const [brochureItem, setBrochureItem] = useState<any | null>(null);

  const updateFilters = (newType?: string, newBeds?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newType !== undefined) {
      if (newType === 'all') params.delete('type');
      else params.set('type', newType);
    }
    if (newBeds !== undefined) {
      if (!newBeds) params.delete('bedrooms');
      else params.set('bedrooms', newBeds);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
    trackEvent(TRACKING_EVENTS.FILTER_USAGE, { type: newType, bedrooms: newBeds });
  };

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((item) => item !== id));
    } else {
      if (compareIds.length >= 4) return;
      setCompareIds([...compareIds, id]);
    }
  };

  const selectedCompareProperties = properties.filter((p) => compareIds.includes(p.id));

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="glass-panel p-6 rounded-3xl border-neoma-gold/30 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-neoma-gold uppercase font-bold mr-2">Category:</span>
          {['all', 'penthouse', 'villa', 'apartment', 'commercial'].map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilters(cat, undefined)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase transition-all ${
                initialType === cat
                  ? 'bg-gold-gradient text-neoma-black font-bold'
                  : 'glass-panel text-neoma-gray-300 hover:text-neoma-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <select
            value={initialBedrooms}
            onChange={(e) => updateFilters(undefined, e.target.value)}
            className="px-4 py-2 rounded-xl bg-neoma-surface border border-neoma-gold/30 text-neoma-ivory text-xs font-mono"
          >
            <option value="">All Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
            <option value="5">5+ Bedrooms</option>
          </select>

          {compareIds.length > 0 && (
            <button
              onClick={() => setCompareOpen(true)}
              className="px-5 py-2 rounded-full bg-neoma-emerald text-neoma-ivory text-xs font-mono uppercase font-bold flex items-center gap-2 shadow-emerald-glow"
            >
              <Layers className="w-4 h-4" />
              <span>Compare ({compareIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Property Grid or Empty State */}
      {properties.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4">
          <h3 className="text-2xl font-playfair font-bold text-neoma-ivory">
            {isAr ? 'لم يتم العثور على وحدات مطابقة' : 'No Residences Match Your Criteria'}
          </h3>
          <p className="text-neoma-gray-400 text-xs max-w-md mx-auto">
            Try expanding your price range or bedroom selection to view additional private portfolio entries.
          </p>
          <button
            onClick={() => router.push(`${pathname}`)}
            className="px-6 py-2.5 rounded-full bg-gold-gradient text-neoma-black font-bold text-xs uppercase"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((item) => {
            const title = isAr ? item.title_ar : item.title_en;
            const desc = isAr ? item.description_ar : item.description_en;
            const isCompared = compareIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="group glass-panel rounded-3xl overflow-hidden glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={item.hero_image}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neoma-black via-transparent to-transparent"></div>

                    <button
                      onClick={(e) => toggleCompare(item.id, e)}
                      className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider backdrop-blur-md border transition-all ${
                        isCompared
                          ? 'bg-neoma-emerald text-neoma-ivory border-neoma-emerald'
                          : 'bg-neoma-black/70 text-neoma-ivory border-neoma-gold/30 hover:border-neoma-gold'
                      }`}
                    >
                      {isCompared ? 'Comparing' : '+ Compare'}
                    </button>

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-neoma-black/80 backdrop-blur-md text-[11px] font-mono text-neoma-gold border border-neoma-gold/30">
                        {item.property_type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-playfair font-bold text-neoma-ivory group-hover:text-neoma-gold transition-colors">
                      {title}
                    </h3>
                    <p className="text-neoma-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {desc}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neoma-gold/10 text-xs text-neoma-gray-300 font-mono">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4 text-neoma-gold" />
                        <span>{formatNumber(item.bedrooms, locale)} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4 text-neoma-gold" />
                        <span>{formatNumber(item.bathrooms, locale)} Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4 text-neoma-gold" />
                        <span>{formatNumber(item.area, locale)} m²</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-neoma-gold/10 mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-neoma-gold">
                    {formatCurrency(item.price, locale)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingItem(item)}
                      className="p-2 rounded-full glass-panel text-neoma-gray-300 hover:text-neoma-gold"
                      title="Schedule Viewing"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setBrochureItem(item)}
                      className="p-2 rounded-full glass-panel text-neoma-gray-300 hover:text-neoma-gold"
                      title="Download Brochure"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/${locale}/properties/${item.slug}`}
                      className="p-2 rounded-full bg-neoma-gold text-neoma-black font-semibold hover:bg-neoma-gold-light"
                    >
                      <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Drawer */}
      <PropertyCompareModal
        locale={locale}
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        properties={selectedCompareProperties}
      />

      {/* Viewing Modal */}
      {viewingItem && (
        <PrivateViewingModal
          locale={locale}
          propertyId={viewingItem.id}
          propertyTitle={isAr ? viewingItem.title_ar : viewingItem.title_en}
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
        />
      )}

      {/* Brochure Modal */}
      {brochureItem && (
        <BrochureDownloadModal
          locale={locale}
          propertyId={brochureItem.id}
          title={isAr ? brochureItem.title_ar : brochureItem.title_en}
          isOpen={!!brochureItem}
          onClose={() => setBrochureItem(null)}
        />
      )}
    </div>
  );
}
