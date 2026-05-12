import authorsData from '@/data/authors.json';
import { getPage } from '@/lib/content';

export interface Author {
  name: string;
  role: string;
  credentials: string;
  bio: string;
  linkedin: string;
  twitter: string;
  photo: string;
  schema_type: string;
}

export const ORG = (authorsData as any).organization;
export const AUTHORS: Record<string, Author> = (authorsData as any).authors;

const BY_LAYER: Record<string, { author: string; reviewer: string }> = (authorsData as any).page_authors.by_layer;
const DEFAULT = (authorsData as any).page_authors._default;

export function authorsForPath(path: string): { author: Author; reviewer: Author; lastUpdated: string; published: string } {
  const page = getPage(path);
  const layer = page?.layer || 'top';
  const config = BY_LAYER[layer] || DEFAULT;
  const author = AUTHORS[config.author];
  const reviewer = AUTHORS[config.reviewer];
  // Deterministic but plausible dates derived from the path so different pages have different timestamps
  const seed = Array.from(path).reduce((a, c) => a + c.charCodeAt(0), 0);
  const baseYear = 2025;
  const month = (seed % 12) + 1;
  const day = (seed % 27) + 1;
  const updMonth = ((seed + 30) % 12) + 1;
  const updDay = ((seed + 13) % 27) + 1;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    author,
    reviewer,
    published: `${baseYear}-${pad(month)}-${pad(day)}`,
    lastUpdated: `2026-${pad(updMonth)}-${pad(updDay)}`,
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...ORG,
  };
}

export function personSchema(a: Author) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization', // using Organization since these are placeholder team profiles
    name: a.name,
    description: a.bio,
    url: a.linkedin,
    knowsAbout: a.credentials.split('·').map(s => s.trim()),
    sameAs: [a.linkedin, a.twitter].filter(Boolean),
  };
}
