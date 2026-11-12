import { describe, expect, it } from 'vitest';

import { isPathInScope } from './path-scope.js';

/**
 * The path scoping shared by the write-hook and the whole-tree gates that
 * reuse the policy's blocks. Three scope forms: a substring, a `**\/*`
 * suffix, and a root-anchored path led by `./` (a substring exclusion let a
 * nested copy of an exempt path bypass the gate).
 */
describe('isPathInScope', () => {
  it('a substring scope matches anywhere in the path, a slash-led one included', () => {
    expect(isPathInScope('a/hooks/policy.json', [''], ['hooks/policy.json'])).toBe(false);
    expect(isPathInScope('a/other.json', [''], ['hooks/policy.json'])).toBe(true);
    expect(isPathInScope('pkg/tests/x.ts', [''], ['/tests/'])).toBe(false);
  });

  it('a suffix scope matches the path end', () => {
    expect(isPathInScope('x/y.plan.md', ['**/*.plan.md'])).toBe(true);
    expect(isPathInScope('x/y.md', ['**/*.plan.md'])).toBe(false);
  });

  it('a root-anchored scope matches only from the repository root, never a nested copy', () => {
    const excludes = ['./.agent/hooks/policy.json', './.agent/memory/'];
    expect(isPathInScope('.agent/hooks/policy.json', [''], excludes)).toBe(false);
    expect(isPathInScope('.agent/memory/active/napkin.md', [''], excludes)).toBe(false);
    expect(isPathInScope('evil/.agent/hooks/policy.json', [''], excludes)).toBe(true);
    expect(isPathInScope('docs/.agent/memory/x.md', [''], excludes)).toBe(true);
  });

  it('with the repo root known, an absolute path inside it is anchored at that root', () => {
    const excludes = ['./.agent/hooks/policy.json'];
    const posix = { repoRoot: '/checkout/repo', separator: '/' } as const;
    expect(isPathInScope('/checkout/repo/.agent/hooks/policy.json', [''], excludes, posix)).toBe(
      false,
    );
    expect(
      isPathInScope('/checkout/repo/evil/.agent/hooks/policy.json', [''], excludes, posix),
    ).toBe(true);
  });

  it('a root-anchored scope never matches a path outside the repository', () => {
    const excludes = ['./.agent/hooks/policy.json'];
    expect(
      isPathInScope('/elsewhere/.agent/hooks/policy.json', [''], excludes, {
        repoRoot: '/checkout/repo',
        separator: '/',
      }),
    ).toBe(true);
    expect(isPathInScope('/elsewhere/.agent/hooks/policy.json', [''], excludes)).toBe(true);
  });

  it('a file entry anchors the file itself or a descendant, never a sibling sharing the name', () => {
    const excludes = ['./.agent/hooks/policy.json', './.agent/memory/'];
    expect(isPathInScope('.agent/hooks/policy.json.bak', [''], excludes)).toBe(true);
    expect(isPathInScope('.agent/hooks/policy.json/inner.json', [''], excludes)).toBe(false);
    expect(isPathInScope('.agent/memory-notes/x.md', [''], excludes)).toBe(true);
  });

  it('on a backslash host, a Windows path and root read through their separators (drive letter and UNC)', () => {
    const excludes = ['./.agent/hooks/policy.json'];
    const windows = { repoRoot: String.raw`C:\repo`, separator: '\\' } as const;
    expect(
      isPathInScope(String.raw`C:\repo\.agent\hooks\policy.json`, [''], excludes, windows),
    ).toBe(false);
    expect(
      isPathInScope(String.raw`C:\repo\nested\.agent\hooks\policy.json`, [''], excludes, windows),
    ).toBe(true);
    expect(
      isPathInScope(String.raw`\\server\share\repo\.agent\hooks\policy.json`, [''], excludes, {
        repoRoot: String.raw`\\server\share\repo`,
        separator: '\\',
      }),
    ).toBe(false);
    // The substring and suffix forms read the same separators on that host.
    const host = { separator: '\\' } as const;
    expect(isPathInScope(String.raw`a\hooks\policy.json`, [''], ['hooks/policy.json'], host)).toBe(
      false,
    );
    expect(
      isPathInScope(String.raw`a\hooks\policy.json`, ['**/*hooks/policy.json'], [], host),
    ).toBe(true);
  });

  it('on a POSIX host, a backslash is a character of a name and claims no exemption', () => {
    const excludes = ['./.agent/hooks/policy.json'];
    const posix = { separator: '/' } as const;
    expect(isPathInScope(String.raw`.agent\hooks\policy.json`, [''], excludes, posix)).toBe(true);
    expect(isPathInScope(String.raw`a\hooks\policy.json`, [''], ['hooks/policy.json'], posix)).toBe(
      true,
    );
  });

  it('a relative path the caller cannot place claims no anchored exemption, though substring scopes still read it', () => {
    const hook = { repoRoot: '/checkout/repo', relativeIsRepoRelative: false } as const;
    expect(
      isPathInScope('.agent/hooks/policy.json', [''], ['./.agent/hooks/policy.json'], hook),
    ).toBe(true);
    expect(isPathInScope('a/hooks/policy.json', [''], ['hooks/policy.json'], hook)).toBe(false);
  });

  it('an undefined path is never in scope', () => {
    expect(isPathInScope(undefined, [''])).toBe(false);
  });
});
