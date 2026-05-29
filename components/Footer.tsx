'use client';
import Link from 'next/link';
import { NAV } from '@/lib/content';
import { Mail, MapPin, ShieldCheck, AlertTriangle, Phone, Instagram, Facebook, Linkedin } from 'lucide-react';
import Logo from '@/components/Logo';

const cols = [
  { title: 'Services', items: NAV.services },
  { title: 'Solutions', items: NAV.solutions },
  { title: 'Industries', items: NAV.industries },
  { title: 'Locations', items: NAV.geo },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-bg-deep overflow-hidden">
      <div className="hero-curve-orange w-[400px] h-[400px] -top-40 -left-40 opacity-30" style={{ borderRadius: '50%' }} />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm text-ink-muted leading-relaxed mb-4">iGaming development built for operators who take compliance seriously. Founded 2018.</p>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li className="flex items-center gap-2"><Mail size={12} className="text-brand-500" /> <a href="mailto:Sudonexofficial@gmail.com" className="hover:text-white">Sudonexofficial@gmail.com</a></li>
              <li className="flex items-center gap-2"><Phone size={12} className="text-brand-500" /> <a href="tel:+919691684577" className="hover:text-white">+91 9691684577</a></li>
              <li className="flex items-center gap-2"><MapPin size={12} className="text-brand-500" /> Global delivery · 17 jurisdictions</li>
            </ul>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-xs uppercase tracking-widest text-brand-500 mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.items.slice(0, 7).map(it => (
                  <li key={it.path}><Link href={it.path} className="text-sm text-ink-muted hover:text-white transition-colors">{it.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 py-6 border-y border-white/5 mb-6">
          <Link href="/about-us/#editorial-standards" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <ShieldCheck size={16} className="text-brand-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">Editorial standards</p>
              <p className="text-[11px] text-ink-dim">How we research & review</p>
            </div>
          </Link>
          <a href="https://www.begambleaware.org/" target="_blank" rel="noopener" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <AlertTriangle size={16} className="text-brand-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">Responsible gambling</p>
              <p className="text-[11px] text-ink-dim">18+ · BeGambleAware</p>
            </div>
          </a>
          <Link href="/about-us/#corrections" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <ShieldCheck size={16} className="text-brand-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">Corrections policy</p>
              <p className="text-[11px] text-ink-dim">Report a factual error</p>
            </div>
          </Link>
          <Link href="/about-us/#fact-checking" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <ShieldCheck size={16} className="text-brand-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">Fact-checking</p>
              <p className="text-[11px] text-ink-dim">Multi-source verification</p>
            </div>
          </Link>
        </div>

        {/* Tagline bar like screenshot */}
        <div className="text-center py-8 border-b border-white/5 mb-6">
          <p className="font-display text-lg md:text-xl font-semibold text-white">
            Your Vision. Our Code. <span className="text-brand-500">Real Growth.</span>
            {' '}| Let&apos;s Build Something Great <span className="text-brand-500">Together!</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener" className="w-9 h-9 rounded-lg border border-white/10 grid place-items-center text-ink-muted hover:text-brand-500 hover:border-brand-500/30 transition-colors">
              <Instagram size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener" className="w-9 h-9 rounded-lg border border-white/10 grid place-items-center text-ink-muted hover:text-brand-500 hover:border-brand-500/30 transition-colors">
              <Facebook size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" className="w-9 h-9 rounded-lg border border-white/10 grid place-items-center text-ink-muted hover:text-brand-500 hover:border-brand-500/30 transition-colors">
              <Linkedin size={16} />
            </a>
          </div>
          <p className="text-xs text-ink-dim">/ sudo nex</p>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-ink-dim">© {new Date().getFullYear()} Sudonex. iGaming software development company. Trusted by licensed operators worldwide.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-dim">
            <Link href="/about-us/" className="hover:text-white">About</Link>
            <Link href="/resources/" className="hover:text-white">Resources</Link>
            <Link href="/contact/" className="hover:text-white">Contact</Link>
            <Link href="/about-us/#privacy" className="hover:text-white">Privacy</Link>
            <Link href="/about-us/#terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-ink-dim">Sudonex builds B2B iGaming software for licensed operators. Sudonex does not operate gambling services. Content is for informational purposes; consult licensed counsel for jurisdictional compliance.</p>
      </div>
    </footer>
  );
}
