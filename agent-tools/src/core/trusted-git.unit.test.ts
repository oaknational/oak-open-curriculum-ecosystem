import { describe, expect, it } from 'vitest';

import { resolveTrustedGit } from './trusted-git.js';

describe('resolveTrustedGit', () => {
  it('returns the first trusted directory that holds git', () => {
    // Only /opt/homebrew/bin/git "exists" — a common macOS Homebrew layout.
    const exists = (candidate: string): boolean => candidate === '/opt/homebrew/bin/git';

    expect(resolveTrustedGit(exists)).toBe('/opt/homebrew/bin/git');
  });

  it('prefers the earliest trusted directory when several hold git', () => {
    const exists = (): boolean => true;

    expect(resolveTrustedGit(exists)).toBe('/usr/bin/git');
  });

  it('throws a loud, actionable error naming the searched dirs and remedy when no trusted git exists', () => {
    const exists = (): boolean => false;

    // Fail loud: never return an unverified path that would surface downstream
    // as an opaque ENOENT (the commit-msg hook blocking every commit).
    expect(() => resolveTrustedGit(exists)).toThrow(/No trusted git binary found\. Searched: /);
    expect(() => resolveTrustedGit(exists)).toThrow(/symlink it into one of those directories/);
  });
});
