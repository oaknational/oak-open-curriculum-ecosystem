import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  checkAdapters,
  defaultCheckerFs,
  type CheckerFs,
} from '../../src/skills-adapter-generate/checker';
import { generateAdapters } from '../../src/skills-adapter-generate/generator';

import {
  chmodRepoFile,
  cleanupSandboxes,
  readRepoBytes,
  repoFileIsExecutable,
  repoPathExists,
  removeRepoPath,
  renameRepoPath,
  repoPathIsSymlink,
  sandboxRepo,
  symlinkRepoPath,
  writeRepoFile,
} from './test-helpers/skills-repo-sandbox';

const canonicalBody = `---
name: parallax
description: A canonical skill with supporting directories.
---

# Parallax

Body.
`;

const CANONICAL_DIR = '.agent/skills/cognition/parallax';

function seedSkill(root: string): void {
  writeRepoFile(root, `${CANONICAL_DIR}/SKILL-CANONICAL.md`, canonicalBody);
  writeRepoFile(root, `${CANONICAL_DIR}/references/orchestration.md`, '# Orchestration\n');
  writeRepoFile(root, `${CANONICAL_DIR}/scripts/render_graph.py`, 'print("render")\n');
}

afterEach(() => {
  cleanupSandboxes();
});

describe('symlink safety over a real filesystem', () => {
  it('never writes through a projected carried-file symlink: the external target keeps its bytes and the link is replaced by a real copy', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    writeRepoFile(outside, 'victim.txt', 'external bytes stay\n');
    const linkPath = '.claude/skills/oak-parallax/references/orchestration.md';
    writeRepoFile(root, linkPath, ''); // ensure parent exists, then replace with a link
    removeRepoPath(root, `${linkPath}`);
    symlinkRepoPath(root, linkPath, `${outside}/victim.txt`, 'file');

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(readRepoBytes(outside, 'victim.txt')).toEqual(
      new TextEncoder().encode('external bytes stay\n'),
    );
    expect(repoPathIsSymlink(root, linkPath)).toBe(false);
    expect(readRepoBytes(root, linkPath)).toEqual(new TextEncoder().encode('# Orchestration\n'));
  });

  it('never arms a dangling projected symlink: regeneration must not create the link target', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    const linkPath = '.claude/skills/oak-parallax/scripts/render_graph.py';
    removeRepoPath(root, `${linkPath}`);
    symlinkRepoPath(root, linkPath, `${outside}/hooks/pre-commit`, 'file');

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(repoPathExists(outside, 'hooks/pre-commit')).toBe(false);
    expect(repoPathIsSymlink(root, linkPath)).toBe(false);
    expect(readRepoBytes(root, linkPath)).toEqual(new TextEncoder().encode('print("render")\n'));
  });

  it('reports a projected symlink as a failing state instead of certifying green through it', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    writeRepoFile(outside, 'victim.txt', '# Orchestration\n'); // byte-identical: only link-awareness can catch it
    const linkPath = '.claude/skills/oak-parallax/references/orchestration.md';
    removeRepoPath(root, `${linkPath}`);
    symlinkRepoPath(root, linkPath, `${outside}/victim.txt`, 'file');

    const result = await checkAdapters({ repoRoot: root, prefix: 'oak-' });

    // Product reports host-joined absolute paths; expectations compose the
    // same way.
    const failing = [...result.orphaned, ...result.drifted, ...result.missing];
    expect(failing).toContain(join(root, linkPath));
  });

  it('prunes a symlinked carried-root directory as the link: the external tree stays untouched and a real directory replaces it', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    seedSkill(root);
    // A genuine prior generation makes the target OURS; only then is the
    // later symlinked carried-root inside it ours to prune as the link.
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });
    writeRepoFile(outside, 'deep/existing.md', 'external tree stays\n');
    removeRepoPath(root, '.claude/skills/oak-parallax/references');
    symlinkRepoPath(root, '.claude/skills/oak-parallax/references', outside, 'dir');

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(readRepoBytes(outside, 'deep/existing.md')).toEqual(
      new TextEncoder().encode('external tree stays\n'),
    );
    expect(repoPathExists(outside, 'orchestration.md')).toBe(false);
    expect(repoPathIsSymlink(root, '.claude/skills/oak-parallax/references')).toBe(false);
    expect(readRepoBytes(root, '.claude/skills/oak-parallax/references/orchestration.md')).toEqual(
      new TextEncoder().encode('# Orchestration\n'),
    );
  });

  it('refuses a canonical carried ROOT that is itself a symlink: nothing external is smuggled and both surfaces report the refusal', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    writeRepoFile(root, `${CANONICAL_DIR}/SKILL-CANONICAL.md`, canonicalBody);
    writeRepoFile(outside, 'secret.txt', 'SECRET-EXTERNAL-BYTES\n');
    symlinkRepoPath(root, `${CANONICAL_DIR}/references`, outside, 'dir');

    const generated = await generateAdapters({
      repoRoot: root,
      prefix: 'oak-',
    });
    expect(generated.refused.some((message) => /symlink/.test(message))).toBe(true);
    expect(repoPathExists(root, '.claude/skills/oak-parallax/references/secret.txt')).toBe(false);
    expect(repoPathExists(root, '.claude/skills/oak-parallax/SKILL.md')).toBe(false);

    const checked = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(checked.refused.some((message) => /symlink/.test(message))).toBe(true);
  });

  it('refuses a symlinked surface-root ANCESTOR: nothing in the linked tree is removed or written', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    seedSkill(root);
    writeRepoFile(outside, 'skills/precious-external/KEEP.md', 'external tree stays\n');
    symlinkRepoPath(root, '.claude', outside, 'dir');

    const generated = await generateAdapters({
      repoRoot: root,
      prefix: 'oak-',
    });
    expect(generated.refused.some((message) => /resolves outside/.test(message))).toBe(true);
    expect(readRepoBytes(outside, 'skills/precious-external/KEEP.md')).toEqual(
      new TextEncoder().encode('external tree stays\n'),
    );

    const checked = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(checked.refused.some((message) => /resolves outside/.test(message))).toBe(true);
    // The guard runs BEFORE the per-canonical reads: no external content is
    // classified or byte-compared, so every content stream is empty (these
    // assertions regress on the pre-guard ordering, where the checker read
    // the linked tree and populated missing/drifted/orphaned).
    expect(checked.stale).toEqual([]);
    expect(checked.missing).toEqual([]);
    expect(checked.drifted).toEqual([]);
    expect(checked.orphaned).toEqual([]);
    expect(checked.carriedFileCount).toBe(0);
  });

  it('refuses a canonical-side symlink loudly: nothing is emitted for the skill and both surfaces report the refusal', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    seedSkill(root);
    writeRepoFile(outside, 'smuggled.md', 'external content\n');
    symlinkRepoPath(
      root,
      `${CANONICAL_DIR}/references/smuggled.md`,
      `${outside}/smuggled.md`,
      'file',
    );

    const generated = await generateAdapters({
      repoRoot: root,
      prefix: 'oak-',
    });
    expect(generated.refused.some((message) => /symlink/.test(message))).toBe(true);
    expect(repoPathExists(root, '.claude/skills/oak-parallax/references/smuggled.md')).toBe(false);
    expect(repoPathExists(root, '.claude/skills/oak-parallax/SKILL.md')).toBe(false);

    const checked = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(checked.refused.some((message) => /symlink/.test(message))).toBe(true);
  });
});

describe('shape transitions over a real filesystem', () => {
  it('cures a canonical file-to-directory transition instead of failing on the stale projected file', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    writeRepoFile(root, `${CANONICAL_DIR}/references/topic`, 'was a file\n');
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    removeRepoPath(root, `${CANONICAL_DIR}/references/topic`);
    writeRepoFile(root, `${CANONICAL_DIR}/references/topic/deep.md`, 'now a directory\n');

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(readRepoBytes(root, '.claude/skills/oak-parallax/references/topic/deep.md')).toEqual(
      new TextEncoder().encode('now a directory\n'),
    );
  });

  it('cures a canonical directory-to-file transition instead of failing on the stale projected directory', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    writeRepoFile(root, `${CANONICAL_DIR}/references/topic/deep.md`, 'was a directory\n');
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    removeRepoPath(root, `${CANONICAL_DIR}/references/topic`);
    writeRepoFile(root, `${CANONICAL_DIR}/references/topic`, 'now a file\n');

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(readRepoBytes(root, '.claude/skills/oak-parallax/references/topic')).toEqual(
      new TextEncoder().encode('now a file\n'),
    );
  });
});

describe('executable-mode carriage over a real filesystem', () => {
  // On-disk mode bits are a POSIX observable NTFS cannot express (the
  // owner-only write module's precedent): chmod is a no-op there and every
  // file reads non-executable, so a divergent bit cannot be STAGED on the
  // real filesystem of every host. The drift leg therefore injects the
  // executable-bit facet over the otherwise-real checker binding — the walk,
  // byte-compares, and reporting under test all run against the real sandbox
  // on every platform — and the carriage leg asserts the two sides' AGREEMENT,
  // the whole surface the host filesystem can express (bit-level restoration
  // included wherever bits exist).
  it('flags executable-bit drift through the checker when the two sides read differently (facet injected)', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    const canonicalScript = join(root, CANONICAL_DIR, 'scripts/render_graph.py');
    const projected = '.claude/skills/oak-parallax/scripts/render_graph.py';
    const fs: CheckerFs = {
      ...defaultCheckerFs,
      async isExecutableOrUndefined(path) {
        const real = await defaultCheckerFs.isExecutableOrUndefined(path);
        if (real.kind !== 'ok' || real.value === undefined) {
          return real;
        }
        return { kind: 'ok', value: path === canonicalScript };
      },
    };

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' }, fs);

    expect(flagged.drifted).toContain(join(root, projected));
  });

  it('keeps the projected copy’s executability agreeing with its canonical through generation and regeneration', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    const canonicalScript = `${CANONICAL_DIR}/scripts/render_graph.py`;
    chmodRepoFile(root, canonicalScript, 0o755);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    const projected = '.claude/skills/oak-parallax/scripts/render_graph.py';
    expect(repoFileIsExecutable(root, projected)).toBe(repoFileIsExecutable(root, canonicalScript));

    // A real divergence where bits exist; a no-op where they cannot — either
    // way regeneration must land the two sides in agreement again.
    chmodRepoFile(root, projected, 0o644);

    // The REAL executable facet must agree with an independent stat reading
    // on both sides — on POSIX these read true/false here, proving the facet
    // reads genuine, divergent bits (the injected-facet drift test above
    // cannot prove that); on NTFS both truthfully read false. Identical
    // assertion set on every host.
    expect(
      await defaultCheckerFs.isExecutableOrUndefined(join(root, canonicalScript)),
    ).toStrictEqual({ kind: 'ok', value: repoFileIsExecutable(root, canonicalScript) });
    expect(await defaultCheckerFs.isExecutableOrUndefined(join(root, projected))).toStrictEqual({
      kind: 'ok',
      value: repoFileIsExecutable(root, projected),
    });

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(repoFileIsExecutable(root, projected)).toBe(repoFileIsExecutable(root, canonicalScript));
  });
});

describe('projection-root reconciliation over a real filesystem', () => {
  it('reports a renamed canonical’s whole old projection as stale, and a generator run removes it from both surfaces', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    renameRepoPath(root, CANONICAL_DIR, '.agent/skills/cognition/parallax-two');

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(flagged.stale).toEqual([
      join(root, '.agents/skills/oak-parallax'),
      join(root, '.claude/skills/oak-parallax'),
    ]);

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(repoPathExists(root, '.claude/skills/oak-parallax')).toBe(false);
    expect(repoPathExists(root, '.agents/skills/oak-parallax')).toBe(false);
    expect(repoPathExists(root, '.claude/skills/oak-parallax-two/SKILL.md')).toBe(true);
    expect(repoPathExists(root, '.agents/skills/oak-parallax-two/scripts/render_graph.py')).toBe(
      true,
    );

    const after = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(after.stale).toEqual([]);
  });

  it('never sweeps while discovery is incomplete: a skipped directory protects every projection', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    // A hollow directory (no canonical inside) makes discovery incomplete;
    // an unreadable canonical presents identically. The existing projection
    // must survive — sweeping against a partial expected-set is deletion of
    // legitimate copies.
    renameRepoPath(
      root,
      `${CANONICAL_DIR}/SKILL-CANONICAL.md`,
      '.agent/skills/parked-canonical.md',
    );

    const outcome = await generateAdapters({
      repoRoot: root,
      prefix: 'oak-',
    });

    expect(outcome.skipped.length).toBeGreaterThan(0);
    expect(repoPathExists(root, '.claude/skills/oak-parallax/SKILL.md')).toBe(true);
    expect(repoPathExists(root, '.agents/skills/oak-parallax/scripts/render_graph.py')).toBe(true);
  });

  it('reports no stale entries while discovery is incomplete — the checker never demands a sweep the generator refuses', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    renameRepoPath(
      root,
      `${CANONICAL_DIR}/SKILL-CANONICAL.md`,
      '.agent/skills/parked-canonical-two.md',
    );

    const result = await checkAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(result.skipped.length).toBeGreaterThan(0);
    expect(result.stale).toEqual([]);
  });

  it('never sweeps against an empty canonical set: an empty skills root protects every projection', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    removeRepoPath(root, '.agent/skills/cognition');

    const outcome = await generateAdapters({
      repoRoot: root,
      prefix: 'oak-',
    });

    expect(outcome.written).toEqual([]);
    expect(repoPathExists(root, '.claude/skills/oak-parallax/SKILL.md')).toBe(true);
    expect(repoPathExists(root, '.agents/skills/oak-parallax/SKILL.md')).toBe(true);
  });
});

describe('same-length drift over a real filesystem', () => {
  it('detects a same-length byte difference in a carried copy (length comparison alone cannot)', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    const projected = '.claude/skills/oak-parallax/references/orchestration.md';
    writeRepoFile(root, projected, '# Orchestratioz\n'); // same byte length as '# Orchestration\n'

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(flagged.drifted).toEqual([join(root, projected)]);
  });
});

describe('validation jurisdiction: only recognised Practice projections are adjudicated (MCP-570)', () => {
  it('ignores a foreign real directory at both roots: nothing stale, and a generator run preserves it', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    writeRepoFile(
      root,
      '.agents/skills/clerk/SKILL.md',
      'vendor skill — external machinery owns it\n',
    );
    writeRepoFile(
      root,
      '.claude/skills/clerk-copy/SKILL.md',
      'vendor skill installed with --copy\n',
    );

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(flagged.stale).toEqual([]);

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(readRepoBytes(root, '.agents/skills/clerk/SKILL.md')).toEqual(
      new TextEncoder().encode('vendor skill — external machinery owns it\n'),
    );
    expect(readRepoBytes(root, '.claude/skills/clerk-copy/SKILL.md')).toEqual(
      new TextEncoder().encode('vendor skill installed with --copy\n'),
    );
  });

  it('ignores a foreign symlink (the pnpx skills install shape): nothing stale, link and target survive generation', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    writeRepoFile(root, '.agents/skills/clerk/SKILL.md', 'vendor canonical copy\n');
    symlinkRepoPath(root, '.claude/skills/clerk', '../../.agents/skills/clerk', 'dir');

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(flagged.stale).toEqual([]);

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(repoPathIsSymlink(root, '.claude/skills/clerk')).toBe(true);
    expect(readRepoBytes(root, '.agents/skills/clerk/SKILL.md')).toEqual(
      new TextEncoder().encode('vendor canonical copy\n'),
    );
  });

  it('membership is proven by content, never by name: a foreign directory sharing the generation prefix is untouched', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    writeRepoFile(
      root,
      '.claude/skills/oak-mystery/SKILL.md',
      'foreign skill, coincidental name\n',
    );

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(flagged.stale).toEqual([]);

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(readRepoBytes(root, '.claude/skills/oak-mystery/SKILL.md')).toEqual(
      new TextEncoder().encode('foreign skill, coincidental name\n'),
    );
  });

  it('never adjudicates any symlink entry: emission writes only real directories, so a link is never ours whatever its name', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    seedSkill(root);
    writeRepoFile(outside, 'elsewhere/SKILL.md', 'external skill tree\n');
    symlinkRepoPath(root, '.claude/skills/oak-linked-estate', `${outside}/elsewhere`, 'dir');

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(flagged.stale).toEqual([]);

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(repoPathIsSymlink(root, '.claude/skills/oak-linked-estate')).toBe(true);
    expect(readRepoBytes(outside, 'elsewhere/SKILL.md')).toEqual(
      new TextEncoder().encode('external skill tree\n'),
    );
  });

  it('recognises a projection generated under a previous prefix and sweeps it: the marker, not the name, is the class test', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak2-' });
    expect(flagged.stale).toEqual([
      join(root, '.agents/skills/oak-parallax'),
      join(root, '.claude/skills/oak-parallax'),
    ]);

    await generateAdapters({ repoRoot: root, prefix: 'oak2-' });

    expect(repoPathExists(root, '.claude/skills/oak-parallax')).toBe(false);
    expect(repoPathExists(root, '.claude/skills/oak2-parallax/SKILL.md')).toBe(true);
    expect(repoPathExists(root, '.agents/skills/oak2-parallax/SKILL.md')).toBe(true);
  });

  it('leaves a foreign directory with no SKILL.md alone: what cannot be proven ours is never reported or removed', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    writeRepoFile(root, '.claude/skills/oak-parallax-residue/notes.md', 'just files\n');

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(flagged.stale).toEqual([]);

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(repoPathExists(root, '.claude/skills/oak-parallax-residue/notes.md')).toBe(true);
  });
});

describe('emission-target jurisdiction: a name-addressed write never crosses into foreign territory (MCP-570 review round)', () => {
  it('refuses a symlink at the expected projection name: nothing is written through it and its external target stays byte-identical', async () => {
    const root = sandboxRepo();
    const outside = sandboxRepo();
    seedSkill(root);
    writeRepoFile(outside, 'vendor-real/SKILL.md', 'vendor content stays\n');
    writeRepoFile(outside, 'vendor-real/scripts/vendor.sh', 'echo vendor\n');
    symlinkRepoPath(root, '.claude/skills/oak-parallax', `${outside}/vendor-real`, 'dir');

    const generated = await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(generated.refused.some((message) => /not recognisably ours/.test(message))).toBe(true);
    expect(repoPathIsSymlink(root, '.claude/skills/oak-parallax')).toBe(true);
    expect(readRepoBytes(outside, 'vendor-real/SKILL.md')).toEqual(
      new TextEncoder().encode('vendor content stays\n'),
    );
    expect(readRepoBytes(outside, 'vendor-real/scripts/vendor.sh')).toEqual(
      new TextEncoder().encode('echo vendor\n'),
    );

    const checked = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(checked.refused.some((message) => /not recognisably ours/.test(message))).toBe(true);
  });

  it('refuses a foreign real directory at the expected projection name: its content is never adjudicated or overwritten', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    writeRepoFile(root, '.agents/skills/oak-parallax/SKILL.md', 'vendor skill, colliding name\n');
    writeRepoFile(root, '.agents/skills/oak-parallax/scripts/vendor.sh', 'echo vendor\n');

    const checked = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(checked.refused.some((message) => /not recognisably ours/.test(message))).toBe(true);

    const generated = await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(generated.refused.some((message) => /not recognisably ours/.test(message))).toBe(true);
    expect(readRepoBytes(root, '.agents/skills/oak-parallax/SKILL.md')).toEqual(
      new TextEncoder().encode('vendor skill, colliding name\n'),
    );
    expect(repoPathExists(root, '.agents/skills/oak-parallax/scripts/vendor.sh')).toBe(true);
  });

  it('refuses a foreign directory whose SKILL.md is a symlink to a genuine stub: content is never borrowed through a link', async () => {
    const root = sandboxRepo();
    seedSkill(root);
    await generateAdapters({ repoRoot: root, prefix: 'oak-' });
    writeRepoFile(root, '.claude/skills/vendor-x/scripts/vendor.sh', 'echo vendor\n');
    symlinkRepoPath(root, '.claude/skills/vendor-x/SKILL.md', '../oak-parallax/SKILL.md', 'file');

    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-' });
    expect(flagged.stale).toEqual([]);

    await generateAdapters({ repoRoot: root, prefix: 'oak-' });

    expect(repoPathExists(root, '.claude/skills/vendor-x/scripts/vendor.sh')).toBe(true);
    expect(repoPathIsSymlink(root, '.claude/skills/vendor-x/SKILL.md')).toBe(true);
  });
});
