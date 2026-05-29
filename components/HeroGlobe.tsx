'use client';

import dynamic from 'next/dynamic';

const HeroThreeScene = dynamic(() => import('@/components/HeroThreeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[440px] aspect-square mx-auto rounded-full border border-white/10 animate-pulse" />
  ),
});

export default function HeroGlobe() {
  return <HeroThreeScene />;
}
