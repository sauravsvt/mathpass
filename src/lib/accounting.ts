import { formulaChoices, punChoices } from './catalog';
import { MATH_CONSTANTS } from './constants';
import { PRESET_BITS, SEPARATORS, wordCountFor, type Preset, type Strategy } from './generator';
import { bitsFromParts } from './strength';
import { WORDLIST_BITS, WORDLIST_SIZE } from './wordlist';

export interface TypicalSample {
  strategy: Strategy;
  preset: Preset;
  words: number;
  bits: number;
  anchorChoices: number;
  separatorChoices: number;
  wordlistSize: number;
}

export function anchorChoicesFor(strategy: Strategy, pinnedId?: string): number {
  if (strategy === 'constant') return pinnedId ? 1 : MATH_CONSTANTS.length;
  if (strategy === 'pun') return punChoices(MATH_CONSTANTS, pinnedId).length;
  return formulaChoices(undefined, MATH_CONSTANTS, pinnedId).length;
}

export function typicalSample(options: {
  strategy?: Strategy;
  preset: Preset;
  pinnedId?: string;
  separatorPinned?: boolean;
}): TypicalSample {
  const strategy = options.strategy ?? 'constant';
  const anchorChoices = anchorChoicesFor(strategy, options.pinnedId);
  const separatorChoices = options.separatorPinned ? 1 : SEPARATORS.length;
  const words = wordCountFor({
    targetBits: PRESET_BITS[options.preset],
    anchorChoices,
    separatorChoices,
    wordlistSize: WORDLIST_SIZE,
  });
  const bits = bitsFromParts([
    { choices: anchorChoices },
    { choices: separatorChoices },
    ...Array.from({ length: words }, () => ({ choices: WORDLIST_SIZE })),
  ]);
  return {
    strategy,
    preset: options.preset,
    words,
    bits,
    anchorChoices,
    separatorChoices,
    wordlistSize: WORDLIST_SIZE,
  };
}

export const DEFAULT_CONSTANT = {
  everyday: typicalSample({ preset: 'everyday' }),
  strong: typicalSample({ preset: 'strong' }),
  master: typicalSample({ preset: 'master' }),
};

export const ACCOUNTING = {
  constants: MATH_CONSTANTS.length,
  separators: SEPARATORS.length,
  wordlistSize: WORDLIST_SIZE,
  wordBits: WORDLIST_BITS,
  diceWord: WORDLIST_SIZE === 6 ** 5,
};
