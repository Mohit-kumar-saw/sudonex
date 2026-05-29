'use client';

import dynamic from 'next/dynamic';
import type { HeroVisualVariant } from '@/lib/hero-visual';

const loading = () => (
  <div className="w-full max-w-[440px] aspect-square mx-auto rounded-full border border-white/10 animate-pulse" />
);

const SCENES: Record<HeroVisualVariant, ReturnType<typeof dynamic>> = {
  globe: dynamic(() => import('@/components/hero-scenes/HeroGlobeScene'), { ssr: false, loading }),
  orbit: dynamic(() => import('@/components/hero-scenes/HeroOrbitScene'), { ssr: false, loading }),
  network: dynamic(() => import('@/components/hero-scenes/HeroNetworkScene'), { ssr: false, loading }),
  helix: dynamic(() => import('@/components/hero-scenes/HeroHelixScene'), { ssr: false, loading }),
  arcs: dynamic(() => import('@/components/hero-scenes/HeroArcsScene'), { ssr: false, loading }),
  wave: dynamic(() => import('@/components/hero-scenes/HeroWaveScene'), { ssr: false, loading }),
  contact: dynamic(() => import('@/components/hero-scenes/HeroContactScene'), { ssr: false, loading }),
  about: dynamic(() => import('@/components/hero-scenes/HeroAboutScene'), { ssr: false, loading }),
  services: dynamic(() => import('@/components/hero-scenes/HeroServicesScene'), { ssr: false, loading }),
  solutions: dynamic(() => import('@/components/hero-scenes/HeroSolutionsScene'), { ssr: false, loading }),
  industries: dynamic(() => import('@/components/hero-scenes/HeroIndustriesScene'), { ssr: false, loading }),
  work: dynamic(() => import('@/components/hero-scenes/HeroWorkScene'), { ssr: false, loading }),
};

export default function HeroVisual({ variant = 'globe' }: { variant?: HeroVisualVariant }) {
  const Scene = SCENES[variant] ?? SCENES.globe;
  return <Scene />;
}
