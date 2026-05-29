'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import type { GeoMarket } from '@/lib/geo-markets';
import { coordsToAngles } from '@/lib/geo-markets';

interface CobeGlobeFallbackProps {
  markets: GeoMarket[];
  activeSlug: string | null;
  size: number;
}

/** Same dotted-globe look when Three.js WebGL is unavailable */
export default function CobeGlobeFallback({ markets, activeSlug, size }: CobeGlobeFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(activeSlug);
  const marketsRef = useRef(markets);

  activeRef.current = activeSlug;
  marketsRef.current = markets;

  useEffect(() => {
    if (!canvasRef.current || size <= 0) return;

    let phi = 0;
    let theta = 0.25;
    let targetPhi = 0;
    let targetTheta = 0.25;
    let pointerInteracting: number | null = null;
    let rafId = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 0.55,
      mapSamples: 18000,
      mapBrightness: 1.4,
      mapBaseBrightness: 0,
      baseColor: [0.55, 0.55, 0.55],
      markerColor: [1, 1, 1],
      glowColor: [0.06, 0.06, 0.06],
      markerElevation: 0.02,
      markers: [],
    });

    const tick = () => {
      const active = activeRef.current;
      const currentMarkets = marketsRef.current;

      const markers = currentMarkets.map(m => ({
        location: [m.lat, m.lng] as [number, number],
        size: m.slug === active ? 0.07 : active ? 0.02 : 0.035,
      }));

      if (active) {
        const market = currentMarkets.find(m => m.slug === active);
        if (market) {
          const angles = coordsToAngles(market.lat, market.lng);
          targetPhi = angles.phi;
          targetTheta = angles.theta;
        }
        phi += (targetPhi - phi) * 0.04;
        theta += (targetTheta - theta) * 0.04;
      } else if (pointerInteracting === null) {
        phi += 0.018;
        theta += (0.25 - theta) * 0.02;
      }

      globe.update({ width: size * 2, height: size * 2, phi, theta, markers });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const canvas = canvasRef.current;
    const onPointerDown = (e: PointerEvent) => {
      pointerInteracting = e.clientX;
      canvas.style.cursor = 'grabbing';
    };
    const onPointerUp = () => {
      pointerInteracting = null;
      canvas.style.cursor = 'grab';
    };
    const onPointerOut = () => {
      pointerInteracting = null;
      canvas.style.cursor = 'grab';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pointerInteracting !== null) {
        const delta = e.clientX - pointerInteracting;
        pointerInteracting = e.clientX;
        phi += delta / 180;
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerout', onPointerOut);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.style.cursor = 'grab';

    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerout', onPointerOut);
      canvas.removeEventListener('pointermove', onPointerMove);
    };
  }, [size]);

  const activeMarket = activeSlug ? markets.find(m => m.slug === activeSlug) : null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="relative mx-auto"
        aria-label="Interactive globe showing Sudonex delivery markets"
      />
      {activeMarket && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/70 border border-brand-500/40 backdrop-blur-sm z-20 pointer-events-none">
          <p className="text-xs font-semibold text-brand-400 whitespace-nowrap">{activeMarket.label}</p>
        </div>
      )}
    </>
  );
}
