'use client';

import { useState } from 'react';
import { ACCOUNTING, DEFAULT_CONSTANT } from '@/lib/accounting';
import { PI_ANCHOR } from '@/lib/catalog';

const faqs = [
  {
    question: 'How does MathPass generate passwords?',
    answer:
      `MathPass builds a passphrase from a public math cue (for example ${PI_ANCHOR}), a separator, and words drawn uniformly from the official EFF long wordlist (${ACCOUNTING.wordlistSize.toLocaleString()} words, 6^5). The cue is a memory aid. The random words are the secret. Optional personal text is appended exactly as typed and is not counted in the headline bit number.`,
  },
  {
    question: 'Are these passwords actually secure?',
    answer:
      `At Strong or Master, yes against a realistic guessing budget, with the source assumed public. A default Strong passphrase has ${DEFAULT_CONSTANT.strong.bits.toFixed(1)} generated bits; Master has ${DEFAULT_CONSTANT.master.bits.toFixed(1)}. The constant, pun, or formula is public. Every password shows its exact bit count from the choices the generator made, and an entropy ledger you can recompute.`,
  },
  {
    question: 'Is my password stored or sent anywhere?',
    answer:
      'Generation runs in your browser. MathPass does not send the password or personal text to a MathPass server. If you enable ads or analytics with environment variables, those third-party scripts can run on the page, so this is local generation, not a claim that the browser sends nothing at all.',
  },
  {
    question: 'What makes math-based passwords better than random ones?',
    answer:
      `A ${DEFAULT_CONSTANT.master.words}-word MathPass passphrase (${DEFAULT_CONSTANT.master.bits.toFixed(1)} bits) is in the same range as a fully random 12-character mixed password, and the constant plus words are easier to recall. Per character, random symbols still pack more bits. MathPass trades density for a string you can actually type from memory.`,
  },
  {
    question: 'Which mathematical constants are included?',
    answer:
      `MathPass includes ${ACCOUNTING.constants} constants: Pi, Euler's number, the golden ratio, square roots, Tau, physical constants such as Planck's h and the speed of light, and others. Each has an ASCII handle and a magnitude-correct cue (Euler-Mascheroni is Gamma0.57722, not a shifted 5.77).`,
  },
  {
    question: 'What if someone knows I used MathPass and writes a script to crack it?',
    answer:
      `The displayed bit count already assumes the attacker has this source, the wordlist, and the selected constant. Knowing the scheme does not remove the ${ACCOUNTING.wordBits.toFixed(2)} bits from each uniformly chosen word. A short pet name adds little; a long random extra string adds more, estimated separately and capped.`,
  },
  {
    question: 'Who created MathPass and is it open source?',
    answer:
      'MathPass was created by Saurav Shriwastav. It is free and open-source under the MIT License. Anyone can inspect the generator and recompute the bit formula from the code.',
  },
  {
    question: 'What password styles are available?',
    answer:
      'Three public-cue styles: Constant (handle plus magnitude-correct digits), Pun, and Formula. Formula magnitudes are joined with a colon so PV=nRT:8.3145 is not a false equation. All three then add the same uniformly random words. Classic, mashup, and leetspeak were removed because they were short public templates, not extra entropy.',
  },
  {
    question: 'How long should my password be?',
    answer:
      `Pick a strength preset. MathPass chooses the number of words so Everyday is at least 60 generated bits, Strong at least 72, and Master at least 80. A typical unpinned sample is ${DEFAULT_CONSTANT.everyday.words}/${DEFAULT_CONSTANT.strong.words}/${DEFAULT_CONSTANT.master.words} words. Length follows the pattern; the generator never truncates.`,
  },
  {
    question: 'Can I use MathPass for all my accounts?',
    answer:
      'Generate a new passphrase per account. The constant is a memory cue, not a secret. Reusing optional personal text across accounts means one leak exposes that text everywhere you used it.',
  },
  {
    question: 'Is MathPass free to use?',
    answer:
      'Yes. No account is required. Ads and analytics stay off unless you set their environment variables.',
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
        How the generator actually works, including the threat model
      </p>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="glass-card rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-white/5"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-sm md:text-base">{faq.question}</span>
              <span className={`text-primary-400 flex-shrink-0 ${openIndex === index ? 'rotate-45' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div className={`overflow-hidden ${openIndex === index ? 'max-h-[32rem] pb-5' : 'max-h-0'}`}>
              <p className="px-5 text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

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
