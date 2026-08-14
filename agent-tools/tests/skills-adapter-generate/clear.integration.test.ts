import { join, sep } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { adapterStubPointerLine } from '../../src/skills-adapter-generate/adapter-stub';
import { clearGeneratedAdapters, type ClearFs } from '../../src/skills-adapter-generate/clear';

import {
  cleanupSandboxes,
  readRepoBytes,
  removeRepoPath,
  repoPathExists,
  sandboxRepo,
  symlinkRepoPath,
  writeRepoFile,
} from './test-helpers/skills-repo-sandbox';

/** A structurally genuine Practice stub: recognition requires the whole
 * shape (frontmatter, title line, pointer line), not just the marker. */
const OURS = `---\nname: oak-commit\ndescription: Commit workflow.\n---\n\n# Commit (Claude Code)\n\n${adapterStubPointerLine('commit/SKILL-CANONICAL.md')}\n`;
const FOREIGN = '# Clerk\n\nVendor skill body — no derivation marker.\n';

// The product joins with the HOST separator (correct for real fs access);
// the in-memory fakes are keyed and asserted in POSIX form for readability,
// so lookups and recorded removals normalise first.
const posixPath = (hostPath: string): string => hostPath.split(sep).join('/');

afterEach(() => {
  cleanupSandboxes();
});

function makeClearFs(input: {
  readonly subdirectories: ReadonlyMap<string, readonly string[]>;
  readonly stubs: ReadonlyMap<string, string>;
}): {
  readonly fs: ClearFs;
  readonly removed: string[];
} {
  const removed: string[] = [];
  return {
    fs: {
      async listSubdirectoryNames(path) {
        return { kind: 'ok', names: input.subdirectories.get(posixPath(path)) ?? [] };
      },
      async readStubOrUndefined(path) {
        return { kind: 'ok', value: input.stubs.get(posixPath(path)) };
      },
      async removeDirectory(path) {
        removed.push(posixPath(path));
      },
      // The in-memory fixture holds no symlinked ancestors: every path
      // resolves to itself, so the surface-root guard always passes.
      async resolveRealPath(path) {
        return { kind: 'ok', value: path };
      },
    },
    removed,
  };
}

describe('clearGeneratedAdapters (in-memory seam)', () => {
  const repoRoot = '/repo';
  const surfaces = new Map<string, readonly string[]>([
    ['/repo/.claude/skills', ['oak-commit', 'skill-creator']],
    ['/repo/.agents/skills', ['oak-commit', 'clerk', 'skill-creator']],
  ]);
  const stubs = new Map<string, string>([
    ['/repo/.claude/skills/oak-commit/SKILL.md', OURS],
    ['/repo/.claude/skills/skill-creator/SKILL.md', FOREIGN],
    ['/repo/.agents/skills/oak-commit/SKILL.md', OURS],
    ['/repo/.agents/skills/clerk/SKILL.md', FOREIGN],
    // skill-creator on the agents surface has no SKILL.md at all.
  ]);

  it('removes exactly the directories whose stub carries the class marker, and reports them — membership by content, never by name', async () => {
    const { fs, removed } = makeClearFs({ subdirectories: surfaces, stubs });

    const result = await clearGeneratedAdapters(repoRoot, fs);

    expect(result.kind).toBe('ok');
    const reported =
      result.kind === 'ok' ? new Set(result.removed.map(posixPath)) : new Set<string>();
    expect(reported).toEqual(
      new Set(['/repo/.claude/skills/oak-commit', '/repo/.agents/skills/oak-commit']),
    );
    expect(new Set(removed)).toEqual(reported);
  });

  it('collects a projection generated under a previous prefix: the marker recognises it whatever the directory is called', async () => {
    const { fs, removed } = makeClearFs({
      subdirectories: new Map([['/repo/.claude/skills', ['legacy-commit']]]),
      stubs: new Map([['/repo/.claude/skills/legacy-commit/SKILL.md', OURS]]),
    });

    const result = await clearGeneratedAdapters(repoRoot, fs);

    expect(result.kind).toBe('ok');
    expect(result.kind === 'ok' ? result.removed.map(posixPath) : undefined).toEqual([
      '/repo/.claude/skills/legacy-commit',
    ]);
    expect(removed).toEqual(['/repo/.claude/skills/legacy-commit']);
  });

  it('aborts with an error and removes nothing when a surface cannot be listed', async () => {
    const removed: string[] = [];
    const fs: ClearFs = {
      async listSubdirectoryNames() {
        return { kind: 'error', message: 'cannot list /repo/.claude/skills: EACCES' };
      },
      async readStubOrUndefined() {
        return { kind: 'ok', value: undefined };
      },
      async removeDirectory(path) {
        removed.push(path);
      },
      async resolveRealPath(path) {
        return { kind: 'ok', value: path };
      },
    };

    const result = await clearGeneratedAdapters(repoRoot, fs);

    expect(result.kind).toBe('error');
    expect(removed).toEqual([]);
  });

  it('aborts with an error when an entry cannot be classified: an unreadable stub is never silently kept or removed', async () => {
    const removed: string[] = [];
    const fs: ClearFs = {
      async listSubdirectoryNames(path) {
        return posixPath(path) === '/repo/.claude/skills'
          ? { kind: 'ok', names: ['oak-commit'] }
          : { kind: 'ok', names: [] };
      },
      async readStubOrUndefined(path) {
        return { kind: 'error', message: `cannot read ${path}: EACCES` };
      },
      async removeDirectory(path) {
        removed.push(path);
      },
      async resolveRealPath(path) {
        return { kind: 'ok', value: path };
      },
    };

    const result = await clearGeneratedAdapters(repoRoot, fs);

    expect(result.kind).toBe('error');
    expect(removed).toEqual([]);
  });

  it('classifies BOTH roots before removing: a second-root list failure leaves the first root untouched (no partial destruction)', async () => {
    const removed: string[] = [];
    const fs: ClearFs = {
      async listSubdirectoryNames(path) {
        // First root has a genuine removal candidate; the SECOND root fails.
        return posixPath(path) === '/repo/.claude/skills'
          ? { kind: 'ok', names: ['oak-commit'] }
          : { kind: 'error', message: 'cannot list /repo/.agents/skills: EACCES' };
      },
      async readStubOrUndefined() {
        return { kind: 'ok', value: OURS };
      },
      async removeDirectory(path) {
        removed.push(path);
      },
      async resolveRealPath(path) {
        return { kind: 'ok', value: path };
      },
    };

    const result = await clearGeneratedAdapters(repoRoot, fs);

    // Collection spans both roots before any removal, so the first root's
    // real candidate is never deleted when the second root aborts the run.
    expect(result.kind).toBe('error');
    expect(removed).toEqual([]);
  });

  it('preserves and returns the partial teardown when a mid-phase removal fails — the destructive path stays observable', async () => {
    const removedReal: string[] = [];
    const fs: ClearFs = {
      async listSubdirectoryNames(path) {
        return posixPath(path) === '/repo/.claude/skills'
          ? { kind: 'ok', names: ['oak-a', 'oak-b'] }
          : { kind: 'ok', names: [] };
      },
      async readStubOrUndefined() {
        return { kind: 'ok', value: OURS };
      },
      async removeDirectory(path) {
        // The second directory's removal fails (a surface turned unwritable).
        if (path.endsWith('oak-b')) {
          throw new Error('EACCES: surface unwritable mid-removal');
        }
        removedReal.push(path);
      },
      async resolveRealPath(path) {
        return { kind: 'ok', value: path };
      },
    };

    const result = await clearGeneratedAdapters('/repo', fs);

    // The first dir WAS removed; the error result carries that partial teardown
    // rather than the pre-cure behaviour (an unhandled throw with no state).
    expect(result.kind).toBe('error');
    expect(result.kind === 'error' ? result.removed?.map(posixPath) : undefined).toEqual([
      '/repo/.claude/skills/oak-a',
    ]);
    expect(removedReal.map(posixPath)).toEqual(['/repo/.claude/skills/oak-a']);
  });
});

describe('clearGeneratedAdapters over a real filesystem (the destructive path)', () => {
  it('removes a marker-carrying directory and leaves a foreign one, reporting the removal', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, '.claude/skills/oak-commit/SKILL.md', OURS);
    writeRepoFile(root, '.claude/skills/clerk/SKILL.md', FOREIGN);

    const result = await clearGeneratedAdapters(root);

    expect(result).toEqual({ kind: 'ok', removed: [join(root, '.claude/skills/oak-commit')] });
    expect(repoPathExists(root, '.claude/skills/oak-commit')).toBe(false);
    expect(repoPathExists(root, '.claude/skills/clerk/SKILL.md')).toBe(true);
  });

  it('refuses a symlinked surface ROOT: nothing outside the repo is read or removed', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    writeRepoFile(outside, 'skills/oak-victim/SKILL.md', OURS);
    writeRepoFile(outside, 'skills/oak-victim/scripts/important.sh', 'echo keep\n');
    removeRepoPath(root, '.claude/skills');
    symlinkRepoPath(root, '.claude/skills', `${outside}/skills`, 'dir');

    const result = await clearGeneratedAdapters(root);

    expect(result.kind).toBe('error');
    expect(repoPathExists(outside, 'skills/oak-victim/SKILL.md')).toBe(true);
    expect(readRepoBytes(outside, 'skills/oak-victim/scripts/important.sh')).toEqual(
      new TextEncoder().encode('echo keep\n'),
    );
  });

  it('refuses a symlinked surface ANCESTOR with a real skills dir inside it: the external tree is untouched', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    writeRepoFile(outside, 'dotclaude/skills/oak-victim/SKILL.md', OURS);
    removeRepoPath(root, '.claude');
    symlinkRepoPath(root, '.claude', `${outside}/dotclaude`, 'dir');

    const result = await clearGeneratedAdapters(root);

    expect(result.kind).toBe('error');
    expect(repoPathExists(outside, 'dotclaude/skills/oak-victim/SKILL.md')).toBe(true);
  });

  it('guards BOTH roots before removing anything: a hostile second root leaves the first root intact (no partial pass)', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    // A legitimate first surface with real Practice projections...
    writeRepoFile(root, '.claude/skills/oak-commit/SKILL.md', OURS);
    // ...and a symlinked SECOND surface root pointing at a real external tree.
    writeRepoFile(outside, 'skills/vendor/NOTES.txt', 'external\n');
    symlinkRepoPath(root, '.agents/skills', `${outside}/skills`, 'dir');

    const result = await clearGeneratedAdapters(root);

    expect(result.kind).toBe('error');
    // The whole-run precondition ran before any removal, so the legitimate
    // first-root projection is untouched — not half-cleared.
    expect(repoPathExists(root, '.claude/skills/oak-commit/SKILL.md')).toBe(true);
  });
});
