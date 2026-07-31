'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Compass, Maximize, Minimize, RotateCw, MapPin } from 'lucide-react';

interface PanoramaScene {
  id: string;
  name: string;
  image: string;
}

interface Props {
  locale: string;
  propertyTitle: string;
}

export default function VirtualTourViewer({ locale, propertyTitle }: Props) {
  const isAr = locale === 'ar';

  const scenes: PanoramaScene[] = [
    {
      id: 'living',
      name: isAr ? 'صالة المعيشة الكبرى' : 'Grand Living Hall',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
    },
    {
      id: 'terrace',
      name: isAr ? 'الشرفة المعلقة والمسبح' : 'Sky Terrace & Infinity Dip Pool',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    },
    {
      id: 'master',
      name: isAr ? 'الجناح الملكي الرئيسي' : 'Royal Master Suite',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85',
    },
  ];

  const [activeScene, setActiveScene] = useState<PanoramaScene>(scenes[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`glass-panel rounded-3xl overflow-hidden border border-neoma-gold/30 relative ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-neoma-black' : 'h-[65vh] w-full'
    }`}>
      {/* 360 Panorama Stage */}
      <div className="relative w-full h-full">
        <Image
          src={activeScene.image}
          alt={activeScene.name}
          fill
          className="object-cover transition-opacity duration-700"
          priority
        />
        <div className="absolute inset-0 bg-neoma-black/20"></div>

        {/* Controls Overlay */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <div className="glass-panel px-4 py-2 rounded-full border-neoma-gold/40 flex items-center gap-2 text-xs font-mono text-neoma-gold">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>360° Virtual Tour • {activeScene.name}</span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-full glass-panel text-neoma-ivory hover:text-neoma-gold transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

        {/* Room Hotspots Navigation Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 glass-panel p-2 rounded-full border-neoma-gold/40 max-w-full overflow-x-auto">
          {scenes.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScene(s)}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all uppercase whitespace-nowrap ${
                activeScene.id === s.id
                  ? 'bg-gold-gradient text-neoma-black font-bold shadow-gold-glow'
                  : 'text-neoma-gray-300 hover:text-neoma-gold'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
