'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Globe2 } from 'lucide-react';
import { getByLayer } from '@/lib/content';
import {
  COUNTRY_LABELS,
  COUNTRY_CODES,
  COUNTRY_COORDS,
  type GeoMarket,
} from '@/lib/geo-markets';
import InteractiveGlobe from '@/components/InteractiveGlobe';
import { MarqueeRow, splitMarkets } from '@/components/ScrollingMarketColumns';

export default function GeoStrip() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const geos: GeoMarket[] = useMemo(() => {
    return getByLayer('geo')
      .filter(p => p.path.startsWith('/igaming-development-company-'))
      .map(p => {
        const slug = p.path.replace('/igaming-development-company-', '').replace(/\/$/, '');
        const label = COUNTRY_LABELS[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const code = COUNTRY_CODES[slug] || label.slice(0, 2).toUpperCase();
        const coords = COUNTRY_COORDS[slug] || { lat: 0, lng: 0 };
        return { slug, label, code, lat: coords.lat, lng: coords.lng, path: p.path };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const { top, bottom } = splitMarkets(geos);

  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 mb-3">
            <Globe2 size={12} /> Global delivery
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-white">
            Where we build <span className="text-brand-500">iGaming</span>
          </h2>
          <p className="text-ink-muted text-sm">
            Licensed-jurisdiction expertise across 17 markets — hover a country to see it on the globe.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 max-w-3xl mx-auto"
        >
          {/* Top row — scrolls left */}
          <MarqueeRow
            items={top}
            direction="left"
            duration={38}
            activeSlug={activeSlug}
            onHover={setActiveSlug}
            label="Markets"
          />

          {/* Globe */}
          <div className="relative w-full flex justify-center">
            <InteractiveGlobe markets={geos} activeSlug={activeSlug} />
          </div>

          {/* Bottom row — scrolls right */}
          <MarqueeRow
            items={bottom}
            direction="right"
            duration={42}
            activeSlug={activeSlug}
            onHover={setActiveSlug}
            label="Regions"
          />

          <p className="text-center text-[11px] text-ink-dim hidden sm:block">
            Hover a country to label it on the globe · Drag to explore
          </p>
        </motion.div>
      </div>
    </section>
  );
}
