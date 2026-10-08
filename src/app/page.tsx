'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PasswordGenerator from '@/components/PasswordGenerator';
import HowItWorks from '@/components/HowItWorks';
import ConstantsTable from '@/components/ConstantsTable';
import PasswordTester from '@/components/PasswordTester';
import Features from '@/components/Features';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { ACCOUNTING, DEFAULT_CONSTANT } from '@/lib/accounting';
import { PI_ANCHOR } from '@/lib/catalog';

export default function Home() {
  const [selectedConstantId, setSelectedConstantId] = useState<string | undefined>(undefined);

  return (
    <main className="min-h-screen">
      <Header />

      <section className="max-w-4xl mx-auto px-4 pt-12 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/30 text-primary-300 text-xs md:text-sm mb-6">
          Client-side · Open source · Strength you can verify
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Passphrases That Are{' '}
          <span className="gradient-text">Hard to Guess</span>,{' '}
          <br className="hidden sm:inline" />
          Easy to <span className="gradient-text">Remember</span>
        </h1>

        <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
          Hang random dictionary words on{' '}
          <span className="text-primary-300 font-bold">π</span>,{' '}
          <span className="text-primary-300 font-bold">e</span>,{' '}
          <span className="text-primary-300 font-bold">φ</span>, and{' '}
          <span className="text-primary-300 font-bold">c</span>. Each result shows the exact generated strength in bits, assuming an attacker has this source.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400 mb-6">
          <span>Generated in your browser</span>
          <span className="text-gray-600">·</span>
          <span>Free and open source</span>
          <span className="text-gray-600">·</span>
          <span>Web Crypto randomness</span>
          <span className="text-gray-600">·</span>
          <span>Optional personal text</span>
        </div>

        <div className="overflow-hidden py-2.5 px-4 bg-white/5 rounded-2xl border border-white/5 max-w-3xl mx-auto mb-4">
          <div className="flex gap-6 animate-marquee whitespace-nowrap text-gray-400 text-xs font-mono">
            <span>π = 3.14159...</span>
            <span>·</span>
            <span>h = 6.62607×10⁻³⁴</span>
            <span>·</span>
            <span>c = 299,792,458 m/s</span>
            <span>·</span>
            <span>e = 2.71828...</span>
            <span>·</span>
            <span>φ = 1.61803...</span>
            <span>·</span>
            <span>√2 = 1.41421...</span>
            <span>·</span>
            <span>τ = 6.28318...</span>
          </div>
        </div>
      </section>

      <AdBanner slot="top-leaderboard" format="leaderboard" />

      <PasswordGenerator initialConstantId={selectedConstantId} />

      <section id="anti-cracker" className="max-w-4xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-primary-500/30 bg-black/40">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-300 text-xs font-bold mb-3 uppercase tracking-wider">
              Kerckhoffs&apos;s principle
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              The <span className="gradient-text">public-source</span> threat model
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
              What if an attacker knows you used MathPass? The bit count already assumes they have this code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20">
              <div className="text-red-400 font-bold mb-2">Short public templates</div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                If a generator only fills a small set of puns and digit slices, an attacker who reads the source can enumerate that list. A 14-bit space is not a 100-bit space.
              </p>
              <div className="text-[11px] font-mono text-red-300 bg-black/40 p-2.5 rounded-lg border border-red-500/20">
                Old MathPass templates: about 5–20 generated bits
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-green-950/20 border border-green-500/20">
              <div className="text-green-400 font-bold mb-2">Uniform random words</div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Each word is drawn uniformly from {ACCOUNTING.wordlistSize.toLocaleString()} entries (6^5), adding {ACCOUNTING.wordBits.toFixed(2)} bits that knowing the source cannot remove.
              </p>
              <div className="text-[11px] font-mono text-green-300 bg-black/40 p-2.5 rounded-lg border border-green-500/20">
                Random-constant sample: 2^{DEFAULT_CONSTANT.everyday.bits.toFixed(1)} Everyday · 2^{DEFAULT_CONSTANT.strong.bits.toFixed(1)} Strong · 2^{DEFAULT_CONSTANT.master.bits.toFixed(1)} Master
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-bold text-white mb-4">What each layer actually does</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-primary-300 font-bold text-sm mb-1">The constant</div>
                <p className="text-gray-400 leading-relaxed">
                  You pick a math constant. It is a memory cue worth at most about 5.5 bits if chosen at random, and 0 bits if pinned.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-accent-300 font-bold text-sm mb-1">Personal text</div>
                <p className="text-gray-400 leading-relaxed">
                  Optional extra text, appended exactly. It adds strength only if it is hard to guess. Pet names and foods are in cracking dictionaries, so we estimate the bits and show you.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-green-300 font-bold text-sm mb-1">Web Crypto words</div>
                <p className="text-gray-400 leading-relaxed">
                  MathPass uses the browser&apos;s cryptographically secure random number generator with rejection sampling. There is no Math.random fallback.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <span>The bit count already assumes the attacker has read every line of this source.</span>
              <a href="#generator" className="font-bold text-primary-300 hover:text-primary-200">
                Try it now →
              </a>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <PasswordTester />
      <AdBanner slot="mid-content" format="horizontal" />
      <ConstantsTable onSelectConstant={setSelectedConstantId} />
      <Features />

      <article className="max-w-4xl mx-auto px-4 py-16 text-gray-300">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10">
          <header className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-primary-400 font-bold">How the numbers work</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
              The math of <span className="gradient-text">MathPass bits</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto mt-2">
              Generated strength is log2 of the number of equally likely passwords this generator could have produced.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">A cue you already know</h3>
              <p className="text-gray-400 mb-3">
                A string like <code className="text-accent-300 bg-black/40 px-1 py-0.5 rounded">x7$kQ9!mP</code> is dense and easy to mistype. A constant you already know gives the passphrase a handle.
              </p>
              <p className="text-gray-400">
                The constant is public. Security comes from the words drawn uniformly at random after it, not from hiding π.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Entropy without theater</h3>
              <p className="text-gray-400 mb-3">
                Charset-size times length measures a different generator: a uniform random string of that shape. MathPass is not that generator.
              </p>
              <p className="text-gray-400">
                A default Strong passphrase (constant plus {DEFAULT_CONSTANT.strong.words} words) has {DEFAULT_CONSTANT.strong.bits.toFixed(1)} generated bits. Times depend on the site&apos;s hash and rate limits.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Puns are cues, not secrets</h3>
              <p className="text-gray-400 mb-3">
                Pun style still uses random words. A string like <code className="text-primary-300 bg-black/40 px-1 py-0.5 rounded">CutiePi3.1416-harbor-velvet-cactus-otter</code> is strong because of the four words, not because of the joke. The Constant-style cue is {PI_ANCHOR}.
              </p>
              <p className="text-gray-400">The recall line repeats the exact password, piece by piece.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Local generation</h3>
              <p className="text-gray-400 mb-3">
                MathPass does not POST your passphrase to a backend. Sampling uses <code className="text-white font-mono">crypto.getRandomValues</code>.
              </p>
              <p className="text-gray-400">
                Ads and analytics load only when their environment flags are set. The privacy claim is local generation, not a silent browser.
              </p>
            </div>
          </div>
        </div>
      </article>

      <AdBanner slot="bottom-content" format="horizontal" />
      <FAQ />

      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="glass-card rounded-3xl p-8 md:p-14 border border-white/10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Ready for a passphrase you can actually recall?</h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto text-sm md:text-base">
            Free, open-source, and generated in the browser. Strength shown in bits, not adjectives.
          </p>
          <a
            href="#generator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base md:text-lg bg-primary-600 hover:bg-primary-500 text-white"
          >
            Generate a passphrase →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
