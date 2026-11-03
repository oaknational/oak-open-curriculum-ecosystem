import { describe, expect, it } from 'vitest';

import { atomicTextWriter, type AtomicFileSystem } from '../collaboration-state/atomic-file.js';

import { realSweepFs } from './sweep-fs.js';

const RULE = '/repo/.agent/rules/alpha.md';

/** An in-memory tree: every atomic-writer call lands in the map, nothing touches disk. */
function treeFileSystem(files: Map<string, string>): AtomicFileSystem {
  return {
    writeSyncedFile: async (filePath, text) => {
      files.set(filePath, text);
    },
    link: async (existingPath, newPath) => {
      files.set(newPath, files.get(existingPath) ?? '');
    },
    rename: async (oldPath, newPath) => {
      files.set(newPath, files.get(oldPath) ?? '');
      files.delete(oldPath);
    },
    remove: async (filePath) => {
      files.delete(filePath);
    },
    syncDirectory: async () => undefined,
  };
}

/** The same tree, but every synced write lands truncated and then fails, as a full disk does. */
function truncatingFileSystem(files: Map<string, string>): AtomicFileSystem {
  return {
    ...treeFileSystem(files),
    writeSyncedFile: async (filePath) => {
      files.set(filePath, '');
      throw new Error('ENOSPC: no space left on device');
    },
  };
}

describe('realSweepFs writeFile', () => {
  it('replaces the rule whole through the injected atomic writer and leaves no temp file', async () => {
    const files = new Map([[RULE, 'original']]);
    await realSweepFs(atomicTextWriter(treeFileSystem(files))).writeFile(RULE, 'swept');
    expect([...files]).toEqual([[RULE, 'swept']]);
  });

  it('leaves the original rule untouched when the write fails mid-way, temp file removed', async () => {
    const files = new Map([[RULE, 'original']]);
    await expect(
      realSweepFs(atomicTextWriter(truncatingFileSystem(files))).writeFile(RULE, 'swept'),
    ).rejects.toThrow('ENOSPC');
    expect([...files]).toEqual([[RULE, 'original']]);
  });
});
