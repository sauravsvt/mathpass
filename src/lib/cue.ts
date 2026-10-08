const SUPER: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
};

export const CUE_SIG_FIGS = 5;
export const FORMULA_CUE_JOIN = ':';

export interface ParsedValue {
  token: string;
  scientific: boolean;
  exponent: number | null;
  /** Approximate JavaScript number; used only for residual checks. */
  approx: number;
}

function decodeSuperscript(text: string): string {
  return Array.from(text)
    .map((ch) => SUPER[ch] ?? ch)
    .join('');
}

export function parseValue(value: string): ParsedValue {
  const sci = value.match(/([+-]?\d+(?:\.\d+)?)\s*[×xX]\s*10\s*([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)/);
  if (sci) {
    const exponent = Number(decodeSuperscript(sci[2]));
    const mantissa = Number(sci[1]);
    return {
      token: sci[1],
      scientific: true,
      exponent,
      approx: mantissa * 10 ** exponent,
    };
  }
  const num = value.match(/[+-]?\d+(?:\.\d+)?/);
  if (!num) {
    throw new Error(`No numeric token in value: ${value}`);
  }
  return {
    token: num[0],
    scientific: false,
    exponent: null,
    approx: Number(num[0]),
  };
}

function roundHalfUp(digits: string, sig: number): { digits: string; expAdjust: number } {
  if (digits.length <= sig) {
    return { digits, expAdjust: 0 };
  }
  const head = digits.slice(0, sig).split('').map(Number);
  const next = digits.charCodeAt(sig) - 48;
  if (next >= 5) {
    let i = head.length - 1;
    while (i >= 0) {
      head[i] += 1;
      if (head[i] < 10) break;
      head[i] = 0;
      i -= 1;
    }
    if (i < 0) {
      return { digits: `1${'0'.repeat(sig - 1)}`, expAdjust: 1 };
    }
  }
  return { digits: head.join(''), expAdjust: 0 };
}

function significand(token: string, sig: number): { neg: boolean; digits: string; exp10: number } {
  const neg = token.startsWith('-');
  const unsigned = neg ? token.slice(1) : token;
  const dot = unsigned.indexOf('.');
  const intRaw = dot === -1 ? unsigned : unsigned.slice(0, dot);
  const frac = dot === -1 ? '' : unsigned.slice(dot + 1);
  const intPart = intRaw.replace(/^0+/, '');
  let exp10: number;
  let digits: string;
  if (intPart.length > 0) {
    exp10 = intPart.length - 1;
    digits = (intPart + frac).replace(/0+$/, '') || intPart;
  } else {
    let zeros = 0;
    while (zeros < frac.length && frac[zeros] === '0') zeros += 1;
    const rest = frac.slice(zeros);
    if (!rest) {
      return { neg, digits: '0', exp10: 0 };
    }
    exp10 = -(zeros + 1);
    digits = rest.replace(/0+$/, '') || rest;
  }
  const rounded = roundHalfUp(digits.replace(/^0+/, '') || '0', sig);
  return { neg, digits: rounded.digits, exp10: exp10 + rounded.expAdjust };
}

function formatScientific(digits: string, exp10: number): string {
  const frac = digits.slice(1).replace(/0+$/, '');
  const mantissa = frac ? `${digits[0]}.${frac}` : digits[0];
  return `${mantissa}e${exp10}`;
}

function formatDecimal(digits: string, exp10: number): string {
  if (exp10 >= 6 || exp10 <= -5) {
    return formatScientific(digits, exp10);
  }
  if (exp10 >= 0) {
    const intLen = exp10 + 1;
    if (digits.length <= intLen) {
      return digits.padEnd(intLen, '0');
    }
    return `${digits.slice(0, intLen)}.${digits.slice(intLen)}`;
  }
  const leadingZeros = -exp10 - 1;
  return `0.${'0'.repeat(leadingZeros)}${digits}`;
}

/**
 * Public mnemonic for a catalog value, with the decimal point in the
 * physically correct place. Exact integers (c, for example) are kept whole.
 * Everything else is rounded to {@link CUE_SIG_FIGS} significant figures.
 */
export function formatCue(value: string, sig = CUE_SIG_FIGS): string {
  const parsed = parseValue(value);
  if (!parsed.scientific && !parsed.token.includes('.')) {
    return parsed.token;
  }
  const { neg, digits, exp10 } = significand(parsed.token, sig);
  const body = parsed.scientific ? formatScientific(digits, (parsed.exponent ?? 0) + exp10) : formatDecimal(digits, exp10);
  return neg ? `-${body}` : body;
}

export function cueToNumber(cue: string): number {
  return Number(cue);
}

export function relativeCueError(value: string, cue = formatCue(value)): number {
  const expected = parseValue(value).approx;
  if (expected === 0) {
    return Math.abs(cueToNumber(cue));
  }
  return Math.abs(cueToNumber(cue) - expected) / Math.abs(expected);
}
