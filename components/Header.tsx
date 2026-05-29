'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { NAV } from '@/lib/content';
import Logo from '@/components/Logo';
import { NavMegaTriggers, NavMegaPanel, buildMegaGroups } from '@/components/NavDropdown';

const MEGA_GROUPS = buildMegaGroups(NAV);

const MOBILE_SECTIONS = [
  { title: 'Services', hub: '/services/', items: NAV.services },
  { title: 'Solutions', hub: '/solutions/', items: NAV.solutions },
  { title: 'Industries', hub: '/industries/', items: NAV.industries },
];

export default function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          role="presentation"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 top-16 z-[48] hidden lg:block nav-mega-backdrop"
          onClick={() => setOpen(null)}
        />
      )}
    </AnimatePresence>

    <div className="sticky top-0 z-50" onMouseLeave={() => setOpen(null)}>
    <header
      className={`transition-all ${
        open ? 'bg-white shadow-md' : scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 h-16 flex items-center justify-between ${
          open ? 'border-b border-neutral-200' : ''
        }`}
      >
        <Logo lightBg={!!open} />

        <nav className="hidden lg:flex items-center gap-1 h-full">
          <Link
            href="/"
            className={`px-3 py-2 text-sm transition-colors ${
              open ? 'text-neutral-700 hover:text-brand-500' : 'text-white hover:text-brand-400'
            }`}
          >
            Home
          </Link>
          <Link
            href="/about-us/"
            className={`px-3 py-2 text-sm transition-colors ${
              open ? 'text-neutral-700 hover:text-brand-500' : 'text-white hover:text-brand-400'
            }`}
          >
            About
          </Link>
          <NavMegaTriggers groups={MEGA_GROUPS} open={open} setOpen={setOpen} />
          <Link
            href="/case-studies/"
            className={`px-3 py-2 text-sm transition-colors ${
              open ? 'text-neutral-700 hover:text-brand-500' : 'text-white hover:text-brand-400'
            }`}
          >
            Work
          </Link>
          <Link href="/contact/" className="btn-primary ml-2 py-2 px-4 text-sm">
            Contact
          </Link>
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-white/10"
            style={{
              background: 'linear-gradient(180deg, rgba(20,10,5,0.98), rgba(13,13,13,0.99))',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="px-4 py-4 space-y-2 max-h-[75vh] overflow-y-auto nav-dropdown-scroll">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-white hover:bg-white/5 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about-us/"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-ink-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                About
              </Link>

              {MOBILE_SECTIONS.map(section => (
                <div key={section.title} className="rounded-xl border border-white/[0.06] overflow-hidden bg-black/30">
                  <button
                    type="button"
                    onClick={() => setMobileSection(mobileSection === section.title ? null : section.title)}
                    className="w-full flex items-center justify-between px-3 py-3 text-left text-sm font-medium text-white"
                  >
                    <span className="text-brand-500 text-[10px] uppercase tracking-wider font-semibold mr-2">
                      {section.title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-ink-muted transition-transform ${mobileSection === section.title ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileSection === section.title && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-white/[0.06]"
                      >
                        <div className="p-2 space-y-0.5">
                          {section.items.map(it => (
                            <Link
                              key={it.path}
                              href={it.path}
                              onClick={() => setMobileOpen(false)}
                              className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-muted hover:text-white hover:bg-brand-500/10 transition-colors"
                            >
                              {it.label}
                              <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-brand-500" />
                            </Link>
                          ))}
                          <Link
                            href={section.hub}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-brand-400"
                          >
                            View all {section.title.toLowerCase()} <ArrowRight size={12} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <Link
                href="/case-studies/"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-ink-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                Work
              </Link>
              <Link href="/contact/" onClick={() => setMobileOpen(false)} className="btn-primary mt-2 w-full justify-center">
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    <NavMegaPanel groups={MEGA_GROUPS} open={open} />
    </div>
    </>
  );
}
