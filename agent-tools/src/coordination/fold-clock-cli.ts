import { err, isErr, ok, type Result } from '@oaknational/result';

import { readExecutor } from '../merge-bot/merge-read-env.js';
import { parsePrTarget, type PrTarget } from '../pr-watch/gh.js';
import { computeFoldClock, type FoldClock, type FoldClockReading } from './fold-clock.js';
import { formatFoldClock } from './fold-clock-format.js';
import { isCommitSha, readFoldClockReading } from './fold-clock-gh.js';

/**
 * `agent-tools coordination fold-clock`: the fold's clock as one line for the
 * review-cost ledger row (the retrospective of 2026-10-10, proposal 2). Reads
 * the GitHub API on the session's own gh login through the keyring-pinned
 * read executor, computes the intervals, prints them; never writes.
 */

const FOLD_CLOCK_ACTION = 'fold-clock';

/** What the reader needs; the CLI composes the real executor at this one edge. */
export interface FoldClockReadInput {
  readonly target: PrTarget;
  readonly successorSha?: string;
  readonly ghPath?: string;
}

export type FoldClockReader = (input: FoldClockReadInput) => Result<FoldClockReading, Error>;

export interface FoldClockCliInput {
  /** The arguments after the `fold-clock` action. */
  readonly args: readonly string[];
  readonly stdout?: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr?: Pick<NodeJS.WriteStream, 'write'>;
  /** Reading seam (defaults to the real gh reads on the pinned read env). */
  readonly readReading?: FoldClockReader;
}

interface MutableFoldClockArgs {
  pr?: string;
  repo?: string;
  successor?: string;
  ghPath?: string;
  json: boolean;
  help: boolean;
  positionals: string[];
}

type ParsedFoldClockArgs =
  | { readonly help: true }
  | { readonly help: false; readonly read: FoldClockReadInput; readonly json: boolean };

const FLAG_HANDLERS: Readonly<Record<string, (state: MutableFoldClockArgs) => void>> = {
  '--help': (state) => {
    state.help = true;
  },
  '-h': (state) => {
    state.help = true;
  },
  '--json': (state) => {
    state.json = true;
  },
};

const VALUE_HANDLERS: Readonly<
  Record<string, (state: MutableFoldClockArgs, value: string) => void>
> = {
  '--pr': (state, value) => {
    state.pr = value;
  },
  '--repo': (state, value) => {
    state.repo = value;
  },
  '--successor': (state, value) => {
    state.successor = value;
  },
  '--gh': (state, value) => {
    state.ghPath = value;
  },
};

function usageError(message: string): Error {
  return new Error(`coordination fold-clock: ${message}\n\n${foldClockUsage()}`);
}

function requireValue(
  args: readonly string[],
  index: number,
  option: string,
): Result<string, Error> {
  const value = args[index];
  if (value === undefined || value.startsWith('-')) {
    return err(usageError(`${option} requires a value`));
  }
  return ok(value);
}

/** Consume one argument into `state`; returns the next index to read, or an error. */
function consumeArg(
  args: readonly string[],
  index: number,
  state: MutableFoldClockArgs,
): Result<number, Error> {
  const arg = args[index] ?? '';
  const flag = FLAG_HANDLERS[arg];
  if (flag !== undefined) {
    flag(state);
    return ok(index + 1);
  }
  const handler = VALUE_HANDLERS[arg];
  if (handler !== undefined) {
    const value = requireValue(args, index + 1, arg);
    if (isErr(value)) {
      return value;
    }
    handler(state, value.value);
    return ok(index + 2);
  }
  if (arg.startsWith('-')) {
    return err(usageError(`unknown option: ${arg}`));
  }
  state.positionals.push(arg);
  return ok(index + 1);
}

/** The target through pr-watch's own grammar (it throws; translated here). */
function targetOf(state: MutableFoldClockArgs): Result<PrTarget, Error> {
  if (state.pr === undefined) {
    return err(usageError('--pr <n> is required'));
  }
  try {
    return ok(parsePrTarget(state.pr, state.repo));
  } catch (cause) {
    return err(usageError(cause instanceof Error ? cause.message : String(cause)));
  }
}

/** The read input, with the optional fields present only when given. */
function readInputOf(state: MutableFoldClockArgs, target: PrTarget): FoldClockReadInput {
  return {
    target,
    ...(state.successor === undefined ? {} : { successorSha: state.successor }),
    ...(state.ghPath === undefined ? {} : { ghPath: state.ghPath }),
  };
}

function finalizeArgs(state: MutableFoldClockArgs): Result<ParsedFoldClockArgs, Error> {
  if (state.help) {
    return ok({ help: true });
  }
  if (state.positionals.length > 0) {
    return err(usageError(`unexpected argument: ${state.positionals[0] ?? ''}`));
  }
  if (state.successor !== undefined && !isCommitSha(state.successor)) {
    return err(
      usageError(`--successor must be a commit sha (7 to 40 hex), got '${state.successor}'`),
    );
  }
  const target = targetOf(state);
  if (isErr(target)) {
    return target;
  }
  return ok({ read: readInputOf(state, target.value), json: state.json, help: false });
}

/** Parse the fold-clock argv. Pure: no IO, no throw. */
function parseFoldClockArgs(args: readonly string[]): Result<ParsedFoldClockArgs, Error> {
  const state: MutableFoldClockArgs = { json: false, help: false, positionals: [] };
  let index = 0;
  while (index < args.length) {
    const step = consumeArg(args, index, state);
    if (isErr(step)) {
      return step;
    }
    index = step.value;
  }
  return finalizeArgs(state);
}

/** The real reader: gh on the keyring-pinned read env (ambient env enters here, once). */
const realReader: FoldClockReader = (input) =>
  readFoldClockReading({ ...input, execFileSync: readExecutor(process.env) });

/** Read, then compute: one Result for the two steps. */
function clockOf(reader: FoldClockReader, read: FoldClockReadInput): Result<FoldClock, Error> {
  const reading = reader(read);
  if (isErr(reading)) {
    return reading;
  }
  return computeFoldClock(reading.value);
}

/** Execute `fold-clock`. Exit 0 on success, 2 on any error; errors leave stdout empty. */
export function runFoldClockCli(input: FoldClockCliInput): number {
  const stdout = input.stdout ?? process.stdout;
  const stderr = input.stderr ?? process.stderr;
  const parsed = parseFoldClockArgs(input.args);
  if (isErr(parsed)) {
    stderr.write(`${parsed.error.message}\n`);
    return 2;
  }
  if (parsed.value.help) {
    stdout.write(foldClockUsage());
    return 0;
  }
  const clock = clockOf(input.readReading ?? realReader, parsed.value.read);
  if (isErr(clock)) {
    stderr.write(`${clock.error.message}\n`);
    return 2;
  }
  const line = parsed.value.json ? JSON.stringify(clock.value) : formatFoldClock(clock.value);
  stdout.write(`${line}\n`);
  return 0;
}

/** The `agent-tools coordination fold-clock` usage text. */
function foldClockUsage(): string {
  return [
    `agent-tools coordination ${FOLD_CLOCK_ACTION} --pr <n> [--repo <owner>/<repo>] [--successor <sha>] [--gh <path>] [--json]`,
    '',
    "Prints the fold's clock from the GitHub API as one line for the review-cost ledger",
    "row: the ready-mark (the last ready_for_review, else the pull request's opening),",
    "checks green (the base branch's REQUIRED contexts on the tip, never every",
    'check-run; each context judged by its latest run, check-runs and commit',
    'statuses alike), each vendor review round (a Bot review request answered by',
    "that Bot's next review; a newer request supersedes an open one), the merge,",
    "and with --successor the successor tip's",
    'first check-run start. Every interval is minutes from the ready-mark to one',
    "decimal. Read-only, on the session's own gh login; --json prints the instants",
    'and intervals as JSON. Exit 0 on success, 2 on any error with stdout empty.',
    '',
  ].join('\n');
}
