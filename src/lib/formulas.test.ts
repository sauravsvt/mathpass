import { describe, expect, it } from 'vitest';
import { constantCue, formulaAnchorText, formulaChoices } from './catalog';
import { MATH_CONSTANTS } from './constants';
import { parseValue } from './cue';
import { FORMULA_TOKENS } from './formulas';

function byId(id: string) {
  return MATH_CONSTANTS.find((c) => c.id === id)!;
}

describe('formula residuals', () => {
  it('matches τ = 2π, φ = (1+√5)/2, ζ(2) = π²/6, and Euler’s identity', () => {
    expect(Math.abs(parseValue(byId('tau').value).approx - 2 * Math.PI)).toBeLessThan(1e-12);
    expect(Math.abs(parseValue(byId('phi').value).approx - (1 + Math.sqrt(5)) / 2)).toBeLessThan(1e-12);
    expect(Math.abs(parseValue(byId('basel').value).approx - Math.PI ** 2 / 6)).toBeLessThan(1e-12);
    expect(Math.abs(Math.cos(Math.PI) + 1)).toBeLessThan(1e-15);
  });

  it('matches R = N_A k_B to the catalog gas-constant value', () => {
    const r = parseValue(byId('avogadro').value).approx * parseValue(byId('boltzmann').value).approx;
    expect(Math.abs(r - parseValue(byId('gas_constant').value).approx) / r).toBeLessThan(1e-9);
  });
});

describe('formula anchors', () => {
  it('does not glue a magnitude onto an identity to make a false equation', () => {
    const gas = byId('gas_constant');
    expect(formulaAnchorText('PV=nRT', gas)).toBe('PV=nRT:8.3145');
    expect(formulaAnchorText('PV=nRT', gas)).not.toMatch(/RT\d/);
    const entropy = byId('boltzmann');
    expect(formulaAnchorText('S=k*ln(W)', entropy)).toBe('S=k*ln(W):1.3806e-23');
  });

  it('keeps identities that already contain a digit', () => {
    expect(formulaAnchorText('E=mc^2', byId('speed_of_light'))).toBe('E=mc^2');
    expect(formulaAnchorText('e^(i*Pi)+1=0', byId('e'))).toBe('e^(i*Pi)+1=0');
  });

  it('does not capitalize tokens that contain =, ^, or (', () => {
    expect(formulaAnchorText('a^2+b^2=c^2', byId('sqrt2'))).toBe('a^2+b^2=c^2');
    expect(formulaAnchorText('ln(2)', byId('ln2'))).toBe('ln(2)');
  });

  it('uses a colon in the no-formula fallback, not an equals sign', () => {
    const gamma = byId('euler_gamma');
    const fallback = formulaChoices([], MATH_CONSTANTS, 'euler_gamma');
    expect(fallback).toHaveLength(1);
    expect(fallback[0].formula.token).toBe(`${gamma.handle}:${constantCue(gamma)}`);
    expect(fallback[0].formula.token).not.toMatch(/=/);
    expect(formulaAnchorText(fallback[0].formula.token, gamma)).toBe(`${gamma.handle}:${constantCue(gamma)}`);
  });

  it('covers every catalog formula token', () => {
    const ids = new Set(MATH_CONSTANTS.map((c) => c.id));
    const tokens = FORMULA_TOKENS.map((f) => f.token);
    expect(new Set(tokens).size).toBe(tokens.length);
    for (const formula of FORMULA_TOKENS) {
      expect(formula.token).toMatch(/^[\x20-\x7E]+$/);
      for (const id of formula.constantIds) {
        expect(ids.has(id)).toBe(true);
      }
    }
    expect(formulaChoices().length).toBe(FORMULA_TOKENS.length);
  });
});
