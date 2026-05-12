import type { Metadata } from 'next';
import { getPage } from '@/lib/content';
import AnimatedHero from '@/components/AnimatedHero';
import ServiceCards from '@/components/ServiceCards';
import Stats from '@/components/Stats';
import CTABlock from '@/components/CTABlock';
import IndustriesStrip from '@/components/IndustriesStrip';
import TrustStrip from '@/components/TrustStrip';
import GeoStrip from '@/components/GeoStrip';
import FAQAccordion from '@/components/FAQAccordion';
import AuthorByline from '@/components/AuthorByline';
import { authorsForPath } from '@/lib/authors';

export const metadata: Metadata = {
  title: 'Sudonex | iGaming Development Company — Casino, Slots, Sports Exchange',
  description: 'Sudonex builds licensed-grade iGaming platforms — casino apps, slots, sports exchanges, MVP-to-scale builds. GLI/iTech ready, MGA/UKGC fluent.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const home = getPage('/');
  const { author, reviewer, published, lastUpdated } = authorsForPath('/');
  return (
    <>
      <AnimatedHero
        eyebrow="Trusted by licensed operators worldwide"
        title="iGaming engineering that operators take seriously"
        subtitle="Sudonex builds casino apps, slot games, sports exchanges and the entire compliance + payments stack around them. Built once, built right — by a team fluent in MGA, UKGC, GLI-19 and the math behind real-money games."
        primaryCta={{ label: 'Start your build', href: '/contact/' }}
        secondaryCta={{ label: 'Explore services', href: '/services/' }}
      />
      <Stats />
      <AuthorByline author={author} reviewer={reviewer} published={published} lastUpdated={lastUpdated} />
      <ServiceCards />
      <IndustriesStrip />
      <GeoStrip />
      <TrustStrip />
      {home && home.faqs.length > 0 && <FAQAccordion items={home.faqs} />}
      <CTABlock />
    </>
  );
}
