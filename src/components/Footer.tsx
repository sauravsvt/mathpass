export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 mt-20 bg-black/40">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold shadow-md shadow-primary-500/20 text-white">
                π
              </div>
              <span className="text-xl font-bold text-white">
                <span className="gradient-text">Math</span>Pass
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-4">
              MathPass is an open-source, client-side password architecture designed by <strong className="text-white">Saurav Shriwastav</strong>. It solves the human memory paradox by fusing mathematical constants with personal anchors for zero-knowledge, uncrackable security.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                100% Client-Side Privacy
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                Open Source · MIT License
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                Hardware CSPRNG
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm text-white">Navigation &amp; Tools</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#generator" className="hover:text-white transition-colors">Instant Generator</a></li>
              <li><a href="#anti-cracker" className="hover:text-white transition-colors">Anti-Cracker Defense</a></li>
              <li><a href="#constants-table" className="hover:text-white transition-colors">Constants Encyclopedia</a></li>
              <li><a href="#tester" className="hover:text-white transition-colors">Live Strength Tester</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm text-white">Project &amp; Author</h3>
            <p className="text-xs text-gray-400 mb-3">
              Authored &amp; architected by <strong>Saurav Shriwastav</strong>. Contributions, pull requests, and security feedback welcome.
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="https://github.com/sauravsvt/mathpass"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 font-semibold"
              >
                <span>⭐ View on GitHub</span>
                <span>→</span>
              </a>
              <div className="text-[11px] text-gray-500">
                Version 1.0.0 (Production Release)
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} MathPass. Created by <span className="text-gray-300 font-medium">Saurav Shriwastav</span>. Free &amp; Open Source forever under the MIT License.</p>
          <p className="font-mono text-[11px] text-gray-400">
            Engineered with π, $e$, $\varphi$, and mathematical rigor
          </p>
        </div>
      </div>
    </footer>
  );
}
