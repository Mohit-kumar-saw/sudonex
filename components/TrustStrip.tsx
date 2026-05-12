'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck2, Lock, Cpu, Globe2, Coins } from 'lucide-react';

const TRUST = [
  { icon: ShieldCheck, label: 'GLI-19 / iTech ready', sub: 'RNG cert pipeline' },
  { icon: FileCheck2, label: 'MGA / UKGC fluent', sub: 'Licensing handoff' },
  { icon: Lock, label: 'PCI DSS L1', sub: 'Payment compliance' },
  { icon: Cpu, label: 'Microservices', sub: 'Multi-region scale' },
  { icon: Globe2, label: '17 jurisdictions', sub: 'Geo-targeted builds' },
  { icon: Coins, label: 'Crypto + fiat', sub: 'On-chain wallets' },
];

export default function TrustStrip() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-mesh-2 opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-gold-300 mb-3">Trust & Compliance</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">The standards your regulator expects</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRUST.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div key={t.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="glow-card p-5 text-center">
                <Icon size={24} className="mx-auto mb-3 text-gold-400" />
                <p className="font-semibold text-sm text-ink mb-1">{t.label}</p>
                <p className="text-xs text-ink-dim">{t.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
