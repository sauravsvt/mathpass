'use client';

import { useState } from 'react';
import { getStrengthLabel } from '@/lib/generator';

export default function PasswordTester() {
  const [testPassword, setTestPassword] = useState('');

  const calculateEntropy = (pw: string) => {
    let charset = 0;
    if (/[a-z]/.test(pw)) charset += 26;
    if (/[A-Z]/.test(pw)) charset += 26;
    if (/[0-9]/.test(pw)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) charset += 32;
    if (charset === 0 || pw.length === 0) return 0;
    return Math.round(pw.length * Math.log2(charset));
  };

  const entropy = calculateEntropy(testPassword);

  const calculateStrengthScore = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 15;
    if (pw.length >= 12) score += 20;
    if (pw.length >= 16) score += 20;
    if (/[A-Z]/.test(pw)) score += 12;
    if (/[a-z]/.test(pw)) score += 12;
    if (/[0-9]/.test(pw)) score += 12;
    if (/[^a-zA-Z0-9]/.test(pw)) score += 15;
    const unique = new Set(pw).size;
    score += Math.min(10, Math.floor(unique / 2));
    if (/(.)\1{2,}/.test(pw)) score -= 15;
    return Math.max(0, Math.min(100, score));
  };

  const score = calculateStrengthScore(testPassword);
  const { label, color, bg } = getStrengthLabel(score);

  const getCrackTime = (ent: number) => {
    if (ent === 0) return 'Enter a password to test';
    const guessesPerSec = 1e11;
    const seconds = Math.pow(2, ent) / (2 * guessesPerSec);
    if (seconds < 1) return 'Instant (< 1 millisecond)';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    const years = seconds / 31536000;
    if (years < 1000) return `${Math.round(years)} years`;
    if (years < 1000000) return `${Math.round(years / 1000)} thousand years`;
    if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
    return 'Billions of centuries (Uncrackable)';
  };

  return (
    <section id="tester" className="max-w-4xl mx-auto px-4 py-16">
      <div className="glass-card rounded-3xl p-6 md:p-10 border border-white/10 relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs mb-3">
            🧪 Live Password Auditor
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Test Your Current <span className="gradient-text">Password Strength</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            Curious if your existing password holds up against modern supercomputers? Type it below to measure entropy and crack resistance (tested entirely offline in your browser).
          </p>
        </div>

        {/* Input Field */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Type any password to test its strength..."
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/15 text-white font-mono text-base md:text-lg focus:outline-none focus:border-primary-500 transition-colors placeholder-gray-600"
            />
            {testPassword && (
              <button
                type="button"
                onClick={() => setTestPassword('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {testPassword ? (
          <div className="space-y-4 animate-fade-in">
            {/* Meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="text-gray-400">Security Score</span>
                <span className="font-bold px-2 py-0.5 rounded-full" style={{ color, backgroundColor: bg }}>
                  {label} ({score}/100)
                </span>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${score}%`, backgroundColor: color }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[11px] text-gray-400">Length</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {testPassword.length} characters
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[11px] text-gray-400">Information Entropy</div>
                <div className="text-lg font-bold font-mono text-accent-300 mt-0.5">
                  {entropy} bits
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[11px] text-gray-400">Brute Force Crack Time</div>
                <div className="text-sm font-semibold text-primary-300 mt-1">
                  🛡️ {getCrackTime(entropy)}
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="flex flex-wrap gap-2 text-xs pt-2">
              <span className={`px-2.5 py-1 rounded-lg border ${/[A-Z]/.test(testPassword) ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                {/[A-Z]/.test(testPassword) ? '✓' : '✗'} Uppercase (A-Z)
              </span>
              <span className={`px-2.5 py-1 rounded-lg border ${/[a-z]/.test(testPassword) ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                {/[a-z]/.test(testPassword) ? '✓' : '✗'} Lowercase (a-z)
              </span>
              <span className={`px-2.5 py-1 rounded-lg border ${/[0-9]/.test(testPassword) ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                {/[0-9]/.test(testPassword) ? '✓' : '✗'} Numbers (0-9)
              </span>
              <span className={`px-2.5 py-1 rounded-lg border ${/[^a-zA-Z0-9]/.test(testPassword) ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                {/[^a-zA-Z0-9]/.test(testPassword) ? '✓' : '✗'} Symbols (!@#$)
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-500">
            🔒 Tested in local client memory · Zero packets leave your browser
          </div>
        )}
      </div>
    </section>
  );
}
