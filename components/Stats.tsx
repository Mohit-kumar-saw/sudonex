'use client';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function Counter({ to, suffix = '', duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          const eased = 1 - Math.pow(1 - t, 3);
          setV(Math.round(to * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{v}{suffix}</span>;
}

const STATS = [
  { value: 100, suffix: '+', label: 'iGaming pages launched' },
  { value: 7, suffix: '', label: 'Service verticals covered' },
  { value: 17, suffix: '', label: 'Licensed jurisdictions' },
  { value: 24, suffix: '/7', label: 'Engineering support' },
];

export default function Stats() {
  return (
    <section className="relative py-16 border-y border-white/5">
      <div className="absolute inset-0 bg-mesh-2 opacity-50" />
      <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="text-center">
            <div className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-br from-brand-300 via-cyan-300 to-gold-300 bg-clip-text text-transparent">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <p className="text-sm text-ink-muted mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
