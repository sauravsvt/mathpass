import { describe, expect, it } from 'vitest';
import { mixedRadixRank, mixedRadixUnrank, productOfChoices } from './keyspace';

describe('mixed radix rank', () => {
  it('enumerates a 2x2x2x2 space as 0..15', () => {
    const radices = [2, 2, 2, 2];
    const seen = new Set<string>();
    for (let a = 0; a < 2; a++) {
      for (let b = 0; b < 2; b++) {
        for (let c = 0; c < 2; c++) {
          for (let d = 0; d < 2; d++) {
            const parts = [
              { choices: 2, index: a },
              { choices: 2, index: b },
              { choices: 2, index: c },
              { choices: 2, index: d },
            ];
            const rank = mixedRadixRank(parts);
            expect(rank).toBeGreaterThanOrEqual(BigInt(0));
            expect(rank).toBeLessThan(BigInt(16));
            expect(mixedRadixUnrank(rank, radices)).toEqual([a, b, c, d]);
            seen.add(rank.toString());
          }
        }
      }
    }
    expect(seen.size).toBe(16);
    expect(
      productOfChoices([
        { choices: 2, index: 0 },
        { choices: 2, index: 0 },
        { choices: 2, index: 0 },
        { choices: 2, index: 0 },
      ]),
    ).toBe(BigInt(16));
  });

  it('ignores 1-choice parts in the product', () => {
    expect(productOfChoices([{ choices: 8, index: 1 }, { choices: 1, index: 0 }])).toBe(BigInt(8));
  });
});
