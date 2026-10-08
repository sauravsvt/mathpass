import { ACCOUNTING, DEFAULT_CONSTANT } from '@/lib/accounting';

const features = [
  {
    icon: '1',
    title: 'Memorable by design',
    description: 'A constant you already know, then random dictionary words. The string on screen is the string you remember.',
  },
  {
    icon: '2',
    title: 'Bits you can recompute',
    description: `A random-constant sample is ${DEFAULT_CONSTANT.everyday.bits.toFixed(1)} / ${DEFAULT_CONSTANT.strong.bits.toFixed(1)} / ${DEFAULT_CONSTANT.master.bits.toFixed(1)} bits for Everyday / Strong / Master. The badge is log2 of this sample's choices, not a slogan.`,
  },
  {
    icon: '3',
    title: 'Three public-cue styles',
    description: 'Constant, Pun, or Formula. The cue is public. Strength comes from uniformly chosen words.',
  },
  {
    icon: '4',
    title: 'Runs in the browser',
    description: 'Passwords are generated locally. MathPass does not send them to a MathPass server.',
  },
  {
    icon: '5',
    title: 'Dice-checkable words',
    description: `The EFF long list has ${ACCOUNTING.wordlistSize.toLocaleString()} words = 6^5. Each word in the ledger shows its five-die code.`,
  },
  {
    icon: '6',
    title: 'Batch generation',
    description: 'Generate up to 10 at once. Copy with one click. Picking one favorite of N costs log2(N) bits.',
  },
  {
    icon: '7',
    title: 'The constant is a cue',
    description: 'Each result names the constant and shows a magnitude-correct ASCII cue, so Euler-Mascheroni is Gamma0.57722, never a shifted decimal.',
  },
  {
    icon: '8',
    title: 'Free to use',
    description: 'No accounts and no generation limit. Optional ads stay off unless enabled in the environment.',
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-2">
        Why <span className="gradient-text">MathPass</span>?
      </h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Random symbol soup is hard to remember. Short math templates are easy to search. MathPass keeps the cue and puts the entropy in the words.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div key={feature.title} className="glass-card rounded-xl p-6 hover:bg-white/10">
            <div className="text-xs font-mono text-primary-300 mb-4">{feature.icon}</div>
            <h3 className="font-semibold mb-2 text-sm">{feature.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
