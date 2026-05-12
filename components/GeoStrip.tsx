'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe2 } from 'lucide-react';
import { getByLayer } from '@/lib/content';

const COUNTRY_LABELS: Record<string, string> = {
  usa: 'USA', uk: 'UK', canada: 'Canada', australia: 'Australia', germany: 'Germany',
  netherlands: 'Netherlands', ireland: 'Ireland', malta: 'Malta', india: 'India',
  singapore: 'Singapore', dubai: 'Dubai', uae: 'UAE', 'south-africa': 'South Africa',
  philippines: 'Philippines', sweden: 'Sweden', norway: 'Norway', denmark: 'Denmark',
  spain: 'Spain', italy: 'Italy',
};
const FLAGS: Record<string, string> = {
  usa: '🇺🇸', uk: '🇬🇧', canada: '🇨🇦', australia: '🇦🇺', germany: '🇩🇪',
  netherlands: '🇳🇱', ireland: '🇮🇪', malta: '🇲🇹', india: '🇮🇳',
  singapore: '🇸🇬', dubai: '🇦🇪', uae: '🇦🇪', 'south-africa': '🇿🇦',
  philippines: '🇵🇭', sweden: '🇸🇪', norway: '🇳🇴', denmark: '🇩🇰',
  spain: '🇪🇸', italy: '🇮🇹',
};

export default function GeoStrip() {
  const geos = getByLayer('geo')
    .filter(p => p.path.startsWith('/igaming-development-company-'))
    .map(p => {
      const slug = p.path.replace('/igaming-development-company-','').replace(/\/$/,'');
      return { ...p, slug, label: COUNTRY_LABELS[slug] || slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()), flag: FLAGS[slug] || '🌐' };
    });

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300 mb-3">
            <Globe2 size={12} /> Global delivery
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Where we build iGaming</h2>
          <p className="text-ink-muted text-sm">Licensed-jurisdiction expertise across 17 markets — pick yours.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {geos.map((g, i) => (
            <motion.div key={g.path} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }}>
              <Link href={g.path} className="glow-card flex items-center gap-3 px-4 py-3 group">
                <span className="text-xl">{g.flag}</span>
                <span className="text-sm font-medium text-ink-muted group-hover:text-ink transition-colors">{g.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
