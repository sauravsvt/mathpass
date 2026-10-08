import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import {
  allPublicAnchors,
  constantAnchorText,
  famousDisplay,
  formulaAnchorText,
  noAnchorIsPrefixOfAnother,
  punAnchorText,
  punChoices,
} from './catalog';
import { MATH_CONSTANTS } from './constants';
import { FORMULA_CUE_JOIN } from './cue';
import { DICE_COUNT, DICE_SIDES, diceToIndex, indexToDice, WORDLIST, WORDLIST_SHA256, WORDLIST_SIZE } from './wordlist';

describe('constants catalog', () => {
  it('has unique ASCII letter handles with mixed case', () => {
    const handles = MATH_CONSTANTS.map((c) => c.handle);
    expect(new Set(handles).size).toBe(handles.length);
    for (const handle of handles) {
      expect(handle).toMatch(/^[A-Z][A-Za-z]*$/);
      expect(handle).toMatch(/[a-z]/);
    }
    expect(noAnchorIsPrefixOfAnother(handles)).toBe(true);
  });

  it('stores famous as a prefix of digits', () => {
    for (const constant of MATH_CONSTANTS) {
      expect(constant.digits).toMatch(/^[0-9]+$/);
      expect(constant.famous).toBe(constant.digits.slice(0, constant.famous.length));
      expect(constant.famous.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('builds constant anchors that are unique, prefix-free, and magnitude-correct', () => {
    const anchors = MATH_CONSTANTS.map(constantAnchorText);
    expect(new Set(anchors).size).toBe(anchors.length);
    expect(noAnchorIsPrefixOfAnother(anchors)).toBe(true);
    for (const anchor of anchors) {
      expect(anchor).toMatch(/[A-Z]/);
      expect(anchor).toMatch(/[a-z]/);
      expect(anchor).toMatch(/[0-9]/);
      expect(anchor).toMatch(/^[\x20-\x7E]+$/);
    }
  });

  it('keeps puns unique printable ASCII', () => {
    const puns = MATH_CONSTANTS.flatMap((c) => c.puns);
    expect(new Set(puns).size).toBe(puns.length);
    for (const pun of puns) {
      expect(pun).toMatch(/^[\x20-\x7E]+$/);
    }
  });

  it('builds pun anchors without collisions', () => {
    const anchors = punChoices().map((choice) => punAnchorText(choice.pun, choice.constant));
    expect(new Set(anchors).size).toBe(anchors.length);
  });

  it('keeps every public anchor unique and prefix-free', () => {
    const anchors = allPublicAnchors();
    expect(new Set(anchors).size).toBe(anchors.length);
    expect(noAnchorIsPrefixOfAnother(anchors)).toBe(true);
  });
});

describe('formulas', () => {
  it('joins a magnitude with a colon when the identity has no digit', () => {
    const gas = MATH_CONSTANTS.find((c) => c.id === 'gas_constant')!;
    expect(formulaAnchorText('PV=nRT', gas).includes(FORMULA_CUE_JOIN)).toBe(true);
  });
});

describe('wordlist', () => {
  it('is the official 6^5 EFF long list, including hyphenated words', () => {
    expect(WORDLIST_SIZE).toBe(DICE_SIDES ** DICE_COUNT);
    expect(WORDLIST.length).toBe(WORDLIST_SIZE);
    expect(new Set(WORDLIST).size).toBe(WORDLIST_SIZE);
    expect(WORDLIST).toContain('drop-down');
    expect(WORDLIST).toContain('felt-tip');
    expect(WORDLIST).toContain('t-shirt');
    expect(WORDLIST).toContain('yo-yo');
    for (const word of WORDLIST) {
      expect(word).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    }
  });

  it('maps indices to EFF dice codes', () => {
    expect(indexToDice(0)).toBe('11111');
    expect(WORDLIST[0]).toBe('abacus');
    expect(indexToDice(WORDLIST_SIZE - 1)).toBe('66666');
    expect(WORDLIST[WORDLIST_SIZE - 1]).toBe('zoom');
    expect(diceToIndex('11111')).toBe(0);
    expect(diceToIndex('66666')).toBe(WORDLIST_SIZE - 1);
    expect(diceToIndex(indexToDice(1234))).toBe(1234);
  });

  it('pins the on-disk SHA-256', () => {
    const bytes = readFileSync(join(__dirname, 'data/eff-large-wordlist.json'));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(WORDLIST_SHA256);
  });
});

describe('famousDisplay', () => {
  it('puts a decimal after the first digit of the stored famous slice', () => {
    expect(famousDisplay('31415')).toBe('3.1415');
  });
});
