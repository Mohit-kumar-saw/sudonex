import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPaths, getPage } from '@/lib/content';
import AnimatedHero from '@/components/AnimatedHero';
import ArticleBody from '@/components/ArticleBody';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import FAQAccordion from '@/components/FAQAccordion';
import CTABlock from '@/components/CTABlock';
import GeoStrip from '@/components/GeoStrip';
import AuthorByline from '@/components/AuthorByline';
import TrustBadges from '@/components/TrustBadges';
import Citations from '@/components/Citations';
import EditorialStandards from '@/components/EditorialStandards';
import { authorsForPath, organizationSchema, personSchema } from '@/lib/authors';

export function generateStaticParams() {
  return getAllPaths()
    .filter(p => p !== '/')
    .map(p => ({ slug: p.split('/').filter(Boolean) }));
}

function pathFrom(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return '/';
  return '/' + slug.join('/') + '/';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = pathFrom(slug);
  const page = getPage(path);
  if (!page) return {};
  return {
    title: page.seo_title,
    description: page.meta_description,
    alternates: { canonical: page.canonical || path },
    openGraph: {
      title: page.seo_title,
      description: page.meta_description,
      type: page.layer === 'resource' ? 'article' : 'website',
      url: page.canonical || path,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo_title,
      description: page.meta_description,
    },
    other: {
      'sudonex-cluster': page.cluster || '',
      'sudonex-intent': page.intent || '',
      'sudonex-funnel': page.funnel || '',
    },
  };
}

const HERO_EYEBROW: Record<string, string> = {
  service: 'Service Hub',
  subservice: 'Specialized Service',
  solution: 'Packaged Solution',
  industry: 'Industry',
  resource: 'Resource',
  casestudy: 'Case Study',
  geo: 'Location',
  top: 'Overview',
};

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = pathFrom(slug);
  const page = getPage(path);
  if (!page) notFound();

  const eyebrow = HERO_EYEBROW[page.layer] || 'Sudonex';
  const { author, reviewer, published, lastUpdated } = authorsForPath(page.path);

  // Augment Article schema with author/reviewer + dates if this is content
  const isArticle = ['resource', 'casestudy'].includes(page.layer);
  const enrichedSchemas = page.schemas.map(s => {
    if (s['@type'] === 'Article' || s['@type'] === 'WebPage') {
      return {
        ...s,
        author: { '@type': 'Organization', name: author.name, url: author.linkedin },
        reviewedBy: { '@type': 'Organization', name: reviewer.name, url: reviewer.linkedin },
        datePublished: published,
        dateModified: lastUpdated,
        publisher: { '@type': 'Organization', name: 'Sudonex', logo: { '@type': 'ImageObject', url: 'https://sudonex.com/logo.png' } },
      };
    }
    return s;
  });

  return (
    <>
      {enrichedSchemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema(author)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema(reviewer)) }} />

      <Breadcrumbs path={page.path} h1={page.h1} />

      <AnimatedHero
        eyebrow={eyebrow}
        title={page.h1}
        subtitle={page.meta_description}
        primaryCta={{ label: 'Talk to engineering', href: '/contact/' }}
        secondaryCta={page.layer !== 'resource' ? { label: 'See related work', href: '/case-studies/' } : undefined}
      />

      <AuthorByline author={author} reviewer={reviewer} published={published} lastUpdated={lastUpdated} />
      <TrustBadges />

      <ArticleBody html={page.body_html} toc={page.toc} />

      {isArticle && <Citations cluster={page.cluster} />}

      {page.path === '/about-us/' && <EditorialStandards />}

      {page.outbound_links.length > 0 && <RelatedLinks links={page.outbound_links} />}
      {(page.layer === 'service' || page.layer === 'top') && <GeoStrip />}
      {page.faqs.length > 0 && <FAQAccordion items={page.faqs} />}
      <CTABlock />
    </>
  );
}
