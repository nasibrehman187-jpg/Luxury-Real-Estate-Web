'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatNumber } from '@/i18n/formatters';
import { ShieldCheck, ArrowRight, Layers, Eye } from 'lucide-react';

interface FallbackProps {
  locale: string;
  properties: any[];
  fallbackImageUrl?: string;
  developmentName?: string;
}

export default function WebGLFallbackGallery({
  locale,
  properties,
  fallbackImageUrl = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
  developmentName = 'The Obsidian Tower',
}: FallbackProps) {
  const isAr = locale === 'ar';

  return (
    <div className="space-y-8">
      {/* High-Resolution Static Visual Banner */}
      <div className="relative h-[50vh] w-full rounded-3xl overflow-hidden border border-neoma-gold/30 shadow-gold-glow">
        <Image
          src={fallbackImageUrl}
          alt={developmentName}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neoma-black via-neoma-black/40 to-transparent"></div>

        <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-neoma-gold text-neoma-black font-mono text-[10px] font-bold uppercase tracking-wider block w-fit mb-2">
              Static Visual Gallery Mode
            </span>
            <h2 className="text-2xl sm:text-4xl font-playfair font-bold text-neoma-ivory">
              {developmentName} Architectural Overview
            </h2>
            <p className="text-neoma-gray-300 text-xs font-mono mt-1">
              WebGL 3D rendering unavailable on this device. Displaying high-fidelity static architectural captures.
            </p>
          </div>
        </div>
      </div>

      {/* Accessible Screen-Reader Navigable Unit List */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-neoma-gold/20 pb-4">
          <h3 className="text-xl font-playfair font-bold text-neoma-ivory flex items-center gap-2">
            <Layers className="w-5 h-5 text-neoma-gold" />
            <span>Available Residences Catalog ({properties.length})</span>
          </h3>
          <span className="text-xs font-mono text-neoma-gold">
            Screen-Reader Accessible List
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div
              key={p.id}
              className="glass-panel p-5 rounded-2xl border-neoma-gold/20 hover:border-neoma-gold transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden">
                  <Image src={p.hero_image} alt={p.title_en} fill className="object-cover" />
                </div>
                <h4 className="font-playfair font-bold text-neoma-ivory text-base">
                  {isAr ? p.title_ar : p.title_en}
                </h4>
                <p className="text-xs text-neoma-gray-400 font-mono">
                  {formatNumber(p.bedrooms, locale)} Beds • {formatNumber(p.bathrooms, locale)} Baths • {formatNumber(p.area, locale)} m²
                </p>
              </div>

              <div className="pt-4 border-t border-neoma-gold/10 flex items-center justify-between mt-4">
                <span className="text-base font-bold text-neoma-gold font-mono">
                  {formatCurrency(p.price, locale)}
                </span>
                <Link
                  href={`/${locale}/properties/${p.slug}`}
                  className="p-2 rounded-full bg-gold-gradient text-neoma-black font-semibold hover:opacity-90"
                >
                  <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
