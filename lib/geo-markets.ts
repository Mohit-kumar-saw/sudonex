export interface GeoMarket {
  slug: string;
  label: string;
  code: string;
  lat: number;
  lng: number;
  path: string;
}

export const COUNTRY_LABELS: Record<string, string> = {
  usa: 'USA', uk: 'UK', canada: 'Canada', australia: 'Australia', germany: 'Germany',
  netherlands: 'Netherlands', ireland: 'Ireland', malta: 'Malta', india: 'India',
  singapore: 'Singapore', dubai: 'Dubai', uae: 'UAE', 'south-africa': 'South Africa',
  philippines: 'Philippines', sweden: 'Sweden', norway: 'Norway', denmark: 'Denmark',
  spain: 'Spain', italy: 'Italy',
};

export const COUNTRY_CODES: Record<string, string> = {
  usa: 'US', uk: 'UK', canada: 'CA', australia: 'AU', germany: 'DE',
  netherlands: 'NL', ireland: 'IE', malta: 'MT', india: 'IN',
  singapore: 'SG', dubai: 'DX', uae: 'AE', 'south-africa': 'ZA',
  philippines: 'PH', sweden: 'SE', norway: 'NO', denmark: 'DK',
  spain: 'ES', italy: 'IT',
};

/** ISO 3166-1 alpha-2 for flag images (flagcdn.com) */
export const FLAG_ISO: Record<string, string> = {
  usa: 'us', uk: 'gb', canada: 'ca', australia: 'au', germany: 'de',
  netherlands: 'nl', ireland: 'ie', malta: 'mt', india: 'in',
  singapore: 'sg', dubai: 'ae', uae: 'ae', 'south-africa': 'za',
  philippines: 'ph', sweden: 'se', norway: 'no', denmark: 'dk',
  spain: 'es', italy: 'it',
};

export function flagImageUrl(slug: string): string {
  const iso = FLAG_ISO[slug] || 'un';
  return `https://flagcdn.com/w640/${iso}.jpg`;
}

/** Capital / hub coordinates for globe markers */
export const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  usa: { lat: 38.9072, lng: -77.0369 },
  uk: { lat: 51.5074, lng: -0.1278 },
  canada: { lat: 45.4215, lng: -75.6972 },
  australia: { lat: -33.8688, lng: 151.2093 },
  germany: { lat: 52.52, lng: 13.405 },
  netherlands: { lat: 52.3676, lng: 4.9041 },
  ireland: { lat: 53.3498, lng: -6.2603 },
  malta: { lat: 35.8989, lng: 14.5146 },
  india: { lat: 28.6139, lng: 77.209 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  uae: { lat: 24.4539, lng: 54.3773 },
  'south-africa': { lat: -26.2041, lng: 28.0473 },
  philippines: { lat: 14.5995, lng: 120.9842 },
  sweden: { lat: 59.3293, lng: 18.0686 },
  norway: { lat: 59.9139, lng: 10.7522 },
  denmark: { lat: 55.6761, lng: 12.5683 },
  spain: { lat: 40.4168, lng: -3.7038 },
  italy: { lat: 41.9028, lng: 12.4964 },
};

export function coordsToAngles(lat: number, lng: number): { phi: number; theta: number } {
  return {
    phi: lng * (Math.PI / 180) + Math.PI / 2,
    theta: (lat * Math.PI) / 180 * 0.45,
  };
}
