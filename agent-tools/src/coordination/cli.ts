import { err, isErr, ok, type Result } from '@oaknational/result';

import { resolveRefToCommitSha } from './git.js';
import { formatCoordinationSuccessorName } from './successor-name.js';

/**
 * CLI for the `coordination` topic. Ships one action — `successor-name` —
 * which resolves the base ref to its full sha and prints the next
 * coordination branch name, `coordination/<UTC date>-<sha6>`. Read-only by
 * design: it never creates a branch; cutting the branch stays with the
 * coordination-fold ceremony's explicit boundary.
 */

const DEFAULT_BASE = 'origin/main';
const SUCCESSOR_NAME_ACTION = 'successor-name';

export interface CoordinationCliInput {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly stdout?: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr?: Pick<NodeJS.WriteStream, 'write'>;
  /** Ref-resolution seam (defaults to the real {@link resolveRefToCommitSha}). */
  readonly resolveRef?: (ref: string, cwd: string) => Result<string, Error>;
  /** Clock seam (defaults to the real clock). */
  readonly now?: () => Date;
}

interface ParsedCoordinationArgs {
  readonly base: string;
  readonly help: boolean;
}

interface MutableCoordinationArgs {
  base: string;
  help: boolean;
  positionals: string[];
}

const VALUE_HANDLERS: Readonly<
  Record<string, (state: MutableCoordinationArgs, value: string) => void>
> = {
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
    return err(new Error(`coordination: ${option} requires a value\n\n${usage()}`));
  }
  return ok(value);
}

/** Consume one argument into `state`; returns the new index, or an error. */
function consumeArg(
  args: readonly string[],
  index: number,
  state: MutableCoordinationArgs,
): Result<number, Error> {
  const arg = args[index] ?? '';
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
  if (arg.startsWith('-')) {
    return err(new Error(`coordination: unknown option: ${arg}\n\n${usage()}`));
  }
  state.positionals.push(arg);
  return ok(index);
}

/** Validate the positionals: exactly one action, and only the known one. */
function finalizeArgs(state: MutableCoordinationArgs): Result<ParsedCoordinationArgs, Error> {
  if (state.help) {
    return ok({ base: state.base, help: true });
  }
  const [action, ...extra] = state.positionals;
  if (action === undefined) {
    return err(new Error(`coordination: an action is required\n\n${usage()}`));
  }
  if (action !== SUCCESSOR_NAME_ACTION) {
    return err(new Error(`coordination: unknown action: ${action}\n\n${usage()}`));
  }
  if (extra.length > 0) {
    return err(new Error(`coordination: unexpected argument: ${extra[0] ?? ''}\n\n${usage()}`));
  }
  return ok({ base: state.base, help: false });
}

/** Parse the coordination argv. Pure: no IO, no git, no throw. */
function parseCoordinationArgs(args: readonly string[]): Result<ParsedCoordinationArgs, Error> {
  const state: MutableCoordinationArgs = { base: DEFAULT_BASE, help: false, positionals: [] };

  let index = 0;
  while (index < args.length) {
    const step = consumeArg(args, index, state);
    if (isErr(step)) {
      return step;
    }
    index = step.value + 1;
  }

  return finalizeArgs(state);
}

/** Resolve the base ref and format the successor name. */
function successorName(input: CoordinationCliInput, base: string): Result<string, Error> {
  const resolveRef =
    input.resolveRef ?? ((ref: string, cwd: string) => resolveRefToCommitSha({ ref, cwd }));
  const resolved = resolveRef(base, input.cwd);
  if (isErr(resolved)) {
    return resolved;
  }
  const now = input.now ?? (() => new Date());
  return formatCoordinationSuccessorName({ fullSha: resolved.value, now: now() });
}

/** Execute the coordination CLI. Returns the process exit code (0 success, 2 on error). */
export function runCoordinationCli(input: CoordinationCliInput): number {
  const stdout = input.stdout ?? process.stdout;
  const stderr = input.stderr ?? process.stderr;

  const parsed = parseCoordinationArgs(input.args);
  if (isErr(parsed)) {
    stderr.write(`${parsed.error.message}\n`);
    return 2;
  }
  if (parsed.value.help) {
    stdout.write(usage());
    return 0;
  }

  const name = successorName(input, parsed.value.base);
  if (isErr(name)) {
    stderr.write(`${name.error.message}\n`);
    return 2;
  }

  stdout.write(`${name.value}\n`);
  return 0;
}

/** The `agent-tools coordination` usage text. */
function usage(): string {
  return [
    'agent-tools coordination successor-name [--base <ref>]',
    '',
    'Prints the next coordination branch name: coordination/<UTC date>-<sha6>,',
    'where <sha6> is the first six hex characters of the FULL sha the base ref',
    'resolves to (never `git rev-parse --short`, whose abbreviation length can',
    'grow with ambiguity). The suffix is deliberate lineage policy: a checkout',
    'cutting from a different tip almost always mints a different name (six hex',
    'characters trade uniqueness for legibility; distinct tips can share a prefix).',
    'Read-only: resolves the ref and prints the name; never creates a branch.',
    `Defaults: --base ${DEFAULT_BASE}.`,
    '',
  ].join('\n');
}
