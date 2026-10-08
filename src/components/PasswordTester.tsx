'use client';

import { useEffect, useState } from 'react';
import { catalogUserInputs } from '@/lib/catalog';
import { decodeMathPass, type DecodeResult } from '@/lib/decode';
import {
  analyzePassword,
  expectedCrackTime,
  GUESS_RATES,
  labelForBits,
  loadGuessEstimator,
  type StrengthReport,
} from '@/lib/strength';

function groupInt(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function PasswordTester() {
  const [testPassword, setTestPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [report, setReport] = useState<StrengthReport | null>(null);
  const [decoded, setDecoded] = useState<DecodeResult | null>(null);

  useEffect(() => {
    void loadGuessEstimator().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!testPassword) {
      setReport(null);
      setDecoded(null);
      return;
    }
    setDecoded(decodeMathPass(testPassword));
    if (!ready) {
      setReport(null);
      return;
    }
    setReport(analyzePassword(testPassword, catalogUserInputs()));
  }, [testPassword, ready]);

  const exact = decoded && decoded.ok ? decoded : null;
  const exactStyle = exact ? labelForBits(exact.generatedBits) : null;
  const headlineBits = exact?.generatedBits ?? report?.bits ?? 0;
  const meter = headlineBits ? Math.min(100, (headlineBits / 80) * 100) : 0;
  const fastTime = exact
    ? expectedCrackTime(exact.generatedBits, GUESS_RATES.fastHash)
    : report?.crackTimeFast;
  const slowTime = exact
    ? expectedCrackTime(exact.generatedBits, GUESS_RATES.slowHash)
    : report?.crackTimeSlow;

  return (
    <section id="tester" className="max-w-4xl mx-auto px-4 py-16">
      <div className="glass-card rounded-3xl p-6 md:p-10 border border-white/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs mb-3">
            Decode or estimate
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Test a <span className="gradient-text">typed password</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            If the string is a MathPass passphrase, this shows the exact generated keyspace. Otherwise it is a dictionary-aware guess estimate, not a lower bound.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Type a password to decode or estimate"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="w-full px-5 py-4 pr-28 rounded-2xl bg-black/40 border border-white/15 text-white font-mono text-base md:text-lg focus:outline-none focus:border-primary-500 placeholder-gray-600"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {testPassword && (
                <button
                  type="button"
                  onClick={() => setTestPassword('')}
                  className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {testPassword && (exact || report) ? (
          <div className="space-y-4">
            {exact && exactStyle && (
              <div className="p-4 rounded-2xl bg-green-950/20 border border-green-500/20">
                <div className="text-xs font-bold text-green-300 uppercase tracking-wide mb-1">
                  Decoded MathPass passphrase
                </div>
                <p className="text-[11px] text-gray-400 mb-3">{exact.assumed}</p>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-gray-400">Generated keyspace</span>
                  <span className="font-bold px-2 py-0.5 rounded-full" style={{ color: exactStyle.color, backgroundColor: exactStyle.bg }}>
                    {exactStyle.label} · {exact.generatedBits.toFixed(1)} bits
                  </span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full" style={{ width: `${meter}%`, backgroundColor: exactStyle.color }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-gray-300">
                  <div>
                    {exact.wordCount} words · {exact.strategy} cue
                  </div>
                  <div>Sample #{groupInt(exact.rank)}</div>
                  <div>of {groupInt(exact.keyspace)}</div>
                </div>
              </div>
            )}

            {report && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-gray-400">{exact ? 'Guess-dictionary estimate (different metric)' : 'Estimated strength'}</span>
                  <span className="font-bold px-2 py-0.5 rounded-full" style={{ color: report.color, backgroundColor: report.bg }}>
                    {report.label} ({report.bits.toFixed(1)} bits)
                  </span>
                </div>
                {!exact && (
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${meter}%`, backgroundColor: report.color }} />
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[11px] text-gray-400">Length</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">{testPassword.length} characters</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[11px] text-gray-400">Fast hash (~10^12/s)</div>
                <div className="text-sm font-semibold text-primary-300 mt-1">{fastTime}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[11px] text-gray-400">Slow hash (~10^5/s)</div>
                <div className="text-sm font-semibold text-primary-300 mt-1">{slowTime}</div>
              </div>
            </div>
            {report?.warning && <p className="text-xs text-amber-300">{report.warning}</p>}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-500">
            {ready
              ? 'Runs in this browser. MathPass does not send the typed password to a MathPass server.'
              : 'Loading guess dictionaries…'}
          </div>
        )}
      </div>
    </section>
  );
}
