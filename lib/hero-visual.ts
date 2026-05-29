export type HeroVisualVariant =
  | 'globe'
  | 'orbit'
  | 'network'
  | 'helix'
  | 'arcs'
  | 'wave'
  | 'contact'
  | 'about'
  | 'services'
  | 'solutions'
  | 'industries'
  | 'work';

export function getHeroVisual(path: string, layer: string): HeroVisualVariant {
  if (path === '/') return 'globe';
  if (path === '/contact/') return 'contact';
  if (path === '/about-us/') return 'about';
  if (path === '/services/' || layer === 'service' || layer === 'subservice') return 'services';
  if (path === '/solutions/' || path.startsWith('/solutions/') || layer === 'solution') return 'solutions';
  if (path === '/industries/' || path.startsWith('/industries/') || layer === 'industry') return 'industries';
  if (path === '/case-studies/' || path.startsWith('/case-studies/') || layer === 'casestudy') return 'work';
  if (layer === 'geo') return 'globe';
  if (layer === 'resource') return 'helix';
  return 'orbit';
}
