import { join, sep } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { adapterStubPointerLine } from '../../src/skills-adapter-generate/adapter-stub';
import { generateAdapters } from '../../src/skills-adapter-generate/generator';

import {
  cleanupSandboxes,
  repoPathExists,
  sandboxRepo,
  symlinkRepoPath,
  writeRepoFile,
} from './test-helpers/skills-repo-sandbox';

/** A valid canonical, so a run that includes one is discovery-complete. */
const CANONICAL = `---\nname: commit\ndescription: Commit workflow.\n---\n\n# Commit\n\nBody.\n`;
const DEPLOY_CANONICAL = `---\nname: deploy\ndescription: Deploy workflow.\n---\n\n# Deploy\n\nBody.\n`;

/** A structurally genuine Practice projection stub for the named canonical —
 * clear and the emission-target guard recognise it by the class marker
 * (frontmatter + a parenthetical title line + the pointer line), whatever its
 * directory name. */
const projectionStub = (canonicalRef: string): string =>
  `---\nname: stub\ndescription: A projection.\n---\n\n# Stub (Claude Code)\n\n${adapterStubPointerLine(canonicalRef)}\n`;

afterEach(() => {
  cleanupSandboxes();
});

// Refusal messages name product-joined (host-form) paths; normalise before
// matching POSIX-form needles.
const posixForm = (message: string): string => message.split(sep).join('/');

describe('clearFirst preflights emission refusals before the destructive clear', () => {
  it('refuses to clear when a canonical would refuse at emit (a committed symlinked references/): the refusing skill’s own projection is NOT lost', async () => {
    const root = sandboxRepo();
    // A healthy canonical whose projection is a --clear target and must survive.
    writeRepoFile(root, '.agent/skills/commit/SKILL-CANONICAL.md', CANONICAL);
    writeRepoFile(
      root,
      '.claude/skills/oak-commit/SKILL.md',
      projectionStub('commit/SKILL-CANONICAL.md'),
    );
    // A second canonical whose carried `references/` is a committed symlink:
    // discovery accepts the canonical file, but carriage REFUSES the symlinked
    // carried root at emit. Under clear-then-emit, the clear tears down this
    // skill’s existing projection and the emit then refuses to rebuild it — a
    // lost projection, no attacker required (review 2026-08-12, defect 1).
    writeRepoFile(root, '.agent/skills/deploy/SKILL-CANONICAL.md', DEPLOY_CANONICAL);
    symlinkRepoPath(root, '.agent/skills/deploy/references', '../commit', 'dir');
    writeRepoFile(
      root,
      '.claude/skills/oak-deploy/SKILL.md',
      projectionStub('deploy/SKILL-CANONICAL.md'),
    );
    writeRepoFile(
      root,
      '.agents/skills/oak-deploy/SKILL.md',
      projectionStub('deploy/SKILL-CANONICAL.md'),
    );

    const outcome = await generateAdapters({ repoRoot: root, prefix: 'oak-', clearFirst: true });

    // The refusal is reported and the run fails — but BEFORE any teardown.
    expect(outcome.refused.some((entry) => posixForm(entry).includes('deploy/references'))).toBe(
      true,
    );
    expect(outcome.cleared).toEqual([]);
    expect(outcome.written).toEqual([]);
    // Every projection a clear would have destroyed survives: the refusing
    // skill’s own projection (both surfaces) AND the healthy neighbour’s.
    expect(repoPathExists(root, '.claude/skills/oak-deploy/SKILL.md')).toBe(true);
    expect(repoPathExists(root, '.agents/skills/oak-deploy/SKILL.md')).toBe(true);
    expect(repoPathExists(root, '.claude/skills/oak-commit/SKILL.md')).toBe(true);
  });

  it('refuses to clear when a canonical directory name cannot round-trip as a class marker (a backtick): the existing projection survives', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, '.agent/skills/commit/SKILL-CANONICAL.md', CANONICAL);
    writeRepoFile(
      root,
      '.claude/skills/oak-commit/SKILL.md',
      projectionStub('commit/SKILL-CANONICAL.md'),
    );
    // A pathological canonical whose backticked directory name cannot round-trip
    // through the class marker: it refuses at emit, so with --clear it must
    // refuse BEFORE the clear rather than tear the neighbour down first.
    writeRepoFile(
      root,
      '.agent/skills/back`tick/SKILL-CANONICAL.md',
      `---\nname: backtick-skill\ndescription: pathological.\n---\n\n# Backtick\n\nBody.\n`,
    );

    const outcome = await generateAdapters({ repoRoot: root, prefix: 'oak-', clearFirst: true });

    expect(outcome.refused.some((entry) => entry.includes('back`tick'))).toBe(true);
    expect(outcome.cleared).toEqual([]);
    expect(outcome.written).toEqual([]);
    expect(repoPathExists(root, '.claude/skills/oak-commit/SKILL.md')).toBe(true);
  });

  it('still clears and regenerates when every canonical CAN emit: no false refusal from the preflight', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, '.agent/skills/commit/SKILL-CANONICAL.md', CANONICAL);
    writeRepoFile(root, '.agent/skills/deploy/SKILL-CANONICAL.md', DEPLOY_CANONICAL);
    // A stale marker-carrying projection under a previous name — a clear target.
    writeRepoFile(
      root,
      '.claude/skills/oak-stale/SKILL.md',
      projectionStub('commit/SKILL-CANONICAL.md'),
    );

    const outcome = await generateAdapters({ repoRoot: root, prefix: 'oak-', clearFirst: true });

    expect(outcome.refused).toEqual([]);
    expect(outcome.cleared).toContain(join(root, '.claude/skills/oak-stale'));
    expect(repoPathExists(root, '.claude/skills/oak-stale/SKILL.md')).toBe(false);
    expect(repoPathExists(root, '.claude/skills/oak-commit/SKILL.md')).toBe(true);
    expect(repoPathExists(root, '.claude/skills/oak-deploy/SKILL.md')).toBe(true);
  });

  it('refuses to clear when a canonical’s current-prefix target is occupied by a foreign entry: the skill’s old-prefix projection is NOT lost', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, '.agent/skills/deploy/SKILL-CANONICAL.md', DEPLOY_CANONICAL);
    // The skill’s live projection under a PREVIOUS prefix — marker-carrying, so
    // clear removes it whatever its name.
    writeRepoFile(
      root,
      '.claude/skills/legacy-deploy/SKILL.md',
      projectionStub('deploy/SKILL-CANONICAL.md'),
    );
    // A FOREIGN entry squats the skill’s CURRENT-prefix target name — not
    // marker-carrying, so the clear leaves it (out of jurisdiction) and emit then
    // REFUSES it. Under clear-then-emit, the clear strips legacy-deploy and the
    // emit cannot rebuild deploy at oak-deploy — a lost projection with no
    // canonical-side refusal to catch it (review round 4, 2026-08-12).
    writeRepoFile(root, '.claude/skills/oak-deploy/SKILL.md', 'a foreign, non-marker stub\n');

    const outcome = await generateAdapters({ repoRoot: root, prefix: 'oak-', clearFirst: true });

    expect(outcome.refused.some((entry) => entry.includes('oak-deploy'))).toBe(true);
    expect(outcome.cleared).toEqual([]);
    // Nothing torn down: the old-prefix projection survives, and the foreign
    // squatter is left untouched.
    expect(repoPathExists(root, '.claude/skills/legacy-deploy/SKILL.md')).toBe(true);
    expect(repoPathExists(root, '.claude/skills/oak-deploy/SKILL.md')).toBe(true);
  });
});
