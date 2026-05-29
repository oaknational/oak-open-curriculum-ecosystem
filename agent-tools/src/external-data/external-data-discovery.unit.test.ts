import { describe, expect, it } from 'vitest';

import {
  discoverExternalDataFiles,
  isExternalDataFile,
  shouldSkipDirectory,
  type ExternalDataDirEntry,
  type ExternalDataFileSystem,
} from './external-data-discovery.js';

interface FakeEntry {
  readonly name: string;
  readonly kind: 'directory' | 'file';
}

function fakeDirEntry(entry: FakeEntry): ExternalDataDirEntry {
  return {
    name: entry.name,
    isDirectory: () => entry.kind === 'directory',
    isFile: () => entry.kind === 'file',
  };
}

function fakeFileSystem(input: {
  readonly dirs: Readonly<Record<string, readonly FakeEntry[]>>;
  readonly files: Readonly<Record<string, string>>;
}): ExternalDataFileSystem {
  return {
    readdir: async (absDir) => input.dirs[absDir]?.map(fakeDirEntry) ?? [],
    readFile: async (absPath) => {
      const content = input.files[absPath];
      if (content === undefined) {
        throw new Error(`missing fixture ${absPath}`);
      }
      return content;
    },
  };
}

describe('isExternalDataFile', () => {
  it.each([
    { path: 'pkg/src/toolkit.external-data.ts', expected: true },
    { path: 'pkg/src/toolkit.ts', expected: false },
    { path: 'pkg/src/toolkit.external-data.test.ts', expected: false },
  ])('classifies $path as $expected', ({ path, expected }) => {
    expect(isExternalDataFile(path)).toBe(expected);
  });
});

describe('shouldSkipDirectory', () => {
  it.each([
    { name: 'node_modules', expected: true },
    { name: 'dist', expected: true },
    { name: 'src', expected: false },
    { name: 'eef-strands', expected: false },
  ])('skips $name = $expected', ({ name, expected }) => {
    expect(shouldSkipDirectory(name)).toBe(expected);
  });
});

describe('discoverExternalDataFiles', () => {
  it('finds external-data files recursively, skipping excluded directories', async () => {
    const compliant = '/** Provenance: x */\nexport const RAW: unknown = {};\n';
    const fileSystem = fakeFileSystem({
      dirs: {
        '/repo': [
          { name: 'packages', kind: 'directory' },
          { name: 'node_modules', kind: 'directory' },
          { name: 'README.md', kind: 'file' },
        ],
        '/repo/node_modules': [{ name: 'vendored.external-data.ts', kind: 'file' }],
        '/repo/packages': [{ name: 'sdk', kind: 'directory' }],
        '/repo/packages/sdk': [
          { name: 'toolkit.external-data.ts', kind: 'file' },
          { name: 'loader.ts', kind: 'file' },
        ],
      },
      files: {
        '/repo/packages/sdk/toolkit.external-data.ts': compliant,
        '/repo/node_modules/vendored.external-data.ts': 'export function hack() {}\n',
      },
    });

    await expect(discoverExternalDataFiles('/repo', fileSystem)).resolves.toStrictEqual([
      { path: 'packages/sdk/toolkit.external-data.ts', content: compliant },
    ]);
  });

  it('treats a missing directory (ENOENT) as empty rather than failing', async () => {
    const enoent: NodeJS.ErrnoException = new Error('no such directory');
    enoent.code = 'ENOENT';
    const fileSystem: ExternalDataFileSystem = {
      readdir: () => Promise.reject(enoent),
      readFile: () => Promise.reject(new Error('unused')),
    };

    await expect(discoverExternalDataFiles('/missing', fileSystem)).resolves.toStrictEqual([]);
  });

  it('propagates a non-ENOENT readdir error', async () => {
    const eacces: NodeJS.ErrnoException = new Error('permission denied');
    eacces.code = 'EACCES';
    const fileSystem: ExternalDataFileSystem = {
      readdir: () => Promise.reject(eacces),
      readFile: () => Promise.reject(new Error('unused')),
    };

    await expect(discoverExternalDataFiles('/protected', fileSystem)).rejects.toThrow(
      'permission denied',
    );
  });
});
