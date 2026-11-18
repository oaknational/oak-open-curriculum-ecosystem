import { unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { pullProfile, readSyncState } from './operator-profile-git.js';
import { pushProfile } from './operator-profile-git-push.js';
import { parseSyncArgs, syncTarget } from './operator-profile-sync.js';
import {
  assessSyncState,
  dirtyPaths,
  isProfileDocumentPath,
} from './operator-profile-sync-state.js';
import { failure, PROFILE_PATHSPECS, scripted } from './test-helpers/git-runner-fakes.js';

const CLEAN = {
  isRepository: true,
  hasRemote: true,
  hasUpstream: true,
  porcelain: '',
  ahead: 0,
  behind: 0,
} as const;

describe('syncTarget', () => {
  it('refuses a symlinked root before any git runner exists for it', async () => {
    const target = await syncTarget('/profile-link', () =>
      Promise.resolve({ ok: true, value: 'symlink' }),
    );
    expect(target).toEqual({
      ok: false,
      error: '/profile-link is a symlink — the profile root is never followed',
    });
  });

  it('reports an absent root as nothing to sync, never as an error', async () => {
    const target = await syncTarget('/no-profile', () =>
      Promise.resolve({ ok: true, value: 'absent' }),
    );
    expect(target).toEqual({
      ok: true,
      value: 'profile at /no-profile is absent or not a git repository — nothing to sync',
    });
  });

  it('surfaces a root the probe cannot read as the failure it is', async () => {
    const target = await syncTarget('/sealed', () =>
      Promise.resolve({ ok: false, error: 'cannot read /sealed (EACCES)' }),
    );
    expect(target).toEqual({ ok: false, error: 'cannot read /sealed (EACCES)' });
  });
});

describe('assessSyncState', () => {
  it('treats a non-repository and a repository without a remote as information, never findings', () => {
    expect(assessSyncState({ ...CLEAN, isRepository: false }).findings).toEqual([]);
    expect(assessSyncState({ ...CLEAN, isRepository: false }).info).toHaveLength(1);
    expect(assessSyncState({ ...CLEAN, hasRemote: false }).findings).toEqual([]);
    expect(assessSyncState({ ...CLEAN, hasRemote: false }).info).toHaveLength(1);
  });

  it('is clean when the tree is clean and the branch matches its upstream', () => {
    expect(assessSyncState(CLEAN)).toEqual({ findings: [], info: [] });
  });

  it('names dirty paths, unpushed commits and a behind branch, each with its cure', () => {
    const assessment = assessSyncState({
      ...CLEAN,
      porcelain: ' M index.md\0?? machines/new.md\0',
      ahead: 2,
      behind: 1,
    });
    expect(assessment.findings).toHaveLength(3);
    expect(assessment.findings[0]).toContain('2 uncommitted changes (index.md, machines/new.md)');
    expect(assessment.findings[0]).toContain('pnpm profile:sync push');
    expect(assessment.findings[1]).toContain('2 unpushed commits');
    expect(assessment.findings[2]).toContain('1 commit behind the remote');
    expect(assessment.findings[2]).toContain('pnpm profile:sync pull');
  });

  it('reports a missing upstream once and does not count ahead or behind', () => {
    const assessment = assessSyncState({ ...CLEAN, hasUpstream: false, ahead: 5, behind: 5 });
    expect(assessment.findings).toHaveLength(1);
    expect(assessment.findings[0]).toContain('tracks no upstream');
  });

  it('gives dirty git furniture its own cure, since a push cannot stage it', () => {
    const assessment = assessSyncState({ ...CLEAN, porcelain: ' M .gitignore\0 M index.md\0' });
    expect(assessment.findings).toHaveLength(2);
    expect(assessment.findings[0]).toContain('1 uncommitted change (index.md)');
    expect(assessment.findings[1]).toContain('outside the profile documents (.gitignore)');
    expect(assessment.findings[1]).not.toContain('profile:sync push --message');
  });
});

describe('isProfileDocumentPath', () => {
  it('admits the three document kinds and nothing else', () => {
    expect(isProfileDocumentPath('index.md')).toBe(true);
    expect(isProfileDocumentPath('repos/a--b.md')).toBe(true);
    expect(isProfileDocumentPath('machines/host.md')).toBe(true);
    expect(isProfileDocumentPath('.gitignore')).toBe(false);
    expect(isProfileDocumentPath('reposit.md')).toBe(false);
  });
});

describe('dirtyPaths', () => {
  it('reads the paths off NUL-delimited porcelain records and ignores empty records', () => {
    expect(dirtyPaths(' M a.md\0\0?? b/c.md\0')).toEqual(['a.md', 'b/c.md']);
    expect(dirtyPaths('')).toEqual([]);
  });

  it('reads both paths of a rename or copy record instead of slicing the pair as one path', () => {
    expect(dirtyPaths('R  repos/new--name.md\0repos/old--name.md\0 M index.md\0')).toEqual([
      'repos/new--name.md',
      'repos/old--name.md',
      'index.md',
    ]);
    expect(dirtyPaths(' C machines/copy.md\0machines/host.md\0')).toEqual([
      'machines/copy.md',
      'machines/host.md',
    ]);
  });

  it('keeps a path with spaces or an arrow intact, since -z neither quotes nor escapes', () => {
    expect(dirtyPaths(' M repos/a -> b.md\0')).toEqual(['repos/a -> b.md']);
  });
});

describe('readSyncState', () => {
  it('reads remote, upstream, NUL-delimited porcelain and the left-right count', () => {
    const { run, calls } = scripted([
      { prefix: ['remote'], stdout: 'origin' },
      { prefix: ['rev-parse', '--abbrev-ref'], stdout: 'origin/main' },
      { prefix: ['status', '--porcelain'], stdout: ' M index.md\0' },
      { prefix: ['rev-list', '--left-right'], stdout: '1\t2' },
    ]);
    expect(unwrap(readSyncState(run))).toEqual({
      isRepository: true,
      hasRemote: true,
      hasUpstream: true,
      porcelain: ' M index.md\0',
      ahead: 2,
      behind: 1,
    });
    expect(calls).toContainEqual(['status', '--porcelain', '-z']);
  });

  it('does not count when there is no upstream', () => {
    const { run, calls } = scripted([
      { prefix: ['remote'], stdout: 'origin' },
      { prefix: ['rev-parse', '--abbrev-ref'], ok: false },
      { prefix: ['status', '--porcelain'], stdout: '' },
    ]);
    expect(unwrap(readSyncState(run))).toMatchObject({ hasUpstream: false, ahead: 0, behind: 0 });
    expect(calls.some((call) => call[0] === 'rev-list')).toBe(false);
  });

  it('reports a git command that fails to run as an error, never as a clean state', () => {
    const remoteFails = scripted([{ prefix: ['remote'], ok: false }]);
    expect(failure(readSyncState(remoteFails.run))).toContain('git remote failed');
    const statusFails = scripted([
      { prefix: ['remote'], stdout: 'origin' },
      { prefix: ['rev-parse', '--abbrev-ref'], stdout: 'origin/main' },
      { prefix: ['status', '--porcelain'], ok: false },
    ]);
    expect(failure(readSyncState(statusFails.run))).toContain('git status failed');
    const countFails = scripted([
      { prefix: ['remote'], stdout: 'origin' },
      { prefix: ['rev-parse', '--abbrev-ref'], stdout: 'origin/main' },
      { prefix: ['status', '--porcelain'], stdout: '' },
      { prefix: ['rev-list', '--left-right'], ok: false },
    ]);
    expect(failure(readSyncState(countFails.run))).toContain('git rev-list failed');
  });
});

describe('pullProfile', () => {
  it('fast-forwards when it can', () => {
    const { run, calls } = scripted([
      { prefix: ['fetch'] },
      { prefix: ['rev-parse', '--abbrev-ref'], stdout: 'origin/main' },
      { prefix: ['merge', '--ff-only'], stdout: 'Updating 1..2\nFast-forward' },
    ]);
    expect(unwrap(pullProfile(run))).toBe('Updating 1..2');
    expect(calls.map((call) => call[0])).toEqual(['fetch', 'rev-parse', 'merge']);
  });

  it('falls back to a plain merge, never a rebase, when fast-forward is impossible', () => {
    const { run, calls } = scripted([
      { prefix: ['fetch'] },
      { prefix: ['rev-parse', '--abbrev-ref'], stdout: 'origin/main' },
      { prefix: ['merge', '--ff-only'], ok: false },
      { prefix: ['merge', '--no-edit'] },
    ]);
    expect(unwrap(pullProfile(run))).toContain('plain merge, never a rebase');
    expect(calls.some((call) => call[0] === 'rebase')).toBe(false);
  });

  it('surfaces a conflict with its files and the union instruction', () => {
    const { run } = scripted([
      { prefix: ['fetch'] },
      { prefix: ['rev-parse', '--abbrev-ref'], stdout: 'origin/main' },
      { prefix: ['merge', '--ff-only'], ok: false },
      { prefix: ['merge', '--no-edit'], ok: false },
      { prefix: ['diff', '--name-only'], stdout: 'index.md\nmachines/a.md' },
    ]);
    const result = pullProfile(run);
    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error).toContain('merge conflict in index.md, machines/a.md');
    expect(result.ok ? '' : result.error).toContain('union');
    expect(result.ok ? '' : result.error).toContain(
      'then pnpm profile:sync push --message "<seat>: <the fact>"',
    );
  });

  it('refuses when the branch tracks no upstream', () => {
    const { run } = scripted([{ prefix: ['fetch'] }, { prefix: ['rev-parse'], ok: false }]);
    expect(pullProfile(run).ok).toBe(false);
  });
});

// No merge in progress: `rev-parse -q --verify MERGE_HEAD` exits 1, quietly.
const NOT_MERGING = {
  prefix: ['rev-parse', '-q', '--verify', 'MERGE_HEAD'],
  ok: false,
  stderr: '',
} as const;

describe('pushProfile', () => {
  const NOTHING_TRACKED = { prefix: ['ls-files'], stdout: '' } as const;
  const UPSTREAM = { prefix: ['rev-parse', '--abbrev-ref'], stdout: 'origin/main' } as const;
  const CHANGED = { prefix: ['diff', '--cached', '--quiet'], ok: false } as const;
  const AHEAD_ONE = { prefix: ['rev-list', '--left-right'], stdout: '0\t1' } as const;

  it('stages by pathspec, commits only those paths with the message, and pushes to the upstream', () => {
    const { run, calls } = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      CHANGED,
      { prefix: ['commit'] },
      UPSTREAM,
      AHEAD_ONE,
      { prefix: ['push', '--quiet'] },
    ]);
    expect(unwrap(pushProfile(run, 'seat: fact', PROFILE_PATHSPECS))).toBe('committed and pushed');
    expect(calls.find((call) => call[0] === 'ls-files')).toEqual([
      'ls-files',
      '--',
      'index.md',
      'repos',
      'machines',
    ]);
    expect(calls.find((call) => call[0] === 'add')).toEqual([
      'add',
      '--',
      'index.md',
      'repos',
      'machines',
    ]);
    expect(calls.find((call) => call[0] === 'diff')).toEqual([
      'diff',
      '--cached',
      '--quiet',
      '--',
      'index.md',
      'repos',
      'machines',
    ]);
    expect(calls.find((call) => call[0] === 'commit')).toEqual([
      'commit',
      '--quiet',
      '--only',
      '-m',
      'seat: fact',
      '--',
      'index.md',
      'repos',
      'machines',
    ]);
    expect(calls.at(-1)).toEqual(['push', '--quiet']);
  });

  it('stages a tracked document whose directory no longer exists, so a deletion is committed', () => {
    const { run, calls } = scripted([
      NOT_MERGING,
      { prefix: ['ls-files'], stdout: 'index.md\nrepos/a--b.md' },
      { prefix: ['add'] },
      CHANGED,
      { prefix: ['commit'] },
      UPSTREAM,
      AHEAD_ONE,
      { prefix: ['push', '--quiet'] },
    ]);
    expect(pushProfile(run, 'seat: fact', ['index.md']).ok).toBe(true);
    expect(calls.find((call) => call[0] === 'add')).toEqual([
      'add',
      '--',
      'index.md',
      'repos/a--b.md',
    ]);
    expect(calls.find((call) => call[0] === 'commit')?.slice(-3)).toEqual([
      '--',
      'index.md',
      'repos/a--b.md',
    ]);
  });

  it('refuses a document git records as a symbolic link, naming it and the cure', () => {
    // With core.symlinks=false a path the index holds as a link stays one when
    // its file is rewritten and staged; the push would commit a link.
    const { run } = scripted([
      NOT_MERGING,
      {
        prefix: ['ls-files', '--stage'],
        stdout: '100644 1111111 0\tindex.md\u0000120000 2222222 0\trepos/a--b.md\u0000',
      },
      NOTHING_TRACKED,
      { prefix: ['add'] },
      CHANGED,
      { prefix: ['commit'] },
      UPSTREAM,
      AHEAD_ONE,
      { prefix: ['push', '--quiet'] },
    ]);
    expect(failure(pushProfile(run, 'seat: fact', PROFILE_PATHSPECS))).toBe(
      'repos/a--b.md is recorded in git as a symbolic link — a profile document never is: in the profile root run git rm --cached -- <path> for each, then pnpm profile:sync push --message "<seat>: <the fact>"',
    );
  });

  it('sets the upstream on the first push, on the one remote whatever its name', () => {
    const { run, calls } = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      CHANGED,
      { prefix: ['commit'] },
      { prefix: ['rev-parse', '--abbrev-ref'], ok: false },
      { prefix: ['remote'], stdout: 'sync' },
      { prefix: ['push', '--quiet', '-u'] },
    ]);
    expect(unwrap(pushProfile(run, 'seat: fact', PROFILE_PATHSPECS))).toBe(
      'committed and pushed; upstream set on sync',
    );
    expect(calls.at(-1)).toEqual(['push', '--quiet', '-u', 'sync', 'HEAD']);
  });

  it('refuses to guess between several remotes when no upstream is set', () => {
    const { run, calls } = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      CHANGED,
      { prefix: ['commit'] },
      { prefix: ['rev-parse', '--abbrev-ref'], ok: false },
      { prefix: ['remote'], stdout: 'origin\nmirror' },
    ]);
    expect(failure(pushProfile(run, 'seat: fact', PROFILE_PATHSPECS))).toContain(
      '2 remotes and no upstream',
    );
    expect(calls.some((call) => call[0] === 'push')).toBe(false);
  });

  it('still pushes commits an earlier push left local when there is nothing new to commit', () => {
    const { run, calls } = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      { prefix: ['diff', '--cached', '--quiet'] },
      UPSTREAM,
      { prefix: ['rev-list', '--left-right'], stdout: '0\t2' },
      { prefix: ['push', '--quiet'] },
    ]);
    expect(unwrap(pushProfile(run, 'seat: fact', PROFILE_PATHSPECS))).toBe(
      'pushed 2 local commits (nothing new to commit)',
    );
    expect(calls.some((call) => call[0] === 'commit')).toBe(false);
    expect(calls.at(-1)).toEqual(['push', '--quiet']);
  });

  it('sets the upstream even when there is nothing new to commit', () => {
    const { run, calls } = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      { prefix: ['diff', '--cached', '--quiet'] },
      { prefix: ['rev-parse', '--abbrev-ref'], ok: false },
      { prefix: ['remote'], stdout: 'origin' },
      { prefix: ['push', '--quiet', '-u'] },
    ]);
    expect(unwrap(pushProfile(run, 'seat: fact', PROFILE_PATHSPECS))).toBe(
      'pushed; upstream set on origin',
    );
    expect(calls.at(-1)).toEqual(['push', '--quiet', '-u', 'origin', 'HEAD']);
  });

  it('reports in sync without committing or pushing when nothing changed and nothing is ahead', () => {
    const { run, calls } = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      { prefix: ['diff', '--cached', '--quiet'] },
      UPSTREAM,
      { prefix: ['rev-list', '--left-right'], stdout: '0\t0' },
    ]);
    expect(unwrap(pushProfile(run, 'seat: fact', PROFILE_PATHSPECS))).toBe(
      'nothing to commit; in sync with the upstream',
    );
    expect(calls.some((call) => call[0] === 'commit' || call[0] === 'push')).toBe(false);
  });

  it('refuses to push a branch behind its remote and prescribes the pull, whether or not it committed', () => {
    const behind = { prefix: ['rev-list', '--left-right'], stdout: '1\t0' } as const;
    const clean = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      { prefix: ['diff', '--cached', '--quiet'] },
      UPSTREAM,
      behind,
    ]);
    expect(failure(pushProfile(clean.run, 'seat: fact', PROFILE_PATHSPECS))).toBe(
      'the branch is 1 commit behind the remote — run pnpm profile:sync pull, then push again',
    );
    const committed = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      CHANGED,
      { prefix: ['commit'] },
      UPSTREAM,
      { prefix: ['rev-list', '--left-right'], stdout: '2\t1' },
    ]);
    expect(failure(pushProfile(committed.run, 'seat: fact', PROFILE_PATHSPECS))).toContain(
      'committed locally; the branch is 2 commits behind',
    );
    expect(committed.calls.some((call) => call[0] === 'push')).toBe(false);
  });

  it('stages only the paths given plus tracked ones, so an absent untracked directory is never a pathspec', () => {
    const { run, calls } = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      CHANGED,
      { prefix: ['commit'] },
      UPSTREAM,
      AHEAD_ONE,
      { prefix: ['push', '--quiet'] },
    ]);
    expect(pushProfile(run, 'seat: fact', ['index.md']).ok).toBe(true);
    expect(calls.find((call) => call[0] === 'add')).toEqual(['add', '--', 'index.md']);
    expect(calls.find((call) => call[0] === 'commit')?.slice(-2)).toEqual(['--', 'index.md']);
  });

  it('keeps the commit local and says so when the push fails', () => {
    const { run } = scripted([
      NOT_MERGING,
      NOTHING_TRACKED,
      { prefix: ['add'] },
      CHANGED,
      { prefix: ['commit'] },
      UPSTREAM,
      AHEAD_ONE,
      { prefix: ['push'], ok: false },
    ]);
    expect(failure(pushProfile(run, 'seat: fact', PROFILE_PATHSPECS))).toContain(
      'the commits are local',
    );
  });
});

describe('parseSyncArgs', () => {
  it('accepts pull, and push with a message', () => {
    expect(unwrap(parseSyncArgs(['pull']))).toEqual({ kind: 'pull', root: undefined });
    expect(unwrap(parseSyncArgs(['push', '--message', 'seat: fact']))).toEqual({
      kind: 'push',
      message: 'seat: fact',
      root: undefined,
    });
  });

  it('accepts --root on either command, in any option order, and carries its value once', () => {
    expect(unwrap(parseSyncArgs(['pull', '--root', '/srv/profile']))).toEqual({
      kind: 'pull',
      root: '/srv/profile',
    });
    expect(
      unwrap(parseSyncArgs(['push', '--root', '/srv/profile', '--message', 'seat: fact'])),
    ).toEqual({ kind: 'push', message: 'seat: fact', root: '/srv/profile' });
    expect(failure(parseSyncArgs(['pull', '--root', '']))).toContain('--root needs a value');
    expect(failure(parseSyncArgs(['pull', '--root', '   ']))).toContain('--root needs a value');
  });

  it('refuses push without a message, and an unknown command', () => {
    expect(parseSyncArgs(['push']).ok).toBe(false);
    expect(parseSyncArgs(['push', '--message', '--root']).ok).toBe(false);
    expect(parseSyncArgs(['sync']).ok).toBe(false);
    expect(parseSyncArgs([]).ok).toBe(false);
  });

  it('refuses an argument the grammar does not name, naming it, so a typo never falls back to the home profile', () => {
    expect(failure(parseSyncArgs(['pull', '--rot', '/srv/profile']))).toContain(
      'unknown argument "--rot"',
    );
    expect(failure(parseSyncArgs(['pull', 'extra']))).toContain('unknown argument "extra"');
    expect(failure(parseSyncArgs(['pull', '--message', 'seat: fact']))).toContain(
      'unknown argument "--message"',
    );
  });

  it('refuses a duplicate option and an option without a value', () => {
    expect(failure(parseSyncArgs(['pull', '--root', 'a', '--root', 'b']))).toContain(
      '--root given more than once',
    );
    expect(failure(parseSyncArgs(['pull', '--root']))).toContain('--root needs a value');
    expect(failure(parseSyncArgs(['pull', '--root', '']))).toContain('--root needs a value');
    expect(failure(parseSyncArgs(['push', '--message', '   ']))).toContain(
      '--message needs a value',
    );
  });
});
