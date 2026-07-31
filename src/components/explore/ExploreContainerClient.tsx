'use client';

import { useState, useEffect } from 'react';
import BuildingExplorerCanvas from './BuildingExplorerCanvas';
import WebGLFallbackGallery from './WebGLFallbackGallery';

interface Props {
  locale: string;
  properties: any[];
}

export default function ExploreContainerClient({ locale, properties }: Props) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    // WebGL Feature-Detection Test
    try {
      const canvas = document.createElement('canvas');
      const webglSupported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setHasWebGL(webglSupported);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (hasWebGL === null) {
    return (
      <div className="glass-panel p-16 rounded-3xl text-center font-mono text-xs text-neoma-gold animate-pulse">
        Initializing WebGL Feature Detection & Shader Pipelines...
      </div>
    );
  }

  return hasWebGL ? (
    <BuildingExplorerCanvas locale={locale} properties={properties} />
  ) : (
    <WebGLFallbackGallery locale={locale} properties={properties} />
  );
}
