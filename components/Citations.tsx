'use client';
import { ExternalLink, BookOpen } from 'lucide-react';

const SOURCES_BY_CLUSTER: Record<string, { title: string; url: string; org: string }[]> = {
  'casino-development': [
    { title: 'UKGC Remote Gambling and Software Technical Standards', url: 'https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/remote-gambling-and-software-technical-standards', org: 'UK Gambling Commission' },
    { title: 'GLI-19 Standards for Interactive Gaming Systems', url: 'https://gaminglabs.com/gli-standards/', org: 'Gaming Laboratories International' },
    { title: 'MGA Player Protection Directive', url: 'https://www.mga.org.mt/', org: 'Malta Gaming Authority' },
  ],
  'slot-games': [
    { title: 'GLI-11 RNG Standards', url: 'https://gaminglabs.com/gli-standards/', org: 'Gaming Laboratories International' },
    { title: 'NIST SP 800-22 Statistical Test Suite', url: 'https://csrc.nist.gov/publications/detail/sp/800-22/rev-1a/final', org: 'NIST' },
    { title: 'eCOGRA Game Fairness Audit Methodology', url: 'https://ecogra.org/', org: 'eCOGRA' },
  ],
  'sports-exchange': [
    { title: 'IBIA Integrity Reporting Standards', url: 'https://ibia.bet/', org: 'International Betting Integrity Association' },
    { title: 'UKGC LCCP Sports Betting Provisions', url: 'https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp', org: 'UK Gambling Commission' },
  ],
  'igaming-api': [
    { title: 'PCI DSS v4.0 Requirements', url: 'https://www.pcisecuritystandards.org/document_library/', org: 'PCI Security Standards Council' },
    { title: 'FATF AML/CFT Guidance for Online Gambling', url: 'https://www.fatf-gafi.org/', org: 'Financial Action Task Force' },
  ],
  'igaming-maintenance': [
    { title: 'OWASP Top 10 for Web Applications', url: 'https://owasp.org/www-project-top-ten/', org: 'OWASP Foundation' },
    { title: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework', org: 'NIST' },
  ],
  'igaming-mvp': [
    { title: 'NJ DGE Internet Gaming Technical Standards', url: 'https://www.nj.gov/oag/ge/', org: 'NJ Division of Gaming Enforcement' },
    { title: 'Ontario AGCO iGaming Registrar Standards', url: 'https://www.agco.ca/lottery-and-gaming/igaming-ontario', org: 'Alcohol & Gaming Commission of Ontario' },
  ],
  'igaming-uiux': [
    { title: 'WCAG 2.2 Accessibility Guidelines', url: 'https://www.w3.org/TR/WCAG22/', org: 'W3C' },
    { title: 'BeGambleAware Responsible Design Patterns', url: 'https://www.begambleaware.org/', org: 'GambleAware' },
  ],
  'geo-targeting': [
    { title: 'Country-specific licensing index (UKGC, MGA, AGCO, DGOJ, ADM, Spelinspektionen)', url: 'https://www.gamblingcommission.gov.uk/', org: 'Various national regulators' },
  ],
};

export default function Citations({ cluster }: { cluster: string }) {
  const sources = SOURCES_BY_CLUSTER[cluster];
  if (!sources?.length) return null;
  return (
    <section aria-label="Sources & references" className="max-w-3xl mx-auto px-6 py-10">
      <div className="glow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-cyan-400" />
          <h2 className="font-display text-lg font-semibold">Sources & references</h2>
        </div>
        <p className="text-xs text-ink-muted mb-4">This article references the following authoritative sources. We update citations as standards evolve.</p>
        <ul className="space-y-2.5">
          {sources.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-brand-300 font-mono text-xs mt-0.5">[{i + 1}]</span>
              <div className="min-w-0">
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-ink hover:text-brand-300 inline-flex items-center gap-1">
                  {s.title} <ExternalLink size={11} className="shrink-0" />
                </a>
                <p className="text-xs text-ink-dim">{s.org}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
