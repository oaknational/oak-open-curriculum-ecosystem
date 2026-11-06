import { describe, expect, it } from 'vitest';

import { refuseNonBasenames, ruleNameRefusal } from './rule-name.js';

const REASON =
  'not a rule basename (lowercase letters and digits in single-hyphen groups: one path segment, no dot segment, no .md suffix)';

describe('ruleNameRefusal', () => {
  it.each(['alpha', 'no-type-shortcuts', 'a1-b2', 'x'])('admits %j', (name) => {
    expect(ruleNameRefusal(name)).toBeUndefined();
  });

  it.each([
    'Alpha',
    'a_b',
    'a--b',
    '-a',
    'a-',
    'a b',
    'a|b',
    'al`pha',
    'a\nb',
    'a/b',
    String.raw`a\b`,
    '/abs',
    '',
    '.',
    '..',
    'alpha.md',
  ])('refuses %j, quoting the name', (name) => {
    expect(ruleNameRefusal(name)).toBe(`${JSON.stringify(name)}: ${REASON}`);
  });
});

describe('refuseNonBasenames', () => {
  it('lists one reason per refused name in input order and none for the admitted', () => {
    expect(refuseNonBasenames(['alpha', 'Alpha', 'beta', ''])).toStrictEqual([
      `"Alpha": ${REASON}`,
      `"": ${REASON}`,
    ]);
  });
});
