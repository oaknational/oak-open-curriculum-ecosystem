import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  nearestExistingAncestor,
  resolveReadPathWithinRepo,
  resolveWriteTargetWithinRepo,
} from './flag-path-resolve.js';
import { inMemorySyncFileSystem } from './test-helpers/in-memory-sync-file-system.js';

/**
 * Containment behaviours of the shared flag-path resolvers: read targets
 * canonicalise (and so must exist); write targets need not exist — the
 * founding defect was a canary CLI that refused to CREATE its own artefacts
 * because the resolver `realpath`ed a not-yet-existing output path. Escape
 * attempts refuse on both, including a symlinked ancestor pointing outside
 * the repo. The probe the resolvers take carries no write, so resolution
 * cannot create anything; the trees here are literal.
 */

// Resolved, not joined: the resolvers compare against `path.resolve` output,
// which carries the drive letter on Windows, so a joined `\repo` would miss
// every key of the in-memory tree there.
const REPO = path.resolve(path.sep, 'repo');
const OUTSIDE = path.resolve(path.sep, 'outside');

const repoWith = (files: Readonly<Record<string, string>> = {}) =>
  inMemorySyncFileSystem({ directories: [REPO, OUTSIDE], files });

describe('nearestExistingAncestor', () => {
  it('returns the path itself when it exists', () => {
    expect(nearestExistingAncestor(REPO, repoWith().exists)).toBe(REPO);
  });

  it('walks up to the deepest existing directory for an absent nested path', () => {
    expect(nearestExistingAncestor(path.join(REPO, 'a/b/c.txt'), repoWith().exists)).toBe(REPO);
  });
});

describe('resolveReadPathWithinRepo', () => {
  it('resolves an existing in-repo file to its canonical path', () => {
    const fs = repoWith({ [path.join(REPO, 'ledger.jsonl')]: '' });

    expect(resolveReadPathWithinRepo(REPO, 'ledger.jsonl', { realpath: fs.realpath })).toEqual({
      ok: true,
      value: path.join(REPO, 'ledger.jsonl'),
    });
  });

  it('refuses a path that does not exist (a read target must exist)', () => {
    const fs = repoWith();

    expect(resolveReadPathWithinRepo(REPO, 'absent.jsonl', { realpath: fs.realpath }).ok).toBe(
      false,
    );
  });

  it('refuses a `..` escape', () => {
    const fs = repoWith({ [path.join(OUTSIDE, 'target.txt')]: '' });
    const escape = path.relative(REPO, path.join(OUTSIDE, 'target.txt'));

    const resolved = resolveReadPathWithinRepo(REPO, escape, { realpath: fs.realpath });

    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('outside');
    }
  });

  it('refuses an in-repo symlink whose target lies outside the repo', () => {
    const fs = inMemorySyncFileSystem({
      files: { [path.join(OUTSIDE, 'secret.txt')]: '' },
      links: { [path.join(REPO, 'alias.txt')]: path.join(OUTSIDE, 'secret.txt') },
    });

    expect(resolveReadPathWithinRepo(REPO, 'alias.txt', { realpath: fs.realpath }).ok).toBe(false);
  });
});

describe('resolveWriteTargetWithinRepo', () => {
  it('resolves a not-yet-existing nested target without needing it to exist', () => {
    const fs = repoWith();

    expect(resolveWriteTargetWithinRepo(REPO, 'artefacts/challenge/stream.jsonl', fs)).toEqual({
      ok: true,
      value: path.join(REPO, 'artefacts/challenge/stream.jsonl'),
    });
    expect(fs.exists(path.join(REPO, 'artefacts'))).toBe(false);
  });

  it('resolves an existing directory target', () => {
    const fs = inMemorySyncFileSystem({ directories: [path.join(REPO, 'out')] });

    expect(resolveWriteTargetWithinRepo(REPO, 'out', fs).ok).toBe(true);
  });

  it('refuses a dangling symlink at the target (a write would follow it blind)', () => {
    const fs = inMemorySyncFileSystem({
      directories: [REPO],
      links: {
        [path.join(REPO, 'plan-state.v1.report.json')]: path.join(REPO, 'no-such-destination.json'),
      },
    });

    const resolved = resolveWriteTargetWithinRepo(REPO, 'plan-state.v1.report.json', fs);

    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('dangling symlink');
    }
  });

  it('refuses a `..` escape lexically, before any existence probe', () => {
    const fs = repoWith();

    const resolved = resolveWriteTargetWithinRepo(REPO, '../escaped/anywhere.txt', fs);

    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('resolves outside the repository');
    }
  });

  it('refuses an existing ancestor that symlinks outside the repo', () => {
    const fs = inMemorySyncFileSystem({
      directories: [REPO, OUTSIDE],
      links: { [path.join(REPO, 'link')]: OUTSIDE },
    });

    const resolved = resolveWriteTargetWithinRepo(REPO, 'link/new-dir/new.txt', fs);

    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('outside');
    }
  });
});
