import { describe, expect, it } from 'vitest';

import { sanitiseTerminalLine } from './terminal-output.js';

const ESC = String.fromCodePoint(0x1b);

describe('sanitiseTerminalLine', () => {
  it('strips ANSI escape sequences an attacker-controllable string could smuggle', () => {
    const forged = `gate: ${ESC}[2K${ESC}[1;32mgreen${ESC}[0m (forged)`;
    expect(sanitiseTerminalLine(forged)).toBe('gate: [2K[1;32mgreen[0m (forged)');
  });

  it('strips C0, DEL, and C1 controls while keeping tab and newline', () => {
    const mixed = [
      'a',
      String.fromCodePoint(0x00),
      'b',
      String.fromCodePoint(0x08),
      'c',
      '\t',
      'd',
      '\n',
      'e',
      String.fromCodePoint(0x7f),
      'f',
      String.fromCodePoint(0x9b),
      'g',
    ].join('');
    expect(sanitiseTerminalLine(mixed)).toBe('abc\td\nefg');
  });

  it('passes ordinary text through untouched', () => {
    const plain = 'plan-state gate: green (9 row(s); UNMAPPED 0) -- verdict ok';
    expect(sanitiseTerminalLine(plain)).toBe(plain);
  });
});
