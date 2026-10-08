'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  generatePassword,
  getStrengthLabel,
  getStrategyDescription,
  type Strategy,
  type GeneratedPassword,
} from '@/lib/generator';
import { MATH_CONSTANTS } from '@/lib/constants';

interface PasswordGeneratorProps {
  initialConstantId?: string;
}

const strategies: { value: Strategy; emoji: string; label: string; tag: string }[] = [
  { value: 'mnemonic', emoji: '🧠', label: 'Smart Mnemonic', tag: 'Dual-Layer' },
  { value: 'punster', emoji: '😄', label: 'Punster (Funny)', tag: 'Humorous' },
  { value: 'formula', emoji: '🧮', label: 'Math Formula', tag: 'Geek Chic' },
  { value: 'classic', emoji: '📐', label: 'Classic Pro', tag: 'Clean' },
  { value: 'mashup', emoji: '🔀', label: 'Constant Mashup', tag: 'Double Tough' },
  { value: 'leetspeak', emoji: '💻', label: 'Hacker Leet', tag: '1337 Style' },
  { value: 'random', emoji: '🎲', label: 'Surprise Me', tag: 'All Mixed' },
];

export default function PasswordGenerator({ initialConstantId }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [strategy, setStrategy] = useState<Strategy>('mnemonic');
  const [count, setCount] = useState(3);
  const [constantId, setConstantId] = useState<string>(initialConstantId || '');
  const [personalAnchor, setPersonalAnchor] = useState<string>('');
  const [passwords, setPasswords] = useState<GeneratedPassword[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setCopiedIndex(null);

    setTimeout(() => {
      const results = generatePassword({
        length,
        strategy,
        count,
        constantId: constantId || undefined,
        personalAnchor: personalAnchor.trim() || undefined,
      });
      setPasswords(results);
      const vis: Record<number, boolean> = {};
      results.forEach((_, i) => {
        vis[i] = true;
      });
      setVisiblePasswords(vis);
      setIsGenerating(false);
    }, 120);
  }, [length, strategy, count, constantId, personalAnchor]);

  // Generate on initial mount
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Update constant when parent changes
  useEffect(() => {
    if (initialConstantId) {
      setConstantId(initialConstantId);
    }
  }, [initialConstantId]);

  const handleCopy = useCallback(async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }, []);

  const toggleVisibility = (index: number) => {
    setVisiblePasswords((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section id="generator" className="max-w-4xl mx-auto px-4 py-6 scroll-mt-20">
      {/* Controls Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header inside generator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <span>⚡</span>
              <span>Instant Generator</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-300 font-mono">
                CSPRNG Active
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Protected by hardware-grade randomness (<code className="text-primary-300">crypto.getRandomValues</code>) &amp; cognitive anchors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 font-medium">Constant:</label>
            <select
              value={constantId}
              onChange={(e) => setConstantId(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500"
            >
              <option value="" className="bg-gray-900 text-white">Any Constant (Random)</option>
              {MATH_CONSTANTS.map((c) => (
                <option key={c.id} value={c.id} className="bg-gray-900 text-white">
                  {c.symbol} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Personal Anchor / Custom Salt Field (Anti-Cracker Feature) */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary-950/30 to-accent-950/30 border border-primary-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>🛡️</span>
              <span>Personal Secret Anchor (Optional Salt)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 font-mono">
                Anti-Cracker Shield
              </span>
            </label>
            <span className="text-[11px] text-gray-400">
              {personalAnchor ? '✓ Dual-Layer Active' : 'Defeats targeted attacks'}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. coffee, pet name, childhood street (adds private unguessable salt)..."
              value={personalAnchor}
              onChange={(e) => setPersonalAnchor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            {personalAnchor && (
              <button
                type="button"
                onClick={() => setPersonalAnchor('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-white/10"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
            💡 <strong>Why this makes you uncrackable:</strong> Even if a hacker knows you used MathPass, they can never guess your private anchor word. MathPass infuses your secret with the constant to shatter all template-cracking dictionaries.
          </p>
        </div>

        {/* Strategy Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-200 mb-2.5">
            Password Style &amp; Memory Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {strategies.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStrategy(s.value)}
                className={`p-2.5 rounded-xl text-left transition-all duration-200 flex flex-col justify-between ${
                  strategy === s.value
                    ? 'bg-primary-600/30 border-primary-500/60 border text-white shadow-lg shadow-primary-500/20 ring-1 ring-primary-500/50'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">{s.emoji}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                    {s.tag}
                  </span>
                </div>
                <span className="text-xs font-semibold leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 bg-white/5 p-2 rounded-lg border border-white/5">
            {getStrategyDescription(strategy)}
          </p>
        </div>

        {/* Quick Length & Count Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Length */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-200">
                Password Length
              </label>
              <span className="text-xl font-bold gradient-text font-mono">
                {length} chars
              </span>
            </div>

            <div className="flex gap-2 mb-3">
              {[
                { val: 12, label: '12 (Fast)' },
                { val: 16, label: '16 (Recommended)' },
                { val: 20, label: '20 (Strong)' },
                { val: 24, label: '24 (Fortress)' },
              ].map((btn) => (
                <button
                  key={btn.val}
                  type="button"
                  onClick={() => setLength(btn.val)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    length === btn.val
                      ? 'bg-primary-500/30 border border-primary-500/50 text-white font-bold'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {btn.val}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500
                [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-500/50
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-125"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1">
              <span>8 chars (Min)</span>
              <span>16 (Enterprise)</span>
              <span>32 chars (Max)</span>
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              How many passwords?
            </label>
            <div className="flex gap-2 mb-4">
              {[1, 3, 5, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    count === n
                      ? 'bg-primary-600/40 border-primary-500/60 border text-white shadow-md'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {n} {n === 1 ? 'password' : 'passwords'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400">
              💡 Generate multiple variations in one click to pick the most memorable story for your accounts.
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300
            bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500
            hover:from-primary-500 hover:to-accent-400
            hover:shadow-2xl hover:shadow-primary-500/30
            active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-3 text-white"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating via CSPRNG...
            </>
          ) : (
            <>
              <span>🎲</span>
              <span>Generate {count} Mathematical Passwords</span>
            </>
          )}
        </button>
      </div>

      {/* Results List */}
      {passwords.length > 0 && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔐</span>
              <span>Your Fortified Passwords</span>
              <span className="text-xs font-normal text-gray-400">({passwords.length} generated)</span>
            </h3>
            <button
              onClick={handleGenerate}
              className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>🔄</span>
              <span>Regenerate All</span>
            </button>
          </div>

          {passwords.map((pw, index) => {
            const { label: strengthLabel, color: strengthColor, bg: strengthBg } = getStrengthLabel(pw.strength);
            const isVisible = visiblePasswords[index] !== false;

            return (
              <div
                key={index}
                className={`glass-card rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-white/20 border border-white/10 ${
                  copiedIndex === index ? 'copy-flash ring-2 ring-green-500/60 bg-green-950/20' : ''
                }`}
              >
                {/* Top Bar: Password String & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="flex-1 min-w-0">
                    <div className="password-display text-lg md:text-2xl font-bold tracking-wide break-all font-mono select-all">
                      {isVisible ? (
                        pw.password.split('').map((char, i) => {
                          let colorClass = 'text-white';
                          if (/[0-9]/.test(char)) colorClass = 'text-amber-400 font-bold';
                          else if (/[!@#$%&*?+=]/.test(char)) colorClass = 'text-cyan-400 font-black';
                          else if (/[A-Z]/.test(char)) colorClass = 'text-primary-300 font-bold';
                          else colorClass = 'text-gray-200';

                          return (
                            <span key={i} className={colorClass}>
                              {char}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-500 tracking-widest font-mono">
                          {'•'.repeat(pw.password.length)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Copy & Hide/Show */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(index)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs border border-white/10 transition-colors"
                      title={isVisible ? 'Hide password' : 'Show password'}
                    >
                      {isVisible ? '👁️ Hide' : '🙈 Show'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(pw.password, index)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        copiedIndex === index
                          ? 'bg-green-500/30 text-green-300 border border-green-500/50 shadow-lg shadow-green-500/20'
                          : 'bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-600/30'
                      }`}
                    >
                      {copiedIndex === index ? (
                        <>
                          <span>✓</span>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <span>📋</span>
                          <span>Copy Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Strength Meter & Crack Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-gray-400 font-medium">Security Strength</span>
                      <span
                        className="font-bold px-2 py-0.5 rounded-full"
                        style={{ color: strengthColor, backgroundColor: strengthBg }}
                      >
                        {strengthLabel} ({pw.strength}%)
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="strength-bar h-full rounded-full"
                        style={{
                          width: `${pw.strength}%`,
                          backgroundColor: strengthColor,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-gray-400 font-medium">Brute Force Crack Resistance</span>
                      <span className="font-semibold text-primary-300">
                        {pw.entropy} bits entropy
                      </span>
                    </div>
                    <div className="font-mono text-gray-300 font-medium">
                      🛡️ {pw.crackTime}
                    </div>
                  </div>
                </div>

                {/* Requirements Checklist Badges */}
                <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
                  <span className={`px-2 py-1 rounded-md border ${pw.checklist.hasUpper ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                    {pw.checklist.hasUpper ? '✓' : '✗'} Uppercase (A-Z)
                  </span>
                  <span className={`px-2 py-1 rounded-md border ${pw.checklist.hasLower ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                    {pw.checklist.hasLower ? '✓' : '✗'} Lowercase (a-z)
                  </span>
                  <span className={`px-2 py-1 rounded-md border ${pw.checklist.hasDigit ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                    {pw.checklist.hasDigit ? '✓' : '✗'} Numbers (0-9)
                  </span>
                  <span className={`px-2 py-1 rounded-md border ${pw.checklist.hasSpecial ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                    {pw.checklist.hasSpecial ? '✓' : '✗'} Symbols (!@#$)
                  </span>
                  <span className={`px-2 py-1 rounded-md border ${pw.checklist.isLongEnough ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>
                    {pw.checklist.isLongEnough ? '✓' : '!'} Length {pw.password.length} chars
                  </span>
                  {pw.checklist.hasPersonalAnchor && (
                    <span className="px-2 py-1 rounded-md border bg-accent-500/15 text-accent-300 border-accent-500/30 font-bold">
                      ⭐ Dual-Layer Secret Infused
                    </span>
                  )}
                </div>

                {/* Mnemonic Story Box (How to remember it!) */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-primary-950/40 to-accent-950/40 border border-primary-500/20 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0">🧠</span>
                    <div>
                      <div className="text-xs font-bold text-primary-300 uppercase tracking-wide mb-0.5">
                        How to Remember It
                      </div>
                      <p className="text-xs text-gray-300 font-medium leading-relaxed">
                        {pw.mnemonic}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Constant Backstory & Math Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500">Based On:</span>
                    {pw.constants.map((c, ci) => (
                      <span key={ci} className="constant-tag px-2 py-0.5 rounded text-white font-mono text-[11px]">
                        {c.symbol} {c.name} ({c.year})
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    💡 {pw.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
