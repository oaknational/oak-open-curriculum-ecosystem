import { sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import { isForeignWorkingTreeRoot, shouldInspectFile, walkFiles, type ReaddirFn } from './walk.js';

interface FakeEntry {
  readonly name: string;
  readonly kind: 'directory' | 'file';
}

/** The product joins host-separator paths; the POSIX-keyed fake normalises at lookup. */
const posixPath = (hostPath: string): string => hostPath.split(sep).join('/');

function fakeReaddir(dirs: Readonly<Record<string, readonly FakeEntry[]>>): ReaddirFn {
  return async (absDir) =>
    (dirs[posixPath(absDir)] ?? []).map((entry) => ({
      name: entry.name,
      isDirectory: () => entry.kind === 'directory',
      isFile: () => entry.kind === 'file',
    }));
}

describe('shouldInspectFile', () => {
  it('inspects live markdown files', () => {
    expect(shouldInspectFile('.agent/skills/consolidate-docs/SKILL-CANONICAL.md')).toBe(true);
    expect(shouldInspectFile('docs/governance/development-practice.md')).toBe(true);
  });

  it('excludes archived files', () => {
    expect(shouldInspectFile('.agent/memory/active/archive/napkin-2026-03-21.md')).toBe(false);
    expect(
      shouldInspectFile('.agent/plans/agentic-engineering-enhancements/archive/completed/foo.md'),
    ).toBe(false);
  });

  it('excludes incoming practice-box files', () => {
    expect(shouldInspectFile('.agent/practice-core/incoming/practice.md')).toBe(false);
  });

  it('excludes experience files (reflective, not normative)', () => {
    expect(shouldInspectFile('.agent/experience/2026-04-05-concepts-as-currency.md')).toBe(false);
  });

  it('excludes backup directories', () => {
    expect(shouldInspectFile('.agent/practice-core-backup-2026-03-23/practice.md')).toBe(false);
  });

  it('excludes non-markdown, non-ts, non-mjs files', () => {
    expect(shouldInspectFile('scripts/foo.sh')).toBe(false);
    expect(shouldInspectFile('package.json')).toBe(false);
  });

  it('excludes the ADR-144 file itself (permitted to discuss retired vocabulary)', () => {
    expect(
      shouldInspectFile(
        'docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md',
      ),
    ).toBe(false);
  });

  it('excludes the vocabulary validator itself and its tests', () => {
    expect(
      shouldInspectFile(
        'agent-tools/src/validators/fitness-vocabulary/validate-fitness-vocabulary.ts',
      ),
    ).toBe(false);
    expect(
      shouldInspectFile(
        'agent-tools/src/validators/fitness-vocabulary/validate-fitness-vocabulary.unit.test.ts',
      ),
    ).toBe(false);
  });

  it('excludes transient and machine-local roots (tmp/, .agent/reference-local)', () => {
    expect(shouldInspectFile('tmp/scratch.md')).toBe(false);
    expect(shouldInspectFile('.agent/reference-local/notes.md')).toBe(false);
  });

  it('anchors excluded roots at a path boundary (no greedy prefix match)', () => {
    expect(shouldInspectFile('template.md')).toBe(true);
    expect(shouldInspectFile('tmp-notes/keep.md')).toBe(true);
  });
});

describe('isForeignWorkingTreeRoot', () => {
  it('flags a worktree root (a .git file)', () => {
    expect(isForeignWorkingTreeRoot([{ name: '.git' }, { name: 'copy.md' }])).toBe(true);
  });

  it('flags a nested-clone root (a .git directory)', () => {
    expect(isForeignWorkingTreeRoot([{ name: '.git' }, { name: 'src' }])).toBe(true);
  });

  it('does not flag an ordinary directory', () => {
    expect(isForeignWorkingTreeRoot([{ name: 'skills' }, { name: 'settings.json' }])).toBe(false);
  });
});

describe('walkFiles', () => {
  it('does not descend into a nested git working tree (.claude/worktrees/*)', async () => {
    const readdir = fakeReaddir({
      '/repo': [
        { name: '.claude', kind: 'directory' },
        { name: 'root.md', kind: 'file' },
      ],
      '/repo/.claude': [{ name: 'worktrees', kind: 'directory' }],
      '/repo/.claude/worktrees': [{ name: 'feature', kind: 'directory' }],
      // A worktree root: a `.git` marker plus its own copy of the estate.
      '/repo/.claude/worktrees/feature': [
        { name: '.git', kind: 'file' },
        { name: 'copy.md', kind: 'file' },
      ],
    });

    // Only the main working tree's file is discovered; the worktree copy is skipped.
    await expect(walkFiles('/repo', '.', readdir)).resolves.toStrictEqual(['root.md']);
  });

  it('excludes transient roots (tmp/) from the walk output', async () => {
    const readdir = fakeReaddir({
      '/repo': [
        { name: 'tmp', kind: 'directory' },
        { name: 'keep.md', kind: 'file' },
      ],
      '/repo/tmp': [{ name: 'scratch.md', kind: 'file' }],
    });

    await expect(walkFiles('/repo', '.', readdir)).resolves.toStrictEqual(['keep.md']);
  });
});
