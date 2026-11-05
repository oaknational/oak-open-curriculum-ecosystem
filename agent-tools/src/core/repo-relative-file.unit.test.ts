import { describe, expect, it } from 'vitest';

import { repoRelativeFileSchema } from './repo-relative-file.js';

describe('repoRelativeFileSchema', () => {
  it.each([
    'docs/a.md',
    '.agent/memory/active/napkin.md',
    'notes..md',
    'docs/v1..2.md',
    'scope/@pkg/a+b_c-d.md',
  ])('accepts %s, a path of plain segments inside the repository', (file) => {
    expect(repoRelativeFileSchema.safeParse(file).success).toBe(true);
  });

  it.each([
    ['a leading slash', '/etc/passwd'],
    ['a drive letter', 'C:/secrets.txt'],
    ['a drive-relative path', 'C:secrets.txt'],
    ['a backslash', String.raw`a\b.md`],
    ['a UNC share', String.raw`\\server\share`],
    ['a parent segment first', '../secrets.md'],
    ['a parent segment inside', 'a/../b.md'],
    ['a parent segment last', 'a/..'],
    ['a home directory', '~/.ssh/id_rsa'],
    ['a variable', '$HOME/x'],
    ['a URL scheme', 'file:///etc/passwd'],
    ['a leading space', ' /etc/passwd'],
    ['a second line', 'a.md\n/etc/passwd'],
    ['an empty segment', 'a//b.md'],
    ['a lone current-directory segment', '.'],
    ['a current-directory segment first', './a.md'],
    ['a current-directory segment inside', 'a/./b.md'],
    ['the empty string', ''],
  ])(
    'refuses %s (%j), which is not one plain spelling of a path inside the repository',
    (_label, file) => {
      expect(repoRelativeFileSchema.safeParse(file).success).toBe(false);
    },
  );

  it('checks a path of four million segments without throwing, so a huge partition is an error result, never a crash', () => {
    const huge = `${'a/'.repeat(4_000_000)}a`;
    expect(repoRelativeFileSchema.safeParse(huge).success).toBe(true);
  });
});
