import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mathpass.vercel.app'),
  title: {
    default: 'MathPass — Memorable Passwords from Mathematical Constants',
    template: '%s | MathPass',
  },
  description:
    'Generate unbreakable, memorable passwords using π, e, φ, √2, and 35+ mathematical constants. Smart mnemonics, math puns, formulas, and 80+ bits of entropy. 100% free and client-side.',
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
    url: 'https://mathpass.vercel.app',
    siteName: 'MathPass',
    title: 'MathPass — Memorable Passwords from Mathematical Constants',
    description:
      'Generate unbreakable, memorable passwords using π, e, φ, and 35+ math constants. Free, client-side, and cognitively anchored.',
    images: [
      {
        url: '/favicon.svg',
        width: 1200,
        height: 630,
        alt: 'MathPass - Mathematical Constant Password Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MathPass — Memorable Passwords from Math Constants',
    description:
      'Generate strong passwords using π, e, φ, and 35+ constants. Smart mnemonics and high entropy.',
    images: ['/favicon.svg'],
  },
  alternates: {
    canonical: 'https://mathpass.vercel.app',
  },
  category: 'Security & Utility',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

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
                  '@id': 'https://mathpass.vercel.app/#app',
                  name: 'MathPass',
                  url: 'https://mathpass.vercel.app',
                  description:
                    'Generate strong, memorable passwords using mathematical constants like π, e, φ, and more.',
                  applicationCategory: 'SecurityApplication',
                  operatingSystem: 'Any',
                  browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  featureList: [
                    'Password generation using 35+ mathematical constants',
                    '6 cognitive strategies including Smart Mnemonic and Math Puns',
                    'Client-side generation with zero server data storage',
                    'Interactive password strength and entropy tester',
                    'Comprehensive mathematical constants encyclopedia',
                    'One-click clipboard copying',
                  ],
                },
                {
                  '@type': 'HowTo',
                  name: 'How to Generate a Memorable Strong Password with Mathematical Constants',
                  description:
                    'A step-by-step guide to generating secure passwords that are easy to remember using mathematical constants.',
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
      </body>
    </html>
  );
}
