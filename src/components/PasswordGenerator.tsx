'use client';

import { useCallback, useEffect, useState } from 'react';
import { typicalSample } from '@/lib/accounting';
import { catalogUserInputs } from '@/lib/catalog';
import { MATH_CONSTANTS } from '@/lib/constants';
import {
  generatePassword,
  getStrategyDescription,
  LENGTH_CAP_STRENGTH_NOTE,
  lengthCapFailureMessage,
  SEPARATORS,
  type GeneratedPassword,
  type GenerateResult,
  type Part,
  type Preset,
  type Strategy,
} from '@/lib/generator';
import { labelForPreset, loadGuessEstimator, secretCredit } from '@/lib/strength';

interface PasswordGeneratorProps {
  initialConstantId?: string;
}

const strategies: { value: Strategy; label: string; tag: string }[] = [
  { value: 'constant', label: 'Constant', tag: 'Default' },
  { value: 'pun', label: 'Pun', tag: 'Memorable cue' },
  { value: 'formula', label: 'Formula', tag: 'Identity cue' },
];

const presetLabels: { value: Preset; label: string }[] = [
  { value: 'everyday', label: 'Everyday' },
  { value: 'strong', label: 'Strong' },
  { value: 'master', label: 'Master' },
];

const partClass: Record<GeneratedPassword['parts'][number]['kind'], string> = {
  anchor: 'text-primary-300 font-bold',
  separator: 'text-cyan-400',
  word: 'text-gray-200',
  secret: 'text-accent-300 font-bold',
};

function isGenerated(result: GenerateResult): result is GeneratedPassword {
  return result.ok;
}

function groupInt(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function ledgerLabel(part: Part): string {
  if (part.kind === 'word' && part.dice) return `${part.text} · dice ${part.dice}`;
  if (part.kind === 'separator') return `separator ${part.text}`;
  return part.text;
}

export default function PasswordGenerator({ initialConstantId }: PasswordGeneratorProps) {
  const [preset, setPreset] = useState<Preset>('strong');
  const [strategy, setStrategy] = useState<Strategy>('constant');
  const [count, setCount] = useState(1);
  const [constantId, setConstantId] = useState<string>(initialConstantId || '');
  const [personalSecret, setPersonalSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [separator, setSeparator] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [passwords, setPasswords] = useState<GeneratedPassword[]>([]);
  const [failure, setFailure] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
  const [secretBits, setSecretBits] = useState(0);

  useEffect(() => {
    void loadGuessEstimator();
  }, []);

  useEffect(() => {
    if (initialConstantId) {
      setConstantId(initialConstantId);
    }
  }, [initialConstantId]);

  useEffect(() => {
    if (personalSecret.trim() === '') {
      setSecretBits(0);
      return;
    }
    try {
      setSecretBits(secretCredit(personalSecret, catalogUserInputs()));
    } catch {
      setSecretBits(0);
    }
  }, [personalSecret]);

  const handleGenerate = useCallback(() => {
    setCopiedIndex(null);
    const max = maxLength ? Number(maxLength) : undefined;
    const results = generatePassword({
      preset,
      strategy,
      count,
      constantId: constantId || undefined,
      personalSecret: personalSecret.trim() === '' ? undefined : personalSecret,
      separator: separator || undefined,
      maxLength: max && Number.isFinite(max) ? max : undefined,
    });
    const ok = results.filter(isGenerated);
    const misses = results.filter((result): result is Extract<GenerateResult, { ok: false }> => !result.ok);
    setPasswords(ok);
    if (misses.length && max) {
      setFailure(
        lengthCapFailureMessage({
          maxLength: max,
          shortestLength: Math.min(...misses.map((miss) => miss.shortestLength)),
          hitCount: ok.length,
          missCount: misses.length,
        }),
      );
    } else {
      setFailure(null);
    }
    const vis: Record<number, boolean> = {};
    ok.forEach((_, i) => {
      vis[i] = true;
    });
    setVisiblePasswords(vis);
  }, [preset, strategy, count, constantId, personalSecret, separator, maxLength]);

  useEffect(() => {
    handleGenerate();
    // Typing personal text should not reshuffle the words.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, strategy, count, constantId, separator, maxLength]);

  const handleCopy = useCallback(async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const secretHasSpaces = personalSecret.includes(' ');
  const secretHasNonAscii = /[^\x20-\x7E]/.test(personalSecret);
  const parsedMaxLength = maxLength ? Number(maxLength) : undefined;
  const lengthCapOn = Boolean(parsedMaxLength && Number.isFinite(parsedMaxLength) && parsedMaxLength > 0);
  const presetStats = presetLabels.map((item) => ({
    ...item,
    sample: typicalSample({
      strategy,
      preset: item.value,
      pinnedId: constantId || undefined,
      separatorPinned: Boolean(separator),
    }),
  }));

  return (
    <section id="generator" className="max-w-4xl mx-auto px-4 py-6 scroll-mt-20">
      <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Passphrase generator</h2>
            <p className="text-xs text-gray-400 mt-1">
              Bits are <code className="text-primary-300">log2</code> of this generator&apos;s choices, assuming the source is public.
              Randomness from <code className="text-primary-300">crypto.getRandomValues</code>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 font-medium">Constant:</label>
            <select
              value={constantId}
              onChange={(e) => setConstantId(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500"
            >
              <option value="" className="bg-gray-900 text-white">
                Any constant (random)
              </option>
              {MATH_CONSTANTS.map((c) => (
                <option key={c.id} value={c.id} className="bg-gray-900 text-white">
                  {c.symbol} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="text-xs sm:text-sm font-bold text-white">Personal text (optional)</label>
            <span className="text-[11px] text-gray-400">
              {personalSecret.trim()
                ? `Estimated +${secretBits.toFixed(1)} bits, not included above`
                : 'Counted separately, and only if it is hard to guess'}
            </span>
          </div>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              placeholder="Optional extra text appended exactly as typed"
              value={personalSecret}
              onChange={(e) => setPersonalSecret(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="w-full px-4 py-2.5 pr-24 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                className="text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-white/10"
              >
                {showSecret ? 'Hide' : 'Show'}
              </button>
              {personalSecret && (
                <button
                  type="button"
                  onClick={() => setPersonalSecret('')}
                  className="text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-white/10"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
            Pet names and foods are in cracking dictionaries. Every password made with this text shares it: if one leaks, it stops helping the others. The generated words stay strong on their own.
          </p>
          {(secretHasSpaces || secretHasNonAscii) && (
            <p className="text-[11px] text-amber-300 mt-2">
              Spaces and non-ASCII characters are kept exactly. Some sites reject them.
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-200 mb-2.5">Anchor style</label>
          <div className="grid grid-cols-3 gap-2">
            {strategies.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStrategy(s.value)}
                className={`p-2.5 rounded-xl text-left transition-all duration-200 ${
                  strategy === s.value
                    ? 'bg-primary-600/30 border-primary-500/60 border text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono w-fit mb-1">
                  {s.tag}
                </div>
                <span className="text-xs font-semibold leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 bg-white/5 p-2 rounded-lg border border-white/5">
            {getStrategyDescription(strategy)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Strength</label>
            <div className="flex gap-2">
              {presetStats.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPreset(item.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    preset === item.value
                      ? 'bg-primary-600/40 border-primary-500/60 border text-white'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div>{item.label}</div>
                  <div className="text-[10px] font-normal text-gray-400">
                    {item.sample.bits.toFixed(1)} bits · {item.sample.words} words
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Word count is chosen so this configuration meets the preset floor. Pinning a constant removes its bits and may add a word.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">How many passwords?</label>
            <div className="flex gap-2 mb-3">
              {[1, 3, 5, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    count === n
                      ? 'bg-primary-600/40 border-primary-500/60 border text-white'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {count > 1 && (
              <p className="text-[11px] text-amber-200/80">
                Generating {count} and picking one favorite reduces the search space by about {Math.log2(count).toFixed(1)} bits. Use each sample on a different account, or generate one.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Separator</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
            >
              <option value="" className="bg-gray-900">
                Random ({SEPARATORS.length} choices, {Math.log2(SEPARATORS.length).toFixed(0)} bits)
              </option>
              {SEPARATORS.map((item) => (
                <option key={item} value={item} className="bg-gray-900">
                  {item} (chosen, 0 bits)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Site max length (optional)</label>
            <input
              type="number"
              min={8}
              placeholder="Leave empty: never truncate"
              value={maxLength}
              onChange={(e) => setMaxLength(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-primary-600 hover:bg-primary-500 text-white"
        >
          Generate {count} passphrase{count === 1 ? '' : 's'}
        </button>
        {failure && <p className="text-xs text-amber-300 mt-3">{failure}</p>}
      </div>

      {passwords.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-white">Generated passphrases</h3>
            <button
              onClick={handleGenerate}
              className="text-xs text-primary-400 hover:text-primary-300 font-semibold"
            >
              Generate again
            </button>
          </div>

          {passwords.map((pw, index) => {
            const style = labelForPreset(pw.preset);
            const isVisible = visiblePasswords[index] !== false;
            const meter = Math.min(100, (pw.generatedBits / 80) * 100);

            return (
              <div
                key={`${pw.password}-${index}`}
                className={`glass-card rounded-2xl p-5 md:p-6 border border-white/10 ${
                  copiedIndex === index ? 'ring-2 ring-green-500/60' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="password-display text-lg md:text-xl font-bold tracking-wide break-all font-mono select-all">
                    {isVisible ? (
                      pw.parts.map((part, partIndex) => (
                        <span key={`${part.kind}-${partIndex}`} className={partClass[part.kind]}>
                          {part.text}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 tracking-widest">{'•'.repeat(pw.password.length)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setVisiblePasswords((prev) => ({ ...prev, [index]: !isVisible }))}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 text-xs border border-white/10"
                    >
                      {isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(pw.password, index)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold ${
                        copiedIndex === index ? 'bg-green-500/30 text-green-300' : 'bg-primary-600 text-white'
                      }`}
                    >
                      {copiedIndex === index ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                  <div>
                    {lengthCapOn ? (
                      <p className="text-amber-300 font-medium leading-relaxed">{LENGTH_CAP_STRENGTH_NOTE}</p>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-gray-400 font-medium">Generated keyspace</span>
                          <span className="font-bold px-2 py-0.5 rounded-full" style={{ color: style.color, backgroundColor: style.bg }}>
                            {style.label} · {pw.generatedBits.toFixed(1)} bits
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${meter}%`, backgroundColor: style.color }} />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-gray-300">
                    {lengthCapOn ? (
                      <p>Crack times from the uncapped keyspace are omitted while a length cap is on.</p>
                    ) : (
                      <>
                        <div>Fast hash (~10^12/s): {pw.crackTimeFast}</div>
                        <div>Slow hash (~10^5/s): {pw.crackTimeSlow}</div>
                      </>
                    )}
                    {pw.secretBits > 0 && (
                      <div className="text-accent-300 mt-1">
                        Personal text estimated +{pw.secretBits.toFixed(1)} bits, not included above
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
                  <span className="px-2 py-1 rounded-md border bg-white/5 text-gray-300 border-white/10">
                    {pw.password.length} characters
                  </span>
                  <span className="px-2 py-1 rounded-md border bg-white/5 text-gray-300 border-white/10">
                    {pw.wordCount} random words
                  </span>
                  {pw.checklist.hasPersonalSecret && (
                    <span className="px-2 py-1 rounded-md border bg-accent-500/15 text-accent-300 border-accent-500/30">
                      Personal text appended exactly
                    </span>
                  )}
                </div>

                <details className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-3">
                  <summary className="text-xs font-bold text-primary-300 uppercase tracking-wide cursor-pointer">
                    {isVisible
                      ? `Entropy ledger · sample #${groupInt(pw.rank)} of ${groupInt(pw.keyspace)}`
                      : `Entropy ledger · rank hidden · ${groupInt(pw.keyspace)} outputs`}
                  </summary>
                  <p className="text-[11px] text-gray-400 mt-2 mb-3">
                    Rank is the mixed-radix index of this string in the generator&apos;s equally likely outputs. Bits are log2 of each term&apos;s choices.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead className="text-gray-500">
                        <tr>
                          <th className="py-1 pr-2 font-medium">Part</th>
                          <th className="py-1 pr-2 font-medium">Choices</th>
                          <th className="py-1 pr-2 font-medium">Index</th>
                          <th className="py-1 pr-2 font-medium">Bits</th>
                          <th className="py-1 font-medium">Running</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300 font-mono">
                        {pw.parts.reduce<Array<Part & { running: number }>>((rows, part) => {
                          const prev = rows[rows.length - 1]?.running ?? 0;
                          rows.push({ ...part, running: prev + part.bits });
                          return rows;
                        }, []).map((row, rowIndex) => (
                          <tr key={`${row.kind}-${rowIndex}`} className="border-t border-white/5">
                            <td className="py-1 pr-2 break-all">{isVisible ? ledgerLabel(row) : '•'.repeat(Math.max(1, row.text.length))}</td>
                            <td className="py-1 pr-2">{row.choices}</td>
                            <td className="py-1 pr-2">{isVisible ? row.index : '—'}</td>
                            <td className="py-1 pr-2">{row.bits.toFixed(2)}</td>
                            <td className="py-1">{row.running.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-3">
                  <div className="text-xs font-bold text-primary-300 uppercase tracking-wide mb-0.5">How to remember it</div>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed">
                    {isVisible ? pw.mnemonic : 'Hidden with the password. Rank and recall both reconstruct the string.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {pw.constants.map((c) => (
                      <span key={c.id} className="constant-tag px-2 py-0.5 rounded text-white font-mono text-[11px]">
                        {c.symbol} {c.name}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-gray-500">{pw.explanation}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
