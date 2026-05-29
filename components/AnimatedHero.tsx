'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { useContactModal } from '@/components/ContactModal';

export default function AnimatedHero({
  eyebrow, title, subtitle, primaryCta, secondaryCta,
}: { eyebrow?: string; title: string; subtitle?: string; primaryCta?: { label: string; href: string }; secondaryCta?: { label: string; href: string }; }) {
  const words = title.split(' ');
  const { openModal } = useContactModal();
  const highlightStart = Math.floor(words.length / 2);

  const isContactHref = (href: string) => href.replace(/\/$/, '') === '/contact';

  return (
    <section className="relative overflow-hidden pt-8 lg:pt-12 pb-16 lg:pb-20">
      {/* Curved background shapes */}
      <div className="hero-curve-orange w-[600px] h-[600px] -top-[200px] -right-[150px] opacity-80" style={{ borderRadius: '50% 0 50% 50%' }} />
      <div className="hero-curve-dark w-[500px] h-[500px] top-[100px] -right-[100px] opacity-90" style={{ borderRadius: '50% 50% 0 50%' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full dot-grid opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: text content */}
          <div className="text-left">
            {eyebrow && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-xs font-medium text-brand-400 mb-6"
              >
                <Sparkles size={12} className="text-brand-500" />
                {eyebrow}
              </motion.div>
            )}
            <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="inline-block mr-[0.25em]"
                >
                  {i >= highlightStart ? (
                    <span className="text-brand-500">{w}</span>
                  ) : (
                    <span className="text-white">{w}</span>
                  )}
                </motion.span>
              ))}
            </h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-xl text-base md:text-lg text-ink-muted leading-relaxed mb-8"
              >
                {subtitle}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {primaryCta && (
                isContactHref(primaryCta.href) ? (
                  <button onClick={openModal} className="btn-primary cursor-pointer">
                    {primaryCta.label} <ArrowRight size={16} />
                  </button>
                ) : (
                  <Link href={primaryCta.href} className="btn-primary">{primaryCta.label} <ArrowRight size={16} /></Link>
                )
              )}
              {secondaryCta && (
                isContactHref(secondaryCta.href) ? (
                  <button onClick={openModal} className="btn-secondary cursor-pointer">{secondaryCta.label}</button>
                ) : (
                  <Link href={secondaryCta.href} className="btn-secondary">{secondaryCta.label}</Link>
                )
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-10 flex flex-wrap gap-6 text-xs text-ink-dim"
            >
              <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-brand-500" /> GLI-19 / iTech ready</div>
              <div className="flex items-center gap-2"><Cpu size={14} className="text-brand-500" /> Modern stack</div>
              <div className="flex items-center gap-2"><Sparkles size={14} className="text-brand-500" /> MGA / UKGC fluent</div>
            </motion.div>
          </div>

          {/* Right: hero graphic */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src="/hero-graphic.svg"
                alt="Sudonex growth"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
