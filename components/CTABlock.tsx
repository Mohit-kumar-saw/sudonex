'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function CTABlock() {
  return (
    <section className="relative py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-bg-card via-brand-950/40 to-bg-card p-10 lg:p-14 text-center">
          <div className="orb orb-purple w-72 h-72 -top-20 -left-10" />
          <div className="orb orb-cyan w-72 h-72 -bottom-20 -right-10" />
          <div className="orb orb-gold w-40 h-40 top-10 right-1/4" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/20 text-xs text-gold-300 font-medium mb-5">
              <MessageSquare size={12} /> Free 30-min discovery
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Ready to build something operators trust?</h2>
            <p className="text-ink-muted max-w-2xl mx-auto mb-8">Tell us about your build — region, licensing, timeline, budget. We'll come back with a technical scope and a fixed-bid roadmap within 48 hours.</p>
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
