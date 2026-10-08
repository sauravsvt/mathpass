import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mathpass.voxonlabs.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MathPass — Memorable Passwords from Mathematical & Physical Constants',
    template: '%s | MathPass',
  },
  description:
    'Generate unbreakable, memorable passwords using π, e, φ, Planck’s h, Speed of Light c, and 40+ mathematical & physical constants. Zero-knowledge, hardware CSPRNG, and dual-layer security.',
  keywords: [
    'password generator',
    'mathematical constants',
    'planck constant password',
    'physics constant password generator',
    'speed of light password',
    'memorable password generator',
    'strong password generator',
    'pi password generator',
    'euler number password',
    'golden ratio password',
    'math password generator',
    'secure memorable password',
    'password entropy calculator',
    'quantum physics password',
    'math puns password',
    'pythagoras password',
    'easy to remember strong passwords',
    'password strength checker',
    'free password generator online',
    'client side password generator',
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
    title: 'MathPass — Memorable Passwords from Mathematical & Physical Constants',
    description:
      'Generate unbreakable, memorable passwords using π, e, φ, Planck’s h, and 40+ constants. Client-side, hardware CSPRNG, and dual-layer defense.',
    images: [
      {
        url: '/favicon.svg',
        width: 1200,
        height: 630,
        alt: 'MathPass - Constant Powered Password Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MathPass — Memorable Passwords from Constants',
    description:
      'Generate strong passwords using π, e, φ, Planck’s h, and 40+ constants. Dual-layer security.',
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

        {/* Google Analytics 4 (activates when NEXT_PUBLIC_GA_ID is provided) */}
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

        {/* Google AdSense Script (activates when NEXT_PUBLIC_ADSENSE_ID is provided) */}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Structured Data: WebApplication & HowTo */}
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
                  description:
                    'Generate strong, memorable passwords using mathematical and physical constants like π, e, φ, Planck’s h, and more.',
                  applicationCategory: 'SecurityApplication',
                  operatingSystem: 'Any',
                  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  featureList: [
                    'Password generation using 40+ mathematical and physical constants',
                    '6 cognitive strategies including Smart Mnemonic and Math Puns',
                    'Client-side generation with zero server data storage',
                    'Interactive password strength and entropy tester',
                    'Comprehensive constants encyclopedia',
                    'One-click clipboard copying',
                  ],
                },
                {
                  '@type': 'HowTo',
                  name: 'How to Generate a Memorable Strong Password with Mathematical Constants',
                  description:
                    'A step-by-step guide to generating secure passwords that are easy to remember using constants.',
                  step: [
                    {
                      '@type': 'HowToStep',
                      name: 'Select a Password Style',
                      text: 'Choose between Smart Mnemonic, Punster (Math Puns), Formula, Classic, Mashup, or Leetspeak.',
                    },
                    {
                      '@type': 'HowToStep',
                      name: 'Specify Length and Count',
                      text: 'Pick your preferred length (12 to 32 characters) and number of passwords to generate.',
                    },
                    {
                      '@type': 'HowToStep',
                      name: 'Generate and Copy',
                      text: 'Click Generate to produce fortified passwords with their memory story and copy with one click.',
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
        {/* Real-time Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
