/**
 * Unit tests for the identity-naming token vocabulary and scanning primitives.
 *
 * @remarks
 * Every forbidden-token fixture is string-constructed (principles §"Never
 * weaken a gate to solve a testing problem") so this test file never contains
 * the outgoing name or initialism as a literal — the validator it proves
 * guards this file too.
 */

import { describe, expect, it } from 'vitest';

import { countVariants, findContentHits, hasAnyCount } from './validate-identity-naming-tokens.js';

/** The outgoing name in title case, string-constructed. */
const NAME_TITLE = ['Free', 'donia'].join('');
/** The outgoing name in lower case, string-constructed. */
const NAME_LOWER = ['free', 'donia'].join('');
/** The demonym (title-case name + n), which contains the name as a substring. */
const DEMONYM = `${NAME_TITLE}n`;
/** The upper initialism, string-constructed. */
const INITIALISM_UPPER = ['FD', 'SE'].join('');
/** The lower initialism, string-constructed. */
const INITIALISM_LOWER = ['fd', 'se'].join('');
/** A mixed-case base64-like run that must NEVER count (the lesson-deck trap). */
const BASE64_TRAP = ['Fd', 'se'].join('') + '63A+02taZpAoqIVpsA2Eh';

const ZERO = { name: 0, initialismUpper: 0, initialismLower: 0 };

describe('countVariants', () => {
  it('pools every casing of the name into the case-insensitive count', () => {
    const text = `${NAME_TITLE} and ${NAME_LOWER} and ${NAME_TITLE.toUpperCase()}`;
    expect(countVariants(text)).toEqual({ ...ZERO, name: 3 });
  });

  it('counts the demonym and possessive because they contain the name', () => {
    const text = `The ${DEMONYM} curriculum is ${NAME_TITLE}’s pride`;
    expect(countVariants(text).name).toBe(2);
  });

  it('counts the initialisms case-sensitively and separately', () => {
    const text = `${INITIALISM_UPPER} twice ${INITIALISM_UPPER}, ${INITIALISM_LOWER}-icon once`;
    expect(countVariants(text)).toEqual({ name: 0, initialismUpper: 2, initialismLower: 1 });
  });

  it('never counts mixed-case runs — the base64 payload trap', () => {
    expect(countVariants(BASE64_TRAP)).toEqual(ZERO);
    expect(hasAnyCount(countVariants(BASE64_TRAP))).toBe(false);
  });
});

describe('findContentHits', () => {
  it('reports 1-indexed line and column per occurrence for navigation', () => {
    const content = `clean line\n  ${NAME_TITLE} here\n${INITIALISM_LOWER}-icon`;
    const hits = findContentHits('a.md', content);
    expect(hits).toEqual([
      { file: 'a.md', kind: 'content', line: 2, column: 3, variant: 'name' },
      { file: 'a.md', kind: 'content', line: 3, column: 1, variant: 'initialism-lower' },
    ]);
  });
});
