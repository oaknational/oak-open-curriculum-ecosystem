import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  nearestExistingAncestor,
  resolveReadPathWithinRepo,
  resolveWriteTargetWithinRepo,
} from './flag-path-resolve.js';

/**
 * Containment behaviours of the shared flag-path resolvers: read targets
 * canonicalise (and so must exist); write targets need not exist — the
 * founding defect was a canary CLI that refused to CREATE its own artefacts
 * because the resolver `realpath`ed a not-yet-existing output path. Escape
 * attempts refuse on both, including a symlinked ancestor pointing outside
 * the repo, and resolution never creates anything on disk.
 */

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function makeRepoRoot(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), 'flag-path-resolve-'));
  tempRoots.push(root);
  return root;
}

describe('nearestExistingAncestor', () => {
  it('returns the path itself when it exists', async () => {
    const root = await makeRepoRoot();
    expect(nearestExistingAncestor(root)).toBe(root);
  });

  it('walks up to the deepest existing directory for an absent nested path', async () => {
    const root = await makeRepoRoot();
    expect(nearestExistingAncestor(path.join(root, 'a/b/c.txt'))).toBe(root);
  });
});

describe('resolveReadPathWithinRepo', () => {
  it('resolves an existing in-repo file to its canonical path', async () => {
    const root = await makeRepoRoot();
    await writeFile(path.join(root, 'ledger.jsonl'), '', 'utf8');
    const resolved = resolveReadPathWithinRepo(root, 'ledger.jsonl');
    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      expect(existsSync(resolved.value)).toBe(true);
    }
  });

  it('refuses a path that does not exist (a read target must exist)', async () => {
    const root = await makeRepoRoot();
    expect(resolveReadPathWithinRepo(root, 'absent.jsonl').ok).toBe(false);
  });

  it('refuses a `..` escape', async () => {
    const root = await makeRepoRoot();
    const outside = await makeRepoRoot();
    await writeFile(path.join(outside, 'target.txt'), '', 'utf8');
    const escape = path.relative(root, path.join(outside, 'target.txt'));
    const resolved = resolveReadPathWithinRepo(root, escape);
    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('outside');
    }
  });
});

describe('resolveWriteTargetWithinRepo', () => {
  it('resolves a not-yet-existing nested target WITHOUT creating it', async () => {
    const root = await makeRepoRoot();
    const resolved = resolveWriteTargetWithinRepo(root, 'artefacts/challenge/stream.jsonl');
    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      expect(resolved.value).toBe(path.join(root, 'artefacts/challenge/stream.jsonl'));
    }
    expect(existsSync(path.join(root, 'artefacts'))).toBe(false);
  });

  it('resolves an existing directory target', async () => {
    const root = await makeRepoRoot();
    await mkdir(path.join(root, 'out'));
    const resolved = resolveWriteTargetWithinRepo(root, 'out');
    expect(resolved.ok).toBe(true);
  });

  it('refuses a dangling symlink at the target (write would follow it blind)', async () => {
    const dir = await makeRepoRoot();
    const target = path.join(dir, 'plan-state.v1.report.json');
    // 'junction' is ignored on POSIX and unprivileged on Windows; lstat still
    // sees a symlink, and the dangling refusal under test is type-agnostic.
    await symlink(path.join(dir, 'no-such-destination.json'), target, 'junction');
    const resolved = resolveWriteTargetWithinRepo(dir, 'plan-state.v1.report.json');
    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('dangling symlink');
    }
  });

  it('refuses a `..` escape lexically, before any existence probe', async () => {
    const root = await makeRepoRoot();
    const resolved = resolveWriteTargetWithinRepo(root, '../escaped/anywhere.txt');
    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('resolves outside the repository');
    }
  });

  it('refuses an existing ancestor that symlinks outside the repo', async () => {
    const root = await makeRepoRoot();
    const outside = await makeRepoRoot();
    // 'junction' is ignored on POSIX and unprivileged on Windows; lstat still
    // sees a symlink at the directory ancestor.
    await symlink(outside, path.join(root, 'link'), 'junction');
    const resolved = resolveWriteTargetWithinRepo(root, 'link/new-dir/new.txt');
    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('outside');
    }
  });
});
