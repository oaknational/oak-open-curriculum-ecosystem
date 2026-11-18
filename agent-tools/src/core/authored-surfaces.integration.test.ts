import { describe, expect, it } from 'vitest';

import {
  discoverAuthoredFiles,
  readOptionalFile,
  type AuthoredSurfaceFs,
} from './authored-surfaces.js';

/**
 * An in-memory tree: a directory maps to its entry names, a file to its
 * text, and a poisoned entry (a directory or a file the walker must never
 * enter or read) to a marker whose listing or read rejects, so a walk that
 * touches one fails at the output boundary. Absolute paths are POSIX under
 * `/repo`, the fake repository root.
 */
type Poison = { readonly poison: 'dir' | 'file' };
type Entry = string | readonly string[] | Poison;
type Tree = ReadonlyMap<string, Entry>;

const POISON_DIR: Poison = { poison: 'dir' };
const POISON_FILE: Poison = { poison: 'file' };

function isPoison(entry: Entry | undefined): entry is Poison {
  return typeof entry === 'object' && !Array.isArray(entry);
}

function enoent(): Error {
  return Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
}

function poisoned(absolutePath: string): Error {
  return Object.assign(new Error(`EACCES: poisoned entry touched: ${absolutePath}`), {
    code: 'EACCES',
  });
}

function fakeFs(tree: Tree): AuthoredSurfaceFs {
  return {
    readdir: async (absoluteDir) => {
      const listing = tree.get(absoluteDir);
      if (isPoison(listing)) {
        throw poisoned(absoluteDir);
      }
      if (listing === undefined || typeof listing === 'string') {
        throw enoent();
      }
      return listing.map((name) => {
        const child = tree.get(`${absoluteDir}/${name}`);
        const directory = isPoison(child) ? child.poison === 'dir' : Array.isArray(child);
        const file = isPoison(child) ? child.poison === 'file' : typeof child === 'string';
        return { name, isDirectory: () => directory, isFile: () => file };
      });
    },
    readFile: async (absolutePath) => {
      const content = tree.get(absolutePath);
      if (isPoison(content)) {
        throw poisoned(absolutePath);
      }
      if (typeof content !== 'string') {
        throw enoent();
      }
      return content;
    },
  };
}

const REPO = '/repo';

const tree: Tree = new Map<string, Entry>([
  [`${REPO}/.agent/rules`, ['a.md', 'notes.txt', 'archive', 'nested']],
  [`${REPO}/.agent/rules/a.md`, 'rule a'],
  [`${REPO}/.agent/rules/notes.txt`, 'not scanned'],
  [`${REPO}/.agent/rules/archive`, ['old.md']],
  [`${REPO}/.agent/rules/archive/old.md`, 'archived'],
  [`${REPO}/.agent/rules/nested`, ['b.md', 'CHANGELOG.md']],
  [`${REPO}/.agent/rules/nested/b.md`, 'rule b'],
  [`${REPO}/.agent/rules/nested/CHANGELOG.md`, 'history'],
  [`${REPO}/AGENTS.md`, 'entry point'],
]);

const universe = new Set([
  '.agent',
  '.agent/rules',
  '.agent/rules/a.md',
  '.agent/rules/notes.txt',
  '.agent/rules/archive',
  '.agent/rules/archive/old.md',
  '.agent/rules/nested',
  '.agent/rules/nested/b.md',
  '.agent/rules/nested/CHANGELOG.md',
  'AGENTS.md',
]);

const spec = {
  roots: ['.agent/rules', '.agent/missing'],
  rootFiles: ['AGENTS.md', 'MISSING.md'],
  extensions: new Set(['.md']),
  excludedPathFragments: ['/archive/', 'nested/CHANGELOG.md'],
  excludedRoots: [],
  universe,
};

describe('discoverAuthoredFiles', () => {
  it('walks the roots depth-first, reads only scanned extensions, and appends present root files', async () => {
    const files = await discoverAuthoredFiles(REPO, spec, fakeFs(tree));

    expect(files).toStrictEqual([
      { path: '.agent/rules/a.md', content: 'rule a' },
      { path: '.agent/rules/nested/b.md', content: 'rule b' },
      { path: 'AGENTS.md', content: 'entry point' },
    ]);
  });

  it('skips a missing root and a missing root file without failing', async () => {
    const files = await discoverAuthoredFiles(
      REPO,
      { ...spec, roots: ['.agent/missing'], rootFiles: ['MISSING.md'] },
      fakeFs(tree),
    );

    expect(files).toStrictEqual([]);
  });

  it('prunes an excluded directory before entering it and an excluded file before reading it', async () => {
    const poisonedTree: Tree = new Map<string, Entry>([
      ...tree,
      [`${REPO}/.agent/rules/archive`, POISON_DIR],
      [`${REPO}/.agent/rules/nested/CHANGELOG.md`, POISON_FILE],
    ]);

    const files = await discoverAuthoredFiles(
      REPO,
      { ...spec, rootFiles: [] },
      fakeFs(poisonedTree),
    );

    expect(files.map((file) => file.path)).toStrictEqual([
      '.agent/rules/a.md',
      '.agent/rules/nested/b.md',
    ]);
  });

  it('prunes an excluded root by prefix: the history roots the entry file declares as host data', async () => {
    const files = await discoverAuthoredFiles(
      REPO,
      {
        ...spec,
        rootFiles: [],
        excludedPathFragments: [],
        excludedRoots: ['.agent/rules/nested/'],
      },
      fakeFs(tree),
    );

    expect(files.map((file) => file.path)).toStrictEqual([
      '.agent/rules/a.md',
      '.agent/rules/archive/old.md',
    ]);
  });

  it('propagates a file-system error that is not a missing path', async () => {
    const failing: AuthoredSurfaceFs = {
      readdir: async () => {
        throw Object.assign(new Error('EACCES'), { code: 'EACCES' });
      },
      readFile: fakeFs(tree).readFile,
    };

    await expect(discoverAuthoredFiles(REPO, spec, failing)).rejects.toThrow('EACCES');
  });
});

describe('readOptionalFile', () => {
  it('returns the text of a present file and undefined for a missing one', async () => {
    await expect(readOptionalFile(`${REPO}/AGENTS.md`, fakeFs(tree))).resolves.toBe('entry point');
    await expect(readOptionalFile(`${REPO}/MISSING.md`, fakeFs(tree))).resolves.toBeUndefined();
  });
});

describe('discoverAuthoredFiles universe', () => {
  it('never enters a directory or reads a file outside the universe, however the tree looks', async () => {
    const treeWithIgnored: Tree = new Map<string, Entry>([
      ...tree,
      [`${REPO}/.agent/rules`, ['a.md', 'notes.txt', 'archive', 'nested', 'local', 'stray.md']],
      [`${REPO}/.agent/rules/local`, POISON_DIR],
      [`${REPO}/.agent/rules/stray.md`, POISON_FILE],
    ]);

    const files = await discoverAuthoredFiles(
      REPO,
      { ...spec, rootFiles: [] },
      fakeFs(treeWithIgnored),
    );

    expect(files.map((file) => file.path)).toStrictEqual([
      '.agent/rules/a.md',
      '.agent/rules/nested/b.md',
    ]);
  });
});
