'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronDown, Sparkles } from 'lucide-react';

function GoldParticleSystem() {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = useState(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 25;
      ref.current.rotation.y -= delta / 35;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#D4AF37"
          size={0.035}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.85}
        />
      </Points>
    </group>
  );
}

function FloatingArchitecturalGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[2.5, 0, -2]}>
      <octahedronGeometry args={[1.8, 2]} />
      <meshStandardMaterial
        color="#9A7B1C"
        wireframe={true}
        emissive="#D4AF37"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function CinematicHero({ locale }: { locale: string }) {
  const t = useTranslations('Hero');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-neoma-black flex items-center justify-center overflow-hidden pt-24 pb-12">
      {/* 3D Canvas Background Layer */}
      {mounted && (
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#F3E5AB" />
            <GoldParticleSystem />
            <FloatingArchitecturalGeometry />
          </Canvas>
        </div>
      )}

      {/* Atmospheric Fog Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neoma-black via-neoma-black/40 to-transparent z-10 pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        {/* Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-neoma-gold/30 text-neoma-gold text-xs font-mono tracking-widest uppercase mb-8 shadow-gold-glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('badge')}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-playfair font-bold text-neoma-ivory leading-tight tracking-tight mb-8"
        >
          <span className="block text-gold-gradient drop-shadow-md">
            {t('headline')}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-xl text-neoma-gray-300 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
        >
          {t('subheadline')}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            href={`/${locale}#properties`}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-gradient text-neoma-black font-semibold text-sm tracking-wider uppercase hover:scale-105 transition-all shadow-gold-glow"
          >
            {t('ctaPrimary')}
          </Link>
          <Link
            href={`/${locale}#consultation`}
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel border-neoma-gold/40 text-neoma-ivory font-medium text-sm tracking-wider uppercase hover:border-neoma-gold hover:bg-neoma-surface transition-all"
          >
            {t('ctaSecondary')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[11px] font-mono tracking-widest text-neoma-gold uppercase">
          {t('scrollExplore')}
        </span>
        <ChevronDown className="w-4 h-4 text-neoma-gold animate-bounce" />
      </div>
    </section>
  );
}
