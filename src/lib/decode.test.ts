import { describe, expect, it } from 'vitest';
import { MATH_CONSTANTS } from './constants';
import { decodeMathPass } from './decode';
import { generateOne } from './generator';
import { mixedRadixUnrank } from './keyspace';
import { ScriptedRng } from './random';

describe('decodeMathPass', () => {
  it('recovers parts, rank, and bits of a generated constant passphrase', () => {
    const result = generateOne({
      strategy: 'constant',
      preset: 'strong',
      rng: new ScriptedRng([1, 2, 10, 20, 30, 40, 50]),
      estimateSecretBits: () => 0,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const decoded = decodeMathPass(result.password);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect(decoded.parts.map((part) => part.text).join('')).toBe(result.password);
    expect(decoded.generatedBits).toBeCloseTo(result.generatedBits, 10);
    expect(decoded.rank).toBe(result.rank);
    expect(decoded.keyspace).toBe(result.keyspace);
    expect(decoded.wordCount).toBe(result.wordCount);
    const radices = result.parts.map((part) => part.choices);
    expect(mixedRadixUnrank(BigInt(result.rank), radices)).toEqual(result.parts.map((part) => part.index));
  });

  it('round-trips pun and formula styles', () => {
    for (const strategy of ['pun', 'formula'] as const) {
      const result = generateOne({ strategy, preset: 'everyday', estimateSecretBits: () => 0 });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const decoded = decodeMathPass(result.password);
      expect(decoded.ok, strategy).toBe(true);
      if (!decoded.ok) continue;
      expect(decoded.strategy).toBe(strategy);
      expect(decoded.password).toBe(result.password);
      expect(decoded.rank).toBe(result.rank);
    }
  });

  it('treats a trailing non-word as a secret', () => {
    const result = generateOne({
      strategy: 'constant',
      constantId: 'pi',
      personalSecret: 'Fluffy',
      wordCount: 4,
      rng: new ScriptedRng([0, 1, 2, 3, 4]),
      estimateSecretBits: () => 9,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const decoded = decodeMathPass(result.password);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect(decoded.secret).toBe('Fluffy');
    expect(decoded.assumed).toMatch(/Pinning/);
    expect(decoded.generatedBits).toBeCloseTo(result.generatedBits + Math.log2(MATH_CONSTANTS.length), 10);
  });

  it('rejects a random typed password', () => {
    expect(decodeMathPass('Password123!').ok).toBe(false);
  });
});
