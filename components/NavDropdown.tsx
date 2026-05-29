'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowUpRight,
  Layers,
  Bitcoin,
  Code2,
  Building2,
  Rocket,
  Trophy,
  Gamepad2,
  Sparkles,
  Plug,
  Palette,
  Wrench,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = { path: string; label: string };
export type MegaGroup = {
  key: string;
  label: string;
  hub: string;
  tagline: string;
  items: NavItem[];
};

const ICONS: Record<string, LucideIcon> = {
  '/casino-app-development/': Gamepad2,
  '/slot-game-development/': Sparkles,
  '/sports-exchange-development/': Trophy,
  '/igaming-api-integration/': Plug,
  '/igaming-ui-ux-design/': Palette,
  '/igaming-maintenance-debugging/': Wrench,
  '/igaming-mvp-consultancy/': Rocket,
  '/solutions/white-label-casino-solutions/': Layers,
  '/solutions/crypto-casino-solutions/': Bitcoin,
  '/solutions/real-money-gaming-solutions/': Building2,
  '/solutions/custom-igaming-software-solutions/': Code2,
  '/solutions/enterprise-igaming-platforms/': Building2,
  '/solutions/igaming-startup-solutions/': Rocket,
  '/industries/online-casino-operators/': Gamepad2,
  '/industries/sports-betting-operators/': Trophy,
  '/industries/igaming-startups/': Rocket,
  '/industries/crypto-gambling-platforms/': Bitcoin,
  '/industries/game-aggregators/': Layers,
  '/industries/investors-enterprises/': Briefcase,
};

const DESCS: Record<string, string> = {
  '/casino-app-development/': 'Full-stack casino platforms for licensed operators.',
  '/slot-game-development/': 'HTML5 slots, math models, and RNG certification.',
  '/sports-exchange-development/': 'Peer-to-peer engines with back/lay matching.',
  '/igaming-api-integration/': 'Aggregators, PSPs, KYC, and odds suppliers.',
  '/igaming-ui-ux-design/': 'Conversion-focused UX built for disclosure rules.',
  '/igaming-maintenance-debugging/': 'Takeover, triage, and gradual modernisation.',
  '/igaming-mvp-consultancy/': 'Honest 90-day path from licence to launch.',
  '/solutions/white-label-casino-solutions/': 'Certified casino live in 60–120 days.',
  '/solutions/crypto-casino-solutions/': 'Multi-chain wallets and provably fair play.',
  '/solutions/real-money-gaming-solutions/': 'MGA, UKGC, and fiat-licensed RMG stacks.',
  '/solutions/custom-igaming-software-solutions/': 'Discovery-led architecture from scratch.',
  '/solutions/enterprise-igaming-platforms/': 'Multi-brand shared backends at scale.',
  '/solutions/igaming-startup-solutions/': 'Runway-aware MVPs for funded teams.',
  '/industries/online-casino-operators/': 'Lobby, wallet, bonus, and aggregator plumbing.',
  '/industries/sports-betting-operators/': 'Sportsbooks, exchanges, and hybrid products.',
  '/industries/igaming-startups/': 'Pre-licence foundations that age well.',
  '/industries/crypto-gambling-platforms/': 'Token-native products and reconciliation.',
  '/industries/game-aggregators/': 'Studio onboarding and unified game sessions.',
  '/industries/investors-enterprises/': 'Technical due diligence and roll-ups.',
};

const FEATURED: Record<string, { title: string; desc: string; cta: string }> = {
  services: {
    title: 'Map your build to the right discipline',
    desc: 'Not sure which service line fits? Describe the symptom — we will tell you which team owns it.',
    cta: 'Explore all services',
  },
  solutions: {
    title: 'Pick the engagement shape that matches your stage',
    desc: 'White-label, crypto, enterprise, or startup — each solution is a pre-shaped scope with honest sequencing.',
    cta: 'View all solutions',
  },
  industries: {
    title: 'Built for your vertical, not generic SaaS',
    desc: 'Casino, sportsbook, crypto, aggregator, or investor — regulatory pressure and stack constraints differ.',
    cta: 'See all industries',
  },
};

function splitColumns<T>(items: T[]): [T[], T[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

export function NavMegaTriggers({
  groups,
  open,
  setOpen,
}: {
  groups: MegaGroup[];
  open: string | null;
  setOpen: (key: string | null) => void;
}) {
  return (
    <>
      {groups.map(g => (
        <button
          key={g.key}
          type="button"
          onMouseEnter={() => setOpen(g.key)}
          className={`relative px-3 py-2 text-sm inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            open
              ? open === g.key
                ? 'text-brand-500 font-medium'
                : 'text-neutral-600 hover:text-brand-500'
              : 'text-white hover:text-brand-400'
          }`}
        >
          {g.label}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              open === g.key
                ? 'rotate-180 text-brand-500'
                : open
                  ? 'text-neutral-400'
                  : 'text-ink-dim'
            }`}
          />
          {open === g.key && (
            <motion.span
              layoutId="nav-mega-underline"
              className="absolute bottom-0 left-2 right-2 h-[2px] bg-brand-500 rounded-full"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      ))}
    </>
  );
}

function MegaItem({ path, label }: NavItem) {
  const Icon = ICONS[path] ?? Layers;
  const desc = DESCS[path] ?? '';
  return (
    <Link href={path} className="nav-mega-item group">
      <span className="nav-mega-thumb">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1 pr-4">
        <span className="block text-sm font-semibold text-neutral-900 group-hover:text-brand-500 transition-colors">
          {label}
        </span>
        {desc && (
          <span className="block text-xs text-neutral-500 leading-relaxed mt-1 line-clamp-2 group-hover:text-neutral-600">
            {desc}
          </span>
        )}
      </span>
      <ArrowUpRight
        size={16}
        className="shrink-0 text-neutral-400 group-hover:text-brand-500 transition-colors"
      />
    </Link>
  );
}

export function NavMegaPanel({
  groups,
  open,
}: {
  groups: MegaGroup[];
  open: string | null;
}) {
  const active = groups.find(g => g.key === open);
  if (!active) return null;

  const [colA, colB] = splitColumns(active.items);
  const featured = FEATURED[active.key];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={active.key}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block fixed left-0 right-0 top-16 z-[51] nav-mega-panel"
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-12 gap-8 lg:gap-12">
              <div className="col-span-12 lg:col-span-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-500 mb-1">
                  {active.label}
                </p>
                <p className="text-sm text-neutral-500 mb-6 max-w-xl">{active.tagline}</p>

                <div className="grid sm:grid-cols-2 gap-x-10">
                  <div>
                    {colA.map(it => (
                      <MegaItem key={it.path} {...it} />
                    ))}
                  </div>
                  <div>
                    {colB.map(it => (
                      <MegaItem key={it.path} {...it} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-10">
                <div className="nav-mega-featured h-full min-h-[240px] flex flex-col justify-end p-6 rounded-2xl relative overflow-hidden">
                  <div className="nav-mega-featured-glow" />
                  <p className="relative text-lg font-display font-bold text-white leading-snug mb-2">
                    {featured.title}
                  </p>
                  <p className="relative text-sm text-ink-muted leading-relaxed mb-6">{featured.desc}</p>
                  <Link href={active.hub} className="relative btn-primary w-fit text-sm">
                    {featured.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function buildMegaGroups(nav: {
  services: NavItem[];
  solutions: NavItem[];
  industries: NavItem[];
}): MegaGroup[] {
  return [
    {
      key: 'services',
      label: 'Services',
      hub: '/services/',
      tagline: 'Seven specialist development disciplines under one iGaming roof.',
      items: nav.services,
    },
    {
      key: 'solutions',
      label: 'Solutions',
      hub: '/solutions/',
      tagline: 'Packaged engagements shaped for how operators actually buy.',
      items: nav.solutions,
    },
    {
      key: 'industries',
      label: 'Industries',
      hub: '/industries/',
      tagline: 'Six verticals — each with different regulatory and technical pressure.',
      items: nav.industries,
    },
  ];
}
