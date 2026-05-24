import { describe, expect, it } from 'vitest';

import { charsOverFourTokenizer, type Tokenizer } from './tokenizer.js';

describe('charsOverFourTokenizer', () => {
  it('estimates empty text as zero tokens', () => {
    expect(charsOverFourTokenizer.estimate('')).toBe(0);
  });

  it('uses a ceiling chars-over-four estimate at exact and rounding boundaries', () => {
    expect(charsOverFourTokenizer.estimate('1234')).toBe(1);
    expect(charsOverFourTokenizer.estimate('12345')).toBe(2);
  });

  it('is deterministic for large inputs', () => {
    expect(charsOverFourTokenizer.estimate('a'.repeat(4000))).toBe(1000);
  });

  it('satisfies the Tokenizer interface', () => {
    const tokenizer: Tokenizer = charsOverFourTokenizer;

    expect(tokenizer.estimate('interface call')).toBe(4);
  });
});
