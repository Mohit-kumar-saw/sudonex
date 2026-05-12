'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV } from '@/lib/content';

const MEGA = [
  { key: 'services', label: 'Services', items: NAV.services, color: 'from-brand-500 to-cyan-500' },
  { key: 'solutions', label: 'Solutions', items: NAV.solutions, color: 'from-cyan-500 to-emerald-400' },
  { key: 'industries', label: 'Industries', items: NAV.industries, color: 'from-gold-400 to-brand-500' },
];

export default function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'glass shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand grid place-items-center font-display font-bold text-white shadow-glow-brand group-hover:scale-110 transition-transform">S</div>
          <span className="font-display font-bold text-xl tracking-tight">Sudonex</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpen(null)}>
          {MEGA.map(g => (
            <div key={g.key} className="relative" onMouseEnter={() => setOpen(g.key)}>
              <button className="px-3 py-2 text-sm text-ink-muted hover:text-ink flex items-center gap-1 transition-colors">
                {g.label}
                <ChevronDown size={14} className={`transition-transform ${open===g.key?'rotate-180':''}`} />
              </button>
              <AnimatePresence>
                {open === g.key && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-80 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${g.color}`} />
                    <div className="p-2">
                      {g.items.map(it => (
                        <Link key={it.path} href={it.path} className="block px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-ink-muted hover:text-ink transition-colors">{it.label}</Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link href="/resources/" className="px-3 py-2 text-sm text-ink-muted hover:text-ink transition-colors">Resources</Link>
          <Link href="/case-studies/" className="px-3 py-2 text-sm text-ink-muted hover:text-ink transition-colors">Case Studies</Link>
          <Link href="/about-us/" className="px-3 py-2 text-sm text-ink-muted hover:text-ink transition-colors">About</Link>
          <Link href="/contact/" className="ml-2 btn-primary text-sm py-2 px-4">Contact</Link>
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-ink">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="lg:hidden glass border-t border-white/10 overflow-hidden">
            <div className="px-6 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {[...NAV.services, ...NAV.solutions, ...NAV.industries].map(it => (
                <Link key={it.path} href={it.path} onClick={() => setMobileOpen(false)} className="block py-2.5 text-ink-muted hover:text-ink">{it.label}</Link>
              ))}
              <Link href="/contact/" onClick={() => setMobileOpen(false)} className="btn-primary mt-4 w-full justify-center">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
