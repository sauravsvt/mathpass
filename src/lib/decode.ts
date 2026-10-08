import {
  constantAnchorText,
  formulaAnchorText,
  formulaChoices,
  punAnchorText,
  punChoices,
} from './catalog';
import { MATH_CONSTANTS, type MathConstant } from './constants';
import { FORMULA_TOKENS, type FormulaToken } from './formulas';
import { mixedRadixRank, productOfChoices } from './keyspace';
import { SEPARATORS, type Part, type Strategy } from './generator';
import { bitsFromParts } from './strength';
import { indexToDice, longestWordPrefix, WORD_INDEX, WORDLIST, WORDLIST_SIZE } from './wordlist';

export interface DecodeHit {
  strategy: Strategy;
  anchor: string;
  anchorIndex: number;
  anchorChoices: number;
  constant: MathConstant;
}

export interface DecodedPassword {
  ok: true;
  password: string;
  strategy: Strategy;
  parts: Part[];
  generatedBits: number;
  wordCount: number;
  keyspace: string;
  rank: string;
  constants: MathConstant[];
  secret?: string;
  assumed: string;
}

export interface DecodeFailure {
  ok: false;
  reason: string;
}

export type DecodeResult = DecodedPassword | DecodeFailure;

function makePart(kind: Part['kind'], text: string, choices: number, index: number, dice?: string): Part {
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

export function publicAnchorIndex(options?: {
  catalog?: readonly MathConstant[];
  formulas?: readonly FormulaToken[];
}): Map<string, DecodeHit> {
  const catalog = options?.catalog ?? MATH_CONSTANTS;
  const formulas = options?.formulas ?? FORMULA_TOKENS;
  const map = new Map<string, DecodeHit>();

  const add = (hit: DecodeHit) => {
    const existing = map.get(hit.anchor);
    if (existing && existing.strategy !== hit.strategy) {
      throw new Error(`Anchor collision: ${hit.anchor}`);
    }
    if (!existing) map.set(hit.anchor, hit);
  };

  catalog.forEach((constant, index) => {
    add({
      strategy: 'constant',
      anchor: constantAnchorText(constant),
      anchorIndex: index,
      anchorChoices: catalog.length,
      constant,
    });
  });

  punChoices(catalog).forEach((choice, index) => {
    add({
      strategy: 'pun',
      anchor: punAnchorText(choice.pun, choice.constant),
      anchorIndex: index,
      anchorChoices: punChoices(catalog).length,
      constant: choice.constant,
    });
  });

  const formulaList = formulaChoices(formulas, catalog);
  formulaList.forEach((choice, index) => {
    add({
      strategy: 'formula',
      anchor: formulaAnchorText(choice.formula.token, choice.constant),
      anchorIndex: index,
      anchorChoices: formulaList.length,
      constant: choice.constant,
    });
  });

  return map;
}

function matchAnchor(password: string, anchors: Map<string, DecodeHit>): DecodeHit | null {
  let best: DecodeHit | null = null;
  Array.from(anchors.entries()).forEach(([anchor, hit]) => {
    if (password.startsWith(anchor) && (!best || anchor.length > best.anchor.length)) {
      best = hit;
    }
  });
  return best;
}

export function decodeMathPass(
  password: string,
  options?: {
    catalog?: readonly MathConstant[];
    formulas?: readonly FormulaToken[];
    wordlist?: readonly string[];
    separators?: readonly string[];
  },
): DecodeResult {
  if (!password) {
    return { ok: false, reason: 'empty' };
  }

  const catalog = options?.catalog ?? MATH_CONSTANTS;
  const formulas = options?.formulas ?? FORMULA_TOKENS;
  const wordlist = options?.wordlist ?? WORDLIST;
  const separators = options?.separators ?? SEPARATORS;
  const words =
    wordlist === WORDLIST
      ? WORD_INDEX
      : new Map(wordlist.map((word, index) => [word, index]));
  const anchors = publicAnchorIndex({ catalog, formulas });
  const hit = matchAnchor(password, anchors);
  if (!hit) {
    return { ok: false, reason: 'no-anchor' };
  }

  const rest = password.slice(hit.anchor.length);
  if (!rest || !separators.includes(rest[0])) {
    return { ok: false, reason: 'no-separator' };
  }
  const separator = rest[0];
  const separatorIndex = separators.indexOf(separator);
  let cursor = rest.slice(1);
  const wordParts: Part[] = [];

  while (cursor) {
    const word = longestWordPrefix(cursor, words);
    const next = word ? cursor[word.length] : undefined;
    if (word && (cursor.length === word.length || next === separator)) {
      const index = words.get(word)!;
      wordParts.push(
        makePart(
          'word',
          word,
          wordlist.length,
          index,
          wordlist.length === WORDLIST_SIZE ? indexToDice(index) : undefined,
        ),
      );
      cursor = cursor.slice(word.length);
      if (!cursor) break;
      if (cursor[0] !== separator) {
        return { ok: false, reason: 'malformed' };
      }
      cursor = cursor.slice(1);
      if (!cursor) {
        return { ok: false, reason: 'trailing-separator' };
      }
      continue;
    }
    break;
  }

  if (wordParts.length < 1) {
    return { ok: false, reason: 'no-words' };
  }

  const secret = cursor || undefined;
  const parts: Part[] = [
    makePart('anchor', hit.anchor, hit.anchorChoices, hit.anchorIndex),
    makePart('separator', separator, separators.length, separatorIndex),
  ];
  wordParts.forEach((word, i) => {
    if (i > 0) parts.push(makePart('separator', separator, 1, 0));
    parts.push(word);
  });
  if (secret) {
    parts.push(makePart('separator', separator, 1, 0));
    parts.push(makePart('secret', secret, 1, 0));
  }

  const generatedBits = bitsFromParts(parts);
  return {
    ok: true,
    password,
    strategy: hit.strategy,
    parts,
    generatedBits,
    wordCount: wordParts.length,
    keyspace: productOfChoices(parts).toString(),
    rank: mixedRadixRank(parts).toString(),
    constants: [hit.constant],
    secret,
    assumed: 'Unpinned cue, random separator, public wordlist. Pinning a constant would remove the cue bits.',
  };
}
