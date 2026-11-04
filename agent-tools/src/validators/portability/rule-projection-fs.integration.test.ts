import { describe, expect, it } from 'vitest';

import { removeProjection, writeProjection } from './rule-projection-fs.js';
import type { SurfaceFs, UnfollowedStat } from './rule-surface-fs.js';

/**
 * The mutations of the projection port, proven over a tree that says what each absolute path
 * is when its leaf is left unfollowed: an ancestor or a leaf that is not what a projection
 * surface admits is refused before the act, an absent surface directory is created for a
 * write and never for a removal, and a failure of the act itself is the outcome, never a
 * throw.
 */

const ROOT = '/repo';

type Entry = 'dir' | 'file' | 'link';

function stat(entry: Entry): UnfollowedStat {
  return { isFile: () => entry === 'file', isDirectory: () => entry === 'dir' };
}

function coded(message: string, code: string): Error {
  return Object.assign(new Error(message), { code });
}

/** A tree keyed by absolute path; `acted` records every mkdir, write and remove asked for. */
function tree(entries: Readonly<Record<string, Entry>>): SurfaceFs & { acted: string[] } {
  const acted: string[] = [];
  return {
    acted,
    lstat: async (absolutePath) => {
      const entry = entries[absolutePath];
      if (entry === undefined) {
        throw coded(`ENOENT: no such file or directory, '${absolutePath}'`, 'ENOENT');
      }
      return stat(entry);
    },
    readdir: async () => [],
    readUnfollowed: async () => ({ kind: 'ok', value: undefined }),
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

describe('writeProjection', () => {
  it('writes atomically when every ancestor is a real directory and the leaf is absent or a regular file', async () => {
    const surfaceFs = tree(SURFACES);
    expect(await writeProjection(ROOT, '.claude/rules/a.md', 'new\n', surfaceFs)).toStrictEqual({
      ok: true,
      value: undefined,
    });
    expect(await writeProjection(ROOT, '.claude/rules/b.md', 'b\n', surfaceFs)).toStrictEqual({
      ok: true,
      value: undefined,
    });
    expect(surfaceFs.acted).toStrictEqual([
      'write /repo/.claude/rules/a.md new\n',
      'write /repo/.claude/rules/b.md b\n',
    ]);
  });

  it('creates an absent surface directory and writes into it', async () => {
    const surfaceFs = tree(SURFACES);
    expect(await writeProjection(ROOT, '.cursor/rules/a.mdc', 'a\n', surfaceFs)).toStrictEqual({
      ok: true,
      value: undefined,
    });
    expect(surfaceFs.acted).toStrictEqual([
      'mkdir /repo/.cursor/rules',
      'write /repo/.cursor/rules/a.mdc a\n',
    ]);
  });

  it('refuses, touching nothing, when an ancestor is a link or the leaf is not a regular file at the moment of the write', async () => {
    const linkedAncestor = tree({
      ...SURFACES,
      '/repo/.agents': 'link',
      '/repo/.agents/rules': 'dir',
    });
    expect(await writeProjection(ROOT, '.agents/rules/a.md', 'a\n', linkedAncestor)).toStrictEqual({
      ok: false,
      error: '.agents: not a directory at the moment of the write; refusing the projection write',
    });
    expect(linkedAncestor.acted).toStrictEqual([]);

    const linkedLeaf = tree({ ...SURFACES, '/repo/RULES_INDEX.md': 'link' });
    expect(await writeProjection(ROOT, 'RULES_INDEX.md', 'index\n', linkedLeaf)).toStrictEqual({
      ok: false,
      error:
        'RULES_INDEX.md: not a regular file at the moment of the write; refusing the projection write',
    });
    expect(linkedLeaf.acted).toStrictEqual([]);
  });

  it('reports a failure of the act itself, or of an ancestor read, as the outcome rather than throwing', async () => {
    const fullDisk: SurfaceFs = {
      ...tree(SURFACES),
      writeAtomically: async () => {
        throw coded('ENOSPC: no space left on device', 'ENOSPC');
      },
    };
    expect(await writeProjection(ROOT, '.claude/rules/a.md', 'a\n', fullDisk)).toStrictEqual({
      ok: false,
      error: '.claude/rules/a.md: ENOSPC: no space left on device; the projection write failed',
    });

    const denied: SurfaceFs = {
      ...tree(SURFACES),
      lstat: async () => {
        throw coded('EACCES: permission denied', 'EACCES');
      },
    };
    expect(await writeProjection(ROOT, '.claude/rules/a.md', 'a\n', denied)).toStrictEqual({
      ok: false,
      error: '.claude/rules: unreadable (EACCES: permission denied); refusing the projection write',
    });
  });
});

describe('removeProjection', () => {
  it('unlinks a regular-file leaf under real directories, and refuses a link or an absent leaf', async () => {
    const surfaceFs = tree({ ...SURFACES, '/repo/.claude/rules/gone.md': 'link' });
    expect(await removeProjection(ROOT, '.claude/rules/notes.txt', surfaceFs)).toStrictEqual({
      ok: true,
      value: undefined,
    });
    expect(await removeProjection(ROOT, '.claude/rules/gone.md', surfaceFs)).toStrictEqual({
      ok: false,
      error:
        '.claude/rules/gone.md: not a regular file at the moment of the removal; refusing to remove it',
    });
    expect(await removeProjection(ROOT, '.claude/rules/vanished.md', surfaceFs)).toStrictEqual({
      ok: false,
      error:
        '.claude/rules/vanished.md: not a regular file at the moment of the removal; refusing to remove it',
    });
    expect(surfaceFs.acted).toStrictEqual(['remove /repo/.claude/rules/notes.txt']);
  });

  it('refuses when the surface directory is a link or has vanished, never creating it', async () => {
    const linked = tree({ ...SURFACES, '/repo/.agents': 'dir', '/repo/.agents/rules': 'link' });
    expect(await removeProjection(ROOT, '.agents/rules/a.md', linked)).toStrictEqual({
      ok: false,
      error: '.agents/rules: not a directory at the moment of the removal; refusing to remove it',
    });
    const vanished = tree(SURFACES);
    expect(await removeProjection(ROOT, '.cursor/rules/a.mdc', vanished)).toStrictEqual({
      ok: false,
      error: '.cursor/rules: vanished; refusing to remove it',
    });
    expect(vanished.acted).toStrictEqual([]);
  });

  it('reports a failure of the unlink itself as the outcome rather than throwing', async () => {
    const busy: SurfaceFs = {
      ...tree(SURFACES),
      remove: async () => {
        throw coded('EPERM: operation not permitted', 'EPERM');
      },
    };
    expect(await removeProjection(ROOT, '.claude/rules/notes.txt', busy)).toStrictEqual({
      ok: false,
      error:
        '.claude/rules/notes.txt: EPERM: operation not permitted; the projection removal failed',
    });
  });
});
