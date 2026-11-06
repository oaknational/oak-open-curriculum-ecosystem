import { describe, expect, it } from 'vitest';

import { trimEndWhile } from './trim-end-while.js';

/** True for a trailing newline. */
const isNewline = (character: string): boolean => character === '\n';

describe('trimEndWhile', () => {
  it('removes the whole trailing run the predicate accepts', () => {
    expect(trimEndWhile('body\n\n\n', isNewline)).toBe('body');
  });

  it('leaves a text whose last character the predicate refuses', () => {
    expect(trimEndWhile('body\nmore', isNewline)).toBe('body\nmore');
  });

  it('returns the empty string when every character is in the run', () => {
    expect(trimEndWhile('\n\n', isNewline)).toBe('');
  });

  it('returns the empty string for the empty string', () => {
    expect(trimEndWhile('', isNewline)).toBe('');
  });

  it('trims only from the end, never an interior run', () => {
    expect(trimEndWhile('a\n\nb\n', isNewline)).toBe('a\n\nb');
  });
});
