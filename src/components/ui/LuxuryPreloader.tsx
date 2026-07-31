'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LuxuryPreloader() {
  const [loading, setLoading] = useState(true);
  const [skippable, setSkippable] = useState(false);

  useEffect(() => {
    // Session-Scoped Check (Show once per browser session)
    if (typeof window !== 'undefined') {
      const preloaded = sessionStorage.getItem('neoma_preloaded');
      if (preloaded) {
        setLoading(false);
        return;
      }
    }

    // Enable skip after 1 second
    const skipTimer = setTimeout(() => setSkippable(true), 1000);
    // Auto finish after 3 seconds
    const finishTimer = setTimeout(() => handleFinish(), 3200);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const handleFinish = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('neoma_preloaded', 'true');
    }
    setLoading(false);
  };

  if (!loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-neoma-black text-neoma-ivory p-6"
      >
        <div className="text-center space-y-6 max-w-md">
          {/* Monogram */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-20 h-20 rounded-full border-2 border-neoma-gold flex items-center justify-center mx-auto text-neoma-gold font-playfair font-bold text-2xl tracking-widest shadow-gold-glow"
          >
            NR
          </motion.div>

          {/* Gold Line Animation */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="h-[1px] bg-gold-gradient mx-auto"
          />

          {/* Brand Promise */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="space-y-1"
          >
            <h2 className="text-xl font-playfair font-bold text-neoma-ivory">NEOMA RESIDENCES</h2>
            <p className="text-xs font-mono text-neoma-gold uppercase tracking-widest">
              Crafting Iconic Spaces for Extraordinary Lives
            </p>
          </motion.div>

          {/* Skip Button after 1 second */}
          {skippable && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleFinish}
              className="mt-6 px-4 py-1.5 rounded-full border border-neoma-gold/30 text-[10px] font-mono text-neoma-gray-400 hover:text-neoma-gold uppercase tracking-wider transition-colors"
            >
              Skip Reveal [1s]
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
