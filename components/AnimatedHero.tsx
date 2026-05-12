'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export default function AnimatedHero({
  eyebrow, title, subtitle, primaryCta, secondaryCta,
}: { eyebrow?: string; title: string; subtitle?: string; primaryCta?: { label: string; href: string }; secondaryCta?: { label: string; href: string }; }) {
  const words = title.split(' ');
  return (
    <section className="relative overflow-hidden pt-12 lg:pt-20 pb-16">
      {/* Animated mesh + orbs */}
      <div className="absolute inset-0 bg-mesh-1 opacity-100" />
      <motion.div className="orb orb-purple w-[500px] h-[500px] top-[-150px] left-[-100px]" animate={{ y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="orb orb-cyan w-[400px] h-[400px] top-[50px] right-[-80px]" animate={{ y: [0, -25, 0] }} transition={{ duration: 10, repeat: Infinity }} />
      <motion.div className="orb orb-gold w-[300px] h-[300px] bottom-[-100px] left-[40%]" animate={{ y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity }} />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {eyebrow && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-500/20 text-xs font-medium text-brand-200 mb-6">
            <Sparkles size={12} className="text-gold-400" />
            {eyebrow}
          </motion.div>
        )}
        <h1 className="font-display font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
          {words.map((w, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }} className="inline-block mr-3">
              {i === Math.floor(words.length/2) ? <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-gold-400 bg-clip-text text-transparent">{w}</span> : w}
            </motion.span>
          ))}
        </h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg text-ink-muted leading-relaxed mb-8">{subtitle}</motion.p>
        )}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex flex-wrap justify-center gap-3">
          {primaryCta && <Link href={primaryCta.href} className="btn-primary">{primaryCta.label} <ArrowRight size={16} /></Link>}
          {secondaryCta && <Link href={secondaryCta.href} className="btn-secondary">{secondaryCta.label}</Link>}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-ink-dim">
          <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-casino-green" /> GLI-19 / iTech ready</div>
          <div className="flex items-center gap-2"><Cpu size={14} className="text-cyan-400" /> Modern stack</div>
          <div className="flex items-center gap-2"><Sparkles size={14} className="text-gold-400" /> MGA / UKGC fluent</div>
        </motion.div>
      </div>
    </section>
  );
}
