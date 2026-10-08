'use client';

import { useEffect, useState } from 'react';
import { catalogUserInputs } from '@/lib/catalog';
import { decodeMathPass, type DecodeResult } from '@/lib/decode';
import { analyzePassword, loadGuessEstimator, type StrengthReport } from '@/lib/strength';

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

  const parsed = decoded && decoded.ok ? decoded : null;
  const meter = report ? Math.min(100, (report.bits / 80) * 100) : 0;

  return (
    <section id="tester" className="max-w-4xl mx-auto px-4 py-16">
      <div className="glass-card rounded-3xl p-6 md:p-10 border border-white/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs mb-3">
            Guess estimate
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Test a <span className="gradient-text">typed password</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            The headline is a dictionary-aware guess estimate, not a lower bound. If the string looks like a MathPass passphrase, a second panel shows bits only under the assumption of a random cue and a random separator.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Type a password to estimate"
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

        {testPassword && (report || parsed) ? (
          <div className="space-y-4">
            {report && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-gray-400">Guess-dictionary estimate</span>
                  <span className="font-bold px-2 py-0.5 rounded-full" style={{ color: report.color, backgroundColor: report.bg }}>
                    {report.label} ({report.bits.toFixed(1)} bits)
                  </span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${meter}%`, backgroundColor: report.color }} />
                </div>
              </div>
            )}

            {parsed && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-primary-300 uppercase tracking-wide mb-1">
                  If MathPass generated this
                </div>
                <p className="text-[11px] text-gray-400 mb-3">
                  {parsed.secret
                    ? `If MathPass generated the public parts with a random cue and a random separator: ${parsed.generatedBits.toFixed(1)} bits. Personal text is present and is not in that count.`
                    : `If MathPass generated this with a random cue and a random separator, and no personal text: ${parsed.generatedBits.toFixed(1)} bits.`}{' '}
                  {parsed.assumed}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-gray-300">
                  <div>
                    {parsed.wordCount} words · {parsed.strategy} cue
                  </div>
                  <div>Sample #{groupInt(parsed.rank)}</div>
                  <div>of {groupInt(parsed.keyspace)}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[11px] text-gray-400">Length</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">{testPassword.length} characters</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[11px] text-gray-400">Fast hash (~10^12/s)</div>
                <div className="text-sm font-semibold text-primary-300 mt-1">{report?.crackTimeFast ?? '—'}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[11px] text-gray-400">Slow hash (~10^5/s)</div>
                <div className="text-sm font-semibold text-primary-300 mt-1">{report?.crackTimeSlow ?? '—'}</div>
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
