import { describe, expect, it } from 'vitest';

import { parsePrTarget, resolveGhPath } from './gh.js';

describe('resolveGhPath', () => {
  it('probes the known absolute locations and returns the first that exists', () => {
    const path = resolveGhPath(undefined, (candidate) => candidate === '/usr/local/bin/gh');
    expect(path).toBe('/usr/local/bin/gh');
  });

  it('throws a helpful error when gh is found nowhere', () => {
    expect(() => resolveGhPath(undefined, () => false)).toThrow(/gh CLI not found/u);
  });

  it('accepts a valid absolute override', () => {
    expect(resolveGhPath('/custom/bin/gh', () => true)).toBe('/custom/bin/gh');
  });

  it('rejects a relative override, a wrong basename, and a missing override', () => {
    expect(() => resolveGhPath('bin/gh', () => true)).toThrow(/absolute path/u);
    expect(() => resolveGhPath('/custom/bin/hub', () => true)).toThrow(/named gh/u);
    expect(() => resolveGhPath('/custom/bin/gh', () => false)).toThrow(/does not exist/u);
  });
});

describe('parsePrTarget', () => {
  it('accepts a bare PR number with no repo', () => {
    expect(parsePrTarget('221')).toStrictEqual({ number: 221, repo: undefined });
  });

  it('accepts a PR number with an explicit owner/repo', () => {
    expect(parsePrTarget('221', 'oaknational/oak-open-curriculum-ecosystem')).toStrictEqual({
      number: 221,
      repo: 'oaknational/oak-open-curriculum-ecosystem',
    });
  });

  it('parses a strict github pull URL into number + repo', () => {
    expect(parsePrTarget('https://github.com/oaknational/oak/pull/42')).toStrictEqual({
      number: 42,
      repo: 'oaknational/oak',
    });
  });

  it('rejects a non-numeric / flag-shaped PR identifier (arg-injection guard)', () => {
    expect(() => parsePrTarget('--foo')).toThrow(/Invalid PR identifier/u);
    expect(() => parsePrTarget('221; rm -rf /')).toThrow(/Invalid PR identifier/u);
    expect(() => parsePrTarget('0')).toThrow(/Invalid PR identifier/u);
  });

  it('rejects a malformed --repo', () => {
    expect(() => parsePrTarget('221', 'not-a-repo')).toThrow(/Invalid --repo/u);
  });

  it('rejects flag-shaped and traversal-shaped repo segments', () => {
    expect(() => parsePrTarget('221', '-rf/x')).toThrow(/Invalid --repo/u);
    expect(() => parsePrTarget('221', '../x')).toThrow(/Invalid --repo/u);
    expect(() => parsePrTarget('221', 'x/..')).toThrow(/Invalid --repo/u);
  });

  it('accepts single-character owner/repo segments', () => {
    expect(parsePrTarget('221', 'a/b')).toStrictEqual({ number: 221, repo: 'a/b' });
  });

  it('throws when a URL repo and an explicit --repo conflict (never silently pick one)', () => {
    expect(() => parsePrTarget('https://github.com/o/r/pull/7', 'other/repo')).toThrow(
      /conflicts/u,
    );
  });

  it('accepts a URL plus a --repo that matches it', () => {
    expect(parsePrTarget('https://github.com/o/r/pull/7', 'o/r')).toStrictEqual({
      number: 7,
      repo: 'o/r',
    });
  });
});
