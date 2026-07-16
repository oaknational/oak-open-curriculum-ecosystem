import { describe, expect, it } from 'vitest';

import {
  createReviewPathInspection,
  type ReviewLstatEntry,
} from '../../src/codex-hook-review/file-system.js';

type EntryKind = 'directory' | 'file' | 'symbolic-link' | 'other';

describe('createReviewPathInspection', () => {
  it('classifies lstat results and translates ENOENT to missing', async () => {
    const entries = new Map<string, ReviewLstatEntry>([
      ['/directory', entry('directory')],
      ['/file.ts', entry('file')],
      ['/link.ts', entry('symbolic-link')],
      ['/socket', entry('other')],
    ]);
    const inspection = createReviewPathInspection(async (absolutePath) => {
      const value = entries.get(absolutePath);
      return value ?? Promise.reject(missingError());
    });

    await expect(inspection.lstat('/directory')).resolves.toEqual({
      ok: true,
      value: 'directory',
    });
    await expect(inspection.lstat('/file.ts')).resolves.toEqual({ ok: true, value: 'file' });
    await expect(inspection.lstat('/link.ts')).resolves.toEqual({
      ok: true,
      value: 'symbolic-link',
    });
    await expect(inspection.lstat('/socket')).resolves.toEqual({ ok: true, value: 'other' });
    await expect(inspection.lstat('/missing')).resolves.toEqual({ ok: true, value: 'missing' });
  });
});

function entry(kind: EntryKind): ReviewLstatEntry {
  return {
    isSymbolicLink: () => kind === 'symbolic-link',
    isFile: () => kind === 'file',
    isDirectory: () => kind === 'directory',
  };
}

function missingError(): Error {
  const error = new Error('missing');
  Object.defineProperty(error, 'code', { value: 'ENOENT' });
  return error;
}
