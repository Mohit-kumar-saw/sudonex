export type HeroVisualVariant = 'globe' | 'orbit' | 'network' | 'helix' | 'arcs' | 'wave' | 'contact' | 'about';

export function getHeroVisual(path: string, layer: string): HeroVisualVariant {
  if (path === '/') return 'globe';
  if (path === '/contact/') return 'contact';
  if (path === '/about-us/') return 'about';
  if (layer === 'geo') return 'globe';
  if (layer === 'service' || layer === 'subservice' || layer === 'solution') return 'network';
  if (layer === 'casestudy') return 'arcs';
  if (layer === 'resource') return 'helix';
  if (layer === 'industry') return 'wave';
  return 'orbit';
}
