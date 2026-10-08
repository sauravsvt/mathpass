'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'How does MathPass generate passwords?',
    answer: 'MathPass uses famous mathematical constants like π (Pi), e (Euler\'s number), φ (Golden Ratio), and 20+ others as the foundation for your passwords. It combines constant names, their decimal digits, special characters, and clever math puns to create passwords that are both strong AND memorable. Think "Pi_R8@3.14!" — it\'s a pirate pun using Pi\'s digits!',
  },
  {
    question: 'Are these passwords actually secure?',
    answer: 'Yes! While mathematical constants are publicly known, MathPass passwords combine multiple elements: constant names (uppercase/lowercase), specific digit sequences from the constants, special characters, and creative transformations like puns and leetspeak. The resulting passwords have high entropy (50-100+ bits) and satisfy all standard password requirements. The mathematical constant provides the memorability — the mixing provides the security.',
  },
  {
    question: 'Is my password stored or sent anywhere?',
    answer: 'Absolutely not. All password generation happens entirely in your browser using JavaScript. No data is ever sent to any server. You can even use MathPass offline! Your passwords never leave your device.',
  },
  {
    question: 'What makes math-based passwords better than random ones?',
    answer: 'Random passwords like "x7$kQ9!mP" are strong but impossible to remember. MathPass passwords like "Phi_nd_Gold@1618!" are equally strong but meaningful — you can remember that the Golden Ratio (φ = 1.618...) is the basis. Mathematical constants give you a mental framework to recall your password without writing it down.',
  },
  {
    question: 'Which mathematical constants are included?',
    answer: 'MathPass includes 35+ famous constants: Pi (π), Euler\'s number (e), Golden Ratio (φ), Square roots of 2, 3, and 5, Tau (τ), Silver Ratio, Natural logarithm of 2, Euler-Mascheroni constant (γ), Apéry\'s constant, Catalan\'s constant, Feigenbaum constant, Conway\'s constant, Omega constant, Plastic Ratio, Ramanujan\'s constant, Basel ζ(2), Delian constant, Erdős–Borwein, and more. Each has unique puns, facts, and formulas.',
  },
  {
    question: 'What if someone knows I used MathPass and writes a script to crack it?',
    answer: 'This is the classic Kerckhoffs\'s Principle dilemma. Simple generators that only fill static templates can indeed be cracked if the attacker targets the tool\'s templates. MathPass solves this through its Dual-Layer Architecture engineered by Saurav Shriwastav: (1) You can input an optional "Personal Secret Anchor" (private salt like a childhood pet or favorite food) that no automated tool can predict, and (2) all permutations, slice offsets, and delimiters are randomized via hardware CSPRNG (crypto.getRandomValues). Even if an attacker reads the MathPass source code on GitHub, the resulting search space remains astronomically uncrackable (over 2^80 to 2^120 combinations).',
  },
  {
    question: 'Who created MathPass and is it open source?',
    answer: 'MathPass was architected and created by Saurav Shriwastav. It is 100% free and open-source under the MIT License. Anyone can inspect the code, verify the client-side cryptographic isolation, and contribute on GitHub.',
  },
  {
    question: 'What password strategies are available?',
    answer: 'MathPass offers 6 strategies: Smart Mnemonic (constant + cognitive word + personal secret), Punster (math puns like "Pi_R8"), Formula (real equations like "e^(iPi)+1=0"), Classic Pro (clean name + digits), Mashup (combining two constants), and Leetspeak (hacker-style text). You can also use "Surprise Me" to get a random mix!',
  },
  {
    question: 'How long should my password be?',
    answer: 'We recommend at least 12 characters for standard accounts and 16+ for sensitive accounts (banking, email, password vaults). MathPass lets you choose between 8-32 characters. Each additional character multiplies the search space exponentially.',
  },
  {
    question: 'Can I use MathPass for all my accounts?',
    answer: 'Yes! In fact, the ideal practice is to assign different constants to different domains: Pi for your personal email, Euler for banking, the Golden Ratio for work accounts, and Pythagoras for developer tools. You will easily remember which constant belongs to which service while maintaining unique, uncrackable credentials across the web.',
  },
  {
    question: 'Is MathPass free to use?',
    answer: 'Yes, MathPass is completely free, forever. No accounts, no sign-ups, no subscriptions, and zero tracking. Generate as many passwords as you want.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-2">
        Frequently Asked <span className="gradient-text">Questions</span>
      </h2>
      <p className="text-gray-400 text-center mb-10">
        Everything you need to know about mathematical password generation
      </p>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="glass-card rounded-xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-sm md:text-base">{faq.question}</span>
              <span
                className={`text-primary-400 transition-transform duration-300 flex-shrink-0 ${
                  openIndex === index ? 'rotate-45' : ''
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
              }`}
            >
              <p className="px-5 text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
