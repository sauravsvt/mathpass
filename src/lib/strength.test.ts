import { beforeAll, describe, expect, it } from 'vitest';
import { typicalSample } from './accounting';
import { catalogUserInputs } from './catalog';
import {
  analyzePassword,
  bitsFromParts,
  expectedCrackTime,
  GUESS_RATES,
  labelForBits,
  labelForPreset,
  loadGuessEstimator,
  SECRET_CAP_BITS,
  secretCredit,
} from './strength';

beforeAll(async () => {
  await loadGuessEstimator();
});

describe('bitsFromParts', () => {
  it('sums log2 of choice counts and ignores 1-choice parts', () => {
    expect(bitsFromParts([{ choices: 8 }, { choices: 1 }, { choices: 4 }])).toBeCloseTo(5, 10);
  });
});

describe('secretCredit', () => {
  const inputs = catalogUserInputs();

  it('is 0 for an empty secret', () => {
    expect(secretCredit('', inputs)).toBe(0);
  });

  it('rates common secrets as weak', () => {
    expect(secretCredit('password', inputs)).toBeLessThan(5);
  });

  it('gives catalog words little credit', () => {
    expect(secretCredit('Pi', inputs)).toBeLessThanOrEqual(10);
    expect(secretCredit('Euler', inputs)).toBeLessThanOrEqual(10);
  });

  it('never exceeds the cap', () => {
    const noisy = `Qx${'f7k2m9p4'.repeat(8)}`;
    expect(secretCredit(noisy, inputs)).toBeLessThanOrEqual(SECRET_CAP_BITS);
  });
});

describe('analyzePassword', () => {
  it('rates common passwords as weak', () => {
    const common = analyzePassword('Password123!');
    expect(common.bits).toBeLessThan(30);
    const repeats = analyzePassword('aaaaaaaaaaaaaaaa');
    expect(repeats.bits).toBeLessThan(15);
  });
});

describe('expectedCrackTime', () => {
  it('never says uncrackable', () => {
    for (const bits of [0, 20, 40, 60, 80, 128, 256]) {
      const text = expectedCrackTime(bits, GUESS_RATES.fastHash);
      expect(text.toLowerCase()).not.toMatch(/uncrackable|unbreakable|bulletproof/);
    }
  });

  it('places 60 bits at about a week on a fast hash', () => {
    const seconds = 2 ** 59 / GUESS_RATES.fastHash;
    const days = seconds / 86400;
    expect(days).toBeGreaterThan(6);
    expect(days).toBeLessThan(8);
    expect(expectedCrackTime(60, GUESS_RATES.fastHash)).toMatch(/days/);
  });
});

describe('labelForBits', () => {
  it('uses the documented boundaries', () => {
    expect(labelForBits(39).label).toBe('Weak');
    expect(labelForBits(40).label).toBe('Fair');
    expect(labelForBits(59).label).toBe('Fair');
    expect(labelForBits(60).label).toBe('Everyday');
    expect(labelForBits(71).label).toBe('Everyday');
    expect(labelForBits(72).label).toBe('Strong');
    expect(labelForBits(79).label).toBe('Strong');
    expect(labelForBits(80).label).toBe('Master');
  });
});

describe('labelForPreset', () => {
  it('keeps pinned Strong labeled Strong when bits cross 80', () => {
    const pinned = typicalSample({ preset: 'strong', pinnedId: 'pi' });
    expect(pinned.bits).toBeCloseTo(80.5, 1);
    expect(labelForBits(pinned.bits).label).toBe('Master');
    expect(labelForPreset(pinned.preset).label).toBe('Strong');
  });
});
