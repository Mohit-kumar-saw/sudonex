'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV } from '@/lib/content';
import { useContactModal } from '@/components/ContactModal';
import Logo from '@/components/Logo';

const MEGA = [
  { key: 'services', label: 'Services', items: NAV.services },
  { key: 'solutions', label: 'Solutions', items: NAV.solutions },
  { key: 'industries', label: 'Industries', items: NAV.industries },
];

export default function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'glass shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpen(null)}>
          <Link href="/" className="px-3 py-2 text-sm text-white hover:text-brand-400 transition-colors">Home</Link>
          <Link href="/about-us/" className="px-3 py-2 text-sm text-white hover:text-brand-400 transition-colors">About</Link>
          {MEGA.map(g => (
            <div key={g.key} className="relative" onMouseEnter={() => setOpen(g.key)}>
              <button className="px-3 py-2 text-sm text-white hover:text-brand-400 flex items-center gap-1 transition-colors">
                {g.label}
                <ChevronDown size={14} className={`transition-transform ${open === g.key ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === g.key && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-80 glass rounded-xl border border-white/10 shadow-2xl overflow-hidden"
                  >
                    <div className="h-1 bg-brand-500" />
                    <div className="p-2">
                      {g.items.map(it => (
                        <Link
                          key={it.path}
                          href={it.path}
                          className="block px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-ink-muted hover:text-white transition-colors"
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link href="/case-studies/" className="px-3 py-2 text-sm text-white hover:text-brand-400 transition-colors">Work</Link>
          <button
            onClick={openModal}
            className="px-3 py-2 text-sm text-white hover:text-brand-400 transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-10 h-10 bg-brand-500 hover:bg-brand-600 grid place-items-center rounded-lg transition-colors cursor-pointer"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="lg:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2.5 text-ink-muted hover:text-white">Home</Link>
              <Link href="/about-us/" onClick={() => setMobileOpen(false)} className="block py-2.5 text-ink-muted hover:text-white">About</Link>
              {[...NAV.services, ...NAV.solutions, ...NAV.industries].map(it => (
                <Link key={it.path} href={it.path} onClick={() => setMobileOpen(false)} className="block py-2.5 text-ink-muted hover:text-white">{it.label}</Link>
              ))}
              <Link href="/case-studies/" onClick={() => setMobileOpen(false)} className="block py-2.5 text-ink-muted hover:text-white">Work</Link>
              <button
                onClick={() => { setMobileOpen(false); openModal(); }}
                className="btn-primary mt-4 w-full justify-center cursor-pointer"
              >
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
