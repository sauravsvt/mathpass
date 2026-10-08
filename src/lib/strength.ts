export const SECRET_CAP_BITS = 32;

export const GUESS_RATES = {
  fastHash: 1e12,
  slowHash: 1e5,
} as const;

export type StrengthLabel = 'Weak' | 'Fair' | 'Everyday' | 'Strong' | 'Master';

export interface StrengthStyle {
  label: StrengthLabel;
  color: string;
  bg: string;
}

export interface BitPart {
  choices: number;
}

export interface StrengthReport {
  bits: number;
  label: StrengthLabel;
  color: string;
  bg: string;
  crackTimeFast: string;
  crackTimeSlow: string;
  warning?: string;
  kind: 'estimated';
}

type ZxcvbnFn = (password: string, userInputs?: string[]) => { guesses: number; feedback: { warning: string | null } };

let zxcvbnFn: ZxcvbnFn | null = null;

export function bitsFromParts(parts: readonly BitPart[]): number {
  return parts.reduce((sum, part) => {
    if (part.choices <= 1) return sum;
    return sum + Math.log2(part.choices);
  }, 0);
}

export function labelForBits(bits: number): StrengthStyle {
  if (bits < 40) {
    return { label: 'Weak', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
  }
  if (bits < 60) {
    return { label: 'Fair', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' };
  }
  if (bits < 72) {
    return { label: 'Everyday', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' };
  }
  if (bits < 80) {
    return { label: 'Strong', color: '#84cc16', bg: 'rgba(132, 204, 22, 0.15)' };
  }
  return { label: 'Master', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' };
}

export function labelForPreset(preset: 'everyday' | 'strong' | 'master'): StrengthStyle {
  if (preset === 'everyday') return labelForBits(60);
  if (preset === 'strong') return labelForBits(72);
  return labelForBits(80);
}

export function expectedCrackTime(bits: number, rate: number): string {
  if (!Number.isFinite(bits) || bits <= 0) return 'Less than a second';
  const seconds = Math.pow(2, Math.min(bits, 256) - 1) / rate;
  return formatDuration(seconds);
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 1) return 'Less than a second';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1e6) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
  if (years < 1e12) return `${Math.round(years / 1e9)} billion years`;
  return `${years.toExponential(1)} years`;
}

export function isGuessEstimatorReady(): boolean {
  return zxcvbnFn !== null;
}

export async function loadGuessEstimator(): Promise<void> {
  if (zxcvbnFn) return;
  const [core, common, en] = await Promise.all([
    import('@zxcvbn-ts/core'),
    import('@zxcvbn-ts/language-common'),
    import('@zxcvbn-ts/language-en'),
  ]);
  const factory = new core.ZxcvbnFactory({
    translations: en.translations,
    graphs: common.adjacencyGraphs,
    dictionary: {
      ...common.dictionary,
      ...en.dictionary,
    },
  });
  zxcvbnFn = (password, userInputs) => factory.check(password, userInputs);
}

export function estimateBits(text: string, userInputs: string[] = []): number {
  if (!text) return 0;
  if (!zxcvbnFn) {
    throw new Error('Guess estimator is not loaded');
  }
  const result = zxcvbnFn(text, userInputs);
  return Math.log2(Math.max(1, result.guesses));
}

export function secretCredit(secret: string, userInputs: string[] = []): number {
  if (!secret) return 0;
  return Math.min(SECRET_CAP_BITS, estimateBits(secret, userInputs));
}

export function analyzePassword(password: string, userInputs: string[] = []): StrengthReport {
  if (!password) {
    const style = labelForBits(0);
    return {
      bits: 0,
      ...style,
      crackTimeFast: expectedCrackTime(0, GUESS_RATES.fastHash),
      crackTimeSlow: expectedCrackTime(0, GUESS_RATES.slowHash),
      kind: 'estimated',
    };
  }
  if (!zxcvbnFn) {
    throw new Error('Guess estimator is not loaded');
  }
  const result = zxcvbnFn(password, userInputs);
  const bits = Math.log2(Math.max(1, result.guesses));
  const style = labelForBits(bits);
  return {
    bits,
    ...style,
    crackTimeFast: expectedCrackTime(bits, GUESS_RATES.fastHash),
    crackTimeSlow: expectedCrackTime(bits, GUESS_RATES.slowHash),
    warning: result.feedback.warning || undefined,
    kind: 'estimated',
  };
}
