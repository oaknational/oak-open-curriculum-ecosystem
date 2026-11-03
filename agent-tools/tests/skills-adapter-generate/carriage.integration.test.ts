import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { checkAdapters } from '../../src/skills-adapter-generate/checker';
import { generateAdapters } from '../../src/skills-adapter-generate/generator';

import {
  cleanupSandboxes,
  listRepoFiles,
  makeRepoDir,
  readRepoBytes,
  removeRepoFile,
  repoPathExists,
  sandboxRepo,
  writeRepoFile,
} from './test-helpers/skills-repo-sandbox';

const canonicalBody = `---
name: parallax
description: A canonical skill with supporting directories.
---

# Parallax

Body.
`;

/** Deliberately not valid UTF-8 — byte stability must survive binary assets. */
const binaryAsset = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff, 0xfe, 0x0d, 0x0a]);

function seedSkill(root: string): void {
  const skillDir = '.agent/skills/cognition/parallax';
  writeRepoFile(root, `${skillDir}/SKILL-CANONICAL.md`, canonicalBody);
  writeRepoFile(root, `${skillDir}/references/orchestration.md`, '# Orchestration — nôn-ASCII\n');
  writeRepoFile(root, `${skillDir}/references/family/graphs/catalogue.json`, '{"nodes":[]}\n');
  writeRepoFile(root, `${skillDir}/scripts/render_graph.py`, 'print("render")\n');
  writeRepoFile(root, `${skillDir}/assets/mark.png`, binaryAsset);
  writeRepoFile(root, `${skillDir}/evals/evals.json`, '{"cases":[]}\n');
  makeRepoDir(root, `${skillDir}/references/empty-dir`);
}

afterEach(() => {
  cleanupSandboxes();
});

describe('generateAdapters carriage over a real filesystem', () => {
  it('carries supporting directories byte-stably into both surfaces, omitting evals and empty directories', async () => {
    const root = sandboxRepo();
    seedSkill(root);

    const outcome = await generateAdapters({
      repoRoot: root,
      prefix: 'oak-',
    });

    expect(outcome.skipped).toEqual([]);
    expect(outcome.pruned).toEqual([]);
    for (const surface of ['.claude', '.agents']) {
      const skillDir = `${surface}/skills/oak-parallax`;
      expect(listRepoFiles(root, skillDir)).toEqual([
        'assets/mark.png',
        'references/family/graphs/catalogue.json',
        'references/orchestration.md',
        'scripts/render_graph.py',
        'SKILL.md',
      ]);
      expect(readRepoBytes(root, `${skillDir}/assets/mark.png`)).toEqual(binaryAsset);
      expect(readRepoBytes(root, `${skillDir}/references/orchestration.md`)).toEqual(
        readRepoBytes(root, '.agent/skills/cognition/parallax/references/orchestration.md'),
      );
      expect(repoPathExists(root, `${skillDir}/evals`)).toBe(false);
      expect(repoPathExists(root, `${skillDir}/references/empty-dir`)).toBe(false);
    }
  });

  it('is idempotent and green under the real-filesystem checker', async () => {
    const root = sandboxRepo();
    seedSkill(root);

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });
    const result = await checkAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(result.drifted).toEqual([]);
    expect(result.missing).toEqual([]);
    expect(result.orphaned).toEqual([]);
    expect(result.canonicalCount).toBe(1);
    expect(result.carriedFileCount).toBe(4);
  });

  it('detects a mutated carried copy as drift and a deleted copy as missing', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    writeRepoFile(root, '.claude/skills/oak-parallax/references/orchestration.md', 'mutated\n');

    const result = await checkAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(result.drifted).toEqual([
      join(root, '.claude/skills/oak-parallax/references/orchestration.md'),
    ]);
  });

  it('prunes orphans (and the directories they emptied) when a canonical source is deleted', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    // Delete the canonical script; the projection copies become orphans.
    removeRepoFile(root, '.agent/skills/cognition/parallax/scripts/render_graph.py');

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect([...flagged.orphaned].sort((a, b) => a.localeCompare(b, 'en'))).toEqual([
      join(root, '.agents/skills/oak-parallax/scripts/render_graph.py'),
      join(root, '.claude/skills/oak-parallax/scripts/render_graph.py'),
    ]);

    const regenerated = await generateAdapters({
      repoRoot: root,
      prefix: 'oak-',
    });
    expect([...regenerated.pruned].sort((a, b) => a.localeCompare(b, 'en'))).toEqual([
      join(root, '.agents/skills/oak-parallax/scripts/render_graph.py'),
      join(root, '.claude/skills/oak-parallax/scripts/render_graph.py'),
    ]);
    expect(repoPathExists(root, '.claude/skills/oak-parallax/scripts')).toBe(false);
    expect(repoPathExists(root, '.agents/skills/oak-parallax/scripts')).toBe(false);

    const after = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(after.orphaned).toEqual([]);
    expect(after.missing).toEqual([]);
  });
});
