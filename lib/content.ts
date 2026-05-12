import contentJson from '@/data/content.json';

export interface PageContent {
  path: string;
  layer: string;
  seo_title: string;
  meta_description: string;
  h1: string;
  canonical: string;
  body_html: string;
  toc: { text: string; href: string }[];
  faqs: { q: string; a: string }[];
  schemas: any[];
  intent: string;
  funnel: string;
  cluster: string;
  primary_kw: string;
  secondary_kws: string[];
  outbound_links: { to: string; anchor: string; reason?: string }[];
  inbound_from: string[];
  audit_missing: string[];
}

const CONTENT = contentJson as Record<string, PageContent>;

export function getAllPaths(): string[] {
  return Object.keys(CONTENT);
}

export function getPage(path: string): PageContent | null {
  // normalize: ensure leading slash, ensure trailing slash
  let p = path.startsWith('/') ? path : '/' + path;
  if (!p.endsWith('/')) p += '/';
  return CONTENT[p] || null;
}

export function getByLayer(layer: string): PageContent[] {
  return Object.values(CONTENT).filter(p => p.layer === layer);
}

export function getByCluster(cluster: string): PageContent[] {
  return Object.values(CONTENT).filter(p => p.cluster === cluster);
}

// nav data
export const NAV = {
  services: [
    { path: '/casino-app-development/', label: 'Casino App Development' },
    { path: '/slot-game-development/', label: 'Slot Game Development' },
    { path: '/sports-exchange-development/', label: 'Sports Exchange' },
    { path: '/igaming-api-integration/', label: 'API Integration' },
    { path: '/igaming-ui-ux-design/', label: 'UI/UX Design' },
    { path: '/igaming-maintenance-debugging/', label: 'Maintenance & Debugging' },
    { path: '/igaming-mvp-consultancy/', label: 'MVP Consultancy' },
  ],
  solutions: [
    { path: '/solutions/white-label-casino-solutions/', label: 'White-Label Casino' },
    { path: '/solutions/crypto-casino-solutions/', label: 'Crypto Casino' },
    { path: '/solutions/real-money-gaming-solutions/', label: 'Real Money Gaming' },
    { path: '/solutions/custom-igaming-software-solutions/', label: 'Custom Software' },
    { path: '/solutions/enterprise-igaming-platforms/', label: 'Enterprise Platforms' },
    { path: '/solutions/igaming-startup-solutions/', label: 'Startup Solutions' },
  ],
  industries: [
    { path: '/industries/online-casino-operators/', label: 'Casino Operators' },
    { path: '/industries/sports-betting-operators/', label: 'Sports Betting' },
    { path: '/industries/igaming-startups/', label: 'iGaming Startups' },
    { path: '/industries/crypto-gambling-platforms/', label: 'Crypto Gambling' },
    { path: '/industries/game-aggregators/', label: 'Game Aggregators' },
    { path: '/industries/investors-enterprises/', label: 'Investors & Enterprises' },
  ],
  geo: [
    { path: '/igaming-development-company-usa/', label: 'USA' },
    { path: '/igaming-development-company-uk/', label: 'UK' },
    { path: '/igaming-development-company-canada/', label: 'Canada' },
    { path: '/igaming-development-company-australia/', label: 'Australia' },
    { path: '/igaming-development-company-malta/', label: 'Malta' },
    { path: '/igaming-development-company-germany/', label: 'Germany' },
    { path: '/igaming-development-company-india/', label: 'India' },
    { path: '/igaming-development-company-uae/', label: 'UAE' },
  ],
};
