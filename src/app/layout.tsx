import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mathpass.voxonlabs.com';

const description =
  'Memorable passphrases anchored on π, e, φ, Planck’s h and 40+ constants, with exact, verifiable entropy. Generated in your browser and open source.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MathPass — Memorable Passphrases from Mathematical Constants',
    template: '%s | MathPass',
  },
  description,
  keywords: [
    'password generator',
    'passphrase generator',
    'mathematical constants',
    'memorable password generator',
    'diceware',
    'eff wordlist',
    'client side password generator',
    'password entropy',
    'voxonlabs',
  ],
  authors: [{ name: 'Saurav Shriwastav', url: 'https://github.com/sauravsvt' }],
  creator: 'Saurav Shriwastav',
  publisher: 'Saurav Shriwastav',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'MathPass · Voxon Labs',
    title: 'MathPass — Memorable Passphrases from Mathematical Constants',
    description,
    images: [
      {
        url: '/favicon.svg',
        width: 1200,
        height: 630,
        alt: 'MathPass passphrase generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MathPass — Memorable Passphrases from Constants',
    description,
    images: ['/favicon.svg'],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'Security & Utility',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}

        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebApplication',
                  '@id': `${siteUrl}/#app`,
                  name: 'MathPass',
                  url: siteUrl,
                  description,
                  applicationCategory: 'SecurityApplication',
                  operatingSystem: 'Any',
                  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  featureList: [
                    'Passphrases anchored on 44 mathematical and physical constants',
                    'Three public-cue styles: Constant, Pun, and Formula',
                    'Generated keyspace shown as log2 of the actual choices',
                    'EFF long wordlist with Web Crypto sampling',
                    'Typed-password guess estimate',
                    'Constants encyclopedia',
                  ],
                },
                {
                  '@type': 'HowTo',
                  name: 'How to generate a memorable passphrase with mathematical constants',
                  description:
                    'Build a passphrase from a public constant cue plus uniformly random dictionary words.',
                  step: [
                    {
                      '@type': 'HowToStep',
                      name: 'Select a cue style',
                      text: 'Choose Constant, Pun, or Formula. The cue is public; the words are the secret.',
                    },
                    {
                      '@type': 'HowToStep',
                      name: 'Pick a strength preset',
                      text: 'Everyday, Strong, or Master. MathPass chooses the word count so the displayed bits meet the floor for the current settings.',
                    },
                    {
                      '@type': 'HowToStep',
                      name: 'Generate and copy',
                      text: 'Copy the exact string shown. The recall line matches the password character for character.',
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
