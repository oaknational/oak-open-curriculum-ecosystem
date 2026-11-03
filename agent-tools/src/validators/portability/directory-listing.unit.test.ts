import { describe, expect, it } from 'vitest';

import { classifyDirectoryEntries, type DirectoryEntry } from './directory-listing.js';

function file(name: string): DirectoryEntry {
  return { name, isFile: () => true };
}

/** A directory, a symlink or a special file: anything that is not a regular file. */
function other(name: string): DirectoryEntry {
  return { name, isFile: () => false };
}

describe('classifyDirectoryEntries', () => {
  it('lists the regular files sorted as repo-relative paths, a file without the extension as stray', () => {
    expect(
      classifyDirectoryEntries(
        '.claude/rules',
        [file('b.md'), file('a.md'), file('notes.txt')],
        '.md',
      ),
    ).toStrictEqual({
      kind: 'files',
      files: ['.claude/rules/a.md', '.claude/rules/b.md'],
      stray: ['.claude/rules/notes.txt'],
    });
  });

  it('a subdirectory on a surface is foreign: a nested file the platform would load stays unseen otherwise', () => {
    expect(
      classifyDirectoryEntries('.claude/rules', [file('a.md'), other('local')], '.md'),
    ).toStrictEqual({ kind: 'foreign', entry: '.claude/rules/local' });
  });

  it('a symlink or special entry is foreign, named first in name order, before any file is listed', () => {
    expect(
      classifyDirectoryEntries(
        '.cursor/rules',
        [other('zeta.mdc'), file('a.mdc'), other('beta')],
        '.mdc',
      ),
    ).toStrictEqual({ kind: 'foreign', entry: '.cursor/rules/beta' });
  });
});
