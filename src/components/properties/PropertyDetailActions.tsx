'use client';

import { useState } from 'react';
import PrivateViewingModal from './PrivateViewingModal';
import BrochureDownloadModal from './BrochureDownloadModal';
import { Calendar, Download } from 'lucide-react';

export default function PropertyDetailActions({
  locale,
  propertyId,
  propertyTitle,
}: {
  locale: string;
  propertyId: string;
  propertyTitle: string;
}) {
  const [viewingOpen, setViewingOpen] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);

  return (
    <>
      <div className="glass-panel p-6 rounded-2xl border-neoma-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-playfair font-bold text-neoma-ivory">
            {locale === 'ar' ? 'معاينة خاصة أو تحميل الكتيب' : 'Schedule Viewing or Download Prospectus'}
          </h4>
          <p className="text-xs text-neoma-gray-400">
            Select your preferred advisory experience.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setViewingOpen(true)}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-full bg-gold-gradient text-neoma-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow flex items-center justify-center gap-2 hover:opacity-90"
          >
            <Calendar className="w-4 h-4" />
            <span>Private Viewing</span>
          </button>
          <button
            onClick={() => setBrochureOpen(true)}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-full border border-neoma-gold/40 text-neoma-gold font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neoma-surface"
          >
            <Download className="w-4 h-4" />
            <span>Prospectus PDF</span>
          </button>
        </div>
      </div>

      <PrivateViewingModal
        locale={locale}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        isOpen={viewingOpen}
        onClose={() => setViewingOpen(false)}
      />

      <BrochureDownloadModal
        locale={locale}
        propertyId={propertyId}
        title={propertyTitle}
        isOpen={brochureOpen}
        onClose={() => setBrochureOpen(false)}
      />
    </>
  );
}
