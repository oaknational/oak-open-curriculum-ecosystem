import { describe, expect, it } from 'vitest';

import { withoutForwardingSeparators } from './repo-check.js';

/**
 * The entry's reading of pnpm's forwarding separator: one `--` before the
 * command (`pnpm agent-tools:repo-check -- profile`) or after it, when a root
 * script already names the command (`pnpm check:profile -- --dry-run`), is
 * pnpm's and dropped. Any other `--` is an argument, and the command table
 * refuses it with usage.
 */
describe('withoutForwardingSeparators', () => {
  it('drops one separator before the command', () => {
    expect(withoutForwardingSeparators(['--', 'profile', '--dry-run'])).toStrictEqual([
      'profile',
      '--dry-run',
    ]);
  });

  it('drops one separator after the command, where a root script forwards its flags', () => {
    expect(withoutForwardingSeparators(['profile', '--', '--dry-run'])).toStrictEqual([
      'profile',
      '--dry-run',
    ]);
  });

  it('drops one in each place when both are present', () => {
    expect(withoutForwardingSeparators(['--', 'profile', '--', '--dry-run'])).toStrictEqual([
      'profile',
      '--dry-run',
    ]);
  });

  it('keeps a second leading separator as an argument, for the command table to refuse', () => {
    expect(withoutForwardingSeparators(['--', '--', 'profile'])).toStrictEqual(['--', 'profile']);
  });

  it('keeps a separator after a flag as an argument', () => {
    expect(withoutForwardingSeparators(['profile', '--dry-run', '--'])).toStrictEqual([
      'profile',
      '--dry-run',
      '--',
    ]);
  });

  it('leaves argv without a separator as it is', () => {
    expect(withoutForwardingSeparators(['prettier-tracked', '--write'])).toStrictEqual([
      'prettier-tracked',
      '--write',
    ]);
  });

  it('reads a lone separator, and no argument at all, as no command', () => {
    expect(withoutForwardingSeparators(['--'])).toStrictEqual([]);
    expect(withoutForwardingSeparators([])).toStrictEqual([]);
  });
});
