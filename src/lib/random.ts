export interface Rng {
  index(n: number): number;
}

export interface ByteSource {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
}

const UINT32_RANGE = 0x100000000;

function requirePositiveInteger(n: number): void {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`index() requires an integer >= 1, got ${n}`);
  }
}

export function createRng(source?: ByteSource): Rng {
  const cryptoObj = source ?? globalThis.crypto;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Web Crypto getRandomValues is required; refusing to fall back to Math.random');
  }

  return {
    index(n: number): number {
      requirePositiveInteger(n);
      if (n === 1) return 0;

      const limit = Math.floor(UINT32_RANGE / n) * n;
      const buf = new Uint32Array(1);
      for (;;) {
        cryptoObj.getRandomValues(buf);
        const value = buf[0];
        if (value < limit) {
          return value % n;
        }
      }
    },
  };
}

export const cryptoRng: Rng = {
  index(n: number): number {
    return createRng().index(n);
  },
};

export class ScriptedRng implements Rng {
  private i = 0;

  constructor(private readonly values: number[]) {}

  index(n: number): number {
    requirePositiveInteger(n);
    if (this.i >= this.values.length) {
      throw new Error('ScriptedRng exhausted');
    }
    const value = this.values[this.i++];
    if (!Number.isInteger(value) || value < 0 || value >= n) {
      throw new Error(`ScriptedRng value ${value} is not in [0, ${n})`);
    }
    return value;
  }
}
