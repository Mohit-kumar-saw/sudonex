'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { GeoMarket } from '@/lib/geo-markets';
import { flagImageUrl } from '@/lib/geo-markets';

interface MarqueeRowProps {
  items: GeoMarket[];
  direction: 'left' | 'right';
  duration?: number;
  activeSlug: string | null;
  onHover: (slug: string | null) => void;
  label?: string;
}

function MarketItem({
  market,
  active,
  onHover,
}: {
  market: GeoMarket;
  active: boolean;
  onHover: (slug: string | null) => void;
}) {
  const flagUrl = flagImageUrl(market.slug);

  return (
    <Link
      href={market.path}
      className={`group relative shrink-0 min-w-[108px] py-2 px-3.5 rounded-xl text-center overflow-hidden transition-all duration-300 ${
        active
          ? 'border border-brand-500/50 shadow-[0_0_16px_-4px_rgba(255,102,0,0.5)] scale-[1.02]'
          : 'border border-white/[0.06] hover:border-brand-500/30 hover:shadow-[0_0_14px_-8px_rgba(255,102,0,0.3)]'
      }`}
      onMouseEnter={() => onHover(market.slug)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(market.slug)}
      onBlur={() => onHover(null)}
    >
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500 scale-110 ${
          active ? 'opacity-35' : 'opacity-20 group-hover:opacity-30'
        }`}
        style={{ backgroundImage: `url(${flagUrl})` }}
        aria-hidden
      />
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          active
            ? 'bg-gradient-to-t from-black/90 via-black/70 to-black/50'
            : 'bg-gradient-to-t from-black/92 via-black/75 to-black/55 group-hover:from-black/88 group-hover:via-black/68'
        }`}
        aria-hidden
      />
      {active && <div className="absolute inset-0 bg-brand-500/10 mix-blend-overlay" aria-hidden />}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-500 rounded-full shadow-[0_0_6px_#FF6600] z-10" />
      )}
      <span
        className={`relative z-10 font-display text-[12px] font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] ${
          active ? 'text-brand-400' : 'text-white/80 group-hover:text-white'
        }`}
      >
        {market.label}
      </span>
    </Link>
  );
}

export function MarqueeRow({
  items,
  direction,
  duration = 35,
  activeSlug,
  onHover,
  label,
}: MarqueeRowProps) {
  const loop = [...items, ...items];
  const Icon = direction === 'left' ? ArrowLeft : ArrowRight;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-bg to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg to-transparent z-10" />

      {label && (
        <div className="pointer-events-none absolute top-0 left-3 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 border border-white/[0.08] backdrop-blur-sm">
          <Icon size={8} className="text-brand-500" />
          <span className="text-[7px] uppercase tracking-[0.16em] text-white/40 font-medium">{label}</span>
        </div>
      )}

      <div
        className={`marquee-track marquee-track-horizontal flex gap-2 py-1 ${label ? 'pt-6' : ''} ${
          direction === 'left' ? 'marquee-left' : 'marquee-right'
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((market, i) => (
          <MarketItem
            key={`${market.slug}-${i}`}
            market={market}
            active={activeSlug === market.slug}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
}

export function splitMarkets(markets: GeoMarket[]) {
  const mid = Math.ceil(markets.length / 2);
  return { top: markets.slice(0, mid), bottom: markets.slice(mid) };
}
