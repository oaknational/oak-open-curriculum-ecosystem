import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { assertPathWithinBase } from './index.js';

// A pure `realpath` stand-in: maps each input to its canonical (symlink- and
// `..`-resolved) form — the same transformation the real `realpathSync`
// performs — without touching the filesystem. Unknown inputs throw, as
// `realpathSync` does for a path that does not exist.
const canonical =
  (table: Record<string, string>) =>
  (path: string): string => {
    const resolved = table[path];
    if (resolved === undefined) {
      throw new Error(`ENOENT: no such file or directory, realpath '${path}'`);
    }
    return resolved;
  };

describe('assertPathWithinBase', () => {
  it('returns the canonical candidate path when it resolves inside the base', () => {
    const realpath = canonical({
      '/base': '/base',
      '/base/run.json': '/base/run.json',
    });
    expect(assertPathWithinBase('/base/run.json', '/base', { realpath })).toBe('/base/run.json');
  });

  it('rejects a candidate that escapes the base via `..` traversal', () => {
    const realpath = canonical({ '/base': '/base', '/base/../etc/passwd': '/etc/passwd' });
    expect(() => assertPathWithinBase('/base/../etc/passwd', '/base', { realpath })).toThrow(
      /not within/u,
    );
  });

  it('rejects a sibling whose name merely shares the base as a prefix', () => {
    const realpath = canonical({
      '/base': '/base',
      '/base-secret/data.json': '/base-secret/data.json',
    });
    expect(() => assertPathWithinBase('/base-secret/data.json', '/base', { realpath })).toThrow(
      /not within/u,
    );
  });

  it('rejects a candidate that escapes the base through a symlink', () => {
    // The candidate lexically sits under the base, but its real path (the
    // symlink target) is outside — the case a `path.resolve`-only check would
    // wrongly accept.
    const realpath = canonical({ '/base': '/base', '/base/link': '/outside/secret.json' });
    expect(() => assertPathWithinBase('/base/link', '/base', { realpath })).toThrow(/not within/u);
  });

  it('canonicalises the base before comparing, so a symlinked base still contains its children', () => {
    const realpath = canonical({
      '/symlinked-base': '/real/base',
      '/symlinked-base/child.json': '/real/base/child.json',
    });
    expect(
      assertPathWithinBase('/symlinked-base/child.json', '/symlinked-base', { realpath }),
    ).toBe('/real/base/child.json');
  });

  it('throws when the candidate cannot be canonicalised (does not exist)', () => {
    const realpath = canonical({ '/base': '/base' });
    expect(() => assertPathWithinBase('/base/missing.json', '/base', { realpath })).toThrow(
      /ENOENT/u,
    );
  });
});

// The flavour seam: comparisons run through the injected `pathApi`, so each
// platform's containment rules are provable from any host (the changeset's
// provable-from-POSIX pattern). The RETURN value always keeps the
// canonicaliser's own bytes — only the comparison is normalised and (win32
// only) case-folded.
describe('assertPathWithinBase — path flavours', () => {
  it.each([
    {
      label: 'win32 accepts a forward-slash canonical form inside a backslash base',
      pathApi: path.win32,
      base: String.raw`C:\base`,
      candidate: String.raw`C:\base\run.json`,
      table: {
        [String.raw`C:\base`]: 'C:/base',
        [String.raw`C:\base\run.json`]: 'C:/base/run.json',
      },
      returns: 'C:/base/run.json',
    },
    {
      label: 'win32 accepts a case-only difference (case-insensitive filesystems)',
      pathApi: path.win32,
      base: String.raw`C:\Base`,
      candidate: String.raw`c:\base\RUN.json`,
      table: {
        [String.raw`C:\Base`]: String.raw`C:\Base`,
        [String.raw`c:\base\RUN.json`]: String.raw`c:\base\RUN.json`,
      },
      returns: String.raw`c:\base\RUN.json`,
    },
    {
      label: 'win32 accepts a drive-letter case difference between base and candidate',
      pathApi: path.win32,
      base: String.raw`C:\base`,
      candidate: String.raw`c:\base\run.json`,
      table: {
        [String.raw`C:\base`]: String.raw`C:\base`,
        [String.raw`c:\base\run.json`]: String.raw`c:\base\run.json`,
      },
      returns: String.raw`c:\base\run.json`,
    },
    {
      label: 'posix accepts a contained candidate and keeps the canonical bytes',
      pathApi: path.posix,
      base: '/base',
      candidate: '/base/run.json',
      table: { '/base': '/base', '/base/run.json': '/base/run.json' },
      returns: '/base/run.json',
    },
  ])('$label', ({ pathApi, base, candidate, table, returns }) => {
    const realpath = canonical(table);
    expect(assertPathWithinBase(candidate, base, { realpath, pathApi })).toBe(returns);
  });

  it.each([
    {
      label: 'win32 still refuses a genuine escape whatever the separator form',
      pathApi: path.win32,
      base: String.raw`C:\base`,
      candidate: String.raw`C:\base\link`,
      table: {
        [String.raw`C:\base`]: 'C:/base',
        [String.raw`C:\base\link`]: 'C:/outside/secret.json',
      },
    },
    {
      label: 'win32 refuses a sibling sharing the base as a prefix, case-folded',
      pathApi: path.win32,
      base: String.raw`C:\base`,
      candidate: String.raw`c:\BASE-secret\data.json`,
      table: {
        [String.raw`C:\base`]: String.raw`C:\base`,
        [String.raw`c:\BASE-secret\data.json`]: String.raw`c:\BASE-secret\data.json`,
      },
    },
    {
      label: 'posix refuses a case-only difference — POSIX filesystems are case-sensitive',
      pathApi: path.posix,
      base: '/base',
      candidate: '/Base/run.json',
      table: { '/base': '/base', '/Base/run.json': '/Base/run.json' },
    },
  ])('$label', ({ pathApi, base, candidate, table }) => {
    const realpath = canonical(table);
    expect(() => assertPathWithinBase(candidate, base, { realpath, pathApi })).toThrow(
      /not within/u,
    );
  });
});
