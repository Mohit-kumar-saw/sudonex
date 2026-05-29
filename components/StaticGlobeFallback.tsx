'use client';

import type { GeoMarket } from '@/lib/geo-markets';

/** Non-WebGL fallback — dotted sphere + market pins (SVG). */
export default function StaticGlobeFallback({
  markets,
  activeSlug,
  size,
}: {
  markets: GeoMarket[];
  activeSlug: string | null;
  size: number;
}) {
  const active = activeSlug ? markets.find(m => m.slug === activeSlug) : null;

  return (
    <div
      className="relative z-[1] mx-auto"
      style={{ width: size, height: size }}
      aria-label="Globe showing Sudonex delivery markets"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
        <defs>
          <pattern id="globe-dots" width="2.2" height="2.2" patternUnits="userSpaceOnUse">
            <circle cx="0.55" cy="0.55" r="0.35" fill="rgba(255,255,255,0.22)" />
          </pattern>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#globe-dots)" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.2" />
        <ellipse cx="50" cy="50" rx="48" ry="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" />
        <ellipse cx="50" cy="50" rx="48" ry="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" />
        <ellipse cx="50" cy="50" rx="15" ry="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" />
        {markets.map(m => {
          const x = 50 + (m.lng / 180) * 42;
          const y = 50 - (m.lat / 90) * 42;
          const isActive = m.slug === activeSlug;
          return (
            <circle
              key={m.slug}
              cx={x}
              cy={y}
              r={isActive ? 1.4 : 0.7}
              fill={isActive ? '#FF6600' : 'rgba(255,255,255,0.5)'}
            />
          );
        })}
      </svg>
      {active && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/70 border border-brand-500/40 backdrop-blur-sm pointer-events-none">
          <p className="text-xs font-semibold text-brand-400 whitespace-nowrap">{active.label}</p>
        </div>
      )}
    </div>
  );
}
