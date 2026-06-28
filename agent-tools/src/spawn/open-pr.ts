import { err, isErr, ok, type Result } from '@oaknational/result';

import { type CommandRunner } from '../core/command-runner.js';

import { realGhRunner } from './gh.js';
import { realGitRunner } from './git.js';

/** Inputs to {@link openDraftPr}. */
export interface OpenDraftPrOptions {
  /** Absolute path of the spawned worktree (the cwd git and gh run from). */
  readonly worktreePath: string;
  /** The lane branch the PR is opened from (`<type>/<slug>`). */
  readonly branch: string;
  /** The base ref the branch was cut from (e.g. `origin/main`); its branch component is the PR base. */
  readonly base: string;
  /** Lane slug — names the marker commit and the draft PR. */
  readonly slug: string;
  /** Git seam (defaults to the real `git` runner; injected as a fake in tests). */
  readonly runGit?: CommandRunner<string>;
  /** gh seam (defaults to the real `gh` runner; injected as a fake in tests). */
  readonly runGh?: CommandRunner<string>;
}

const defaultRunGit: CommandRunner<string> = realGitRunner;
const defaultRunGh: CommandRunner<string> = realGhRunner;

/**
 * The branch component of a base ref — the name `gh pr create --base` expects.
 * The spawn base is a remote-qualified ref (e.g. `origin/main`); its first
 * path segment is the remote, the remainder the branch.
 */
function baseBranchOf(base: string): string {
  return base.replace(/^[^/]+\//u, '');
}

/**
 * The `gh pr create --draft` argument vector for a freshly-spawned lane: drafted,
 * based on the base ref's branch component, headed by the lane branch. No
 * `--admin` — the code-owner gate is respected.
 */
function draftPrArgs(slug: string, branch: string, base: string): readonly string[] {
  return [
    'pr',
    'create',
    '--draft',
    '--base',
    baseBranchOf(base),
    '--head',
    branch,
    '--title',
    `Draft: open ${slug} lane`,
    '--body',
    `Draft PR opened by \`agent spawn\` for the \`${slug}\` lane. ` +
      `Work in progress — the lane's session fills this in.`,
  ];
}

/**
 * Open a draft PR for a freshly-spawned lane (spawn-flow 1C, worktree-hygiene
 * rule 1: the PR exists from spawn so the lane is tracked from the start).
 *
 * A freshly-cut `<type>/<slug>` branch has no commits beyond base, so
 * `gh pr create` would fail ("no commits between base and head"). The flow is:
 * (1) one empty marker commit to give the branch a head — squash-merge collapses
 * it, so no history cruft; (2) push the branch (gh needs a head on origin);
 * (3) `gh pr create --draft`, returning the PR URL. No `--admin`: the code-owner
 * gate is respected. Each step fails loud as a Result `err` (ADR-088), never a
 * throw, naming the failing step and branch with the cause preserved.
 */
export function openDraftPr(options: OpenDraftPrOptions): Result<string, Error> {
  const runGit = options.runGit ?? defaultRunGit;
  const runGh = options.runGh ?? defaultRunGh;
  const { worktreePath, branch, base, slug } = options;

  const committed = runGit(
    ['commit', '--allow-empty', '-m', `chore: open ${slug} lane (spawn-flow)`],
    worktreePath,
  );
  if (isErr(committed)) {
    return err(
      new Error(
        `spawn: failed to open the lane marker commit on '${branch}'. ${committed.error.message}`,
        {
          cause: committed.error,
        },
      ),
    );
  }

  const pushed = runGit(['push', '-u', 'origin', branch], worktreePath);
  if (isErr(pushed)) {
    return err(
      new Error(`spawn: failed to push '${branch}' to origin. ${pushed.error.message}`, {
        cause: pushed.error,
      }),
    );
  }

  const created = runGh(draftPrArgs(slug, branch, base), worktreePath);
  if (isErr(created)) {
    return err(
      new Error(`spawn: failed to open the draft PR for '${branch}'. ${created.error.message}`, {
        cause: created.error,
      }),
    );
  }

  return ok(created.value.trim());
}
