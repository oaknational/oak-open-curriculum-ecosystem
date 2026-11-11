import { describe, expect, it } from 'vitest';

import { atomicTextWriter, directorySyncStrategy, type AtomicFileSystem } from './atomic-file.js';

/** A pure recording fake: every call lands in `calls`, nothing touches disk. */
function recordingFileSystem(overrides: Partial<AtomicFileSystem> = {}): {
  readonly calls: string[];
  readonly fileSystem: AtomicFileSystem;
} {
  const calls: string[] = [];
  const fileSystem: AtomicFileSystem = {
    writeSyncedFile: async (filePath) => {
      calls.push(`write:${filePath}`);
    },
    link: async (existingPath, newPath) => {
      calls.push(`link:${existingPath}->${newPath}`);
    },
    rename: async (oldPath, newPath) => {
      calls.push(`rename:${oldPath}->${newPath}`);
    },
    remove: async (path) => {
      calls.push(`remove:${path}`);
    },
    syncDirectory: async (directory) => {
      calls.push(`syncDir:${directory}`);
    },
    ...overrides,
  };
  return { calls, fileSystem };
}

describe('atomicTextWriter', () => {
  it('writes the temp file, renames it into place, then syncs the parent directory', async () => {
    const { calls, fileSystem } = recordingFileSystem();

    await atomicTextWriter(fileSystem)('/state/claims.json', '{}');

    expect(calls[0]).toMatch(/^write:\/state\/claims\.json\.tmp-/u);
    expect(calls[1]).toMatch(/^rename:\/state\/claims\.json\.tmp-.*->\/state\/claims\.json$/u);
    expect(calls[2]).toBe('syncDir:/state');
    expect(calls).toHaveLength(3);
  });

  it('a directory-sync failure after the rename still surfaces to the caller', async () => {
    // The write is durable on disk at this point; the writer must still
    // propagate the failure honestly rather than swallow it — the cure for a
    // platform where the sync cannot work is a platform-correct STRATEGY
    // (directorySyncStrategy), never a swallowed error here.
    const { fileSystem } = recordingFileSystem({
      syncDirectory: async () => {
        throw new Error('EPERM: operation not permitted, fsync');
      },
    });

    await expect(atomicTextWriter(fileSystem)('/state/claims.json', '{}')).rejects.toThrow(
      /EPERM/u,
    );
  });

  it('exclusive create links the temp file into place and removes the temp', async () => {
    const { calls, fileSystem } = recordingFileSystem();

    await atomicTextWriter(fileSystem)('/state/seed.json', '{}', { exclusiveCreate: true });

    expect(calls[1]).toMatch(/^link:\/state\/seed\.json\.tmp-.*->\/state\/seed\.json$/u);
    expect(calls[2]).toMatch(/^remove:\/state\/seed\.json\.tmp-/u);
    expect(calls[3]).toBe('syncDir:/state');
  });

  it('cleans up the temp file when the write itself fails', async () => {
    const { calls, fileSystem } = recordingFileSystem({
      writeSyncedFile: async () => {
        throw new Error('disk full');
      },
    });

    await expect(atomicTextWriter(fileSystem)('/state/claims.json', '{}')).rejects.toThrow(
      /disk full/u,
    );
    expect(calls.some((call) => call.startsWith('remove:/state/claims.json.tmp-'))).toBe(true);
  });
});

describe('directorySyncStrategy', () => {
  it('on win32 resolves without touching the filesystem', async () => {
    // fsync on a directory handle is EPERM on Windows and NTFS journals the
    // rename, so the win32 strategy performs no IO at all. A path that does
    // not exist proves it: any open attempt would reject.
    const sync = directorySyncStrategy('win32');

    await expect(
      sync(String.raw`Z:\this\path\exists\on\no\machine\anywhere`),
    ).resolves.toBeUndefined();
  });
});
