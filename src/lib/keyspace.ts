export interface RankPart {
  choices: number;
  index: number;
}

export function productOfChoices(parts: readonly RankPart[]): bigint {
  return parts.reduce((product, part) => product * BigInt(Math.max(1, part.choices)), BigInt(1));
}

export function mixedRadixRank(parts: readonly RankPart[]): bigint {
  let rank = BigInt(0);
  for (const part of parts) {
    const radix = BigInt(Math.max(1, part.choices));
    rank = rank * radix + BigInt(part.index);
  }
  return rank;
}

export function mixedRadixUnrank(rank: bigint, radices: readonly number[]): number[] {
  if (rank < BigInt(0)) {
    throw new Error('rank must be >= 0');
  }
  const indices = Array.from({ length: radices.length }, () => 0);
  let remaining = rank;
  for (let i = radices.length - 1; i >= 0; i--) {
    const radix = BigInt(Math.max(1, radices[i]));
    indices[i] = Number(remaining % radix);
    remaining = remaining / radix;
  }
  if (remaining !== BigInt(0)) {
    throw new Error('rank is outside the keyspace');
  }
  return indices;
}
