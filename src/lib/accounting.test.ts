import { describe, expect, it } from 'vitest';
import { ACCOUNTING, DEFAULT_CONSTANT, typicalSample } from './accounting';
import { generateOne, PRESET_BITS } from './generator';

describe('accounting', () => {
  it('uses a 6^5 wordlist', () => {
    expect(ACCOUNTING.wordlistSize).toBe(6 ** 5);
    expect(ACCOUNTING.diceWord).toBe(true);
  });

  it('matches generateOne for an unpinned constant sample', () => {
    for (const preset of ['everyday', 'strong', 'master'] as const) {
      const typical = DEFAULT_CONSTANT[preset];
      const result = generateOne({ strategy: 'constant', preset, estimateSecretBits: () => 0 });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.wordCount).toBe(typical.words);
      expect(result.generatedBits).toBeCloseTo(typical.bits, 10);
      expect(result.generatedBits).toBeGreaterThanOrEqual(PRESET_BITS[preset] - 1e-9);
    }
  });

  it('adds a word when the constant is pinned so the floor still holds', () => {
    const free = typicalSample({ preset: 'strong' });
    const pinned = typicalSample({ preset: 'strong', pinnedId: 'pi' });
    expect(pinned.anchorChoices).toBe(1);
    expect(pinned.words).toBeGreaterThan(free.words);
    expect(pinned.bits).toBeGreaterThanOrEqual(PRESET_BITS.strong - 1e-9);
  });
});
