'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatNumber } from '@/i18n/formatters';
import { Layers, Building, Eye, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface CanvasProps {
  locale: string;
  properties: any[];
}

export default function BuildingExplorerCanvas({ locale, properties }: CanvasProps) {
  const isAr = locale === 'ar';

  const [viewState, setViewState] = useState<'masterplan' | 'building' | 'unit'>('masterplan');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>('obsidian');
  const [selectedUnit, setSelectedUnit] = useState<any | null>(properties[0] || null);

  const [fps, setFps] = useState(60);
  const [fpsWarning, setFpsWarning] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lowFpsCountRef = useRef(0);

  // Frame-Rate Monitoring (Sustained <30fps for 3s triggers alert)
  useEffect(() => {
    let animId: number;
    const checkFps = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastTimeRef.current >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setFps(currentFps);

        if (currentFps < 30) {
          lowFpsCountRef.current++;
          if (lowFpsCountRef.current >= 3) {
            setFpsWarning(true);
            console.warn('[3D Performance Monitor] Low FPS sustained (<30 FPS for 3s).');
          }
        } else {
          lowFpsCountRef.current = 0;
        }

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      animId = requestAnimationFrame(checkFps);
    };

    animId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Navigation Breadcrumb */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-neoma-gold/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setViewState('masterplan'); setSelectedUnit(null); }}
            className={`px-3 py-1.5 rounded-full uppercase transition-all ${
              viewState === 'masterplan' ? 'bg-gold-gradient text-neoma-black font-bold' : 'text-neoma-gray-300 hover:text-neoma-gold'
            }`}
          >
            1. Masterplan View
          </button>
          <span className="text-neoma-gray-600">/</span>
          <button
            onClick={() => setViewState('building')}
            className={`px-3 py-1.5 rounded-full uppercase transition-all ${
              viewState === 'building' ? 'bg-gold-gradient text-neoma-black font-bold' : 'text-neoma-gray-300 hover:text-neoma-gold'
            }`}
          >
            2. Building View ({selectedBuilding})
          </button>
          <span className="text-neoma-gray-600">/</span>
          <button
            onClick={() => setViewState('unit')}
            className={`px-3 py-1.5 rounded-full uppercase transition-all ${
              viewState === 'unit' ? 'bg-gold-gradient text-neoma-black font-bold' : 'text-neoma-gray-300 hover:text-neoma-gold'
            }`}
          >
            3. Unit Explorer
          </button>
        </div>

        {/* FPS Counter */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            fps < 30 ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-neoma-emerald/20 text-neoma-emerald'
          }`}>
            {fps} FPS
          </span>
          {fpsWarning && (
            <span className="text-[10px] text-neoma-gold animate-pulse">
              Low-GPU Mode
            </span>
          )}
        </div>
      </div>

      {/* 3D Canvas / Simulated WebGL Stage */}
      <div className="relative h-[65vh] w-full rounded-3xl overflow-hidden glass-panel border border-neoma-gold/40 shadow-gold-glow bg-neoma-black">
        {/* Simulated 3D Masterplan Stage */}
        <div className="absolute inset-0 bg-gradient-to-b from-neoma-black via-neoma-surface to-neoma-black flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            {viewState === 'masterplan' && (
              <div className="space-y-6">
                <div className="w-24 h-24 rounded-full bg-neoma-gold/10 border-2 border-neoma-gold flex items-center justify-center text-neoma-gold mx-auto animate-pulse">
                  <Building className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-neoma-ivory">
                    Interactive 3D Masterplan Stage
                  </h3>
                  <p className="text-neoma-gray-400 text-xs mt-1 max-w-md mx-auto">
                    Click a skyscraper tower below to transition to floor level and unit exploration.
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => { setSelectedBuilding('The Obsidian Tower'); setViewState('building'); }}
                    className="px-6 py-3 rounded-full bg-neoma-surface border border-neoma-gold text-neoma-gold font-bold hover:bg-neoma-gold hover:text-neoma-black transition-all"
                  >
                    Select The Obsidian Tower (85 Floors)
                  </button>
                </div>
              </div>
            )}

            {viewState === 'building' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-playfair font-bold text-neoma-ivory">
                  {selectedBuilding} — Floor Elevation View
                </h3>
                <p className="text-neoma-gray-400 text-xs">
                  Select a residence tier to view live units:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
                  {properties.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedUnit(p); setViewState('unit'); }}
                      className="p-4 rounded-2xl glass-panel border-neoma-gold/30 hover:border-neoma-gold text-left space-y-1"
                    >
                      <span className="text-[10px] text-neoma-gold block uppercase">{p.property_type}</span>
                      <span className="font-bold text-neoma-ivory block text-xs truncate">{isAr ? p.title_ar : p.title_en}</span>
                      <span className="text-neoma-gray-400 text-[11px] block">{formatCurrency(p.price, locale)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {viewState === 'unit' && selectedUnit && (
              <div className="glass-panel p-8 rounded-3xl max-w-2xl mx-auto border-neoma-gold/40 space-y-6 text-left">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-neoma-gold text-neoma-black font-bold text-[10px] uppercase">
                    {selectedUnit.property_type} Tier
                  </span>
                  <span className="text-xl font-bold text-neoma-gold">
                    {formatCurrency(selectedUnit.price, locale)}
                  </span>
                </div>

                <div className="relative h-48 w-full rounded-2xl overflow-hidden">
                  <Image src={selectedUnit.hero_image} alt={selectedUnit.title_en} fill className="object-cover" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-playfair font-bold text-neoma-ivory">
                    {isAr ? selectedUnit.title_ar : selectedUnit.title_en}
                  </h3>
                  <p className="text-xs text-neoma-gray-300">
                    {formatNumber(selectedUnit.bedrooms, locale)} Bedrooms • {formatNumber(selectedUnit.bathrooms, locale)} Bathrooms • {formatNumber(selectedUnit.area, locale)} m² Total Area
                  </p>
                </div>

                <div className="pt-4 border-t border-neoma-gold/20 flex items-center justify-between">
                  <button
                    onClick={() => setViewState('building')}
                    className="px-4 py-2 rounded-full border border-neoma-gold/30 text-neoma-gold text-xs"
                  >
                    Back to Building
                  </button>
                  <Link
                    href={`/${locale}/properties/${selectedUnit.slug}`}
                    className="px-6 py-2.5 rounded-full bg-gold-gradient text-neoma-black font-bold text-xs uppercase shadow-gold-glow flex items-center gap-2"
                  >
                    <span>View Property Page</span>
                    <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
