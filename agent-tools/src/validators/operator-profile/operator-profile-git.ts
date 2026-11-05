/**
 * Operator profile — the git layer behind an injected runner: reading the
 * sync state and pulling. Pushing lives in `operator-profile-git-push.ts`.
 *
 * Every git act on the profile repository goes through one runner so the
 * mechanics live in one tested place (the operator-profile PDR, decision
 * 16): a seat resident in a linked worktree, whose shell git is confined to
 * that worktree, syncs the profile through this tool like any other seat.
 * The real runner executes the trusted git binary by absolute path with
 * `-C <root>`; tests inject a scripted runner and never touch a repository.
 *
 * A git command that fails to run is an operational error, never a clean
 * state: a locked or corrupt repository can make nothing pass.
 */

import { spawnSync } from 'node:child_process';

import { err, ok, type Result } from '@oaknational/result';

import { resolveTrustedGit } from '../../core/trusted-git.js';
import { PUSH_COMMAND, type SyncStateInput } from './operator-profile-sync-state.js';

interface GitOutcome {
  readonly ok: boolean;
  readonly stdout: string;
  readonly stderr: string;
}

/** Runs one git command against the profile root and reports its outcome. */
export type GitRunner = (args: readonly string[]) => GitOutcome;

/**
 * The real runner: the trusted git binary, `-C <root>`, never a shell.
 *
 * Every call runs with `core.symlinks=false`, so a symbolic link a pull
 * delivers is checked out as a plain file holding the link's text, never
 * as a link: the Practice's own git never writes a link into the profile
 * tree. At an entry the layout does not expect, the check refuses that
 * file by name; at an expected path it reads as the document its text
 * makes it, and the push leg refuses any path the index still records as
 * a link. Every call carries it, so the status and push legs read the tree
 * the way the pull wrote it.
 */
export function createGitRunner(root: string): GitRunner {
  const git = resolveTrustedGit();
  return (args) => {
    const result = spawnSync(git, ['-c', 'core.symlinks=false', '-C', root, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return {
      ok: result.status === 0,
      stdout: result.stdout.trimEnd(),
      stderr: result.stderr.trimEnd(),
    };
  };
}

export function firstLine(text: string): string {
  return text.split('\n')[0] ?? '';
}

/** The failure of one git command as an error message. */
export function gitFailure(what: string, outcome: GitOutcome): string {
  return `${what} failed: ${firstLine(outcome.stderr) || 'no detail'}`;
}

/** Whether the current branch tracks an upstream. */
export function hasUpstream(run: GitRunner): boolean {
  const upstream = run(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
  return upstream.ok && upstream.stdout.trim() !== '';
}

/** The configured remote names; a `git remote` that fails to run is an error. */
export function remoteNames(run: GitRunner): Result<readonly string[], string> {
  const remotes = run(['remote']);
  if (!remotes.ok) {
    return err(gitFailure('git remote', remotes));
  }
  return ok(
    remotes.stdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== ''),
  );
}

function parseCounts(
  leftRight: string,
): Result<{ readonly behind: number; readonly ahead: number }, string> {
  const [behind, ahead] = firstLine(leftRight)
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 10));
  if (behind === undefined || ahead === undefined || Number.isNaN(behind) || Number.isNaN(ahead)) {
    return err(`git rev-list returned no counts: "${firstLine(leftRight)}"`);
  }
  return ok({ behind, ahead });
}

/** Commits behind and ahead of the upstream. */
export function leftRightCounts(
  run: GitRunner,
): Result<{ readonly behind: number; readonly ahead: number }, string> {
  const counted = run(['rev-list', '--left-right', '--count', '@{u}...HEAD']);
  return counted.ok ? parseCounts(counted.stdout) : err(gitFailure('git rev-list', counted));
}

/**
 * Read the sync facts of a profile root that is a repository.
 *
 * @param run - the git runner bound to the root
 * @returns the facts the assessor needs, or the git failure that stopped the read
 */
export function readSyncState(run: GitRunner): Result<SyncStateInput, string> {
  const remotes = remoteNames(run);
  if (!remotes.ok) {
    return remotes;
  }
  const upstream = hasUpstream(run);
  const status = run(['status', '--porcelain', '-z']);
  if (!status.ok) {
    return err(gitFailure('git status', status));
  }
  const counts = upstream ? leftRightCounts(run) : ok({ behind: 0, ahead: 0 });
  if (!counts.ok) {
    return counts;
  }
  return ok({
    isRepository: true,
    hasRemote: remotes.value.length > 0,
    hasUpstream: upstream,
    porcelain: status.stdout,
    ahead: counts.value.ahead,
    behind: counts.value.behind,
  });
}

/** Fast-forward where possible, else a plain merge; a conflict names its files. */
function mergeUpstream(run: GitRunner): Result<string, string> {
  const fastForward = run(['merge', '--ff-only', '@{u}']);
  if (fastForward.ok) {
    return ok(firstLine(fastForward.stdout) || 'up to date');
  }
  const merged = run(['merge', '--no-edit', '@{u}']);
  if (merged.ok) {
    return ok('merged the remote in (not fast-forwardable; a plain merge, never a rebase)');
  }
  const conflicted = run(['diff', '--name-only', '--diff-filter=U']);
  const files =
    conflicted.stdout.trim() === '' ? 'unknown files' : conflicted.stdout.replaceAll('\n', ', ');
  return err(
    `merge conflict in ${files} — resolve by union (both sides kept in time order, the later updated date wins), then ${PUSH_COMMAND}`,
  );
}

/**
 * Bring the profile up to date: fetch, fast-forward where possible, a plain
 * merge otherwise (never a rebase). A merge that conflicts is reported with
 * its files and left for a union resolution; nothing is discarded.
 *
 * @param run - the git runner bound to the root
 * @returns what happened, or the failure to surface
 */
export function pullProfile(run: GitRunner): Result<string, string> {
  const fetched = run(['fetch', '--quiet']);
  if (!fetched.ok) {
    return err(gitFailure('fetch', fetched));
  }
  if (!hasUpstream(run)) {
    return err('the current branch tracks no upstream — push once to set it');
  }
  return mergeUpstream(run);
}
