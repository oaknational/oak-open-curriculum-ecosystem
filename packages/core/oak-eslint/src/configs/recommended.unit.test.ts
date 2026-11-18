import { describe, expect, it } from 'vitest';
import { recommended } from './recommended.js';
import { lintFixture } from './test-helpers/lint-fixture.js';

/**
 * The recommended config refuses each class the code-quality analyser's
 * security and reliability findings fell into, at the lint surface: one
 * pathogen fixture per rule twin locked at `error`
 * (`quality-analyser-security-reliability-to-zero`, criterion 2). A regression
 * here would let the class regrow between analyser readings.
 */

const ruleIdsOf = (code: string): readonly string[] =>
  lintFixture(recommended, code, 'fixture.ts').ruleIds;

describe('@oaknational/eslint-plugin-standards recommended config: analyser twins', () => {
  it('reports sonarjs/super-linear-regex for adjacent quantifiers that can overlap (S8786)', () => {
    // The shape the review-text parsers carried: blanks, then a quoted title to the end.
    const code = ['export const TITLE = /\\s+"[^"]*"$/u;', ''].join('\n');

    expect(ruleIdsOf(code)).toContain('sonarjs/super-linear-regex');
  });

  it('reports sonarjs/pseudo-random for Math.random (S2245)', () => {
    const code = ['export const jitter = Math.random() * 100;', ''].join('\n');

    expect(ruleIdsOf(code)).toContain('sonarjs/pseudo-random');
  });

  it('reports sonarjs/hashing for an MD5 digest (S4790)', () => {
    const code = [
      "import { createHash } from 'node:crypto';",
      "export const id = createHash('md5').update('seed').digest('hex');",
      '',
    ].join('\n');

    expect(ruleIdsOf(code)).toContain('sonarjs/hashing');
  });

  it('reports sonarjs/updated-loop-counter for a counter assigned in the body (S2310)', () => {
    const code = [
      'export function firstBlank(items: readonly string[]): number {',
      '  let found = -1;',
      '  for (let index = 0; index < items.length; index += 1) {',
      "    if (items[index] === '') {",
      '      found = index;',
      '      index = items.length;',
      '    }',
      '  }',
      '  return found;',
      '}',
      '',
    ].join('\n');

    expect(ruleIdsOf(code)).toContain('sonarjs/updated-loop-counter');
  });

  it('reports sonarjs/no-all-duplicated-branches for identical branches (S3923)', () => {
    const code = [
      'export function label(flag: boolean): string {',
      '  if (flag) {',
      "    return 'same';",
      '  } else {',
      "    return 'same';",
      '  }',
      '}',
      '',
    ].join('\n');

    expect(ruleIdsOf(code)).toContain('sonarjs/no-all-duplicated-branches');
  });

  it('reports unicorn/no-object-as-default-parameter for an object-literal default (S7737)', () => {
    const code = [
      'export function run(options = { retries: 3 }): number {',
      '  return options.retries;',
      '}',
      '',
    ].join('\n');

    expect(ruleIdsOf(code)).toContain('unicorn/no-object-as-default-parameter');
  });
});
