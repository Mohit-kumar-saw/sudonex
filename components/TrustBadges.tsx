'use client';
import { ShieldCheck, FileCheck2, Lock, Award } from 'lucide-react';

const BADGES = [
  { icon: ShieldCheck, label: 'GLI-19 ready', sub: 'RNG cert pipeline' },
  { icon: FileCheck2, label: 'MGA / UKGC', sub: 'License-fluent' },
  { icon: Lock, label: 'PCI DSS L1', sub: 'Payment compliant' },
  { icon: Award, label: 'ISO 27001 aligned', sub: 'Information security' },
];

export default function TrustBadges() {
  return (
    <section aria-label="Compliance & trust signals" className="max-w-3xl mx-auto px-6 mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BADGES.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="glow-card flex items-center gap-2 px-3 py-2.5">
              <Icon size={16} className="text-brand-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white leading-tight truncate">{b.label}</p>
                <p className="text-[10px] text-ink-dim leading-tight truncate">{b.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
