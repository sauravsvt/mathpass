import raw from './data/eff-large-wordlist.json';

export const DICE_SIDES = 6;
export const DICE_COUNT = 5;
export const WORDLIST: readonly string[] = raw as string[];
export const WORDLIST_SIZE = WORDLIST.length;
export const WORDLIST_BITS = Math.log2(WORDLIST_SIZE);
/** SHA-256 of src/lib/data/eff-large-wordlist.json as stored on disk. */
export const WORDLIST_SHA256 = '2356977166b8de4eb3ab328fe584c54f83d6dd7ddd1fb18d56ecb8b801a28556';

export const WORD_INDEX: ReadonlyMap<string, number> = new Map(WORDLIST.map((word, index) => [word, index]));
export const WORD_MAX_LENGTH = WORDLIST.reduce((max, word) => Math.max(max, word.length), 0);

export function indexToDice(index: number): string {
  if (!Number.isInteger(index) || index < 0 || index >= WORDLIST_SIZE) {
    throw new Error(`word index out of range: ${index}`);
  }
  const dice: number[] = [];
  let n = index;
  for (let i = 0; i < DICE_COUNT; i++) {
    dice.unshift((n % DICE_SIDES) + 1);
    n = Math.floor(n / DICE_SIDES);
  }
  return dice.join('');
}

export function diceToIndex(dice: string): number {
  if (!/^[1-6]{5}$/.test(dice)) {
    throw new Error(`dice code must be 5 rolls of 1-6, got ${dice}`);
  }
  let n = 0;
  for (const ch of dice) {
    n = n * DICE_SIDES + (Number(ch) - 1);
  }
  return n;
}

export function longestWordPrefix(text: string, words: ReadonlyMap<string, number> = WORD_INDEX): string | null {
  const upper = Math.min(WORD_MAX_LENGTH, text.length);
  for (let len = upper; len >= 1; len--) {
    const slice = text.slice(0, len);
    if (words.has(slice)) return slice;
  }
  return null;
}
