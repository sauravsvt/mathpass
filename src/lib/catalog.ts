import { MATH_CONSTANTS, type MathConstant } from './constants';
import { FORMULA_CUE_JOIN, formatCue } from './cue';
import { FORMULA_TOKENS, type FormulaToken } from './formulas';

export function famousDisplay(famous: string): string {
  if (famous.length <= 1) return famous;
  return `${famous[0]}.${famous.slice(1)}`;
}

export function constantCue(constant: MathConstant): string {
  return formatCue(constant.value);
}

export function toPrintableAscii(s: string): string {
  return s.normalize('NFKD').replace(/[^\x20-\x7E]/g, '');
}

export function constantAnchorText(constant: MathConstant): string {
  return `${constant.handle}${constantCue(constant)}`;
}

export function punAnchorText(pun: string, constant: MathConstant): string {
  let text = toPrintableAscii(pun);
  if (!text) text = constant.handle;
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/\d/.test(text)) {
    text += constantCue(constant);
  }
  return text;
}

export function formulaAnchorText(token: string, constant: MathConstant): string {
  let text = toPrintableAscii(token);
  if (!text) text = constant.handle;
  const keepMarkup = /[=^()]/.test(text);
  if (!keepMarkup && !/[A-Z]/.test(text)) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }
  if (!/\d/.test(text)) {
    text += `${FORMULA_CUE_JOIN}${constantCue(constant)}`;
  }
  return text;
}

export function punChoices(catalog: readonly MathConstant[] = MATH_CONSTANTS, constantId?: string): Array<{
  constant: MathConstant;
  pun: string;
}> {
  const source = constantId ? catalog.filter((c) => c.id === constantId) : catalog;
  const choices: Array<{ constant: MathConstant; pun: string }> = [];
  for (const constant of source) {
    for (const pun of constant.puns) {
      choices.push({ constant, pun });
    }
  }
  return choices;
}

export function formulaChoices(
  formulas: readonly FormulaToken[] = FORMULA_TOKENS,
  catalog: readonly MathConstant[] = MATH_CONSTANTS,
  constantId?: string,
): Array<{ formula: FormulaToken; constant: MathConstant }> {
  const pinned = constantId ? catalog.find((c) => c.id === constantId) : undefined;
  const matches = formulas.filter((formula) => {
    if (!constantId) return true;
    return formula.constantIds.length === 0 || formula.constantIds.includes(constantId);
  });

  if (matches.length === 0 && pinned) {
    return [
      {
        formula: {
          token: `${pinned.handle}${FORMULA_CUE_JOIN}${constantCue(pinned)}`,
          constantIds: [pinned.id],
          desc: `${pinned.name} identity`,
        },
        constant: pinned,
      },
    ];
  }

  return matches.map((formula) => {
    const constant =
      (constantId ? pinned : undefined) || catalog.find((c) => formula.constantIds.includes(c.id)) || catalog[0];
    return { formula, constant };
  });
}

export function catalogUserInputs(constants: readonly MathConstant[] = MATH_CONSTANTS): string[] {
  const inputs = new Set<string>(['mathpass', 'MathPass']);
  for (const constant of constants) {
    inputs.add(constant.handle);
    inputs.add(constant.name);
    inputs.add(constant.symbol);
    inputs.add(constantCue(constant));
    inputs.add(constantAnchorText(constant));
    for (const pun of constant.puns) {
      inputs.add(pun);
    }
  }
  for (const formula of FORMULA_TOKENS) {
    inputs.add(formula.token);
  }
  return Array.from(inputs);
}

export function noAnchorIsPrefixOfAnother(anchors: string[]): boolean {
  const sorted = [...anchors].sort();
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1].startsWith(sorted[i])) {
      return false;
    }
  }
  return true;
}

export function allPublicAnchors(
  catalog: readonly MathConstant[] = MATH_CONSTANTS,
  formulas: readonly FormulaToken[] = FORMULA_TOKENS,
): string[] {
  return [
    ...catalog.map(constantAnchorText),
    ...punChoices(catalog).map((choice) => punAnchorText(choice.pun, choice.constant)),
    ...formulaChoices(formulas, catalog).map((choice) => formulaAnchorText(choice.formula.token, choice.constant)),
  ];
}

export const PI_ANCHOR = constantAnchorText(MATH_CONSTANTS.find((c) => c.id === 'pi')!);
