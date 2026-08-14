import { sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import type { CarriageReadFs, FsRead } from '../../src/skills-adapter-generate/carriage-fs';
import { checkAdapters, type CheckerFs } from '../../src/skills-adapter-generate/checker';
import { findStaleProjectionEntries } from '../../src/skills-adapter-generate/projection-roots';

const ok = <T>(value: T): FsRead<T> => ({ kind: 'ok', value });

// The product joins with the HOST separator (correct for real fs access);
// this fake compares in POSIX form for readability, so every incoming path
// normalises first.
const posixPath = (hostPath: string): string => hostPath.split(sep).join('/');

/**
 * Seam fake modelling one entry at one projection root whose SKILL.md
 * exists (entryKind: file) but whose content read fails — the
 * cannot-classify state the sweep must surface as a failure, never
 * certify or delete over. All other seam reads model an empty, healthy
 * tree.
 */
function makeUnreadableStubFs(unreadableStubPath: string): CarriageReadFs {
  return {
    async listSubdirectoryNames(path) {
      return ok(posixPath(path).endsWith('/.claude/skills') ? ['oak-broken'] : []);
    },
    async listFileNames() {
      return ok([]);
    },
    async listOtherEntryNames() {
      return ok([]);
    },
    async readFileBytesOrUndefined(path) {
      if (posixPath(path) === unreadableStubPath) {
        return { kind: 'failure', message: `cannot read ${path}: EACCES` };
      }
      return ok(undefined);
    },
    async entryKind(path) {
      if (posixPath(path) === unreadableStubPath) {
        return ok('file' as const);
      }
      return ok('absent' as const);
    },
    async isExecutableOrUndefined() {
      return ok(undefined);
    },
    async resolveRealPath(path) {
      return ok(path);
    },
  };
}

describe('findStaleProjectionEntries — the cannot-classify arm', () => {
  it('surfaces an unreadable stub as a failure and reports NOTHING stale: no verdict over an unobserved entry', async () => {
    const repoRoot = '/repo';
    const fs = makeUnreadableStubFs('/repo/.claude/skills/oak-broken/SKILL.md');

    const sweep = await findStaleProjectionEntries({
      repoRoot,
      projections: [{ canonicalRef: 'parallax/SKILL-CANONICAL.md', expectedName: 'oak-parallax' }],
      fs,
    });

    expect(sweep.stale).toEqual([]);
    expect(sweep.failures.some((message) => /EACCES/.test(message))).toBe(true);
  });

  it('composes into the checker as a refusal: the run cannot certify the surface it could not observe', async () => {
    const repoRoot = '/repo';
    const canonicalPath = `${repoRoot}/.agent/skills/parallax/SKILL-CANONICAL.md`;
    const canonicalBody =
      '---\nname: parallax\ndescription: A skill.\n---\n\n# Parallax\n\nBody.\n';
    const base = makeUnreadableStubFs(`${repoRoot}/.claude/skills/oak-broken/SKILL.md`);
    const fs: CheckerFs = {
      ...base,
      async listSubdirectoryNames(path) {
        if (posixPath(path).endsWith('/.agent/skills')) {
          return ok(['parallax']);
        }
        return base.listSubdirectoryNames(path);
      },
      async readFileOrUndefined(path) {
        return posixPath(path) === canonicalPath ? canonicalBody : undefined;
      },
    };

    const result = await checkAdapters({ repoRoot, prefix: 'oak-' }, fs);

    expect(result.stale).toEqual([]);
    expect(result.refused.some((message) => /EACCES/.test(message))).toBe(true);
  });
});
