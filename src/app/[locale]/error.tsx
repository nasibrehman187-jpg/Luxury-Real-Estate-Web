'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('NEOMA Residences Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neoma-black flex flex-col justify-center items-center px-6 text-center">
      <div className="glass-panel p-12 rounded-3xl max-w-lg border border-neoma-gold/30 shadow-gold-glow">
        <span className="text-neoma-gold font-mono text-sm tracking-widest uppercase block mb-4">
          Unexpected Exception
        </span>
        <h2 className="text-3xl font-playfair font-bold text-neoma-ivory mb-4">
          An Architectural Interruption Occurred
        </h2>
        <p className="text-neoma-gray-300 text-sm mb-8">
          We encountered a temporary discrepancy. Please reset the view or return to our luxury portfolio.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-full bg-neoma-gold text-neoma-black font-medium hover:bg-neoma-gold-light transition-all"
          >
            Reset Session
          </button>
          <Link
            href="/en"
            className="px-6 py-3 rounded-full border border-neoma-gold/40 text-neoma-ivory hover:bg-neoma-surface transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
