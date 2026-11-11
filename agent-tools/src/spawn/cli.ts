import { err, isErr, ok, type Result } from '@oaknational/result';

import { resolveCoordinationHome } from '../collaboration-state/coordination-home.js';

import { formatSeatBrief } from './brief.js';
import { buildWorktree, type BuildWorktreeOptions } from './build.js';
import { parseSpawnArgs, usage, type ParsedSpawnArgs } from './cli-args.js';
import { formatSpawnResult } from './cli-output.js';
import {
  createSpawnWorktree,
  type CreateSpawnWorktreeOptions,
  type SpawnedWorktree,
} from './create.js';
import { formatLaunchCommand } from './launch-command.js';
import { openDraftPr, type OpenDraftPrOptions } from './open-pr.js';

/**
 * CLI for `agent-tools spawn` (spawn-flow). Parses the lane slug, branch type, base
 * ref, and per-seat specifics, resolves the coordination home, creates a fresh
 * built draft-PR'd sibling worktree, and emits its seat brief and launch command.
 * Argument parsing lives in `./cli-args`; brief rendering in `./brief`.
 */
export interface SpawnCliInput {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly stdout?: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr?: Pick<NodeJS.WriteStream, 'write'>;
  /** Coordination-home resolver seam (defaults to {@link defaultResolveHome}). */
  readonly resolveHome?: (cwd: string) => Result<string, Error>;
  /** Worktree-creation seam (defaults to {@link createSpawnWorktree}). */
  readonly createWorktree?: (options: CreateSpawnWorktreeOptions) => Result<SpawnedWorktree, Error>;
  /** Worktree-build seam (defaults to {@link buildWorktree}). */
  readonly build?: (options: BuildWorktreeOptions) => Result<void, Error>;
  /** Draft-PR-open seam (defaults to {@link openDraftPr}). */
  readonly openPr?: (options: OpenDraftPrOptions) => Result<string, Error>;
}

/**
 * Default coordination-home resolver: wraps {@link resolveCoordinationHome} (which
 * throws when cwd is outside a git working tree) into a Result at this single
 * library boundary, so no throw escapes into the spawn flow.
 */
function defaultResolveHome(cwd: string): Result<string, Error> {
  try {
    return ok(resolveCoordinationHome(cwd));
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

/** Resolve the home, create + prepare the worktree, and report it. Returns the exit code. */
function executeSpawn(
  input: SpawnCliInput,
  parsed: ParsedSpawnArgs,
  stdout: Pick<NodeJS.WriteStream, 'write'>,
  stderr: Pick<NodeJS.WriteStream, 'write'>,
): number {
  const resolveHome = input.resolveHome ?? defaultResolveHome;
  const create = input.createWorktree ?? createSpawnWorktree;

  const home = resolveHome(input.cwd);
  if (isErr(home)) {
    stderr.write(`${home.error.message}\n`);
    return 2;
  }

  const created = create({
    slug: parsed.slug,
    type: parsed.type,
    base: parsed.base,
    coordinationHome: home.value,
  });
  if (isErr(created)) {
    stderr.write(`${created.error.message}\n`);
    return 2;
  }

  const prepared = prepareWorktree(input, created.value, parsed);
  if (isErr(prepared)) {
    stderr.write(`${prepared.error.message}\n`);
    return 2;
  }

  stdout.write(formatSpawnResult(created.value, prepared.value));
  stdout.write(
    formatSeatBrief(created.value, {
      role: parsed.role,
      task: parsed.task,
      director: parsed.director,
    }),
  );
  stdout.write(formatLaunchCommand(created.value));
  return 0;
}

/**
 * Build the spawned worktree (1B) and, on a fresh spawn, open its draft PR (1C).
 * Returns the draft PR URL, or `undefined` on a resume — a resume is a build-retry
 * against an existing worktree, so it does not re-open the PR (which would double
 * the marker commit or collide with the existing PR).
 *
 * @remarks
 * Known limitation (spawn-flow follow-up): build runs before the PR opens, so a
 * fresh spawn whose BUILD fails returns before opening any PR, and the subsequent
 * resume skips PR-opening too — leaving that lane without a draft PR until it is
 * opened by hand or the worktree is removed and re-spawned. A later slice makes the
 * PR step resume-aware (open only when absent) to close this.
 */
function prepareWorktree(
  input: SpawnCliInput,
  created: SpawnedWorktree,
  parsed: ParsedSpawnArgs,
): Result<string | undefined, Error> {
  const build = input.build ?? buildWorktree;
  const built = build({ worktreePath: created.worktreePath });
  if (isErr(built)) {
    return built;
  }
  if (created.resumed) {
    return ok(undefined);
  }
  const openPr = input.openPr ?? openDraftPr;
  return openPr({
    worktreePath: created.worktreePath,
    branch: created.branch,
    base: parsed.base,
    slug: parsed.slug,
  });
}

/** Execute the spawn CLI. Returns the process exit code (0 success, 2 on error). */
export function runSpawnCli(input: SpawnCliInput): number {
  const stdout = input.stdout ?? process.stdout;
  const stderr = input.stderr ?? process.stderr;

  const parsed = parseSpawnArgs(input.args);
  if (isErr(parsed)) {
    stderr.write(`${parsed.error.message}\n`);
    return 2;
  }
  if (parsed.value.help) {
    stdout.write(usage());
    return 0;
  }

  return executeSpawn(input, parsed.value, stdout, stderr);
}
