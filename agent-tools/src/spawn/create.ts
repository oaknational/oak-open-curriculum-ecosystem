import { dirname, join } from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { detectExistingWorktree, type SpawnGitRunner } from './existing-worktree.js';
import { realGitRunner } from './git.js';

export type { SpawnGitRunner };

/** Inputs to {@link createSpawnWorktree}. */
export interface CreateSpawnWorktreeOptions {
  /** Lane slug; lowercase alphanumeric words separated by single hyphens. */
  readonly slug: string;
  /** Branch type prefix, e.g. `feat`. */
  readonly type: string;
  /** Base ref the new branch is cut from, e.g. `origin/main`. */
  readonly base: string;
  /** Absolute path of the coordination home (the primary checkout) git runs from. */
  readonly coordinationHome: string;
  /** Git seam (defaults to the real `git` binary; injected as a fake in tests). */
  readonly runGit?: SpawnGitRunner;
}

/** The worktree created by {@link createSpawnWorktree}. */
export interface SpawnedWorktree {
  /** Absolute path of the new sibling worktree (`oak-<slug>`). */
  readonly worktreePath: string;
  /** The branch the worktree checks out (`<type>/<slug>`). */
  readonly branch: string;
  /** The requested base ref — the branch is cut from it on creation; not re-applied on a resume. */
  readonly base: string;
  /** True when an existing matching worktree was resumed rather than newly created. */
  readonly resumed: boolean;
}

/** Lowercase alphanumeric words joined by single hyphens — path- and branch-safe. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

/** Branch type prefix — lowercase letters only, e.g. `feat`, `fix`, `chore`. */
const TYPE_PATTERN = /^[a-z]+$/u;

const defaultRunGit: SpawnGitRunner = (args, cwd) => realGitRunner(args, cwd);

/**
 * Run `git worktree add` for a freshly-derived worktree, wrapping a git failure in
 * a Result (ADR-088) that names the branch, base, and path. Extracted from
 * {@link createSpawnWorktree} so the latter stays within the per-function line
 * budget while reading as validate → derive → detect → add.
 *
 * @remarks
 * `--no-track` is load-bearing safety, not tidiness. The default base is a
 * remote-tracking ref (`origin/main`), and `branch.autoSetupMerge` defaults to
 * `true`, so `-b <branch> origin/main` silently marks `origin/main` as the new
 * branch's upstream. A seat that then runs a bare `git push` — the ordinary
 * habit — pushes its lane straight onto `main`. That has caught at least three
 * seats across separate sessions (F-166); the only thing that ever stopped it
 * was an individual seat noticing its own upstream. With no upstream set, the
 * same bare push fails loud and asks for an explicit refspec instead.
 */
function addSpawnWorktree(
  runGit: SpawnGitRunner,
  coordinationHome: string,
  worktree: SpawnedWorktree,
): Result<SpawnedWorktree, Error> {
  const added = runGit(
    ['worktree', 'add', '--no-track', worktree.worktreePath, '-b', worktree.branch, worktree.base],
    coordinationHome,
  );
  if (isErr(added)) {
    return err(
      new Error(
        `spawn: failed to create worktree '${worktree.worktreePath}' on branch ` +
          `'${worktree.branch}' from '${worktree.base}'. ${added.error.message}`,
        { cause: added.error },
      ),
    );
  }
  return ok(worktree);
}

/** The slug/type/base after trimming and strict validation. */
interface ValidatedSpawnInputs {
  readonly slug: string;
  readonly type: string;
  readonly base: string;
}

/** Trim and strictly validate the slug, branch type, and base ref (fail-fast, before any git). */
function validateSpawnInputs(
  options: CreateSpawnWorktreeOptions,
): Result<ValidatedSpawnInputs, Error> {
  const slug = options.slug.trim();
  const type = options.type.trim();
  const base = options.base.trim();

  if (!SLUG_PATTERN.test(slug)) {
    return err(
      new Error(
        `spawn: invalid slug '${options.slug}' — expected lowercase alphanumeric words ` +
          `separated by single hyphens (e.g. 'agent-spawn-flow').`,
      ),
    );
  }
  if (!TYPE_PATTERN.test(type)) {
    return err(
      new Error(
        `spawn: invalid branch type '${options.type}' — expected lowercase letters ` +
          `(e.g. "feat", "fix", "chore").`,
      ),
    );
  }
  if (base.length === 0) {
    return err(new Error('spawn: base ref must not be empty (e.g. "origin/main").'));
  }
  if (base.startsWith('-')) {
    return err(
      new Error(
        `spawn: invalid base ref '${options.base}' — must not start with '-' ` +
          `(git would read it as an option, not a ref).`,
      ),
    );
  }

  return ok({ slug, type, base });
}

/** The branch and sibling worktree path derived from validated inputs. */
interface SpawnTarget {
  readonly branch: string;
  readonly worktreePath: string;
}

/**
 * Derive the `<type>/<slug>` branch and the sibling `oak-<slug>` worktree path,
 * refusing to target the coordination home itself.
 *
 * @remarks
 * `oak-<slug>` is a sibling of the coordination home, but a slug whose basename
 * coincides with the coordination home's own (e.g. `open-curriculum-ecosystem`
 * beside `oak-open-curriculum-ecosystem`) makes the two paths equal. Were that to
 * reach {@link detectExistingWorktree}, the primary checkout's own
 * `git worktree list` entry would match and be treated as resumable — spawn would
 * then run install/build on the main checkout and exit without creating any
 * sibling. The guard fails fast and loud here, before any git probe, so the
 * primary checkout is never touched.
 */
function deriveSpawnTarget(
  validated: ValidatedSpawnInputs,
  coordinationHome: string,
): Result<SpawnTarget, Error> {
  const branch = `${validated.type}/${validated.slug}`;
  const worktreePath = join(dirname(coordinationHome), `oak-${validated.slug}`);
  if (worktreePath === coordinationHome) {
    return err(
      new Error(
        `spawn: computed worktree path '${worktreePath}' is the coordination home itself — ` +
          `refusing to spawn onto the primary checkout (slug '${validated.slug}' collides ` +
          `with it). Choose a different lane slug.`,
      ),
    );
  }
  return ok({ branch, worktreePath });
}

/**
 * Create a fresh sibling worktree on a new lane branch for the session that will
 * occupy it (spawn-flow Phase 1A).
 *
 * The worktree is a sibling `oak-<slug>` directory next to the coordination
 * home, on a `<type>/<slug>` branch cut from `base`. The spawned session's
 * identity is NOT minted here: it is derived by the platform `SessionStart` hook
 * from the harness `session_id` at launch (see `./launch-command.ts`), so spawn
 * does not author an identity the launched session would not honour. Validation
 * is strict and fails fast before any git side effect; the result is `err` (never
 * a throw) on invalid input or a git failure, the latter naming the branch, base,
 * and path.
 */
export function createSpawnWorktree(
  options: CreateSpawnWorktreeOptions,
): Result<SpawnedWorktree, Error> {
  const validated = validateSpawnInputs(options);
  if (isErr(validated)) {
    return validated;
  }
  const target = deriveSpawnTarget(validated.value, options.coordinationHome);
  if (isErr(target)) {
    return target;
  }
  const { branch, worktreePath } = target.value;
  const { base } = validated.value;

  const runGit = options.runGit ?? defaultRunGit;

  const worktree: SpawnedWorktree = { worktreePath, branch, base, resumed: false };

  const existing = detectExistingWorktree(runGit, options.coordinationHome, worktreePath, branch);
  if (existing.kind === 'resumable') {
    // Idempotent retry: a prior spawn created this worktree+branch but its build
    // failed. Resume (the caller re-runs build) — no git mutation, nothing removed.
    // `base` is NOT re-applied (the branch already exists), so the result is flagged
    // `resumed` and must not be reported as a fresh creation from `base`.
    return ok({ ...worktree, resumed: true });
  }
  if (existing.kind === 'collision') {
    return err(
      new Error(
        `spawn: '${worktreePath}' already exists on a different branch ` +
          `('${existing.actualBranch}', not '${branch}'). Resolve the collision before ` +
          `spawning this slug.`,
      ),
    );
  }

  return addSpawnWorktree(runGit, options.coordinationHome, worktree);
}
