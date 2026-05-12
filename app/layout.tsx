import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { organizationSchema } from '@/lib/authors';

export const metadata: Metadata = {
  metadataBase: new URL('https://sudonex.com'),
  title: { default: 'Sudonex | iGaming Development Company', template: '%s' },
  description: 'iGaming development built for operators who take compliance seriously. Casino apps, slot games, sports exchanges, MVP-to-scale builds.',
  openGraph: { type: 'website', siteName: 'Sudonex' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context':'https://schema.org','@type':'WebSite',
          name:'Sudonex', url:'https://sudonex.com',
          potentialAction:{ '@type':'SearchAction', target:'https://sudonex.com/?q={query}', 'query-input':'required name=query' }
        }) }} />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
