# MathPass

A client-side password generator that transforms mathematical and physical constants into high-entropy, memorable passwords.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Security: CSPRNG](https://img.shields.io/badge/Security-CSPRNG%20Hardware-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)

---

## Motivation

Standard password generators create strings like `k9#mP$2vL!xQ`. While cryptographically strong, they suffer from rapid human memory decay. Users either write them down on insecure notes or default back to predictable variations like `Password2024!`.

MathPass explores a different approach: **cognitive memory anchoring**. Most people already have long-term mental pathways for famous constants ($\pi$, $e$, $\varphi$, Planck's $h$, or the speed of light $c$). By combining these constants with mnemonic structures and an optional personal secret (private salt), MathPass creates passwords that achieve 80–120+ bits of Shannon entropy while remaining effortless to recall.

---

## Security Architecture

### The Anti-Template Dilemma (Kerckhoffs's Principle)

A common flaw in template-based generators is that an attacker who knows the generator's template pool can construct a targeted dictionary attack. A naive template generator with 30,000 combinations can be exhausted in milliseconds on a modern GPU.

MathPass addresses this via a **Dual-Layer Architecture**:

1. **Layer 1: Cognitive Memory Anchor (The Constant)**  
   The mathematical or physical constant provides a memorable foundation for the user.
2. **Layer 2: Private Secret Salt (Personal Anchor)**  
   Users can supply an optional private secret keyword (e.g. a childhood pet or favorite food). This injects unguessable entropy that no dictionary can predict.
3. **Layer 3: Hardware-Backed CSPRNG**  
   All digit slice offsets, delimiters, and case permutations are drawn using the browser's native `crypto.getRandomValues` Web Crypto API, eliminating pseudo-random predictability.

$$\text{Search Space with Personal Anchor} > 2^{80} \text{ to } 2^{120} \text{ combinations}$$

---

## Features

- **40+ Mathematical & Physical Constants**: Includes $\pi$, Euler's $e$, Golden Ratio $\varphi$, Pythagoras $\sqrt{2}$, $\tau$, Apéry's constant, Ramanujan's constant, Planck's constant $h$, Speed of Light $c$, Boltzmann's $k_B$, Avogadro's $N_A$, and more.
- **6 Password Strategies**:
  - **Smart Mnemonic**: Constant + cognitive word + personal secret anchor.
  - **Punster**: Humorous mathematical puns with decimal digits (`CutiePi@3.1415!`).
  - **Math Formula**: Famous physical and mathematical identities ($E = mc^2$, $e^{i\pi}+1=0$, $PV=nRT$).
  - **Classic Pro**: Clean constant name + randomized decimal sequences.
  - **Mashup**: Two distinct constants mathematically combined.
  - **Hacker Leet**: Math concepts transformed into 1337-speak.
- **Zero-Knowledge Privacy**: 100% client-side execution. No passwords, seeds, or parameters are transmitted across the network.
- **Live Password Auditor**: Real-time entropy and brute-force resistance calculator.
- **Searchable Constants Library**: Interactive reference table with one-click generation.

---

## Development

```bash
# Clone repository
git clone https://github.com/sauravsvt/mathpass.git
cd mathpass

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## License

MIT License. Copyright (c) 2026 Saurav Shriwastav.
