import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_CONSTANT } from './accounting';

const BANNED =
  /uncrackable|unbreakable|bulletproof|impossible cryptographic|zero-knowledge|2⁸⁰|2\^80|2¹²⁰|80[–-]120|50-100\+|Quintillions|hardware-grade|Gamma5\.7721|PV=nRT[0-9]|\$e\$|\$\\varphi\$/i;

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry === 'data') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (/\.(ts|tsx|md|js|json)$/.test(entry) && !entry.endsWith('.test.ts')) {
      files.push(full);
    }
  }
  return files;
}

describe('security copy', () => {
  it('does not reintroduce banned claims', () => {
    const root = join(__dirname, '../..');
    const files = [...walk(join(root, 'src')), join(root, 'README.md'), join(root, 'package.json')];
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      const match = text.match(BANNED);
      if (match) {
        hits.push(`${file}: ${match[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('locks README typical bits to the accounting module', () => {
    const readme = readFileSync(join(__dirname, '../../README.md'), 'utf8');
    expect(readme).toContain(`${DEFAULT_CONSTANT.everyday.bits.toFixed(1)} bits`);
    expect(readme).toContain(`${DEFAULT_CONSTANT.strong.bits.toFixed(1)} bits`);
    expect(readme).toContain(`${DEFAULT_CONSTANT.master.bits.toFixed(1)} bits`);
    expect(readme).toContain('7,776');
  });
});
