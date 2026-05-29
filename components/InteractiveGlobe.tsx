'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo, Component, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { GeoMarket } from '@/lib/geo-markets';
import { canUseWebGL } from '@/lib/webgl';
import CobeGlobeFallback from '@/components/CobeGlobeFallback';

type LandPoint = { lat: number; lng: number; type: 'land' };
type MarketPoint = GeoMarket & { type: 'market' };
type GlobePoint = LandPoint | MarketPoint;
type MarketElement = GeoMarket & { isActive: true };

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => <GlobeSkeleton />,
});

function GlobeSkeleton() {
  return (
    <div className="w-full h-full grid place-items-center">
      <div className="w-[85%] aspect-square rounded-full border border-white/10 animate-pulse" />
    </div>
  );
}

class GlobeErrorBoundary extends Component<
  { fallback: ReactNode; onError?: () => void; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

interface InteractiveGlobeProps {
  markets: GeoMarket[];
  activeSlug: string | null;
}

function focusAltitude(slug: string): number {
  const europe = ['uk', 'germany', 'netherlands', 'ireland', 'malta', 'sweden', 'norway', 'denmark', 'spain', 'italy'];
  const gulf = ['dubai', 'uae'];
  if (europe.includes(slug)) return 1.35;
  if (gulf.includes(slug)) return 1.5;
  return 1.75;
}

function buildActiveMarkerHtml(d: MarketElement) {
  const el = document.createElement('div');
  el.style.pointerEvents = 'none';
  el.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
      <span style="color:#FF6600;font-size:13px;font-weight:600;margin-bottom:6px;font-family:Poppins,Inter,sans-serif;white-space:nowrap;text-shadow:0 2px 12px rgba(0,0,0,0.95);">${d.label}</span>
      <div style="width:18px;height:18px;border-radius:50%;border:2.5px solid #FF6600;background:#ffffff;box-shadow:0 0 14px rgba(255,102,0,0.75);"></div>
    </div>
  `;
  return el;
}

function GlobeRing() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="49.2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.12" />
      <ellipse cx="50" cy="50" rx="49.2" ry="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.08" />
      <ellipse cx="50" cy="50" rx="49.2" ry="32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.08" />
    </svg>
  );
}

function ThreeGlobe({
  markets,
  activeSlug,
  size,
  landPoints,
}: {
  markets: GeoMarket[];
  activeSlug: string | null;
  size: number;
  landPoints: LandPoint[];
}) {
  const globeRef = useRef<{
    pointOfView: (pov?: object, ms?: number) => { altitude: number };
    controls: () => { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean };
  } | null>(null);

  const htmlElementsData = useMemo<MarketElement[]>(() => {
    if (!activeSlug) return [];
    const m = markets.find(x => x.slug === activeSlug);
    return m ? [{ ...m, isActive: true as const }] : [];
  }, [markets, activeSlug]);

  const globePoints = useMemo<GlobePoint[]>(() => {
    if (activeSlug) return landPoints;
    const dots: MarketPoint[] = markets.map(m => ({ ...m, type: 'market' as const }));
    return [...landPoints, ...dots];
  }, [landPoints, markets, activeSlug]);

  const ringsData = useMemo(
    () => (activeSlug ? markets.filter(m => m.slug === activeSlug) : []),
    [markets, activeSlug],
  );

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls();
    if (activeSlug) {
      controls.autoRotate = false;
      const market = markets.find(m => m.slug === activeSlug);
      if (market) {
        globe.pointOfView(
          { lat: market.lat, lng: market.lng, altitude: focusAltitude(activeSlug) },
          900,
        );
      }
    } else {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.2;
      globe.pointOfView({ lat: 25, lng: 55, altitude: 2.3 }, 1200);
    }
  }, [activeSlug, markets]);

  const onGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.2;
    controls.enableZoom = false;
    globe.pointOfView({ lat: 25, lng: 55, altitude: 2.3 });
  }, []);

  const htmlElement = useCallback((d: object) => buildActiveMarkerHtml(d as MarketElement), []);
  const pointColor = useCallback(
    (d: object) => ((d as GlobePoint).type === 'market' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.28)'),
    [],
  );
  const pointRadius = useCallback(
    (d: object) => ((d as GlobePoint).type === 'market' ? 0.22 : 0.18),
    [],
  );

  if (globePoints.length === 0 || size <= 0) return null;

  return (
    <Globe
      // @ts-expect-error react-globe.gl ref typing
      ref={globeRef}
      width={size}
      height={size}
      animateIn={false}
      backgroundColor="rgba(0,0,0,0)"
      rendererConfig={{
        antialias: false,
        alpha: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      }}
      showAtmosphere={false}
      showGlobe={false}
      showGraticule
      graticuleColor="rgba(255,255,255,0.07)"
      pointsData={globePoints}
      pointLat="lat"
      pointLng="lng"
      pointColor={pointColor}
      pointRadius={pointRadius}
      pointAltitude={0}
      htmlElementsData={htmlElementsData}
      htmlLat={(d: object) => (d as GeoMarket).lat}
      htmlLng={(d: object) => (d as GeoMarket).lng}
      htmlAltitude={0.005}
      htmlElement={htmlElement}
      ringsData={ringsData}
      ringLat={(d: object) => (d as GeoMarket).lat}
      ringLng={(d: object) => (d as GeoMarket).lng}
      ringColor={() => (t: number) => `rgba(255,102,0,${1 - t})`}
      ringMaxRadius={2.8}
      ringPropagationSpeed={1.8}
      ringRepeatPeriod={1400}
      onGlobeReady={onGlobeReady}
    />
  );
}

export default function InteractiveGlobe({ markets, activeSlug }: InteractiveGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(340);
  const [landPoints, setLandPoints] = useState<LandPoint[]>([]);
  const [mounted, setMounted] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!canUseWebGL()) setUseFallback(true);
  }, []);

  useEffect(() => {
    fetch('/land-points.json')
      .then(r => r.json())
      .then((pts: { lat: number; lng: number }[]) =>
        setLandPoints(pts.map(p => ({ ...p, type: 'land' as const }))),
      )
      .catch(() => setLandPoints([]));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize(Math.min(entry.contentRect.width, 360));
    });
    ro.observe(el);
    setSize(Math.min(el.offsetWidth, 360));
    return () => ro.disconnect();
  }, []);

  const fallbackGlobe = (
    <CobeGlobeFallback markets={markets} activeSlug={activeSlug} size={size} />
  );

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[360px] mx-auto">
      <GlobeRing />

      {!mounted || size <= 0 ? (
        <GlobeSkeleton />
      ) : useFallback || landPoints.length === 0 ? (
        landPoints.length === 0 && !useFallback ? (
          <GlobeSkeleton />
        ) : (
          fallbackGlobe
        )
      ) : (
        <GlobeErrorBoundary
          fallback={fallbackGlobe}
          onError={() => setUseFallback(true)}
        >
          <ThreeGlobe
            markets={markets}
            activeSlug={activeSlug}
            size={size}
            landPoints={landPoints}
          />
        </GlobeErrorBoundary>
      )}
    </div>
  );
}
