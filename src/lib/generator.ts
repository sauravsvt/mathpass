import {
  catalogUserInputs,
  constantAnchorText,
  formulaAnchorText,
  formulaChoices,
  punAnchorText,
  punChoices,
} from './catalog';
import { MATH_CONSTANTS, type MathConstant } from './constants';
import { FORMULA_TOKENS, type FormulaToken } from './formulas';
import { mixedRadixRank, productOfChoices } from './keyspace';
import { cryptoRng, type Rng } from './random';
import { bitsFromParts, expectedCrackTime, GUESS_RATES, labelForBits, secretCredit } from './strength';
import { indexToDice, WORDLIST, WORDLIST_SIZE } from './wordlist';

export type Strategy = 'constant' | 'pun' | 'formula';
export type Preset = 'everyday' | 'strong' | 'master';
export type PartKind = 'anchor' | 'separator' | 'word' | 'secret';

export const PRESET_BITS: Record<Preset, number> = {
  everyday: 60,
  strong: 72,
  master: 80,
};

export const SEPARATORS = ['-', '_', '+', '=', '!', '#', '@', '*'] as const;
export const MIN_WORDS = 4;

export interface Part {
  kind: PartKind;
  text: string;
  choices: number;
  index: number;
  bits: number;
  dice?: string;
}

export interface PasswordChecklist {
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  hasPersonalSecret: boolean;
}

export interface GeneratedPassword {
  ok: true;
  password: string;
  parts: Part[];
  generatedBits: number;
  secretBits: number;
  constants: MathConstant[];
  explanation: string;
  mnemonic: string;
  strategy: Strategy;
  preset: Preset;
  wordCount: number;
  keyspace: string;
  rank: string;
  crackTimeFast: string;
  crackTimeSlow: string;
  checklist: PasswordChecklist;
}

export interface GenerateFailure {
  ok: false;
  reason: 'max-length';
  bestBits: number;
  shortestLength: number;
}

export type GenerateResult = GeneratedPassword | GenerateFailure;

export interface GeneratorOptions {
  preset?: Preset;
  strategy: Strategy;
  count?: number;
  constantId?: string;
  personalSecret?: string;
  separator?: string;
  maxLength?: number;
  rng?: Rng;
  catalog?: readonly MathConstant[];
  wordlist?: readonly string[];
  separators?: readonly string[];
  formulas?: readonly FormulaToken[];
  wordCount?: number;
  estimateSecretBits?: (secret: string) => number;
}

function makePart(kind: PartKind, text: string, choices: number, index: number, dice?: string): Part {
  const safeChoices = Math.max(1, choices);
  return {
    kind,
    text,
    choices: safeChoices,
    index,
    bits: safeChoices <= 1 ? 0 : Math.log2(safeChoices),
    dice,
  };
}

export function wordCountFor(options: {
  targetBits: number;
  anchorChoices: number;
  separatorChoices: number;
  wordlistSize: number;
  minWords?: number;
}): number {
  const minWords = options.minWords ?? MIN_WORDS;
  const anchorBits = Math.log2(Math.max(1, options.anchorChoices));
  const separatorBits = Math.log2(Math.max(1, options.separatorChoices));
  const wordBits = Math.log2(options.wordlistSize);
  const needed = Math.ceil((options.targetBits - anchorBits - separatorBits) / wordBits);
  return Math.max(minWords, needed);
}

function checklistFor(password: string, hasPersonalSecret: boolean): PasswordChecklist {
  return {
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    hasPersonalSecret,
  };
}

function recallFromParts(parts: Part[], password: string): string {
  const pieces = parts.filter((part) => part.kind !== 'separator').map((part) => part.text);
  const separator = parts.find((part) => part.kind === 'separator')?.text ?? '';
  return `Type this exactly: ${password}. Pieces in order: ${pieces.join(', ')}. Joined by "${separator}".`;
}

function normalizeSecret(secret: string): string {
  return secret.normalize('NFC').trim();
}

export function generateOne(options: GeneratorOptions): GenerateResult {
  const preset = options.preset ?? 'strong';
  const rng = options.rng ?? cryptoRng;
  const catalog = options.catalog ?? MATH_CONSTANTS;
  const wordlist = options.wordlist ?? WORDLIST;
  const separators = options.separators ?? SEPARATORS;
  const formulas = options.formulas ?? FORMULA_TOKENS;
  const pinnedSeparator = options.separator;
  const secret = options.personalSecret ? normalizeSecret(options.personalSecret) : '';
  const estimateSecret =
    options.estimateSecretBits ??
    ((value: string) => {
      try {
        return secretCredit(value, catalogUserInputs(catalog));
      } catch {
        return 0;
      }
    });

  const pinnedConstant = options.constantId
    ? catalog.find((constant) => constant.id === options.constantId)
    : undefined;
  if (options.constantId && !pinnedConstant) {
    throw new Error(`Unknown constant: ${options.constantId}`);
  }

  if (pinnedSeparator && !separators.includes(pinnedSeparator)) {
    throw new Error(`Unsupported separator: ${pinnedSeparator}`);
  }

  let anchorText: string;
  let anchorChoices: number;
  let anchorIndex: number;
  let constants: MathConstant[];
  let explanation: string;

  if (options.strategy === 'constant') {
    if (pinnedConstant) {
      anchorChoices = 1;
      anchorIndex = 0;
      anchorText = constantAnchorText(pinnedConstant);
      constants = [pinnedConstant];
    } else {
      anchorChoices = catalog.length;
      anchorIndex = rng.index(catalog.length);
      const constant = catalog[anchorIndex];
      anchorText = constantAnchorText(constant);
      constants = [constant];
    }
    explanation = `Public cue ${anchorText} from ${constants[0].name} (${constants[0].symbol}). ${constants[0].funFact}`;
  } else if (options.strategy === 'pun') {
    const puns = punChoices(catalog, options.constantId);
    anchorIndex = rng.index(puns.length);
    const chosen = puns[anchorIndex];
    anchorChoices = puns.length;
    anchorText = punAnchorText(chosen.pun, chosen.constant);
    constants = [chosen.constant];
    explanation = `Public pun cue ${anchorText} for ${chosen.constant.name}. The pun is not a secret.`;
  } else {
    const formulaList = formulaChoices(formulas, catalog, options.constantId);
    anchorIndex = rng.index(formulaList.length);
    const chosen = formulaList[anchorIndex];
    anchorChoices = formulaList.length;
    anchorText = formulaAnchorText(chosen.formula.token, chosen.constant);
    constants = [chosen.constant];
    explanation = `Public formula cue ${anchorText}: ${chosen.formula.desc}. The identity is not a secret.`;
  }

  const separatorChoices = pinnedSeparator ? 1 : separators.length;
  const separatorIndex = pinnedSeparator ? 0 : rng.index(separators.length);
  const separator = pinnedSeparator ?? separators[separatorIndex];
  const wordCount =
    options.wordCount ??
    wordCountFor({
      targetBits: PRESET_BITS[preset],
      anchorChoices,
      separatorChoices,
      wordlistSize: wordlist.length,
    });

  const parts: Part[] = [
    makePart('anchor', anchorText, anchorChoices, anchorIndex),
    makePart('separator', separator, separatorChoices, separatorIndex),
  ];

  const diceable = wordlist.length === WORDLIST_SIZE && wordlist === WORDLIST;

  for (let i = 0; i < wordCount; i++) {
    if (i > 0) {
      parts.push(makePart('separator', separator, 1, 0));
    }
    const wordIndex = rng.index(wordlist.length);
    const word = wordlist[wordIndex];
    parts.push(makePart('word', word, wordlist.length, wordIndex, diceable ? indexToDice(wordIndex) : undefined));
  }

  if (secret) {
    parts.push(makePart('separator', separator, 1, 0));
    parts.push(makePart('secret', secret, 1, 0));
  }

  const password = parts.map((part) => part.text).join('');
  const generatedBits = bitsFromParts(parts);

  if (options.maxLength && password.length > options.maxLength) {
    return {
      ok: false,
      reason: 'max-length',
      bestBits: generatedBits,
      shortestLength: password.length,
    };
  }

  const secretBits = secret ? estimateSecret(secret) : 0;

  return {
    ok: true,
    password,
    parts,
    generatedBits,
    secretBits,
    constants,
    explanation,
    mnemonic: recallFromParts(parts, password),
    strategy: options.strategy,
    preset,
    wordCount,
    keyspace: productOfChoices(parts).toString(),
    rank: mixedRadixRank(parts).toString(),
    crackTimeFast: expectedCrackTime(generatedBits, GUESS_RATES.fastHash),
    crackTimeSlow: expectedCrackTime(generatedBits, GUESS_RATES.slowHash),
    checklist: checklistFor(password, Boolean(secret)),
  };
}

export function generatePassword(options: GeneratorOptions): GenerateResult[] {
  const count = options.count ?? 1;
  const results: GenerateResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(generateOne(options));
  }
  return results;
}

export function getStrategyDescription(strategy: Strategy): string {
  switch (strategy) {
    case 'constant':
      return `A public constant cue such as ${constantAnchorText(MATH_CONSTANTS[0])}, then uniformly random dictionary words. The words are the secret; the constant is a memory aid.`;
    case 'pun':
      return 'A math pun as the public cue, then the same random words. The pun is guessable from this source; strength still comes from the words.';
    case 'formula':
      return 'A short ASCII identity as the public cue, then random words. The formula is public. Magnitudes are joined with a colon so the identity is not a false equation.';
  }
}

export function getStrengthLabel(bits: number) {
  return labelForBits(bits);
}
