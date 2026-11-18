import { describe, expect, it } from 'vitest';

import { toGitPath } from './git-relative-path.js';

describe('toGitPath', () => {
  it('converts a Windows-separator relative path to git form', () => {
    expect(toGitPath(String.raw`.agent\plans\rule.json`, '\\')).toBe('.agent/plans/rule.json');
  });

  it('leaves a POSIX relative path untouched', () => {
    expect(toGitPath('.agent/plans/rule.json', '/')).toBe('.agent/plans/rule.json');
  });

  it('preserves a backslash inside a POSIX filename (backslash is a legal character there)', () => {
    expect(toGitPath(String.raw`odd\name.md`, '/')).toBe(String.raw`odd\name.md`);
  });
});
