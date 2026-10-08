const steps = [
  {
    step: '01',
    title: 'Choose Your Style',
    description: 'Pick from 5 password strategies: Classic, Punster (math puns), Formula, Mashup, or Leetspeak.',
    example: 'Strategy: Punster 😄',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    step: '02',
    title: 'Set Your Length',
    description: 'Slide to pick your ideal password length from 8 to 32 characters. Longer = stronger.',
    example: 'Length: 16 characters',
    color: 'from-purple-500 to-pink-500',
  },
  {
    step: '03',
    title: 'Generate & Remember',
    description: 'Get passwords built on π, e, φ, and more. Each comes with the story behind it so you never forget.',
    example: 'Pi_R8@3.14159!',
    color: 'from-orange-500 to-yellow-500',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-2">
        How It <span className="gradient-text">Works</span>
      </h2>
      <p className="text-gray-400 text-center mb-12">
        Three steps to a password you&apos;ll actually remember
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 right-0 w-6 h-0.5 bg-gradient-to-r from-white/20 to-transparent translate-x-3" />
            )}
            <div className="glass-card rounded-xl p-6 h-full">
              <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${step.color} mb-4`}>
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
