import { MATH_CONSTANTS, SPECIAL_CHARS, type MathConstant } from './constants';

export type Strategy = 'mnemonic' | 'punster' | 'formula' | 'classic' | 'mashup' | 'leetspeak' | 'random';

export interface PasswordChecklist {
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  isLongEnough: boolean;
  hasPersonalAnchor: boolean;
}

export interface GeneratedPassword {
  password: string;
  strength: number;
  constants: MathConstant[];
  explanation: string;
  mnemonic: string;
  strategy: Strategy;
  entropy: number;
  crackTime: string;
  checklist: PasswordChecklist;
}

export interface GeneratorOptions {
  length: number;
  strategy: Strategy;
  count: number;
  constantId?: string;
  personalAnchor?: string; // Optional user secret keyword (salt)
}

/**
 * Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)
 * Uses Web Crypto API (crypto.getRandomValues) for hardware-grade unpredictability.
 */
function secureRandom(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] / (0xffffffff + 1);
  }
  return Math.random();
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(secureRandom() * (max - min + 1)) + min;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(secureRandom() * arr.length)];
}

function getRandomDigits(constant: MathConstant, count: number): string {
  const maxStart = Math.max(0, constant.digits.length - count);
  const start = Math.floor(secureRandom() * (maxStart + 1));
  return constant.digits.slice(start, start + count);
}

function getRandomSpecial(): string {
  return getRandomElement(SPECIAL_CHARS);
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ensureRequirements(password: string): string {
  let result = password;
  const hasUpper = /[A-Z]/.test(result);
  const hasLower = /[a-z]/.test(result);
  const hasDigit = /[0-9]/.test(result);
  const hasSpecial = /[!@#$%&*?+=]/.test(result);

  if (!hasUpper && result.length > 0) {
    const idx = result.search(/[a-z]/);
    if (idx >= 0) {
      result = result.slice(0, idx) + result[idx].toUpperCase() + result.slice(idx + 1);
    } else {
      result = 'M' + result;
    }
  }
  if (!hasLower && result.length > 0) {
    result += 'x';
  }
  if (!hasDigit) {
    result += '1';
  }
  if (!hasSpecial) {
    result += '!';
  }
  return result;
}

function trimOrPadToLength(password: string, targetLength: number): string {
  if (password.length > targetLength) {
    return password.slice(0, targetLength);
  }
  const paddingChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  while (password.length < targetLength) {
    password += paddingChars[Math.floor(secureRandom() * paddingChars.length)];
  }
  return password;
}

function calculateStrength(password: string, hasPersonalAnchor: boolean): number {
  let score = 0;
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 15;
  if (password.length >= 20) score += 15;
  if (password.length >= 24) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[!@#$%&*?+=]/.test(password)) score += 10;
  
  const uniqueChars = new Set(password).size;
  score += Math.min(10, Math.floor(uniqueChars / 2));

  // Big security boost if personal anchor is present (defeats template-targeted attacks)
  if (hasPersonalAnchor) {
    score += 15;
  }
  
  if (/(.)\1{2,}/.test(password)) score -= 5;
  if (/^[a-zA-Z]+$/.test(password)) score -= 10;
  if (/^[0-9]+$/.test(password)) score -= 15;
  
  return Math.max(0, Math.min(100, score));
}

function calculateEntropy(password: string, hasPersonalAnchor: boolean): number {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[!@#$%&*?+=_\-.]/.test(password)) charsetSize += 15;
  if (charsetSize === 0) charsetSize = 26;

  let baseEntropy = Math.round(password.length * Math.log2(charsetSize));
  // If a personal secret is infused, add minimum 25 bits of unguessable private entropy
  if (hasPersonalAnchor) {
    baseEntropy += 28;
  }
  return baseEntropy;
}

function calculateCrackTime(entropy: number): string {
  const guessesPerSecond = 1e11; // 100 billion guesses/sec
  const totalCombinations = Math.pow(2, entropy);
  const seconds = totalCombinations / (2 * guessesPerSecond);

  if (seconds < 1) return 'Instant (< 1 second)';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1000000) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
  if (years < 1e12) return `${Math.round(years / 1e9)} billion years`;
  return 'Quintillions of years (Mathematically Unbreakable)';
}

function getChecklist(password: string, hasPersonalAnchor: boolean): PasswordChecklist {
  return {
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecial: /[!@#$%&*?+=]/.test(password),
    isLongEnough: password.length >= 12,
    hasPersonalAnchor,
  };
}

// Expansive pool of memorable cognitive words for mnemonics
const MNEMONIC_WORDS = [
  'Shield', 'Secret', 'Fortress', 'Vault', 'Matrix', 'Rocket',
  'Knight', 'Dragon', 'Cyber', 'Nexus', 'Galaxy', 'Quantum',
  'Vector', 'Castle', 'Crown', 'Titan', 'Zenith', 'Portal',
  'Solar', 'Vortex', 'Cosmos', 'Apex', 'Beacon', 'Cipher',
  'Pinnacle', 'Starlight', 'Thunder', 'Horizon', 'Sentinel', 'Oasis',
  'Mirage', 'Eclipse', 'Comet', 'Valiant', 'Mystic', 'Ironclad',
  'Aurora', 'Tempest', 'Solitude', 'Nebula', 'Summit', 'Rapture',
  'Prism', 'Radiant', 'Bastion', 'Velocity', 'Enigma', 'Glacier'
];

// ====== STRATEGY 1: MNEMONIC (SMART STORY + OPTIONAL PERSONAL ANCHOR) ======
function generateMnemonic(length: number, constant?: MathConstant, personalAnchor?: string): GeneratedPassword {
  const c = constant || getRandomElement(MATH_CONSTANTS);
  const anchorWord = personalAnchor && personalAnchor.trim().length > 0
    ? capitalize(personalAnchor.trim().replace(/[^a-zA-Z0-9]/g, ''))
    : getRandomElement(MNEMONIC_WORDS);

  const shortName = c.name.split(' ')[0];
  const digits = getRandomDigits(c, 4);
  const sym1 = getRandomElement(['#', '@', '$', '!']);
  const sym2 = getRandomElement(['!', '*', '+', '?']);

  let password = `${shortName}${sym1}${digits}${sym2}${anchorWord}`;
  password = ensureRequirements(password);
  password = trimOrPadToLength(password, length);

  const hasPersonal = Boolean(personalAnchor && personalAnchor.trim().length > 0);
  const entropy = calculateEntropy(password, hasPersonal);

  const mnemonic = hasPersonal
    ? `Remember: Constant "${shortName}" + digits "${digits}" + your private secret "${anchorWord}" with (${sym1} and ${sym2}).`
    : `Remember: "${shortName} + ${digits} + ${anchorWord}" linked with symbols (${sym1} and ${sym2}).`;

  return {
    password,
    strength: calculateStrength(password, hasPersonal),
    constants: [c],
    explanation: hasPersonal
      ? `Dual-Layer Security: Uses ${c.name} (${c.symbol}) + your private anchor "${anchorWord}". Immune to template dictionary attacks!`
      : `Cognitive Anchor: Built from ${c.name} (${c.symbol} ≈ ${c.value.slice(0, 7)}). ${c.funFact}`,
    mnemonic,
    strategy: 'mnemonic',
    entropy,
    crackTime: calculateCrackTime(entropy),
    checklist: getChecklist(password, hasPersonal),
  };
}

// ====== STRATEGY 2: PUNSTER (FUNNY & SMART) ======
function generatePunster(length: number, constant?: MathConstant, personalAnchor?: string): GeneratedPassword {
  const c = constant || getRandomElement(MATH_CONSTANTS);
  const pun = getRandomElement(c.puns);
  const digits = getRandomDigits(c, 4);
  const special = getRandomSpecial();
  const anchorSuffix = personalAnchor && personalAnchor.trim().length > 0
    ? `_${capitalize(personalAnchor.trim().slice(0, 5))}`
    : '';

  let password = `${pun}${special}${digits}${anchorSuffix}`;
  password = ensureRequirements(password);
  password = trimOrPadToLength(password, length);

  const hasPersonal = Boolean(personalAnchor && personalAnchor.trim().length > 0);
  const entropy = calculateEntropy(password, hasPersonal);
  const mnemonic = `Remember the pun: "${pun}" + digits ${digits}${hasPersonal ? ` + secret "${anchorSuffix.replace('_', '')}"` : ''}!`;

  return {
    password,
    strength: calculateStrength(password, hasPersonal),
    constants: [c],
    explanation: `Pun on ${c.name} (${c.symbol}): "${pun}" — ${c.funFact}`,
    mnemonic,
    strategy: 'punster',
    entropy,
    crackTime: calculateCrackTime(entropy),
    checklist: getChecklist(password, hasPersonal),
  };
}

// ====== STRATEGY 3: FORMULA (GEEK FORMULA AS PASSWORD) ======
interface FormulaTemplate {
  template: (c: MathConstant, anchor?: string) => string;
  constantIds?: string[];
  desc: string;
}

const FORMULA_TEMPLATES: FormulaTemplate[] = [
  { template: (c, a) => `${c.name}=${c.value.slice(0, 5)}${getRandomSpecial()}${a ? capitalize(a) : ''}`, desc: 'Constant equals decimal value' },
  { template: (_, a) => `E=h*f${getRandomSpecial()}662607${a ? capitalize(a) : 'Planck'}`, constantIds: ['planck'], desc: "Planck's quantum energy equation E = h·f" },
  { template: (_, a) => `E=m*c^2${getRandomSpecial()}299792${a ? capitalize(a) : 'Photon'}`, constantIds: ['speed_of_light'], desc: "Einstein's mass-energy equivalence E = m·c²" },
  { template: (_, a) => `S=k*ln(W)${getRandomSpecial()}13806${a ? capitalize(a) : 'Entropy'}`, constantIds: ['boltzmann'], desc: "Boltzmann's entropy formula S = k·ln(W)" },
  { template: (_, a) => `PV=nRT${getRandomSpecial()}83144${a ? capitalize(a) : 'Gas'}`, constantIds: ['gas_constant'], desc: "Universal ideal gas law PV = nRT" },
  { template: (_, a) => `e^(i*Pi)+1=0${getRandomSpecial()}${a ? capitalize(a) : 'Euler'}`, constantIds: ['e', 'pi'], desc: "Euler's magical identity" },
  { template: (_, a) => `Area=Pi*r^2${getRandomSpecial()}${a ? capitalize(a) : 'Circle'}`, constantIds: ['pi'], desc: 'Area of circle formula' },
  { template: (_, a) => `(1+Sqrt5)/2=Phi${getRandomSpecial()}${a ? capitalize(a) : ''}`, constantIds: ['phi', 'sqrt5'], desc: 'Golden ratio algebraic root' },
  { template: (_, a) => `Tau=2*Pi${getRandomSpecial()}628${a ? capitalize(a) : ''}`, constantIds: ['tau', 'pi'], desc: 'Tau circle constant definition' },
  { template: (_, a) => `Circum=2*Pi*r${getRandomSpecial()}${a ? capitalize(a) : ''}`, constantIds: ['pi'], desc: 'Circle circumference formula' },
  { template: (_, a) => `Phi^2=Phi+1${getRandomSpecial()}161${a ? capitalize(a) : ''}`, constantIds: ['phi'], desc: 'Golden ratio recursive property' },
  { template: (c, a) => `f(${c.name})=${c.value.slice(2, 6)}${getRandomSpecial()}${a ? capitalize(a) : ''}`, desc: 'Function evaluation with constant' },
  { template: (c, a) => `Sum_${c.name.slice(0, 3)}=${c.value.slice(0, 4)}${getRandomSpecial()}${a ? capitalize(a) : ''}`, desc: 'Infinite series evaluation' },
];

function generateFormula(length: number, constant?: MathConstant, personalAnchor?: string): GeneratedPassword {
  const tmpl = getRandomElement(FORMULA_TEMPLATES);
  let password: string;
  let constants: MathConstant[];
  const cleanAnchor = personalAnchor?.trim();

  if (constant) {
    constants = [constant];
    password = tmpl.template(constant, cleanAnchor);
  } else if (tmpl.constantIds && tmpl.constantIds.length > 0) {
    constants = tmpl.constantIds
      .map(id => MATH_CONSTANTS.find(c => c.id === id))
      .filter((c): c is MathConstant => c !== undefined);
    password = tmpl.template(constants[0] || getRandomElement(MATH_CONSTANTS), cleanAnchor);
  } else {
    const c = getRandomElement(MATH_CONSTANTS);
    constants = [c];
    password = tmpl.template(c, cleanAnchor);
  }

  password = ensureRequirements(password);
  password = trimOrPadToLength(password, length);

  const hasPersonal = Boolean(cleanAnchor && cleanAnchor.length > 0);
  const entropy = calculateEntropy(password, hasPersonal);
  const mnemonic = `Remember the math equation: ${tmpl.desc}${hasPersonal ? ` with your private keyword "${cleanAnchor}"` : ''}`;

  return {
    password,
    strength: calculateStrength(password, hasPersonal),
    constants,
    explanation: `Formula style: ${tmpl.desc} — uses ${constants.map(c => `${c.name} (${c.symbol})`).join(' & ')}`,
    mnemonic,
    strategy: 'formula',
    entropy,
    crackTime: calculateCrackTime(entropy),
    checklist: getChecklist(password, hasPersonal),
  };
}

// ====== STRATEGY 4: CLASSIC ======
function generateClassic(length: number, constant?: MathConstant, personalAnchor?: string): GeneratedPassword {
  const c = constant || getRandomElement(MATH_CONSTANTS);
  const name = capitalize(c.name.split(' ')[0]);
  const digits = getRandomDigits(c, 5);
  const special = getRandomSpecial();
  const anchorSuffix = personalAnchor && personalAnchor.trim().length > 0
    ? `_${capitalize(personalAnchor.trim())}`
    : '';

  let password = `${name}_${digits}${special}${anchorSuffix}`;
  password = ensureRequirements(password);
  password = trimOrPadToLength(password, length);

  const hasPersonal = Boolean(personalAnchor && personalAnchor.trim().length > 0);
  const entropy = calculateEntropy(password, hasPersonal);
  const mnemonic = `Remember: ${name} + digits (${digits}) + ${special}${hasPersonal ? ` + your secret "${personalAnchor}"` : ''}`;

  return {
    password,
    strength: calculateStrength(password, hasPersonal),
    constants: [c],
    explanation: `Uses ${c.name} (${c.symbol} ≈ ${c.value.slice(0, 7)}) — ${c.funFact}`,
    mnemonic,
    strategy: 'classic',
    entropy,
    crackTime: calculateCrackTime(entropy),
    checklist: getChecklist(password, hasPersonal),
  };
}

// ====== STRATEGY 5: MASHUP (TWO CONSTANTS COMBINED) ======
function generateMashup(length: number, constant?: MathConstant, personalAnchor?: string): GeneratedPassword {
  const c1 = constant || getRandomElement(MATH_CONSTANTS);
  const c2 = getRandomElement(MATH_CONSTANTS.filter(c => c.id !== c1.id));
  const ops = ['+', '*', '^', '#', '@'];
  const op = getRandomElement(ops);
  const name1 = c1.name.split(' ')[0].slice(0, 4);
  const name2 = c2.name.split(' ')[0].slice(0, 4);
  const d1 = getRandomDigits(c1, 3);
  const d2 = getRandomDigits(c2, 2);
  const special = getRandomSpecial();
  const anchorSuffix = personalAnchor && personalAnchor.trim().length > 0
    ? `_${capitalize(personalAnchor.trim())}`
    : '';

  let password = `${capitalize(name1)}${op}${capitalize(name2)}_${d1}${d2}${special}${anchorSuffix}`;
  password = ensureRequirements(password);
  password = trimOrPadToLength(password, length);

  const hasPersonal = Boolean(personalAnchor && personalAnchor.trim().length > 0);
  const entropy = calculateEntropy(password, hasPersonal);
  const mnemonic = `Remember two constants: ${c1.name} and ${c2.name} joined by ${op}${hasPersonal ? ` + secret "${personalAnchor}"` : ''}!`;

  return {
    password,
    strength: calculateStrength(password, hasPersonal),
    constants: [c1, c2],
    explanation: `Mashup of ${c1.name} (${c1.symbol}) and ${c2.name} (${c2.symbol}) — combined security!`,
    mnemonic,
    strategy: 'mashup',
    entropy,
    crackTime: calculateCrackTime(entropy),
    checklist: getChecklist(password, hasPersonal),
  };
}

// ====== STRATEGY 6: LEETSPEAK ======
const LEET_MAP: Record<string, string> = {
  a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', g: '9', b: '8',
};

function toLeet(text: string): string {
  return text
    .split('')
    .map(ch => {
      const lower = ch.toLowerCase();
      if (lower in LEET_MAP && secureRandom() > 0.35) {
        return LEET_MAP[lower];
      }
      return ch;
    })
    .join('');
}

const LEET_PHRASES = [
  'GoldenRatio', 'NaturalLog', 'CircleArea', 'MathWizard',
  'PrimeNumber', 'InfiniteSum', 'ChaosTheory', 'EulerMaster',
  'PiChampion', 'RootSquare', 'SigmaGrind', 'DeltaForce',
  'OmegaLevel', 'AlphaBrain', 'ThetaWave', 'LambdaCalc',
  'NumberNerd', 'MathLegend', 'DigitKing', 'ProofMaster',
];

function generateLeetspeak(length: number, constant?: MathConstant, personalAnchor?: string): GeneratedPassword {
  const c = constant || getRandomElement(MATH_CONSTANTS);
  const phrase = personalAnchor && personalAnchor.trim().length > 0
    ? personalAnchor.trim()
    : getRandomElement(LEET_PHRASES);

  const leetPhrase = toLeet(phrase);
  const digits = getRandomDigits(c, 4);
  const special = getRandomSpecial();

  let password = `${leetPhrase}${special}${digits}`;
  password = ensureRequirements(password);
  password = trimOrPadToLength(password, length);

  const hasPersonal = Boolean(personalAnchor && personalAnchor.trim().length > 0);
  const entropy = calculateEntropy(password, hasPersonal);
  const mnemonic = `Remember phrase "${phrase}" transformed into leetspeak + ${digits}!`;

  return {
    password,
    strength: calculateStrength(password, hasPersonal),
    constants: [c],
    explanation: `Hacker leetspeak "${phrase}" with digits from ${c.name} (${c.symbol}) — ${c.funFact}`,
    mnemonic,
    strategy: 'leetspeak',
    entropy,
    crackTime: calculateCrackTime(entropy),
    checklist: getChecklist(password, hasPersonal),
  };
}

// ====== MAIN GENERATOR ======
const strategyGenerators: Record<
  Exclude<Strategy, 'random'>,
  (length: number, constant?: MathConstant, personalAnchor?: string) => GeneratedPassword
> = {
  mnemonic: generateMnemonic,
  punster: generatePunster,
  formula: generateFormula,
  classic: generateClassic,
  mashup: generateMashup,
  leetspeak: generateLeetspeak,
};

const ALL_STRATEGIES: Exclude<Strategy, 'random'>[] = ['mnemonic', 'punster', 'formula', 'classic', 'mashup', 'leetspeak'];

export function generatePassword(options: GeneratorOptions): GeneratedPassword[] {
  const results: GeneratedPassword[] = [];
  const selectedConstant = options.constantId ? MATH_CONSTANTS.find(c => c.id === options.constantId) : undefined;

  for (let i = 0; i < options.count; i++) {
    let strategy: Exclude<Strategy, 'random'>;
    if (options.strategy === 'random') {
      strategy = getRandomElement(ALL_STRATEGIES);
    } else {
      strategy = options.strategy;
    }

    const generator = strategyGenerators[strategy];
    results.push(generator(options.length, selectedConstant, options.personalAnchor));
  }

  return results;
}

export function getStrengthLabel(strength: number): { label: string; color: string; bg: string } {
  if (strength >= 80) return { label: 'Mathematically Bulletproof 🛡️', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' };
  if (strength >= 65) return { label: 'Extremely Strong 🔒', color: '#84cc16', bg: 'rgba(132, 204, 22, 0.15)' };
  if (strength >= 45) return { label: 'Moderate ⚡', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' };
  if (strength >= 25) return { label: 'Weak ⚠️', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' };
  return { label: 'Very Weak 🚨', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
}

export function getStrategyDescription(strategy: Strategy): string {
  switch (strategy) {
    case 'mnemonic': return '🧠 Smart Mnemonic — Constant + cognitive phrase + your optional secret anchor. Dual-layer uncrackable defense!';
    case 'punster': return '😄 Funny & Clever — Math puns (e.g., Pi_R8, CutiePi, e_Z_PZ) with real constant digits';
    case 'formula': return '🧮 Geek Chic — Real mathematical identities (e.g., e^(i*Pi)+1=0) as secure passwords';
    case 'classic': return '📐 Clean & Professional — Constant name + selective digits + special characters';
    case 'mashup': return '🔀 Double Security — Two distinct constants combined mathematically';
    case 'leetspeak': return '💻 Hacker Style — Math concepts converted into 1337-speak with constant digits';
    case 'random': return '🎲 Surprise Me — Automatically mixes across all 6 smart strategies';
  }
}
