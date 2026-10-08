import { PI_ANCHOR } from '@/lib/catalog';
import { DEFAULT_CONSTANT } from '@/lib/accounting';

const steps = [
  {
    step: '01',
    title: 'Choose a cue',
    description: 'Constant, pun, or formula. The cue is public and exists so you have something to hang the words on.',
    example: `Style: Constant · ${PI_ANCHOR}`,
  },
  {
    step: '02',
    title: 'Pick a strength',
    description: 'Everyday, Strong, or Master. MathPass chooses the word count so the bit target holds even if the constant is pinned.',
    example: `Strong: ${DEFAULT_CONSTANT.strong.words} words, ${DEFAULT_CONSTANT.strong.bits.toFixed(1)} generated bits`,
  },
  {
    step: '03',
    title: 'Remember the exact string',
    description: 'The recall line is the password. No truncation, no leftover random padding. Open the entropy ledger to see each term.',
    example: `${PI_ANCHOR}-otter-velvet-harbor-cactus-anchor`,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-2">
        How It <span className="gradient-text">Works</span>
      </h2>
      <p className="text-gray-400 text-center mb-12">
        Three steps to a passphrase whose bit count matches the generator
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={step.step} className="relative">
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 right-0 w-6 h-0.5 bg-white/20 translate-x-3" />
            )}
            <div className="glass-card rounded-xl p-6 h-full">
              <div className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-primary-600 mb-4">
                Step {step.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{step.description}</p>
              <div className="password-display text-xs bg-black/30 rounded-lg px-3 py-2 text-primary-300">
                {step.example}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
