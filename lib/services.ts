import type { LucideIcon } from 'lucide-react';
import {
  Gamepad2,
  Dice5,
  Trophy,
  Plug,
  Palette,
  Wrench,
  Rocket,
} from 'lucide-react';

export interface ServiceItem {
  path: string;
  title: string;
  /** Short line for grid cards */
  summary: string;
  tag: string;
  headline: string;
  /** Longer line for detail rows */
  description: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
}

export const SERVICES: ServiceItem[] = [
  {
    path: '/casino-app-development/',
    title: 'Casino App Development',
    summary: 'iOS, Android & web casino apps with backend, payments, RNG and licensing.',
    tag: 'Casino Platforms',
    headline: 'Licensed casino apps. Real-money ready.',
    description:
      'Full-stack casino platforms with player accounts, payments, RNG integration, and licensing workflows — built for MGA, UKGC, and multi-jurisdiction operators.',
    image: '/services/casino.jpg',
    imageAlt: 'Casino gaming tables and chips',
    icon: Gamepad2,
  },
  {
    path: '/slot-game-development/',
    title: 'Slot Game Development',
    summary: 'Custom slots, HTML5 / Unity engines, jackpot systems, math & RNG certification.',
    tag: 'Game Studio',
    headline: 'Custom slots. Certified math. Shipped fast.',
    description:
      'HTML5 and Unity slot titles with RTP modelling, volatility tuning, bonus mechanics, and GLI-ready RNG — from concept to aggregator-ready delivery.',
    image: '/services/slots.jpg',
    imageAlt: 'Neon gaming and slot machine atmosphere',
    icon: Dice5,
  },
  {
    path: '/sports-exchange-development/',
    title: 'Sports Exchange',
    summary: 'Peer-to-peer betting platforms, real-time odds, matching engines, liquidity tools.',
    tag: 'Sports Exchange',
    headline: 'Peer-to-peer markets. Zero book risk.',
    description:
      'Exchange architecture with matching engines, live odds feeds, liquidity tools, and commission-based revenue — no traditional book liability.',
    image: '/services/sports.jpg',
    imageAlt: 'Sports stadium and live events',
    icon: Trophy,
  },
  {
    path: '/igaming-api-integration/',
    title: 'API Integration',
    summary: 'Payment gateways, KYC/AML, game aggregators, crypto wallets — connected cleanly.',
    tag: 'Integrations',
    headline: 'Payments, KYC, games — one clean stack.',
    description:
      'Payment gateways, KYC/AML, game aggregators, sports data, and crypto wallets — integrated with observability, security, and operator-grade SLAs.',
    image: '/services/api.jpg',
    imageAlt: 'Developer at desk with code on monitors',
    icon: Plug,
  },
  {
    path: '/igaming-ui-ux-design/',
    title: 'UI / UX Design',
    summary: 'Casino lobby, sportsbook UI, conversion-tuned wireframes & player journeys.',
    tag: 'Product Design',
    headline: 'Lobbies players trust. Flows that convert.',
    description:
      'Casino lobbies, sportsbook layouts, onboarding, and responsible-gaming UX — wireframes and UI tuned for retention and regulatory clarity.',
    image: '/services/design.jpg',
    imageAlt: 'UI wireframes and design sketches',
    icon: Palette,
  },
  {
    path: '/igaming-maintenance-debugging/',
    title: 'Maintenance & Debugging',
    summary: '24/7 monitoring, performance tuning, security audits, bug fixing.',
    tag: 'Managed Ops',
    headline: 'Uptime when handle spikes. Fixes before players notice.',
    description:
      '24/7 monitoring, incident response, performance tuning, security patches, and compliance-ready change management for live platforms.',
    image: '/services/maintenance.jpg',
    imageAlt: 'Server room and infrastructure',
    icon: Wrench,
  },
  {
    path: '/igaming-mvp-consultancy/',
    title: 'MVP Consultancy',
    summary: 'From idea to funded MVP in 8–12 weeks. MVP-to-scale roadmaps for startups.',
    tag: 'Startup Launch',
    headline: 'From pitch deck to funded MVP in weeks.',
    description:
      'Scope, compliance roadmap, and a production-grade MVP in 8–12 weeks — validate with investors and operators before full-scale build.',
    image: '/services/mvp.jpg',
    imageAlt: 'Startup team planning product roadmap',
    icon: Rocket,
  },
];
