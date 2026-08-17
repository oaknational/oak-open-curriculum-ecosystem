import { afterEach, describe, expect, it } from 'vitest';

import { adapterStubPointerLine } from '../../src/skills-adapter-generate/adapter-stub';
import { generateAdapters } from '../../src/skills-adapter-generate/generator';

import {
  cleanupSandboxes,
  makeRepoDir,
  repoPathExists,
  sandboxRepo,
  writeRepoFile,
} from './test-helpers/skills-repo-sandbox';

/** A structurally genuine Practice projection stub. */
const PROJECTION_STUB = `---\nname: oak-commit\ndescription: Commit workflow.\n---\n\n# Commit (Claude Code)\n\n${adapterStubPointerLine('commit/SKILL-CANONICAL.md')}\n`;

/** A valid canonical, so a run that includes one is discovery-complete. */
const CANONICAL = `---\nname: commit\ndescription: Commit workflow.\n---\n\n# Commit\n\nBody.\n`;

afterEach(() => {
  cleanupSandboxes();
});

describe('clearFirst is folded behind the discovery-completeness gate', () => {
  it('refuses to clear when discovery finds ZERO canonicals (the wrong-directory repro): the existing projection survives', async () => {
    const root = sandboxRepo();
    // No .agent/skills canonicals at all — as in a run from a non-repo dir.
    // An existing Practice projection sits on the surface, ripe for a clear.
    writeRepoFile(root, '.claude/skills/oak-commit/SKILL.md', PROJECTION_STUB);

    const outcome = await generateAdapters({ repoRoot: root, prefix: 'oak-', clearFirst: true });

    expect(outcome.cleared).toEqual([]);
    expect(outcome.written).toEqual([]);
    expect(repoPathExists(root, '.claude/skills/oak-commit/SKILL.md')).toBe(true);
  });

  it('refuses to clear when discovery is INCOMPLETE (a half-authored canonical is skipped): the existing projection survives', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, '.agent/skills/commit/SKILL-CANONICAL.md', CANONICAL);
    // A directory at a canonical tier with no readable canonical → skipped,
    // so the whole discovery is incomplete even though one canonical parsed.
    makeRepoDir(root, '.agent/skills/broken');
    writeRepoFile(root, '.agent/skills/broken/notes.md', 'no canonical here\n');
    writeRepoFile(root, '.claude/skills/oak-commit/SKILL.md', PROJECTION_STUB);

    const outcome = await generateAdapters({ repoRoot: root, prefix: 'oak-', clearFirst: true });

    expect(outcome.cleared).toEqual([]);
    expect(outcome.written).toEqual([]);
    expect(repoPathExists(root, '.claude/skills/oak-commit/SKILL.md')).toBe(true);
  });

  it('clears and regenerates when discovery IS complete: the removed projection is reported on cleared', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, '.agent/skills/commit/SKILL-CANONICAL.md', CANONICAL);
    // A stale marker-carrying projection under a previous name — a clear target.
    writeRepoFile(root, '.claude/skills/oak-stale/SKILL.md', PROJECTION_STUB);

    const outcome = await generateAdapters({ repoRoot: root, prefix: 'oak-', clearFirst: true });

    expect(outcome.cleared).toContain(`${root}/.claude/skills/oak-stale`);
    expect(repoPathExists(root, '.claude/skills/oak-stale/SKILL.md')).toBe(false);
    expect(repoPathExists(root, '.claude/skills/oak-commit/SKILL.md')).toBe(true);
  });

  it('refuses a canonical whose directory name cannot round-trip as a class marker (a backtick) instead of first-writing an unrecognisable stub', async () => {
    const root = sandboxRepo();
    // A valid canonical, so discovery is complete...
    writeRepoFile(root, '.agent/skills/commit/SKILL-CANONICAL.md', CANONICAL);
    // ...and a pathological one whose backticked directory name cannot
    // round-trip through the class marker.
    writeRepoFile(
      root,
      '.agent/skills/back`tick/SKILL-CANONICAL.md',
      `---\nname: backtick-skill\ndescription: pathological.\n---\n\n# Backtick\n\nBody.\n`,
    );

    const outcome = await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    // The pathological canonical is refused (not first-written); the valid one
    // still emits.
    expect(outcome.refused.some((entry) => entry.includes('back`tick'))).toBe(true);
    expect(outcome.written.some((path) => path.includes('oak-commit'))).toBe(true);
  });
});
