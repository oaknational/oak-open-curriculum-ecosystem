import { describe, expect, it } from 'vitest';

import { checkIdentityPackTier } from './boundary-inventory.js';
import { listPackFiles, readIdentityPackTier } from './boundary-tier-reader.js';
import type { TierDirent, TierFileSystem, TierPathKind } from './boundary-tier-reader.js';

const TIER = '/repo/packages/design/identities';

function dirent(name: string, kind: 'dir' | 'file' | 'symlink'): TierDirent {
  return {
    name,
    isDirectory: kind === 'dir',
    isFile: kind === 'file',
    isSymbolicLink: kind === 'symlink',
  };
}

/** In-memory TierFileSystem over a directory→entries map and a
 *  path→content map, recording readTextFile AND readDir calls so a test
 *  can prove a path was NEVER dereferenced or listed. `kinds` overrides
 *  classifyPath for paths that are not plain directories/files (the
 *  symlinked-tier case). */
function fakeFileSystem(
  directories: Record<string, readonly TierDirent[]>,
  fileContents: Record<string, string> = {},
  kinds: Record<string, TierPathKind> = {},
): TierFileSystem & { readTextFileCalls: string[]; readDirCalls: string[] } {
  const readTextFileCalls: string[] = [];
  const readDirCalls: string[] = [];
  return {
    readTextFileCalls,
    readDirCalls,
    classifyPath: (path) => {
      const override = kinds[path];
      if (override !== undefined) {
        return override;
      }
      if (path in directories) {
        return 'directory';
      }
      return path in fileContents ? 'file' : 'absent';
    },
    readDir: (path) => {
      readDirCalls.push(path);
      return directories[path] ?? [];
    },
    readTextFile: (path) => {
      readTextFileCalls.push(path);
      const content = fileContents[path];
      if (content === undefined) {
        throw new Error(`fake filesystem has no file at ${path}`);
      }
      return content;
    },
  };
}

const packManifest = JSON.stringify({ name: '@oaknational/identity-pack-tango' });

describe('listPackFiles', () => {
  it('lists nested files and symlinks by pack-relative path, skipping only enumerated transients', () => {
    const fs = fakeFileSystem({
      [`${TIER}/tango`]: [
        dirent('package.json', 'file'),
        dirent('dtcg', 'dir'),
        dirent('node_modules', 'dir'),
        dirent('.turbo', 'dir'),
        dirent('.DS_Store', 'file'),
        dirent('escape-hatch', 'symlink'),
      ],
      [`${TIER}/tango/dtcg`]: [dirent('core.tokens.json', 'file'), dirent('linked', 'symlink')],
    });
    const { files, symlinks } = listPackFiles(fs, `${TIER}/tango`);
    expect(files).toEqual(['package.json', 'dtcg/core.tokens.json']);
    expect(symlinks).toEqual(['dtcg/linked', 'escape-hatch']);
  });
});

describe('listPackFiles: transient exemption binds name AND kind', () => {
  it('lists a symlink wearing a transient name instead of exempting it', () => {
    // REGRESSION (PR #909 round-6 thread): the name-only exemption let a
    // symlink named node_modules ride out of the symlinks listing.
    const fs = fakeFileSystem({
      [`${TIER}/tango`]: [dirent('node_modules', 'symlink'), dirent('.DS_Store', 'dir')],
      [`${TIER}/tango/.DS_Store`]: [dirent('index.ts', 'file')],
    });
    const { files, symlinks } = listPackFiles(fs, `${TIER}/tango`);
    expect(symlinks).toEqual(['node_modules']);
    // A .DS_Store DIRECTORY is not the transient shape either — its
    // contents face the anatomy like any other committed directory.
    expect(files).toEqual(['.DS_Store/index.ts']);
  });
});

describe('readIdentityPackTier: transient exemption binds name AND kind', () => {
  it('refuses a tier-level symlink wearing a transient name', () => {
    const fs = fakeFileSystem({ [TIER]: [dirent('.turbo', 'symlink')] });
    const { entries } = readIdentityPackTier(fs, TIER);
    expect(entries).toEqual([
      {
        directoryName: '.turbo',
        packageJson: undefined,
        files: [],
        symlinks: [],
        selfIsSymlink: true,
      },
    ]);
  });

  it('validates a .DS_Store directory at tier level as a pack-shaped child', () => {
    const fs = fakeFileSystem({
      [TIER]: [dirent('.DS_Store', 'dir')],
      [`${TIER}/.DS_Store`]: [dirent('index.ts', 'file')],
    });
    const { entries } = readIdentityPackTier(fs, TIER);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.files).toEqual(['index.ts']);
  });
});

describe('readIdentityPackTier', () => {
  it('reports a missing tier directory', () => {
    const fs = fakeFileSystem({});
    expect(readIdentityPackTier(fs, TIER)).toEqual({
      tierState: 'missing',
      strayRootEntries: [],
      entries: [],
    });
  });

  it('refuses a symlinked tier path by KIND without listing it — the target is never read', () => {
    // REGRESSION (PR #909 round-5 thread): exists/readdir both follow a
    // symlink standing AT the tier path, so a linked tier had its target
    // validated despite the no-dereference guarantee.
    const fs = fakeFileSystem({}, {}, { [TIER]: 'symlink' });
    expect(readIdentityPackTier(fs, TIER)).toEqual({
      tierState: 'wrong-kind',
      strayRootEntries: [],
      entries: [],
    });
    expect(fs.readDirCalls).toEqual([]);
    expect(fs.readTextFileCalls).toEqual([]);
  });

  it('validates a dot-prefixed tier directory instead of exempting it — no hidden-content bypass', () => {
    // REGRESSION (PR #909 round-5 suppressed): a blanket dot-name skip let
    // a committed hidden directory carry source outside the boundary.
    const fs = fakeFileSystem({
      [TIER]: [dirent('.rogue', 'dir')],
      [`${TIER}/.rogue`]: [dirent('index.ts', 'file')],
    });
    const reading = readIdentityPackTier(fs, TIER);
    expect(reading.entries).toHaveLength(1);
    expect(reading.entries[0]?.directoryName).toBe('.rogue');
    expect(reading.entries[0]?.files).toEqual(['index.ts']);
  });

  it('reports a stray tier-root file and admits the tier README', () => {
    // REGRESSION (PR #909 round-5 suppressed): every root file was
    // silently discarded, so a stray index.ts sat outside all validation.
    const fs = fakeFileSystem({
      [TIER]: [dirent('README.md', 'file'), dirent('index.ts', 'file')],
    });
    expect(readIdentityPackTier(fs, TIER).strayRootEntries).toEqual(['index.ts']);
  });

  it('reads a well-shaped pack, with manifest presence derived from the inventory', () => {
    const fs = fakeFileSystem(
      { [TIER]: [dirent('tango', 'dir')], [`${TIER}/tango`]: [dirent('package.json', 'file')] },
      { [`${TIER}/tango/package.json`]: packManifest },
    );
    const { entries } = readIdentityPackTier(fs, TIER);
    expect(entries).toEqual([
      {
        directoryName: 'tango',
        packageJson: { name: '@oaknational/identity-pack-tango' },
        files: ['package.json'],
        symlinks: [],
      },
    ]);
  });

  it('surfaces a tier child that is itself a symlink as a refusable entry — never dropped, never followed', () => {
    // REGRESSION (PR #909 round-3 thread): an unfollowed directory-symlink
    // reports isSymbolicLink and NOT isDirectory, so a directories-only
    // filter silently dropped the pack from validation entirely.
    const fs = fakeFileSystem({ [TIER]: [dirent('tango', 'symlink')] });
    const { tierState, entries } = readIdentityPackTier(fs, TIER);
    expect(tierState).toBe('present');
    expect(entries).toEqual([
      {
        directoryName: 'tango',
        packageJson: undefined,
        files: [],
        symlinks: [],
        selfIsSymlink: true,
      },
    ]);
    // The policy end of the same regression: the entry is refused, so the
    // tier can never validate OK while carrying a symlinked pack.
    expect(
      checkIdentityPackTier({ tierState, strayRootEntries: [], entries }).join('\n'),
    ).toContain('is a symbolic link');
    expect(fs.readTextFileCalls).toEqual([]);
  });

  it('reports a symlinked package.json as an absent manifest WITHOUT dereferencing it', () => {
    // REGRESSION (PR #909 round-3 thread): exists/read both follow links,
    // so the validator read outside the pack boundary before refusing.
    // The fake carries a perfectly valid manifest at the link path — if the
    // reader dereferenced, packageJson would parse and the calls list would
    // name the path.
    const fs = fakeFileSystem(
      { [TIER]: [dirent('tango', 'dir')], [`${TIER}/tango`]: [dirent('package.json', 'symlink')] },
      { [`${TIER}/tango/package.json`]: packManifest },
    );
    const { entries } = readIdentityPackTier(fs, TIER);
    expect(entries).toEqual([
      {
        directoryName: 'tango',
        packageJson: undefined,
        files: [],
        symlinks: ['package.json'],
      },
    ]);
    expect(fs.readTextFileCalls).toEqual([]);
  });

  it('propagates a manifest READ failure instead of branding the pack unparseable', () => {
    // parseFailure means exactly what it says (round-7 finding): an I/O
    // fault on a listed file is an environment fault, reported as itself.
    const fs = fakeFileSystem({
      [TIER]: [dirent('tango', 'dir')],
      [`${TIER}/tango`]: [dirent('package.json', 'file')],
    });
    expect(() => readIdentityPackTier(fs, TIER)).toThrow('no file at');
  });

  it('reports an unparseable manifest as parseFailure, still listing the pack contents', () => {
    const fs = fakeFileSystem(
      { [TIER]: [dirent('tango', 'dir')], [`${TIER}/tango`]: [dirent('package.json', 'file')] },
      { [`${TIER}/tango/package.json`]: 'not json' },
    );
    const { entries } = readIdentityPackTier(fs, TIER);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.packageJson).toBeUndefined();
    expect(entries[0]?.parseFailure).toBeDefined();
  });

  it('keeps non-directory, non-symlink tier children (the tier README) outside the pack model', () => {
    const fs = fakeFileSystem({ [TIER]: [dirent('README.md', 'file')] });
    expect(readIdentityPackTier(fs, TIER).entries).toEqual([]);
  });
});
