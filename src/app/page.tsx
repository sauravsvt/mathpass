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

export default function Home() {
  const [selectedConstantId, setSelectedConstantId] = useState<string | undefined>(undefined);

  const handleSelectConstant = (constantId: string) => {
    setSelectedConstantId(constantId);
  };

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/30 text-primary-300 text-xs md:text-sm mb-6 shadow-sm">
          <span>🛡️</span>
          <span>Zero-Knowledge Cryptographic Password Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Passwords That Are{' '}
          <span className="gradient-text">Hard to Crack</span>,{' '}
          <br className="hidden sm:inline" />
          Easy to <span className="gradient-text">Remember</span>
        </h1>

        <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
          Stop struggling with forgettable random gibberish. Turn{' '}
          <span className="text-primary-300 font-bold">π</span>,{' '}
          <span className="text-primary-300 font-bold">e</span>,{' '}
          <span className="text-primary-300 font-bold">φ</span>, and{' '}
          <span className="text-primary-300 font-bold">√2</span> into uncrackable passwords with clever math puns, memorable stories, and dual-layer cryptographic protection.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400 mb-6">
          <span className="flex items-center gap-1">✓ 100% Client-Side Privacy</span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1">✓ Free &amp; Open Source</span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1">✓ Hardware CSPRNG Isolation</span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1">✓ Anti-Cracker Salt Protection</span>
        </div>

        {/* Scrolling constants ticker */}
        <div className="overflow-hidden py-2.5 px-4 bg-white/5 rounded-2xl border border-white/5 max-w-3xl mx-auto mb-4">
          <div className="flex gap-6 animate-marquee whitespace-nowrap text-gray-400 text-xs font-mono">
            <span>π = 3.14159...</span>
            <span>•</span>
            <span>h = 6.62607×10⁻³⁴</span>
            <span>•</span>
            <span>c = 299,792,458 m/s</span>
            <span>•</span>
            <span>e = 2.71828...</span>
            <span>•</span>
            <span>φ = 1.61803...</span>
            <span>•</span>
            <span>k_B = 1.3806×10⁻²³</span>
            <span>•</span>
            <span>√2 = 1.41421...</span>
            <span>•</span>
            <span>ħ = 1.05457×10⁻³⁴</span>
            <span>•</span>
            <span>τ = 6.28318...</span>
            <span>•</span>
            <span>G = 6.6743×10⁻¹¹</span>
            <span>•</span>
            <span>N_A = 6.022×10²³</span>
            <span>•</span>
            <span>e^(π√163) = 262537...</span>
            <span>•</span>
            <span>α ≈ 1/137.036</span>
          </div>
        </div>
      </section>

      {/* Top Billboard Ad Slot */}
      <AdBanner slot="top-leaderboard" format="leaderboard" />

      {/* Password Generator Core */}
      <PasswordGenerator initialConstantId={selectedConstantId} />

      {/* Anti-Cracker Defense Section (Marketing & Security Focus) */}
      <section id="anti-cracker" className="max-w-4xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-primary-500/30 relative overflow-hidden bg-gradient-to-br from-primary-950/20 via-black/40 to-accent-950/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-300 text-xs font-bold mb-3 uppercase tracking-wider">
              🛡️ Kerckhoffs&apos;s Principle Defense
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              The <span className="gradient-text">Anti-Cracker Defense</span>
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
              &ldquo;What if an attacker knows I used MathPass? Can they abuse the system to crack my password?&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
            {/* The Trap of Generic Tools */}
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                <span>⚠️</span>
                <span>The Flaw in Ordinary Generators</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                If a generator only swaps words into static templates, an attacker who inspects the tool can test every possible combination in seconds. A 30,000-combination keyspace can be devoured by modern Hashcat clusters in <strong>0.05 seconds</strong>.
              </p>
              <div className="text-[11px] font-mono text-red-300 bg-black/40 p-2.5 rounded-lg border border-red-500/20">
                Targeted Search Space: ~30,000 guesses (CRACKED IN MILLISECONDS)
              </div>
            </div>

            {/* The Dual-Layer Solution */}
            <div className="p-5 rounded-2xl bg-green-950/20 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                <span>🛡️</span>
                <span>MathPass Dual-Layer Architecture</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                MathPass eliminates this vulnerability by infusing <strong>CSPRNG hardware entropy</strong> with an optional <strong>Personal Secret Anchor</strong>.
              </p>
              <div className="text-[11px] font-mono text-green-300 bg-black/40 p-2.5 rounded-lg border border-green-500/20">
                Targeted Search Space: &gt; 2⁸⁰ to 2¹²⁰ combinations (UNCRACKABLE)
              </div>
            </div>
          </div>

          {/* How the Dual-Layer Works */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span>🔬</span>
              <span>How the Dual-Layer Security Model Protects You</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-primary-300 font-bold text-sm mb-1">Layer 1: The Constant</div>
                <p className="text-gray-400 leading-relaxed">
                  You pick a math constant ($\pi$, $e$, $\varphi$). This acts as your <em>cognitive memory anchor</em> so you never forget the base of your password.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-accent-300 font-bold text-sm mb-1">Layer 2: Personal Anchor</div>
                <p className="text-gray-400 leading-relaxed">
                  You add an optional private keyword (pet, coffee, street). This injects <em>private salt</em> that no automated dictionary on earth can anticipate.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-green-300 font-bold text-sm mb-1">Layer 3: Hardware CSPRNG</div>
                <p className="text-gray-400 leading-relaxed">
                  MathPass uses browser <code className="text-white">crypto.getRandomValues</code> to shuffle delimiters, digit offsets, and casing with true hardware randomness.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <span>
                Even if an attacker reads every line of the MathPass source code on GitHub, they still face an impossible cryptographic wall.
              </span>
              <a
                href="#generator"
                className="font-bold text-primary-300 hover:text-primary-200 flex items-center gap-1 flex-shrink-0"
              >
                <span>Try it now</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Live Password Auditor / Tester */}
      <PasswordTester />

      {/* Mid Content Ad Slot */}
      <AdBanner slot="mid-content" format="horizontal" />

      {/* Encyclopedia Table of Mathematical Constants */}
      <ConstantsTable onSelectConstant={handleSelectConstant} />

      {/* Features Grid */}
      <Features />

      {/* In-Depth SEO Editorial Article on Password Security */}
      <article className="max-w-4xl mx-auto px-4 py-16 text-gray-300">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10">
          <header className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-primary-400 font-bold">
              Cryptographic Deep Dive
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
              The Science of <span className="gradient-text">Mathematical Passwords</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto mt-2">
              Why combining irrational numbers with cognitive memory anchors defeats brute-force crackers while freeing you from password frustration.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>🧠</span>
                <span>The Cognitive Anchor Advantage</span>
              </h3>
              <p className="text-gray-400 mb-3">
                Psychological studies show that purely random strings like <code className="text-accent-300 bg-black/40 px-1 py-0.5 rounded">x7$kQ9!mP</code> suffer from exponential memory decay within 48 hours. Humans inevitably write them on sticky notes, reuse them across accounts, or resort to dangerous variations of &ldquo;Password123!&rdquo;.
              </p>
              <p className="text-gray-400">
                MathPass applies <strong className="text-white">cognitive memory anchors</strong>. You already have neural pathways for concepts like Pi (3.14159), the Golden Ratio (1.618), or Pythagoras (1.414). By anchoring your password to a mathematical identity and pairing it with a funny mnemonic or phrase, you leverage existing long-term memory.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>🛡️</span>
                <span>Entropy Without Gibberish</span>
              </h3>
              <p className="text-gray-400 mb-3">
                A common misconception is that passwords must be unpronounceable to be secure. What actually stops dictionary attacks and GPUs is <strong className="text-white">Shannon entropy</strong> (the number of possible permutations a cracker must compute).
              </p>
              <p className="text-gray-400">
                A 16-character MathPass password mixing uppercase letters, lowercase letters, decimals, and symbols delivers over <strong className="text-white">80 to 95 bits of entropy</strong>. At 100 billion guesses per second, testing that search space would require <strong className="text-accent-300">millions of years</strong> of continuous supercomputing power.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>😄</span>
                <span>The Power of Math Puns</span>
              </h3>
              <p className="text-gray-400 mb-3">
                Humor is one of the brain&apos;s strongest recall catalysts. Passwords generated with our Punster mode (like <code className="text-primary-300 bg-black/40 px-1 py-0.5 rounded">Pi_R8@3.1415!</code> for &ldquo;Pirate Pi&rdquo; or <code className="text-primary-300 bg-black/40 px-1 py-0.5 rounded">Phi_nomenal#1618$</code>) bring a smile to your face whenever you log in.
              </p>
              <p className="text-gray-400">
                You never look at a sheet of paper to remember who you are. You simply recall the joke and the math constant, and your fingers type the characters effortlessly.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>🔒</span>
                <span>True Client-Side Isolation</span>
              </h3>
              <p className="text-gray-400 mb-3">
                Many online password generators transmit user requests back to a cloud backend. MathPass is engineered as an entirely <strong className="text-white">client-side application</strong>.
              </p>
              <p className="text-gray-400">
                Every calculation, random number generation, and string permutation occurs locally in your web browser&apos;s sandbox via <code className="text-white font-mono">crypto.getRandomValues</code>. No passwords, tokens, or seeds are ever transmitted across the network or saved in server logs.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Bottom Ad Slot */}
      <AdBanner slot="bottom-content" format="horizontal" />

      {/* FAQ Component with Schema.org markup */}
      <FAQ />

      {/* Bottom Conversion CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="glass-card rounded-3xl p-8 md:p-14 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
            Ready for a Password You Won&apos;t Forget?
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto text-sm md:text-base">
            Free, open-source, and client-side password engineering. Built to survive any brute-force assault.
          </p>
          <a
            href="#generator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base md:text-lg
              bg-gradient-to-r from-primary-600 to-accent-600
              hover:from-primary-500 hover:to-accent-500
              hover:shadow-2xl hover:shadow-primary-500/30
              transition-all duration-300 text-white"
          >
            <span>⚡ Generate Password Now</span>
            <span>→</span>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
