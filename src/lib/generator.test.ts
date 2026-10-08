import { describe, expect, it } from 'vitest';
import { constantAnchorText } from './catalog';
import { MATH_CONSTANTS, type MathConstant } from './constants';
import {
  generateOne,
  generatePassword,
  LENGTH_CAP_STRENGTH_NOTE,
  lengthCapFailureMessage,
  PRESET_BITS,
  SEPARATORS,
  wordCountFor,
  type Strategy,
} from './generator';
import { mixedRadixUnrank } from './keyspace';
import { ScriptedRng } from './random';
import { WORDLIST, WORDLIST_SIZE } from './wordlist';

function toyConstant(id: string, handle: string, famous: string, puns: string[]): MathConstant {
  return {
    id,
    handle,
    name: handle,
    symbol: handle[0],
    value: famous,
    digits: famous,
    famous,
    description: handle,
    category: 'fundamental',
    funFact: handle,
    puns,
    year: '1',
  };
}

const toyCatalog: MathConstant[] = [
  toyConstant('a', 'Alpha', '11111', ['PunA1']),
  toyConstant('b', 'Beta', '22222', ['PunB2']),
];

describe('wordCountFor', () => {
  it('adds a word when the constant is pinned', () => {
    const unpinned = wordCountFor({
      targetBits: 72,
      anchorChoices: 44,
      separatorChoices: 8,
      wordlistSize: WORDLIST_SIZE,
    });
    const pinned = wordCountFor({
      targetBits: 72,
      anchorChoices: 1,
      separatorChoices: 8,
      wordlistSize: WORDLIST_SIZE,
    });
    expect(pinned).toBeGreaterThan(unpinned);
  });
});

describe('exhaustive toy catalog', () => {
  it('counts distinct outputs as the product of choices', () => {
    const words = ['aa', 'bb'];
    const seps = ['-', '!'];
    const seen = new Set<string>();
    const bits: number[] = [];

    for (let c = 0; c < 2; c++) {
      for (let s = 0; s < 2; s++) {
        for (let w1 = 0; w1 < 2; w1++) {
          for (let w2 = 0; w2 < 2; w2++) {
            const result = generateOne({
              strategy: 'constant',
              catalog: toyCatalog,
              wordlist: words,
              separators: seps,
              wordCount: 2,
              rng: new ScriptedRng([c, s, w1, w2]),
              estimateSecretBits: () => 0,
            });
            expect(result.ok).toBe(true);
            if (result.ok) {
              seen.add(result.password);
              bits.push(result.generatedBits);
              expect(result.password).toBe(result.parts.map((part) => part.text).join(''));
              expect(mixedRadixUnrank(BigInt(result.rank), result.parts.map((part) => part.choices))).toEqual(
                result.parts.map((part) => part.index),
              );
            }
          }
        }
      }
    }

    expect(seen.size).toBe(16);
    for (const value of bits) {
      expect(value).toBeCloseTo(Math.log2(16), 10);
    }
  });
});

describe('generateOne', () => {
  it('joins parts into the password and recall text', () => {
    const strategies: Strategy[] = ['constant', 'pun', 'formula'];
    for (const strategy of strategies) {
      for (const pinned of [undefined, 'pi']) {
        for (const secret of [undefined, 'Fluffy']) {
          const result = generateOne({
            strategy,
            preset: 'strong',
            constantId: pinned,
            personalSecret: secret,
            estimateSecretBits: () => 7,
          });
          expect(result.ok).toBe(true);
          if (!result.ok) continue;
          expect(result.password).toBe(result.parts.map((part) => part.text).join(''));
          const pieces = result.parts.filter((part) => part.kind !== 'separator');
          let cursor = 0;
          for (const piece of pieces) {
            const at = result.mnemonic.indexOf(piece.text, cursor);
            expect(at).toBeGreaterThanOrEqual(0);
            cursor = at + piece.text.length;
          }
          expect(result.mnemonic).toContain(result.password);
        }
      }
    }
  });

  it('appends personal text as typed, except whitespace-only', () => {
    const spaced = ' Fluffy ';
    const withSpaces = generateOne({
      strategy: 'constant',
      constantId: 'pi',
      personalSecret: spaced,
      rng: new ScriptedRng([0, 0, 1, 2, 3]),
      wordCount: 4,
      estimateSecretBits: () => 4,
    });
    expect(withSpaces.ok).toBe(true);
    if (!withSpaces.ok) return;
    expect(withSpaces.password.endsWith(spaced)).toBe(true);
    expect(withSpaces.parts.some((part) => part.kind === 'secret' && part.text === spaced)).toBe(true);

    const blank = generateOne({
      strategy: 'constant',
      constantId: 'pi',
      personalSecret: ' \t  ',
      rng: new ScriptedRng([0, 0, 1, 2, 3]),
      wordCount: 4,
      estimateSecretBits: () => 4,
    });
    expect(blank.ok).toBe(true);
    if (!blank.ok) return;
    expect(blank.parts.some((part) => part.kind === 'secret')).toBe(false);
    expect(blank.checklist.hasPersonalSecret).toBe(false);

    const nfd = 'cafe\u0301';
    const composed = nfd.normalize('NFC');
    expect(composed).not.toBe(nfd);
    const withNfd = generateOne({
      strategy: 'constant',
      constantId: 'pi',
      personalSecret: nfd,
      rng: new ScriptedRng([0, 0, 1, 2, 3]),
      wordCount: 4,
      estimateSecretBits: () => 4,
    });
    expect(withNfd.ok).toBe(true);
    if (!withNfd.ok) return;
    expect(withNfd.password.endsWith(nfd)).toBe(true);
    expect(withNfd.password.endsWith(composed)).toBe(false);
  });

  it('keeps secrets verbatim and out of generated bits', () => {
    for (const secret of ['Rex', 'Fluffy', 'correct horse', 'Biscuit2019']) {
      const without = generateOne({
        strategy: 'constant',
        constantId: 'pi',
        rng: new ScriptedRng([0, 0, 1, 2, 3]),
        wordCount: 4,
        wordlist: WORDLIST,
        estimateSecretBits: () => 0,
      });
      const withSecret = generateOne({
        strategy: 'constant',
        constantId: 'pi',
        personalSecret: secret,
        rng: new ScriptedRng([0, 0, 1, 2, 3]),
        wordCount: 4,
        wordlist: WORDLIST,
        estimateSecretBits: () => 11,
      });
      expect(without.ok && withSecret.ok).toBe(true);
      if (!without.ok || !withSecret.ok) continue;
      expect(withSecret.password.endsWith(secret)).toBe(true);
      expect(withSecret.generatedBits).toBe(without.generatedBits);
      expect(withSecret.secretBits).toBe(11);
      expect(withSecret.parts.slice(0, -2).map((part) => part.text)).toEqual(
        without.parts.map((part) => part.text),
      );
    }
  });

  it('meets character-class site checks', () => {
    const result = generateOne({ strategy: 'constant', preset: 'strong', estimateSecretBits: () => 0 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.checklist.hasUpper).toBe(true);
    expect(result.checklist.hasLower).toBe(true);
    expect(result.checklist.hasDigit).toBe(true);
    expect(result.checklist.hasSpecial).toBe(true);
  });

  it('meets every preset for every style, pinned or not', () => {
    const presets = ['everyday', 'strong', 'master'] as const;
    const strategies: Strategy[] = ['constant', 'pun', 'formula'];
    for (const preset of presets) {
      for (const strategy of strategies) {
        for (const constantId of [undefined, 'pi']) {
          const result = generateOne({
            strategy,
            preset,
            constantId,
            estimateSecretBits: () => 0,
          });
          expect(result.ok).toBe(true);
          if (!result.ok) continue;
          expect(result.generatedBits).toBeGreaterThanOrEqual(PRESET_BITS[preset] - 1e-9);
        }
      }
    }
  });

  it('credits 0 anchor bits when a constant is pinned', () => {
    const result = generateOne({
      strategy: 'constant',
      constantId: 'pi',
      wordCount: 4,
      rng: new ScriptedRng([0, 0, 1, 2, 3]),
      estimateSecretBits: () => 0,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const anchor = result.parts.find((part) => part.kind === 'anchor');
    expect(anchor?.choices).toBe(1);
    expect(result.password.startsWith(constantAnchorText(MATH_CONSTANTS.find((c) => c.id === 'pi')!))).toBe(true);
  });

  it('does not collapse pinned Euler-Mascheroni to one password', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const result = generateOne({
        strategy: 'constant',
        constantId: 'euler_gamma',
        preset: 'strong',
        estimateSecretBits: () => 0,
      });
      expect(result.ok).toBe(true);
      if (result.ok) seen.add(result.password);
    }
    expect(seen.size).toBe(200);
  });

  it('returns ok: false instead of truncating when maxLength is too small', () => {
    const result = generateOne({
      strategy: 'constant',
      preset: 'master',
      maxLength: 8,
      rng: new ScriptedRng([0, 0, 1, 2, 3, 4, 5, 6]),
      wordCount: 6,
      estimateSecretBits: () => 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('max-length');
    expect(result.shortestLength).toBeGreaterThan(8);
    expect(result.bestBits).toBeGreaterThan(0);
  });

  it('does not resample under a length limit to inflate bits', () => {
    const result = generateOne({
      strategy: 'constant',
      preset: 'strong',
      maxLength: 12,
      estimateSecretBits: () => 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('max-length');
  });
});

describe('lengthCapFailureMessage', () => {
  it('does not quote unconstrained bits on a miss', () => {
    const text = lengthCapFailureMessage({
      maxLength: 20,
      shortestLength: 48,
      hitCount: 0,
      missCount: 1,
    });
    expect(text).toContain('48 characters');
    expect(text).toContain('20-character');
    expect(text).toContain(LENGTH_CAP_STRENGTH_NOTE);
    expect(text).not.toMatch(/bits/i);
  });

  it('does not present mixed hits as the full preset', () => {
    const text = lengthCapFailureMessage({
      maxLength: 40,
      shortestLength: 52,
      hitCount: 2,
      missCount: 3,
    });
    expect(text).toMatch(/not the full preset/i);
    expect(text).toContain(LENGTH_CAP_STRENGTH_NOTE);
    expect(text).not.toMatch(/\d+(\.\d+)? generated bits/);
  });
});

describe('generatePassword', () => {
  it('returns independent samples', () => {
    const results = generatePassword({
      strategy: 'constant',
      preset: 'everyday',
      count: 3,
      estimateSecretBits: () => 0,
    });
    expect(results).toHaveLength(3);
    expect(results.every((result) => result.ok)).toBe(true);
  });
});

describe('separators', () => {
  it('has eight separators', () => {
    expect(SEPARATORS).toHaveLength(8);
  });
});
