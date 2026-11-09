import { describe, expect, it } from 'vitest';

import { parsePrTarget } from './gh.js';

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
