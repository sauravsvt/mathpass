'use client';

import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 px-4 sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform text-white">
            π
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span><span className="gradient-text">Math</span>Pass</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 border border-primary-500/30">
                v1.0
              </span>
            </div>
            <div className="text-[11px] text-gray-400 -mt-0.5 hidden sm:block">
              Constant-Powered Security
            </div>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-xs md:text-sm font-medium text-gray-300">
          <a href="#generator" className="hover:text-white transition-colors">Generator</a>
          <a href="#anti-cracker" className="hover:text-white transition-colors flex items-center gap-1 text-accent-400">
            <span>🛡️</span>
            <span>Security Model</span>
          </a>
          <a href="#constants-table" className="hover:text-white transition-colors">Constants Library</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#tester" className="hover:text-white transition-colors">Password Tester</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        {/* Call to action & author */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com/sauravsvt/mathpass"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
          >
            <span>⭐</span>
            <span>GitHub</span>
          </a>

          <a
            href="#generator"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/20 transition-all hover:scale-105"
          >
            ⚡ Generate Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 text-sm text-gray-300">
          <a
            href="#generator"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5"
          >
            Generator
          </a>
          <a
            href="#anti-cracker"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5 text-accent-400"
          >
            🛡️ Anti-Cracker Defense
          </a>
          <a
            href="#constants-table"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5"
          >
            Constants Library
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5"
          >
            How It Works
          </a>
          <a
            href="#tester"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5"
          >
            Password Tester
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5"
          >
            FAQ
          </a>
          <div className="pt-2 text-xs text-gray-500 border-t border-white/5 px-2">
            Open Source · MIT License
          </div>
        </div>
      )}
    </header>
  );
}
