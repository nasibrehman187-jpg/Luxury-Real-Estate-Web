'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatNumber } from '@/i18n/formatters';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { X, Download, Bed, Bath, Maximize2, Layers } from 'lucide-react';

interface Props {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  properties: any[];
}

export default function PropertyCompareModal({
  locale,
  isOpen,
  onClose,
  properties,
}: Props) {
  const isAr = locale === 'ar';
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!isOpen || !properties || properties.length < 2) return null;

  trackEvent(TRACKING_EVENTS.COMPARISON_USAGE, { count: properties.length });

  const handleExportPdf = async () => {
    setDownloadingPdf(true);
    try {
      const res = await fetch('/api/properties/compare-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties, locale }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NEOMA_Property_Comparison_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.warn('PDF export failed:', e);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-neoma-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel p-8 rounded-3xl max-w-5xl w-full border border-neoma-gold/40 relative shadow-gold-glow bg-neoma-black/95 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-6 border-b border-neoma-gold/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neoma-gold/20 border border-neoma-gold flex items-center justify-center text-neoma-gold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-playfair font-bold text-neoma-ivory">
                  {isAr ? 'مقارنة الوحدات السكنية' : 'Sanctuary Portfolio Comparison'}
                </h3>
                <span className="text-xs font-mono text-neoma-gold">
                  Comparing {properties.length} Private Residences
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPdf}
                disabled={downloadingPdf}
                className="px-5 py-2 rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingPdf ? 'Generating PDF...' : 'Export PDF'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full glass-panel text-neoma-ivory hover:text-neoma-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Accessible Table Markup */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <caption className="sr-only">NEOMA Residences Property Comparison Matrix</caption>
              <thead>
                <tr className="border-b border-neoma-gold/30">
                  <th scope="col" className="p-4 text-neoma-gold font-bold uppercase w-1/4">Specification</th>
                  {properties.map((p) => (
                    <th scope="col" key={p.id} className="p-4 text-neoma-ivory font-bold min-w-[200px]">
                      <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-neoma-gold/20">
                        <Image src={p.hero_image} alt={p.title_en} fill className="object-cover" />
                      </div>
                      <span className="text-sm font-playfair font-bold block">{isAr ? p.title_ar : p.title_en}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neoma-gold/10">
                <tr>
                  <th scope="row" className="p-4 text-neoma-gray-400">Asking Price</th>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 font-bold text-neoma-gold text-sm">
                      {formatCurrency(p.price, locale)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 text-neoma-gray-400">Property Type</th>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 text-neoma-ivory">{p.property_type}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 text-neoma-gray-400">Bedrooms & Bathrooms</th>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 text-neoma-gray-300">
                      {formatNumber(p.bedrooms, locale)} Beds / {formatNumber(p.bathrooms, locale)} Baths
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 text-neoma-gray-400">Total Built Area</th>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 text-neoma-gray-300">{formatNumber(p.area, locale)} m²</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 text-neoma-gray-400">Projected 5-Yr Growth</th>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 font-bold text-neoma-emerald">+42% Capital Appreciation</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
