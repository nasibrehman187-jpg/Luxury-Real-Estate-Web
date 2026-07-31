'use client';

import { useState, useEffect } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)) {
      setDisabled(true);
      return;
    }

    // Disable on prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.matches) {
        setDisabled(true);
        return;
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (disabled) return null;

  return (
    <div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 rounded-full border border-neoma-gold/60 flex items-center justify-center"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-neoma-gold shadow-gold-glow"></div>
    </div>
  );
}
