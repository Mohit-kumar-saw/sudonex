'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, Dice5, Trophy, Plug, Palette, Wrench, Rocket, ArrowUpRight } from 'lucide-react';

const ICONS: Record<string, any> = {
  '/casino-app-development/': { icon: Gamepad2 },
  '/slot-game-development/': { icon: Dice5 },
  '/sports-exchange-development/': { icon: Trophy },
  '/igaming-api-integration/': { icon: Plug },
  '/igaming-ui-ux-design/': { icon: Palette },
  '/igaming-maintenance-debugging/': { icon: Wrench },
  '/igaming-mvp-consultancy/': { icon: Rocket },
};

const SERVICES = [
  { path: '/casino-app-development/', title: 'Casino App Development', desc: 'iOS, Android & web casino apps with backend, payments, RNG and licensing.' },
  { path: '/slot-game-development/', title: 'Slot Game Development', desc: 'Custom slots, HTML5 / Unity engines, jackpot systems, math & RNG certification.' },
  { path: '/sports-exchange-development/', title: 'Sports Exchange', desc: 'Peer-to-peer betting platforms, real-time odds, matching engines, liquidity tools.' },
  { path: '/igaming-api-integration/', title: 'API Integration', desc: 'Payment gateways, KYC/AML, game aggregators, crypto wallets — connected cleanly.' },
  { path: '/igaming-ui-ux-design/', title: 'UI / UX Design', desc: 'Casino lobby, sportsbook UI, conversion-tuned wireframes & player journeys.' },
  { path: '/igaming-maintenance-debugging/', title: 'Maintenance & Debugging', desc: '24/7 monitoring, performance tuning, security audits, bug fixing.' },
  { path: '/igaming-mvp-consultancy/', title: 'MVP Consultancy', desc: 'From idea to funded MVP in 8-12 weeks. MVP-to-scale roadmaps for startups.' },
];

export default function ServiceCards() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-widest text-brand-500 mb-3">What We Build</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-white">iGaming engineering, <span className="text-brand-500">end-to-end</span></h2>
            <p className="text-ink-muted max-w-2xl mx-auto">Every product surface for licensed operators, startups, and game studios — built once, built right.</p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, idx) => {
            const meta = ICONS[s.path];
            const Icon = meta?.icon || Gamepad2;
            return (
              <motion.div key={s.path} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                <Link href={s.path} className="glow-card block p-6 h-full group">
                  <div className="w-12 h-12 rounded-lg bg-brand-500/10 border border-brand-500/20 grid place-items-center mb-4 group-hover:bg-brand-500 group-hover:border-brand-500 transition-all">
                    <Icon size={22} className="text-brand-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-lg text-white">{s.title}</h3>
                    <ArrowUpRight size={16} className="text-ink-dim group-hover:text-brand-500 transition-colors" />
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
