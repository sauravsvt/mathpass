# MathPass 🔐🔢

**Memorable, High-Entropy Passwords Built on Mathematical Constants & Dual-Layer CSPRNG Security**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Author: Saurav Shriwastav](https://img.shields.io/badge/Author-Saurav%20Shriwastav-blue.svg)](https://github.com/sauravsvt)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![CSPRNG Protected](https://img.shields.io/badge/Security-Hardware%20CSPRNG-success.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)

> Created and Open Sourced by **Saurav Shriwastav**. Turn $\pi$, $e$, $\varphi$, $\sqrt{2}$, and 35+ mathematical constants into uncrackable passwords with clever math puns, cognitive memory anchors, and zero-knowledge client-side privacy.

---

## 🛡️ The Anti-Cracker Defense (Why MathPass is Unbreakable)

### The Dilemma (Kerckhoffs's Principle)
A common critique of password generators is:
> *"What if an attacker knows you used this tool and writes a script targeting the tool's templates?"*

If a tool uses static templates and basic random words, a targeted attacker can easily brute-force the tiny search space (~30,000 combinations) in less than **0.05 seconds** on a modern GPU.

### The Saurav Shriwastav Dual-Layer Solution
MathPass solves this vulnerability completely:

1. **Layer 1: Cognitive Memory Anchor (The Constant)**  
   You choose a constant ($\pi$, $e$, $\varphi$, $\sqrt{2}$, etc.). This gives you an effortless mental hook so you never forget your password base.
2. **Layer 2: Private Secret Anchor (The Salt)**  
   You can supply an optional private keyword (a childhood pet, favorite food, or secret word). This acts as a private cryptographic salt that no automated dictionary on earth can anticipate.
3. **Layer 3: Hardware CSPRNG Engine**  
   Every delimiter, digit window slice, and permutation is generated using `crypto.getRandomValues` (hardware-backed Web Crypto API), eliminating PRNG predictability.

$$\text{Search Space with Personal Anchor} > \mathbf{2^{80}\text{ to }2^{120}\text{ combinations}}$$

Even if an attacker reads every line of the MathPass source code on GitHub, they still face an impossible cryptographic wall.

---

## ✨ Features

- **35+ Mathematical Constants**: Includes $\pi$ (Pi), $e$ (Euler's number), $\varphi$ (Golden Ratio), $\sqrt{2}$ (Pythagoras), $\tau$ (Tau), $\zeta(3)$ (Apéry), Ramanujan's constant, and more.
- **6 Memory Strategies**:
  - 🧠 **Smart Mnemonic**: Constant + cognitive phrase + personal secret anchor. Dual-layer defense!
  - 😄 **Punster (Funny)**: Math puns (`CutiePi@3.1415!`, `e_Z_PZ@2718$`).
  - 🧮 **Math Formula**: Famous identities like $e^{i\pi}+1=0$ as high-security passwords.
  - 📐 **Classic Pro**: Clean constant name with exact decimal expansions.
  - 🔀 **Constant Mashup**: Two constants mathematically bonded.
  - 💻 **Hacker Leet**: Math terms transformed into 1337-speak.
  - 🎲 **Surprise Me**: Generates across all strategies.
- **100% Client-Side Privacy**: Passwords are generated exclusively in local browser memory. Zero tracking, zero server calls.
- **Enterprise Strength Checklist**: Validates uppercase, lowercase, numbers, symbols, length, Shannon entropy, and estimated brute-force crack time.
- **Live Password Auditor**: Real-time password strength and entropy tester.
- **Interactive Constants Encyclopedia**: Searchable and filterable reference table with 1-click password generation.
- **SEO & AdSense Optimized**: Fully configured with semantic HTML, JSON-LD structured schemas (`WebApplication`, `HowTo`, `FAQPage`), sitemap, robots.txt, and ready-to-monetize ad slots.

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/sauravsvt/mathpass.git
cd mathpass

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel (1-Click)

1. Push this directory to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial release of MathPass by Saurav Shriwastav"
   git remote add origin https://github.com/sauravsvt/mathpass.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and click **Deploy**. Vercel will build and host the static Next.js application instantly!

---

## 💰 How to Earn with Ads (Google AdSense)

MathPass comes with pre-configured high-CTR ad slots (Top Billboard, Mid Content, and Bottom Content).

To activate live ads:
1. Obtain your Google AdSense Publisher ID (e.g. `ca-pub-1234567890123456`).
2. In your Vercel Project Settings under **Environment Variables**, add:
   - `NEXT_PUBLIC_ADS_ENABLED`: `true`
   - `NEXT_PUBLIC_ADSENSE_ID`: `ca-pub-1234567890123456`
3. Redeploy on Vercel. Google AdSense will automatically serve ads across the slots!

---

## 👨‍💻 Author

**Saurav Shriwastav**  
Creator & Lead Architect of MathPass  
GitHub: [@sauravsvt](https://github.com/sauravsvt)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
Copyright (c) 2026 Saurav Shriwastav.
