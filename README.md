# MathPass

A client-side passphrase generator that builds memorable passwords from a public mathematical cue plus uniformly random dictionary words, and shows exactly how many bits of entropy each one has.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Security: CSPRNG](https://img.shields.io/badge/Security-CSPRNG%20Web%20Crypto-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)

<a href="https://alternativeto.net/software/mathpass/about/?utm_source=badge&utm_medium=referral" target="_blank">
  <img src="https://alternativeto.net/static/badges/badge-compact-color.svg"
       alt="MathPass | AlternativeTo"
       width="244" height="79"
       style="width: 244px; height: 79px;" />
</a>

---

## Motivation

Standard password generators create strings like `k9#mP$2vL!xQ`. They are dense and easy to forget. Template generators that only shuffle a few puns and digit slices are easy to remember and also easy to enumerate once the source is public.

MathPass keeps a constant you already know (π, e, φ, Planck's h, the speed of light c) as a **memory cue**, then adds words drawn uniformly from the official [EFF long wordlist](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases) (CC BY 3.0). The list has 7,776 words = 6^5, so each word is five dice and contributes log2(7776) ≈ 12.92 bits. The string on screen is the string you remember.

---

## Security model

The attacker is assumed to have this source. The words are the secret.

Generated strength is:

```text
H = log2(|anchors|) + log2(|separators|) + wordCount * log2(7776)
```

Cues are magnitude-correct (`Gamma0.57722` for γ ≈ 0.577, never a shifted decimal). Famous digits and the constant itself are public, so they add 0 bits when the constant is pinned. A user-chosen separator adds 0 bits. Optional personal text is appended exactly as typed and is **estimated separately**, capped at 32 bits, and never included in the headline number.

Each sample also has a mixed-radix rank: it is output #r of the keyspace, which you can unrank. Site length limits fail instead of silently resampling a smaller set.

| Preset   | Target | Typical (random constant, random separator) |
|----------|--------|-----------------------------------------------|
| Everyday | ≥ 60 bits | 4 words, about 60.2 bits |
| Strong (default) | ≥ 72 bits | 5 words, about 73.1 bits |
| Master   | ≥ 80 bits | 6 words, about 86.0 bits |

Randomness comes from `crypto.getRandomValues` with rejection sampling. If Web Crypto is missing, generation throws. There is no non-cryptographic fallback.

Crack-time labels state two rates: about 10^12 guesses/s for a fast hash, and about 10^5/s for a slow hash. Actual time depends on the site.

---

## Features

- **44 mathematical and physical constants** as public ASCII cues (`Pi3.1416`, `Light299792458`, `Gamma0.57722`).
- **3 cue styles**: Constant, Pun, and Formula. Formula magnitudes join with a colon (`PV=nRT:8.3145`) so the identity is not a false equation.
- **Entropy ledger** with per-term choices, dice codes, running bits, and mixed-radix rank.
- **Decoder** in the tester: a MathPass passphrase shows exact generated bits, not a zxcvbn guess.
- **Generated in the browser**. MathPass does not send the password to a MathPass server.
- **Searchable constants library** with one-click generation.

Wordlist: Electronic Frontier Foundation long list, 7,776 tokens including the four hyphenated entries, SHA-256 pinned in `src/lib/wordlist.ts`. [CC BY 3.0](https://www.eff.org/copyright).

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

# Run tests
npm test
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## License

MIT License. Copyright (c) 2026 Saurav Shriwastav.
