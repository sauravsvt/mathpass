import { describe, expect, it } from 'vitest';
import { MATH_CONSTANTS } from './constants';
import { CUE_SIG_FIGS, formatCue, relativeCueError } from './cue';
import { constantAnchorText } from './catalog';

describe('formatCue', () => {
  it('puts the decimal in the physically correct place', () => {
    const byId = Object.fromEntries(MATH_CONSTANTS.map((c) => [c.id, c]));
    expect(formatCue(byId.pi.value)).toBe('3.1416');
    expect(formatCue(byId.e.value)).toBe('2.7183');
    expect(formatCue(byId.phi.value)).toBe('1.6180');
    expect(formatCue(byId.euler_gamma.value)).toBe('0.57722');
    expect(formatCue(byId.gauss.value)).toBe('0.83463');
    expect(formatCue(byId.absolute_zero.value)).toBe('-273.15');
    expect(formatCue(byId.ramanujan.value)).toBe('2.6254e17');
    expect(formatCue(byId.speed_of_light.value)).toBe('299792458');
    expect(formatCue(byId.planck.value)).toBe('6.6261e-34');
    expect(formatCue(byId.ln2.value)).toBe('0.69315');
    expect(formatCue(byId.fine_structure.value)).toBe('0.0072974');
    expect(formatCue(byId.gas_constant.value)).toBe('8.3145');
  });

  it('keeps every catalog cue within 5-significant-figure relative error', () => {
    for (const constant of MATH_CONSTANTS) {
      const error = relativeCueError(constant.value);
      expect(error, constant.id).toBeLessThan(10 ** (1 - CUE_SIG_FIGS) * 1.01);
    }
  });

  it('does not turn gamma into 5.7721', () => {
    const gamma = MATH_CONSTANTS.find((c) => c.id === 'euler_gamma')!;
    expect(constantAnchorText(gamma)).toBe('Gamma0.57722');
    expect(constantAnchorText(gamma)).not.toContain('5.7721');
  });
});
