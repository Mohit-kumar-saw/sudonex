'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  if (!items?.length) return null;
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-3">FAQ</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => {
            const open = openIdx === i;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="glow-card overflow-hidden">
                <button onClick={() => setOpenIdx(open ? null : i)} className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                  <span className="font-medium text-ink">{it.q}</span>
                  <motion.div animate={{ rotate: open ? 45 : 0 }} className="shrink-0 w-8 h-8 rounded-full bg-gradient-brand grid place-items-center">
                    <Plus size={16} className="text-white" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-6 pb-5 text-ink-muted leading-relaxed">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
