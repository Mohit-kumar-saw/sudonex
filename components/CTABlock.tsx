'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
export default function CTABlock() {
  return (
    <section className="relative py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-bg-card p-10 lg:p-14 text-center"
        >
          <div className="hero-curve-orange w-72 h-72 -top-20 -left-10 opacity-20" style={{ borderRadius: '50%' }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 font-medium mb-5">
              <MessageSquare size={12} /> Free 30-min discovery
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-white">
              Ready to build something <span className="text-brand-500">operators trust?</span>
            </h2>
            <p className="text-ink-muted max-w-2xl mx-auto mb-8">Tell us about your build — region, licensing, timeline, budget. We&apos;ll come back with a technical scope and a fixed-bid roadmap within 48 hours.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact/" className="btn-primary">Book a discovery call <ArrowRight size={16} /></Link>
              <Link href="/case-studies/" className="btn-secondary">See client work</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
