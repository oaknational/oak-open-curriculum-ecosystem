import { describe, expect, it } from 'vitest';

import {
  discoverFitnessFiles,
  shouldInspectFitnessPath,
  type FitnessPathDirEntry,
  type FitnessPathFileSystem,
} from './paths.js';

interface FakeEntry {
  readonly name: string;
  readonly kind: 'directory' | 'file';
}

function fakeDirEntry(entry: FakeEntry): FitnessPathDirEntry {
  return {
    name: entry.name,
    isDirectory: () => entry.kind === 'directory',
    isFile: () => entry.kind === 'file',
  };
}

function fakeFileSystem(input: {
  readonly dirs: Readonly<Record<string, readonly FakeEntry[]>>;
  readonly files: Readonly<Record<string, string>>;
}): FitnessPathFileSystem {
  return {
    readdir: async (absDir) => input.dirs[absDir]?.map(fakeDirEntry) ?? [],
    readFileUtf8: async (absPath) => {
      const content = input.files[absPath];
      if (content === undefined) {
        throw new Error(`missing fixture ${absPath}`);
      }
      return content;
    },
  };
}

describe('shouldInspectFitnessPath', () => {
  it('keeps live markdown files and excludes backups and archives', () => {
    expect(shouldInspectFitnessPath('.agent/practice-core/practice.md')).toBe(true);
    expect(shouldInspectFitnessPath('.agent/practice-core-backup-2026-03-23/practice.md')).toBe(
      false,
    );
    expect(shouldInspectFitnessPath('.agent/memory/active/archive/napkin-2026-03-21.md')).toBe(
      false,
    );
    expect(shouldInspectFitnessPath('.agent/practice-core/incoming/practice.md')).toBe(false);
  });

  it('excludes transient and machine-local roots (tmp/, .agent/reference-local)', () => {
    expect(shouldInspectFitnessPath('tmp/scratch.md')).toBe(false);
    expect(shouldInspectFitnessPath('.agent/reference-local/notes.md')).toBe(false);
  });

  it('anchors excluded roots at a path boundary (no greedy prefix match)', () => {
    // `template.md` and `tmp-notes/` must NOT be swept up by the `tmp` root.
    expect(shouldInspectFitnessPath('template.md')).toBe(true);
    expect(shouldInspectFitnessPath('tmp-notes/keep.md')).toBe(true);
  });
});

describe('discoverFitnessFiles', () => {
  it('does not descend into a nested git working tree (e.g. .claude/worktrees/*)', async () => {
    const fileSystem = fakeFileSystem({
      dirs: {
        '/repo': [
          { name: '.claude', kind: 'directory' },
          { name: 'root.md', kind: 'file' },
        ],
        '/repo/.claude': [{ name: 'worktrees', kind: 'directory' }],
        '/repo/.claude/worktrees': [{ name: 'feature', kind: 'directory' }],
        // A git worktree root: contains a `.git` marker (a file for worktrees,
        // a directory for nested clones) plus its own copy of the estate.
        '/repo/.claude/worktrees/feature': [
          { name: '.git', kind: 'file' },
          { name: 'copy.md', kind: 'file' },
        ],
      },
      files: {
        '/repo/root.md': ['---', 'fitness_content_role: reference', '---', 'body'].join('\n'),
        '/repo/.claude/worktrees/feature/copy.md': [
          '---',
          'fitness_content_role: reference',
          '---',
          'body',
        ].join('\n'),
      },
    });

    // Only the main working tree's file is discovered; the worktree copy is skipped.
    await expect(discoverFitnessFiles('/repo', fileSystem)).resolves.toStrictEqual(['root.md']);
  });

  it('discovers lifecycle metadata even when no line target is declared', async () => {
    const fileSystem = fakeFileSystem({
      dirs: {
        '/repo': [
          { name: '.agent', kind: 'directory' },
          { name: 'plain.md', kind: 'file' },
        ],
        '/repo/.agent': [{ name: 'memory', kind: 'directory' }],
        '/repo/.agent/memory': [{ name: 'operational', kind: 'directory' }],
        '/repo/.agent/memory/operational': [{ name: 'pending-graduations', kind: 'directory' }],
        '/repo/.agent/memory/operational/pending-graduations': [
          { name: 'legacy.md', kind: 'file' },
        ],
      },
      files: {
        '/repo/.agent/memory/operational/pending-graduations/legacy.md': [
          '---',
          'surface_kind: active-pending-graduations-shard',
          '---',
          'body',
        ].join('\n'),
        '/repo/plain.md': 'body',
      },
    });

    await expect(discoverFitnessFiles('/repo', fileSystem)).resolves.toStrictEqual([
      '.agent/memory/operational/pending-graduations/legacy.md',
    ]);
  });
});
