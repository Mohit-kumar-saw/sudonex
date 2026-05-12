'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { getPage } from '@/lib/content';

export default function RelatedLinks({ links }: { links: { to: string; anchor: string }[] }) {
  if (!links?.length) return null;
  const enriched = links.map(l => ({ ...l, page: getPage(l.to) })).filter(l => l.page);
  if (!enriched.length) return null;
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-2">Continue Reading</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Related on Sudonex</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enriched.slice(0, 6).map((l, i) => (
            <motion.div key={l.to} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={l.to} className="glow-card block p-5 group h-full">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-brand-500/10 text-brand-300 font-medium uppercase tracking-wider">{l.page!.layer}</span>
                  <ArrowUpRight size={14} className="text-ink-dim group-hover:text-brand-300" />
                </div>
                <h3 className="font-display font-semibold text-base mb-1 group-hover:text-brand-200 transition-colors">{l.anchor}</h3>
                <p className="text-xs text-ink-muted line-clamp-2">{l.page!.meta_description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
