import { describe, expect, it } from 'vitest';

import { entryIsDescriptorFile, type FileIdentity } from './no-follow-read.js';

const file = (dev: bigint, ino: bigint, isFile = true): FileIdentity => ({
  isFile: () => isFile,
  dev,
  ino,
});

describe('entryIsDescriptorFile', () => {
  const viaDescriptor = file(1n, 10n);

  it.each<[string, FileIdentity | undefined, boolean]>([
    ['the same regular file, by device and inode', file(1n, 10n), true],
    ['an entry that is gone', undefined, false],
    ['an entry that is not a regular file', file(1n, 10n, false), false],
    ['a regular file with another inode', file(1n, 11n), false],
    ['a regular file on another device', file(2n, 10n), false],
  ])('reads %s', (_case, entry, identical) => {
    expect(entryIsDescriptorFile(entry, viaDescriptor)).toBe(identical);
  });
});
