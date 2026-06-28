import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { deriveIdentity } from '../core/agent-identity/index.js';

import { realGitRunner } from './git.js';

/**
 * Runs a git subcommand from `cwd`, returning its stdout on success or the
 * underlying error on a non-zero exit — the Result pattern (ADR-088), never a
 * throw, so the failure is visible to the type system at every call site.
 *
 * @remarks
 * Mirrors the established `GitRunner` seam shape (the injectable git seam named
 * in the spawn-flow plan), lifted into `Result`. It is redeclared here rather
 * than imported from `collaboration-state/coordination-home.ts` so the spawn
 * lane stays decoupled from another lane's surface — the shape is the contract,
 * and a one-line type is cheaper to own than a cross-lane import. This is the
 * second declaration of the seam shape; a third independent consumer is the
 * trigger to hoist one shared seam type into `core/` (consolidate-at-third-consumer).
 */
export type SpawnGitRunner = (args: readonly string[], cwd: string) => Result<string, Error>;

/**
 * The session seed minted for a spawned worktree, plus the display name and
 * `session_id_prefix` derived from it.
 *
 * @remarks
 * This is deliberately NOT a full PDR-027 identity record: the spawned session
 * re-derives its complete record (including the stable v5 `id` and naming-schema
 * version) from {@link seed} at launch, so minting those here would be redundant
 * and would cross the collaboration-state boundary (`deriveIdFromSeed` is not
 * exported). The spawn tool needs only the seed (to bake into the launch command)
 * and the display label (for the brief and human-facing output).
 */
interface SpawnSeed {
  /** The fresh session seed; becomes the spawned session's `PRACTICE_AGENT_SESSION_ID`. */
  readonly seed: string;
  /** The deterministic display name derived from {@link seed}. */
  readonly agentName: string;
  /** The first six characters of {@link seed} (the PDR-027 `session_id_prefix`). */
  readonly sessionIdPrefix: string;
}

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
  /** Session-seed generator (defaults to a random UUID; injected for determinism in tests). */
  readonly generateSeed?: () => string;
}

/** The worktree created by {@link createSpawnWorktree}. */
export interface SpawnedWorktree {
  /** Absolute path of the new sibling worktree (`oak-<slug>`). */
  readonly worktreePath: string;
  /** The branch the worktree checks out (`<type>/<slug>`). */
  readonly branch: string;
  /** The requested base ref — the branch is cut from it on creation; not re-applied on a resume. */
  readonly base: string;
  /** The session seed and derived display label for the session that will occupy the worktree. */
  readonly session: SpawnSeed;
  /** True when an existing matching worktree was resumed rather than newly created. */
  readonly resumed: boolean;
}

/** Lowercase alphanumeric words joined by single hyphens — path- and branch-safe. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

/** Branch type prefix — lowercase letters only, e.g. `feat`, `fix`, `chore`. */
const TYPE_PATTERN = /^[a-z]+$/u;

const defaultRunGit: SpawnGitRunner = (args, cwd) => realGitRunner(args, cwd);

/** Whether a worktree at the target path already exists, and if so on which branch. */
type ExistingWorktree =
  | { readonly kind: 'absent' }
  | { readonly kind: 'resumable' }
  | { readonly kind: 'collision'; readonly actualBranch: string };

/**
 * Detect whether a worktree already occupies {@link worktreePath} (the
 * idempotent-retry pre-check), reading `git worktree list --porcelain` — never
 * mutating, so never-use-git-to-remove-work is respected. A list failure is
 * treated as `absent` so the subsequent `worktree add` still runs and fails loud
 * on a genuine collision; the pre-check is an optimisation, not a gate.
 */
function detectExistingWorktree(
  runGit: SpawnGitRunner,
  coordinationHome: string,
  worktreePath: string,
  branch: string,
): ExistingWorktree {
  const listed = runGit(['worktree', 'list', '--porcelain'], coordinationHome);
  if (isErr(listed)) {
    return { kind: 'absent' };
  }
  for (const block of listed.value.split('\n\n')) {
    const lines = block.split('\n');
    const pathLine = lines.find((line) => line.startsWith('worktree '));
    if (pathLine === undefined || pathLine.slice('worktree '.length).trim() !== worktreePath) {
      continue;
    }
    const branchLine = lines.find((line) => line.startsWith('branch '));
    const ref = branchLine?.slice('branch '.length).trim();
    if (ref === `refs/heads/${branch}`) {
      return { kind: 'resumable' };
    }
    return { kind: 'collision', actualBranch: ref ?? '(detached)' };
  }
  return { kind: 'absent' };
}

/**
 * Run `git worktree add` for a freshly-derived worktree, wrapping a git failure in
 * a Result (ADR-088) that names the branch, base, and path. Extracted from
 * {@link createSpawnWorktree} so the latter stays within the per-function line
 * budget while reading as validate → derive → detect → add.
 */
function addSpawnWorktree(
  runGit: SpawnGitRunner,
  coordinationHome: string,
  worktree: SpawnedWorktree,
): Result<SpawnedWorktree, Error> {
  const added = runGit(
    ['worktree', 'add', worktree.worktreePath, '-b', worktree.branch, worktree.base],
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

/**
 * Create a fresh sibling worktree on a new lane branch and mint the session seed
 * for the session that will occupy it (spawn-flow Phase 1A).
 *
 * The worktree is a sibling `oak-<slug>` directory next to the coordination
 * home, on a `<type>/<slug>` branch cut from `base`. Seed/name derivation is
 * deterministic in the generated seed. Validation is strict and fails fast
 * before any git side effect; the result is `err` (never a throw) on invalid
 * input or a git failure, the latter naming the branch, base, and path.
 */
export function createSpawnWorktree(
  options: CreateSpawnWorktreeOptions,
): Result<SpawnedWorktree, Error> {
  const validated = validateSpawnInputs(options);
  if (isErr(validated)) {
    return validated;
  }
  const { slug, type, base } = validated.value;

  const runGit = options.runGit ?? defaultRunGit;
  const generateSeed = options.generateSeed ?? randomUUID;

  const branch = `${type}/${slug}`;
  const worktreePath = join(dirname(options.coordinationHome), `oak-${slug}`);
  const seed = generateSeed();
  const session: SpawnSeed = {
    seed,
    agentName: deriveIdentity(seed).displayName,
    sessionIdPrefix: seed.slice(0, 6),
  };
  const worktree: SpawnedWorktree = { worktreePath, branch, base, session, resumed: false };

  const existing = detectExistingWorktree(runGit, options.coordinationHome, worktreePath, branch);
  if (existing.kind === 'resumable') {
    // Idempotent retry: a prior spawn created this worktree+branch but its build
    // failed. Resume (the caller re-runs build) — no git mutation, nothing removed.
    // The worktree was never launched, so a fresh session seed is correct. `base` is
    // NOT re-applied (the branch already exists), so the result is flagged `resumed`
    // and must not be reported as a fresh creation from `base`.
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
