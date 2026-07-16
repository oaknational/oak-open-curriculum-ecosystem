import { describe, expect, it } from 'vitest';

import { getStagedBundle } from './git';

describe('getStagedBundle', () => {
  it('requests explicit changed endpoints and bounded rename policy for the fingerprint', () => {
    const sourcePath = 'notes/current.md';
    const destinationPath = 'notes/active.md';
    const calls: (readonly string[])[] = [];

    getStagedBundle({
      gitRoot: '/repo',
      pathspec: [sourcePath, destinationPath],
      runGit: (args) => {
        calls.push(args);
        return '';
      },
    });

    expect(calls).toStrictEqual([
      ['diff', '--cached', '--no-renames', '--name-only', '--', sourcePath, destinationPath],
      ['diff', '--cached', '--no-renames', '--name-status', '--', sourcePath, destinationPath],
      [
        'diff',
        '--cached',
        '--find-renames=50%',
        '-l1000',
        '--full-index',
        '--binary',
        '--',
        sourcePath,
        destinationPath,
      ],
      ['status', '--short', '--', sourcePath, destinationPath],
    ]);
  });
});
