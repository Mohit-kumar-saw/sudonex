import Link from 'next/link';
import { NAV } from '@/lib/content';
import { Mail, MapPin, ShieldCheck, AlertTriangle } from 'lucide-react';

const cols = [
  { title: 'Services', items: NAV.services },
  { title: 'Solutions', items: NAV.solutions },
  { title: 'Industries', items: NAV.industries },
  { title: 'Locations', items: NAV.geo },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-bg-deep overflow-hidden">
      <div className="orb orb-purple w-[500px] h-[500px] -top-40 -left-40" />
      <div className="orb orb-cyan w-[400px] h-[400px] -bottom-40 -right-20" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand grid place-items-center font-display font-bold text-white">S</div>
              <span className="font-display font-bold text-xl">Sudonex</span>
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">iGaming development built for operators who take compliance seriously. Founded 2018.</p>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li className="flex items-center gap-2"><Mail size={12} /> <a href="mailto:hello@sudonex.com" className="hover:text-ink">hello@sudonex.com</a></li>
              <li className="flex items-center gap-2"><MapPin size={12} /> Global delivery · 17 jurisdictions</li>
            </ul>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-xs uppercase tracking-widest text-ink-dim mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.items.slice(0, 7).map(it => (
                  <li key={it.path}><Link href={it.path} className="text-sm text-ink-muted hover:text-ink transition-colors">{it.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* E-E-A-T trust block */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 py-6 border-y border-white/5 mb-6">
          <Link href="/about-us/#editorial-standards" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <ShieldCheck size={16} className="text-cyan-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-ink">Editorial standards</p>
              <p className="text-[11px] text-ink-dim">How we research & review</p>
            </div>
          </Link>
          <a href="https://www.begambleaware.org/" target="_blank" rel="noopener" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <AlertTriangle size={16} className="text-gold-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-ink">Responsible gambling</p>
              <p className="text-[11px] text-ink-dim">18+ · BeGambleAware</p>
            </div>
          </a>
          <Link href="/about-us/#corrections" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <ShieldCheck size={16} className="text-brand-300 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-ink">Corrections policy</p>
              <p className="text-[11px] text-ink-dim">Report a factual error</p>
            </div>
          </Link>
          <Link href="/about-us/#fact-checking" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <ShieldCheck size={16} className="text-casino-green mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-ink">Fact-checking</p>
              <p className="text-[11px] text-ink-dim">Multi-source verification</p>
            </div>
          </Link>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-ink-dim">© {new Date().getFullYear()} Sudonex. iGaming software development company. Trusted by licensed operators worldwide.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-dim">
            <Link href="/about-us/" className="hover:text-ink">About</Link>
            <Link href="/resources/" className="hover:text-ink">Resources</Link>
            <Link href="/contact/" className="hover:text-ink">Contact</Link>
            <Link href="/about-us/#privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/about-us/#terms" className="hover:text-ink">Terms</Link>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-ink-dim">Sudonex builds B2B iGaming software for licensed operators. Sudonex does not operate gambling services. Content is for informational purposes; consult licensed counsel for jurisdictional compliance.</p>
      </div>
    </footer>
  );
}
