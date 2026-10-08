import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { createRng, ScriptedRng } from './random';

describe('createRng', () => {
  it('returns values in [0, n) for a range of n', () => {
    const rng = createRng();
    for (const n of [1, 2, 3, 44, 7776]) {
      for (let i = 0; i < 20; i++) {
        const value = rng.index(n);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(n);
        expect(Number.isInteger(value)).toBe(true);
      }
    }
  });

  it('rejects values at or above the unbiased limit', () => {
    const n = 3;
    const range = 0x100000000;
    const limit = Math.floor(range / n) * n;
    let calls = 0;
    const source = {
      getRandomValues(array: Uint32Array) {
        calls += 1;
        array[0] = calls === 1 ? limit : 0;
        return array;
      },
    };
    const rng = createRng(source);
    expect(rng.index(n)).toBe(0);
    expect(calls).toBe(2);
  });

  it('is roughly uniform for a small n', () => {
    const rng = createRng();
    const n = 6;
    const samples = 6000;
    const counts = Array.from({ length: n }, () => 0);
    for (let i = 0; i < samples; i++) {
      counts[rng.index(n)] += 1;
    }
    const expected = samples / n;
    const chiSquare = counts.reduce((sum, count) => sum + (count - expected) ** 2 / expected, 0);
    expect(chiSquare).toBeLessThan(20);
  });

  it('throws when getRandomValues is missing', () => {
    expect(() => createRng({} as Crypto)).toThrow(/getRandomValues is required/);
  });
});

describe('ScriptedRng', () => {
  it('replays values in order', () => {
    const rng = new ScriptedRng([0, 2, 1]);
    expect(rng.index(3)).toBe(0);
    expect(rng.index(4)).toBe(2);
    expect(rng.index(2)).toBe(1);
  });
});

describe('src/lib has no Math.random', () => {
  it('does not mention Math.random outside this assertion', () => {
    const files = [
      'random.ts',
      'generator.ts',
      'strength.ts',
      'catalog.ts',
      'constants.ts',
      'formulas.ts',
      'wordlist.ts',
      'cue.ts',
      'keyspace.ts',
      'decode.ts',
      'accounting.ts',
    ];
    for (const file of files) {
      const text = readFileSync(join(__dirname, file), 'utf8');
      expect(text).not.toMatch(/Math\.random\s*\(/);
    }
  });
});
