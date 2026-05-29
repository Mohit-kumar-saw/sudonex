'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo, Component, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import landPointsJson from '@/data/land-points.json';
import type { GeoMarket } from '@/lib/geo-markets';
import { getWebGLMode, markThreeWebGLFailed, type WebGLMode } from '@/lib/webgl';
import CobeGlobeFallback from '@/components/CobeGlobeFallback';
import StaticGlobeFallback from '@/components/StaticGlobeFallback';

type LandPoint = { lat: number; lng: number; type: 'land' };
type MarketPoint = GeoMarket & { type: 'market' };
type GlobePoint = LandPoint | MarketPoint;
type MarketElement = GeoMarket & { isActive: true };

const LAND_POINTS: LandPoint[] = (landPointsJson as { lat: number; lng: number }[]).map(p => ({
  ...p,
  type: 'land' as const,
}));

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => <GlobeSkeleton />,
});

function GlobeSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center z-[1]">
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
  /** Skip intersection observer — use in hero (above the fold) */
  mountImmediately?: boolean;
  maxSize?: number;
  /** Land dots only, no market markers */
  landOnly?: boolean;
  autoRotateSpeed?: number;
  showRing?: boolean;
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
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2]" viewBox="0 0 100 100" aria-hidden>
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
  onWebGLFailed,
  landOnly,
  autoRotateSpeed = 2.2,
}: {
  markets: GeoMarket[];
  activeSlug: string | null;
  size: number;
  onWebGLFailed: () => void;
  landOnly?: boolean;
  autoRotateSpeed?: number;
}) {
  const globeRef = useRef<{
    pointOfView: (pov?: object, ms?: number) => { altitude: number };
    controls: () => { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean };
    renderer: () => { domElement: HTMLCanvasElement; setSize: (w: number, h: number) => void; setPixelRatio: (r: number) => void };
    resumeAnimation: () => void;
    _destructor?: () => void;
  } | null>(null);
  const failedRef = useRef(false);

  const htmlElementsData = useMemo<MarketElement[]>(() => {
    if (!activeSlug) return [];
    const m = markets.find(x => x.slug === activeSlug);
    return m ? [{ ...m, isActive: true as const }] : [];
  }, [markets, activeSlug]);

  const globePoints = useMemo<GlobePoint[]>(() => {
    if (landOnly || activeSlug) return LAND_POINTS;
    const dots: MarketPoint[] = markets.map(m => ({ ...m, type: 'market' as const }));
    return [...LAND_POINTS, ...dots];
  }, [markets, activeSlug, landOnly]);

  const ringsData = useMemo(
    () => (activeSlug ? markets.filter(m => m.slug === activeSlug) : []),
    [markets, activeSlug],
  );

  const reportFailure = useCallback(() => {
    if (failedRef.current) return;
    failedRef.current = true;
    markThreeWebGLFailed();
    onWebGLFailed();
  }, [onWebGLFailed]);

  // Swallow Three.js WebGL console errors so Next.js dev overlay does not appear
  useEffect(() => {
    const prev = console.error;
    console.error = (...args: unknown[]) => {
      const msg = args.map(a => (typeof a === 'string' ? a : '')).join(' ');
      if (msg.includes('WebGL context could not be created') || msg.includes('Error creating WebGL context')) {
        reportFailure();
        return;
      }
      prev.apply(console, args as [message?: unknown, ...unknown[]]);
    };
    return () => {
      console.error = prev;
    };
  }, [reportFailure]);

  // Dispose WebGL on unmount (React Strict Mode double-mount)
  useEffect(() => {
    return () => {
      try {
        globeRef.current?._destructor?.();
      } catch {
        /* ignore */
      }
      globeRef.current = null;
    };
  }, []);

  const syncRenderer = useCallback(() => {
    const globe = globeRef.current;
    if (!globe || size <= 0) return;
    try {
      const renderer = globe.renderer();
      const canvas = renderer.domElement;
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) {
        reportFailure();
        return;
      }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(size, size);
    } catch {
      reportFailure();
    }
  }, [size, reportFailure]);

  const applyAutoRotate = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    try {
      const controls = globe.controls();
      if (activeSlug) {
        controls.autoRotate = false;
        return;
      }
      controls.autoRotate = true;
      controls.autoRotateSpeed = autoRotateSpeed;
      controls.enableZoom = false;
      globe.resumeAnimation();
    } catch {
      reportFailure();
    }
  }, [activeSlug, autoRotateSpeed, reportFailure]);

  useEffect(() => {
    syncRenderer();
  }, [syncRenderer]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    try {
      if (activeSlug) {
        applyAutoRotate();
        const market = markets.find(m => m.slug === activeSlug);
        if (market) {
          globe.pointOfView(
            { lat: market.lat, lng: market.lng, altitude: focusAltitude(activeSlug) },
            900,
          );
        }
      } else {
        applyAutoRotate();
        globe.pointOfView({ lat: 25, lng: 55, altitude: 2.3 }, 1200);
      }
    } catch {
      reportFailure();
    }
  }, [activeSlug, markets, reportFailure, applyAutoRotate]);

  // Keep auto-rotate on when idle (controls can reset after POV tweens)
  useEffect(() => {
    if (activeSlug) return;
    applyAutoRotate();
    const id = setInterval(applyAutoRotate, 1500);
    return () => clearInterval(id);
  }, [activeSlug, applyAutoRotate]);

  const onGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    syncRenderer();
    try {
      applyAutoRotate();
      globe.pointOfView({ lat: 25, lng: 55, altitude: 2.3 });
    } catch {
      reportFailure();
    }
  }, [syncRenderer, reportFailure, applyAutoRotate]);

  const htmlElement = useCallback((d: object) => buildActiveMarkerHtml(d as MarketElement), []);
  const pointColor = useCallback(
    (d: object) => ((d as GlobePoint).type === 'market' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.28)'),
    [],
  );
  const pointRadius = useCallback(
    (d: object) => ((d as GlobePoint).type === 'market' ? 0.22 : 0.18),
    [],
  );

  return (
    <div className="globe-stage relative z-[1] mx-auto" style={{ width: size, height: size }}>
      <Globe
        // @ts-expect-error react-globe.gl ref typing
        ref={globeRef}
        width={size}
        height={size}
        animateIn={false}
        waitForGlobeReady={false}
        backgroundColor="rgba(0,0,0,0)"
        rendererConfig={{
          antialias: false,
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
        }}
        showAtmosphere={false}
        showGlobe={false}
        showGraticules
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
    </div>
  );
}

export default function InteractiveGlobe({
  markets,
  activeSlug,
  mountImmediately = false,
  maxSize = 360,
  landOnly = false,
  autoRotateSpeed = 2.2,
  showRing = true,
}: InteractiveGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountGenRef = useRef(0);
  const [size, setSize] = useState(0);
  const [inView, setInView] = useState(mountImmediately);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<WebGLMode | 'loading'>('loading');

  useEffect(() => {
    if (mountImmediately) {
      setInView(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: '120px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mountImmediately]);

  useEffect(() => {
    if (!inView) return;
    const generation = ++mountGenRef.current;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (generation !== mountGenRef.current) return;
        setMode(getWebGLMode());
        setReady(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      mountGenRef.current += 1;
      setReady(false);
      setMode('loading');
    };
  }, [inView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setSize(Math.min(el.offsetWidth, maxSize));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxSize]);

  const handleThreeFailed = useCallback(() => {
    markThreeWebGLFailed();
    setMode(getWebGLMode());
  }, []);

  const handleCobeFailed = useCallback(() => {
    setMode('none');
  }, []);

  const globeSize = size || maxSize;
  const showGlobe = inView && ready && size > 0 && mode !== 'loading';

  const fallbackLayer =
    mode === 'cobe' ? (
      <CobeGlobeFallback
        markets={markets}
        activeSlug={activeSlug}
        size={globeSize}
        onFailed={handleCobeFailed}
        autoRotateSpeed={autoRotateSpeed}
      />
    ) : (
      <StaticGlobeFallback markets={markets} activeSlug={activeSlug} size={globeSize} />
    );

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square mx-auto"
      style={{ maxWidth: maxSize }}
    >
      {showRing && <GlobeRing />}

      {!showGlobe ? (
        <GlobeSkeleton />
      ) : mode === 'three' ? (
        <GlobeErrorBoundary
          fallback={<div className="relative z-[1] flex justify-center">{fallbackLayer}</div>}
          onError={handleThreeFailed}
        >
          <ThreeGlobe
            markets={markets}
            activeSlug={activeSlug}
            size={size}
            onWebGLFailed={handleThreeFailed}
            landOnly={landOnly}
            autoRotateSpeed={autoRotateSpeed}
          />
        </GlobeErrorBoundary>
      ) : (
        <div className="relative z-[1] flex justify-center">{fallbackLayer}</div>
      )}
    </div>
  );
}
