import { err, isErr, ok, type Result } from '@oaknational/result';

import { resolveCoordinationHome } from '../collaboration-state/coordination-home.js';

import { buildWorktree, type BuildWorktreeOptions } from './build.js';
import { formatSpawnResult } from './cli-output.js';
import {
  createSpawnWorktree,
  type CreateSpawnWorktreeOptions,
  type SpawnedWorktree,
} from './create.js';
import { openDraftPr, type OpenDraftPrOptions } from './open-pr.js';

/**
 * CLI for `agent-tools spawn` (spawn-flow Phase 1A). Parses the lane slug, branch
 * type, and base ref, resolves the coordination home, and creates a fresh sibling
 * worktree with a minted session seed.
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

const DEFAULT_TYPE = 'feat';
const DEFAULT_BASE = 'origin/main';

interface ParsedSpawnArgs {
  readonly slug: string;
  readonly type: string;
  readonly base: string;
  readonly help: boolean;
}

interface MutableSpawnArgs {
  slug?: string;
  type: string;
  base: string;
  help: boolean;
}

const VALUE_HANDLERS: Readonly<Record<string, (state: MutableSpawnArgs, value: string) => void>> = {
  '--slug': (state, value) => {
    state.slug = value;
  },
  '--type': (state, value) => {
    state.type = value;
  },
  '--base': (state, value) => {
    state.base = value;
  },
};

function requireValue(
  args: readonly string[],
  index: number,
  option: string,
): Result<string, Error> {
  const value = args[index];
  if (value === undefined || value.startsWith('-')) {
    return err(new Error(`spawn: ${option} requires a value`));
  }
  return ok(value);
}

/** Consume one argument into `state`; returns the new index, or an error. */
function consumeArg(
  args: readonly string[],
  index: number,
  state: MutableSpawnArgs,
): Result<number, Error> {
  const arg = args[index];
  if (arg === '--help' || arg === '-h') {
    state.help = true;
    return ok(index);
  }
  const valueHandler = VALUE_HANDLERS[arg];
  if (valueHandler !== undefined) {
    const value = requireValue(args, index + 1, arg);
    if (isErr(value)) {
      return value;
    }
    valueHandler(state, value.value);
    return ok(index + 1);
  }
  return err(new Error(`spawn: unknown option: ${arg}\n\n${usage()}`));
}

function parseSpawnArgs(args: readonly string[]): Result<ParsedSpawnArgs, Error> {
  const state: MutableSpawnArgs = { type: DEFAULT_TYPE, base: DEFAULT_BASE, help: false };

  let index = 0;
  while (index < args.length) {
    const step = consumeArg(args, index, state);
    if (isErr(step)) {
      return step;
    }
    index = step.value + 1;
  }

  if (state.help) {
    return ok({ slug: '', type: state.type, base: state.base, help: true });
  }
  if (state.slug === undefined) {
    return err(new Error(`spawn: --slug is required\n\n${usage()}`));
  }
  // Normalise the option values once at the parse boundary so every downstream
  // consumer sees the same trimmed value. createSpawnWorktree trims again for its
  // own validation, but openDraftPr consumes the parsed base/slug directly — without
  // this, trailing whitespace on --base reached `gh pr create --base` (and the slug
  // reached the marker commit / PR title) untrimmed.
  return ok({
    slug: state.slug.trim(),
    type: state.type.trim(),
    base: state.base.trim(),
    help: false,
  });
}

/**
 * Default coordination-home resolver: wraps {@link resolveCoordinationHome} (which
 * throws when cwd is outside a git working tree) into a Result at this single
 * library boundary, so no throw escapes into the spawn flow.
 */
function defaultResolveHome(cwd: string): Result<string, Error> {
  try {
    return ok(resolveCoordinationHome(cwd));
  } catch (cause) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
}

function usage(): string {
  return [
    'agent-tools spawn --slug <slug> [--type <type>] [--base <ref>]',
    '',
    'Creates a sibling oak-<slug> worktree on a <type>/<slug> branch cut from <ref>,',
    'minting a fresh PDR-027 session seed for the session that will occupy it.',
    `Defaults: --type ${DEFAULT_TYPE}, --base ${DEFAULT_BASE}.`,
    '',
  ].join('\n');
}

/** Resolve the home, create the worktree, and report it. Returns the exit code. */
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
