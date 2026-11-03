import { describe, expect, it } from 'vitest';

import {
  listDirectory,
  readEntry,
  type SurfaceFs,
  type UnfollowedStat,
} from './rule-surface-fs.js';

/**
 * The classify-before-act order of the surface reads, proven over a tree that says what each
 * absolute path is when its leaf is left unfollowed: a link as the surface, as one of its
 * ancestors, or as the entry is refused before `readdir` or the no-follow read could act on
 * it; a link swapped in between the classification and the open is refused by the open
 * itself; and only ENOENT reads as absence. The mutations are proven beside their module
 * (`rule-projection-fs.integration.test.ts`).
 */

const ROOT = '/repo';

type Entry = 'dir' | 'file' | 'link';

function stat(entry: Entry): UnfollowedStat {
  return { isFile: () => entry === 'file', isDirectory: () => entry === 'dir' };
}

function coded(message: string, code: string): Error {
  return Object.assign(new Error(message), { code });
}

/**
 * A tree keyed by absolute path. `acted` records every path `readdir`, `readUnfollowed`,
 * `mkdir`, `writeAtomically` or `remove` was asked for, so a cell can assert that a refused
 * entry was never followed or touched. The no-follow read models the estate's fd-anchored
 * reader: a regular file yields its text, anything else (a link, a directory, nothing)
 * yields `undefined`.
 */
function tree(
  entries: Readonly<Record<string, Entry>>,
  texts: Readonly<Record<string, string>> = {},
): SurfaceFs & { acted: string[] } {
  const acted: string[] = [];
  const kindOf = (absolutePath: string): Entry | undefined => entries[absolutePath];
  return {
    acted,
    lstat: async (absolutePath) => {
      const entry = kindOf(absolutePath);
      if (entry === undefined) {
        throw coded(`ENOENT: no such file or directory, '${absolutePath}'`, 'ENOENT');
      }
      return stat(entry);
    },
    readdir: async (absolutePath) => {
      acted.push(`readdir ${absolutePath}`);
      return Object.keys(entries)
        .filter((candidate) => candidate.startsWith(`${absolutePath}/`))
        .filter((candidate) => !candidate.slice(absolutePath.length + 1).includes('/'))
        .map((candidate) => {
          const entry = kindOf(candidate);
          return { name: candidate.slice(absolutePath.length + 1), isFile: () => entry === 'file' };
        });
    },
    readUnfollowed: async (absolutePath) => {
      acted.push(`read ${absolutePath}`);
      const value = kindOf(absolutePath) === 'file' ? texts[absolutePath] : undefined;
      return { kind: 'ok', value };
    },
    mkdir: async (absolutePath) => {
      acted.push(`mkdir ${absolutePath}`);
    },
    writeAtomically: async (absolutePath, text) => {
      acted.push(`write ${absolutePath} ${text}`);
    },
    remove: async (absolutePath) => {
      acted.push(`remove ${absolutePath}`);
    },
  };
}

const SURFACES: Readonly<Record<string, Entry>> = {
  '/repo/.claude': 'dir',
  '/repo/.claude/rules': 'dir',
  '/repo/.claude/rules/a.md': 'file',
  '/repo/.claude/rules/notes.txt': 'file',
};

describe('listDirectory', () => {
  it('lists a real surface after classifying each ancestor, and reads a missing one as absent', async () => {
    const surfaceFs = tree(SURFACES);
    expect(await listDirectory(ROOT, '.claude/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'files',
      files: ['.claude/rules/a.md'],
      stray: ['.claude/rules/notes.txt'],
    });
    expect(await listDirectory(ROOT, '.cursor/rules', '.mdc', surfaceFs)).toStrictEqual({
      kind: 'absent',
    });
    expect(surfaceFs.acted).toStrictEqual(['readdir /repo/.claude/rules']);
  });

  it('refuses a surface that is itself a link, naming the surface, without listing through it', async () => {
    const surfaceFs = tree({ ...SURFACES, '/repo/.agents': 'dir', '/repo/.agents/rules': 'link' });
    expect(await listDirectory(ROOT, '.agents/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'foreign',
      entry: '.agents/rules',
    });
    expect(surfaceFs.acted).toStrictEqual([]);
  });

  it('refuses a surface whose ancestor is a link, naming the ancestor, without listing through it', async () => {
    const surfaceFs = tree({ ...SURFACES, '/repo/.agents': 'link', '/repo/.agents/rules': 'dir' });
    expect(await listDirectory(ROOT, '.agents/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'foreign',
      entry: '.agents',
    });
    expect(surfaceFs.acted).toStrictEqual([]);
  });

  it('reads any failure other than ENOENT as unreadable with its cause', async () => {
    const surfaceFs: SurfaceFs = {
      ...tree(SURFACES),
      readdir: async () => {
        throw new Error('EACCES: permission denied');
      },
    };
    expect(await listDirectory(ROOT, '.claude/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'unreadable',
      cause: 'EACCES: permission denied',
    });
  });
});

describe('readEntry', () => {
  it('reads a regular file, a missing path as absent, and a link or directory as foreign without opening it', async () => {
    const surfaceFs = tree(
      { ...SURFACES, '/repo/RULES_INDEX.md': 'link' },
      { '/repo/.claude/rules/a.md': 'a\r\n' },
    );
    expect(await readEntry(ROOT, '.claude/rules/a.md', surfaceFs)).toStrictEqual({
      kind: 'text',
      text: 'a\n',
    });
    expect(await readEntry(ROOT, 'missing.md', surfaceFs)).toStrictEqual({ kind: 'absent' });
    expect(await readEntry(ROOT, 'RULES_INDEX.md', surfaceFs)).toStrictEqual({ kind: 'foreign' });
    expect(await readEntry(ROOT, '.claude/rules', surfaceFs)).toStrictEqual({ kind: 'foreign' });
    expect(surfaceFs.acted).toStrictEqual(['read /repo/.claude/rules/a.md']);
  });

  it('reads an entry swapped for a link, a directory or nothing after the classification as foreign: the no-follow open finds no regular file', async () => {
    const swapped: SurfaceFs = {
      ...tree(SURFACES),
      readUnfollowed: async () => ({ kind: 'ok', value: undefined }),
    };
    expect(await readEntry(ROOT, '.claude/rules/a.md', swapped)).toStrictEqual({
      kind: 'foreign',
    });
  });

  it('refuses an entry under a linked ancestor as foreign without opening it, re-classifying the chain at the read', async () => {
    const linkedSurface = tree(
      { ...SURFACES, '/repo/.claude/rules': 'link' },
      { '/repo/.claude/rules/a.md': 'a\n' },
    );
    expect(await readEntry(ROOT, '.claude/rules/a.md', linkedSurface)).toStrictEqual({
      kind: 'foreign',
    });
    const linkedAncestor = tree(
      { ...SURFACES, '/repo/.claude': 'link' },
      { '/repo/.claude/rules/a.md': 'a\n' },
    );
    expect(await readEntry(ROOT, '.claude/rules/a.md', linkedAncestor)).toStrictEqual({
      kind: 'foreign',
    });
    expect(linkedSurface.acted).toStrictEqual([]);
    expect(linkedAncestor.acted).toStrictEqual([]);
  });

  it('reads a failure of the ancestor classification, the leaf classification or the read as unreadable with its cause', async () => {
    const deniedStat: SurfaceFs = {
      ...tree(SURFACES),
      lstat: async () => {
        throw new Error('EACCES: permission denied');
      },
    };
    expect(await readEntry(ROOT, 'RULES_INDEX.md', deniedStat)).toStrictEqual({
      kind: 'unreadable',
      cause: 'EACCES: permission denied',
    });
    expect(await readEntry(ROOT, '.claude/rules/a.md', deniedStat)).toStrictEqual({
      kind: 'unreadable',
      cause: 'EACCES: permission denied',
    });
    const deniedRead: SurfaceFs = {
      ...tree(SURFACES),
      readUnfollowed: async () => ({ kind: 'failure', message: 'cannot open a.md: EIO' }),
    };
    expect(await readEntry(ROOT, '.claude/rules/a.md', deniedRead)).toStrictEqual({
      kind: 'unreadable',
      cause: 'cannot open a.md: EIO',
    });
  });
});
