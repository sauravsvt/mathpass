const features = [
  {
    icon: '🧠',
    title: 'Memorable by Design',
    description: 'Passwords built on math constants you already know. Pi, Euler, Golden Ratio — your memory anchors.',
  },
  {
    icon: '🔒',
    title: 'Cryptographically Strong',
    description: 'Every password meets enterprise-grade requirements: uppercase, lowercase, numbers, special characters, 50-100+ bits of entropy.',
  },
  {
    icon: '🎭',
    title: '5 Creative Strategies',
    description: 'Classic, Punster, Formula, Mashup, or Leetspeak — pick your style or let us surprise you.',
  },
  {
    icon: '🔑',
    title: '100% Client-Side',
    description: 'Zero server calls. Your passwords are generated in your browser and never leave your device.',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Responsive design that works on desktop, tablet, and mobile. No app install needed.',
  },
  {
    icon: '⚡',
    title: 'Instant Generation',
    description: 'Generate up to 5 passwords at once. Copy with one click. No loading, no waiting.',
  },
  {
    icon: '🎓',
    title: 'Learn While You Lock',
    description: 'Each password comes with a fun fact about the mathematical constant used.',
  },
  {
    icon: '♾️',
    title: 'Unlimited & Free',
    description: 'No accounts, no limits, no cost. Generate as many passwords as you want, forever.',
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-2">
        Why <span className="gradient-text">MathPass</span>?
      </h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Traditional passwords are either strong and forgettable, or memorable and weak.
        MathPass gives you both — powered by the most beautiful numbers in mathematics.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="glass-card rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="font-semibold mb-2 text-sm">{feature.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
